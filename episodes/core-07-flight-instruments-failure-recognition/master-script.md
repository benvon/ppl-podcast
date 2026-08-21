# Flight Instruments and Failure Recognition

**Version:** 0.1.0 — initial source-mapped draft
**Target runtime:** 40–45 minutes / 5,189 spoken words
**Speakers:** Instructor, Learner, Announcer
**Production status:** Initial draft for editorial review; source-relevance review required before rendering.

## [00:00] Opening

**INSTRUCTOR:**

The airspeed needle falls, the altimeter stops moving, and the vertical-speed indicator settles at zero. Is the airplane slowing and leveling off—or did one pressure source just make three instruments tell a coordinated lie? Failure recognition begins by knowing what each instrument senses, which instruments share a source, and which independent indication can challenge the first story.

## [00:25] Disclaimer

**INSTRUCTOR:**

This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor. This podcast is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.

## [00:55] Podcast introduction

**ANNOUNCER:**

Welcome to PPL Study Podcast, a study companion for U.S. private-pilot airplane learners, grounded in FAA handbooks and standards. Come along as we talk through the Pilot’s Handbook of Aeronautical Knowledge and the Airman Certification Standards.

In this episode: Flight Instruments and Failure Recognition.

## [01:20] What the ACS is asking you to connect

**ANNOUNCER:**

What the ACS is asking you to connect.

**INSTRUCTOR:**

The Private Pilot Airplane ACS does not treat flight instruments as a collection of dials to name. In the Operation of Systems task, it includes the pitot-static system, vacuum or pressure systems, and their associated flight instruments. In the same task, it asks about indications of abnormalities or failures, detecting a malfunction, and managing a system failure.

The basic-instrument-maneuver tasks add another connection. The applicant is expected to understand instrument limitations and potential errors, what the instruments say about aircraft attitude, how they function, and proper instrument cross-check techniques. Those elements belong together. An indication is useful only if you understand the physical input behind it, the limitations that can distort it, and the other information that should agree with it.

Here is the model for this episode. First, identify the quantity an instrument senses. Pressure? Rotation? Magnetic direction? Then identify its source and any instruments that share that source. Finally, compare the indication with an independent source before deciding what the airplane is doing.

**LEARNER:**

So recognizing a failure is less like memorizing one warning sign and more like checking whether a group of indications tells a physically possible story.

**INSTRUCTOR:**

Exactly. One instrument can be wrong. Several instruments can also be wrong together when they depend on the same blocked line, power source, computer, or sensor. A disciplined cross-check asks what the instruments have in common before it follows any one of them.

This lesson explains common instrument behavior and failure patterns. The installed equipment, warning flags, backup sources, limitations, and checklist response come from the intended airplane’s POH or AFM and avionics guides. Those documents connect the general model to the actual panel.

