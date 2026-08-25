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
    show_notes: digest(path.join(episodePath, "show-notes.md")),
    show_notes_manifest: digest(path.join(episodePath, "show-notes-manifest.yaml")),
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

module.exports = { sourceValidationInputHashes, validationCoverageErrors };
