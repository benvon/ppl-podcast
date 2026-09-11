"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const YAML = require("yaml");

const { MAX_RELEVANCE_EXCERPT_CHARACTERS, ValidationCancelledError, applyVerificationEvidence, assessRelevance, completeValidationReport, deterministicEntryValid, extractPdfPageText, failedValidationAttemptPath, fetchSource, fetchSourceCached, htmlFragmentText, linkResponseErrors, markValidationInProgress, refreshEcfrManifestDates, relevanceExcerpt, runOwnedValidation, runWithEcfrRateLimiter, runWithEcfrRefreshes, sourceValidationTerminalOutcome, validateClaimAssessments, validateClaimMappings, validateShowNotesMappings, validationFailurePath, validationInProgressPath, validationRecoveryPath, validationTargetErrors, verifyEcfrSection, verifyProgrammaticFallback } = require("./validate-source-links.cjs");
const { deriveNarration } = require("./derive-narration.cjs");
const { releaseIdentity } = require("./release-identity.cjs");
const { REQUIRED_NOTICE, acquireAssemblyReservation, assemble, assertNarrationInput, assertOutputsVacant, assertSourceRelevanceApproved, chapterFfmetadata, chapterMarkersFor, mixMusicBeds, musicCuePlan, musicVolumeExpression, parseScript, pauseBefore, pronunciationGuidance, renderSegments, reusableSegment, segmentInstruction, settingsFor, spokenText, terminalMusicTailMilliseconds, usageRecordFor, validateFrontMatter, verifyMp3Chapters, writeMp3WithChapters, writeWavOutput } = require("./render_episode_realtime.cjs");
const { AudioMixConfigError, audioMixMatchesManifest, loadAudioMixConfig } = require("./audio-mix-config.cjs");
const { analyzeRenderedAudio, analyzeStitchBoundaries, fadeSegmentPcm } = require("./audio-quality.cjs");
const { ChapterReviewError, createChapterReview, formatTimestamp, parseArgs: parseChapterReviewArgs, renderReviewHtml } = require("./create-chapter-review.cjs");
const { DRAFT_PACKAGE_SHAPE, durationDisplay, hasExactVisibleVersion, parseArgs: parsePreHostingArgs, pathWithin, validatePreHosting } = require("./validate-pre-hosting.cjs");
const { HostingHandoffError, createHostingHandoff, verifyHostingHandoff } = require("./prepare-hosting-handoff.cjs");
const { PublicationPreparationError, preparePublication, synchronizeReleaseMetadata } = require("./prepare-publication.cjs");
const { CLAIM_SOURCE_PREFLIGHT_TEMPLATE, approveScriptReview, migratedAudioMix, resetScriptReview, sha256Text } = require("./reset-script-review.cjs");
const { createClaimSourcePreflight, parseArgs: parseClaimSourcePreflightArgs, preflightEvidenceFor } = require("./claim-source-preflight.cjs");
const { CONTRACT_KINDS, RELEASE_GATES_AFTER_SCRIPT_APPROVAL, RELEASE_GATES_AFTER_SCRIPT_RESET, productionContractKind } = require("./production-state-contract.cjs");
const { sourceReviewEvidenceErrors } = require("./production-gates.cjs");
const { writeFileSetAtomically } = require("./file-transaction.cjs");
const { requestRateLimiter } = require("./validation-runtime.cjs");
const { claimSourcePreflightErrors, claimSourcePreflightInputHashes, retrievalReviewUntaggedPassageErrors, sourceRelevanceResultValid, sourceValidationInputHashes, validateMasterScriptSourceMappings } = require("./source-validation-contract.cjs");

function source(id, supportsClaims) {
  return { id, url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", locator: "Paragraph 1-1-1, p. 1-1-1", supports_claims: supportsClaims };
}

function fetchedLocatorEvidence(sourceEntry, excerpt) {
  return {
    citation_url: sourceEntry.url,
    final_url: sourceEntry.url,
    content_sha256: crypto.createHash("sha256").update(`fetched:${excerpt}`).digest("hex"),
    extraction_kind: "html_fragment",
    locator_excerpt_sha256: crypto.createHash("sha256").update(excerpt).digest("hex"),
    locator_excerpt_characters: excerpt.length,
    citation_target_valid: true,
  };
}

function writePassingSourceGate(episodePath, episode) {
  const checkedAt = "2026-09-10T00:00:00Z";
  const sourceLedger = YAML.parse(fs.readFileSync(path.join(episodePath, "sources.yaml"), "utf8"));
  const claimInventory = YAML.parse(fs.readFileSync(path.join(episodePath, "claim-inventory.yaml"), "utf8"));
  const sourceEntry = sourceLedger.sources[0]; const claim = claimInventory.claims[0];
  const excerpt = "The retained source excerpt supports the test claim.";
  fs.writeFileSync(path.join(episodePath, "show-notes.md"), "# Notes\n", "utf8");
  fs.writeFileSync(path.join(episodePath, "show-notes-manifest.yaml"), "links: []\n", "utf8");
  fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), [
    "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->",
    "- [x] Claim preflight complete. <!-- qa-id: claim-source-preflight -->",
    "- [x] Source review authorization. <!-- qa-id: openai-source-review-authorization -->",
  ].join("\n"), "utf8");
  fs.writeFileSync(path.join(episodePath, "claim-source-preflight.yaml"), YAML.stringify({
    schema_version: 1,
    validator: "scripts/claim-source-preflight.cjs",
    status: "complete",
    authorization: { consumed_at_utc: checkedAt, run_id: crypto.randomUUID() },
    checked_at_utc: checkedAt,
    llm_requested: true,
    llm_model: "test-model",
    input_sha256: claimSourcePreflightInputHashes(episodePath),
    results: [{
      source_id: sourceEntry.id,
      locator: sourceEntry.locator,
      linked_claim_ids: [claim.id],
      fetched_locator: fetchedLocatorEvidence(sourceEntry, excerpt),
      reviewed_excerpt: { kind: "section_text", text: excerpt, sha256: crypto.createHash("sha256").update(excerpt).digest("hex"), characters: excerpt.length },
      relevance: { status: "assessed", locator_assessment: { verdict: "supports", rationale: "Exact locator." }, claim_assessments: [{ claim_id: claim.id, verdict: "supports", rationale: "Supports claim." }] },
    }],
  }), "utf8");
  const result = { source_id: sourceEntry.id, linked_claim_ids: [claim.id], citation_target: { valid: true }, link: { valid: true }, relevance: { status: "assessed", assessment: { verdict: "supports", locator_assessment: { verdict: "supports" } } }, claim_assessments: { valid: true } };
  fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify({
    checked_at_utc: checkedAt,
    llm_requested: true,
    claim_mapping: { valid: true },
    master_script_mapping: { valid: true, source_tag_count: 0, claim_coverage_count: 0 },
    show_notes_mapping: { valid: true },
    show_notes_results: [],
    results: [result],
    input_sha256: sourceValidationInputHashes(episodePath),
  }), "utf8");
  episode.source_verification = { ...episode.source_verification, status: "source_relevance_complete", relevance_review: "complete", verified_at_utc: checkedAt, claim_source_preflight: "claim-source-preflight.yaml", claim_source_preflight_status: "complete", link_validation: "link-validation.yaml", show_notes_manifest: "show-notes-manifest.yaml" };
  fs.writeFileSync(path.join(episodePath, "episode.yaml"), YAML.stringify(episode), "utf8");
}

