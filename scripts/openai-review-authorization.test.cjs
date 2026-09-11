"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { consumeChecklistAuthorization } = require("./openai-review-authorization.cjs");
const { consumeSourceReviewAuthorization, sourceReviewFailureReport, staticValidationTargetErrors } = require("./validate-source-links.cjs");

test("formal source review records the checked human authorization without changing the checklist", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  const runID = crypto.randomUUID();
  try {
    const checklistPath = path.join(episodePath, "qa-checklist.md");
    const checklist = "- [x] Formal source review is authorized. <!-- qa-id: openai-source-review-authorization -->\n";
    fs.writeFileSync(checklistPath, checklist, "utf8");
    const authorization = consumeSourceReviewAuthorization(episodePath, runID);
    assert.equal(authorization.run_id, runID);
    assert.match(authorization.authorized_at_utc, /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(fs.readFileSync(checklistPath, "utf8"), checklist);
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("authorization helper rejects missing or duplicate checked authorization items", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  try {
    const checklistPath = path.join(episodePath, "qa-checklist.md");
    fs.writeFileSync(checklistPath, "- [ ] Not authorized. <!-- qa-id: formal -->\n", "utf8");
    assert.throws(
      () => consumeChecklistAuthorization({ episodePath, qaID: "formal", operation: "formal review", runID: crypto.randomUUID() }),
      /exactly one checked formal review authorization/,
    );
    fs.writeFileSync(checklistPath, [
      "- [x] Formal review authorized. <!-- qa-id: formal -->",
      "- [x] Formal review authorized again. <!-- qa-id: formal -->",
    ].join("\n"), "utf8");
    assert.throws(
      () => consumeChecklistAuthorization({ episodePath, qaID: "formal", operation: "formal review", runID: crypto.randomUUID() }),
      /exactly one checked formal review authorization/,
    );
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("formal validation failure records the authorization that authorized its run", () => {
  const runID = crypto.randomUUID();
  const authorization = { qa_id: "openai-source-review-authorization", authorized_at_utc: "2026-09-11T00:00:00.000Z", run_id: runID };
  const failureReport = sourceReviewFailureReport({
    options: { llm: true, model: "test-model" },
    validationRun: { run_id: runID },
    authorizationForRun: () => authorization,
  });
  const report = failureReport({ defaultReport: { schema_version: 1, failure: {} } });
  assert.equal(report.run_id, runID);
  assert.deepEqual(report.authorization, authorization);
  assert.equal(report.llm_requested, true);
});

test("formal validation rejects malformed source targets before an external review", () => {
  const ledger = { sources: [{ id: "bad-source", url: "http://not-https.example", locator: "", supports_claims: [] }] };
  assert.match(staticValidationTargetErrors(ledger, { links: [] }).join("\n"), /Source bad-source has an invalid citation target/);
});
