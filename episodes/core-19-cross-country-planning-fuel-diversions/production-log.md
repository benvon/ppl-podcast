# Cross-Country Planning, Fuel, and Diversions — production log

## 2026-09-20 — package created

- Created with the repository episode scaffold on `feature/core-19-cross-country-planning`.
- Confirmed the production-plan identity: Core 19, *Cross-Country Planning, Fuel, and Diversions*, core track, anchored in the ACS, PHAK Chapters 11 and 16, and 14 CFR 91.103.
- Status: draft.

## 2026-09-20 — current source-led research foundation

- Confirmed FAA-S-ACS-6C remains the current Private Pilot for Airplane Category ACS on the FAA ACS publication page. Mapped PA.I.D Cross-Country Flight Planning, PA.I.F Performance and Limitations, and PA.VI.C Diversion to separate page-bounded ledger entries.
- Inspected the current FAA-H-8083-25C Chapter 16 pages for navigation planning, time-distance-groundspeed and fuel calculations, airport and flight-planning information, aircraft-data and fuel-stop planning, flight-log calculations, and in-flight updates.
- Inspected the current FAA-H-8083-25C Chapter 11 pages for AFM/POH performance data, climb planning, and cruise fuel-flow outputs; Chapter 7 for the preflight fuel-quantity cross-check; and Chapter 2 for situational-awareness and workload management.
- Checked exact current eCFR sections 91.103, 91.151, and 91.153. The Title 14 reader displayed content current through September 17, 2026 when researched on September 20, 2026.
- Checked the current AIM Basic with Changes 1, 2, and 3, effective July 9, 2026, for VFR flight-plan filing, activation, and closure responsibility.
- Built a reciprocal ledger of 20 page- or section-bounded sources and 21 atomic claims. Formal source retrieval and the two-pass OpenAI source-relevance review remain pending.

## 2026-09-20 — first complete source-tagged draft

- Reviewed Episodes 16 through 18 for the established scenario-led teaching voice, opening order, source-tagging pattern, retrieval-review structure, restrained dialogue, and first-listen pacing.
- Reused the fictional Meadow Ridge-to-Harbor Field route introduced in Episode 18 as continuity, without copying an episode package or claiming real-airport data. Core 19 supplies the previously deferred cross-country integration: aircraft performance, fuel, alternatives, in-flight comparison, and diversion.
- Built the lesson in operational order. The pilot prepares current route, weather, airport, airplane, and fuel inputs; computes climb, cruise, arrival, reserve, and a personal fuel floor; prepares Pine Valley before departure; compares actual groundspeed, fuel use, and weather with the plan; turns promptly toward Pine Valley; then refines the diversion and updates and closes the VFR flight plan.
- Kept all airplane, airport, weather, performance, and numerical scenario values explicitly fictional. The script distinguishes the exact 14 CFR 91.151 departure minimum from the scenario’s more conservative one-hour personal landing-fuel floor.
- Produced the source-tagged `master-script.md`, mechanically derived `narration.md`, listener-facing show notes, reciprocal show-notes manifest, episode metadata, hosting metadata, and research packet. The narration derivative contains 4,710 spoken words, consistent with the 30–45 minute target.

## 2026-09-20 — source-contract self-audit

- Audited every source-tagged paragraph for the cited source’s actor, action, scope, condition, exception, and exact locator.
- Split ACS Performance and Limitations knowledge/risk on PDF viewer page 14 from the separate performance-chart skill on page 15 rather than using a two-page compound source.
- Preserved section 91.151’s airplane, VFR, before-beginning, wind-and-forecast-weather, first-intended-landing, normal-cruise, and day-versus-night conditions in both the teaching section and Retrieval review.
- Kept regulation, FAA standard, FAA handbook guidance, AIM guidance, and fictional teaching synthesis in separate paragraphs. Split retrieval answers where adjacent facts depended on different source pages.
- Corrected and reconciled all scenario arithmetic: 140 nautical miles total, 18 nautical miles in climb, 122 nautical miles in cruise, 13.9 gallons planned to Harbor, 16.1 gallons planned remaining, an 18.15-gallon daytime departure calculation including the regulatory reserve, 13.2 gallons projected at Harbor after the observed trend, and about 17 gallons projected at Pine Valley after diversion.
- No open technical question remains in the first draft. Independent first-listen review, authorized formal source relevance, and human editorial approval are still required.

