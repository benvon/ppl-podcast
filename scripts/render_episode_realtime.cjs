#!/usr/bin/env node
/**
 * Render a speaker-labeled PPL podcast script with OpenAI Realtime.
 *
 * This renderer deliberately uses one bounded WebSocket session per segment.
 * That makes long work resumable and permits the Instructor, Learner, and
 * Announcer to use different voices. It never reads, logs, or writes the API key.
 */

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const WebSocket = require("ws");
const YAML = require("yaml");
const { analyzeRenderedAudio, fadeSegmentPcm } = require("./audio-quality.cjs");
const { deriveNarration } = require("./derive-narration.cjs");
const { sourceRelevanceResultValid, sourceValidationInputHashes, validationCoverageErrors } = require("./source-validation-contract.cjs");

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const SPEAKER_RE = /^\*\*(INSTRUCTOR|LEARNER|ANNOUNCER):\*\*$/;
const SECTION_RE = /^#+\s+(?:\[\d{2}:\d{2}\]\s+)?(.+?)\s*$/;
// Keep the legacy production-status prefix for older scripts; new packages
// keep mutable workflow state exclusively in episode.yaml.
const IGNORED_PREFIXES = ["#", "[Source:", "[Claim type:", "**Version:", "**Target runtime:", "**Speakers:", "**Production status:"];
const SAFE_ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const SAFE_MODEL_RE = /^[a-z0-9][a-z0-9.-]*$/;
const SAFE_VOICE_RE = /^[a-z][a-z-]*$/;
const REQUIRED_NOTICE = "This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor. This podcast is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.";
const LEGACY_REQUIRED_NOTICE = "This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor and is not flight instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.";
const DISCLAIMER_SECTION = "disclaimer";
const LEGACY_DISCLAIMER_SECTION = "required production notice";
// Preserve familiar initialisms in their listener-facing form. Hyphenating
// their letters proved to create audible hitches and unnatural emphasis in
// otherwise continuous speech. Only use this map for terms whose written form
// needs a genuinely phonetic correction from the voice model.
const PRONUNCIATION_TRANSFORMS = Object.freeze({
  AI: "artificial intelligence",
  PHAK: "pee hack",
  ASOS: "AY-sohs",
  AWOS: "AY-wahs",
  ATIS: "AY-tis",
  METAR: "MEE-tar",
  METARs: "MEE-tars",
  TAF: "taf",
  TAFs: "tafs",
  SIGMET: "sig MET",
  SIGMETs: "sig METs",
  AIRMET: "air MET",
  AIRMETs: "air METs",
  "1800wxbrief.com": "one eight-hundred w x brief dot com",
});
const PRONUNCIATION_GUIDANCE = Object.freeze({
  envelope: "When the script uses the word \"envelope,\" pronounce it as the common noun, with first-syllable stress: \"EN-vuh-lope.\" Do not say this instruction aloud.",
  SPECI: "Pronounce \"SPECI\" as one connected word: \"speh-see,\" with only light first-syllable stress. Do not split it into separate syllables or spell it out. Do not say this instruction aloud.",
  SPECIs: "Pronounce \"SPECIs\" as one connected word: \"speh-sees,\" with only light first-syllable stress. Do not split it into separate syllables or spell it out. Do not say this instruction aloud.",
});
const DEFAULTS = {
  model: "gpt-realtime-2.1",
  instructorVoice: "marin",
  learnerVoice: "cedar",
  announcerVoice: "ballad",
  maxWords: 240,
  continuityCharacters: 240,
  timeoutSeconds: 120,
  leadInMs: 1000,
  continuedTurnMs: 120,
  speakerChangeMs: 220,
  sectionChangeMs: 550,
  stitchFadeMs: 8,
  musicBedGainDb: -24,
  musicVoiceGainDb: -30,
  musicLevelTransitionSeconds: 0.15,
  musicIntroLeadSeconds: 10,
  musicIntroTailSeconds: 5,
  musicIntroFadeSeconds: 0.5,
  musicOutroTailSeconds: 10,
  musicOutroFadeSeconds: 5,
};
const STYLE = {
  INSTRUCTOR: "Calm, engaged, and practical flight instructor. Use natural, purposeful intonation and modest emphasis on safety-critical words and contrasts. Sound alert and conversational, never theatrical. Speak at a steady, unhurried study pace without drawn-out words or post-processing speed changes.",
  LEARNER: "Prepared adult learner: attentive and naturally curious, with restrained conversational inflection. Sound thoughtful rather than performative. Speak at a steady, unhurried study pace without drawn-out words or post-processing speed changes.",
  ANNOUNCER: "Upbeat, clear, and welcoming podcast announcer. Sound confident and warm, with light forward energy. Never clownish, theatrical, or promotional. Use natural emphasis; do not over-stress individual words. Keep transitions brief and let the lesson remain the focus. Speak at a steady, natural pace without drawn-out words or post-processing speed changes.",
};

class RenderError extends Error {}

function assertNarrationInput(scriptPath) {
  if (path.basename(scriptPath) !== "narration.md") throw new RenderError("Render from the current narration.md derivative, not master-script.md.");
  const masterScriptPath = path.join(path.dirname(scriptPath), "master-script.md");
  if (!fs.existsSync(masterScriptPath) || !fs.statSync(masterScriptPath).isFile()) throw new RenderError("Render input must have a sibling master-script.md from which narration.md is derived.");
  const narration = fs.readFileSync(scriptPath, "utf8");
  const expected = deriveNarration(fs.readFileSync(masterScriptPath, "utf8"));
  if (narration !== expected) throw new RenderError("narration.md is not the current derivative of master-script.md. Regenerate it before rendering.");
}

