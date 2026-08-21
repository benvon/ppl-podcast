# Fuel, Mixture, Carburetion, Oil, Cooling, and Electrical Systems — production log

## 2026-08-21 — publication-day validation and hosting handoff

- Re-ran LLM-assisted source and show-notes validation through `direnv` at
  `2026-08-21T14:34:40.468Z`. All 19 FAA sources, 41 mapped claims, and 26
  show-notes links passed deep-link, locator, mapping, and relevance checks.
- The user set the release timestamp to `2026-08-21T14:32:30Z`. Core 06 is
  ready for the hosting PR; staging and validating the immutable audio object
  is the remaining release gate.

## 2026-08-16 — package created

- Created from the standard episode template.
- Status: planned.

## 2026-08-18 — initial FAA research and draft

- Mapped the draft to 11 official FAA source entries and 38 material claims, with current-link and source-relevance review still required before rendering.
- Built the lesson around the connected flows of air, fuel, oil, cooling air, heat, and electrical current rather than a component list.
- Included fuel injection as a distinct fuel-metering system; it is less susceptible to evaporative icing but has different system characteristics and aircraft-specific procedures.
- Added seven labeled visual aids that exactly match the spoken pointers in the draft.
- Recorded 4,940 spoken words in the initial source-mapped draft. Status: drafted.

## 2026-08-18 — independent initial-research review

- Confirmed FAA-S-ACS-6C and FAA-H-8083-25C remain current; reviewed the October 2025 PHAK addendum and confirmed it does not amend Chapter 7.
- Corrected the fuel-quantity lesson: zero is calibrated to unusable fuel, while active FAA guidance treats the installed quantity indicators as primary fuel-remaining instruments.
- Added correct-fuel-grade coverage and the matching PHAK visual aid.
- Expanded carburetor heat from a passing reference into a cause-and-indication explanation.
- Reduced fuel injection to the requested brief distinction: some engines use it, and their approved procedures may differ.
- The deterministic source pass validated all 14 current FAA links, all 41 reciprocal claim mappings, and all 21 show-notes links; the LLM relevance review remains pending and must run before audio rendering.
- Tightened repeated caveats, retimed the draft, and recorded 4,678 spoken words. Status remains drafted pending source-relevance review and editorial approval.

## 2026-08-19 — systems-flow refinement

- Reframed the opening and ACS section around a gauge as evidence of an interconnected system, then renamed the close as a retrieval review.
- Expanded the throttle explanation as an adjustable induction-path restriction and clarified the pressure-and-airflow chain during an intake stroke.
- Expanded the carburetor-heat explanation to connect warmer, less-dense air with a richer fuel-to-air ratio when the mixture setting is unchanged.
- Clarified unusable fuel in terms of reliable delivery to the engine, renamed the electrical section, and reduced repeated references to Episode 5.
- Updated the two-way claim mapping for the throttle and carburetor-heat explanations and recorded 4,815 spoken words. The deterministic source pass revalidated all 14 FAA sources, 41 claims, and 21 show-notes links; source-relevance review remains pending before rendering.

## 2026-08-19 — script approval and pre-render QA started

- Script approved for source-relevance review and pre-render QA.
- Recorded completed QA checks for reciprocal claim mapping, claim classification, deep listener-facing citations, editorial review, and opening/disclaimer structure.
- Remaining pre-render gates: LLM source-relevance review, then the opening-preview listening check before a full candidate render.

## 2026-08-20 — source-relevance review completed

- Corrected the ACS PDF page offsets, the advisory-circular fuel-quantity page, and every multi-page Chapter 7 citation so each source record points to the exact page that supports its mapped claim.
- Expanded the source ledger to 19 page-specific FAA records while retaining 41 reciprocal claims; the show-notes manifest now has 26 matching deep links.
- Ran `sources:validate --require-llm` with the repository environment. All deep citations, FAA programmatic-copy attestations, claim mappings, show-notes mappings, page-locator assessments, and per-claim relevance assessments passed.
- Updated the shared validator to cache identical FAA document and attestation requests within a validation run, preventing intermittent FAA attestation failures caused by repeated identical requests. Added regression coverage.
- Remaining pre-render gate: render and listen to the opening preview.

## 2026-08-20 — candidate render and automated QA

- Reused the accepted opening-preview segments and rendered the remaining 62
  narration segments through `gpt-realtime-2.1`: Marin as Instructor, Cedar as
  Learner, and Ballad as Announcer.
- Assembled the candidate with the approved music mix: a 10-second intro lead,
  steady reduced level beneath Ballad, a 5-second full-level intro continuation
  and 0.5-second fade, then a 10-second full-level outro continuation and
  5-second fade.
- Candidate: `audio-artifacts/core-06-20260820T123756Z.mp3`; 31:00, 24 kHz
  mono, 160 kbps MP3, SHA-256
  `1234ab9c541362cfefb59e7ac6b43836d67c211a3f39f5cba724aa6ec75dd41d`.
  The lossless master, render manifest, audio-quality report, clickable chapter
  review, and resumable segment directory are Git-ignored and recorded in
  `audio-manifest.yaml`.
- Automated QA passed: WAV and MP3 decode, matching duration, 67 checked
  stitch boundaries without discontinuity warnings, zero clipped samples, and
  ffprobe validation of 15 embedded MP3 chapters. Full script-aligned listening
  QA and chapter review remain required.

## 2026-08-20 — candidate refresh after throttle wording edit

- Updated the approved throttle sentence in `master-script.md`, regenerated its
  narration derivative, and re-rendered only Instructor segment 12.
- Reassembled the full candidate from that replacement and all other reusable
  segments. The refreshed candidate is 31:00.49 with the SHA-256 recorded in
  `audio-manifest.yaml`; automated audio quality and the 15 embedded chapter
  markers passed again.

## 2026-08-21 — script-aligned listening QA accepted

- The user confirmed that the refreshed full candidate passes audio QA and
  matches the approved script.
- The required Disclaimer was heard and accepted in the opening preview; the
  final candidate has no remaining audible rendering or stitch issues.
- Candidate status is now `candidate_rendered_qa_approved`. Manual review of
  the embedded chapter markers, publication-day source validation, and hosting
  preparation remain before release.

## 2026-08-21 — chapter review accepted

- The user manually reviewed the 15 embedded MP3 chapter markers with the
  chapter-review page and confirmed they are correct.
- Audio production QA is complete. Publication-day source validation and
  hosting preparation remain before release.
