# Episode Production Assurance

This document is the durable engineering and editorial retrospective for the PPL Study Guide production system. It applies to new tooling, new episodes, and revisions to current-contract episodes. It does not alter preserved historical packages.

## Why this exists

The production system has repeatedly caught real problems: stale source reports, source tags that did not cover recalled material, changed scripts after approval, mismatched audio and chapter data, duplicated workflow state, missing music treatments, and incomplete staging retries. Those catches are valuable, but many arrived too late—during a pull request or after an expensive audio render.

The goal is not to add more checkboxes. The goal is to make the correct state transition easy and an unsafe transition impossible.

## Tooling rules

### Model every command as a bounded state transition

Each command must have one stated purpose and one of three terminal outcomes:

- `complete`: it performed the requested transition and produced the exact evidence that proves it.
- `failed`: it did not complete; it records a blocking failure and preserves any prior canonical success only as historical evidence.
- `cancelled`: it did not complete; it records a blocking cancellation before releasing ownership.

A command must reach its terminal outcome through one finalization path. Do not scatter `process.exitCode`, lock deletion, report promotion, or artifact cleanup among unrelated branches. A cancellation, timeout, validation error, exception, and signal must all leave an unambiguous state that later gates can inspect.

For a command that owns a lock, lease, temporary directory, or progress record:

1. Acquire ownership before mutable work starts.
2. Validate all static inputs before any external side effect.
3. Record `complete`, `failed`, or `cancelled` before releasing ownership.
4. Release only the ownership held by this run.
5. Never let cleanup make a prior successful report appear current after a later attempt failed or was cancelled.

### Bind every assertion to the thing being asserted

Do not treat a file path, a familiar line of text, or a checked checkbox as proof by itself. Record and verify the identity relationship:

- source-relevance reports bind the exact inputs they examined;
- editorial approval binds the exact `master-script.md` bytes;
- narration binds the current master script;
- render, quality, and chapter records bind the exact MP3 bytes;
- the sealed handoff binds the exact listener-facing metadata, show notes, MP3, and source-package files;
- hosted metadata and the release record bind the exact sealed handoff and immutable audio object.

Human actions remain human attestations. Their machine-readable record must state what was reviewed and identify the reviewed script or audio hash. Automated facts must be validated from the actual artifact, never inferred from prose in a checklist.

### Keep authority and scope explicit

`episode.yaml` is the only mutable production-state authority. Artifact manifests record facts about artifacts; they do not restate workflow status. The QA checklist is a human work log, not a second state machine.

Every command must state whether it is one of these scopes:

- **shape check**: validates a draft package's structure only;
- **candidate check**: validates a particular rendered candidate;
- **release check**: validates publication-ready package and handoff facts;
- **external effect**: sends data to OpenAI, stages audio, publishes a release, or alters a remote branch.

A shape check may return success, but it must never claim release readiness, clear a release gate, write a seal, or enable staging. Use output terms such as `draft package shape valid`, not `passed` without scope.

Contract identity is resolved once from the parsed `episode.yaml` mapping. An absent contract marker means preserved legacy; the numeric value `2` means the current contract; every other value is unsupported. A published early contract-v2 package that predates the claim-source-preflight fields is also preservation-only: it cannot silently be treated as a new candidate simply because tooling gained a later gate. A deliberate `episode:script-review --reset` adds the current fields and begins a new revision. Current source validation, Realtime rendering, package validation, publication preparation, and handoff creation all use that shared classification and refuse preserved packages. The retired renderer additionally requires a tracked, unchanged historical package whose directory, script name, and episode ID agree.

Source-review readiness and editorial readiness are shared gates, not command-local interpretations. Claim-source preflight and formal tagged-passage review acquire one package lifecycle lock before reading any mutable package input and hold it for their full run, so a preflight cannot begin or complete between the formal review's preflight check and report promotion. Rendering, editorial approval, package checks, publication preparation, and handoff construction acquire that same exclusive package lease before their first authoritative state read and hold it through their final artifact or state effect. They fail closed while another owner holds it; a release consumer must never inspect an older clean report while a newer source attempt is in progress.

