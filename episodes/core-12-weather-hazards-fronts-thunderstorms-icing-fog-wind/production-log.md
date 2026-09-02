# Weather Hazards: Fronts, Thunderstorms, Icing, Fog, and Wind — production log

## 2026-09-01 — package created

- Created from the standard episode template on branch `feature/core-12-weather-hazards`.
- Confirmed the production-plan identity: Core Episode 12, weather-hazard recognition and conservative decision-making, anchored in PHAK Chapter 12 and FAA weather guidance.

## 2026-09-01 — initial source-led research and first draft

- Researched current official FAA material: FAA-H-8083-25C PHAK Chapter 12; FAA-H-8083-28B Aviation Weather Handbook, April 2026; FAA-S-ACS-6C Private Pilot Airplane ACS; and FAA-H-8083-3C Airplane Flying Handbook Chapter 9 as complementary runway-wind context.
- Built a reciprocal ledger of 19 page-level sources and 29 material claims. Official PDFs were downloaded to temporary storage for page-by-page inspection; no downloaded source file was added to the repository.
- Drafted the source-tagged lesson around one ACS decision pattern: identify the mechanism, locate the hazard in space and time, corroborate it, compare combined margin, and make an early lower-workload choice.
- Carried Episode 11 theory into frontal lift and variability, thunderstorm ingredients and evolving outflow, structural icing overlap, fog mechanisms, local wind and runway components, and low-level wind shear.
- Added route-level examples that combine fronts, fog, icing, thunderstorms, and runway wind without giving maneuver, thunderstorm-penetration, icing-escape, or aircraft-specific procedure instruction.
- Added a fully source-tagged Retrieval review and listed every recalled claim in that section.
- Produced listener-facing show notes with 19 exact source links and a reciprocal show-notes manifest.
- Mechanically derived `narration.md` from `master-script.md`. The initial narration contains 3,722 spoken words with an approximately 25–30 minute target.
- Ran the script-review reset and bound the pending-review fingerprint to SHA-256 `30239eb698b8441a3475af8e6a0cd3c9cf59f6377e57f65eeabdc749afaf0108`.
- Deterministic source validation in `--dry-run` mode passed: 19 sources, 29 reciprocal claims, 94 master-script source tags, and 19 show-note links; no network or API request was made by the validator.
- All 93 repository tests passed. The pre-commit disclosure and secret scan and `git diff --check` passed.
- The package-only pre-host command was exercised and stopped at the intended later-stage gate because `link-validation.yaml` does not exist until formal source validation is run.
- Independent spoken-script review by a non-drafting agent remains pending. Formal paid source-relevance validation, human editorial approval, audio rendering, staging, release, and publication were not performed.

## 2026-09-01 — independent spoken-script review resolved

- A non-drafting agent reviewed grammar, complete thoughts, within-episode callbacks and call-forwards, and first-listen comprehension. All five required findings were resolved.
- Replaced three number-only callbacks with the full listener-facing title, Episode 11, *Weather Theory: Pressure, Stability, Moisture, and Clouds*.
- Clarified that the chart line marks the analyzed surface boundary while cloud, precipitation, turbulence, and visibility restrictions can occupy a larger three-dimensional area above and on either side of it.
- Changed the fog decision prompt so a forecast describes an expected change in the active mechanism rather than causing that change.
- Added a plain runway-line mental model for separating reported wind into along-runway headwind or tailwind and across-runway crosswind components before comparing the result with airplane, runway, and pilot margin. No control technique was added.
- Replaced the figurative microburst line with the direct sequence: an increasing headwind raises indicated airspeed, the downdraft pushes the airplane downward, and a later increasing tailwind reduces indicated airspeed and performance near the ground.
- Applied both optional clarity refinements: reframed the front-type section around evidence completing the picture, and shortened the icing boundary sentence to keep the emphasis on recognition before an encounter.
- Regenerated `narration.md` mechanically. The reviewed narration contains 3,816 spoken words with the same approximately 25–30 minute target.
- Reset the downstream script-review state and recorded pending-review SHA-256 `1ac90f62cddb5d22207ea32bca2b678142eaaa56eadc07882aee2e3694534d94`. Formal source-relevance validation, human editorial approval, audio rendering, staging, release, and publication remain pending.
- Re-ran deterministic source validation in `--dry-run` mode: all 19 sources, 29 reciprocal claims, 95 master-script source tags, and 19 show-note links passed without network or API requests. The narration derivative comparison, all 93 repository tests, the disclosure and secret scan, and the diff whitespace check also passed.

