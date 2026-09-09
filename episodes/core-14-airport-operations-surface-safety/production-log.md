# Airport Operations and Surface Safety — production log

## 2026-09-04 — package created

- Created the Core 14 package from the current standard episode template on branch `feature/core-14`.
- Confirmed the roadmap identity and primary anchors: Chapter 14 of the PHAK, the Private Pilot Airplane ACS taxiing, airport-operations, and night-operations tasks, and current airport-marking, lighting, taxiing, and runway-exit sections of the AIM.

## 2026-09-04 — initial source-led research and first draft

- Used the current Sol model with high reasoning for the initial source-led research and complete first draft.
- Researched official FAA-S-ACS-6C pages for Taxiing, Airport and Seaplane Base Operations, and Night Operations; Chapter 14 of FAA-H-8083-25C, the PHAK; and the current 2026 online sections of the AIM for runway and taxiway markings, signs, lighting, runway-status lights, taxiing, and clearing a runway.
- Verified current anchor numbering on the live FAA pages. In the online 2026 edition of the AIM, Pilot Control of Airport Lighting is Section 2-1-8, Taxiway Lights is Section 2-1-10, and Exiting the Runway After Landing is Section 4-3-21.
- Built the lesson around two distinct, explicitly hypothetical teaching frames: a busy daytime controlled airport with parallel and complex runway geometry, and a smaller nighttime airport with one runway and a parallel taxiway. No invented route, identifier, frequency, clearance, or lighting configuration is presented as current airport information.
- Organized signs, markings, lighting, and clearances by the decisions they support rather than as an inventory. The daytime scenario progresses from surface planning to clearance translation, route confirmation, a complex hold point, clearance/picture disagreement, and whole-aircraft runway exit. The night scenario progresses from airport identification to published pilot-controlled lighting, runway/taxiway recognition, and maintaining orientation after landing.
- Intentionally excluded time-sensitive runway-incursion statistics and airport-specific examples from the PHAK. The operational claims use current sections of the AIM, while the PHAK provides the chapter-level instructional picture and selected stable definitions and diagrams.
- Added labeled FAA visual-aid links for the spoken references to taxiway markings, enhanced centerlines, mandatory/location/direction signs, runway holding positions, runway-status lights, runway edge lights, pilot-controlled lighting, beacons, and taxiway lights.
- Created reciprocal mappings across 21 official sources, 25 material claims, the source-tagged `master-script.md`, and 18 show-note HTTPS links.
- Added a source-tagged Instructor-question and Learner-answer Retrieval review.
- Mechanically derived `narration.md` from `master-script.md`. The initial narration contains 4,295 spoken words with a 35–40 minute target.
- Recorded two formal-review focus areas: confirm the current anchors in the AIM during formal validation, and ensure no stale time-sensitive example from the PHAK entered the spoken script.
- At the close of the initial drafting pass, independent spoken-script review, resolution of its findings, formal source-relevance validation, human editorial review, audio rendering, staging, release work, commit, push, and PR creation remained for the lead workflow. No OpenAI relevance call or audio render was performed in that pass.

## 2026-09-04 — independent spoken-script review resolved

- A separate agent reviewed the spoken script for grammar, complete thoughts, internal continuity, and first-listen comprehension and returned six required findings.
- The independent spoken-script review's required findings were resolved before the draft moved to source-relevance validation.
- Deferred the red mandatory-sign example until after the sign family is defined, and replaced the ambiguous “right-looking number” phrase with “familiar-looking runway number.”
- Made the fictional route revision explicit: Delta replaces Bravo after Alpha, and the learner redraws that exact segment before movement.
- Reduced the pilot-controlled-lighting explanation to the operational decision: installed components may operate together or independently, so the pilot uses the published system description rather than an inventory of component names.
- Removed the instrument-runway caution-zone detail from the spoken lesson and Retrieval review, preserving the simpler runway-edge and runway-end color distinction. Updated the corresponding claim, source relevance description, research packet, and show-note visual-aid label.
- Established that the fictional connecting taxiway has a marked yellow centerline and blue edge lights, and replaced the undefined “lighting diagram” with the airport diagram plus published lighting information.
- Regenerated `narration.md`; the revised script contains 4,267 spoken words with the same 35–40 minute target. Reran the no-API structural checks after resolving the findings. Formal source-relevance validation and human editorial approval remain pending; `episode.yaml` continues to record source verification and editorial review as not started.

## 2026-09-04 — AIM pronunciation and reference style

