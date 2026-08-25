"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { mapConcurrent, progressReporter } = require("./validation-runtime.cjs");

test("validation scheduler preserves result order and global/per-origin ceilings", async () => {
  const jobs = ["a/1", "a/2", "b/1", "a/3", "b/2"];
  let active = 0; let greatest = 0; const activeByOrigin = new Map(); const greatestByOrigin = new Map();
  const results = await mapConcurrent(jobs, 3, async (job) => {
    const key = job[0]; active += 1; greatest = Math.max(greatest, active); activeByOrigin.set(key, (activeByOrigin.get(key) || 0) + 1); greatestByOrigin.set(key, Math.max(greatestByOrigin.get(key) || 0, activeByOrigin.get(key)));
    await new Promise((resolve) => setTimeout(resolve, 4));
    active -= 1; activeByOrigin.set(key, activeByOrigin.get(key) - 1); return job;
  }, { keyFor: (job) => job[0], perKeyLimit: 2 });
  assert.deepEqual(results, jobs);
  assert.ok(greatest <= 3); assert.ok(greatestByOrigin.get("a") <= 2); assert.ok(greatestByOrigin.get("b") <= 2);
});

test("validation progress uses safe NDJSON lifecycle records", () => {
  let output = ""; const stream = { write: (value) => { output += value; } };
  const progress = progressReporter({ stream, heartbeatSeconds: 1, runId: "test-run" });
  progress.emit("run_started", { source_count: 2 }); progress.phaseStarted("deterministic_validation", 2); progress.itemCompleted("source-a", true); progress.phaseCompleted(); progress.emit("report_written", { valid: true }); progress.close();
  const records = output.trim().split("\n").map(JSON.parse);
  assert.deepEqual(records.map((record) => record.event), ["run_started", "phase_started", "item_completed", "phase_completed", "report_written"]);
  assert.ok(records.every((record) => record.run_id === "test-run" && !Object.hasOwn(record, "excerpt")));
});
