# The Checkride Oral: Connecting Knowledge, Risk, and Skill — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`. <!-- qa-id: claim-inventory -->
- [x] Every material claim has a declared source tag in its listed `master-script.md` section, and every source tag names a current source ledger entry. <!-- qa-id: script-source-tags -->
- [x] Every factual Instructor or Learner paragraph in `Retrieval review` has immediate source tags, and each recalled claim lists `Retrieval review` in `script_sections`. <!-- qa-id: retrieval-source-tags -->
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly. <!-- qa-id: source-classification -->
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim. <!-- qa-id: source-locators -->
- [x] The user authorized the OpenAI API source-relevance review for this episode in the current turn; the review may send its source excerpts, claims, and tagged passages, and the report records the authorization with its run. No prescribed approval wording is required. <!-- qa-id: openai-source-review-authorization -->
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

## Current request scope

The user explicitly authorized the OpenAI API source-relevance review for Core-25 in the October 8, 2026 request: “You are authorized to call the OpenAI API for the source relevance review.” This covers the episode source excerpts, claims, and tagged spoken passages. Audio rendering is outside this request. The requested stopping point is readiness for human editorial review.

## Human editorial decision

The user approved the revised master script (version 0.1.3). The renewed source review applies to this revision; the approval command binds the human decision to the current script. The user has separately authorized the renewed OpenAI source-relevance review for this revision.

## Opening-preview audio authorization

- [x] The user authorized OpenAI API audio rendering of Core-25’s opening preview in the current turn. Scope: the first five segments of the approved version 0.1.3 narration, including adjacent-dialogue context used by the renderer. Listening acceptance remains pending. <!-- qa-id: openai-audio-render-authorization -->

## Full-render authorization

- [x] The user accepted the opening preview and authorized OpenAI API audio rendering for the remaining Core-25 narration in the current turn. The full assembly reuses the accepted first five segments. <!-- qa-id: openai-full-audio-render-authorization -->

The user authorized a renewed Core-25 OpenAI source-relevance review for the publication-day eCFR snapshot. The normal source-review report records that authorization and the refreshed evidence.