function assertSourceRelevanceApproved(scriptPath) {
  const episodePath = path.join(path.dirname(scriptPath), "episode.yaml");
  const validationPath = path.join(path.dirname(scriptPath), "link-validation.yaml");
  if (!fs.existsSync(episodePath)) throw new RenderError("Render input must be stored in an episode package with episode.yaml so source-review status can be verified.");
  if (!fs.existsSync(validationPath)) throw new RenderError("Source-relevance review must pass before rendering. Run sources:validate --require-llm and record its completion in episode.yaml.");
  if (fs.existsSync(`${validationPath}.in-progress`) || fs.existsSync(`${validationPath}.in-progress.recovering`)) throw new RenderError("Source-relevance validation is in progress, recovering, or was interrupted. Complete a fresh validation run before rendering.");

  let episode; let validation;
  try {
    episode = YAML.parse(fs.readFileSync(episodePath, "utf8"));
    validation = YAML.parse(fs.readFileSync(validationPath, "utf8"));
  } catch (error) {
    throw new RenderError(`Could not read source-review records: ${error.message}`);
  }

  if (episode?.source_verification?.relevance_review !== "complete") {
    throw new RenderError("Source-relevance review must be marked complete in episode.yaml before rendering.");
  }
  if (validation?.llm_requested !== true || validation?.claim_mapping?.valid !== true || validation?.show_notes_mapping?.valid !== true) {
    throw new RenderError("link-validation.yaml does not record a passing LLM source-relevance review.");
  }
  const currentInputs = sourceValidationInputHashes(path.dirname(scriptPath));
  if (!Object.entries(currentInputs).every(([name, digest]) => validation?.input_sha256?.[name] === digest)) {
    throw new RenderError("link-validation.yaml is not bound to the current sources, claims, and show-notes inputs. Run a fresh source-relevance review before rendering.");
  }
  const coverageErrors = validationCoverageErrors(path.dirname(scriptPath), validation);
  if (coverageErrors.length) throw new RenderError(coverageErrors[0]);

  const sourceResults = Array.isArray(validation.results) ? validation.results : [];
  if (!sourceResults.length || sourceResults.some((result) => !sourceRelevanceResultValid(result))) {
    throw new RenderError("link-validation.yaml contains unresolved source-relevance findings; resolve them before rendering.");
  }

  const showNotesResults = Array.isArray(validation.show_notes_results) ? validation.show_notes_results : [];
  if (showNotesResults.some((result) => result?.citation_target?.valid !== true || result?.link?.valid !== true || (result?.content_attestation && result.content_attestation.valid !== true))) {
    throw new RenderError("link-validation.yaml contains unresolved show-notes findings; resolve them before rendering.");
  }
  const masterScript = fs.readFileSync(path.join(path.dirname(scriptPath), "master-script.md"), "utf8");
  if (episode?.review?.editorial_status !== "script_approved" || episode?.review?.editorial_script_sha256 !== sha256(masterScript)) {
    throw new RenderError("Editorial approval must be recorded for the current master-script.md bytes before rendering. Run episode:script-review --approve after review.");
  }
}

function usage() {
  console.log(`Usage:\n  node scripts/render_episode_realtime.cjs --script PATH --audio-dir PATH --episode-id core-03 [options]\n\nRequired modes:\n  --render-only                 Render selected segments into a resumable work directory.\n  --assemble-only               Assemble existing selected segments into a WAV master and MP3.\n\nOptions:\n  --work-dir PATH               Segment directory (default: audio-dir/<id>-realtime-<timestamp>.segments)\n  --timestamp YYYYMMDDTHHMMSSZ  Output timestamp (default: current UTC time)\n  --segment-start N             First segment (default: 1)\n  --segment-end N               Last segment (default: final segment)\n  --speaker instructor|learner|announcer  Render and assemble only one speaker's turns; cannot be combined with a segment range.\n  --model NAME                  Default: ${DEFAULTS.model}\n  --instructor-voice NAME       Default: ${DEFAULTS.instructorVoice}\n  --learner-voice NAME          Default: ${DEFAULTS.learnerVoice}\n  --announcer-voice NAME        Default: ${DEFAULTS.announcerVoice}\n  --max-words-per-segment N     Default: ${DEFAULTS.maxWords}\n  --segment-timeout SECONDS     Default: ${DEFAULTS.timeoutSeconds}\n  --music-bed PATH              Mix this source track under Podcast introduction and Outro.\n  --music-bed-gain-db DB        Full-level music gain; default: ${DEFAULTS.musicBedGainDb} dB.\n  --music-voice-gain-db DB      Steady music gain under announcer voice; default: ${DEFAULTS.musicVoiceGainDb} dB.\n  --music-level-transition-seconds N  Level-change ramp; default: ${DEFAULTS.musicLevelTransitionSeconds}.\n  --music-intro-lead-seconds N  Music-only intro lead; default: ${DEFAULTS.musicIntroLeadSeconds}.\n  --music-intro-tail-seconds N  Full-level continuation after the Podcast introduction voice; default: ${DEFAULTS.musicIntroTailSeconds}.\n  --music-intro-fade-seconds N  Fade after the intro continuation; default: ${DEFAULTS.musicIntroFadeSeconds}.\n  --music-outro-tail-seconds N  Full-level music continuation after the Outro voice; default: ${DEFAULTS.musicOutroTailSeconds}.\n  --music-outro-fade-seconds N  Fade after the outro tail; default: ${DEFAULTS.musicOutroFadeSeconds}.\n  --format mp3|wav              Default: mp3\n  --dry-run                     Validate script and print the render plan without API calls.\n\nMusic holds a steady reduced level under announcer voice, then returns to its full level for the continuation and fade. Run both render modes separately. Interrupted --render-only work may be resumed safely when its settings match.`);
}

function parseArgs(argv) {
  const values = {};
  const flags = new Set(["render-only", "assemble-only", "dry-run"]);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new RenderError(`Unexpected argument: ${token}`);
    const name = token.slice(2);
    if (flags.has(name)) { values[name] = true; continue; }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new RenderError(`Missing value for --${name}`);
    values[name] = value;
    index += 1;
  }
  if (!values.script || !values["audio-dir"] || !values["episode-id"]) throw new RenderError("--script, --audio-dir, and --episode-id are required.");
  if (Boolean(values["render-only"]) === Boolean(values["assemble-only"]) && !values["dry-run"]) throw new RenderError("Choose exactly one of --render-only or --assemble-only.");
  if (values.format && !["mp3", "wav"].includes(values.format)) throw new RenderError("--format must be mp3 or wav.");
  if (values.speaker && !["instructor", "learner", "announcer"].includes(values.speaker)) throw new RenderError("--speaker must be instructor, learner, or announcer.");
  if (values.speaker && (values["segment-start"] || values["segment-end"])) throw new RenderError("--speaker cannot be combined with --segment-start or --segment-end.");
  return values;
}

function positiveInteger(value, label, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < 1) throw new RenderError(`${label} must be a positive integer.`);
  return Number(value);
}

