# Weight, Balance, and Center of Gravity

**Version:** 0.1.0 — initial source-led draft
**Target runtime:** approximately 42 minutes
**Speakers:** Instructor, Learner, Announcer
**Production status:** First-review draft; not flight instruction and not cleared for public release.

## [00:00] Opening

**INSTRUCTOR:**

Four people arrive for a flight with their bags, and the fuel tanks are full. Every item fits inside the airplane. That does not tell you whether the airplane can safely carry the load. Before departure, you must answer how heavy the airplane will be, where that weight will balance, and how the loading will affect the rest of the flight plan.

## [00:35] Disclaimer

**INSTRUCTOR:**

This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor. This podcast is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.

## [01:05] Podcast introduction

**ANNOUNCER:**

Welcome to PPL Study Podcast, a study companion for U.S. private-pilot airplane learners, grounded in FAA handbooks and standards. Come along as we talk through the Pilot’s Handbook of Aeronautical Knowledge and the Airman Certification Standards.

In this episode, we will connect the people, bags, fuel, and aircraft data in a loading plan to total weight, center of gravity, and performance.

## [01:30] What the ACS is asking you to connect

**ANNOUNCER:**

What the ACS is asking you to connect.

**INSTRUCTOR:**

The Private Pilot for Airplane Category Airman Certification Standards places weight and balance in Task PA.I.F, Performance and Limitations. Its knowledge elements ask you to use charts, tables, and data, and to understand factors that affect performance. Those factors include airplane loading, center of gravity, weight and balance, airplane configuration, atmospheric conditions, pilot technique, and the airport environment.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Claim type: FAA regulatory standard]

That structure matters. Weight and balance is not an isolated arithmetic exercise. The calculated loading becomes an input to the airplane's takeoff, climb, cruise, and landing performance decisions. The task's risk-management elements also ask you to consider airplane limitations, the proper use of performance data, and differences between calculated and actual performance.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Claim type: FAA regulatory standard]

The skill element is even more direct. You must compute weight and balance, correct an out-of-center-of-gravity loading error, and determine whether weight and balance remain within limits during all phases of flight. You must also use the appropriate airplane performance charts, tables, and data.

