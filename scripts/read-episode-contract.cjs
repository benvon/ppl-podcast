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
  const published = metadata.published_release;
  if (!published || typeof published !== "object" || Array.isArray(published)) return null;
  if (metadata.handoff_status !== "published" || !utcRfc3339Timestamp(published.deployed_at_utc)) return null;
  if (typeof published.publisher_repository !== "string" || !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(published.publisher_repository)) return null;
  if (typeof published.release_commit !== "string" || !/^[a-f0-9]{40}$/i.test(published.release_commit)) return null;
  if (typeof published.episode_page !== "string" || !published.episode_page.startsWith("https://")) return null;
  if (typeof published.enclosure_url !== "string" || !published.enclosure_url.startsWith("https://")) return null;
  if (!Number.isInteger(published.bytes) || published.bytes <= 0 || typeof published.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(published.sha256)) return null;
  const verification = published.public_verification;
  if (!verification || verification.feed_item !== "verified" || verification.episode_page !== "verified" || verification.enclosure_head !== "verified" || verification.enclosure_byte_range !== "verified") return null;
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
