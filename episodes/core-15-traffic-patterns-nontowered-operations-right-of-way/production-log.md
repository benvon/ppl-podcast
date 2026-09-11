# Traffic Patterns, Nontowered Operations, and Right of Way — production log

## 2026-09-09 — Initial research package

- Created a source ledger, claim inventory, learner-facing study links, and scenario-led teaching plan.
- Set the episode scope around the private-pilot decisions that connect traffic-pattern planning, CTAF information sharing, visual scanning, spacing, and right of way.
- Selected the ACS, the PHAK, the Airplane Flying Handbook, the AIM, AC 90-66C, AC 90-48E, and 14 CFR sections 91.113 and 91.126 as the initial authority set.
- Preserved the distinction between eCFR requirements and FAA guidance. Formal source-link and source-relevance validation remain required before editorial review.

## 2026-09-09 — Independent adversarial spoken-script review completed and redraft resolved

- Completed the required independent review of grammar, complete thoughts, within-episode callbacks and call-forwards, and first-listen comprehension.
- Rebuilt the lesson as one connected Pine Valley Class G arrival. The listener now draws Runway 18 left traffic before hearing reports, delays the standard entry until spacing exists, follows the same aircraft through downwind and base, and resolves a visible convergence before discussing landing priority and wake.
- Corrected the traffic-pattern vocabulary: the departure leg begins after takeoff on the extended runway centerline; the upwind leg is a separate leg parallel to the landing runway in the direction of landing.
- Made the Pine Valley Class G assumption explicit before teaching 14 CFR 91.126. Split the Class G regulatory requirement from AIM and AC pattern-direction guidance, and split every later regulatory statement from practical FAA guidance.
- Replaced the abstract convergence discussion with a drawable position: the training airplane is northbound on east-side downwind for Runway 18 while another same-category airplane approaches from its right toward the same downwind line. Corrected the category language to preserve 14 CFR 91.113's distinct priorities, including the towing-or-refueling aircraft's priority over other engine-driven aircraft.
- Bound practical spacing advice to AC 90-66C rather than presenting it as an unstated procedure. Split mixed-source Retrieval review answers into source-pure paragraphs; every Retrieval review Instructor or Learner paragraph now has an immediate source tag or an explicit teaching-synthesis label.
- Reconciled the source ledger's reverse claim mappings, claim inventory section mappings, and show-notes manifest. A deterministic source-mapping dry run passed with 52 master-script source tags, 13 show-notes links, 12 sources, and 18 claims.
- Regenerated `narration.md` from the revised master script. Its 3,695 spoken words support approximately 25-30 minutes at normal instructional pacing.
- No OpenAI request was made during this redraft. Formal network and `--require-llm` source-relevance review remain pending and must occur before human editorial approval or rendering.

## 2026-09-09 — Editorial clarification before source-relevance review

- Revised `Build the traffic picture before arriving` to place Chart Supplement, AIM, and NOTAM review in the preflight briefing. The approach now uses current CTAF traffic calls, the airport’s ASOS/AWOS broadcast when available, and outside observation. The script now states explicitly that preflight information is planning context while the immediate collision picture depends on current traffic heard and seen.
- Replaced the previous departure-versus-upwind explanation after checking the primary sources. The PHAK figures on pages 14-21 and 14-22 provide the overall pattern model and label departure. AIM 4-3-2 defines upwind as an extension of departure along the extended centerline for control separation, spacing, or sequencing. AFH Chapter 8 defines departure from liftoff through the turn to crosswind and discusses upwind as a same-direction runway course in controlled-airport and go-around contexts. The lesson now treats departure and upwind reports as cues to verify position, direction, and intent, not as evidence of an invented gap between two airplane positions.
- Revised `Join the established flow` with AFH-supported, bounded ways to remain clear. The Pine Valley arrival approaches from the upwind side; it uses the AFH’s above-pattern, well-clear, scan, descend, and later 45-degree-entry example. When a conflicting 45-degree entry cannot be completed, the AFH’s supported alternative is to turn away from downwind, fly a safe distance away, scan, and return for another entry attempt. The script deliberately does not recommend a generic right 360.
- Revised `Communicate to improve the shared picture` to call the position-and-intention transmission a radio call and to replace “slow the decision down” with a later approach when traffic cannot be visually resolved before base.
- Revised `Resolve conflicts before they become close` and `Land without turning priority into pressure` to carry see-and-avoid through every geometry discussion, remove the vague “another circuit” wording, use the AC 90-66C straight-ahead go-around path for an unsafe approach, and add AFH support for checking final traffic before turning from base.
- Added AIM automated-weather and AFH traffic-pattern sources, new source-pure claims, show-note study links, and reciprocal source/claim mappings. The deterministic source-mapping dry run passed with 67 master-script source tags, 15 show-notes links, 14 sources, and 25 claims.
- Regenerated `narration.md`; the revised draft contains 4,457 spoken words, supporting the episode’s 25-30 minute target at an instructional delivery pace near 150 words per minute.
- No OpenAI request was made during this revision. Formal network and `--require-llm` source-relevance review remain pending before human editorial approval or rendering.

