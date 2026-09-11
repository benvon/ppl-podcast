# PPL Study Podcast agent guidance

## Environment and external services

- Run project-environment commands, especially OpenAI source-relevance validation, from the repository root with `direnv exec .`.
- Before sending unpublished episode material to OpenAI for source review or audio rendering, obtain explicit current-turn authorization and record it in the package QA checklist and resulting report.
- Keep credentials in the local environment. Never put an API key in a command argument, project file, generated artifact, or output.

## Hosting handoff credential boundary

- The hosting repository's `.envrc` is credential-bearing. Never read, print, search, source, diff, or otherwise inspect it; never run `env`, `printenv`, or `direnv export` there.
- Stage a sealed handoff only with `direnv exec . ./scripts/stage-episode <absolute-handoff-path>`. Inspect the resulting release manifest and Git state, never the environment.

## Production assurance

- Read [docs/production-assurance.md](docs/production-assurance.md) and [docs/software-engineering-standards.md](docs/software-engineering-standards.md) before changing validation, rendering, sealing, staging, or release tooling. Their top-level goals are mandatory scope limits: source integrity, artifact integrity, clear human responsibility, proportionality, and preservation.
- `episode.yaml` is the sole mutable production-state authority. Use the existing package-operation helper for commands that already mutate current-contract state. Do not create parallel lock, authorization, recovery, waiver, or lifecycle mechanisms without explicit approval and a documented reason the existing source, script, audio, or handoff identity checks cannot satisfy the need.
- Do not add checks that recognize friendly text without validating the artifact or identity it claims to represent. Before pushing tooling changes, run `npm run tooling:standards`, focused tests, and an adversarial review. If the same class of finding appears twice, stop point-fixing and simplify or redesign the responsible layer.
- Treat `--package-only` as a draft-package shape check only. It never establishes final release readiness.
- Historical published packages are preservation-only. Do not refresh their seals, staging objects, source-validation records, or workflow fields. A deliberate revision creates a new current-contract candidate.

## Starting a new episode

1. Inspect the working tree, sync `origin/main`, and create a fresh `feature/` branch. Preserve unrelated work and do not copy a prior episode directory.
2. Find the episode ID, title, track, and primary anchors in `production-plan.md`, then create the package:

   ```sh
   npm run episode:create -- --id <id> --slug <slug> --title <title> --track <core|supplemental|rough-spots>
   ```

3. Treat `templates/` as the initial production contract. Before researching or drafting, read `docs/script-drafting-playbook.md`, the new package's QA checklist, and the template files.
4. Use the current Sol model with high reasoning effort for the source-led research pass and first complete draft. It produces the source ledger, claim inventory, research packet, source-tagged `master-script.md`, derived `narration.md`, show notes, metadata, and production log. Complete these gates before presenting the draft for human editorial review:

   - Have a separate agent review `master-script.md` for grammar, complete thoughts, coherent callbacks and call-forwards, and first-listen comprehension.
   - Resolve material findings, regenerate narration, and record the findings and resolutions in `production-log.md`.
   - With explicit current-turn authorization, run source-relevance validation with `--require-llm` against the source excerpts, claims, and tagged spoken passages. It must identify only source-support risks: contradiction, unsupported factual prose, incorrect locator, or material scope mismatch. Resolve those findings and rerun cleanly before human editorial review; record non-material editorial decisions in `production-log.md`, not a waiver system.
   - Give the clean draft to the human editor. If spoken factual prose, claims, sources, source tags, or show notes change, return to source relevance. After any spoken-script edit, reset the script review fingerprint; after renewed source relevance and human editorial approval, approve it again. Rendering and pre-hosting validation require the approval fingerprint to match current `master-script.md` bytes.
   - `episode.yaml` holds mutable production state. Artifact manifests record facts about their artifacts; `master-script.md` contains no production-status prose.

5. Preserve the standard opening order in `master-script.md`: `Opening`, `Disclaimer`, `Podcast introduction`, then `What the ACS is asking you to connect`. The first Announcer line repeats that heading.
6. Write spoken prose as normal Markdown paragraphs—one physical line per paragraph, with no hard wrapping.
7. Do not render, stage, publish, or open a PR until source relevance and human editorial approval apply to the current script. Each assembly uses a fresh timestamped candidate name and never overwrites an existing candidate. Before an episode PR, run `npm run release:prehost -- --episode <episode-directory> --package-only` as a non-final package-shape check. On publication day, after listening and chapter QA, run `npm run sources:validate -- --sources <episode-directory>/sources.yaml --claims <episode-directory>/claim-inventory.yaml --publication-check`; it writes `publication-link-validation.yaml` without replacing the formal LLM source-review record or changing source-review state. Then use `npm run release:prepare-publication -- --episode <episode-directory> --published-at <UTC-RFC3339> --out <new-absolute-handoff-directory>` to synchronize release facts, perform final pre-hosting validation, and create a sealed handoff. That command never stages, publishes, or opens a PR. Commit reviewable work with a signed conventional commit.
8. Draft as speech for a first-time listener. Avoid slogans, quips, snark, clever reversals, and compressed regulatory labels. For every rule, explain the practical question first, then the evidence and terms that answer it. For regulatory episodes, use ACS knowledge and risk-management outcomes as the outline; teach only the detail needed for the typical private-pilot decision and link broader exceptions or specialized cases in show notes.
