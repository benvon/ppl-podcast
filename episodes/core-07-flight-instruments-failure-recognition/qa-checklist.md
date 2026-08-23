# Flight Instruments and Failure Recognition — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`. Verified by deterministic source validation on 2026-08-23: 50 reciprocal claims across 30 FAA sources.
- [x] FAA standards, FAA guidance, and teaching explanations are labeled correctly. This episode contains no regulatory or aircraft-example claim presented as universal instruction.
- [x] Every material source citation identifies a specific ACS task or PHAK PDF page. Deterministic source validation on 2026-08-23 passed all 30 deep links and locators.
- [ ] Source-link validation has been run with `--require-llm`; resolve every relevance finding before rendering.
- [x] Human editorial and listener-flow review completed. Script approved 2026-08-23.

## Audio

- [x] Opening is 10–45 seconds and the disclaimer follows immediately. Script structure places the disclaimer at 00:25 after the opening.
- [ ] Notice is clearly heard as “artificial intelligence-assisted production.”
- [ ] Reusable opening preview has been listened to and accepted before full rendering.
- [ ] Full candidate has been listened to against the master script, including numbers, units, acronyms, and warnings.
- [ ] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.
- [ ] Embedded MP3 chapter markers have been manually reviewed with the chapter-review page.

## Release

- [ ] FAA/eCFR links and revisions have been re-verified on publication day.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