[Source: sources.yaml#acs-operation-of-systems; sources.yaml#acs-basic-instrument-cross-check]
[Claim type: FAA standard]

## [04:10] Three questions for every instrument

**ANNOUNCER:**

Three questions for every instrument.

**INSTRUCTOR:**

Before dividing the panel into pitot-static, gyroscopic, and magnetic instruments, give every indication the same three-question test.

Question one: what does it actually sense? An airspeed indicator does not sense speed over the ground. It compares pressure from the pitot system with static pressure. An altimeter does not measure distance above the ground. It responds to static pressure and displays altitude relative to the pressure reference set in its window. A conventional attitude indicator does not look outside at the horizon. Its spinning gyro provides a stable reference while the airplane moves around it. A magnetic compass aligns with the Earth’s magnetic field, but acceleration, turning, aircraft magnetism, and oscillation can disturb what you see.

Question two: what source keeps it working? The altimeter, vertical-speed indicator, and airspeed indicator share static pressure. Only the airspeed indicator also uses pitot pressure. In a common conventional panel, the attitude and heading indicators may share vacuum power while the turn coordinator uses electrical power. In an electronic panel, an air data computer may process pitot-static inputs, while an attitude and heading reference system and a magnetometer provide other information.

Question three: what independent evidence should agree? If pitch attitude increases and power is unchanged, the attitude indication, airspeed trend, altitude trend, vertical-speed trend, control pressure, and outside view in visual conditions should develop a coherent pattern. They do not all move at the same time or by the same amount. The vertical-speed indicator normally lags before showing a stabilized rate. The heading indicator can drift. The magnetic compass can swing during a turn. Cross-checking means interpreting those different response characteristics, not demanding identical movement.

**LEARNER:**

That gives the instruments different jobs. It also keeps a normal lag from looking automatically like a failure.

**INSTRUCTOR:**

Right. A useful instrument scan is not a hunt for matching needles. It is a repeated test of a causal chain: the airplane changes attitude or energy, each sensor responds according to its design, and the resulting indications should fit together over the expected time scale.

Separate three layers in that chain. The airplane has a real state: pitch, bank, speed through the air, altitude, vertical trend, and direction. Sensors sample only pieces of that state. The panel then presents the sensor information with mechanical needles, tapes, symbols, or numbers. A display can look precise even when the source feeding it is wrong. Failure recognition works backward from presentation to source, then forward again to the airplane state that all reliable sources should describe.

For example, suppose a digital airspeed number stops changing while pitch and power changes produce sensible altitude and vertical-speed trends. The frozen digits are the presentation. The useful questions are whether the air data source has stopped updating, whether a warning flag is present, and whether other information with a different source still responds. Staring harder at the digits does not answer those questions. Moving through the source map does.

[Source: sources.yaml#phak-pitot-static-overview; sources.yaml#phak-vsi-operation; sources.yaml#phak-gyro-principles; sources.yaml#phak-glass-sensor-paths; sources.yaml#phak-magnetic-compass-basics]
[Claim type: FAA guidance and teaching explanation]

## [07:30] Pitot-static: pressure becomes information

**ANNOUNCER:**

Pitot-static: pressure becomes information.

**INSTRUCTOR:**

Static pressure is the local atmospheric pressure around the airplane. It exists whether the airplane is parked or moving. Dynamic pressure is associated with motion through the air. The pitot opening faces the relative airflow and receives total pressure: static pressure plus dynamic pressure. Static ports are positioned to sample air that is as undisturbed as the installation can provide.

The airspeed indicator, or A-S-I, compares those two inputs. Total pressure enters a diaphragm through the pitot line. Static pressure surrounds that diaphragm inside the instrument case. Because static pressure appears on both sides of the comparison, the difference left over corresponds to dynamic pressure. The instrument converts that pressure difference into indicated airspeed.

The altimeter uses static pressure alone. Inside it, sealed aneroid wafers expand when surrounding static pressure decreases and contract when static pressure increases. Mechanical linkages turn that movement into an altitude indication. In the normal atmosphere, pressure generally decreases as altitude increases, so lower static pressure is interpreted as higher altitude.

That wording matters. The altimeter measures pressure and displays an altitude. It does not directly measure terrain clearance. Its indication depends on the barometric setting and on atmospheric conditions. A current setting compensates for nonstandard surface pressure near the reporting area, but it does not remove every temperature-related altitude error. In colder-than-standard air, true altitude can be lower than indicated altitude. That is one reason an altimeter reading and actual height above terrain are not synonyms.

The vertical-speed indicator, or V-S-I, also uses static pressure, but it compares the pressure inside a diaphragm with pressure entering the case through a calibrated restriction. The diaphragm receives a static-pressure change promptly; the case pressure catches up more slowly. That temporary difference moves the needle. Once a steady climb or descent is established, the difference corresponds to a rate. When the pressures equalize in level flight, the indication returns toward zero.

**LEARNER:**

So the VSI’s lag is built into the way it creates a pressure difference over time.

**INSTRUCTOR:**

Yes. The PHAK distinguishes trend information from stabilized rate information. The first needle movement can show that the vertical trend changed, while the stabilized value comes later. Turbulence and rough control can make the indication less steady.

Now group the instruments by plumbing. Altimeter: static only. VSI: static only. ASI: pitot total pressure compared with static pressure. That small map predicts the major blockage patterns before you memorize any symptom.

[Source: sources.yaml#phak-pitot-static-overview; sources.yaml#phak-altimeter-operation-and-errors; sources.yaml#phak-altimeter-temperature-error; sources.yaml#phak-vsi-operation; sources.yaml#phak-asi-operation]
[Claim type: FAA guidance]

## [11:55] A blocked pitot source changes one instrument

**ANNOUNCER:**

A blocked pitot source changes one instrument.

**INSTRUCTOR:**

Start with the simplest split: the pitot system supplies only the airspeed indicator. If a failure affects the pitot input but leaves the static system open, the altimeter and VSI still receive normal static pressure. That makes them valuable independent evidence.

There are two different blocked-pitot cases because a typical pitot tube has a forward opening and a drain hole.

First case: the forward pitot opening is blocked, but the drain hole remains open. Ram air can no longer enter. Air already in the pitot line vents through the drain, so pressure on the pitot side falls toward ambient static pressure. The ASI then has nearly the same static pressure on both sides of its diaphragm and loses the difference that represents dynamic pressure. Its indication falls rapidly toward zero. The altimeter and VSI can continue to behave normally because their static source was not part of the blockage.

That is a powerful recognition pattern. If the ASI falls toward zero while altitude and vertical trend still respond coherently—and the airplane’s attitude, power, sound, and outside visual picture do not support a sudden loss of all motion through the air—the pressure map points toward the pitot side, not toward an instruction to pull up and chase the airspeed needle.

**LEARNER:**

The temptation would be to treat the low airspeed as true and increase pitch. But the other evidence may say that the airplane did not suddenly slow.

**INSTRUCTOR:**

Correct. Failure recognition protects against turning a bad indication into a real loss of control.

Notice what made that conclusion possible. The altimeter and VSI share static pressure, but they do not use pitot pressure. The outside horizon in visual conditions does not use either pneumatic line. Power setting and the airplane’s sound come from still other information. None of those clues alone measures indicated airspeed, yet together they can show that the ASI’s story is incompatible with the rest of the airplane. That is a cross-check doing its real job.

Second case: both the forward pitot opening and the drain hole are blocked. Now total pressure is trapped in the pitot line and ASI diaphragm. If altitude stays unchanged, the ASI may remain near the value present when the blockage occurred even if actual airspeed changes. It has stopped receiving new pitot information.

If altitude changes, the failure becomes more deceptive. The trapped pressure inside the diaphragm remains fixed while live static pressure around it changes. In a climb, outside static pressure decreases. The fixed pressure inside the diaphragm now looks larger by comparison, so the ASI indicates an increase. In a descent, outside static pressure increases and compresses the diaphragm, so indicated airspeed decreases. The broken ASI begins moving with altitude rather than with actual airspeed.

**LEARNER:**

So a trapped pitot pressure can make the ASI imitate an altimeter: up in a climb and down in a descent.

**INSTRUCTOR:**

That is the useful causal picture. Do not stop at “acts like an altimeter.” Say why: one side of the comparison is trapped, and the live static pressure on the other side changes with altitude.

Visible moisture can block a pitot tube with ice. Some airplanes have pitot heat, but the equipment, limitations, indications, and use are installation-specific. The airplane’s published information defines how its system is checked and operated.

[Source: sources.yaml#phak-blocked-pitot; sources.yaml#phak-trapped-pitot-altitude-effect]
[Claim type: FAA guidance]

## [16:35] A blocked static source changes the family

**ANNOUNCER:**

A blocked static source changes the family.

**INSTRUCTOR:**

A static blockage affects all three pitot-static instruments because all three use static pressure.

The altimeter case traps the static pressure present when the blockage occurs. As the airplane changes altitude, the wafers no longer receive the corresponding change in outside pressure. The altimeter therefore freezes near the altitude at which the static system became blocked.

The VSI also loses the changing pressure it needs. With trapped pressure and no continuing difference between its diaphragm and case, it settles toward a continuous zero indication. That zero does not prove level flight. It can mean the instrument no longer has new pressure information.

The ASI continues to receive live total pressure from the pitot tube, but the static reference around its diaphragm is trapped. Above the altitude where the blockage occurred, actual outside static pressure is lower than the trapped pressure. The pressure difference inside the instrument is therefore smaller than it should be, so the ASI reads lower than actual. Below the blockage altitude, actual outside static pressure is higher than the trapped reference. The indicated difference becomes too large, so the ASI reads higher than actual.

Put the climb pattern together. The airplane climbs, but the altimeter remains fixed. The VSI stays at zero. The ASI tends to under-read as altitude increases. Three indications can suggest level flight and decreasing airspeed even though the airplane is climbing. They agree because they share the same bad static input, not because they independently confirmed the airplane’s state.

**LEARNER:**

That answers the cold open. A frozen altimeter, zero VSI, and misleading ASI can be one static-system story.

**INSTRUCTOR:**

Yes. Correlation is not independence. Instruments connected to one blocked line can move together or fail together.

Some airplanes provide an alternate static source, often inside the flight deck. The PHAK explains the general conventional result of selecting a lower-pressure cabin source: the altimeter indicates slightly higher, the ASI indicates higher, and the VSI shows a momentary climb before stabilizing if altitude is held. The exact error and the approved use belong to the airplane’s POH or AFM.

Notice the distinction between recognizing the source and applying the checklist. The pressure model helps you recognize why several indications changed. The aircraft documents identify the actual alternate source, its corrections, and the response for that installation.

[Source: sources.yaml#phak-blocked-static; sources.yaml#phak-alternate-static]
[Claim type: FAA guidance]

## [20:25] Electronic displays still have source paths

**ANNOUNCER:**

Electronic displays still have source paths.

**INSTRUCTOR:**

A primary flight display changes the presentation, but it does not repeal the sensing problem. The PHAK describes an air data computer receiving pitot-static inputs and computing information for the electronic airspeed and altitude displays. It also describes an attitude and heading reference system supplying attitude information, with heading information derived from a magnetometer.

That means a glass panel can place airspeed, altitude, vertical speed, attitude, and heading on one screen while those values still come from different sensors and processors. It can also place several indications derived from one source beside one another. A large, clean display is not evidence that every number is independent.

Distinguish a display failure from a data-source failure. If one screen goes dark but the same valid data appears on a remaining display through an approved reversion mode, the sensor may still be working. If the air data source becomes invalid, airspeed, altitude, and vertical-speed presentations may all be affected even while the screen remains bright. If an attitude source fails, pitch and bank can be wrong while air-data values remain available. The exact flags and reversion behavior differ, but the reasoning is stable: identify whether the lost layer is sensing, processing, power, or presentation.

**LEARNER:**

Then failure recognition on a glass panel still starts with source architecture. Which sensor, computer, display, or power path feeds this information?

**INSTRUCTOR:**

Exactly. Electronic systems may add warning flags, comparison monitors, reversion modes, and standby instruments. Their design varies. Learn the installed system well enough to know what is shared and what remains independent. The POH or AFM and the avionics operating guide explain that architecture for the airplane.

The general cross-check remains the same. Ask whether the indication fits the airplane’s attitude and energy, whether related values share a source, whether a flag or annunciation identifies invalid data, and which independent indication can test the story.

[Source: sources.yaml#phak-glass-sensor-paths; sources.yaml#phak-air-data-computer; sources.yaml#phak-ahrs-heading-path]
[Claim type: FAA guidance and teaching explanation]

## [22:50] Gyroscopes: stability needs power

**ANNOUNCER:**

Gyroscopes: stability needs power.

**INSTRUCTOR:**

A conventional gyroscopic instrument uses a rapidly spinning rotor. Two properties explain most of what the pilot sees.

Rigidity in space is the tendency of the spinning gyro to remain aligned in its plane of rotation. Mount the gyro so the airplane can move around it, and the stable rotor becomes a reference for attitude or heading.

Precession is the gyro’s response to a deflecting force. The response appears ninety degrees later in the direction of rotation. Instruments such as turn indicators use controlled precession to display a rate of turn. Unwanted precession from friction can also produce error, especially in a heading indicator.

Neither property helps if the rotor is not spinning at its required speed. Conventional gyros may be powered by vacuum, pressure, or electricity. A common training-airplane arrangement uses vacuum for the attitude and heading indicators and electricity for the turn coordinator. The reason for separate sources is important: failure of one source should not remove every source of bank information.

In a typical vacuum system, an engine-driven pump draws air through a filter and across the gyro rotors. A relief valve limits suction, and a gauge or warning light reports whether the system is within its normal range. The PHAK warns that attitude and heading indications may not be reliable when suction is low. As vacuum drops below the operating range, the gyros slow, become less stable, and can produce inaccurate or wandering indications.

**LEARNER:**

So a low-vacuum indication is not just another gauge problem. It can identify a common power problem for two flight instruments.

**INSTRUCTOR:**

Exactly. The source map matters. If a vacuum-powered attitude indicator and heading indicator both become suspect while an electrically powered turn coordinator continues to respond normally, that pattern is consistent with the common vacuum source. If all three depend on a different architecture in the airplane, the pattern can be different.

The practical habit is to know the power source before the failure. Trace it during preflight study: which instruments use vacuum, which use electricity, which have internal batteries, and which sensors or displays share a bus? The installed indications and checklist then turn that map into an aircraft-specific response.

A vacuum failure may not announce itself with two needles snapping to obviously impossible positions. A gyro can slow over time. Its indication may first become sluggish, drift, or lean away from the pattern shown by reliable instruments. That gradual onset is why the suction gauge or warning light belongs in the scan and why routine comparison matters before a dramatic disagreement appears. A normal-looking instrument face is not the same thing as a healthy power source.

[Source: sources.yaml#phak-gyro-principles; sources.yaml#phak-gyro-power-and-low-vacuum]
[Claim type: FAA guidance]

## [26:35] What each gyro can and cannot tell you

**ANNOUNCER:**

What each gyro can and cannot tell you.

**INSTRUCTOR:**

The attitude indicator gives a direct picture of pitch and bank. Its miniature airplane and horizon bar represent the airplane’s relationship to the horizon. In a conventional instrument, the gyro remains stable while the airplane and instrument case move around it.

That indication has limits. Some conventional attitude indicators can tumble or give erroneous indications when their pitch or bank limits are exceeded. Designs vary, and many modern instruments avoid that particular limitation. The important lesson is not one universal angle. It is to know whether the installed attitude source has operating limits, warning flags, alignment requirements, or failure modes that can make a polished-looking attitude picture invalid.

The heading indicator uses gyro rigidity to provide a steady, readable heading display, but a free gyro is not automatically tied to magnetic north. Friction and Earth rotation produce drift. The PHAK calls for frequent comparison and periodic alignment with the magnetic compass, with the airplane straight and level at a constant speed so compass errors are minimized. If the gyro slows because vacuum is inadequate, its drift and instability can increase.

The turn coordinator answers a different question. Its canted gyro initially senses roll rate; once roll stabilizes, it indicates rate and direction of turn. It does not display a specific bank angle, and the face explicitly provides no pitch information. The inclinometer—the ball in the curved tube—shows turn coordination, not attitude.

**LEARNER:**

So the turn coordinator can challenge a failed attitude indicator’s bank story, but it cannot become a complete attitude indicator.

**INSTRUCTOR:**

Correct. It is backup bank information in a limited sense. It can tell you turn direction and rate, and the ball can show coordination. It cannot show pitch. You still need other reliable instruments to interpret altitude, vertical trend, and airspeed.

This is where chasing one gauge becomes especially dangerous. Imagine the attitude indicator slowly tilts right because its gyro is losing speed. If the pilot follows it alone, the pilot may apply left aileron even though the airplane was wings level. A turn coordinator that remains centered, a stable magnetic heading, unchanged altitude and vertical trend, and the outside horizon in visual conditions all challenge the false bank story. The disciplined response begins by recognizing the disagreement and testing which indications share the suspect source.

That example is a teaching model, not a substitute for partial-panel training. The ACS expects basic instrument cross-check and recognizes system and equipment failures as contributors to unusual attitudes. The actual control technique belongs in flight training and the airplane’s procedures.

[Source: sources.yaml#phak-attitude-indicator; sources.yaml#phak-attitude-indicator-limits; sources.yaml#phak-heading-indicator-drift; sources.yaml#phak-heading-low-vacuum; sources.yaml#phak-turn-indicator-backup; sources.yaml#phak-turn-coordinator; sources.yaml#phak-inclinometer; sources.yaml#acs-basic-instrument-cross-check; sources.yaml#acs-unusual-attitude-failure-factor]
[Claim type: FAA guidance and teaching explanation]

## [31:20] The magnetic compass is simple, not perfect

**ANNOUNCER:**

The magnetic compass is simple, not perfect.

**INSTRUCTOR:**

The magnetic compass provides an important independent heading reference because its magnets align with the Earth’s magnetic field. Its compass card floats in fluid beneath a lubber line. But “magnetic” does not mean error-free. The compass is affected by where magnetic north lies, magnetic fields in the airplane, magnetic dip, acceleration, turning, and oscillation. Its float also has limited freedom to tilt; at steeper bank angles, conventional compass indications can become erratic and unpredictable.

Start with variation and deviation because they are different categories.

Variation is the angular difference between true north and magnetic north at a location. Aeronautical charts show that geographic relationship with isogonic lines. Variation changes with location, not with the airplane’s heading.

Deviation is error caused by magnetic fields in the airplane. Electrical current, magnetized structure or components, and installed equipment can disturb the compass. Deviation can change with heading. After maintenance compensation minimizes it, remaining error is recorded on the compass correction card. The card belongs to that compass in that airplane; it is not a generic correction.

**LEARNER:**

Variation belongs to the Earth and the location. Deviation belongs to the airplane and can be different on different headings.

**INSTRUCTOR:**

Exactly.

Magnetic dip produces the errors that appear during acceleration and turns. Away from the magnetic equator, Earth’s magnetic field has a vertical component. The compass is designed to stay mostly horizontal, but acceleration and bank can tilt its pendulous assembly enough for that vertical component to create a false indication.

In the Northern Hemisphere, acceleration on an easterly or westerly heading makes the compass indicate a turn toward north. Deceleration makes it indicate a turn toward south. The mnemonic A-N-D-S preserves that limited relationship: accelerate north, decelerate south. It is most useful on east or west headings and should not be stretched into a rule for every heading or every maneuver.

Turning error is most noticeable around north and south. When beginning a turn from a northerly heading, the conventional compass initially lags and may indicate a turn in the opposite direction. When beginning from a southerly heading, it leads. When rolling out toward a northerly heading in the Northern Hemisphere, the compass reaches the desired indication before the airplane reaches the actual heading, so the rollout begins early—undershoot north. Toward a southerly heading, the indication lags the airplane, so the rollout occurs after the compass passes the desired heading—overshoot south.

Those memory words are only a retrieval aid. The causal explanation is dip acting on a tilted compass assembly, and the size of the error changes with latitude and heading. The POH or training guidance for the installed compass matters more than a slogan detached from those conditions.

Oscillation combines several errors and makes the card swing around the actual heading. When aligning a free-gyro heading indicator, the PHAK advises using the average compass indication between the swings. It also calls for alignment while straight and level at a constant speed, where turning and acceleration errors are reduced.

**LEARNER:**

So the magnetic compass can be the independent reference for gyro drift without being a perfectly steady reference during every maneuver.

**INSTRUCTOR:**

That is the right conclusion. Independence does not mean perfection. It means the errors come from a different mechanism. Cross-checking works when you understand both mechanisms.

[Source: sources.yaml#phak-magnetic-compass-basics; sources.yaml#phak-variation-and-deviation; sources.yaml#phak-compass-correction-card; sources.yaml#phak-compass-dip-errors; sources.yaml#phak-compass-oscillation]
[Claim type: FAA guidance]

## [36:45] Cross-check the story, not the loudest gauge

**ANNOUNCER:**

Cross-check the story, not the loudest gauge.

**INSTRUCTOR:**

Failure recognition can be organized into four moves: predict, compare, group, and control.

Predict the next indication from the airplane state you believe exists. If you believe the airplane entered a climb at roughly constant power, you should expect altitude to begin increasing, the VSI to trend upward before settling, and airspeed often to change according to pitch and energy. If the altimeter and VSI remain frozen while the outside visual picture or a reliable attitude source supports a climb, the prediction fails in a way that points toward static pressure.

Compare the indication with information that does not depend on the same source. An altimeter and VSI agreeing is useful for monitoring a healthy system, but it is not independent confirmation when both use the same static line. A vacuum attitude indicator and vacuum heading indicator can agree in being wrong together if the common power source is failing. The magnetic compass, electrically powered turn coordinator, engine and suction indications, standby instruments, GPS-derived information where appropriate, and the outside horizon in visual conditions can provide different evidence—but only after you know what each source can legitimately tell you.

Group the disagreement by shared cause. One ASI abnormal while altimeter and VSI remain alive suggests a different source pattern than all three pitot-static instruments becoming abnormal. Two conventional gyro instruments drifting with low suction suggests a different pattern than a single heading indicator slowly precessing while suction and attitude remain normal. An entire electronic display failing is different from one air-data value being flagged invalid.

Then control the airplane with reliable information and use the installed checklist. This is not an invitation to improvise a diagnosis until every component is named. The immediate discipline is to avoid following a suspect indication into a real unwanted attitude. Use the sources that remain credible, keep control inputs measured, reduce unnecessary workload, and apply the aircraft-specific response and training.

Try the four moves on a static-blockage pattern. Predict: a real climb should reduce static pressure, increase altimeter indication, and create an upward VSI trend. Compare: the outside picture or a reliable attitude source suggests a climb, but the altimeter stays fixed and the VSI stays at zero. Group: those two instruments share static pressure, and the ASI is also behaving abnormally as altitude changes. Control: reject the frozen-pressure story, use the information that remains reliable, and follow the installed checklist rather than forcing the airplane to make the bad indications look normal.

Now try a vacuum pattern. Predict: a real right bank should produce right-turn information and a changing heading. Compare: the vacuum attitude indicator slowly shows a right bank, but an independently powered turn coordinator remains centered, the magnetic heading is stable after allowing for compass behavior, and altitude and vertical trend remain steady. Group: the attitude and heading gyros share low suction, while the turn coordinator does not. Control: do not roll the airplane left merely to center the suspect attitude picture. Use reliable references and the aircraft-specific procedure.

The examples use clean patterns for learning. Real failures can be messier. Turbulence moves the airplane while an instrument is failing. A pilot can add control inputs that create new indications. More than one system can be affected by a common electrical problem. The value of the method is not that it guarantees an instant diagnosis. It keeps each conclusion tied to evidence and gives a changing situation a repeatable structure.

**LEARNER:**

Where does “do not chase the gauge” fit? It sounds useful, but vague.

**INSTRUCTOR:**

Make it specific. Chasing a gauge means making repeated control inputs to force one indication toward a target before checking whether the indication is valid and before allowing the airplane’s response to stabilize. The result can be oscillation or a real attitude change commanded in response to a false signal.

The alternative is not to ignore instruments. It is to use a disciplined rhythm: set or hold a known attitude and power with reliable references, observe the expected trend, compare independent sources, and make a small correction based on the combined picture. Then give the airplane and the instrument enough time to respond before correcting again.

The ACS makes cross-check part of basic instrument knowledge because control, interpretation, and error recognition cannot be separated. It also identifies instrument-flight hazards such as spatial disorientation, loss of control, distraction, and loss of situational awareness. If a VFR pilot loses reliable visual reference or the situation is deteriorating, seeking assistance or declaring an emergency is part of risk management, not a failure of composure.

**LEARNER:**

So the goal is not to prove which instrument failed before doing anything else. It is to keep the airplane under control while rejecting a story that the rest of the evidence does not support.

**INSTRUCTOR:**

Exactly. A good cross-check is both diagnostic and protective. It helps identify the failed source, and it prevents the failed source from taking command of the airplane.

[Source: sources.yaml#acs-basic-instrument-cross-check; sources.yaml#phak-blocked-pitot; sources.yaml#phak-blocked-static; sources.yaml#phak-gyro-power-and-low-vacuum; sources.yaml#phak-heading-low-vacuum]
[Claim type: FAA standard, FAA guidance, and teaching explanation]

## [42:00] Retrieval review

**ANNOUNCER:**

Retrieval review.

**INSTRUCTOR:**

Retrieve the three questions. What does the instrument sense? What source keeps it working? What independent evidence should agree?

For the pitot-static system, remember the source map. The ASI compares pitot total pressure with static pressure. The altimeter and VSI use static pressure only. A pitot blockage therefore affects the ASI, while a static blockage affects the family. If the pitot opening is blocked but its drain remains open, the ASI falls toward zero. If pitot pressure is trapped, the ASI can change with altitude. If static pressure is trapped, the altimeter freezes, the VSI settles at zero, and the ASI becomes altitude-dependent and inaccurate.

For conventional gyros, remember that rigidity provides a stable reference and precession can provide a rate indication or introduce error. Power source matters. In a common arrangement, vacuum powers attitude and heading while electricity powers the turn coordinator. Low suction can make the shared vacuum instruments unreliable. The turn coordinator shows turn information and coordination, but no pitch information. The heading indicator is steady and convenient, but a free gyro drifts and needs comparison with the magnetic compass.

For the magnetic compass, separate variation from deviation. Variation is the location-dependent difference between true and magnetic direction. Deviation comes from the airplane’s magnetic fields and is recorded on its correction card. In the Northern Hemisphere, acceleration on east or west indicates north; deceleration indicates south. Turning errors around north and south come from magnetic dip, and oscillation calls for reading an average rather than chasing each swing.

**LEARNER:**

And for the whole panel: agreement is strongest when the sources are independent, not merely when several indications share the same failed input.

**INSTRUCTOR:**

Exactly. Build the source map before you need it. Predict what a real airplane change should do. Compare independent evidence. Group failures by their shared source. Then control the airplane with reliable information and use the checklist and training for the installed system.

[Source: sources.yaml#acs-operation-of-systems; sources.yaml#acs-basic-instrument-cross-check; sources.yaml#phak-blocked-pitot; sources.yaml#phak-blocked-static; sources.yaml#phak-gyro-power-and-low-vacuum; sources.yaml#phak-heading-indicator-drift; sources.yaml#phak-compass-dip-errors]
[Claim type: FAA standard and FAA guidance]

## [44:40] Outro

**ANNOUNCER:**

Thanks for listening to PPL Study Podcast. For show notes, source links, and more study material, visit pplstudyguide.com. Send feedback or source corrections to feedback@pplstudyguide.com. The episodes and the research behind them are available for review as an open-source work on GitHub. Until next time, study the sources and keep learning.
