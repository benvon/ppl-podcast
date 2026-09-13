# Airspace, Equipment, and VFR Weather Minimums — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`. <!-- qa-id: claim-inventory -->
- [x] Every material claim has a declared source tag in its listed `master-script.md` section, and every source tag names a current source ledger entry. <!-- qa-id: script-source-tags -->
- [x] Every factual Instructor or Learner paragraph in `Retrieval review` has immediate source tags, and each recalled claim lists `Retrieval review` in `script_sections`. <!-- qa-id: retrieval-source-tags -->
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly. <!-- qa-id: source-classification -->
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim. <!-- qa-id: source-locators -->
- [x] Explicit current-turn authorization was received before source excerpts, claims, and tagged passages were sent to OpenAI for the `--require-llm` source-relevance review, and the report records that authorization with its run. <!-- qa-id: openai-source-review-authorization -->
- [x] After the independent spoken-script review and its required revisions, but before human editorial review, the source-link validator was run with `--require-llm`. It reports no unresolved deep-citation, link, locator-relevance, claim-relevance, or tagged-passage failure, and `episode.yaml` records `source_verification.relevance_review: complete`. <!-- qa-id: source-relevance -->
- [x] Before any audio render, `narration.md` is the current derivative of `master-script.md`, and show-notes episode/version/source-verification metadata agrees with the package. <!-- qa-id: narration-current -->
- [x] Before any audio render, show notes contain study links and synopsis only; the single public production disclosure belongs to the hosting page. <!-- qa-id: show-notes-scope -->
- [x] Independent spoken-script review completed by a second agent that did not draft the lesson. Grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension were checked; findings were reported and resolved or accepted. This does not require an audit log. <!-- qa-id: independent-script-review -->
- [x] Human editorial pass received the clean source-validation result; unresolved technical questions were removed or resolved. <!-- qa-id: human-editorial -->
- [x] If human editorial changes factual spoken prose, source tags, claims, sources, or show notes, source-relevance validation was rerun successfully before audio render. <!-- qa-id: post-editorial-source-relevance -->
- [ ] Before opening an episode PR, `npm run release:prehost -- --episode <episode-directory> --package-only` reports a consistent package shape. This is not final pre-hosting, release, or hosting approval. <!-- qa-id: pre-pr-package-shape -->

## Audio

- [ ] Opening is 10-45 seconds and the required notice follows immediately. <!-- qa-id: opening-notice-order -->
- [ ] Notice is clearly heard as “artificial intelligence-assisted production.” <!-- qa-id: notice-audible -->
- [ ] Five-segment opening preview has been listened to before full rendering. <!-- qa-id: opening-preview -->
- [ ] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked. <!-- qa-id: audio-listening -->
- [ ] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains. <!-- qa-id: audio-integrity -->
- [ ] The final MP3 chapter list starts at `00:00`; its titles are useful, listener-facing section labels; and each marker begins before the corresponding material. <!-- qa-id: chapters-manual -->
- [ ] The render manifest records a passing `ffprobe` chapter validation for the final MP3. <!-- qa-id: chapters-ffprobe -->

## Release

- [ ] FAA/eCFR links and revisions were re-verified on publication day. <!-- qa-id: publication-source-links -->
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum. <!-- qa-id: hosting-metadata -->
- [ ] After publication, Apple Podcasts and Overcast are checked for the final embedded chapter list. <!-- qa-id: post-publication-chapters -->
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`. <!-- qa-id: qualified-aviation-review -->
