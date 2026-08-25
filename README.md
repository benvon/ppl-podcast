# PPL Study Podcast

An open, source-backed study-podcast project for U.S. private-pilot airplane
learners. This repository contains the research trail, claim inventories,
scripts, show notes, source-validation records, and production controls behind
each episode.

## What this is—and is not

The project teaches the private-pilot knowledge standard with the FAA Pilot's
Handbook of Aeronautical Knowledge as its teaching spine, the Airman
Certification Standards as its coverage map, and current regulations and FAA
guidance where they apply. Episodes use Instructor and Learner dialogue, with
an Announcer for the podcast introduction, section transitions, and outro, to
explain material in original language.

It is a study resource, not flight instruction, a substitute for a CFI, legal
advice, operational authorization, or a replacement for current FAA material
and an aircraft's approved documents. When an episode conflicts with current
regulation, official FAA information, or approved aircraft documentation, those
sources are the authority.

Episodes disclose their AI-assisted production. Their factual content is
checked against cited source material before audio production, but is not
reviewed by a certificated flight instructor unless the specific episode says
so. We welcome technically grounded corrections and source updates.

## What is public here

- The series plan, source hierarchy, and editorial rules.
- Per-episode research packets, source ledgers, claim inventories, scripts,
  show notes, QA records, and production logs.
- Reusable templates, source-link validation tooling, and audio-rendering code.

## What is intentionally excluded

- FAA PDFs or other source files when a direct public authoritative link is the
  better evidence of currentness.
- Third-party manuals or other material without clear redistribution rights.

## Episode lifecycle

```text
scope → research + claims → tagged script → editorial review
      → link/relevance validation → opening preview → full render → human audio QA
      → publication-day source check → hosting handoff
```

Qualified aviation review is welcomed and recorded when available; it is not a
general prerequisite for a public study episode. It does not replace the
required source verification, editorial controls, human listening QA, or the
disclosure that the project is not flight instruction.

## Create an episode package

```sh
npm ci
npm run hooks:install
npm run episode:create -- \
  --id core-01 \
  --slug aeronautical-decision-making-risk-management \
  --title "Aeronautical Decision-Making and Risk Management" \
  --track core
```

Start with the generated research packet and source ledger. Do not use a
previous episode as a template; episodes can retain useful scuffs and history,
but the `templates/` directory is the maintained workflow contract.

## Validate cited sources

Run a no-cost network and metadata validation first:

```sh
npm run sources:validate -- \
  --sources episodes/core-01-aeronautical-decision-making-risk-management/sources.yaml \
  --claims episodes/core-01-aeronautical-decision-making-risk-management/claim-inventory.yaml
```

After editorial approval, run the LLM relevance pass before generating any
audio. It fetches
the public source excerpts and has the model assess whether the excerpt matches
the cited locator and supports the claims mapped to it; it is an advisory
review, not an aviation authority.

```sh
direnv exec . npm run sources:validate -- \
  --sources episodes/core-01-aeronautical-decision-making-risk-management/sources.yaml \
  --claims episodes/core-01-aeronautical-decision-making-risk-management/claim-inventory.yaml \
  --require-llm
```

The command writes `link-validation.yaml` beside the source ledger. Resolve
every failed or inconclusive finding before rendering.

For eCFR citations, validation derives the official, date-pinned exact-section
XML request from the cited `current/title-.../part-.../section-...` URL. Legacy
`validation_url` records that name the title XML and part remain supported, but
the validator adds the cited section itself; it never validates a regulation
from a whole-part response or reader HTML. The report records the effective
validation URL, extracted section identity, and hashes without retaining the
source text.

Network validation runs up to four requests globally and two per origin by
default; the relevance pass runs up to two model assessments. These may be
tuned for a constrained environment with `--http-concurrency` (1–8),
`--http-per-origin` (1–4), and `--llm-concurrency` (1–4). Progress is emitted
as safe NDJSON lifecycle records on stderr while stdout remains human-readable;
use `--heartbeat-seconds` (1–60) to adjust its default ten-second heartbeat.
Only one validation process may own an episode report at a time. If a process
crashes, its lock deliberately blocks rendering and a new run. After confirming
that the recorded same-host process is no longer running, recover it explicitly
with `--recover-stale-lock`; the command will not replace a lock owned by a
live or different-host process.