## 2026-09-10 — Editorial safety and source-clarity redraft (version 0.1.1)

- Replaced the opening close-call phrasing with a direct statement that right-of-way knowledge supports collision-avoidance decisions. Changed spoken airspace names throughout the script to aviation phonetic forms, including Class Golf.
- Clarified the information sequence: AC 90-66C remains the cited authority that lists appropriate preflight publications, while the script now teaches a routine briefing as airport-specific current information such as the Chart Supplement and NOTAMs. It presents the AIM as FAA reference guidance for study or a specific operational question, not as routine current airport information. The approach sequence relies on current CTAF reports, ASOS/AWOS when available, and outside observation.
- Added AIM 4-3-4 as a distinct source and claim for visible traffic-pattern indicators. The lesson now distinguishes Chart Supplement information from an installed segmented-circle indicator or, when there is no segmented circle, an indicator on or near the runway approach end that can visibly indicate right turns.
- Made convergence yielding drawable and concrete. The eCFR passage remains separate: the airplane with the other on its right gives way and may not pass over, under, or ahead unless well clear. The script labels as teaching synthesis the practical geometry of allowing the other airplane to pass ahead and positioning behind it; it does not prescribe a departure from downwind or an ad hoc 360.
- Used the AFH-supported remain-clear/reentry alternative only before joining downwind: turn away from downwind, fly a safe distance away, scan, and return for a later 45-degree entry when spacing permits. For an unresolved base-to-final conflict, the script instead uses AFH final-spacing guidance and the AC 90-66C straight-ahead go-around path. Added source-pure retrieval prompts and answers for this sequence.
- Revised the Class Golf retrieval question to ask specifically for the left-turn requirement unless another direction is indicated. Updated the research packet, show notes, source ledger, claim inventory, and show-notes manifest for the added AIM source and claim.
- Regenerated `narration.md` from the version 0.1.1 master script. Its 4,798 spoken words support the 25-30 minute target at an instructional delivery pace near 160 words per minute. Reset script-review state for the revised master-script hash.
- The deterministic source-mapping dry run passed with 74 master-script source tags, 16 show-notes links, 15 sources, and 26 claims; no network or API request was made. Source-relevance validation with `--require-llm` remains pending and no commit was created.

## 2026-09-10 — Primary-source locator revision (version 0.1.2)

