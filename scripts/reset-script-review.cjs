#!/usr/bin/env node
"use strict";

// Script edits invalidate downstream human and machine review. This tool makes
// that transition explicit and fingerprints the current master script.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { writeFileSetAtomically } = require("./file-transaction.cjs");
const { sourceReviewEvidenceErrors } = require("./production-gates.cjs");
const { RELEASE_GATES_AFTER_SCRIPT_APPROVAL, RELEASE_GATES_AFTER_SCRIPT_RESET } = require("./production-state-contract.cjs");
const { claimSourcePreflightErrors, claimSourcePreflightInputHashes } = require("./source-validation-contract.cjs");

class ScriptReviewStateError extends Error {}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readYaml(filePath) {
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new ScriptReviewStateError(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ScriptReviewStateError(`${filePath} must contain a YAML mapping.`);
  return value;
}

function removeLegacyProductionStatus(script) {
  return script.replace(/^\*\*Production status:\*\*.*(?:\r?\n)?/gim, "");
}

function migratedAudioMix(audio) {
  // Historical episodes that used the established series music bed record it
  // in their old manifest. A revision needs an explicit current contract, so
  // preserve that treatment when it is recognizable; otherwise choose a
  // reviewable disabled default instead of guessing at a new mix.
  const musicBed = audio.current_candidate_render?.music_bed;
  const recordedSource = typeof musicBed === "string" ? musicBed : musicBed?.source;
  if (typeof recordedSource !== "string" || !recordedSource.includes("assets/music/jonasblakewood-synth-pop_60s-583368.mp3")) {
    return { schema_version: 1, music: { enabled: false } };
  }
  return {
    schema_version: 1,
    music: {
      enabled: true,
      source: "../../assets/music/jonasblakewood-synth-pop_60s-583368.mp3",
      base_gain_db: -24,
      voice_gain_db: -30,
      level_transition_seconds: 0.15,
      intro_lead_seconds: 10,
      intro_tail_seconds: 5,
      intro_fade_seconds: 0.5,
      outro_tail_seconds: 10,
      outro_fade_seconds: 5,
    },
  };
}

function planAudioMixContract(resolved, episode, audio, updates) {
  const mixPath = path.join(resolved, "audio-mix.yaml");
  if (fs.existsSync(mixPath) && !fs.lstatSync(mixPath).isFile()) throw new ScriptReviewStateError("audio-mix.yaml must be a regular file before a script-review reset can migrate this package.");
  episode.audio = { ...(episode.audio || {}), mix_config: "audio-mix.yaml" };
  if (!fs.existsSync(mixPath)) updates.set(mixPath, YAML.stringify(migratedAudioMix(audio)));
}

const CLAIM_SOURCE_PREFLIGHT_TEMPLATE = Object.freeze({
  schema_version: 1,
  validator: "scripts/claim-source-preflight.cjs",
  status: "pending",
  authorization: null,
  checked_at_utc: null,
  llm_requested: false,
  llm_model: null,
  input_sha256: { sources: null, claims: null },
  results: [],
});

const CLAIM_SOURCE_PREFLIGHT_QA_ITEMS = Object.freeze([
  "- [ ] Explicit current-turn authorization was received before proposed factual claims, exact source locators, and relevant source excerpts were sent to OpenAI for this claim-source preflight run. The preflight command consumes this item and records the run identity in its result. <!-- qa-id: openai-claim-source-preflight-authorization -->",
  "- [ ] `claim-source-preflight.yaml` was created by `npm run sources:preflight` and is complete and bound to the current source ledger and claim inventory; it records every reviewed source's exact locator, independently fetched citation identity and content hash, locator-excerpt hash, mapped claims, and supporting LLM assessment. Findings were resolved before full spoken prose was drafted and are recorded in `production-log.md`. <!-- qa-id: claim-source-preflight -->",
]);

function preflightMatchesCurrentInputs(preflight, inputHashes) {
  return typeof inputHashes.sources === "string"
    && typeof inputHashes.claims === "string"
    && preflight?.input_sha256?.sources === inputHashes.sources
    && preflight?.input_sha256?.claims === inputHashes.claims;
}

function markChecklistItemsUnchecked(checklist, qaIDs) {
  const ids = new Set(qaIDs);
  return checklist.replace(/^(\s*-\s*)\[[ xX]\](.*<!--\s*qa-id:\s*([^\s>]+)\s*-->.*)$/gm, (line, prefix, remainder, qaID) => (
    ids.has(qaID) ? `${prefix}[ ]${remainder}` : line
  ));
}

function planClaimSourcePreflightContract(resolved, episode, updates) {
  const preflightPath = path.join(resolved, "claim-source-preflight.yaml");
  if (fs.existsSync(preflightPath) && !fs.lstatSync(preflightPath).isFile()) throw new ScriptReviewStateError("claim-source-preflight.yaml must be a regular file before a script-review reset can migrate this package.");
  episode.source_verification = { ...(episode.source_verification || {}), claim_source_preflight: "claim-source-preflight.yaml" };
  let stalePreflight = false;
  if (!fs.existsSync(preflightPath)) {
    stalePreflight = true;
  } else {
    try {
      const preflight = readYaml(preflightPath);
      stalePreflight = !preflightMatchesCurrentInputs(preflight, claimSourcePreflightInputHashes(resolved))
        || claimSourcePreflightErrors({
          episodePath: resolved,
          episode: { ...episode, production_contract_version: 2 },
          preflight,
        }).length > 0;
    } catch {
      stalePreflight = true;
    }
  }
  if (stalePreflight) {
    episode.source_verification.claim_source_preflight_status = "pending";
    updates.set(preflightPath, YAML.stringify(CLAIM_SOURCE_PREFLIGHT_TEMPLATE));
  } else {
    episode.source_verification.claim_source_preflight_status = "complete";
  }

  const checklistPath = path.join(resolved, "qa-checklist.md");
  if (fs.existsSync(checklistPath) && !fs.lstatSync(checklistPath).isFile()) throw new ScriptReviewStateError("qa-checklist.md must be a regular file before a script-review reset can migrate this package.");
  let checklist;
  if (fs.existsSync(checklistPath)) checklist = fs.readFileSync(checklistPath, "utf8");
  else {
    const templatePath = path.join(__dirname, "..", "templates", "qa-checklist.md");
    checklist = fs.readFileSync(templatePath, "utf8").replaceAll("{{TITLE}}", episode.title || episode.id || "Episode");
  }
  const missingItems = CLAIM_SOURCE_PREFLIGHT_QA_ITEMS.filter((item) => !checklist.includes(item.match(/qa-id: ([^ ]+)/)[1]));
  if (missingItems.length) checklist = `${checklist.trimEnd()}\n\n${missingItems.join("\n")}\n`;
  if (stalePreflight) checklist = markChecklistItemsUnchecked(checklist, ["openai-claim-source-preflight-authorization", "claim-source-preflight"]);
  const originalChecklist = fs.existsSync(checklistPath) ? fs.readFileSync(checklistPath, "utf8") : null;
  if (checklist !== originalChecklist) updates.set(checklistPath, checklist);
}

function resolveEpisode(episodePath) {
  const resolved = path.resolve(episodePath);
  for (const file of ["episode.yaml", "audio-manifest.yaml", "hosting-metadata.yaml", "master-script.md"]) {
    const candidate = path.join(resolved, file);
    if (!fs.existsSync(candidate) || !fs.lstatSync(candidate).isFile()) throw new ScriptReviewStateError(`Episode package is missing ${file}.`);
  }
  return resolved;
}

function resetScriptReview({ episodePath, reason = "The master script changed after its prior review.", writeFiles = writeFileSetAtomically }) {
  const resolved = resolveEpisode(episodePath);
  const episodePathname = path.join(resolved, "episode.yaml");
  const audioPathname = path.join(resolved, "audio-manifest.yaml");
  const hostingPathname = path.join(resolved, "hosting-metadata.yaml");
  const masterScriptPathname = path.join(resolved, "master-script.md");
  const originalScript = fs.readFileSync(masterScriptPathname, "utf8");
  const migratedScript = removeLegacyProductionStatus(originalScript);
  const scriptSha256 = sha256Text(migratedScript);
  const episode = readYaml(episodePathname);
  const audio = readYaml(audioPathname);
  const hosting = readYaml(hostingPathname);
  const updates = new Map();

  planAudioMixContract(resolved, episode, audio, updates);
  planClaimSourcePreflightContract(resolved, episode, updates);

  const candidate = audio.current_candidate_render;
  if (candidate?.sha256 && !audio.superseded_candidates?.some((entry) => entry.sha256 === candidate.sha256)) {
    audio.superseded_candidates = [...(audio.superseded_candidates || []), { ...candidate, superseded_reason: reason }];
  }
  delete audio.status;
  delete audio.publication_day_validation;
  delete audio.reason;
  delete audio.required_before_release;
  audio.current_candidate_render = null;
  if (audio.chapter_markers) {
    delete audio.chapter_markers.status;
    audio.chapter_markers.audio_sha256 = null;
    audio.chapter_markers.review_page = null;
  }

  // A revision opts a legacy package into the current release contract. It
  // never alters an untouched historical package or its existing handoff.
  episode.production_contract_version = 2;
  episode.status = "editorial_review_pending";
  episode.runtime_actual_seconds = null;
  episode.release_gates_remaining = [...RELEASE_GATES_AFTER_SCRIPT_RESET];
  episode.audio = { ...(episode.audio || {}), status: "not_rendered", publication_day_validation: "pending", chapter_markers: "pending_render" };
  episode.source_verification = { ...(episode.source_verification || {}), status: "source_relevance_pending", verified_at_utc: null, relevance_review: "pending" };
  episode.review = { ...(episode.review || {}), editorial_status: "reapproval_required", editorial_script_sha256: null, pending_script_sha256: scriptSha256 };

  episode.hosting = { ...(episode.hosting || {}), handoff_status: "pending_script_review" };
  // A reset migrates a legacy package to the one-file production-state
  // contract before it begins its next revision.
  delete hosting.handoff_status;
  delete hosting.release_readiness;
  if (migratedScript !== originalScript) updates.set(masterScriptPathname, migratedScript);
  updates.set(episodePathname, YAML.stringify(episode));
  updates.set(audioPathname, YAML.stringify(audio));
  updates.set(hostingPathname, YAML.stringify(hosting));
  writeFiles(updates);
  return { scriptSha256, episodePath: resolved };
}

function approveScriptReview({ episodePath }) {
  const resolved = resolveEpisode(episodePath);
  const episodePathname = path.join(resolved, "episode.yaml");
  const episode = readYaml(episodePathname);
  const sourceErrors = sourceReviewEvidenceErrors({ episodePath: resolved, episode });
  if (sourceErrors.length) throw new ScriptReviewStateError(`Source-relevance review is not valid for the current package: ${sourceErrors[0]}`);
  const scriptSha256 = sha256Text(fs.readFileSync(path.join(resolved, "master-script.md"), "utf8"));
  episode.status = "source_relevance_review_complete";
  episode.release_gates_remaining = [...RELEASE_GATES_AFTER_SCRIPT_APPROVAL];
  episode.review = { ...(episode.review || {}), editorial_status: "script_approved", editorial_script_sha256: scriptSha256 };
  delete episode.review.pending_script_sha256;
  writeFileSetAtomically(new Map([[episodePathname, YAML.stringify(episode)]]));
  return { scriptSha256, episodePath: resolved };
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!["--episode", "--reset", "--approve", "--reason"].includes(argument)) throw new ScriptReviewStateError(`Unexpected argument: ${argument}`);
    if (argument === "--reset" || argument === "--approve") { values[argument.slice(2)] = true; continue; }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new ScriptReviewStateError(`Missing value for ${argument}.`);
    values[argument.slice(2)] = value;
    index += 1;
  }
  if (!values.episode || values.reset === values.approve) throw new ScriptReviewStateError("Specify --episode and exactly one of --reset or --approve.");
  return values;
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = options.reset ? resetScriptReview({ episodePath: options.episode, reason: options.reason }) : approveScriptReview({ episodePath: options.episode });
    console.log(`${options.reset ? "Reset" : "Recorded"} script-review state for ${result.episodePath} (${result.scriptSha256}).`);
  } catch (error) {
    console.error(error instanceof ScriptReviewStateError ? error.message : `Script-review state update failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { CLAIM_SOURCE_PREFLIGHT_QA_ITEMS, CLAIM_SOURCE_PREFLIGHT_TEMPLATE, ScriptReviewStateError, approveScriptReview, markChecklistItemsUnchecked, migratedAudioMix, planAudioMixContract, planClaimSourcePreflightContract, preflightMatchesCurrentInputs, removeLegacyProductionStatus, resetScriptReview, sha256Text };
