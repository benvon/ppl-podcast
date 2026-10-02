# Night Operations — research packet

## Scope

- Audience: U.S. private-pilot airplane learners; general single-engine land training context.
- Target duration: 30–40 minutes; chapter times are draft pacing estimates, not audio timestamps.
- Core question: What reliable evidence does the pilot need before continuing, descending, or selecting another night landing option?
- Scenario: Elena, a private pilot, and Jonah plan a personal VFR flight from fictional Meadow Ridge to Harbor Field. Pine Valley is a prepared alternative. The trainer has a standard U.S. airworthiness certificate, one generating source, familiar instruments/navigation equipment, and working night lights. Harbor has a verified four-light PAPI and pilot-controlled runway lighting.
- Teaching assumptions: no real airport identifiers, frequencies, weather, performance numbers, sunset times, or route clearances are supplied. The six-thirty sunset example is arithmetic teaching data. The selected route, personal lighting minimum, early weather decision, and go-around are scenario choices rather than universal regulatory obligations.
- Out of scope: night-vision goggles, multi-engine procedures, exhaustive Alaska/air-carrier exceptions, IFR qualification or clearance procedures, aircraft-specific control sequences, electrical endurance calculations, and off-airport landing guarantees.

## Recent-script voice and teaching analysis

Reviewed master-script openings and teaching exchanges from Episodes 18–23, including the navigation-source sequence in Episode 18, the prepared-alternative chain in Episode 19, the pilot-readiness decisions in Episode 20, the qualification/currency distinction in Episode 21, regulatory scope discipline in Episode 22, and Elena/Jonah emergency decisions in Episode 23.

Shared style used here:

- The Instructor provides a physical or practical model before specialized terminology, then connects it to a bounded decision.
- The Learner asks the next plausible question rather than delivering a conclusion before its premises.
- The Announcer repeats useful section headings and orients without adding technical claims.
- Fictional airports and events carry decisions; current FAA guidance and regulations supply the facts.
- Sources immediately follow the paragraph they support. Aircraft-specific checklist details remain in the actual AFM/POH.
- A Retrieval review uses bounded Instructor questions and tagged Learner responses to rebuild the sequence.
- The required production notice remains verbatim after a short Opening. The final episode callback uses Episode 23's listener-facing title.

## ACS and knowledge mapping

| ACS outcome | Exact anchor | Treatment and decision |
| --- | --- | --- |
| Physiology and effective night vision | PA.XI.A.K1, K5; R3; ACS printed p. 63/PDF p. 71 | Prepare adaptation, off-center scanning, readable light levels, and attention sharing before flight. |
| Lighting identification and pilot-controlled lighting | PA.XI.A.K2 | Verify the runway, frequency, lighting instructions and status before using beacon/runway/taxi patterns. |
| Airplane/personal equipment | PA.XI.A.K3-K4; R7 | Check the applicable standard-certificate trainer equipment scope, operating lights, flashlight, batteries and cockpit organization. |
| Night taxi and traffic direction | PA.XI.A.K6-K7; R1, R4 | Reconcile diagram/signs/markings before moving; interpret another airplane's left/right wing colors from the observer's viewpoint. |
| Visual illusions | PA.XI.A.K8; R2-R3 | Teach acceleration illusion, false horizon/autokinesis, then dark-terrain/width/slope arrival illusions; compare with instruments and verified PAPI guidance. |
| Currency versus proficiency | PA.XI.A.R5 | Distinguish records/time windows from readiness for the actual night cross-country and arrival. |
| Night weather | PA.XI.A.R6 | Review reports/forecasts, wind, fog possibility, route altitude and a better-weather alternative before departure; act early on fading-light cues. |

PA.XI.A intentionally has no listed skills. This episode does not invent a night skill tolerance or turn the task into a maneuver lesson. FAA guidance and the airplane's approved documents help connect the knowledge/risk outcomes to actual training with a CFI.

## Primary scenario sequence traced before independent review

