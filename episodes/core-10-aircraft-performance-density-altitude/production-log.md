# Aircraft Performance and Density Altitude — production log

## 2026-08-26 — package created

- Created from the standard episode template on `feature/core-10-aircraft-performance-density-altitude`.
- Confirmed the production-plan topic, title, track, and primary anchors before research.
- Status: planned.

## 2026-08-26 — initial source-led research and complete draft

- Completed by the requested current Sol drafting agent at high reasoning effort.
- Used FAA-S-ACS-6C Task PA.I.F, Performance and Limitations, as the lesson outline. The episode directly covers chart and data use, atmospheric conditions, technique, configuration, airport environment, loading, aerodynamics, airplane limitations, and possible differences between calculated and actual performance.
- Used FAA-H-8083-25C Chapter 11 as the primary technical source. The ledger splits the handbook into page-level entries for performance-data boundaries, pressure and density altitude, humidity, climb, runway condition and slope, takeoff, landing, performance-chart interpretation, interpolation, and climb/cruise planning.
- Added only current 14 CFR § 91.103 to establish the typical private-pilot preflight requirement to know intended-airport runway lengths and applicable takeoff and landing performance information. The official eCFR developer API reported Title 14 current through August 17, 2026.
- Verified access to the official FAA ACS and PHAK PDFs and visually inspected the density-altitude chart, chart-conditions example, interpolation example, and landing-chart page while establishing deep links and listener-facing labels.
- Completed a 20-source page-level ledger and reciprocal 33-claim inventory. Each material claim maps to a named script section and each source maps back to its supported claims.
- Resolved the teaching boundaries before drafting: airport elevation versus pressure altitude; pressure altitude versus density altitude; high density altitude versus dense air; humidity as a contributing density factor rather than an improvised correction; sample handbook charts versus the actual airplane's POH or AFM; ground roll versus obstacle-clearance distance; climb angle versus climb rate; takeoff inputs versus arrival inputs; and a calculated estimate versus actual performance.
- Kept aircraft-specific speeds and procedures, generic numerical runway margins, transport-category requirements, obstacle-departure design, and electronic-flight-bag product workflows out of scope.
- Completed a 4,830-spoken-word initial draft within the requested 30-45 minute episode range. The script uses the standard Opening, Disclaimer, Podcast introduction, and What the ACS is asking you to connect sequence. Ballad Announcer material is limited to the introduction, short heading-matched transitions, and the standard outro.
- Drafted each spoken paragraph on one physical Markdown line, used restrained Instructor/Learner dialogue, and included a practical POH/AFM planning workflow without transferring sample data into an aircraft-specific procedure.
- Generated `narration.md` from the source-tagged `master-script.md` with the repository derivation tool. Completed episode and hosting metadata, show notes and reciprocal manifest, the research packet, QA state, and the not-rendered audio manifest.
- No audio was rendered, staged, handed to hosting, or published. No release pull request was opened.
- Formal deterministic and LLM source-relevance validation were not run because both are pre-render gates after independent editorial review and script approval.
- Status: complete initial source-led draft. Independent spoken-script review by a non-drafting agent, human editorial review, formal source validation, and every audio and release gate remain pending.

## 2026-08-26 — independent adversarial review resolved

- Received and resolved the independent non-drafting review of first-listen clarity, source boundaries, complete thoughts, and series consistency.
- Renamed the final lesson section and Announcer line from “Closing review” to the series-standard “Retrieval review.”
- Replaced vague pressure references with the usable inputs: the altimeter setting used to determine pressure altitude, and the departure and arrival pressure-altitude inputs required by the applicable takeoff and landing charts.
- Kept angle of climb as altitude gained per horizontal distance and rate of climb as altitude gained per time. Added the explicit planning connection that distance over the ground requires the corresponding groundspeed, including wind effect; added one reciprocal teaching-explanation claim to the existing PHAK climb source.
- Clarified the two § 91.103 performance-information paths in plain language: use the takeoff and landing data in an approved flight manual when such a manual is required, and use other reliable aircraft-appropriate information for other civil aircraft.
- Removed the displaced-threshold and declared-distance extension because it was outside the cited landing-chart source. Rephrased the remaining landing sensitivity check around airplane and pilot-technique differences from the chart's stated conditions and mapped that section to the existing performance-chart boundary claim.
- Replaced broad or indirect wording about approved data, interpolation, planning margin, runway-versus-climb planning, and in-flight comparison with direct POH/AFM-centered language.
- Changed the sensitivity example to the unambiguous “a smaller headwind—or a tailwind” condition.
- Regenerated `narration.md` from the revised source-tagged master script. The reviewed narration contains 4,900 spoken words.
- Preserved the ACS-centered structure, source set, 30-45 minute scope, and the no-render/no-publication gates. Human editorial approval, formal source-relevance validation, audio work, and release work remain pending.

## 2026-08-27 — focused flight-context and first-listen revision

