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
- Added exact AIM locators for Classes Alpha through Echo, separate Chart Users’ Guide sources for terminal-airspace symbols on page 16 and Class Echo, Mode C, and NO SVFR symbols on page 17, and the Pilot/Controller Glossary visibility definitions.
- Corrected the Mode C veil regulation to appendix D, section 1; the fixed-wing Special VFR airport reference to appendix D, section 3; the ADS-B Out locator to include section 91.225(a); and the private-pilot student Class Bravo scope to include the section 91.131(b) airport cross-reference and the preceding-90-day condition.
- Narrowed unsupported categorical statements about MTRs, TFRs, SATRs, and SFRAs. The lesson now teaches each item through its sourced operating meaning and keeps the current TFR NOTAM as the controlling source for a temporary restriction.
- Corrected ceiling wording to the lowest layer reported as broken, overcast, or obscuration, and separated glossary visibility definitions from the section 91.155(d) airport surface-area visibility rule.
- Advanced the package to version 0.1.2 and regenerated the listener-facing links, research mappings, and 5,197-word narration derivative. The formal LLM review must be rerun after these corrections; human editorial review remains pending.
