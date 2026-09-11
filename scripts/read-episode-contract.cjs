#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

function readProductionContract(filePath) {
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new Error(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  const episode = document.toJS();
  if (!episode || typeof episode !== "object" || Array.isArray(episode)) throw new Error(`episode.yaml must contain a mapping: ${filePath}`);
  if (!Object.prototype.hasOwnProperty.call(episode, "production_contract_version")) return { kind: "legacy" };
  if (episode.production_contract_version === 2) return { kind: "current" };
  return { kind: "unsupported" };
}

function main(argv) {
  if (argv.length !== 1) throw new Error("Usage: read-episode-contract.cjs EPISODE_YAML");
  const episodePath = path.resolve(argv[0]);
  console.log(JSON.stringify(readProductionContract(episodePath)));
}

if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { readProductionContract };
