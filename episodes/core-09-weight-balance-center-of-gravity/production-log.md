# Weight, Balance, and Center of Gravity — production log

## 2026-08-25 — package created

- Created from the standard episode template on `feature/core-09-weight-balance-center-of-gravity`.
- Status: planned.

## 2026-08-25 — initial source-led research and complete draft

- Completed by the requested current Sol drafting agent at high reasoning effort.
- Used FAA-S-ACS-6C PA.I.F, Performance and Limitations, as the lesson outline, with PA.II.B cargo securement as a practical supporting outcome.
- Used FAA-H-8083-25C Chapter 10 as the primary technical source and added only current 14 CFR § 91.9 to establish the approved-operating-limitation and current-manual boundary.
- Verified access to the official FAA PDFs and current eCFR page during research. The eCFR page reported Title 14 up to date through August 24, 2026.
- Completed a 14-source page-level ledger and reciprocal 33-claim inventory. PHAK entries were split by the page that supports each teaching boundary.
- Resolved the major teaching distinctions before drafting: weight versus CG, item weight versus moment, a sample method versus actual-aircraft data, a legal limit versus available performance margin, and total-weight improvement versus fuel-driven CG movement.
- Kept mechanic weighing procedures, percent-MAC computation, ballast installation, transport-operator programs, and detailed certification endpoints out of scope because they do not change the typical private-pilot planning decision taught here.
- Completed a 4,741-spoken-word first-review draft targeting approximately 40 minutes. The script uses the exact standard opening order, heading-matched Announcer transitions, restrained Instructor/Learner dialogue, source tags, and normal Markdown paragraphs without hard wrapping.
- Completed the research packet, episode and hosting metadata, show notes and manifest, QA checklist, audio manifest state, and narration derivative required for first review.
- No audio was rendered, staged, or published. No pull request was opened and no commit was created.
- Per the initial drafting assignment, neither deterministic external source validation nor OpenAI source-relevance validation was run. Both remain pre-render gates.
- Status: initial package complete; independent spoken-script review by a non-drafting agent, human editorial review, formal source validation, and all audio/release gates remain pending.

## 2026-08-26 — independent adversarial review resolved

- Received and resolved the independent non-drafting review of grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension.
- Corrected the calculation reasonableness check so the direction is defined relative to the airplane's current CG: adding an item aft of current CG moves CG aft, while adding it forward of current CG moves CG forward. Updated the reciprocal claim mapping and source tag for that passage.
- Reframed the § 91.9 passage around the operational decision to use the actual airplane's current approved limits and calculation method, with the regulation presented afterward as supporting evidence.
- Answered the Learner's green-dot question directly before explaining aircraft-profile, input, separate-limit, flight-phase, and performance checks.
- Removed the unexplained zero-fuel-weight reference and bounded all additional loading limits to those named in the actual airplane's approved data.
- Replaced “full seats” with the unambiguous condition that every seat is occupied, and clarified the forward-CG passage as a stronger nose-down tendency and greater effort to raise the nose.
- Reconciled the planned section timing and `42:00` Outro with an approximately 42-minute target, within the 30–45 minute episode window.
- Regenerated `narration.md` only from the finalized source-tagged master script. The revised narration contains 4,782 spoken words.
- Local structural checks passed: 14 sources and 33 claims remain reciprocally mapped; all 14 show-note links match the manifest; every claim section exists; the opening order and Announcer transitions remain correct; the narration derivative is exact; and the recorded word count and runtime target agree with the current script.
- `npm test` passed all 71 repository tests. Whitespace and `git diff --check` checks also passed.
- Human editorial review, formal deterministic and LLM source-relevance validation, and all audio and release gates remain pending. No audio was rendered.

## 2026-08-26 — first-listen calculation and terminology refinement

- Preserved the user's edits to the seesaw example, fuel-use explanation, and loading-correction options while making the requested surrounding refinements.
- Added short first-use orientations for arm, moment, and the CG envelope, with an explicit signpost to their fuller explanations later in the lesson.
- Strengthened the seesaw-and-fulcrum mental picture so a first-time listener can hear how unchanged weight creates a larger turning effect when moved farther from the fulcrum.
- Expanded the computational walkthrough into distinct row-entry, weight-total, and moment-total steps. Explained that a moment index is the same moment expressed on a smaller fixed scale, and added an exact spoken pointer to the FAA's sample computational worksheet on PHAK page 10-7.
- Added the new moment-index claim to the reciprocal source ledger, claim inventory, and show-notes manifest. Updated the existing visual-aid link label so it exactly matches the spoken pointer.
- Removed the distracting total-weight observation and replaced vague references to generic approved information with the POH, AFM, loading data, or operating limits that answer the particular planning question.
- Replaced broad limiting-condition language with the typical private-pilot checks taught here: ramp, takeoff, and landing weights; the CG envelope; seat and baggage limits; a planned tank-change point when directed by the POH or AFM; and a new loading calculation when occupants or baggage change between legs.
- Normalized spoken acronyms and initialisms to ordinary text, including POH, AFM, CG, PHAK, FAA, ACS, and CFI, for the shared renderer's pronunciation handling.
- Regenerated `narration.md` only from the finalized source-tagged master script. The refined narration contains 5,184 spoken words, and the 42-minute target remains within the intended 30–45 minute scope.
- Local structural checks passed: 14 sources and 34 claims map reciprocally; all 14 listener-facing links match the show-notes manifest; every claimed script section exists; opening order and Announcer transitions are correct; the narration derivative is exact; and the recorded word count and runtime target match the current script. The checks also found no hard-wrapped spoken paragraphs, spaced initialisms, requested obsolete phrases, trailing whitespace, or diff whitespace errors.
- `npm test` passed all 71 repository tests, and all six YAML package files parsed successfully.
- No audio was rendered, no external source-relevance validation was run, and no commit or pull request was created.

