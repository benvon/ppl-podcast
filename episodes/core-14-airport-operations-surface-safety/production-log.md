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
