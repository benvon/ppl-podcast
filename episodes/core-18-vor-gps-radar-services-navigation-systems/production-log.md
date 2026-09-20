# VOR, GPS, Radar Services, and Navigation Systems — production log

## 2026-09-16 — package created

- Created from the standard episode template.
- Status: draft.

## 2026-09-16 — current FAA research foundation

- Confirmed Core 18 scope from `production-plan.md`: VOR, GPS, radar services, and navigation-system capabilities, limitations, and service distinctions.
- Checked the current FAA Private Pilot ACS publication, FAA-S-ACS-6C, and mapped PA.VI.B.K1-K4, R1-R4, and S1-S7 to the research foundation.
- Retrieved and inspected FAA-H-8083-25C Chapter 16 from the FAA Chapter 16 publication page. The ledger uses exact PHAK pages for VOR, DME, GPS integrity, VFR GPS use, database currency, and task management.
- Checked the current AIM Basic with Change 3, effective 2026-07-09, and mapped AIM 4-1-15, 4-1-17, 4-1-18, and 4-1-20 to traffic information, VFR radar assistance, terminal radar services, and transponder/ADS-B awareness.
- Created a reciprocal 12-source ledger and 13-claim inventory. Each source points to a specific page or AIM paragraph. Link-status and formal source-review fields intentionally remain unset until the authorized validation gate.
- Established one fictional daytime VFR scenario to carry the lesson. It does not represent a real route, equipment installation, radio call, or procedure.
- Formal source relevance, independent spoken-script review, human editorial approval, narration derivation, rendering, listening QA, publication-day validation, hosting, and PR work remain pending.

## 2026-09-16 — ADS-B scope decision

- Reviewed Core 17's source-tagged script and package: it contains no ADS-B teaching. Its references to traffic are limited to the general navigation-workload and outside-scan discipline.
- Expanded Core 18 rather than adding a cross-episode callback. The draft will give ADS-B its own section: distinguish ADS-B Out from ADS-B In, describe the surveillance and traffic-awareness value, explain that a traffic target prompts a visual search, and retain the limits of coverage and see-and-avoid.
- Added current AIM 4-5-7 as a distinct ledger entry and atomic claim. Detailed installation, regulatory-equipment, display-symbol, and procedure coverage remains out of scope.

## 2026-09-16 — ADS-B boundary corrected against Episode 16

- The preliminary continuity check inspected Episode 17, which has no ADS-B teaching. Episode 16 is the relevant predecessor and already teaches Mode C versus ADS-B Out, the ADS-B Out/In distinction, installed-capability checks, and airspace-equipment route requirements.
- Core 18 will therefore make only a short callback to Episode 16. It will not reteach ADS-B terminology, installation, Mode C veil, or regulatory route triggers.
- Added AIM 4-5-8 and an atomic TIS-B claim. Core 18's substantive ADS-B contribution is the safety decision: traffic information is advisory, coverage- and equipage-dependent, and useful because it prompts visual acquisition rather than a maneuver based on a display alone.
- Removed the redundant Core 18 transponder/ADS-B Out overview claim and AIM 4-1-20 ledger entry. Episode 16 remains the source-led episode for that equipment and route-planning treatment.

## 2026-09-16 — independent spoken-script review resolved

- A second agent reviewed the draft for grammar, complete thoughts, first-listen comprehension, and cross-episode continuity.
- Added PHAK page 16-26 and an atomic station-passage claim after the review found that the script promised, but had not taught, how a VOR station passage appears on the CDI and TO/FROM indication.
- Rewrote the GPS retrieval prompt as three complete questions, explained coded and recorded VOR identification in plain language, and expanded the one-scenario teaching arc to 4,557 derived narration words with section timing consistent with a 30–45 minute episode.
- Kept the Episode 16 ADS-B callback brief. The expanded Core 18 ADS-B treatment remains TIS-B’s advisory safety value, coverage and equipage limits, and visual-acquisition purpose.

## 2026-09-16 — deterministic package checks

