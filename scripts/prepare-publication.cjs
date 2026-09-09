#!/usr/bin/env node
"use strict";

// Prepare a reviewed candidate for hosting without crossing the hosting
// credential boundary. This command deliberately stops at a sealed handoff;
// staging and pull-request creation remain separate, explicit operations.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { createHostingHandoff, verifyHostingHandoff } = require("./prepare-hosting-handoff.cjs");
const { releaseIdentity } = require("./release-identity.cjs");
const { durationDisplay, PreHostingValidationError, validatePreHosting } = require("./validate-pre-hosting.cjs");

class PublicationPreparationError extends Error {}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new PublicationPreparationError(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new PublicationPreparationError(`Missing value for ${token}`);
    values[token.slice(2)] = value;
    index += 1;
  }
  for (const key of ["episode", "published-at", "out"]) if (!values[key]) throw new PublicationPreparationError(`--${key} is required.`);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(values["published-at"]) || Number.isNaN(Date.parse(values["published-at"]))) {
    throw new PublicationPreparationError("--published-at must be a UTC RFC 3339 timestamp such as 2026-09-09T13:00:08Z.");
  }
  return values;
}

function readYaml(filePath) {
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new PublicationPreparationError(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  return document.toJS();
}

function writeTextAtomically(filePath, text) {
  const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try { fs.writeFileSync(temporary, text, { mode: 0o644 }); fs.renameSync(temporary, filePath); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function writeYamlAtomically(filePath, value) {
  writeTextAtomically(filePath, YAML.stringify(value));
}

function sameUtcDate(left, right) {
  return typeof left === "string" && typeof right === "string" && left.slice(0, 10) === right.slice(0, 10);
}

function synchronizeReleaseMetadata({ episode, hosting, sourceValidation, publishedAt }) {
  if (episode.production_contract_version !== 2) {
    throw new PublicationPreparationError("This is a preserved legacy package. Do not reprepare it; run episode:script-review --reset before revising it under the current release contract.");
  }
  if (!sameUtcDate(sourceValidation.checked_at_utc, publishedAt)) throw new PublicationPreparationError("The canonical source-validation report must have passed on the requested publication date.");
  if (episode.source_verification?.relevance_review !== "complete" || sourceValidation.llm_requested !== true) {
    throw new PublicationPreparationError("A completed LLM source-relevance report is required before publication preparation.");
  }
  if (!Number.isFinite(episode.runtime_actual_seconds) || episode.runtime_actual_seconds <= 0) throw new PublicationPreparationError("episode.yaml must record the accepted candidate runtime before publication preparation.");
  let identity;
  try { identity = releaseIdentity({ track: episode.track, id: episode.id, version: episode.version }); }
  catch (error) { throw new PublicationPreparationError(`Invalid release identity: ${error.message}`); }
  const release = hosting.publisher_release || {};
  if (typeof release.description !== "string" || !release.description.trim()) throw new PublicationPreparationError("hosting-metadata.yaml must contain the listener-facing episode description before publication preparation.");
  const nextEpisode = {
    ...episode,
    status: "ready_for_hosting_pr",
    published_at: publishedAt,
    source_verification: { ...episode.source_verification, status: "source_relevance_complete", verified_at_utc: sourceValidation.checked_at_utc, relevance_review: "complete" },
    audio: { ...episode.audio, status: "candidate_rendered_listening_qa_approved", chapter_markers: "embedded_and_ffprobe_validated", publication_day_validation: "passed" },
    hosting: { ...episode.hosting, handoff_status: "ready_for_hosting_pr" },
    release_gates_remaining: [],
  };
  const nextHosting = {
    ...hosting,
    publisher_release: {
      ...release,
      id: episode.id,
      title: episode.title,
      published_at: publishedAt,
      duration: durationDisplay(episode.runtime_actual_seconds),
      number: Number(identity.releaseKey.match(/(\d+)$/)[1]),
      audio: {},
    },
    provenance: { ...hosting.provenance, master_script: "master-script.md", show_notes: "show-notes.md", audio_manifest: "audio-manifest.yaml", source_validation: "link-validation.yaml", content_version: episode.version },
  };
  return { episode: nextEpisode, hosting: nextHosting };
}

function preparePublication({ episodePath, outputDir, publishedAt, cwd = process.cwd() }) {
  const resolvedEpisode = path.resolve(episodePath);
  const episodeYaml = path.join(resolvedEpisode, "episode.yaml");
  const hostingYaml = path.join(resolvedEpisode, "hosting-metadata.yaml");
  const sourceValidationYaml = path.join(resolvedEpisode, "link-validation.yaml");
  if (!fs.existsSync(episodeYaml) || !fs.existsSync(hostingYaml) || !fs.existsSync(sourceValidationYaml)) throw new PublicationPreparationError("The episode package must include episode.yaml, hosting-metadata.yaml, and link-validation.yaml.");
  const originalEpisode = fs.readFileSync(episodeYaml, "utf8");
  const originalHosting = fs.readFileSync(hostingYaml, "utf8");
  try {
    const synchronized = synchronizeReleaseMetadata({ episode: YAML.parse(originalEpisode), hosting: YAML.parse(originalHosting), sourceValidation: readYaml(sourceValidationYaml), publishedAt });
    writeYamlAtomically(episodeYaml, synchronized.episode);
    writeYamlAtomically(hostingYaml, synchronized.hosting);
    const validation = validatePreHosting({ episodePath: resolvedEpisode, cwd });
    if (!validation.valid) throw new PublicationPreparationError(`Pre-hosting validation failed after release preparation:\n${validation.errors.join("\n")}`);
    const handoff = createHostingHandoff({ episodePath: resolvedEpisode, outputDir, cwd });
    verifyHostingHandoff({ outputDir: handoff.outputDir });
    return handoff;
  } catch (error) {
    // Do not leave a package claiming release readiness if any downstream
    // check fails. The handoff builder itself only publishes its output after
    // construction succeeds and never replaces an existing directory.
    writeTextAtomically(episodeYaml, originalEpisode);
    writeTextAtomically(hostingYaml, originalHosting);
    throw error;
  }
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const handoff = preparePublication({ episodePath: options.episode, outputDir: options.out, publishedAt: options["published-at"] });
    console.log(`Prepared and sealed release handoff: ${handoff.outputDir}`);
  } catch (error) {
    const message = error instanceof PublicationPreparationError || error instanceof PreHostingValidationError ? error.message : `Publication preparation failed: ${error.message}`;
    console.error(message);
    process.exitCode = 1;
  }
}

module.exports = { PublicationPreparationError, parseArgs, preparePublication, synchronizeReleaseMetadata };
