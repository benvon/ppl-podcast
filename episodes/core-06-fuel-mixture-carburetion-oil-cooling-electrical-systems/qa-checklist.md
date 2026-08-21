# Fuel, Mixture, Carburetion, Oil, Cooling, and Electrical Systems — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`. Verified by deterministic source validation on 2026-08-20: 41 reciprocal claims across 19 FAA sources.
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly. This draft contains FAA-standard and FAA-guidance claims; no regulatory or aircraft-example claim is presented as universal instruction.
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim. Verified by deterministic source validation on 2026-08-20: 26 show-notes links passed.
- [x] Source-link validator was run with `--require-llm` and reports no unresolved deep-citation, link, locator-relevance, or claim-relevance failure. Completed 2026-08-20 against 19 FAA sources and 41 claims; the LLM review is recorded in `link-validation.yaml`.
- [x] Human editorial pass completed; unresolved technical questions were removed or resolved. Script approved 2026-08-19.

## Audio

- [x] Opening is 10-45 seconds and the disclaimer follows immediately. Script structure verified; opening is budgeted at 30 seconds and the next spoken section is `Disclaimer`.
- [x] Notice is clearly heard as “artificial intelligence-assisted production.” Accepted in the opening preview on 2026-08-20.
- [x] Five-segment opening preview was listened to and accepted before full rendering on 2026-08-20.
- [x] Full candidate was listened to against the master script, with numbers, units, acronyms, and warnings checked. Accepted on 2026-08-21.
- [x] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains. Accepted on 2026-08-21.
- [x] Embedded MP3 chapter markers were manually reviewed with the chapter-review page and accepted on 2026-08-21.

## Release

- [x] FAA/eCFR links and revisions were re-verified on publication day. Completed 2026-08-21 at 14:34:40Z: 19 FAA sources, 41 claims, and 26 show-notes links passed deep-link, locator, mapping, and claim-level relevance validation.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