- Rebuilt `narration.md` from the current source-tagged `master-script.md`; it contains 4,557 spoken words.
- `npm run sources:validate -- --sources episodes/core-18-vor-gps-radar-services-navigation-systems/sources.yaml --claims episodes/core-18-vor-gps-radar-services-navigation-systems/claim-inventory.yaml --dry-run` passed with 14 sources, 15 claims, 58 script tags, and 14 show-notes links. No network or OpenAI requests were made.
- Formal link retrieval and the required two-pass OpenAI source-relevance review remain pending explicit authorization to export the unpublished source excerpts, claim inventory, and tagged script passages.

## 2026-09-16 — formal source-review findings resolved

- The first completed two-pass review correctly found that the ACS URL fragment selected PA.VI.A (printed p. 38), not PA.VI.B. The ledger, research packet, show notes, and link manifest now cite PDF viewer page 47, printed p. 39, which contains PA.VI.B.
- Corrected the AIM 4-1-15 locator to include both its Purpose and Provisions of the Service, the latter being where the workload and coverage limits appear.
- Tightened the RAIM claim from “insufficient satellite geometry” to the exact cited condition: insufficient satellites available for integrity monitoring.
- These source/claim revisions require a fresh formal source-relevance run before human editorial review.

## 2026-09-16 — formal source review complete

- The corrected formal review fetched all 14 ledger sources and all 14 listener-facing show-notes links successfully.
- Two independent relevance assessments supported every source locator, its reciprocal claim set, and its source-tagged spoken passages. No material or editorial findings remain.
- `episode.yaml` now records `source_verification.status: source_relevance_complete` and `relevance_review: complete`; the source-review report records the current-turn OpenAI authorization.
- The package is ready for human editorial review. Script approval, rendering, listening QA, publication-day verification, staging, and release remain deliberately pending.

## 2026-09-17 — affirmative teaching-voice revision

- Rebuilt the master script’s teaching prose around the pilot’s operating workflow: establish the input, verify source status and currentness, interpret the indication, compare it with the planned picture, and choose the next action.
- Removed gotcha-style contrasts, quippy limitation lines, and repeated fictional-scenario reminders. Source-required limits now appear as direct operating conditions followed by the pilot action they inform.
- Added the same durable drafting direction to `docs/script-drafting-playbook.md` for future lessons.
- Regenerated `narration.md` from the revised script; it contains 3,573 spoken words. The script-review reset recorded the new pending script fingerprint and correctly invalidated the prior formal source-review evidence.
- Deterministic source mapping passed for 14 sources, 15 claims, 58 master-script source tags, and 14 show-notes links. A newly authorized two-pass OpenAI `--require-llm` review of the revised unpublished source excerpts, claim inventory, and source-tagged master-script passages is required before human editorial review.

## 2026-09-17 — revised-source review authorized

- Received explicit current-turn authorization to send the revised unpublished FAA source excerpts, claim inventory, and source-tagged Core 18 master-script passages to OpenAI for the required two-pass `--require-llm` source-relevance review.

## 2026-09-17 — intermediate source review completed, then became stale

- An intermediate formal review retrieved all 14 ledger sources and all 14 listener-facing show-notes links successfully. Two independent OpenAI relevance assessments supported its frozen inputs without a material or editorial source-support finding.
- During recovery from an interrupted app session, the current master-script identity differed from that intermediate report. The report was invalidated rather than used as clearance for the recovered script.

## 2026-09-17 — current source review incomplete

- Regenerated `narration.md` from the recovered current master script; it contains 3,590 spoken words and matches the script derivative exactly.
- Retried the authorized two-pass `--require-llm` review three times against the same current inputs: twice with the default reviewer and once with the current Sol model at single-request concurrency. Each attempt reached deterministic source and link validation, then ended with one or more Responses API HTTP 404 assessments that were not completed.
- No incomplete attempt is treated as a passing source review, and no source-support finding was resolved or waived. `episode.yaml` therefore records `source_relevance_failed`; human editorial review, rendering, and release remain pending a clean formal review.

## 2026-09-17 — CDI course-side correction

- Corrected the VOR/CDI explanation. With normal VOR sensing, a left CDI deflection places the selected course to the left of the airplane; on the selected inbound course, the airplane is right of that line.
- Rewrote the surrounding explanation so the instrument relationship is taught before the Meadow Ridge scenario applies it. Regenerated `narration.md` from the corrected master script; it contains 3,613 spoken words.
- Reset the script-review fingerprint. The prior incomplete formal review remains invalid for the changed source-tagged script, and a fresh current-turn authorization is required before another OpenAI source-relevance review.