## 2026-09-01 — first formal source-relevance review resolved

- Formal source-relevance review run `46d0cb53-8a2e-4c55-a745-aff7593c18fb` completed with targeted failures. This revision resolves those findings without rerunning the paid review; a clean formal rerun remains a required gate.
- Fronts: removed unsupported lee-side obstruction wording; narrowed the air-mass boundary claim; added exact AWH support for surface signs; added PHAK Figure 12-24 support for the surface-chart location; limited warm-front details to the page-supported gradual slope, cloud, fog, and summer thunderstorm pattern; made the steep, concentrated cold-front band conditional on a fast-moving cold front; and sourced stationary-front duration and occluded-front formation from their exact page.
- Thunderstorms: separated the ingredient and mature-stage lifecycle pages; qualified the hazard list so every storm is hazardous without implying every storm contains every listed hazard; sourced the gust front ahead of the parent cell and the limits of visual identification; and separated general avoidance from the explicit divert-and-wait guidance.
- Icing: narrowed the supercooled-water source to structural-icing formation; added the exact icing-factors page for meteorological and aircraft variability; narrowed the frontal and terrain claim to the handbook's described distribution; labeled the route cross-section and preflight application as teaching inferences; and removed the unsupported standalone clean-aircraft claim.
- Fog: separated the definition, radiation-fog factors, advection, upslope, frontal, and steam mechanisms onto their exact pages; retained the near-dew-point condition for frontal fog; and framed the VFR consequence and forecast questions as ACS-grounded teaching applications.
- Wind: removed unsupported downwind-location specificity from obstruction turbulence; separated the AFH component mental model from the component-chart and capability guidance; and retained the independent spoken-review explanation that resolves wind along and across the runway before comparing margin.
- Synchronized the 28-source ledger, 35-claim inventory, 28 listener-facing source links and manifest entries, research packet, show notes, episode metadata, and source-tagged Retrieval review. Mechanically regenerated `narration.md`; the revised narration contains 3,809 spoken words.
- Reset downstream script-review state and bound the pending-review fingerprint to SHA-256 `9601700dd6341ccb825974bd22f9a7edf1f4ceb42d842b627a97380f762431a6`. Formal source relevance, human editorial approval, audio rendering, staging, release, and publication remain pending.
- Deterministic validation passed: source shape, reciprocal claims, 121 master-script source tags, and 28 show-note links for 28 sources and 35 claims; the mechanical narration derivative; all 93 repository tests; the disclosure and secret scan; and `git diff --check`. No network request, OpenAI relevance call, or audio render was performed.

## 2026-09-01 — second formal source-relevance review resolved