Every current-contract `episode.yaml` mutation also proves package-lease ownership, rereads the expected file bytes immediately before the atomic write, and advances `production_state_revision`. A transition that sees changed bytes or an invalid revision fails instead of overwriting a newer state snapshot. Deterministic source-link validation acquires this lease before reading any mutable package input because it also records source state. Multi-file script reset retains its rollback-safe transaction, but prepares the revisioned `episode.yaml` update under the same lease and has the same confirmed-dead-lock recovery path. Preserved historical packages are not migrated merely to add this field. Source validation, script review, rendering, pre-hosting validation, and publication preparation expose the same confirmed-dead-lock recovery path, but only the operation named by a confirmed-dead lock may recover it; another operation fails closed rather than discarding its transaction context. Publication preparation records an atomic rollback journal that binds the original and exact prepared metadata bytes, intended release identity, and expected source-file hashes, so recovery either restores a recognized partial package, recognizes only the matching sealed handoff, or refuses to overwrite later user edits. Handoff source snapshots exclude all transient locks, failed-attempt records, and temporary files. The retired renderer establishes local path and `origin/main` provenance from retained package snapshots before it makes any public request, then verifies the recorded public GitHub publisher commit, episode page, and enclosure byte count and SHA-256 instead of trusting local publication-status strings.

### Make retries safe and narrow

An automatic retry may reuse a prior result only when the exact relevant identity is unchanged. If any input is different, invalidate the downstream result rather than treating it as equivalent.

For a staging retry, reuse an existing private object only after verifying its SHA-256 and byte count against the new sealed handoff. A provenance refresh may update an unmerged package only when the immutable audio, listener-facing episode data, and show notes are identical. A published release is immutable: do not restage it, rewrite its seal, or backfill its process history.

### Treat time and remote state as inputs

Current eCFR dates, source revisions, publication dates, remote release state, and default-branch ancestry can change during a run. Fetch and record the current value once per attempt; if an authoritative API advances a source date, update the manifest atomically and restart the validation attempt under the shared limiter. A response that reports an advanced date is normal validation evidence, not a limiter failure.

Before a PR, staging refresh, or release recovery, inspect the current remote branch, PR, and release state. Do not rely on local branch ancestry or a stale `origin/main` snapshot.

## Required tooling tests

For every validation, render, sealing, or staging change, add focused automated coverage for the affected normal and failure paths:

| Case | Required property |
| --- | --- |
| Valid input | The command produces exactly its documented evidence. |
| Invalid input | No success marker, seal, or remote effect is produced. |
| Cancellation or signal | A blocking cancelled record exists before ownership is released. |
| Exception or timeout | A blocking failed record exists before ownership is released. |
| Concurrent attempt | A second run cannot replace the first run's lock or report. |
| Changed input | A previous approval, render, report, or handoff is rejected as stale. |
| Retry with identical input | Reuse is explicit, identity-verified, and idempotent. |
| Retry with changed input | Reuse is refused; the new work has a new identity. |
| External object already present | SHA-256 and byte count must match before reuse. |
| Narrow mode | It cannot be mistaken for a final release success. |

Use fault injection where practical: abort after lock acquisition, throw while writing a report, simulate an advanced eCFR date, simulate a stale candidate file, and simulate a pre-existing staging object with both matching and mismatching identity. A test that merely checks a friendly status string is insufficient.

## Episode-production rules

### Source and editorial loop

Use this order for each current-contract episode:

1. Research from the ACS, PHAK, AFH when relevant, regulations, and FAA guidance; create the source ledger, claim inventory, and a source map for each planned scenario before prose grows large.
2. With explicit current-turn authorization, mark the dedicated QA item and run `direnv exec . npm run sources:preflight -- --episode episodes/EPISODE --require-llm` to independently fetch the exact cited targets and send the extracted locator text to the LLM claim-source challenger. The command consumes that authorization for this run and records its UUID and timestamp in `claim-source-preflight.yaml`; a retry requires a fresh authorization. Resolve every unsupported, over-broad, or incomplete claim before the drafting agent writes full spoken prose. The tool snapshots the source ledger and claim inventory before outbound work, refuses promotion if either changes, and records the input hashes, exact reviewed locators, independently fetched citation identity and content hash, locator-excerpt hash, claim mappings, and LLM assessments in `claim-source-preflight.yaml`; a failed assessment preserves its collected evidence in a failed attempt and blocks downstream gates. SIGINT/SIGTERM finalizes that failed attempt, and a confirmed dead lock can be recovered only with `--recover-stale-lock`. Record findings and resolutions in `production-log.md`.
3. Draft the lesson as spoken, scenario-led teaching with the current Sol/high drafting workflow. The drafting agent uses only preflight-supported factual claims, and labels additional reasoning as teaching synthesis.
4. Have an independent agent conduct the first-listen read for grammar, complete thoughts, clear referents, coherent callbacks, earned Learner turns, and smooth causal transitions.
5. Resolve required findings, regenerate narration, and run deterministic source/claim/show-note mapping.
6. With explicit current-turn authorization, mark the formal-review QA item and run the LLM source-relevance review against the tagged spoken passages before human editorial review. After static-input checks and any internal eCFR refresh, the validator consumes that item before external validation starts and records its UUID and timestamp in `link-validation.yaml`; every later retry requires fresh authorization. It confirms that the actual spoken prose stayed within the preflight's support; resolve every remaining source, locator, claim, and passage finding, then rerun cleanly.
7. Give the clean draft and a focused change summary to the human editor. Any material factual change returns to step 5; reset and reapprove the script fingerprint before render.