## 2026-09-18 — lesson architecture and equipment-context revision

- Rebuilt the draft in the requested instructional order: a brief Episode 17 planning reminder; ground preparation of the GPS route, VOR frequency, charted identifier and Morse pattern, station identification, signal status, and DME; then an end-to-end Meadow Ridge–Harbor flight sequence.
- Expanded DME from the label “slant range” into a direct-line-distance picture that distinguishes the airborne distance to a station from horizontal chart distance, including the directly-overhead example.
- Reworked the CDI and HSI explanation around selected course, heading, and course-deviation relationships, then recalled the Meadow Ridge–Harbor route before applying the corrected left-deflection geometry.
- Added the FAA’s current VOR MON and Ground-Based Navigation program pages. The episode explains VOR MON as a GPS-outage conventional backup and describes NextGen DME’s DME/DME RNAV role at an appropriate private-pilot level.
- Reframed ADS-B traffic around the listener’s actual display: direct air-to-air traffic, ground-delivered TIS-B, client and coverage conditions, and the equipment-specific question. Added FAA ADS-B In guidance and the ForeFlight Sentry Pilot’s Guide as a product-specific source and show-notes link.
- Added requested VFR radar traffic advisories, commonly called flight following, as the ATC relationship that precedes the traffic-advisory discussion. The draft preserves coverage, workload, and service-boundary conditions.
- Removed all “this section” self-reference and continued the affirmative, non-gotcha teaching voice in the durable drafting playbook guidance.
- Reset the script-review fingerprint, regenerated narration.md from the revised source-tagged script, and updated the package word count to 4,154. The independent spoken-script review checkbox was reset because the architecture changed materially.
- Deterministic source mapping passed with 19 sources, 20 claims, 63 source tags, and 19 show-notes links. The new unpublished source-tagged script has not been exported to OpenAI. A fresh explicit current-turn authorization is required before the two-pass require-llm source-relevance review.

## 2026-09-18 — independent spoken-script review resolved

- A separate agent reviewed the restructured draft for grammar, complete thoughts, callbacks, call-forwards, first-listen comprehension, and the affirmative teaching-voice directive.
- The review found one material architecture issue: the Meadow Ridge–Harbor story had been introduced in fragments before the promised end-to-end sequence, which repeated the river-bend, traffic, and assistance events.
- Resolved the finding by keeping the VOR, GPS, ADS-B, and radar sections conceptual and moving the route-specific VOR indication, station passage, GPS/visual disagreement, traffic target, and VFR radar-assistance request into one continuous final flight sequence.
- Trimmed unsupported initial-call detail to its functional communication purpose and revised the remaining contrast-style VOR wording into direct input-and-verification language.
- Regenerated narration and reset the pending script-review fingerprint after the source-tagged edits. Static source mapping passed; the package remains pending a fresh explicit OpenAI source-review authorization and a complete two-pass review before human editorial approval.

## 2026-09-18 — revision identifier updated

- Bumped the current Core 18 draft revision from 0.1.0 to 0.2.0 in episode metadata, the master script, show notes, and hosting metadata.
- Reset the pending script-review fingerprint and regenerated narration from the versioned master script. Deterministic source mapping remains clean.

## 2026-09-18 — navigation-source and flight-following precision revision

- Replaced the ambiguous DME transition with the direct division of work: VOR supplies direction from the station and DME supplies distance to the station; their common pairing describes position relative to the same facility without giving DME a directional task.
- Replaced the abstract GPS “source question” line with explicit receiver-status, database-currentness, current-chart and waypoint-verification, and independent-position-comparison questions.
- Revised the ADS-B/TIS-B exchange so a target prompts the immediate aircraft-control and visual-search response without requiring the pilot to classify the target source first. Direct-versus-TIS-B distinctions remain relevant to preflight equipment-capability and coverage review and to postflight questions about display completeness.
- Added current FAA AIM 4-1-20 and FAA Order JO 7110.65BB paragraphs 5-2-1, 5-2-7, 5-3-1, and 5-3-3. The lesson now includes the normally discrete computer-assigned beacon-code step for VFR aircraft receiving radar advisories, pilot operation on the ATC-specified Mode 3/A code with altitude reporting enabled, and radar identification before ongoing service without teaching phraseology or receiver buttonology.
- Regenerated `narration.md`; the current derivative contains 4,402 spoken words. Deterministic source mapping passed for 22 sources, 22 claims, 74 master-script source tags, and 22 show-notes links, with no network or API requests. The script-review state was reset to the current script fingerprint. No `--require-llm` review or unpublished-material export was performed because fresh current-turn authorization is absent.

