# VFR Operating Rules and Preflight Responsibilities — production log

This is optional explanatory context, not a production-state or audit record. Use `episode.yaml` and the named structured validation and artifact reports for authoritative state, approvals, timestamps, hashes, and run identities. The QA checklist records fixed `qa-id` human attestations.

## 2026-09-24 — first complete source-led draft

- Created from the standard episode template.
- Followed Elena and Jonah through a failed installed display, aircraft change, destination runway closure, passenger briefing, route-altitude choice, and early en route fuel stop.
- Mapped the ACS Airworthiness Requirements, Cross-Country Flight Planning, and Preflight passenger-briefing outcomes to page-bounded ACS and section-bounded Part 91 entries in the source and claim ledgers.
- Reviewed core-19, core-20, and core-21 for the calm, scenario-led Instructor/Learner voice and short Announcer section cues. Kept detailed cross-country planning, airspace/weather minimums, and right-of-way lessons with those adjacent episodes.
- Kept the failed display's actual dispatch status unresolved in the fictional scenario; Elena changes airplanes because the required equipment and maintenance evidence is not established in time.
- Used the repository narration derivation script. Independent spoken-script review, formal source relevance, and human editorial review remain separate structured gates in `episode.yaml`.

## 2026-09-24 — coherent first-listen revision, version 0.1.1

- Clarified the no-MEL equipment decision in stages, corrected ACS PDF page targets, grounded the VFR cruising-altitude example in an eastbound segment, and made the en route fuel-stop choice explicit.
- Rebound the retrieval review to the revised scenario and shortened its regulatory recaps. The independent review fingerprint must be recorded against the current script bytes after this revision.

## 2026-09-24 — core episode depth, version 0.1.2

- Expanded the same scenario's aircraft-record, inoperative-equipment, runway-performance, fuel, passenger, and altitude decisions to meet the production plan's 30–45 minute core-episode scope without adding an unrelated rule inventory.
- Regenerated narration and reset the target to about 32 minutes. The independent spoken-script review and formal source relevance must bind this revision.

## 2026-09-24 — formal source-review correction, version 0.1.3

- Corrected the aircraft-document passage after formal relevance review: section 91.203 accepts specified registration documents beyond the effective U.S. registration certificate, and section 91.9(b)'s manual-availability requirement depends on whether an approved manual is required for the U.S.-registered aircraft.
- Updated the matching atomic claims and renewed narration. The first formal report remains a failed historical attempt; independent spoken review and formal relevance must be repeated for this script revision.

## 2026-09-24 — source-reviewed draft for human editorial review

- A separate agent completed the spoken-script review against version 0.1.3 and its current SHA, including the revised document passages and the full preflight-to-fuel-stop sequence.
- The two-pass formal source review passed for all 19 sources. It retained nonblocking editorial precision notes about ACS alternatives wording and the specialized section 91.9 manual option for the human editor.
- The draft remains unapproved by a human editor; audio and release work are pending later gates.

## 2026-09-24 — Episode 8 editorial callback, version 0.1.4

- On editorial direction, shortened the aircraft documents, inspections, and inoperative-equipment treatment to Elena's hold-and-switch decision under section 91.7 and an explicit listener-facing referral to Episode 8, *Aircraft Documents, Airworthiness, Inspections, and Maintenance*.
- Developed the remaining Part 91 decisions in the same scenario: the aircraft switch changes arrival time and runway availability, the passenger restraint notice recurs at the fuel stop, and the chosen altitude is checked against height above the changing surface.
- Removed unspoken aircraft-document and equipment claims and links from the current source ledger, claim inventory, and show notes. Regenerated narration and reset the prior spoken-script and formal source-review bindings. Both reviews are pending again before human editorial review; no audio or release work was performed.

## 2026-09-24 — nighttime fuel-reserve correction, version 0.1.5

- Corrected the fuel-stop departure passage to state the day and night periods in section 91.151 by time of operation. Because Elena's delayed leg may continue into night, she plans at least a 45-minute reserve. Regenerated narration and reset review bindings for the revised script.

## 2026-09-25 — user editorial revision, version 0.1.6

- Preserved the user's 0.1.6 script edits. Removed the early runway-closure teaser from the airplane-switch transition so the closure first appears when Elena checks current airport information under section 91.103.
- Moved route and altitude selection before the passenger briefing. Elena now compares charted terrain and obstacles, winds aloft, time, fuel, weather, airspace, and replacement-airplane performance before selecting a planned cruising altitude; the in-flight section checks actual conditions against that plan.
- Retimed section cues, regenerated narration, synchronized package versions and current claim-section mapping, and reset review fingerprints. Independent spoken-script and formal source review are pending for the revised bytes.

## 2026-09-25 — current source review

- A separate agent passed the first-listen review of version 0.1.6 against the current script SHA. It left one optional wording note for the human editor in the PIC-decision passage; no material first-listen finding remained.
- With the user's current-turn authorization, the two-pass source-relevance review passed all 10 sources, 15 claims, and 46 source tags after refreshing the eCFR effective dates. The structured report retains nonblocking editorial precision notes on ACS alternatives wording and the adult-passenger seat-or-berth wording in section 91.107.
- Human editorial approval, audio, and release work remain pending.

## 2026-09-25 — human editorial approval

- The human editor approved version 0.1.6 after receiving the passing two-pass source-relevance result. The package-operation helper recorded approval against the current master-script SHA in `episode.yaml`.
- Audio production, listening and chapter review, publication-day links, and hosting remain later gates.

## 2026-09-25 — passenger-briefing revision, version 0.1.7

