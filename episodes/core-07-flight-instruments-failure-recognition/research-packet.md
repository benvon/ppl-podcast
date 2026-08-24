# Flight Instruments and Failure Recognition — research packet

## Scope

- Audience: U.S. private-pilot airplane learners studying conventional and electronic flight instruments.
- Target duration after the focused compass expansion: approximately 46–48 minutes; 5,533 spoken words.
- Core question: How can a learner connect what an instrument senses, the source or power path behind it, and independent indications well enough to recognize a failure without chasing one gauge?
- In scope: pitot and static pressure paths; ASI, altimeter, and VSI operation and failure patterns; conventional gyro principles, power sources, instrument limitations, and low-vacuum recognition; a concise electronic-display source map; magnetic-compass variation, deviation, dip-related acceleration and turning errors, and oscillation; disciplined cross-checking through shared-source grouping.
- Out of scope: aircraft-specific abnormal or emergency checklist steps; partial-panel control instruction; instrument approaches; detailed avionics reversion procedures; GPS integrity and navigation failures; regulations for required instruments. Those belong to the intended airplane’s POH/AFM and avionics guides, flight training, and later lessons where applicable.

## ACS and knowledge mapping

| Objective or risk-management item | Source locator | Episode treatment |
| --- | --- | --- |
| PA.I.G.K1h — pitot-static, vacuum/pressure, and associated flight instruments | Private Pilot ACS, Area I, Task G, printed pp. 7–8 | Organize the lesson by pressure, power, and sensor source rather than panel location. |
| PA.I.G.K2, R1, and R2 — indications, detection, and management of system abnormalities or failures | Private Pilot ACS, Area I, Task G, printed pp. 7–8 | Predict indication patterns, compare independent evidence, group related failures, and return the installed response to the aircraft checklist. |
| PA.VIII.A–D.K1a–K1d — limitations, errors, indication, function, operation, and cross-check | Private Pilot ACS, Area VIII, Tasks A–D, printed pp. 46–48 | Treat cross-check as interpretation of different sensors and response times, not a search for identical indications. |
| PA.VIII.A–D.R1–R2 — instrument-flight hazards and deteriorating situations | Private Pilot ACS, Area VIII, Tasks A–D, printed pp. 46–48 | Connect failure recognition to avoiding spatial disorientation and loss of control and to seeking assistance when a situation deteriorates. |
| PA.VIII.E.K1 — unusual-attitude prevention factors including system and equipment failures | Private Pilot ACS, Area VIII, Task E, printed p. 49 | Explain how following a failed attitude indication can create a real unwanted attitude. |

## Current-source check

- The FAA ACS index lists FAA-S-ACS-6C, published April 2024 and effective May 31, 2024, as the current Private Pilot for Airplane Category standard.
- FAA DRS identifies FAA-H-8083-25C as current, and the FAA handbook page supplies the current Chapter 8 PDF.
- The October 2025 PHAK MOSAIC addendum changes Chapters 1, 3, and 6; it does not amend Chapter 8.
- The research copy of Chapter 8 downloaded from the FAA handbook page had SHA-256 `9117a43d144ea04eec44fc456a6a8d00934fba5e7b4a34431150f82e62deef9b`. The source ledger records the FAA chapter-page attestation and page-level citations.

## Causal source map

| Instrument or display | Sensed input or reference | Common dependency | Failure-recognition use |
| --- | --- | --- | --- |
| Airspeed indicator | Pitot total pressure compared with static pressure | Pitot and static plumbing | A pitot-only failure isolates the ASI; a static failure can affect the ASI with the altimeter and VSI. |
| Altimeter | Static pressure acting around sealed aneroid wafers | Static plumbing | A blocked static source freezes the pressure reference and therefore the altitude indication. |
| Vertical-speed indicator | Direct static pressure compared with delayed static pressure through a calibrated restriction | Static plumbing | Normal lag separates trend from stabilized rate; a static blockage drives the indication toward zero. |
| Conventional attitude and heading indicators | Gyro rigidity, commonly maintained by vacuum or pressure power | Vacuum/pressure source in a common training-airplane arrangement | Low suction can make both indications unstable or inaccurate together. |
| Turn coordinator | Canted gyro, commonly electrically powered | Electrical source in a common training-airplane arrangement | Can provide independent turn and limited bank evidence after a vacuum failure, but not pitch information. |
| Magnetic compass | Magnets on a fluid-damped float and card align with Earth’s field | Aircraft magnetic environment, pendulous mounting, magnetic dip, and motion | Provides a heading reference with a different sensing path from a free gyro; speed changes and turns can tilt the assembly and create condition-specific errors before it settles. |
| Primary flight display | Air data, AHRS, magnetometer, processing, power, and display paths | Architecture varies by installation | A single screen can combine values from shared and independent sources; brightness and precision do not prove data validity. |

## Likely trouble spots

