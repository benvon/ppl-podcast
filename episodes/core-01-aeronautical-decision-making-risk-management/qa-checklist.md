# Aeronautical Decision-Making and Risk Management — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`.
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly.
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim.
- [x] Source-link validator was run with `--require-llm` and reports no unresolved deep-citation, link, locator-relevance, or claim-relevance failure.
- [x] Human editorial pass completed; unresolved technical questions were removed or resolved.

## Audio

- [x] Opening is 10-20 seconds and the required notice follows immediately.
- [x] Notice is clearly heard as “artificial intelligence-assisted production.”
- [x] Five-segment opening preview has been listened to before full rendering.
- [x] Quick listening QA approved the v0.2 rendered candidate for publishing preparation; this is not a substitute for the complete release listen below.
- [x] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked.
- [x] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.

## Release

- [x] FAA/eCFR links and revisions were re-verified on publication day.
- [x] Hosting metadata agrees with the current script, show notes, runtime, and audio manifest; the hosting publisher will add the immutable audio checksum during private staging.
- [x] Public RSS item, episode page, MP3 `HEAD`, and MP3 byte-range response were independently verified after deployment.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