## 2026-08-26 — source-relevance findings resolved in draft

- Narrowed eight claims and their script passages to the exact evidence identified in the failed source-relevance report while preserving the ACS-first lesson structure and prior user edits.
- Replaced the broad weight-versus-CG margin explanation with the PHAK's supported distinction: excess weight compromises structural integrity and performance, while CG outside limits creates control difficulty.
- Limited the equipment-change statement to extra radios or instruments, repairs, and modifications affecting aircraft weight. Separated that statement from the PHAK's supported recordkeeping guidance that aircraft changes be recorded and the equipment list updated as appropriate.
- Narrowed the aircraft-data foundation to current, accurate weight-and-balance information and records, AFM charts or graphs, and manufacturer loading procedures.
- Removed the unsupported forward-CG “stronger nose-down tendency” characterization while retaining the supported higher-control-force, nose-raising, and flare discussion.
- Limited the moment-index explanation to the PHAK's stated simplification by division by 100, 1,000, or 10,000. Removed the unsupported scale-consistency rule.
- Limited the method comparison to the PHAK's supported statement that the graph method follows computational steps except that graphs supply moments. Tables are identified only as a possible manufacturer-provided method, without claiming procedural equivalence.
- Reframed the addition/removal reasonableness check around recalculation and the PHAK's exact aft-baggage example; removed the unsupported general forward-added-item rule.
- Reframed fuel burn around reduced tank weight, the PHAK observation that tanks in most small aircraft are near CG and CG generally changes little, and the practical requirement to check the actual airplane's planned fuel conditions. Removed generic directional claims based on tank location.
- Updated the source-led research chain and relevance excerpts to match those narrowed boundaries. Show-note URLs, labels, and claim mappings did not require changes.
- Regenerated `narration.md` only from the revised master script. The narration contains 4,979 spoken words, and the 42-minute target remains within the intended 30–45 minute scope.
- Local dry validation passed the input shape and reciprocal mappings for 14 sources, 34 claims, and 14 show-note links without making network or API requests. Structural checks confirmed the narration derivative, recorded word count, opening order, Announcer transitions, claim section references, paragraph formatting, and preservation of the user's seesaw and fuel-consumption edits.
- `npm test` passed all 71 repository tests, and all six YAML package files parsed successfully.
- A fresh external source-relevance run remains required before rendering. No external validation, audio rendering, commit, or pull request was performed during this revision.

## 2026-08-26 — script approved

- The user accepted the revised script after changing the final moment-scaling wording to “scaled moment.” The reciprocal claim now uses that same listener-facing terminology.
- Marked the package as `script_approved` at version `0.1.3` and completed the human editorial gate.
- Regenerated `narration.md` from the accepted `master-script.md`; the source-tagged master remains the only editable script source of truth.
- The previous source-relevance report predates this accepted wording change and cannot be used as an attestation for this package. A fresh deterministic and LLM source-relevance validation remains required before rendering.
- No audio was rendered, staged, or published.

## 2026-08-26 — source-relevance validation passed

- Ran the deterministic FAA/eCFR source and show-notes validation plus the required OpenAI source-relevance review against the accepted source package. Final run ID: `ed1a4a45-24eb-49b6-900c-50460031b712`; report timestamp: 2026-08-26T17:06:29.232Z; review model: `gpt-5.6-terra`.
- All 14 source citations and 14 listener-facing show-note links resolved successfully. All 34 mapped claims, citation locators, and claim-to-source relevance assessments were supported.
- Tightened the evidence package during review: narrowed several claim statements to their cited PHAK boundaries, corrected the printed ACS page locators, and changed the spoken scope from “many airplanes” to the PHAK-supported “many modern aircraft.” The user approved that final spoken refinement before this passing run.
- `link-validation.yaml` records the exact hashes of the sources, claim inventory, show notes, and show-notes manifest that were reviewed.
- Marked the source-relevance gate complete at version `0.1.4`. Audio rendering, listening QA, and later release gates remain pending; no audio was rendered, staged, or published.

## 2026-08-26 — opening and pronunciation QA render

