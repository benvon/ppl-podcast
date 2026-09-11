# Audio rendering runbook

`render_episode_realtime.cjs` is the default renderer for new candidate audio.
It uses OpenAI Realtime `gpt-realtime-2.1`, `marin` as Instructor, `cedar` as
Learner, and `ballad` as Announcer. The legacy Python renderer exists only to
reproduce an older two-voice candidate and must not be selected for a new
episode.

## One-time setup

```sh
npm ci
npm run hooks:install
```

Install `ffmpeg` separately and provide `OPENAI_API_KEY` through the local
environment (for example, `direnv`). Never commit an API key or pass one on the
command line.

The installed pre-commit hook checks staged paths and content for accidental
environment files, private keys, generated audio, dependency directories,
Python bytecode, common credential formats, and absolute local paths. It never
prints a matched credential value. Run it without creating a commit with:

```sh
npm run precommit:check
```

## Candidate workflow

1. Before full prose drafting, obtain authorization, mark the dedicated QA item, and run `npm run sources:preflight -- --episode episodes/EPISODE --require-llm` as described in `docs/script-drafting-playbook.md`. The command consumes that authorization for this single run and records its identity plus input-bound evidence from independently fetched citation text in `claim-source-preflight.yaml`; a retry requires fresh authorization. After any factual or spoken-script edit, run `npm run episode:script-review -- --episode episodes/EPISODE --reset`. It clears the prior editorial, source-relevance, audio, and hosting state and fingerprints the changed master script. After source relevance passes and human editorial approval is renewed, run `npm run episode:script-review -- --episode episodes/EPISODE --approve` to bind that approval to the current master-script bytes. Before the formal source-relevance or rendering call that sends unpublished material to OpenAI, obtain explicit current-turn authorization for that specific use. Then run
   `sources:validate --require-llm` and resolve every finding. The validator
   records the source-review outcome and report timestamp in `episode.yaml`
   while it owns the validation lock; do not edit that state by hand. For a
   contract-v2 package, the renderer also requires the same current,
   input-bound claim-source preflight evidence that pre-hosting checks; it
   cannot send audio requests with missing, stale, or unsupported locator
   evidence. A
   failed rerun writes a blocking marker beside the canonical report; only a
   later clean rerun clears it. The renderer verifies that evidence before it
   sends any audio request.
2. Derive the clean TTS input from that approved script; do not edit the
   narration copy independently.

   ```sh
   node scripts/derive-narration.cjs \
     --script episodes/EPISODE/master-script.md \
     --output episodes/EPISODE/narration.md
   ```

3. Render the opening preview (segments 1-5) and listen before spending on the
   complete episode.
4. Render the full episode in bounded ranges if necessary. The work directory
   is safe to resume only if `render-settings.json` matches exactly.
5. Assemble the complete range. The renderer adds an 8 ms fade at each rendered-segment edge and writes an automatic post-assembly report beside the manifest. For MP3 output, it also embeds ID3 chapter markers using the master script’s section headings and verifies them with `ffprobe`. It verifies WAV structure, 24 kHz mono format, MP3/WAV decode, output duration, clipping statistics, and abrupt sample jumps at every known stitch.
6. Perform the required full listening QA. The automated report catches technical corruption and hard joins; it cannot judge synthesis artifacts, garbled words, pronunciation, pacing, or whether a chapter title is useful to a listener.
7. Before handing off to hosting, run `npm run release:prehost -- --episode episodes/<episode-id-and-slug>`. It checks the approved MP3 against its final render, chapter, and audio-quality records—including re-reading the embedded MP3 chapters and comparing them to the candidate render record. The renderer itself accepts only a current `narration.md` derivative and records its checksum. The pre-hosting check verifies that binding, the release metadata and source-validation record, every show-note link mapping, and the absence of duplicate public production notices.

Use the same timestamp and work directory for the render and assembly commands that create one candidate. When a revised segment changes duration, reassemble the complete range: the renderer recalculates every later chapter marker from the new stitched audio. You may keep the earlier work directory so unchanged rendered segments can be reused safely. A new assembly must use a new timestamp: the renderer refuses to overwrite any existing candidate output.

```sh
direnv exec . npm run render:realtime -- \
  --script episodes/EPISODE/narration.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-realtime-YYYYMMDDTHHMMSSZ.segments \
  --segment-start 1 --segment-end 5 \
  --render-only

npm run render:realtime -- \
  --script episodes/EPISODE/narration.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-realtime-YYYYMMDDTHHMMSSZ.segments \
  --segment-start 1 --segment-end 5 \
  --assemble-only --format mp3
```

