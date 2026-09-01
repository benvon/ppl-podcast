# Weather Theory: Pressure, Stability, Moisture, and Clouds — production log

## 2026-08-28 — package created

- Created from the standard episode template on `feature/core-11-weather-theory`.
- Status: planned.

## 2026-08-28 — initial source-led research and complete draft

- Completed by the requested current Sol drafting agent at high reasoning effort.
- Used FAA-S-ACS-6C PA.I.C, Weather Information, as the lesson outline, especially atmospheric composition and stability, temperature and heat exchange, moisture and precipitation, weather-system formation, clouds, risk management, implication analysis, and weather-information correlation.
- Used FAA-H-8083-25C Chapter 12, Weather Theory, as the primary technical source. Confirmed that the current October 20, 2025 PHAK MOSAIC addendum does not modify Chapter 12.
- Verified the official FAA handbook and ACS listings and inspected the current FAA PDFs page by page while establishing deep links and source boundaries.
- Completed a 13-source page-level ledger and reciprocal 28-claim inventory. Material claims map to named script sections, and every source maps back to supported claims.
- Resolved the principal teaching boundaries before drafting: pressure versus temperature versus density; parcel cooling versus the environmental temperature profile; lift versus instability; water-vapor amount versus relative humidity versus dew point; saturation versus visible cloud; approximate cloud base versus reported ceiling; and pressure or cloud tendencies versus a complete VFR decision.
- Kept detailed wind circulation, fronts, weather-product decoding, legal cloud-clearance minimums, thunderstorm and icing procedures, fog classification, and aircraft-specific procedures out of scope. The draft includes only the physical bridges needed for later episodes.
- Completed a 5,133-spoken-word initial draft targeting approximately 42 minutes. It uses the standard Opening, Disclaimer, Podcast introduction, and What the ACS is asking you to connect sequence, followed by a causal lesson chain and the series-standard Retrieval review.
- Wrote every spoken paragraph on one physical Markdown line. Learner turns follow established premises, and Announcer transitions are short repetitions of natural section headings.
- Added only two spoken visual-aid pointers; each exactly matches a plainly labeled show-note link to the cited PHAK page. A third pressure-reference figure is available in the show notes without an unnecessary spoken interruption.
- Generated `narration.md` mechanically from the source-tagged `master-script.md`. Completed episode and hosting metadata, the research packet, show notes and reciprocal manifest, QA state, and the not-rendered audio state.
- No paid LLM relevance review was called. No audio was rendered, staged, handed to hosting, or published. No pull request was opened.
- Status: complete initial source-led draft. Independent spoken-script review, human editorial approval, formal LLM source-relevance validation, and every audio and release gate remain pending.

## 2026-08-28 — independent spoken-script review resolved

- The independent non-drafting review was completed for grammar, complete thoughts, internal callbacks and call-forwards, first-listen comprehension, and evidence boundaries. All required findings were resolved in version 0.1.1.
- Added the missing causal bridge after saturation: a saturated rising parcel cools more slowly, and when that leaves it warmer and less dense than surrounding air, buoyancy can support continued vertical development in unstable air. Mapped the paragraph through source-specific reciprocal claims across PHAK Chapter 12, pp. 12-3, 12-12, and 12-13.
- Simplified the dew-point definition to the first-listen condition that air is cooled without changing its water-vapor amount.
- Removed the unexplained “stated convergence rate” reference. The script retains the qualitative temperature-dew point convergence relationship and points listeners to the exact PHAK figure and worked example without teaching an unintroduced formula.
- Replaced the unsupported list of possible exceptions around pressure systems with a bounded teaching statement: high- and low-pressure associations are broad tendencies, while current observations and forecasts provide the route-and-time assessment.
- Removed the unsupported high-thin-cloud implication and retained only source-mapped low-layer and growing-tower consequences.
- Replaced “Cloud families are clues, not vocabulary trophies” with the plain heading and matching Announcer line “What cloud structure can tell you.”
- Synchronized the source ledger, reciprocal 29-claim inventory, show-notes manifest, research packet, episode and hosting metadata, QA checklist, and narration derivative. The reviewed narration contains 5,111 spoken words.
- Network-backed deterministic validation run `e0619498-450c-493b-bbfb-30b3619cdfcd` passed at `2026-08-28T20:01:18.590Z` for all 13 FAA sources and all 13 listener-facing show-note links. Claim and show-note mappings passed for all 29 claims; LLM review was disabled and remains pending.
- Human editorial approval, formal LLM source-relevance validation, and every audio and release gate remain pending. No paid LLM call, audio render, staging, publication, or pull request was performed.

