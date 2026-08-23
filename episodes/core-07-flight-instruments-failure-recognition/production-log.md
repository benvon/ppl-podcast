# Flight Instruments and Failure Recognition — production log

## 2026-08-21 — initial FAA research and draft

- Used the current Sol model at high reasoning effort for the initial FAA research pass and complete first lesson draft.
- Verified from official FAA indexes that FAA-S-ACS-6C remains the current Private Pilot for Airplane Category standard and FAA-H-8083-25C remains current.
- Reviewed the October 2025 PHAK MOSAIC addendum and confirmed that it does not amend Chapter 8.
- Built a page-specific source ledger from the current FAA Chapter 8 PDF and current Private Pilot ACS, with reciprocal mappings for all material claims.
- Organized failure recognition around sensed quantity, shared source, independent comparison, and the causal effect of trapped pressure or inadequate gyro power.
- Included no spoken show-note visual pointers in this initial draft; any later visual cue must receive a matching, page-specific FAA show-note link.
- Recorded 5,189 spoken words in the first complete source-mapped draft. Status: drafted for editorial review; not approved for rendering or release.
- Deterministic source validation passed for all 29 page-specific FAA source entries and all 49 reciprocal claim mappings; no show-notes manifest is configured in this initial package.
- The repository test suite passed all 50 tests, including claim-mapping, page-specific PDF extraction, production-notice structure, and renderer-gate coverage.
- A renderer dry run correctly stopped at the source-relevance gate because LLM relevance review remains required before rendering; no audio was requested or created.

## 2026-08-23 — focused editorial revision of instrument explanations

- Revised `A blocked static source changes the family` so the causal chain is explicit in ordinary language: several instruments can agree because they receive the same blocked-static input, and that agreement is not confirmation from a separate source. Consolidated the two adjacent aircraft-document reminders into one useful POH/AFM reference.
- Revised `Electronic displays still have source paths` to remove “approved reversion mode.” The replacement distinguishes a dark display or its power path from live sensor and computer data that continues to respond on another screen. Checked the wording against the current official FAA-H-8083-25C Chapter 8 PDF, printed pp. 8-12–8-14.
- Renamed and substantially expanded `Magnetic-compass design and errors`. The section now begins with the magnets, fluid-damped card and float, pendulous mounting, and the downward slope of Earth’s field in the Northern Hemisphere; it then distinguishes acceleration error during an airspeed change on east or west from turning error during a bank toward north or south. Inertia is attributed only to the acceleration/deceleration explanation supported by the PHAK. A-N-D-S and the northerly/southerly rollout aids now follow the physical model. Learner turns were reordered to ask for the distinction before summarizing the comparison conditions.
- Renamed `Cross-check the story, not the loudest gauge` to `Cross-check by source and failure path`, and replaced the compass section’s “Independence does not mean perfection” conclusion with the specific magnetic-compass and free-gyro sensing mechanisms and limitations. Updated `Retrieval review` to preserve the heading and hemisphere conditions for both compass motion errors.
- Retimed `Electronic displays still have source paths`, `Gyroscopes: stability needs power`, `What each gyro can and cannot tell you`, `Magnetic-compass design and errors`, `Cross-check by source and failure path`, `Retrieval review`, and `Outro` after the expansion. Retained the existing editorial cleanups in `A blocked pitot source changes one instrument` and the checklist sentence in the renamed cross-check section.
- Added source entry `phak-compass-dip-model` for PHAK printed pp. 8-25–8-26 and claim `compass-dip-physical-model`. Revised the acceleration, turning, and condition-dependent compass claims; removed the page 8-27 vertical-card source from the conventional turning-error claim; and remapped claim section identifiers to the two descriptive headings. The ledger now contains 30 official FAA source entries and 50 reciprocal claims.
- Updated the research packet’s compass source map, misconception treatment, lesson architecture, editorial risks, and runtime record. The revised script contains 5,533 spoken words, a net increase of 344 from the 5,189-word initial draft, with a target runtime of approximately 46–48 minutes.
- Validation: the downloaded official Chapter 8 PDF matched the recorded SHA-256 `9117a43d144ea04eec44fc456a6a8d00934fba5e7b4a34431150f82e62deef9b`; deterministic source validation reported all 30 links `OK` and accepted all reciprocal source/claim mappings; `npm test` passed all 50 tests; the pre-commit disclosure and secret check passed; and `git diff --check` passed.
- Per editorial direction, no OpenAI source-relevance review or audio render was run. Status remains an editorial draft requiring source-relevance review before rendering.

