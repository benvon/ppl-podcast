#!/usr/bin/env node
"use strict";

// Produce the exact, self-describing directory that is given to the hosting
// repository.  The seal is intentionally made after every pre-hosting gate
// passes, so it binds the release inputs to the reviewed source package rather
// than merely naming files that happened to be nearby.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { PreHostingValidationError, sha256File, validatePreHosting } = require("./validate-pre-hosting.cjs");

const SEAL_FILE = "source-release-seal.yaml";
const HANDOFF_FILES = ["episode.yaml", "show-notes.md", "audio.mp3"];

class HostingHandoffError extends Error {}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new HostingHandoffError(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new HostingHandoffError(`Missing value for ${token}`);
    values[token.slice(2)] = value;
    index += 1;
  }
  if (!values.episode) throw new HostingHandoffError("--episode is required.");
  if (!values.out) throw new HostingHandoffError("--out is required.");
  return values;
}

function readYaml(filePath) {
  let document;
  try { document = YAML.parseDocument(fs.readFileSync(filePath, "utf8")); }
  catch (error) { throw new HostingHandoffError(`Could not read ${filePath}: ${error.message}`); }
  if (document.errors.length) throw new HostingHandoffError(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  return document.toJS();
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch (error) { throw new HostingHandoffError(`Could not read ${filePath}: ${error.message}`); }
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  return value;
}

function sha256Value(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

function listedFiles(directory, { exclude = [] } = {}) {
  const excluded = new Set(exclude);
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !excluded.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function sourcePackageFiles(episodePath) {
  return Object.fromEntries(listedFiles(episodePath, { exclude: [SEAL_FILE] }).map((name) => [name, sha256File(path.join(episodePath, name))]));
}

function releaseEpisode({ episodePath, cwd }) {
  const audioManifest = readYaml(path.join(episodePath, "audio-manifest.yaml"));
  const hosting = readYaml(path.join(episodePath, "hosting-metadata.yaml"));
  const candidate = audioManifest.current_candidate_render || {};
  const candidatePath = path.resolve(cwd, candidate.mp3 || "");
  const renderPath = path.resolve(cwd, candidate.render_manifest || "");
  if (!candidate.mp3 || !fs.existsSync(candidatePath)) throw new HostingHandoffError("Approved candidate MP3 is unavailable.");
  if (!candidate.render_manifest || !fs.existsSync(renderPath)) throw new HostingHandoffError("Approved render manifest is unavailable.");
  const render = readJson(renderPath);
  const markers = render.chapters?.markers;
  if (!Array.isArray(markers) || markers.length === 0) throw new HostingHandoffError("Approved render manifest has no embedded chapter markers.");
  const release = { ...hosting.publisher_release, chapters: markers.map(({ title, start_ms }) => ({ title, start_ms })), chapters_audio_sha256: candidate.sha256 };
  return { candidatePath, release };
}

function sealPayload({ episodePath, outputDir, cwd }) {
  const episode = readYaml(path.join(episodePath, "episode.yaml"));
  const { candidatePath } = releaseEpisode({ episodePath, cwd });
  const handoffFiles = Object.fromEntries(HANDOFF_FILES.map((name) => [name, sha256File(path.join(outputDir, name))]));
  return {
    schema_version: 1,
    episode: { id: episode.id, title: episode.title, version: episode.version, published_at: episode.published_at },
    source_package_files: sourcePackageFiles(episodePath),
    handoff_files: handoffFiles,
    audio: { sha256: sha256File(candidatePath), bytes: fs.statSync(candidatePath).size },
  };
}

function createHostingHandoff({ episodePath, outputDir, cwd = process.cwd() }) {
  const resolvedEpisode = path.resolve(episodePath);
  const resolvedOutput = path.resolve(outputDir);
  if (resolvedOutput === resolvedEpisode || resolvedOutput.startsWith(`${resolvedEpisode}${path.sep}`)) throw new HostingHandoffError("Hosting handoff output must be outside the source episode directory.");
  if (fs.existsSync(resolvedOutput)) throw new HostingHandoffError(`Refusing to replace existing handoff directory: ${resolvedOutput}`);
  const preHosting = validatePreHosting({ episodePath: resolvedEpisode, cwd });
  if (!preHosting.valid) throw new HostingHandoffError(`Pre-hosting validation failed:\n${preHosting.errors.join("\n")}`);
  const { candidatePath, release } = releaseEpisode({ episodePath: resolvedEpisode, cwd });
  const temporary = `${resolvedOutput}.tmp-${process.pid}-${crypto.randomBytes(6).toString("hex")}`;
  try {
    fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true, mode: 0o755 });
    fs.mkdirSync(temporary, { recursive: true, mode: 0o755 });
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify(release), { mode: 0o644 });
    fs.copyFileSync(path.join(resolvedEpisode, "show-notes.md"), path.join(temporary, "show-notes.md"));
    fs.copyFileSync(candidatePath, path.join(temporary, "audio.mp3"));
    const payload = sealPayload({ episodePath: resolvedEpisode, outputDir: temporary, cwd });
    const seal = { schema_version: 1, sealed_at_utc: new Date().toISOString(), payload, payload_sha256: sha256Value(payload) };
    fs.writeFileSync(path.join(temporary, SEAL_FILE), YAML.stringify(seal), { mode: 0o644 });
    fs.renameSync(temporary, resolvedOutput);
    return { outputDir: resolvedOutput, seal };
  } catch (error) {
    fs.rmSync(temporary, { recursive: true, force: true });
    throw error;
  }
}

