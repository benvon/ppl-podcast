# Night Operations — production log

This is explanatory context, not a production-state or audit record. Use `episode.yaml` and the named structured validation and artifact reports for authoritative state, approvals, timestamps, hashes and run identities. The QA checklist records fixed `qa-id` attestations.

## 2026-10-02 — source-led initial package

- Started from the current templates on a fresh feature branch after syncing main. Existing historical packages and `release-handoffs/` were preserved.
- Reviewed Episodes 18–23 for calm Instructor/Learner dialogue, scenario preparation before use, restrained Announcer headings, source purity and bounded retrieval prompts.
- Built the Night Operations lesson around ACS PA.XI.A.K1–K8/R1–R7. Elena/Jonah prepare the pilot, airplane, route, alternative and arrival before taxi. The dark-terrain approach and explicit weather/emergency variations reuse that preparation.
- Retrieved and inspected current FAA/eCFR evidence. Used exact printed pages and AIM/regulatory sections. The PHAK large PDF was fetched directly from FAA outside the sandbox, with local extraction and visual checking of the PAPI figure.
- Used FAA JO 6850.2C Figure 5-2 as extractable-text evidence for PAPI color interpretation; the equivalent PHAK figure is a supplemental visual aid. No validation tooling was changed.
- Independent first-listen review found an unclear PAPI referent/action and a stray annotation prefix. One coherent revision to 0.1.1 resolved both. The reviewer re-read the corrected script and reported no material findings. Optional transition/density notes are retained in the research packet.
- Performed the required source-contract self-audit, including the full Retrieval review and regulatory timing/coverage/terrain conditions. Details are in the research packet.
- Mechanically generated `narration.md` from `master-script.md`. Source/claim mappings and all show-notes links passed deterministic `sources:validate --publication-check --dry-run`: 45 source entries, 57 material claims, 78 tags and 47 note links.
- Renderer parser/front-matter validation read the narration successfully: 121 planned segments, three established speakers, fifteen sections and 5,170 spoken words. No audio API call was made. Full render prerequisites require later source and human editorial approval.
- The user explicitly authorized the OpenAI API source-relevance review for core-24 in the current request. This authorization covers its excerpts, claims and tagged spoken passages, and is checked in the fixed QA item for the next formal review run. Audio rendering has no authorization in this task.

## 2026-10-02 — exact-page evidence mapping correction

- The completed formal review's only unresolved issue came from the full 14 CFR 1.1 section exceeding the excerpt limit before its Night definition. All other 44 source entries supported their assigned claims in both assessments.
- Rebound the unchanged Night-definition claim and tags to AFH Chapter 11's exact quotation of 14 CFR 1.1, including Air Almanac and local-time conditions, at printed p. 11-1/PDF p. 1. Retained the current direct eCFR section as supplemental legal reading and documented the regulatory-claim/handbook-reproduction boundary in the research packet.
- Kept version 0.1.1 because the change is evidence bookkeeping only; verified the derived spoken narration is byte-for-byte unchanged. Reset script review because source tags changed. Independent-review renewal and formal source-relevance rerun use the revised evidence mapping.

## Source-locator clarification

- Formal review requested clarification of the AIM beacon locator. The FAA page contains both the land-airport color-combinations paragraph and the military-beacon paragraph; the source ledger and notes now name those exact paragraphs rather than relying on list labels. Spoken wording and the reviewed script are unchanged. Formal results belong in the structured report.

## Human editorial handoff

- The current source-review evidence is recorded in `link-validation.yaml` and `episode.yaml`. Notes display the completed review accurately. Earlier failed attempts are preserved by the existing validator. Independent review remains bound to the current script; narration remains mechanically derived.
- Human editorial approval is pending. Audio, listening and chapter QA, publication-day checks, and hosting remain later gates.

## October 7, 2026 — human editorial feedback, coherent revision 0.1.2

Replaced the vague landing-light response with a practical 91.205/91.213(d) determination and an explicit personal minimum: if all applicable requirements allow the personal night flight, Elena still delays or reschedules until the landing light works. Moved steady position-light identity and flashing anticollision-light purpose before regulatory decisions. Replaced the flashlight comparison with a usable parked-cockpit failure rehearsal. Added planned two-bar VASI use and brief tri-color/pulsating indications; scope remains the actual Harbor/Pine Valley decisions. Built beacon and propeller-area scanning around people moving on the ramp.

