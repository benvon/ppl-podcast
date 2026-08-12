# Aeronautical Decision-Making and Risk Management — production log

## 2026-08-12 — research and script draft created

- Created the Episode 1 source ledger, claim inventory, research packet, show notes, and master script on branch `agent/core-01-adm-script`.
- Used 14 CFR § 61.105, the Private Airplane ACS (FAA-S-ACS-6C), and PHAK Chapter 2 (FAA-H-8083-25C) as the authoritative source set.
- Recorded direct FAA/eCFR links with section or PDF-page locators and a two-way claim-to-source map in `sources.yaml` and `claim-inventory.yaml`.
- Passed the offline source-validator check: 10 sources and 22 claims with valid citation shape and two-way mappings; no source fetch or LLM relevance review was run.
- Deliberately excluded aircraft-specific procedures, numerical personal-minimum recommendations, weather interpretation, medical-certification guidance, and legal advice.
- Status: editorial review pending. No audio has been rendered, and the required post-approval LLM relevance review has not run.

## 2026-08-12 — editorial refinement

- Reworked the opening and decision-outcome passages to use shorter, more purposeful sentences rather than coverage-driven lists.
- Defined the POH/AFM boundary at its first use and removed repeated generic references to approved aircraft documents.
- Introduced personal minimums before using them as a decision backstop; clarified that they are revisited as training and demonstrated proficiency develop, not relaxed under pressure during a flight.
- Removed repetitive disclaimer-like hedging while preserving the source tags and the required production notice.

## 2026-08-12 — post-approval source gate and opening preview

- Ran the live source-link and LLM claim-relevance gate against 10 sources and 23 claims; every link and mapped claim passed. The resulting record is `link-validation.yaml`.
- Added a narrowly scoped eCFR validator fallback: the listener-facing citation remains the exact § 61.105 page, while automation reads the matching official eCFR versioner endpoint because eCFR currently redirects automated requests to a Federal Register anti-bot interstitial.
- Rendered a 130.540-second opening preview of segments 1–5 with OpenAI Realtime `gpt-realtime-2.1`, Marin (Instructor), and Cedar (Learner). The artifact and lossless master are Git-ignored under `audio-artifacts/`.
- Verified the MP3 with `ffmpeg` decode and `ffprobe`: 24 kHz mono MP3 at 160 kbps. The usage-derived estimate is $0.187416, not an invoice.
- Status: opening-preview listener review pending; full render not yet started.

## 2026-08-12 — full candidate render

- Opening preview approved; resumed the locked Realtime segment session and rendered all 60 script segments with `gpt-realtime-2.1`, Marin (Instructor), and Cedar (Learner).
- Assembled `audio-artifacts/core-01-20260812T151200Z.mp3` plus its lossless master and render manifest. The candidate is 1,411.970 seconds (23:32), 24 kHz mono MP3 at 160 kbps, with SHA-256 `315aa49db597d2712266ed08412553cc7ffd54a7f3af3ff143fdd33bf0501902`.
- `ffmpeg` decode and `ffprobe` technical checks passed. The usage-derived estimate for the complete candidate is $2.032274, not an invoice.
- The candidate is intentionally blocked from release and hosting handoff: it is below the series 30-minute minimum. Expand the script, obtain approval for the revised content, then render a replacement candidate and complete human listening QA.

## 2026-08-12 — expansion draft for runtime target

- Expanded the script from 3,703 to 4,901 spoken words after the 23:32 candidate fell below the series minimum.
- Added applied PAVE practice, a personal-minimums training-plan discussion, and a second scenario decision point; the additions use the existing source ledger and tagged claim blocks.
- Recalculated review timestamps from the observed first-candidate speaking rate. The new draft is estimated at approximately 31 minutes, but that estimate must be confirmed by a replacement render.
- Status: `0.2.0` script revision pending user review. No source revalidation or new audio rendering has started for this revision.

## 2026-08-12 — v0.2 replacement candidate render

- Script version 0.2.0 approved. Re-ran the live source-link and LLM claim-relevance gate against 10 sources and 23 claims; every link and mapped claim passed. The current record is `link-validation.yaml`.
- Rendered all 79 segments with OpenAI Realtime `gpt-realtime-2.1`, Marin (Instructor), and Cedar (Learner) in a new script-hash-locked work directory.
- Assembled `audio-artifacts/core-01-20260812T154500Z.mp3` plus its lossless master and render manifest. The candidate is 1,857.490 seconds (30:57), 24 kHz mono MP3 at 160 kbps, with SHA-256 `8891067ce38000ce11e2a64fd4257c6a2a5db337c954efc388b1ca958f2ef159`.
- `ffmpeg` decode and `ffprobe` technical checks passed. The usage-derived estimate is $2.678194, not an invoice.
- This candidate meets the runtime target. It remains blocked from public release and hosting handoff pending a full human listen, publication-day source verification, and hosting-workflow validation.

## 2026-08-12 — publication preparation

- Quick listening QA approved the v0.2 rendered candidate for publication preparation. This does not replace the complete start-to-finish release listen against the master script.
- Prepared `hosting-metadata.yaml` with the stable ID/GUID, listener-facing title and description, season and episode number, explicit flag, and confirmed `00:30:57` runtime. It intentionally leaves `published_at` unset: a real RFC3339 UTC publication time is required before the hosting workflow can create an immutable staged release.
- The external publisher (`ppl-postcast-hosting`) will compute and record the private staging key, public audio key, byte count, and SHA-256 from the local MP3. No audio has been uploaded, no hosting repository has been changed, and nothing has been published.

## 2026-08-12 — release authorization and final preflight

- The listener completed and approved a start-to-finish, script-aligned listen of the v0.2 candidate, including its technical terms, numbers, acronyms, and required front matter.
- Re-ran the publication-day live source-link and LLM claim-relevance gate at `2026-08-12T16:06:15Z`. All 10 source citations and all 23 mapped claims passed; the retained result is `link-validation.yaml`.
- Set the approved public-release timestamp to `2026-08-12T16:06:18Z`. The episode is now ready for private audio staging and public-deployment verification through `ppl-postcast-hosting`.