## 2026-09-20 — deterministic draft checks

- Regenerated `narration.md` from the current source-tagged `master-script.md` with `scripts/derive-narration.cjs`.
- `npm run sources:validate -- --sources episodes/core-19-cross-country-planning-fuel-diversions/sources.yaml --claims episodes/core-19-cross-country-planning-fuel-diversions/claim-inventory.yaml --dry-run` passed with 20 sources, 21 claims, 53 master-script source tags, and 20 show-notes links. The run made no network or API requests.
- The independent spoken-script review has not started. No unpublished Core 19 excerpts, claims, or tagged passages have been sent to OpenAI. Formal `--require-llm` review, human editorial approval, rendering, listening QA, release work, commits, and pull-request work remain pending.

## 2026-09-20 — independent spoken-script review

- A second agent that did not draft the lesson reviewed `master-script.md` in order for grammar, complete thoughts, callbacks and call-forwards, first-listen comprehension, dialogue discipline, and scenario continuity. This was an editorial review, not source-relevance validation or factual certification.
- Resolved four required findings: corrected the spoken regulatory-departure total from eighteen point zero five to eighteen point one five gallons; removed an unexplained comparison to nine point three gallons; added the listener-facing title for Episode 17; and moved VFR flight-plan filing and activation before departure while retaining destination-update and closure actions in the diversion sequence.
- Accepted and resolved the optional clarity suggestion by replacing “actual fuel added later” with the amount required to refill the tanks by the airplane-specific method.
- Updated the affected claim-to-section mappings after the VFR flight-plan material moved. No review finding was deferred.
- Regenerated `narration.md` from the revised master script and updated the spoken word count to 4,761.
- Reran the deterministic source validator successfully: 20 sources, 21 claims, 53 master-script source tags, and 20 show-note links. The run made no network or API requests.
- Formal source relevance and human editorial review remain pending.

## 2026-09-20 — collaborative voice revision

- Re-read the complete Core 16, Core 17, and Core 18 narration derivatives as the tonal reference, then revised Core 19 holistically toward their calm, collaborative, explanatory voice.
- Replaced adversarial or corrective constructions with shared decision-building. Examples include changing “Do not let a fuel totalizer or a planning app create fuel” into an explanation of how the verified starting quantity anchors the computation, and replacing the suggestion to “wait until a diversion is necessary” with a direct comparison between nearest-airport distance and full airport suitability.
- Reframed commanding sequences as affirmative workflows: the progress check now begins with aircraft control and the outside scan, then moves through checkpoint identification, timing, calculation, comparison, and decision; the diversion explanation now shows why the initial turn begins progress before the detailed update.
- Preserved the Meadow Ridge–Harbor–Pine Valley scenario spine, numerical calculations, regulatory conditions, source tags, dialogue structure, standard opening order, and source-to-claim mappings. Safety boundaries remain explicit where the governing source requires them.
- Regenerated `narration.md` from the revised master script and updated the spoken word count to 4,669.
- Reran deterministic source mapping successfully: 20 sources, 21 claims, 53 master-script source tags, and 20 show-note links. The dry run made no network or API requests.
- Formal source relevance and human editorial review remain pending. No Core 19 material was sent to OpenAI during this revision.

## 2026-09-20 — independent review after voice revision

- The independent reviewer reread the entire revised script in order and compared its tone with the Core 16 through Core 18 narration derivatives.
- The reviewer confirmed that the adversarial, scolding, imagined-careless-pilot, and gotcha constructions were removed without weakening safety meaning. The remaining negative statements are narrow source-required distinctions about regulatory status and VFR flight-plan responsibilities.
- Resolved two required first-listen findings: the Harbor fuel projection now distinguishes established fuel aboard from planning assumptions that will be verified in flight, and the Retrieval review now states section 91.103 as a pilot-in-command requirement rather than implying that the regulation itself creates familiarity.
- No optional wording suggestions remained, and no review finding was deferred.
- Regenerated the 4,669-word narration derivative and reran deterministic source validation, the repository precommit checks, and `git diff --check`; all passed. The source dry run still reports 20 sources, 21 claims, 53 master-script source tags, and 20 show-note links with no network or API request.

## 2026-09-21 — contextual planning revision and independent review

