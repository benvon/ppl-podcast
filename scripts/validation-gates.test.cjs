"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { extractPdfPageText, fetchSource, validateClaimAssessments, validateClaimMappings, validateShowNotesMappings, validationTargetErrors, verifyProgrammaticFallback } = require("./validate-source-links.cjs");
const { deriveNarration } = require("./derive-narration.cjs");
const { REQUIRED_NOTICE, assertSourceRelevanceApproved, chapterFfmetadata, chapterMarkersFor, mixMusicBeds, musicCuePlan, musicVolumeExpression, parseScript, pauseBefore, settingsFor, spokenText, terminalMusicTailMilliseconds, validateFrontMatter, verifyMp3Chapters, writeMp3WithChapters, writeWavOutput } = require("./render_episode_realtime.cjs");
const { analyzeRenderedAudio, analyzeStitchBoundaries, fadeSegmentPcm } = require("./audio-quality.cjs");
const { formatTimestamp, parseArgs: parseChapterReviewArgs, renderReviewHtml } = require("./create-chapter-review.cjs");

function source(id, supportsClaims) {
  return { id, url: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html", locator: "Paragraph 1-1-1, p. 1-1-1", supports_claims: supportsClaims };
}

function wavForTest(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8); header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(24_000, 24); header.writeUInt32LE(48_000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

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
    episodeTitle: "core-05 chapter review",
    chapters: [{ index: 1, title: "Lift < Drag", start: 74, end: 120 }],
  });
  assert.equal(formatTimestamp(74), "1:14");
  assert.match(html, /data-start="74"/);
  assert.match(html, /Lift &lt; Drag/);
  assert.match(html, /This page reads the chapters embedded in the MP3 itself/);
});

test("chapter review accepts its manifest argument", () => {
  assert.deepEqual(parseChapterReviewArgs(["--manifest", "audio-artifacts/example.render-manifest.json"]), { manifest: "audio-artifacts/example.render-manifest.json" });
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

test("claim mapping rejects source-side claims that do not declare the source", () => {
  const result = validateClaimMappings(
    { sources: [source("aim-a", ["claim-a"]), source("aim-b", [])] },
    { claims: [{ id: "claim-a", sources: ["aim-b"] }] },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /source aim-a supports claim claim-a, but that claim does not declare the source/);
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

test("source validation permits legacy show notes when no manifest is configured", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-validator-test-"));
  const sourcesPath = path.join(temporary, "sources.yaml"); const claimsPath = path.join(temporary, "claims.yaml");
  fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n");
  fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [source-a]\n");
  fs.writeFileSync(path.join(temporary, "show-notes.md"), "# Existing episode notes\n\n[Source](https://example.invalid)\n");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--dry-run"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /show notes without a manifest \(not configured\)/);
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

test("production notice must begin immediately after the final opening segment", () => {
  const delayed = [
    { index: 1, section: "opening", text: "First opening sentence." },
    { index: 2, section: "opening", text: "Second opening sentence." },
    { index: 3, section: "objectives", text: "An intervening spoken section." },
    { index: 4, section: "required production notice", text: REQUIRED_NOTICE },
  ];
  assert.throws(() => validateFrontMatter(delayed), /immediately follow the final opening segment/);
  assert.doesNotThrow(() => validateFrontMatter([...delayed.slice(0, 2), { ...delayed[3], index: 3 }]));
});

test("production notice must be the first spoken text after the opening", () => {
  const interveningCopy = [
    { index: 1, section: "opening", text: "Today's topic." },
    { index: 2, section: "required production notice", text: "Before the notice, an unrelated message." },
    { index: 3, section: "required production notice", text: REQUIRED_NOTICE },
  ];
  assert.throws(() => validateFrontMatter(interveningCopy), /must begin immediately after the opening/);
});

test("realtime renderer accepts an Announcer turn", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-renderer-test-"));
  const scriptPath = path.join(temporary, "master-script.md");
  fs.writeFileSync(scriptPath, `# Test\n\n## Opening\n\n**INSTRUCTOR:**\n\nCold open.\n\n## Required production notice\n\n**INSTRUCTOR:**\n\n${REQUIRED_NOTICE}\n\n## Podcast introduction\n\n**ANNOUNCER:**\n\nWelcome to the podcast.\n`);
  try {
    assert.equal(parseScript(scriptPath, 240).at(-1).speaker, "ANNOUNCER");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("realtime renderer requires completed source-relevance review before rendering", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ppl-render-gate-test-"));
  const scriptPath = path.join(temporary, "narration.md");
  fs.writeFileSync(scriptPath, "# Test narration\n", "utf8");
  fs.writeFileSync(path.join(temporary, "episode.yaml"), "source_verification:\n  relevance_review: complete\n", "utf8");
  fs.writeFileSync(path.join(temporary, "link-validation.yaml"), "llm_requested: true\nclaim_mapping: { valid: true }\nshow_notes_mapping: { valid: true }\nresults: []\n", "utf8");
  try {
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /unresolved source-relevance findings/);
    fs.writeFileSync(path.join(temporary, "link-validation.yaml"), "llm_requested: true\nclaim_mapping: { valid: true }\nshow_notes_mapping: { valid: true }\nresults:\n  - citation_target: { valid: true }\n    link: { valid: true }\n    relevance:\n      status: assessed\n      assessment:\n        verdict: supports\n        locator_assessment: { verdict: supports }\n    claim_assessments: { valid: true }\nshow_notes_results: []\n", "utf8");
    assert.doesNotThrow(() => assertSourceRelevanceApproved(scriptPath));
    fs.writeFileSync(path.join(temporary, "episode.yaml"), "source_verification:\n  relevance_review: required_before_render\n", "utf8");
    assert.throws(() => assertSourceRelevanceApproved(scriptPath), /marked complete/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("realtime renderer expands approved abbreviations only in spoken input", () => {
  assert.equal(spokenText("The PHAK says AI-assisted production is reviewed."), "The pea hack says artificial intelligence-assisted production is reviewed.");
  assert.equal(spokenText("PHAK-like examples differ from PHAKS."), "pea hack-like examples differ from PHAKS.");
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

test("music assembly options do not invalidate reusable rendered segments", () => {
  const base = { model: "gpt-realtime-2.1", voices: { instructor: "marin", learner: "cedar", announcer: "ballad" }, stitchFadeMs: 8, maxWords: 240, continuityCharacters: 240, spacing: { leadInMs: 250, continuedTurnMs: 120, speakerChangeMs: 220, sectionChangeMs: 550 } };
  const noMusic = settingsFor({ ...base, music: null }, "script-hash");
  const withMusic = settingsFor({ ...base, music: { path: "assets/music/example.mp3", gainDb: -24 } }, "script-hash");
  assert.deepEqual(withMusic, noMusic);
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
  const claimsPath = path.join(temporary, "claims.yaml");
  const reportPath = path.join(temporary, "report.yaml");
  fs.writeFileSync(sourcesPath, "sources:\n  - id: source-a\n    url: https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html\n    locator: Paragraph 1-1-1, p. 1-1-1\n    supports_claims: [claim-a]\n");
  fs.writeFileSync(claimsPath, "claims:\n  - id: claim-a\n    sources: [different-source]\n");
  try {
    const result = childProcess.spawnSync(process.execPath, [path.join(__dirname, "validate-source-links.cjs"), "--sources", sourcesPath, "--claims", claimsPath, "--output", reportPath, "--require-llm"], { encoding: "utf8", timeout: 2_000 });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Claim mapping failed/);
    assert.match(fs.readFileSync(reportPath, "utf8"), /results: \[\]/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