function nonNegativeNumber(value, label, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+(?:\.\d+)?$/.test(value)) throw new RenderError(`${label} must be a non-negative number.`);
  return Number(value);
}

function boundedNumber(value, label, fallback, minimum, maximum) {
  if (value === undefined) return fallback;
  if (!/^-?\d+(?:\.\d+)?$/.test(value) || Number(value) < minimum || Number(value) > maximum) throw new RenderError(`${label} must be between ${minimum} and ${maximum}.`);
  return Number(value);
}

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function utcTimestamp() { return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); }
function ensureDir(directory) { fs.mkdirSync(directory, { recursive: true }); }
function writeAtomic(target, body) { const temporary = `${target}.${process.pid}.tmp`; fs.writeFileSync(temporary, body); fs.renameSync(temporary, target); }
function cleanText(value) { return value.replace(/\*\*/g, "").replace(/\s+/g, " ").trim(); }
function escapedTerm(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function spokenText(value) {
  return Object.entries(PRONUNCIATION_TRANSFORMS).reduce((spoken, [term, pronunciation]) => spoken.replace(new RegExp(`\\b${escapedTerm(term)}\\b`, "g"), pronunciation), value);
}
function pronunciationGuidance(value) {
  return Object.entries(PRONUNCIATION_GUIDANCE).filter(([term]) => new RegExp(`\\b${term}\\b`, "i").test(value)).map(([, guidance]) => guidance).join("\n");
}

function splitText(text, maxWords) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const pieces = []; let current = []; let currentWords = 0;
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/).filter(Boolean);
    if (words.length > maxWords) {
      if (current.length) { pieces.push(current.join(" ")); current = []; currentWords = 0; }
      for (let start = 0; start < words.length; start += maxWords) pieces.push(words.slice(start, start + maxWords).join(" "));
    } else if (current.length && currentWords + words.length > maxWords) {
      pieces.push(current.join(" ")); current = [sentence.trim()]; currentWords = words.length;
    } else { current.push(sentence.trim()); currentWords += words.length; }
  }
  if (current.length) pieces.push(current.join(" "));
  return pieces;
}

function parseScript(scriptPath, maxWords) {
  const lines = fs.readFileSync(scriptPath, "utf8").split(/\r?\n/);
  const turns = []; let speaker = null; let section = ""; let sectionTitle = ""; let paragraphs = [];
  const flush = () => { if (speaker && paragraphs.length) { const text = cleanText(paragraphs.join(" ")); if (text) turns.push({ speaker, text, section, sectionTitle }); } paragraphs = []; };
  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(SECTION_RE);
    if (heading) { flush(); sectionTitle = heading[1].trim(); section = sectionTitle.toLowerCase(); continue; }
    const speakerMatch = line.match(SPEAKER_RE);
    if (speakerMatch) { flush(); speaker = speakerMatch[1]; continue; }
    if (!speaker || !line || IGNORED_PREFIXES.some((prefix) => line.startsWith(prefix))) continue;
    paragraphs.push(line);
  }
  flush();
  if (!turns.length) throw new RenderError("No dialogue found. Use exact **INSTRUCTOR:**, **LEARNER:**, or **ANNOUNCER:** labels.");
  const segments = [];
  for (const turn of turns) for (const text of splitText(turn.text, maxWords)) segments.push({ index: segments.length + 1, ...turn, text });
  validateFrontMatter(segments);
  return segments;
}

function validateFrontMatter(segments) {
  const opening = segments.filter((segment) => segment.section === "opening").map((segment) => segment.index);
  const notice = segments.filter((segment) => [DISCLAIMER_SECTION, LEGACY_DISCLAIMER_SECTION].includes(segment.section));
  if (!opening.length || opening[0] !== 1) throw new RenderError("The first spoken segment must be in an 'Opening' section.");
  if (!notice.length || notice[0].index !== opening.at(-1) + 1) throw new RenderError("A 'Disclaimer' section must immediately follow the final opening segment.");
  const noticeText = notice.map((segment) => segment.text).join(" ");
  if (![REQUIRED_NOTICE, LEGACY_REQUIRED_NOTICE].some((approved) => noticeText.startsWith(approved))) throw new RenderError("The required production notice must begin immediately after the opening and match an approved public-distribution text.");
}

function contextFor(segments, position, characters) {
  const context = [];
  if (position > 0) context.push(`Previous ${segments[position - 1].speaker.toLowerCase()} line (context only; do not speak it): ${segments[position - 1].text.slice(-characters)}`);
  if (position + 1 < segments.length) context.push(`Next ${segments[position + 1].speaker.toLowerCase()} line (context only; do not speak it): ${segments[position + 1].text.slice(0, characters)}`);
  return context.join("\n") || "No adjacent dialogue.";
}