- Misconception: “If the altimeter and VSI agree, they independently confirm vertical motion.”
  - Correction: Both use the static source. A blocked static line can freeze the altimeter and drive the VSI to zero together.
  - Source: PHAK Chapter 8, Blocked Static System, printed p. 8-11.
- Misconception: “A blocked pitot tube always makes the ASI read zero.”
  - Correction: The ASI trends toward zero when the pitot opening is blocked but the drain remains open. If both are blocked, pitot pressure is trapped and the ASI can behave like an altimeter as static pressure changes.
  - Source: PHAK Chapter 8, Blocked Pitot System, printed pp. 8-10–8-11.
- Misconception: “A zero VSI proves level flight.”
  - Correction: A blocked static source can produce a continuous zero indication, and a conventional VSI also has normal lag before displaying a stabilized rate.
  - Sources: PHAK Chapter 8, VSI, printed pp. 8-7–8-8; Blocked Static System, printed p. 8-11.
- Misconception: “The turn coordinator is a backup attitude indicator.”
  - Correction: It provides turn direction and rate and limited backup bank information, but no pitch information or specific bank-angle display.
  - Source: PHAK Chapter 8, Turn Indicators and Turn Coordinator, printed pp. 8-16–8-17.
- Misconception: “A heading indicator is more accurate than the magnetic compass and can be trusted indefinitely.”
  - Correction: A free gyro drifts and needs periodic comparison and alignment with the compass while straight and level at constant speed.
  - Sources: PHAK Chapter 8, Heading Indicator, printed pp. 8-20 and 8-22.
- Misconception: “Variation and deviation are two words for the same compass error.”
  - Correction: Variation is the location-dependent difference between true and magnetic direction. Deviation comes from aircraft magnetic fields and changes with heading; remaining error is recorded on the airplane’s compass correction card.
  - Source: PHAK Chapter 8, Magnetic Compass Induced Errors, printed pp. 8-24–8-25.
- Misconception: “Acceleration and turning errors are two names for the same compass swing.”
  - Correction: In the Northern Hemisphere, acceleration error is a false turn indication caused by magnetic dip and inertia during an airspeed change on an easterly or westerly heading. Turning error occurs during an actual bank and turn; the tilted card leads toward northerly headings and lags toward southerly headings.
  - Source: PHAK Chapter 8, Dip Errors, Northerly and Southerly Turning Errors, and Acceleration Error, printed pp. 8-25–8-27.
- Misconception: “Several values on a PFD are automatically independent because they look separate.”
  - Correction: The display combines data. Airspeed and altitude can share air-data and pitot-static dependencies, while attitude and heading follow AHRS and magnetometer paths.
  - Source: PHAK Chapter 8, Electronic Flight Display, Air Data Computer, and AHRS, printed pp. 8-12, 8-14, and 8-20.

## Lesson architecture

1. Open with a coordinated static-failure pattern and make the listener ask whether the airplane or the information changed.
2. Use the ACS to establish the required connection among function, limitation, failure indication, and cross-check.
3. Give every instrument three questions: sensed quantity, source or power path, and independent confirming evidence.
4. Build the pitot-static pressure model, then derive each blocked-pitot and blocked-static indication from the trapped or live side of the pressure comparison.
5. Briefly transfer the source-path model to electronic displays without attempting installation-specific reversion instruction.
6. Build gyro behavior from rigidity and precession, then connect low rotor speed to instability and shared vacuum failures.
7. Bound the attitude indicator, heading indicator, turn coordinator, and inclinometer by what each can and cannot show.
8. Build compass errors from the physical instrument first: magnets on the card and float, the pendulous mounting, and Earth’s dipping field. Then separate location and aircraft errors from acceleration, turning, and oscillation errors, naming the heading and hemisphere conditions before introducing memory aids.
9. Close with a four-move cross-check: predict, compare, group, and control with reliable information before using the installed checklist.

## Visual-aid plan

- No spoken show-note visual-aid pointers appear in the initial draft. Diagrams may be selected during editorial development only if matching page-specific FAA links are added to the show notes.

## Editorial risks to avoid

- Turning failure recognition into a list of symptoms without explaining which pressure or power source produces them.
- Treating instruments sharing one source as independent corroboration.
- Presenting a clean partial-panel scenario as a substitute for flight training or an aircraft-specific checklist.
- Describing the turn coordinator as an attitude indicator or treating the inclinometer as a bank instrument.
- Applying Northern Hemisphere compass mnemonics without naming the relevant heading, acceleration or turn condition, and mechanism.
- Attributing compass turning error to Coriolis force or extending the PHAK’s inertia explanation beyond acceleration and deceleration.
- Treating an electronic display, sensor, computer, and power source as one undifferentiated component.
- Describing the POH/AFM as permission; it connects the general source model to the installed equipment, corrections, limitations, and procedures.

## Open technical questions

- None for the initial draft. Installation-specific pitot heat, alternate static, vacuum warning, standby instrument, AHRS/ADC, reversion, and checklist behavior is intentionally bounded to the intended airplane’s approved documents and avionics guides.
