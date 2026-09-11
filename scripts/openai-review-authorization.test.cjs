"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { acquireChecklistAuthorizationLock, checklistAuthorizationLockPath, checklistAuthorizationRecoveryPath, consumeChecklistAuthorization } = require("./openai-review-authorization.cjs");
const { consumeSourceReviewAuthorization, sourceReviewFailureReport, staticValidationTargetErrors } = require("./validate-source-links.cjs");

test("formal source review consumes only one checklist authorization and records its run identity", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  const runID = crypto.randomUUID();
  try {
    const checklistPath = path.join(episodePath, "qa-checklist.md");
    fs.writeFileSync(checklistPath, "- [x] Formal source review is authorized. <!-- qa-id: openai-source-review-authorization -->\n", "utf8");
    const authorization = consumeSourceReviewAuthorization(episodePath, runID);
    assert.equal(authorization.run_id, runID);
    assert.match(authorization.consumed_at_utc, /^\d{4}-\d{2}-\d{2}T/);
    assert.match(fs.readFileSync(checklistPath, "utf8"), /- \[ \] Formal source review is authorized/);
    assert.throws(() => consumeSourceReviewAuthorization(episodePath, crypto.randomUUID()), /explicit current-turn authorization/);
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("authorization helper keeps operation-specific IDs independent", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  try {
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), [
      "- [x] Preflight authorized. <!-- qa-id: preflight -->",
      "- [x] Formal review authorized. <!-- qa-id: formal -->",
    ].join("\n"), "utf8");
    consumeChecklistAuthorization({ episodePath, qaID: "preflight", operation: "preflight", runID: crypto.randomUUID() });
    const checklist = fs.readFileSync(path.join(episodePath, "qa-checklist.md"), "utf8");
    assert.match(checklist, /- \[ \] Preflight authorized/);
    assert.match(checklist, /- \[x\] Formal review authorized/);
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("authorization consumption refuses a concurrent checklist lock without altering either item", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  try {
    const checklistPath = path.join(episodePath, "qa-checklist.md");
    fs.writeFileSync(checklistPath, "- [x] Formal review authorized. <!-- qa-id: formal -->\n", "utf8");
    fs.writeFileSync(checklistAuthorizationLockPath(episodePath), JSON.stringify({ pid: process.pid }), { mode: 0o600 });
    assert.throws(
      () => consumeChecklistAuthorization({ episodePath, qaID: "formal", operation: "formal review", runID: crypto.randomUUID() }),
      /being consumed by another validation run/,
    );
    assert.match(fs.readFileSync(checklistPath, "utf8"), /- \[x\] Formal review authorized/);
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("stale authorization recovery is serialized and never unlinks the active lock path", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  const lockPath = checklistAuthorizationLockPath(episodePath);
  try {
    fs.writeFileSync(lockPath, JSON.stringify({ pid: 99999999 }), { mode: 0o600 });
    fs.mkdirSync(checklistAuthorizationRecoveryPath(lockPath), { mode: 0o700 });
    assert.throws(
      () => acquireChecklistAuthorizationLock(episodePath, { qaID: "preflight", runID: crypto.randomUUID() }),
      /stale-lock recovery is already in progress/,
    );
    assert.equal(fs.existsSync(lockPath), true);
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("stale authorization recovery archives the observed lock before a new exclusive acquisition", () => {
  const episodePath = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-source-review-authorization-"));
  const lockPath = checklistAuthorizationLockPath(episodePath);
  try {
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), "- [x] Preflight authorized. <!-- qa-id: preflight -->\n", "utf8");
    fs.writeFileSync(lockPath, JSON.stringify({ pid: 99999999 }), { mode: 0o600 });
    const authorization = consumeChecklistAuthorization({ episodePath, qaID: "preflight", operation: "preflight", runID: crypto.randomUUID() });
    assert.equal(authorization.qa_id, "preflight");
    assert.equal(fs.existsSync(lockPath), false);
    assert.equal(fs.existsSync(checklistAuthorizationRecoveryPath(lockPath)), false);
  } finally {
    fs.rmSync(episodePath, { recursive: true, force: true });
  }
});

test("formal validation failure records authorization consumed after the failure finalizer is configured", () => {
  const runID = crypto.randomUUID();
  let authorization = null;
  const failureReport = sourceReviewFailureReport({
    options: { llm: true, model: "test-model" },
    validationRun: { run_id: runID },
    authorizationForRun: () => authorization,
  });
  authorization = { qa_id: "openai-source-review-authorization", consumed_at_utc: "2026-09-11T00:00:00.000Z", run_id: runID };
  const report = failureReport({ defaultReport: { schema_version: 1, failure: {} } });
  assert.equal(report.run_id, runID);
  assert.deepEqual(report.authorization, authorization);
  assert.equal(report.llm_requested, true);
});

test("formal validation rejects every malformed source target before authorization is consumed", () => {
  const ledger = { sources: [{ id: "bad-source", url: "http://not-https.example", locator: "", supports_claims: [] }] };
  const notes = { links: [] };
  assert.match(staticValidationTargetErrors(ledger, notes).join("\n"), /Source bad-source has an invalid citation target/);
});
