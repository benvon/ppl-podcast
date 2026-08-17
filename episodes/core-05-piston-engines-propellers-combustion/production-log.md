# Piston Engines, Propellers, and Combustion — production log

## 2026-08-17 — pre-render QA audit

- Confirmed that all 35 material claims map to the 15-source ledger, that
  claim types are labeled, and that all listener-facing source links name a
  specific FAA task or handbook page. The source-relevance review also
  confirms the corresponding 19 show-notes links.
- The opening target is 10–45 seconds, allowing enough time to establish the
  lesson before the required notice. Core 05's 34-second opening meets that
  target and is followed immediately by the notice.

## 2026-08-17 — revised draft approval and source QA

- The user approved the revised Core 05 draft after the intake-pressure and
  manifold-pressure material was separated into its respective teaching
  sections.
- Re-ran `sources:validate --require-llm` from the repository root through
  `direnv`. All 15 FAA sources, 35 mapped claims, and 19 show-notes links
  passed deep-link, locator, mapping, and claim-level relevance validation at
  `2026-08-17T20:56:23Z`.
- Editorial status is `script_approved`. Audio rendering and listening QA are
  now the remaining production gates.

## 2026-08-17 — script approval

- The user approved the Core 05 master script. Editorial status is now
  `script_approved`; narration derivation, rendering, and listening QA remain
  separate pending steps.
- Updated the approved-script, episode, show-notes, and hosting provenance
  metadata to version `0.1.2`.
- Source-relevance review now precedes all audio rendering. The renderer will
  require a passing LLM review record and `episode.yaml` completion status
  before it can send audio to the rendering service.

## 2026-08-17 — source-relevance review complete

- Ran `sources:validate --require-llm` from the repository root through
  `direnv`, using the current FAA sources and `gpt-5.6-terra` for the
  claim-level relevance assessments.
- All 15 sources, 35 mapped claims, and 19 show-notes links passed deep-link,
  locator, mapping, and relevance validation at `2026-08-17T20:17:41Z`.
- Corrected two ACS PDF locators to their actual Task G and Task F pages.
  Replaced an inferred intake-pressure claim with the current FAA Powerplant
  handbook's direct explanation of the low-pressure area created by the
  descending piston, higher-pressure incoming air, and throttle airflow.
- Added the FAA Powerplant handbook's direct pitch-distribution explanation
  for the blade-twist visual aid, and tightened the mixture-control, magneto,
  and ignition-check claim wording to the source-supported scope. The
  corresponding script changes require final editorial confirmation before
  rendering. The source-reviewed revision is version `0.1.3` and 6,407
  spoken words.

## 2026-08-17 — research and initial draft

- Researched current FAA-H-8083-25C Chapter 7 and FAA-S-ACS-6C using the FAA's current handbook and ACS indexes.
- Kept detailed fuel, mixture, carburetion, oil, cooling, and electrical-system relationships for Episode 6 while retaining the combustion and ignition concepts necessary to explain the piston-engine power chain.
- Built page-level FAA source and claim mappings for engine energy conversion, the four-stroke cycle, propeller aerodynamics, fixed-pitch and constant-speed systems, power indications, ignition, detonation, and preignition.
- Added exact show-note visual-aid links for the four-stroke cycle, propeller blade twist, dual magnetos, and normal-versus-explosive combustion.
- Drafted the first complete 6,410-word tagged script using heading-led Ballad transitions and the single required production notice. Editorial and source-relevance review remain pending.
- Clarified the fixed-pitch tradeoff, the constant-speed governor’s rpm-target model, manifold pressure in a normally aspirated engine, and the ignition-check interpretation without adding aircraft-specific procedures. Added planned Supplement-01, *Constant-Speed Propellers*, to the roadmap.

## 2026-08-17 — package created

- Created from the standard episode template.
- Status: planned.
