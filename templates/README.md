# Episode templates

Use these files to create a new episode package. The scaffold command copies
them into `episodes/<id>-<slug>/` and replaces the `{{PLACEHOLDERS}}`.

```sh
npm run episode:create -- \
  --id core-01 \
  --slug aeronautical-decision-making-risk-management \
  --title "Aeronautical Decision-Making and Risk Management" \
  --track core
```

The package moves through research, script, source validation, render, and
release QA in the order described in `production-plan.md`. Do not use a
previous episode as a template: its history is evidence, not a workflow
contract.

`sources.yaml` is the source ledger. Every listener-facing source URL must be
a deep citation: name the smallest relevant section, task, paragraph, or page;
use `#page=N` for PDFs; use a specific FAA HTML anchor or section endpoint; and
use the exact eCFR section URL. A document or regulation landing page is only a
research-discovery link, never an attribution.

`show-notes-manifest.yaml` declares every HTTPS link in `show-notes.md`. It
binds the exact displayed text and URL to a deep locator, a source-ledger entry,
and the material claims that entry supports. The source validator checks this
manifest alongside the claims inventory before release.