## 2026-09-18 — Sol/High revision review resolved

- A Sol drafting agent with high reasoning revised the DME, GPS, ADS-B/TIS-B, and flight-following passages requested in the editorial feedback.
- A separate focused spoken-script review confirmed the DME and GPS revisions and found one material sequencing issue in the new flight-following prose: a discrete-code assignment and radar identification are steps toward establishing radar advisory service, while the code itself does not confirm that advisory service is active.
- Resolved the finding. The script now describes the conditional progression: the pilot requests service; ATC may issue a computer-assigned, normally discrete code while establishing radar contact; the pilot uses the ATC-specified Mode 3/A code with altitude reporting enabled; and the advisory relationship begins once ATC has radar identification and can provide the service.
- The same resolution converted the remaining ADS-B/TIS-B contrast wording into an affirmative immediate workflow: use direction and relative altitude for the visual scan, then use source labeling for equipment-context review.
- Reset the script-review fingerprint and regenerated narration after the final source-tagged edits. The package remains pending fresh current-turn OpenAI authorization and a complete two-pass source-relevance review.

## 2026-09-18 — fictional flight-following radio example

- Added a concise, clearly fictional Meadow Ridge–Harbor exchange that models an initial request for VFR radar traffic advisories, ATC's discrete-code assignment, the pilot's acknowledgment, and radar-contact confirmation. The preceding prose explains the information that supports the request; the example demonstrates its operational sequence without presenting a universal phraseology template.
- A focused independent spoken-script review found reversed pilot/controller speaker labels and recommended making the active traffic-advisory service explicit after radar contact. Resolved both findings: the learner now makes and acknowledges the pilot transmissions, and the instructor gives the controller transmissions, including the availability confirmation.
- Reset the script-review fingerprint and regenerated `narration.md`; the current derivative contains 4,507 spoken words. The package remains pending fresh current-turn OpenAI authorization and a complete two-pass source-relevance review.

## 2026-09-18 — flight-following sequence corrected

- Moved the flight-following request and fictional radio exchange to shortly after departure, at the planned cruising altitude. The controller relationship now carries through the VOR navigation, post-station GPS/checkpoint discrepancy, traffic scan, and later request for assistance.
- Updated the fictional call to include the current beacon code and changed the retrieval prompt to ask what the already-established relationship adds during the flight.
- Reset the script-review fingerprint and regenerated `narration.md`; the current derivative contains 4,516 spoken words. Deterministic source mapping passed for 22 sources, 22 claims, 75 master-script source tags, and 22 show-notes links. The package remains pending fresh current-turn OpenAI authorization and a complete two-pass source-relevance review.

## 2026-09-18 — Sol/High front-to-back sense review resolved

- A Sol agent with high reasoning reviewed the current master script as a first-time private-pilot listener, checking narrative order, conceptual handoffs, scenario continuity, radio-call follow-through, instrument relationships, and the direct teaching voice.
- The review found two material issues: the river checkpoint prose supplied mutually consistent GPS and visual evidence while calling it a discrepancy, and the fictional initial call omitted the current beacon code described immediately before it. Resolved both: GPS now agrees with the planned east-side relation to the river while the visible river appears on the unexpected side of the route line, and the call includes “squawking one two zero zero.”
- Resolved related editorial findings by clarifying that the course selector is set by the pilot, removing nonstandard-sounding traffic-service wording from the fictional controller response, and explicitly keeping one approach facility throughout the compact scenario rather than silently implying controller handoffs.
- Reset the script-review fingerprint and regenerated `narration.md`; the current derivative contains 4,568 spoken words. Deterministic source mapping passed for 22 sources, 22 claims, 75 master-script source tags, and 22 show-notes links. The package remains pending fresh current-turn OpenAI authorization and a complete two-pass source-relevance review.