- Rebuilt the source ledger and claim inventory around the exact fragments required for source relevance review: ACS Communications p. 24 and Traffic Patterns p. 25; AC 90-66C preflight p. 5, CTAF/straight-in p. 8, quiet-CTAF and wake p. 10, communications note p. 13, and entry/go-around p. 15; AFH pp. 8-4 through 8-6; PHAK pp. 14-21 and 14-22; AIM sections 4-1-9, 4-3-2 through 4-3-4, 4-3-27, and 7-4-4 through 7-4-5; and the API-refreshed September 8, 2026 eCFR sections.
- Kept Pine Valley scenario-led teaching while separating exact FAA facts from teaching synthesis. The quiet-CTAF language no longer speculates about traffic not being on frequency or not being heard. CTAF language now teaches reports and the explicit AC caution not to broadcast an assumed landing sequence, rather than calling CTAF an ATC clearance service.
- Split deliberate scanning and blind-spot support from display limitations, split the PHAK visual map from AIM/AFH departure-upwind terminology, and split standard entry, upwind-side entry, conflicting-entry retry, base/final avoidance, and straight-ahead go-around support into their exact source fragments.
- Corrected the 14 CFR 91.113 category hierarchy: distress is separate; balloon precedes every other category; glider precedes airship and engine-driven aircraft; airship precedes engine-driven aircraft except towing/refueling aircraft; towing/refueling aircraft precede other engine-driven aircraft. Passing behind with a growing visual gap remains explicitly labeled teaching synthesis.
- Updated show notes, manifest mappings, research packet, source tags, and the derived narration. The current version 0.1.2 derivative has 4,863 spoken words and a reset script-review hash of `2b1fde0ea0043c0b58bdb424a6cb6a8e66082a3668aba38a5d2d663b4add525c`. The deterministic dry run passed with 83 master-script source tags, 15 show-notes links, 28 sources, and 32 claims. No OpenAI request was made and no commit was created.

## 2026-09-10 — Source-relevance remediation after review attempt 2c7d24b6 (version 0.1.3)

- Narrowed ACS, PHAK, ASOS/AWOS, quiet-CTAF, standard-entry, right-of-way, and wake language to the reviewed source fragments. Preserved Pine Valley’s scenario and explicitly labeled its compass geometry, yielding-behind picture, and other practical reasoning as teaching synthesis where the FAA source does not prescribe that exact inference.
- Removed the unsupported straight-in-priority claim; a straight-in report is now taught as a traffic-picture input followed by visual scan and right-of-way analysis. Corrected 91.126 to the powered fixed-wing approach-to-land scope and corrected the exact 91.113 category hierarchy.
- Regenerated narration, reconciled claims, source ledger, research packet, show notes, and manifest, then reset script review. The resulting version 0.1.3 draft has 4,903 spoken words; the reset master-script hash is `cf3c44a85887022ce349a464762dd9f460162803aac61ef0b571773d0fb627a8`. The deterministic dry run passed with 82 source tags, 15 show-notes links, 28 sources, and 31 claims. No OpenAI request was made and no commit was created.

## 2026-09-10 — Exact straight-in priority source binding (version 0.1.4)

- Added the stable FAA HTML anchor for AIM 4-1-9(g)(4), “Straight-in Landings,” as a dedicated source and show-notes link. The source states that aircraft executing a straight-in approach do not have priority over other aircraft in the traffic pattern and must comply with 14 CFR 91.113(g).
- Split the source-bound rule from the surrounding Pine Valley teaching synthesis so the formal relevance review receives the exact paragraph rather than a truncated general CTAF section. Regenerated narration and reset script review with master-script hash `8c433cecb638f587404d5f2ea40fbb7ba081c26a23ad8e22e906ba16fca66a6e`; formal source relevance remains pending.

## 2026-09-10 — Final source-wording alignment (version 0.1.5)

- Narrowed six remaining source-review phrases to the exact terms used by the cited FAA records: ACS pattern selection, quiet-frequency vigilance, deliberate scanning, AIM pattern terminology, the 14 CFR category hierarchy, and the landing right-of-way limitation for aircraft already attempting to clear the runway.
- Preserved the Pine Valley scenario and all teaching-synthesis decisions. Regenerated narration and reset script review with master-script hash `44d467b760f9c772f5d870b7bfdbdc91b1142841ef99caa210bb36f1d2953b81`; formal source relevance remains pending.

## 2026-09-10 — Final FAA-fragment alignment (version 0.1.6)

