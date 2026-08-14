"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const { findingsFor, isLikelyBinaryPath } = require("./precommit-check.cjs");

test("pre-commit check skips content scanning for versioned MP3 source assets", () => {
  const file = "assets/music/example.mp3";
  assert.equal(isLikelyBinaryPath(file), true);
  assert.deepEqual(findingsFor(file, Buffer.alloc(0)), []);
});

test("pre-commit check continues to block generated audio paths", () => {
  assert.deepEqual(findingsFor("audio-artifacts/example.mp3", Buffer.alloc(0)), ["generated audio"]);
});
