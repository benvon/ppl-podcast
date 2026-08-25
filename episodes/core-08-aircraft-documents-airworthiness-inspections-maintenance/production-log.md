# Aircraft Documents, Airworthiness, Inspections, and Maintenance — production log

## 2026-08-25 — source-relevance review completed

- Ran the required deterministic and `--require-llm` review against the approved
  source-tagged script. All 34 sources, 50 reciprocal claims, and 15 show-note
  links passed deep-citation, link, locator, and claim-relevance review.
- The review used the current official eCFR endpoints and the project’s
  configured relevance model. `narration.md` was regenerated from the approved
  master script after the final KOEL clarification.
- Pre-render source QA is complete. Audio preview, listening QA, chapter review,
  publication-day source validation, and hosting handoff remain open.

## 2026-08-25 — source-relevance remediation

- Revised only the sections implicated by the seven failed source-relevance
  results. Split ACS Task B across its printed pages 2 and 3; separated POH
  operating-section content from the page 9-5 supplements guidance; and narrowed
  the inspection, preflight, and MOSAIC claims to what their cited pages state.
- Reworked the MEL and no-MEL evidence boundaries. The PHAK page now supports
  only aircraft-specific MEL development and the operator-procedure content.
  AC 91-67A page 4-1
  supports the no-MEL decision sequence, while page 4-2 separately supports
  deactivation authority, return-to-service approval, and the maintenance entry.
- Narrowed the § 91.213(a) claim to an approved MEL for the aircraft, the LOA
  carried aboard, and compliance with both documents. Split § 91.213(d)(3) into
  the removal path, with its cockpit-control placard and § 43.9 entry, and the
  deactivation path, with its INOPERATIVE placard and conditional part 43 work
  and record.
- Added the current § 91.213(d)(1) aircraft-class and MMEL-development
  eligibility threshold before the four required-item screens in paragraph
  (d)(2), including the AD screen.
- Reframed the inoperative-equipment lesson around the learner's planned VFR
  flight. Added a direct current citation to § 91.205(b)–(c), explained the
  day-versus-night and operation-dependent equipment differences first, and
  reduced MEL eligibility detail to a brief applicability check before the
  aircraft-specific required-item review.
- Updated the affected spoken explanations and source tags, aligned the claim
  inventory and show-note manifest, and regenerated `narration.md`. The revised
  narration contains 4,877 spoken words in 67 render segments. No audio was
  rendered and no LLM validation was run.

## 2026-08-24 — script approval and pre-render QA started

- The revised script received editorial approval. The approved source-tagged
  master script remains the source of the derived narration.
- Pre-render QA confirmed the reciprocal 45-claim mapping across 30 sources
  and 14 show-note links. The opening is 35 seconds and the Disclaimer follows
  it immediately, within the 10-to-45-second front-matter target.
- LLM source-relevance validation remains required before any audio rendering.

## 2026-08-24 — complete spoken-lesson rewrite after editorial rejection

- Replaced `master-script.md` throughout instead of revising the rejected draft
  line by line. The new version contains 4,352 renderer-derived spoken words in 50 render
  segments and targets approximately 39 minutes.
- Rewrote the opening and ACS section to state the lesson's purpose plainly,
  name Task PA.I.B, Airworthiness Requirements, before referring to its
  elements, and remove the undefined “turn documents” phrase.
- Rebuilt the airworthiness explanation around natural definitions of
  conformity and condition for safe operation. The § 21.181 explanation now
  explains why a standard certificate can remain with the airplane for years
  without competing with the two-part airworthiness determination.
- Rewrote the responsibility discussion to identify the owner or operator,
  certified mechanics and inspectors, and the pilot in command by their actual
  roles.
- Rebuilt the aircraft-document section to explain how a learner identifies the
  applicable AFM or POH material using model and serial applicability, approval
  information, revisions, supplements, installed equipment, and current
  weight-and-balance information. The records discussion now explains that
  carrying original logbooks adds loss and damage risk while the pilot still
  needs access to their status information.
