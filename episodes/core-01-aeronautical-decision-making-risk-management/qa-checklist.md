# Aeronautical Decision-Making and Risk Management — QA checklist

## Content and sources

- [ ] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`.
- [ ] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly.
- [ ] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim.
- [ ] Source-link validator was run with `--require-llm` and reports no unresolved deep-citation, link, locator-relevance, or claim-relevance failure.
- [ ] Human editorial pass completed; unresolved technical questions were removed or resolved.

## Audio

- [ ] Opening is 10-20 seconds and the required notice follows immediately.
- [ ] Notice is clearly heard as “artificial intelligence-assisted production.”
- [ ] Five-segment opening preview has been listened to before full rendering.
- [ ] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked.
- [ ] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.

## Release

- [ ] FAA/eCFR links and revisions were re-verified on publication day.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