A different agent reviewed first-listen continuity, earned learner questions and section transitions. Its two required findings (neutral altitude question; exact Episode 8 title) were resolved. The reviewer confirmed the final source-only VASI tag addition; the completed independent review binding is recorded in `episode.yaml`. Synchronized version 0.1.2 in all four records, reset downstream review with the established helper, and mechanically derived narration. Current source review is pending. The user explicitly authorized renewed two-pass OpenAI source relevance in this turn; authorization is recorded in QA for the parent-run validator. Human editorial approval, rendering, listening QA and publication remain pending.

## Pronunciation-map change design

- Goal: make the requested approach-indicator names sound natural in future renders. The renderer’s existing pronunciation maps are the authoritative input; recorded render settings and manifests retain their map values. Added PAPI → pappy and VASI → vassy without changing the written lesson for pronunciation.
- The change performs no external call. The existing transformed-text render identity makes changed pronunciations invalidate incompatible reusable voice segments; normal word boundaries preserve longer tokens. Existing failure behavior and assembly identity checks remain in effect.
- Focused pronunciation tests and the full validation/render suite were run, along with tooling standards. Independent adversarial review checked substitution boundaries, settings/manifest recording, and reuse identity. Actual voice pronunciation awaits authorized audio rendering and human listening QA.

## October 7, 2026 — contextual source revision 0.1.3

The union of two formal assessments required correction of the current aircraft-light AIM anchor and two VASI evidence mappings. Corrected Use of Aircraft Lights to 4-3-24, assigned VASI physical bar placement/on-path colors to JO 6850.2C p. E-1, and added current FAA Pilot/Controller Glossary AIRPORT LIGHTING VASI entry for the explicit high/on/low indications. Revised the VASI paragraph once to name near/far threshold locations and colors without unsupported visual stacking, while retaining both-white high, both-red low and the AIM coverage/local-limit conditions. Synchronized 0.1.3 across all four version records; renewed independent and formal review remain required before human editorial handoff.

Independent review cleared the revised VASI paragraph and neighboring transitions with no material findings, with the exact reviewed-script binding recorded in `episode.yaml`. Narration matches its mechanical derivative; renderer structure and deterministic source/notes mappings pass. Current-turn renewed API authorization remains recorded in QA; formal review will be rerun by the parent agent.

## Renewed human editorial handoff

The final two-pass source review reports no material source-support findings; current evidence and authorization are recorded in the structured report and episode state. Retained nonmaterial editorial notes remain available to the human editor. The named VASI glossary entry resolves the locator ambiguity. Independent prose review is bound to the current script, narration is current, and all version records identify 0.1.3. Human editorial approval remains pending; no audio was rendered.

## October 7, 2026 — human editorial approval

The user approved the revised version 0.1.3 script. The established approval helper verified current source-review evidence and bound editorial approval to the current master script in `episode.yaml`. Audio rendering and subsequent listening, chapter, and release gates remain pending.

## October 7, 2026 — authorized audio QA previews

The user authorized OpenAI API audio rendering. Rendered an opening preview and an approach-lighting pronunciation sample from the approved narration with the established Realtime voices and music mix. Both passed automated checks with zero clipped samples and zero stitch warnings. Artifact identities and authorization are recorded in the audio manifest. Human review of voice quality, pacing, music balance, the spoken notice, and PAPI/VASI pronunciation remains pending before full production. Compatible voice segments remain available for reuse. No full candidate or release was produced.

## October 7, 2026 — accepted previews and authorized full candidate

The user accepted audio QA and confirmed hearing the disclaimer notices, then authorized the full OpenAI API render. Reused compatible preview voice segments and rendered the remaining approved narration. The fresh full candidate is 37:59, within the planned 35–45 minutes, with zero clipped samples and stitch warnings. All 15 embedded chapters passed ffprobe validation; the chapter review page is bound to this MP3. Updated actual runtime, hosting duration, candidate identity, QA attestations, and remaining gates. Normalized the show-notes episode label to the package contract. Full-candidate human listening and manual chapter review remain pending, along with publication-day and hosting gates.

## October 8, 2026 — publication preparation

The user accepted full listening QA and the chapter markers, and requested publication. The current source report records renewed review after the eCFR edition refresh; the cited section texts were unchanged. Corrected stale public notes and used an explicitly dated official XML link for supplemental legal reading. Publication-day evidence and the sealed handoff are recorded by their existing reports. Human attestations and metadata are synchronized in the package. The date-only review inefficiency is tracked separately in issue #38.
