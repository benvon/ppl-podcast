"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { exactEcfrTarget } = require("./ecfr-section.cjs");
const { utcRfc3339Timestamp } = require("./production-state-contract.cjs");
const { validationFailurePath } = require("./validation-records.cjs");

function sourceValidationInputHashes(episodePath) {
  const digest = (file) => fs.existsSync(file) ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : null;
  return {
    sources: digest(path.join(episodePath, "sources.yaml")),
    claims: digest(path.join(episodePath, "claim-inventory.yaml")),
    master_script: digest(path.join(episodePath, "master-script.md")),
    show_notes: digest(path.join(episodePath, "show-notes.md")),
    show_notes_manifest: digest(path.join(episodePath, "show-notes-manifest.yaml")),
  };
}

function claimSourcePreflightInputHashes(episodePath) {
  const digest = (file) => fs.existsSync(file) ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : null;
  return {
    sources: digest(path.join(episodePath, "sources.yaml")),
    claims: digest(path.join(episodePath, "claim-inventory.yaml")),
  };
}

function sourceTagRecords(markdown) {
  const records = [];
  let section = null;
  let lastParagraph = null;
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^##\s+(?:\[\d{2}:\d{2}\]\s+)?(.+?)\s*$/);
    if (heading) { section = heading[1]; lastParagraph = null; continue; }
    if (/^\*\*[A-Z ]+:\*\*$/.test(line.trim())) { lastParagraph = null; continue; }
    const tag = line.trim().match(/^\[Source:\s*sources\.yaml#([^\]]+)\]$/);
    if (tag) {
      records.push({ source_id: tag[1], section, line: index + 1, passage: lastParagraph });
      continue;
    }
    // Production-status lines are ignored only for legacy scripts. New
    // packages record mutable state exclusively in episode.yaml.
    if (/^\[(?:Source|Claim type):/.test(line.trim()) || /^\*\*(?:Version|Target runtime|Speakers|Production status):/.test(line.trim()) || !line.trim()) continue;
    lastParagraph = line.trim();
  }
  return records;
}

function retrievalReviewUntaggedPassageErrors(markdown) {
  const errors = [];
  let section = null;
  let speaker = null;
  let pendingPassage = null;
  const flush = () => {
    if (pendingPassage) errors.push(`Retrieval review spoken paragraph at line ${pendingPassage.line} has no source tag`);
    pendingPassage = null;
  };
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^##\s+(?:\[\d{2}:\d{2}\]\s+)?(.+?)\s*$/);
    if (heading) { flush(); section = heading[1]; speaker = null; continue; }
    const speakerLabel = line.trim().match(/^\*\*([A-Z ]+):\*\*$/);
    if (speakerLabel) { flush(); speaker = speakerLabel[1].trim(); continue; }
    if (/^\[Source:\s*sources\.yaml#[^\]]+\]$/.test(line.trim())) { pendingPassage = null; continue; }
    // An explicitly labeled lesson method or inference is not an external factual
    // assertion. It does not need a fabricated citation in the Retrieval review.
    const claimType = line.trim().match(/^\[Claim type:\s*(teaching synthesis|teaching inference)\]$/i);
    if (claimType && section === "Retrieval review") { pendingPassage = null; continue; }
    // Production-status lines are ignored only for legacy scripts. New
    // packages record mutable state exclusively in episode.yaml.
    if (/^\[(?:Source|Claim type):/.test(line.trim()) || /^\*\*(?:Version|Target runtime|Speakers|Production status):/.test(line.trim()) || !line.trim()) continue;
    if (section === "Retrieval review" && (speaker === "INSTRUCTOR" || speaker === "LEARNER")) {
      flush();
      pendingPassage = { line: index + 1 };
    }
  }
  flush();
  return errors;
}

function validateMasterScriptSourceMappings(episodePath, ledger, claimInventory) {
  const errors = [];
  const scriptPath = path.join(episodePath, "master-script.md");
  if (!fs.existsSync(scriptPath)) return { valid: true, status: "not_configured", errors: [], source_tag_count: 0, claim_coverage_count: 0, passages_by_source: {} };
  const script = fs.readFileSync(scriptPath, "utf8");
  const records = sourceTagRecords(script);
  if (!records.length) return { valid: false, status: "configured", errors: ["master-script.md contains no source tags"], source_tag_count: 0, claim_coverage_count: 0, passages_by_source: {} };
  const sourcesById = new Map(ledger.sources.map((source) => [source.id, source]));
  const tagsBySection = new Map();
  const passagesBySource = new Map();
  for (const record of records) {
    if (!sourcesById.has(record.source_id)) errors.push(`master-script.md line ${record.line} cites unknown source ${record.source_id}`);
    if (!record.section) errors.push(`master-script.md line ${record.line} cites source ${record.source_id} outside a lesson section`);
    if (!record.passage) errors.push(`master-script.md line ${record.line} cites source ${record.source_id} without a preceding spoken paragraph`);
    if (!tagsBySection.has(record.section)) tagsBySection.set(record.section, new Set());
    tagsBySection.get(record.section).add(record.source_id);
    if (!passagesBySource.has(record.source_id)) passagesBySource.set(record.source_id, new Set());
    if (record.passage) passagesBySource.get(record.source_id).add(record.passage);
  }
  errors.push(...retrievalReviewUntaggedPassageErrors(script));
  let claimCoverageCount = 0;
  for (const claim of claimInventory.claims) {
    if (!Array.isArray(claim.script_sections) || !claim.script_sections.length) {
      errors.push(`claim ${claim.id} must declare at least one script section`);
      continue;
    }
    const uncoveredSections = claim.script_sections.filter((section) => !claim.sources?.some((sourceId) => tagsBySection.get(section)?.has(sourceId)));
    if (uncoveredSections.length) errors.push(`claim ${claim.id} has no declared source tag in script section${uncoveredSections.length === 1 ? "" : "s"}: ${uncoveredSections.join(", ")}`);
    else claimCoverageCount += 1;
  }
  return {
    valid: errors.length === 0,
    status: "configured",
    errors,
    source_tag_count: records.length,
    claim_coverage_count: claimCoverageCount,
    passages_by_source: Object.fromEntries([...passagesBySource].map(([sourceId, passages]) => [sourceId, [...passages]])),
  };
}

function sameStringSet(actual, expected) {
  return Array.isArray(actual) && actual.length === new Set(actual).size && actual.length === expected.length && actual.every((value) => expected.includes(value));
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function validSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value) ? value.toLowerCase() : null;
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function canonicalHttpsAuthority(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch (_) {
    return null;
  }
}

function sameUrlIgnoringFragment(left, right) {
  try {
    const normalized = (url) => {
      const parsed = new URL(url);
      parsed.hash = "";
      return parsed.toString();
    };
    return normalized(left) === normalized(right);
  } catch (_) {
    return false;
  }
}

function fallbackRedirectChainValid({ requestedUrl, redirects, finalUrl }) {
  const authority = canonicalHttpsAuthority(requestedUrl);
  if (!authority || !nonEmptyString(finalUrl) || !Array.isArray(redirects)) return false;
  const chain = [requestedUrl, ...redirects];
  if (!chain.every((url) => canonicalHttpsAuthority(url) === authority)) return false;
  return redirects.length === 0
    ? sameUrlIgnoringFragment(finalUrl, requestedUrl)
    : sameUrlIgnoringFragment(redirects.at(-1), finalUrl);
}

function directValidationUrl(source) {
  if (canonicalHttpsAuthority(source?.url) === "ecfr.gov") {
    try { return exactEcfrTarget(source).validation_url; }
    catch (_) { return null; }
  }
  return source?.validation_url || source?.url || null;
}

function claimAssessmentsFor(result) {
  return Array.isArray(result?.relevance?.claim_assessments) ? result.relevance.claim_assessments : [];
}

function uniqueNonEmptyIdentifiers(entries) {
  const identifiers = entries.map((entry) => entry?.id);
  return identifiers.every((identifier) => typeof identifier === "string" && identifier.trim().length > 0)
    && identifiers.length === new Set(identifiers).size;
}

// This is deliberately shared by the renderer and release validator. A
// contract-v2 episode must not be able to pass one lifecycle gate with a
// weaker definition of preflight evidence than another.
function claimSourcePreflightErrors({ episodePath, episode, preflight }) {
  if (episode?.production_contract_version !== 2) return [];
  const errors = [];
  const expect = (condition, message) => { if (!condition) errors.push(message); };
  expect(episode.source_verification?.claim_source_preflight === "claim-source-preflight.yaml", "episode.yaml must reference claim-source-preflight.yaml.");
  expect(preflight?.schema_version === 1, "claim-source-preflight.yaml must use schema_version 1.");
  expect(preflight?.status === "complete", "claim-source-preflight.yaml must record a complete preflight.");
  expect(utcRfc3339Timestamp(preflight?.checked_at_utc), "claim-source-preflight.yaml must record a valid UTC RFC 3339 review timestamp.");
  expect(preflight?.validator === "scripts/claim-source-preflight.cjs", "claim-source-preflight.yaml must be produced by scripts/claim-source-preflight.cjs.");
  expect(typeof preflight?.run_id === "string" && /^[0-9a-f-]{36}$/i.test(preflight.run_id), "claim-source-preflight.yaml must record its preflight run ID.");
  expect(utcRfc3339Timestamp(preflight?.authorization?.consumed_at_utc) && preflight.authorization?.qa_id === "openai-claim-source-preflight-authorization" && typeof preflight.authorization?.run_id === "string" && /^[0-9a-f-]{36}$/i.test(preflight.authorization.run_id) && preflight.authorization.run_id === preflight.run_id && Date.parse(preflight.authorization.consumed_at_utc) <= Date.parse(preflight.checked_at_utc), "claim-source-preflight.yaml must record the consumed per-run authorization.");
  expect(preflight?.llm_requested === true && typeof preflight?.llm_model === "string" && preflight.llm_model.length > 0, "claim-source-preflight.yaml must record the LLM review model.");
  const inputHashes = claimSourcePreflightInputHashes(episodePath);
  expect(Object.entries(inputHashes).every(([name, digest]) => preflight?.input_sha256?.[name] === digest), "claim-source-preflight.yaml must be bound to the current sources.yaml and claim-inventory.yaml bytes.");

  let ledger; let inventory;
  try {
    ledger = YAML.parse(fs.readFileSync(path.join(episodePath, "sources.yaml"), "utf8"));
    inventory = YAML.parse(fs.readFileSync(path.join(episodePath, "claim-inventory.yaml"), "utf8"));
  } catch (error) {
    errors.push(`claim-source-preflight.yaml could not read current source inputs: ${error.message}`);
    return errors;
  }
  if (!Array.isArray(ledger?.sources) || !Array.isArray(inventory?.claims)) {
    errors.push("claim-source-preflight.yaml requires current sources.yaml and claim-inventory.yaml collections.");
    return errors;
  }
  const sources = ledger.sources;
  expect(sources.length > 0, "claim-source-preflight.yaml requires at least one source.");
  expect(inventory.claims.length > 0, "claim-source-preflight.yaml requires at least one claim.");
  expect(uniqueNonEmptyIdentifiers(sources), "claim-source-preflight.yaml requires unique, non-empty source IDs.");
  expect(uniqueNonEmptyIdentifiers(inventory.claims), "claim-source-preflight.yaml requires unique, non-empty claim IDs.");
  for (const source of sources) expect(Array.isArray(source?.supports_claims) && source.supports_claims.length > 0 && uniqueNonEmptyIdentifiers(source.supports_claims.map((id) => ({ id }))), `claim-source-preflight.yaml requires source ${source?.id || "<unknown>"} to declare at least one unique, non-empty claim ID.`);
  for (const claim of inventory.claims) expect(Array.isArray(claim?.sources) && uniqueNonEmptyIdentifiers(claim.sources.map((id) => ({ id }))), `claim-source-preflight.yaml requires claim ${claim?.id || "<unknown>"} to declare unique, non-empty source IDs.`);
  const claimsByID = new Map(inventory.claims.map((claim) => [claim.id, claim]));
  for (const claim of inventory.claims) {
    const listedSources = Array.isArray(claim?.sources) ? claim.sources : [];
    expect(listedSources.length > 0, `claim-source-preflight.yaml requires at least one source for claim ${claim.id}.`);
    const supportingSources = sources
      .filter((source) => Array.isArray(source?.supports_claims) && source.supports_claims.includes(claim.id))
      .map((source) => source.id);
    expect(sameStringSet(listedSources, supportingSources), `claim-source-preflight.yaml requires a reciprocal source mapping for claim ${claim.id}.`);
  }
  const results = Array.isArray(preflight?.results) ? preflight.results : [];
  for (const claim of inventory.claims) {
    const assessed = results.some((result) => claimAssessmentsFor(result).some((assessment) => assessment?.claim_id === claim.id && assessment?.verdict === "supports"));
    expect(assessed, `claim-source-preflight.yaml must record a supporting assessment for claim ${claim.id}.`);
  }
  expect(sameStringSet(results.map((result) => result?.source_id), sources.map((source) => source.id)), "claim-source-preflight.yaml must cover every current source exactly once.");
  for (const source of sources) {
    const result = results.find((candidate) => candidate?.source_id === source.id);
    if (!result) continue;
    expect(nonEmptyString(source.locator) && nonEmptyString(result.locator) && result.locator === source.locator, `claim-source-preflight.yaml must preserve a non-empty exact locator for source ${source.id}.`);
    expect(sameStringSet(result.linked_claim_ids, source.supports_claims || []), `claim-source-preflight.yaml must preserve the current claim mapping for source ${source.id}.`);
    const expectedClaims = Array.isArray(source.supports_claims) ? source.supports_claims : [];
    const reviewedClaims = Array.isArray(result.reviewed_claims) ? result.reviewed_claims : [];
    const claimSnapshotsMatch = sameStringSet(reviewedClaims.map((claim) => claim?.id), expectedClaims)
      && reviewedClaims.every((snapshot) => {
        const claim = claimsByID.get(snapshot?.id);
        return claim
          && typeof snapshot.statement === "string" && snapshot.statement === (claim.claim ?? claim.statement)
          && (snapshot.type ?? null) === (claim.claim_type ?? claim.type ?? null);
      });
    expect(claimSnapshotsMatch, `claim-source-preflight.yaml must retain the exact reviewed claim text and type for source ${source.id}.`);
    const excerpt = result.reviewed_excerpt;
    const excerptRecorded = typeof excerpt?.kind === "string" && excerpt.kind.length > 0
      && typeof excerpt.text === "string" && excerpt.text.length > 0
      && validSha256(excerpt.sha256) === sha256Text(excerpt.text)
      && Number.isInteger(excerpt.characters) && excerpt.characters === excerpt.text.length;
    expect(excerptRecorded, `claim-source-preflight.yaml must retain a hash-verified copy of the reviewed excerpt for source ${source.id}.`);
    const fetched = result.fetched_locator;
    const normalValidationUrl = directValidationUrl(source);
    const fetchedEvidence = nonEmptyString(fetched?.citation_url) && fetched.citation_url === source.url
      && nonEmptyString(fetched?.validation_url)
      && nonEmptyString(fetched?.final_url)
      && Array.isArray(fetched?.redirects)
      && validSha256(fetched?.content_sha256)
      && typeof fetched?.extraction_kind === "string" && fetched.extraction_kind.length > 0
      && validSha256(fetched?.locator_excerpt_sha256) === validSha256(excerpt?.sha256)
      && Number.isInteger(fetched?.locator_excerpt_characters) && fetched.locator_excerpt_characters === excerpt?.characters
      && fetched?.citation_target_valid === true;
    expect(fetchedEvidence, `claim-source-preflight.yaml must bind the reviewed excerpt to independently fetched locator evidence for source ${source.id}.`);
    // The validation URL and final URL are the artifact identities. Do not
    // trust a descriptive route marker to decide whether fallback attestation
    // is required: a corrupted report could otherwise remove that marker and
    // retain a programmatic response without its FAA-page attestation.
    const fallbackSelected = nonEmptyString(source.programmatic_url)
      && source.programmatic_url !== source.url
      && fetched?.validation_url === source.programmatic_url;
    if (fallbackSelected) {
      const configured = source.programmatic_attestation;
      const fallback = fetched.programmatic_fallback;
      const fallbackEvidence = source.programmatic_url
        && configured && typeof configured === "object"
        && fetched.resolved_via === "attested_programmatic_fallback"
        && fetched.validation_url === source.programmatic_url
        && fallbackRedirectChainValid({
          requestedUrl: source.programmatic_url,
          redirects: fetched.redirects,
          finalUrl: fetched.final_url,
        })
        && fetched.content_sha256 === configured.sha256
        && fallback?.programmatic_url === source.programmatic_url
        && fallback?.attestation_url === configured.url
        && fallback?.link_text === configured.link_text
        && fallback?.sha256 === configured.sha256
        && fallback?.content_attestation?.valid === true
        && fallback.content_attestation.status === "attested"
        && fallback.content_attestation.attestation_url === configured.url
        && fallback.content_attestation.expected_link_text === configured.link_text
        && fallback.content_attestation.expected_sha256 === configured.sha256
        && fallback.content_attestation.programmatic_sha256 === configured.sha256;
      expect(fallbackEvidence, `claim-source-preflight.yaml must bind attested programmatic fallback evidence to source ${source.id}.`);
    } else {
      const directEvidence = fetched?.validation_url === normalValidationUrl
        && fetched?.resolved_via !== "attested_programmatic_fallback"
        && fetched?.programmatic_fallback == null
        && fallbackRedirectChainValid({
          requestedUrl: normalValidationUrl,
          redirects: fetched?.redirects,
          finalUrl: fetched?.final_url,
        });
      expect(directEvidence, `claim-source-preflight.yaml must bind source ${source.id} to its exact direct or attested-fallback validation target.`);
    }
    expect(expectedClaims.every((claimID) => claimsByID.get(claimID)?.sources?.includes(source.id)), `claim-source-preflight.yaml cannot attest a non-reciprocal claim mapping for source ${source.id}.`);
    const assessments = claimAssessmentsFor(result);
    const assessmentIDs = assessments.map((assessment) => assessment?.claim_id);
    const locatorSupports = result.relevance?.locator_assessment?.verdict === "supports"
      && typeof result.relevance.locator_assessment.rationale === "string" && result.relevance.locator_assessment.rationale.length > 0;
    expect(locatorSupports, `claim-source-preflight.yaml must record a supporting LLM locator assessment for source ${source.id}.`);
    const allSupporting = result.relevance?.status === "assessed"
      && sameStringSet(assessmentIDs, expectedClaims)
      && assessments.every((assessment) => assessment?.verdict === "supports" && typeof assessment.rationale === "string" && assessment.rationale.length > 0);
    expect(allSupporting, `claim-source-preflight.yaml must record supporting LLM assessments for every claim mapped to source ${source.id}.`);
  }
  return errors;
}

function currentClaimSourcePreflightErrors({ episodePath, episode }) {
  const preflightPath = path.join(episodePath, "claim-source-preflight.yaml");
  const errors = [];
  if (episode?.source_verification?.claim_source_preflight_status !== "complete") errors.push("episode.yaml must record a complete claim-source preflight before formal source relevance review.");
  if (fs.existsSync(`${preflightPath}.in-progress`) || fs.existsSync(`${preflightPath}.in-progress.recovering`)) errors.push("Claim-source preflight is in progress, recovering, or was interrupted.");
  if (fs.existsSync(validationFailurePath(preflightPath))) errors.push("The most recent claim-source preflight failed and must be rerun successfully.");
  if (!fs.existsSync(preflightPath) || !fs.lstatSync(preflightPath).isFile()) return [...errors, "Missing required claim-source-preflight.yaml."];
  let preflight;
  try { preflight = YAML.parse(fs.readFileSync(preflightPath, "utf8")); }
  catch (error) { return [...errors, `Could not read claim-source-preflight.yaml: ${error.message}`]; }
  return [...errors, ...claimSourcePreflightErrors({ episodePath, episode, preflight })];
}

function sourceRelevanceResultValid(result) {
  return result?.citation_target?.valid === true
    && result?.link?.valid === true
    && (!result?.content_attestation || result.content_attestation.valid === true)
    && result?.relevance?.status === "assessed"
    && result.relevance?.assessment?.locator_assessment?.verdict === "supports"
    && result?.claim_assessments?.valid === true;
}

function validationCoverageErrors(episodePath, validation) {
  const errors = [];
  const read = (name) => YAML.parse(fs.readFileSync(path.join(episodePath, name), "utf8"));
  const sourceLedger = read("sources.yaml"); const claimInventory = read("claim-inventory.yaml");
  const sources = Array.isArray(sourceLedger?.sources) ? sourceLedger.sources : [];
  const claimsById = new Map((Array.isArray(claimInventory?.claims) ? claimInventory.claims : []).map((claim) => [claim.id, claim]));
  const sourceResults = Array.isArray(validation?.results) ? validation.results : [];
  const expectedMasterScriptMapping = validateMasterScriptSourceMappings(episodePath, sourceLedger, claimInventory);
  if (validation?.master_script_mapping?.valid !== true) errors.push("link-validation.yaml does not record a valid master-script source mapping.");
  if (validation?.master_script_mapping?.source_tag_count !== expectedMasterScriptMapping.source_tag_count || validation?.master_script_mapping?.claim_coverage_count !== expectedMasterScriptMapping.claim_coverage_count) errors.push("link-validation.yaml does not preserve the current master-script source-tag coverage.");
  if (!sameStringSet(sourceResults.map((result) => result?.source_id), sources.map((source) => source.id))) errors.push("link-validation.yaml does not cover every current source exactly once.");
  for (const source of sources) {
    const result = sourceResults.find((candidate) => candidate?.source_id === source.id);
    if (!sameStringSet(result?.linked_claim_ids, source.supports_claims || [])) errors.push(`link-validation.yaml does not preserve the current claim mapping for source ${source.id}.`);
    for (const claimId of source.supports_claims || []) if (!claimsById.get(claimId)?.sources?.includes(source.id)) errors.push(`Current claim inventory is not reciprocal for source ${source.id}.`);
  }
  const manifestPath = path.join(episodePath, "show-notes-manifest.yaml");
  const manifest = fs.existsSync(manifestPath) ? read("show-notes-manifest.yaml") : null;
  const expectedLinks = Array.isArray(manifest?.links) ? manifest.links : [];
  const showNotesResults = Array.isArray(validation?.show_notes_results) ? validation.show_notes_results : [];
  if (!sameStringSet(showNotesResults.map((result) => result?.id), expectedLinks.map((link) => link.id))) errors.push("link-validation.yaml does not cover every current show-notes link exactly once.");
  for (const link of expectedLinks) {
    const result = showNotesResults.find((candidate) => candidate?.id === link.id);
    if (result?.url !== link.url || result?.source_id !== link.source_id || !sameStringSet(result?.claim_ids, link.claim_ids || [])) errors.push(`link-validation.yaml does not preserve the current show-notes mapping for ${link.id}.`);
  }
  return errors;
}

module.exports = { claimSourcePreflightErrors, claimSourcePreflightInputHashes, currentClaimSourcePreflightErrors, retrievalReviewUntaggedPassageErrors, sourceRelevanceResultValid, sourceTagRecords, sourceValidationInputHashes, utcRfc3339Timestamp, validateMasterScriptSourceMappings, validationCoverageErrors };
