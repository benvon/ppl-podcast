"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { fetchSource, validateClaimAssessments, validateClaimMappings, validationTargetErrors } = require("./validate-source-links.cjs");
const { REQUIRED_NOTICE, parseScript, validateFrontMatter } = require("./render_episode_realtime.cjs");
const { analyzeRenderedAudio, analyzeStitchBoundaries, fadeSegmentPcm } = require("./audio-quality.cjs");

function source(id, supportsClaims) {
  return { id, url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", locator: "Paragraph 1-1-1, p. 1-1-1", supports_claims: supportsClaims };
}

function wavForTest(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8); header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(24_000, 24); header.writeUInt32LE(48_000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

test("claim mapping rejects claims omitted from a source ledger entry", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", [])] },
    { claims: [{ id: "claim-a", sources: ["aim"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /does not support the claim/);
  assert.match(result.errors.join("\n"), /not supported by any source ledger entry/);
});

test("claim mapping rejects source references that do not exist in the claim inventory", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", ["missing-claim"])] },
    { claims: [] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /maps unknown claim missing-claim/);
});

test("claim mapping rejects duplicate inventory claim identifiers", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", ["claim-a"])] },
    { claims: [
      { id: "claim-a", statement: "First statement.", sources: ["aim"] },
      { id: "claim-a", statement: "Different statement.", sources: ["aim"] },
    ] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /duplicate claim id claim-a/);
});

test("claim mapping rejects duplicate source identifiers", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", ["claim-a"]), source("aim", ["claim-a"])] },
    { claims: [{ id: "claim-a", sources: ["aim"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /duplicate source id aim/);
});

test("claim mapping rejects source-side claims that do not declare the source", () => {
  const result = validateClaimMappings(
    { sources: [source("aim-a", ["claim-a"]), source("aim-b", [])] },
    { claims: [{ id: "claim-a", sources: ["aim-b"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /source aim-a supports claim claim-a, but that claim does not declare the source/);
});

test("per-claim relevance requires an assessment for every expected claim", () => {
  const result = validateClaimAssessments(
    { status: "assessed", assessment: { claim_assessments: [{ claim_id: "claim-a", verdict: "supports" }] } },
    ["claim-a", "claim-b"],
  );
  assert.equal(result.valid, false);
  assert.deepEqual(result.missing_assessment_ids, ["claim-b"]);
});

test("per-claim relevance rejects an unsupported claim despite a favorable overall source verdict", () => {
  const result = validateClaimAssessments(
    { status: "assessed", assessment: { verdict: "supports", claim_assessments: [{ claim_id: "claim-a", verdict: "does_not_support" }] } },
    ["claim-a"],
  );
  assert.equal(result.valid, false);
  assert.deepEqual(result.unsupported_assessment_ids, ["claim-a"]);
});

test("source fetch timeout remains active while the response body is read", async () => {
  const fetchImpl = (_url, { signal }) => {
    const stream = new ReadableStream({
      start(controller) {
        signal.addEventListener("abort", () => controller.error(new DOMException("aborted", "AbortError")));
      },
    });
    return Promise.resolve(new Response(stream, { status: 200, headers: { "content-type": "text/html" } }));
  };
  await assert.rejects(fetchSource("https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", { fetchImpl, timeoutMs: 10 }), /AbortError|aborted/);
});

test("eCFR validation fallback must stay on the official versioner endpoint", () => {
  const valid = validationTargetErrors({
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-E/section-61.105",
    validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-10/title-14.xml?part=61",
  });
  assert.deepEqual(valid, []);
  const invalid = validationTargetErrors({
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-E/section-61.105",
    validation_url: "https://example.com/current.xml?part=61",
  });
  assert.match(invalid.join("\n"), /ecfr\.gov/);
});

test("production notice must begin immediately after the final opening segment", () => {
  const delayed = [
    { index: 1, section: "opening", text: "First opening sentence." },
    { index: 2, section: "opening", text: "Second opening sentence." },
    { index: 3, section: "objectives", text: "An intervening spoken section." },
    { index: 4, section: "required production notice", text: REQUIRED_NOTICE },
  ];
  assert.throws(() => validateFrontMatter(delayed), /immediately follow the final opening segment/);
  assert.doesNotThrow(() => validateFrontMatter([...delayed.slice(0, 2), { ...delayed[3], index: 3 }]));
});

test("production notice must be the first spoken text after the opening", () => {
  const interveningCopy = [
    { index: 1, section: "opening", text: "Today's topic." },
    { index: 2, section: "required production notice", text: "Before the notice, an unrelated message." },
    { index: 3, section: "required production notice", text: REQUIRED_NOTICE },
  ];
  assert.throws(() => validateFrontMatter(interveningCopy), /must begin immediately after the opening/);
});

test("realtime renderer accepts an Announcer turn", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-renderer-test-"));
  const scriptPath = path.join(temporary, "master-script.md");
  fs.writeFileSync(scriptPath, `# Test\n\n## Opening\n\n**INSTRUCTOR:**\n\nCold open.\n\n## Required production notice\n\n**INSTRUCTOR:**\n\n${REQUIRED_NOTICE}\n\n## Podcast introduction\n\n**ANNOUNCER:**\n\nWelcome to the podcast.\n`);
  try {
    assert.equal(parseScript(scriptPath, 240).at(-1).speaker, "ANNOUNCER");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("stitch fade tapers complete PCM segments to silence", () => {
  const pcm = Buffer.alloc(960);
  for (let offset = 0; offset < pcm.length; offset += 2) pcm.writeInt16LE(20_000, offset);
  const faded = fadeSegmentPcm(pcm, 8);
  assert.equal(faded.readInt16LE(0), 0);
  assert.equal(faded.readInt16LE(faded.length - 2), 0);
  assert.equal(pcm.readInt16LE(0), 20_000);
});

test("stitch analysis reports an abrupt un-faded PCM cut", () => {
  const pcm = Buffer.alloc(960);
  pcm.writeInt16LE(32_000, 480);
  const result = analyzeStitchBoundaries(pcm, [{ segment_index: 1, start_frame: 240, end_frame: 480 }], 1);
  assert.equal(result.warnings.length > 0, true);
});

test("post-assembly audio analysis accepts a valid stitched WAV", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-audio-quality-test-"));
  const masterPath = path.join(temporary, "candidate.master.wav");
  const outputPath = path.join(temporary, "candidate.mp3");
  const manifestPath = path.join(temporary, "candidate.render-manifest.json");
  const reportPath = path.join(temporary, "candidate.audio-quality.json");
  const pcm = fadeSegmentPcm(Buffer.alloc(960), 8);
  fs.writeFileSync(masterPath, wavForTest(pcm));
  try {
    const encoded = childProcess.spawnSync("ffmpeg", ["-v", "error", "-y", "-i", masterPath, "-ar", "24000", "-ac", "1", "-b:a", "160k", outputPath], { encoding: "utf8" });
    assert.equal(encoded.status, 0, encoded.stderr);
    const report = analyzeRenderedAudio({ manifestPath, masterPath, outputPath, stitchBoundaries: [{ segment_index: 1, start_frame: 120, end_frame: 480 }], reportPath });
    assert.equal(report.result, "passed");
    assert.equal(JSON.parse(fs.readFileSync(reportPath, "utf8")).result, "passed");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("invalid claim mappings stop before source fetch and LLM assessment", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-test-"));
  const sourcesPath = path.join(temporary, "sources.yaml");
  const claimsPath = path.join(temporary, "claims.yaml");
  const reportPath = path.join(temporary, "report.yaml");
  fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n");
  fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [different-source]\n");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--output", reportPath, "--require-llm"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Claim mapping failed/);
    assert.match(fs.readFileSync(reportPath, "utf8"), /results: \[\]/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
