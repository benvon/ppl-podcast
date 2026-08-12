# Audio rendering runbook

`render_episode_realtime.cjs` is the default renderer for new candidate audio.
It uses OpenAI Realtime `gpt-realtime-2.1`, `marin` as Instructor, and `cedar`
as Learner. The legacy Python renderer exists only to reproduce an older
candidate and must not be selected for a new episode.

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
4. Assemble the complete range, then perform the required full listening QA.

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
  usage, and usage-derived cost estimates. It is not an invoice.
