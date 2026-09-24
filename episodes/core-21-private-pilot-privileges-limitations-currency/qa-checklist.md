# Private-Pilot Privileges, Limitations, and Currency — QA checklist

## Content and sources

Current-turn export authorization was received on 2026-09-23. In response to the request to send unpublished source excerpts, claim text, and source-tagged spoken passages to OpenAI for the required two-assessment source-relevance check, the user replied, “Yes, authorize that export.” The review report must record this authorization with its run.

Current-turn GPT-6 Sol rerun authorization was received on 2026-09-23. In response to the request to rerun Core 21's two-pass review with GPT-6 Sol by sending its unpublished source excerpts, claims, and tagged spoken passages to OpenAI, the user replied, “Yes, authorize this rerun.” The rerun report must record this authorization with its run.

Current-turn source-review authorization was received on 2026-09-24. In response to the request to send Core 21's unpublished source excerpts, claim text, and source-tagged spoken passages to OpenAI for this two-assessment review, the user replied, “Yes, authorize this review.” The new report must record this authorization with its run.

For this revised draft on 2026-09-24, the user requested the whole automated review process and said, “You are authorized to call the OpenAI API.” This authorizes sending the unpublished source excerpts, claim text, and source-tagged spoken passages needed for Core 21's two-assessment source-relevance review. The new report must record this authorization with its run.

For the 0.1.3 review and opening QA audio sample on 2026-09-24, the user said, “You are approved to call the OpenAI API to do the source relevance review. Once that passes, create the QA Audio sample. You are approved to call the OpenAI API for that too.” This authorizes sending the unpublished source excerpts, claims, and source-tagged passages for the two-assessment review and the current narration for the requested audio sample.

For the publication-day show-notes correction on 2026-09-24, the user replied, “Yes, authorize the review” to the request to send Core 21's unpublished source excerpts, claims, and source-tagged passages to OpenAI for a fresh two-pass source-relevance review after correcting the stale editorial-status sentence.

Before staging on 2026-09-24, the sealed handoff showed that its public `episode.yaml` contains release metadata rather than the source-review state referenced by the show notes. The user replied, “Yes, authorize the review” to the request to rerun Core 21's two-pass source-relevance review after correcting that public status wording, sending the unpublished source excerpts, claims, and source-tagged passages to OpenAI.

After listening to the five-segment opening sample on 2026-09-24, the user said, “Audio QA sample is accepted.” In this turn, the user then replied, “Yes, authorize full render” to the request to send Core 21 v0.1.3's unpublished narration for the remaining voice segments to the OpenAI API. The approved five voice segments may be reused only if their recorded render inputs still match the current narration and settings.

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`. <!-- qa-id: claim-inventory -->
- [x] Every material claim has a declared source tag in its listed `master-script.md` section, and every source tag names a current source ledger entry. <!-- qa-id: script-source-tags -->
- [x] Every factual Instructor or Learner paragraph in `Retrieval review` has immediate source tags, and each recalled claim lists `Retrieval review` in `script_sections`. <!-- qa-id: retrieval-source-tags -->
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly. <!-- qa-id: source-classification -->
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim. <!-- qa-id: source-locators -->
- [x] Explicit current-turn authorization was received before source excerpts, claims, and tagged passages were sent to OpenAI for the `--require-llm` source-relevance review, and the report records that authorization with its run. <!-- qa-id: openai-source-review-authorization -->
- [x] After the independent spoken-script review and its required revisions, but before human editorial review, the source-link validator was run with `--require-llm`. It reports no unresolved deep-citation, link, locator-relevance, claim-relevance, or tagged-passage failure, and `episode.yaml` records `source_verification.relevance_review: complete`. <!-- qa-id: source-relevance -->
- [x] Before any audio render, `narration.md` is the current derivative of `master-script.md`, and show-notes episode/version/source-verification metadata agrees with the package. <!-- qa-id: narration-current -->
- [x] Before any audio render, show notes contain study links and synopsis only; the single public production disclosure belongs to the hosting page. <!-- qa-id: show-notes-scope -->
- [x] Independent spoken-script review completed by a second agent that did not draft the lesson. Grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension were checked; findings were reported and resolved or accepted. `episode.yaml` records the completed review against the current master-script hash. <!-- qa-id: independent-script-review -->
- [x] Human editorial pass received the clean source-validation result; unresolved technical questions were removed or resolved. <!-- qa-id: human-editorial -->
- [x] If human editorial changes spoken narration, source tags, claims, or cited sources, source-relevance validation was rerun successfully before audio render. Show-notes-only edits received deterministic mapping and link validation. <!-- qa-id: post-editorial-source-relevance -->
- [x] Before opening an episode PR, `npm run release:prehost -- --episode <episode-directory> --package-only` reports a consistent package shape. This is not final pre-hosting, release, or hosting approval. <!-- qa-id: pre-pr-package-shape -->

## Audio

- [x] Opening is 10-45 seconds and the required notice follows immediately. <!-- qa-id: opening-notice-order -->
- [x] Notice is clearly heard as “artificial intelligence-assisted production.” <!-- qa-id: notice-audible -->
- [x] Five-segment opening preview has been listened to before full rendering. <!-- qa-id: opening-preview -->
- [x] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked. <!-- qa-id: audio-listening -->
- [x] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains. <!-- qa-id: audio-integrity -->
- [x] The final MP3 chapter list starts at `00:00`; its titles are useful, listener-facing section labels; and each marker begins before the corresponding material. <!-- qa-id: chapters-manual -->
- [x] The render manifest records a passing `ffprobe` chapter validation for the final MP3. <!-- qa-id: chapters-ffprobe -->

## Release

- [x] FAA/eCFR links and revisions were re-verified on publication day. <!-- qa-id: publication-source-links -->
- [x] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum. <!-- qa-id: hosting-metadata -->
- [ ] After publication, Apple Podcasts and Overcast are checked for the final embedded chapter list. <!-- qa-id: post-publication-chapters -->
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml`; `production-log.md` may add context. <!-- qa-id: qualified-aviation-review -->
