#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { CONTRACT_KINDS, productionContractKind, utcRfc3339Timestamp } = require("./production-state-contract.cjs");

function readYamlMapping(filePath) {
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new Error(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`YAML document must contain a mapping: ${filePath}`);
  return value;
}

function publishedLegacyRelease(filePath, episode, kind) {
  if (kind !== CONTRACT_KINDS.PRESERVED_LEGACY || !utcRfc3339Timestamp(episode.published_at)) return null;
  const metadataPath = path.join(path.dirname(filePath), "hosting-metadata.yaml");
  if (!fs.existsSync(metadataPath) || !fs.lstatSync(metadataPath).isFile()) return null;
  const metadata = readYamlMapping(metadataPath);
  const release = metadata.publisher_release;
  if (!release || typeof release !== "object" || Array.isArray(release)) return null;
  if (release.id !== episode.id || release.published_at !== episode.published_at) return null;
  return { metadata_path: metadataPath };
}

function readProductionContract(filePath) {
  const episode = readYamlMapping(filePath);
  const kind = productionContractKind(episode);
  const normalizedKind = kind === CONTRACT_KINDS.PRESERVED_LEGACY ? "legacy" : kind;
  const legacyRelease = publishedLegacyRelease(filePath, episode, kind);
  return {
    kind: normalizedKind,
    episode_id: episode.id || null,
    legacy_published_release: legacyRelease ? { metadata_path: path.basename(legacyRelease.metadata_path) } : null,
  };
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
