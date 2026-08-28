# Aircraft Performance and Density Altitude

**Version:** 0.1.5 — reviewed draft
**Target runtime:** approximately 40 minutes
**Speakers:** Instructor, Learner, Announcer
**Production status:** Script approval, source-relevance review, and full human listening QA are complete. Manual chapter review and release work remain pending.

## [00:00] Opening

**INSTRUCTOR:**

The runway is the same length in the cool morning and the hot afternoon. The airplane may carry the same people and fuel. Yet the distance needed to take off and the climb available after liftoff can be substantially different. Performance planning explains why, and it gives you a disciplined way to decide whether the airplane, the runway, and the expected conditions fit together.

## [00:25] Disclaimer

**INSTRUCTOR:**

This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor. This podcast is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.

## [00:55] Podcast introduction

**ANNOUNCER:**

Welcome to PPL Study Podcast, a study companion for U.S. private-pilot airplane learners, grounded in FAA handbooks and standards. Come along as we talk through the Pilot’s Handbook of Aeronautical Knowledge and the Airman Certification Standards.

In this episode, we will connect density altitude with takeoff, climb, cruise, and landing performance, then build a practical way to read the intended airplane's performance data.

## [01:20] What the ACS is asking you to connect

**ANNOUNCER:**

What the ACS is asking you to connect.

**INSTRUCTOR:**

The Private Pilot for Airplane Category Airman Certification Standards puts this subject in Task PA.I.F, Performance and Limitations. The objective is to operate an airplane safely within its performance capabilities and limitations. A useful performance answer connects the airplane, atmosphere, loading, runway, and pilot technique instead of treating any one of them as the whole answer. The task asks you to use performance charts, tables, and data, and to explain how those factors and the underlying aerodynamics affect the result.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Claim type: FAA regulatory standard]

The risk-management elements add three questions. Are you using the performance data correctly? Are you respecting the airplane's limitations? What could make actual performance differ from the calculated performance? The skill element then asks you to use the appropriate performance charts, tables, and data for the airplane.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Source: sources.yaml#acs-performance-skill]
[Claim type: FAA regulatory standard]

**LEARNER:**

So the examiner is not only looking for a density-altitude definition or one takeoff-distance calculation.

**INSTRUCTOR:**

Correct. A definition and a calculation are parts of the task. The larger skill is building a traceable answer. You identify the airplane and the performance source. You identify the runway and the expected conditions. You select the chart that answers the actual question. You enter the inputs carefully, follow its notes, and compare the output with what is available. Then you ask how much confidence and margin the plan has if conditions or execution are less favorable than expected.

That same practical question appears in the preflight-action rule. Before beginning a flight, section 91.103 requires the pilot in command to become familiar with available information concerning that flight. For any flight, that includes runway lengths at airports of intended use and the applicable takeoff and landing performance information.

For the airplane you train in, start with its POH, AFM, and accompanying documents. Chapter 9 of the PHAK explains that the POH for most light airplanes built after 1975 is also the FAA-approved flight manual. The title or preliminary pages identify that status and the airplane to which the manual applies. Check those pages with your instructor or operator rather than deciding from the cover alone.