function wavForTest(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8); header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(24_000, 24); header.writeUInt32LE(48_000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

test("source-link validation does not mistake an ordinary site contact CAPTCHA for an access interstitial", () => {
  const page = {
    status: 200,
    content_type: "text/html",
    title: "GFA",
    excerpt: "Contact us. Captcha text: Enter the text from the image before submitting the feedback form.",
  };
  assert.deepEqual(linkResponseErrors("https://aviationweather.gov/gfa/", page), []);
  assert.deepEqual(
    linkResponseErrors("https://aviationweather.gov/gfa/", { ...page, title: "Access denied", excerpt: "Complete the CAPTCHA challenge." }),
    ["received an access interstitial instead of the cited resource"],
  );
});

test("production contract classification is explicit and shared", () => {
  assert.equal(productionContractKind({ production_contract_version: 2 }), CONTRACT_KINDS.CURRENT);
  assert.equal(productionContractKind({ id: "core-01" }), CONTRACT_KINDS.PRESERVED_LEGACY);
  for (const episode of [{ production_contract_version: null }, { production_contract_version: "2" }, { production_contract_version: 3 }, null]) {
    assert.equal(productionContractKind(episode), CONTRACT_KINDS.UNSUPPORTED);
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-prehost-contract-test-"));
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), "id: core-01\n", "utf8");
    const result = validatePreHosting({ episodePath: temporary, cwd: temporary, packageOnly: true });
    assert.equal(result.valid, false);
    assert.match(result.errors.join("\n"), /preserved legacy package/);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("multi-file state transitions roll back every target when promotion fails", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-file-transaction-test-"));
  const first = path.join(temporary, "first.yaml"); const second = path.join(temporary, "second.yaml"); const created = path.join(temporary, "created.yaml");
  fs.writeFileSync(first, "first: old\n", "utf8"); fs.writeFileSync(second, "second: old\n", "utf8");
  try {
    assert.throws(() => writeFileSetAtomically(new Map([[first, "first: new\n"], [second, "second: new\n"], [created, "created: true\n"]]), {
      beforePromote: ({ index }) => { if (index === 1) throw new Error("injected promotion failure"); },
    }), /injected promotion failure/);
    assert.equal(fs.readFileSync(first, "utf8"), "first: old\n");
    assert.equal(fs.readFileSync(second, "utf8"), "second: old\n");
    assert.equal(fs.existsSync(created), false);
    assert.deepEqual(fs.readdirSync(temporary).sort(), ["first.yaml", "second.yaml"]);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("source validation failure and cancellation use one terminal finalizer", async () => {
  for (const failure of [new Error("injected failure"), new ValidationCancelledError("injected cancellation")]) {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validation-finalizer-test-"));
    const output = path.join(temporary, "link-validation.yaml");
    fs.writeFileSync(output, "status: previous-success\n", "utf8");
    const run = markValidationInProgress(output, { sources: "a".repeat(64) });
    try {
      await assert.rejects(runOwnedValidation(output, run, async () => { throw failure; }), new RegExp(failure.message));
      assert.equal(fs.existsSync(validationInProgressPath(output)), false);
      const marker = YAML.parse(fs.readFileSync(validationFailurePath(output), "utf8"));
      const attempt = YAML.parse(fs.readFileSync(path.resolve(path.dirname(output), marker.failed_attempt), "utf8"));
      assert.equal(attempt.failure.outcome, failure instanceof ValidationCancelledError ? "cancelled" : "failed");
      assert.equal(fs.readFileSync(output, "utf8"), "status: previous-success\n");
    } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
  }
});

test("owned validation still finalizes when its optional failure-report transformer fails", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-owned-validation-transformer-test-"));
  const output = path.join(temporary, "link-validation.yaml");
  try {
    const run = markValidationInProgress(output, { sources: "input" });
    await assert.rejects(
      runOwnedValidation(output, run, async () => { throw new Error("original failure"); }, { failureReport: () => { throw new Error("transformer failure"); } }),
      /original failure/,
    );
    assert.equal(fs.existsSync(validationInProgressPath(output)), false);
    const marker = YAML.parse(fs.readFileSync(validationFailurePath(output), "utf8"));
    const attempt = YAML.parse(fs.readFileSync(path.join(temporary, marker.failed_attempt), "utf8"));
    assert.equal(attempt.failure.reason, "original failure");
    assert.equal(attempt.failure.report_transform_error, "transformer failure");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("source validation records signal-driven dependency failures as cancellation", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validation-signal-finalizer-test-"));
  const output = path.join(temporary, "link-validation.yaml");
  const run = markValidationInProgress(output, { sources: "a".repeat(64) });
  try {
    await assert.rejects(runOwnedValidation(output, run, async () => { throw new Error("request aborted"); }, { isCancelled: () => true }), /request aborted/);
    const marker = YAML.parse(fs.readFileSync(validationFailurePath(output), "utf8"));
    const attempt = YAML.parse(fs.readFileSync(path.resolve(path.dirname(output), marker.failed_attempt), "utf8"));
    assert.equal(attempt.failure.outcome, "cancelled");
    assert.equal(fs.existsSync(validationInProgressPath(output)), false);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("only a required-LLM validation can complete source-review state", () => {
  assert.equal(sourceValidationTerminalOutcome({ unresolved: false, requireLlm: false }), "pending");
  assert.equal(sourceValidationTerminalOutcome({ unresolved: false, requireLlm: true }), "complete");
  assert.equal(sourceValidationTerminalOutcome({ unresolved: true, requireLlm: true }), "failed");
});

test("script-review reset invalidates downstream state and approval fingerprints the current script", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-script-review-test-"));
  try {
    const script = "# Test\n\n**Version:** 0.1.1\n**Production status:** Ready for hosting handoff.\n\n**INSTRUCTOR:**\n\nChanged spoken lesson.\n";
    const migratedScript = script.replace(/^\*\*Production status:\*\*.*\n/m, "");
    fs.writeFileSync(path.join(temporary, "master-script.md"), script);
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ status: "ready_for_hosting_pr", runtime_actual_seconds: 12, audio: { status: "candidate_rendered_listening_qa_approved", publication_day_validation: "passed", chapter_markers: "embedded_and_ffprobe_validated" }, hosting: { handoff_status: "ready_for_hosting_pr" }, source_verification: { status: "source_relevance_complete", relevance_review: "complete", verified_at_utc: "2026-01-01T00:00:00Z" }, review: { editorial_status: "script_approved", editorial_script_sha256: "old" } }));
    fs.writeFileSync(path.join(temporary, "audio-manifest.yaml"), YAML.stringify({ status: "candidate_rendered_listening_qa_approved", publication_day_validation: "passed", required_before_release: ["Stage the audio."], current_candidate_render: { sha256: "a".repeat(64) }, chapter_markers: { status: "embedded_and_ffprobe_validated", audio_sha256: "a".repeat(64), review_page: "candidate.html" } }));
    fs.writeFileSync(path.join(temporary, "hosting-metadata.yaml"), YAML.stringify({ handoff_status: "ready_for_hosting_pr", release_readiness: { remaining_release_gates: ["Stage the audio."] }, publisher_release: {} }));

    const reset = resetScriptReview({ episodePath: temporary, reason: "Changed spoken lesson." });
    const episodeAfterReset = YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8"));
    const audioAfterReset = YAML.parse(fs.readFileSync(path.join(temporary, "audio-manifest.yaml"), "utf8"));
    assert.equal(episodeAfterReset.status, "editorial_review_pending");
    assert.equal(episodeAfterReset.production_contract_version, 2);
    assert.equal(episodeAfterReset.review.editorial_status, "reapproval_required");
    assert.equal(episodeAfterReset.review.pending_script_sha256, sha256Text(migratedScript));
    assert.equal(episodeAfterReset.source_verification.relevance_review, "pending");
    assert.equal(episodeAfterReset.source_verification.claim_source_preflight, "claim-source-preflight.yaml");
    assert.equal(episodeAfterReset.runtime_actual_seconds, null);
    assert.equal(episodeAfterReset.audio.status, "not_rendered");
    assert.equal(episodeAfterReset.audio.publication_day_validation, "pending");
    assert.equal(episodeAfterReset.audio.chapter_markers, "pending_render");
    assert.equal(episodeAfterReset.hosting.handoff_status, "pending_script_review");
    assert.deepEqual(episodeAfterReset.release_gates_remaining, RELEASE_GATES_AFTER_SCRIPT_RESET);
    assert.equal(audioAfterReset.current_candidate_render, null);
    assert.equal(episodeAfterReset.audio.mix_config, "audio-mix.yaml");
    assert.deepEqual(YAML.parse(fs.readFileSync(path.join(temporary, "audio-mix.yaml"), "utf8")), { schema_version: 1, music: { enabled: false } });
    assert.equal(audioAfterReset.status, undefined);
    assert.equal(audioAfterReset.publication_day_validation, undefined);
    assert.equal(audioAfterReset.required_before_release, undefined);
    assert.equal(audioAfterReset.chapter_markers.status, undefined);
    assert.deepEqual(YAML.parse(fs.readFileSync(path.join(temporary, "claim-source-preflight.yaml"), "utf8")), CLAIM_SOURCE_PREFLIGHT_TEMPLATE);
    const migratedChecklist = fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8");
    assert.match(migratedChecklist, /qa-id: openai-claim-source-preflight-authorization/);
    assert.match(migratedChecklist, /qa-id: claim-source-preflight/);
    const hostingAfterReset = YAML.parse(fs.readFileSync(path.join(temporary, "hosting-metadata.yaml"), "utf8"));
    assert.equal(hostingAfterReset.handoff_status, undefined);
    assert.equal(hostingAfterReset.release_readiness, undefined);
    assert.equal(audioAfterReset.superseded_candidates[0].sha256, "a".repeat(64));
    assert.equal(reset.scriptSha256, sha256Text(migratedScript));
    assert.doesNotMatch(fs.readFileSync(path.join(temporary, "master-script.md"), "utf8"), /^\*\*Production status:\*\*/m);

    fs.writeFileSync(path.join(temporary, "sources.yaml"), "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1\n    supports_claims: [claim-a]\n", "utf8");
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), "claims:\n  - id: claim-a\n    sources: [source-a]\n", "utf8");
    writePassingSourceGate(temporary, episodeAfterReset);
    approveScriptReview({ episodePath: temporary });
    const approved = YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8"));
    assert.equal(approved.status, "source_relevance_review_complete");
    assert.equal(approved.review.editorial_status, "script_approved");
    assert.equal(approved.review.editorial_script_sha256, sha256Text(migratedScript));
    assert.equal(approved.review.pending_script_sha256, undefined);
    assert.deepEqual(approved.release_gates_remaining, RELEASE_GATES_AFTER_SCRIPT_APPROVAL);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("script-review reset invalidates claim-source preflight authorization when its inputs change", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-script-review-preflight-reset-test-"));
  try {
    const sourcesPath = path.join(temporary, "sources.yaml");
    const claimsPath = path.join(temporary, "claim-inventory.yaml");
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n", "utf8");
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ title: "Test", source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "audio-manifest.yaml"), YAML.stringify({}));
    fs.writeFileSync(path.join(temporary, "hosting-metadata.yaml"), YAML.stringify({}));
    fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1\n    supports_claims: [claim-a]\n", "utf8");
    fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [source-a]\n", "utf8");
    writePassingSourceGate(temporary, YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")));

    resetScriptReview({ episodePath: temporary });
    const currentChecklist = fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8");
    assert.match(currentChecklist, /- \[x\] Claim preflight authorization/);
    assert.equal(YAML.parse(fs.readFileSync(path.join(temporary, "claim-source-preflight.yaml"), "utf8")).status, "complete");

    fs.writeFileSync(claimsPath, "claims:\n  - id: claim-b\n    sources: [source-a]\n", "utf8");
    resetScriptReview({ episodePath: temporary });
    const staleChecklist = fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8");
    assert.match(staleChecklist, /- \[ \] Claim preflight authorization/);
    assert.match(staleChecklist, /- \[ \] Claim preflight complete/);
    assert.deepEqual(YAML.parse(fs.readFileSync(path.join(temporary, "claim-source-preflight.yaml"), "utf8")), CLAIM_SOURCE_PREFLIGHT_TEMPLATE);

    fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1\n    supports_claims: [claim-b]\n", "utf8");
    writePassingSourceGate(temporary, YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")));
    const incompletePreflightPath = path.join(temporary, "claim-source-preflight.yaml");
    const incompletePreflight = YAML.parse(fs.readFileSync(incompletePreflightPath, "utf8"));
    incompletePreflight.status = "pending";
    fs.writeFileSync(incompletePreflightPath, YAML.stringify(incompletePreflight));
    resetScriptReview({ episodePath: temporary });
    const incompleteChecklist = fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8");
    assert.match(incompleteChecklist, /- \[ \] Claim preflight authorization/);
    assert.match(incompleteChecklist, /- \[ \] Claim preflight complete/);

    writePassingSourceGate(temporary, YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")));
    fs.unlinkSync(path.join(temporary, "claim-source-preflight.yaml"));
    resetScriptReview({ episodePath: temporary });
    const missingArtifactChecklist = fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8");
    assert.match(missingArtifactChecklist, /- \[ \] Claim preflight authorization/);
    assert.match(missingArtifactChecklist, /- \[ \] Claim preflight complete/);
    assert.deepEqual(YAML.parse(fs.readFileSync(path.join(temporary, "claim-source-preflight.yaml"), "utf8")), CLAIM_SOURCE_PREFLIGHT_TEMPLATE);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("historical music metadata migrates to the explicit series mix contract", () => {
  assert.deepEqual(migratedAudioMix({}), { schema_version: 1, music: { enabled: false } });
  assert.deepEqual(migratedAudioMix({ current_candidate_render: { music_bed: "custom-music.mp3" } }), { schema_version: 1, music: { enabled: false } });
  assert.deepEqual(migratedAudioMix({ current_candidate_render: { music_bed: "Source assets/music/jonasblakewood-synth-pop_60s-583368.mp3" } }), {
    schema_version: 1,
    music: {
      enabled: true,
      source: "../../assets/music/jonasblakewood-synth-pop_60s-583368.mp3",
      base_gain_db: -24,
      voice_gain_db: -30,
      level_transition_seconds: 0.15,
      intro_lead_seconds: 10,
      intro_tail_seconds: 5,
      intro_fade_seconds: 0.5,
      outro_tail_seconds: 10,
      outro_fade_seconds: 5,
    },
  });
});

function wavWithListMetadata(pcm) {
  const wav = wavForTest(pcm); const payload = Buffer.from("ISFT\u0004\u0000\u0000\u0000test", "ascii"); const list = Buffer.alloc(8 + payload.length);
  list.write("LIST", 0); list.writeUInt32LE(payload.length, 4); payload.copy(list, 8);
  const result = Buffer.concat([wav.subarray(0, 36), list, wav.subarray(36)]);
  result.writeUInt32LE(result.length - 8, 4);
  return result;
}

test("chapter review renders readable, escaped embedded-marker controls", () => {
  const html = renderReviewHtml({
    audioUrl: "core-05.mp3",
    audioSha256: "a".repeat(64),
    episodeTitle: "core-05 chapter review",
    chapters: [{ index: 1, title: "Lift < Drag", start: 74, end: 120 }],
  });
  assert.equal(formatTimestamp(74), "1:14");
  assert.match(html, /data-start="74"/);
  assert.match(html, /Lift &lt; Drag/);
  assert.match(html, /This page reads the chapters embedded in the MP3 itself/);
  assert.match(html, /src="core-05\.mp3\?v=a{64}"/);
  assert.match(html, /href="core-05\.mp3"/);
  assert.match(html, /name="ppl-audio-sha256" content="a{64}"/);
});

test("chapter review accepts its manifest argument", () => {
  assert.deepEqual(parseChapterReviewArgs(["--manifest", "audio-artifacts/example.render-manifest.json"]), { manifest: "audio-artifacts/example.render-manifest.json" });
});

test("pre-hosting validation accepts the approved-draft package flag", () => {
  assert.deepEqual(parsePreHostingArgs(["--episode", "episodes/core-10-aircraft-performance-density-altitude", "--package-only"]), {
    episode: "episodes/core-10-aircraft-performance-density-altitude",
    packageOnly: true,
  });
});

test("public release identities keep core, supplemental, and rough-spots tags distinct", () => {
  assert.deepEqual(releaseIdentity({ track: "core", id: "core-07", version: "0.1.4" }), { releaseKey: "episode-07", contentVersion: "0.1.4", tag: "episode-07/v0.1.4", recordAsset: "episode-07-v0.1.4.json" });
  assert.equal(releaseIdentity({ track: "supplemental", id: "supplement-01", version: "0.1.0" }).tag, "supplement-01/v0.1.0");
  assert.equal(releaseIdentity({ track: "rough-spots", id: "rough-001", version: "1.2.3" }).tag, "rough-spot-001/v1.2.3");
  assert.throws(() => releaseIdentity({ track: "core", id: "supplement-01", version: "0.1.0" }), /does not match/);
  assert.throws(() => releaseIdentity({ track: "core", id: "core-001", version: "0.1.0" }), /does not match/);
  assert.throws(() => releaseIdentity({ track: "rough-spots", id: "rough-01", version: "0.1.0" }), /does not match/);
  assert.throws(() => releaseIdentity({ track: "core", id: "core-01", version: "1.0.0-01" }), /semantic versioning/);
});

test("the master-script template preserves the standard ACS opening and paragraph style", () => {
  const template = fs.readFileSync(path.join(__dirname, "..", "templates", "master-script.md"), "utf8");
  assert.match(template, /## \[01:05\] What the ACS is asking you to connect/);
  assert.match(template, /\*\*ANNOUNCER:\*\*\n\nWhat the ACS is asking you to connect\./);
  assert.match(template, /Write each spoken paragraph as one normal Markdown line\. Do not hard-wrap prose\./);
  assert.doesNotMatch(template, /^\*\*Production status:\*\*/m);
});

test("templates keep mutable production state only in episode metadata", () => {
  const root = path.join(__dirname, "..");
  const episode = YAML.parse(fs.readFileSync(path.join(root, "templates", "episode.yaml"), "utf8"));
  const audio = YAML.parse(fs.readFileSync(path.join(root, "templates", "audio-manifest.yaml"), "utf8"));
  const hosting = YAML.parse(fs.readFileSync(path.join(root, "templates", "hosting-metadata.yaml"), "utf8"));
  assert.equal(episode.status, "planned");
  assert.equal(episode.audio.status, "not_rendered");
  assert.equal(episode.audio.mix_config, "audio-mix.yaml");
  assert.equal(episode.audio.chapter_markers, "pending_render");
  assert.equal(episode.audio.publication_day_validation, "pending");
  assert.equal(episode.hosting.handoff_status, "draft");
  assert.equal(audio.status, undefined);
  assert.equal(audio.publication_day_validation, undefined);
  assert.equal(audio.chapter_markers.status, undefined);
  assert.equal(hosting.handoff_status, undefined);
});

test("publication preparation synchronizes derived release facts without staging", () => {
  const episode = { id: "core-14", track: "core", production_contract_version: 2, title: "Airport Operations", version: "0.1.12", runtime_actual_seconds: 2579, source_verification: { relevance_review: "complete" }, audio: {}, hosting: {} };
  const hosting = { publisher_release: { description: "Listener-facing description.", guid: "test-guid" }, provenance: {} };
  const sourceValidation = { checked_at_utc: "2026-09-09T12:59:53.641Z", llm_requested: true };
  const synchronized = synchronizeReleaseMetadata({ episode, hosting, sourceValidation, publishedAt: "2026-09-09T13:00:08Z" });
  assert.equal(synchronized.episode.status, "ready_for_hosting_pr");
  assert.equal(synchronized.episode.source_verification.verified_at_utc, sourceValidation.checked_at_utc);
  assert.equal(synchronized.hosting.publisher_release.duration, "00:42:59");
  assert.equal(synchronized.hosting.publisher_release.number, 14);
  assert.deepEqual(synchronized.hosting.publisher_release.audio, {});
  assert.throws(() => synchronizeReleaseMetadata({ episode, hosting, sourceValidation, publishedAt: "2026-09-10T13:00:08Z" }), PublicationPreparationError);
  assert.throws(() => synchronizeReleaseMetadata({ episode: { ...episode, production_contract_version: undefined }, hosting, sourceValidation, publishedAt: "2026-09-09T13:00:08Z" }), /preserved legacy package/);
});

test("legacy publication preparation leaves package bytes untouched", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-preparation-test-"));
  const episodePath = path.join(temporary, "legacy"); fs.mkdirSync(episodePath);
  const episodeYaml = "id: core-13\ntrack: core\ntitle: Legacy\nversion: 0.1.1\n";
  const hostingYaml = "publisher_release:\n  description: Legacy description\n  duration: \"00:29:02\"\n";
  fs.writeFileSync(path.join(episodePath, "episode.yaml"), episodeYaml);
  fs.writeFileSync(path.join(episodePath, "hosting-metadata.yaml"), hostingYaml);
  fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), "checked_at_utc: 2026-09-09T12:00:00Z\nllm_requested: true\n");
  try {
    assert.throws(() => preparePublication({ episodePath, outputDir: path.join(temporary, "should-not-exist"), publishedAt: "2026-09-09T13:00:08Z", cwd: temporary }), /preserved legacy package/);
    assert.equal(fs.readFileSync(path.join(episodePath, "episode.yaml"), "utf8"), episodeYaml);
    assert.equal(fs.readFileSync(path.join(episodePath, "hosting-metadata.yaml"), "utf8"), hostingYaml);
    assert.equal(fs.existsSync(path.join(temporary, "should-not-exist")), false);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("the show-notes template leaves the single production disclosure to hosting", () => {
  const template = fs.readFileSync(path.join(__dirname, "..", "templates", "show-notes.md"), "utf8");
  const checklist = fs.readFileSync(path.join(__dirname, "..", "templates", "qa-checklist.md"), "utf8");
  assert.doesNotMatch(template, /^## Production notice\b/im);
  assert.match(checklist, /show notes contain study links and synopsis only/i);
});

test("chapter review rejects a manifest checksum that does not match its MP3", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-chapter-review-test-"));
  const audioPath = path.join(temporary, "candidate.mp3");
  const manifestPath = path.join(temporary, "candidate.render-manifest.json");
  fs.writeFileSync(audioPath, "not-an-mp3-but-hashable");
  fs.writeFileSync(manifestPath, JSON.stringify({ audio: { output: audioPath, sha256: "a".repeat(64) }, chapters: { audio_sha256: "a".repeat(64) } }));
  try {
    assert.throws(() => createChapterReview({ manifestPath }), (error) => error instanceof ChapterReviewError && /does not match the current audio file/.test(error.message));
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("pre-hosting artifact paths cannot escape the workspace through a symlink", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-artifact-path-test-"));
  const outside = path.join(os.tmpdir(), `ppl-artifact-outside-${process.pid}`);
  const linked = path.join(temporary, "linked-artifact");
  fs.writeFileSync(outside, "outside workspace"); fs.symlinkSync(outside, linked);
  try {
    assert.equal(pathWithin(temporary, linked), false);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
    fs.rmSync(outside, { force: true });
  }
});

test("pre-hosting validation requires consistent release records", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-pre-hosting-test-"));
  const episodePath = path.join(temporary, "episode"); const masterPath = path.join(temporary, "candidate.master.wav"); const audioPath = path.join(temporary, "candidate.mp3"); const renderPath = path.join(temporary, "candidate.render-manifest.json"); const qualityPath = path.join(temporary, "candidate.audio-quality.json"); const reviewPath = path.join(temporary, "candidate.chapters.hash.html"); const masterScriptPath = path.join(episodePath, "master-script.md"); const narrationPath = path.join(episodePath, "narration.md");
  const markers = [{ id: "chapter-001", start_ms: 0, end_ms: 2_000, title: "Opening" }];
  fs.mkdirSync(episodePath); fs.writeFileSync(masterPath, wavForTest(Buffer.alloc(24_000 * 2 * 2))); writeMp3WithChapters({ masterPath, mp3Path: audioPath, chapters: markers });
  const sha256 = require("crypto").createHash("sha256").update(fs.readFileSync(audioPath)).digest("hex");
  const masterScript = "# Test\n\n**Version:** 0.1.0\n\n**INSTRUCTOR:**\n\nA test lesson.\n";
  const narration = deriveNarration(masterScript);
  const narrationSha256 = require("crypto").createHash("sha256").update(narration).digest("hex");
  fs.writeFileSync(masterScriptPath, masterScript); fs.writeFileSync(narrationPath, narration);
  const sourceUrl = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html";
  fs.writeFileSync(path.join(episodePath, "sources.yaml"), `sources:\n  - id: source-a\n    url: ${sourceUrl}\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n`); fs.writeFileSync(path.join(episodePath, "claim-inventory.yaml"), "claims:\n  - id: claim-a\n    sources: [source-a]\n");
  const renderRecord = (chapterMarkers = markers) => ({ script: narrationPath, script_sha256: narrationSha256, audio: { output: audioPath, sha256, duration_seconds: 2, quality: { result: "passed", report: qualityPath } }, chapters: { audio_sha256: sha256, markers: chapterMarkers } });
  fs.writeFileSync(renderPath, JSON.stringify(renderRecord()));
  const qualityRecord = (overrides = {}) => ({ result: "passed", manifest: renderPath, output: { path: audioPath, sha256, probe: { format: { duration: "2.000000" } } }, ...overrides });
  fs.writeFileSync(qualityPath, JSON.stringify(qualityRecord())); fs.writeFileSync(reviewPath, `<meta name="ppl-audio-sha256" content="${sha256}">`);
  fs.writeFileSync(path.join(episodePath, "episode.yaml"), YAML.stringify({ id: "core-01", track: "core", production_contract_version: 2, title: "Test", version: "0.1.0", status: "ready_for_hosting_pr", published_at: "2026-08-24T13:31:04Z", runtime_actual_seconds: 2, audio: { manifest: "audio-manifest.yaml", mix_config: "audio-mix.yaml", status: "candidate_rendered_listening_qa_approved", publication_day_validation: "passed", chapter_markers: "embedded_and_ffprobe_validated" }, hosting: { metadata: "hosting-metadata.yaml", handoff_status: "ready_for_hosting_pr" }, public_notes: "show-notes.md", source_verification: { status: "source_relevance_complete", verified_at_utc: "2026-08-24T13:32:00Z", claim_source_preflight: "claim-source-preflight.yaml", claim_source_preflight_status: "complete", link_validation: "link-validation.yaml", show_notes_manifest: "show-notes-manifest.yaml", relevance_review: "complete" }, review: { editorial_status: "script_approved", editorial_script_sha256: crypto.createHash("sha256").update(masterScript).digest("hex") } }));
  fs.writeFileSync(path.join(episodePath, "audio-mix.yaml"), "schema_version: 1\nmusic:\n  enabled: false\n");
  fs.writeFileSync(path.join(episodePath, "audio-manifest.yaml"), YAML.stringify({ current_candidate_render: { script_version: "0.1.0", sha256, duration_seconds: 2, mp3: path.basename(audioPath), render_manifest: path.basename(renderPath), audio_quality_report: path.basename(qualityPath), chapter_review: path.basename(reviewPath), validation: "passed" }, chapter_markers: { audio_sha256: sha256 } }));
  fs.writeFileSync(path.join(episodePath, "hosting-metadata.yaml"), YAML.stringify({ publisher_release: { id: "core-01", title: "Test", published_at: "2026-08-24T13:31:04Z", duration: "00:00:02", number: 1, audio: {} }, provenance: { content_version: "0.1.0", show_notes: "show-notes.md", audio_manifest: "audio-manifest.yaml" } }));
  fs.writeFileSync(path.join(episodePath, "show-notes.md"), `[FAA reference](${sourceUrl})\n`); fs.writeFileSync(path.join(episodePath, "show-notes-manifest.yaml"), `links:\n  - id: note-a\n    text: FAA reference\n    url: ${sourceUrl}\n    locator: Paragraph 1-1-1, p. 1-1-1\n    source_id: source-a\n    claim_ids: [claim-a]\n`); fs.writeFileSync(path.join(episodePath, "research-packet.md"), "Research packet.\n"); fs.writeFileSync(path.join(episodePath, "production-log.md"), "Production log.\n");
  const inputSha256 = sourceValidationInputHashes(episodePath);
  const linkValidation = () => ({ checked_at_utc: "2026-08-24T13:32:00Z", llm_requested: true, input_sha256: inputSha256, claim_mapping: { valid: true }, master_script_mapping: { valid: true, status: "not_configured", source_tag_count: 0, claim_coverage_count: 0 }, show_notes_mapping: { valid: true }, show_notes_results: [{ id: "note-a", url: sourceUrl, source_id: "source-a", claim_ids: ["claim-a"], citation_target: { valid: true }, link: { valid: true } }], results: [{ source_id: "source-a", linked_claim_ids: ["claim-a"], citation_target: { valid: true }, link: { valid: true }, relevance: { status: "assessed", assessment: { verdict: "supports", locator_assessment: { verdict: "supports" } } }, claim_assessments: { valid: true } }] });
  fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(linkValidation()));
  const preflightExcerpt = "The cited section directly states the test claim.";
  const preflight = () => ({ schema_version: 1, validator: "scripts/claim-source-preflight.cjs", status: "complete", authorization: { consumed_at_utc: "2026-08-24T12:00:00Z", run_id: crypto.randomUUID() }, checked_at_utc: "2026-08-24T12:00:00Z", llm_requested: true, llm_model: "gpt-5.6-sol", input_sha256: claimSourcePreflightInputHashes(episodePath), results: [{ source_id: "source-a", locator: "Paragraph 1-1-1, p. 1-1-1", linked_claim_ids: ["claim-a"], fetched_locator: fetchedLocatorEvidence({ url: sourceUrl }, preflightExcerpt), reviewed_excerpt: { kind: "section_text", text: preflightExcerpt, sha256: crypto.createHash("sha256").update(preflightExcerpt).digest("hex"), characters: preflightExcerpt.length }, relevance: { status: "assessed", locator_assessment: { verdict: "supports", rationale: "The retained excerpt is the exact cited paragraph." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "The cited section directly states the test claim." }] } }] });
  fs.writeFileSync(path.join(episodePath, "claim-source-preflight.yaml"), YAML.stringify(preflight()));
  fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), ["Full candidate has been listened. <!-- qa-id: audio-listening -->", "No clipped. <!-- qa-id: audio-integrity -->", "The final MP3 chapter list starts at `00:00`. <!-- qa-id: chapters-manual -->", "FAA/ links were re-verified. <!-- qa-id: publication-source-links -->", "Hosting metadata agrees. <!-- qa-id: hosting-metadata -->", "Explicit authorization was received before proposed claims and source excerpts were sent to OpenAI. <!-- qa-id: openai-claim-source-preflight-authorization -->", "Claim-source preflight findings were resolved before full spoken prose was drafted. <!-- qa-id: claim-source-preflight -->", "Explicit authorization was received before source material was sent to OpenAI. <!-- qa-id: openai-source-review-authorization -->"].map((line) => `- [x] ${line}`).join("\n"));
  try {
    assert.deepEqual(validatePreHosting({ episodePath, cwd: temporary }), { valid: true, errors: [] });
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml.failed"), "run_id: failed-run\n", "utf8");
    const failedSourceValidation = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(failedSourceValidation.valid, false); assert.match(failedSourceValidation.errors.join("\n"), /most recent source-relevance validation failed/);
    fs.unlinkSync(path.join(episodePath, "link-validation.yaml.failed"));
    const authorizedChecklist = fs.readFileSync(path.join(episodePath, "qa-checklist.md"), "utf8");
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), authorizedChecklist.replace(/^.*openai-source-review-authorization.*\n?/m, ""));
    const missingAuthorization = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(missingAuthorization.valid, false); assert.match(missingAuthorization.errors.join("\n"), /explicit authorization before sending source material to OpenAI/);
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), authorizedChecklist);
    const preflightWithoutAuthorization = preflight(); delete preflightWithoutAuthorization.authorization;
    fs.writeFileSync(path.join(episodePath, "claim-source-preflight.yaml"), YAML.stringify(preflightWithoutAuthorization));
    const missingPreflightAuthorization = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(missingPreflightAuthorization.valid, false); assert.match(missingPreflightAuthorization.errors.join("\n"), /claim-source-preflight/);
    fs.writeFileSync(path.join(episodePath, "claim-source-preflight.yaml"), YAML.stringify(preflight()));
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), authorizedChecklist);
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), authorizedChecklist.replace(/^.*claim-source-preflight -->.*\n?/m, ""));
    const missingPreflightResolution = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(missingPreflightResolution.valid, false); assert.match(missingPreflightResolution.errors.join("\n"), /findings were resolved/);
    fs.writeFileSync(path.join(episodePath, "qa-checklist.md"), authorizedChecklist);
    const preflightPath = path.join(episodePath, "claim-source-preflight.yaml");
    fs.writeFileSync(preflightPath, YAML.stringify({ ...preflight(), input_sha256: { ...preflight().input_sha256, claims: "b".repeat(64) } }));
    const stalePreflight = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(stalePreflight.valid, false); assert.match(stalePreflight.errors.join("\n"), /bound to the current sources\.yaml and claim-inventory\.yaml bytes/);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const preflightWithAlteredExcerptHash = preflight(); preflightWithAlteredExcerptHash.results[0].reviewed_excerpt.sha256 = "b".repeat(64);
    fs.writeFileSync(preflightPath, YAML.stringify(preflightWithAlteredExcerptHash));
    const alteredExcerpt = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(alteredExcerpt.valid, false); assert.match(alteredExcerpt.errors.join("\n"), /hash-verified copy of the reviewed excerpt/);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const malformedAssessmentsPreflight = preflight(); malformedAssessmentsPreflight.results[0].relevance.claim_assessments = {};
    fs.writeFileSync(preflightPath, YAML.stringify(malformedAssessmentsPreflight));
    const malformedAssessments = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(malformedAssessments.valid, false); assert.match(malformedAssessments.errors.join("\n"), /supporting assessment for claim claim-a/);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    fs.writeFileSync(preflightPath, YAML.stringify({ ...preflight(), results: [] }));
    const emptyPreflight = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(emptyPreflight.valid, false); assert.match(emptyPreflight.errors.join("\n"), /must cover every current source exactly once/);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const preflightWithBroadLocator = preflight(); preflightWithBroadLocator.results[0].relevance.locator_assessment.verdict = "partially_supports";
    fs.writeFileSync(preflightPath, YAML.stringify(preflightWithBroadLocator));
    const broadLocator = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(broadLocator.valid, false); assert.match(broadLocator.errors.join("\n"), /supporting LLM locator assessment/);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const sourceLedgerPath = path.join(episodePath, "sources.yaml");
    const originalSourceLedger = fs.readFileSync(sourceLedgerPath, "utf8");
    fs.writeFileSync(sourceLedgerPath, originalSourceLedger.replace("supports_claims: [claim-a]", "supports_claims: []"));
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const nonReciprocalMapping = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(nonReciprocalMapping.valid, false); assert.match(nonReciprocalMapping.errors.join("\n"), /reciprocal source mapping for claim claim-a/);
    fs.writeFileSync(sourceLedgerPath, originalSourceLedger);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const claimInventoryPath = path.join(episodePath, "claim-inventory.yaml");
    const originalClaimInventory = fs.readFileSync(claimInventoryPath, "utf8");
    fs.writeFileSync(sourceLedgerPath, originalSourceLedger.replace("supports_claims: [claim-a]", "supports_claims: []"));
    fs.writeFileSync(claimInventoryPath, originalClaimInventory.replace("sources: [source-a]", "sources: []"));
    const sourceLessPreflight = preflight();
    sourceLessPreflight.results[0].linked_claim_ids = [];
    sourceLessPreflight.results[0].relevance.claim_assessments = [];
    fs.writeFileSync(preflightPath, YAML.stringify(sourceLessPreflight));
    const sourceLessClaim = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(sourceLessClaim.valid, false); assert.match(sourceLessClaim.errors.join("\n"), /at least one source for claim claim-a/);
    fs.writeFileSync(sourceLedgerPath, originalSourceLedger);
    fs.writeFileSync(claimInventoryPath, originalClaimInventory);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    fs.writeFileSync(claimInventoryPath, `${originalClaimInventory}  - id: claim-a\n    sources: [source-a]\n`);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const duplicateClaim = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(duplicateClaim.valid, false); assert.match(duplicateClaim.errors.join("\n"), /unique, non-empty claim IDs/);
    fs.writeFileSync(claimInventoryPath, originalClaimInventory);
    fs.writeFileSync(preflightPath, YAML.stringify(preflight()));
    const readyEpisodeMetadata = YAML.parse(fs.readFileSync(path.join(episodePath, "episode.yaml"), "utf8"));
    const pendingPublicationEpisode = { ...readyEpisodeMetadata, audio: { ...readyEpisodeMetadata.audio, publication_day_validation: "pending" } };
    fs.writeFileSync(path.join(episodePath, "episode.yaml"), YAML.stringify(pendingPublicationEpisode));
    const pendingPublicationStatus = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(pendingPublicationStatus.valid, false); assert.match(pendingPublicationStatus.errors.join("\n"), /episode\.yaml audio publication-day validation must be passed/);
    fs.writeFileSync(path.join(episodePath, "episode.yaml"), YAML.stringify(readyEpisodeMetadata));
    assert.equal(durationDisplay(5_400), "01:30:00");
    const audioManifestPath = path.join(episodePath, "audio-manifest.yaml");
    const episodeMetadataPath = path.join(episodePath, "episode.yaml");
    const hostingMetadataPath = path.join(episodePath, "hosting-metadata.yaml");
    const showNotesPath = path.join(episodePath, "show-notes.md");
    const qaChecklistPath = path.join(episodePath, "qa-checklist.md");
    const researchPacketPath = path.join(episodePath, "research-packet.md");
    const productionLogPath = path.join(episodePath, "production-log.md");
    const audioManifest = YAML.parse(fs.readFileSync(audioManifestPath, "utf8"));
    const episodeMetadata = YAML.parse(fs.readFileSync(episodeMetadataPath, "utf8"));
    const staleEditorialApproval = { ...episodeMetadata, review: { ...episodeMetadata.review, editorial_script_sha256: "b".repeat(64) } };
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(staleEditorialApproval));
    const staleEditorialResult = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(staleEditorialResult.valid, false); assert.match(staleEditorialResult.errors.join("\n"), /editorial approval must be bound to the current master-script/);
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(episodeMetadata));
    const hostingMetadata = YAML.parse(fs.readFileSync(hostingMetadataPath, "utf8"));
    const originalShowNotes = fs.readFileSync(showNotesPath, "utf8");
    const originalQaChecklist = fs.readFileSync(qaChecklistPath, "utf8");
    const originalResearchPacket = fs.readFileSync(researchPacketPath, "utf8");
    const originalProductionLog = fs.readFileSync(productionLogPath, "utf8");
    const draftMasterScript = `# Test\n\n**Version:** 0.1.0\n\n**INSTRUCTOR:**\n\nA test lesson.\n`;
    const draftShowNotes = `# Test\n\n**Episode:** core-01\n**Version:** 0.1.0\n\n[FAA reference](${sourceUrl})\n`;
    const draftLinkValidation = { ...linkValidation(), checked_at_utc: "2026-08-24T13:32:00.123Z" };
    const approvedDraftEpisode = {
      ...episodeMetadata,
      status: "reviewed_draft",
      published_at: null,
      runtime_actual_seconds: null,
      source_verification: { ...episodeMetadata.source_verification, verified_at_utc: draftLinkValidation.checked_at_utc },
      review: { editorial_status: "script_approved" },
      release_gates_remaining: ["Complete human listening QA, including the front-matter check"],
    };
    fs.writeFileSync(masterScriptPath, draftMasterScript);
    fs.writeFileSync(narrationPath, deriveNarration(draftMasterScript));
    approvedDraftEpisode.review.editorial_script_sha256 = crypto.createHash("sha256").update(draftMasterScript).digest("hex");
    fs.writeFileSync(showNotesPath, draftShowNotes);
    draftLinkValidation.input_sha256 = sourceValidationInputHashes(episodePath);
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(approvedDraftEpisode));
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(draftLinkValidation));
    fs.writeFileSync(qaChecklistPath, "- [x] Explicit authorization was received before proposed claims and source excerpts were sent to OpenAI. <!-- qa-id: openai-claim-source-preflight-authorization -->\n- [x] Claim-source preflight findings were resolved before full spoken prose was drafted. <!-- qa-id: claim-source-preflight -->\n- [x] Explicit authorization was received before source material was sent to OpenAI. <!-- qa-id: openai-source-review-authorization -->\n- [x] After the independent spoken-script review and its required revisions, but before human editorial review, the source-link validator was run with `--require-llm`. <!-- qa-id: source-relevance -->\n- [x] Independent spoken-script review completed by a second agent that did not draft the lesson. <!-- qa-id: independent-script-review -->\n- [x] Human editorial pass received the clean source-validation result; unresolved technical questions were removed or resolved. <!-- qa-id: human-editorial -->\n");
    fs.writeFileSync(researchPacketPath, "Human editorial review and script approval are complete.\nFormal deterministic source-link validation and the required LLM source-relevance review passed for version 0.1.0 and was re-verified for release.\n");
    fs.writeFileSync(productionLogPath, "## Independent adversarial review resolved\n\n- The independent non-drafting review was resolved.\n");
    assert.deepEqual(validatePreHosting({ episodePath, cwd: temporary, packageOnly: true }), { valid: true, kind: DRAFT_PACKAGE_SHAPE, final: false, errors: [] });
    const untrackedAudioWork = {
      ...approvedDraftEpisode,
      audio: { ...approvedDraftEpisode.audio, status: "not_rendered" },
      release_gates_remaining: [],
    };
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(untrackedAudioWork));
    const missingPendingGates = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(missingPendingGates.valid, false); assert.match(missingPendingGates.errors.join("\n"), /must list the canonical remaining audio/);
    fs.writeFileSync(episodeMetadataPath, YAML.stringify({ ...untrackedAudioWork, release_gates_remaining: RELEASE_GATES_AFTER_SCRIPT_APPROVAL }));
    assert.deepEqual(validatePreHosting({ episodePath, cwd: temporary, packageOnly: true }), { valid: true, kind: DRAFT_PACKAGE_SHAPE, final: false, errors: [] });
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(approvedDraftEpisode));
    fs.writeFileSync(audioManifestPath, YAML.stringify({ ...audioManifest, status: "not_rendered" }));
    const duplicateAudioState = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(duplicateAudioState.valid, false); assert.match(duplicateAudioState.errors.join("\n"), /audio-manifest\.yaml must not duplicate/);
    fs.writeFileSync(audioManifestPath, YAML.stringify(audioManifest));
    fs.writeFileSync(audioManifestPath, YAML.stringify({ ...audioManifest, required_before_release: ["Stage the audio."] }));
    const legacyAudioGates = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(legacyAudioGates.valid, false); assert.match(legacyAudioGates.errors.join("\n"), /audio-manifest\.yaml must not retain legacy release-gate records/);
    fs.writeFileSync(audioManifestPath, YAML.stringify(audioManifest));
    fs.writeFileSync(hostingMetadataPath, YAML.stringify({ ...hostingMetadata, handoff_status: "draft" }));
    const duplicateHostingState = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(duplicateHostingState.valid, false); assert.match(duplicateHostingState.errors.join("\n"), /hosting-metadata\.yaml must not duplicate/);
    fs.writeFileSync(hostingMetadataPath, YAML.stringify(hostingMetadata));
    fs.writeFileSync(hostingMetadataPath, YAML.stringify({ ...hostingMetadata, release_readiness: { remaining_release_gates: ["Stage the audio."] } }));
    const legacyHostingGates = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(legacyHostingGates.valid, false); assert.match(legacyHostingGates.errors.join("\n"), /hosting-metadata\.yaml must not retain legacy release-gate records/);
    fs.writeFileSync(hostingMetadataPath, YAML.stringify(hostingMetadata));
    const legacyStatusScript = draftMasterScript.replace("\n\n**INSTRUCTOR:**", "\n**Production status:** Ready for hosting handoff.\n\n**INSTRUCTOR:");
    fs.writeFileSync(masterScriptPath, legacyStatusScript);
    fs.writeFileSync(narrationPath, deriveNarration(legacyStatusScript));
    fs.writeFileSync(episodeMetadataPath, YAML.stringify({ ...approvedDraftEpisode, review: { ...approvedDraftEpisode.review, editorial_script_sha256: crypto.createHash("sha256").update(legacyStatusScript).digest("hex") } }));
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify({ ...draftLinkValidation, input_sha256: sourceValidationInputHashes(episodePath) }));
    const duplicateScriptState = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(duplicateScriptState.valid, false); assert.match(duplicateScriptState.errors.join("\n"), /master-script\.md must not duplicate/);
    fs.writeFileSync(masterScriptPath, draftMasterScript);
    fs.writeFileSync(narrationPath, deriveNarration(draftMasterScript));
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(approvedDraftEpisode));
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(draftLinkValidation));
    assert.equal(hasExactVisibleVersion("**Version:** 0.1.0 — source-bound revision", "0.1.0"), true);
    assert.equal(hasExactVisibleVersion("**Version:** 0.1.01", "0.1.0"), false);
    fs.writeFileSync(masterScriptPath, draftMasterScript.replace("**Version:** 0.1.0", "**Version:** 0.1.01"));
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify({ ...draftLinkValidation, input_sha256: sourceValidationInputHashes(episodePath) }));
    const visibleMasterPrefix = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(visibleMasterPrefix.valid, false); assert.match(visibleMasterPrefix.errors.join("\n"), /master-script\.md version must match/);
    fs.writeFileSync(masterScriptPath, draftMasterScript);
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify({ ...draftLinkValidation, input_sha256: sourceValidationInputHashes(episodePath) }));
    fs.writeFileSync(showNotesPath, draftShowNotes.replace("**Version:** 0.1.0", "**Version:** 0.1.01"));
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify({ ...draftLinkValidation, input_sha256: sourceValidationInputHashes(episodePath) }));
    const visibleShowNotesPrefix = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(visibleShowNotesPrefix.valid, false); assert.match(visibleShowNotesPrefix.errors.join("\n"), /show-notes\.md episode and version must match/);
    fs.writeFileSync(showNotesPath, draftShowNotes);
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(draftLinkValidation));
    fs.writeFileSync(productionLogPath, "## Independent adversarial review resolved\n\n- The independent spoken-script review remains pending. The editorial review was accepted.\n");
    const pendingIndependentReview = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(pendingIndependentReview.valid, false); assert.match(pendingIndependentReview.errors.join("\n"), /independent spoken-script review/);
    fs.writeFileSync(productionLogPath, "## Independent adversarial review resolved\n\n- The independent non-drafting review was resolved.\n");
    fs.writeFileSync(qaChecklistPath, "- [x] Explicit authorization was received before proposed claims and source excerpts were sent to OpenAI. <!-- qa-id: openai-claim-source-preflight-authorization -->\n- [x] Claim-source preflight findings were resolved before full spoken prose was drafted. <!-- qa-id: claim-source-preflight -->\n- [x] Explicit authorization was received before source material was sent to OpenAI. <!-- qa-id: openai-source-review-authorization -->\n- [x] Human editorial pass completed <!-- qa-id: human-editorial -->\n- [x] Before any audio render, source-link validator was run with `--require-llm` <!-- qa-id: source-relevance -->\n");
    const missingIndependentReview = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(missingIndependentReview.valid, false); assert.match(missingIndependentReview.errors.join("\n"), /independent spoken-script review/);
    fs.writeFileSync(qaChecklistPath, "- [x] Explicit authorization was received before proposed claims and source excerpts were sent to OpenAI. <!-- qa-id: openai-claim-source-preflight-authorization -->\n- [x] Claim-source preflight findings were resolved before full spoken prose was drafted. <!-- qa-id: claim-source-preflight -->\n- [x] Explicit authorization was received before source material was sent to OpenAI. <!-- qa-id: openai-source-review-authorization -->\n- [x] Human editorial pass completed <!-- qa-id: human-editorial -->\n- [x] Before any audio render, source-link validator was run with `--require-llm` <!-- qa-id: source-relevance -->\n- [x] Independent spoken-script review completed by a second agent that did not draft the lesson <!-- qa-id: independent-script-review -->\n");
    fs.writeFileSync(episodeMetadataPath, YAML.stringify({ ...approvedDraftEpisode, status: "ready_for_hosting_pr" }));
    assert.deepEqual(validatePreHosting({ episodePath, cwd: temporary, packageOnly: true }), { valid: true, kind: DRAFT_PACKAGE_SHAPE, final: false, errors: [] });
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(approvedDraftEpisode));
    fs.writeFileSync(episodeMetadataPath, YAML.stringify({ ...approvedDraftEpisode, source_verification: { ...approvedDraftEpisode.source_verification, verified_at_utc: "2026-08-24T13:32:00Z" } }));
    const timestampMismatch = validatePreHosting({ episodePath, cwd: temporary, packageOnly: true });
    assert.equal(timestampMismatch.valid, false); assert.match(timestampMismatch.errors.join("\n"), /timestamp must match link-validation/);
    fs.writeFileSync(masterScriptPath, masterScript);
    fs.writeFileSync(narrationPath, narration);
    fs.writeFileSync(showNotesPath, originalShowNotes);
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(episodeMetadata));
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(linkValidation()));
    fs.writeFileSync(qaChecklistPath, originalQaChecklist);
    fs.writeFileSync(researchPacketPath, originalResearchPacket);
    fs.writeFileSync(productionLogPath, originalProductionLog);
    fs.writeFileSync(audioManifestPath, YAML.stringify({ ...audioManifest, current_candidate_render: { ...audioManifest.current_candidate_render, duration_seconds: 3 } }));
    fs.writeFileSync(episodeMetadataPath, YAML.stringify({ ...episodeMetadata, runtime_actual_seconds: 3 }));
    fs.writeFileSync(hostingMetadataPath, YAML.stringify({ ...hostingMetadata, publisher_release: { ...hostingMetadata.publisher_release, duration: "00:00:03" } }));
    fs.writeFileSync(renderPath, JSON.stringify({ ...renderRecord(), audio: { ...renderRecord().audio, duration_seconds: 3 } }));
    const inventedDuration = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(inventedDuration.valid, false); assert.match(inventedDuration.errors.join("\n"), /audio-quality report's probed MP3 duration/);
    fs.writeFileSync(renderPath, JSON.stringify({ ...renderRecord(), script: masterScriptPath }));
    const unrelatedScript = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(unrelatedScript.valid, false); assert.match(unrelatedScript.errors.join("\n"), /script path must identify the current narration derivative/);
    fs.writeFileSync(audioManifestPath, YAML.stringify(audioManifest));
    fs.writeFileSync(episodeMetadataPath, YAML.stringify(episodeMetadata));
    fs.writeFileSync(hostingMetadataPath, YAML.stringify(hostingMetadata));
    fs.writeFileSync(renderPath, JSON.stringify(renderRecord()));
    fs.writeFileSync(masterScriptPath, masterScript.replace("A test lesson.", "Changed wording with the same version."));
    const changedScript = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(changedScript.valid, false); assert.match(changedScript.errors.join("\n"), /narration\.md must be the current derivative/);
    fs.writeFileSync(masterScriptPath, masterScript);
    const originalCopy = fs.copyFileSync;
    fs.copyFileSync = (from, to) => {
      originalCopy(from, to);
      if (path.basename(to) === "show-notes.md") fs.appendFileSync(showNotesPath, "\nChanged during handoff assembly.\n");
    };
    try {
      assert.throws(() => createHostingHandoff({ episodePath, outputDir: path.join(temporary, "racing-hosting-handoff"), cwd: temporary }), (error) => error instanceof HostingHandoffError && /Source episode package changed/.test(error.message));
    } finally {
      fs.copyFileSync = originalCopy;
      fs.writeFileSync(showNotesPath, originalShowNotes);
    }
    const handoffPath = path.join(temporary, "hosting-handoff");
    const handoff = createHostingHandoff({ episodePath, outputDir: handoffPath, cwd: temporary });
    assert.equal(verifyHostingHandoff({ outputDir: handoff.outputDir }).valid, true);
    const handoffEpisode = YAML.parse(fs.readFileSync(path.join(handoffPath, "episode.yaml"), "utf8"));
    assert.equal(handoffEpisode.chapters[0].title, "Opening");
    assert.equal(handoffEpisode.release_key, "episode-01");
    assert.equal(handoffEpisode.content_version, "0.1.0");
    fs.writeFileSync(path.join(handoffPath, ".env"), "UNEXPECTED=value\n");
    assert.throws(() => verifyHostingHandoff({ outputDir: handoffPath }), (error) => error instanceof HostingHandoffError && /unexpected entry: \.env/.test(error.message));
    fs.rmSync(path.join(handoffPath, ".env"));
    fs.writeFileSync(path.join(handoffPath, "show-notes.md"), "# Mutated after sealing\n");
    assert.throws(() => verifyHostingHandoff({ outputDir: handoffPath }), (error) => error instanceof HostingHandoffError && /show-notes\.md does not match the sealed bytes/.test(error.message));
    fs.writeFileSync(path.join(episodePath, "show-notes.md"), "# Changed after validation\n");
    const staleSourceInputs = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(staleSourceInputs.valid, false); assert.match(staleSourceInputs.errors.join("\n"), /bound to the current sources, claims, and show-notes inputs/);
    fs.writeFileSync(path.join(episodePath, "show-notes.md"), "# Test\n");
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify({ ...linkValidation(), show_notes_results: [{ source_id: "test-source", citation_target: { valid: true }, link: { valid: false } }] }));
    const invalidShowNotes = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(invalidShowNotes.valid, false); assert.match(invalidShowNotes.errors.join("\n"), /show-notes links must be valid/);
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(linkValidation()));
    const unresolvedValidation = linkValidation();
    unresolvedValidation.results[0].relevance = { status: "assessed", assessment: { verdict: "does_not_support", locator_assessment: { verdict: "supports" } } };
    unresolvedValidation.results[0].claim_assessments = { valid: false };
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(unresolvedValidation));
    const unresolvedSourceReview = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(unresolvedSourceReview.valid, false); assert.match(unresolvedSourceReview.errors.join("\n"), /source- and claim-level relevance assessments/);
    fs.writeFileSync(path.join(episodePath, "link-validation.yaml"), YAML.stringify(linkValidation()));
    fs.writeFileSync(renderPath, JSON.stringify(renderRecord([{ id: "chapter-001", start_ms: 0, end_ms: 2_000, title: "Changed title" }])));
    const mismatchedChapters = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(mismatchedChapters.valid, false); assert.match(mismatchedChapters.errors.join("\n"), /embedded MP3 chapters must match/);
    fs.writeFileSync(renderPath, JSON.stringify(renderRecord()));
    fs.writeFileSync(qualityPath, JSON.stringify(qualityRecord({ manifest: path.join(temporary, "different.render-manifest.json") })));
    const mismatchedQuality = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(mismatchedQuality.valid, false); assert.match(mismatchedQuality.errors.join("\n"), /quality report must identify the approved render manifest/);
    fs.writeFileSync(qualityPath, JSON.stringify(qualityRecord({ output: { ...qualityRecord().output, sha256: "b".repeat(64) } })));
    const mismatchedQualityBytes = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(mismatchedQualityBytes.valid, false); assert.match(mismatchedQualityBytes.errors.join("\n"), /quality report checksum must match/);
    fs.writeFileSync(qualityPath, JSON.stringify(qualityRecord()));
    fs.writeFileSync(audioPath, "different bytes");
    const stale = validatePreHosting({ episodePath, cwd: temporary });
    assert.equal(stale.valid, false); assert.match(stale.errors.join("\n"), /approved MP3 bytes do not match/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim mapping rejects claims omitted from a source ledger entry", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", [])] },
    { claims: [{ id: "claim-a", sources: ["aim"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /does not support the claim/);
  assert.match(result.errors.join("\n"), /not supported by any source ledger entry/);
});

test("claim mapping rejects source references that do not exist in the claim inventory", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", ["missing-claim"])] },
    { claims: [] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /maps unknown claim missing-claim/);
});

