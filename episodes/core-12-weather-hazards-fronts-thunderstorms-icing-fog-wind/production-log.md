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
