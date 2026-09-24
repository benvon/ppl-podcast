# Private-Pilot Privileges, Limitations, and Currency — production log

This is optional explanatory context, not a production-state or audit record. Use `episode.yaml` and the named structured validation and artifact reports for authoritative state, approvals, timestamps, hashes, and run identities. The QA checklist records fixed `qa-id` human attestations.

## 2026-09-23 — source-led first draft

- Created from the standard episode template.
- Built the ACS Pilot Qualifications and Part 61 source ledger, atomic claim inventory, scenario trace, source-tagged master script, narration derivative, show notes, and source-link mapping.
- The first draft follows Elena's preflight decision from documents and aircraft choice through medical qualification, flight review, passenger recency, expense sharing, and proficiency.
- Independent spoken-script review prompted a simpler BasicMed branch, a single before-sunset landing cutoff throughout the scenario and retrieval, and fuller conditional wording in the review recap. Those revisions are reflected in the current script and research packet.
- The first two-assessment source review found that the fetched eCFR excerpt stopped before the third-class medical duration table. The duration claim now uses the FAA Guide for Aviation Medical Examiners item 3, with matching source ledger, script attribution, and show-note links; renewed independent binding and source review are required for the changed script.
- The second two-assessment source review identified an overbroad general-passenger recency claim. The claim now names Elena's non-tailwheel airplane while the teaching keeps the tailwheel full-stop caveat. BasicMed wording now points to the listed medical eligibility conditions in the regulation.
- The independent spoken-script review is SHA-bound to the current draft. The final two-assessment source-relevance review supports all 15 sources and their mapped claims and tagged passages. Human editorial approval is the next content gate; audio has not been rendered. The current production state is recorded in `episode.yaml`.

## 2026-09-23 — source-review model migration design note

- Goal: use GPT-6 Sol for the formal source-relevance assessments while preserving the two-pass source-support contract.
- Inputs and output: the existing source ledger, claim inventory, tagged master script, show notes, and authorization are inputs; `link-validation.yaml` remains the report and `episode.yaml` remains the production-state authority.
- External effect and stale-input rule: each authorized run sends the same bounded excerpts, claims, and passages to the OpenAI Responses API; changed source, claim, script, or show-note inputs require a fresh report under the existing identity checks.
- Normal and failure behavior: the selected model is recorded in the report on success; an API or review failure leaves the prior clean report unpromoted and records the failed attempt through the existing path.

## 2026-09-24 — editorial teaching revision

- Reworked the ACS framing and the pilot-document, airplane, medical, flight-review, passenger-recency, return-time, expense-sharing, and proficiency sections around Elena's decisions and Jonah's proposed trip. The regulatory conditions that determine this trip remain spoken; source links and broader BasicMed and exception details remain in the show notes.
- Shortened Retrieval review to test the decision sequence and key conditions without replaying the full teaching paragraphs. Added a two-sentence Announcer closing thought immediately before the unchanged standard Outro.
- Regenerated `narration.md`, aligned the 2,838-word script with an estimated 19–21-minute runtime and section times, and marked current-script source-review claims in show notes pending. The prior independent review and two-pass source review applied to the previous script bytes; the current editorial revision requires new checks before human approval or audio.

## 2026-09-24 — independent spoken-review refinements

- Added the missing `calendar months` unit to the BasicMed Retrieval answer, stated the count of three full-stop landings explicitly, and clarified the third-class medical date check.
- Reduced the Announcer closing thought to one orienting sentence immediately before the unchanged standard Outro. The substantive trip decisions remain in the Instructor and Learner teaching and Retrieval review.
- The show-notes table and Correction status now point to `episode.yaml` for the current source-review result, so they describe the pending review and any later completed review without a status-only edit to the review input.

## 2026-09-24 — clean draft for human editorial review

- A separate agent completed the first-listen review, identified the incomplete BasicMed time unit and an overlong Announcer recap, then verified both revisions against the final `master-script.md` SHA-256 `590108491f6abb526287cef33e3457fc4ad4b91c1acbb25b718e6f19f8d176a2`. `episode.yaml` now binds that independent review to the final script.
- With the user's 2026-09-24 authorization recorded in the QA checklist and validation report, `sources:validate --require-llm` completed two GPT-6 Sol assessments for each of 15 source entries. Both passes supported every entry; all source links, claim mappings, script tags, and show-notes mappings passed. `link-validation.yaml` records the current formal review and `episode.yaml` records source relevance complete.
- The script and derived narration are ready for human editorial review. Editorial approval and audio work remain pending.

## 2026-09-24 — editorial removal of closing summary and renewed review