- Removed the redundant AFH quiet-CTAF source from the source ledger, research packet, claim, and script tags. AC 90-66C alone supplies the exact quiet-frequency and radio-less-aircraft wording used in the lesson.
- Added the AFH’s announce-intentions step to both upwind-side entry passages. Rewrote each conflicting-entry passage to retain its source conditions, scan, away-and-return path, and 45-degree retry; the generic transition is now labeled teaching synthesis rather than source-bound guidance.
- Made the claim inventory’s right-of-way and landing claims carry the eCFR’s omitted limits: same-category convergence at approximately the same altitude, the head-on exception, and making way off the runway surface. The spoken landing passages use the same condition.
- Regenerated `narration.md` and reset script-review state for the version 0.1.6 master-script hash `f90c6b69dd77240cf1368000b55fb22327ea1d1cd187b0081846b587a98b8abd`. The deterministic source-mapping dry run passed with 81 master-script source tags, 16 show-notes links, 28 sources, and 32 claims. Formal source relevance remains pending.

## 2026-09-10 — Remaining source-condition alignment (version 0.1.7)

- Preserved AC 90-66C’s complete standard-entry condition in the claim and spoken passages: a 45-degree downwind entry abeam the midpoint of the runway to be used for landing. Moved the surrounding scenario rationale to teaching synthesis.
- Preserved the AFH’s complete conflicting-entry sequence by stating the course-or-speed adjustment before joining downwind alongside the turn-away, scan, and retry path.
- Limited the display source to its supported point—that a traffic display does not replace outside scanning—and moved the radio-use heuristic to teaching synthesis.
- Regenerated `narration.md` and reset script-review state for the version 0.1.7 master-script hash `2d7cafc27a6f4d9c63e28ee5ba52d9cdcd48a8fc50e20fff5d66e46cbac745c4`. The deterministic source-mapping dry run passed with 78 master-script source tags, 16 show-notes links, 28 sources, and 32 claims. Formal source relevance remains pending.

## 2026-09-10 — Source-relevance review complete (version 0.1.7)

- Formal LLM source-relevance review passed cleanly at `2026-09-10T16:43:45.227Z`: all 28 sources, 32 claims, 78 source-tagged passages, and 16 show-notes links passed. The canonical report is `link-validation.yaml`; no failure marker remains.
- Recorded the completed source gate in `episode.yaml`, `show-notes.md`, and the QA checklist. The package now awaits human editorial approval of the current script before any audio render.

## 2026-09-10 — Human editorial approval (version 0.1.7)

- The human editor approved the source-validated v0.1.7 script. `episode:script-review --approve` bound that approval to master-script SHA-256 `2d7cafc27a6f4d9c63e28ee5ba52d9cdcd48a8fc50e20fff5d66e46cbac745c4`.
- The next gate is the reusable five-segment opening audio preview, followed by human listening QA before a full render.

## 2026-09-10 — Landing-priority clarity revision (version 0.1.8)

- Replaced the opaque landing-right-of-way paraphrase with: “Landing priority is not permission to land so close behind another aircraft that it must rush its runway exit.” The listener-facing sentence is explicitly labeled teaching synthesis.
- Retained the source-bound final-approach, lower-aircraft, and no-cutting-in-front-or-overtaking rules; removed the difficult-to-speak runway-surface paraphrase from the source claim.
- Regenerated `narration.md` and reset the source and editorial gates for master-script SHA-256 `43e5ef8c33d99b44161ed0a12b505b0b4431db962f77360af66bc0726ed3d3f4`. The deterministic package check passed with 76 source tags, 16 show-notes links, 28 sources, and 32 claims. A new LLM source-relevance review and editorial approval are required before rendering.

## 2026-09-10 — ACS and established-pattern distinction (version 0.1.9)

- Removed “pattern selection and direction” from the ACS-attributed opening. The source-bound sentence now lists only the ACS task elements directly present on the cited page.
- Added an explicitly labeled teaching-synthesis transition: the pilot confirms the runway and applicable pattern direction, then adheres to the established flow rather than inventing one.
- Regenerated `narration.md` and reset the source and editorial gates for master-script SHA-256 `b0baa7d87587cf07e32c7a6bf5fc440016f30bdf9db3b9c0e3b2926693b17067`. The deterministic package check passed with 76 source tags, 16 show-notes links, 28 sources, and 32 claims. A new LLM source-relevance review and editorial approval are required before rendering.

## 2026-09-10 — Upwind-side entry altitude context (version 0.1.10)

