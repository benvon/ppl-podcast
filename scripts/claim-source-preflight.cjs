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
const { qaItemCompleteWithID } = require("./production-gates.cjs");
const { claimSourcePreflightErrors, claimSourcePreflightInputHashes } = require("./source-validation-contract.cjs");
const { assessRelevance, citedPdfPageNumber, citationTargetErrors, validateClaimMappings, validationTargetErrors, verifyProgrammaticFallback } = require("./validate-source-links.cjs");
const { requestRateLimiter } = require("./validation-runtime.cjs");

const DEFAULT_MODEL = "gpt-5.6-terra";
const PREFLIGHT_FILE = "claim-source-preflight.yaml";
const ECFR_MAX_IN_FLIGHT_REQUESTS = 5;
const ECFR_MIN_START_INTERVAL_MS = 1_000;

class ClaimSourcePreflightError extends Error {}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readYamlMapping(filePath, label) {
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) throw new ClaimSourcePreflightError(`Missing canonical ${label}.`);
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new ClaimSourcePreflightError(`Invalid YAML in ${label}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ClaimSourcePreflightError(`${label} must be a YAML mapping.`);
  return value;
}

function writeYamlAtomically(filePath, value) {
  const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try { fs.writeFileSync(temporary, YAML.stringify(value), { mode: 0o644 }); fs.renameSync(temporary, filePath); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function parseArgs(argv) {
  const options = { model: DEFAULT_MODEL };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
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

function preflightEvidenceFor(source, fetched) {
  const excerpt = locatorExcerpt(fetched);
  if (typeof fetched?.content_sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(fetched.content_sha256)) {
    throw new ClaimSourcePreflightError(`The independently fetched citation target for ${source.id} has no content hash.`);
  }
  if (typeof fetched?.final_url !== "string" || !fetched.final_url) throw new ClaimSourcePreflightError(`The independently fetched citation target for ${source.id} has no final URL.`);
  return {
    fetched_locator: {
      citation_url: source.url,
      final_url: fetched.final_url,
      content_sha256: fetched.content_sha256,
      extraction_kind: excerpt.kind,
      locator_excerpt_sha256: sha256Text(excerpt.text),
      locator_excerpt_characters: excerpt.text.length,
      citation_target_valid: fetched.valid === true,
    },
    reviewed_excerpt: {
      kind: excerpt.kind,
      text: excerpt.text,
      sha256: sha256Text(excerpt.text),
      characters: excerpt.text.length,
    },
  };
}

function linkedClaimsFor(source, claimsByID) {
  const missing = source.supports_claims.filter((claimID) => !claimsByID.has(claimID));
  if (missing.length) throw new ClaimSourcePreflightError(`Source ${source.id} maps unknown claim IDs: ${missing.join(", ")}.`);
  return source.supports_claims.map((claimID) => claimsByID.get(claimID));
}

function requirePreflightAuthorization(episodePath, episode) {
  if (episode?.source_verification?.claim_source_preflight !== PREFLIGHT_FILE) {
    throw new ClaimSourcePreflightError(`episode.yaml must reference ${PREFLIGHT_FILE} before the claim-source preflight can send source excerpts to OpenAI.`);
  }
  const checklistPath = path.join(episodePath, "qa-checklist.md");
  if (!fs.existsSync(checklistPath) || !fs.lstatSync(checklistPath).isFile()) throw new ClaimSourcePreflightError("qa-checklist.md is required before the claim-source preflight can send source excerpts to OpenAI.");
  if (!qaItemCompleteWithID(fs.readFileSync(checklistPath, "utf8"), "openai-claim-source-preflight-authorization")) {
    throw new ClaimSourcePreflightError("qa-checklist.md must record explicit current-turn authorization before the claim-source preflight can send source excerpts to OpenAI.");
  }
}

async function createClaimSourcePreflight({ episodePath, model = DEFAULT_MODEL, dependencies = {} }) {
  const resolved = path.resolve(episodePath);
  const episode = readYamlMapping(path.join(resolved, "episode.yaml"), "episode.yaml");
  requireCurrentProductionContract(episode, "Claim-source preflight");
  requirePreflightAuthorization(resolved, episode);
  const ledger = readYamlMapping(path.join(resolved, "sources.yaml"), "sources.yaml");
  const inventory = readYamlMapping(path.join(resolved, "claim-inventory.yaml"), "claim-inventory.yaml");
  if (!Array.isArray(ledger.sources) || !Array.isArray(inventory.claims)) throw new ClaimSourcePreflightError("sources.yaml and claim-inventory.yaml must contain their canonical collections.");
  const mapping = validateClaimMappings(ledger, inventory);
  if (!mapping.valid) throw new ClaimSourcePreflightError(`Claim-source preflight cannot start with invalid claim mappings:\n${mapping.errors.join("\n")}`);
  const claimsByID = new Map(inventory.claims.map((claim) => [claim.id, claim]));
  const verify = dependencies.verifyProgrammaticFallback || verifyProgrammaticFallback;
  const assess = dependencies.assessRelevance || assessRelevance;
  const fetchCache = dependencies.fetchCache || new Map();
  const ecfrRateLimiter = dependencies.ecfrRateLimiter || requestRateLimiter({
    maxInFlight: ECFR_MAX_IN_FLIGHT_REQUESTS,
    minStartIntervalMs: ECFR_MIN_START_INTERVAL_MS,
  });
  const results = [];
  try {
    for (const source of ledger.sources) {
      if (!source || typeof source !== "object" || !Array.isArray(source.supports_claims)) throw new ClaimSourcePreflightError("Every source must declare an id, URL, locator, and supports_claims.");
      const targetErrors = [...citationTargetErrors(source), ...validationTargetErrors(source)];
      if (targetErrors.length) throw new ClaimSourcePreflightError(`Source ${source.id} has an invalid citation target: ${targetErrors.join("; ")}`);
      const verification = await verify(source, { includePdfPageText: Boolean(citedPdfPageNumber(source.url)), fetchCache, ecfrRateLimiter });
      if (!verification?.link?.valid || verification.content_attestation?.valid === false) throw new ClaimSourcePreflightError(`Source ${source.id} could not be independently fetched and validated: ${(verification?.link?.errors || []).join("; ") || "unknown validation failure"}`);
      const linkedClaims = linkedClaimsFor(source, claimsByID);
      const evidence = preflightEvidenceFor(source, verification.link);
      const reviewed = await assess({ model, source, claims: linkedClaims, authoredPassages: [], fetched: verification.link });
      if (reviewed?.status !== "assessed" || !reviewed.assessment) throw new ClaimSourcePreflightError(`Source ${source.id} did not receive an LLM relevance assessment.`);
      results.push({ source_id: source.id, locator: source.locator, linked_claim_ids: source.supports_claims, ...evidence, relevance: { status: reviewed.status, ...reviewed.assessment } });
    }
  } finally {
    if (!dependencies.ecfrRateLimiter) ecfrRateLimiter.close();
  }
  const preflight = {
    schema_version: 1,
    validator: "scripts/claim-source-preflight.cjs",
    status: "complete",
    checked_at_utc: new Date().toISOString(),
    llm_requested: true,
    llm_model: model,
    input_sha256: claimSourcePreflightInputHashes(resolved),
    results,
  };
  const errors = claimSourcePreflightErrors({ episodePath: resolved, episode, preflight });
  if (errors.length) throw new ClaimSourcePreflightError(`Claim-source preflight failed:\n${errors.join("\n")}`);
  writeYamlAtomically(path.join(resolved, PREFLIGHT_FILE), preflight);
  return preflight;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const preflight = await createClaimSourcePreflight({ episodePath: options.episode, model: options.model });
  console.log(`Completed independently fetched claim-source preflight for ${preflight.results.length} sources: ${path.join(path.resolve(options.episode), PREFLIGHT_FILE)}`);
}

if (require.main === module) main().catch((error) => { console.error(`Claim-source preflight failed: ${error.message}`); process.exitCode = 1; });

module.exports = { ClaimSourcePreflightError, createClaimSourcePreflight, locatorExcerpt, parseArgs, preflightEvidenceFor, requirePreflightAuthorization };
