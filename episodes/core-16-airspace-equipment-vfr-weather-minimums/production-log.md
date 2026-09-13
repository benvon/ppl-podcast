# Airspace, Equipment, and VFR Weather Minimums — production log

## 2026-09-11 — package created

- Created from the standard episode template on branch `feature/core-16-airspace-equipment-vfr-weather-minimums` after synchronizing both repositories to `origin/main`.
- Status: draft.

## 2026-09-11 — primary-source research and initial draft

- Scoped the lesson to FAA-S-ACS-6C PA.I.D and PA.I.E, with the ACS defining the decisions and the PHAK, AIM, Chart Users' Guide, and current eCFR sections supplying the supporting detail.
- Confirmed the FAA-listed Private Pilot ACS edition as FAA-S-ACS-6C and the current online AIM publication as effective July 9, 2026.
- Recorded Title 14 as current through September 9, 2026 based on the eCFR API response available during research. The formal validator may advance that effective-date pin before source relevance.
- Built a fictional daytime VFR cross-country scenario that moves through Class G, Class E, Class D, a Class C decision, a Class B shelf and Mode C veil, changing weather, Special VFR, an MOA, an MTR, and a TFR.
- Organized the lesson around four recurring questions: three-dimensional position, entry requirement, pilot/equipment requirement, and weather suitability.
- Added direct official visual aids for the airspace profile, VFR weather-minimum table, airspace operating-requirement table, and VFR chart symbols.
- Drafted `master-script.md` as source-tagged spoken prose and regenerated `narration.md` from it. The initial draft contains 4,708 spoken words, supporting approximately 31 minutes at 150 words per minute.
- Ran the source validator in `--dry-run` mode: 25 sources, 26 claims, 88 master-script source tags, and 18 listener-facing links passed the package-shape and mapping checks without network or OpenAI requests.
- Source caveat: the FAA Chart Users' Guide landing page says effective July 9, 2026, while its descriptive text also says the information is effective January 22, 2026. Formal source review should verify the cited PDF page and document identity.
- Independent spoken-script review: completed. Required findings were resolved in version 0.1.1 before formal source relevance and human editorial review.
- Authorized LLM source-relevance review: pending; no unpublished Core 16 material was sent to OpenAI during this drafting subtask.
- Human editorial review: pending.

## 2026-09-11 — independent spoken-script review revisions

- Established one route chronology: Meadow Creek departure, Class Charlie and Class Bravo/Mode C veil decisions en route, Valley Tower destination, and Ridge Field as a geographically explicit turn-back alternate. The special-use and other-airspace discussion now explicitly returns to preflight planning rather than continuing the airplane beyond the destination.
- Defined VFR, ATC, NOTAM, Mode C, ADS-B In and Out, CFA, SATR, and SFRA at first useful mention. Added AIM 4-1-20, AIM 4-5-7, and 14 CFR 1.1 to support equipment and visibility definitions.
- Corrected the Class G high-altitude logic by separating the Class E rule from the two-condition Class G test: more than 1,200 feet above the surface and at or above 10,000 feet MSL.
- Added the preceding-90-day condition to the student-pilot Class B endorsement discussion.
- Split regulatory cloud-clearance and Special VFR facts from safety synthesis. The initial revision attributed the fixed-wing Special VFR restriction to 14 CFR 91.157(c); formal source review later corrected that locator to appendix D, section 3, as described by the AIM and depicted by the Chart Users’ Guide.
- Reframed the final teaching section and retrieval review to distinguish regulatory and nonregulatory special use airspace from MTRs, TFRs, Special Air Traffic Rules, and SFRAs. Removed the unsupported suggestion that sectionals may show recurring TFR sites.
- Regenerated `narration.md`. Version 0.1.1 contains 5,080 spoken words.
- Re-ran local source-contract validation in `--dry-run` mode: 28 sources, 29 claims, 107 master-script source tags, and 21 show-notes links passed without network or OpenAI requests.
- Formal source-link and LLM relevance validation remain pending. Human editorial review remains pending.

## 2026-09-11 — formal source-review corrections

