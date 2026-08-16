# Flight Controls, Stability, and Left-Turning Tendencies — production log

## 2026-08-16 — Publication-day source validation complete

- Corrected the ACS citation from PDF page 28 to page 29, the page that
  actually contains PA.IV.C.K6, *Left turning tendencies*.
- Split composite ledger entries into 37 page-level claims across 20 FAA
  citations. This separates trim setup from retrimming, the individual
  leading-edge-device functions, the three stability axes, and the PHAK's
  condition-dependent directional-control facts from the episode's teaching
  explanation of “more right rudder.”
- Ran `sources:validate --require-llm` on publication day. All 20 FAA links,
  all show-notes mappings, locators, and 37 claim-level relevance assessments
  passed at `2026-08-16T23:43:05Z` using `gpt-5.6-terra`.
- No spoken script or rendered audio changed. Core 04 is ready for the
  separate immutable-audio hosting workflow.

## 2026-08-16 — Script-aligned listening QA accepted

- The user completed and accepted full script-aligned listening QA for the
  current Core 04 audio candidate, rendered at `2026-08-16T16:47:23Z`.
- The candidate is now recorded as `candidate_rendered_qa_approved`.
- The release timestamp is set to `2026-08-16T22:28:12Z`.
- Remaining release gates are the LLM source-relevance review, publication-day
  source verification, and hosting/audio-store preparation.

## 2026-08-15 — research and initial draft

- Created the Core 04 package from the current templates on `feature/core-04`.
- Converted Core 03 script-revision lessons into durable playbook guidance: heading-led Announcer text, a specific signpost before a term is taught in depth, named variables instead of vague referents, and practical takeaways that identify both a demand and a bounded pilot habit.
- Researched current FAA-S-ACS-6C, FAA-H-8083-25C Chapter 5, and FAA-H-8083-25C Chapter 6. The PHAK Chapter 6 programmatic PDF linked by the FAA Chapter 6 page was byte-identical to the citation copy.
- Drafted the control-to-airflow-to-rotation model before adverse yaw, trim, stability, and condition-dependent propeller effects. The script uses the common clockwise-from-the-pilot propeller example without treating it as universal.
- Initial narration is 2,611 spoken words and is structurally complete, but it is deliberately below the 30–45 minute core runtime target. The next editorial pass should add source-supported scenario comparisons and retrieval practice, not padding.
- Status: initial draft; deterministic source validation and the required release-stage LLM relevance review remain pending.

## 2026-08-15 — left-turning-tendencies expansion

- Expanded the propeller-effects section with concrete takeoff-roll, early-climb, cruise, and tailwheel-specific comparisons.
- Defined “more right rudder” as feedback-based shorthand in the common clockwise-from-the-pilot propeller example: use enough rudder to counter a developing left yaw, not a memorized pedal setting.
- Added an atomic teaching-explanation claim for that clarification. The draft now contains 3,239 spoken words; additional scenario and retrieval expansion remains necessary to meet the core runtime target.

## 2026-08-16 — controls, rudder, trim, and stability refinement

- Reframed the ACS soft-field reference as a certification anchor rather than a limit on where left-turning tendencies matter.
- Reworked the Episode 3 bridge to say explicitly that the earlier lesson discussed why coordination mattered; this episode now introduces the control surfaces and airflow changes that create the pitch, roll, and yaw to coordinate.
- Added a clearly labeled axis mnemonic: longitudinal is long (nose to tail), lateral is side to side (like latitude), and vertical is upright. It is presented as a memory aid rather than FAA terminology.
- Added a dedicated rudder section grounded in PHAK Chapter 6. It explains changing rudder effectiveness, the low-speed/high-angle-of-attack/large-aileron-demand context, and a bounded “pressure, observe, adjust, release” cue without creating a generic takeoff or landing procedure.
- Expanded the coordination discussion to distinguish coordination from equal-force “balance.”
- Expanded trim to connect “trim for the desired airspeed” to the PHAK sequence: establish power, pitch attitude, and configuration first, then use trim to relieve the force required to hold that condition.
- Split the stability source/claim into atomic static-stability and dynamic-stability/longitudinal-CG references. The script now distinguishes initial response from oscillation over time and introduces CG as a longitudinal-stability factor to be developed in Episode 9, *Weight, Balance, and Center of Gravity*.
- Narration is now 4,145 spoken words, within the 30–35 minute target at a measured study-podcast pace. More editorial revisions are expected before production.
- Replaced the placeholder show notes and manifest with 12 exact FAA deep links, mapped every link to the ledger source and its supported claims, and ran deterministic validation. All 12 FAA links and all claim/show-notes mappings passed at `2026-08-16T13:35:39Z`; the release-stage LLM relevance review remains pending.

## 2026-08-16 — narrative flow and dialogue refinement

- Added an explicit opening bridge: the control-surface and airflow model is taught before the detailed left-turning-tendencies section so the listener can connect each effect to the roll or yaw demand it creates and the controls used to manage the flightpath.
- Removed repetitive production-style hedges and rewrote the affected passages as direct explanations. Aircraft-specific documents and instructor technique remain named where they are the appropriate source for operation of a particular airplane.
- Reworked the Learner turns to retrieve the new control/axis map, coupled effects, changing rudder demand, trim-for-airspeed relationship, static-versus-dynamic stability distinction, CG connection, and the final application model.

## 2026-08-16 — secondary controls and stability expansion

- Added a focused secondary-controls section: flaps, leading-edge devices, spoilers, configuration pitch effects, and the trim connection. The section teaches their shared airflow consequences without becoming a catalog of systems or a generic operating procedure.
- Added two stability mechanisms that were previously only named: conventional-airplane longitudinal stability through CG, wing, horizontal-tail force, downwash, and power-change moments; and lateral stability through dihedral, sideslip, sweepback, keel effect, and weight distribution.
- Added seven atomic claims and five exact FAA-page ledger sources, then extended show notes with the corresponding deep links and claim mappings.
- Recalculated script section timestamps at the Core 02–03 measured narration pace. The draft now contains 5,043 spoken words, projecting to approximately 32 minutes before audio-specific timing adjustments.

## 2026-08-16 — script approval

- The user approved the Core 04 master script. Editorial status is now `script_approved`; narration derivation, rendering, and listening QA remain separate pending steps.

## 2026-08-16 — candidate render and automated QA

- Derived `narration.md` mechanically from the approved master script, preserving the master script as the sole editable narration source.
- With explicit user authorization, rendered all 67 narration segments through `gpt-realtime-2.1`: Marin as Instructor, Cedar as Learner, and Ballad as Announcer.
- Assembled the candidate with the approved music mix: a 10-second intro lead, steady reduced level beneath Ballad, a 5-second full-level intro continuation and 0.5-second fade, then a 10-second full-level outro continuation and 5-second fade.
- Candidate: `audio-artifacts/core-04-20260816T164723Z.mp3`; 32:57, 24 kHz mono, 160 kbps MP3, SHA-256 `13a90655815c2d26a483a26624da8ea940f38a7b3b2f3b0374d51f04c0c0f211`. The lossless master, render manifest, quality report, and resumable segment directory are Git-ignored and tracked in `audio-manifest.yaml`.
- Automated QA passed: WAV and MP3 decode, matching duration, 67 checked stitch boundaries without discontinuity warnings, and zero clipped samples. Full script-aligned listening QA remains required.