test("claim mapping rejects duplicate inventory claim identifiers", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", ["claim-a"])] },
    { claims: [
      { id: "claim-a", statement: "First statement.", sources: ["aim"] },
      { id: "claim-a", statement: "Different statement.", sources: ["aim"] },
    ] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /duplicate claim id claim-a/);
});

test("claim mapping rejects duplicate source identifiers", () => {
  const result = validateClaimMappings(
    { sources: [source("aim", ["claim-a"]), source("aim", ["claim-a"])] },
    { claims: [{ id: "claim-a", sources: ["aim"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /duplicate source id aim/);
});

test("claim mapping reports malformed relationship collections without throwing", () => {
  const sourceResult = validateClaimMappings(
    { sources: [{ id: "source-a", supports_claims: "claim-a" }] },
    { claims: [{ id: "claim-a", sources: ["source-a"] }] },
  );
  assert.equal(sourceResult.valid, false);
  assert.match(sourceResult.errors.join("\n"), /supports_claims as an array/);
  const claimResult = validateClaimMappings(
    { sources: [{ id: "source-a", supports_claims: ["claim-a"] }] },
    { claims: [{ id: "claim-a", sources: "source-a" }] },
  );
  assert.equal(claimResult.valid, false);
  assert.match(claimResult.errors.join("\n"), /sources as an array/);
});

test("claim mapping rejects source-side claims that do not declare the source", () => {
  const result = validateClaimMappings(
    { sources: [source("aim-a", ["claim-a"]), source("aim-b", [])] },
    { claims: [{ id: "claim-a", sources: ["aim-b"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /source aim-a supports claim claim-a, but that claim does not declare the source/);
});

test("claim-source preflight requires a non-empty exact locator", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-preflight-locator-test-"));
  try {
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [{ id: "source-a", supports_claims: ["claim-a"] }] }));
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), YAML.stringify({ claims: [{ id: "claim-a", sources: ["source-a"] }] }));
    const excerpt = "A reviewed source excerpt.";
    const preflight = {
      schema_version: 1,
      validator: "scripts/claim-source-preflight.cjs",
      status: "complete",
      checked_at_utc: "2026-09-10T00:00:00Z",
      llm_requested: true,
      llm_model: "test-model",
      input_sha256: claimSourcePreflightInputHashes(temporary),
      results: [{
        source_id: "source-a",
        linked_claim_ids: ["claim-a"],
        reviewed_excerpt: { kind: "section_text", text: excerpt, sha256: crypto.createHash("sha256").update(excerpt).digest("hex"), characters: excerpt.length },
        relevance: { status: "assessed", locator_assessment: { verdict: "supports", rationale: "Test." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "Test." }] },
      }],
    };
    const errors = claimSourcePreflightErrors({ episodePath: temporary, episode: { production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }, preflight });
    assert.match(errors.join("\n"), /non-empty exact locator/);
    preflight.checked_at_utc = "2026-09-10";
    const timestampErrors = claimSourcePreflightErrors({ episodePath: temporary, episode: { production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }, preflight });
    assert.match(timestampErrors.join("\n"), /valid UTC RFC 3339 review timestamp/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight evidence is derived from a fetched locator excerpt", () => {
  const sourceEntry = { id: "source-a", url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html" };
  const fetched = {
    valid: true,
    final_url: sourceEntry.url,
    content_sha256: "a".repeat(64),
    excerpt: "Text extracted from the cited HTML fragment.",
  };
  const evidence = preflightEvidenceFor(sourceEntry, fetched);
  assert.equal(evidence.fetched_locator.citation_url, sourceEntry.url);
  assert.equal(evidence.fetched_locator.locator_excerpt_sha256, evidence.reviewed_excerpt.sha256);
  assert.equal(evidence.fetched_locator.locator_excerpt_characters, evidence.reviewed_excerpt.characters);
  assert.throws(() => preflightEvidenceFor(sourceEntry, { ...fetched, content_sha256: null }), /has no content hash/);
});

test("claim-source preflight records the exact bounded excerpt sent to relevance review", () => {
  const sourceEntry = { id: "source-a", url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html" };
  const sectionText = ` ${"a".repeat(MAX_RELEVANCE_EXCERPT_CHARACTERS + 10)} `;
  const fetched = { valid: true, final_url: sourceEntry.url, content_sha256: "b".repeat(64), section_text: sectionText };
  const evidence = preflightEvidenceFor(sourceEntry, fetched);
  assert.equal(evidence.reviewed_excerpt.text, relevanceExcerpt(fetched));
  assert.equal(evidence.reviewed_excerpt.characters, MAX_RELEVANCE_EXCERPT_CHARACTERS);
  assert.equal(evidence.fetched_locator.locator_excerpt_sha256, crypto.createHash("sha256").update(relevanceExcerpt(fetched)).digest("hex"));
});

test("claim-source preflight persists only independently fetched source evidence", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-claim-source-preflight-test-"));
  const sourceEntry = source("source-a", ["claim-a"]);
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [sourceEntry] }));
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), YAML.stringify({ claims: [{ id: "claim-a", claim: "A test claim.", sources: ["source-a"] }] }));
    fs.writeFileSync(path.join(temporary, "qa-checklist.md"), "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    const fetchedText = "Text independently extracted from the exact source locator.";
    const preflight = await createClaimSourcePreflight({
      episodePath: temporary,
      model: "test-model",
      dependencies: {
        verifyProgrammaticFallback: async () => ({ link: { valid: true, final_url: sourceEntry.url, content_sha256: "c".repeat(64), excerpt: fetchedText } }),
        assessRelevance: async () => ({ status: "assessed", assessment: { verdict: "supports", confidence: "high", rationale: "Test.", locator_assessment: { verdict: "supports", rationale: "Test." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "Test." }] } }),
      },
    });
    const result = preflight.results[0];
    assert.equal(result.reviewed_excerpt.text, fetchedText);
    assert.equal(result.fetched_locator.locator_excerpt_sha256, crypto.createHash("sha256").update(fetchedText).digest("hex"));
    assert.equal(YAML.parse(fs.readFileSync(path.join(temporary, "claim-source-preflight.yaml"), "utf8")).validator, "scripts/claim-source-preflight.cjs");
    assert.match(fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8"), /- \[ \] Claim preflight authorization/);
    assert.equal(YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")).source_verification.claim_source_preflight_status, "complete");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight rejects empty inventories before outbound work", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-empty-claim-source-preflight-test-"));
  let verifierCalled = false;
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [] }));
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), YAML.stringify({ claims: [] }));
    fs.writeFileSync(path.join(temporary, "qa-checklist.md"), "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    await assert.rejects(
      createClaimSourcePreflight({
        episodePath: temporary,
        dependencies: { verifyProgrammaticFallback: async () => { verifierCalled = true; } },
      }),
      /requires at least one source and at least one claim/,
    );
    assert.equal(verifierCalled, false);
    assert.equal(fs.existsSync(path.join(temporary, "claim-source-preflight.yaml")), false);
    assert.match(fs.readFileSync(path.join(temporary, "qa-checklist.md"), "utf8"), /- \[x\] Claim preflight authorization/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight records a failed rerun instead of reusing a prior success", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-failed-claim-source-preflight-test-"));
  const sourceEntry = source("source-a", ["claim-a"]);
  const fetchedText = "Text independently extracted from the exact source locator.";
  const passingDependencies = {
    verifyProgrammaticFallback: async () => ({ link: { valid: true, final_url: sourceEntry.url, content_sha256: "d".repeat(64), excerpt: fetchedText } }),
    assessRelevance: async () => ({ status: "assessed", assessment: { verdict: "supports", confidence: "high", rationale: "Test.", locator_assessment: { verdict: "supports", rationale: "Test." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "Test." }] } }),
  };
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [sourceEntry] }));
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), YAML.stringify({ claims: [{ id: "claim-a", claim: "A test claim.", sources: ["source-a"] }] }));
    const checklistPath = path.join(temporary, "qa-checklist.md");
    fs.writeFileSync(checklistPath, "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    await createClaimSourcePreflight({ episodePath: temporary, model: "test-model", dependencies: passingDependencies });
    const canonicalPath = path.join(temporary, "claim-source-preflight.yaml");
    const priorSuccess = fs.readFileSync(canonicalPath, "utf8");
    fs.writeFileSync(checklistPath, "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    await assert.rejects(
      createClaimSourcePreflight({
        episodePath: temporary,
        model: "test-model",
        dependencies: { ...passingDependencies, assessRelevance: async () => { throw new Error("LLM unavailable"); } },
      }),
      /LLM unavailable/,
    );
    assert.equal(fs.readFileSync(canonicalPath, "utf8"), priorSuccess);
    assert.equal(fs.existsSync(validationFailurePath(canonicalPath)), true);
    assert.equal(YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")).source_verification.claim_source_preflight_status, "failed");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight refuses promotion when its captured inputs drift", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-drifting-claim-source-preflight-test-"));
  const sourceEntry = source("source-a", ["claim-a"]);
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [sourceEntry] }));
    const claimsPath = path.join(temporary, "claim-inventory.yaml");
    fs.writeFileSync(claimsPath, YAML.stringify({ claims: [{ id: "claim-a", claim: "Original claim.", sources: ["source-a"] }] }));
    fs.writeFileSync(path.join(temporary, "qa-checklist.md"), "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    await assert.rejects(
      createClaimSourcePreflight({
        episodePath: temporary,
        model: "test-model",
        dependencies: {
          verifyProgrammaticFallback: async () => ({ link: { valid: true, final_url: sourceEntry.url, content_sha256: "e".repeat(64), excerpt: "Text independently extracted from the exact source locator." } }),
          assessRelevance: async () => {
            fs.writeFileSync(claimsPath, YAML.stringify({ claims: [{ id: "claim-a", claim: "Changed during review.", sources: ["source-a"] }] }));
            return { status: "assessed", assessment: { verdict: "supports", confidence: "high", rationale: "Test.", locator_assessment: { verdict: "supports", rationale: "Test." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "Test." }] } };
          },
        },
      }),
      /changed while the claim-source preflight was running/,
    );
    const canonicalPath = path.join(temporary, "claim-source-preflight.yaml");
    assert.equal(fs.existsSync(canonicalPath), false);
    assert.equal(fs.existsSync(validationFailurePath(canonicalPath)), true);
    assert.equal(YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")).source_verification.claim_source_preflight_status, "failed");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight retains adverse challenger evidence in its failed attempt", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-adverse-claim-source-preflight-test-"));
  const sourceEntry = source("source-a", ["claim-a"]);
  const fetchedText = "Text independently extracted from the exact source locator.";
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [sourceEntry] }));
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), YAML.stringify({ claims: [{ id: "claim-a", claim: "A test claim.", sources: ["source-a"] }] }));
    fs.writeFileSync(path.join(temporary, "qa-checklist.md"), "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    await assert.rejects(
      createClaimSourcePreflight({
        episodePath: temporary,
        model: "test-model",
        dependencies: {
          verifyProgrammaticFallback: async () => ({ link: { valid: true, final_url: sourceEntry.url, content_sha256: "f".repeat(64), excerpt: fetchedText } }),
          assessRelevance: async () => ({ status: "assessed", assessment: { verdict: "partially_supports", confidence: "high", rationale: "The evidence is incomplete.", locator_assessment: { verdict: "partially_supports", rationale: "The locator is broader than the claim." }, claim_assessments: [{ claim_id: "claim-a", verdict: "partially_supports", rationale: "The cited text does not establish the full claim." }] } }),
        },
      }),
      /Claim-source preflight failed/,
    );
    const preflightPath = path.join(temporary, "claim-source-preflight.yaml");
    const marker = YAML.parse(fs.readFileSync(validationFailurePath(preflightPath), "utf8"));
    const attempt = YAML.parse(fs.readFileSync(path.join(path.dirname(preflightPath), marker.failed_attempt), "utf8"));
    assert.equal(attempt.status, "failed");
    assert.equal(attempt.results[0].relevance.locator_assessment.verdict, "partially_supports");
    assert.equal(attempt.results[0].relevance.claim_assessments[0].rationale, "The cited text does not establish the full claim.");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight cancellation finalizes the owned run", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-cancelled-claim-source-preflight-test-"));
  const sourceEntry = source("source-a", ["claim-a"]);
  const cancellation = new AbortController();
  try {
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { claim_source_preflight: "claim-source-preflight.yaml" } }));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), YAML.stringify({ sources: [sourceEntry] }));
    fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), YAML.stringify({ claims: [{ id: "claim-a", claim: "A test claim.", sources: ["source-a"] }] }));
    fs.writeFileSync(path.join(temporary, "qa-checklist.md"), "- [x] Claim preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n");
    await assert.rejects(
      createClaimSourcePreflight({
        episodePath: temporary,
        signal: cancellation.signal,
        isCancelled: () => cancellation.signal.aborted,
        dependencies: {
          verifyProgrammaticFallback: async ({}, { signal }) => {
            assert.equal(signal, cancellation.signal);
            cancellation.abort();
            return { link: { valid: true, final_url: sourceEntry.url, content_sha256: "1".repeat(64), excerpt: "Text independently extracted from the exact source locator." } };
          },
        },
      }),
      /cancelled/,
    );
    const preflightPath = path.join(temporary, "claim-source-preflight.yaml");
    assert.equal(fs.existsSync(`${preflightPath}.in-progress`), false);
    assert.equal(fs.existsSync(validationFailurePath(preflightPath)), true);
    assert.equal(YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8")).source_verification.claim_source_preflight_status, "cancelled");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("claim-source preflight accepts only its explicit stale-lock recovery flag", () => {
  const parsed = parseClaimSourcePreflightArgs(["--episode", "episodes/core-15", "--require-llm", "--recover-stale-lock"]);
  assert.equal(parsed.recoverStaleLock, true);
  assert.throws(() => parseClaimSourcePreflightArgs(["--episode", "episodes/core-15", "--recover-stale-lock"]), /--require-llm is required/);
});

