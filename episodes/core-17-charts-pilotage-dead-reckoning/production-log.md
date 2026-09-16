# Charts, Pilotage, and Dead Reckoning — production log

## 2026-09-13 — package created

- Created Core 17 from the standard episode template with the listener-facing title *Charts, Pilotage, and Dead Reckoning*.
- Status: draft.
- Scope confirmed from production-plan.md: sectional interpretation and basic navigation, anchored in PHAK Chapter 16 and current chart-user guidance.

## 2026-09-13 — current FAA research foundation

- Confirmed FAA-S-ACS-6C remains the current Private Pilot for Airplane Category ACS on the FAA ACS page. The lesson maps the exact relevant elements of PA.I.D Cross-Country Flight Planning, PA.I.E National Airspace System, and PA.VI.A Pilotage and Dead Reckoning.
- Downloaded and inspected the current official PHAK Chapter 16 PDF from the FAA Chapter 16 page. The October 20, 2025 FAA-H-8083-25C addendum was checked and does not amend Chapter 16.
- Downloaded and inspected the FAA Aeronautical Chart Users' Guide effective July 9, 2026 from the Aeronautical Information Services directory.
- Built a reciprocal 24-entry source ledger and 20-claim inventory. Every material source uses a page-specific FAA PDF link and exact section or ACS-element locator.
- Currentness was established for drafting on September 13, 2026. Canonical link and relevance status fields remain unset until the repository validator performs the formal review.

## 2026-09-13 — scenario and calculation design

- Built one explicitly fictional daytime VFR scenario from Cedar Junction Airport to Pine Lake Airport. No scenario airport, landmark, airspace shape, obstruction, instruction, or numerical value represents an actual flight.
- Structured the lesson as a decision chain: confirm the current chart; read terrain, obstacles, MEF, and airspace; choose prominent corroborated checkpoints; distinguish course, heading, and track; apply wind, variation, and deviation; build the navigation log; compare observed position and elapsed time with the plan; revise groundspeed and ETA only from confirmed evidence.
- Checked the fictional wind triangle and flight-log arithmetic. A true course of 075 degrees, true airspeed of 105 knots, and wind from 330 degrees at 15 knots produce an approximately 067-degree true heading, 8-degree-left wind correction, and 108-knot groundspeed. Five legs total 72 nautical miles and 40 minutes. Two observed legs at 90 knots produce a revised 48-minute total and 14:48 destination ETA after a fictional 14:00 departure.
- Kept fuel, diversion, lost procedures, navigation systems, airspace-rule detail, real-airport operations, radio calls, and aircraft-specific corrective technique out of scope.

## 2026-09-13 — initial source-led draft complete

- Produced the source-tagged master-script.md using the required Opening, Disclaimer, Podcast introduction, and What the ACS is asking you to connect order.
- The 5,322-word spoken derivative is within the requested 4,200–6,300-word range and targets approximately 40–44 minutes depending on final rendered pacing.
- Generated narration.md mechanically from master-script.md; no independent narration wording was introduced.
- Created aligned show notes, a complete listener-link manifest, accurate episode metadata, and draft hosting metadata.
- Performed the drafting-agent source-contract pass: separated ACS standards from handbook guidance, chart depiction from operating rules, MEF definition from altitude-selection synthesis, and confirmed all scenario data is labeled as fictional teaching synthesis.
- The user explicitly authorized OpenAI API use through completion of the initial drafting automation. Formal two-pass source relevance was intentionally not run by this drafting agent, as directed. Its QA item remains open for the lead after independent spoken-script review.
- Formal source relevance, human editorial approval, rendering, listening QA, publication-day verification, and hosting work remain pending.

## 2026-09-13 — deterministic package checks

- Regenerated `narration.md` from the current `master-script.md` after the final drafting pass.
- Confirmed reciprocal source and claim mappings, section-level source-tag coverage, retrieval-review coverage, and show-notes manifest mappings with the repository validation helpers.
- Ran `npm run precommit:check`; production-tooling standards and the disclosure and secret scan passed.
- Ran the draft-only pre-host package-shape check. It stopped at the expected missing `link-validation.yaml`, which is intentionally unavailable until the lead runs the formal source-relevance process after independent review. No release-readiness inference was made from this draft check.

## 2026-09-13 — independent spoken-script review resolved

- The independent spoken-script review was completed by a separate agent and covered grammar, complete thoughts, callbacks and call-forwards, and first-listen comprehension. It reported two required findings.
- Defined true airspeed explicitly before the fictional wind-triangle values use it: the airplane's speed through the air used for the wind calculation.
- Added `Retrieval review` to the declared script sections for `acs-chart-outcome`, matching the immediate ACS source tag on that recalled claim.
- Resolved both required findings, regenerated `narration.md`, and retained the pending formal source-relevance gate. No formal source-relevance validation was run in this pass.

## 2026-09-13 — material source-mapping findings resolved

- The formal two-pass source review found three material mapping defects in compound claims. The failed review record remains preserved, and source relevance remains failed until the corrected inputs are reviewed again.
- Split the combined Class B, C, D, and E depiction claim into a page-16 terminal-airspace claim and a page-17 Class E claim.
- Split the combined roads, railroads, lakes, reservoirs, and shorelines claim into a page-34 culture-feature claim and a page-37 water-feature claim.
- Split the combined variation, deviation, and full compass-computation claim into a page-16-7 magnetic-variation claim and a page-16-8 deviation-card claim. The full computation sequence remains only in `planned-navigation-log`, supported by PHAK page 16-20.
- Updated reciprocal `supports_claims` and show-notes manifest references. No spoken-script or narration wording changed.

