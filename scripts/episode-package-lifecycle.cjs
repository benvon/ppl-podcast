"use strict";

// The package lifecycle is the single concurrency and state-transition
// boundary for current-contract episode work. Commands name an operation from
// this registry instead of inventing lock ownership or stale-recovery rules at
// their call site. Per-report validation locks remain separate evidence files;
// this lease protects the package-level read/decision/effect transaction.

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const YAML = require("yaml");
const {
  sourceValidationLifecyclePath,
  validationInProgressPath,
  validationRecoveryPath,
} = require("./validation-records.cjs");

// A malformed lock can only be left by the pre-registry publisher or a
// damaged filesystem. Do not let an explicit recovery race a writer that is
// still publishing that legacy record; after this bounded grace period it is
// safe to archive the unreadable record because current publishers link a
// fully fsynced file atomically.
const MALFORMED_LOCK_RECOVERY_GRACE_MS = 30_000;

const PACKAGE_OPERATION_IDS = Object.freeze({
  CLAIM_SOURCE_PREFLIGHT: "claim-source-preflight",
  FORMAL_SOURCE_REVIEW: "formal-source-review",
  SCRIPT_RESET: "script-reset",
  SCRIPT_APPROVE: "script-approve",
  REALTIME_RENDER: "realtime-render",
  PRE_HOSTING_VALIDATION: "pre-hosting-validation",
  PUBLICATION_PREPARATION: "publication-preparation",
  HOSTING_HANDOFF: "hosting-handoff",
});

const PACKAGE_OPERATIONS = Object.freeze({
  [PACKAGE_OPERATION_IDS.CLAIM_SOURCE_PREFLIGHT]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.CLAIM_SOURCE_PREFLIGHT,
    validator: "scripts/claim-source-preflight.cjs:lifecycle",
  }),
  [PACKAGE_OPERATION_IDS.FORMAL_SOURCE_REVIEW]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.FORMAL_SOURCE_REVIEW,
    validator: "scripts/validate-source-links.cjs:formal-review-lifecycle",
  }),
  [PACKAGE_OPERATION_IDS.SCRIPT_RESET]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.SCRIPT_RESET,
    validator: "scripts/reset-script-review.cjs:reset",
  }),
  [PACKAGE_OPERATION_IDS.SCRIPT_APPROVE]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.SCRIPT_APPROVE,
    validator: "scripts/reset-script-review.cjs:approve",
  }),
  [PACKAGE_OPERATION_IDS.REALTIME_RENDER]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.REALTIME_RENDER,
    validator: "scripts/render_episode_realtime.cjs",
  }),
  [PACKAGE_OPERATION_IDS.PRE_HOSTING_VALIDATION]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.PRE_HOSTING_VALIDATION,
    validator: "scripts/validate-pre-hosting.cjs",
  }),
  [PACKAGE_OPERATION_IDS.PUBLICATION_PREPARATION]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.PUBLICATION_PREPARATION,
    validator: "scripts/prepare-publication.cjs",
  }),
  [PACKAGE_OPERATION_IDS.HOSTING_HANDOFF]: Object.freeze({
    id: PACKAGE_OPERATION_IDS.HOSTING_HANDOFF,
    validator: "scripts/prepare-hosting-handoff.cjs",
  }),
});

const PACKAGE_OPERATION_COMMANDS = Object.freeze({
  [PACKAGE_OPERATION_IDS.CLAIM_SOURCE_PREFLIGHT]: "scripts/claim-source-preflight.cjs",
  [PACKAGE_OPERATION_IDS.FORMAL_SOURCE_REVIEW]: "scripts/validate-source-links.cjs",
  [PACKAGE_OPERATION_IDS.SCRIPT_RESET]: "scripts/reset-script-review.cjs --reset",
  [PACKAGE_OPERATION_IDS.SCRIPT_APPROVE]: "scripts/reset-script-review.cjs --approve",
  [PACKAGE_OPERATION_IDS.REALTIME_RENDER]: "scripts/render_episode_realtime.cjs",
  [PACKAGE_OPERATION_IDS.PRE_HOSTING_VALIDATION]: "scripts/validate-pre-hosting.cjs",
  [PACKAGE_OPERATION_IDS.PUBLICATION_PREPARATION]: "scripts/prepare-publication.cjs",
  [PACKAGE_OPERATION_IDS.HOSTING_HANDOFF]: "scripts/prepare-hosting-handoff.cjs",
});

