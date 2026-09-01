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
    if (/^\[(?:Source|Claim type):/.test(line.trim()) || /^\*\*(?:Version|Target runtime|Speakers|Production status):/.test(line.trim()) || !line.trim()) continue;
    lastParagraph = line.trim();
  }
  return records;
}

function validateMasterScriptSourceMappings(episodePath, ledger, claimInventory) {
  const errors = [];
  const scriptPath = path.join(episodePath, "master-script.md");
  if (!fs.existsSync(scriptPath)) return { valid: true, status: "not_configured", errors: [], source_tag_count: 0, claim_coverage_count: 0, passages_by_source: {} };
  const records = sourceTagRecords(fs.readFileSync(scriptPath, "utf8"));
  if (!records.length) return { valid: true, status: "not_configured", errors: [], source_tag_count: 0, claim_coverage_count: 0, passages_by_source: {} };
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
  let claimCoverageCount = 0;
  for (const claim of claimInventory.claims) {
    if (!Array.isArray(claim.script_sections) || !claim.script_sections.length) {
      errors.push(`claim ${claim.id} must declare at least one script section`);
      continue;
    }
    const citedSources = new Set();
    for (const section of claim.script_sections) for (const sourceId of tagsBySection.get(section) || []) citedSources.add(sourceId);
    if (!claim.sources?.some((sourceId) => citedSources.has(sourceId))) {
      errors.push(`claim ${claim.id} has no declared source tag in its script section${claim.script_sections.length === 1 ? "" : "s"}`);
    } else {
      claimCoverageCount += 1;
    }
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

module.exports = { sourceTagRecords, sourceValidationInputHashes, validateMasterScriptSourceMappings, validationCoverageErrors };