- Added the AFH’s conditional 2,000-foot AGL consideration to the upwind-side entry explanation and its Retrieval review recap. The lesson presents it as an additional planning consideration when large or turbine-powered aircraft may be using the airport, not as a mandatory replacement for the AFH’s ordinary above-pattern crossing model.
- Updated the source-bound claim, package version metadata, and show-notes version. Removed the duplicate mutable source-verification status from show notes; `episode.yaml` remains the authoritative workflow record.
- Regenerated `narration.md` and reset the source and editorial gates for master-script SHA-256 `3b4b316ae1b2251af938988c344fe4b2dfa410a634a1d10de691dffb966242d3`. The deterministic package check passed with 76 source tags, 16 show-notes links, 28 sources, and 32 claims. A fresh source-relevance review and editorial approval are required before rendering.

## 2026-09-10 — Upwind-side entry sequence clarification (version 0.1.11)

- Clarified that the AFH’s 2,000-foot AGL consideration applies during the field overflight and while remaining outside the traffic pattern when large or turbine-powered aircraft may be using the airport. The sequence then explicitly returns to the published pattern altitude after the airplane is well clear of the pattern, before its later 45-degree downwind entry.
- Regenerated `narration.md` and reset the source and editorial gates for master-script SHA-256 `798412c6be18488458e071952c63b70e9020df18d5956b27cd74ff9e37dc983a`. The deterministic package check passed with 76 source tags, 16 show-notes links, 28 sources, and 32 claims. A fresh source-relevance review and editorial approval are required before rendering.

## 2026-09-10 — Source-relevance review complete (version 0.1.11)

- With explicit authorization, ran the formal LLM source-relevance review against the current source excerpts, claim inventory, and source-tagged passages. The report completed cleanly at `2026-09-10T20:39:46.080Z`: 28 sources, 32 claims, 76 source tags, and 16 show-notes links passed.
- Recorded the completed source gate in `episode.yaml` and the QA checklist. Human editorial approval of the current script remains the next gate.

## 2026-09-10 — Human editorial approval (version 0.1.11)

- The human editor approved the source-validated v0.1.11 script. `episode:script-review --approve` bound that approval to master-script SHA-256 `798412c6be18488458e071952c63b70e9020df18d5956b27cd74ff9e37dc983a`.
- The next gate is the reusable opening audio preview, followed by listening QA before a full render.

## 2026-09-10 — Accepted audio candidate

- Rendered the full episode from the current narration derivative and assembled the accepted candidate `core-15-20260910T212843Z.mp3`. The candidate uses the declared series music plan and embeds 11 ID3 chapter markers.
- Replaced only the pronunciation-affected segments during QA: CTAF is rendered as “seetaff”; ASOS and AWOS are rendered as “ay-soss” and “ay-wahs.” The human script-aligned listening QA is accepted.
- Automated WAV/MP3 decode, format, duration, clipping, stitch-boundary, and ffprobe chapter checks passed. Manual review of this candidate’s chapter markers and publication-day source/link validation remain before hosting handoff.

## 2026-09-10 — Chapter-marker review accepted

- Manual chapter review of `core-15-20260910T212843Z.mp3` is accepted. The 11 embedded markers begin at `00:00`, use listener-facing section titles, and are bound to MP3 SHA-256 `f1cc2f53f6c24950d6f3158418f708c3dd357023f1665a29611b9766f7bf493f`.

## 2026-09-10 — Publication-day source validation and adjudication

- Revalidated all 28 source citations, 32 claims, 76 source-tagged passages, and 16 listener-facing study links with the current eCFR Title 14 date pins. The final LLM review completed at `2026-09-10T22:28:41.838Z` with no unresolved link, locator, or source-mapping finding.
- The reviewer again marked the scoped `landing-right-of-way` claim partially supported because it does not restate an adjacent 14 CFR 91.113(g) provision. The human episode editor determined that omission is nonmaterial to this lesson and authorized a single `accepted_nonmaterial_omission` adjudication. It is bound to the exact source, claim, and current sources, claims, script, show-notes, and show-notes-manifest hashes; a later input change invalidates it.