1. State the pilot/passenger/airplane and fictional route; establish the operational question.
2. Check whole-flight timing, night recent experience, proficiency and personal readiness while a daylight or delayed flight remains an option.
3. Allow visual adaptation; explain rods/cones and the blind spot; prepare scan habits, flashlight, chart reading and display brightness.
4. Check airplane and personal equipment, explain legal lighting scope, and select a working landing light as Elena's own trip condition.
5. Choose terrain-aware route and altitude, load/verify navigation, prepare Pine Valley, review weather and wind, and plan fuel/margins.
6. Learn runway/beacon/taxi light identification, actual lighting frequency/activation/timer, and PAPI interpretation/coverage before departure.
7. Taxi with resolved position, then climb using the practiced instrument cross-check as pavement references disappear.
8. Compare position/time/fuel/traffic and current Harbor/Pine Valley weather with the plan. A clearly labeled fog variation triggers the prepared alternative; explicitly return to the main flight with acceptable weather.
9. Identify Harbor and the correct runway, use the prepared arrival, recognize the dark-terrain visual impression, compare the below-path PAPI indication with altitude/airspeed, and choose a prepared go-around.
10. Introduce electrical and engine failures as separate variations. Reuse the previously prepared equipment, suitable-airport information, terrain awareness and checklist boundary.
11. Retrieve timing, proficiency, visual preparation, lighting verification, approach checks, weather alternative and known-suitable emergency terrain conditions.

No late-flight section requires a new preflight tool that has not been introduced. The electrical-failure branch returns to a hypothetical cruise problem explicitly rather than changing the main arrival silently.

## Research evidence and source-contract self-audit

Live FAA/eCFR research completed October 2, 2026. The FAA ACS list confirms FAA-S-ACS-6C (April 2024, effective May 31, 2024). eCFR displayed Title 14 current through September 30, 2026, with the latest amendment September 29. Regulatory source entries pin September 30 for the official exact-section XML fetch used by formal review. FAA online AIM sections were read live; AFH Chapter 11 and the AFH emergency chapter supplied the operation-specific teaching boundary.

PHAK Chapter 17 is about 33.5 MB and exceeded the web reader's size limit. It was retrieved from the FAA URL with `direnv exec . curl` outside the sandbox, then extracted locally with the repository's `pdfjs-dist` dependency. Exact printed pages 17-7, 17-10, 17-20 through 17-27 were examined. PHAK Chapter 14 was similarly retrieved; printed p. 14-17/Figure 14-30 was rendered locally and visually inspected.

The PAPI colors in PHAK Figure 14-30 are graphical and do not survive plain PDF text extraction. FAA Order JO 6850.2C Figure 5-2, printed p. 5-3/PDF p. 43, supplies the same color combinations as extractable text and is the substantive spoken-source entry. The PHAK figure remains a supplemental visual study link. A ledger-written excerpt is not being substituted for fetched evidence.

The first completed formal review found no material support issue for the other 44 sources, but could not assess the Night definition from 14 CFR 1.1 because that full definitions section exceeded the fixed excerpt limit before reaching the word Night. The Night-definition wording remains unchanged. Its substantive evidence now uses the exact FAA handbook quotation of 14 CFR 1.1 in AFH Chapter 11, Introduction, printed p. 11-1/PDF p. 1. That fetched paragraph includes end of evening civil twilight, beginning of morning civil twilight, the Air Almanac and conversion to local time. The claim remains classified as a regulation; its evidence is an official FAA handbook reproduction, not an assertion that handbook guidance independently creates the definition. The direct current eCFR 1.1 URL remains a supplemental legal-reading link. No validator limit, extraction logic, or review policy was changed.

The drafting self-audit checked every source-tagged factual paragraph against its cited page/section. The audit retains each source's actor, action, scope, condition, exception and locator, including the Retrieval review. The following families cover all source-tagged paragraphs; `sources.yaml` and `claim-inventory.yaml` contain the atomic claim-to-source and section mapping.