test("master-script source tags must name real sources in the claim's declared section", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-master-script-source-tags-"));
  try {
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n\n## Lesson section\n\n**INSTRUCTOR:**\n\nA sourced teaching statement.\n\n[Source: sources.yaml#source-a]\n", "utf8");
    const ledger = { sources: [source("source-a", ["claim-a"])] };
    const claims = { claims: [{ id: "claim-a", sources: ["source-a"], script_sections: ["Lesson section"] }] };
    assert.equal(validateMasterScriptSourceMappings(temporary, ledger, claims).valid, true);
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n\n## Lesson section\n\n**INSTRUCTOR:**\n\nAn untagged teaching statement.\n", "utf8");
    const untagged = validateMasterScriptSourceMappings(temporary, ledger, claims);
    assert.equal(untagged.valid, false);
    assert.match(untagged.errors.join("\n"), /contains no source tags/);
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n\n## Lesson section\n\n**INSTRUCTOR:**\n\nA sourced teaching statement.\n\n[Source: sources.yaml#wrong-source]\n", "utf8");
    const unknownSource = validateMasterScriptSourceMappings(temporary, ledger, claims);
    assert.equal(unknownSource.valid, false);
    assert.match(unknownSource.errors.join("\n"), /unknown source wrong-source/);
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n\n## Other section\n\n**INSTRUCTOR:**\n\nA sourced teaching statement.\n\n[Source: sources.yaml#source-a]\n", "utf8");
    const wrongSection = validateMasterScriptSourceMappings(temporary, ledger, claims);
    assert.equal(wrongSection.valid, false);
    assert.match(wrongSection.errors.join("\n"), /claim-a has no declared source tag in script section: Lesson section/);
    const repeatedClaims = { claims: [{ id: "claim-a", sources: ["source-a"], script_sections: ["Lesson section", "Retrieval review"] }] };
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n\n## Lesson section\n\n**INSTRUCTOR:**\n\nA sourced teaching statement.\n\n[Source: sources.yaml#source-a]\n", "utf8");
    const incompleteRepeatedCoverage = validateMasterScriptSourceMappings(temporary, ledger, repeatedClaims);
    assert.equal(incompleteRepeatedCoverage.valid, false);
    assert.match(incompleteRepeatedCoverage.errors.join("\n"), /script section: Retrieval review/);
    fs.writeFileSync(path.join(temporary, "master-script.md"), "# Test\n\n## Lesson section\n\n**INSTRUCTOR:**\n\nA sourced teaching statement.\n\n[Source: sources.yaml#source-a]\n\n## Retrieval review\n\n**INSTRUCTOR:**\n\nThe same sourced teaching statement is recalled.\n\n[Source: sources.yaml#source-a]\n", "utf8");
    assert.equal(validateMasterScriptSourceMappings(temporary, ledger, repeatedClaims).valid, true);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("retrieval review requires an immediate source tag for every spoken learner or instructor paragraph", () => {
  const untagged = retrievalReviewUntaggedPassageErrors("## Retrieval review\n\n**ANNOUNCER:**\n\nRetrieval review.\n\n**INSTRUCTOR:**\n\nA factual recap.\n");
  assert.deepEqual(untagged, ["Retrieval review spoken paragraph at line 9 has no source tag"]);
  const tagged = retrievalReviewUntaggedPassageErrors("## Retrieval review\n\n**INSTRUCTOR:**\n\nA factual recap.\n\n[Source: sources.yaml#source-a]\n\n**LEARNER:**\n\nA sourced learner recap.\n\n[Source: sources.yaml#source-a]\n");
  assert.deepEqual(tagged, []);
  const explicitTeachingMethod = retrievalReviewUntaggedPassageErrors("## Retrieval review\n\n**LEARNER:**\n\nMy study method is to ask four organizing questions.\n\n[Claim type: teaching synthesis]\n\n**LEARNER:**\n\nNo PIREP does not prove good conditions.\n\n[Claim type: teaching inference]\n");
  assert.deepEqual(explicitTeachingMethod, []);
  const unsupportedLabel = retrievalReviewUntaggedPassageErrors("## Retrieval review\n\n**LEARNER:**\n\nAn unsourced external fact.\n\n[Claim type: FAA guidance]\n");
  assert.deepEqual(unsupportedLabel, ["Retrieval review spoken paragraph at line 5 has no source tag"]);
});

test("show-notes links must be declared and mapped to claims their source supports", () => {
  const ledger = { sources: [source("aim", ["claim-a"])] };
  const claims = { claims: [{ id: "claim-a", sources: ["aim"] }] };
  const manifest = {
    links: [{
      id: "aim-reference",
      text: "AIM paragraph 1-1-1",
      url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html",
      locator: "Paragraph 1-1-1, p. 1-1-1",
      source_id: "aim",
      claim_ids: ["claim-a"],
    }],
  };
  const valid = validateShowNotesMappings(ledger, claims, manifest, "[AIM paragraph 1-1-1](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html)\n");
  assert.equal(valid.valid, true);

  const duplicateDisclosure = validateShowNotesMappings(ledger, claims, manifest, "## Production notice\n\n[AIM paragraph 1-1-1](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html)\n");
  assert.equal(duplicateDisclosure.valid, false);
  assert.match(duplicateDisclosure.errors.join("\n"), /must not duplicate the hosting production disclosure/);

  const undeclared = validateShowNotesMappings(ledger, claims, manifest, "[AIM paragraph 1-1-1](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html)\n[Unmapped reference](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_2.html)\n");
  assert.equal(undeclared.valid, false);
  assert.match(undeclared.errors.join("\n"), /undeclared HTTPS link/);

  const unsupported = validateShowNotesMappings(ledger, claims, { links: [{ ...manifest.links[0], claim_ids: ["claim-b"] }] }, "[AIM paragraph 1-1-1](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html)\n");
  assert.equal(unsupported.valid, false);
  assert.match(unsupported.errors.join("\n"), /maps unknown claim claim-b/);
});

test("show-notes validation covers repeated, reference-style, and autolinked HTTPS links", () => {
  const url = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html";
  const ledger = { sources: [source("aim", ["claim-a"])] };
  const claims = { claims: [{ id: "claim-a", sources: ["aim"] }] };
  const manifest = { links: [
    { id: "inline", text: "Inline", url, locator: "Paragraph 1-1-1, p. 1-1-1", source_id: "aim", claim_ids: ["claim-a"] },
    { id: "reference", text: "Reference", url, locator: "Paragraph 1-1-1, p. 1-1-1", source_id: "aim", claim_ids: ["claim-a"] },
    { id: "autolink", text: url, url, locator: "Paragraph 1-1-1, p. 1-1-1", source_id: "aim", claim_ids: ["claim-a"] },
  ] };
  const markdown = `[Inline](${url})\n[Inline](${url})\n[Reference][aim]\n<${url}>\nSee ${url}.\n[aim]: ${url}\n`;
  const result = validateShowNotesMappings(ledger, claims, manifest, markdown);
  assert.equal(result.valid, true);
  assert.equal(result.markdown_link_count, 5);
});

test("show-notes validation rejects a link that does not identify its declared source", () => {
  const ledger = { sources: [source("aim", ["claim-a"])] };
  const claims = { claims: [{ id: "claim-a", sources: ["aim"] }] };
  const url = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_2.html";
  const manifest = { links: [{ id: "wrong-document", text: "Wrong document", url, locator: "Paragraph 1-1-1, p. 1-1-1", source_id: "aim", claim_ids: ["claim-a"] }] };
  const result = validateShowNotesMappings(ledger, claims, manifest, `[Wrong document](${url})\n`);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /does not identify declared source aim/);
});

test("PDF page extraction reads only the page named by the citation", async () => {
  const requestedPages = [];
  const text = await extractPdfPageText(Buffer.from("test PDF"), 34, {
    pdfjsLoader: async () => ({
      getDocument: ({ data, disableWorker }) => {
        assert.deepEqual(Buffer.from(data), Buffer.from("test PDF"));
        assert.equal(disableWorker, true);
        return {
          promise: Promise.resolve({
            numPages: 40,
            getPage: async (pageNumber) => {
              requestedPages.push(pageNumber);
              return { getTextContent: async () => ({ items: [{ str: "Load Factors in Steep Turns" }] }) };
            },
          }),
          destroy: async () => {},
        };
      },
    }),
  });
  assert.deepEqual(requestedPages, [34]);
  assert.equal(text, "Load Factors in Steep Turns");
});

test("PDF page citations can use the bounded large-document limit", async () => {
  const link = await fetchSource("https://www.faa.gov/example.pdf#page=448", {
    includePdfBytes: true,
    maxBytes: 50_000_000,
    fetchImpl: async () => ({
      status: 200,
      headers: new Headers({ "content-type": "application/pdf", "content-length": "41049516" }),
      body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array([1])); controller.close(); } }),
    }),
  });

  assert.deepEqual(link.pdf_bytes, Buffer.from([1]));
  assert.equal(link.truncated, false);
});