The claim-source preflight is an earlier quality gate, not a substitute for formal tagged-passage validation. Its shared contract is enforced both before any audio render and during pre-hosting validation: every source must retain a reviewed excerpt bound to independently fetched locator evidence, an exact matching locator, a supporting locator assessment with rationale, and supporting assessment for each mapped claim. Do not use a final PR review as the first substantive source review. A PR should confirm a sealed, internally consistent package—not discover basic source support or stale derivative work.

### Teach for a listener, not coverage inventory

Use ACS knowledge and risk-management outcomes to decide scope. For theory-heavy material, orient the listener with the causal map, develop one relationship at a time, and then rebuild the same chain in the retrieval review. For operational or regulatory material, use a realistic scenario to ask the practical question first, then introduce only the evidence and vocabulary needed for the typical private-pilot decision.

Every scenario needs a source map. Separate:

- exact regulatory or FAA-guidance facts;
- aircraft-specific facts, clearly bounded to that aircraft; and
- teaching synthesis, clearly framed as a useful way to reason from the cited facts rather than as an invented FAA procedure.

Avoid clever hooks, slogans, unsupported radio scripts, generic warnings, and defensive hedging. Define important terms before relying on them. A Learner turn should ask the next earned question, not state a conclusion the Instructor has not established.

### Render and audio controls

Treat `audio-mix.yaml` as the entire mix plan for current-contract episodes. A render command must fail when the plan is missing, contradictory, or silently bypassed. Render reusable opening and pronunciation-risk samples before the full candidate. Reusing segments is allowed only when their exact input, voice profile, and renderer settings match the current narration plan.

The final candidate is not ready until its MP3 hash ties together the render manifest, automated quality report, embedded chapters, and human script-aligned listening and chapter review. If speech changes, render the impacted segments and regenerate the candidate and chapter evidence; chapter metadata follows the audio, never the reverse.

## Retrospective findings from recent episodes

Recent episodes demonstrate that the direction is working, while identifying where the system needs more discipline:

- **Core 11:** The causal-map rewrite and independent first-listen review substantially improved a difficult theory lesson. PR findings later exposed missing Retrieval review tags and overly compressed recap claims. This led to the current rule that recalled factual teaching is source-tagged and mapped just like first occurrence.
- **Core 12 and 13:** Scenario-led planning made weather theory more usable, but pronunciation and audio-mix behavior needed targeted samples. Pronunciation should be a narrow renderer concern with regression samples, not a global textual rewrite.
- **Core 14:** The Astra experiment produced more interaction but needed the standard opening contract, smoother prose, and ACS-focused scope. The first full assembly omitted the music bed, demonstrating why the declarative mix plan must be validated before listening QA.
- **Core 15:** The Pine Valley scenario gave traffic-pattern material a coherent thread, but source support was refined through too many late iterations. The durable response is to establish exact primary-source passages and distinguish teaching synthesis before human editorial approval—not to weaken source validation or render before the loop is clean.

## Agent checklist before any change

Before changing production tooling, state the command's scope, inputs, authoritative state record, external effects, normal outcome, failure outcome, cancellation outcome, retry rule, and test matrix. Before changing an episode, state which downstream fingerprints and human approvals become stale. Before changing a published episode, stop: create a new revision under the current contract rather than editing the preserved release.

## Ownership of the documents

- `AGENTS.md`: mandatory agent sequence, credentials, and release gates.
- `templates/` and scripts: executable package contract.
- `docs/script-drafting-playbook.md`: first-listen teaching and drafting rules.
- `production-plan.md`: series scope, source hierarchy, and editorial product design.
- This document: cross-cutting tooling assurance rules and recurring retrospective findings.

When these disagree about executable behavior, scripts and their tests control. Update the affected guidance in the same change; do not leave a new rule as an unwritten lesson from a PR thread.
