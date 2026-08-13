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
- Added a visualizable tilted-force-arrow explanation, bounded 2-G and square-root illustrations, explicit limits of the bank-angle example, a cue-versus-proof distinction, scenario comparison, and a POH/AFM bridge. The script is now 4,990 spoken words—about 32 minutes at 155 words per minute—before render and listening QA.
- Re-ran deterministic FAA/ACS validation at 2026-08-13T21:50:26Z: all eight source links and the expanded 18-claim two-way map passed. A realtime renderer dry run accepted all 73 segments and the Ballad announcer assignment.