test("HTML fragment citations assess the referenced definition instead of a long page prefix", () => {
  const leading = `<p>${"Unrelated glossary content. ".repeat(900)}</p>`;
  const html = `${leading}<p id="ALTITUDE"><dfn>ALTITUDE</dfn>—Height measured from mean sea level or above ground level.</p><ol><li>MSL Altitude—Measured from mean sea level.</li><li>AGL Altitude—Measured above ground level.</li></ol>`;
  const excerpt = htmlFragmentText(html, "https://www.faa.gov/example.html#ALTITUDE");
  assert.match(excerpt, /Height measured from mean sea level or above ground level/);
  assert.match(excerpt, /MSL Altitude/);
  assert.doesNotMatch(excerpt, /^Unrelated glossary content/);
});

test("HTML fragment citations support unquoted IDs and legacy name anchors", () => {
  const html = '<p id=ALTITUDE>Altitude definition.</p><a name=legacy-anchor></a><p>Legacy definition.</p>';
  assert.match(htmlFragmentText(html, "https://www.faa.gov/example.html#ALTITUDE"), /Altitude definition/);
  assert.match(htmlFragmentText(html, "https://www.faa.gov/example.html#legacy-anchor"), /Legacy definition/);
});

test("HTML fragment citations fail closed when the cited anchor is absent", () => {
  const html = '<p id="ALTITUDE">Altitude definition.</p>';
  assert.throws(() => htmlFragmentText(html, "https://www.faa.gov/example.html#MISSING"), /does not identify an id or name anchor/);
});

test("PDF page fragments do not become HTML-anchor requirements for an interstitial", () => {
  const html = "<title>Access denied</title><p>Access denied.</p>";
  assert.match(htmlFragmentText(html, "https://www.faa.gov/example.pdf#page=2"), /Access denied/);
});

test("cached HTML sources preserve the excerpt for each cited fragment", async () => {
  let calls = 0;
  const html = '<p id="ALTITUDE">MSL Altitude—Measured from mean sea level.</p><p id="AIRPORT_ELEVATION">Airport elevation—Highest usable runway point.</p>';
  const fetchCache = new Map(); const fetchImpl = async () => { calls += 1; return new Response(html, { status: 200, headers: { "content-type": "text/html" } }); };
  const altitude = await fetchSourceCached("https://www.faa.gov/example.html#ALTITUDE", { fetchImpl }, fetchCache);
  const airport = await fetchSourceCached("https://www.faa.gov/example.html#AIRPORT_ELEVATION", { fetchImpl }, fetchCache);
  assert.equal(calls, 1);
  assert.match(altitude.excerpt, /MSL Altitude/);
  assert.match(airport.excerpt, /Airport elevation/);
  assert.doesNotMatch(airport.excerpt, /MSL Altitude/);
});

test("PDF page extraction is cancelled and destroys the pending loading task", async () => {
  const controller = new AbortController(); let destroyed = false; let started;
  const startedPromise = new Promise((resolve) => { started = resolve; });
  const pending = extractPdfPageText(Buffer.from("test PDF"), 1, {
    signal: controller.signal,
    pdfjsLoader: async () => ({
      getDocument: () => {
        started();
        return { promise: new Promise(() => {}), destroy: () => { destroyed = true; return new Promise(() => {}); } };
      },
    }),
  });
  await startedPromise;
  controller.abort();
  await assert.rejects(pending, /cancelled/);
  assert.equal(destroyed, true);
});

