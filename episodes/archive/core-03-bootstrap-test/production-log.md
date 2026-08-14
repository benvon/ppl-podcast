# Core 03 production log

## Historical bootstrap notice

This is a preserved bootstrap/test record, not the maintained workflow contract.
It intentionally retains its contemporaneous review gates, source-link state,
and audio experiments so the project's development remains inspectable. New
episodes start from `templates/`; Core 03 will be rebuilt separately when its
content returns to active production.

## 2026-08-11 - Candidate package created

- Created episode scope, ACS mapping, source ledger, claim inventory, research packet, master script, show notes, QA checklist, and audio manifest.
- Verified current public FAA links for FAA-S-ACS-6C, PHAK Chapter 5, Airplane Flying Handbook Chapter 5, and active AC 61-67C.
- Verified current eCFR link for 14 CFR 91.9 and labeled it as the regulatory source rather than FAA guidance.
- Included the required AI-assisted-production, AI-generated-voice, and not-flight-instruction notice in the script and show notes.
- Kept all aircraft-specific recovery and intentional-spin procedures out of the candidate. The script directs listeners to the approved POH/AFM and a qualified instructor.

## Remaining release work

1. Independent content review by a certificated flight instructor or another qualified aviation reviewer.
2. Resolve any review findings and increment the script version.
3. Create clean narration copy from the approved master script.
4. Set the OpenAI API key securely in the local environment and approve the candidate render.
5. Re-verify source links and revisions on the intended publication day.
6. Render, master, listen to, checksum, and record final audio.

## 2026-08-11 - OpenAI TTS technical candidate

- Rendered 69 checkpointed WAV segments using `gpt-4o-mini-tts`, with `marin` as Instructor and `cedar` as Learner.
- Assembled a 24 kHz mono WAV master and 128 kbps MP3 derivative; local decode and SHA-256 verification passed.
- The candidate is 25:11, below the 30-45 minute core-episode target. It is not release-ready and requires a native-pace rerender after the revised measured-pace prompt is reviewed.
- Corrected renderer section-boundary parsing and added a mandatory opening/production-notice preflight plus front-matter listening clip for future renders.

## 2026-08-11 - Script and voice-profile revision

- Shortened the cold open to a single 10-20 second scope statement so the required notice follows promptly.
- Added fixed Instructor and Learner style profiles with restrained but purposeful intonation and a compatibility guard for resumable render work directories.
- Superseded the prior candidate audio; no current audio matches script version 0.2.0.
- Rendered an eight-segment v0.2 style preview for listener approval before any full rerender.
- Added local semantic spacing (lead-in, turn, speaker, and section pauses) after checking that the raw TTS WAV joins themselves are near zero amplitude; generated a higher-bitrate spacing preview without another TTS request.

## 2026-08-11 - Continuity and terminology revision

- Confirmed the renderer already synthesizes complete speaker turns rather than sentence fragments; the remaining joins are mainly deliberate Instructor/Learner exchanges.
- Added silent previous/next-line context to each TTS request and a delivery rule that prevents repeated technical terms from becoming a catchphrase.
- Revised the opening section to vary surrounding explanatory language while preserving required technical terminology; rendered an eight-segment v0.3 continuity preview for approval.

## 2026-08-11 - Runtime-compliant v0.4 candidate render

- The approved v0.3 voice profile was memorialized in `series/voice-profile.yaml` and linked from `series/series-manifest.yaml`; it locks the model, two voices, delivery styles, continuity context, spacing, and preview-approval rule for future candidates.
- The 3,903-word v0.3 candidate measured 24:47, below the series' 30-minute minimum. It remains preserved as a superseded technical candidate rather than being mislabeled as release-ready.
- Expanded the fact-checked episode with a source-cited guided-review section that reinforces the existing ACS/AFH/AC/14 CFR boundaries without adding a universal aircraft procedure. Script version 0.4.0 contains 4,901 spoken words.
- Reused only source-identical, profile-identical segments 1-63 from v0.3. Re-rendered the changed boundary turn, guided-review section, and closing recap in a new settings-locked work directory.
- Assembled `core-03-20260811T191500Z.mp3` and a lossless WAV master. The candidate measures 30:52; local ffmpeg decode, ffprobe stream inspection, checksum, and Git-ignore checks passed.
- The candidate is not cleared for public release. Full human listening QA, qualified aviation review, and publication-day FAA/eCFR source verification remain required.

