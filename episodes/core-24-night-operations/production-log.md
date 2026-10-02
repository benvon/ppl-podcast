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