- The second formal source-relevance report, checked at `2026-09-01T17:35:23.248Z`, left four narrow source-alignment findings. This revision resolves only those findings; a clean formal rerun remains the next gate.
- Icing distribution: replaced the unsupported general statement about icing above a frontal surface with the handbook's exact supported cases—freezing rain or drizzle below a front, broad horizontal extent, and windward mountain upward currents supporting large supercooled droplets above the freezing level.
- Icing effects: limited the factual claim and spoken examples to wing lift and drag plus the specifically listed exposed frontal surfaces: propeller, windshield, antennas, vents, intakes, and cowlings.
- Data-linked NEXRAD: restored the material FAA qualifier that mosaic imagery must not be the sole means for tactical path negotiation, while retaining its delayed strategic route-selection use.
- Runway wind: made available landing directions the first condition in the component mental model before resolving the wind for the selected runway.
- Synchronized the source excerpts, reciprocal claims, source-tagged lesson and Retrieval review, research packet, listener-facing show notes, and episode metadata. Mechanically regenerated `narration.md`; the revised narration contains 3,887 spoken words.
- Reset downstream script-review state and bound the pending-review fingerprint to SHA-256 `a382269c580cdad59db2b9acecf432b5d2c5af14617e7a4bd92af08dc0322724`. Formal source relevance, human editorial approval, audio rendering, staging, release, and publication remain pending.
- Deterministic validation passed: source shape, reciprocal claims, 121 master-script source tags, and 28 show-note links for 28 sources and 35 claims; the mechanical narration derivative; all 93 repository tests; the disclosure and secret scan; and `git diff --check`. No network request, OpenAI relevance call, or audio render was performed.

## 2026-09-01 — third formal source-relevance review resolved

- The third formal source-relevance report, checked at `2026-09-01T17:43:00.167Z`, left two final wording mismatches. This revision resolves only those findings; a clean formal rerun remains the next gate.
- ACS correlation: changed the claim and Retrieval review from correlation with a proposed VFR flight to the ACS-supported general requirement to correlate weather information with a flight decision. The episode remains explicitly framed for a VFR learner audience elsewhere.
- Wind circulation: removed the unsupported comparison among cruise-altitude, airport, and runway-end winds. The claim, lesson, and Retrieval review now use the PHAK's direct statement that local conditions and geological features can change wind direction and speed close to the surface.
- Synchronized the source excerpt, reciprocal claims, source-tagged lesson and Retrieval review, research packet, listener-facing show notes, and episode metadata. Mechanically regenerated `narration.md`; the revised narration contains 3,890 spoken words.
- Reset downstream script-review state and bound the pending-review fingerprint to SHA-256 `8cdf3faa8cd15e2ffcbc8b02d7599ba61dc2b59967c8bd83fe2a1d9b7a44e643`. Formal source relevance, human editorial approval, audio rendering, staging, release, and publication remain pending.
- Deterministic validation passed: source shape, reciprocal claims, 121 master-script source tags, and 28 show-note links for 28 sources and 35 claims; the mechanical narration derivative; all 93 repository tests; the disclosure and secret scan; and `git diff --check`. No network request, OpenAI relevance call, or audio render was performed.

## 2026-09-01 — formal source-relevance validation passed

- Formal source-relevance review run `2724acc1-3b60-459b-9c99-f5219396dfa2`, checked at `2026-09-01T17:47:37.037Z`, passed with 28 FAA sources, 28 listener-facing show-note links, 35 claims, and 121 immediate master-script source tags.
- The report is bound to the current source ledger, claim inventory, master script, show notes, and show-notes manifest. Every assessed source, locator, claim, and tagged spoken passage passed.
- The source-validated draft is now ready for human editorial review. Audio rendering, hosting, release, and publication remain pending.

## 2026-09-01 — human-requested route-scenario architectural redraft