- Rebuilt the lesson around the introduced, applied, and retrieved “plan, compare, and act” sequence. The opening now treats a plan as a current-flight prediction with margin and workable options, rather than a prediction that can account for every possible diversion.
- Added current PHAK Chapter 2, page 2-17 support for making some personal-minimum decisions in advance and developing good alternatives during risk processing. The fictional Harbor weather trigger, Pine Valley selection, and one-hour fuel floor remain teaching synthesis rather than FAA-prescribed thresholds.
- Added FAA Safety Briefing support for scheduled ETA/weather-trend comparisons and planned-versus-actual fuel-totalizer comparisons. The revised teaching introduces a fifteen-versus-eighteen-minute checkpoint example before its River Bend application.
- Reframed the section 91.151 example as a daytime predeparture fuel-load calculation: 13.9 gallons planned trip fuel plus 4.25 gallons for the thirty-minute reserve equals 18.15 gallons required aboard in the fictional scenario. It separately states the jobs of trip fuel, legal reserve, and the personal landing-fuel floor.
- Consolidated the full workload explanation in the alternative-planning section and changed later mentions to focused applications. The Retrieval review now deliberately rebuilds the plan, compare, and act sequence rather than restating each earlier explanation.
- A second agent independently reviewed the complete revised package. It confirmed the requested teaching outcomes and Core 16–18 voice, then identified four bounded clarity and source-contract fixes. Resolved them by separating fuel and workload trigger conditions, clarifying that updated estimates matter when they support the next decision, separating the VFR-plan update teaching synthesis from the source-backed closure rule, and correcting claim-to-section mappings.
- Regenerated the 5,162-word narration derivative. One deterministic source-mapping mismatch caused by the focused claim-section correction was fixed before rerunning validation. Formal source relevance and human editorial review remain pending; no Core 19 material has been sent to OpenAI.

## 2026-09-21 — independent review after navigation-log expansion

- A second agent independently reviewed the complete navigation-log revision for first-listen comprehension, source purity, claim mappings, scenario continuity, and whether the later callbacks were intentional applications rather than repetition.
- The review confirmed the new section teaches the manually completable planning work without making hand calculation an FAA requirement and keeps the later trip-fuel, River Bend, and Retrieval review material as concise applications.
- Resolved four required findings: distinguish the current chart as an input from the pilot's plotted and measured route; identify the worked row as top of climb to River Bend; specify the fictional one-degree west deviation used to reach the stated compass heading; and split the source-backed distance/groundspeed relationship from the fictional River Bend arithmetic.
- Regenerated the 5,922-word narration derivative after the corrections. Deterministic validation remains to be rerun. Formal source relevance and human editorial review remain pending; no Core 19 material has been sent to OpenAI.

## 2026-09-21 — revision 0.3.1

- Updated the package, listener-facing notes, hosting metadata, and master-script version to 0.3.1 after the human editor made small master-script revisions.
- Regenerated the narration derivative from the revised script and updated the spoken word count to 5,935.
- The human editor approved the revised script. Under the production contract, that approval cannot yet be bound to the current script hash: the source-relevance review must first be clean for the revised source-tagged script, claims, sources, and show notes. After that review, record the approval with `episode:script-review` against the exact current script bytes.

## 2026-09-21 — completed source relevance and script approval

- With explicit current-turn authorization, ran the two-pass OpenAI source-relevance review against the frozen Core 19 source excerpts, claims, and source-tagged passages. The completed report is `link-validation.yaml`, run `b88d6af2-1ed5-4fc0-8d43-ba6edfe463ab`, checked at `2026-09-21T18:01:22.049Z`, using `gpt-5.6-terra` for both independent passes.
- The first completed attempt identified that the Chapter 16 source locator said “AFM/POH” while the cited page names the FAA-approved AFM or permanent aircraft records. Narrowed the locator to the exact cited wording, without changing spoken prose, and reran the review successfully.
- The final report retains non-material editorial precision notes: the Cross-Country Planning ACS task does not itself list alternatives, the cited Chapter 16 page names the AFM or permanent aircraft records rather than a POH for loading, and the in-flight plan-adjustment source supports the practical update workflow with a narrower formulation. No contradiction, unsupported safety teaching, incorrect locator, or material scope mismatch remains.
- Bound the human editor’s already-recorded approval of revision 0.3.1 to the unchanged current `master-script.md` with `episode:script-review`; the recorded SHA-256 is `d7532d627c9bc7fca1f88059a7cde7a0f59b3da7a40371d7adb07beed46d429f`. No audio rendering, listening QA, staging, publication, commit, or pull-request work has occurred.

