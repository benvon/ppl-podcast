# PPL Study Podcast agent guidance

## Environment and external services

- Run any command that needs the project environment—particularly OpenAI API
  source-relevance validation—from this repository root with `direnv exec .`.
- Keep credentials in the local environment. Never place an API key in a
  command argument, project file, generated artifact, or output.

## Starting a new episode

1. Inspect the working tree, sync `origin/main`, and create a fresh
   `feature/` branch. Preserve unrelated work; do not copy a prior episode
   directory.
2. Find the episode ID, title, track, and primary anchors in
   `production-plan.md`, then create the package with:

   ```sh
   npm run episode:create -- --id <id> --slug <slug> --title <title> --track <core|supplemental|rough-spots>
   ```

3. Treat `templates/` as the initial production contract. Before researching
   or drafting, read `docs/script-drafting-playbook.md`, the new package’s QA
   checklist, and the template files.
4. Use the current Sol model with high reasoning effort for the initial
   source-led research pass and complete first draft. It must produce the
   source ledger, claim inventory, research packet, source-tagged
   `master-script.md`, derived `narration.md`, show notes, metadata, and
   production log before review. Before script approval, have a separate agent
   that did not draft the lesson review the `master-script.md` for complete and
   correct grammar, complete thoughts, coherent within-episode callbacks and
   call-forwards, and first-listen comprehension. Record its material findings
   and resolutions in `production-log.md`.
5. In `master-script.md`, preserve the standard opening order: `Opening`,
   `Disclaimer`, `Podcast introduction`, then `What the ACS is asking you to
   connect`. The first Announcer line repeats that heading.
6.  Write spoken prose as normal Markdown paragraphs—one physical line per paragraph, with no hard wrapping.
7. Do not render, stage, publish, or open a PR until the relevant source and
   editorial gates are complete. Commit the reviewable package with a signed,
   conventional commit.
8. Draft as speech for a first-time listener. Avoid slogans, quips, snark,
   clever reversals, and compressed regulatory labels. For every rule, explain
   the practical question first, then the evidence and terms that answer it.
   For regulatory episodes, use ACS knowledge and risk-management outcomes as
   the outline; teach only the regulatory detail needed for the typical
   private-pilot decision, and link broader exceptions or specialized cases in
   the show notes.
