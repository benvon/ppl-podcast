# PPL Study Podcast: Production Plan

**Status:** Build-ready editorial and production specification
**Audience:** Public-facing private-pilot airplane students, primarily ASEL
**Podcast host/distribution:** Outside this plan; this plan creates the source, script, audio, and publication artifacts.
**Release principle:** Teach the private-pilot standard completely enough to support sound study and decision-making, without attempting to reproduce every subject in every FAA handbook.

## 1. Product definition and boundaries

This is a three-voice study series organized around private-pilot knowledge domains and the Private Pilot Airplane ACS. The Instructor and Learner carry the lesson; an Announcer provides the podcast introduction, section transitions, and outro. The Pilot's Handbook of Aeronautical Knowledge (PHAK) supplies the conceptual teaching spine, and the Airplane Flying Handbook (AFH) keeps that knowledge connected to the airplane in flight and to the practical training context learners are likely experiencing. The ACS determines coverage and emphasis; current regulations and FAA operational guidance control when they apply.

**Artifact home:** Repository root. Keep production materials here. Rendered masters and release derivatives go in `audio-artifacts/`, which is deliberately Git-ignored; their checksums, duration, and repository-relative paths are recorded in each episode's metadata.

Each core episode targets **30-45 minutes** of finished audio (about 4,200-6,300 spoken words at 140 words per minute). A focused "Rough Spot" episode may be 10-25 minutes when that is the clearest way to answer a single recurring question.

The series is educational material, not flight instruction, operational authorization, legal advice, an aircraft flight manual, or a substitute for a CFI, DPE, POH/AFM, NOTAMs, weather briefing, charts, or current FAA material. In any conflict, the current regulation, approved aircraft documents, and operational information control.

### Audience and aircraft scope

- Speak to a general U.S. private-pilot airplane learner; do not use the creator's name or assume an individual listener's experience or aircraft.
- Use ASEL examples by default, but label them as examples rather than universal rules.
- The uploaded 1977-82 Piper Cherokee Warrior II information manual is a useful **illustrative** source for systems, performance, and limitations. It never establishes a fact for another aircraft, and it is not a substitute for the listener's aircraft-specific approved POH/AFM.
- Use original teaching narration. Do not make the show an audiobook or read long passages from sources. Quote only short text when exact regulatory or procedural wording materially matters; attribute it and then explain it in plain language.

## 2. Per-episode deliverables

Every published episode has a single immutable release directory containing:

1. **Master script** - speaker-labeled, time-budgeted, source-tagged working draft and clean narration copy.
2. **Audio artifact** - mastered MP3 plus lossless master (WAV or FLAC); optional M4A derivative only if the distribution host wants one.
3. **Show notes** - listener-facing summary, learning objectives, key takeaways, safety caveats, and fact-check/source section.
4. **Production record** - episode metadata, source ledger, link-verification results, QA checklist, and release decision.

No audio is treated as final until its script, show notes, source ledger, and QA record agree on the same version.

## 3. Source hierarchy and claim rules

Use the highest applicable source for each claim. A lower source may explain a higher one, but cannot silently replace it.

| Rank | Source type | Use it for | Claim label in script/show notes |
| --- | --- | --- | --- |
| 1 | Binding law and aircraft-specific approved documents | Regulations, legal requirements, operating limitations, procedures/limitations for a specific airplane | `Regulation` or `Aircraft limitation` |
| 2 | FAA certification standards and official FAA operational publications | What the applicant must demonstrate; FAA procedures, terminology, and guidance | `FAA standard` or `FAA guidance` |
| 3 | FAA handbooks, Advisory Circulars, Safety material, and official data products | Explanations, recommended practices, background, and risk framing | `FAA guidance` or `FAA explanation` |
| 4 | Manufacturer manuals and other primary technical material | Clearly bounded aircraft examples and technical detail | `Aircraft example` |
| 5 | Teaching explanation developed for the show | Analogies, memory supports, scenarios, and synthesis | `Teaching explanation` |

### Foundational source register

The local project copies are research conveniences, not frozen publication sources. At release, record the controlling version and direct public link in the source ledger.