[Source: sources.yaml#acs-performance-skills]
[Claim type: FAA regulatory standard]

**LEARNER:**

So a correct answer is more than getting one number that falls below maximum weight.

**INSTRUCTOR:**

Yes. You need a valid starting point for the actual airplane, a complete list of what will be aboard, and a method that matches its POH, AFM, and current weight-and-balance data. Then you answer two separate limit questions: total weight and center of gravity. You check how fuel use can change those answers across the flight, correct any unacceptable loading, and carry the revised weight into the performance plan.

This lesson will build that reasoning. It will not give you loading distances, limits, or fuel assumptions to reuse in another airplane. An arm is the distance used to locate a load from the airplane's reference datum. A moment combines that distance with weight to describe the load's turning effect. A CG envelope is the chart boundary used to check the final combination of weight and balance. We will explain all three in more depth in the next sections. Their values belong to the specific airplane and its current loading data.

[Source: sources.yaml#phak-terms-and-principles]
[Source: sources.yaml#phak-loading-graph-envelope]
[Claim type: FAA guidance and teaching explanation]

## [04:00] Two questions, not one

**ANNOUNCER:**

Two questions, not one.

**INSTRUCTOR:**

The first question is total weight: how much does the airplane and everything aboard weigh at the phase of flight you are checking? The second is balance: where is that combined weight centered along the airplane's longitudinal axis? That location is the center of gravity, usually shortened to CG.

PHAK Chapter 10 describes CG as the point where the aircraft would balance if it could be suspended there. The point changes when the distribution of weight changes. Two loading plans can have the same total weight but different CG locations because the occupants, bags, or fuel are placed at different distances along the airplane.

[Source: sources.yaml#phak-weight-effects-and-cg]
[Claim type: FAA guidance]

**LEARNER:**

If the total is below maximum weight, can the balance still be unacceptable?

**INSTRUCTOR:**

It can. An airplane may be under its maximum weight but have its CG outside the range shown in its loading data. The reverse is also possible: the distribution may put CG inside the range while total weight exceeds a limit. Chapter 10 warns that some airplanes are difficult to load out of CG limits but can still be overweight, while others can be within useful load and still outside the CG range.

[Source: sources.yaml#phak-computational-method]
[Claim type: FAA guidance]

Maximum weight and CG limits protect different parts of the operating margin. Weight affects structural load and the performance the wing and powerplant must produce. CG affects stability, control forces, and the control authority available to manage the airplane. Chapter 10 states the distinction plainly: operating above maximum weight compromises structural integrity and performance, while operating outside the airplane's CG limits creates control difficulty.

[Source: sources.yaml#phak-weight-balance-introduction]
[Claim type: FAA guidance]

The practical result is two comparisons. Compare the loaded weight with the weight limit for that phase of flight. Then compare the loaded CG, or the equivalent weight-and-moment point used by the airplane's calculation method, with the CG envelope in its loading data. Passing one comparison does not excuse failing the other.

## [06:55] Build the lever mental model

**ANNOUNCER:**

Build the lever mental model.

**INSTRUCTOR:**

Picture a straight board balanced on a support like a seesaw that you may have played on when you were younger. The support in the middle is the fulcrum, the point the board turns around. Put a weight close to the fulcrum. It presses down, but its short distance from the support creates only a small turning effect. Move the same weight farther toward the end of the board. Now the longer distance creates a much larger turning effect, and the other side needs more weight or more distance to balance it. The weight did not change. Its leverage changed because its distance from the fulcrum changed.

An airplane weight-and-balance calculation uses the same idea, with a reference selected by the manufacturer. That reference is the datum. It is an imaginary vertical plane or line from which distances are measured. The datum is fixed for that aircraft design. It is not the current CG and it does not move when you change the loading.

The distance from the datum to an item is the item's arm. Depending on where the manufacturer placed the datum, an arm may be positive or negative. The loading data for the airplane give the correct arm or provide a graph or table that incorporates it. Do not invent an arm from a cabin measurement.

Multiply an item's weight by its arm and the result is its moment. Moment represents the item's turning influence about the datum. A larger weight creates more moment at the same arm. The same weight creates more moment when placed at a more distant arm.

[Source: sources.yaml#phak-terms-and-principles]
[Claim type: FAA guidance]

PHAK Figures 10-2 through 10-4 provide a useful visual. Figure 10-2 lays out the datum, positive and negative arms, the CG, and the CG range. Figures 10-3 and 10-4 use a board to show that different combinations of weight and distance can produce the same moment. Those figures are linked in the show notes.

[Source: sources.yaml#phak-moment-mental-model]
[Claim type: FAA guidance]

**LEARNER:**

Is that why a relatively small bag in a far-aft compartment can matter so much?

**INSTRUCTOR:**

Exactly. Its weight contributes to the total once, just like every other item. Its aft location can make its contribution to total moment comparatively large. That is why baggage-area weight limits and the overall CG calculation answer different questions. The compartment limit tells you how much that location may carry. The total calculation tells you what the entire loading does to aircraft weight and balance.

There is one more relationship. After you add all item moments, the airplane's loaded CG can be found by dividing total moment by total weight when that is the calculation method for the airplane. The units tell the story: inch-pounds divided by pounds leaves inches from the datum.

You do not need to picture the entire airplane balancing on a point while you fill out every line. The lever model has one job: it explains why weight and location must travel together through the calculation.

## [10:20] Start with the airplane that actually exists

**ANNOUNCER:**

Start with the airplane that actually exists.

**INSTRUCTOR:**

Before adding people, bags, and fuel, establish the airplane's starting condition. Use the current weight-and-balance information for that airplane, identified by registration and serial number as appropriate. Depending on how its loading data are organized, the starting information may give basic empty weight and moment, basic empty weight and CG, or another equivalent set of values.

Basic empty weight represents the airplane and the installed items included by its definition. Useful load is the difference between basic empty weight and maximum allowable gross weight for a general aviation aircraft. It includes the load available for the pilot, passengers, baggage, usable fuel, and applicable drainable oil. Useful load is a planning capacity, not proof that every combination of those items will meet the CG envelope or individual loading limits.

[Source: sources.yaml#phak-terms-and-principles]
[Claim type: FAA guidance]

The starting record must match the current configuration. Installing or removing equipment, or completing a repair or modification, can change empty weight and balance. Chapter 10 explains that these changes must be accounted for in the weight-and-balance records and equipment list as appropriate. Without current information, the pilot has no sound foundation for the loading calculation.

[Source: sources.yaml#phak-weight-effects-and-cg]
[Source: sources.yaml#phak-weight-balance-management]
[Claim type: FAA guidance]

**LEARNER:**

What if the POH contains a sample problem for the same model?

**INSTRUCTOR:**

Use the sample to learn the method, not as the starting data for your airplane. Chapter 10 cautions that empty weight and loading conditions for a particular aircraft can differ from the sample because of equipment changes or modifications. Match the POH or AFM revision, applicable supplements, and the airplane's current weight-and-balance record before you rely on the numbers.

[Source: sources.yaml#phak-moment-mental-model]
[Claim type: FAA guidance]

For the operational decision, use the actual airplane's current loading limits and calculation method from its POH, AFM, and weight-and-balance record. A generic worksheet or application is useful only when it correctly represents those current data. Section 91.9 supports that boundary: it requires compliance with the operating limitations specified in the approved flight manual, markings, and placards, or otherwise prescribed by the certificating authority. It also requires the applicable current approved manual or manual material to be available in the aircraft.

[Source: sources.yaml#cfr-91-9-operating-limitations]
[Claim type: Regulation]

Once the starting data are established, gather actual loading inputs. Account for each occupant, baggage in each area, cargo, and usable fuel. Include or exclude oil exactly as the airplane's loading data direct. Observe the seat, baggage-area, floor-loading, ramp, takeoff, landing, and category limits named for that airplane. Its calculation method tells you which entries and comparisons are required.

## [14:10] Turn the loading into a calculation

**ANNOUNCER:**

Turn the loading into a calculation.

**INSTRUCTOR:**

The computational method follows a consistent chain. Begin with the airplane's current empty-weight line. Add a line for each loaded item the worksheet for that airplane requires: front-seat occupants, rear-seat occupants, fuel, and each baggage or cargo area. Work down the rows one at a time. Record each weight. Beside it, either multiply weight by the arm from the airplane's loading data or read the moment from the table or graph that accompanies the worksheet.

After every item has a weight and a moment, add the weights. That total answers the first question: how heavy is the loaded airplane? Next, add the moments. That total combines the turning effect of the empty airplane and every item aboard. The two totals are separate because equal total weights can still produce different balance points.

Some worksheets divide every moment by the same fixed number and call the result a moment index. The index is shorthand that keeps long moment values manageable. It does not change the leverage or balance. Keep the scale shown on the worksheet consistent from the individual rows through the final comparison, and do not treat an indexed moment as though it were the full inch-pound value.

For a direct computational method that uses full moments, divide total moment by total weight to obtain loaded CG. If the airplane's worksheet uses a moment index, follow its stated scale or compare the indexed total directly with the matching envelope or table. Compare total weight with the limit for the phase of flight being checked. Then compare loaded CG with the forward and aft boundaries at that weight. A CG boundary may change with weight, so read the envelope or table at the actual loaded weight instead of remembering one pair of numbers.

The show notes link labeled “PHAK Chapter 10 visual aid — Computational method and sample worksheet” opens the FAA example on page 10-7. Use it to follow the weight, arm, and moment columns while listening. The values are illustrative; the organization of the columns is the point.

[Source: sources.yaml#phak-computational-method]
[Claim type: FAA guidance]

**LEARNER:**

Can we walk through the reasoning without borrowing numbers from a particular airplane?

**INSTRUCTOR:**

Yes. Imagine a worksheet with current empty-aircraft weight and moment already entered. You add two occupants at the front-seat station, one occupant at a rear station, usable fuel at the fuel-tank station, and baggage at an aft station. Every row contributes weight. Every row also contributes moment according to its weight and location.

Suppose the total weight passes, but the loaded CG falls aft of the envelope. The arithmetic is not telling you that a subtraction was missed simply because the weight is legal. It may be accurately showing an unacceptable distribution. Look first for incorrect inputs, units, arms, moment-index scaling, or omitted items. If those inputs are correct, the loading itself must change.

Now suppose the CG point is inside the envelope but total weight is above the limit. Moving a bag forward can change moment and CG, but it does not reduce total weight. The correction must include removing weight or otherwise changing the plan within the options permitted by the airplane's POH, AFM, and loading limits.

That is why a reasonableness check follows the arithmetic. Ask whether the direction of the result makes sense. Compare the added item's station with the airplane's current CG. An item added aft of the current CG moves the CG aft. An item added forward of the current CG moves the CG forward. Moving an item forward should reduce total moment when the station convention uses increasing positive arms aft of the datum. A result that violates those relationships deserves an input and formula review before you trust it.

The handbook's sample numbers illustrate this chain, but the POH, AFM, and current weight-and-balance record for your airplane supply the usable calculation. The method is general. The values and limits are aircraft specific.

[Source: sources.yaml#phak-moment-mental-model]
[Source: sources.yaml#phak-computational-method]
[Source: sources.yaml#phak-addition-removal-fuel]
[Claim type: FAA guidance and teaching explanation]

## [18:05] The method may look different in your POH

**ANNOUNCER:**

The method may look different in your POH.

**INSTRUCTOR:**

The POH, AFM, or loading documents for a particular airplane may use a loading graph instead of asking you to multiply every weight by an arm. You enter an occupant, fuel, or baggage weight and read the corresponding moment or moment index. After obtaining each moment, you total the weights and moments, then plot the combined point on a CG moment envelope.

The point has two coordinates. One represents loaded weight. The other represents loaded moment or moment index. The point must fall inside the CG envelope for that airplane and weight. Being below the top edge does not help if the point lies beyond the aft boundary. Being between the forward and aft sides does not help if the weight is above the envelope.

PHAK Figures 10-7 and 10-8 show this two-step process: a loading graph for the individual moments, followed by a CG moment envelope for the combined result. Those figures are also linked in the show notes.

[Source: sources.yaml#phak-loading-graph-envelope]
[Claim type: FAA guidance and teaching explanation]

Other airplanes use tables. A table may give moment values for specified weights, or it may state the allowable moment range at each weight. Some electronic tools perform the same calculation and display an envelope. The interface changes, but the underlying questions remain: were the current empty-weight data, occupants, baggage, and fuel entered correctly; is the takeoff or landing weight below its limit; is the CG inside the envelope; and are the seat and baggage-area limits satisfied?

[Source: sources.yaml#phak-computational-method]
[Claim type: FAA guidance]

**LEARNER:**

If an app puts a green dot inside the envelope, is the job finished?

**INSTRUCTOR:**

No. Treat the green dot as an output that still needs traceable inputs. Confirm the app is configured for the correct airplane and current empty-weight data. Confirm units, occupants, baggage areas, fuel quantity, and fuel type assumptions. Check seat, baggage-area, ramp, takeoff, and landing limits that may not appear in the main envelope. Then consider the phases of flight and carry the applicable weight into the performance charts.

A tool can reduce arithmetic errors and make scenario changes quick. It can also repeat a wrong aircraft profile with great consistency. The pilot remains responsible for knowing what the tool calculated and which limits from the airplane's loading data were compared.

## [21:05] What forward and aft CG change

**ANNOUNCER:**

What forward and aft CG change.

**INSTRUCTOR:**

The CG range published for the airplane balances stability with controllability. A forward loading places the CG closer to the forward limit. PHAK explains that an excessively forward CG can create nose heaviness, higher control forces, and difficulty raising the nose. In an extreme case beyond the forward limit, the airplane may not have enough elevator or control authority to flare for landing.

[Source: sources.yaml#phak-adverse-balance-effects]
[Claim type: FAA guidance]

Do not turn that into a claim that every loading near the forward limit is unsafe. The published range is the allowable range for the stated weight and operation. The lesson is about what changes as CG moves within that range and why crossing the limit is unacceptable. At a more forward CG, the airplane has a stronger nose-down tendency, so the pilot can need greater control effort to raise the nose. The specific handling and performance information belongs to the airplane's POH or AFM and to flight instruction.

An aft loading places CG closer to the aft limit. As CG moves aft, longitudinal stability decreases. PHAK says the airplane has less tendency to right itself after maneuvering or turbulence. Beyond the aft limit, undesirable effects can include very light control forces, extreme control difficulty, violent stall characteristics, and reduced capability to recover from stalls and spins.

[Source: sources.yaml#phak-adverse-balance-effects]
[Claim type: FAA guidance]

**LEARNER:**

Why can lighter control forces be a problem? They sound easier to manage.

**INSTRUCTOR:**

Control force is part of the feedback that helps a pilot sense the demand being placed on the airplane. If the forces become unusually light, a small input can produce more response than expected, and it becomes easier to impose excessive loads inadvertently. Reduced stability also means the airplane provides less natural tendency to return toward its prior condition after a disturbance.

The practical planning habit is to treat the CG envelope in the airplane's loading data as a limit, not a target. Verify the actual point and leave room for reasonable uncertainty in weights and fuel. If a loading result sits very close to a boundary, improve the quality of the inputs and consider a loading arrangement with more margin. The loading data define the limit; conservative planning helps keep the real airplane on the intended side of that limit.

Seat assignments and baggage placement can be useful corrections because they change weight distribution. Fuel-tank location may also influence CG movement. The direction and size of each change must come from the airplane's data, not from a general belief that fuel or passengers always move CG one way.

[Source: sources.yaml#phak-adverse-balance-effects]
[Claim type: FAA guidance]

## [24:55] Weight is also a performance input

**ANNOUNCER:**

Weight is also a performance input.

**INSTRUCTOR:**

The wing must produce enough lift to support the airplane. Chapter 10 explains that available lift is limited by airfoil design, angle of attack, airspeed, and air density. Increasing loaded weight increases the lift required. That added demand affects the speed, distance, and climb capability needed for the flight.

[Source: sources.yaml#phak-weight-balance-introduction]
[Claim type: FAA guidance]

PHAK lists the consequences of excessive weight: higher takeoff speed, longer takeoff run, reduced rate and angle of climb, lower maximum altitude, shorter range, reduced cruising speed and maneuverability, higher stall speed, higher approach and landing speed, and longer landing roll. An actual performance calculation should use the performance charts and stated conditions in the specific airplane's POH or AFM rather than applying that list as a numeric rule.

[Source: sources.yaml#phak-weight-effects-and-cg]
[Claim type: FAA guidance]

**LEARNER:**

If the airplane is just below maximum weight, does that mean the runway and climb plan are acceptable?

**INSTRUCTOR:**

No. Maximum weight is a limitation, not a promise of adequate performance for every runway, temperature, elevation, wind, surface, obstacle, or aircraft condition. Chapter 10 directs pilots to check the performance charts and warns that excess weight becomes more hazardous when combined with other performance-reducing factors.

[Source: sources.yaml#phak-weight-effects-and-cg]
[Claim type: FAA guidance]

The ACS makes the same connection by placing loading, CG, weight and balance, atmospheric conditions, configuration, airport environment, and chart use in one performance task. It also asks the applicant to manage the possibility that actual performance will differ from calculated performance.

[Source: sources.yaml#acs-performance-knowledge-risk]
[Claim type: FAA regulatory standard]

After establishing a legal loading, carry the appropriate takeoff weight into the takeoff and climb planning. Carry the expected landing weight into the landing planning. Use the chart conditions, corrections, and notes that apply to the airplane. Then preserve operational margin for variables the calculation does not perfectly predict, including technique, aircraft condition, wind variation, and runway surface.

We will develop performance-chart technique and density-altitude decisions in Episode 10, *Aircraft Performance and Density Altitude*. For this lesson, the important connection is that a weight-and-balance result becomes an input to performance planning. It does not replace that planning.

## [28:15] Check the whole flight, not one snapshot

**ANNOUNCER:**

Check the whole flight, not one snapshot.

**INSTRUCTOR:**

The airplane may have different loaded conditions at ramp, takeoff, and landing. Fuel used for start, taxi, takeoff, climb, cruise, and descent is consumed by the airplane's engine over time. That reduces total weight at the fuel-tank station. The resulting CG change depends on where the tanks are located relative to the airplane's current CG.

The PHAK uses a sample table that separately tracks ramp weight, takeoff weight after taxi fuel, and landing weight after en route fuel. Its chapter summary says pilots must ensure that CG remains within the airplane's limits throughout all phases of flight.

[Source: sources.yaml#phak-flight-phase-and-shifting]
[Claim type: FAA guidance]

The ACS skill uses the same all-phases language. Computing a legal takeoff condition is incomplete if expected fuel burn moves the airplane outside its envelope later in flight.

[Source: sources.yaml#acs-performance-skills]
[Claim type: FAA regulatory standard]

**LEARNER:**

Does fuel burn always improve the loading because the airplane becomes lighter?

**INSTRUCTOR:**

It improves the total-weight side by removing fuel weight, but the balance side depends on tank arm. If the fuel is located near CG, the shift may be small. If it is located forward of the loaded CG, burning it tends to move CG aft. If it is aft of the loaded CG, burning it tends to move CG forward. Airplanes with multiple tanks may require a specified fuel-use sequence that changes the path again.

[Source: sources.yaml#phak-addition-removal-fuel]
[Claim type: FAA guidance and teaching explanation]

Use the fuel arms, fuel-system information, and operating instructions in the airplane's POH, AFM, and loading data. Check the phases that can be limiting. A full-fuel ramp condition may be the heaviest. A low-fuel landing condition may be lighter but closer to a forward or aft CG boundary. If the loading data state another limit tied to a named fuel or loading condition, check that limit only for the condition the document identifies.

Loading and fuel management are the principal variables the pilot controls that can change total weight and CG. When the fuel plan changes, recalculate the affected phases. When an extra passenger or bag appears, recalculate. When the destination, reserve, or alternate plan changes required fuel, recompute the loading and then rerun the performance and fuel planning that depend on it.

[Source: sources.yaml#phak-weight-balance-management]
[Source: sources.yaml#phak-addition-removal-fuel]
[Claim type: FAA guidance]

## [31:50] Correct the loading, then run the plan again

**ANNOUNCER:**

Correct the loading, then run the plan again.

**INSTRUCTOR:**

An out-of-limit result is a planning problem to solve before flight. First verify that the data and arithmetic are correct. Then change the loading using options permitted by the airplane's POH, AFM, and loading limits and acceptable for the trip. Possible changes include moving occupants to different seats, moving baggage between areas, reducing baggage or cargo, carrying fewer occupants, or changing fuel within the requirements of the flight plan, including carrying less fuel and planning a fuel stop.

Moving an item changes its arm and moment but not its weight. Chapter 10 explains that shifting weight aft increases total moment under the usual positive-aft convention, while shifting it forward decreases total moment. The new total moment divided by the unchanged total weight gives the new CG.

[Source: sources.yaml#phak-flight-phase-and-shifting]
[Claim type: FAA guidance]

Removing an item changes both weight and moment. Adding an item does the same. Recalculate rather than assuming the CG movement from weight alone. A heavy item removed from an aft station may move CG forward. The same weight removed from a forward station may move CG aft.

[Source: sources.yaml#phak-addition-removal-fuel]
[Claim type: FAA guidance and teaching explanation]

**LEARNER:**

Could I reduce fuel whenever the airplane is overweight?

**INSTRUCTOR:**

Only if the revised fuel quantity still supports the planned flight, applicable fuel requirements, reserves, and your risk margin. Chapter 10 notes the tradeoff directly: reducing fuel lowers airplane weight but also reduces range. A loading correction that creates an unacceptable fuel plan is not a completed solution.

[Source: sources.yaml#phak-weight-effects-and-cg]
[Claim type: FAA guidance]

Many airplanes cannot remain within their weight and balance limits with every seat occupied, the baggage compartments full, and the fuel tanks full. The planning question is not which item matters least in the abstract. It is which complete combination supports the occupants, route, fuel needs, performance margin, and the limits for that airplane. Sometimes the correct decision is a fuel stop. Sometimes it is less baggage, fewer occupants, or a different airplane. Sometimes the flight waits for conditions that support the required performance.

[Source: sources.yaml#phak-weight-balance-management]
[Claim type: FAA guidance and teaching explanation]

After every correction, repeat the whole chain. Check compartment and seat limits. Recalculate total weight, moment, and CG for the affected phases. Confirm the point is inside the correct envelope. Revisit fuel and performance. Record the final loading you actually intend to use so a last-minute change is visible instead of silently invalidating the work.

## [35:00] Loading is also a restraint problem

**ANNOUNCER:**

Loading is also a restraint problem.

**INSTRUCTOR:**

A correct CG calculation assumes the loaded items stay where you placed them. A bag that shifts during taxi, turbulence, or maneuvering can change the distribution of weight. It can also interfere with controls, exits, or occupants. The loading plan therefore includes proper restraint, not only an assigned station on a worksheet.

The ACS addresses this under Flight Deck Management. It includes knowledge of securing items and cargo and the skill to secure all items in the aircraft.

[Source: sources.yaml#acs-cargo-securement]
[Claim type: FAA regulatory standard]

Use the baggage and cargo provisions in the airplane's POH or AFM. Observe compartment, floor, and restraint limits. Place items where the loading calculation says they will be, and secure them with the restraint means specified for the airplane. Do not count on a passenger holding a heavy object or on friction keeping a bag in place.

**LEARNER:**

So the calculation describes a physical arrangement that has to remain true.

**INSTRUCTOR:**

Yes. Weight entries correspond to real occupants, fuel, and objects at real stations. If an item moves to another station, the actual moment changes even though the worksheet does not. Securement preserves the loading condition you calculated.

## [36:45] A complete planning pass

**ANNOUNCER:**

A complete planning pass.

**INSTRUCTOR:**

Return to the four people, their bags, and full fuel. Begin with the current weight-and-balance data for the actual airplane. Confirm its calculation method, CG envelope, maximum ramp, takeoff, and landing weights, and the seat and baggage-area limits that apply to this loading. Obtain reliable weights for the occupants and bags, determine the planned usable fuel, and assign each load to a seat or baggage area permitted by the POH or AFM.

Enter the current aircraft starting weight and moment. Add each occupant, fuel, and baggage entry with the arm or moment conversion specified in the airplane's loading data. Total the columns. Determine loaded CG or plot the weight-and-moment point as directed. Compare the takeoff condition with the weight limit and CG envelope.

Next, calculate the landing condition using expected fuel burn and the fuel-tank arm. If the POH or AFM directs fuel use from tanks at different arms, also check the planned tank-change point that could place CG closest to a boundary. If occupants or baggage change between legs, calculate a new takeoff condition for the next leg. If any result is outside a limit, verify the inputs and correct the loading. Do not average an unacceptable takeoff point with an acceptable landing point. Each takeoff, landing, and specifically identified fuel condition must meet its own limits.

When the loading is acceptable, use the takeoff weight in the takeoff and climb charts and the expected landing weight in the landing chart. Consider the runway, obstacles, temperature, elevation, wind, surface, and the difference that may exist between book and actual performance. If the margin is inadequate, revise the load or the flight plan again.

Finally, secure the bags and loose items in the locations used for the calculation. Brief occupants about where their belongings must remain. Before departure, compare the actual people, bags, and fuel with the final worksheet. A calculation for a load that is no longer aboard is not the airplane's current answer.

**LEARNER:**

The sequence is aircraft data, actual load, weight and moment, limits across the flight, performance, and then a final physical check.

**INSTRUCTOR:**

That is the complete connection. The arithmetic supports a decision, and the decision remains tied to the airplane and trip you are actually preparing.

## [39:10] Review

**ANNOUNCER:**

Review.

**INSTRUCTOR:**

Weight and balance asks two separate questions. Total weight tells you how heavy the loaded airplane is. Center of gravity tells you where that weight is centered. An airplane must satisfy both its weight limits and its CG limits.

The datum is the manufacturer's fixed measurement reference. Arm is distance from the datum. Moment is weight times arm. Add the loaded weights and moments. When the computational method applies, total moment divided by total weight gives loaded CG. Graph and table methods organize the same physical relationships in a different form.

Start with current data for the actual airplane. A sample problem teaches a process but does not supply another airplane's empty weight, equipment, arms, or limits. Confirm every occupant, bag, cargo area, and fuel entry, and keep units and moment-index scaling consistent.

Forward and aft CG affect stability, control force, and control authority differently. Use the CG envelope in the airplane's loading data rather than a general preference. Weight also affects takeoff, climb, stall, approach, landing, and range performance, so an acceptable loading calculation must feed the aircraft-specific performance plan.

Check more than takeoff. Fuel burn changes weight and can change CG according to tank location. The ACS expects the airplane to remain within weight-and-balance limits during all phases of flight. Recalculate whenever the load or fuel plan changes.

If the result is unacceptable, verify the inputs, then change the physical loading or the plan. Moving an item changes moment without changing total weight. Adding or removing an item changes both. A fuel reduction also changes endurance and range, so it must remain part of a complete fuel decision.

Secure every item in the station used for the calculation. Then compare the actual airplane, occupants, baggage, and fuel with the final plan before departure.

Bring the POH or AFM loading pages for your training airplane to your next ground lesson. With your CFI, identify the current empty-weight record, the arms or loading graph, every separate limit, and the phases of flight that need checking. Practice changing one input at a time and predicting the direction of weight and CG before you let the worksheet show the result.

## [42:00] Outro

**ANNOUNCER:**

Thanks for listening to PPL Study Podcast. For show notes, source links, and more study material, visit pplstudyguide.com. Send feedback or source corrections to feedback@pplstudyguide.com. The episodes and the research behind them are available for review as an open-source work on GitHub. Until next time, study the sources and keep learning.
