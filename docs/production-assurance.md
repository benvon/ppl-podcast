# Episode Production Assurance

This document defines a proportional assurance process for new or deliberately revised episodes. It does not rewrite, backfill, or reinterpret sealed historical releases.

## Purpose and scope

The podcast needs confidence in four things:

1. Source-bound factual teaching is supported by the cited primary material.
2. Human editorial approval applies to the exact script that is rendered.
3. Human listening and chapter review apply to the exact candidate MP3.
4. The staging handoff contains the same script-derived notes, audio, and metadata that completed those checks.

The system protects against normal production mistakes: wrong or stale files, missing source coverage, incomplete packages, failed commands, and accidental reruns. It is not a distributed transaction coordinator, an adversarial audit system, or an attempt to automate editorial judgment.

## One authoritative state and clear records

- `episode.yaml` is the sole mutable production-state record.
- `master-script.md`, `narration.md`, the audio manifest, show notes, and handoff manifest describe specific content or artifacts. They do not restate workflow status.
- The QA checklist records human work and explicit authorization to send unpublished material to OpenAI. It is not a second state machine.
- A command writes one named report for its work. A failed run records a failure and does not promote a new success report.

Use the existing package-operation helper only when a command already changes current-contract package state. Do not add separate locks, recovery records, authorization-consumption files, or waiver registries without a demonstrated production need and a documented decision to expand scope.

## Minimal source and editorial loop

For each current-contract episode:

1. Research from the ACS, the PHAK, the AFH when relevant, regulations, and FAA guidance. Build the source ledger, claim inventory, scenario source map, source-tagged script, narration, and show notes.
2. Have an independent first-listen reviewer assess grammar, complete thoughts, callbacks, call-forwards, and whether the script works when heard rather than read. Resolve material findings.
3. With explicit current-turn authorization, run the two-pass LLM source-relevance review on the exact source-tagged spoken passages, claims, and cited excerpts. The two assessments use the same frozen package inputs; retain the union of their findings before changing the script. Its purpose is to find contradictions, unsupported factual statements, locator errors, and material scope mismatches—not to request stylistic rewrites or chase harmless wording differences. A finding is material only when it could teach an unsafe, wrong, or materially incomplete decision, rule, condition, or central lesson concept. Exact-but-nonessential legal wording is an editorial note.
4. Resolve material source findings and rerun the two-pass review until no material findings remain. The report retains non-material editorial notes for the human editor, but they do not invalidate source review or require a rewrite. Record any human editorial decision about such a note in `production-log.md`; do not build a machine-readable waiver mechanism.
5. Obtain human editorial approval. If spoken factual prose, claims, sources, source tags, or show notes change, reset the script review state and repeat source relevance before rendering. Incidental script whitespace—line endings, whitespace-only blank lines, or trailing horizontal whitespace that is not a Markdown hard break—does not change the source-review identity. Exact script bytes still govern editorial approval and rendered artifacts.

The LLM review occurs before human editorial approval and before rendering. A pull request should verify an internally consistent, reviewed package; it must not be the first place basic source support is discovered.

## Render and release checks

- Render an opening/pronunciation-risk preview before the full episode. Reuse a segment only if its written input, voice, and renderer settings match the current narration plan.
- Bind audio quality, listening QA, and chapters to the exact MP3 hash. If spoken audio changes, regenerate the candidate and its chapter evidence.
- `--package-only` is a shape check. It may confirm a draft package is structurally complete, but it never establishes release readiness.
- On publication day, run `sources:validate --publication-check`, then `release:prepare-publication`. The deterministic check writes `publication-link-validation.yaml`; it verifies current public links without replacing `link-validation.yaml`, the formal LLM source-relevance record. The release handoff must bind the current approved script, narration, show notes, metadata, and MP3 with deterministic identities.
- Before staging, verify the sealed handoff rather than an episode directory path. A staging retry may reuse an object only when its checksum and byte count match the sealed handoff.
- Do not alter historical published packages to satisfy later tooling. A deliberate episode revision starts a new current-contract candidate.

### Optional VHF AM radio treatment

The goal is to distinguish a short, simulated radio transmission while preserving the intelligibility of the study lesson. The authoritative input is the explicit `**INSTRUCTOR (RADIO):**` or `**LEARNER (RADIO):**` turn in the narration derivative; ordinary turns remain clean. The renderer synthesizes the underlying role normally, then applies the versioned local VHF AM filter during assembly. It records the treatment identity and filter configuration beside the affected stitch boundary and selected segment in the render manifest.

The treatment has no external effect and does not make another OpenAI request. Its raw synthesized WAV remains reusable if only the local treatment changes; the changed treatment produces a new candidate MP3, whose normal audio-quality, listening, and chapter QA remain required. A missing or failed `ffmpeg` treatment fails assembly before a candidate is written. No historical candidate is remixed or reclassified merely because this optional capability exists.

## Required checks

The validator suite must check only the relationships that matter to the four purposes above:

| Check | Evidence |
| --- | --- |
| Source mapping | Every current source, claim, and source-tagged factual passage is accounted for. |
| Source relevance | The report is tied to current script, source, claim, and show-notes inputs. |
| Editorial approval | The approval fingerprint matches `master-script.md`. |
| Derived narration | Narration matches the approved script. |
| Candidate audio | Render, audio QA, and chapter review name the same MP3 hash. |
| Handoff | The manifest hashes the listener-facing files and audio that will be staged. |

Add a test for a real observed failure mode or a direct consequence of one of these relationships. Do not add a check merely because it can be imagined. Prefer pure validators that return structured findings, then small commands that write those findings. Keep external calls and mutable state at the command edge.

## Scope control for future tooling

Before changing production tooling, state the top-level goal it serves, the authoritative input and output, the stale-input rule, and the failure behavior. Run `npm run tooling:standards`, focused tests, and an adversarial review before push.

If the same class of issue is found twice, stop adding special cases. Simplify the data flow or relocate the responsibility to the appropriate layer. New checks that introduce a separate state machine, recovery protocol, or generic exception process require explicit user approval and must show why the existing source, script, audio, or handoff identity checks cannot solve the problem.

## Responsibilities of the documents

- `AGENTS.md`: mandatory agent workflow and credential rules.
- `docs/software-engineering-standards.md`: mandatory architecture and scope-control standard for production tooling.
- `docs/script-drafting-playbook.md`: spoken teaching and drafting practice.
- `production-plan.md`: series scope, sources, and editorial design.
- This document: the proportional assurance workflow and the evidence each release needs.
