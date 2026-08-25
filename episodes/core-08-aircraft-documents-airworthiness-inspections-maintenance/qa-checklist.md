# Aircraft Documents, Airworthiness, Inspections, and Maintenance — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`.
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly.
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim.
- [x] Before any audio render, source-link validator was run with `--require-llm`, reports no unresolved deep-citation, link, locator-relevance, or claim-relevance failure, and `episode.yaml` records `source_verification.relevance_review: complete`. Completed 2026-08-25: 34 sources, 50 reciprocal claims, and 15 show-note links all passed.
- [x] Publication-day validation was rerun after the version 0.2.1 evidence refinements. On 2026-08-25, all 34 sources, 50 reciprocal claims, and 15 show-note links passed deterministic and claim-level relevance checks.
- [x] Human editorial pass completed; unresolved technical questions were removed or resolved.

## Audio

- [x] Opening is 10-45 seconds and the required notice follows immediately.
- [x] Notice is clearly heard as “artificial intelligence-assisted production.” Accepted in the opening preview on 2026-08-25.
- [x] Five-segment opening preview has been listened to before full rendering. Accepted on 2026-08-25; segments 1–5 remain reusable for the complete candidate.
- [x] Full candidate has been listened to against the version 0.2.1 master script, with numbers, units, acronyms, and warnings checked. Accepted on 2026-08-25.
- [x] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains in the version 0.2.1 candidate. Accepted on 2026-08-25.
- [x] The chapter markers have been manually reviewed: the version 0.2.1 MP3 list starts at `00:00`, its titles are useful listener-facing section labels, and each marker begins before the corresponding material. Accepted on 2026-08-25.
- [x] The render manifest records a passing `ffprobe` chapter validation for the version 0.2.1 MP3.

## Release

- [x] FAA/eCFR links and revisions were re-verified on publication day.
- [x] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] After publication, Apple Podcasts and Overcast are checked for the final embedded chapter list.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