- On user feedback, expanded Elena's ramp and cabin briefing to cover the Flight Deck Management skill in ACS PA.II.B.S2: PIC identification, restraint use, doors, passenger conduct, sterile aircraft, propeller avoidance, and emergency exit instructions. Kept the specific section 91.107 restraint briefing, notice, and use requirements separate from the wider ACS briefing.
- Updated the ACS source locator and atomic claim inventory, synchronized package metadata and notes, and regenerated narration. The spoken-script, formal source-relevance, and human editorial approvals for 0.1.6 are stale for this revision; the existing five-segment opening preview also does not represent this script. No audio was rendered.

## 2026-09-25 — night-boundary scenario correction, version 0.1.8

- Matched Elena's Episode 21 commitment to land home before sunset and her missing §61.57(b) night passenger recency. The delay at the fuel stop now cancels the gathering; Elena checks a new daylight leg and lands home before sunset rather than implying that an extra 45 minutes of fuel permits a later night leg with Jonah.
- Added the separate §91.205(a), (c) night-VFR equipment check for the standard U.S.-certificated replacement airplane, without teaching the equipment list again. Verified both regulations against current eCFR, updated the source and claim ledgers, and kept the day/night §91.151 fuel contrast conditional.
- Synced narration, notes, and metadata; the prior preview and review approvals remain stale for the new spoken-script bytes. No OpenAI source review, audio rendering, staging, or PR action occurred.

## 2026-09-25 — replacement-airplane loading revision, version 0.1.9

- On user feedback, added a short scenario-led weight-and-balance decision after Elena changes airplanes. She checks two people, bags, and actual fuel against the replacement airplane's current weight and CG information, then uses that loading in the runway performance plan. Episode 9 remains the place for the calculation method.
- At the fuel stop, she rechecks loading after refueling rather than assuming full tanks fit. The script keeps required fuel and the chosen margin in view when considering any loading change.
- Added page-bounded ACS Performance and Limitations and PHAK Chapter 10 sources, atomic claims, retrieval review, and listener-facing study links. Regenerated narration, retimed section cues, and reset the spoken-script, formal source-relevance, and human editorial bindings. The earlier five-segment audio preview does not represent this revision.
- The independent spoken review caught a performance-input error in the new prose. The script now uses departure weight for takeoff and expected landing weight for each landing performance check; the narration and review fingerprint were renewed before the final review.

## 2026-09-26 — source-locator correction for version 0.1.9

- The authorized two-pass source-relevance run found that the new ACS source pointed to PDF page 14 for a claim about PA.I.F.S1–S2, which appear on PDF page 15. Both assessments marked the page mismatch material. The failed attempt remains in `.validation-attempts/`.
- Narrowed the ACS source and claim to the skills on PDF page 15 and synchronized the show-notes link, manifest, research packet, and episode references. Spoken script bytes did not change. A fresh relevance run is required for the corrected source and claim inputs.
- With current-turn authorization, the rerun passed two independent relevance assessments for all 15 sources and 21 claims; the master script contains 70 source tags. It found no material source-support risk and retained a nonblocking editorial precision note that the Cross-Country Flight Planning ACS page does not expressly say the applicant must explain alternatives. The structured report and `episode.yaml` record the run and its script identity; human editorial reapproval and audio remain pending.

## 2026-09-26 — human editorial approval of version 0.1.9

- The human editor approved the current script after the passing two-pass source-relevance result. The package-operation helper recorded approval against master-script SHA `bfbf5843fa0f7cee1f3805e3c7da49db3d047d917a0009e0590d8cab57742bfa`.
- Corrected the public show-notes status to reflect completed source and editorial reviews. The renderer's local dry run confirmed the current narration derivative, source and editorial bindings, show-notes mapping, and five-segment preview plan. Audio production and listening QA remain pending.

## 2026-09-26 — approved-script opening audio preview

- With the user's explicit current-turn authorization, rendered unpublished narration segments 1–5 through OpenAI Realtime and assembled a fresh MP3 preview. The local QA report records the authorization and exact script, narration, and audio identities.
- The 203.92-second candidate passed automated decode, clipping, and stitch checks. The opening chapter runs 30.45 seconds and the disclaimer follows it. Human listening QA remains pending before any full-episode render.

## 2026-09-28 — opening audio preview accepted

- The human editor accepted the five-segment QA sample and confirmed the disclaimers are present and audible. The preview report and fixed QA attestations now record that result. Full-episode audio rendering and its separate listening QA remain pending.

## 2026-09-28 — full audio candidate rendered

- With the user's explicit current-turn authorization, reused the five accepted opening voice segments and rendered narration segments 6–67 through OpenAI Realtime. Assembled a fresh 33:36.75 candidate MP3 without changing the approved spoken script.
- Automated decode, clipping, and stitch checks passed with zero clipped samples and zero stitch warnings. The MP3 contains 12 embedded chapters validated with `ffprobe`; a chapter review page was generated. The audio manifest records the candidate bytes and report paths, while full script-aligned listening and manual chapter QA remain pending.

## 2026-09-28 — full audio and chapter QA accepted

- The human editor accepted the full-episode listening and embedded chapter-marker QA for candidate `core-22-20260928T130327Z.mp3` (SHA-256 `d39228604618be0856a4d0db23d60746e0fd5d64b7c5ae8413e5e05a07fe62f1`). The fixed QA attestations and candidate report record this approval.
- `episode.yaml` now records completed listening QA. Publication-day links, hosting metadata and sealed handoff validation remain later release work.
- Corrected the show-notes status to match the approved audio and ran `release:prehost --package-only`; the draft-package shape check passed. This check does not establish final release readiness.