## 2026-09-21 — opening-preview authorization

- The human editor explicitly authorized sending the approved Core 19 opening narration to OpenAI Realtime for the five-segment preview. Full rendering remains contingent on human listening approval of that preview.
- The human editor accepted the preview, including the disclaimer, introduction, and music. The 31.6-second opening is within the 10–45 second target, and the required notice follows immediately. Automated preview quality checks passed with no clipped samples or stitch warnings.
- After accepting the preview, the human editor explicitly authorized sending the remaining approved Core 19 narration to OpenAI Realtime for the full candidate render. The accepted preview segments will be reused without alteration.
- Reused the accepted opening-preview segments and rendered the remaining 66 segments with OpenAI Realtime. Assembled candidate `audio-artifacts/core-19-20260921T181600Z.mp3` from all 71 voice segments. Its runtime is 2,435.020 seconds (40:35), its SHA-256 is `8ae7b39c76633a8e005cf016eef88ac8463af95b64ef67df5a27d5eaab6e15ca`, and its renderer quality report and independent re-analysis both passed with zero clipped samples and zero stitch warnings.
- The candidate has 15 embedded chapter markers, beginning at 00:00, and the renderer’s `ffprobe` chapter validation passed. Full human listening QA, human chapter review, and candidate acceptance remain required; no package audio state, hosting metadata, staging, publication, commit, or pull-request record has been updated.
- The human editor accepted full script-aligned listening QA. Recorded the candidate’s exact artifact paths, checksum, 40:35 runtime, renderer configuration, usage estimate, preview provenance, and automated validation result in `audio-manifest.yaml`; synchronized `episode.yaml` and hosting metadata to the accepted audio duration. Manual chapter review remains an open human gate, along with publication-day link verification and hosting validation/staging.
- Ran `npm run release:prehost -- --episode episodes/core-19-cross-country-planning-fuel-diversions --package-only`; the draft-package shape is consistent. This is a non-final package-shape check only, not pre-hosting, release, or hosting approval.

## 2026-09-21 — plan, compare, and act editorial revision

- Re-read the complete current master script and narration derivative, then revised the episode around the requested `plan, compare, and act` model. The opening now defines a useful plan as a prediction of the intended flight with margin and a few workable options, without suggesting that every possible diversion can be scripted.
- Made the scenario time-specific. The route, Harbor forecast, and Pine Valley suitability now describe current inputs in the days and hours leading up to this flight, support the present go decision, and remain subject to verification before departure and in flight.
- Researched current FAA primary material for proactive decisions and prepared alternatives. FAA-H-8083-25C, Chapter 2, page 2-17 supports making personal-minimum decisions in advance, using the resulting checklist as a go/no-go and continue/discontinue reference, and developing good alternatives during risk processing. The source does not prescribe the scenario's Harbor weather threshold, Pine Valley choice, or numerical margins, so those remain separately tagged teaching synthesis.
- Added a narrow FAA Safety Briefing source at July/August 2018, printed page 22 and PDF viewer page 24, for scheduled comparisons of destination weather and ETA with the plan and for using a fuel totalizer to compare planned with actual consumption. The script introduces that monitoring model next to the first leg-time example and uses short callbacks later.
- Reframed the daytime section 91.151 example as a predeparture fuel-load calculation: 30 minutes at the fictional 8.5-gallon-per-hour normal-cruise rate equals 4.25 gallons after the first intended landing; 13.9 gallons of planned trip fuel plus 4.25 gallons means at least 18.15 gallons aboard before departure under the stated assumptions. The script explicitly separates that calculation from the personal landing-fuel floor.
- Assigned each fuel quantity one job: trip fuel predicts use before the intended landing, the legal reserve checks the required predeparture load, and the personal floor provides the scenario's in-flight projected-landing margin. Rewrote the River Bend response so Harbor crossing the weather trigger is the reason to act while the late checkpoint and fuel trend show the cost of delay.
- Consolidated the full PHAK workload explanation in the preflight alternative section. The progress check, diversion, and Retrieval review now apply that setup with concise callbacks. Rebuilt Retrieval review around the same `plan, compare, and act` sequence while preserving source-bound regulatory conditions and the scenario arithmetic.
- Updated the reciprocal source ledger, atomic claims, research packet, show notes, show-notes manifest, episode metadata, and narration derivative. The current narration contains 5,155 spoken words and remains within the 30–45 minute target.
- Reran deterministic source mapping successfully: 22 sources, 25 claims, 48 master-script source tags, and 22 show-note links. The dry run made no network or API requests.
- This was a local deterministic drafting revision. No Core 19 material was sent to OpenAI, no `--require-llm` review was run, and human editorial approval, rendering, staging, publication, commits, and pull-request work remain pending.

