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