## 2026-08-11 - Voice-model revalidation

- Revalidated the OpenAI model catalog after a newer live-audio release. The catalog marks the candidate's `gpt-4o-mini-tts` model deprecated; the profile remains preserved only for reproducibility of Core 03.
- Confirmed that `gpt-live-transcribe` is a transcription model, not podcast narration. Tested `gpt-realtime-2.1` as the current realtime voice candidate in an authenticated WebSocket session with the same `marin`/`cedar` roles.
- The direct `/v1/audio/speech` test for `gpt-realtime-2.1` returned HTTP 404. The WebSocket test produced two valid 24 kHz PCM voice clips and the ignored 22.87-second comparison MP3. No migration decision has been made; see `series/voice-model-evaluations.md`.

## 2026-08-11 - Realtime production renderer adopted

- Listener approved the native-speed `gpt-realtime-2.1` comparison for future candidate work. `marin` remains the Instructor and `cedar` the Learner.
- Added the checkpointed `scripts/render_episode_realtime.cjs` renderer as the production default. It renders complete bounded speaker segments through WebSocket sessions, captures 24 kHz PCM without setting `audio.output.speed`, retains a lossless master, creates an MP3 derivative, and records response-usage data for a post-render estimate.
- Rendered and technically validated a 126.890-second ignored preview of segments 1-5 (cold open, required notice, first exchange) at `audio-artifacts/core-03-20260811T210000Z.preview-001-005.mp3`. This preview is evidence for voice and front-matter QA only; it does not replace the existing full Core 03 candidate or authorize publication.

## 2026-08-11 - Disclosure pronunciation correction

- The initial Realtime preview pronounced the first `AI-assisted` disclosure phrase ambiguously. Renderer version 2 now preserves the written disclosure but supplies `A.I.` exclusively to the voice model and requires individual-letter pronunciation.
- Rendered and technically validated the corrected 124.740-second preview at `audio-artifacts/core-03-20260811T211000Z.preview-001-005.mp3`. This is the current opening-preview artifact for listener review.

## 2026-08-11 - Disclosure full-phrase correction

- The `A.I.` render-input expansion produced an extra letter. Renderer version 3 now expands `AI` to `artificial intelligence` only in the model input, while retaining the approved written disclosure.
- Rendered and technically validated the 126.190-second replacement preview at `audio-artifacts/core-03-20260811T211500Z.preview-001-005.mp3`. This supersedes the prior opening-only previews for listener review.

## 2026-08-11 - Full Realtime Core 03 candidate

- Regenerated all 92 script segments through the approved `gpt-realtime-2.1` production path (renderer version 3), with native output speed, `marin` as Instructor, and `cedar` as Learner. No segment retries or failures occurred.
- The model input expands standalone `AI` to `artificial intelligence`; the approved written script and show notes remain unchanged.
- Assembled `core-03-20260811T214000Z.mp3` and a lossless WAV master. The candidate measures 31:15, within the core-series target. Local MP3 decode, ffprobe stream inspection, checksum, and Git-ignore checks passed.
- Assembled the 40.500-second opening/notice check clip from already-rendered segments; it did not create a separate API render charge. The full render manifest records a $2.717554 usage-derived estimate, not an invoice.
- This Realtime candidate supersedes the legacy `gpt-4o-mini-tts` v0.4 candidate as the current test artifact. It is not cleared for public release; full human listening QA, qualified aviation review, and publication-day source verification remain required.