- Rewrote the inspection section to teach the § 91.409(b) operating context
  directly: a private owner flying their own airplane for personal use does not
  trigger a 100-hour inspection merely by accumulating 100 hours, while
  carrying a person for hire and instructor-provided aircraft used for paid
  instruction can trigger it.
- Rebuilt the inoperative-equipment, preventive-maintenance, post-maintenance,
  borrowed-airplane, and review sections for one-hearing comprehension. Terms
  are defined before use, Learner questions follow the Instructor's setup, and
  the MOSAIC material is limited to one brief supplemental-episode signpost.
- Updated the claim section mappings, research packet, episode metadata, and
  show notes for the new lesson. Regenerated `narration.md`; no audio was
  rendered.

### Validation

- Script structure: 14 listener-facing sections, 50 render segments, exact
  standard opening order, exact first teaching heading, heading-matched
  Announcer transitions, and no hard-wrapped spoken paragraphs.
- Narration derivative: current and exact.
- Claim inventory: 45 claims, with every declared script section present.
- Live deterministic source validation: passed all 30 official source links,
  all 14 show-note links, reciprocal 45-claim mapping, and show-note manifest
  mapping. The FAA PDF citations resolved to their cited pages and eCFR
  citations resolved through the official dated versioner endpoints.
- `npm test`: passed all 54 tests.
- Listener-structure audit: passed current narration derivation, the recorded
  4,352-word count, every claim section reference, heading-matched Announcer
  transitions, no hard wraps, and absence of the specifically rejected phrases.
- `git diff --check`: passed. Full LLM relevance review remains a pre-render
  gate; this revision did not render audio.

## 2026-08-24 — initial research and first-review package

- Created from the standard episode template and completed with the requested
  `gpt-5.6-sol` model at high reasoning effort.
- Researched FAA-S-ACS-6C PA.I.B, PHAK Chapter 9, the October 2025 PHAK MOSAIC
  addendum, AC 91-67A Chapter 4, and only the current eCFR sections in parts 21,
  43, 47, and 91 used by the lesson.
- Completed a 30-source ledger and reciprocal 45-claim inventory. PHAK entries
  were split at page-level teaching boundaries so each citation lands on the
  page supporting its mapped claims.
- Corrected interim regulatory summaries against the current section text,
  including certificate duration under § 21.181, the crewmember wording in
  § 91.409, the complete required-item screen in § 91.213(d), and the distinct
  return-to-service and operational-check rules in § 91.407.
- Completed a 4,296-spoken-word first-review draft targeting approximately 36
  minutes. The lesson uses four airworthiness passes, two applied scenarios,
  heading-matched Announcer transitions, restrained Instructor/Learner
  dialogue, and one required production disclosure.
- Kept detailed instruction within common standard-category, ordinary part 91
  scope. Aircraft-specific manuals, supplements, configuration, operating
  limitations, records, and maintenance instructions remain explicit retrieval
  points rather than generalized facts.
- Wrote spoken prose as normal Markdown paragraphs without hard wrapping and
  derived `narration.md` from the source-tagged master script. No audio was
  rendered.

### Validation

- `npm test`: passed, 54 tests.
- Source validator dry run: passed input shape, reciprocal claim mapping, and
  14 show-notes links for 30 sources and 45 claims.
- Live deterministic source validation: passed all 30 source links and all 14
  show-notes links; cited FAA PDF pages were extracted successfully and current
  eCFR sections were validated through the dated official versioner endpoints.
- Script structure and narration checks: passed the required opening order,
  current narration derivation, 15 listener-facing sections, 58 render
  segments, and the recorded 4,296 spoken-word count.
- Full LLM source-relevance validation remains an explicit pre-render gate.
  Status: first-review package complete; editorial review and audio-production
  gates remain open.
