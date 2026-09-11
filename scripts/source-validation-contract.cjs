"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

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
  expect(typeof preflight?.checked_at_utc === "string" && !Number.isNaN(Date.parse(preflight.checked_at_utc)), "claim-source-preflight.yaml must record its review timestamp.");
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
  const claimsByID = new Map(inventory.claims.map((claim) => [claim.id, claim]));
  const results = Array.isArray(preflight?.results) ? preflight.results : [];
  expect(sameStringSet(results.map((result) => result?.source_id), sources.map((source) => source.id)), "claim-source-preflight.yaml must cover every current source exactly once.");
  for (const source of sources) {
    const result = results.find((candidate) => candidate?.source_id === source.id);
    if (!result) continue;
    expect(result.locator === source.locator, `claim-source-preflight.yaml must preserve the exact locator for source ${source.id}.`);
    expect(sameStringSet(result.linked_claim_ids, source.supports_claims || []), `claim-source-preflight.yaml must preserve the current claim mapping for source ${source.id}.`);
    const excerpt = result.reviewed_excerpt;
    const excerptRecorded = typeof excerpt?.kind === "string" && excerpt.kind.length > 0
      && typeof excerpt.text === "string" && excerpt.text.length > 0
      && validSha256(excerpt.sha256) === sha256Text(excerpt.text)
      && Number.isInteger(excerpt.characters) && excerpt.characters === excerpt.text.length;
    expect(excerptRecorded, `claim-source-preflight.yaml must retain a hash-verified copy of the reviewed excerpt for source ${source.id}.`);
    const expectedClaims = source.supports_claims || [];
    expect(expectedClaims.every((claimID) => claimsByID.get(claimID)?.sources?.includes(source.id)), `claim-source-preflight.yaml cannot attest a non-reciprocal claim mapping for source ${source.id}.`);
    const assessments = result.relevance?.claim_assessments || [];
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

module.exports = { claimSourcePreflightErrors, claimSourcePreflightInputHashes, retrievalReviewUntaggedPassageErrors, sourceRelevanceResultValid, sourceTagRecords, sourceValidationInputHashes, validateMasterScriptSourceMappings, validationCoverageErrors };
