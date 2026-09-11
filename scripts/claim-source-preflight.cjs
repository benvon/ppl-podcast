#!/usr/bin/env node
"use strict";

// This deliberately runs before master-script.md exists. It fetches each
// cited target, extracts the exact citation text, and gives that extracted
// text—not a researcher-authored excerpt—to the independent claim reviewer.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { requireCurrentProductionContract } = require("./production-state-contract.cjs");
const { consumeChecklistAuthorization } = require("./openai-review-authorization.cjs");
const { claimSourcePreflightErrors, claimSourcePreflightInputHashes } = require("./source-validation-contract.cjs");
const { ValidationCancelledError, assessRelevance, citedPdfPageNumber, citationTargetErrors, completeValidationReport, markValidationInProgress, relevanceExcerpt, runOwnedValidation, validateClaimMappings, validationTargetErrors, verifyProgrammaticFallback } = require("./validate-source-links.cjs");
const { requestRateLimiter } = require("./validation-runtime.cjs");

const DEFAULT_MODEL = "gpt-5.6-terra";
const PREFLIGHT_FILE = "claim-source-preflight.yaml";
const ECFR_MAX_IN_FLIGHT_REQUESTS = 5;
const ECFR_MIN_START_INTERVAL_MS = 1_000;

class ClaimSourcePreflightError extends Error {
  constructor(message, preflight = null) {
    super(message);
    this.preflight = preflight;
  }
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseYamlMapping(text, label) {
  const document = YAML.parseDocument(text);
  if (document.errors.length) throw new ClaimSourcePreflightError(`Invalid YAML in ${label}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ClaimSourcePreflightError(`${label} must be a YAML mapping.`);
  return value;
}

function readYamlMapping(filePath, label) {
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) throw new ClaimSourcePreflightError(`Missing canonical ${label}.`);
  return parseYamlMapping(fs.readFileSync(filePath, "utf8"), label);
}

function writeYamlAtomically(filePath, value) {
  const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try { fs.writeFileSync(temporary, YAML.stringify(value), { mode: 0o644 }); fs.renameSync(temporary, filePath); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function parseArgs(argv) {
  const options = { model: DEFAULT_MODEL, recoverStaleLock: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--recover-stale-lock") { options.recoverStaleLock = true; continue; }
    if (token !== "--episode" && token !== "--require-llm" && token !== "--model") throw new ClaimSourcePreflightError(`Unexpected argument: ${token}`);
    if (token === "--require-llm") { options.requireLlm = true; continue; }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new ClaimSourcePreflightError(`Missing value for ${token}.`);
    options[token.slice(2)] = value;
    index += 1;
  }
  if (!options.episode) throw new ClaimSourcePreflightError("--episode is required.");
  if (!options.requireLlm) throw new ClaimSourcePreflightError("--require-llm is required because a claim-source preflight must perform the independent LLM review.");
  if (!/^[a-z0-9][a-z0-9.-]*$/.test(options.model)) throw new ClaimSourcePreflightError("--model contains unsupported characters.");
  return options;
}

function locatorExcerpt(fetched) {
  if (typeof fetched?.section_text === "string" && fetched.section_text.trim()) return { kind: "ecfr_section", text: fetched.section_text.trim() };
  if (typeof fetched?.pdf_page_text === "string" && fetched.pdf_page_text.trim()) return { kind: "pdf_page", text: fetched.pdf_page_text.trim() };
  if (typeof fetched?.excerpt === "string" && fetched.excerpt.trim()) return { kind: "html_fragment", text: fetched.excerpt.trim() };
  throw new ClaimSourcePreflightError("The independently fetched citation target has no extractable text for the recorded locator.");
}

function preflightEvidenceFor(source, verification) {
  const fetched = verification?.link || verification;
  const locator = locatorExcerpt(fetched);
  const excerpt = relevanceExcerpt(fetched);
  if (!excerpt) throw new ClaimSourcePreflightError(`The independently fetched citation target for ${source.id} has no safely bounded text for the LLM review.`);
  if (typeof fetched?.content_sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(fetched.content_sha256)) {
    throw new ClaimSourcePreflightError(`The independently fetched citation target for ${source.id} has no content hash.`);
  }
  if (typeof fetched?.final_url !== "string" || !fetched.final_url) throw new ClaimSourcePreflightError(`The independently fetched citation target for ${source.id} has no final URL.`);
  let programmaticFallback = null;
  if (fetched.resolved_via === "attested_programmatic_fallback") {
    const configured = source.programmatic_attestation;
    const attestation = verification?.content_attestation;
    if (!source.programmatic_url || !configured || typeof configured !== "object" || attestation?.valid !== true) {
      throw new ClaimSourcePreflightError(`The programmatic fallback for ${source.id} lacks a verified FAA attestation.`);
    }
    programmaticFallback = {
      programmatic_url: source.programmatic_url,
      attestation_url: configured.url,
      link_text: configured.link_text,
      sha256: configured.sha256,
      content_attestation: {
        valid: attestation.valid,
        status: attestation.status,
        attestation_url: attestation.attestation_url,
        expected_link_text: attestation.expected_link_text,
        expected_sha256: attestation.expected_sha256,
        programmatic_sha256: attestation.programmatic_sha256,
      },
    };
  }
  return {
    fetched_locator: {
      citation_url: source.url,
      final_url: fetched.final_url,
      validation_url: fetched.validation_url || null,
      resolved_via: fetched.resolved_via || null,
      content_sha256: fetched.content_sha256,
      extraction_kind: locator.kind,
      locator_excerpt_sha256: sha256Text(excerpt),
      locator_excerpt_characters: excerpt.length,
      citation_target_valid: fetched.valid === true,
      programmatic_fallback: programmaticFallback,
    },
    reviewed_excerpt: {
      kind: locator.kind,
      text: excerpt,
      sha256: sha256Text(excerpt),
      characters: excerpt.length,
    },
  };
}

function linkedClaimsFor(source, claimsByID) {
  const missing = source.supports_claims.filter((claimID) => !claimsByID.has(claimID));
  if (missing.length) throw new ClaimSourcePreflightError(`Source ${source.id} maps unknown claim IDs: ${missing.join(", ")}.`);
  return source.supports_claims.map((claimID) => claimsByID.get(claimID));
}

function reviewedClaimSnapshots(claims) {
  return claims.map((claim) => ({
    id: claim.id,
    statement: claim.claim ?? claim.statement,
    type: claim.claim_type ?? claim.type ?? null,
  }));
}

function consumePreflightAuthorization(episodePath, episode, runID) {
  if (episode?.source_verification?.claim_source_preflight !== PREFLIGHT_FILE) {
    throw new ClaimSourcePreflightError(`episode.yaml must reference ${PREFLIGHT_FILE} before the claim-source preflight can send source excerpts to OpenAI.`);
  }
  try {
    return consumeChecklistAuthorization({
      episodePath,
      qaID: "openai-claim-source-preflight-authorization",
      operation: "the claim-source preflight",
      runID,
    });
  } catch (error) {
    throw new ClaimSourcePreflightError(error.message);
  }
}

function preflightInputSnapshot(episodePath) {
  const sourcesPath = path.join(episodePath, "sources.yaml");
  const claimsPath = path.join(episodePath, "claim-inventory.yaml");
  for (const filePath of [sourcesPath, claimsPath]) {
    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) throw new ClaimSourcePreflightError(`Missing canonical ${path.basename(filePath)}.`);
  }
  const sourcesBytes = fs.readFileSync(sourcesPath);
  const claimsBytes = fs.readFileSync(claimsPath);
  return {
    ledger: parseYamlMapping(sourcesBytes.toString("utf8"), "sources.yaml"),
    inventory: parseYamlMapping(claimsBytes.toString("utf8"), "claim-inventory.yaml"),
    input_sha256: {
      sources: crypto.createHash("sha256").update(sourcesBytes).digest("hex"),
      claims: crypto.createHash("sha256").update(claimsBytes).digest("hex"),
    },
  };
}

function sameInputHashes(left, right) {
  return left?.sources === right?.sources && left?.claims === right?.claims;
}

function updatePreflightState(episodePath, status) {
  const episodePathname = path.join(episodePath, "episode.yaml");
  const episode = readYamlMapping(episodePathname, "episode.yaml");
  requireCurrentProductionContract(episode, "Claim-source preflight");
  episode.source_verification = { ...(episode.source_verification || {}), claim_source_preflight: PREFLIGHT_FILE, claim_source_preflight_status: status };
  writeYamlAtomically(episodePathname, episode);
}

function throwIfCancelled(signal, isCancelled) {
  if (signal?.aborted || isCancelled()) throw new ValidationCancelledError("Claim-source preflight was cancelled.");
}

function failedPreflightReport({ error, outcome, defaultReport }) {
  if (!error?.preflight) return { ...defaultReport, status: outcome };
  return { ...error.preflight, status: outcome };
}

async function createClaimSourcePreflight({ episodePath, model = DEFAULT_MODEL, dependencies = {}, signal, isCancelled = () => false, recoverStaleLock = false }) {
  const resolved = path.resolve(episodePath);
  const episode = readYamlMapping(path.join(resolved, "episode.yaml"), "episode.yaml");
  requireCurrentProductionContract(episode, "Claim-source preflight");
  const { ledger, inventory, input_sha256: inputSha256 } = preflightInputSnapshot(resolved);
  if (!Array.isArray(ledger.sources) || !Array.isArray(inventory.claims)) throw new ClaimSourcePreflightError("sources.yaml and claim-inventory.yaml must contain their canonical collections.");
  if (ledger.sources.length === 0 || inventory.claims.length === 0) {
    throw new ClaimSourcePreflightError("Claim-source preflight requires at least one source and at least one claim before it can make outbound requests.");
  }
  const mapping = validateClaimMappings(ledger, inventory);
  if (!mapping.valid) throw new ClaimSourcePreflightError(`Claim-source preflight cannot start with invalid claim mappings:\n${mapping.errors.join("\n")}`);
  const targetErrors = ledger.sources.flatMap((source) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) return ["source ledger contains a non-mapping source"];
    return [...citationTargetErrors(source), ...validationTargetErrors(source)].map((error) => `Source ${source.id || "<unknown>"} has an invalid citation target: ${error}`);
  });
  if (targetErrors.length) throw new ClaimSourcePreflightError(`Claim-source preflight cannot start with invalid citation targets:\n${targetErrors.join("\n")}`);
  const preflightPath = path.join(resolved, PREFLIGHT_FILE);
  const validationRun = markValidationInProgress(preflightPath, inputSha256, { recoverStaleLock, validator: "scripts/claim-source-preflight.cjs" });
  const claimsByID = new Map(inventory.claims.map((claim) => [claim.id, claim]));
  const verify = dependencies.verifyProgrammaticFallback || verifyProgrammaticFallback;
  const assess = dependencies.assessRelevance || assessRelevance;
  const fetchCache = dependencies.fetchCache || new Map();
  const ecfrRateLimiter = dependencies.ecfrRateLimiter || requestRateLimiter({
    maxInFlight: ECFR_MAX_IN_FLIGHT_REQUESTS,
    minStartIntervalMs: ECFR_MIN_START_INTERVAL_MS,
  });
  let authorization = null;
  const results = [];
  const failedPreflight = () => ({
    schema_version: 1,
    validator: "scripts/claim-source-preflight.cjs",
    status: "failed",
    authorization,
    checked_at_utc: new Date().toISOString(),
    llm_requested: true,
    llm_model: model,
    input_sha256: inputSha256,
    results,
  });
  return runOwnedValidation(preflightPath, validationRun, async () => {
    // Authorization is deliberately consumed inside the owned lifecycle. If
    // recovery or a missing authorization stops this attempt, the finalizer
    // writes a blocking record before releasing the new lock.
    authorization = consumePreflightAuthorization(resolved, episode, validationRun.run_id);
    updatePreflightState(resolved, "in_progress");
    try {
      try {
        for (const source of ledger.sources) {
          throwIfCancelled(signal, isCancelled);
          if (!source || typeof source !== "object" || !Array.isArray(source.supports_claims)) throw new ClaimSourcePreflightError("Every source must declare an id, URL, locator, and supports_claims.");
          const verification = await verify(source, { includePdfPageText: Boolean(citedPdfPageNumber(source.url)), fetchCache, ecfrRateLimiter, signal });
          throwIfCancelled(signal, isCancelled);
          if (!verification?.link?.valid || verification.content_attestation?.valid === false) throw new ClaimSourcePreflightError(`Source ${source.id} could not be independently fetched and validated: ${(verification?.link?.errors || []).join("; ") || "unknown validation failure"}`);
          const linkedClaims = linkedClaimsFor(source, claimsByID);
          const evidence = preflightEvidenceFor(source, verification);
          const reviewed = await assess({ model, source, claims: linkedClaims, authoredPassages: [], fetched: verification.link, signal, assessmentScope: "claim_source_preflight" });
          throwIfCancelled(signal, isCancelled);
          if (reviewed?.status !== "assessed" || !reviewed.assessment) throw new ClaimSourcePreflightError(`Source ${source.id} did not receive an LLM relevance assessment.`);
          results.push({ source_id: source.id, locator: source.locator, linked_claim_ids: source.supports_claims, reviewed_claims: reviewedClaimSnapshots(linkedClaims), ...evidence, relevance: { status: reviewed.status, ...reviewed.assessment } });
        }
      } finally {
        if (!dependencies.ecfrRateLimiter) ecfrRateLimiter.close();
      }
      if (!sameInputHashes(inputSha256, claimSourcePreflightInputHashes(resolved))) {
        throw new ClaimSourcePreflightError("sources.yaml or claim-inventory.yaml changed while the claim-source preflight was running; the result was not promoted.");
      }
      const preflight = { ...failedPreflight(), status: "complete" };
      const errors = claimSourcePreflightErrors({ episodePath: resolved, episode, preflight });
      if (errors.length) throw new ClaimSourcePreflightError(`Claim-source preflight failed:\n${errors.join("\n")}`, preflight);
      completeValidationReport(preflightPath, preflight, validationRun, {
        validator: "scripts/claim-source-preflight.cjs",
        beforeRelease: () => updatePreflightState(resolved, "complete"),
      });
      return preflight;
    } catch (error) {
      if (error instanceof ValidationCancelledError) {
        error.preflight = failedPreflight();
        throw error;
      }
      if (error instanceof ClaimSourcePreflightError && error.preflight) throw error;
      throw new ClaimSourcePreflightError(error.message, failedPreflight());
    }
  }, {
    validator: "scripts/claim-source-preflight.cjs",
    isCancelled,
    failureReport: failedPreflightReport,
    onTerminal: (outcome) => updatePreflightState(resolved, outcome),
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const cancellation = new AbortController();
  let cancelled = false;
  const cancel = () => { cancelled = true; cancellation.abort(); };
  process.once("SIGINT", cancel); process.once("SIGTERM", cancel);
  try {
    const preflight = await createClaimSourcePreflight({ episodePath: options.episode, model: options.model, signal: cancellation.signal, isCancelled: () => cancelled, recoverStaleLock: options.recoverStaleLock });
    console.log(`Completed independently fetched claim-source preflight for ${preflight.results.length} sources: ${path.join(path.resolve(options.episode), PREFLIGHT_FILE)}`);
  } catch (error) {
    if (cancelled || error instanceof ValidationCancelledError) process.exitCode = 130;
    throw error;
  } finally {
    process.removeListener("SIGINT", cancel); process.removeListener("SIGTERM", cancel);
  }
}

if (require.main === module) main().catch((error) => { console.error(`Claim-source preflight failed: ${error.message}`); process.exitCode = error instanceof ValidationCancelledError ? 130 : 1; });

module.exports = { ClaimSourcePreflightError, consumePreflightAuthorization, createClaimSourcePreflight, failedPreflightReport, locatorExcerpt, parseArgs, preflightEvidenceFor, preflightInputSnapshot, reviewedClaimSnapshots, sameInputHashes, throwIfCancelled, updatePreflightState };