- Superseded the earlier source-validated version 0.1.0 draft with a human-requested architectural redraft built from zero around one hypothetical multi-day VFR plan from northern California to Wisconsin. The earlier formal source-relevance result remains historical evidence only and is not valid for version 0.2.0.
- Ran the required script-review reset before the first material script edit, explicitly clearing the earlier source-relevance approval. After the completed script edit, ran the reset again and bound the pending-review fingerprint to SHA-256 `14700e06bc15c0ea74820abada9afd4cf956138cd09bfb6be78bf58da369f494`.
- Rebuilt the lesson as a sequence of concrete planning questions: northern California radiation or advection fog; western terrain, obstruction-shaped wind, and upslope fog; a surface front as the bottom reference of a sloping three-dimensional boundary; frontal and terrain icing; a stop west of a Plains cold front and developing thunderstorms; delayed-radar limits; and Wisconsin fog, runway components, obstruction effects, and low-level wind shear.
- Replaced generic alternatives and vague comparisons with named decisions for the affected leg: later departure, a separately evaluated lower-terrain corridor, a stop before the front, or a Wisconsin destination outside the fog and convective-outflow area with a more favorable runway.
- Retained the same 28 current official FAA source entries because the revised scenario uses the same validated core source set: PHAK Chapter 12 as the primary conceptual anchor, the April 2026 Aviation Weather Handbook for frontal, fog, icing, thunderstorm, and delayed-data detail, the Private Pilot Airplane ACS for the decision framework, and the Airplane Flying Handbook for complementary runway-component context.
- Remapped all 35 material claims to the new section architecture, kept immediate source-pure tags throughout the spoken lesson, and rebuilt the fully tagged Retrieval review. Updated show notes and their manifest, episode and hosting metadata, QA state, research packet, and audio gate state for version 0.2.0.
- Mechanically regenerated `narration.md`. Version 0.2.0 contains 4,461 spoken words with an approximately 25–35 minute target.
- Deterministic source validation passed with 28 sources, 35 reciprocal claims, 113 master-script source tags, and 28 show-note links; no network or API request was made. All 93 repository tests, the disclosure and secret scan, and `git diff --check` passed.
- Package-only pre-host validation was exercised and failed closed at the expected pending gates: independent spoken-script review, renewed source relevance, human editorial approval, and current link-validation binding. The previous `link-validation.yaml` is intentionally stale for version 0.2.0.
- Independent spoken-script review by a non-drafting agent remains pending for the lead agent to assign. Renewed paid source-relevance validation, human editorial approval, audio rendering, staging, release, publication, push, and PR creation were not performed.

## 2026-09-01 — independent spoken-script review resolved

- A non-drafting agent reviewed version 0.2.0 for grammar, complete thoughts and referents, internal callbacks and call-forwards, first-listen comprehension, scenario continuity, vague wording, and definitions at first useful introduction. All four required findings were resolved in version 0.2.1.
- The independent spoken-script review is complete and all four required findings are resolved.
- Defined four reusable hypothetical route roles near the beginning: the planned mountain corridor, western-Plains stopover, Wisconsin primary, and Wisconsin alternate with a different runway orientation outside the primary's shared fog or convective-outflow area. Replaced later placeholder corridors, stopovers, destinations, and airports with those roles.
- Separated the icing lesson into one vertical cross-section through the planned mountain corridor and another through the Plains front east of the western-Plains stopover. Each segment now has its own overlap test and decision.
- Defined the Wisconsin alternate before comparison, then made continuation to the Wisconsin primary, use of the Wisconsin alternate, or remaining at the previous stop depend on the distinct runway and weather information established for those roles.
- Replaced the undefined listener-facing terms `cirriform`, `stratiform`, `freezing level`, and `clear icing` with plain-language descriptions at their first use.
- Applied the useful optional refinements: renamed the delayed-radar section to emphasize strategic clearance from the convective area and expanded the Wisconsin retrieval prompt to name fog, runway wind components, nearby obstructions, and wind shear.
- Mechanically regenerated `narration.md`. Version 0.2.1 contains 4,680 spoken words with an approximately 25–35 minute target.
- Ran the repository-required post-edit script-review reset and bound the pending-review fingerprint to SHA-256 `3ba63b5568f9aeafb144c16843c71c2fc2f758f8f3312022b04fc0db90ee5e72`; prior source-relevance approval remains invalid.
- Deterministic source validation passed with 28 sources, 35 reciprocal claims, 115 master-script source tags, and 28 show-note links; no network or API request was made. All 93 repository tests, the disclosure and secret scan, YAML parsing, narration-derivative verification, and `git diff --check` passed.
- Renewed paid source-relevance validation, human editorial approval, audio rendering, staging, release, publication, push, and PR creation were not performed.

## 2026-09-01 — final clear-icing qualifier mismatch resolved

