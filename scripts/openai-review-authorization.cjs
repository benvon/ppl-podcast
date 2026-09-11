"use strict";

const fs = require("fs");
const path = require("path");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkedAuthorizationItems(markdown, id) {
  const escaped = escapeRegExp(id);
  const pattern = new RegExp(`^- \\[x\\][^\\n]*<!--\\s*qa-id:\\s*${escaped}\\s*-->`, "gmi");
  return String(markdown).match(pattern) || [];
}

function qaItemCompleteWithID(markdown, id) {
  return checkedAuthorizationItems(markdown, id).length > 0;
}

// Authorization is a human decision in the current conversation, recorded in
// the checklist and copied into the report. It is intentionally not a second
// mutable state machine with locks or one-time consumption semantics.
function consumeChecklistAuthorization({ episodePath, qaID, operation, runID }) {
  const checklistPath = path.join(episodePath, "qa-checklist.md");
  if (!fs.existsSync(checklistPath) || !fs.lstatSync(checklistPath).isFile()) {
    throw new Error(`qa-checklist.md is required before ${operation} can send source material to OpenAI.`);
  }
  const checklist = fs.readFileSync(checklistPath, "utf8");
  const matches = checkedAuthorizationItems(checklist, qaID);
  if (matches.length !== 1) {
    throw new Error(`qa-checklist.md must contain exactly one checked ${operation} authorization checklist item before source material is sent to OpenAI.`);
  }
  return { qa_id: qaID, authorized_at_utc: new Date().toISOString(), run_id: runID };
}

module.exports = { checkedAuthorizationItems, consumeChecklistAuthorization, qaItemCompleteWithID };
