"use strict";

const crypto = require("node:crypto");
const { performance } = require("node:perf_hooks");

function boundedInteger(value, fallback, maximum, name) {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(number) || number < 1 || number > maximum) throw new Error(`${name} must be an integer from 1 to ${maximum}`);
  return number;
}

async function mapConcurrent(items, limit, worker, { signal, onCompleted, keyFor = () => "default", perKeyLimit = limit } = {}) {
  const results = new Array(items.length); const pending = items.map((_, index) => index); const activeByKey = new Map();
  const waiters = new Set();
  const notifyWaiters = () => {
    for (const resolve of waiters) resolve();
    waiters.clear();
  };
  const acquire = async () => {
    while (!signal?.aborted) {
      const position = pending.findIndex((index) => {
        const key = keyFor(items[index], index);
        const limitForKey = typeof perKeyLimit === "function" ? perKeyLimit(key, items[index], index) : perKeyLimit;
        return (activeByKey.get(key) || 0) < limitForKey;
      });
      if (position >= 0) {
        const index = pending.splice(position, 1)[0]; const key = keyFor(items[index], index);
        activeByKey.set(key, (activeByKey.get(key) || 0) + 1);
        return { index, key };
      }
      if (!pending.length) return null;
      await new Promise((resolve) => waiters.add(resolve));
    }
    return null;
  };
  const release = (key) => { activeByKey.set(key, activeByKey.get(key) - 1); notifyWaiters(); };
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const job = await acquire(); if (!job) return;
      const { index, key } = job;
      try { results[index] = await worker(items[index], index); }
      catch (error) { results[index] = { error: error.message }; }
      finally { release(key); }
      onCompleted?.(results[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

function requestRateLimiter({ maxInFlight, minStartIntervalMs, now = () => performance.now(), setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  if (!Number.isInteger(maxInFlight) || maxInFlight < 1) throw new Error("maxInFlight must be a positive integer");
  if (!Number.isSafeInteger(minStartIntervalMs) || minStartIntervalMs < 0) throw new Error("minStartIntervalMs must be a non-negative integer");
  const pending = []; let active = 0; let lastStartedAt = null; let timer = null; let closed = false;
  const removePending = (entry) => {
    const index = pending.indexOf(entry);
    if (index >= 0) pending.splice(index, 1);
  };
  const schedule = () => {
    if (timer || !pending.length || active >= maxInFlight) return;
    const wait = lastStartedAt === null ? 0 : Math.max(0, minStartIntervalMs - (now() - lastStartedAt));
    timer = setTimer(() => { timer = null; pump(); }, wait);
  };
  const pump = () => {
    while (pending.length && active < maxInFlight) {
      const wait = lastStartedAt === null ? 0 : Math.max(0, minStartIntervalMs - (now() - lastStartedAt));
      if (wait > 0) { schedule(); return; }
      const entry = pending.shift();
      entry.signal?.removeEventListener("abort", entry.cancel);
      if (entry.signal?.aborted) { entry.reject(new Error("cancelled")); continue; }
      active += 1; lastStartedAt = now();
      let released = false;
      entry.resolve(() => {
        if (released) return;
        released = true; active -= 1; pump();
      });
    }
  };
  return {
    acquire({ signal } = {}) {
      if (closed) return Promise.reject(new Error("cancelled"));
      if (signal?.aborted) return Promise.reject(new Error("cancelled"));
      return new Promise((resolve, reject) => {
        const entry = { resolve, reject, signal, cancel: null };
        entry.cancel = () => { removePending(entry); reject(new Error("cancelled")); };
        signal?.addEventListener("abort", entry.cancel, { once: true });
        pending.push(entry); pump();
      });
    },
    close() {
      closed = true;
      if (timer) { clearTimer(timer); timer = null; }
      while (pending.length) {
        const entry = pending.shift(); entry.signal?.removeEventListener("abort", entry.cancel); entry.reject(new Error("cancelled"));
      }
    },
  };
}

function progressReporter({ stream = process.stderr, heartbeatSeconds = 10, runId = crypto.randomUUID() } = {}) {
  let timer; let closed = false; let phase = null; let completed = 0; let total = 0;
  const emit = (event, details = {}) => {
    if (closed) return;
    stream.write(`${JSON.stringify({ event, run_id: runId, at_utc: new Date().toISOString(), ...details })}\n`);
  };
  const heartbeat = () => emit("heartbeat", { phase, completed, total });
  const startHeartbeat = () => { clearInterval(timer); timer = setInterval(heartbeat, heartbeatSeconds * 1000); timer.unref?.(); };
  return {
    runId,
    emit,
    phaseStarted(name, count) { phase = name; completed = 0; total = count; emit("phase_started", { phase, total }); startHeartbeat(); },
    itemCompleted(itemId, valid) { completed += 1; emit("item_completed", { phase, item_id: itemId, valid, completed, total }); },
    phaseCompleted() { emit("phase_completed", { phase, completed, total }); clearInterval(timer); },
    close() { clearInterval(timer); closed = true; },
  };
}

module.exports = { boundedInteger, mapConcurrent, progressReporter, requestRateLimiter };