- Introduced the Aeronautical Information Manual for listeners as the A-I-M, often referred to as “the aim,” and restored “the PHAK” and “the AIM” as the book names throughout the Core 14 lesson.
- Rephrased specific references as named sections of the AIM and applied the same listener-facing style to the show notes without changing source identifiers, URLs, or formal ledger locators.
- Added the narrow renderer transform from `AIM` to `aim`, documented it with the existing pronunciation policy, and added regression coverage that preserves the naturally spelled A-I-M introduction.
- Regenerated `narration.md`; the revised script contains 4,323 spoken words with the same 35–40 minute target. Reran no-API checks. Source verification and editorial review remain not started.

## 2026-09-08 — Astra teaching-draft promotion

- Created a one-off GPT-6 Astra high-reasoning teaching-and-delivery rewrite from the established Core 14 research package, then had a separate Astra reviewer assess its first-listen clarity, scenario continuity, ACS focus, opening-format compliance, dialogue cadence, and retrieval-review design.
- Revised the alternate draft to restore the standard series opening, podcast introduction, ACS framing, and outro; make the daytime and night scenarios concrete and continuous; correct the runway-status-light dialogue; and retain frequent Learner and Instructor interaction without turning the retrieval review into an inventory.
- Promoted the revised Astra draft to `master-script.md` at version 0.1.4. Preserved the prior Sol source-led draft as `master-script-sol.md` for posterity.
- Did not add a precise strobe-light on/off sequence: the current source package does not support that timing. A future addition requires a current source, locator, claim, and appropriate aircraft-context qualification.
- Reset script-review state, regenerated `narration.md`, and ran the no-API source mapping check. It confirms 110 source tags, 25 claims, and 18 show-note links are structurally consistent. Formal source-relevance validation and renewed human editorial approval remain pending before rendering.

## 2026-09-08 — source-relevance review requires revision

- Ran formal source-relevance validation against freshly fetched FAA sources and the current source-tagged Astra master script. The deterministic source, locator, claim-mapping, and show-note checks passed.
- The LLM review found seven partial-support findings across five claims: the ACS surface-recognition framing is broader than the cited ACS task; the surface-attention claim overgeneralizes low-visibility and incursion-avoidance guidance; the hold-short-readback claim enumerates readbacks not established by its PHAK passage; the explicit-runway-crossing claim combines clearance limitations with a scan detail from a different source; and the runway-status-light claim omits the source's safety-based exception when stopping or remaining clear is impractical.
- `episode.yaml` continues to record source relevance as pending. The findings need source-pure claim and spoken-prose revisions, followed by a fresh formal validation, before renewed editorial approval or rendering.

## 2026-09-08 — source-relevance review complete

- Resolved the source-relevance findings through source-pure claim and spoken-prose revisions, including distinct facts for clearance limits, scanning, hold-short readbacks, runway-status-light exceptions, airport-surface information, pilot-controlled-lighting exceptions, runway-exit conditions, and the complete runway-incursion definition.
- Reran formal validation against freshly fetched FAA sources until it reported no unresolved locator, claim, or tagged-passage findings. The final report records 21 source groups, 30 claims, 112 source tags, and 18 show-note links, bound to master-script version 0.1.10.
- Recorded the completed relevance-review timestamp in `episode.yaml`. Human editorial review and approval of the current script remain the next gate; no audio was rendered.

## 2026-09-08 — runway-crossing exterior-lighting addition

- Added the current FAA guidance from Section 4-3-24 of the AIM: at the pilot in command's discretion, exterior lights should be illuminated when taxiing on or across a runway, subject to equipment limitations and the effect of landing and strobe lights on others.
- Applied that guidance to the cleared Runway 18 crossing without introducing a fixed strobe on/off sequence. Supplemental strobes remain conditional: they should be off on the ground when they would adversely affect other pilots or ground personnel.
- Added the source ledger entry, source-pure claim, immediate script tag, show-note study link, and research-packet explanation. A factual script change requires a renewed source-relevance review and editorial approval before rendering.

## 2026-09-08 — source-relevance review complete after runway-lighting addition

- Validated the new AIM 4-3-24 exterior-lighting guidance and its show-note link. The script deliberately keeps the guidance conditional and does not invent a fixed strobe-light sequence.
- While revalidating the complete package, corrected three older source-alignment issues: mapped the holding-position boundary only to the AIM source that carries the complete claim, preserved the PHAK's closely spaced-runway exception using its exact less-than-one-thousand-foot condition, and restored the AIM's steady-burning qualifier for taxiway centerline lights.
- The final `--require-llm` report is clean for 22 sources, 31 claims, 115 source-tagged spoken passages, and 19 declared show-note links. The current report is bound to the version 0.1.11 source inputs and `master-script.md` SHA `f8a1e6bd669b3c4bf3f78d5ae5e3288875a03a2f0a01c7ccbfeb01917d69ebb8`.
- Source relevance is complete. Human editorial review and approval of the current script remain required before any render.