- Formal source-relevance review identified one final exact mismatch: the Plains-front source and existing claim specify that freezing rain or freezing drizzle below a front is a favored location for severe clear icing, while the spoken passage had omitted the material `clear` qualifier.
- Restored `severe clear icing` in the Plains-front teaching passage and the corresponding Retrieval review statement. The existing `icing-frontal-terrain-distribution` claim already contained the correct qualifier, so the claim and source ledger required no wording change.
- Mechanically regenerated `narration.md`; the revised script contains 4,708 spoken words. Ran the repository-required post-edit script-review reset and bound pending-review SHA-256 `1a3e6530bcf77c9347c2f2f4693003243e3664815bb8a1b9cb5e4f44d8ac73c9`.
- Deterministic source mapping, repository tests, disclosure and secret scanning, YAML parsing, narration-derivative verification, and whitespace checks passed. No paid relevance rerun, rendering, staging, push, PR, or publication was performed.

## 2026-09-01 — route-scenario source-relevance validation passed

- Formal source-relevance review run `a15327b5-3410-4a88-bef2-0c68e77d7f30`, checked at `2026-09-01T21:42:40.783Z`, passed for version 0.2.1 with 28 current FAA sources, 28 listener-facing show-note links, 35 claims, and 115 immediate master-script source tags.
- The final report is bound to the current source ledger, claim inventory, master script, show notes, and show-notes manifest. Every assessed source, locator, claim, and tagged spoken passage passed.
- This source-validated route-scenario draft is ready for human editorial review. Audio rendering, hosting, release, and publication remain pending.

## 2026-09-01 — human editorial scenario clarifications resolved

- Incorporated the human editor's eight requested revisions in version 0.2.2 while preserving the hypothetical northern California-to-Wisconsin scenario and the editor's existing wording changes.
- Expanded `Crossing western terrain: wind is not one number` with mountain-wave updrafts and downdrafts, a plain-language rotor definition, potentially severe-to-extreme wind shear and turbulence, the limits of precise forecasting, and a viable corridor-entry stop or open-terrain turnaround decision before entering narrower terrain. Added exact current FAA support from Aviation Weather Handbook Chapter 16 and AIM 4-6-6.a.3(a).
- Rebuilt the opening of `Place icing inside the frontal cross-section` as two side-view route pictures: one along the planned mountain corridor and one along the Plains-front segment east of the western-Plains stopover. Each picture now places terrain and obstacles, cloud, precipitation, temperature, and proposed altitude together and leads to its own route decision.
- Set up the learner's likely warmer-air descent question before explaining why a lower altitude may still be unusable because of cloud, freezing precipitation, terrain, obstacles, or the ground. Clarified the aircraft exterior preflight inspection, the wing and exposed surfaces affected by frost, snow, or ice, and the need to establish stop, wait, or turnaround decisions before exposure rather than entering weather to test a forecast.
- Strengthened `Stop before the Plains cold front`: a visual gap can narrow, contain gust-front outflow beyond visible rain, and leave no safe exit; weaving between cells is not a planning strategy.
- Preserved the Instructor-question/Learner-answer Retrieval review and recorded that pattern in `docs/script-drafting-playbook.md` as a durable drafting lesson for future episodes: ask one bounded retrieval question, then have the Learner rebuild the causal chain and decision in short source-tagged paragraphs.
- Synchronized the 30-source ledger, 37-claim inventory, 30 show-note links and manifest entries, research packet, versioned episode and hosting metadata, QA state, and audio gate state. Mechanically regenerated `narration.md`; version 0.2.2 contains 5,188 spoken words.
- Ran the required script-review reset and bound pending-review SHA-256 `134df285c8728d4c85cf76f1cb5bd24809306a9e091cf20690aaafdc627d9f3b`. The version 0.2.1 source-relevance approval is explicitly invalid for the edited script.
- Deterministic validation passed with 30 sources, 37 reciprocal claims, 122 immediate master-script source tags, and 30 listener-facing show-note links; no network or OpenAI API request was made by the validator. All 93 repository tests, the disclosure and secret scan, YAML parsing, narration-derivative verification, and `git diff --check` passed.
- Paid source relevance, audio rendering, staging, push, PR creation, publication, and human reapproval were not performed.

