# Aeromedical Factors and Human Performance — production log

This is optional explanatory context, not a production-state or audit record. Use `episode.yaml` and the named structured validation and artifact reports for authoritative state, approvals, timestamps, hashes, and run identities. The QA checklist records fixed `qa-id` human attestations.

## 2026-09-21 — source-led draft

- Created from the standard episode template and drafted around a preflight postponement followed by a later conditional flight and early landing for suspected carbon monoxide exposure.
- FAA-S-ACS-6C PA.I.H, AIM 8-1-1 through 8-1-6, the FAA OTC medication guide, and PHAK Chapter 17 supplied the initial source map. The script deliberately omits medication-specific no-fly times and individualized medical clearance.
- A separate spoken-script reviewer identified continuity and source-purity issues. The draft was revised to place hypoxia and hyperventilation as bounded planning examples, close the carbon monoxide flight with an explicit landing, move the illusion discussion after landing, and split mixed-source retrieval paragraphs.
- A source-contract pass added the exact 14 CFR 61.53(a) and 91.17(a) regulatory boundaries required by the ACS Human Factors task, separated scenario synthesis from source-supported claims, and expanded the spoken draft to the 30-minute target.
- Narration was derived from the current master script. The independent reviewer found no remaining required editorial fixes after the revisions. The two-pass source-relevance review supported all 23 mapped claims and 47 source-tagged passages across 13 sources; human editorial review remains pending. Structured state lives in `episode.yaml` and `link-validation.yaml`.

## 2026-09-22 — editorial revision in progress

- Revised the pilot-fitness language to distinguish a practical self-assessment from medical certification, keep a routine cold within delay-and-recovery decisions, and reserve aviation medical guidance for persistent, recurrent, or broader medical-status concerns.
- Made passenger expectation-setting and a route with several suitable alternates central to the scenario. The carbon-monoxide response now directs Maya to end the flight at the suitable airport that minimizes added risk and workload from her current position.
- Added the FAA medication guidance directory, the PHAK four-form hypoxia vocabulary, and an announcer summary. These factual and source changes reset the prior independent and source-relevance review evidence.
- A second agent independently reread the revised spoken script and found no required edits. The renewed formal source review then passed both relevance assessments for the current 16-source, 26-claim package. The structured result, including the nonmaterial medication-reference editorial note, is recorded in `link-validation.yaml`; human editorial approval remains pending.

## 2026-09-22 — repetition and revision update

- Condensed adjacent source-tagged passages that repeated the same conclusion, while retaining the preflight, passenger-expectation, alternate-airport, hypoxia, carbon-monoxide, and visual-reference decision sequences. The package revision is 0.1.5 and the current spoken count is 3,960 words.
- A second agent independently reviewed the revised spoken script with no required edits. The source-review record is intentionally pending again because the current script differs from the prior reviewed script.
- The user then made a small editorial change. The resulting current script passed a new independent review and two-pass formal source evaluation; `link-validation.yaml` is the authoritative record of that run.
- The user approved the revised script. `release:prehost --package-only` confirmed the draft-package shape; audio and publication QA remain pending.
- The five-segment opening preview was assembled with passing automatic audio checks and approved in human listening QA. The opening turn, disclaimer, and introduction are accepted.
