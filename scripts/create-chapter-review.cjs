#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

class ChapterReviewError extends Error {}

function usage() {
  console.log("Usage: node scripts/create-chapter-review.cjs --manifest PATH [--output PATH]");
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new ChapterReviewError(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new ChapterReviewError(`Missing value for ${token}`);
    values[token.slice(2)] = value;
    index += 1;
  }
  if (!values.manifest) throw new ChapterReviewError("--manifest is required.");
  return values;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function formatTimestamp(seconds) {
  const rounded = Math.max(0, Math.floor(Number(seconds)));
  const minutes = Math.floor(rounded / 60);
  const remainder = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function relativeUrl(fromPath, targetPath) {
  const relative = path.relative(path.dirname(fromPath), targetPath);
  if (!relative || path.isAbsolute(relative)) throw new ChapterReviewError("The audio file must be addressable from the review page.");
  return relative.split(path.sep).map(encodeURIComponent).join("/");
}

function cacheBustedUrl(audioUrl, audioSha256) {
  return typeof audioSha256 === "string" && /^[a-f0-9]{64}$/i.test(audioSha256) ? `${audioUrl}?v=${audioSha256}` : audioUrl;
}

function validAudioSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value) ? value.toLowerCase() : null;
}

function readEmbeddedChapters(audioPath) {
  const completed = childProcess.spawnSync("ffprobe", ["-v", "error", "-show_chapters", "-of", "json", audioPath], { encoding: "utf8" });
  if (completed.error) throw new ChapterReviewError(`Could not run ffprobe: ${completed.error.message}`);
  if (completed.status !== 0) throw new ChapterReviewError(`ffprobe chapter read failed: ${(completed.stderr || "unknown error").trim()}`);
  let parsed;
  try { parsed = JSON.parse(completed.stdout); } catch (_) { throw new ChapterReviewError("ffprobe returned invalid chapter JSON."); }
  const chapters = Array.isArray(parsed.chapters) ? parsed.chapters : [];
  if (!chapters.length) throw new ChapterReviewError("The MP3 has no embedded chapters.");
  return chapters.map((chapter, index) => {
    const start = Number(chapter.start_time);
    const end = Number(chapter.end_time);
    const title = chapter.tags?.title;
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start || typeof title !== "string" || !title.trim()) throw new ChapterReviewError(`Embedded chapter ${index + 1} is malformed.`);
    return { index: index + 1, title: title.trim(), start, end };
  });
}

function renderReviewHtml({ audioUrl, audioSha256, chapters, episodeTitle }) {
  const playbackUrl = cacheBustedUrl(audioUrl, audioSha256);
  const audioIdentity = validAudioSha256(audioSha256);
  const chapterRows = chapters.map((chapter) => `<li><button type="button" data-start="${chapter.start}" aria-label="Play ${escapeHtml(chapter.title)} at ${formatTimestamp(chapter.start)}"><time>${formatTimestamp(chapter.start)}</time><span>${escapeHtml(chapter.title)}</span></button></li>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${audioIdentity ? `<meta name="ppl-audio-sha256" content="${audioIdentity}">` : ""}
<title>${escapeHtml(episodeTitle)} — chapter review</title>
<style>
  :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
  body { max-width: 44rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.45; }
  audio { width: 100%; margin: 1rem 0; }
  ol { list-style: none; margin: 1rem 0; padding: 0; border-top: 1px solid #8886; }
  button { appearance: none; background: none; border: 0; border-bottom: 1px solid #8886; color: inherit; cursor: pointer; display: grid; font: inherit; gap: 1rem; grid-template-columns: 4rem 1fr; padding: .7rem .35rem; text-align: left; width: 100%; }
  button:hover, button:focus-visible, button.active { background: #1484c61a; outline: none; }
  time { font-variant-numeric: tabular-nums; opacity: .72; }
  .note { opacity: .75; }
</style>
</head>
<body>
<h1>${escapeHtml(episodeTitle)}</h1>
<p class="note">This page reads the chapters embedded in the MP3 itself. Click a chapter to seek there, then listen across the transition.${audioIdentity ? ` Marker set: <code>${audioIdentity}</code>.` : ""}</p>
<audio controls preload="metadata" src="${escapeHtml(playbackUrl)}"></audio>
<p><a href="${escapeHtml(audioUrl)}">Download MP3</a></p>
<ol>
${chapterRows}
</ol>
<script>
  const audio = document.querySelector("audio");
  const buttons = Array.from(document.querySelectorAll("button[data-start]"));
  function updateActive() {
    let active = buttons[0];
    for (const button of buttons) if (audio.currentTime >= Number(button.dataset.start)) active = button;
    for (const button of buttons) button.classList.toggle("active", button === active);
  }
  for (const button of buttons) button.addEventListener("click", () => { audio.currentTime = Number(button.dataset.start); audio.play(); updateActive(); });
  audio.addEventListener("timeupdate", updateActive);
  audio.addEventListener("loadedmetadata", updateActive);
</script>
</body>
</html>
`;
}

function createChapterReview({ manifestPath, outputPath }) {
  const resolvedManifest = path.resolve(manifestPath);
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(resolvedManifest, "utf8")); } catch (error) { throw new ChapterReviewError(`Could not read render manifest: ${error.message}`); }
  const audioPath = manifest?.audio?.output;
  if (typeof audioPath !== "string" || path.extname(audioPath).toLowerCase() !== ".mp3" || !fs.statSync(audioPath).isFile()) throw new ChapterReviewError("Render manifest must point to an existing MP3 output.");
  const audioSha256 = validAudioSha256(manifest?.audio?.sha256);
  const resolvedOutput = path.resolve(outputPath || `${audioPath}.chapters${audioSha256 ? `.${audioSha256}` : ""}.html`);
  const chapters = readEmbeddedChapters(audioPath);
  const title = manifest.episode_id ? `${manifest.episode_id} chapter review` : "Podcast chapter review";
  fs.writeFileSync(resolvedOutput, renderReviewHtml({ audioUrl: relativeUrl(resolvedOutput, audioPath), audioSha256, chapters, episodeTitle: title }), "utf8");
  return { outputPath: resolvedOutput, audioPath, audioSha256, chapters };
}

if (require.main === module) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = createChapterReview({ manifestPath: args.manifest, outputPath: args.output });
    console.log(`Wrote ${result.outputPath} with ${result.chapters.length} embedded MP3 chapters from ${result.audioPath}.`);
  } catch (error) {
    if (error instanceof ChapterReviewError) console.error(`Chapter review failed: ${error.message}`);
    else console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { ChapterReviewError, cacheBustedUrl, createChapterReview, escapeHtml, formatTimestamp, parseArgs, readEmbeddedChapters, renderReviewHtml, validAudioSha256 };