| Paragraph family | Contract preserved and check made |
| --- | --- |
| ACS framing/readiness/equipment risk | PA.XI.A knowledge and risk outcomes; no unlisted skill standard. Currency/proficiency and inoperative-equipment risks remain separate from regulatory requirements. |
| Three time windows and retrieval | Night definition retains Air Almanac/local-time requirement; position lights use sunset/sunrise outside Alaska; carrying persons uses the one-hour window, 90 days, full stops, sole manipulation, category/class/type conditions and acknowledges specific exceptions. |
| Rods/cones, blind spot and scan | Center/periphery, dim-light sensitivity and loss of color retained. Off-center detection comes from p. 17-22; viewing-duration guidance is separately tagged to p. 17-23. |
| Adaptation, lighting, fatigue and oxygen | Approximately 30 minutes is guidance, not a guaranteed adaptation timer. Dim white light supports reading; red color distortion uses its own AFH tag. PHAK's pressure-altitude physiological statement is not represented as a regulatory oxygen threshold or an instruction to reduce terrain clearance. |
| Airplane/night equipment and light use | Standard U.S. airworthiness-certificate powered civil aircraft scenario stated. For-hire landing-light condition preserved. Fuse set/kind/accessibility condition retained. Anticollision safety discretion does not remove position-light obligations. Elena's working-light trip preference is separately labeled teaching synthesis. |
| Preflight, weather, route, fuel | GPS/ramp/light check paragraphs use exact AFH p. 11-8. Fog possibility and wind come from p. 11-7. Regulatory night fuel includes airplane, VFR, pre-departure assessment, wind/forecast and normal-cruise conditions. Scenario margins/alternative are separately labeled. |
| Beacon/runway/taxi lights | Beacon colors identify facility type. Instrument-runway caution-zone condition and smaller-of-2,000-feet/half-length rule preserved. Taxiway colors do not establish a runway or ATC clearance. |
| Pilot-controlled lighting | Actual airport frequency and nonstandard instructions verified through Chart Supplement; CTAF not assumed. Seven-click/five-second input, capability-dependent lower settings, REIL exceptions, receiver range and arrival reactivation retained. |
| PAPI interpretation and coverage | Four-light color evidence uses textual FAA figure. Alignment precedes descent; typical plus/minus ten-degree and 3.4-NM coverage with possible reductions/offsets retained. Visible-light range is not treated as protected coverage. |
| Taxi/climb and traffic | Beacon does not replace propeller scan. Conflicting taxi position prevents further taxi/takeoff. Greater instrument use and positive-climb checks cite their respective exact AFH pages. Other aircraft's own left/right wingtips are translated into the viewer's perspective. |
| Cruise illusions and weather variation | False-horizon/autokinesis and reliable-reference guidance have separate PHAK locators. Halos/fading lights are warning cues, not a visibility measurement. Better-weather option is used while clear of terrain/cloud; no descent into unknown visibility is implied. |
| Arrival and retrieval | Black-hole, runway-width and slope mechanisms remain distinct. Narrow-width condition is retained. PAPI below-path indication explicitly contradicts excessive-height impression. Go-around guidance retains runway-position/altitude doubt condition. |
| Electrical and engine branches | Single generating-source scope retained; limited battery endurance is not invented. Specific AFM/POH controls/checklist remain airplane-specific. Unlighted terrain guidance retains both known and suitable conditions in lesson and retrieval. |

## Independent spoken-script review disposition

A separate agent reviewed the complete master script for grammar, complete thoughts, callbacks/call-forwards and first-listen comprehension, including the scenario sequence above. Two required findings were resolved together in version 0.1.1: the PAPI approach paragraph now explains what the below-path indication means and why descending farther would be wrong, and a stray annotation prefix was removed. The reviewer re-read version 0.1.1 and reported no remaining material first-listen findings.

Optional editorial notes retained for the human editor: the cockpit-lighting-to-altitude question could use a short route-planning bridge; the PCL duration paragraph is dense because it preserves standard operation and REIL scope. Neither changes the operational chain or requires expansion into a specialized lighting lesson. Structured completion and fingerprint belong in `episode.yaml`.

## Open technical questions

None remain from research or the independent spoken review. The current formal source-review evidence is in `link-validation.yaml`; human editorial approval remains the next decision.

## Retained source-review editorial note

An earlier assessment noted that AFH 11-1 explicitly describes location-specific civil twilight but does not explicitly state date dependence. The script asks Elena to verify the actual place and date rather than use a fixed interval. This nonblocking precision note is retained for the human editor; the final current review and preserved earlier attempts own their findings.