## 2026-09-18 — flight-following call operational correction

- Removed the assumed `1200` code from the initial fictional flight-following request and removed “current beacon code” from its explanatory information list. The scenario now presents the normal call without a code and reserves transponder-code discussion for ATC’s subsequently assigned discrete code. A nonstandard existing code belongs in a different, conditional example rather than this baseline one.
- Reset the script-review fingerprint and regenerated `narration.md`; the current derivative contains 4,560 spoken words. Deterministic source mapping passed for 22 sources, 22 claims, 75 master-script source tags, and 22 show-notes links. The package remains pending fresh current-turn OpenAI authorization and a complete two-pass source-relevance review.

## 2026-09-18 — formal source-relevance review completed

- Received current-turn authorization to export the current unpublished FAA excerpts, claim inventory, and source-tagged master-script passages to OpenAI for the required two-pass `--require-llm` review. The report records the authorization for its successful run.
- The first completed assessment batch found material source-contract issues in the compound beacon-code and radar-identification claims: the AIM locator did not identify its supporting altitude-reporting text, JO 7110.65 source scopes were combined, and the chart-guide claim asked the accessible page to establish graphical details it did not expose as text. Resolved them contextually by splitting code assignment, pilot code operation, code-change identification, and the before-service identification prerequisite into atomic claims with their exact authorities; tightening the source-tagged prose; and limiting the chart-guide claim to its labeled VOR/VOR-DME and Morse Code notation.
- Repaired three stale FAA HTML fragment identifiers and the Chart Users’ Guide locator during deterministic validation. The final authorized run (`984b2e15-8268-4d7f-bf2b-8c5ee82b253e`) passed live link retrieval, claim and source-tag mapping for 23 sources, 24 claims, 79 master-script source tags, and 23 show-notes links, and two independent LLM relevance assessments with no material findings. `episode.yaml` now records `source_relevance_complete`.
- The final report retains one non-blocking editorial note: the cited Sentry page documents TIS-B limitations and conditions, while display-source indication details belong in the wider manufacturer documentation. The script did not rely on that page for a material operating decision, so no spoken-prose change was needed. `narration.md` remains the current derivative at 4,568 spoken words.

## 2026-09-19 — GA/VFR DME architecture clarification

- Added AIM 1-1-3.f.1 and the FAA Ground-Based Navigation DME program page with exact locators for the DME/DME equipage boundary, scanning receivers using multiple high-power DME facilities, RNAV en-route procedure support, and NextGen DME sustainment as resilient GPS backup.
- Clarified at PPL level that VOR MON is the broad conventional fallback for aircraft unable to continue RNAV during a GNSS disruption, including aircraft without DME/DME equipment. Suitably equipped aircraft may use DME/DME RNAV, but that architecture is separate from a standalone DME distance display and is not attributed to a typical training airplane.
- Kept the explanation as general-aviation VFR architecture context. It does not teach instrument procedures, operational fallback technique, or receiver buttonology.
- Regenerated `narration.md`; the current derivative contains 4,506 spoken words. Deterministic source mapping passed for 25 sources, 26 claims, 84 master-script source tags, and 25 show-notes links with no network or API requests. The previous source-relevance report is stale for the changed source-tagged prose; no new `--require-llm` review or OpenAI export was performed.

## 2026-09-19 — revision 0.2.3 and formal source-relevance review

- Bumped the draft revision to 0.2.3 in `episode.yaml`, the master script, show notes, and hosting metadata. Reset the script-review state and regenerated `narration.md`; it remains the current derivative at 4,506 spoken words.
- Received current-turn authorization to send the current unpublished source excerpts, claim inventory, and source-tagged master-script passages to OpenAI for the required two-pass `--require-llm` review.
- The successful run (`b898c9c8-e6ad-49a0-8d35-508053fe6b79`) passed live retrieval, mapping for 25 sources, 26 claims, 84 source-tagged passages, and 25 show-notes links, and two independent relevance assessments with no material findings. `episode.yaml` records `source_relevance_complete` for the current inputs.
- One prior editorial-only note remains: the cited Sentry guide page supports TIS-B limitations and conditions, while detailed display-source behavior belongs in the wider manufacturer documentation. It does not create a material operating-decision or source-support issue.

