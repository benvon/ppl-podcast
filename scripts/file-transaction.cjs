"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function assertRegularOrMissing(filePath) {
  if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isFile()) throw new Error(`Refusing to update non-regular file: ${filePath}`);
}

function writeFileSetAtomically(updates, { beforePromote } = {}) {
  const entries = [...updates.entries()].map(([filePath, body]) => ({
    filePath: path.resolve(filePath),
    body: Buffer.isBuffer(body) ? body : Buffer.from(String(body), "utf8"),
  }));
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.filePath)) throw new Error(`Duplicate transaction target: ${entry.filePath}`);
    seen.add(entry.filePath);
    assertRegularOrMissing(entry.filePath);
  }

  const originals = new Map(entries.map(({ filePath }) => [filePath, fs.existsSync(filePath) ? fs.readFileSync(filePath) : null]));
  const temporaries = new Map();
  const promoted = new Map();
  try {
    for (const { filePath, body } of entries) {
      const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
      fs.writeFileSync(temporary, body, { mode: 0o644, flag: "wx" });
      temporaries.set(filePath, temporary);
    }
    entries.forEach(({ filePath }, index) => {
      beforePromote?.({ filePath, index });
      const original = originals.get(filePath);
      const current = fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
      if ((original === null && current !== null) || (original !== null && (current === null || !current.equals(original)))) {
        throw new Error(`Transaction target changed before promotion: ${filePath}`);
      }
      fs.renameSync(temporaries.get(filePath), filePath);
      temporaries.delete(filePath);
      promoted.set(filePath, entries[index].body);
    });
  } catch (error) {
    const rollbackErrors = [];
    for (const { filePath } of entries) {
      if (!promoted.has(filePath)) continue;
      try {
        const original = originals.get(filePath);
        const current = fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
        const written = promoted.get(filePath);
        if ((current === null) || !current.equals(written)) {
          rollbackErrors.push(`${filePath}: changed after this transaction promoted it`);
          continue;
        }
        if (original === null) {
          fs.unlinkSync(filePath);
        } else {
          const rollback = `${filePath}.${process.pid}.${crypto.randomUUID()}.rollback`;
          fs.writeFileSync(rollback, original, { mode: 0o644, flag: "wx" });
          fs.renameSync(rollback, filePath);
        }
      } catch (rollbackError) { rollbackErrors.push(`${filePath}: ${rollbackError.message}`); }
    }
    if (rollbackErrors.length) error.message = `${error.message}; rollback incomplete: ${rollbackErrors.join("; ")}`;
    throw error;
  } finally {
    for (const temporary of temporaries.values()) {
      try { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
      catch (_) { /* Preserve the primary transaction outcome. */ }
    }
  }
}

module.exports = { writeFileSetAtomically };