## 2026-09-08 — source-pure revision 0.1.5

- Narrowed the ACS communications-task claim and spoken introduction to runway-status-light knowledge supported by the cited page; removed the broader interpretation/orientation attribution from that source and its research-packet mapping.
- Removed general instructions to defer nonessential tasks or after-landing tasks until stopped. Preserved the PHAK's surface-position/traffic-awareness teaching and kept the AIM's continuous-scanning recommendation in its own paragraph and single-source claim. The lesson does not generalize the source's low-visibility-only deferral guidance.
- Split the composite readback and runway-crossing claims into individually supported facts: shared hold-short readback responsibility, AIM-only enumerated runway readbacks, shared explicit crossing clearance, AIM-only departure-runway-assignment limitation, and PHAK-only runway/final-approach traffic scan. Updated only reciprocal `supports_claims` arrays in the affected existing source records; no sources, URLs, or locators were introduced or changed.
- Kept runway-status-light action tied to the safely stopped-before-entry scenario and included the source's safety-feasibility condition: if stopping or remaining clear is impractical for safety, use best judgment and contact ATC as soon as possible. Preserved the source's no-clearance meaning and ATC-conflict resolution.
- Changed spoken prose only in `What the ACS is asking you to connect`, `Translate the clearance before moving`, `When the clearance and the picture disagree`, `Clear the runway before the next task`, and `Retrieval review`; retained the established opening, scenarios, runway-crossing sequence, and guided question/answer format.
- Ran the required script-review reset with reason `Resolved source-relevance findings in the authoritative Astra draft.`, then regenerated `narration.md` mechanically. Synchronized script/show-note/episode/hosting content versions to 0.1.5 and the episode word count to 6,212; mutable gate statuses came only from the reset tool.
- The no-API source-validator dry run passed for 21 sources, 29 claims, 110 master-script source tags, and 18 show-note links. This is a structural check, not source-relevance approval. The prior formal report remains historical evidence for the superseded inputs; fresh formal LLM validation and human editorial reapproval are still required.

## 2026-09-08 — tower-operating context revision 0.1.6

- The next formal relevance pass resolved the prior seven findings and identified three remaining context omissions: the holding-position clearance condition, explicit runway-crossing clearance, and departure-runway-assignment limitation need the operating-control-tower context stated in the source.
- Updated only those three claims and the corresponding spoken explanations in `Translate the clearance before moving`, `Read signs and markings as a route`, `Hold short before the complex intersection`, `When the clearance and the picture disagree`, and `Retrieval review`. The daytime scenario remains the same airport with its tower operating; no new exception discussion or generic aviation lesson was added.
- Used `during the control tower's operating hours` for the crossing/assignment rules and `an airport with an operating control tower` for the holding-position condition. Updated the research packet's corresponding summaries. Claim IDs, source IDs, reciprocal mappings, locators, and source tags were unchanged.
- Ran the required script-review reset with reason `Resolved remaining source-relevance context findings.`, mechanically regenerated narration, and synchronized version/count facts to 0.1.6 and 6,254 spoken words. Mutable review and release gates came only from the reset tool.
- The no-API validator passed again for 21 sources, 29 claims, 110 master-script source tags, and 18 show-note links. A fresh formal LLM source-relevance pass and human editorial reapproval remain required; no API or audio work was performed in this revision.

## 2026-09-08 — each-runway and runway-exit source revision 0.1.7

- The fresh 0.1.6 review left two partial-support findings: the PHAK crossing passage needed the general each-runway cross-or-hold condition, and the runway-exit claim conflated the definition of being clear with the subsequent movement beyond the holding-position markings.
- Added a source-pure PHAK statement in `Hold short before the complex intersection` and recalled it in `Retrieval review`: during the tower's operating hours, ATC issues an explicit cross or hold-short instruction for each runway, including active, inactive, and closed runways. Added the PHAK-only `each-runway-cross-or-hold` claim and its reciprocal source mapping; retained the narrower shared `explicit-runway-crossing` claim and the separate AIM-only departure-runway limitation.
- Revised `Clear the runway before the next task` and its retrieval exchange to distinguish all parts beyond the runway edge with unrestricted continued movement beyond the holding-position markings from the following instruction to taxi beyond those markings and hold unless ATC gives further instructions. Corrected `clear-of-runway` and the research summary. The separate crossing-boundary passages and their holding-marking source were left intact.
- Ran the required script-review reset with reason `Resolved each-runway instruction and runway-exit definition source findings.`, regenerated narration, and synchronized script, episode, hosting content, and show-note version facts to 0.1.7. The episode word count is 6,361. Mutable gate state was changed only by the reset tool.
- The no-API validator passed for 21 sources, 30 claims, 111 master-script source tags, and 18 show-note links. This is input-shape and mapping validation only; a fresh formal LLM relevance review and human editorial reapproval remain required. No API, web, render, commit, push, or PR action was performed.

