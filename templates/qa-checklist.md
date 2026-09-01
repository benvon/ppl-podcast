# {{TITLE}} — QA checklist

## Content and sources

- [ ] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`.
- [ ] Every material claim has a declared source tag in its listed `master-script.md` section, and every source tag names a current source ledger entry.
- [ ] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly.
- [ ] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim.
- [ ] After the independent spoken-script review and its required revisions, but before human editorial review, the source-link validator was run with `--require-llm`. It reports no unresolved deep-citation, link, locator-relevance, claim-relevance, or tagged-passage failure, and `episode.yaml` records `source_verification.relevance_review: complete`.
- [ ] Before any audio render, `narration.md` is the current derivative of `master-script.md`, and show-notes episode/version/source-verification metadata agrees with the package.
- [ ] Before any audio render, show notes contain study links and synopsis only; the single public production disclosure belongs to the hosting page.
- [ ] Independent spoken-script review completed by a second agent that did not draft the lesson. Grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension were checked; findings were reported and resolved or accepted. This does not require an audit log.
- [ ] Human editorial pass received the clean source-validation result; unresolved technical questions were removed or resolved.
- [ ] If human editorial changes factual spoken prose, source tags, claims, sources, or show notes, source-relevance validation was rerun successfully before audio render.
- [ ] Before opening an episode PR, `npm run release:prehost -- --episode <episode-directory> --package-only` reports a consistent package shape. This is not final pre-hosting, release, or hosting approval.

## Audio

- [ ] Opening is 10-45 seconds and the required notice follows immediately.
- [ ] Notice is clearly heard as “artificial intelligence-assisted production.”
- [ ] Five-segment opening preview has been listened to before full rendering.
- [ ] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked.
- [ ] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.
- [ ] The final MP3 chapter list starts at `00:00`; its titles are useful, listener-facing section labels; and each marker begins before the corresponding material.
- [ ] The render manifest records a passing `ffprobe` chapter validation for the final MP3.

## Release

- [ ] FAA/eCFR links and revisions were re-verified on publication day.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] After publication, Apple Podcasts and Overcast are checked for the final embedded chapter list.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
