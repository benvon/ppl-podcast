#!/usr/bin/env node
/**
 * Deterministic post-assembly checks for rendered podcast audio.
 *
 * This checks technical integrity and stitch discontinuities. It does not
 * replace the required human listening QA for synthesis artifacts, wording,
 * pronunciation, or editorial pacing.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const BYTES_PER_FRAME = CHANNELS * BITS_PER_SAMPLE / 8;
const STITCH_JUMP_WARNING = 6000;

class AudioQualityError extends Error {}

function writeAtomic(target, body) {
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, body);
  fs.renameSync(temporary, target);
}

function fadeSegmentPcm(pcm, fadeMilliseconds = 8) {
  if (pcm.length % BYTES_PER_FRAME !== 0) throw new AudioQualityError("PCM data is not aligned to complete samples.");
  const result = Buffer.from(pcm);
  const frames = result.length / BYTES_PER_FRAME;
  const fadeFrames = Math.min(Math.round(SAMPLE_RATE * fadeMilliseconds / 1000), Math.floor(frames / 2));
  if (!fadeFrames) return result;
  for (let index = 0; index < fadeFrames; index += 1) {
    const inOffset = index * BYTES_PER_FRAME;
    const outOffset = (frames - fadeFrames + index) * BYTES_PER_FRAME;
    result.writeInt16LE(Math.round(result.readInt16LE(inOffset) * index / fadeFrames), inOffset);
    result.writeInt16LE(Math.round(result.readInt16LE(outOffset) * (fadeFrames - 1 - index) / fadeFrames), outOffset);
  }
  return result;
}

function readOwnWav(wavPath) {
  const buffer = fs.readFileSync(wavPath);
  if (buffer.length < 44 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE" || buffer.readUInt16LE(20) !== 1 || buffer.readUInt16LE(22) !== CHANNELS || buffer.readUInt32LE(24) !== SAMPLE_RATE || buffer.readUInt16LE(34) !== BITS_PER_SAMPLE || buffer.toString("ascii", 36, 40) !== "data") throw new AudioQualityError(`Unexpected WAV format: ${wavPath}`);
  const length = buffer.readUInt32LE(40);
  if (length !== buffer.length - 44) throw new AudioQualityError(`Invalid WAV data length: ${wavPath}`);
  return buffer.subarray(44);
}

function pcmStatistics(pcm) {
  if (pcm.length % BYTES_PER_FRAME !== 0) throw new AudioQualityError("PCM data is not aligned to complete samples.");
  let peak = 0; let clippedSamples = 0; let longestClippedRun = 0; let clippedRun = 0;
  for (let offset = 0; offset < pcm.length; offset += BYTES_PER_FRAME) {
    const value = Math.abs(pcm.readInt16LE(offset));
    peak = Math.max(peak, value);
    if (value >= 32767) { clippedSamples += 1; clippedRun += 1; longestClippedRun = Math.max(longestClippedRun, clippedRun); } else clippedRun = 0;
  }
  const samples = pcm.length / BYTES_PER_FRAME;
  return { samples, duration_seconds: Number((samples / SAMPLE_RATE).toFixed(3)), peak_sample: peak, peak_dbfs: peak ? Number((20 * Math.log10(peak / 32768)).toFixed(2)) : null, clipped_samples: clippedSamples, clipped_fraction: Number((clippedSamples / samples).toFixed(8)), longest_clipped_run: longestClippedRun };
}

function maximumJump(pcm, firstFrame, lastFrame) {
  const frames = pcm.length / BYTES_PER_FRAME;
  let maximum = 0;
  for (let frame = Math.max(1, firstFrame); frame <= Math.min(frames - 1, lastFrame); frame += 1) {
    maximum = Math.max(maximum, Math.abs(pcm.readInt16LE(frame * BYTES_PER_FRAME) - pcm.readInt16LE((frame - 1) * BYTES_PER_FRAME)));
  }
  return maximum;
}

function analyzeStitchBoundaries(pcm, boundaries, fadeMilliseconds = 8) {
  const fadeFrames = Math.round(SAMPLE_RATE * fadeMilliseconds / 1000);
  const findings = boundaries.flatMap((boundary) => [
    { segment_index: boundary.segment_index, edge: "start", maximum_sample_jump: maximumJump(pcm, boundary.start_frame - 1, boundary.start_frame + fadeFrames) },
    { segment_index: boundary.segment_index, edge: "end", maximum_sample_jump: maximumJump(pcm, boundary.end_frame - fadeFrames, boundary.end_frame) },
  ]);
  const maximumSampleJump = findings.reduce((maximum, finding) => Math.max(maximum, finding.maximum_sample_jump), 0);
  return { fade_milliseconds: fadeMilliseconds, jump_warning_threshold: STITCH_JUMP_WARNING, boundaries_checked: boundaries.length, maximum_sample_jump: maximumSampleJump, warnings: findings.filter((finding) => finding.maximum_sample_jump > STITCH_JUMP_WARNING), findings };
}

function run(command, args) {
  const completed = spawnSync(command, args, { encoding: "utf8" });
  if (completed.error) throw new AudioQualityError(`${command} is required for audio analysis: ${completed.error.message}`);
  if (completed.status !== 0) throw new AudioQualityError(`${command} failed: ${(completed.stderr || completed.stdout || "unknown error").trim()}`);
  return completed.stdout;
}

function decodeCheck(audioPath) {
  run("ffmpeg", ["-v", "error", "-xerror", "-i", audioPath, "-f", "null", "-"]);
  return { valid: true };
}

function probe(audioPath) {
  return JSON.parse(run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_name,sample_rate,channels,duration:format=duration,format_name", "-of", "json", audioPath]));
}

function primaryAudioStream(probeResult) {
  const stream = (probeResult.streams || []).find((candidate) => candidate.codec_name);
  if (!stream) throw new AudioQualityError("ffprobe did not report an audio stream.");
  return stream;
}

function analyzeRenderedAudio({ manifestPath, masterPath, outputPath, stitchBoundaries, reportPath }) {
  const masterPcm = readOwnWav(masterPath);
  const masterStats = pcmStatistics(masterPcm);
  const stitches = analyzeStitchBoundaries(masterPcm, stitchBoundaries);
  const masterProbe = probe(masterPath); const outputProbe = probe(outputPath);
  const masterStream = primaryAudioStream(masterProbe); const outputStream = primaryAudioStream(outputProbe);
  const outputDuration = Number(outputProbe.format && outputProbe.format.duration);
  const durationDifference = Number(Math.abs(outputDuration - masterStats.duration_seconds).toFixed(3));
  const errors = [];
  if (Number(masterStream.sample_rate) !== SAMPLE_RATE || Number(masterStream.channels) !== CHANNELS) errors.push("Master WAV does not have the required 24 kHz mono format.");
  if (Number(outputStream.sample_rate) !== SAMPLE_RATE || Number(outputStream.channels) !== CHANNELS) errors.push("Published output does not have the required 24 kHz mono format.");
  if (durationDifference > 0.1) errors.push(`Published output duration differs from the master by ${durationDifference} seconds.`);
  if (masterStats.clipped_samples) errors.push(`Master WAV contains ${masterStats.clipped_samples} clipped PCM sample(s).`);
  if (stitches.warnings.length) errors.push(`${stitches.warnings.length} stitch edge(s) exceeded the sample-jump warning threshold.`);
  let masterDecode; let outputDecode;
  try { masterDecode = decodeCheck(masterPath); } catch (error) { errors.push(`Master decode failed: ${error.message}`); masterDecode = { valid: false, error: error.message }; }
  try { outputDecode = decodeCheck(outputPath); } catch (error) { errors.push(`Published output decode failed: ${error.message}`); outputDecode = { valid: false, error: error.message }; }
  const report = { schema_version: 1, analyzed_at_utc: new Date().toISOString(), manifest: manifestPath, result: errors.length ? "failed" : "passed", limitations: ["Automated checks can detect malformed files, format drift, clipping, and abrupt PCM discontinuities at known stitches. They cannot reliably judge synthesis artifacts, garbled speech, pronunciation, or editorial pacing; complete human listening QA remains required."], master: { path: masterPath, decode: masterDecode, probe: masterProbe, pcm: masterStats, stitches }, output: { path: outputPath, decode: outputDecode, probe: outputProbe, duration_difference_from_master_seconds: durationDifference }, errors };
  writeAtomic(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

function parseArgs(argv) {
  if (argv.length !== 2 || argv[0] !== "--manifest") throw new AudioQualityError("Usage: node scripts/audio-quality.cjs --manifest PATH");
  return path.resolve(argv[1]);
}

function main() {
  const manifestPath = parseArgs(process.argv.slice(2));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.audio || !manifest.audio.master_wav || !manifest.audio.output || !Array.isArray(manifest.audio.stitch_boundaries)) throw new AudioQualityError("Render manifest does not contain the master, output, and stitch boundaries required for analysis.");
  const reportPath = manifest.audio.quality_report || manifestPath.replace(/\.render-manifest\.json$/, ".audio-quality.json");
  const report = analyzeRenderedAudio({ manifestPath, masterPath: manifest.audio.master_wav, outputPath: manifest.audio.output, stitchBoundaries: manifest.audio.stitch_boundaries, reportPath });
  console.log(`Audio quality report ${report.result}: ${reportPath}`);
  if (report.result !== "passed") process.exitCode = 1;
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(`Audio analysis failed: ${error.message}`); process.exitCode = 1; }
}

module.exports = { AudioQualityError, analyzeRenderedAudio, analyzeStitchBoundaries, fadeSegmentPcm, pcmStatistics };
