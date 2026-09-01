# PPL Study Podcast agent guidance

## Environment and external services

- Run any command that needs the project environment—particularly OpenAI API source-relevance validation—from this repository root with `direnv exec .`.
- Keep credentials in the local environment. Never place an API key in a command argument, project file, generated artifact, or output.

## Hosting handoff credential boundary

- The hosting repository's `.envrc` is a credential-bearing local file. Never read, print, search, source, diff, or otherwise inspect it, and never run `env`, `printenv`, or `direnv export` there.
- To stage a sealed handoff, use the hosting repository's purpose-built command exactly as `direnv exec . ./scripts/stage-episode <absolute-handoff-path>`. `direnv` injects the credentials only into that child process; its values must never be surfaced or copied into another command.
- Inspect and validate the generated release manifest and Git state after the staging command. Those files—not the local environment—are the reviewable evidence for the hosting PR.

## Starting a new episode

1. Inspect the working tree, sync `origin/main`, and create a fresh `feature/` branch. Preserve unrelated work; do not copy a prior episode directory.
2. Find the episode ID, title, track, and primary anchors in `production-plan.md`, then create the package with:
   ```sh
   npm run episode:create -- --id <id> --slug <slug> --title <title> --track <core|supplemental|rough-spots>
   ```
3. Treat `templates/` as the initial production contract. Before researching or drafting, read `docs/script-drafting-playbook.md`, the new package’s QA checklist, and the template files.
4. Use the current Sol model with high reasoning effort for the initial source-led research pass and complete first draft. It must produce the source ledger, claim inventory, research packet, source-tagged `master-script.md`, derived `narration.md`, show notes, metadata, and production log. Complete these drafting gates in order before presenting the script for human editorial review:
   - Have a separate agent that did not draft the lesson review `master-script.md` for complete and correct grammar, complete thoughts, coherent within-episode callbacks and call-forwards, and first-listen comprehension.
   - Resolve its required findings, regenerate `narration.md`, and record the material findings and resolutions in `production-log.md`.
   - Run formal source-relevance validation with `--require-llm`. Resolve every source, locator, claim, or source-tagged-passage finding and rerun it until it is clean. This validation must examine the tagged spoken passages, not merely the claim inventory or source links. Treat a Retrieval review as source-bound teaching: every factual Instructor or Learner paragraph needs immediate source tags, and each recalled claim must list `Retrieval review` in its `script_sections`. Do not place one source tag after a paragraph that also contains material facts from a different source; split the prose at the source boundary so each tag has one exact supported passage.
   - Only then hand the source-validated draft to the human editor. If an editorial change alters factual spoken prose, source tags, claims, sources, or show notes, return it to source-relevance validation before rendering. After any spoken-script edit, run `npm run episode:script-review -- --episode <episode-directory> --reset`; after renewed source relevance and human editorial approval, run the same command with `--approve`. Rendering and pre-hosting validation fail closed unless the approval fingerprint matches the current `master-script.md` bytes.
5. In `master-script.md`, preserve the standard opening order: `Opening`, `Disclaimer`, `Podcast introduction`, then `What the ACS is asking you to connect`. The first Announcer line repeats that heading.
6. Write spoken prose as normal Markdown paragraphs—one physical line per paragraph, with no hard wrapping.
7. Do not render, stage, publish, or open a PR until the relevant source and editorial gates are complete. Before opening an episode PR, run `npm run release:prehost -- --episode <episode-directory> --package-only` as a non-final package-shape check. It verifies the approved draft's status records, exact source-validation timestamp, source-report input hashes, narrative derivative, show notes, research packet, QA checklist, and hosting content version; it does not validate audio, release readiness, or hosting. Commit the reviewable package with a signed, conventional commit.
8. Draft as speech for a first-time listener. Avoid slogans, quips, snark, clever reversals, and compressed regulatory labels. For every rule, explain the practical question first, then the evidence and terms that answer it. For regulatory episodes, use ACS knowledge and risk-management outcomes as the outline; teach only the regulatory detail needed for the typical private-pilot decision, and link broader exceptions or specialized cases in the show notes.
