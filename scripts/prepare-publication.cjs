#!/usr/bin/env node
"use strict";

// Prepare a reviewed candidate for hosting without crossing the hosting
// credential boundary. This command deliberately stops at a sealed handoff;
// staging and pull-request creation remain separate, explicit operations.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { createHostingHandoff, sha256Value, sourcePackageFiles, verifyHostingHandoff } = require("./prepare-hosting-handoff.cjs");
const { releaseIdentity } = require("./release-identity.cjs");
const { durationDisplay, PreHostingValidationError, validatePreHosting } = require("./validate-pre-hosting.cjs");
const { PACKAGE_OPERATION_IDS, assertEpisodePackageOperation, episodeStateText, withEpisodePackageOperation } = require("./episode-package-lifecycle.cjs");

class PublicationPreparationError extends Error {}
const PREPARATION_RECOVERY_FILE = ".publication-preparation.rollback.yaml";

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--recover-stale-lock") { values.recoverStaleLock = true; continue; }
    if (!token.startsWith("--")) throw new PublicationPreparationError(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new PublicationPreparationError(`Missing value for ${token}`);
    values[token.slice(2)] = value;
    index += 1;
  }
  for (const key of ["episode", "published-at", "out"]) if (!values[key]) throw new PublicationPreparationError(`--${key} is required.`);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(values["published-at"]) || Number.isNaN(Date.parse(values["published-at"]))) {
    throw new PublicationPreparationError("--published-at must be a UTC RFC 3339 timestamp such as 2026-09-09T13:00:08Z.");
  }
  return values;
}

function readYaml(filePath) {
  const document = YAML.parseDocument(fs.readFileSync(filePath, "utf8"));
  if (document.errors.length) throw new PublicationPreparationError(`Invalid YAML in ${filePath}: ${document.errors[0].message}`);
  return document.toJS();
}

