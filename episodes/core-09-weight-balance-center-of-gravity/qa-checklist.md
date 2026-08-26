# Weight, Balance, and Center of Gravity — QA checklist

## Content and sources

- [x] Every material claim in the initial draft is in `claim-inventory.yaml` and maps reciprocally to `sources.yaml`.
- [x] Regulation, FAA regulatory standard, FAA guidance, and teaching explanation are labeled separately.
- [x] Every listener-facing attribution identifies a specific ACS task/page, PHAK section/page, figure/page, or exact eCFR section.
- [x] Spoken pointers to PHAK Figures 10-2 through 10-4, the p. 10-7 computational worksheet, and Figures 10-7 and 10-8 have exact, plainly labeled show-note links.
- [x] Before any audio render, source-link validator was run with `--require-llm`, reports no unresolved deep-citation, link, locator-relevance, or claim-relevance failure, and `episode.yaml` records `source_verification.relevance_review: complete`. Final run: `ed1a4a45-24eb-49b6-900c-50460031b712` at 2026-08-26T17:06:29Z.
- [x] Independent spoken-script review completed by a second agent that did not draft the lesson. The August 26, 2026 adversarial review checked grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension; all required and accepted clarity findings were resolved.
- [x] Human editorial pass completed; unresolved technical questions were removed or resolved.
- [ ] Publication-day FAA and eCFR currency check completed and recorded.

## Script and narration

- [x] Standard opening order is `Opening`, `Disclaimer`, `Podcast introduction`, then `What the ACS is asking you to connect`.
- [x] The first Announcer line under the ACS section repeats the heading exactly.
- [x] Announcer transitions use the listener-facing heading and introduce no new technical claim.
- [x] Spoken prose uses one physical line per paragraph without hard wrapping.
- [x] Source tags remain in `master-script.md` and are removed from the derived `narration.md`.
- [x] Renderer-derived spoken word count is recorded as 4,979 words.
- [x] Independent reviewer findings and resolutions are recorded in `production-log.md`.

## Audio

- [x] Opening is 10–45 seconds and the required notice follows immediately.
- [x] Notice is clearly heard as “artificial intelligence-assisted production.”
- [x] Five-segment opening preview has been listened to before full rendering.
- [ ] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked.
- [ ] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.
- [ ] The final MP3 chapter list starts at `00:00`; its titles are useful, listener-facing section labels; and each marker begins before the corresponding material.
- [ ] The render manifest records a passing `ffprobe` chapter validation for the final MP3.

## Release

- [ ] FAA/eCFR links and revisions were re-verified on publication day.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] After publication, Apple Podcasts and Overcast are checked for the final embedded chapter list.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
