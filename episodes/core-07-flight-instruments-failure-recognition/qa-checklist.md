# Flight Instruments and Failure Recognition — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`. Version 0.1.3 validation on 2026-08-23 confirms 51 reciprocal claims across 31 FAA sources.
- [x] FAA standards, FAA guidance, and teaching explanations are labeled correctly. This episode contains no regulatory or aircraft-example claim presented as universal instruction.
- [x] Every material source citation identifies a specific ACS task or FAA handbook PDF page. Version 0.1.3 deterministic validation on 2026-08-23 passed all 31 deep links and locators.
- [x] Source-link validation with `--require-llm` completed for version 0.1.3 on 2026-08-23. All 31 FAA sources and 51 reciprocal claims were assessed; 22 source-level findings support and 9 partially support their scoped claims, with no unsupported or insufficient-evidence claim finding. The recorded review is in `link-validation.yaml`.
- [x] Human editorial and listener-flow review completed. Script approved 2026-08-23.

## Audio

- [x] Opening is 10–45 seconds and the disclaimer follows immediately. Script structure places the disclaimer at 00:25 after the opening.
- [x] Notice is clearly heard as “artificial intelligence-assisted production.” The accepted opening preview uses unchanged, verified-reusable segments in version 0.1.3.
- [x] Reusable opening preview has been listened to and accepted before full rendering. The version 0.1.3 revision does not change the opening-preview segments.
- [ ] Full candidate has been listened to against the master script, including numbers, units, acronyms, and warnings.
- [ ] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.
- [ ] Embedded MP3 chapter markers have been manually reviewed with the chapter-review page.

## Release

- [ ] FAA/eCFR links and revisions have been re-verified on publication day.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