- The first formal source-relevance run completed deterministic link validation and then failed on broad mixed claims, incomplete locators, and a small number of unsupported or incorrectly attributed details. No finding was treated as a reason to reduce the scenario-led teaching design.
- Revised the evidence model so each source owns only the atomic factual claims fully supported by its exact locator. Coherent spoken paragraphs still connect several immediately tagged facts and identify the resulting connection as teaching synthesis where appropriate.
- Added exact AIM locators for Class A through Class E, separate Chart Users’ Guide sources for terminal-airspace symbols on page 16 and Class Echo, Mode C, and NO SVFR symbols on page 17, and the Pilot/Controller Glossary visibility definitions.
- Corrected the Mode C veil regulation to appendix D, section 1; the fixed-wing Special VFR airport reference to appendix D, section 3; the ADS-B Out locator to include section 91.225(a); and the private-pilot student Class Bravo scope to include the section 91.131(b) airport cross-reference and the preceding-90-day condition.
- Narrowed unsupported categorical statements about MTRs, TFRs, SATRs, and SFRAs. The lesson now teaches each item through its sourced operating meaning and keeps the current TFR NOTAM as the controlling source for a temporary restriction.
- Corrected ceiling wording to the lowest layer reported as broken, overcast, or obscuration, and separated glossary visibility definitions from the section 91.155(d) airport surface-area visibility rule.
- Advanced the package to version 0.1.2 and regenerated the listener-facing links, research mappings, and 5,197-word narration derivative. The formal LLM review must be rerun after these corrections; human editorial review remains pending.

## 2026-09-11 — second formal source-review corrections

- The second formal review reduced the remaining findings to exact regulatory conditions and locators. The scenario and teaching structure were preserved.
- Split the Class Charlie and Class Delta callsign tests into class-specific atomic claims. The Class Charlie equipment evidence now distinguishes the AIM's installed-equipment statement from section 91.130's regulatory cross-reference, and the source locators point to the exact relevant paragraphs.
- Restored the source conditions for controlled firing area suspension, the Class Golf exceptions in section 91.155(b), the below-10,000-feet-MSL Special VFR scope, and the geographic and vertical limits in the ADS-B Out requirements.
- Corrected the AIM weather table locator to TBL 3-1-4, described the fixed-wing Special VFR restriction as applying to listed Class Bravo and Class Charlie surface areas, and retained the regulatory written term `Class A` in the source-facing script.
- Removed the Special VFR exception claim from the PHAK Figure 15-8 source mapping while retaining it under the exact eCFR and AIM sources.
- Advanced the package to version 0.1.3 and regenerated the 5,301-word narration derivative. Formal source relevance must be rerun cleanly before human editorial review.

## 2026-09-11 — final formal source-review corrections

- Added the requirement to maintain two-way communication while within Class Charlie for an arrival or through flight, including in the retrieval review.
- Kept the below-10,000-feet-MSL Special VFR condition under the controlling section 91.157 claim and removed that condition from the AIM source's claim responsibility. The AIM remains the source for the surface-area boundary and listed fixed-wing restrictions.
- Advanced the package to version 0.1.4 and regenerated the 5,321-word narration derivative. Formal source relevance must be rerun cleanly before human editorial review.

## 2026-09-11 — focused source-boundary corrections

- Version 0.1.5 narrowed the MOA passage to the AIM's affirmative guidance for VFR pilots.
- Version 0.1.6 restored the warning-area boundary beginning three nautical miles outward from the U.S. coast and carried the ceiling definition's ground-or-water reference into the spoken lesson and retrieval review.
- Replaced the simplified Special VFR nighttime shorthand with the regulation's applicable Part 61 instrument-flight and section 91.205(d) equipment conditions. Rephrased the surface-area discussion around where Special VFR operations occur rather than claiming that an ATC clearance terminates at the boundary.
- Regenerated the 5,373-word narration derivative. Formal source relevance must be rerun cleanly before human editorial review.

## 2026-09-11 — final source-condition corrections

- Version 0.1.7 preserves the ACS distinction between environmental risks and limitations of ATC services.
- Removed the unsupported qualifier from the Class Charlie arrival and through-flight rule and stated the section 91.130 equipment cross-reference as an operating requirement with its responsible-ATC exception.
- Made the Special VFR retrieval answer explicitly require an ATC clearance and identified the ordinary one-statute-mile requirement as flight visibility.
- Regenerated the 5,391-word narration derivative.
- Formal source relevance must be rerun cleanly before human editorial review.

## 2026-09-11 — threshold-review source alignment