## 2026-09-19 — human editorial approval recorded

- The human editor approved the revised 0.2.3 master script after its clean formal source-relevance review. The approval is bound to master-script SHA-256 `237a68ec196456b5957b7970573e3e866c95622a5e683bde103dabde463f80de` in `episode.yaml`.
- Audio rendering, listening and chapter QA, publication-day source verification, hosting validation, staging, and publication remain pending.

## 2026-09-19 — full audio candidate rendered

- After the human listener accepted the five-segment opening preview, rendered all 60 segments of the approved 0.2.3 narration with OpenAI Realtime (`gpt-realtime-2.1`; Marin instructor, Cedar learner, Ballad announcer) and assembled candidate `core-18-20260919T212649Z.mp3`.
- The 31:31 candidate (SHA-256 `7f4e90f1ad0e6e591ef6d29dc6a46bda5d42c2d456d939a5e6e5cf5c92059f8b`) passed automatic WAV/MP3 decode, 24 kHz mono, duration, stitch-boundary, clipping, and embedded-chapter checks. Generated a checksum-bound local chapter-review page from the MP3’s 12 `ffprobe`-read markers.
- Human full listening QA and manual chapter-marker review remain pending; no release, staging, or hosting state was advanced.

## 2026-09-20 — corrected TO/FROM audio candidate rendered

- Updated the shared realtime-renderer pronunciation map so the exact label `TO/FROM` is spoken as “to from”; a focused renderer regression test passed. The approved spoken script was not changed.
- The listener accepted a newly rendered VOR/DME sample containing the corrected label and confirmed that the required artificial intelligence-assisted production notice is clearly heard.
- Rendered all 60 Core 18 narration segments afresh through OpenAI Realtime and assembled `core-18-20260920T130851Z.mp3`. The new 30:57 candidate has SHA-256 `a84c829b0267ba61e6ab3db768ec4248d89d56cada561a3eb57efe10f358516e` and replaces the earlier candidate, which remains recorded as superseded rather than deleted.
- Automatic WAV/MP3 decode, 24 kHz mono, duration, stitch-boundary, clipping, and embedded-chapter checks passed. A new checksum-bound chapter-review page contains the 12 ffprobe-read MP3 markers.
- Human full script-aligned listening QA, audio-integrity review, and manual chapter-marker review remain pending; no release, staging, or hosting state was advanced.

## 2026-09-20 — revision 0.2.4 radio-treatment boundary correction

- Corrected the speaker-label boundary immediately after the fictional Meadow Ridge–Harbor radio exchange so the explanatory prose beginning “The assigned code gives ATC…” is an ordinary `INSTRUCTOR` turn rather than VHF radio treatment. The header uses the renderer-recognized `**INSTRUCTOR:**` form.
- Bumped the Core 18 revision to 0.2.4 in the episode metadata, master script, show notes, and hosting metadata, regenerated `narration.md`, and reset the script-review and candidate-audio state. The narration contains 4,506 spoken words.
- Deterministic source mapping remains complete: 25 sources, 26 claims, and 84 source tags. The prior formal source-review report is intentionally stale because the current master-script semantic identity changed, although factual prose, claims, sources, source tags, and show notes did not.
- An independent Sol/High first-listen review found no required or optional finding: the final radio call is followed immediately by a clean Instructor turn, and the surrounding transition is coherent.
- The human editor has approved the revision subject to the required current source-relevance evidence and fingerprint-bound approval. No audio was rendered during this script-review reset.

## 2026-09-20 — revision 0.2.5 standard outro restored