## 2026-09-08 — surface inputs, lighting duration, and exit context revision 0.1.8

- The next formal review identified three partial-support findings. Narrowed `surface-plan` and its PHAK-tagged paragraphs in `Build the surface picture before moving` and `Retrieval review` to NOTAM/ATIS information. Airport-diagram teaching remains under the separate existing `acs-taxiing-outcome` claim and ACS tags; added the existing diagram-teaching section to that claim's section list.
- Added the source's earlier-shutoff exception for certain one-step or two-step runway end identifier lights to `pilot-controlled-lighting`, `Use pilot-controlled lighting as published`, and `Retrieval review`. Fifteen minutes is described as the normal illumination period rather than a guarantee for every light.
- Added `in the absence of ATC instructions` to `clear-of-runway` and the post-landing teaching/retrieval movement instructions. The whole-aircraft runway-edge definition remains distinct from the subsequent movement beyond holding-position markings.
- Updated the corresponding research summaries. No source IDs, source mappings, URLs, locators, or show-note prose/links changed. Ran the required review-state reset and derived narration; synchronized version facts to 0.1.8 and episode word count to 6,362.
- No-API validation passed for 21 sources, 30 claims, 111 source tags, and 18 show-note links; `git diff --check` passed. Fresh formal LLM relevance validation and human editorial reapproval remain required. No API, web, render, commit, push, or PR action was performed.

## 2026-09-08 — runway-incursion intent condition revision 0.1.9

- The 0.1.8 formal review left one partial-support finding: the practical runway-incursion explanation omitted an aircraft intending to take off or land. Changed that phrase in `Hold short before the complex intersection` to `taking off or landing, or intending to do either`, and made the ground context explicit.
- Added the same complete definition to `Retrieval review` in its own PHAK-tagged paragraph immediately after the separately AIM-tagged holding-position answer. The existing `runway-incursion` claim already contained both intending conditions, so its wording was preserved and `Retrieval review` was added to its section mapping. Added a matching research note; no source records changed.
- Ran the required script-review reset and regenerated narration. Script, episode, hosting content, and show-note versions are 0.1.9; the episode word count is 6,422. Mutable gate fields were changed only by the reset tool.
- No-API validation passed for 21 sources, 30 claims, 112 source tags, and 18 show-note links; `git diff --check` passed. Fresh formal LLM relevance validation and human editorial reapproval remain required. No API, web, render, commit, push, or PR action was performed.

## 2026-09-08 — beacon and taxi-light guidance addition

- Added a source-pure ground-lighting passage immediately before the existing cleared-runway-crossing discussion. It distinguishes the AIM's before-taxi recommendation for navigation, position, and anti-collision lights when equipped; the FAA's voluntary rotating-beacon guidance for general aviation while the engine is operating; and the taxi-light recommendation to signal movement or intent to move, then be off when stopped or yielding.
- Kept the separate crossing-specific exterior-light and strobe guidance intact. The episode does not claim that the beacon is required throughout preflight or that a taxi light must be on during every moment of ground movement; neither statement is the AIM's wording.
- Added `ground-lighting-practice`, expanded the AIM 4-3-24 locator through paragraphs a.4-a.6, updated the show-note description and fact-check row, and removed the duplicate mutable source-verification status from public show notes. `episode.yaml` remains the sole mutable gate record.
- Ran the required script-review reset, regenerated `narration.md`, and reran formal `--require-llm` validation. The final report is clean for 22 sources, 32 claims, 116 source-tagged spoken passages, and 19 declared show-note links, bound to version 0.1.12 source inputs and `master-script.md` SHA `61262079c22cdba798f5107a3e3abd2e31324c8befec347db0bb07dfb91450c3`.
- Source relevance is complete. Human editorial approval of the current script remains required before rendering.

## 2026-09-08 — human editorial approval

- The human editor approved master-script version 0.1.12 after reviewing the source-validated beacon, taxi-light, and runway-crossing-lighting additions.
- Ran `episode:script-review --approve`; `episode.yaml` now records `review.editorial_status: script_approved` and binds approval to master-script SHA `61262079c22cdba798f5107a3e3abd2e31324c8befec347db0bb07dfb91450c3`.