## 2026-08-30 — user-directed parcel and pressure-reference clarification

- Revised only “The atmosphere is the working material” and “Pressure is the weight of the air above,” preserving the prior independently reviewed lesson scope and every unaffected section.
- Preserved the user's two-part atmosphere framing, the added practical emphasis that private pilots fly primarily in the troposphere, the standard-atmosphere tropopause context, and the premise that a pressure value needs a reference. Corrected the nonstandard phrase “private pilot license certificate holder” to “private pilot.”
- Defined a parcel early as an imaginary local region of air that may surround, approach, or recede from the aircraft but is not created by it. Explained that its analytical boundary has no fixed physical wall or prescribed numerical size and that its useful scope follows the phenomenon while assigned properties remain approximately uniform.
- Reorganized the parcel explanation for audio: it now completes the parcel's lower-pressure, expansion, and cooling sequence before introducing the parcel-versus-environment comparison, then explicitly signs forward to the later convection and stability treatment.
- Expanded the pressure-reference mental map without adding instrument procedures or weather-product decoding. The script now separates units and unit conversion, actual station pressure, reduced sea-level pressure, MSL and AGL height references, airport elevation, local altimeter setting, standard-atmosphere pressure altitude, and temperature-corrected density altitude, explaining the distinct question each reference answers.
- Added FAA-H-8083-28A, Aviation Weather Handbook, at p. 4-3 and pp. 8-3 through 8-13, plus exact anchored Pilot/Controller Glossary definitions for ALTITUDE and AIRPORT ELEVATION. The synchronized ledger now contains 20 sources, the reciprocal inventory contains 35 claims, and the show-notes manifest contains 20 source links.
- Regenerated the narration derivative and synchronized research, show notes, episode and hosting metadata, QA state, and package version 0.1.2. The narration contains 5,746 spoken words with an approximately 45-minute target.
- Network-backed deterministic validation run `2936c70b-1c1f-4d8c-a356-29686e439afd` passed at `2026-08-30T13:39:32.531Z` for all 20 FAA sources and all 20 source-linked show-note entries. All 35 claim mappings and all show-note mappings passed; LLM review was disabled and remains pending.
- The narration derivative check, 83 repository tests, precommit disclosure and secret check, and diff whitespace check passed. The pre-host package-only command was also exercised and stopped at its intended later-stage gates: human editorial approval and paid source-relevance review are not complete, so this package is not yet eligible for an episode pull request.
- Human editorial approval, formal LLM source-relevance validation, and every audio and release gate remain pending. No paid LLM call, audio render, staging, publication, push, or pull request was performed.

## 2026-08-31 — user-directed structural rewrite

