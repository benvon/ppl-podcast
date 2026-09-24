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

The package moves through research, script drafting, independent first-listen
review, authorized source validation, editorial approval, render, and release
QA in the order described in
`production-plan.md`. Source relevance must pass before any audio is rendered.
Do not use a
previous episode as a template: its history is evidence, not a workflow
contract.

`sources.yaml` is the source ledger. Every listener-facing source URL must be
a deep citation: name the smallest relevant section, task, paragraph, or page;
use `#page=N` for PDFs; use a specific FAA HTML anchor or section endpoint; and
use the exact eCFR section URL. A document or regulation landing page is only a
research-discovery link, never an attribution.

The claim inventory, source ledger, and source-tagged master script own substantive facts. `show-notes.md` derives the public study guide from those claims and may also include supplemental study links. The manifest declares every HTTPS link in the notes. Claim-backed links bind displayed text and URL to a deep locator, source-ledger entry, and supported claims. Supplemental links declare `kind: supplemental`, text, and URL only. Deterministic mapping runs before rendering and package-only validation; publication-day validation checks the reachability of every link, including supplemental links.