To repeat the post-assembly analysis for an existing candidate, use its render manifest:

```sh
npm run audio:analyze -- --manifest audio-artifacts/core-03-YYYYMMDDTHHMMSSZ.render-manifest.json
```

To review one voice independently—for example, every Announcer line before a full render—use the same timestamp and work directory with `--speaker`:

```sh
direnv exec . npm run render:realtime -- \
  --script episodes/EPISODE/narration.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-announcer-YYYYMMDDTHHMMSSZ.segments \
  --speaker announcer \
  --render-only

npm run render:realtime -- \
  --script episodes/EPISODE/narration.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-announcer-YYYYMMDDTHHMMSSZ.segments \
  --speaker announcer \
  --assemble-only --format mp3
```

## Declarative intro/outro music bed

New episode packages include `audio-mix.yaml`. It is the authoritative music
plan for the **Podcast introduction** and **Outro**; do not provide manual
`--music-*` options when that file exists. Set `music.enabled: false` for an
episode without a bed. For an enabled bed, configure its audio-mix-relative
source (which must remain inside the repository), steady full and voice-under gains, and lead, continuation, and fade
timing in that file. The final pre-hosting validation compares the declared
plan with the rendered music record.

```yaml
schema_version: 1
music:
  enabled: true
  source: ../../assets/music/jonasblakewood-synth-pop_60s-583368.mp3
  base_gain_db: -24
  voice_gain_db: -30
  level_transition_seconds: 0.15
  intro_lead_seconds: 10
  intro_tail_seconds: 5
  intro_fade_seconds: 0.5
  outro_tail_seconds: 10
  outro_fade_seconds: 5
```

The render manifest records the source SHA-256, configuration digest, cue plan,
and music-level settings. Automated checks still cannot judge music balance or
editorial fit; listen to the intro and outro before approving the episode.

## Local chapter review

After assembling an MP3, create a local clickable review page from the
chapters embedded in that MP3—not from the script or render manifest's planned
list. Open the resulting HTML file in a browser, click each chapter, and listen
across the marker. This makes title and placement review possible before the
episode reaches a podcast player.

```sh
npm run audio:chapter-review -- \
  --manifest audio-artifacts/EPISODE-TIMESTAMP.render-manifest.json
```

The page is written next to the MP3 by default, is ignored with the audio
artifacts, and does not change the audio file. Its filename and playback URL
include the final MP3 SHA-256, so its chapter list is tied to that exact audio
object rather than a same-named earlier render.

## Chapter markers

Every `##` heading in the approved master script becomes an embedded MP3
chapter marker. The renderer calculates each start from the stitched audio, not
from the draft timestamp printed in the heading. This format is supported by
[Apple Podcasts](https://podcasters.apple.com/support/5482-using-chapters-on-apple-podcasts)
and [Overcast](https://overcast.fm/podcasterinfo). Keep headings short,
specific, and listener-facing; they are navigation labels, not internal notes.

During script-aligned listening QA, verify that the chapter list begins with
the opening at `00:00`, each title describes the material that follows, and
each marker lands before that material starts. The render manifest records the
final titles, millisecond timings, and the MP3 SHA-256 that contains that
embedded marker set. A revised audio segment may change later marker times;
reassemble and review the complete MP3 so the marker data follows the updated
audio.

## Accepted audio policy

- 24 kHz mono PCM source; retain the lossless WAV master and 160 kbps MP3
  derivative.
- Do not send `audio.output.speed`; request natural, unhurried delivery in the
  role instructions.
- Render complete speaker turns, with a 240-word maximum segment size and
  bounded adjacent-dialogue context.
- Keep the approved script and show notes unchanged. The renderer preserves
  familiar initialisms such as `POH`, `CG`, `AFM`, `ACS`, and `MEL` exactly as
  written because hyphenated spellings created audible hitches and unnatural
  emphasis. The pronunciation map is reserved for narrow phonetic corrections:
  `AI` becomes `artificial intelligence`, `AIM` becomes `aim`, `PHAK` becomes
  `pee hack`, `ASOS` becomes `AY-sohs`, `AWOS` becomes `AY-wahs`, and `ATIS`
  becomes `AY-tis`.
  For a homograph such as `envelope`, the text remains unchanged and the
  affected segment receives a silent noun-pronunciation instruction instead.
- Use the versioned, Git-ignored render manifest for duration, checksums, response
  usage, usage-derived cost estimates, stitch positions, chapter markers, and
  the audio-quality report. It is not an invoice.