- Rebuilt version 0.2.0 around an early spoken map of pressure references, heating and density, rising and descending air, stability, moisture and saturation, and visible cloud formation. Reconstructed the complete chain in “Retrieval review” and added a direct call-forward to Episode 12, *Weather Hazards: Fronts, Thunderstorms, Icing, Fog, and Wind*.
- Preserved the user's local script edits as authoritative input: the explicit convection-and-stability call-forward remains in “The atmosphere is the working material”; the stable and unstable explanation retains the user's ball-in-a-bowl and ball-on-an-upside-down-bowl mental pictures; and the user’s deletion of the unsupported route-generalization sentence in “Moisture becomes visible at saturation” remains intact.
- Made one material factual correction to user-proposed wording. The proposed phrase “1,013.2 millibars of mercury” mixed a pressure unit with the physical basis of inches of mercury. The script now says that 29.92 inches of mercury and 1,013.2 millibars are the same standard-atmosphere pressure reported in different units.
- Added and reorganized the headings “The map for this lesson,” “Pressure and its reference systems,” “How pressure references appear in flight information,” “Heating changes density and starts motion,” “Rising air, stability, and convection,” “Clouds make the chain visible,” and “From theory to Episode 12.” Rewrote “The atmosphere is the working material,” “Moisture becomes visible at saturation,” “Four paths to saturation,” “What cloud structure can tell you,” “Two mornings, two outcomes,” and “Retrieval review” to support the new causal order.
- Defined the FAA-standard term air parcel as an imaginary volume with approximately uniform properties, explained that the selected scale follows the question, and separated changes within the selected parcel from the later parcel-versus-environment comparison. The script does not suggest that the airplane creates the parcel, that the parcel is necessarily the air immediately around the airplane, or that parcel scales interact.
- Rebuilt pressure references from physical pressure to station pressure, normalized sea-level pressure, the fixed standard atmosphere, and the local altimeter setting. Moved MSL and AGL into the reporting-and-use section; distinguished raw station pressure from altimeter setting; and bounded METAR, ASOS/AWOS, ATIS, ATC, pressure-altitude, and density-altitude treatment to conceptual orientation.
- Rebuilt stability and convection as one first-listen story. Stability is defined before parcel comparison; a warmed-surface hypothetical supplies the purpose; adiabatic, lapse rate, buoyancy, stable, and unstable follow only after the listener understands the comparison. The script explicitly says the learner does not measure a lifted parcel or calculate its path.
- Carried the moisture mechanism through invisible water vapor, cooling toward dew point without changing water-vapor amount, saturation, condensation or deposition on nuclei, droplets or ice crystals, light scattering, and a visible cloud. The completed narration contains 6,000 spoken words and retains an approximately 45-minute target.
- Expanded the ledger from 20 to 29 authoritative federal sources and the reciprocal inventory from 35 to 42 claims. New page-level anchors cover the standard atmosphere, METAR pressure and cloud-height groups, parcel stability comparison, and convection in FAA-H-8083-28A; current AIM ASOS/AWOS guidance; current FAA ATC altimeter-setting and ATIS procedures; and NOAA NESDIS support for cloud-particle light scattering.
- Because this is a substantial rewrite, the independent review completed for version 0.1.1 was not treated as approval of version 0.2.0. A fresh non-drafting spoken-script review checked the full revised script for grammar, complete thoughts, referents, callbacks, call-forwards, dialogue readiness, section transitions, and first-listen comprehension. Its three required findings were resolved: pressure is now defined as force per unit area; ATIS content is bounded to airports where ATIS is provided; and stability now names upward motion, rather than the displacement itself, as weakening. Two optional suggestions were accepted by splitting a weak convection/stability referent and restoring the complete saturation-to-cloud-particle chain. The optional suggestion to remove an Episode 12 mention was declined because the user explicitly requested repeated top-level hooks and a direct next-episode path.
- After review resolution, network-backed deterministic validation run `ed15cd8a-4741-4de0-946b-c0b386df3ac7` passed at `2026-08-31T14:39:01.369Z` for all 29 source links and 29 listener-facing show-note links; all 42 claim mappings and all show-note mappings passed with LLM review disabled. Narration regeneration, repository tests, precommit, and diff checks are recorded below.
- Regenerated `narration.md` mechanically and verified exact equality with the master-script derivative. Package structure checks passed for the 18-section opening order, teaching-section Announcer headings, all 70 master-script source tags, one physical line per spoken paragraph, 6,000-word metadata agreement, YAML parsing, and the current narration derivative. All 83 repository tests, the precommit disclosure and secret check, and `git diff --check` passed.
- The package-only pre-host check was run as a non-final shape probe. It accepted the version agreement, current narration, independent review record, deterministic report timestamp, and structural records, then stopped only at the intended later-stage gates: human script approval and paid source-relevance review are not complete. No attempt was made to bypass those gates.
- Human editorial approval, paid source-relevance review, pre-host package approval, audio render and listening QA, staging, publication-day verification, hosting validation, push, and pull request remain pending. No paid LLM call, audio render, staging, publication, push, or pull request was performed.

## 2026-08-31 — targeted theory and retrieval refinement