The release gate also requires a complete two-way mapping between every claim
and its ledger source, and a separate LLM assessment for every mapped claim.
An overall source verdict cannot pass an unsupported or unassessed individual
claim. For episode packages with a co-located `show-notes-manifest.yaml`, it
also validates every HTTPS link in `show-notes.md`: the exact link text and URL
must be declared, identify the declared source document, use a deep locator,
resolve under the same FAA fallback rules, and map only to claims supported by
that source. For PDF citations, the validator extracts text from the exact
`#page=N` target and gives that page—not a document-level excerpt—to the
relevance assessment. New episode packages include this manifest; existing
packages can continue source validation without backfilling one.

Every listener-facing attribution must be a deep citation: it must name the
smallest relevant section, task, paragraph, or page and link to it directly.
For PDFs, use a `#page=N` link and give the relevant section and page in the
ledger. FAA HTML citations must use the applicable section endpoint or anchor;
eCFR citations must use the exact section URL. A handbook landing page,
document cover, statute/part landing page, or a bare document title is not an
acceptable attribution for a material claim.

## Prepare a sealed hosting handoff

After the publication-day source check, approved listening QA, and pre-hosting
validation have all passed, create the hosting input directory with this
command. It copies the exact MP3, listener-facing metadata, and show notes,
then writes `source-release-seal.yaml`. The seal records SHA-256 values for the
whole source episode package and for every file in the handoff. The handoff
root contains only the three sealed payload files plus that seal; verification
rejects extra files, directories, and symlinks. The hosting stager verifies
this exact package before it stages audio.

```sh
npm run release:prepare-handoff -- \
  --episode episodes/core-08-example \
  --out /absolute/path/to/core-08-hosting-handoff
```

The command refuses to overwrite an existing directory. Treat the resulting
directory as an immutable release input: if any source record or audio bytes
change, rerun the gates and create a new handoff directory.

Each sealed handoff also carries a public release key and its content version.
GitHub releases use those values as immutable tags: core lessons use
`episode-07/v0.1.4`, supplemental lessons use `supplement-01/v0.1.0`, and
rough-spots lessons use `rough-spot-001/v0.1.0`. The source IDs such as
`core-07` remain internal production identifiers rather than public tag names.

The retained validation record contains URLs, HTTP metadata, an excerpt digest,
and the structured relevance result—not a copy of the fetched source text.

For an FAA PDF that is occasionally blocked by an access interstitial, a source
ledger may declare an alternate FAA-hosted `programmatic_url`. The validator
only accepts that fallback when the ledger also supplies an FAA page that
explicitly links to it, the exact link text, and a reviewed SHA-256 digest.
When the listener-facing link is available, its bytes must match the alternate;
when it is blocked, the alternate remains usable only if its digest still
matches the reviewed value. A changed digest is a source-review failure, not a
silent substitution.

## Render audio

See [scripts/README.md](scripts/README.md). Audio stays in the ignored
`audio-artifacts/` directory. The default renderer uses OpenAI Realtime with
the documented three-voice profile; it does not publish or distribute audio.

## Contributing corrections

Use the [Source correction issue form](https://github.com/benvon/ppl-podcast/issues/new/choose) for factual,
source, citation, regulatory, numerical, and aircraft-specific corrections.
Include the episode, script section or claim ID, proposed correction, and an
authoritative source with a precise locator. You can also send general feedback
or corrections to [feedback@pplstudyguide.com](mailto:feedback@pplstudyguide.com).
Do not send flight requests, personal flight data, credentials, or private
documents through either channel.

## Historical bootstrap record

[The prior Core 03 bootstrap record](episodes/archive/core-03-bootstrap-test/)
is preserved for posterity. It shows how the process developed, including
superseded release gates and audio experiments; it is not a current episode
template or a release-ready episode. The current Core 03 episode starts fresh
from `templates/`.

## License

Project-authored material is licensed under [Apache-2.0](LICENSE). Linked FAA,
eCFR, manufacturer, and other external source material remains subject to its
own terms.