function packageOperation(operationID) {
  const operation = PACKAGE_OPERATIONS[operationID];
  if (!operation) throw new Error(`Unknown episode package operation: ${operationID}`);
  return operation;
}

function readValidationLock(lockPath) {
  try {
    const document = YAML.parseDocument(fs.readFileSync(lockPath, "utf8"));
    if (document.errors.length) throw new Error(document.errors[0].message);
    const lock = document.toJS();
    if (!lock || typeof lock !== "object" || typeof lock.run_id !== "string" || !lock.run_id || typeof lock.hostname !== "string" || !lock.hostname || !Number.isSafeInteger(lock.pid) || lock.pid < 1) {
      throw new Error("missing run_id, hostname, or pid");
    }
    return lock;
  } catch (error) {
    throw new Error(`Cannot read validation lock ${lockPath}: ${error.message}`);
  }
}

function processIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means a live process we are not allowed to inspect; fail closed.
    return error.code !== "ESRCH";
  }
}

function publishLockAtomically(lockPath, lock) {
  const temporary = `${lockPath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  let descriptor;
  try {
    descriptor = fs.openSync(temporary, "wx", 0o600);
    fs.writeFileSync(descriptor, YAML.stringify(lock), "utf8");
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;
    // link(2) is an atomic no-replace claim because the temporary and target
    // are in the same directory and therefore the same filesystem.
    fs.linkSync(temporary, lockPath);
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    try { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
    catch (_) { /* The durable lock was already published or the operation failed. */ }
  }
}

function malformedLockIsOldEnough(lockPath) {
  try { return Date.now() - fs.statSync(lockPath).mtimeMs >= MALFORMED_LOCK_RECOVERY_GRACE_MS; }
  catch (error) {
    if (error?.code === "ENOENT") return true;
    throw error;
  }
}

function archiveLock(lockPath) {
  const archivedLockPath = `${lockPath}.stale.${crypto.randomUUID()}`;
  try { fs.renameSync(lockPath, archivedLockPath); }
  catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
  try { fs.unlinkSync(archivedLockPath); }
  catch (error) { if (error?.code !== "ENOENT") throw error; }
  return true;
}

function recoveryLeaseRecord() {
  return {
    schema_version: 1,
    validator: "scripts/episode-package-lifecycle.cjs:recovery",
    run_id: crypto.randomUUID(),
    hostname: os.hostname(),
    pid: process.pid,
    started_at_utc: new Date().toISOString(),
    input_sha256: { scope: "stale-lock-recovery" },
  };
}

function recoverStaleRecoveryLease(recoveryPath) {
  let existing;
  try { existing = readValidationLock(recoveryPath); }
  catch (error) {
    if (!malformedLockIsOldEnough(recoveryPath)) throw new Error(`Validation lock recovery is still being published (${recoveryPath}); retry after the publication grace period.`);
    archiveLock(recoveryPath);
    return;
  }
  if (existing.hostname !== os.hostname()) throw new Error(`Validation lock recovery belongs to host ${existing.hostname}; it cannot be safely recovered from ${os.hostname()}.`);
  if (processIsRunning(existing.pid)) throw new Error(`Validation lock recovery is already running with pid ${existing.pid}; refusing to replace its lock.`);
  archiveLock(recoveryPath);
}

function acquireRecoveryLease(outputPath) {
  const recoveryPath = validationRecoveryPath(outputPath);
  const run = recoveryLeaseRecord();
  for (;;) {
    try {
      publishLockAtomically(recoveryPath, run);
      return { outputPath: recoveryPath.slice(0, -".in-progress.recovering".length), recoveryPath, run };
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      recoverStaleRecoveryLease(recoveryPath);
    }
  }
}

function releaseRecoveryLease(recoveryLease) {
  assertValidationLockOwner(recoveryLease.recoveryPath, recoveryLease.run);
  fs.unlinkSync(recoveryLease.recoveryPath);
}

function recoverStaleValidationLock(outputPath, { validator, operationID } = {}) {
  const lockPath = validationInProgressPath(outputPath);
  const recoveryLease = acquireRecoveryLease(outputPath);
  try {
    let lock;
    try { lock = readValidationLock(lockPath); }
    catch (error) {
      if (!malformedLockIsOldEnough(lockPath)) throw new Error(`Validation lock is still being published (${lockPath}); retry after the publication grace period.`);
      archiveLock(lockPath);
      return;
    }
    if (lock.hostname !== os.hostname()) throw new Error(`Validation lock belongs to host ${lock.hostname}; it cannot be safely recovered from ${os.hostname()}.`);
    if (processIsRunning(lock.pid)) throw new Error(`Validation is already running with pid ${lock.pid}; refusing to replace its lock.`);
    // Existing current-contract locks created before the registry had no
    // operation_id. They may be recovered only when their recorded validator
    // is the exact validator now assigned to this operation. New locks always
    // carry the stronger operation identity.
    const ownerMatches = operationID
      ? (lock.operation_id ? lock.operation_id === operationID : lock.validator === validator)
      : typeof lock.validator === "string" && Boolean(lock.validator) && lock.validator === validator;
    if (!ownerMatches) {
      const owner = typeof lock.operation_id === "string" && lock.operation_id
        ? `episode package operation ${lock.operation_id}`
        : typeof lock.validator === "string" && lock.validator
          ? lock.validator
          : "an unknown operation";
      throw new Error(`Validation lock belongs to ${owner}; recover it only by rerunning that interrupted operation with --recover-stale-lock.`);
    }
    // Moving the stale lock while recovery ownership is held prevents a
    // second worker from deleting a newly acquired live lock.
    archiveLock(lockPath);
  } finally {
    releaseRecoveryLease(recoveryLease);
  }
}

function markValidationInProgress(outputPath, inputSha256, { recoverStaleLock = false, validator = "scripts/validate-source-links.cjs", operationID } = {}) {
  const lockPath = validationInProgressPath(outputPath);
  const recoveryPath = validationRecoveryPath(outputPath);
  if (fs.existsSync(recoveryPath)) {
    if (!recoverStaleLock) throw new Error(`Source validation lock recovery is in progress (${recoveryPath}).`);
    recoverStaleRecoveryLease(recoveryPath);
  }
  if (recoverStaleLock && fs.existsSync(lockPath)) recoverStaleValidationLock(outputPath, { validator, operationID });
  const lock = {
    schema_version: 1,
    validator,
    ...(operationID ? { operation_id: operationID } : {}),
    run_id: crypto.randomUUID(),
    hostname: os.hostname(),
    pid: process.pid,
    started_at_utc: new Date().toISOString(),
    input_sha256: inputSha256,
  };
  try {
    publishLockAtomically(lockPath, lock);
  } catch (error) {
    if (error.code === "EEXIST") throw new Error(`Source validation is already in progress or was interrupted (${lockPath}). After confirming the recorded process is no longer running, rerun with --recover-stale-lock.`);
    throw error;
  }
  return lock;
}

function assertValidationLockOwner(lockPath, run) {
  const lock = readValidationLock(lockPath);
  if (lock.run_id !== run.run_id || lock.hostname !== run.hostname || lock.pid !== run.pid) throw new Error(`Validation lock ownership changed while producing ${lockPath}; report was not released.`);
  return lock;
}

function releaseValidationLock(outputPath, run) {
  const lockPath = validationInProgressPath(outputPath);
  assertValidationLockOwner(lockPath, run);
  fs.unlinkSync(lockPath);
}

function acquireEpisodePackageOperation(episodePath, operationID, { recoverStaleLock = false } = {}) {
  const operation = packageOperation(operationID);
  const outputPath = sourceValidationLifecyclePath(path.resolve(episodePath));
  const run = markValidationInProgress(outputPath, { scope: "episode-package" }, {
    recoverStaleLock,
    validator: operation.validator,
    operationID: operation.id,
  });
  return { outputPath, run, operation };
}

function releaseEpisodePackageOperation(lease) {
  if (lease) releaseValidationLock(lease.outputPath, lease.run);
}

function assertEpisodePackageOperation(episodePath, lease, expectedOperationID) {
  if (!lease || path.resolve(path.dirname(lease.outputPath)) !== path.resolve(episodePath) || !lease.operation) {
    throw new Error("A matching episode package lease is required for this state transition.");
  }
  const expectedOperationIDs = expectedOperationID === undefined ? [] : (Array.isArray(expectedOperationID) ? expectedOperationID : [expectedOperationID]);
  if (expectedOperationIDs.length && !expectedOperationIDs.includes(lease.operation.id)) {
    throw new Error(`Episode package operation ${expectedOperationIDs.join(" or ")} is required for this state transition.`);
  }
  const lock = assertValidationLockOwner(validationInProgressPath(lease.outputPath), lease.run);
  if (lock.operation_id !== lease.operation.id || lock.validator !== lease.operation.validator) {
    throw new Error("Episode package lease operation identity changed while the transition was in progress.");
  }
}

function withEpisodePackageOperation(episodePath, operationID, options, work) {
  const lease = acquireEpisodePackageOperation(episodePath, operationID, options);
  try { return work(lease); }
  finally { releaseEpisodePackageOperation(lease); }
}

async function withEpisodePackageOperationAsync(episodePath, operationID, options, work) {
  const lease = acquireEpisodePackageOperation(episodePath, operationID, options);
  try { return await work(lease); }
  finally { releaseEpisodePackageOperation(lease); }
}

function episodeStateText(episodePath, episode, lease, expectedText) {
  assertEpisodePackageOperation(episodePath, lease);
  const episodeFile = path.join(path.resolve(episodePath), "episode.yaml");
  const currentText = fs.readFileSync(episodeFile, "utf8");
  if (expectedText !== undefined && currentText !== expectedText) {
    throw new Error("episode.yaml changed before its state transition could commit; retry from the current package state.");
  }
  const currentDocument = YAML.parseDocument(currentText);
  if (currentDocument.errors.length) throw new Error(`Invalid YAML in ${episodeFile}: ${currentDocument.errors[0].message}`);
  const current = currentDocument.toJS();
  const revision = current?.production_state_revision;
  if (revision !== undefined && (!Number.isSafeInteger(revision) || revision < 0)) {
    throw new Error("episode.yaml production_state_revision must be a non-negative integer when present.");
  }
  episode.production_state_revision = (revision || 0) + 1;
  assertEpisodePackageOperation(episodePath, lease);
  return YAML.stringify(episode);
}

module.exports = {
  MALFORMED_LOCK_RECOVERY_GRACE_MS,
  PACKAGE_OPERATION_IDS,
  PACKAGE_OPERATION_COMMANDS,
  PACKAGE_OPERATIONS,
  acquireEpisodePackageOperation,
  acquireRecoveryLease,
  assertEpisodePackageOperation,
  assertValidationLockOwner,
  episodeStateText,
  markValidationInProgress,
  packageOperation,
  publishLockAtomically,
  readValidationLock,
  recoverStaleValidationLock,
  releaseEpisodePackageOperation,
  releaseValidationLock,
  withEpisodePackageOperation,
  withEpisodePackageOperationAsync,
};