test("source validation requires a manifest for current-package show notes", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-test-"));
  const sourcesPath = path.join(temporary, "sources.yaml"); const claimsPath = path.join(temporary, "claim-inventory.yaml");
  fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n");
  fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [source-a]\n");
  fs.writeFileSync(path.join(temporary, "episode.yaml"), "production_contract_version: 2\nsource_verification: {}\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Existing episode notes\n\n[Source](https://example.invalid)\n");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--dry-run"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /requires canonical show-notes\.md and show-notes-manifest\.yaml files/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("source validation records malformed canonical input as a failed attempt", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-malformed-input-test-"));
  const sourcesPath = path.join(temporary, "sources.yaml"); const claimsPath = path.join(temporary, "claim-inventory.yaml"); const reportPath = path.join(temporary, "link-validation.yaml");
  fs.writeFileSync(sourcesPath, "sources: [\n", "utf8");
  fs.writeFileSync(claimsPath, "claims: []\n", "utf8");
  fs.writeFileSync(path.join(temporary, "episode.yaml"), "production_contract_version: 2\nsource_verification: {}\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Notes\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes-manifest.yaml"), "links: []\n", "utf8");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--output", reportPath, "--require-llm"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 1, result.stderr);
    assert.equal(fs.existsSync(validationInProgressPath(reportPath)), false);
    assert.equal(fs.existsSync(validationFailurePath(reportPath)), true);
    const attempts = fs.readdirSync(path.join(temporary, ".validation-attempts"));
    assert.equal(attempts.length, 1);
    const episode = YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8"));
    assert.equal(episode.source_verification.relevance_review, "failed");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("source validation rejects alternate source and claim inputs", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-canonical-inputs-"));
  const sourcesPath = path.join(temporary, "sources.yaml"); const claimsPath = path.join(temporary, "claim-inventory.yaml");
  const alternateSourcesPath = path.join(temporary, "alternate-sources.yaml"); const alternateClaimsPath = path.join(temporary, "alternate-claims.yaml");
  const sources = "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n";
  const claims = "claims:\n  - id: claim-a\n    sources: [source-a]\n";
  fs.writeFileSync(sourcesPath, sources); fs.writeFileSync(claimsPath, claims); fs.writeFileSync(alternateSourcesPath, sources); fs.writeFileSync(alternateClaimsPath, claims);
  fs.writeFileSync(path.join(temporary, "episode.yaml"), "production_contract_version: 2\nsource_verification: {}\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Notes\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes-manifest.yaml"), "links: []\n", "utf8");
  try {
    for (const [selectedSources, selectedClaims] of [[alternateSourcesPath, claimsPath], [sourcesPath, alternateClaimsPath]]) {
      const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", selectedSources, "--claims", selectedClaims, "--dry-run"], { encoding: "utf8", timeout: 2_000 });
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, /canonical episode package files/);
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("source validation dry runs fail when claim mappings are invalid", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-test-"));
  const sourcesPath = path.join(temporary, "sources.yaml"); const claimsPath = path.join(temporary, "claim-inventory.yaml");
  fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [missing-claim]\n");
  fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [source-a]\n");
  fs.writeFileSync(path.join(temporary, "episode.yaml"), "production_contract_version: 2\nsource_verification: {}\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Notes\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes-manifest.yaml"), "links: []\n", "utf8");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--dry-run"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /Claim mapping failed: source source-a maps unknown claim missing-claim/);
    assert.doesNotMatch(result.stdout, /Validated input shape/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("narration derivative preserves the approved script while removing source tags and metadata", () => {
  const narration = deriveNarration("# Test Episode\n\n**Version:** 0.1.0 — approved\n\n## Opening\n\n**INSTRUCTOR:**\n\nApproved spoken text.\n\n[Source: sources.yaml#test]\n[Claim type: FAA guidance]\n");
  assert.match(narration, /^# Test Episode — narration derivative/m);
  assert.match(narration, /## Opening[\s\S]*Approved spoken text\./);
  assert.doesNotMatch(narration, /\*\*Version:/);
  assert.doesNotMatch(narration, /\[Source:|\[Claim type:/);
});

test("Core 03 narration derivative matches the approved master script", () => {
  const episodePath = path.join(__dirname, "..", "episodes", "core-03-stalls-load-factor-spin-avoidance");
  assert.equal(
    fs.readFileSync(path.join(episodePath, "narration.md"), "utf8"),
    deriveNarration(fs.readFileSync(path.join(episodePath, "master-script.md"), "utf8")),
  );
});

test("per-claim relevance requires an assessment for every expected claim", () => {
  const result = validateClaimAssessments(
    { status: "assessed", assessment: { claim_assessments: [{ claim_id: "claim-a", verdict: "supports" }] } },
    ["claim-a", "claim-b"],
  );
  assert.equal(result.valid, false);
  assert.deepEqual(result.missing_assessment_ids, ["claim-b"]);
});

test("per-claim relevance rejects an unsupported claim despite a favorable overall source verdict", () => {
  const result = validateClaimAssessments(
    { status: "assessed", assessment: { verdict: "supports", claim_assessments: [{ claim_id: "claim-a", verdict: "does_not_support" }] } },
    ["claim-a"],
  );
  assert.equal(result.valid, false);
  assert.deepEqual(result.unsupported_assessment_ids, ["claim-a"]);
});

test("per-claim relevance fails closed on a partially supporting assessment", () => {
  const result = validateClaimAssessments(
    { status: "assessed", assessment: { verdict: "supports", claim_assessments: [{ claim_id: "claim-a", verdict: "partially_supports" }] } },
    ["claim-a"],
  );
  assert.equal(result.valid, false);
  assert.deepEqual(result.unsupported_assessment_ids, ["claim-a"]);
});

test("citation-group relevance accepts an aggregate partial verdict when every mapped claim and locator supports", () => {
  const result = { citation_target: { valid: true }, link: { valid: true }, relevance: { status: "assessed", assessment: { verdict: "partially_supports", locator_assessment: { verdict: "supports" }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports" }] } }, claim_assessments: { valid: true } };
  assert.equal(sourceRelevanceResultValid(result), true);
  assert.equal(sourceRelevanceResultValid({ ...result, claim_assessments: { valid: false } }), false);
});

test("source fetch timeout remains active while the response body is read", async () => {
  const fetchImpl = (_url, { signal }) => {
    const stream = new ReadableStream({
      start(controller) {
        signal.addEventListener("abort", () => controller.error(new DOMException("aborted", "AbortError")));
      },
    });
    return Promise.resolve(new Response(stream, { status: 200, headers: { "content-type": "text/html" } }));
  };
  await assert.rejects(fetchSource("https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", { fetchImpl, timeoutMs: 10 }), /AbortError|aborted/);
});

test("source fetch timeout terminates a response body that ignores the abort signal", async () => {
  const fetchImpl = () => {
    const stream = new ReadableStream({ start() {} });
    return Promise.resolve(new Response(stream, { status: 200, headers: { "content-type": "text/html" } }));
  };
  await assert.rejects(fetchSource("https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", { fetchImpl, timeoutMs: 10 }), /AbortError|aborted/);
});

test("source fetch retries a transient aborted request", async () => {
  let calls = 0;
  const fetchImpl = () => {
    calls += 1;
    if (calls === 1) return Promise.reject(new DOMException("aborted", "AbortError"));
    return Promise.resolve(new Response("current FAA source", { status: 200, headers: { "content-type": "text/plain" } }));
  };
  const result = await fetchSource("https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", { fetchImpl });
  assert.equal(calls, 2);
  assert.equal(result.status, 200);
  assert.equal(result.excerpt, "current FAA source");
});

test("source fetch retries a transient service-unavailable response", async () => {
  let calls = 0;
  const fetchImpl = () => {
    calls += 1;
    if (calls === 1) return Promise.resolve(new Response("temporarily unavailable", { status: 503, headers: { "content-type": "text/plain" } }));
    return Promise.resolve(new Response("current FAA source", { status: 200, headers: { "content-type": "text/plain" } }));
  };
  const result = await fetchSource("https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", { fetchImpl });
  assert.equal(calls, 2);
  assert.equal(result.status, 200);
  assert.equal(result.excerpt, "current FAA source");
});

test("source-relevance requests stop when the validation run is cancelled", async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const controller = new AbortController(); let observedAbort = false;
  process.env.OPENAI_API_KEY = "test-key";
  const fetchImpl = (_url, { signal }) => new Promise((_, reject) => signal.addEventListener("abort", () => { observedAbort = true; reject(new DOMException("aborted", "AbortError")); }, { once: true }));
  try {
    const pending = assessRelevance({ model: "gpt-5.6-terra", source: { id: "source-a", title: "Test", locator: "Paragraph 1", relevance_excerpt: "Source text" }, claims: [{ id: "claim-a", statement: "Claim", type: "guidance" }], fetched: { excerpt: "Current source text" }, fetchImpl, signal: controller.signal });
    controller.abort();
    await assert.rejects(pending, /AbortError|aborted/);
    assert.equal(observedAbort, true);
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});

test("source-relevance cancellation remains active while the response body is read", async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const controller = new AbortController(); let observedAbort = false;
  process.env.OPENAI_API_KEY = "test-key";
  const fetchImpl = (_url, { signal }) => {
    const stream = new ReadableStream({
      start(bodyController) {
        signal.addEventListener("abort", () => {
          observedAbort = true;
          bodyController.error(new DOMException("aborted", "AbortError"));
        }, { once: true });
      },
    });
    return Promise.resolve(new Response(stream, { status: 200, headers: { "content-type": "application/json" } }));
  };
  try {
    const pending = assessRelevance({ model: "gpt-5.6-terra", source: { id: "source-a", title: "Test", locator: "Paragraph 1", relevance_excerpt: "Source text" }, claims: [{ id: "claim-a", statement: "Claim", type: "guidance" }], fetched: { excerpt: "Current source text" }, fetchImpl, signal: controller.signal });
    controller.abort();
    await assert.rejects(pending, /AbortError|aborted/);
    assert.equal(observedAbort, true);
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});

test("source relevance assesses freshly fetched text instead of a ledger excerpt", async () => {
  const originalKey = process.env.OPENAI_API_KEY; let request;
  process.env.OPENAI_API_KEY = "test-key";
  const fetchImpl = (_url, options) => {
    request = JSON.parse(options.body);
    const assessment = { verdict: "supports", confidence: "high", rationale: "Current text supports the claim.", locator_assessment: { verdict: "supports", rationale: "Locator is present." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "Supported." }] };
    return Promise.resolve(new Response(JSON.stringify({ output: [{ content: [{ type: "output_text", text: JSON.stringify(assessment) }] }] }), { status: 200, headers: { "content-type": "application/json" } }));
  };
  try {
    await assessRelevance({ model: "gpt-5.6-terra", source: { id: "source-a", title: "Test", locator: "Paragraph 1", relevance_excerpt: "STALE LEDGER TEXT" }, claims: [{ id: "claim-a", claim: "Canonical claim text", claim_type: "guidance" }], authoredPassages: ["AUTHORED SCRIPT PASSAGE"], fetched: { excerpt: "CURRENT FETCHED TEXT" }, fetchImpl });
    assert.match(request.input, /CURRENT FETCHED TEXT/);
    assert.doesNotMatch(request.input, /STALE LEDGER TEXT/);
    assert.match(request.input, /AUTHORED SCRIPT PASSAGE/);
    assert.match(request.input, /Canonical claim text/);
    assert.match(request.input, /\"type\":\"guidance\"/);
    assert.match(request.instructions, /citation group/);
    assert.match(request.instructions, /combines the claim assessments from every tagged source/);
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});

test("source validation locks report ownership and refuses unsafe recovery", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-lock-test-"));
  const outputPath = path.join(temporary, "link-validation.yaml");
  try {
    const owner = markValidationInProgress(outputPath, { sources: "a" });
    assert.throws(() => markValidationInProgress(outputPath, { sources: "a" }), /already in progress or was interrupted/);
    assert.throws(() => completeValidationReport(outputPath, { result: "wrong owner" }, { ...owner, run_id: "different-run" }), /ownership changed/);
    assert.equal(fs.existsSync(outputPath), false);
    completeValidationReport(outputPath, { result: "released" }, owner);
    assert.equal(fs.existsSync(validationInProgressPath(outputPath)), false);

    const failedRun = markValidationInProgress(outputPath, { sources: "a" });
    const failedPath = completeValidationReport(outputPath, { result: "failed" }, failedRun, { promote: false });
    assert.equal(failedPath, failedValidationAttemptPath(outputPath, failedRun));
    assert.deepEqual(YAML.parse(fs.readFileSync(outputPath, "utf8")), { result: "released" });
    assert.deepEqual(YAML.parse(fs.readFileSync(failedPath, "utf8")), { result: "failed" });
    assert.equal(fs.existsSync(validationFailurePath(outputPath)), true);
    assert.equal(YAML.parse(fs.readFileSync(validationFailurePath(outputPath), "utf8")).run_id, failedRun.run_id);

    const cleanRun = markValidationInProgress(outputPath, { sources: "a" });
    completeValidationReport(outputPath, { result: "clean" }, cleanRun);
    assert.equal(fs.existsSync(validationFailurePath(outputPath)), false);
    assert.deepEqual(YAML.parse(fs.readFileSync(outputPath, "utf8")), { result: "clean" });

    fs.writeFileSync(validationInProgressPath(outputPath), YAML.stringify({ run_id: "remote-run", hostname: "other-host.example", pid: 999_999, started_at_utc: "2026-08-25T00:00:00.000Z" }));
    assert.throws(() => markValidationInProgress(outputPath, { sources: "a" }, { recoverStaleLock: true }), /cannot be safely recovered/);
    fs.unlinkSync(validationInProgressPath(outputPath));
    fs.mkdirSync(validationRecoveryPath(outputPath));
    assert.throws(() => markValidationInProgress(outputPath, { sources: "a" }), /lock recovery is in progress/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("eCFR validation fallback must stay on the official versioner endpoint", () => {
  const valid = validationTargetErrors({
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-E/section-61.105",
    validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-10/title-14.xml?part=61",
  });
  assert.deepEqual(valid, []);
  const invalid = validationTargetErrors({
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-E/section-61.105",
    validation_url: "https://example.com/current.xml?part=61",
  });
  assert.match(invalid.join("\n"), /ecfr\.gov/);
});

test("eCFR derives an exact-section XML endpoint from legacy ledgers", async () => {
  const source = { url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61/subpart-E/section-61.105", validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-10/title-14.xml?part=61" };
  let requested;
  const result = await verifyEcfrSection(source, { fetchImpl: (url) => {
    if (String(url).endsWith("/titles.json")) return Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-10" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } }));
    requested = String(url);
    return Promise.resolve(new Response("<ROOT><DIV8 N=\"§ 61.105\" TYPE=\"SECTION\" hierarchy_metadata='{\"path\":\"/on/_SUBSTITUTE_DATE_/title-14/section-61.105\",\"citation\":\"14 CFR 61.105\"}'><HEAD>§ 61.105 Knowledge areas.</HEAD><P>Knowledge areas.</P></DIV8></ROOT>", { status: 200, headers: { "content-type": "application/xml" } }));
  } });
  assert.equal(requested, "https://www.ecfr.gov/api/versioner/v1/full/2026-08-10/title-14.xml?part=61&section=61.105");
  assert.equal(result.link.valid, true);
  assert.equal(result.link.resolved_via, "ecfr_exact_section_xml");
  assert.deepEqual(result.link.section_identity, { title: "14", part: "61", section: "61.105", date: "2026-08-10", section_number: "§ 61.105" });
  assert.match(result.link.section_text, /Knowledge areas/);
});

test("eCFR date refresh updates the source record before section validation reruns", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ecfr-date-refresh-")); const sourcesPath = path.join(temporary, "sources.yaml");
  try {
    fs.writeFileSync(sourcesPath, YAML.stringify({ sources: [{ id: "ecfr", url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91/subpart-B/section-91.103", validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-25/title-14.xml?part=91", revision: "eCFR Title 14 current through August 25, 2026", supports_claims: ["claim"] }] }));
    const ledger = YAML.parse(fs.readFileSync(sourcesPath, "utf8")); let requests = 0;
    const changes = await refreshEcfrManifestDates(sourcesPath, ledger, { fetchImpl: (url) => {
      requests += 1; assert.match(String(url), /titles\.json$/);
      return Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-26" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } }));
    } });
    const refreshed = YAML.parse(fs.readFileSync(sourcesPath, "utf8")).sources[0];
    assert.equal(requests, 1); assert.equal(changes.length, 1);
    assert.equal(refreshed.validation_url, "https://www.ecfr.gov/api/versioner/v1/full/2026-08-26/title-14.xml?part=91");
    assert.equal(refreshed.revision, "eCFR Title 14 current through August 26, 2026");
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("eCFR refresh keeps the rate limiter alive until the rerun completes", async () => {
  const events = []; let releaseRerun;
  const rerunGate = new Promise((resolve) => { releaseRerun = resolve; });
  const limiter = { close() { events.push("limiter-closed"); } };
  const running = runWithEcfrRateLimiter(async ({ refreshCount }) => {
    events.push(`attempt-${refreshCount}`);
    if (refreshCount === 0) return { refreshedEcfrSources: [{ id: "title-14" }] };
    await rerunGate;
    events.push("rerun-complete");
    return { refreshedEcfrSources: [] };
  }, limiter);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(events, ["attempt-0", "attempt-1"]);
  releaseRerun();
  await running;
  assert.deepEqual(events, ["attempt-0", "attempt-1", "rerun-complete", "limiter-closed"]);
  const finalAttemptFlags = [];
  await assert.rejects(runWithEcfrRefreshes(async ({ finalRefreshAttempt }) => {
    finalAttemptFlags.push(finalRefreshAttempt);
    return { refreshedEcfrSources: [{ id: "title-14" }] };
  }, { maximumRefreshes: 1 }), /eCFR changed during 2 consecutive validation attempts/);
  assert.deepEqual(finalAttemptFlags, [false, true]);
});

test("eCFR date refresh leaves malformed eCFR records for normal validation", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ecfr-date-invalid-")); const sourcesPath = path.join(temporary, "sources.yaml");
  try {
    const source = { id: "ecfr", url: "https://www.ecfr.gov/current/title-14/part-91/section-91.103", validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-25/title-14.xml?part=99", supports_claims: ["claim"] };
    fs.writeFileSync(sourcesPath, YAML.stringify({ sources: [source] })); let requests = 0;
    const changes = await refreshEcfrManifestDates(sourcesPath, { sources: [source] }, { fetchImpl: () => { requests += 1; throw new Error("must not fetch"); } });
    assert.deepEqual(changes, []); assert.equal(requests, 0);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("eCFR date refresh refuses to overwrite a concurrently changed source manifest", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ecfr-date-race-")); const sourcesPath = path.join(temporary, "sources.yaml");
  try {
    const source = { id: "ecfr", url: "https://www.ecfr.gov/current/title-14/part-91/section-91.103", validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-25/title-14.xml?part=91", supports_claims: ["claim"] };
    fs.writeFileSync(sourcesPath, YAML.stringify({ sources: [source] })); const expectedSourcesSha256 = crypto.createHash("sha256").update(fs.readFileSync(sourcesPath)).digest("hex");
    fs.appendFileSync(sourcesPath, "# collaborator edit\n");
    await assert.rejects(refreshEcfrManifestDates(sourcesPath, { sources: [source] }, { expectedSourcesSha256, fetchImpl: () => Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-26" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } })) }), /changed while eCFR date refresh was pending/);
    assert.match(fs.readFileSync(sourcesPath, "utf8"), /collaborator edit/);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("eCFR rate limiter governs retry attempts", async () => {
  const limiter = requestRateLimiter({ maxInFlight: 5, minStartIntervalMs: 15 }); const starts = []; let attempts = 0;
  const response = await fetchSource("https://www.ecfr.gov/api/versioner/v1/titles.json", { ecfrRateLimiter: limiter, fetchImpl: () => {
    starts.push(Date.now()); attempts += 1;
    return Promise.resolve(new Response("{}", { status: attempts === 1 ? 503 : 200, headers: { "content-type": "application/json" } }));
  } });
  limiter.close();
  assert.equal(response.status, 200); assert.equal(starts.length, 2); assert.ok(starts[1] - starts[0] >= 12);
});

test("eCFR fails closed on unsafe target mismatch, wrong media type, and missing or ambiguous XML sections", async () => {
  const source = { url: "https://www.ecfr.gov/current/title-14/part-61/section-61.105", validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-10/title-14.xml?part=99&section=61.105&unsafe=yes" };
  assert.match(validationTargetErrors(source).join("\n"), /does not match|unsupported/);
  const validSource = { ...source, validation_url: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-10/title-14.xml?part=61" };
  for (const response of [
    new Response("<DIV8 N=\"§ 61.105\" TYPE=\"SECTION\"><P>Text.</P></DIV8>", { status: 200, headers: { "content-type": "text/html" } }),
    new Response("<DIV8 N=\"§ 61.104\" TYPE=\"SECTION\"><P>Text.</P></DIV8>", { status: 200, headers: { "content-type": "application/xml" } }),
    new Response("<ROOT><DIV8 N=\"§ 61.105\" TYPE=\"SECTION\"><P>One.</P></DIV8><DIV8 N=\"§ 61.105\" TYPE=\"SECTION\"><P>Two.</P></DIV8></ROOT>", { status: 200, headers: { "content-type": "application/xml" } }),
  ]) {
    const result = await verifyEcfrSection(validSource, { fetchImpl: (url) => String(url).endsWith("/titles.json") ? Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-10" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } })) : Promise.resolve(response.clone()) });
    assert.equal(result.link.valid, false);
  }
  const stale = await verifyEcfrSection(validSource, { fetchImpl: (url) => {
    if (String(url).endsWith("/titles.json")) return Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-11" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } }));
    throw new Error("stale validation must not fetch the section");
  } });
  assert.equal(stale.link.valid, false);
  assert.match(stale.link.errors.join("\n"), /does not match current title/);
  const descendantIdentity = await verifyEcfrSection(validSource, { fetchImpl: (url) => String(url).endsWith("/titles.json") ? Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-10" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } })) : Promise.resolve(new Response("<DIV8 TYPE=\"SECTION\"><P N=\"61.105\">not a section identity</P></DIV8>", { status: 200, headers: { "content-type": "application/xml" } })) });
  assert.equal(descendantIdentity.link.valid, false);
  const wrongMetadata = await verifyEcfrSection(validSource, { fetchImpl: (url) => String(url).endsWith("/titles.json") ? Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-10" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } })) : Promise.resolve(new Response("<DIV8 N=\"61.105\" TYPE=\"SECTION\" hierarchy_metadata='{\"path\":\"/on/_SUBSTITUTE_DATE_/title-14/section-61.104\",\"citation\":\"14 CFR 61.104\"}'><P>Wrong identity.</P></DIV8>", { status: 200, headers: { "content-type": "application/xml" } })) });
  assert.equal(wrongMetadata.link.valid, false);
  const oversized = await verifyEcfrSection(validSource, { fetchImpl: (url) => String(url).endsWith("/titles.json") ? Promise.resolve(new Response(JSON.stringify({ titles: [{ number: 14, up_to_date_as_of: "2026-08-10" }], meta: { import_in_progress: false } }), { status: 200, headers: { "content-type": "application/json" } })) : Promise.resolve(new Response("<DIV8 N=\"61.105\" TYPE=\"SECTION\"><P>Too large.</P></DIV8>", { status: 200, headers: { "content-type": "application/xml", "content-length": "2000001" } })) });
  assert.equal(oversized.link.valid, false);
  assert.match(oversized.link.errors.join("\n"), /truncated/);
});

test("programmatic FAA fallback requires an FAA-page attestation and reviewed digest", () => {
  const errors = validationTargetErrors({
    url: "https://www.faa.gov/sites/faa.gov/files/chapter.pdf#page=2",
    programmatic_url: "https://www.faa.gov/sites/faa.gov/files/chapter_0.pdf",
    programmatic_attestation: {
      url: "https://example.com/chapter",
      link_text: "chapter_0.pdf",
      sha256: "not-a-digest",
    },
  });
  assert.match(errors.join("\n"), /FAA-hosted/);
  assert.match(errors.join("\n"), /SHA-256/);
});

test("attested programmatic FAA copy is used when a PDF citation receives an interstitial", async () => {
  const citedUrl = "https://www.faa.gov/sites/faa.gov/files/chapter.pdf#page=2";
  const programmaticUrl = "https://www.faa.gov/sites/faa.gov/files/chapter_0.pdf";
  const attestationUrl = "https://www.faa.gov/regulationspolicies/handbooksmanuals/aviation/phak/chapter-4-principles-flight";
  const bytes = Buffer.from("identical FAA chapter bytes");
  const sha256 = require("node:crypto").createHash("sha256").update(bytes).digest("hex");
  const fetchImpl = (url) => {
    const requested = new URL(url).toString();
    if (requested === citedUrl) return Promise.resolve(new Response("Pardon our interruption", { status: 200, headers: { "content-type": "text/html" } }));
    if (requested === programmaticUrl) return Promise.resolve(new Response(bytes, { status: 200, headers: { "content-type": "application/pdf" } }));
    if (requested === attestationUrl) return Promise.resolve(new Response(`<a href="${programmaticUrl}">chapter_0.pdf</a>`, { status: 200, headers: { "content-type": "text/html" } }));
    throw new Error(`unexpected URL ${requested}`);
  };
  const result = await verifyProgrammaticFallback({
    url: citedUrl,
    programmatic_url: programmaticUrl,
    programmatic_attestation: { url: attestationUrl, link_text: "chapter_0.pdf", sha256 },
  }, {
    fetchImpl,
    includePdfPageText: true,
    pdfjsLoader: async () => ({
      getDocument: () => ({
        promise: Promise.resolve({
          numPages: 2,
          getPage: async (pageNumber) => {
            assert.equal(pageNumber, 2);
            return { getTextContent: async () => ({ items: [{ str: "Cited page text" }] }) };
          },
        }),
        destroy: async () => {},
      }),
    }),
  });
  assert.equal(result.content_attestation.valid, true);
  assert.equal(result.content_attestation.citation_hash_matches_programmatic, null);
  assert.equal(result.link.valid, true);
  assert.equal(result.link.resolved_via, "attested_programmatic_fallback");
  assert.equal(result.link.pdf_page_number, 2);
  assert.equal(result.link.pdf_page_text, "Cited page text");
});

test("show-notes results preserve failed programmatic fallback attestations", () => {
  const result = applyVerificationEvidence(
    { citation_target: { valid: true, errors: [] } },
    { programmatic_url: "https://www.faa.gov/sites/faa.gov/files/chapter_0.pdf" },
    {
      link: { valid: true },
      citation_link: { valid: true },
      programmatic_link: { valid: true },
      attestation_link: { valid: true },
      content_attestation: { valid: false, errors: ["reviewed digest no longer matches"] },
    },
  );
  assert.equal(result.content_attestation.valid, false);
  assert.equal(deterministicEntryValid(result), false);
});

test("programmatic FAA validation reuses a shared fetch cache for repeated chapter attestations", async () => {
  const citedUrl = "https://www.faa.gov/sites/faa.gov/files/chapter.pdf#page=2";
  const laterPageUrl = "https://www.faa.gov/sites/faa.gov/files/chapter.pdf#page=3";
  const programmaticUrl = "https://www.faa.gov/sites/faa.gov/files/chapter_0.pdf";
  const attestationUrl = "https://www.faa.gov/regulationspolicies/handbooksmanuals/aviation/phak/chapter-4-principles-flight";
  const bytes = Buffer.from("identical FAA chapter bytes");
  const sha256 = require("node:crypto").createHash("sha256").update(bytes).digest("hex");
  let fetchCount = 0;
  const fetchImpl = (url) => {
    fetchCount += 1;
    const requested = new URL(url).toString();
    if (requested === citedUrl) return Promise.resolve(new Response(bytes, { status: 200, headers: { "content-type": "application/pdf" } }));
    if (requested === programmaticUrl) return Promise.resolve(new Response(bytes, { status: 200, headers: { "content-type": "application/pdf" } }));
    if (requested === attestationUrl) return Promise.resolve(new Response(`<a href="${programmaticUrl}">chapter_0.pdf</a>`, { status: 200, headers: { "content-type": "text/html" } }));
    throw new Error(`unexpected URL ${requested}`);
  };
  const source = {
    url: citedUrl,
    programmatic_url: programmaticUrl,
    programmatic_attestation: { url: attestationUrl, link_text: "chapter_0.pdf", sha256 },
  };
  const fetchCache = new Map();
  const first = await verifyProgrammaticFallback(source, { fetchImpl, fetchCache });
  const second = await verifyProgrammaticFallback({ ...source, url: laterPageUrl }, { fetchImpl, fetchCache });
  assert.equal(first.content_attestation.valid, true);
  assert.equal(second.content_attestation.valid, true);
  assert.equal(second.link.requested_url, laterPageUrl);
  assert.equal(fetchCount, 3);
});

test("production notice must begin immediately after the final opening segment", () => {
  const delayed = [
    { index: 1, section: "opening", text: "First opening sentence." },
    { index: 2, section: "opening", text: "Second opening sentence." },
    { index: 3, section: "objectives", text: "An intervening spoken section." },
    { index: 4, section: "disclaimer", text: REQUIRED_NOTICE },
  ];
  assert.throws(() => validateFrontMatter(delayed), /immediately follow the final opening segment/);
  assert.doesNotThrow(() => validateFrontMatter([...delayed.slice(0, 2), { ...delayed[3], index: 3 }]));
});

test("production notice must be the first spoken text after the opening", () => {
  const interveningCopy = [
    { index: 1, section: "opening", text: "Today's topic." },
    { index: 2, section: "disclaimer", text: "Before the notice, an unrelated message." },
    { index: 3, section: "disclaimer", text: REQUIRED_NOTICE },
  ];
  assert.throws(() => validateFrontMatter(interveningCopy), /must begin immediately after the opening/);
});

test("legacy production-notice headings remain valid", () => {
  assert.doesNotThrow(() => validateFrontMatter([
    { index: 1, section: "opening", text: "Today's topic." },
    { index: 2, section: "required production notice", text: REQUIRED_NOTICE },
  ]));
});

test("realtime renderer accepts an Announcer turn", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-renderer-test-"));
  const scriptPath = path.join(temporary, "master-script.md");
  fs.writeFileSync(scriptPath, `# Test\n\n## Opening\n\n**INSTRUCTOR:**\n\nCold open.\n\n## Disclaimer\n\n**INSTRUCTOR:**\n\n${REQUIRED_NOTICE}\n\n## Podcast introduction\n\n**ANNOUNCER:**\n\nWelcome to the podcast.\n`);
  try {
    assert.equal(parseScript(scriptPath, 240).at(-1).speaker, "ANNOUNCER");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("realtime renderer requires the current narration derivative", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-narration-input-test-"));
  const masterPath = path.join(temporary, "master-script.md");
  const narrationPath = path.join(temporary, "narration.md");
  const master = "# Test\n\n**Version:** 0.1.0\n\n**INSTRUCTOR:**\n\nCurrent spoken text.\n";
  fs.writeFileSync(masterPath, master, "utf8"); fs.writeFileSync(narrationPath, deriveNarration(master), "utf8");
  try {
    assert.doesNotThrow(() => assertNarrationInput(narrationPath));
    assert.throws(() => assertNarrationInput(masterPath), /narration\.md derivative/);
    fs.writeFileSync(narrationPath, "stale", "utf8");
    assert.throws(() => assertNarrationInput(narrationPath), /not the current derivative/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("realtime renderer requires completed source-relevance review before rendering", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-render-gate-test-"));
  const scriptPath = path.join(temporary, "narration.md");
  const masterScript = "# Test\n\n**INSTRUCTOR:**\n\nLesson.\n";
  fs.writeFileSync(scriptPath, "# Test narration\n", "utf8");
  fs.writeFileSync(path.join(temporary, "master-script.md"), masterScript, "utf8");
  fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify({ production_contract_version: 2, source_verification: { status: "source_relevance_complete", relevance_review: "complete", verified_at_utc: "2026-09-10T00:00:00Z", claim_source_preflight: "claim-source-preflight.yaml", claim_source_preflight_status: "complete", link_validation: "link-validation.yaml", show_notes_manifest: "show-notes-manifest.yaml" }, review: { editorial_status: "script_approved", editorial_script_sha256: crypto.createHash("sha256").update(masterScript).digest("hex") } }), "utf8");
  fs.writeFileSync(path.join(temporary, "sources.yaml"), "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1\n    supports_claims: [claim-a]\n", "utf8");
  fs.writeFileSync(path.join(temporary, "claim-inventory.yaml"), "claims:\n  - id: claim-a\n    sources: [source-a]\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Notes\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes-manifest.yaml"), "links: []\n", "utf8");
  const inputSha256 = sourceValidationInputHashes(temporary);
  const validation = (results) => YAML.stringify({ checked_at_utc: "2026-09-10T00:00:00Z", llm_requested: true, claim_mapping: { valid: true }, master_script_mapping: { valid: true, status: "not_configured", source_tag_count: 0, claim_coverage_count: 0 }, show_notes_mapping: { valid: true }, input_sha256: inputSha256, results, show_notes_results: [] });
  fs.writeFileSync(path.join(temporary, "link-validation.yaml"), validation([]), "utf8");
  fs.writeFileSync(path.join(temporary, "qa-checklist.md"), "- [x] Preflight authorization. <!-- qa-id: openai-claim-source-preflight-authorization -->\n- [x] Preflight complete. <!-- qa-id: claim-source-preflight -->\n- [x] Source review authorization. <!-- qa-id: openai-source-review-authorization -->\n", "utf8");
  const preflightExcerpt = "The cited paragraph supports the test claim.";
  const preflight = () => ({ schema_version: 1, validator: "scripts/claim-source-preflight.cjs", status: "complete", authorization: { consumed_at_utc: "2026-09-10T00:00:00Z", run_id: crypto.randomUUID() }, checked_at_utc: "2026-09-10T00:00:00Z", llm_requested: true, llm_model: "gpt-5.6-sol", input_sha256: claimSourcePreflightInputHashes(temporary), results: [{ source_id: "source-a", locator: "Paragraph 1-1-1", linked_claim_ids: ["claim-a"], fetched_locator: fetchedLocatorEvidence({ url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html" }, preflightExcerpt), reviewed_excerpt: { kind: "section_text", text: preflightExcerpt, sha256: crypto.createHash("sha256").update(preflightExcerpt).digest("hex"), characters: preflightExcerpt.length }, relevance: { status: "assessed", locator_assessment: { verdict: "supports", rationale: "The retained paragraph is the cited locator." }, claim_assessments: [{ claim_id: "claim-a", verdict: "supports", rationale: "The paragraph supports the test claim." }] } }] });
  fs.writeFileSync(path.join(temporary, "claim-source-preflight.yaml"), YAML.stringify(preflight()), "utf8");
  try {
    const passingResult = { source_id: "source-a", linked_claim_ids: ["claim-a"], citation_target: { valid: true }, link: { valid: true }, relevance: { status: "assessed", assessment: { verdict: "supports", locator_assessment: { verdict: "supports" } } }, claim_assessments: { valid: true } };
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), validation([{ ...passingResult, link: { valid: false } }]), "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /source- and claim-level relevance assessments/);
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), validation([passingResult]), "utf8");
    assert.doesNotThrow(() => assertSourceRelevanceApproved(scriptPath));
    const timestamplessEpisode = YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8"));
    const timestamplessValidation = YAML.parse(fs.readFileSync(path.join(temporary, "link-validation.yaml"), "utf8"));
    timestamplessEpisode.source_verification.verified_at_utc = null;
    timestamplessValidation.checked_at_utc = null;
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify(timestamplessEpisode), "utf8");
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), YAML.stringify(timestamplessValidation), "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /must record a valid UTC source-review timestamp/);
    timestamplessEpisode.source_verification.verified_at_utc = "2026-09-10T00:00:00Z";
    timestamplessValidation.checked_at_utc = "2026-09-10T00:00:00Z";
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify(timestamplessEpisode), "utf8");
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), YAML.stringify(timestamplessValidation), "utf8");
    fs.unlinkSync(path.join(temporary, "claim-source-preflight.yaml"));
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /Missing required file claim-source-preflight\.yaml/);
    fs.writeFileSync(path.join(temporary, "claim-source-preflight.yaml"), YAML.stringify(preflight()), "utf8");
    const broadLocatorPreflight = preflight(); broadLocatorPreflight.results[0].relevance.locator_assessment.verdict = "partially_supports";
    fs.writeFileSync(path.join(temporary, "claim-source-preflight.yaml"), YAML.stringify(broadLocatorPreflight), "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /supporting LLM locator assessment/);
    fs.writeFileSync(path.join(temporary, "claim-source-preflight.yaml"), YAML.stringify(preflight()), "utf8");
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), validation([]), "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /does not cover every current source/);
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), validation([passingResult]), "utf8");
    fs.writeFileSync(path.join(temporary, "link-validation.yaml.in-progress"), "started: true\n", "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /in progress, recovering, or was interrupted/);
    fs.unlinkSync(path.join(temporary, "link-validation.yaml.in-progress"));
    fs.writeFileSync(path.join(temporary, "link-validation.yaml.failed"), "run_id: failed-run\n", "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /most recent source-relevance validation failed/);
    fs.unlinkSync(path.join(temporary, "link-validation.yaml.failed"));
    fs.writeFileSync(path.join(temporary, "sources.yaml"), "sources: [changed]\n", "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /bound to the current sources/);
    const pendingEpisode = YAML.parse(fs.readFileSync(path.join(temporary, "episode.yaml"), "utf8"));
    pendingEpisode.source_verification.status = "source_relevance_pending";
    pendingEpisode.source_verification.relevance_review = "required_before_render";
    pendingEpisode.source_verification.verified_at_utc = null;
    fs.writeFileSync(path.join(temporary, "episode.yaml"), YAML.stringify(pendingEpisode), "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /source_relevance_complete/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("legacy renderer refuses a contract-v2 episode package", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-renderer-gate-test-"));
  const scriptPath = path.join(temporary, "master-script.md");
  try {
    fs.writeFileSync(scriptPath, "# Test\n", "utf8");
    fs.writeFileSync(path.join(temporary, "episode.yaml"), "{ production_contract_version: 2.0 }\n", "utf8");
    const result = childProcess.spawnSync("python3", [path.join(__dirname, "render_episode_audio.py"), "--script", scriptPath, "--audio-dir", path.join(temporary, "audio"), "--episode-id", "core-01", "--dry-run"], { encoding: "utf8" });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /legacy candidate reproduction only/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("episode contract reader serializes an absent marker as a legacy package", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-contract-reader-test-"));
  try {
    const episodePath = path.join(temporary, "episode.yaml");
    fs.writeFileSync(episodePath, "id: core-01\n", "utf8");
    const result = childProcess.spawnSync("node", [path.join(__dirname, "read-episode-contract.cjs"), episodePath], { encoding: "utf8" });
    assert.equal(result.status, 0);
    assert.deepEqual(JSON.parse(result.stdout), { kind: "legacy", episode_id: "core-01" });
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("legacy renderer refuses unsupported production contract markers", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-renderer-contract-test-"));
  const scriptPath = path.join(temporary, "master-script.md");
  try {
    fs.writeFileSync(scriptPath, "# Test\n", "utf8");
    for (const contractValue of ["null", '"2"', "3"]) {
      fs.writeFileSync(path.join(temporary, "episode.yaml"), `production_contract_version: ${contractValue}\n`, "utf8");
      const result = childProcess.spawnSync("python3", [path.join(__dirname, "render_episode_audio.py"), "--script", scriptPath, "--audio-dir", path.join(temporary, "audio"), "--episode-id", "core-01", "--dry-run"], { encoding: "utf8" });
      assert.equal(result.status, 2);
      assert.match(result.stderr, /requires production_contract_version to be absent/);
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("legacy renderer refuses scripts outside a preserved package", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-renderer-metadata-test-"));
  const scriptPath = path.join(temporary, "master-script.md");
  try {
    fs.writeFileSync(scriptPath, "# Test\n", "utf8");
    const result = childProcess.spawnSync("python3", [path.join(__dirname, "render_episode_audio.py"), "--script", scriptPath, "--audio-dir", path.join(temporary, "audio"), "--episode-id", "core-01", "--dry-run"], { encoding: "utf8" });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /requires a sibling episode\.yaml/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("realtime renderer preserves untreated familiar initialisms while applying narrow phonetic corrections", () => {
  assert.equal(spokenText("The A-I-M, often referred to as the AIM, supports the PHAK."), "The A-I-M, often referred to as the aim, supports the pee hack.");
  assert.equal(spokenText("The PHAK says AI-assisted production is reviewed by an MEL."), "The pee hack says artificial intelligence-assisted production is reviewed by an MEL.");
  assert.equal(spokenText("ASOS, AWOS, and ATIS report airport weather."), "AY-sohs, AY-wahs, and AY-tis report airport weather.");
  assert.equal(spokenText("METAR, TAF, SPECI, SIGMET, AIRMET, and 1800wxbrief.com are weather terms."), "MEE-tar, taf, SPECI, sig MET, air MET, and one eight-hundred w x brief dot com are weather terms.");
  assert.equal(spokenText("METARs, TAFs, SPECIs, SIGMETs, and AIRMETs can appear in a briefing."), "MEE-tars, tafs, SPECIs, sig METs, and air METs can appear in a briefing.");
  assert.equal(spokenText("The POH and AFM place CG limits in the ACS."), "The POH and AFM place CG limits in the ACS.");
  assert.equal(spokenText("The no-MEL path differs from MMEL guidance."), "The no-MEL path differs from MMEL guidance.");
  assert.equal(spokenText("PHAK-like examples differ from PHAKS."), "pee hack-like examples differ from PHAKS.");
  assert.equal(spokenText("The CG envelope is within limits."), "The CG envelope is within limits.");
  assert.match(pronunciationGuidance("The CG envelope is within limits."), /common noun/);
  assert.match(pronunciationGuidance("A SPECI can follow a METAR."), /one connected word/);
  assert.equal(pronunciationGuidance("The loading limit is within range."), "");
  assert.match(segmentInstruction({ speaker: "INSTRUCTOR", text: "The CG envelope is within limits." }, "No adjacent dialogue."), /Do not say this instruction aloud/);
});

test("MP3 chapters use the rendered section boundaries and preserve readable headings", () => {
  const chapters = chapterMarkersFor([
    { section: "opening", section_title: "Opening", start_frame: 6_000 },
    { section: "opening", section_title: "Opening", start_frame: 24_000 },
    { section: "podcast introduction", section_title: "Podcast introduction", start_frame: 48_000 },
    { section: "lift & drag", section_title: "Lift & Drag", start_frame: 96_000 },
  ], 6);
  assert.deepEqual(chapters, [
    { id: "chapter-001", start_ms: 0, end_ms: 2000, title: "Opening" },
    { id: "chapter-002", start_ms: 2000, end_ms: 4000, title: "Podcast introduction" },
    { id: "chapter-003", start_ms: 4000, end_ms: 6000, title: "Lift & Drag" },
  ]);
  assert.match(chapterFfmetadata(chapters), /title=Lift & Drag/);
});

test("MP3 chapter export embeds markers that ffprobe can read", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-chapters-test-"));
  const masterPath = path.join(temporary, "master.wav"); const mp3Path = path.join(temporary, "episode.mp3");
  const chapters = [{ id: "chapter-001", start_ms: 0, end_ms: 1_000, title: "Opening" }, { id: "chapter-002", start_ms: 1_000, end_ms: 2_000, title: "Lesson" }];
  fs.writeFileSync(masterPath, wavForTest(Buffer.alloc(24_000 * 2 * 2)));
  try {
    writeMp3WithChapters({ masterPath, mp3Path, chapters });
    verifyMp3Chapters(mp3Path, chapters);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("music cue plan preserves the requested intro lead and outro tail", () => {
  const plan = musicCuePlan({
    intro: { startFrame: 24_000, voiceStartFrame: 192_000, endFrame: 264_000 },
    outro: { startFrame: 2_400_000, endFrame: 2_640_000 },
  }, { introTailSeconds: 5, introFadeSeconds: 0.5, outroTailSeconds: 10, outroFadeSeconds: 5 });
  assert.deepEqual(plan, {
    intro: { start_seconds: 1, voice_start_seconds: 8, lead_seconds: 7, voice_duration_seconds: 3, continuation_seconds: 5, fade_seconds: 0.5, duration_seconds: 15.5 },
    outro: { start_seconds: 100, voice_duration_seconds: 10, continuation_seconds: 10, fade_seconds: 5, duration_seconds: 25 },
  });
});

test("intro-only preview retains the post-voice music continuation and fade", () => {
  const music = { introTailSeconds: 5, introFadeSeconds: 0.5, outroTailSeconds: 10, outroFadeSeconds: 5 };
  assert.equal(terminalMusicTailMilliseconds([{ section: "podcast introduction" }], music), 5_500);
  assert.equal(terminalMusicTailMilliseconds([{ section: "outro" }], music), 15_000);
  assert.equal(terminalMusicTailMilliseconds([{ section: "what the acs is asking you to connect" }], music), 0);
});

test("music intro lead applies only when entering the podcast introduction", () => {
  const spacing = { leadInMs: 250, continuedTurnMs: 120, speakerChangeMs: 220, sectionChangeMs: 550 };
  const music = { introLeadSeconds: 10, introTailSeconds: 5, introFadeSeconds: 0.5 };
  assert.equal(pauseBefore({ section: "required production notice", speaker: "INSTRUCTOR" }, { section: "podcast introduction", speaker: "ANNOUNCER" }, spacing, music), 10_000);
  assert.equal(pauseBefore({ section: "podcast introduction", speaker: "ANNOUNCER" }, { section: "podcast introduction", speaker: "ANNOUNCER" }, spacing, music), 120);
});

test("music holds a steady reduced level under announcer voice", () => {
  const expression = musicVolumeExpression({ lead_seconds: 10, voice_duration_seconds: 4 }, { gainDb: -24, voiceGainDb: -30, levelTransitionSeconds: 0.15 });
  assert.match(expression, /0\.06309573/);
  assert.match(expression, /0\.03162278/);
  assert.doesNotMatch(expression, /sidechain/);
});

test("the first assembled segment has a one-second playback lead-in", () => {
  const spacing = { leadInMs: 1000, continuedTurnMs: 120, speakerChangeMs: 220, sectionChangeMs: 550 };
  assert.equal(pauseBefore(null, { section: "opening", speaker: "INSTRUCTOR" }, spacing, null), 1000);
});

test("music assembly options do not invalidate reusable rendered segments", () => {
  const base = { model: "gpt-realtime-2.1", voices: { instructor: "marin", learner: "cedar", announcer: "ballad" }, stitchFadeMs: 8, maxWords: 240, continuityCharacters: 240, spacing: { leadInMs: 250, continuedTurnMs: 120, speakerChangeMs: 220, sectionChangeMs: 550 } };
  const noMusic = settingsFor({ ...base, music: null }, "script-hash");
  const withMusic = settingsFor({ ...base, music: { path: "assets/music/example.mp3", gainDb: -24 } }, "script-hash");
  assert.deepEqual(withMusic, noMusic);
});

test("episode audio mix configuration is explicit and bound to its rendered record", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-audio-mix-config-test-"));
  const episodePath = path.join(temporary, "episode"); const assetsPath = path.join(temporary, "assets");
  fs.mkdirSync(episodePath); fs.mkdirSync(assetsPath); fs.writeFileSync(path.join(assetsPath, "bed.mp3"), "audio bytes");
  fs.writeFileSync(path.join(episodePath, "audio-mix.yaml"), "schema_version: 1\nmusic:\n  enabled: true\n  source: ../assets/bed.mp3\n  base_gain_db: -24\n  voice_gain_db: -30\n  level_transition_seconds: 0.15\n  intro_lead_seconds: 10\n  intro_tail_seconds: 5\n  intro_fade_seconds: 0.5\n  outro_tail_seconds: 10\n  outro_fade_seconds: 5\n");
  try {
    const mix = loadAudioMixConfig(path.join(episodePath, "audio-mix.yaml"), { repoRoot: temporary, required: true });
    assert.equal(mix.enabled, true);
    assert.equal(audioMixMatchesManifest(mix, { source_sha256: mix.sourceSha256, base_gain_db: -24, voice_gain_db: -30, level_transition_seconds: 0.15, cue_plan: { intro: { lead_seconds: 10, continuation_seconds: 5, fade_seconds: 0.5 }, outro: { continuation_seconds: 10, fade_seconds: 5 } } }), true);
    assert.equal(audioMixMatchesManifest(mix, null), false);
    fs.writeFileSync(path.join(episodePath, "invalid.yaml"), "schema_version: 1\nmusic:\n  enabled: true\n  source: /tmp/outside.mp3\n  base_gain_db: -24\n  voice_gain_db: -30\n  level_transition_seconds: 0.15\n  intro_lead_seconds: 10\n  intro_tail_seconds: 5\n  intro_fade_seconds: 0.5\n  outro_tail_seconds: 10\n  outro_fade_seconds: 5\n");
    assert.throws(() => loadAudioMixConfig(path.join(episodePath, "invalid.yaml"), { repoRoot: temporary, required: true }), AudioMixConfigError);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("renderer refuses to overwrite an assembled candidate", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-render-output-test-"));
  const existing = path.join(temporary, "candidate.mp3"); fs.writeFileSync(existing, "existing candidate");
  try { assert.throws(() => assertOutputsVacant([existing]), /Refusing to replace existing assembled output/); }
  finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("renderer serializes concurrent assembly for the same candidate name", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-render-reservation-test-"));
  try {
    const release = acquireAssemblyReservation(temporary, "candidate");
    assert.throws(() => acquireAssemblyReservation(temporary, "candidate"), /already reserved/);
    release();
    const secondRelease = acquireAssemblyReservation(temporary, "candidate");
    secondRelease();
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("changed narration only reuses a segment when its exact render input still matches", () => {
  assert.equal(reusableSegment({ render_input_sha256: "same", source_text_sha256: "old" }, "same"), true);
  assert.equal(reusableSegment({ render_input_sha256: "old", source_text_sha256: "same" }, "same"), false);
  assert.equal(reusableSegment({ source_text_sha256: "same" }, "new"), false);
});

test("new rendered sidecars retain both source and render-input identities", () => {
  const segment = { index: 1, speaker: "INSTRUCTOR", section: "opening" };
  const record = usageRecordFor(segment, "source-hash", "render-input-hash", { pcm: Buffer.alloc(960), usage: { input_tokens: 1 } });
  assert.equal(record.source_text_sha256, "source-hash");
  assert.equal(record.render_input_sha256, "render-input-hash");
  assert.deepEqual(record.response_usage, { input_tokens: 1 });
});

test("rendering rejects unverified legacy sidecars with an explicit recovery path", async () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-legacy-segment-test-"));
  const workDir = path.join(temporary, "segments");
  const segment = { index: 1, speaker: "INSTRUCTOR", section: "opening", sectionTitle: "Opening", text: "Current narration." };
  const options = { model: "gpt-realtime-2.1", voices: { instructor: "marin", learner: "cedar", announcer: "ballad" }, continuityCharacters: 240 };
  fs.mkdirSync(workDir);
  fs.writeFileSync(path.join(workDir, "001-instructor.wav"), wavForTest(Buffer.alloc(960)));
  fs.writeFileSync(path.join(workDir, "001-instructor.usage.json"), JSON.stringify({ source_text_sha256: "legacy", response_usage: {} }));
  try {
    await assert.rejects(
      () => renderSegments([segment], [segment], options, workDir),
      /Rendered segment 1 has an unverified legacy sidecar\. Remove .*001-instructor\.wav and .*001-instructor\.usage\.json, then run --render-only/,
    );
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("assembly rejects a stale segment before it writes a candidate", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-stale-segment-test-"));
  const workDir = path.join(temporary, "segments");
  const audioDir = path.join(temporary, "audio");
  const scriptPath = path.join(temporary, "narration.md");
  const segment = { index: 1, speaker: "INSTRUCTOR", section: "opening", sectionTitle: "Opening", text: "Current narration." };
  const options = {
    model: "gpt-realtime-2.1",
    voices: { instructor: "marin", learner: "cedar", announcer: "ballad" },
    continuityCharacters: 240,
    spacing: { leadInMs: 1000, continuedTurnMs: 120, speakerChangeMs: 220, sectionChangeMs: 550 },
    stitchFadeMs: 8,
    music: null,
    episodeId: "test",
    format: "wav",
    scriptPath,
  };
  fs.mkdirSync(workDir);
  fs.writeFileSync(scriptPath, "# Test\n");
  fs.writeFileSync(path.join(workDir, "001-instructor.wav"), wavForTest(Buffer.alloc(960)));
  fs.writeFileSync(path.join(workDir, "001-instructor.usage.json"), JSON.stringify({ render_input_sha256: "stale", response_usage: {} }));
  try {
    assert.throws(
      () => assemble([segment], [segment], options, workDir, audioDir, "20260821T000000Z", false, "001-001"),
      /Rendered segment 1 does not match the current narration input/,
    );
    assert.equal(fs.existsSync(path.join(audioDir, "test-20260821T000000Z.master.wav")), false);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("music-bed mix creates a playable mono WAV", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-music-bed-test-"));
  const voicePath = path.join(temporary, "voice.wav");
  const musicPath = path.join(temporary, "music.wav");
  const outputPath = path.join(temporary, "mixed.wav");
  fs.writeFileSync(voicePath, wavForTest(Buffer.alloc(24_000 * 2 * 2)));
  try {
    const generated = childProcess.spawnSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=24000", "-t", "2", "-ac", "1", musicPath], { encoding: "utf8" });
    assert.equal(generated.status, 0, generated.stderr);
    mixMusicBeds({ voiceMasterPath: voicePath, outputPath, music: { path: musicPath, gainDb: -24, voiceGainDb: -30, levelTransitionSeconds: 0.15 }, plan: { intro: { start_seconds: 0, lead_seconds: 0, voice_duration_seconds: 1, continuation_seconds: 0, fade_seconds: 0.5, duration_seconds: 1.5 } } });
    const probe = childProcess.spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=sample_rate,channels", "-of", "default=noprint_wrappers=1", outputPath], { encoding: "utf8" });
    assert.equal(probe.status, 0, probe.stderr);
    assert.match(probe.stdout, /sample_rate=24000/);
    assert.match(probe.stdout, /channels=1/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("WAV output copies the mixed master when music is present", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-wav-output-test-"));
  const masterPath = path.join(temporary, "master.wav"); const wavPath = path.join(temporary, "output.wav");
  const mixedMaster = Buffer.from("mixed master bytes");
  fs.writeFileSync(masterPath, mixedMaster);
  try {
    writeWavOutput({ masterPath, wavPath, masterPcm: Buffer.alloc(960), mixed: true });
    assert.deepEqual(fs.readFileSync(wavPath), mixedMaster);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("stitch fade tapers complete PCM segments to silence", () => {
  const pcm = Buffer.alloc(960);
  for (let offset = 0; offset < pcm.length; offset += 2) pcm.writeInt16LE(20_000, offset);
  const faded = fadeSegmentPcm(pcm, 8);
  assert.equal(faded.readInt16LE(0), 0);
  assert.equal(faded.readInt16LE(faded.length - 2), 0);
  assert.equal(pcm.readInt16LE(0), 20_000);
});

test("opening segment keeps its first rendered sample after the playback lead-in", () => {
  const pcm = Buffer.alloc(960);
  for (let offset = 0; offset < pcm.length; offset += 2) pcm.writeInt16LE(20_000, offset);
  const faded = fadeSegmentPcm(pcm, 8, { fadeIn: false, fadeOut: true });
  assert.equal(faded.readInt16LE(0), 20_000);
  assert.equal(faded.readInt16LE(faded.length - 2), 0);
});

test("stitch analysis reports an abrupt un-faded PCM cut", () => {
  const pcm = Buffer.alloc(960);
  pcm.writeInt16LE(32_000, 480);
  const result = analyzeStitchBoundaries(pcm, [{ segment_index: 1, start_frame: 240, end_frame: 480 }], 1);
  assert.equal(result.warnings.length > 0, true);
});

test("post-assembly audio analysis accepts a valid stitched WAV with metadata chunks", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-audio-quality-test-"));
  const masterPath = path.join(temporary, "candidate.master.wav");
  const outputPath = path.join(temporary, "candidate.mp3");
  const manifestPath = path.join(temporary, "candidate.render-manifest.json");
  const reportPath = path.join(temporary, "candidate.audio-quality.json");
  const pcm = fadeSegmentPcm(Buffer.alloc(960), 8);
  fs.writeFileSync(masterPath, wavWithListMetadata(pcm));
  try {
    const encoded = childProcess.spawnSync("ffmpeg", ["-v", "error", "-y", "-i", masterPath, "-ar", "24000", "-ac", "1", "-b:a", "160k", outputPath], { encoding: "utf8" });
    assert.equal(encoded.status, 0, encoded.stderr);
    const report = analyzeRenderedAudio({ manifestPath, masterPath, outputPath, stitchBoundaries: [{ segment_index: 1, start_frame: 120, end_frame: 480 }], reportPath });
    assert.equal(report.result, "passed");
    assert.equal(JSON.parse(fs.readFileSync(reportPath, "utf8")).result, "passed");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("post-assembly audio analysis rejects a clipped master WAV", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-audio-quality-test-"));
  const masterPath = path.join(temporary, "candidate.master.wav");
  const outputPath = path.join(temporary, "candidate.mp3");
  const manifestPath = path.join(temporary, "candidate.render-manifest.json");
  const reportPath = path.join(temporary, "candidate.audio-quality.json");
  const pcm = fadeSegmentPcm(Buffer.alloc(960), 8);
  pcm.writeInt16LE(32_767, 480);
  fs.writeFileSync(masterPath, wavForTest(pcm));
  try {
    const encoded = childProcess.spawnSync("ffmpeg", ["-v", "error", "-y", "-i", masterPath, "-ar", "24000", "-ac", "1", "-b:a", "160k", outputPath], { encoding: "utf8" });
    assert.equal(encoded.status, 0, encoded.stderr);
    const report = analyzeRenderedAudio({ manifestPath, masterPath, outputPath, stitchBoundaries: [{ segment_index: 1, start_frame: 120, end_frame: 480 }], reportPath });
    assert.equal(report.result, "failed");
    assert.match(report.errors.join("\n"), /clipped PCM sample/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("invalid claim mappings stop before source fetch and LLM assessment", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-test-"));
  const sourcesPath = path.join(temporary, "sources.yaml");
  const claimsPath = path.join(temporary, "claim-inventory.yaml");
  const reportPath = path.join(temporary, "link-validation.yaml");
  fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n");
  fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [different-source]\n");
  fs.writeFileSync(path.join(temporary, "episode.yaml"), "production_contract_version: 2\nsource_verification: {}\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Notes\n", "utf8");
  fs.writeFileSync(path.join(temporary, "show-notes-manifest.yaml"), "links: []\n", "utf8");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--output", reportPath, "--require-llm"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Claim mapping failed/);
    assert.equal(fs.existsSync(reportPath), false);
    const attemptDirectory = path.join(temporary, ".validation-attempts");
    const attempts = fs.readdirSync(attemptDirectory);
    assert.equal(attempts.length, 1);
    assert.match(fs.readFileSync(path.join(attemptDirectory, attempts[0]), "utf8"), /results: \[\]/);
    assert.equal(fs.existsSync(validationInProgressPath(reportPath)), false);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