function verifyHostingHandoff({ outputDir }) {
  const resolvedOutput = path.resolve(outputDir);
  const sealPath = path.join(resolvedOutput, SEAL_FILE);
  if (!fs.existsSync(sealPath) || !fs.statSync(sealPath).isFile()) throw new HostingHandoffError(`Missing ${SEAL_FILE}.`);
  const seal = readYaml(sealPath);
  const payload = seal.payload || {};
  if (seal.schema_version !== 1 || payload.schema_version !== 1) throw new HostingHandoffError("Unsupported hosting-handoff seal schema.");
  if (seal.payload_sha256 !== sha256Value(payload)) throw new HostingHandoffError("Hosting-handoff seal digest does not match its payload.");
  const sealedFiles = payload.handoff_files;
  const sealedNames = sealedFiles && typeof sealedFiles === "object" && !Array.isArray(sealedFiles) ? Object.keys(sealedFiles).sort() : [];
  const requiredNames = [...HANDOFF_FILES].sort();
  if (sealedNames.length !== requiredNames.length || sealedNames.some((name, index) => name !== requiredNames[index])) throw new HostingHandoffError("Hosting-handoff seal must list exactly the required payload files.");
  const expectedEntries = new Set([...sealedNames, SEAL_FILE]);
  const entries = fs.readdirSync(resolvedOutput, { withFileTypes: true });
  for (const entry of entries) {
    if (!expectedEntries.has(entry.name) || !entry.isFile()) throw new HostingHandoffError(`Hosting-handoff contains an unexpected entry: ${entry.name}.`);
  }
  if (entries.length !== expectedEntries.size) throw new HostingHandoffError("Hosting-handoff is missing a sealed payload file.");
  for (const file of HANDOFF_FILES) {
    const expected = sealedFiles[file];
    const filePath = path.join(resolvedOutput, file);
    if (!/^[a-f0-9]{64}$/i.test(expected || "") || !fs.existsSync(filePath) || sha256File(filePath) !== expected) throw new HostingHandoffError(`Hosting-handoff ${file} does not match the sealed bytes.`);
  }
  const audio = payload.audio || {};
  if (audio.sha256 !== payload.handoff_files?.["audio.mp3"] || audio.bytes !== fs.statSync(path.join(resolvedOutput, "audio.mp3")).size) throw new HostingHandoffError("Hosting-handoff audio identity does not match the sealed MP3.");
  return { valid: true, payload };
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = createHostingHandoff({ episodePath: options.episode, outputDir: options.out });
    verifyHostingHandoff({ outputDir: result.outputDir });
    console.log(`Created and verified sealed hosting handoff: ${result.outputDir}`);
  } catch (error) {
    const message = error instanceof PreHostingValidationError || error instanceof HostingHandoffError ? error.message : `Hosting handoff failed: ${error.message}`;
    console.error(message);
    process.exitCode = 1;
  }
}

module.exports = { HANDOFF_FILES, HostingHandoffError, SEAL_FILE, createHostingHandoff, sha256Value, verifyHostingHandoff };