## 2026-09-21 — route-planning navigation-log expansion

- Re-read the current Core 19 master script and the complete Core 17 master script and narration derivative before revising. Added the dedicated `Complete the route-planning navigation log` section between the preflight decision board and the detailed trip-fuel, reserve, alternative, and in-flight applications.
- Used the Meadow Ridge–Harbor scenario to carry verified chart, route, checkpoint, altitude, forecast-wind, proposed-departure-time, airport, airspace, terrain, AFM/POH performance, and fuel inputs through the navigation log. The worked row records true and magnetic course, wind correction, true, magnetic, and compass headings, groundspeed, leg and cumulative distance and time, ETA, climb transition, planned fuel used and remaining, and blank actual-result fields.
- Kept the source scope page-bounded. PHAK Chapter 16 page 16-7 supports true-to-magnetic-course conversion; page 16-18 supports the route/checkpoint/airspace/terrain/altitude sequence and explicitly permits mathematical formulas, manual computers, or electronic computers; page 16-20 supports the planning sheet, heading chain, log fields, and groundspeed-to-time-and-fuel workflow; page 16-21 supports recording actual results and revising the plan.
- Presented manual completion from time to time as teaching synthesis that exposes relationships and helps cross-check an electronic result. The script does not claim an FAA manual-only calculation mandate and continues to require verified inputs for either method.
- Preserved the established 140-nautical-mile route and all later fuel arithmetic. Added a planned River Bend row at 66 nautical miles, about 41 minutes, 6.1 gallons used, and 23.9 remaining, which provides a clear preflight baseline for the existing actual result at 45 minutes, 7.5 gallons used, and 22.5 remaining.
- Added a concise Retrieval review callback, updated the reciprocal source ledger and atomic claims, aligned the research packet, show notes and manifest, regenerated narration, and updated metadata. The current narration contains 5,899 spoken words with a 45-minute target.
- Deterministic source mapping passed with 23 sources, 30 claims, 58 master-script source tags, and 23 show-note links. No network or API request was made by the validation run. Formal `--require-llm` review, renewed independent first-listen review, human approval, rendering, staging, publication, commits, and pull-request work remain pending.

## 2026-09-21 — independent spoken-script review completed and resolved

- The independent non-drafting spoken-script review completed and resolved its findings before the formal source-relevance review and human editorial approval. It assessed grammar, complete thoughts, callbacks, call-forwards, first-listen comprehension, scenario continuity, and the Core 16–18 narration voice.

## 2026-09-21 — chapter review accepted

- The human editor reviewed and accepted the embedded chapters for the approved full candidate `audio-artifacts/core-19-20260921T181600Z.mp3`, SHA-256 `8ae7b39c76633a8e005cf016eef88ac8463af95b64ef67df5a27d5eaab6e15ca`, using the checksum-bound review page `audio-artifacts/core-19-20260921T181600Z.mp3.chapters.8ae7b39c76633a8e005cf016eef88ac8463af95b64ef67df5a27d5eaab6e15ca.html`.
- The manual chapter-review QA gate is complete. The remaining release work is publication-day link validation and the sealed handoff, hosting-stage, and hosting-build workflow.

## 2026-09-21 — publication-day source and metadata check

- Re-verified all 23 FAA/eCFR and listener-facing source links on the publication date. `publication-link-validation.yaml` records passing deterministic validation run `5ea564f2-6f31-4d46-8485-efd10ae3ded0`, checked at `2026-09-21T19:42:04.958Z`; it does not replace the completed two-pass source-relevance review in `link-validation.yaml`.
- Independently checked that the Core 19 hosting metadata identifies the approved 0.3.1 script and show notes, has the approved 40:35 candidate runtime, and leaves the immutable audio-object fields for the hosting stager. The candidate checksum remains bound through `audio-manifest.yaml` and its render and chapter-review records.