- Restored the standard Announcer outro after the episode’s concise navigation-systems recap, preserving the recap as the lesson’s final content before the standard show-notes, feedback, open-source, and closing-study invitation.
- Bumped the revision to 0.2.5 in package and hosting metadata, regenerated `narration.md` to 4,557 spoken words, and reset the pending script-review fingerprint to `86bfad03495de3b9aa16fcc3fce9984b8fc3798613ffe8199597058fda3f2d1b`.
- The new spoken outro means the current source-relevance and editorial-approval evidence must be renewed before rendering. No audio was rendered during this reset.
- An independent Sol/High first-listen review found no required or optional findings. The recap, next-episode bridge, and standard closing remain a coherent clean Announcer sequence; the restored text is teaching synthesis, editorial bridge, and established show boilerplate rather than a new FAA-sourced claim.

## 2026-09-20 — revision 0.2.5 formal source-relevance review

- Received current-turn authorization to send the Core 18 unpublished source excerpts, claim inventory, and source-tagged master-script passages to OpenAI for the two-pass `--require-llm` review. The first invocation stopped before source export because the required QA authorization item had not yet been recorded; it is retained as a failed precondition record and not treated as review evidence.
- The successful run (`9af7c15e-720c-40ca-aed0-717e707eb6dc`) passed live retrieval, mapping for 25 sources, 26 claims, 84 source-tagged passages, and 25 show-notes links, and two independent `gpt-5.6-terra` source-relevance assessments with no material or editorial finding.
- The current 0.2.5 script awaits the human editorial approval that can be bound to its source-reviewed master-script fingerprint before any surgical audio rerender.

## 2026-09-20 — revision 0.2.5 approved and surgically rendered

- The human editor approved the source-reviewed 0.2.5 script. The approval is bound to master-script SHA-256 `86bfad03495de3b9aa16fcc3fce9984b8fc3798613ffe8199597058fda3f2d1b` in `episode.yaml`.
- Prepared the new segment work directory by reusing only files whose render-input SHA-256 matched the current segment’s voice, instructions, continuity context, and spoken text. Reused 55 of 61 segments from the prior candidate.
- Sent only segments 43–47, which cover the corrected radio-to-Instructor boundary, and segment 61, the restored Announcer outro, to OpenAI Realtime. The six fresh API segments have an estimated usage cost of $0.414060; the assembled manifest’s $2.663347 estimate is the aggregate of every segment in the complete candidate, including verified reuse records.
- Assembled `core-18-20260920T193437Z.mp3`, 31:34, SHA-256 `e3f7f6248b8def4719bee3e7f6ea4add17b6876439ec3f04783b1b779003bace`. Automated WAV/MP3 decode, 24 kHz mono, duration, stitch-boundary, clipping, and embedded-chapter checks passed. A checksum-bound chapter-review page contains the 12 ffprobe-read MP3 markers.
- Human full script-aligned listening QA, audio-integrity review, and manual chapter-marker review remain pending; no release, staging, or hosting state was advanced.

## 2026-09-20 — revision 0.2.5 audio QA accepted

- The human listener accepted the current candidate’s opening and required artificial intelligence-assisted production notice, and approved the full audio QA against the current script. The opening preview, full listening, and audio-integrity checklist items are complete for MP3 SHA-256 `e3f7f6248b8def4719bee3e7f6ea4add17b6876439ec3f04783b1b779003bace`.
- Manual chapter-marker review remains pending; no release, staging, or hosting state was advanced.

## 2026-09-20 — revision 0.2.5 chapter markers accepted

- The human reviewer approved the 12 embedded MP3 chapter markers on the checksum-bound review page for candidate SHA-256 `e3f7f6248b8def4719bee3e7f6ea4add17b6876439ec3f04783b1b779003bace`.
- Audio listening and chapter QA are complete. Publication-day source validation, hosting metadata validation, sealed handoff preparation, staging, and publication remain pending.

## 2026-09-20 — independent spoken-script review resolved

- The independent spoken-script review completed for the current 0.2.5 script and resolved the radio-treatment boundary and restored-outro checks with no required or optional findings. The reviewer confirmed that the radio example returns to clean Instructor narration and that the recap and standard Announcer outro are coherent on first listen.

## 2026-09-20 — publication-day source links verified

- The deterministic publication-day validation (`4e1fee35-9eb5-483d-945d-da1567f4e231`) revalidated all 25 FAA and manufacturer source records and all 25 listener-facing study links. It completed successfully with no link or citation-target failure and wrote `publication-link-validation.yaml`.
