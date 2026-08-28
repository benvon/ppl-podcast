# Weather Theory: Pressure, Stability, Moisture, and Clouds — QA checklist

## Content and sources

- [x] Every material claim is in `claim-inventory.yaml` and maps to `sources.yaml`.
- [x] FAA regulatory standards, FAA guidance, and teaching explanations are labeled correctly.
- [x] Every listener-facing attribution identifies the smallest relevant section, task, paragraph, or page; no landing-page, whole-document, or whole-part citation is used for a material claim.
- [ ] Before any audio render, source-link validator was run with `--require-llm`, reports no unresolved deep-citation, link, locator-relevance, or claim-relevance failure, and `episode.yaml` records `source_verification.relevance_review: complete`.
- [x] For this initial draft, `narration.md` is the current derivative of `master-script.md`, and show-notes episode/version/source-verification metadata agrees with the package. Recheck after any script edit and before render.
- [x] Show notes contain study links and synopsis only; the single public production disclosure belongs to the hosting page.
- [ ] Independent spoken-script review completed by a second agent that did not draft the lesson. Grammar, complete thoughts, internal callbacks and call-forwards, and first-listen comprehension were checked; findings were reported and resolved or accepted. This does not require an audit log.
- [ ] Human editorial pass completed; unresolved technical questions were removed or resolved.
- [ ] Before opening an episode PR, `npm run release:prehost -- --episode <episode-directory> --package-only` reports a consistent package shape. This is not final pre-hosting, release, or hosting approval.

## Initial-draft structure and listening readiness

- [x] Standard opening order is `Opening`, `Disclaimer`, `Podcast introduction`, then `What the ACS is asking you to connect`.
- [x] First Announcer teaching line repeats “What the ACS is asking you to connect.”
- [x] Every spoken paragraph is one physical Markdown line with no hard wrapping.
- [x] Terms are defined before they carry later reasoning, including parcel, density, adiabatic, lapse rate, stability, inversion, relative humidity, dew point, saturation, condensation nuclei, and ceiling.
- [x] Learner turns ask for a missing connection or summarize a conclusion already established by the Instructor.
- [x] Announcer transitions remain short and introduce no new technical claims.
- [x] Every spoken visual-aid pointer exactly matches a plainly labeled show-note link.
- [x] The draft remains within the 30–45 minute target range at 5,133 spoken words and an approximately 42-minute target.
- [ ] Independent non-drafting reviewer has checked grammar, complete thoughts, callbacks, call-forwards, and first-listen comprehension; material findings are resolved in `production-log.md`.

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