[Source: sources.yaml#phak-poh-afm-identification]
[Claim type: FAA guidance]

If the airplane is required to have an approved flight manual and that manual contains takeoff and landing distance data, section 91.103 says to use those data. Otherwise, the rule still requires reliable performance information appropriate to the airplane and the expected airport elevation, runway slope, gross weight, wind, and temperature. For the usual training flight, identify the information that applies to the actual airplane, then use the path its documentation establishes.

[Source: sources.yaml#cfr-preflight-performance]
[Claim type: Regulation]

**LEARNER:**

Then the purpose of the chart is not to finish a worksheet. It is to decide whether the plan works.

**INSTRUCTOR:**

Exactly. The arithmetic serves the decision.

We will begin with the source of the airplane-specific information, then explain the atmospheric model behind density altitude, and finally carry both into takeoff, climb, cruise, and landing planning.

## [04:20] Performance starts with the actual airplane

**ANNOUNCER:**

Performance starts with the actual airplane.

**INSTRUCTOR:**

Chapter 11 of the PHAK identifies the performance or operational information section of the POH or AFM as the source of operating data for takeoff, climb, range, endurance, descent, and landing. The important point is that the data belongs to the intended airplane model and configuration, and the planning inputs belong to the airplane and flight you are actually preparing.

[Source: sources.yaml#phak-performance-data-introduction]
[Claim type: FAA guidance]

The same chapter warns that manufacturers do not present performance information in one standardized format. One POH may use a table. Another may use a graph. A chart may begin with pressure altitude and temperature. Another may use density altitude directly. Some charts combine several corrections in one path. That is why memorizing the motions used on a sample chart is not the same as knowing how to use the actual airplane's data.

[Source: sources.yaml#phak-data-basis-and-density-effects]
[Claim type: FAA guidance]

**LEARNER:**

Can I use the sample charts in the PHAK to learn the method?

**INSTRUCTOR:**

Yes, for the general reasoning. The book gives useful examples of tables, graphs, interpolation, and combined charts. For a real flight plan, begin with the current POH or AFM for the airplane to be flown. Confirm the chart title, model or configuration applicability, units, conditions, and notes before entering a number.

That distinction prevents a subtle error. Two airplanes can look similar, and two charts can use the same labels, yet their tested configurations, speeds, correction notes, or output definitions can differ. Appropriate performance data means the correct document and the correct chart inside that document, not merely a familiar-looking chart.

If an itinerary includes another departure after landing, treat it as a new performance-planning question. Before beginning that later flight, section 91.103 again requires the pilot in command to become familiar with available information concerning that flight. Build its performance plan from the airplane's loading, runway, and expected conditions for that departure.

[Source: sources.yaml#cfr-preflight-performance]
[Claim type: Regulation]

## [06:30] Density altitude is a performance altitude

**ANNOUNCER:**

Density altitude is a performance altitude.

**INSTRUCTOR:**

Imagine that the airplane could ask one question about the surrounding air: how tightly packed are the air molecules here? That matters because, as we discussed in the earlier airfoil-and-lift lesson, air moving past the wing's airfoil produces the aerodynamic force the pilot relies on. The density of that moving air is part of the result. Air density also affects the mass of air moving through the engine and propeller. Density altitude expresses that density as an equivalent altitude in the standard atmosphere.

[Source: sources.yaml#phak-airfoil-air-reaction]
[Source: sources.yaml#phak-data-basis-and-density-effects]
[Claim type: FAA guidance]

The PHAK defines density altitude as pressure altitude corrected for nonstandard temperature. A higher density-altitude value corresponds to lower-density air and reduced airplane performance. A lower value corresponds to denser air and improved performance relative to the higher-density-altitude case.

[Source: sources.yaml#phak-pressure-density-altitude-definitions]
[Source: sources.yaml#phak-density-altitude-performance]
[Claim type: FAA guidance]

**LEARNER:**

The name still feels backward. Why does high density altitude mean thin air?

**INSTRUCTOR:**

Because the word high describes the equivalent altitude, not the amount of density. Suppose the air at an airport has the same density that the standard atmosphere would have at a much higher altitude. The density altitude is high. The air is thin. The airplane responds to that density even though the wheels are still on the runway.

That is why density altitude is useful. It converts a changing combination of pressure and temperature into a performance reference. It tells you which standard-atmosphere density resembles the air the airplane is operating in.

**LEARNER:**

Is density altitude the height shown by the altimeter?

**INSTRUCTOR:**

Not normally. The altimeter can give you pressure altitude when it is set to the standard pressure setting. Density altitude requires another step for nonstandard temperature. Some performance tools calculate it for you, and some POH charts lead you through pressure altitude and temperature without asking you to write down a separate density-altitude number. Follow the method the actual performance source uses.

## [09:05] Pressure altitude comes first

**ANNOUNCER:**

Pressure altitude comes first.

**INSTRUCTOR:**

Pressure altitude is the altitude in the standard atmosphere that corresponds to the sensed pressure. Chapter 11 explains that one way to read it is to set the altimeter to 29.92 inches of mercury and read the indicated altitude. It can also be derived from field elevation and the current altimeter setting or found with an appropriate flight computer.

[Source: sources.yaml#phak-pressure-density-altitude-definitions]
[Claim type: FAA guidance]

Airport elevation and pressure altitude are therefore not interchangeable. Elevation describes the runway's surveyed height above mean sea level. Pressure altitude changes with atmospheric pressure. On a day with lower pressure, the pressure altitude at the same runway can be higher than its field elevation. On a day with higher pressure, it can be lower.

**LEARNER:**

Then temperature turns pressure altitude into density altitude.

**INSTRUCTOR:**

Yes. Correct pressure altitude for the difference between actual temperature and standard temperature. Warmer-than-standard air is less dense, so density altitude rises above pressure altitude. Colder-than-standard air is denser, so density altitude can fall below pressure altitude.

Figure 11-4 in the PHAK, linked in the show notes as “Density altitude chart and explanation,” makes that relationship visible. You enter with outside air temperature, move to the pressure-altitude line, and read density altitude. A flight computer can perform the same basic calculation from pressure altitude and outside air temperature.

[Source: sources.yaml#phak-density-altitude-performance]
[Claim type: FAA guidance]

The practical habit is to preserve the inputs. Record the altimeter setting used to determine pressure altitude, the expected outside air temperature, and the time those values represent. A density-altitude result without traceable inputs can look precise while answering the wrong part of the day.

## [11:15] Temperature and moisture change density

**ANNOUNCER:**

Temperature and moisture change density.

**INSTRUCTOR:**

High elevation often brings thinner air because atmospheric pressure generally decreases with altitude. Lower-than-standard pressure also raises pressure altitude. Higher temperature spreads the air molecules farther apart and raises density altitude. Chapter 11 summarizes the high-density-altitude combination as high elevation, low atmospheric pressure, high temperature, high humidity, or some combination of those factors.

[Source: sources.yaml#phak-density-altitude-performance]
[Claim type: FAA guidance]

**LEARNER:**

Humidity is in that list, but the basic density-altitude calculation usually asks me only for pressure altitude and temperature. Am I leaving something out?

**INSTRUCTOR:**

You are following the basic method in the PHAK. Water vapor is lighter than the dry-air mixture it replaces, so increasing moisture makes the air less dense and can reduce performance. The humidity section also says humidity alone is usually not treated as an essential factor in calculating density altitude, although it contributes and high humidity can decrease overall performance.

[Source: sources.yaml#phak-humidity-density]
[Claim type: FAA guidance]

Do not invent a humidity correction that the airplane's data does not provide. Recognize moisture as one more reason the atmosphere may be less favorable than a simple dry-air model suggests. Then use the POH or AFM method and the instructions that accompany that airplane's performance data.

**LEARNER:**

Can I put pressure, temperature, and humidity into one mental picture?

**INSTRUCTOR:**

Yes. Pressure establishes pressure altitude. Temperature changes density at that pressure altitude and supplies the basic density-altitude correction. Humidity can reduce density and performance further even though the basic calculation usually has no humidity entry. All three affect the air the airplane experiences, but enter only the inputs and corrections specified by the airplane's performance method.

A lower-elevation airport can therefore have meaningfully high density altitude on a hot day or with low pressure. A mountain airport can have high density altitude even when the temperature does not feel extreme. Use the actual inputs instead of deciding from elevation or comfort alone.

## [13:25] Why thinner air changes takeoff and climb

**ANNOUNCER:**

Why thinner air changes takeoff and climb.

**INSTRUCTOR:**

The PHAK identifies three direct effects as air becomes less dense. The engine takes in less air and produces less power. A propeller working in thin air produces less thrust. The wing also experiences less aerodynamic force at a given true speed and angle of attack.

[Source: sources.yaml#phak-data-basis-and-density-effects]
[Claim type: FAA guidance]

**LEARNER:**

Before we use true airspeed and groundspeed, how do they relate to the indicated airspeed I see in the airplane? And where does calibrated airspeed fit?

**INSTRUCTOR:**

Start with indicated airspeed. It is the direct reading on the airspeed indicator, before corrections for air density, installation error, or instrument error. Chapter 8 of the PHAK says the takeoff, landing, and stall speeds listed in the POH or AFM are normally indicated airspeeds. In the airplane, this is the familiar value used to fly the published speed when the document labels it that way.

[Source: sources.yaml#phak-indicated-airspeed]
[Claim type: FAA guidance]

Calibrated airspeed is indicated airspeed corrected for instrument and installation error. The correction can vary with speed and configuration, so the actual airplane's airspeed-calibration information provides it. True airspeed is calibrated airspeed corrected for altitude and nonstandard temperature. It describes speed through the surrounding air, and for the same calibrated airspeed it increases as air density decreases.

Groundspeed is the airplane's actual speed across the ground: true airspeed adjusted for wind. A headwind reduces it and a tailwind increases it. In performance planning, keep the jobs separate. Use indicated airspeed for published speeds and limitations stated as indicated. Use calibrated airspeed when the airplane's data or a calculation calls for the corrected value. Use true airspeed for performance and planning through the air, and groundspeed for time and distance across the surface. The POH or AFM chart still decides which value and correction the calculation requires.

[Source: sources.yaml#phak-airspeed-cas-tas-groundspeed]
[Claim type: FAA guidance]

Picture the airplane at the start of the takeoff roll. In thinner air, its engine produces less power and its propeller produces less thrust, so acceleration is weaker. The wing still has to reach the aerodynamic condition needed for liftoff. That condition now occurs at a higher true airspeed and, with the same wind, a higher groundspeed. More runway is needed to reach liftoff, and less excess thrust or power remains for climb.

The takeoff-performance section describes the runway effect as greater true takeoff speed combined with decreased thrust and net accelerating force. The distance change is not a universal percentage. It comes from the intended airplane's takeoff-distance and climb data for the applicable weight, configuration, pressure altitude, temperature, wind, and runway.

[Source: sources.yaml#phak-takeoff-density-inputs]
[Claim type: FAA guidance]

**LEARNER:**

The indicated airspeed can still look familiar while the airplane covers more ground each second.

**INSTRUCTOR:**

Yes. For a given aerodynamic condition, the indicated value can remain similar while true airspeed and groundspeed are higher in less-dense air. That is one reason runway perspective can be misleading. The airplane may reach the expected indicated lift-off speed, yet it used more runway to get there and is moving faster across the ground.

After liftoff, climb depends on thrust or power left over after meeting the demands of flight. The climb-performance discussion in Chapter 11 of the PHAK calls these excess thrust and excess power. Higher altitude reduces the power available from a normally aspirated engine. Additional weight increases the power required. Configuration changes such as extended gear or flaps can add drag. Those changes reduce the excess available for climb.

[Source: sources.yaml#phak-climb-performance-factors]
[Claim type: FAA guidance]

The Airplane Flying Handbook connects that knowledge to the flight. Before going to the airplane, check the POH or AFM charts, predict takeoff and climb performance for the conditions and location, and decide whether the airplane is capable. Its summary is direct: high density altitude reduces engine and propeller performance, increases takeoff roll, and decreases climb performance.

[Source: sources.yaml#afh-prior-to-takeoff-performance]
[Claim type: FAA guidance]

Thinner air can lengthen the takeoff roll, raise liftoff groundspeed, and reduce climb capability while weight and configuration add demand. Calculate with the actual airplane's data before the takeoff roll, while you can still change the load, time, runway, or airport.

## [16:30] Read the chart before reading the number

**ANNOUNCER:**

Read the chart before reading the number.

**INSTRUCTOR:**

A performance chart produces a disciplined estimate tied to stated conditions. Its number has meaning only when you know what the chart predicts and the basis for the prediction. Begin at the chart's edges before tracing lines or selecting a row.

First, read the title. Is this takeoff ground roll, total distance over an obstacle, maximum rate of climb, time and fuel to climb, cruise performance, or landing distance? Similar-looking charts answer different questions.

Second, read the conditions. The PHAK's sample “Conditions notes chart,” linked in the show notes, illustrates the point. It names the weight, flap position, gear position, power setting, cooling configuration, temperature basis, and other assumptions that define the table. Your airplane's chart will have its own list.

Third, read every note. A note may specify a correction for temperature, wind, surface, or configuration. It may say how to handle a value between printed rows. It may restrict the range in which the chart applies. Skipping the note can change the meaning of the final number.

[Source: sources.yaml#phak-performance-chart-boundaries]
[Claim type: FAA guidance]

Fourth, identify every input and its units. Pressure altitude is not density altitude. Pounds are not kilograms. Knots are not miles per hour. A runway wind component is not always the same as the full reported wind. Ground roll is not total distance over an obstacle.

Fifth, follow the manufacturer's instructions in the stated order and preserve intermediate values. On a combined graph, a small early reading error can become a large error by the last scale. On a table, entering the wrong weight row can send every later correction in the wrong direction.

**LEARNER:**

What if my temperature or altitude falls between the printed values?

**INSTRUCTOR:**

Use the method the chart specifies. The interpolation section defines interpolation as using known values to estimate an intermediate value. Its sample takes values on either side of the desired pressure altitude and finds the value between them. The PHAK also notes that pilots sometimes use a slightly more adverse printed value to obtain a conservative estimate. Stay within the chart's published range and follow the manufacturer's directions for values between entries.

[Source: sources.yaml#phak-interpolation-takeoff-charts]
[Claim type: FAA guidance]

Finally, make the result easy to audit. Write down the chart name, revision or page, inputs, corrections, and final output. If an electronic tool supplies the answer, confirm its airplane profile and inputs, then compare the displayed result with the POH or AFM method until you understand what the tool has done.

## [20:10] Build the takeoff picture

**ANNOUNCER:**

Build the takeoff picture.

**INSTRUCTOR:**

Begin with the runway question. What is the takeoff distance available on the intended runway? Is there an obstacle or departure path that makes the total distance to clear an obstacle the relevant output? What are the surface and slope? What wind component is expected along that runway? Then open the actual airplane's takeoff-distance chart or table and confirm that it answers that question.

Section 91.103 requires runway lengths and applicable takeoff and landing performance information before flight. Use the data path you identified from the airplane's POH, AFM, and documentation: the applicable approved flight-manual data when required, or other reliable information appropriate to the airplane when that is the rule's path. In either case, use the airplane-specific takeoff chart or table and the inputs it requires.

[Source: sources.yaml#cfr-preflight-performance]
[Source: sources.yaml#phak-takeoff-density-inputs]
[Claim type: Regulation and FAA guidance]

Next, determine the expected takeoff weight from the loading plan. Weight matters in several ways. Chapter 11 explains that higher weight requires a higher lift-off speed, adds mass that must be accelerated, and increases retarding forces such as drag and ground friction. A legal weight does not tell you that the runway or climb margin is adequate. Weight remains a performance input inside the POH or AFM loading limits.

[Source: sources.yaml#phak-takeoff-weight-wind]
[Claim type: FAA guidance]

Then use the expected departure altimeter setting and airport elevation to determine the pressure-altitude input that the takeoff-distance chart requires, and record the expected temperature. If that chart requests density altitude directly, calculate it with the method the airplane's performance information specifies. Use the expected conditions for takeoff time, not a convenient observation from hours earlier. Enter the wind in the form the takeoff chart specifies. A headwind allows the airplane to reach the required airspeed at a lower groundspeed. A tailwind requires a higher groundspeed. Because chart corrections differ, apply only the wind adjustment given by the actual airplane's data.

[Source: sources.yaml#phak-takeoff-weight-wind]
[Claim type: FAA guidance]

**LEARNER:**

What is the difference between ground roll and total distance over a 50-foot obstacle?

**INSTRUCTOR:**

Ground roll is the distance traveled on the runway before liftoff under the takeoff chart's conditions. Total distance over a 50-foot obstacle includes the ground roll and the airborne distance needed to reach that height under the chart's stated method. The PHAK's sample takeoff tables present them as separate outputs. Compare the output that answers your actual planning question, and do not substitute the smaller ground-roll number when obstacle clearance is the concern.

[Source: sources.yaml#phak-interpolation-takeoff-charts]
[Claim type: FAA guidance]

Now compare the takeoff chart's assumptions with the runway. The handbook notes that many charts assume a paved, level, smooth, dry surface. Grass, soft ground, standing water, snow, or other contamination can reduce acceleration or change braking. An upsloping runway impedes takeoff acceleration; a downsloping runway aids it. Use only corrections supported by the airplane's performance information, and treat an unaddressed adverse condition as uncertainty rather than silently calling it equivalent to the test condition.

[Source: sources.yaml#phak-runway-surface-gradient]
[Source: sources.yaml#phak-runway-gradient-effects]
[Claim type: FAA guidance]

**LEARNER:**

If the computed total distance is shorter than the runway, is the takeoff plan complete?

**INSTRUCTOR:**

It is not complete until you examine the difference between the calculated requirement and the distance available, the reliability of the inputs, the chart's test basis, the obstacle environment, and the climb after liftoff. A plan with only a small numerical difference can lose that difference through warmer temperature, more weight, less headwind, a softer surface, imperfect technique, or an airplane that does not match the chart's tested condition.

The planning response is made before takeoff. Recalculate with plausible less-favorable inputs. If the result is not comfortably inside the margin you have chosen with your instructor or operating practice, reduce the demand. That might mean less weight, a cooler time of day, a longer runway, a different airport, or waiting for better conditions. The correct option depends on the whole flight, including fuel and loading requirements.

## [24:30] Climb is distance and time

**ANNOUNCER:**

Climb is distance and time.

**INSTRUCTOR:**

Takeoff distance answers how the airplane reaches liftoff and an initial height. Climb performance answers what happens after that. Two measures are especially important, and their names describe different comparisons.

Angle of climb compares altitude gained with the distance traveled across the ground. Rate of climb compares altitude gained with time. The first describes the flight-path relationship; the second describes how quickly altitude increases.

[Source: sources.yaml#phak-climb-angle-rate]
[Claim type: FAA guidance]

**LEARNER:**

That is why best angle and best rate are not interchangeable.

**INSTRUCTOR:**

Correct. The POH or AFM supplies the airplane-specific speeds, configurations, and procedures, and those values can change with altitude or other conditions. This lesson is about choosing the right performance question before reaching for a speed.

The atmosphere, weight, and configuration affect both angle and rate. The climb-performance discussion explains that increased weight requires a higher angle of attack to produce the additional lift, which raises drag and power required. Increased altitude reduces power available from a normally aspirated engine. Extending gear or flaps can add drag. Each change reduces the excess thrust or power that supports climb.

[Source: sources.yaml#phak-climb-performance-factors]
[Claim type: FAA guidance]

Build the climb estimate from the takeoff condition. Open the actual airplane's climb-performance chart or table and use the actual takeoff weight, the pressure-altitude or density-altitude input it requires, expected temperature, and specified configuration. If terrain or an obstacle drives the question, determine whether that climb data actually answers the horizontal-distance problem. The AIM makes the distance-rate relationship explicit in its obstacle-climb guidance: climb gradient is expressed in feet per nautical mile, and converting that requirement to a climb rate in feet per minute is based on groundspeed. A rate-of-climb number by itself therefore does not answer the ground-distance question. The PHAK defines groundspeed as true airspeed adjusted for wind, decreasing with a headwind and increasing with a tailwind. Use the corresponding expected groundspeed when relating the airplane's climb result to terrain or obstacles.

[Source: sources.yaml#aim-climb-gradient-groundspeed]
[Source: sources.yaml#phak-airspeed-cas-tas-groundspeed]
[Claim type: FAA guidance]

**LEARNER:**

So a good takeoff-distance result can still lead to an unacceptable plan if climb performance is weak.

**INSTRUCTOR:**

Yes. Takeoff distance and climb performance are connected but separate planning questions. The airplane may become airborne within the pavement and still have little climb margin for terrain, obstacles, rising ground, or a high cruise altitude. Complete both questions while the choices are still available on the ground.

## [27:45] Plan cruise and the climb to it

**ANNOUNCER:**

Plan cruise and the climb to it.

**INSTRUCTOR:**

Performance planning continues after obstacle clearance. The PHAK describes fuel, time, and distance-to-climb charts that estimate three outputs: how much fuel the climb uses, how long the climb takes, and how much ground distance it covers. Those outputs connect the climb calculation to the navigation and fuel plan.

[Source: sources.yaml#phak-climb-cruise-charts]
[Claim type: FAA guidance]

**LEARNER:**

Why does distance to climb matter if I already know the route distance?

**INSTRUCTOR:**

Because the airplane is traveling across the ground while it climbs. The point where it reaches cruise altitude affects the route timeline, fuel use, terrain picture, and when the planned cruise performance begins. If the climb is longer than expected, the airplane spends more time at climb power and may cover a different distance and use more fuel than expected before settling into cruise.

Use the chart exactly as its notes direct. Some charts report cumulative values from sea level, requiring subtraction between the departure and cruise-altitude values. Some apply temperature corrections. Some report fuel in pounds rather than gallons. The sample method does not transfer automatically; read the actual chart's instructions and units.

Cruise tables then connect altitude, power setting, temperature, true airspeed, and fuel flow under stated conditions. Range is distance available from fuel; endurance is time available from fuel. They are related, but they answer different questions. The airplane's POH or AFM provides the values and mixture or power-setting basis for its cruise data.

[Source: sources.yaml#phak-range-endurance]
[Source: sources.yaml#phak-cruise-performance-table]
[Claim type: FAA guidance]

The useful planning habit is continuity within the flight. Takeoff weight feeds the climb calculation. Climb fuel changes the weight and fuel remaining at cruise. Cruise time and fuel use change expected arrival weight. That arrival weight then becomes an input to the landing calculation.

[Source: sources.yaml#phak-climb-cruise-charts]
[Source: sources.yaml#phak-landing-charts]
[Claim type: FAA guidance]

If the itinerary includes another departure after landing, its section 91.103 preflight information must concern that later flight. Begin its performance plan again with the applicable loading, weather, runway, and airplane information.

[Source: sources.yaml#cfr-preflight-performance]
[Claim type: Regulation]

## [30:20] Plan landing as its own operation

**ANNOUNCER:**

Plan landing as its own operation.

**INSTRUCTOR:**

Landing planning begins with the intended runway and the airplane's landing-distance data. Determine the landing distance available, surface, slope, expected wind component, and whether the needed output begins over a 50-foot obstacle or at touchdown. Then read the landing chart's configuration, technique, conditions, corrections, and outputs.

The Airplane Flying Handbook supplies the flight-context boundary. Its landing chapter says the manufacturer's configuration, airspeeds, and other landing information are in the airplane's AFM or POH and take precedence over the handbook's general discussion. The conditions and technique printed with the airplane's landing data therefore control this estimate.

[Source: sources.yaml#afh-landing-airplane-information]
[Claim type: FAA guidance]

Now determine landing weight. Chapter 11 says to account for fuel used instead of carrying takeoff weight into the landing calculation. If passengers, baggage, or fuel change between legs, use the loading plan for that landing.

[Source: sources.yaml#phak-landing-charts]
[Claim type: FAA guidance]

Use the expected destination altimeter setting and airport elevation to determine the pressure-altitude input the landing chart requires. Enter the expected temperature, landing weight, wind component, slope, surface, and configuration in the form that chart specifies.

[Source: sources.yaml#phak-landing-performance-inputs]
[Claim type: FAA guidance]

Higher density altitude can increase landing distance even when the prescribed indicated landing speed is unchanged. In less-dense air, the same indicated speed corresponds to a higher true airspeed. With the same wind, that means higher groundspeed and more energy to dissipate after touchdown. Include that effect in the estimate for the expected arrival.

[Source: sources.yaml#phak-landing-performance-inputs]
[Claim type: FAA guidance]

**LEARNER:**

Landing charts also separate ground roll from distance over a 50-foot obstacle, right?

**INSTRUCTOR:**

Yes. On the actual airplane's landing-distance chart, the total-distance figure includes the airborne path from the stated obstacle height and the ground roll under the chart's assumptions. The ground-roll figure begins at touchdown. Select the output that matches the landing runway and obstacle question.

[Source: sources.yaml#phak-landing-charts]
[Claim type: FAA guidance and teaching explanation]

Surface and slope affect landing roll directly. An upslope can shorten it; a downslope can lengthen it. Water, snow, ice, soft ground, or poor braking can make a dry, hard, paved-runway assumption a poor match. Apply only the corrections in the airplane's landing data, not a correction from a takeoff chart or handbook example.

[Source: sources.yaml#phak-runway-surface-gradient]
[Source: sources.yaml#phak-runway-gradient-effects]
[Claim type: FAA guidance]

Use the expected arrival wind for the intended landing runway. Apply the landing chart's correction; do not assume headwind credit and tailwind penalty are mirror images or treat a forecast headwind as guaranteed margin.

Finally, compare the estimate with landing distance available and the chosen margin. Test warmer arrival, shifting wind, a wet runway, or differences from the chart's airplane and technique conditions. If the plan needs every favorable input, identify a longer runway, different time, or another airport before the choices narrow.

[Source: sources.yaml#phak-performance-chart-boundaries]
[Claim type: FAA guidance]

## [34:15] Calculated performance is a disciplined estimate

**ANNOUNCER:**

Calculated performance is a disciplined estimate.

**INSTRUCTOR:**

Chapter 11 of the PHAK explains where performance charts come from. Manufacturers gather data during flight tests and publish charts based on the observed airplane behavior. Each takeoff, climb, cruise, or landing chart is tied to conditions such as aircraft weight and configuration, engine and airplane condition, atmospheric assumptions, and the technique described for that test or chart.

[Source: sources.yaml#phak-performance-chart-boundaries]
[Claim type: FAA guidance]

The calculation is a disciplined estimate, not a guarantee. You make the estimate as strong as the available airplane data and flight-specific inputs allow. If the airplane is not in comparable working condition, the runway is not like the assumed surface, the atmosphere is less favorable, or the pilot does not reproduce the specified technique, actual performance can differ. Reading a combined graph imprecisely can create another difference before the airplane moves.

[Source: sources.yaml#phak-performance-chart-boundaries]
[Claim type: FAA guidance]

That is exactly why ACS Task PA.I.F includes risk management for possible differences between calculated and actual performance. The goal is not distrust of the chart. The goal is to produce the best estimate the data support, then assess honestly how closely the planned operation matches the chart's stated conditions and technique.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Claim type: FAA regulatory standard]

**LEARNER:**

How do I turn that uncertainty into a decision without making up a universal correction?

**INSTRUCTOR:**

Choose a deliberate planning margin with your instructor, school, operator, or personal-minimum process. Treat it as your planning standard, not as a number the manufacturer guarantees. Then run sensitivity checks. Recalculate with a plausible warmer temperature, higher weight, a smaller headwind—or a tailwind—and the runway condition you may actually encounter. Check both takeoff and landing, and check climb where terrain or obstacles matter.

If a small change removes the margin, the plan is fragile. Change something that reduces the performance demand while you still can. Carry fewer passengers or less baggage while keeping the fuel required for the plan, depart during cooler conditions, select a longer or more favorable runway, choose another airport, or delay the flight. The appropriate choice comes from the actual airplane, route, weather, and operational constraints.

During flight instruction, practice comparing the expected takeoff acceleration and climb performance with what the airplane actually produces while following the POH or AFM and your instructor's procedures. That connects the preflight numbers with what you will recognize in the airplane without inventing a generic abort point or aircraft-specific technique here.

## [37:05] A repeatable planning flow

**ANNOUNCER:**

A repeatable planning flow.

**INSTRUCTOR:**

Here is the complete sequence.

First, identify the intended airplane and its current POH or AFM performance information. Confirm the model, configuration, chart title, revision or page, conditions, notes, and units.

[Source: sources.yaml#phak-performance-data-introduction]
[Source: sources.yaml#afh-prior-to-takeoff-performance]
[Source: sources.yaml#afh-landing-airplane-information]
[Source: sources.yaml#phak-performance-chart-boundaries]
[Claim type: FAA guidance]

Second, build the inputs for the flight being planned. Use takeoff and landing weights from its loading plan. Record the expected departure and arrival altimeter settings, determine the pressure-altitude inputs the takeoff and landing charts require, and record the corresponding temperatures. Determine the intended runway lengths, wind components, surface, slope, and relevant obstacle or terrain question. Include the airplane configuration and technique specified by each chart. If another flight follows after landing, repeat this preflight work with the information for that later flight.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Source: sources.yaml#phak-takeoff-density-inputs]
[Source: sources.yaml#phak-landing-performance-inputs]
[Source: sources.yaml#cfr-preflight-performance]
[Claim type: FAA regulatory standard, FAA guidance, and regulation]

Third, calculate the specific performance needed for the flight. Determine takeoff ground roll or total obstacle-clearance distance, whichever answers the runway question. Determine the climb angle or rate needed for the terrain and timing question, and include time, fuel, and distance to climb when the cross-country plan needs them. Determine landing ground roll or total obstacle-clearance distance from expected landing weight and arrival conditions.

Fourth, compare the outputs with what is available. Check runway and obstacle fit, climb needs, fuel and route continuity, airplane limitations, and the margin selected for the operation.

Fifth, stress the plan with plausible less-favorable inputs. If the margin disappears, choose a lower-demand combination before departure. Do not wait for the takeoff roll or the approach to discover that the plan required perfect conditions.

Sixth, update the calculation when the inputs change. A later departure, a different runway, more baggage, a fuel change, warmer arrival, or a wind shift can make the earlier result stale. A saved screenshot is useful only if its airplane profile and inputs still match the flight.

**LEARNER:**

That sounds less like one calculation and more like a chain of evidence.

**INSTRUCTOR:**

It is. The airplane document tells you what the performance model expects. Weather, loading, and airport information supply the inputs. The calculation supplies a disciplined estimate for stated conditions and technique, not a guarantee. The comparison and sensitivity check turn that estimate into a decision.

## [40:10] Retrieval review

**ANNOUNCER:**

Retrieval review.

**INSTRUCTOR:**

Density altitude is pressure altitude corrected for nonstandard temperature. A high density-altitude value means thin air and reduced performance. High elevation, low pressure, high temperature, and high humidity can contribute, but use the actual POH or AFM method instead of relying on a slogan.

Thin air can reduce engine power, propeller thrust, and wing lift. For takeoff, that can mean a higher true speed and groundspeed for liftoff along with weaker acceleration. For climb, reduced excess thrust or power means less angle or rate. Weight and configuration can reduce the remaining margin further.

Read each actual-airplane performance chart from the outside inward: title, conditions, notes, inputs, units, and only then the output. Keep takeoff ground roll separate from total distance over an obstacle. Keep climb angle separate from climb rate. Plan landing as its own operation with its landing-distance chart, arrival weather, and landing weight.

A chart calculation is a disciplined estimate tied to stated conditions and technique, not a guarantee. Compare it with the runway, obstacle, climb, and fuel questions for the flight. Test plausible less-favorable inputs. When margin is inadequate or fragile, choose a lower-demand plan early.

**LEARNER:**

And the ACS answer is the full connection: appropriate airplane data, correct atmospheric and runway inputs, careful chart use, and a decision that accounts for the difference between calculated and actual performance.

**INSTRUCTOR:**

Yes. Practice that chain with the POH or AFM for the airplane you train in. Explain each input, show where the chart uses it, identify the output, and say what change would make you choose a different plan.

## [42:00] Outro

**ANNOUNCER:**

Thanks for listening to PPL Study Podcast. For show notes, source links, and more study material, visit pplstudyguide.com. Send feedback or source corrections to feedback@pplstudyguide.com. The episodes and the research behind them are available for review as an open-source work on GitHub. Until next time, study the sources and keep learning.
