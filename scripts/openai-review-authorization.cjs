"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function qaItemCompleteWithID(markdown, id) {
  const escaped = escapeRegExp(id);
  return new RegExp(`^- \\[x\\][^\\n]*<!--\\s*qa-id:\\s*${escaped}\\s*-->`, "mi").test(markdown);
}

function checklistAuthorizationLockPath(episodePath) {
  return path.join(episodePath, ".qa-checklist.authorization.lock");
}

function checklistAuthorizationRecoveryPath(lockPath) {
  return `${lockPath}.recovering`;
}

function lockOwnerIsAlive(lockPath) {
  try {
    const owner = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    if (!Number.isInteger(owner?.pid) || owner.pid <= 0) return false;
    process.kill(owner.pid, 0);
    return true;
  } catch (error) {
    if (error?.code === "ESRCH") return false;
    return true;
  }
}

function acquireAuthorizationRecoveryLock(lockPath) {
  const recoveryPath = checklistAuthorizationRecoveryPath(lockPath);
  try {
    fs.mkdirSync(recoveryPath, { mode: 0o700 });
    return recoveryPath;
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error("qa-checklist authorization stale-lock recovery is already in progress; wait for it to finish.");
    }
    throw error;
  }
}

function releaseAuthorizationRecoveryLock(recoveryPath) {
  try { fs.rmdirSync(recoveryPath); }
  catch (error) { if (error?.code !== "ENOENT") throw error; }
}

function recoverStaleAuthorizationLock(lockPath) {
  const recoveryPath = acquireAuthorizationRecoveryLock(lockPath);
  try {
    if (!fs.existsSync(lockPath)) return;
    if (lockOwnerIsAlive(lockPath)) throw new Error("qa-checklist authorization is being consumed by another validation run; wait for it to finish.");
    // Rename, rather than unlink, the observed stale lock while recovery is
    // exclusively held. A concurrent normal acquisition can then only win the
    // subsequent O_EXCL create; it cannot have its live lock deleted by stale
    // recovery cleanup.
    const archivedLockPath = `${lockPath}.stale.${crypto.randomUUID()}`;
    try { fs.renameSync(lockPath, archivedLockPath); }
    catch (error) {
      if (error?.code === "ENOENT") return;
      throw error;
    }
    try { fs.unlinkSync(archivedLockPath); }
    catch (error) { if (error?.code !== "ENOENT") throw error; }
  } finally {
    releaseAuthorizationRecoveryLock(recoveryPath);
  }
}

function acquireChecklistAuthorizationLock(episodePath, { qaID, runID }) {
  const lockPath = checklistAuthorizationLockPath(episodePath);
  const record = JSON.stringify({ pid: process.pid, qa_id: qaID, run_id: runID, acquired_at_utc: new Date().toISOString() });
  try {
    fs.writeFileSync(lockPath, record, { encoding: "utf8", mode: 0o600, flag: "wx" });
    return lockPath;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
    if (lockOwnerIsAlive(lockPath)) throw new Error("qa-checklist authorization is being consumed by another validation run; wait for it to finish.");
    recoverStaleAuthorizationLock(lockPath);
    try {
      fs.writeFileSync(lockPath, record, { encoding: "utf8", mode: 0o600, flag: "wx" });
      return lockPath;
    } catch (retryError) {
      if (retryError?.code === "EEXIST") throw new Error("qa-checklist authorization is being consumed by another validation run; wait for it to finish.");
      throw retryError;
    }
  }
}

function consumeChecklistAuthorization({ episodePath, qaID, operation, runID }) {
  const lockPath = acquireChecklistAuthorizationLock(episodePath, { qaID, runID });
  try {
  const checklistPath = path.join(episodePath, "qa-checklist.md");
  if (!fs.existsSync(checklistPath) || !fs.lstatSync(checklistPath).isFile()) {
    throw new Error(`qa-checklist.md is required before ${operation} can send source material to OpenAI.`);
  }
  const checklist = fs.readFileSync(checklistPath, "utf8");
  if (!qaItemCompleteWithID(checklist, qaID)) {
    throw new Error(`qa-checklist.md must record explicit current-turn authorization before ${operation} can send source material to OpenAI.`);
  }
  const marker = new RegExp(`^- \\[x\\]([^\\n]*<!--\\s*qa-id:\\s*${escapeRegExp(qaID)}\\s*-->[^\\n]*)$`, "mi");
  const matches = checklist.match(new RegExp(marker.source, "gmi")) || [];
  if (matches.length !== 1) throw new Error(`qa-checklist.md must contain exactly one checked ${operation} authorization checklist item.`);
  const consumed = checklist.replace(marker, "- [ ]$1");
  if (consumed === checklist) throw new Error(`Could not consume the ${operation} authorization checklist item.`);
  const originalStat = fs.statSync(checklistPath);
  const current = fs.readFileSync(checklistPath, "utf8");
  const currentStat = fs.statSync(checklistPath);
  if (current !== checklist || currentStat.ino !== originalStat.ino || currentStat.size !== originalStat.size || currentStat.mtimeMs !== originalStat.mtimeMs) {
    throw new Error(`qa-checklist.md changed while consuming ${operation} authorization; retry after reconciling the checklist.`);
  }
  const temporary = `${checklistPath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, consumed, { mode: 0o644 });
    fs.renameSync(temporary, checklistPath);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  return { qa_id: qaID, consumed_at_utc: new Date().toISOString(), run_id: runID };
  } finally {
    try { fs.unlinkSync(lockPath); }
    catch (error) { if (error?.code !== "ENOENT") throw error; }
  }
}

module.exports = { acquireChecklistAuthorizationLock, checklistAuthorizationLockPath, checklistAuthorizationRecoveryPath, consumeChecklistAuthorization, qaItemCompleteWithID, recoverStaleAuthorizationLock };