function writeTextAtomically(filePath, text) {
  const temporary = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try { fs.writeFileSync(temporary, text, { mode: 0o644 }); fs.renameSync(temporary, filePath); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function writeYamlAtomically(filePath, value) {
  writeTextAtomically(filePath, typeof value === "string" ? value : YAML.stringify(value));
}

function preparationRecoveryPath(episodePath) {
  return path.join(path.resolve(episodePath), PREPARATION_RECOVERY_FILE);
}

function removePreparationRecovery(pathname) {
  try { fs.unlinkSync(pathname); }
  catch (error) { if (error?.code !== "ENOENT") throw error; }
}

function publicationTransactionState({ episodePath, journal }) {
  const currentEpisode = fs.readFileSync(path.join(episodePath, "episode.yaml"), "utf8");
  const currentHosting = fs.readFileSync(path.join(episodePath, "hosting-metadata.yaml"), "utf8");
  const episodeState = currentEpisode === journal.original_episode ? "original" : currentEpisode === journal.target_episode ? "target" : null;
  const hostingState = currentHosting === journal.original_hosting ? "original" : currentHosting === journal.target_hosting ? "target" : null;
  if (!episodeState || !hostingState) {
    throw new PublicationPreparationError("Episode or hosting metadata changed after publication preparation was interrupted; refusing recovery that could overwrite newer work.");
  }
  return { episodeState, hostingState };
}

function reconcileInterruptedPublication({ episodePath, outputDir, recoverStaleLock }) {
  const recoveryPath = preparationRecoveryPath(episodePath);
  if (!fs.existsSync(recoveryPath)) return null;
  if (!recoverStaleLock) {
    throw new PublicationPreparationError("An interrupted publication-preparation transaction was found. After confirming its package lease is dead, rerun with --recover-stale-lock to reconcile it.");
  }
  const journal = readYaml(recoveryPath);
  const resolvedEpisode = path.resolve(episodePath);
  const resolvedOutput = path.resolve(outputDir);
  if (journal?.schema_version !== 1 || journal.episode_path !== resolvedEpisode || journal.output_dir !== resolvedOutput
    || typeof journal.original_episode !== "string" || typeof journal.original_hosting !== "string"
    || typeof journal.target_episode !== "string" || typeof journal.target_hosting !== "string"
    || !journal.target_release || typeof journal.target_release !== "object" || Array.isArray(journal.target_release)
    || !journal.target_source_package_files || typeof journal.target_source_package_files !== "object" || Array.isArray(journal.target_source_package_files)) {
    throw new PublicationPreparationError("Publication-preparation recovery record does not match this episode and output directory; refusing to overwrite either path.");
  }
  const transactionState = publicationTransactionState({ episodePath: resolvedEpisode, journal });
  const currentSourceFiles = sourcePackageFiles(resolvedEpisode);
  const expectedCurrentSourceFiles = {
    ...journal.target_source_package_files,
    "episode.yaml": crypto.createHash("sha256").update(transactionState.episodeState === "target" ? journal.target_episode : journal.original_episode).digest("hex"),
    "hosting-metadata.yaml": crypto.createHash("sha256").update(transactionState.hostingState === "target" ? journal.target_hosting : journal.original_hosting).digest("hex"),
  };
  if (sha256Value(currentSourceFiles) !== sha256Value(expectedCurrentSourceFiles)) {
    throw new PublicationPreparationError("Source package files changed after publication preparation was interrupted; refusing recovery that could accept or overwrite newer work.");
  }
  if (fs.existsSync(resolvedOutput)) {
    if (transactionState.episodeState !== "target" || transactionState.hostingState !== "target") {
      throw new PublicationPreparationError("Interrupted publication left a handoff, but the package metadata is not the exact journaled prepared state; refusing to accept a handoff that no longer matches the package.");
    }
    try {
      const verified = verifyHostingHandoff({ outputDir: resolvedOutput });
      const sealedEpisode = verified.payload?.episode;
      if (sealedEpisode?.id !== journal.target_release.id || sealedEpisode?.title !== journal.target_release.title
        || sealedEpisode?.version !== journal.target_release.version || sealedEpisode?.published_at !== journal.target_release.published_at
        || sha256Value(verified.payload?.source_package_files) !== sha256Value(journal.target_source_package_files)) {
        throw new PublicationPreparationError("Interrupted publication handoff does not match the journaled release identity and source package; refusing to accept it as recovered.");
      }
      removePreparationRecovery(recoveryPath);
      return { outputDir: resolvedOutput, seal: verified.payload, recovered: true };
    } catch (error) {
      throw new PublicationPreparationError(`Interrupted publication left an existing but invalid handoff; inspect ${resolvedOutput} before retrying: ${error.message}`);
    }
  }
  writeTextAtomically(path.join(resolvedEpisode, "episode.yaml"), journal.original_episode);
  writeTextAtomically(path.join(resolvedEpisode, "hosting-metadata.yaml"), journal.original_hosting);
  removePreparationRecovery(recoveryPath);
  return null;
}

function sameUtcDate(left, right) {
  return typeof left === "string" && typeof right === "string" && left.slice(0, 10) === right.slice(0, 10);
}

function synchronizeReleaseMetadata({ episode, hosting, sourceValidation, publicationLinkValidation, publishedAt }) {
  if (episode.production_contract_version !== 2) {
    throw new PublicationPreparationError("This is a preserved legacy package. Do not reprepare it; run episode:script-review --reset before revising it under the current release contract.");
  }
  if (episode.source_verification?.relevance_review !== "complete" || sourceValidation.llm_requested !== true) {
    throw new PublicationPreparationError("A completed LLM source-relevance report is required before publication preparation.");
  }
  if (publicationLinkValidation?.validation_kind !== "publication_link_check" || publicationLinkValidation.llm_requested !== false || !sameUtcDate(publicationLinkValidation.checked_at_utc, publishedAt)) {
    throw new PublicationPreparationError("A passing deterministic publication-day source-link check is required on the requested publication date.");
  }
  if (!Number.isFinite(episode.runtime_actual_seconds) || episode.runtime_actual_seconds <= 0) throw new PublicationPreparationError("episode.yaml must record the accepted candidate runtime before publication preparation.");
  let identity;
  try { identity = releaseIdentity({ track: episode.track, id: episode.id, version: episode.version }); }
  catch (error) { throw new PublicationPreparationError(`Invalid release identity: ${error.message}`); }
  const release = hosting.publisher_release || {};
  if (typeof release.description !== "string" || !release.description.trim()) throw new PublicationPreparationError("hosting-metadata.yaml must contain the listener-facing episode description before publication preparation.");
  const nextEpisode = {
    ...episode,
    status: "ready_for_hosting_pr",
    published_at: publishedAt,
    source_verification: { ...episode.source_verification, status: "source_relevance_complete", verified_at_utc: sourceValidation.checked_at_utc, relevance_review: "complete" },
    audio: { ...episode.audio, status: "candidate_rendered_listening_qa_approved", chapter_markers: "embedded_and_ffprobe_validated", publication_day_validation: "passed" },
    hosting: { ...episode.hosting, handoff_status: "ready_for_hosting_pr" },
    release_gates_remaining: [],
  };
  const nextHosting = {
    ...hosting,
    publisher_release: {
      ...release,
      id: episode.id,
      title: episode.title,
      published_at: publishedAt,
      duration: durationDisplay(episode.runtime_actual_seconds),
      number: Number(identity.releaseKey.match(/(\d+)$/)[1]),
      audio: {},
    },
    provenance: { ...hosting.provenance, master_script: "master-script.md", show_notes: "show-notes.md", audio_manifest: "audio-manifest.yaml", source_validation: "link-validation.yaml", content_version: episode.version },
  };
  return { episode: nextEpisode, hosting: nextHosting };
}

function preparePublicationUnlocked({ episodePath, outputDir, publishedAt, cwd = process.cwd(), packageLease }) {
  const resolvedEpisode = path.resolve(episodePath);
  assertEpisodePackageOperation(resolvedEpisode, packageLease, PACKAGE_OPERATION_IDS.PUBLICATION_PREPARATION);
  const episodeYaml = path.join(resolvedEpisode, "episode.yaml");
  const hostingYaml = path.join(resolvedEpisode, "hosting-metadata.yaml");
  const sourceValidationYaml = path.join(resolvedEpisode, "link-validation.yaml");
  const publicationLinkValidationYaml = path.join(resolvedEpisode, "publication-link-validation.yaml");
  if (!fs.existsSync(episodeYaml) || !fs.existsSync(hostingYaml) || !fs.existsSync(sourceValidationYaml)) throw new PublicationPreparationError("The episode package must include episode.yaml, hosting-metadata.yaml, and link-validation.yaml.");
  const originalEpisode = fs.readFileSync(episodeYaml, "utf8");
  const originalHosting = fs.readFileSync(hostingYaml, "utf8");
  const episode = YAML.parse(originalEpisode);
  if (episode?.production_contract_version !== 2) throw new PublicationPreparationError("This is a preserved legacy package. Do not reprepare it; run episode:script-review --reset before revising it under the current release contract.");
  if (!fs.existsSync(publicationLinkValidationYaml)) throw new PublicationPreparationError("The episode package must include publication-link-validation.yaml.");
  const recoveryPath = preparationRecoveryPath(resolvedEpisode);
  const synchronized = synchronizeReleaseMetadata({ episode, hosting: YAML.parse(originalHosting), sourceValidation: readYaml(sourceValidationYaml), publicationLinkValidation: readYaml(publicationLinkValidationYaml), publishedAt });
  const preparedEpisode = episodeStateText(resolvedEpisode, synchronized.episode, packageLease, originalEpisode);
  const preparedHosting = YAML.stringify(synchronized.hosting);
  const expectedSourceFiles = sourcePackageFiles(resolvedEpisode);
  expectedSourceFiles["episode.yaml"] = crypto.createHash("sha256").update(preparedEpisode).digest("hex");
  expectedSourceFiles["hosting-metadata.yaml"] = crypto.createHash("sha256").update(preparedHosting).digest("hex");
  writeYamlAtomically(recoveryPath, {
    schema_version: 1,
    episode_path: resolvedEpisode,
    output_dir: path.resolve(outputDir),
    original_episode: originalEpisode,
    original_hosting: originalHosting,
    target_episode: preparedEpisode,
    target_hosting: preparedHosting,
    target_release: {
      id: synchronized.episode.id,
      title: synchronized.episode.title,
      version: synchronized.episode.version,
      published_at: synchronized.episode.published_at,
    },
    target_source_package_files: expectedSourceFiles,
  });
  try {
    writeYamlAtomically(episodeYaml, preparedEpisode);
    writeYamlAtomically(hostingYaml, preparedHosting);
    const validation = validatePreHosting({ episodePath: resolvedEpisode, cwd, packageLease });
    if (!validation.valid) throw new PublicationPreparationError(`Pre-hosting validation failed after release preparation:\n${validation.errors.join("\n")}`);
    const handoff = createHostingHandoff({ episodePath: resolvedEpisode, outputDir, cwd, packageLease });
    verifyHostingHandoff({ outputDir: handoff.outputDir });
    const transactionState = publicationTransactionState({ episodePath: resolvedEpisode, journal: {
      original_episode: originalEpisode,
      original_hosting: originalHosting,
      target_episode: preparedEpisode,
      target_hosting: preparedHosting,
    } });
    if (transactionState.episodeState !== "target" || transactionState.hostingState !== "target") {
      throw new PublicationPreparationError("Package metadata changed during handoff preparation; refusing to accept a handoff that no longer matches the package.");
    }
    removePreparationRecovery(recoveryPath);
    return handoff;
  } catch (error) {
    // Do not leave a package claiming release readiness if any downstream
    // check fails. The handoff builder itself only publishes its output after
    // construction succeeds and never replaces an existing directory.
    try {
      publicationTransactionState({ episodePath: resolvedEpisode, journal: {
        original_episode: originalEpisode,
        original_hosting: originalHosting,
        target_episode: preparedEpisode,
        target_hosting: preparedHosting,
      } });
    } catch (recoveryError) {
      throw new PublicationPreparationError(`Publication preparation failed and package metadata changed unexpectedly; refusing rollback: ${recoveryError.message}`);
    }
    writeTextAtomically(episodeYaml, originalEpisode);
    writeTextAtomically(hostingYaml, originalHosting);
    removePreparationRecovery(recoveryPath);
    throw error;
  }
}

function preparePublication({ episodePath, outputDir, publishedAt, cwd = process.cwd(), recoverStaleLock = false }) {
  const resolvedEpisode = path.resolve(episodePath);
  return withEpisodePackageOperation(resolvedEpisode, PACKAGE_OPERATION_IDS.PUBLICATION_PREPARATION, { recoverStaleLock }, (packageLease) => {
    assertEpisodePackageOperation(resolvedEpisode, packageLease, PACKAGE_OPERATION_IDS.PUBLICATION_PREPARATION);
    const recovered = reconcileInterruptedPublication({ episodePath: resolvedEpisode, outputDir, recoverStaleLock });
    return recovered || preparePublicationUnlocked({ episodePath: resolvedEpisode, outputDir, publishedAt, cwd, packageLease });
  });
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const handoff = preparePublication({ episodePath: options.episode, outputDir: options.out, publishedAt: options["published-at"], recoverStaleLock: Boolean(options.recoverStaleLock) });
    console.log(`Prepared and sealed release handoff: ${handoff.outputDir}`);
  } catch (error) {
    const message = error instanceof PublicationPreparationError || error instanceof PreHostingValidationError ? error.message : `Publication preparation failed: ${error.message}`;
    console.error(message);
    process.exitCode = 1;
  }
}

module.exports = { PREPARATION_RECOVERY_FILE, PublicationPreparationError, parseArgs, preparePublication, publicationTransactionState, reconcileInterruptedPublication, synchronizeReleaseMetadata };
