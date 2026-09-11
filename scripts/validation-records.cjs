"use strict";

const path = require("path");

function validationInProgressPath(outputPath) {
  return `${outputPath}.in-progress`;
}

function validationRecoveryPath(outputPath) {
  return `${validationInProgressPath(outputPath)}.recovering`;
}

function validationFailurePath(outputPath) {
  return `${outputPath}.failed`;
}

function failedValidationAttemptPath(outputPath, run) {
  return path.join(path.dirname(outputPath), ".validation-attempts", `${run.run_id}.yaml`);
}

module.exports = {
  failedValidationAttemptPath,
  validationFailurePath,
  validationInProgressPath,
  validationRecoveryPath,
};