- Rendered reusable source-hash-bound segments into the local QA work directory `audio-artifacts/core-09-qa-pronunciation-20260826T170700Z.segments`.
- Assembled the standard five-segment opening preview with the configured music bed, plus two focused pronunciation samples: segment 7 exercises POH, AFM, and CG; segment 14 exercises PHAK and CG.
- Automated post-assembly audio-quality analysis passed for all three local MP3 previews. Human listening QA, including confirmation that the required notice is clearly heard and the initialisms sound natural, remains pending.
- Audio artifacts remain local and are not tracked in Git.

## 2026-08-26 — QA render correction

- In response to listening feedback, refined the Announcer voice instruction to use natural emphasis and not over-stress individual words.
- Added a renderer-only pronunciation transform that supplies `envelope` to the voice model as `en-vuh-lope`; the published script remains unchanged. Added a regression test and documented the transform alongside the existing initialism guidance.
- Re-rendered the five-segment opening preview and segment 7, which exercises POH, AFM, CG, and the corrected envelope pronunciation, into `audio-artifacts/core-09-qa-correction-20260826T171100Z.segments`.
- Automated post-assembly audio-quality analysis passed for both corrected local MP3 previews. Human listening confirmation remains pending.

## 2026-08-26 — opening QA accepted

- The corrected five-segment opening preview and the focused POH, AFM, CG, and envelope-pronunciation sample were listened to and accepted.
- The required artificial-intelligence-assisted production notice was clearly heard. The opening-preview and grouped-initialism QA gates are complete.
- Full-episode rendering, script-aligned listening QA, chapter review, and release gates remain pending.

## 2026-08-26 — full candidate rendered

- Rendered the complete 59-segment Core 09 narration with OpenAI Realtime `gpt-realtime-2.1`, using Marin as Instructor, Cedar as Learner, and Ballad as Announcer. Reused the accepted opening-preview segments and corrected POH/AFM/CG/envelope segment where their render inputs matched.
- Assembled local candidate `audio-artifacts/core-09-20260826T171100Z.mp3`: 1,971.29 seconds (32:51), 24 kHz mono MP3, SHA-256 `8bd8c57541eff538732591db3bdffafc99be830e37cc46130cacd8b2382183d7`.
- Automated audio-quality analysis passed decode, duration, clipping, and 58 stitched-boundary checks. The MP3 contains 17 embedded ID3 chapters, and `ffprobe` verified them. The hash-bound chapter-review page was generated locally.
- The renderer reported an estimated API cost of $2.771447. Generated audio and render artifacts remain local and Git-ignored.
- Full script-aligned listening QA and manual chapter review remain pending.

## 2026-08-26 — pronunciation-corrected candidate rebuilt

- Listening feedback found that the prior candidate's hyphenated letter substitutions created audible pauses and tonal changes, PHAK could be heard as “pee-ah hack,” and the phonetic spelling for envelope could produce verb stress. The shared renderer now preserves familiar initialisms in the spoken text, sends PHAK as “pee hack,” and provides a silent noun-stress instruction for envelope.
- Rebuilt the full candidate in `audio-artifacts/core-09-rebuild-20260826T190729Z.segments`. The renderer compared every prior sidecar's render-input SHA-256 with the current model input, re-rendered the 31 changed segments, and reused the other 28 segments only when their exact inputs matched.
- Assembled local candidate `audio-artifacts/core-09-20260826T190729Z.mp3`: 1,960.29 seconds (32:40), 24 kHz mono MP3, SHA-256 `21c5439c952706fe58d55b5d4f280d8b0d24e43734c720791d665cb6171666f6`.
- Automated audio-quality analysis passed decode, duration, clipping, and 58 stitched-boundary checks. The MP3 contains 17 embedded ID3 chapters, and `ffprobe` verified them. The hash-bound chapter-review page was generated locally.
- The final render manifest's all-segment usage estimate is $2.751833. Re-rendered segments account for an incremental usage-derived estimate of $2.266990. Generated audio and render artifacts remain local and Git-ignored.
- The earlier 17:11 candidate is superseded. Full script-aligned listening QA and manual chapter review remain pending on this rebuilt candidate.

## 2026-08-26 — final-segment synthesis correction

- Listening QA found a duplicated word in segment 58: the approved script says “Practice changing one input at a time,” but the candidate was heard as “one put input.” The script was verified unchanged and correct.
- Re-rendered segment 58 only. Its focused QA sample was listened to and accepted before assembly.
- Reassembled local candidate `audio-artifacts/core-09-20260826T194604Z.mp3`: 1,962.69 seconds (32:42), 24 kHz mono MP3, SHA-256 `a97a490f3a39467fb18b5240c7ee8f00982eea4c76446c020a9bee2488ede1b3`.
- Automated audio-quality analysis passed decode, duration, clipping, and 58 stitched-boundary checks. The MP3 contains 17 embedded ID3 chapters, and `ffprobe` verified them. The hash-bound chapter-review page was generated locally.
- The correction's usage-derived estimate is $0.059276. The prior 19:07 candidate is superseded. Full script-aligned listening QA and manual chapter review remain pending on this candidate.