## 2026-09-01 — revised scenario source-relevance validation passed

- Formal source-relevance review run `e606ac77-9157-4985-a3e1-2891facd07de`, checked at `2026-09-01T23:39:36.949Z`, passed for version 0.2.2 with 30 FAA sources, 30 listener-facing show-note links, 37 claims, and 122 immediate master-script source tags.
- The report is bound to master-script SHA-256 `134df285c8728d4c85cf76f1cb5bd24809306a9e091cf20690aaafdc627d9f3b`. The source-validated draft is ready to record the completed human editorial approval; audio rendering, hosting, release, and publication remain pending.

## 2026-09-01 — human editorial approval recorded

- Human editorial approval was recorded against the source-validated master-script SHA-256 `134df285c8728d4c85cf76f1cb5bd24809306a9e091cf20690aaafdc627d9f3b` after the renewed formal source-relevance review passed.
- The next production gate is reusable opening audio QA, followed by the complete audio render and human listening and chapter-marker reviews.

## 2026-09-02 — opening audio QA accepted

- Rendered reusable segments 1-5 with Marin, Cedar, and Ballad. The initial dry assembly omitted the established intro music bed; it was not accepted and was replaced without re-rendering the unchanged voice segments.
- The accepted music-mixed preview is `audio-artifacts/core-12-20260902T002617Z.preview-001-005.mp3` (SHA-256 `84b272530c025eff9a777d4a24c55198fa0d85f79f48b9c6aeaaa857e9aa7952`). It uses the licensed bed at -24 dB base and -30 dB under Ballad, with a 10-second lead, 5-second continuation, and 0.5-second fade.
- Automated audio analysis passed with no clipped samples or stitch warnings. Human opening QA accepted the corrected mix and required notice. The rendered voice segments are reusable for the full candidate.

## 2026-09-02 — full script-aligned listening QA accepted

- Assembled the complete version 0.2.2 candidate from 69 source segments, safely reusing the accepted opening segments and applying the recorded intro/outro music mix. The final candidate is `audio-artifacts/core-12-20260902T003203Z.mp3` (SHA-256 `bce5b3e32dcd442b0a2432fb74b05d601ffd4e32e05f4775322d34943e3f28c4`), with a runtime of 34:55.
- Automated analysis passed WAV/MP3 decode, 24 kHz mono format, duration agreement, 68 stitch boundaries with no discontinuity warnings, no clipped samples, and ffprobe validation of 18 embedded ID3 chapters. Full script-aligned human listening QA is accepted. Manual chapter review, publication-day source and link validation, and hosting validation remain pending.

## 2026-09-02 — manual chapter review accepted

- Human review accepted all 18 embedded chapter markers. The list begins at `00:00`, uses listener-facing section titles, and each marker starts before its corresponding material.
- The complete audio gate is closed. Publication-day source and link validation and hosting validation remain pending.

## 2026-09-02 — publication-day source and link validation passed

- Set the release timestamp to `2026-09-02T12:43:19Z`. Formal publication-day validation run `520bf84d-486d-4855-a331-97ba5c9b7eb3`, checked at `2026-09-02T12:46:27.358Z`, passed with 30 FAA sources, 30 listener-facing show-note links, 37 claims, and 122 immediate master-script source tags.
- The LLM source-relevance review was retained for the current package state and passed without unresolved source-support findings. The report binds the current source ledger, claims, master script, show notes, and show-note manifest. Hosting validation remains pending.
- Rebound the recorded human script approval to the current non-spoken production-status header after validation. The mechanically derived narration is byte-for-byte unchanged, so the accepted audio candidate remains bound to the same spoken text.

## 2026-09-02 — publication-day source validation follow-up required

