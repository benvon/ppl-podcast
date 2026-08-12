"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { fetchSource, validateClaimAssessments, validateClaimMappings } = require("./validate-source-links.cjs");
const { REQUIRED_NOTICE, validateFrontMatter } = require("./render_episode_realtime.cjs");

function source(id, supportsClaims) {
  return { id, url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", locator: "Paragraph 1-1-1, p. 1-1-1", supports_claims: supportsClaims };
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
