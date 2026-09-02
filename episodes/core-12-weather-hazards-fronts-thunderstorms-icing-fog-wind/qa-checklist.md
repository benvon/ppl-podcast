# Weather Hazards: Fronts, Thunderstorms, Icing, Fog, and Wind — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`.
- [x] Every material claim has a declared source tag in its listed `master-script.md` section, and every source tag names a current source ledger entry.
- [x] Every factual Instructor or Learner paragraph in `Retrieval review` has immediate source tags, and each recalled claim lists `Retrieval review` in `script_sections`.
- [x] Regulation, FAA guidance, aircraft examples, and teaching explanation are labeled correctly.
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim.
- [x] After the independent spoken-script review and its required revisions, but before human editorial review, the source-link validator was run with `--require-llm`. It reports no unresolved deep-citation, link, locator-relevance, claim-relevance, or tagged-passage failure, and `episode.yaml` records `source_verification.relevance_review: complete`.
- [x] Before any audio render, `narration.md` is the current derivative of `master-script.md`, and show-notes episode/version/source-verification metadata agrees with the package.
- [x] Before any audio render, show notes contain study links and synopsis only; the single public production disclosure belongs to the hosting page.
- [x] Independent spoken-script review completed by a second agent that did not draft version 0.2.1. Grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension were checked; all four required findings were resolved and useful optional wording refinements were applied.
- [x] Human editorial feedback was incorporated in version 0.2.2 while preserving the route scenario and the Instructor-question/Learner-answer Retrieval review format; renewed source relevance passed and human reapproval is recorded.
- [x] The full lesson is organized around the hypothetical northern California-to-Wisconsin route, and the script states that the scenario is not a live briefing, recommended route, or operational prescription.
- [x] Each planning conclusion names the proposed route segment and a specific later departure, different corridor, stopover, or destination choice rather than using vague alternatives.
- [x] The front mental picture identifies the chart line as the analyzed surface reference, describes the boundary sloping over colder air, and explains why associated weather can occupy a larger three-dimensional volume.
- [x] The planned mountain corridor, western-Plains stopover, Wisconsin primary, and Wisconsin alternate are defined early and reused consistently; the alternate has a distinct runway orientation and location outside the shared fog or convective-outflow area.
- [x] The icing overlap test is applied separately to the planned mountain-corridor and Plains-front cross-sections, with a distinct decision for each segment.
- [x] Cirriform, stratiform, and freezing level are replaced with plain-language descriptions; the source-required `clear` qualifier is present in the Plains-front severe-clear-icing passage and Retrieval review.
- [x] Human editorial pass received a clean source-validation result for version 0.2.2; unresolved technical questions were removed or resolved.
- [x] Human editorial changes to factual spoken prose, source tags, claims, sources, or show notes were followed by successful source-relevance validation before audio render.
- [ ] Before opening an episode PR, `npm run release:prehost -- --episode <episode-directory> --package-only` reports a consistent package shape. This is not final pre-hosting, release, or hosting approval.

## Audio

- [x] Opening is 10-45 seconds and the required notice follows immediately.
- [x] Notice is clearly heard as “artificial intelligence-assisted production.”
- [x] Five-segment opening preview has been listened to before full rendering.
- [x] Full candidate has been listened to against the master script, with numbers, units, acronyms, and warnings checked.
- [x] No clipped, corrupt, repeated, mispronounced, or awkwardly joined audio remains.
- [x] The final MP3 chapter list starts at `00:00`; its titles are useful, listener-facing section labels; and each marker begins before the corresponding material.
- [x] The render manifest records a passing `ffprobe` chapter validation for the final MP3.

## Release

- [ ] FAA/eCFR links and revisions were re-verified on publication day.
- [ ] Hosting metadata agrees with the current script, show notes, runtime, and audio checksum.
- [ ] After publication, Apple Podcasts and Overcast are checked for the final embedded chapter list.
- [ ] Qualified aviation review, if obtained, is recorded in `episode.yaml` and `production-log.md`.
