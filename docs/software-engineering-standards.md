# Production Tooling Engineering Standard

This standard applies to tools that research, validate, render, seal, stage, or publish an episode. It keeps production assurance proportional to the actual goal: demonstrate that source-backed spoken material, the reviewed script, the rendered audio, and the handoff describe the same episode.

## Top-level goals

1. **Source integrity.** Factual teaching points to relevant primary material, and an independent source-relevance review examines the actual tagged spoken passages before human editorial approval.
2. **Artifact integrity.** The approved script, narration, MP3, chapters, show notes, and handoff are tied together with deterministic hashes or equivalent file identities.
3. **Clear human responsibility.** Human editorial, listening, and chapter decisions are recorded plainly as attestations. Automation checks identity and completeness; it does not impersonate human judgment.
4. **Proportionality.** Protect against ordinary mistakes: stale inputs, incomplete packages, wrong files, failed commands, and accidental reruns. Do not build a custom distributed-systems protocol for a local, single-maintainer workflow.
5. **Preservation.** Historical published packages remain sealed. Current rules apply only to a deliberate new revision.

If a proposed check does not directly serve one of these goals, do not add it.

## Architecture boundaries

Keep production tooling in three layers:

- **Facts:** small, deterministic functions read specific files and return structured findings. They do not mutate package state or call external services.
- **Commands:** a command validates inputs, calls fact functions, performs at most one external effect, and writes one clearly named result record. It reports failure without promoting a success result.
- **Orchestration:** package preparation and handoff compose completed command outputs. They verify identities rather than reinterpreting prose or duplicating lower-level validation.

`episode.yaml` is the sole mutable workflow-state record. Artifact manifests describe artifacts. The QA checklist records human work. Do not create another state file, lock type, waiver system, or lifecycle registry unless the existing boundary cannot express a concrete requirement.

Use the existing package operation wrapper only for commands that already mutate current-contract package state. Do not add separate authorization locks, recovery protocols, or competing ownership systems. A normal local command may fail closed, leave its existing successful record untouched, and be rerun after the cause is corrected.

## Required behavior

- Validate the full intended collection, not a convenient sample: every required source, claim, source tag, show-notes link, handoff file, and candidate artifact.
- Bind a report or approval to the current relevant bytes. A changed script invalidates script approval and source review; source review may use an explicitly documented semantic identity for incidental whitespace only, while editorial approval remains bound to exact script bytes. A changed audio file invalidates audio and chapter review; a changed handoff input invalidates the handoff.
- Make narrow modes explicit. A shape check may say `draft package shape valid`; it must not claim release readiness or create a release seal.
- Treat the LLM source review as a focused support check. It may block for contradiction, unsupported factual material, an incorrect locator, or a material scope mismatch. It must not create blocking findings for stylistic preferences, harmless wording alternatives, or non-material omissions.
- Resolve material source findings by revising the source-bound prose or source mapping. If the human editor deliberately accepts a non-material limitation, record the decision in `production-log.md`; do not create a generalized machine waiver mechanism.
- Keep external authorization conversational and explicit for unpublished material. Record it in the normal QA checklist and report. Do not consume a checkbox or build a separate authorization state machine.
- Preserve a failed command's error report. Do not clear or overwrite a prior clean report until a new clean run for the current inputs succeeds.

## Change protocol

Before changing production tooling, write a short design note in the PR description or production log that names:

- the goal this change serves;
- authoritative inputs and output record;
- whether it has an external effect;
- how changed inputs make its output stale; and
- the normal and failure behavior.

Then add focused tests for the observable contract: valid input, missing or mismatched input, changed dependent input, and a failed external or write step when applicable. Test a real bad outcome, not a friendly status string. Keep tests at the facts or command boundary; do not add synthetic concurrency, crash-recovery, or authorization tests unless the command has a demonstrated concurrent or recovery requirement.

Before pushing a tooling change, run `npm run tooling:standards`, the relevant test suite, and one adversarial review. If the same class of finding appears twice, stop adding point fixes. Re-state the top-level goal and simplify or redesign the responsible layer before continuing.

## Enforced floor

`npm run tooling:standards` verifies that this standard is present and that the lifecycle command registry remains internally consistent. `npm run precommit:check` runs that gate. The test suite enforces artifact identity, complete package coverage, and stale-input rejection.

The gate is deliberately modest. It detects drift that can be checked mechanically; it does not pretend to prove architecture through source-code pattern matching. The mandatory instructions in `AGENTS.md`, this document, focused tests, and adversarial review are the enforceable process contract for agents.