- Refined version 0.2.1 without changing the structural rewrite's teaching order. “The map for this lesson” now identifies the reported and forecast values directly; “The atmosphere is the working material” clearly separates pressure-driven changes within a parcel from the later parcel-versus-environment stability comparison; and “Rising air, stability, and convection” states that the temperature comparison is used to evaluate atmospheric stability.
- Expanded “Retrieval review” into a short spoken exchange that repeats the cloud-name clues and their meanings: cumulus or cumulo for heaped or built-up forms, stratus or strato for layers, cirrus for fibrous or ringlet forms and cirro for the high-cloud family, and nimbus for rain-bearing forms.
- Audited the current FAA-S-ACS-6C weather-theory elements against the episode boundary. The audit found one missing item inside scope: the script described unequal heating without naming the heat-exchange vocabulary in PA.I.C.K3c. “Heating changes density and starts motion” now defines radiation, conduction, convection, and advection inside the existing causal story. Wind, fronts, turbulence, thunderstorms, icing, fog, frost, and visibility hazards remain explicit Episode 12 material rather than silent omissions.
- A second agent that did not draft the revision checked grammar, complete thoughts, callbacks, call-forwards, and first-listen comprehension. Its required findings were the missing heat-exchange vocabulary and an overcompressed cloud-root recap that overstated `cirro`; both were corrected, and the reviewer confirmed the resolutions without identifying another material issue.
- Added renderer-only pronunciation transforms for ASOS as “AY-sohs,” AWOS as “AY-wahs,” and ATIS as “AY-tis,” with renderer version 12, voice-profile version 6, documentation, and a regression test. The script retains normal written initialisms.
- Migrated all Aviation Weather Handbook references used by this package from superseded FAA-H-8083-28A to the current FAA-H-8083-28B and updated the exact PDF page anchors and printed-page locators.
- Regenerated `narration.md` mechanically. The current script contains 6,172 spoken words. The synchronized package contains 31 authoritative sources, 43 reciprocal claims, and 31 listener-facing source links.
- Network-backed deterministic validation run `f6a5ea9b-ff45-4d3d-b90a-4d909c3fd5f6` passed at `2026-08-31T17:41:03.118Z` for all 31 source links and all 31 listener-facing source links; all 43 claim mappings and show-note mappings passed with LLM review disabled.
- Human editorial approval, paid source-relevance review, final pre-host approval, audio render and listening QA, staging, publication-day verification, hosting validation, push, and pull request remain pending. No paid LLM call, audio render, staging, publication, push, or pull request was performed.

## 2026-08-31 — human script approval

- The user accepted the version 0.2.1 script after the targeted theory and retrieval refinements. Human editorial approval is complete. The required paid LLM source-relevance review remains the next pre-render gate; no audio render was attempted before that review.

## 2026-08-31 — formal source-relevance validation complete

- The first LLM relevance pass correctly failed closed on broad ledger claims that bundled facts from different cited sections. The spoken script was unchanged. The claim inventory was split into source-sized propositions, the exact FAA source pages for altimeter setting, pressure altitude, density altitude, and cloud-name classifications were corrected, and an official National Weather Service dew-point definition was added for the constant-moisture explanation.
- The review also exposed a validator defect for long FAA HTML pages: cached HTML text was reused across distinct cited fragments, so a later glossary term could be assessed from the first term's excerpt. The validator now extracts the requested HTML fragment and recomputes that fragment-specific excerpt after a cache hit. Regression tests cover both direct fragment extraction and two fragments sharing one cached fetch.
- Final run `5a178085-59da-45f7-9cdf-e46d085c69c5` passed at `2026-08-31T20:21:10.054Z`: all 34 cited source links, all 34 listener-facing show-note links, all deep-citation and mapping checks, and all 55 LLM claim-level relevance assessments support the current version 0.2.1 package. Source-relevance review is complete. Audio, listening QA, staging, publication, and pull-request work remain pending.

## 2026-08-31 — full candidate render

- The user accepted the five-segment opening preview and the first ASOS/AWOS/ATIS pronunciation segment. Full candidate `core-11-20260831T202200Z.mp3` reuses those rendered voice segments unchanged.
- The complete 70-segment candidate uses the established music bed and has an automated quality pass: decodable 24 kHz mono WAV and MP3, matching 2,508.99-second duration, no clipped samples, no stitch-discontinuity warnings across 70 segment boundaries, and 18 embedded MP3 chapters verified with `ffprobe`.
- At candidate creation, full script-aligned listening QA and manual chapter-marker review remained pending.

## 2026-08-31 — full listening QA accepted

- The user completed and accepted the full script-aligned listening QA for `core-11-20260831T202200Z.mp3`, including the accepted opening and required production notice. The candidate remains bound to its MP3 checksum, current narration derivative, quality report, and render manifest.
- Manual chapter-marker review remains the next audio gate; publication-day source verification and hosting handoff validation remain later release gates.

## 2026-08-31 — publication-day validation and hosting readiness

- The user accepted manual review of the 18 MP3 chapter markers. The full candidate’s listening and chapter QA are complete.
- Publication-day validation run `9e34149f-33b7-4115-a949-03946951fa43` passed at `2026-08-31T22:38:49.489Z`: all 34 cited source links, 34 listener-facing show-note links, exact locators, and all 55 source-relevance assessments support the unchanged version 0.2.1 package.
- The release timestamp is `2026-08-31T22:32:37Z`. Episode and hosting metadata now bind that timestamp, the 41:49 candidate runtime, the MP3 checksum, and the chapter-review page. Final pre-hosting validation and the episode pull request remain next.
- Final pre-hosting validation then passed against the sealed MP3, render manifest, audio-quality report, embedded chapters, current narration derivative, release metadata, and publication-day source report. The full repository test suite (85 tests), disclosure and secret check, and whitespace check also passed.
- The non-final `--package-only` shape check also passed before the episode pull request. The validator now accepts all recognized package lifecycle states for that structural check, while the separate full pre-hosting check remains the release-readiness authority.