## 2026-09-08 — opening audio QA accepted

- Rendered reusable segments 1 through 5 with Marin and Ballad, then assembled `audio-artifacts/core-14-20260908T175412Z.preview-001-005.mp3` (SHA-256 `fdebea3cf0d720db6afc790e28fa9a6d211c510c70e046bbc4fb1809d1912a13`; 120.320 seconds).
- Automated analysis passed MP3 decode, 24 kHz mono format, duration agreement, and stitch checks. Human opening QA accepted the preview and required notice. The rendered voice segments are preserved for safe reuse in the full candidate.

## 2026-09-08 — full candidate rendered

- Assembled `audio-artifacts/core-14-20260908T175412Z.mp3` from the 135-segment approved narration plan, safely reusing the accepted opening segments. The candidate is 42:30 and has SHA-256 `3b873bbd0755d0248b45cdb0d55373b49aa723d2723f38ac582e11736e053eae`.
- Automated analysis passed WAV and MP3 decode, 24 kHz mono format, duration agreement, 135 stitch-boundary checks without discontinuity warnings, no clipped samples, and ffprobe validation of 15 embedded ID3 chapter markers. The checksum-bound local chapter-review page was generated from the embedded MP3 chapters.
- Full human script-aligned listening QA and manual chapter-marker review remain pending.

## 2026-09-09 — music-bed assembly correction

- The initial full assembly omitted the `--music-bed` option, so its render manifest correctly recorded no bed. Reassembled the identical 135 rendered voice segments without an OpenAI request, using the committed royalty-free track and the established mix: 10-second intro lead, -30 dB under voice, 5-second full-level intro continuation with a 0.5-second fade, and a 10-second full-level outro continuation with a 5-second fade.
- The replacement candidate is `audio-artifacts/core-14-20260908T175412Z.mp3` (SHA-256 `58d8b573c712213da15d7ad5dff125ed346c0e12529b697b2fdf11a7b1cbc879`; 42:59). Automated audio and embedded-chapter checks passed, and its checksum-bound chapter-review page was regenerated. Human listening and chapter-marker review remain pending for this corrected candidate.

## 2026-09-09 — full audio and chapter QA accepted

- Human script-aligned listening QA and manual review of the 15 embedded chapter markers are accepted for the corrected, checksum-bound 42:59 candidate.
- The remaining release gates are publication-day source/link validation and the sealed hosting handoff.

## 2026-09-09 — publication-day source validation complete

- Revalidated 22 FAA source groups and 19 listener-facing show-note links against their cited targets. The formal LLM source-relevance review found no failures across 32 claims and 116 tagged spoken passages; `link-validation.yaml` is bound to the current package inputs and completed at `2026-09-09T12:59:53.641Z`.
- Bound publication timestamp `2026-09-09T13:00:08Z`, episode number 14, 42:59 runtime, and the checksum-bound accepted MP3 to the hosting metadata. Final pre-hosting validation and sealed-handoff creation are next.

## 2026-09-09 — hosting handoff prepared

- Final pre-hosting validation passed. The release package is ready to be sealed from its final source-package bytes.
- The handoff will bind the 42:59 candidate MP3 SHA-256 `58d8b573c712213da15d7ad5dff125ed346c0e12529b697b2fdf11a7b1cbc879`, 15 chapters, publication timestamp, and source-package file hashes. Staging in the hosting repository and both PRs remain intentionally deferred.

## 2026-09-08 — PHAK clearance-passage alignment revision 0.1.10

- The 0.1.9 review identified two claim/passage mismatches under `phak-clearance-discipline`. Updated only its paragraph in `Translate the clearance before moving`: explicitly request progressive taxi when the airport is unfamiliar or the route uncertain, and state that ATC must obtain a pilot readback of all runway hold-short instructions.
- Both facts remain within the existing immediate PHAK tag. The claims already expressed these conditions and their section mappings were correct, so claim text and reciprocal source mappings were preserved. The separate AIM teaching and retrieval paragraphs already contain the relevant facts and were left unchanged; no mixed-source paragraph was introduced.
- Ran the required review-state reset and derived narration. Script, episode, hosting content, and show-note version fields are 0.1.10; the episode word count is 6,454.
- No-API validation passed for 21 sources, 30 claims, 112 source tags, and 18 show-note links; `git diff --check` passed. Fresh formal LLM relevance validation and human editorial reapproval remain required. No API, web, render, commit, push, or PR action was performed.
