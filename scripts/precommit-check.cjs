#!/usr/bin/env node
"use strict";

const { execFileSync } = require("child_process");

const BANNED_PATHS = [
  { label: "environment file", pattern: /(^|\/)\.env(?:rc|(?:\..+)?)$/i },
  { label: "private key or certificate", pattern: /(^|\/)(?:id_[^/]+|[^/]+\.(?:pem|key|p12|pfx))$/i },
  { label: "generated audio", pattern: /^audio-artifacts\//i },
  { label: "Node dependency directory", pattern: /(^|\/)node_modules\//i },
  { label: "Python bytecode cache", pattern: /(^|\/)__pycache__\//i },
  { label: "Python bytecode", pattern: /\.py[co]$/i },
];

const CONTENT_RULES = [
  { label: "private key", pattern: /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/ },
  { label: "OpenAI-style API key", pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{16,}\b/ },
  { label: "restricted OpenAI-style API key", pattern: /\brk_[A-Za-z0-9_-]{16,}\b/ },
  { label: "AWS access key", pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { label: "GitHub token", pattern: /\b(?:gh[pous]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  { label: "Slack token", pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { label: "probable assigned credential", pattern: /\b(?:OPENAI_API_KEY|API_KEY|SECRET|TOKEN|PASSWORD)\s*[:=]\s*["']?(?!\$\{?[A-Z_][A-Z0-9_]*\}?)[A-Za-z0-9_-]{12,}/i },
  { label: "absolute local path", pattern: /\/(?:Users|home)\// },
];

const BINARY_EXTENSIONS = new Set([
  ".aiff", ".avi", ".bmp", ".flac", ".gif", ".heic", ".jpeg", ".jpg", ".m4a", ".mkv", ".mov", ".mp3", ".mp4", ".ogg", ".opus", ".pdf", ".png", ".wav", ".webm", ".webp",
]);

function stagedPaths() {
  const raw = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"], { encoding: "buffer" });
  return raw.toString("utf8").split("\0").filter(Boolean);
}

function stagedContent(file) {
  return execFileSync("git", ["show", `:${file}`], { encoding: "buffer" });
}

function isLikelyBinaryPath(file) {
  const extension = file.slice(file.lastIndexOf(".")).toLowerCase();
  return BINARY_EXTENSIONS.has(extension);
}

function isBinary(content) {
  return content.includes(0);
}

function findingsFor(file, content) {
  const findings = [];
  for (const rule of BANNED_PATHS) if (rule.pattern.test(file)) findings.push(rule.label);
  if (isLikelyBinaryPath(file) || isBinary(content)) return findings;
  const text = content.toString("utf8");
  for (const rule of CONTENT_RULES) if (rule.pattern.test(text)) findings.push(rule.label);
  return findings;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function selfTest() {
  assert(findingsFor("docs/ok.md", Buffer.from("OPENAI_API_KEY comes from process.env.")).length === 0, "safe source text was flagged");
  assert(findingsFor(".envrc", Buffer.from("OPENAI_API_KEY=example")).includes("environment file"), "environment file was not blocked");
  const sampleKey = ["sk", "proj", "abcdefghijklmnopqrstuv"].join("-");
  assert(findingsFor("docs/unsafe.md", Buffer.from(`token: ${sampleKey}`)).includes("OpenAI-style API key"), "API key was not flagged");
  const samplePath = "/" + "Users/example/project";
  assert(findingsFor("docs/path.md", Buffer.from(samplePath)).includes("absolute local path"), "absolute path was not flagged");
  assert(isLikelyBinaryPath("assets/music/example.mp3"), "MP3 assets must skip the text-content scan");
  console.log("precommit-check self-test passed");
}

function main() {
  if (process.argv.includes("--self-test")) { selfTest(); return; }
  const failures = [];
  for (const file of stagedPaths()) {
    const content = isLikelyBinaryPath(file) ? Buffer.alloc(0) : stagedContent(file);
    const findings = findingsFor(file, content);
    if (findings.length) failures.push({ file, findings });
  }
  if (failures.length) {
    console.error("Pre-commit check blocked this commit. Remove or unstage the following content:");
    for (const failure of failures) console.error(`- ${failure.file}: ${failure.findings.join(", ")}`);
    console.error("The check intentionally prints file paths and rule names, never matched values.");
    process.exitCode = 1;
    return;
  }
  console.log("pre-commit disclosure and secret check passed");
}

if (require.main === module) main();

module.exports = { findingsFor, isLikelyBinaryPath };