| Source | Role | Research-discovery source (never a listener-facing claim attribution) |
| --- | --- | --- |
| Pilot's Handbook of Aeronautical Knowledge, FAA-H-8083-25C | Primary explanation spine | [FAA PHAK landing page](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak); research then records the exact chapter, subsection, page, revision, and page-anchored PDF link |
| Airplane Flying Handbook, FAA-H-8083-3C | Primary flight-context spine | [FAA Airplane Flying Handbook landing page](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook); research then records the exact chapter, section, page, revision, and page-anchored PDF link. Use it to keep non-flying instruction grounded in how the airplane is flown without turning the episode into maneuver instruction. |
| Private Pilot for Airplane Category ACS, FAA-S-ACS-6C | Coverage index and test-standard mapping | [FAA ACS landing page](https://www.faa.gov/training_testing/testing/acs); research then records the exact task/knowledge code, page, revision, and page-anchored PDF link |
| Aeronautical Information Manual | Current FAA operational procedures and terminology | [FAA AIM HTML](https://www.faa.gov/air_traffic/publications/atpubs/aim_html/); research then records the exact AIM paragraph/anchor and effective change |
| 14 CFR Part 61 and other applicable CFR sections | Binding regulatory requirements | [Current eCFR Part 61](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61); research then records the exact controlling eCFR section URL, plus an FAA-hosted source whenever FAA guidance is discussed |
| FAA Advisory Circulars | Non-regulatory FAA guidance | [FAA Advisory Circular index](https://www.faa.gov/regulations_policies/advisory_circulars); research then records the exact AC subsection/page and revision |
| Cherokee Warrior II PA-28-161 information manual | Clearly identified, non-universal aircraft example | Local project copy only; use only after confirming the relevant edition/approval status and do not link it as a current FAA authority |

**Important regulatory distinction:** The eCFR is the current official electronic CFR source, but it is not FAA-hosted. For a statement that says "14 CFR requires," cite the precise eCFR section. The listener-facing fact-check section must also include the pertinent direct FAA-hosted materials used in the episode (ACS, AIM, handbook, AC, or FAA data product). Do not characterize FAA guidance as a regulation.

### Editorial language rules

Every material statement belongs to one of these categories and is signaled in the narration when ambiguity is possible:

- **Regulation:** "14 CFR 91.103 requires..." Cite the exact section. Do not say "the FAA requires" when the source merely recommends a practice.
- **Operating limitation:** "This Warrior II information manual lists..." State the model/weight/configuration and immediately note that the listener must use their own approved POH/AFM.
- **FAA standard:** "The private-airplane ACS expects an applicant to explain..." Cite the ACS task/knowledge or risk-management code.
- **FAA guidance:** "The AIM recommends..." or "The PHAK explains..." Cite the paragraph, chapter, or page.
- **Teaching explanation:** "A useful way to picture this is..." Make clear that this is an explanatory model, not a rule, checklist, or substitute for procedure.

Never use mnemonic shorthand (for example, ARROW or AV1ATE) as if it were regulatory text. Expand it, identify its source, and explain any limits or exceptions.

## 4. Episode design

### Voice roles

**Instructor** carries the lesson: precise definitions, source distinctions, practical risk framing, and corrections. The voice is calm, direct, and non-performative.

**Learner** represents a prepared student: asks the next reasonable question, paraphrases a concept, surfaces a common misconception, or connects it to a scenario. The learner is never artificially helpless and never used for jokes, personality bits, or recurring gimmicks.

**Announcer** delivers the standard series introduction, concise section transitions, and the outro. The delivery is upbeat, clear, and warm—never clownish, theatrical, or promotional.

Dialogue must earn its place. Remove an exchange if the same information would be clearer as a single Instructor sentence. When the Learner voices an incorrect belief, correct it in the next line and restate the correct rule before moving on.

### Standard 30-45 minute template

| Segment | Target | Purpose |
| --- | ---: | --- |
| Cold open and scope | 10-20 sec | State the episode subject and practical relevance only. Do not teach the lesson's crux before the required notice. |
| Required production notice | 20-30 sec | Deliver the approved AI-assisted-production and not-flight-instruction notice verbatim. |
| Objectives and source posture | 1-2 min | State what the listener should understand and distinguish regulation/guidance/example as needed. |
| Core teaching | 15-20 min | Explain the PHAK-centered concepts in a logical sequence. |
| Practical application | 8-12 min | Work 2-3 realistic scenarios; connect knowledge to risk management and decisions. |
| ACS and trouble-spot focus | 5-8 min | Translate the ACS into plain language and resolve predictable errors. |
| Retrieval review | 3-5 min | Learner summarizes; Instructor corrects and gives 3-5 durable takeaways. |
| Close | under 1 min | Point to show notes/current sources; no production chatter. |

### Master-script requirements

Use the following heading structure:

```text
EPISODE: 03 - Stalls, Load Factor, and Spin Avoidance
VERSION: 0.9 (fact-checked)
TARGET: 38 minutes / 5,320 words

[00:00] OPENING
INSTRUCTOR: ...
LEARNER: ...

[01:00] REQUIRED PRODUCTION NOTICE
INSTRUCTOR: This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor. This podcast is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.

[Source: ACS FAA-S-ACS-6C, Area VII, Task B, Knowledge K1; PHAK ch. 5, Stall Characteristics]
[Claim type: FAA standard]

[12:40] SCENARIO: Overshooting base to final
...
```

- Place a source tag after each material claim block; do not interrupt natural narration with citations.
- Include the required production notice, word-for-word, immediately after the opening of every episode. It is exempt from the source-tag requirement because it describes this production process rather than aviation fact.
- Put all exact citations, links, revisions, and verification dates in the source ledger and show notes.
- Maintain a clean `narration.md` derivative with source tags removed only after the tagged master is approved.
- Budget words by section and record the actual word count and rendered duration.
- Avoid invented radio calls, airport instructions, weather, or aircraft checklist steps unless the scenario clearly labels them as hypothetical and no operational action depends on the fictional detail.
- Use [the script drafting playbook](docs/script-drafting-playbook.md) while turning the researched claim map into dialogue. The initial drafting loop is: source-led draft, independent adversarial read, drafting-agent revision, formal source-relevance validation, then human editorial review. Do not defer source validation until after editorial approval or final release work.

### Editorial voice and pacing

- Teach one idea per sentence whenever a distinction, decision point, or safety consequence matters. Prefer two or three short sentences to a coverage-driven list of parallel nouns or outcomes.
- Do not front-load a dense overview. Let the Learner’s first plausible question open the explanation, then introduce the regulatory and ACS context where it helps the listener understand why the concept matters.
- Define a term before using it as a decision backstop. If a term needs fuller treatment later, introduce it briefly and explicitly say that the episode will return to it.
- State well-supported teaching conclusions directly. The production notice and source tags already establish the episode boundary; do not repeatedly restate that FAA guidance is not a regulation unless the distinction itself is the lesson.
- Define aircraft-document terminology once at first material use. Use `POH/AFM` thereafter when relevant; do not repeat generic references to “approved documents” unless the boundary is central to the point.
- When teaching personal minimums, present them as deliberate, individual guardrails. They are reviewed as training and demonstrated proficiency change, outside the pressure of a particular flight; they are not negotiated upward to preserve a trip in progress.

## 5. Fact-check and research workflow

### Research packet

Before drafting, create a source packet that contains:

1. Episode question and learning objectives.
2. Relevant ACS task, knowledge, risk-management, and skill references.
3. PHAK chapter/section references and current FAA handbook revision/addendum check.
4. Applicable CFR sections and AIM paragraphs, with an explicit classification of each as regulation or guidance.
5. Aircraft-specific sources only when the episode uses a labeled example.
6. Likely misconceptions, each paired with the correction and source.
7. A claim inventory: every statement that is quantitative, prescriptive, regulatory, aircraft-specific, or safety-critical.

Do not begin full scripting with an unresolved source conflict. Escalate it as `OPEN TECHNICAL QUESTION` and either resolve it with a primary source, obtain qualified review when available, or cut it from the episode.

### Initial drafting loop

The initial draft is not ready for source-relevance review or script approval when the first source-led draft is complete. Run this closed loop first:

1. The current Sol model with high reasoning produces the source-led initial package: research packet, reciprocal source ledger and claim inventory, source-tagged master script, derived narration, show notes, metadata, and production log.
2. A separate agent that did not draft the episode performs an adversarial spoken-script read. It checks grammar, complete thoughts, clear referents and causal chains, earned Learner turns, coherent internal callbacks and call-forwards, first-listen comprehension, scope, and source-tagged claims. Its report distinguishes required findings from optional refinements.
3. The drafting agent incorporates every required finding with the minimum source-supported revision, keeps the script, narration, claims, show notes, metadata, and source ledger consistent, and records the findings and resolutions in `production-log.md`.
4. Rerun the script-structure, narration-derivation, source/claim mapping, and relevant repository checks. Then run formal source-relevance validation with `--require-llm`, which checks source-tagged spoken passages as well as claims, locators, links, and source records. Resolve every finding and rerun it until clean.
5. Turn the clean, source-validated script over for human editorial review. If that review changes factual spoken prose, source tags, claims, sources, or show notes, return to step 4 before rendering.

The adversarial review challenges the draft; it does not replace formal source-relevance validation, human editorial judgment, or a qualified aviation review when one is available.

### Two-pass fact check

**Pass A - Draft verification**

- Map every source-tagged script block to a source ledger entry.
- Check terminology, units, definitions, ACS codes, section numbers, and quantitative examples.
- Confirm a script does not turn a rule of thumb, technique, or aircraft example into a universal fact.

**Pass B - Release verification**

On the planned publication day, independently re-open every external link, confirm the page/PDF title and current revision/effective date, and compare material claims against the current source.

- For every FAA link: record `https` URL, page title, document number, revision/change/effective date if shown, UTC verification time, and result.
- For regulations: record the eCFR title/section, currentness date shown by eCFR, UTC verification time, and result.
- Resolve changed or superseded material before audio export. A changed but non-material source gets an updated ledger and release note; a material change requires script/show-notes revision and a new audio render.
- Treat a redirect to a general FAA page as insufficient if the show notes claim to link to a specific source. Use the direct, current section endpoint or anchored document location.

### Automated link and relevance validation

Run `scripts/validate-source-links.cjs` against each episode's `sources.yaml` and `claim-inventory.yaml`. The deterministic pass enforces HTTPS, a specific locator, and a deep citation target; follows a bounded redirect chain; records the final URL/status/content type/title; and fails closed for unreachable or malformed links. It also requires every claim to name valid ledger sources and every named source to reciprocally list that claim in `supports_claims`. PDFs require `#page=N` and a locator that names the relevant page and section/task. FAA HTML sources require a specific section endpoint or anchor, and eCFR sources require the precise section URL. Run it with `--llm --require-llm` before a public candidate release to obtain a structured advisory assessment of whether each fetched source excerpt supports both the cited locator and every individual claim mapped to it.

If an FAA PDF is known to encounter an access interstitial, the ledger may add a distinct FAA-hosted `programmatic_url` and a `programmatic_attestation` record. That record must name an FAA human-facing page that explicitly links to the alternate, the exact link text, and a reviewed SHA-256 digest. The validator verifies the FAA page link and digest on every run; when the listener-facing PDF is reachable, it also requires the two copies to have identical bytes. If the listener-facing endpoint is blocked, the alternate can pass only through that FAA-page-and-digest attestation. Any digest change fails closed for release review.

The LLM relevance check is not an aviation authority and cannot cure a bad source, a stale revision, or an unsupported claim. Resolve every `does_not_support`, `insufficient_evidence`, missing-claim, missing per-claim assessment, mismatched claim/source mapping, and non-text-source finding. For a PDF or another source from which no safe text is extracted, add a short, reviewed `relevance_excerpt` to the source ledger or perform a documented manual review.

### Source ledger schema

Store as `sources.yaml` beside the episode. One entry may support several claims, but every material claim needs at least one entry ID.

```yaml
episode_id: core-03
verification_date: 2026-08-11
sources:
  - id: acs-vii-b-k1
    authority: faa_standard
    title: "Private Pilot for Airplane Category ACS"
    document_id: "FAA-S-ACS-6C"
    locator: "Area VII, Task B, Knowledge K1, p. VII-8"
    url: "https://www.faa.gov/training_testing/testing/acs/private_airplane_acs_6.pdf#page=52"
    revision: "November 2023; effective May 31, 2024"
    verified_at_utc: "2026-08-11T18:00:00Z"
    link_status: 200
    supports_claims: ["stall-relations", "scenario-bank-turn"]
  - id: phak-chapter-example
    authority: faa_guidance
    title: "Pilot’s Handbook of Aeronautical Knowledge, Chapter 4: Principles of Flight"
    document_id: "FAA-H-8083-25C"
    locator: "Chapter 4, Air Is a Fluid, p. 4-2"
    url: "https://www.faa.gov/sites/faa.gov/files/06_phak_ch4.pdf#page=2"
    programmatic_url: "https://www.faa.gov/sites/faa.gov/files/06_phak_ch4_0.pdf"
    programmatic_attestation:
      url: "https://www.faa.gov/regulationspolicies/handbooksmanuals/aviation/phak/chapter-4-principles-flight"
      link_text: "06_phak_ch4_0.pdf"
      sha256: "reviewed SHA-256 digest"
    revision: "FAA-H-8083-25C, 2023"
    verified_at_utc: "2026-08-11T18:00:00Z"
    link_status: 200
    supports_claims: ["air-is-fluid"]
  - id: cfr-91-103
    authority: regulation
    title: "14 CFR 91.103 - Preflight action"
    locator: "91.103"
    url: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91/subpart-B/section-91.103"
    revision: "current eCFR at release"
    verified_at_utc: "2026-08-11T18:00:00Z"
    link_status: 200
    supports_claims: ["preflight-requirement"]
```

`locator`, `verified_at_utc`, `link_status`, and `revision` are mandatory for every public link. The locator must identify the smallest relevant source unit, not merely a document or chapter. The dates above illustrate format only; they are not a release verification record for any future episode.

## 6. Listener-facing show notes

Publish a `show-notes.md` rendered from the approved source ledger. It must stand on its own if the listener never sees the script.

```markdown
# Episode 03: Stalls, Load Factor, and Spin Avoidance

**Runtime:** 38:12
**For:** Private-pilot airplane study
**Published:** YYYY-MM-DD
**Source verification:** YYYY-MM-DD (UTC)

## Production notice
This podcast uses AI-assisted production. The voices in this episode are AI-generated, not human speakers. Each episode's factual content is reviewed against cited source material before audio production, but it is not reviewed by a certificated flight instructor. This podcast is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your aircraft's approved documents.

## In this episode
- ...

## What to retain
1. ...

## Scenario questions
1. ...

## Fact-check and primary sources

| Topic | What this episode says | Authority | Direct source | Verified |
| --- | --- | --- | --- | --- |
| Stall relationships | ... | FAA standard | [FAA-S-ACS-6C, Area VII Task B K1, p. VII-8](URL#page=52) | YYYY-MM-DD UTC |
| Stall explanation | ... | FAA guidance | [PHAK, Ch. 5, specific stall subsection and page](URL#page=N) | YYYY-MM-DD UTC |

## Important context
This episode is study material. Follow current regulations, FAA operational information, and your aircraft's approved POH/AFM; work with a qualified instructor for flight training.
```

Rules:

- Include direct, human-readable links, not shortened links or a private storage URL.
- Include the access/revision date for potentially changing materials, especially AIM, regulations, weather products, chart data, ACS editions, and handbook addenda.
- Links must point to the smallest relevant source unit. They should support the specific assertion in the episode, not merely a generic FAA home page, document landing page, whole-PDF cover, whole regulation part, or chapter title. Use an HTML section endpoint/anchor where available; use `#page=N` plus the named subsection for a PDF; use an exact eCFR section URL for regulations.
- Include FAA-hosted authoritative sources in every episode's fact-check table. If a regulation is cited, list the eCFR link separately and label it `Regulation - eCFR`.
- Use a plain-language correction note if an episode has been superseded: what changed, why it matters, and which audio/show-note version is current.

## 7. Audio production

### Source of truth and rendering

The approved `master-script.md` is the source of truth. TTS inputs are derived from `narration.md`; never edit words directly in the audio tool without applying the same change to the script and incrementing the version.

The default reusable renderer is `scripts/render_episode_realtime.cjs`. It uses `gpt-realtime-2.1` over an authenticated WebSocket session, with `marin` for Instructor and `cedar` for Learner, as approved in `series/voice-profile.yaml`. It writes 24 kHz mono PCM WAV segments, applies a short fade at each rendered-segment edge before stitching, retains a lossless master, creates a timestamped MP3 derivative, and records the API response-usage fields in the ignored render manifest so the cost estimate can be checked later. Every master-script section heading becomes an embedded MP3 ID3 chapter marker; the renderer derives each marker from the actual stitched-audio boundary, validates the exported markers with `ffprobe`, and records their final timestamps in the render manifest. That provides the required delivery format for Apple Podcasts and Overcast. After every assembly, it writes an audio-quality report that verifies the WAV structure, final-file decode, 24 kHz mono format, duration agreement, clipping statistics, and discontinuities at known stitches. This is a technical gate, not a substitute for full human listening QA: a listener must still review the entire candidate for garbled synthesis, pronunciation, pacing, content alignment, and useful chapter titles. It deliberately leaves Realtime `audio.output.speed` unset: natural pace and inflection belong in the role instructions, while post-generation speed processing produced audible artifacts in testing. The renderer preserves written scripts but expands standalone `AI` to `artificial intelligence` only in the model input; this avoids ambiguous disclosure pronunciation without changing the approved public text. The renderer uses the pinned `ws` Node dependency plus `ffmpeg` and `ffprobe`; install dependencies with `npm ci`. It requires `OPENAI_API_KEY` only in the environment and never accepts a key through a file, command argument, or committed configuration. `scripts/render_episode_audio.py` is a legacy renderer retained solely to reproduce pre-migration candidates; `macos-say` remains an offline fallback, not the preferred public-release voice path.

The render manifest binds its embedded chapter list to the SHA-256 of the MP3 that contains it. If a revised segment changes timing, reassemble the complete episode so later marker positions are recalculated from that revised audio. The chapter-review page carries the same audio hash in its filename, page metadata, and playback URL. Hosting handoff must preserve that hash alongside the published audio checksum so the site’s rendered list and the MP3 always identify the same marker set.

For long scripts in a time-bounded runner, use `--work-dir`, `--render-only`, and a small `--segment-start`/`--segment-end` range. The Realtime renderer makes a separate bounded WebSocket request for each speaker segment, skips completed segments only when its settings lock matches, and writes a usage sidecar with each finished segment. Once every segment is present, use `--assemble-only` with the same timestamp and working directory. This makes interrupted renders resumable without regenerating already billed segments. A selected subrange assembles to a clearly named `preview-###-###` artifact and must not be mistaken for a full candidate.

The renderer itself has no whole-episode wall-clock limit: `--segment-timeout` bounds only an individual provider request. Run a normal full render from a local terminal when the process may take several minutes. If a calling environment imposes a shorter foreground-command lifetime, use the resumable range workflow instead; do not rely on detached child processes surviving that environment.

After editorial fact-check and candidate source validation, render a candidate with:

```sh
npm run render:realtime -- \
  --script episodes/core-03-stalls-load-factor-spin-avoidance/master-script.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp 20260811T210000Z \
  --work-dir audio-artifacts/core-03-realtime-20260811T210000Z.segments \
  --render-only

npm run render:realtime -- \
  --script episodes/core-03-stalls-load-factor-spin-avoidance/master-script.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp 20260811T210000Z \
  --work-dir audio-artifacts/core-03-realtime-20260811T210000Z.segments \
  --assemble-only \
  --format mp3
```

The resulting `core-03-YYYYMMDDTHHMMSSZ.mp3`, its `.master.wav`, and render manifest are candidate artifacts until the complete human listen and release QA are recorded.

- Assign three clearly different but natural voices. Maintain the approved `series/voice-profile.yaml` with provider, model, voice ID, pace, continuity context, spacing, pronunciation/delivery instructions, and date or version tested. The delivery profile must ask for consistent vocal identity across all segments, alert but restrained inflection, and no exaggerated emotion, comedy, or gimmicky delivery. Change it only after approving a representative preview, then render a new candidate rather than mixing settings into an existing one.
- Render one scene/section at a time so mispronunciations or factual corrections can be regenerated without replacing the entire episode.
- Add a short lead-in before the first spoken word and deliberate silence at turn, speaker, and section boundaries. These pauses should signal a new thought without music, sound effects, or theatrical transitions.
- Render complete speaker turns, not isolated sentences. Supply bounded adjacent dialogue as unspoken continuity context where the TTS provider supports instructions. Technical terms must remain accurate, but surrounding prose and delivery should prevent them from becoming repeated catchphrases.
- Include a pronunciation table for FAA, CFR, ACS, V-speeds, units, airport names, and symbols. Spell out unambiguous spoken forms (for example, "Section ninety-one point one-zero-three") in the TTS derivative when needed.
- Preserve raw voice renders, the editable session/project, a lossless master, and the published MP3.
- Use original intro/outro audio or properly licensed material. Do not embed unlicensed music, ATC recordings, manufacturer figures, or third-party audio.

### Audio acceptance targets

- Clearly intelligible on ordinary earbuds and vehicle playback.
- Consistent speaker loudness, no abrupt cuts, clipped syllables, repeated phrases, or uncorrected TTS mispronunciations.
- A natural conversational pace; pauses are allowed when they improve comprehension.
- Final duration remains within the episode target; optimize for clarity, not maximum word count.
- Manual start-to-finish listen by someone using the master script as a spot-check reference, with special attention to every number, unit, regulation, and warning.

## 8. File and folder conventions

Use stable episode IDs. Do not renumber released files if the roadmap changes.

```text
ppl-podcast/
  README.md
  series/
    series-manifest.yaml
    editorial-style-guide.md
    source-register.yaml
    rough-spots-backlog.yaml
  episodes/
    core-00-how-to-use-this-series/
      episode.yaml
      research-packet.md
      claim-inventory.yaml
      sources.yaml
      master-script.md
      narration.md
      show-notes.md
      qa-checklist.md
      production-log.md
      audio-manifest.yaml       # checksums and repository-relative paths/host URLs for ignored audio assets
    rough-001-vfr-weather-minimums/
      ...
  scripts/
    render_episode_realtime.cjs   # default candidate renderer
    render_episode_audio.py       # legacy candidate reproduction only
  audio-artifacts/              # Git-ignored rendered masters and derivatives
  templates/
    episode.yaml
    sources.yaml
    master-script.md
    show-notes.md
    qa-checklist.md
```

`source-release-seal.yaml` is generated beside the handoff's `episode.yaml`,
`show-notes.md`, and `audio.mp3`; it is not edited in the source episode
directory.

- Use lowercase kebab-case filenames and `core-NN` / `rough-NNN` episode IDs.
- Keep raw renders, production sessions, lossless masters, and published audio in the Git-ignored `audio-artifacts/` directory; `audio-manifest.yaml` records their paths/URLs, checksums, duration, and version.
- Publish only the approved audio derivative. This workspace contains the durable script, source, QA, metadata, and audio-manifest artifacts needed to reproduce it.
- Preserve every released version. Corrections create `version: 1.1.0`, a new audio filename, updated show notes, and a correction note rather than silently overwriting history.
- Do not store FAA source PDFs as the sole proof of currentness; store their URL, revision, locator, and verification record.

## 9. Episode metadata schema

Store the canonical metadata in `episode.yaml`.

```yaml
id: core-03
series: ppl-study-podcast
title: "Stalls, Load Factor, and Spin Avoidance"
slug: stalls-load-factor-spin-avoidance
track: core                 # core | rough-spot | update
status: planned             # planned | research | drafted | fact_checked | rendered | qa | released | superseded
version: 0.1.0
published_at: null
runtime_target_minutes: 38
runtime_actual_seconds: null
word_count: null
speakers: [instructor, learner]
audience: "Private pilot airplane learners"
aircraft_scope: "General ASEL; any Warrior references are illustrative only"
acs_references: ["PA.VII.B.K1", "PA.VII.C.K1"]
cfr_references: []
aim_references: []
phak_references: ["Chapter 5"]
learning_objectives:
  - "Explain that a stall results from exceeding critical angle of attack."
trouble_spots:
  - "Treating published stall speed as a single universal number"
dependencies: []
source_verification:
  status: pending
  verified_at_utc: null
  verifier: null
audio:
  manifest: audio-manifest.yaml
  status: not_rendered
  chapter_markers: pending_render
  publication_day_validation: pending
hosting:
  metadata: hosting-metadata.yaml
  handoff_seal: source-release-seal.yaml
  handoff_status: draft
public_notes: show-notes.md
qa: qa-checklist.md
supersedes: null
```

`episode.yaml` is the only mutable production-status authority. The top-level
`status` describes the lifecycle, while `source_verification`, `review`,
`audio`, and `hosting` record their specific gates. `audio-manifest.yaml` and
`hosting-metadata.yaml` hold evidence and listener-facing release facts, not
duplicate workflow status. `master-script.md` is speech metadata and does not
carry a production-status line.

## 10. Production stages and release gates

| Stage | Output | Exit gate |
| --- | --- | --- |
| 0. Backlog and scope | Episode card | One question, audience, target duration, and reason it belongs in core or Rough Spots. |
| 1. Research | Research packet and claim inventory | ACS coverage identified; source hierarchy applied; open technical questions resolved or removed. |
| 2. Outline | Time-budgeted outline | Complete for stated objectives; no source-free safety or regulatory claims. |
| 3. Draft and adversarial revision | Tagged master script, independent findings, and revised narration-ready package | The source-led initial draft received an independent adversarial spoken-script read; every required finding was incorporated by the drafting agent, logged, and rechecked. |
| 4. Source validation | Source-validated draft and report | Formal `--require-llm` validation confirms every material claim, locator, show-note assertion, and source-tagged spoken passage against current sources. All findings are resolved before editorial review. |
| 5. Editorial review | Narration-ready script | Human editorial review begins with the clean source-validation result. Clear distinction among regulation, FAA guidance, and explanation; non-gimmicky dialogue; public-audience language. Qualified aviation review is welcome and recorded when available, but is not a general release prerequisite. Material factual revisions return to Stage 4. |
| 6. Render and mix | Raw renders, session, lossless master, candidate MP3 | Two voices are distinct, intelligible, correctly pronounced, and in sync with the approved script. |
| 7. QA | Completed QA checklist | Full listen completed; metadata, links, script, audio, and notes use same version. |
| 8. Release package | Immutable episode directory | Publication date and verification time recorded; status changes to `released`. |
| 9. Maintenance | Correction/update record | Source-change or listener issue triaged; material changes result in a versioned update. |

## 11. QA checklist

Complete `qa-checklist.md` before release.

### Editorial and learning

- [ ] The title, objectives, and actual content agree.
- [ ] The verbatim required production notice follows the opening in the script and appears in the show notes.
- [ ] The episode covers its ACS-mapped objective(s) in plain language, including relevant risk management.
- [ ] The PHAK is used as a teaching spine, not copied as an audiobook.
- [ ] The source-led initial draft received an independent adversarial spoken-script read. Every required finding was incorporated by the drafting agent, and the findings and resolutions are recorded in `production-log.md`.
- [ ] Formal `--require-llm` source-relevance validation was clean after the adversarial redraft and before human editorial review. Any later factual editorial revision was validated again before rendering.
- [ ] The Learner dialogue advances comprehension; there is no fake banter, humor routine, or persona gimmick.
- [ ] Every misconception is immediately and unambiguously corrected.
- [ ] All scenarios distinguish general teaching from real-world flight authority.
- [ ] Aircraft examples identify the model/source and tell listeners to use their own approved POH/AFM.

### Fact and source integrity

- [ ] Every material claim block has a source-ledger mapping.
- [ ] Each claim is correctly labeled as regulation, operating limitation, FAA standard, FAA guidance, aircraft example, or teaching explanation.
- [ ] Current ACS document number/revision, PHAK revision/addendum, AIM effective date/change, and CFR section were checked at release.
- [ ] Each show-notes fact-check link opens, is HTTPS, has a specific locator, and reaches the cited section, anchor, or PDF page rather than a document/part landing page.
- [ ] Every episode includes at least one direct FAA-hosted authoritative link; regulatory claims also link to precise eCFR sections.
- [ ] No unsupported safety-critical, numeric, prescriptive, or aircraft-specific claim remains.
- [ ] Source-link validation passes; every LLM relevance finding is either `supports`/`partially_supports` with a documented scope or is resolved before release.

### Audio and publication package

- [ ] A reviewer listened to the whole candidate audio and checked all numbers, units, acronyms, V-speeds, and regulatory citations against the master script.
- [ ] A reviewer listened to the automatically generated front-matter check and confirmed the cold open and required notice occur before the lesson body.
- [ ] A reviewer confirms the rendered notice says “artificial intelligence-assisted production” clearly while the master script and show notes retain the approved written wording “AI-assisted production.”
- [ ] Instructor and Learner voices are consistent and naturally paced.
- [ ] No clipped/corrupt/repeated audio, mispronunciation, or awkward edit remains.
- [ ] Master script, narration copy, audio filename/tags, show notes, and metadata share the same title, ID, version, and runtime.
- [ ] Lossless master and editable production session are retained.

### Hosting handoff

- [ ] `hosting-metadata.yaml` contains the approved stable ID/GUID, title, description, UTC publication time, duration, season/episode number, explicit flag, current version, and script/show-notes/source-validation references.
- [ ] Its `publisher_release` object matches the listener-facing episode contract used by `ppl-podcast-hosting`; that publisher writes immutable audio keys, byte count, and checksum after private staging.
- [ ] The hosting handoff contains no credential, local filesystem path, or unpublished audio artifact.
- [ ] The hosting handoff was generated after `release:prehost` passed; its `source-release-seal.yaml` binds the staged MP3, listener-facing metadata, and show notes to the reviewed source package.

## 12. Initial core roadmap

The roadmap is sequenced for learning, not by PHAK chapter. It remains adjustable; released IDs remain stable and new subjects are added rather than forcing a renumber.

| ID | Working title | Primary focus | Core anchors |
| --- | --- | --- | --- |
| core-00 | How to Use This Series and the PPL Knowledge Framework | Using ACS, source types, study method, and safety boundaries | ACS, Part 61, PHAK Ch. 1 |
| core-01 | Aeronautical Decision-Making and Risk Management | PAVE, 5P, hazardous attitudes, go/no-go reasoning | PHAK Ch. 2, ACS risk-management tasks |
| core-02 | Principles of Flight: Lift, Drag, and Angle of Attack | The foundations needed for later stalls and performance | PHAK Ch. 4 |
| core-03 | Stalls, Load Factor, and Spin Avoidance | Stability, turns, accelerated stalls, base-to-final risk | PHAK Ch. 5, ACS Area VII |
| core-04 | Flight Controls, Stability, and Left-Turning Tendencies | Controls, adverse yaw, trim, propeller effects | PHAK Chs. 5-6 |
| core-05 | Piston Engines, Propellers, and Combustion | Reciprocating-engine basics and operating awareness | PHAK Ch. 7 |
| core-06 | Fuel, Mixture, Carburetion, Oil, Cooling, and Electrical Systems | System relationships and common failure/risk points | PHAK Ch. 7, labeled Warrior example |
| core-07 | Flight Instruments and Failure Recognition | Pitot-static, gyro, compass errors, failure indications | PHAK Ch. 8 |
| core-08 | Aircraft Documents, Airworthiness, Inspections, and Maintenance | Required documents, inspections, discrepancies, owner/pilot boundaries | PHAK Ch. 9, CFR as applicable |
| core-09 | Weight, Balance, and Center of Gravity | Loading, CG effects, calculation reasoning | PHAK Ch. 10, ACS performance/planning |
| core-10 | Aircraft Performance and Density Altitude | Takeoff/landing/climb performance and chart-based decisions | PHAK Ch. 11, POH as example only |
| core-11 | Weather Theory: Pressure, Stability, Moisture, and Clouds | The physical model behind forecast interpretation | PHAK Ch. 12 |
| core-12 | Weather Hazards: Fronts, Thunderstorms, Icing, Fog, and Wind | Hazard recognition and conservative decision making | PHAK Ch. 12, FAA weather guidance |
| core-13 | Weather Information and Preflight Decisions | METARs, TAFs, forecasts, reports, briefing, decision integration | PHAK Ch. 13, AIM/FAA weather sources |
| core-14 | Airport Operations and Surface Safety | Signs, markings, lighting, runway-incursion avoidance | PHAK Ch. 14, AIM |
| core-15 | Traffic Patterns, Nontowered Operations, and Right of Way | Pattern choices, communications, visual scanning, rule/guidance distinctions | AIM, CFR 91.113 as applicable |
| core-16 | Airspace, Equipment, and VFR Weather Minimums | Classes, entry requirements, cloud clearances, equipment, Special VFR | PHAK Ch. 15, CFR/AIM |
| core-17 | Charts, Pilotage, and Dead Reckoning | Sectional interpretation and basic navigation | PHAK Ch. 16, chart user guidance |
| core-18 | VOR, GPS, Radar Services, and Navigation Systems | Practical capabilities, limitations, and service distinctions | PHAK Ch. 16, AIM |
| core-19 | Cross-Country Planning, Fuel, and Diversions | Route, performance, fuel, alternatives, in-flight replanning | ACS, PHAK Chs. 11/16, CFR 91.103 |
| core-20 | Aeromedical Factors and Human Performance | IMSAFE, hypoxia, vision, fatigue, medications, stress | PHAK Ch. 17, FAA aeromedical guidance |
| core-21 | Private-Pilot Privileges, Limitations, and Currency | Part 61 privileges, limits, endorsements, currency; source-sensitive regulatory episode | Part 61, ACS |
| core-22 | VFR Operating Rules and Preflight Responsibilities | Part 91 rules that affect routine private operations | Part 91, AIM, ACS |
| core-23 | Emergencies and Abnormal Situations | Aviate/navigate/communicate, systems knowledge, emergency authority, aircraft-specific checklist boundary | PHAK/AIM, aircraft documents where relevant |
| core-24 | Night Operations | Vision, lighting, planning, weather, illusions, equipment, currency | PHAK, AIM, CFR/ACS |
| core-25 | The Checkride Oral: Connecting Knowledge, Risk, and Skill | Scenario-based integration rather than last-minute memorization | Whole ACS |

## 12.1 Planned supplemental episodes

Planned deep-dives into topics of interest that weren't covered in depth in the intial set of episodes.

| ID | Working title | Primary focus | Core anchors |
| --- | --- | --- | ---
| supplement-01 | Constant-Speed Propellers | Governor, blade angle, rpm, manifold pressure, and practical system interpretation | PHAK Ch. 7, ACS systems knowledge |
| supplement-02 | Compass Navigation and Modern Navigation Cross-Checks | Compass-only orientation, pilotage and dead reckoning, then integration with VOR and GPS information | PHAK Chs. 8 and 16, AIM Ch. 1 |
| supplement-03 | MOSAIC, Light-Sport Certification, and Sport-Pilot Maintenance Privileges | What MOSAIC changes, light-sport certification context, and the boundaries of sport-pilot maintenance privileges | PHAK Ch. 9 MOSAIC addendum, Parts 1/21/43/61/91 as applicable |
| supplement-04 | Stalls and Spins: A Deeper Study | Stall recognition, spin aerodynamics, risk factors, avoidance, and recovery concepts | PHAK Ch. 5, AFH Ch. 5, ACS Area VII |
| supplement-05 | Airspeeds: Why IAS, CAS, TAS, and Groundspeed Differ | Pitot-static indication, instrument and installation corrections, density correction, wind, and the distinct planning use of each value | PHAK Ch. 8, aircraft POH/AFM |
| supplement-06 | PIREPs, AIRMETs, and SIGMETs | Report types, how the products appear in a briefing, their practical uses, and their limits | PHAK Ch. 13, AIM Ch. 7, Aviation Weather Center guidance |

### Open-ended Rough Spots track

Do not pre-commit a final count. Add targeted episodes from actual learner questions, mock-oral misses, CFI feedback, recurring written-test errors, or post-release listener questions. First candidates:

- VFR weather minimums without mnemonic-only thinking
- Density altitude and performance traps
- V-speeds, what changes them, and what does not
- Base-to-final stall/spin risk
- Airworthiness: documents, inspections, and who may do what
- Compass errors and navigation cross-checks
- Reading a sectional and planning a diversion
- METAR/TAF interpretation and what forecasts cannot promise
- Right-of-way and nontowered pattern decisions

Each Rough Spot episode uses the same source hierarchy, ledger, show-notes fact-check section, and QA release gate as a core episode.

## 13. Maintenance and change policy

- Recheck source currency before every new publication and before republishing an older episode.
- Review all released episodes at least annually, and immediately after an ACS revision, material AIM/CFR change, changed FAA handbook addendum, or substantiated listener correction.
- Mark an episode `superseded` in its metadata and show notes if a change materially affects its advice. Keep its historical audio but make the current version unmistakable.
- Record the source change, impacted claims, decision, reviewer, and release version in `production-log.md`.
- Keep the source ledger and master script as the durable maintenance assets; audio is a renderable derivative.

## 14. First production sprint

Build the system by completing one high-value pilot episode before batching the series:

1. Create the folder/templates and `series-manifest.yaml`.
2. Produce `core-03` (Stalls, Load Factor, and Spin Avoidance) through the full workflow.
3. Invite qualified aviation review where available, record it when obtained, and use the open correction process to incorporate substantiated feedback.
4. Listen in the intended use contexts (earbuds, vehicle, normal speakers) and revise the template/voice profile once.
5. Freeze the accepted templates, then produce in small batches of two or three episodes, not the whole roadmap at once.

This pilot is intentionally chosen because it tests the system's most important qualities: technical explanation, immediate correction of misconceptions, ACS integration, safety framing, scenario teaching, and source accuracy.