- Corrected the cross-country ACS locator to distinguish document page 5 from PDF viewer page 13, and expanded the Class Charlie AIM locator to include the installed-equipment provision in paragraph (b)(1).
- Version 0.1.8 carries the contiguous-48-states-and-District-of-Columbia condition into the transponder's 10,000-foot rule.
- Added the appendix D, section 3, fixed-wing Special VFR exception and the takeoff-or-landing ground-visibility test, including the rule's limited treatment of cockpit visibility from the takeoff position when no ground visibility is reported.
- Regenerated the 5,534-word narration derivative.
- Formal source relevance must be rerun cleanly before human editorial review.

## 2026-09-11 — material source-review corrections

- The two-pass relevance review classified only four findings as material. Corrected the Class Charlie AIM locator to include the specific Equipment and Arrival or Through Flight Entry Requirements subsections.
- Kept the Mode C veil chart-symbol fact separate from the regulatory question of whether a particular route triggers transponder or ADS-B Out requirements.
- Qualified the retrieval review's Class Echo weather-minimum recap to below 10,000 feet MSL.
- Split the fixed-wing Special VFR airport restriction from the section 91.157 conditions, attributed the former to the AIM, and scoped the takeoff-and-landing visibility sentence to airplanes.
- Version 0.1.9 regenerates the 5,790-word narration derivative and resets editorial/source-review state. The remaining partial-support notes are editorial precision notes under the safety-and-core materiality policy; they do not alter a safety decision or the lesson’s central concepts.
- Formal source relevance requires a new, explicit authorization because the revised package has new input hashes. Human editorial review remains pending.

## 2026-09-11 — formal source relevance complete

- Completed the authorized two-pass source-relevance review with `gpt-5.6-terra` against the exact version 0.1.9 source ledger, claim inventory, source-tagged script, and show notes. The canonical report is `link-validation.yaml`, run `d58ff66f-af7f-40ab-9b46-7fddddfee03c`.
- All source links, locators, claims, and source-tagged passages passed under the `safety-and-core-v1` materiality policy. The report retains one editorial note: the MOA prose says to use extreme caution while an MOA is active, while the AIM more specifically ties that caution to military activity being conducted. This is available to the human editor and does not block the lesson.
- The package is now ready for human editorial review. No audio rendering has started.

## 2026-09-12 — human editorial revision

- Version 0.1.10 incorporates editorial wording changes, including explicit radio-call labels, aviation-radio class names, and an easier-to-follow Special VFR explanation.
- Added FAA Order JO 7110.65, paragraph 7-5-1(a)(4), as the narrow source for the point that Special VFR may be authorized only when requested by the pilot. The source ledger, claim inventory, source tags, listener-facing study link, and retrieval review now all carry that same claim.
- Regenerated `narration.md`, reset downstream review state, and require a new authorized source-relevance review before human approval or rendering.

## 2026-09-12 — formal source relevance complete

- Completed the authorized two-pass review with `gpt-5.6-terra` against the exact version 0.1.10 source ledger, claim inventory, source-tagged script, and show notes. The canonical report is `link-validation.yaml`, run `6ccb7443-ae3d-4bbf-a2ce-48bc3af98635`.
- All deterministic link, locator, claim, tagged-passage, and show-notes checks passed. One pass recorded an editorial note that the AIM’s Special VFR section says Class Bravo, Charlie, Delta, and Echo surface areas rather than repeating the regulatory “designated to the surface for an airport” wording. The controlling section 91.157 source directly supports that wording, so no safety or core-lesson revision is required.
- The package is ready for continued human editorial review. No audio rendering has started.

## 2026-09-12 — validation-state correction

- Normalized trailing whitespace in the source-tagged script and narration derivative. This does not change the spoken lesson, but it changes the contract’s exact script fingerprint.
- The preceding clean source-review report remains historical evidence for the prior fingerprint. The current package correctly records source relevance as pending and requires a fresh authorized review before approval or rendering.
- Updated the script-reset tooling so any future script reset clears current-candidate QA attestations while retaining only historical research-preflight and independent-draft-review records.

## 2026-09-12 — source-review retry preparation

- The authorized two-pass review completed all deterministic checks and identified one material locator mismatch: the Class Echo source combined AIM 3-2-6(b)(3), which supports the VFR entry statement, with unrelated transition-area paragraph 3-2-6(e)(3).
- Narrowed the source-ledger and listener-facing study-link locator to AIM 3-2-6(b)(3). This is an evidence-boundary correction only; the spoken lesson, claims, and source tags are unchanged.
- The prior authorization was consumed by the failed run. A fresh explicit authorization is required before retrying the formal source-relevance review.