- The editor removed the extra Announcer summary, leaving the Retrieval review to lead directly into the standard Outro. Its heading moved to `[19:10]` so the chapter timing has no empty gap. The spoken word count is now 2,814. The current master-script SHA-256 is `623908f5cbe5d3e37192bdd272e529977c2b056324b0e6ef0b6bd8748e6235b8`.
- Reset the script-review state, regenerated `narration.md`, and obtained a new independent full-script first-listen pass on those exact script bytes. Local claim, source-tag, and show-note mappings passed; `npm run tooling:standards` passed; and `npm test` passed all 164 tests.
- With the editor's current-turn OpenAI API authorization recorded in the QA checklist and report, `sources:validate --require-llm` completed two GPT-6 Sol assessments for each of 15 source entries. Both passes supported every entry, and the formal validation report passed. `episode.yaml` records source relevance complete for the current script. Human editorial approval remains pending; no audio was rendered.

## 2026-09-24 — revision numbering catch-up

- Set the current draft revision to `0.1.3` in the visible script header and synchronized the episode, show-notes, and hosting version fields. The independent reviewer verified that no spoken prose, claims, or source tags changed; the narration derivative is byte-for-byte unchanged.
- The version-only script and show-notes edits changed the current source-review input identity under the existing contract. `episode.yaml` owns the pending review state until a newly authorized review is run.

## 2026-09-24 — source review and opening audio preview

- The editor authorized an OpenAI source-relevance rerun and an opening QA audio sample from the current 0.1.3 draft. The two-pass GPT-6 Sol review supported all 15 source entries and passed; the structured report and `episode.yaml` hold the review evidence. The editor's direction to create the sample after that pass was treated as approval to render the current script for this QA step, and the script-review helper bound that approval to the current master-script bytes.
- Generated the first five voice segments with the established Realtime voices and assembled a fresh preview MP3 at `audio-artifacts/core-21-20260924T174606Z.preview-001-005.mp3`. The preview is 184.370 seconds. Automated audio analysis passed with no clipped samples or stitch warnings, and `ffprobe` found the Opening at 0 seconds followed by the Disclaimer at 23 seconds.
- Human listening remains needed to judge notice pronunciation, voice delivery, pacing, joins, and any synthesis errors before full-episode rendering. The preview is not a full candidate and does not complete audio, chapter, or publication QA.

## 2026-09-24 — opening sample accepted

- The editor accepted the five-segment opening QA sample. The QA checklist records the opening preview and notice listening checks as complete; full-candidate listening, audio integrity, and chapter review remain open.

## 2026-09-24 — full audio candidate for listening QA

- With current-turn OpenAI authorization, rendered the remaining voice segments into the preview's work directory. The accepted opening segments were retained, and full assembly verified all 63 segment inputs against the approved narration and render settings.
- Assembled `audio-artifacts/core-21-20260924T175550Z.mp3` as a new 18:40 full candidate with the configured music bed and 14 embedded chapters. Automated decoding, clipping, stitch, and embedded-chapter checks passed; the MP3-linked chapter review page is recorded in `audio-manifest.yaml`.
- The current candidate is awaiting complete script-aligned human listening and manual chapter placement review. The technical checks do not establish those human QA results.

## 2026-09-24 — full audio and chapter QA accepted

- The editor accepted full-episode audio QA and confirmed the chapter markers for the current MP3. Its SHA-256 still matches the candidate and chapter records. The render manifest records the passing `ffprobe` chapter check.
- The QA checklist records the human audio and chapter attestations. Publication-day link checks and hosting handoff remain open in `episode.yaml`.
- The draft-package shape check passed for this candidate. It is a package consistency check, not final pre-hosting validation.

## 2026-09-24 — publication-day links and metadata

- Ran the deterministic publication-day check across the current source and show-notes links. The result is recorded in `publication-link-validation.yaml`; it does not replace the formal source-relevance report.
- Corrected the show-notes correction-status line to reflect completed editorial approval and aligned the hosting duration with the accepted audio. The public show-notes edit changes the formal review's input identity, so a renewed source-relevance review is required before publication preparation.
- With the editor's authorization recorded in the QA checklist and report, the renewed two-pass source review passed. One assessment recorded an editorial, non-material note about certificate alternatives in the pilot-documents claim; the current rental-aircraft decision remains supported. The draft-package shape check passed after the metadata correction.

## 2026-09-24 — review-scope correction before staging

- Inspection of the first sealed handoff found that public show notes referred readers to a source-review status absent from the hosting `episode.yaml`. Corrected the public review column and correction-status paragraph before staging. The earlier sealed directory remains unused; a fresh sealed handoff is required.
- Goal for the tooling change: prevent show-notes status or link edits from demanding a new OpenAI source assessment when tagged narration and claims are unchanged. The formal review remains bound to spoken narration, source tags, source ledger, and claim inventory; its structured report remains `link-validation.yaml`. The publication-day deterministic report remains bound to the exact show notes, link manifest, sources, claims, and script. A changed relevant input makes its owning report stale; failure leaves the prior clean report unpromoted. The change creates no new outbound action or state record.
