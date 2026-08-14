# Stalls, Load Factor, and Spin Avoidance — production log

## 2026-08-13 — fresh package and initial draft

- Moved the earlier Core 03 bootstrap/test package intact to `episodes/archive/core-03-bootstrap-test/`; it is retained for history and is not a source for this episode's content or release status.
- Created a new three-voice Core 03 package from the current templates.
- Researched current FAA-S-ACS-6C, FAA-H-8083-25C Chapter 5, FAA-H-8083-3C Chapter 5, and active AC 61-67C with Changes 1 and 2.
- Applied `docs/script-drafting-playbook.md`: definitions precede conclusions, the load-factor model is bridged to published one-G speeds and the POH/AFM, the base-to-final scenario avoids invented radio/procedure details, and the Announcer only orients.
- The initial script was 2,842 spoken words. It established the complete causal chain; the later load-factor expansion added learner-needed examples and retrieval practice rather than padding.
- Deterministic validation resolved all eight direct FAA/ACS sources and confirmed the 14-claim two-way map. The generated record is `link-validation.yaml`.
- Required LLM relevance review remains pending explicit authorization to send this new episode's source excerpts and claim map to the configured OpenAI review model.
- Status: initial draft; not rendered or cleared for public release.

## 2026-08-13 — load-factor expansion

- Recentered the lesson on load factor as the bridge between wing demand, angle-of-attack margin, and the pilot's practical choices.
- Grounded the added explanation in the PHAK's coordinated constant-altitude turn model: 60 degrees of bank equals 2 G, and stall speed changes with the square root of load factor.
- Added a visualizable tilted-force-arrow explanation, bounded 2-G and square-root illustrations, explicit limits of the bank-angle example, a cue-versus-proof distinction, scenario comparison, and a POH/AFM bridge. The initial expansion reached 4,990 spoken words; subsequent coordination refinement brings the current draft to 5,191 words.
- Re-ran deterministic FAA/ACS validation at 2026-08-13T21:50:26Z: all eight source links and the expanded 18-claim two-way map passed. A realtime renderer dry run accepted all 73 segments and the Ballad announcer assignment.

## 2026-08-14 — coordination refinement and music-bed workflow

- Added an earlier signpost for coordinated flight, expanded the coordination/slip/skid explanation, and made the stalled-plus-yawed spin connection more direct.
- Added a versioned project-provided intro/outro music asset and a reusable realtime-renderer mix option. It adds a 7-second intro lead, continues for 2 seconds after the intro voice, fades over 0.5 seconds before teaching begins, sidechain-ducks the bed beneath narration, and gives the outro 10 seconds of continuation followed by a 5-second fade.
- Revalidated nine FAA/ACS sources and the 20-claim map at 2026-08-14T17:35:03Z. The music mixer has an automated ffmpeg coverage test; a voice-rendered listening sample remains pending explicit approval to send the unpublished script to the configured Realtime service.

## 2026-08-14 — approved candidate, publication-day validation, and hosting handoff

- Rendered the full 74-segment script with `gpt-realtime-2.1`: Marin as Instructor, Cedar as Learner, and Ballad as Announcer. The release candidate is `audio-artifacts/core-03-20260814T175835Z.mp3`; its 24 kHz mono WAV master, render manifest, automated quality report, and resumable segment directory remain Git-ignored and are recorded in `audio-manifest.yaml`.
- The full script-aligned listening QA was completed and approved. The approved music behavior uses a 10-second intro lead, a steady reduced music level beneath the Announcer, a 5-second full-level intro continuation, and a 10-second full-level outro continuation before its fade.
- Automated post-assembly QA passed: WAV and MP3 decode, 24 kHz mono format, duration agreement, 74 stitch boundaries with no discontinuity warnings, and no clipped samples.
- Re-ran publication-day source validation at 2026-08-14T19:30:21Z. All nine FAA/ACS links resolved; the required OpenAI relevance review assessed every mapped claim as supported. During the review, the ledger was narrowed from broad compound statements to 22 atomic claims, each mapped only to the source that supports it.
- The user approved release time `2026-08-14T19:17:58Z`. The source package is ready for a review-ready PR and the separate hosting workflow’s immutable-audio staging gate.

## 2026-08-14 — show-notes source validation

- Added a versioned show-notes link manifest. It binds every listener-facing HTTPS link to its precise locator, ledger source, and supported claims.
- Extended the source validator to reject undeclared, stale, weakly cited, unresolvable, or claim-unsupported show-notes links. It applies the same official FAA programmatic-fallback attestation rules used for the source ledger.
- Re-ran publication-day validation at 2026-08-14T20:00:26Z: all nine FAA/ACS source entries, all 22 mapped claims, and all 10 show-notes links passed. The two PHAK show-notes links also passed the FAA-hosted programmatic-copy attestation.
