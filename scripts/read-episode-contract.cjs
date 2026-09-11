#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { productionContractKind, preservedProductionContract, utcRfc3339Timestamp } = require("./production-state-contract.cjs");

function readYamlMapping(filePath) {
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new Error(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`YAML document must contain a mapping: ${filePath}`);
  return value;
}

function publishedLegacyRelease(filePath, episode, kind) {
  if (!preservedProductionContract(kind) || !utcRfc3339Timestamp(episode.published_at)) return null;
  const metadataPath = path.join(path.dirname(filePath), "hosting-metadata.yaml");
  if (!fs.existsSync(metadataPath) || !fs.lstatSync(metadataPath).isFile()) return null;
  const metadata = readYamlMapping(metadataPath);
  const release = metadata.publisher_release;
  if (!release || typeof release !== "object" || Array.isArray(release)) return null;
  if (release.id !== episode.id || release.published_at !== episode.published_at || typeof release.title !== "string" || !release.title.trim()) return null;
  const published = metadata.published_release;
  if (!published || typeof published !== "object" || Array.isArray(published)) return null;
  if (!utcRfc3339Timestamp(published.deployed_at_utc)) return null;
  if (typeof published.publisher_repository !== "string" || !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(published.publisher_repository)) return null;
  if (typeof published.release_commit !== "string" || !/^[a-f0-9]{40}$/i.test(published.release_commit)) return null;
  if (typeof published.episode_page !== "string" || !published.episode_page.startsWith("https://")) return null;
  if (typeof published.enclosure_url !== "string" || !published.enclosure_url.startsWith("https://")) return null;
  if (!Number.isInteger(published.bytes) || published.bytes <= 0 || typeof published.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(published.sha256)) return null;
  // These local fields establish only a candidate for the retired renderer.
  // The Python caller verifies the publisher commit and public artifacts live
  // before it can use the legacy script as provider input.
  return {
    metadata_path: metadataPath,
    publisher_repository: published.publisher_repository,
    release_commit: published.release_commit,
    episode_page: published.episode_page,
    enclosure_url: published.enclosure_url,
    bytes: published.bytes,
    sha256: published.sha256.toLowerCase(),
    episode_id: release.id,
    title: release.title,
    content_version: metadata.provenance?.content_version,
  };
}

function readProductionContract(filePath) {
  const episode = readYamlMapping(filePath);
  const kind = productionContractKind(episode);
  const normalizedKind = preservedProductionContract(kind) ? "legacy" : kind;
  const legacyRelease = publishedLegacyRelease(filePath, episode, kind);
  return {
    kind: normalizedKind,
    episode_id: episode.id || null,
    legacy_published_release: legacyRelease ? { ...legacyRelease, metadata_path: path.basename(legacyRelease.metadata_path) } : null,
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