## 2026-09-01 — source-review repair and revised-audio gate

- PR source-review findings exposed two stale source identifiers and several cases where the claim inventory was more precise than the immediately tagged spoken prose. Replaced the obsolete pressure source tag, added the missing temperature-advection tag, restored the dew-point constant-pressure condition, and kept the source ledger, claim inventory, show-notes manifest, and script aligned.
- Strengthened the validator so every source tag in `master-script.md` must name a ledger source and follow spoken prose, every claim must have a listed script section with a matching source tag, and the LLM relevance request receives that source-tagged prose. The validation report now records and hashes `master-script.md`, preventing a passing report from being reused after the authored lesson changes.
- Corrected the show-notes version comparison to require an exact version token; version `0.2.1` no longer accepts a `0.2.10` review record.
- Source-bound relevance-validation run `ffcf3135-2e57-42c0-9e43-92f40b706dd5` passed at `2026-09-01T00:05:11.153Z`: all 34 cited sources, 34 show-note links, 54 claims, and 79 tagged passages support the version 0.2.2 package.
- The prior version 0.2.1 audio candidate is intentionally superseded because the narration changed. A revised candidate must be rendered, technically checked, listened to against the script, and chapter-reviewed before this episode can return to hosting readiness.

## 2026-09-01 — final source-bound candidate rendered

- Final source-bound relevance-validation run `6c7c22de-8791-49e2-9777-2ae6e725fd6b` passed at `2026-09-01T00:30:07.134Z`: all 34 cited sources, 34 show-note links, 54 claims, and 78 source-tagged passages support version 0.2.2.
- Rendered candidate `audio-artifacts/core-11-20260901T003413Z.mp3` from the current `narration.md` derivative. It reuses 60 segments whose exact Realtime input matched and re-rendered 10 corrected segments. Automated quality analysis passed 24 kHz mono decode, duration agreement, all 70 stitch-boundary checks with no warning, no clipped samples, and embedded MP3 chapter validation.
- The candidate is checksum-bound to `e51b49c25d1bb2293a3c8c56015de8ce8a903a2f96d59b157af38a6bcbe24667`. Full script-aligned human listening QA and manual chapter review remain pending.

## 2026-09-01 — retrieval-review source coverage repair

- PR review identified that the Retrieval review restated station pressure, normalized sea-level pressure, altimeter setting, pressure altitude, and density altitude without source tags or claim-section coverage. Added the five exact Aviation Weather Handbook source tags and included `Retrieval review` in the corresponding claim mappings.
- Source relevance exposed two compressed restatements outside that new coverage: the standard-pressure wording now preserves its sea-level reference, and the ACS risk-management summary now includes identifying, assessing, and mitigating risk. The pressure retrieval recap now retains the defined altimeter-setting, pressure-altitude, and density-altitude relationships.
- These spoken changes supersede the version 0.2.2 candidate. The source-bound relevance-validation run `ab188dc4-ee88-41b1-b316-0d01bdd1e935` passed at `2026-09-01T02:05:52.389Z` for version 0.2.3: all 34 cited sources, 34 show-note links, 54 claims, and 87 tagged passages support the current package. A new audio render and its listening and chapter QA are required before hosting.

## 2026-09-01 — retrieval-review contract and durable review lesson