- Preserved the user's direct edits to `master-script.md` as authorized revision input: the revised sample-chart wording, simplified density-altitude mental model, intended-runway wording, ground-referenced climb-angle definition, and expanded weight/drag explanation. Corrected the evident “angle of attach” typo to “angle of attack” without removing the added causal point.
- Kept FAA-H-8083-25C Chapter 11 as the conceptual teaching spine and retained all relevant ACS, PHAK, and eCFR anchors. Added complementary FAA-H-8083-3C flight context at Chapter 6, Prior to Takeoff, p. 6-1, and Chapter 9, Introduction, p. 9-1.
- Added reciprocal AFH claims for predicting takeoff and climb performance before going to the airplane and for keeping landing configuration, airspeeds, and related information under the actual airplane's AFM/POH. Verified that the current October 2025 AFH addendum does not alter either cited passage.
- Added PHAK Chapter 9, p. 9-2, to teach the typical § 91.103 document question in plain language. The learner checks the actual POH/AFM title and preliminary pages for approval status and airplane applicability, confirms them with the instructor or operator, and then uses the performance-information path established by that documentation.
- Added an explicit pressure-temperature-humidity synthesis: pressure establishes pressure altitude, temperature supplies the basic density-altitude correction, and moisture can reduce density and performance even when the basic method has no humidity entry.
- Rebuilt the thinner-air explanation around one mental picture: less normally aspirated engine power and propeller thrust weaken acceleration, higher true speed is needed for the wing's aerodynamic condition, takeoff roll lengthens, and climb performance decreases. The planning response now occurs before the takeoff roll while load, time, runway, or airport can still change.
- Added actual-airplane chart reminders when the lesson moves among takeoff-distance, climb, cruise, and landing data.
- Established early that each leg is its own flight for performance planning. Rewrote the landing section as a distinct operation using the landing-distance chart, arrival weight and weather, landing-runway conditions, and landing-specific risks rather than as a reversal of takeoff planning.
- Replaced the load-reduction phrase with specific passenger and baggage choices while preserving required fuel, and named the takeoff, climb, and landing outputs in the repeatable flow.
- Reframed calculated performance throughout as a disciplined estimate tied to the quality of the airplane data, inputs, stated conditions, and technique—not a guarantee.
- Updated the source ledger to 23 page-level sources, the reciprocal inventory to 38 claims, and the show-notes manifest to 23 listener-facing links. Regenerated `narration.md`; the reviewed revision contains 5,295 spoken words and remains within the series' 30-45 minute target range.
- Deterministic mapping validation passed for all 23 sources, 38 claims, and 23 show-notes links. Structural validation confirmed the standard four-section opening, 18 headings, the series-standard Retrieval review, one physical line per spoken paragraph, metadata word-count agreement, and exact `narration.md` derivation. `npm test` passed all 73 tests.
- No audio was rendered, staged, handed to hosting, or published. No release pull request was opened. Human editorial approval, required LLM source-relevance validation, audio work, and release work remain pending.

## 2026-08-27 — formal source-relevance findings resolved

- Preserved the user's authorized `master-script.md` revisions and the established source roles: PHAK Chapter 11 remains the conceptual teaching spine, AFH Chapters 6 and 9 remain complementary flight-context sources, and the ACS and eCFR anchors remain in place.
- Incorporated the current eCFR Title 14 snapshot through August 25, 2026 supplied by the formal validation pass. The preflight runway/performance claim now maps only to § 91.103; PHAK Chapter 9, p. 9-2, maps only to identifying POH/AFM approval status and airplane applicability.
- Replaced the combined climb teaching claim with exact reciprocal support. PHAK Chapter 11, p. 11-7, supports only the angle-versus-rate distinction. Current AIM 5-4-21(b) supports the groundspeed-based conversion between climb gradient and rate, and PHAK Chapter 8, p. 8-9, supports the headwind/tailwind effect on groundspeed.
- Split runway condition from runway gradient. PHAK Chapter 11, p. 11-12, supports surface and contamination effects; p. 11-13 now independently supports the stated upslope and downslope takeoff and landing effects.
- Narrowed the broad multi-leg rule. PHAK landing-chart support now covers only landing outputs and expected landing weight after fuel use. The script instead applies § 91.103's before-beginning-a-flight duty when an itinerary includes a later flight, and tells the listener to use information concerning that later flight.
- Bumped the package to version 0.1.3, synchronized the research packet, claims, sources, show notes, manifest, metadata, and QA checklist, and regenerated `narration.md`. The revision contains 5,378 spoken words and remains within the 30-45 minute target range.
- Deterministic dry validation passed for all 26 sources, 39 claims, and 26 show-notes links. Structural validation confirmed the standard four-section opening, 18 headings, Retrieval review, 5,378 spoken words, one physical line per spoken paragraph, metadata agreement, and exact narration derivation. `npm test` passed all 73 tests, the pre-commit disclosure/secret check passed, and `git diff --check` passed. The paid LLM relevance gate was intentionally not rerun; it remains required before audio render.
- No audio was rendered, staged, handed to hosting, or published. No release pull request was opened.
