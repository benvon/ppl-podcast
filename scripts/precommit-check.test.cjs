"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const { findingsFor, isBinary } = require("./precommit-check.cjs");

test("pre-commit check skips actual binary source assets by content", () => {
  const content = Buffer.from([0x49, 0x44, 0x33, 0x00]);
  assert.equal(isBinary(content), true);
  assert.deepEqual(findingsFor("assets/music/example.mp3", content), []);
});

test("pre-commit check scans text content despite a binary-looking suffix", () => {
  const sampleKey = ["sk", "proj", "abcdefghijklmnopqrstuv"].join("-");
  assert.equal(isBinary(Buffer.from(`token: ${sampleKey}`)), false);
  assert.equal(findingsFor("notes.pdf", Buffer.from(`token: ${sampleKey}`)).includes("OpenAI-style API key"), true);
});

test("pre-commit check continues to block generated audio paths", () => {
  assert.deepEqual(findingsFor("audio-artifacts/example.mp3", Buffer.alloc(0)), ["generated audio"]);
});