- A review of the Core 11 PR findings found one repeatable process failure: the Retrieval review was treated as a citation-free summary even though it restated factual instruction. That allowed source tags and claim-section mappings to cover the first teaching occurrence while omitting later spoken recaps.
- Reworked every factual Retrieval review recap into an exact, source-bound restatement. Its claim mappings now include `Retrieval review`, and its source tags immediately follow the paragraph they support. The listener-facing wording also now preserves the full heating/density, stability, moisture, saturation, and cloud-development relationships rather than compressing them.
- Added a source-contract test that fails an untagged Instructor or Learner paragraph in `Retrieval review`, plus matching drafting guidance and template QA. From this revision forward, source-led drafting and source-relevance review must treat a retrieval recap as new spoken instructional evidence, before human editorial review and well before a PR is opened.
- The first version 0.2.4 relevance run caught one final compressed ACS recap: risk identification, assessment, and mitigation must cover go/no-go as well as continue/divert decisions. The following version 0.2.5 run caught another compressed stated claim: an applicable METAR remark is the `SLP` group, reported in millibars. Version 0.2.6 then exposed a source-boundary problem: the standard-atmosphere sentence mixed its own reference with 29.92 and pressure-altitude facts. Version 0.2.7 separates those facts under their respective sources and requires a fresh clean relevance review, a new audio render, script-aligned listening QA, and chapter review before hosting.
- The final version 0.2.7 source-bound relevance-validation run `7bafabc4-6b52-4b38-aeb5-0e220cae5775` passed at `2026-09-01T02:45:13.179Z`: all 34 cited sources, 34 show-note links, 54 claims, and 98 source-tagged spoken passages support the current package. No audio candidate exists for this revision; rendering and human audio QA remain later gates.

## 2026-09-01 — SLP-group definition

- Added a brief first-use definition: `SLP` means sea-level pressure, and an SLP group is the compact METAR code for the normalized sea-level-pressure value in millibars. Split the preceding METAR paragraph at the source boundary so the altimeter and cloud-height statements remain bound to their Aviation Weather Handbook source and the SLP explanation remains bound to its own source.
- This spoken revision creates version 0.2.8 and requires a fresh source-relevance review before rendering.

## 2026-09-01 — version 0.2.8 source review

- Source-bound relevance-validation run `01e9735f-9389-406d-8f41-f1f97762981b` passed at `2026-09-01T12:34:06.872Z`: all 34 cited sources, 34 show-note links, 54 claims, and 98 source-tagged spoken passages support version 0.2.8, including the first-use definition of the SLP group.

## 2026-09-01 — final source-bound script correction

- Subsequent review identified two qualifiers that exceeded their cited PHAK passages: an implied ordered progression from towering cumulus to cumulonimbus, and a restriction of the temperature/dew-point cloud-base estimate to convective clouds. The narration now says cumulus can develop into towering cumulus or cumulonimbus and describes the estimate as a general approximate cloud-base height.
- Source-bound relevance-validation run `e9f98f05-945f-4662-8cbd-98f431ac6da7` passed at `2026-09-01T12:59:39.963Z`: all 34 cited sources, 34 listener-facing show-note links, 54 claims, and 98 source-tagged spoken passages support version 0.2.12. The prior opening preview remains applicable because its opening segments did not change; a full version 0.2.12 candidate still requires rendering, listening QA, and chapter review.

## 2026-09-01 — version 0.2.12 candidate render

- Rendered `audio-artifacts/core-11-20260901T130149Z.mp3` from the source-bound version 0.2.12 narration derivative. The renderer reused only prior segments whose complete Realtime input identity matched; it regenerated the changed source-bound segments and rebuilt all later timing from the stitched audio.
- Automated analysis passed a 24 kHz mono decode, duration agreement, 70 stitch-boundary checks with no warnings, no clipped samples, and `ffprobe` verification of 18 embedded MP3 chapters. The candidate SHA-256 is `1492c81737cfee19f97898a136259adce1637b64ca1d7ae2c0fafd3696962691` and its duration is 42:43. Full script-aligned listening QA and manual chapter review remain pending.

## 2026-09-01 — version 0.2.12 listening QA accepted

- The user completed and accepted full script-aligned listening QA for `audio-artifacts/core-11-20260901T130149Z.mp3`. The accepted candidate remains bound to its MP3 checksum, current narration derivative, render manifest, and automated audio-quality record.
- Manual review of the embedded chapter markers and publication-day validation remain pending.

## 2026-09-01 — version 0.2.12 chapter review accepted

- The user manually reviewed and accepted the 18 embedded MP3 chapter markers for `audio-artifacts/core-11-20260901T130149Z.mp3`. The release timestamp is set to `2026-09-01T16:14:05Z`; publication-day source and link validation is next.

## 2026-09-01 — publication-day source validation

- Publication-day source-validation run `1ed826f4-d44c-4fa5-8f46-a47be3bf69a5` passed at `2026-09-01T16:19:16.002Z`: all 34 cited sources, 34 listener-facing show-note links, 54 claims, and 98 source-tagged spoken passages support the released version 0.2.12 package. This report is bound to the final ready-for-hosting master script, source ledger, claim inventory, show notes, and show-note manifest.
