"use strict";

const CURRENT_PRODUCTION_CONTRACT_VERSION = 2;
const CONTRACT_KINDS = Object.freeze({
  CURRENT: "current",
  PRESERVED_LEGACY: "preserved_legacy",
  UNSUPPORTED: "unsupported",
});

function productionContractKind(episode) {
  if (!episode || typeof episode !== "object" || Array.isArray(episode)) return CONTRACT_KINDS.UNSUPPORTED;
  if (!Object.prototype.hasOwnProperty.call(episode, "production_contract_version")) return CONTRACT_KINDS.PRESERVED_LEGACY;
  return episode.production_contract_version === CURRENT_PRODUCTION_CONTRACT_VERSION
    ? CONTRACT_KINDS.CURRENT
    : CONTRACT_KINDS.UNSUPPORTED;
}

function requireCurrentProductionContract(episode, operation) {
  const kind = productionContractKind(episode);
  if (kind === CONTRACT_KINDS.CURRENT) return;
  if (kind === CONTRACT_KINDS.PRESERVED_LEGACY) {
    throw new Error(`${operation} cannot change a preserved legacy package. Begin a deliberate revision with episode:script-review --reset.`);
  }
  throw new Error(`${operation} requires production_contract_version ${CURRENT_PRODUCTION_CONTRACT_VERSION}.`);
}

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

module.exports = {
  CONTRACT_KINDS,
  CURRENT_PRODUCTION_CONTRACT_VERSION,
  RELEASE_GATES_AFTER_SCRIPT_APPROVAL,
  RELEASE_GATES_AFTER_SCRIPT_RESET,
  productionContractKind,
  requireCurrentProductionContract,
  sameStringList,
};