## 2026-08-23 — script approval and pre-render QA started

- Editorial approval received for version 0.1.2 of the source-mapped script. Updated the episode record to `script_approved_pre_render`, aligned the word count (5,565) and target runtime (47 minutes), and generated the narration derivative from the approved master script.
- Created `qa-checklist.md`. Deterministic source mapping/link validation and script structure are complete; LLM source-relevance review, audio rendering, listening QA, chapter review, publication-day link validation, and hosting handoff remain open.

## 2026-08-23 — source-relevance review completed

- Ran the required `--require-llm` claim-level source-relevance review through the project environment. The final recorded review assessed all 30 official FAA sources and all 50 reciprocal claim mappings with the current `gpt-5.6-terra` review model: 21 source-level findings support and 9 partially support their mapped claims. No source, locator, or individual claim was classified as unsupported or insufficient evidence.
- Corrected two FAA PDF locators discovered during the review: alternate-static effects now cite Chapter 8 PDF page 3 (printed p. 8-3), and the dip/pendulous-compass explanation now cites PDF page 26 (printed p. 8-26). Those are the pages containing the cited effects rather than preceding-page introductions.
- Narrowed several manifest-only claim descriptions so each cited page supports exactly what the ledger attributes to it. The teaching sections retain their explanatory context, while the formal claims now track the FAA page-specific evidence without asking one excerpt to prove a broader inference.
- Status is now `source_relevance_review_complete`. The remaining pre-render gates are audio production and listening QA.

## 2026-08-23 — PR process-finding corrections

- Updated the two ACS claim records that still referenced the retired `cross-check-the-story-not-the-loudest-gauge` section identifier. Both now map to the current `cross-check-by-source-and-failure-path` section.
- Removed the completed LLM source-relevance review from `release_gates_remaining` and aligned the approved master script’s production-status line with the completed review record. The remaining gates are now limited to the work that is actually outstanding.

## 2026-08-23 — version 0.1.3 low-airspeed control-response correction

- Corrected the blocked-pitot recognition example after listener QA identified a reversed control response. The learner now describes the temptation to lower the nose to regain a genuinely low airspeed, not to increase pitch. The preceding instructor sentence was aligned with the same correction.
- Added the page-specific Airplane Flying Handbook energy-management source that explains the underlying trade: with no initial throttle change, down elevator trades altitude for airspeed and up elevator trades airspeed for altitude. This is an explanation of why the indication could tempt a pilot toward a real change, not a substitute for the aircraft-specific failure procedure.
- Bumped the approved script to version 0.1.3. The new source and claim require deterministic and LLM source-relevance validation before the corrected segments can be rendered; the prior full candidate must not be treated as script-aligned until those segments are replaced.

## 2026-08-23 — version 0.1.3 source-relevance review completed

- Deterministic and `--require-llm` validation passed for all 31 FAA sources and 51 reciprocal claims. The final claim-level review recorded 22 source-level `supports` findings and 9 `partially_supports` findings; no source, locator, or individual claim was unsupported or lacked evidence.
- Restored the `source_relevance_review_complete` pre-render status. Segments 18–21 require refresh because the renderer’s silent continuity context includes the two corrected spoken turns in segments 19–20.

## 2026-08-23 — version 0.1.3 targeted audio refresh

- Reused the accepted, unchanged opening-preview segments and all unaffected full-render segments. The renderer refreshed only segments 19–21: the corrected instructor explanation, the learner’s corrected low-airspeed response, and the next instructor turn whose silent continuity context changed. Segment 18 was verified reusable because the relevant next-line context was unchanged.
- Reassembled the complete 64-segment candidate and a focused segments 18–21 listening excerpt. Automated WAV/MP3 decode, format, clipping, and stitch-boundary checks passed; the full candidate retains 15 embedded MP3 chapters. Full script-aligned listening QA remains required before release.
