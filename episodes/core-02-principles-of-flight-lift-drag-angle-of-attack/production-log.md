# Principles of Flight: Lift, Drag, and Angle of Attack — production log

## 2026-08-13 — package created and research draft prepared

- Created from the standard episode template.
- Confirmed the Core 02 guide topic: “Principles of Flight: Lift, Drag, and Angle of Attack,” with PHAK Chapter 4 as the teaching spine.
- Expanded the source-tagged draft script to a 30-minute, approximately 5,000-word study lesson.
- Updated the shared template and Realtime renderer contract for Instructor, Learner, and Announcer roles. The Announcer voice is `ballad`; a representative three-voice preview and full listening QA remain required before rendering a public candidate.
- Status: draft; not cleared for public release.

## 2026-08-13 — instructional refinement and source check

- Refined the angle-of-attack explanation for a listener building a first mental picture: the chord line stays fixed in the wing, while the relative-wind arrow follows the airplane’s path through the air.
- Defined “airfoil” immediately after first use and added four labeled FAA visual-aid links to the show notes.
- Made preserving useful airflow over the airfoil a recurring lesson takeaway, without adding aircraft-specific maneuver technique.
- Added the relationship between published one-G stall speeds and angle of attack, including the limitation that a published value applies to stated conditions rather than every flight condition.
- Updated the source ledger and claim inventory for airfoil definition, airflow protection, and published-speed context. All seven official FAA/ACS links resolved on 2026-08-13; claim mappings passed repository validation.
- The requested `--require-llm` relevance pass could not be completed because `OPENAI_API_KEY` is unavailable in this workspace. The generated validation record reports all link checks as valid but every LLM relevance assessment as `not_assessed`; the source-verification release gate remains open.
- Revised script word count: 5,332 spoken words. Status remains draft; not cleared for public release.

## 2026-08-13 — script draft approved

- Approved the revised script draft at version 0.2.0.
- Captured Core 02 drafting lessons in `docs/script-drafting-playbook.md`: build one causal step at a time, make diagram narration audible, keep Learner turns earned, connect theory to the specific airplane through the POH/AFM, define ACS relationships before invoking them, and avoid repetitive scope disclaimers.
- Updated the recorded spoken word count to 5,326 after final editorial tightening. Source-verification, audio rendering, listening QA, and release gates remain open.

## 2026-08-13 — full candidate rendered

- Rendered and assembled the complete 103-segment script with `gpt-realtime-2.1`: Marin as Instructor, Cedar as Learner, and Ballad as Announcer.
- Candidate artifact: `audio-artifacts/core-02-20260813T182631Z.mp3`; lossless master, render manifest, quality report, and resumable segment directory are recorded in `audio-manifest.yaml` and remain Git-ignored.
- Runtime: 33:28 (2,008.97 seconds). Usage-derived estimate: $2.908905.
- Automated post-assembly QA passed: MP3 and WAV decode, 24 kHz mono format, duration agreement, 103 stitch boundaries with no discontinuity warnings, and no clipped samples.
- Status: candidate rendered, not release-ready. Complete script-aligned human listening QA, required LLM source relevance review, publication-day source verification, and hosting validation remain open.

## 2026-08-13 — script-aligned listening QA approved

- The complete candidate was listened to against the approved master script and accepted. The required production notice, technical terms, numbers, acronyms, transitions, and joins passed listening QA.
- Updated the QA checklist and episode review status. The audio candidate is approved for publication preparation, not public release.
- Prepared hosting-handoff metadata with the 33:28 runtime, episode number, listener-facing description, and a complete list of remaining gates. Hosting handoff is blocked until the required source relevance review and an approved publication timestamp are recorded.

## 2026-08-13 — source relevance review completed

- Re-ran the official FAA/ACS link check with the required OpenAI relevance review. All seven direct links resolved and every mapped claim received a valid supporting assessment.
- Strengthened the reviewed FAA excerpt summaries for the airfoil/lift, angle-of-attack, and drag-tradeoff sources so the source ledger explicitly covers the claims mapped to each PDF locator.
- The source-verification release gate is complete for this draft. Publication-day source re-verification remains required.
- Hosting handoff is ready for a separate hosting PR once an approved RFC3339 UTC publication timestamp is supplied.
