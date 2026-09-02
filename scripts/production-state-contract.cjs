"use strict";

// Production-state records live in episode.yaml. These lists make a reset's
// outstanding work explicit until the next state transition supersedes it.
const RELEASE_GATES_AFTER_SCRIPT_RESET = Object.freeze([
  "Run source-link validation with LLM relevance review and resolve every finding.",
  "Complete human editorial review and approve the current script.",
  "Render audio and complete human listening QA, including the front-matter check.",
  "Review embedded chapter markers against the approved audio.",
  "Re-verify every public source and listener-facing link on publication day.",
  "Validate hosting metadata and stage the immutable audio object in the hosting workflow.",
]);

const RELEASE_GATES_AFTER_SCRIPT_APPROVAL = Object.freeze(RELEASE_GATES_AFTER_SCRIPT_RESET.slice(2));

function sameStringList(actual, expected) {
  return Array.isArray(actual)
    && actual.length === expected.length
    && actual.every((value, index) => value === expected[index]);
}

module.exports = { RELEASE_GATES_AFTER_SCRIPT_APPROVAL, RELEASE_GATES_AFTER_SCRIPT_RESET, sameStringList };
