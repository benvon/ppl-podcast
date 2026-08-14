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

1. Confirm the master script passes fact and editorial review.
2. Render the opening preview (segments 1-5) and listen before spending on the
   complete episode.
3. Render the full episode in bounded ranges if necessary. The work directory
   is safe to resume only if `render-settings.json` matches exactly.
4. Assemble the complete range. The renderer adds an 8 ms fade at each rendered-segment edge and writes an automatic post-assembly report beside the manifest. It verifies WAV structure, 24 kHz mono format, MP3/WAV decode, output duration, clipping statistics, and abrupt sample jumps at every known stitch.
5. Perform the required full listening QA. The automated report catches technical corruption and hard joins; it cannot judge synthesis artifacts, garbled words, pronunciation, or pacing.

Use the same timestamp and work directory for the render and assembly commands.

```sh
direnv exec . npm run render:realtime -- \
  --script episodes/EPISODE/master-script.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-realtime-YYYYMMDDTHHMMSSZ.segments \
  --segment-start 1 --segment-end 5 \
  --render-only

npm run render:realtime -- \
  --script episodes/EPISODE/master-script.md \
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
  --script episodes/EPISODE/master-script.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-announcer-YYYYMMDDTHHMMSSZ.segments \
  --speaker announcer \
  --render-only

npm run render:realtime -- \
  --script episodes/EPISODE/master-script.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-announcer-YYYYMMDDTHHMMSSZ.segments \
  --speaker announcer \
  --assemble-only --format mp3
```

## Optional intro/outro music bed

Use `--music-bed` during assembly to add a source track beneath the **Podcast
introduction** and **Outro** sections. By default, the renderer adds a 7-second
music-only lead before the Podcast introduction voice, continues the bed for
2 seconds after that voice, then fades it over 0.5 seconds before the first
teaching section. It starts music with the Outro voice, continues it for 10
seconds after the voice ends, then fades it for 5 seconds. The bed is set to
-24 dB and sidechain-ducked beneath spoken audio before a final limiter, so
narration remains foregrounded.

```sh
npm run render:realtime -- \
  --script episodes/EPISODE/master-script.md \
  --audio-dir audio-artifacts \
  --episode-id core-03 \
  --timestamp YYYYMMDDTHHMMSSZ \
  --work-dir audio-artifacts/core-03-realtime-YYYYMMDDTHHMMSSZ.segments \
  --music-bed assets/music/jonasblakewood-synth-pop_60s-583368.mp3 \
  --assemble-only --format mp3
```

The render manifest records the source SHA-256, cue plan, gain, and ducking
settings. Automated checks still cannot judge music balance or editorial fit;
listen to the intro and outro before approving the episode.

## Accepted audio policy

- 24 kHz mono PCM source; retain the lossless WAV master and 160 kbps MP3
  derivative.
- Do not send `audio.output.speed`; request natural, unhurried delivery in the
  role instructions.
- Render complete speaker turns, with a 240-word maximum segment size and
  bounded adjacent-dialogue context.
- Keep the approved script and show notes unchanged. Only for the voice-model
  input, expand standalone `AI` to `artificial intelligence`; the listener
  should hear “artificial intelligence-assisted production.”
- Use the versioned, ignored render manifest for duration, checksums, response
  usage, usage-derived cost estimates, stitch positions, and the audio-quality
  report. It is not an invoice.