function makeWav(pcm) {
  const header = Buffer.alloc(44); const byteRate = SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8; const blockAlign = CHANNELS * BITS_PER_SAMPLE / 8;
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8); header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(CHANNELS, 22); header.writeUInt32LE(SAMPLE_RATE, 24); header.writeUInt32LE(byteRate, 28); header.writeUInt16LE(blockAlign, 32); header.writeUInt16LE(BITS_PER_SAMPLE, 34); header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function readOwnWav(wavPath) {
  const buffer = fs.readFileSync(wavPath);
  if (buffer.length < 44 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE" || buffer.readUInt16LE(20) !== 1 || buffer.readUInt16LE(22) !== CHANNELS || buffer.readUInt32LE(24) !== SAMPLE_RATE || buffer.readUInt16LE(34) !== BITS_PER_SAMPLE || buffer.toString("ascii", 36, 40) !== "data") throw new RenderError(`Unexpected WAV format: ${wavPath}`);
  const length = buffer.readUInt32LE(40); if (length !== buffer.length - 44) throw new RenderError(`Invalid WAV data length: ${wavPath}`);
  return buffer.subarray(44);
}

function silence(milliseconds) { return Buffer.alloc(Math.round(SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8 * milliseconds / 1000)); }
function durationSeconds(pcmBytes) { return pcmBytes / (SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8); }

function wsRender({ model, voice, instructions, text, timeoutMs }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new RenderError("OPENAI_API_KEY is required in the environment. Load it with direnv or another secret manager; do not place it in a command argument or project file.");
  const url = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`;
  return new Promise((resolve, reject) => {
    let settled = false; let updated = false; const chunks = []; let responseUsage = null;
    const finish = (error, value) => { if (settled) return; settled = true; clearTimeout(timer); try { socket.close(); } catch (_) {} if (error) reject(error); else resolve(value); };
    const timer = setTimeout(() => finish(new RenderError(`Realtime segment exceeded ${Math.round(timeoutMs / 1000)} seconds.`)), timeoutMs);
    const socket = new WebSocket(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    socket.on("error", () => finish(new RenderError("Realtime WebSocket connection failed.")));
    socket.on("message", (raw) => {
      let event;
      try { event = JSON.parse(raw.toString()); } catch (_) { finish(new RenderError("Realtime service returned an unreadable event.")); return; }
      if (event.type === "error") { finish(new RenderError(`Realtime request failed: ${event.error && event.error.message ? event.error.message : "unknown service error"}`)); return; }
      if (event.type === "session.updated" && !updated) {
        updated = true;
        socket.send(JSON.stringify({ type: "response.create", response: { conversation: "none", output_modalities: ["audio"], instructions: `${instructions}\n\n${text}`, audio: { output: { format: { type: "audio/pcm", rate: SAMPLE_RATE }, voice } } } }));
      } else if (event.type === "response.output_audio.delta" && event.delta) {
        chunks.push(Buffer.from(event.delta, "base64"));
      } else if (event.type === "response.done") {
        responseUsage = event.response && event.response.usage ? event.response.usage : null;
        const pcm = Buffer.concat(chunks);
        if (!pcm.length) { finish(new RenderError("Realtime response completed without audio.")); return; }
        finish(null, { pcm, usage: responseUsage });
      }
    });
    socket.on("open", () => socket.send(JSON.stringify({ type: "session.update", session: { type: "realtime", instructions, audio: { output: { format: { type: "audio/pcm", rate: SAMPLE_RATE }, voice } } } })));
  });
}

function numeric(object, key) { return object && Number.isFinite(object[key]) ? object[key] : 0; }
function estimateUsageCost(usages) {
  const total = { input_text_tokens: 0, input_audio_tokens: 0, cached_input_tokens: 0, output_text_tokens: 0, output_audio_tokens: 0 };
  for (const usage of usages.filter(Boolean)) {
    const input = usage.input_token_details || {}; const output = usage.output_token_details || {};
    total.input_text_tokens += numeric(input, "text_tokens"); total.input_audio_tokens += numeric(input, "audio_tokens"); total.cached_input_tokens += numeric(input, "cached_tokens"); total.output_text_tokens += numeric(output, "text_tokens"); total.output_audio_tokens += numeric(output, "audio_tokens");
  }
  const estimated_usd = (total.input_text_tokens * 4 + total.input_audio_tokens * 32 + total.cached_input_tokens * 0.4 + total.output_text_tokens * 24 + total.output_audio_tokens * 64) / 1_000_000;
  return { rates_usd_per_million_tokens: { input_text: 4, input_audio: 32, cached_input: 0.4, output_text: 24, output_audio: 64 }, tokens: total, estimated_usd: Number(estimated_usd.toFixed(6)), note: "Estimate calculated from the API response usage fields available to this renderer. It excludes token categories not reported in those fields and is not an invoice." };
}

function settingsFor(options, scriptHash) {
  // Music is an assembly choice recorded in the output manifest. Keeping it
  // out of the segment settings lets a previously rendered voice sample be
  // reused for a dry mix, a music mix, or a revised bed level.
  return { renderer: "openai-realtime", renderer_version: 12, model: options.model, voices: options.voices, audio: { format: "pcm_s16le", sample_rate_hz: SAMPLE_RATE, channels: CHANNELS, output_speed: "native_default_unset", stitch_fade_ms: options.stitchFadeMs }, music: null, pronunciation_transforms: PRONUNCIATION_TRANSFORMS, pronunciation_guidance: PRONUNCIATION_GUIDANCE, script_sha256: scriptHash, max_words_per_segment: options.maxWords, continuity_context_characters: options.continuityCharacters, spacing_ms: options.spacing, style: STYLE };
}

function establishSettings(workDir, settings) {
  ensureDir(workDir); const target = path.join(workDir, "render-settings.json"); const next = `${JSON.stringify(settings, null, 2)}\n`;
  if (fs.existsSync(target)) {
    const existing = JSON.parse(fs.readFileSync(target, "utf8"));
    const { script_sha256: existingScriptHash, spacing_ms: existingSpacing, ...existingRenderSettings } = existing;
    const { script_sha256: nextScriptHash, spacing_ms: nextSpacing, ...nextRenderSettings } = settings;
    if (JSON.stringify(existingRenderSettings) !== JSON.stringify(nextRenderSettings)) throw new RenderError(`Render settings differ from ${target}. Choose a new --work-dir to avoid mixing incompatible segments.`);
    if (existingScriptHash !== nextScriptHash) writeAtomic(target, next);
    return;
  }
  writeAtomic(target, next);
}

function partBase(workDir, segment) { return path.join(workDir, `${String(segment.index).padStart(3, "0")}-${segment.speaker.toLowerCase()}`); }
function segmentInstruction(segment, context) { const guidance = pronunciationGuidance(segment.text); return `${STYLE[segment.speaker]}\nYou are the ${segment.speaker[0] + segment.speaker.slice(1).toLowerCase()} in a public educational private-pilot study podcast. Read only the line following the marker READ EXACTLY. Do not add a greeting, label, preface, explanation, or closing. Keep technical terminology exact. Vary stress and cadence naturally when recurring technical terms appear; do not turn them into catchphrases.${guidance ? `\n${guidance}` : ""}\n\n${context}\n\nREAD EXACTLY:`; }
function renderInputHash(segments, segment, options) {
  const position = segments.findIndex((candidate) => candidate.index === segment.index);
  const input = { model: options.model, voice: options.voices[segment.speaker.toLowerCase()], instructions: segmentInstruction(segment, contextFor(segments, position, options.continuityCharacters)), text: spokenText(segment.text) };
  return sha256(JSON.stringify(input));
}
function reusableSegment(record, expectedRenderInputHash) {
  return Boolean(record.render_input_sha256) && record.render_input_sha256 === expectedRenderInputHash;
}

function assertVerifiedSidecar(record, segment, workDir) {
  if (!record.render_input_sha256) {
    const base = partBase(workDir, segment);
    throw new RenderError(`Rendered segment ${segment.index} has an unverified legacy sidecar. Remove ${base}.wav and ${base}.usage.json, then run --render-only for the selected range.`);
  }
}

function assertCurrentRenderInput(record, segments, segment, options, workDir) {
  assertVerifiedSidecar(record, segment, workDir);
  if (record.render_input_sha256 !== renderInputHash(segments, segment, options)) {
    throw new RenderError(`Rendered segment ${segment.index} does not match the current narration input. Run --render-only for the selected range before assembly.`);
  }
}

function usageRecordFor(segment, sourceTextHash, inputHash, result) {
  return {
    segment_index: segment.index,
    speaker: segment.speaker,
    section: segment.section,
    source_text_sha256: sourceTextHash,
    render_input_sha256: inputHash,
    generated_at_utc: new Date().toISOString(),
    pcm_bytes: result.pcm.length,
    duration_seconds: Number(durationSeconds(result.pcm.length).toFixed(3)),
    response_usage: result.usage,
  };
}

async function renderSegments(segments, selected, options, workDir) {
  const allUsage = [];
  for (const segment of selected) {
    const wavPath = `${partBase(workDir, segment)}.wav`; const usagePath = `${partBase(workDir, segment)}.usage.json`;
    const sourceTextHash = sha256(segment.text); const inputHash = renderInputHash(segments, segment, options);
    const hasWav = fs.existsSync(wavPath); const hasUsage = fs.existsSync(usagePath);
    if (hasWav && hasUsage) {
      const record = JSON.parse(fs.readFileSync(usagePath, "utf8"));
      assertVerifiedSidecar(record, segment, workDir);
      if (reusableSegment(record, inputHash)) { console.log(`Reusing segment ${segment.index}/${segments.length}: ${segment.speaker}`); allUsage.push(record.response_usage); continue; }
      console.log(`Re-rendering changed segment ${segment.index}/${segments.length}: ${segment.speaker} (${segment.text.split(/\s+/).length} words)`);
    }
    if (hasWav !== hasUsage) throw new RenderError(`Incomplete existing segment ${segment.index}; remove only its matching files or choose a new work directory.`);
    const position = segments.findIndex((candidate) => candidate.index === segment.index);
    console.log(`Rendering segment ${segment.index}/${segments.length}: ${segment.speaker} (${segment.text.split(/\s+/).length} words)`);
    const result = await wsRender({ model: options.model, voice: options.voices[segment.speaker.toLowerCase()], instructions: segmentInstruction(segment, contextFor(segments, position, options.continuityCharacters)), text: spokenText(segment.text), timeoutMs: options.timeoutSeconds * 1000 });
    writeAtomic(wavPath, makeWav(result.pcm));
    const record = usageRecordFor(segment, sourceTextHash, inputHash, result);
    writeAtomic(usagePath, `${JSON.stringify(record, null, 2)}\n`); allUsage.push(result.usage);
  }
  return allUsage;
}

function pauseBefore(previous, current, spacing, music) {
  if (music && current.section === "podcast introduction" && (!previous || previous.section !== current.section)) return Math.round(music.introLeadSeconds * 1000);
  if (music && previous && previous.section === "podcast introduction" && current.section !== "podcast introduction") return Math.round((music.introTailSeconds + music.introFadeSeconds) * 1000);
  if (!previous) return spacing.leadInMs;
  if (previous.section !== current.section) return spacing.sectionChangeMs;
  if (previous.speaker !== current.speaker) return spacing.speakerChangeMs;
  return spacing.continuedTurnMs;
}

function musicCuePlan(cues, music) {
  const frameToSeconds = (frame) => Number((frame / SAMPLE_RATE).toFixed(3));
  const plan = {};
  if (cues.intro) {
    const leadSeconds = frameToSeconds(cues.intro.voiceStartFrame - cues.intro.startFrame);
    const voiceDuration = frameToSeconds(cues.intro.endFrame - cues.intro.voiceStartFrame);
    plan.intro = { start_seconds: frameToSeconds(cues.intro.startFrame), voice_start_seconds: frameToSeconds(cues.intro.voiceStartFrame), lead_seconds: leadSeconds, voice_duration_seconds: voiceDuration, continuation_seconds: music.introTailSeconds, fade_seconds: music.introFadeSeconds, duration_seconds: Number((leadSeconds + voiceDuration + music.introTailSeconds + music.introFadeSeconds).toFixed(3)) };
  }
  if (cues.outro) {
    const voiceDuration = frameToSeconds(cues.outro.endFrame - cues.outro.startFrame);
    plan.outro = { start_seconds: frameToSeconds(cues.outro.startFrame), voice_duration_seconds: voiceDuration, continuation_seconds: music.outroTailSeconds, fade_seconds: music.outroFadeSeconds, duration_seconds: Number((voiceDuration + music.outroTailSeconds + music.outroFadeSeconds).toFixed(3)) };
  }
  return plan;
}

function terminalMusicTailMilliseconds(selected, music) {
  if (!music || !selected.length) return 0;
  if (selected.at(-1).section === "podcast introduction") return Math.round((music.introTailSeconds + music.introFadeSeconds) * 1000);
  if (selected.at(-1).section === "outro") return Math.round((music.outroTailSeconds + music.outroFadeSeconds) * 1000);
  return 0;
}

function musicVolumeExpression(cue, music) {
  const voiceStart = cue.lead_seconds || 0; const voiceEnd = voiceStart + cue.voice_duration_seconds; const transition = music.levelTransitionSeconds;
  const full = Number(10 ** (music.gainDb / 20)).toFixed(8); const underVoice = Number(10 ** (music.voiceGainDb / 20)).toFixed(8);
  if (transition === 0) return `if(between(t,${voiceStart},${voiceEnd}),${underVoice},${full})`;
  const rampDownEnd = voiceStart + transition; const rampUpEnd = voiceEnd + transition;
  return `if(lt(t,${voiceStart}),${full},if(lt(t,${rampDownEnd}),${full}+(${underVoice}-${full})*(t-${voiceStart})/${transition},if(lt(t,${voiceEnd}),${underVoice},if(lt(t,${rampUpEnd}),${underVoice}+(${full}-${underVoice})*(t-${voiceEnd})/${transition},${full}))))`;
}

function mixMusicBeds({ voiceMasterPath, outputPath, music, plan }) {
  const inputs = ["-y", "-v", "error", "-i", voiceMasterPath]; const filters = ["[0:a]aformat=sample_rates=24000:channel_layouts=mono[voice_mix]"]; const beds = []; let inputIndex = 1;
  const addBed = (cue, fadeStartSeconds = null) => {
    inputs.push("-stream_loop", "-1", "-i", music.path);
    const fade = fadeStartSeconds === null ? "" : `,afade=t=out:st=${fadeStartSeconds}:d=${cue.fade_seconds}`;
    filters.push(`[${inputIndex}:a]aformat=sample_rates=24000:channel_layouts=mono,volume='${musicVolumeExpression(cue, music)}':eval=frame,atrim=duration=${cue.duration_seconds}${fade},adelay=${Math.round(cue.start_seconds * 1000)}[music_${inputIndex}]`);
    beds.push(`[music_${inputIndex}]`); inputIndex += 1;
  };
  if (plan.intro) addBed(plan.intro, plan.intro.lead_seconds + plan.intro.voice_duration_seconds + plan.intro.continuation_seconds);
  if (plan.outro) addBed(plan.outro, plan.outro.voice_duration_seconds + plan.outro.continuation_seconds);
  if (!beds.length) { fs.copyFileSync(voiceMasterPath, outputPath); return; }
  if (beds.length === 1) filters.push(`${beds[0]}anull[music]`); else filters.push(`${beds.join("")}amix=inputs=${beds.length}:duration=longest:normalize=0[music]`);
  filters.push("[voice_mix][music]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.89:level=disabled[mixed]");
  const completed = spawnSync("ffmpeg", [...inputs, "-filter_complex", filters.join(";"), "-map", "[mixed]", "-ar", String(SAMPLE_RATE), "-ac", String(CHANNELS), "-c:a", "pcm_s16le", outputPath], { encoding: "utf8" });
  if (completed.status !== 0) throw new RenderError(`Music-bed mix failed: ${(completed.stderr || "unknown error").trim()}`);
}

function writeWavOutput({ masterPath, wavPath, masterPcm, mixed }) {
  if (mixed) fs.copyFileSync(masterPath, wavPath);
  else writeAtomic(wavPath, makeWav(masterPcm));
  return wavPath;
}

function ffmetadataValue(value) { return value.replace(/[\\=;#\r\n]/g, "\\\\$&"); }

function chapterMarkersFor(stitchBoundaries, duration) {
  const chapters = [];
  let previousSection = null;
  for (const boundary of stitchBoundaries) {
    if (boundary.section === previousSection) continue;
    previousSection = boundary.section;
    chapters.push({
      id: `chapter-${String(chapters.length + 1).padStart(3, "0")}`,
      start_ms: chapters.length === 0 ? 0 : Math.round(boundary.start_frame / SAMPLE_RATE * 1000),
      title: boundary.section_title || boundary.section,
    });
  }
  const durationMs = Math.round(duration * 1000);
  for (let index = 0; index < chapters.length; index += 1) chapters[index].end_ms = index + 1 < chapters.length ? chapters[index + 1].start_ms : durationMs;
  return chapters;
}

function chapterFfmetadata(chapters) {
  return `;FFMETADATA1\n${chapters.map((chapter) => `[CHAPTER]\nTIMEBASE=1/1000\nSTART=${chapter.start_ms}\nEND=${chapter.end_ms}\ntitle=${ffmetadataValue(chapter.title)}\n`).join("")}`;
}

function writeMp3WithChapters({ masterPath, mp3Path, chapters }) {
  const temporary = fs.mkdtempSync(path.join(require("os").tmpdir(), "ppl-chapters-"));
  const metadataPath = path.join(temporary, "chapters.ffmeta");
  try {
    writeAtomic(metadataPath, chapterFfmetadata(chapters));
    const completed = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", masterPath, "-i", metadataPath, "-map", "0:a", "-map_metadata", "1", "-ar", String(SAMPLE_RATE), "-ac", "1", "-b:a", "160k", "-id3v2_version", "3", mp3Path], { encoding: "utf8" });
    if (completed.status !== 0) throw new RenderError(`ffmpeg MP3 export with chapters failed: ${(completed.stderr || "unknown error").trim()}`);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

function verifyMp3Chapters(mp3Path, chapters) {
  const completed = spawnSync("ffprobe", ["-v", "error", "-show_chapters", "-of", "json", mp3Path], { encoding: "utf8" });
  if (completed.status !== 0) throw new RenderError(`ffprobe chapter validation failed: ${(completed.stderr || "unknown error").trim()}`);
  let parsed;
  try { parsed = JSON.parse(completed.stdout); } catch (_) { throw new RenderError("ffprobe chapter validation returned invalid JSON."); }
  const actual = Array.isArray(parsed.chapters) ? parsed.chapters : [];
  if (actual.length !== chapters.length) throw new RenderError(`MP3 chapter validation expected ${chapters.length} markers but found ${actual.length}.`);
  for (let index = 0; index < chapters.length; index += 1) {
    const actualStartMs = Math.round(Number(actual[index].start_time) * 1000);
    if (actual[index].tags?.title !== chapters[index].title || Math.abs(actualStartMs - chapters[index].start_ms) > 1) throw new RenderError(`MP3 chapter validation failed at marker ${index + 1}.`);
  }
}

function assemble(segments, selected, options, workDir, audioDir, timestamp, explicitRange, selectionLabel) {
  const chunks = []; const usage = []; const stitchBoundaries = []; const musicCues = {}; let previous = null; let masterFrames = 0;
  for (const segment of selected) {
    const wavPath = `${partBase(workDir, segment)}.wav`; const usagePath = `${partBase(workDir, segment)}.usage.json`;
    if (!fs.existsSync(wavPath) || !fs.existsSync(usagePath)) throw new RenderError(`Missing rendered segment ${segment.index}. Run --render-only for the selected range first.`);
    const usageRecord = JSON.parse(fs.readFileSync(usagePath, "utf8"));
    assertCurrentRenderInput(usageRecord, segments, segment, options, workDir);
    const pauseStartFrame = masterFrames;
    const pause = silence(pauseBefore(previous, segment, options.spacing, options.music));
    chunks.push(pause); masterFrames += pause.length / 2;
    // The assembled program begins with intentional silence. Do not fade in
    // the first rendered phoneme after that silence: Realtime audio can begin
    // immediately, and a stitch fade is only needed where audio segments meet.
    const pcm = fadeSegmentPcm(readOwnWav(wavPath), options.stitchFadeMs, { fadeIn: Boolean(previous), fadeOut: true });
    const segmentStartFrame = masterFrames;
    chunks.push(pcm); masterFrames += pcm.length / 2;
    if (options.music && segment.section === "podcast introduction") {
      if (!musicCues.intro) musicCues.intro = { startFrame: pauseStartFrame, voiceStartFrame: segmentStartFrame, endFrame: masterFrames };
      else musicCues.intro.endFrame = masterFrames;
    }
    if (options.music && segment.section === "outro") {
      if (!musicCues.outro) musicCues.outro = { startFrame: segmentStartFrame, endFrame: masterFrames };
      else musicCues.outro.endFrame = masterFrames;
    }
    stitchBoundaries.push({ segment_index: segment.index, speaker: segment.speaker, section: segment.section, section_title: segment.sectionTitle, start_frame: segmentStartFrame, end_frame: masterFrames });
    usage.push(usageRecord.response_usage); previous = segment;
  }
  const terminalMusicTail = terminalMusicTailMilliseconds(selected, options.music);
  if (terminalMusicTail) { const tail = silence(terminalMusicTail); chunks.push(tail); masterFrames += tail.length / 2; }
  const masterPcm = Buffer.concat(chunks); const suffix = explicitRange ? `.preview-${selectionLabel}` : ""; const stem = `${options.episodeId}-${timestamp}${suffix}`; const masterPath = path.join(audioDir, `${stem}.master.wav`); const voiceMasterPath = path.join(audioDir, `${stem}.voice.master.wav`); const wavPath = path.join(audioDir, `${stem}.wav`); const mp3Path = path.join(audioDir, `${stem}.mp3`); const manifestPath = path.join(audioDir, `${stem}.render-manifest.json`); const qualityReportPath = path.join(audioDir, `${stem}.audio-quality.json`);
  ensureDir(audioDir);
  const musicPlan = options.music ? musicCuePlan(musicCues, options.music) : null;
  if (options.music && Object.keys(musicPlan).length) { writeAtomic(voiceMasterPath, makeWav(masterPcm)); mixMusicBeds({ voiceMasterPath, outputPath: masterPath, music: options.music, plan: musicPlan }); } else writeAtomic(masterPath, makeWav(masterPcm));
  const duration = Number(durationSeconds(masterPcm.length).toFixed(3));
  const chapters = chapterMarkersFor(stitchBoundaries, duration);
  let publishedPath = masterPath;
  if (options.format === "mp3") {
    writeMp3WithChapters({ masterPath, mp3Path, chapters });
    verifyMp3Chapters(mp3Path, chapters);
    publishedPath = mp3Path;
  } else publishedPath = writeWavOutput({ masterPath, wavPath, masterPcm, mixed: Boolean(options.music && Object.keys(musicPlan).length) });
  const frontMatter = selected[0].index === 1 && selected.some((segment) => [DISCLAIMER_SECTION, LEGACY_DISCLAIMER_SECTION].includes(segment.section)) ? "included" : "not_in_selected_range";
  const outputSha256 = sha256(fs.readFileSync(publishedPath));
  const manifest = { renderer: "openai-realtime", renderer_version: 12, generated_at_utc: new Date().toISOString(), episode_id: options.episodeId, script: options.scriptPath, script_sha256: sha256(fs.readFileSync(options.scriptPath)), model: options.model, voices: options.voices, pronunciation_transforms: PRONUNCIATION_TRANSFORMS, pronunciation_guidance: PRONUNCIATION_GUIDANCE, music_bed: options.music && Object.keys(musicPlan).length ? { source: options.music.path, source_sha256: sha256(fs.readFileSync(options.music.path)), base_gain_db: options.music.gainDb, voice_gain_db: options.music.voiceGainDb, level_transition_seconds: options.music.levelTransitionSeconds, cue_plan: musicPlan, voice_master_wav: voiceMasterPath } : null, chapters: options.format === "mp3" ? { format: "id3v2", source: "master-script section headings", validation: "ffprobe", audio_sha256: outputSha256, markers: chapters } : null, audio: { sample_rate_hz: SAMPLE_RATE, channels: CHANNELS, bit_depth: BITS_PER_SAMPLE, output_speed: "native_default_unset", stitch_fade_ms: options.stitchFadeMs, first_segment_fade_in: false, stitch_boundaries: stitchBoundaries, master_wav: masterPath, output: publishedPath, output_format: options.format, duration_seconds: duration, sha256: outputSha256, quality_report: qualityReportPath }, selected_segments: selected.map((segment) => ({ index: segment.index, speaker: segment.speaker, section: segment.section, section_title: segment.sectionTitle })), is_preview: explicitRange, front_matter_validation: frontMatter, usage: estimateUsageCost(usage) };
  const audioQuality = analyzeRenderedAudio({ manifestPath, masterPath, outputPath: publishedPath, stitchBoundaries, reportPath: qualityReportPath });
  manifest.audio.quality = { result: audioQuality.result, report: qualityReportPath, stitch_warnings: audioQuality.master.stitches.warnings.length, clipped_samples: audioQuality.master.pcm.clipped_samples };
  // The render manifest is the candidate's final record. Do not expose an
  // interim version while quality analysis is still in progress.
  writeAtomic(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  if (audioQuality.result !== "passed") throw new RenderError(`Post-assembly audio quality checks failed. See ${qualityReportPath}.`);
  console.log(`Wrote ${publishedPath}`); console.log(`Wrote ${masterPath}`); console.log(`Wrote ${manifestPath}`); console.log(`Duration: ${manifest.audio.duration_seconds.toFixed(3)} seconds; usage-derived estimate: $${manifest.usage.estimated_usd.toFixed(6)}`);
}

async function main() {
  const raw = parseArgs(process.argv.slice(2));
  const timestamp = raw.timestamp || utcTimestamp(); if (!/^\d{8}T\d{6}Z$/.test(timestamp)) throw new RenderError("--timestamp must use YYYYMMDDTHHMMSSZ.");
  if (!SAFE_ID_RE.test(raw["episode-id"])) throw new RenderError("--episode-id must be lowercase kebab-case.");
  const model = raw.model || DEFAULTS.model; const instructorVoice = raw["instructor-voice"] || DEFAULTS.instructorVoice; const learnerVoice = raw["learner-voice"] || DEFAULTS.learnerVoice; const announcerVoice = raw["announcer-voice"] || DEFAULTS.announcerVoice;
  if (!SAFE_MODEL_RE.test(model) || !SAFE_VOICE_RE.test(instructorVoice) || !SAFE_VOICE_RE.test(learnerVoice) || !SAFE_VOICE_RE.test(announcerVoice)) throw new RenderError("Model and voice identifiers contain unsupported characters.");
  const scriptPath = path.resolve(raw.script); const audioDir = path.resolve(raw["audio-dir"]); if (!fs.statSync(scriptPath).isFile()) throw new RenderError(`Script not found: ${scriptPath}`); assertNarrationInput(scriptPath);
  assertSourceRelevanceApproved(scriptPath);
  const musicValuesSpecified = ["music-bed-gain-db", "music-voice-gain-db", "music-level-transition-seconds", "music-intro-lead-seconds", "music-intro-tail-seconds", "music-intro-fade-seconds", "music-outro-tail-seconds", "music-outro-fade-seconds"].some((name) => raw[name] !== undefined);
  if (musicValuesSpecified && !raw["music-bed"]) throw new RenderError("Music timing and gain options require --music-bed.");
  let music = null;
  if (raw["music-bed"]) {
    const musicPath = path.resolve(raw["music-bed"]); if (!fs.existsSync(musicPath) || !fs.statSync(musicPath).isFile()) throw new RenderError(`Music bed not found: ${musicPath}`);
    music = { path: musicPath, gainDb: boundedNumber(raw["music-bed-gain-db"], "--music-bed-gain-db", DEFAULTS.musicBedGainDb, -60, 0), voiceGainDb: boundedNumber(raw["music-voice-gain-db"], "--music-voice-gain-db", DEFAULTS.musicVoiceGainDb, -60, 0), levelTransitionSeconds: nonNegativeNumber(raw["music-level-transition-seconds"], "--music-level-transition-seconds", DEFAULTS.musicLevelTransitionSeconds), introLeadSeconds: nonNegativeNumber(raw["music-intro-lead-seconds"], "--music-intro-lead-seconds", DEFAULTS.musicIntroLeadSeconds), introTailSeconds: nonNegativeNumber(raw["music-intro-tail-seconds"], "--music-intro-tail-seconds", DEFAULTS.musicIntroTailSeconds), introFadeSeconds: nonNegativeNumber(raw["music-intro-fade-seconds"], "--music-intro-fade-seconds", DEFAULTS.musicIntroFadeSeconds), outroTailSeconds: nonNegativeNumber(raw["music-outro-tail-seconds"], "--music-outro-tail-seconds", DEFAULTS.musicOutroTailSeconds), outroFadeSeconds: nonNegativeNumber(raw["music-outro-fade-seconds"], "--music-outro-fade-seconds", DEFAULTS.musicOutroFadeSeconds) };
  }
  const options = { scriptPath, episodeId: raw["episode-id"], model, voices: { instructor: instructorVoice, learner: learnerVoice, announcer: announcerVoice }, maxWords: positiveInteger(raw["max-words-per-segment"], "--max-words-per-segment", DEFAULTS.maxWords), continuityCharacters: DEFAULTS.continuityCharacters, timeoutSeconds: positiveInteger(raw["segment-timeout"], "--segment-timeout", DEFAULTS.timeoutSeconds), format: raw.format || "mp3", stitchFadeMs: DEFAULTS.stitchFadeMs, music, spacing: { leadInMs: DEFAULTS.leadInMs, continuedTurnMs: DEFAULTS.continuedTurnMs, speakerChangeMs: DEFAULTS.speakerChangeMs, sectionChangeMs: DEFAULTS.sectionChangeMs } };
  const segments = parseScript(scriptPath, options.maxWords); const start = positiveInteger(raw["segment-start"], "--segment-start", 1); const end = positiveInteger(raw["segment-end"], "--segment-end", segments.length); if (start > end || end > segments.length) throw new RenderError(`Selected range must fall between 1 and ${segments.length}.`);
  const speaker = raw.speaker ? raw.speaker.toUpperCase() : null; const selected = speaker ? segments.filter((segment) => segment.speaker === speaker) : segments.slice(start - 1, end); if (!selected.length) throw new RenderError(`No ${raw.speaker} segments found.`);
  const explicitRange = Boolean(speaker) || start !== 1 || end !== segments.length; const selectionLabel = speaker ? `${raw.speaker}-only` : `${String(start).padStart(3, "0")}-${String(end).padStart(3, "0")}`; const workDir = path.resolve(raw["work-dir"] || path.join(audioDir, `${options.episodeId}-realtime-${timestamp}.segments`));
  console.log(`Validated ${segments.length} segments; selected ${speaker ? `${raw.speaker} (${selected.length} segments)` : `${start}-${end}`}.`); console.log(`Model: ${options.model}; Instructor: ${options.voices.instructor}; Learner: ${options.voices.learner}; Announcer: ${options.voices.announcer}; native output speed (unset).`);
  if (raw["dry-run"]) return;
  establishSettings(workDir, settingsFor(options, sha256(fs.readFileSync(scriptPath))));
  if (raw["render-only"]) await renderSegments(segments, selected, options, workDir);
  if (raw["assemble-only"]) assemble(segments, selected, options, workDir, audioDir, timestamp, explicitRange, selectionLabel);
}

if (require.main === module) main().catch((error) => { console.error(`Render failed: ${error.message}`); process.exitCode = 1; });

module.exports = { DISCLAIMER_SECTION, LEGACY_DISCLAIMER_SECTION, REQUIRED_NOTICE, RenderError, assemble, assertNarrationInput, assertSourceRelevanceApproved, chapterFfmetadata, chapterMarkersFor, mixMusicBeds, musicCuePlan, musicVolumeExpression, parseScript, pauseBefore, pronunciationGuidance, renderInputHash, renderSegments, reusableSegment, segmentInstruction, settingsFor, spokenText, terminalMusicTailMilliseconds, usageRecordFor, validateFrontMatter, verifyMp3Chapters, writeMp3WithChapters, writeWavOutput };
