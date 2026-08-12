# Voice-model evaluations

## 2026-08-11 - Realtime API revalidation

**Status:** Human listening decision pending. Do not change the active Core 03 candidate or the approved profile until a comparison is accepted.

### Current official model status

- The current OpenAI model catalog marks `gpt-4o-mini-tts` as deprecated. It remains documented in `voice-profile.yaml` only because it is the model used by the existing Core 03 candidate.
- `gpt-live-transcribe` is a realtime transcription model; it does not generate podcast narration.
- `gpt-realtime-2.1` is the approved narration model for new candidate renders. It supports text and audio over the Realtime API, including 24 kHz PCM output and the built-in `marin` and `cedar` voices.

### Comparison artifact

- MP3: `audio-artifacts/core-03-gpt-realtime-2.1-comparison-20260811T201500Z.mp3`
- Duration: 22.870 seconds.
- Format: 24 kHz mono MP3 derivative; two 24 kHz PCM WAV source clips are retained under `audio-artifacts/core-03-gpt-realtime-2.1-20260811T201500Z.probe/`.
- Prompt: the same Instructor and Learner role directions as the Core 03 candidate, with `marin` and `cedar` respectively; Realtime output speed set to 0.9.
- Local validation: MP3 decode, ffprobe stream inspection, SHA-256, and Git-ignore check passed.

### Integration findings

- `gpt-realtime-2.1` is not a drop-in replacement for the current file renderer's `POST /v1/audio/speech` path: that endpoint returned HTTP 404 for the model.
- The successful comparison used an authenticated Realtime WebSocket session, `session.update`, and `response.create`; audio arrives as `response.output_audio.delta` PCM chunks.
- The production renderer is `scripts/render_episode_realtime.cjs`, using the pinned `ws` package in this repository. It receives 24 kHz PCM via WebSocket, writes resumable WAV segments, retains a lossless master, and records response-usage data without retaining credentials.

### 2026-08-11 - Post-processing-speed correction

- The first Realtime comparison used `audio.output.speed: 0.9`. The Realtime API documents `speed` as a post-generation audio adjustment; it is not the same as asking the model to speak at a measured pace.
- Treat the first 22.870-second MP3 as an invalid quality sample. A corrected comparison requests measured pace in the role instructions and leaves `speed` at its native default.
- Corrected lossless source: `audio-artifacts/core-03-gpt-realtime-2.1-no-speed-20260811T203000Z.wav`
- Corrected MP3 derivative: `audio-artifacts/core-03-gpt-realtime-2.1-no-speed-20260811T203000Z.mp3`
- Both corrected artifacts decode locally and have a 30.720-second duration. Evaluate the WAV first to separate source quality from MP3 encoding.

### Decision and operating rule

The listener approved the corrected native-speed comparison for future work on 2026-08-11. New candidate renders use `gpt-realtime-2.1`, `marin` (Instructor), and `cedar` (Learner) through the checkpointed Realtime renderer. Do not silently swap models in an existing work directory. Keep Realtime `audio.output.speed` unset unless a separately approved quality test establishes a reason to change it; ask for natural pacing in the role instructions instead. Perform a representative transcript-fidelity listen before a full candidate render.

### First durable-renderer sample

- Artifact: `audio-artifacts/core-03-20260811T210000Z.preview-001-005.mp3`
- Lossless master: `audio-artifacts/core-03-20260811T210000Z.preview-001-005.master.wav`
- Scope: Core 03 segments 1-5: the 10-20 second cold open, the required production notice, and the first Learner/Instructor exchange.
- Duration: 126.890 seconds. Local MP3 decoding and stream inspection passed (24 kHz, mono, 160 kbps).
- Renderer policy confirmed: native `audio.output.speed` was omitted; the render manifest retains raw API response-usage data and calculated a $0.181795 usage-derived estimate for this sample. It is a recorded estimate, not an invoice.

### Pronunciation correction

The first durable-renderer sample made the initial `AI-assisted` phrase sound like a word. Renderer version 2's `A.I.` attempt produced an extra letter. Renderer version 3 preserves the approved written disclosure, but expands standalone `AI` to `artificial intelligence` only in the render input. This pronunciation transform is settings-locked so partially rendered work directories cannot mix it with earlier output.

- Corrected sample: `audio-artifacts/core-03-20260811T211000Z.preview-001-005.mp3`
- Corrected lossless master: `audio-artifacts/core-03-20260811T211000Z.preview-001-005.master.wav`
- Duration: 124.740 seconds. MP3 decode validation passed; render-manifest estimate: $0.179264.

- Current full-phrase sample: `audio-artifacts/core-03-20260811T211500Z.preview-001-005.mp3`
- Current lossless master: `audio-artifacts/core-03-20260811T211500Z.preview-001-005.master.wav`
- Duration: 126.190 seconds. MP3 decode validation passed; render-manifest estimate: $0.180808. This is the sample to use for listener review.

### Official sources

- OpenAI model catalog: <https://developers.openai.com/api/docs/models/all>
- GPT-Realtime-2.1: <https://developers.openai.com/api/docs/models/gpt-realtime-2.1>
- Realtime and audio: <https://developers.openai.com/api/docs/guides/realtime>
- Realtime client events: <https://developers.openai.com/api/reference/resources/realtime/client-events>
