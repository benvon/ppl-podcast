"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { deriveNarration } = require("./derive-narration.cjs");
const { CONTRACT_KINDS, productionContractKind, preservedProductionContract } = require("./production-state-contract.cjs");
const {
  sourceRelevanceResultValid,
  deterministicValidationResultValid,
  sourceValidationInputHashes,
  utcRfc3339Timestamp,
  validationCoverageErrors,
} = require("./source-validation-contract.cjs");
const { validationFailurePath } = require("./validation-records.cjs");

const SOURCE_REVIEW_FILES = Object.freeze({
  validation: "link-validation.yaml",
  publicationLinkValidation: "publication-link-validation.yaml",
  checklist: "qa-checklist.md",
});

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
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
  if (preservedProductionContract(kind)) return ["Current production tooling cannot operate on a preserved package; begin a deliberate revision with episode:script-review --reset."];
  return ["episode.yaml must use the supported production_contract_version 2."];
}

function sourceReviewEvidenceErrors({ episodePath, episode }) {
  const errors = [...currentContractErrors(episode)];
  if (errors.length) return errors;
  const expect = (condition, message) => { if (!condition) errors.push(message); };
  const validationPath = path.join(episodePath, SOURCE_REVIEW_FILES.validation);
  const validation = readYamlMapping(validationPath, SOURCE_REVIEW_FILES.validation, errors);
  const checklist = readTextFile(path.join(episodePath, SOURCE_REVIEW_FILES.checklist), SOURCE_REVIEW_FILES.checklist, errors);
  if (!validation || checklist === null) return errors;

  expect(episode.source_verification?.link_validation === SOURCE_REVIEW_FILES.validation, "episode.yaml must reference link-validation.yaml.");
  expect(episode.source_verification?.show_notes_manifest === "show-notes-manifest.yaml", "episode.yaml must reference show-notes-manifest.yaml.");
  expect(episode.source_verification?.status === "source_relevance_complete", "episode.yaml must record source_relevance_complete.");
  expect(episode.source_verification?.relevance_review === "complete", "episode.yaml must record complete source relevance review.");

  expect(!fs.existsSync(`${validationPath}.in-progress`) && !fs.existsSync(`${validationPath}.in-progress.recovering`), "Source-relevance validation is in progress, recovering, or was interrupted.");
  expect(!fs.existsSync(validationFailurePath(validationPath)), "The most recent source-relevance validation failed and must be rerun successfully.");
  expect(validation.schema_version === 1, "link-validation.yaml must use schema_version 1.");
  expect(validation.validator === "scripts/validate-source-links.cjs", "link-validation.yaml must be produced by scripts/validate-source-links.cjs.");
  expect(validation.llm_requested === true, "link-validation.yaml must record a requested LLM review.");
  expect(typeof validation.llm_model === "string" && validation.llm_model.trim().length > 0, "link-validation.yaml must record the LLM review model.");
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
  expect(typeof validation.run_id === "string" && /^[0-9a-f-]{36}$/i.test(validation.run_id), "link-validation.yaml must record its validation run ID.");
  const authorizationTime = validation.authorization?.attested_at_utc || validation.authorization?.authorized_at_utc || validation.authorization?.consumed_at_utc;
  expect(utcRfc3339Timestamp(authorizationTime) && validation.authorization?.qa_id === "openai-source-review-authorization" && typeof validation.authorization?.run_id === "string" && /^[0-9a-f-]{36}$/i.test(validation.authorization.run_id) && validation.authorization.run_id === validation.run_id && Date.parse(authorizationTime) <= Date.parse(validation.checked_at_utc), "link-validation.yaml must record the source-review authorization attestation for this validation run.");
  expect(utcRfc3339Timestamp(episode.source_verification?.verified_at_utc), "episode.yaml must record a valid UTC source-review timestamp.");
  expect(episode.source_verification?.verified_at_utc === validation.checked_at_utc, "episode source-verification timestamp must match link-validation.yaml.");
  return errors;
}

function publicationLinkEvidenceErrors({ episodePath, episode }) {
  const errors = [...currentContractErrors(episode)];
  if (errors.length) return errors;
  const expect = (condition, message) => { if (!condition) errors.push(message); };
  const reportPath = path.join(episodePath, SOURCE_REVIEW_FILES.publicationLinkValidation);
  const report = readYamlMapping(reportPath, SOURCE_REVIEW_FILES.publicationLinkValidation, errors);
  if (!report) return errors;

  expect(!fs.existsSync(`${reportPath}.in-progress`) && !fs.existsSync(`${reportPath}.in-progress.recovering`), "Publication-day source-link validation is in progress, recovering, or was interrupted.");
  expect(!fs.existsSync(validationFailurePath(reportPath)), "The most recent publication-day source-link validation failed and must be rerun successfully.");
  expect(report.schema_version === 1, "publication-link-validation.yaml must use schema_version 1.");
  expect(report.validator === "scripts/validate-source-links.cjs", "publication-link-validation.yaml must be produced by scripts/validate-source-links.cjs.");
  expect(report.validation_kind === "publication_link_check", "publication-link-validation.yaml must record a publication_link_check.");
  expect(report.llm_requested === false && report.llm_model === null, "publication-link-validation.yaml must not replace the formal LLM source-relevance review.");
  expect(report.claim_mapping?.valid === true, "publication-day link validation must pass the claim mapping.");
  expect(report.show_notes_mapping?.valid === true, "publication-day link validation must pass the show-notes mapping.");
  expect(report.master_script_mapping?.valid === true, "publication-day link validation must pass the master-script source mapping.");
  expect(typeof report.run_id === "string" && /^[0-9a-f-]{36}$/i.test(report.run_id), "publication-link-validation.yaml must record its validation run ID.");
  expect(Array.isArray(report.results) && report.results.every(deterministicValidationResultValid), "publication-day link validation must retain successful deterministic source results.");
  expect(Array.isArray(report.show_notes_results) && report.show_notes_results.every(deterministicValidationResultValid), "publication-day link validation must retain successful deterministic show-notes results.");
  const currentHashes = sourceValidationInputHashes(episodePath);
  expect(Object.entries(currentHashes).every(([name, digest]) => report.input_sha256?.[name] === digest), "publication-link-validation.yaml must be bound to the current sources, claims, and show-notes inputs, including the current script and manifest bytes.");
  try { errors.push(...validationCoverageErrors(episodePath, report)); }
  catch (error) { errors.push(`Could not verify publication-day source-link coverage: ${error.message}`); }
  expect(utcRfc3339Timestamp(report.checked_at_utc), "publication-link-validation.yaml must record a valid UTC check timestamp.");
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
  publicationLinkEvidenceErrors,
  renderPrerequisiteErrors,
  sourceReviewEvidenceErrors,
};