## 2026-09-12 — second source-review retry findings

- The corrected Class Echo locator passed deterministic validation. The two-pass relevance review then identified one claim-inventory condition to clarify: the Special VFR conditions claim must state that its requirements apply when an airplane is operating under Special VFR, rather than reading as a requirement for every flight in the listed airspace.
- The review also misclassified two established presentation patterns as material: a multi-source teaching paragraph was assessed as if each cited source had to support every sentence, and the listener-facing aviation-radio pronunciation `Class Alpha` was treated as a new regulatory airspace category rather than the spoken rendering of `Class A`. Those are validator-context defects, not reasons to change the lesson.
- The authorization was consumed by the failed run. The source-review authorization checklist item is reset pending a fresh authorization after the claim and validator-context corrections are reviewed.

## 2026-09-12 — claim-context correction

- Clarified the standalone Special VFR claim inventory to state that its conditions apply to an airplane operating under Special VFR. The source-tagged script already established that context, so no spoken prose changed.
- Tightened the source-review prompt to assess only claims assigned to the current source within a multi-source citation group and to recognize the established aviation-radio pronunciations of lettered airspace classes. This preserves the source review’s safety and core-lesson threshold without treating sourced synthesis or a listener-facing pronunciation as a contradiction.

## 2026-09-12 — formal source relevance complete

- Completed the authorized two-pass review with `gpt-5.6-terra` against the current Core 16 source ledger, claim inventory, source-tagged script, and show notes. The canonical report is `link-validation.yaml`, run `ba51a663-dd2a-47f3-8ef5-2b66cc5ebb7c`.
- All deterministic links, locators, claims, show-note mappings, and source-tagged passages passed under the `safety-and-core-v1` materiality policy. The report retains one editorial note: the AIM's Special VFR discussion names the Class Bravo, Charlie, Delta, and Echo surface areas rather than repeating the regulation's broader controlled-surface-area wording. Section 91.157 directly supports that wording, so no safety or core-lesson revision is required.
- The report records the `markdown-whitespace-v1` semantic identity for `master-script.md`, while retaining exact input hashes for provenance. Core 16 is ready for human editorial review; no audio work has started.

## 2026-09-12 — radio-treatment and terminology refinement

- Version 0.1.11 restores explicit `airspace`, `surface area`, and `shelf` nouns where the lesson discusses a named airspace volume, a controlled airport surface area, or the layered structure of terminal airspace. The change clarifies the spoken lesson without changing its underlying factual claims.
- Updated the local VHF AM treatment to version 3: narrower speech bandwidth, restrained compression, and a light bit-reduction blend add communications-radio texture without introducing background hiss or static. Radio turns now instruct the voice renderer to use a brisk, intelligible delivery. Version 3 raises only that texture blend by 20 percent after listening review.
- Regenerated `narration.md`. The resulting spoken-script revision requires fresh source relevance and editorial approval before another episode render.

## 2026-09-12 — current-script source and spoken-script review complete

- Corrected the Class Echo source locator and matching study-link locator to name the exact current AIM heading: `AIM 3-2-6(b)(3), Arrival or Through Flight Entry Requirements`. The source statement itself and the spoken lesson did not change.
- Completed the authorized two-pass source-relevance review with `gpt-5.6-terra` against the exact version 0.1.11 package. The canonical report is `link-validation.yaml`, run `d00b8bc1-c0cc-4542-8c87-ccacd07c514b`. All deterministic and material relevance checks passed under the `safety-and-core-v1` policy. Two retained observations are editorial-only: the AIM names the specific Special VFR surface-area classes while the regulation supplies the broader surface-area wording, and section 91.155 cross-references section 91.157 without naming it Special VFR.
- An independent first-listen review of the current script found no material grammar, completeness, callback, call-forward, or listening-comprehension issue. The human editor approved the current script fingerprint after the clean review.

## 2026-09-12 — source-review status display synchronized

- Updated the fact-check table's display-only verification cells to the completed formal-review date, 2026-09-12. The reviewed claims, source links, locators, show-notes manifest, and spoken script did not change.
- The formal report now records the status-insensitive semantic identity for that table column while retaining its exact raw input hashes for provenance. Any substantive study-material change still invalidates the source-review evidence and requires a new review.
