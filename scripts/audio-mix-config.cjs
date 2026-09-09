"use strict";

// The mix plan is an episode artifact, not an ad-hoc renderer invocation.  It
// keeps a release's music treatment reviewable and lets pre-hosting validation
// prove that the assembled MP3 used the plan selected for that episode.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

class AudioMixConfigError extends Error {}

const MUSIC_KEYS = new Set([
  "enabled",
  "source",
  "base_gain_db",
  "voice_gain_db",
  "level_transition_seconds",
  "intro_lead_seconds",
  "intro_tail_seconds",
  "intro_fade_seconds",
  "outro_tail_seconds",
  "outro_fade_seconds",
]);

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function numberInRange(value, name, minimum, maximum) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum || value > maximum) {
    throw new AudioMixConfigError(`${name} must be a number between ${minimum} and ${maximum}.`);
  }
  return value;
}

function pathWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function loadAudioMixConfig(configPath, { repoRoot = process.cwd(), required = false } = {}) {
  const resolvedConfig = path.resolve(configPath);
  if (!fs.existsSync(resolvedConfig)) {
    if (required) throw new AudioMixConfigError(`Missing required audio mix configuration: ${resolvedConfig}`);
    return null;
  }
  if (!fs.lstatSync(resolvedConfig).isFile()) throw new AudioMixConfigError(`Audio mix configuration must be a regular file: ${resolvedConfig}`);

  let document;
  try { document = YAML.parseDocument(fs.readFileSync(resolvedConfig, "utf8")); }
  catch (error) { throw new AudioMixConfigError(`Could not read ${resolvedConfig}: ${error.message}`); }
  if (document.errors.length) throw new AudioMixConfigError(`Invalid YAML in ${resolvedConfig}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value) || value.schema_version !== 1 || !value.music || typeof value.music !== "object" || Array.isArray(value.music)) {
    throw new AudioMixConfigError(`${resolvedConfig} must contain schema_version: 1 and a music object.`);
  }
  for (const key of Object.keys(value.music)) if (!MUSIC_KEYS.has(key)) throw new AudioMixConfigError(`${resolvedConfig} has an unsupported music field: ${key}.`);
  if (typeof value.music.enabled !== "boolean") throw new AudioMixConfigError(`${resolvedConfig} music.enabled must be true or false.`);
  if (!value.music.enabled) return { enabled: false, configPath: resolvedConfig, configSha256: sha256File(resolvedConfig) };

  for (const key of MUSIC_KEYS) if (key !== "enabled" && value.music[key] === undefined) throw new AudioMixConfigError(`${resolvedConfig} music.${key} is required when music is enabled.`);
  if (typeof value.music.source !== "string" || !value.music.source) throw new AudioMixConfigError(`${resolvedConfig} music.source must be a non-empty path relative to audio-mix.yaml.`);
  const resolvedRoot = fs.realpathSync(repoRoot);
  const unresolvedSourcePath = path.resolve(path.dirname(resolvedConfig), value.music.source);
  const sourcePath = fs.existsSync(unresolvedSourcePath) ? fs.realpathSync(unresolvedSourcePath) : unresolvedSourcePath;
  if (!pathWithin(resolvedRoot, sourcePath) || !fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    throw new AudioMixConfigError(`${resolvedConfig} music.source must identify an existing file within the repository.`);
  }
  return {
    enabled: true,
    configPath: resolvedConfig,
    configSha256: sha256File(resolvedConfig),
    path: sourcePath,
    source: value.music.source,
    sourceSha256: sha256File(sourcePath),
    gainDb: numberInRange(value.music.base_gain_db, "music.base_gain_db", -60, 0),
    voiceGainDb: numberInRange(value.music.voice_gain_db, "music.voice_gain_db", -60, 0),
    levelTransitionSeconds: numberInRange(value.music.level_transition_seconds, "music.level_transition_seconds", 0, 60),
    introLeadSeconds: numberInRange(value.music.intro_lead_seconds, "music.intro_lead_seconds", 0, 120),
    introTailSeconds: numberInRange(value.music.intro_tail_seconds, "music.intro_tail_seconds", 0, 120),
    introFadeSeconds: numberInRange(value.music.intro_fade_seconds, "music.intro_fade_seconds", 0, 120),
    outroTailSeconds: numberInRange(value.music.outro_tail_seconds, "music.outro_tail_seconds", 0, 120),
    outroFadeSeconds: numberInRange(value.music.outro_fade_seconds, "music.outro_fade_seconds", 0, 120),
  };
}

function audioMixMatchesManifest(mix, renderMusic) {
  if (!mix) return renderMusic === null || renderMusic === undefined;
  if (!mix.enabled) return renderMusic === null || renderMusic === undefined;
  const intro = renderMusic?.cue_plan?.intro;
  const outro = renderMusic?.cue_plan?.outro;
  return Boolean(renderMusic)
    && renderMusic.source_sha256 === mix.sourceSha256
    && renderMusic.base_gain_db === mix.gainDb
    && renderMusic.voice_gain_db === mix.voiceGainDb
    && renderMusic.level_transition_seconds === mix.levelTransitionSeconds
    && intro?.lead_seconds === mix.introLeadSeconds
    && intro?.continuation_seconds === mix.introTailSeconds
    && intro?.fade_seconds === mix.introFadeSeconds
    && outro?.continuation_seconds === mix.outroTailSeconds
    && outro?.fade_seconds === mix.outroFadeSeconds;
}

module.exports = { AudioMixConfigError, audioMixMatchesManifest, loadAudioMixConfig, sha256File };
