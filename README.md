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
scope → research + claims → tagged script → link/relevance validation
      → editorial review → opening preview → full render → human audio QA
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

Then run the LLM relevance pass before a public candidate release. It fetches
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
every failed or inconclusive finding before release.

The release gate also requires a complete two-way mapping between every claim
and its ledger source, and a separate LLM assessment for every mapped claim.
An overall source verdict cannot pass an unsupported or unassessed individual
claim.

Every listener-facing attribution must be a deep citation: it must name the
smallest relevant section, task, paragraph, or page and link to it directly.
For PDFs, use a `#page=N` link and give the relevant section and page in the
ledger. FAA HTML citations must use the applicable section endpoint or anchor;
eCFR citations must use the exact section URL. A handbook landing page,
document cover, statute/part landing page, or a bare document title is not an
acceptable attribution for a material claim.

The retained validation record contains URLs, HTTP metadata, an excerpt digest,
and the structured relevance result—not a copy of the fetched source text.

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

[Core 03](episodes/core-03-stalls-load-factor-spin-avoidance/) is a preserved
bootstrap/test record. It shows how the process developed, including
superseded release gates and audio experiments; it is not a current episode
template or a release-ready episode. New work starts from `templates/`.

## License

Project-authored material is licensed under [Apache-2.0](LICENSE). Linked FAA,
eCFR, manufacturer, and other external source material remains subject to its
own terms.
