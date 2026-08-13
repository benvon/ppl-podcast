# Core 03 QA checklist

## Completed for fact-checked candidate

- [x] Episode scope and ACS mapping are documented.
- [x] Material claims have a source-ledger mapping.
- [x] FAA ACS, PHAK Chapter 5 landing page, Airplane Flying Handbook Chapter 5, and active AC 61-67C links were checked on 2026-08-11.
- [x] The eCFR link for 14 CFR 91.9 was checked on 2026-08-11 and is labeled as regulation rather than FAA guidance.
- [x] The required production notice is present in the master script and show notes.
- [x] Renderer preflight identifies opening segment 1 and required production-notice segment 2 before TTS rendering.
- [x] The script distinguishes FAA guidance, the ACS standard, regulation, and teaching explanation.
- [x] No aircraft-specific recovery procedure, limitation, or intentional-spin instruction is presented as universal.

## Required before public release

- [ ] Review by a certificated flight instructor or other qualified aviation reviewer; record reviewer, date, and changes.
- [ ] Generate clean `narration.md` from the approved master script after review.
- [ ] Re-verify every public source and link on publication day.
- [x] Rendered the 30:52 v0.4 two-voice candidate to `audio-artifacts/`; the MP3 and WAV master pass local decode validation and checksum verification.
- [x] Produced a candidate within the 30-45 minute runtime target using native TTS pacing.
- [ ] Complete a start-to-finish human audio listen, including every number, acronym, and warning.
- [ ] Listen to the generated front-matter check and confirm the opening and production notice are audible and in order.
- [ ] Record actual word count, duration, audio checksum, and file URL in metadata/audio manifest.
- [ ] Confirm master script, narration, audio, show notes, and metadata use the same release version.
