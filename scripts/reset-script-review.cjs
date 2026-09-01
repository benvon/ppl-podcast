#!/usr/bin/env node
"use strict";

// Script edits invalidate downstream human and machine review. This tool makes
// that transition explicit and fingerprints the current master script.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

class ScriptReviewStateError extends Error {}

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, "utf8"));
}

function writeYaml(filePath, value) {
  fs.writeFileSync(filePath, YAML.stringify(value), "utf8");
}

function resolveEpisode(episodePath) {
  const resolved = path.resolve(episodePath);
  for (const file of ["episode.yaml", "audio-manifest.yaml", "hosting-metadata.yaml", "master-script.md"]) {
    const candidate = path.join(resolved, file);
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) throw new ScriptReviewStateError(`Episode package is missing ${file}.`);
  }
  return resolved;
}

function resetScriptReview({ episodePath, reason = "The master script changed after its prior review." }) {
  const resolved = resolveEpisode(episodePath);
  const episodePathname = path.join(resolved, "episode.yaml");
  const audioPathname = path.join(resolved, "audio-manifest.yaml");
  const hostingPathname = path.join(resolved, "hosting-metadata.yaml");
  const scriptSha256 = sha256Text(fs.readFileSync(path.join(resolved, "master-script.md"), "utf8"));
  const episode = readYaml(episodePathname);
  const audio = readYaml(audioPathname);
  const hosting = readYaml(hostingPathname);

  const candidate = audio.current_candidate_render;
  if (candidate?.sha256 && !audio.superseded_candidates?.some((entry) => entry.sha256 === candidate.sha256)) {
    audio.superseded_candidates = [...(audio.superseded_candidates || []), { ...candidate, superseded_reason: reason }];
  }
  audio.status = "not_rendered";
  audio.publication_day_validation = "pending";
  audio.reason = `${reason} Render, listening QA, chapter review, and publication-day validation must be repeated.`;
  audio.current_candidate_render = null;
  if (audio.chapter_markers) {
    audio.chapter_markers.status = "pending_render";
    audio.chapter_markers.audio_sha256 = null;
    audio.chapter_markers.review_page = null;
  }

  episode.status = "editorial_review_pending";
  episode.runtime_actual_seconds = null;
  episode.audio = { ...(episode.audio || {}), status: "not_rendered" };
  episode.source_verification = { ...(episode.source_verification || {}), status: "source_relevance_pending", verified_at_utc: null, relevance_review: "pending" };
  episode.review = { ...(episode.review || {}), editorial_status: "reapproval_required", editorial_script_sha256: null, pending_script_sha256: scriptSha256 };

  hosting.handoff_status = "pending_script_review";
  writeYaml(episodePathname, episode);
  writeYaml(audioPathname, audio);
  writeYaml(hostingPathname, hosting);
  return { scriptSha256, episodePath: resolved };
}

function approveScriptReview({ episodePath }) {
  const resolved = resolveEpisode(episodePath);
  const episodePathname = path.join(resolved, "episode.yaml");
  const episode = readYaml(episodePathname);
  if (episode.source_verification?.relevance_review !== "complete") throw new ScriptReviewStateError("Source-relevance review must be complete before recording editorial approval.");
  const scriptSha256 = sha256Text(fs.readFileSync(path.join(resolved, "master-script.md"), "utf8"));
  episode.status = "source_relevance_review_complete";
  episode.review = { ...(episode.review || {}), editorial_status: "script_approved", editorial_script_sha256: scriptSha256 };
  delete episode.review.pending_script_sha256;
  writeYaml(episodePathname, episode);
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

module.exports = { ScriptReviewStateError, approveScriptReview, resetScriptReview, sha256Text };
