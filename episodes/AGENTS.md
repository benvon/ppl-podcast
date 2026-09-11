# Episode package guidance

## Code Review Rules

### Listener-facing script exclusion

- `master-script.md` and `narration.md` are out of scope for GitHub Codex Review. Do not leave findings about their factual content, source support, teaching approach, dialogue, grammar, pronunciation, wording, formatting, or citations.
- Those listener-facing scripts receive independent spoken-script review, source-relevance review, and human editorial review before rendering. Do not recreate those editorial loops in a pull request.
- Continue reviewing production tooling, package manifests, provenance seals, source-validation records, tests, and workflow-state transitions. Flag only consequential implementation or artifact-integrity defects in those files.