## 2026-09-13 — formal source relevance complete

- With the user's current-turn authorization, ran the two-pass `--require-llm` source-relevance review against the corrected, frozen package. Canonical report: `link-validation.yaml`, run `365d2fce-4c21-4c69-8531-b63b7fc81315`.
- All deterministic source, claim, source-tag, citation-target, and show-notes checks passed for 24 sources, 23 atomic claims, 121 source tags, and 24 listener-facing links.
- Both independent assessments, using `gpt-5.6-terra`, found no unresolved material source-support, locator, claim-relevance, or tagged-passage issue.
- The current source-review gate is complete. The package is ready for human editorial review; no audio rendering has begun.

## 2026-09-16 — human editorial revisions applied

- Bumped the working script to version 0.1.1 and preserved the editor's direct removal of redundant fictional-scenario reminders.
- Revised only the flagged passages: identified the current planning sources that complement the sectional; restored wind and winds-aloft analysis to the altitude-selection explanation; clarified the boundary between chart depictions and operating requirements; replaced compressed slogan-style language about forecast calculations and correction sources; specified that actual crossing time is entered in the navigation log; described the workload and backup value of electronic and manual planning methods; and kept the in-flight progress example consistently inside the scenario.
- Regenerated `narration.md`, synchronized package version metadata and the spoken-word count, and reset script-review and source-relevance state because factual spoken prose changed. The current script requires renewed two-pass source relevance and human approval before rendering.

## 2026-09-16 — renewed formal source relevance complete

- With the user's current-turn authorization, ran the two-pass `--require-llm` source-relevance review against the revised 0.1.2 package. Canonical report: `link-validation.yaml`, run `12072985-7af0-4d0b-b44a-07f8b63afbe0`.
- All deterministic source, claim, source-tag, citation-target, and show-notes checks passed for 26 sources, 25 claims, 131 source tags, and 26 listener-facing links. Both independent assessments found no material source-support, locator, claim-relevance, or tagged-passage issue.
- The review recorded only editorial, non-blocking scope notes on the MEF natural-feature method and the instructional use of depicted route features. They are retained for human editorial judgment; no isolated source-scope rewrite was made because the notes do not alter a safety decision, core lesson, or material source claim.

## 2026-09-16 — human editorial approval recorded

- The human editor approved the current 0.1.2 script after the renewed source-relevance result. Recorded the approval fingerprint with `episode:script-review --approve` for master-script SHA-256 `539663ff72b670d878cbe4d70f840172841d55e39042dae77d4191d07962d2eb`.
- The opening sample is intentionally skipped for this episode because no new audio feature needs preview approval. The next gate is a full candidate render followed by listening and chapter-marker QA.

## 2026-09-16 — full candidate listening and chapter QA accepted

- Rendered and assembled `audio-artifacts/core-17-20260916T122530Z.mp3` from the approved narration with the declared audio mix. Candidate SHA-256: `d9463abb9c536b1cdaaee7fcf8bc3cf20049dd87d3f064b5fc013320757ef79f`.
- Automated audio analysis passed: WAV and MP3 decode, no clipping, and all 90 stitched boundaries below the discontinuity threshold. The renderer embedded and `ffprobe` validated 14 MP3 chapters; the local chapter review page is bound to the candidate hash.
- The human editor accepted the full script-aligned listening QA, the opening and required notice, and manual chapter-marker review. The preview was intentionally skipped because no new audio feature required separate preview approval.

## 2026-09-16 — publication-day link validation complete

- Revalidated all 26 official source links and 26 listener-facing show-note links with `sources:validate --publication-check`. Canonical report: `publication-link-validation.yaml`, run `6cf5998a-4eeb-429c-8352-e8abb98c0822`.
- Every target resolved and the publication-day report is valid. This deterministic check supplements, and does not replace, the clean formal two-pass source-relevance record.

## 2026-09-16 — navigation-log workload guidance added

- Reviewed PHAK Chapter 2, *Workload Management*, p. 2-24; PHAK Chapter 16, pp. 16-20–16-21; the Pilotage and Dead Reckoning risk elements in FAA-S-ACS-6C; and AC 90-48E, section 15.
- Added the requested safety emphasis without presenting a new FAA procedure: prepare the navigation log and planned arithmetic before departure; leave clear space for actual and revised values; make brief airborne entries; keep aircraft control, situational awareness, collision avoidance, and the outside scan primary; and defer involved, nonurgent recalculation until workload permits.
- Bumped the working version to 0.1.2, added reciprocal source and claim records for workload management and cockpit fixation, and added the two FAA references to the show notes.
- Regenerated `narration.md`, updated the spoken-word count to 5,706, and reset the current script-review and source-relevance state through `episode:script-review --reset`.
- The deterministic source check passed for 26 sources, 25 claims, 131 master-script source tags, and 26 show-notes links. Narration parity, the pending script fingerprint, and package version metadata also match the current script.
