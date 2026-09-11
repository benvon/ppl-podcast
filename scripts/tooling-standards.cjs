"use strict";

// A deliberately small guardrail. Architecture is established by the written
// standard and behavior tests, not brittle source-code pattern matching.
const fs = require("fs");
const path = require("path");
const { PACKAGE_OPERATION_COMMANDS, PACKAGE_OPERATION_IDS, PACKAGE_OPERATIONS } = require("./episode-package-lifecycle.cjs");

function commandScript(command) {
  return String(command).trim().split(/\s+/, 1)[0];
}

function lifecycleToolingErrors({ root = path.resolve(__dirname, "..") } = {}) {
  const errors = [];
  const operationIDs = Object.values(PACKAGE_OPERATION_IDS);
  const registryIDs = Object.keys(PACKAGE_OPERATIONS);
  const commandIDs = Object.keys(PACKAGE_OPERATION_COMMANDS);

  if (new Set(operationIDs).size !== operationIDs.length) errors.push("package lifecycle operation IDs must be unique");
  if (registryIDs.length !== operationIDs.length || registryIDs.some((id) => !operationIDs.includes(id))) errors.push("every package lifecycle operation must have one registry entry");
  if (commandIDs.length !== operationIDs.length || commandIDs.some((id) => !operationIDs.includes(id))) errors.push("every package lifecycle operation must have one declared command");
  for (const operationID of operationIDs) {
    const script = commandScript(PACKAGE_OPERATION_COMMANDS[operationID]);
    const scriptPath = path.join(root, script);
    if (!fs.existsSync(scriptPath) || !fs.statSync(scriptPath).isFile()) errors.push(`${operationID} declares missing lifecycle command ${script}`);
  }
  const standardPath = path.join(root, "docs", "software-engineering-standards.md");
  if (!fs.existsSync(standardPath) || !fs.statSync(standardPath).isFile()) errors.push("missing docs/software-engineering-standards.md");
  return errors;
}

function assertLifecycleToolingStandards(options) {
  const errors = lifecycleToolingErrors(options);
  if (errors.length) throw new Error(`Production tooling standards failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
}

if (require.main === module) {
  try {
    assertLifecycleToolingStandards();
    console.log("production tooling standards passed");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { assertLifecycleToolingStandards, commandScript, lifecycleToolingErrors };