- A refreshed publication-day review run `b2e5cdcd-35aa-4baf-a521-bdb91139fc0a` completed current source and link checks but failed closed on `upslope-fog-formation`. The cited Aviation Weather Handbook passage fully supports the physical formation mechanism, but not the authored statement that it can turn a broad terrain crossing or High Plains stop into a ceiling-and-visibility problem.
- Release, hosting validation, and staging are blocked until that spoken passage is narrowed to the cited mechanism or separated into source-pure passages with an additional exact source for the operational implication. The accepted audio candidate remains preserved but cannot be released until any resulting script and source-validation work is complete.

## 2026-09-02 — publication-day source-support follow-up resolved

- Incorporated the approved upslope-fog correction as three source-pure spoken paragraphs: the Aviation Weather Handbook supports the upslope-formation mechanism, the handbook supports fog as a surface-based visibility reduction, and the ACS supports the route-segment planning decision. Updated the reciprocal claim section mappings accordingly.
- Incorporated the approved crosswind-capability correction in Retrieval review: the learner now compares the charted component with airplane capability and avoids conditions that exceed it. The source is the existing Airplane Flying Handbook crosswind-capability passage.
- Re-ran the required script-review reset and mechanically regenerated `narration.md`. The user approved both precise spoken corrections.
- Final publication-day source-relevance run `6d2c6437-11d9-41f9-866f-27800e0f4cd5`, checked at `2026-09-02T13:06:36.915Z`, passed with 30 FAA sources, 30 listener-facing study links, 37 claims, and 124 immediate source tags. It has no unresolved citation-target, link, locator, claim, show-note, or source-tagged-passage findings, and it is bound to master-script SHA-256 `7be98abb068d9c6676bd1eea17c6c4e021e04255ae328dfa60c00631cb736eca`.
- Recorded human editorial approval against that exact master-script hash and verified the renderer’s 69-segment plan without sending an audio request. The prior audio candidate remains superseded; replacement audio, listening QA, chapter review, hosting validation, staging, release, and publication remain pending.

## 2026-09-02 — replacement audio QA accepted

- Rendered a 35:04 replacement candidate for the corrected, source-validated narration. The renderer reused 66 exact-matching segments and requested new audio only for segments 18, 19, and 64, which contain the approved source-support corrections.
- The replacement MP3 SHA-256 is `0773c19a3388b881fc5e63d25209a67aa0f7ffe7e03b5c7b375f820d9a7d137e`. Automated analysis passed WAV/MP3 decode, 24 kHz mono format, duration agreement, 68 stitch-boundary checks with no warnings, no clipped samples, and ffprobe validation of 18 embedded MP3 chapters.
- Focused script-aligned listening QA and manual chapter review are accepted. The prior 34:55 candidate remains superseded. Hosting validation, staging, release, and publication remain pending.

## 2026-09-02 — upslope-fog Retrieval review correction

- Replaced the incomplete Retrieval-review shorthand with the approved, source-complete wording: “Moist, stable air moving uphill can cool adiabatically to its dew point and form upslope fog.”
- Formal source-relevance run `2c6db98e-41e2-46a6-b076-e6988a0c4bb8`, checked at `2026-09-02T13:35:16.498Z`, passed with 30 FAA sources, 30 listener-facing study links, 37 claims, and 124 immediate source tags. The result is bound to master-script SHA-256 `66a1dfdc25f39a580290bf218eaf6602a23cd8a8337528531c7c6fe3b94c0819`.
- Rendered a 35:03 replacement candidate, reusing 67 exact-matching segments and rerendering only the short Retrieval-review prompt and its corrected Learner response. Automated WAV/MP3, stitch, clipping, and embedded-chapter checks passed. Focused listening QA and manual chapter review are pending.

## 2026-09-02 — upslope-fog audio correction accepted

- Focused listening QA accepted the rerendered Retrieval-review prompt and Learner response. The unchanged segments retain their prior accepted listening evidence; the replacement candidate now awaits only manual chapter review before final pre-hosting validation.
