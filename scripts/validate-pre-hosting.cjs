#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { deriveNarration } = require("./derive-narration.cjs");
const { releaseIdentity } = require("./release-identity.cjs");
const { verifyMp3Chapters } = require("./render_episode_realtime.cjs");
const { sourceValidationInputHashes, validationCoverageErrors } = require("./source-validation-contract.cjs");

const APPROVED_DRAFT_PRODUCTION_STATUS = "Script approval and source-relevance review are complete; audio has not been rendered and release work remains pending.";
const DRAFT_PACKAGE_SHAPE = "draft_package_shape";

class PreHostingValidationError extends Error {}

function parseArgs(argv) {
  const values = { packageOnly: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--package-only") { values.packageOnly = true; continue; }
    if (!token.startsWith("--")) throw new PreHostingValidationError(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new PreHostingValidationError(`Missing value for ${token}`);
    values[token.slice(2)] = value;
    index += 1;
  }
  if (!values.episode) throw new PreHostingValidationError("--episode is required.");
  return values;
}

function readYaml(filePath) {
  let document;
  try { document = YAML.parseDocument(fs.readFileSync(filePath, "utf8")); }
  catch (error) { throw new PreHostingValidationError(`Could not read ${filePath}: ${error.message}`); }
  if (document.errors.length) throw new PreHostingValidationError(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  return document.toJS();
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch (error) { throw new PreHostingValidationError(`Could not read ${filePath}: ${error.message}`); }
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function validSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value) ? value.toLowerCase() : null;
}

function durationDisplay(seconds) {
  const rounded = Math.round(Number(seconds));
  const hours = String(Math.floor(rounded / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((rounded % 3600) / 60)).padStart(2, "0");
  const remainder = String(rounded % 60).padStart(2, "0");
  return `${hours}:${minutes}:${remainder}`;
}

function durationsMatch(left, right, toleranceSeconds = 0.01) {
  const leftSeconds = Number(left);
  const rightSeconds = Number(right);
  return Number.isFinite(leftSeconds)
    && Number.isFinite(rightSeconds)
    && leftSeconds > 0
    && rightSeconds > 0
    && Math.abs(leftSeconds - rightSeconds) < toleranceSeconds;
}

function sameUtcDate(left, right) {
  return typeof left === "string" && typeof right === "string" && left.slice(0, 10) === right.slice(0, 10) && /^\d{4}-\d{2}-\d{2}$/.test(left.slice(0, 10));
}

function expect(errors, condition, message) {
  if (!condition) errors.push(message);
}

function requireFile(episodePath, fileName, errors) {
  const filePath = path.join(episodePath, fileName);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) errors.push(`Missing required file ${fileName}.`);
  return filePath;
}

function pathWithin(root, candidate) {
  try {
    const resolvedRoot = fs.realpathSync(root);
    const resolvedCandidate = fs.realpathSync(candidate);
    return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(`${resolvedRoot}${path.sep}`);
  } catch (_) {
    return false;
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceReviewErrors({ episodePath, paths, episode, sourceValidation }) {
  const errors = [];
  expect(errors, episode.source_verification?.link_validation === "link-validation.yaml", "episode.yaml must reference link-validation.yaml.");
  expect(errors, episode.source_verification?.show_notes_manifest === "show-notes-manifest.yaml", "episode.yaml must reference show-notes-manifest.yaml.");
  expect(errors, typeof episode.source_verification?.status === "string" && episode.source_verification.status.length > 0, "episode.yaml must record a source verification status.");
  expect(errors, episode.source_verification?.relevance_review === "complete", "episode.yaml must record complete source relevance review.");
  expect(errors, sourceValidation.show_notes_mapping?.valid === true, "link validation must pass the show-notes mapping.");
  expect(errors, !fs.existsSync(`${paths["link-validation.yaml"]}.in-progress`) && !fs.existsSync(`${paths["link-validation.yaml"]}.in-progress.recovering`), "source validation must not be in progress, recovering, or interrupted.");
  expect(errors, Array.isArray(sourceValidation.show_notes_results) && sourceValidation.show_notes_results.length > 0, "link validation must record checked listener-facing study links.");
  expect(errors, Array.isArray(sourceValidation.results) && sourceValidation.results.length > 0, "link validation must record source results.");
  expect(errors, sourceValidation.results?.every((result) => result.citation_target?.valid === true && result.link?.valid === true && (!result.content_attestation || result.content_attestation.valid === true)), "all recorded source citations and links must be valid.");
  const sourceResultsByID = new Map((sourceValidation.results || []).map((result) => [result.source_id, result]));
  expect(errors, sourceValidation.show_notes_results?.every((result) => result.citation_target?.valid === true && result.link?.valid === true && (!result.content_attestation || result.content_attestation.valid === true)), "all recorded show-notes links must be valid deep citations.");
  expect(errors, sourceValidation.show_notes_results?.every((result) => sourceResultsByID.get(result.source_id)?.link?.valid === true), "every show-notes link must map to a validated episode research citation.");
  expect(errors, sourceValidation.results?.every((result) => result.relevance?.status === "assessed" && result.relevance?.assessment?.verdict === "supports" && result.relevance?.assessment?.locator_assessment?.verdict === "supports" && result.claim_assessments?.valid === true), "link validation must retain successful source- and claim-level relevance assessments.");
  const currentValidationInputHashes = sourceValidationInputHashes(episodePath);
  expect(errors, Object.entries(currentValidationInputHashes).every(([name, digest]) => sourceValidation.input_sha256?.[name] === digest), "link-validation.yaml must be bound to the current sources, claims, and show-notes inputs.");
  errors.push(...validationCoverageErrors(episodePath, sourceValidation));
  expect(errors, episode.source_verification?.verified_at_utc === sourceValidation.checked_at_utc, "episode source-verification timestamp must match link-validation.yaml.");
  return errors;
}

function validateDraftPackageShape({ episodePath, paths, episode, hosting, sourceValidation, masterScript, narration, showNotes, researchPacket, productionLog, qaChecklist }) {
  const errors = [];
  expect(errors, episode.status === "reviewed_draft", "episode.yaml status must be reviewed_draft before audio rendering.");
  expect(errors, episode.review?.editorial_status === "script_approved", "episode.yaml must record script_approved before the episode PR.");
  expect(errors, masterScript.includes(`**Version:** ${episode.version}`), "master-script.md version must match episode.yaml.");
  const productionStatus = masterScript.match(/^\*\*Production status:\*\*\s*(.+)$/im)?.[1] || "";
  expect(errors, Boolean(productionStatus) && !/(?:editorial|source-relevance) review\s+(?:is|are)\s+pending\b/i.test(productionStatus), "master-script.md production status must not leave completed editorial or source review pending.");
  expect(errors, showNotes.includes(`**Episode:** ${episode.id}`) && showNotes.includes(`**Version:** ${episode.version}`), "show-notes.md episode and version must match episode.yaml.");
  expect(errors, new RegExp(`\\*\\*Source verification:\\*\\*.*source-relevance review is complete for version ${escapeRegExp(episode.version)}\\.`, "i").test(showNotes), "show-notes.md must record the completed source review for the current version.");
  expect(errors, researchPacket.includes("Human editorial review and script approval are complete."), "research-packet.md must record completed human editorial review.");
  expect(errors, researchPacket.includes(`source-relevance review passed for version ${episode.version}.`), "research-packet.md must record the completed source review for the current version.");
  expect(errors, !episode.release_gates_remaining?.some((gate) => /human editorial|source-link validation with llm relevance/i.test(gate)), "episode.yaml must not retain completed editorial or source-relevance gates.");
  expect(errors, hosting.provenance?.content_version === episode.version, "hosting-metadata content version must match episode.yaml.");
  try {
    expect(errors, deriveNarration(masterScript) === narration, "narration.md must be the current derivative of master-script.md.");
  } catch (error) {
    errors.push(`master-script.md cannot produce a narration derivative: ${error.message}`);
  }
  expect(errors, /- \[x\] Human editorial pass completed/i.test(qaChecklist), "qa-checklist.md must mark the human editorial pass complete.");
  expect(errors, /- \[x\] Before any audio render, source-link validator was run with `--require-llm`/i.test(qaChecklist), "qa-checklist.md must mark the source-relevance gate complete.");
  expect(errors, /- \[x\] Independent spoken-script review completed by a second agent that did not draft the lesson/i.test(qaChecklist), "qa-checklist.md must mark the independent spoken-script review complete.");
  expect(errors, /(?:independent|non-drafting).{0,160}(?:spoken-script|adversarial).{0,320}(?:resolved|accepted)/is.test(productionLog), "production-log.md must record the independent spoken-script review and its resolution.");
  errors.push(...sourceReviewErrors({ episodePath, paths, episode, sourceValidation }));
  return { valid: errors.length === 0, kind: DRAFT_PACKAGE_SHAPE, final: false, errors };
}

function validatePreHosting({ episodePath, cwd = process.cwd(), packageOnly = false }) {
  const resolvedEpisode = path.resolve(episodePath);
  const errors = [];
  if (!fs.existsSync(resolvedEpisode) || !fs.statSync(resolvedEpisode).isDirectory()) throw new PreHostingValidationError(`Episode directory does not exist: ${resolvedEpisode}`);
  const files = ["episode.yaml", "audio-manifest.yaml", "hosting-metadata.yaml", "master-script.md", "narration.md", "sources.yaml", "claim-inventory.yaml", "show-notes.md", "show-notes-manifest.yaml", "link-validation.yaml", "qa-checklist.md", "research-packet.md", "production-log.md"];
  const paths = Object.fromEntries(files.map((fileName) => [fileName, requireFile(resolvedEpisode, fileName, errors)]));
  if (errors.length) return { valid: false, errors };

  const episode = readYaml(paths["episode.yaml"]);
  const audioManifest = readYaml(paths["audio-manifest.yaml"]);
  const hosting = readYaml(paths["hosting-metadata.yaml"]);
  const sourceValidation = readYaml(paths["link-validation.yaml"]);
  const masterScript = fs.readFileSync(paths["master-script.md"], "utf8");
  const narration = fs.readFileSync(paths["narration.md"], "utf8");
  const showNotes = fs.readFileSync(paths["show-notes.md"], "utf8");
  const researchPacket = fs.readFileSync(paths["research-packet.md"], "utf8");
  const productionLog = fs.readFileSync(paths["production-log.md"], "utf8");
  const qaChecklist = fs.readFileSync(paths["qa-checklist.md"], "utf8");
  if (packageOnly) return validateDraftPackageShape({ episodePath: resolvedEpisode, paths, episode, hosting, sourceValidation, masterScript, narration, showNotes, researchPacket, productionLog, qaChecklist });
  const candidate = audioManifest.current_candidate_render || {};
  let releaseIdentityRecord;
  try { releaseIdentityRecord = releaseIdentity({ track: episode.track, id: episode.id, version: episode.version }); }
  catch (error) { errors.push(`episode release identity is invalid: ${error.message}`); }

  expect(errors, episode.status === "ready_for_hosting_pr", "episode.yaml status must be ready_for_hosting_pr.");
  expect(errors, audioManifest.status === "candidate_rendered_listening_qa_approved", "audio-manifest.yaml status must record approved listening QA.");
  expect(errors, hosting.handoff_status === "ready_for_hosting_pr", "hosting-metadata.yaml handoff_status must be ready_for_hosting_pr.");
  expect(errors, episode.audio?.manifest === "audio-manifest.yaml", "episode.yaml must reference audio-manifest.yaml.");
  expect(errors, episode.hosting?.metadata === "hosting-metadata.yaml", "episode.yaml must reference hosting-metadata.yaml.");
  expect(errors, episode.public_notes === "show-notes.md", "episode.yaml must reference show-notes.md.");
  expect(errors, episode.source_verification?.link_validation === "link-validation.yaml", "episode.yaml must reference link-validation.yaml.");
  expect(errors, episode.source_verification?.show_notes_manifest === "show-notes-manifest.yaml", "episode.yaml must reference show-notes-manifest.yaml.");
  expect(errors, episode.source_verification?.relevance_review === "complete", "episode.yaml must record complete source relevance review.");
  expect(errors, masterScript.includes(`**Version:** ${episode.version}`), "master-script.md version must match episode.yaml.");
  expect(errors, /\*\*Production status:\*\*.*hosting/i.test(masterScript), "master-script.md production status must reflect the ready-for-hosting handoff.");
  try {
    expect(errors, deriveNarration(masterScript) === narration, "narration.md must be the current derivative of master-script.md.");
  } catch (error) {
    errors.push(`master-script.md cannot produce a narration derivative: ${error.message}`);
  }

  const release = hosting.publisher_release || {};
  expect(errors, release.id === episode.id, "hosting-metadata publisher_release.id must match episode.yaml id.");
  expect(errors, release.title === episode.title, "hosting-metadata publisher_release.title must match episode.yaml title.");
  expect(errors, release.published_at === episode.published_at, "hosting-metadata publication timestamp must match episode.yaml.");
  expect(errors, release.number === Number(String(episode.id || "").split("-").at(-1)), "hosting-metadata episode number must match the episode id.");
  expect(errors, hosting.provenance?.content_version === episode.version, "hosting-metadata content version must match episode.yaml.");
  expect(errors, Boolean(releaseIdentityRecord), "episode must define a supported public release identity.");
  expect(errors, hosting.provenance?.show_notes === "show-notes.md" && hosting.provenance?.audio_manifest === "audio-manifest.yaml", "hosting metadata provenance must name the local show notes and audio manifest.");
  expect(errors, release.audio && Object.keys(release.audio).length === 0, "podcast handoff metadata must leave audio object fields for the hosting stager.");

  const candidateSha256 = validSha256(candidate.sha256);
  expect(errors, Boolean(candidateSha256), "audio manifest must record a valid candidate MP3 SHA-256.");
  expect(errors, candidate.script_version === episode.version, "audio manifest script version must match episode.yaml.");
  expect(errors, audioManifest.chapter_markers?.status === "embedded_and_ffprobe_validated", "audio manifest must record embedded, ffprobe-validated chapters.");
  expect(errors, audioManifest.chapter_markers?.audio_sha256 === candidateSha256, "chapter-marker checksum must match the candidate MP3 checksum.");
  expect(errors, Number.isFinite(candidate.duration_seconds) && candidate.duration_seconds > 0, "audio manifest must record a positive candidate duration.");
  expect(errors, release.duration === durationDisplay(candidate.duration_seconds), "hosting duration must match the approved audio duration rounded to the nearest second.");
  expect(errors, durationsMatch(episode.runtime_actual_seconds, candidate.duration_seconds), "episode runtime_actual_seconds must match the audio manifest duration.");

  const mp3Path = typeof candidate.mp3 === "string" ? path.resolve(cwd, candidate.mp3) : null;
  const renderManifestPath = typeof candidate.render_manifest === "string" ? path.resolve(cwd, candidate.render_manifest) : null;
  const qualityReportPath = typeof candidate.audio_quality_report === "string" ? path.resolve(cwd, candidate.audio_quality_report) : null;
  const chapterReviewPath = typeof candidate.chapter_review === "string" ? path.resolve(cwd, candidate.chapter_review) : null;
  expect(errors, Boolean(mp3Path && fs.existsSync(mp3Path)), "approved MP3 is missing from the audio manifest path.");
  expect(errors, Boolean(renderManifestPath && fs.existsSync(renderManifestPath)), "render manifest is missing from the audio manifest path.");
  expect(errors, Boolean(qualityReportPath && fs.existsSync(qualityReportPath)), "audio-quality report is missing from the audio manifest path.");
  expect(errors, Boolean(chapterReviewPath && fs.existsSync(chapterReviewPath)), "chapter-review page is missing from the audio manifest path.");
  for (const [label, artifactPath] of [["approved MP3", mp3Path], ["render manifest", renderManifestPath], ["audio-quality report", qualityReportPath], ["chapter-review page", chapterReviewPath]]) {
    expect(errors, Boolean(artifactPath && pathWithin(cwd, artifactPath)), `${label} must be stored within the repository workspace.`);
  }
  if (mp3Path && fs.existsSync(mp3Path) && candidateSha256) expect(errors, sha256File(mp3Path) === candidateSha256, "approved MP3 bytes do not match the audio-manifest checksum.");
  if (renderManifestPath && fs.existsSync(renderManifestPath)) {
    const render = readJson(renderManifestPath);
    const renderScriptPath = typeof render.script === "string" ? path.resolve(cwd, render.script) : null;
    expect(errors, renderScriptPath === paths["narration.md"], "render manifest script path must identify the current narration derivative.");
    if (renderScriptPath && fs.existsSync(renderScriptPath)) expect(errors, validSha256(render.script_sha256) === sha256File(renderScriptPath), "render manifest script checksum must match its declared script file.");
    expect(errors, validSha256(render.script_sha256) === sha256File(paths["narration.md"]), "render manifest script checksum must match the current narration derivative.");
    expect(errors, validSha256(render.audio?.sha256) === candidateSha256, "render manifest MP3 checksum must match the audio manifest.");
    expect(errors, validSha256(render.chapters?.audio_sha256) === candidateSha256, "render manifest chapter checksum must match the audio manifest.");
    expect(errors, Array.isArray(render.chapters?.markers) && render.chapters.markers.length > 0, "render manifest must record embedded chapter markers.");
    if (mp3Path && fs.existsSync(mp3Path) && Array.isArray(render.chapters?.markers) && render.chapters.markers.length > 0) {
      try {
        // The render manifest is a Git-ignored local artifact, but it remains
        // the candidate's required record. Re-probe the sealed MP3 instead of
        // trusting a manually changed marker list at the same manifest path.
        verifyMp3Chapters(mp3Path, render.chapters.markers);
      } catch (error) {
        errors.push(`embedded MP3 chapters must match the approved render manifest: ${error.message}`);
      }
    }
    expect(errors, durationsMatch(render.audio?.duration_seconds, candidate.duration_seconds), "render manifest duration must match the audio manifest.");
    expect(errors, render.audio?.quality?.result === "passed", "render manifest must record a passing audio-quality result.");
    expect(errors, path.resolve(cwd, render.audio?.quality?.report || "") === qualityReportPath, "render manifest quality-report reference must match the approved candidate.");
  }
  if (qualityReportPath && fs.existsSync(qualityReportPath)) {
    const report = readJson(qualityReportPath);
    expect(errors, report.result === "passed", "audio-quality report must pass.");
    expect(errors, path.resolve(cwd, report.manifest || "") === renderManifestPath, "audio-quality report must identify the approved render manifest.");
    expect(errors, path.resolve(cwd, report.output?.path || "") === mp3Path, "audio-quality report must identify the approved MP3.");
    expect(errors, validSha256(report.output?.sha256) === candidateSha256, "audio-quality report checksum must match the approved MP3 bytes.");
    expect(errors, durationsMatch(report.output?.probe?.format?.duration, candidate.duration_seconds), "audio manifest duration must match the audio-quality report's probed MP3 duration.");
  }
  if (chapterReviewPath && fs.existsSync(chapterReviewPath) && candidateSha256) {
    const review = fs.readFileSync(chapterReviewPath, "utf8");
    expect(errors, review.includes(`name="ppl-audio-sha256" content="${candidateSha256}"`), "chapter-review page must identify the approved MP3 checksum.");
  }

  errors.push(...sourceReviewErrors({ episodePath: resolvedEpisode, paths, episode, sourceValidation }));
  expect(errors, sameUtcDate(sourceValidation.checked_at_utc, episode.published_at), "link validation must be recorded on the publication date.");
  expect(errors, !/^## Production notice\b/im.test(showNotes), "show notes must not duplicate the hosting production disclosure.");
  for (const phrase of ["Full candidate has been listened", "No clipped", "chapter markers have been manually reviewed", "FAA/", "Hosting metadata agrees"]) {
    expect(errors, new RegExp(`- \\[x\\] .*${phrase}`, "i").test(qaChecklist), `qa-checklist.md must mark complete: ${phrase}.`);
  }
  return { valid: errors.length === 0, errors };
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = validatePreHosting({ episodePath: options.episode, packageOnly: options.packageOnly });
    if (!result.valid) throw new PreHostingValidationError(result.errors.join("\n"));
    if (options.packageOnly) console.log(`Draft-package shape is consistent for ${path.resolve(options.episode)}. This is not a final pre-hosting, release, or hosting approval.`);
    else console.log(`Pre-hosting validation passed for ${path.resolve(options.episode)}.`);
  } catch (error) {
    console.error(`Pre-hosting validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { APPROVED_DRAFT_PRODUCTION_STATUS, DRAFT_PACKAGE_SHAPE, PreHostingValidationError, durationDisplay, parseArgs, pathWithin, sha256File, sourceReviewErrors, validateDraftPackageShape, validatePreHosting };
