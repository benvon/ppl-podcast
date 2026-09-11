"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { deriveNarration } = require("./derive-narration.cjs");
const { CONTRACT_KINDS, productionContractKind } = require("./production-state-contract.cjs");
const {
  claimSourcePreflightErrors,
  sourceRelevanceResultValid,
  sourceValidationInputHashes,
  utcRfc3339Timestamp,
  validationCoverageErrors,
} = require("./source-validation-contract.cjs");
const { validationFailurePath } = require("./validation-records.cjs");

const SOURCE_REVIEW_FILES = Object.freeze({
  preflight: "claim-source-preflight.yaml",
  validation: "link-validation.yaml",
  checklist: "qa-checklist.md",
});

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function qaItemCompleteWithID(markdown, id) {
  const escaped = String(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^- \\[x\\][^\\n]*<!--\\s*qa-id:\\s*${escaped}\\s*-->`, "mi").test(markdown);
}

function readYamlMapping(filePath, label, errors) {
  try {
    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
      errors.push(`Missing required file ${label}.`);
      return null;
    }
    const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
    if (document.errors.length) throw new Error(document.errors[0].message);
    const value = document.toJS();
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("expected a YAML mapping");
    return value;
  } catch (error) {
    errors.push(`Could not read ${label}: ${error.message}`);
    return null;
  }
}

function readTextFile(filePath, label, errors) {
  try {
    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
      errors.push(`Missing required file ${label}.`);
      return null;
    }
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    errors.push(`Could not read ${label}: ${error.message}`);
    return null;
  }
}

function currentContractErrors(episode) {
  const kind = productionContractKind(episode);
  if (kind === CONTRACT_KINDS.CURRENT) return [];
  if (kind === CONTRACT_KINDS.PRESERVED_LEGACY) return ["Current production tooling cannot operate on a preserved legacy package; begin a deliberate revision with episode:script-review --reset."];
  return ["episode.yaml must use the supported production_contract_version 2."];
}

function sourceReviewEvidenceErrors({ episodePath, episode }) {
  const errors = [...currentContractErrors(episode)];
  if (errors.length) return errors;
  const expect = (condition, message) => { if (!condition) errors.push(message); };
  const validationPath = path.join(episodePath, SOURCE_REVIEW_FILES.validation);
  const preflight = readYamlMapping(path.join(episodePath, SOURCE_REVIEW_FILES.preflight), SOURCE_REVIEW_FILES.preflight, errors);
  const validation = readYamlMapping(validationPath, SOURCE_REVIEW_FILES.validation, errors);
  const checklist = readTextFile(path.join(episodePath, SOURCE_REVIEW_FILES.checklist), SOURCE_REVIEW_FILES.checklist, errors);
  if (!preflight || !validation || checklist === null) return errors;

  expect(episode.source_verification?.claim_source_preflight === SOURCE_REVIEW_FILES.preflight, "episode.yaml must reference claim-source-preflight.yaml.");
  expect(episode.source_verification?.link_validation === SOURCE_REVIEW_FILES.validation, "episode.yaml must reference link-validation.yaml.");
  expect(episode.source_verification?.show_notes_manifest === "show-notes-manifest.yaml", "episode.yaml must reference show-notes-manifest.yaml.");
  expect(episode.source_verification?.claim_source_preflight_status === "complete", "episode.yaml must record a complete claim-source preflight.");
  expect(episode.source_verification?.status === "source_relevance_complete", "episode.yaml must record source_relevance_complete.");
  expect(episode.source_verification?.relevance_review === "complete", "episode.yaml must record complete source relevance review.");
  expect(qaItemCompleteWithID(checklist, "claim-source-preflight"), "qa-checklist.md must record that claim-source preflight findings were resolved before full prose drafting.");
  expect(qaItemCompleteWithID(checklist, "openai-source-review-authorization"), "qa-checklist.md must record explicit authorization before sending source material to OpenAI for source-relevance review.");
  errors.push(...claimSourcePreflightErrors({ episodePath, episode, preflight }));

  expect(!fs.existsSync(`${validationPath}.in-progress`) && !fs.existsSync(`${validationPath}.in-progress.recovering`), "Source-relevance validation is in progress, recovering, or was interrupted.");
  expect(!fs.existsSync(validationFailurePath(validationPath)), "The most recent source-relevance validation failed and must be rerun successfully.");
  const preflightPath = path.join(episodePath, SOURCE_REVIEW_FILES.preflight);
  expect(!fs.existsSync(`${preflightPath}.in-progress`) && !fs.existsSync(`${preflightPath}.in-progress.recovering`), "Claim-source preflight is in progress, recovering, or was interrupted.");
  expect(!fs.existsSync(validationFailurePath(preflightPath)), "The most recent claim-source preflight failed and must be rerun successfully.");
  expect(validation.llm_requested === true, "link-validation.yaml must record a requested LLM review.");
  expect(validation.claim_mapping?.valid === true, "link validation must pass the claim mapping.");
  expect(validation.show_notes_mapping?.valid === true, "link validation must pass the show-notes mapping.");
  expect(validation.master_script_mapping?.valid === true, "link validation must pass the master-script source mapping.");
  expect(Array.isArray(validation.show_notes_results), "link validation must record its listener-facing study-link results, including an empty collection when no links are declared.");
  expect(validation.results?.every(sourceRelevanceResultValid), "link validation must retain successful source- and claim-level relevance assessments.");
  expect(validation.show_notes_results?.every((result) => result?.citation_target?.valid === true && result?.link?.valid === true && (!result?.content_attestation || result.content_attestation.valid === true)), "all recorded show-notes links must be valid deep citations.");
  const sourceResultsByID = new Map((validation.results || []).map((result) => [result.source_id, result]));
  expect(validation.show_notes_results?.every((result) => sourceResultsByID.get(result.source_id)?.link?.valid === true), "every show-notes link must map to a validated episode research citation.");
  const currentHashes = sourceValidationInputHashes(episodePath);
  expect(Object.entries(currentHashes).every(([name, digest]) => validation.input_sha256?.[name] === digest), "link-validation.yaml must be bound to the current sources, claims, and show-notes inputs, including the current script and manifest bytes.");
  try { errors.push(...validationCoverageErrors(episodePath, validation)); }
  catch (error) { errors.push(`Could not verify source-review coverage: ${error.message}`); }
  expect(Array.isArray(validation.results) && validation.results.length > 0, "link validation must record source results.");
  expect(utcRfc3339Timestamp(validation.checked_at_utc), "link-validation.yaml must record a valid UTC source-review timestamp.");
  expect(utcRfc3339Timestamp(episode.source_verification?.verified_at_utc), "episode.yaml must record a valid UTC source-review timestamp.");
  expect(episode.source_verification?.verified_at_utc === validation.checked_at_utc, "episode source-verification timestamp must match link-validation.yaml.");
  return errors;
}

function editorialApprovalErrors({ episodePath, episode }) {
  const errors = [...currentContractErrors(episode)];
  if (errors.length) return errors;
  const masterScript = readTextFile(path.join(episodePath, "master-script.md"), "master-script.md", errors);
  if (masterScript === null) return errors;
  if (episode.review?.editorial_status !== "script_approved") errors.push("episode.yaml must record script_approved.");
  if (episode.review?.editorial_script_sha256 !== sha256Text(masterScript)) errors.push("editorial approval must be bound to the current master-script.md bytes.");
  return errors;
}

function narrationDerivativeErrors({ episodePath }) {
  const errors = [];
  const masterScript = readTextFile(path.join(episodePath, "master-script.md"), "master-script.md", errors);
  const narration = readTextFile(path.join(episodePath, "narration.md"), "narration.md", errors);
  if (masterScript === null || narration === null) return errors;
  try {
    if (deriveNarration(masterScript) !== narration) errors.push("narration.md is not the current derivative of master-script.md.");
  } catch (error) { errors.push(`master-script.md cannot produce a narration derivative: ${error.message}`); }
  return errors;
}

function renderPrerequisiteErrors({ episodePath, episode }) {
  return [
    ...sourceReviewEvidenceErrors({ episodePath, episode }),
    ...editorialApprovalErrors({ episodePath, episode }),
    ...narrationDerivativeErrors({ episodePath }),
  ];
}

module.exports = {
  SOURCE_REVIEW_FILES,
  currentContractErrors,
  editorialApprovalErrors,
  narrationDerivativeErrors,
  qaItemCompleteWithID,
  renderPrerequisiteErrors,
  sourceReviewEvidenceErrors,
};
