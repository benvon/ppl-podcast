#!/usr/bin/env python3
"""Render a speaker-labeled PPL podcast master script.

The script accepts Markdown master scripts that label dialogue exactly as
``**INSTRUCTOR:**`` and ``**LEARNER:**``. It discards headings and internal
source tags, renders bounded speaker segments through OpenAI Text-to-Speech or
macOS ``say``, validates local AIFF intermediates, and retains a lossless
master alongside an optional podcast-ready MP3 derivative.

OpenAI rendering requires ``OPENAI_API_KEY`` in the environment. The key is
never read from files, command-line arguments, or written to a manifest.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html.parser
import json
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import wave
from dataclasses import dataclass
from pathlib import Path


SPEAKER_RE = re.compile(r"^\*\*(INSTRUCTOR|LEARNER):\*\*$")
SECTION_HEADING_RE = re.compile(r"^#+\s+(?:\[\d{2}:\d{2}\]\s+)?(.+?)\s*$")
IGNORED_LINE_PREFIXES = (
    "#",
    "[Source:",
    "[Claim type:",
    "**Version:",
    "**Target runtime:",
    "**Speakers:",
    "**Production status:",
)
SAFE_EPISODE_ID = re.compile(r"^[a-z0-9][a-z0-9-]*$")
SENTENCE_BOUNDARY = re.compile(r"(?<=[.!?])\s+")
REQUIRED_PRODUCTION_NOTICE = (
    "This podcast uses AI-assisted production. The voices in this episode are AI-generated, "
    "not human speakers. Each episode's factual content is reviewed against cited source material "
    "before audio production, but it is not reviewed by a certificated flight instructor. This podcast "
    "is not flight or maneuver instruction. Always use current FAA information, applicable regulations, and your "
    "aircraft's approved documents."
)
DEFAULT_INSTRUCTOR_STYLE = (
    "calm, engaged, and practical flight instructor; use natural, purposeful intonation and modest "
    "emphasis on safety-critical words and contrasts; sound alert and conversational, never theatrical"
)
DEFAULT_LEARNER_STYLE = (
    "prepared adult learner; attentive and naturally curious, with restrained conversational inflection; "
    "sound thoughtful rather than performative"
)


class RenderError(RuntimeError):
    """A rendering precondition or validation failure."""


@dataclass(frozen=True)
class Segment:
    index: int
    speaker: str
    text: str
    section: str


@dataclass(frozen=True)
class AiffProperties:
    form_type: bytes
    comm_data: bytes
    channels: int
    sample_width_bits: int
    sample_rate: int
    compression_type: bytes


class EpisodePageParser(html.parser.HTMLParser):
    """Collect page text and media links needed to bind a public release."""

    def __init__(self) -> None:
        super().__init__()
        self.text: list[str] = []
        self.links: list[str] = []

    def handle_data(self, data: str) -> None:
        self.text.append(data)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag in {"a", "audio", "source"}:
            candidate = values.get("href") if tag == "a" else values.get("src")
            if candidate:
                self.links.append(candidate)


def parse_script_text(script: str, max_words: int) -> list[Segment]:
    """Extract spoken dialogue and split it into bounded, same-speaker pieces."""
    turns: list[tuple[str, str, str]] = []
    speaker: str | None = None
    section = ""
    paragraphs: list[str] = []

    def flush_turn() -> None:
        nonlocal paragraphs
        if speaker and paragraphs:
            text = " ".join(paragraphs).strip()
            if text:
                turns.append((speaker, text, section))
        paragraphs = []

    for raw_line in script.splitlines():
        line = raw_line.strip()
        heading_match = SECTION_HEADING_RE.match(line)
        if heading_match:
            flush_turn()
            section = heading_match.group(1).strip().lower()
            continue
        speaker_match = SPEAKER_RE.match(line)
        if speaker_match:
            flush_turn()
            speaker = speaker_match.group(1)
            continue
        if not speaker or not line or line.startswith(IGNORED_LINE_PREFIXES):
            continue
        paragraphs.append(line.replace("**", ""))
    flush_turn()

    if not turns:
        raise RenderError(
            "No dialogue found. Use exact Markdown labels **INSTRUCTOR:** and **LEARNER:**."
        )

    segments: list[Segment] = []
    for turn_speaker, text, turn_section in turns:
        for piece in split_text(text, max_words):
            segments.append(Segment(len(segments) + 1, turn_speaker, piece, turn_section))
    validate_front_matter(segments)
    return segments


def parse_script(path: Path, max_words: int) -> list[Segment]:
    """Parse a script file for callers that do not need a verified snapshot."""
    return parse_script_text(path.read_text(encoding="utf-8"), max_words)


def validate_front_matter(segments: list[Segment]) -> dict[str, list[int]]:
    """Require an opening followed by the exact public-production notice."""
    opening = [segment.index for segment in segments if segment.section == "opening"]
    notice = [
        segment.index
        for segment in segments
        if segment.section == "required production notice"
    ]
    if not opening or opening[0] != 1:
        raise RenderError("The first spoken segment must be under a Markdown heading named 'Opening'.")
    if not notice or notice[0] <= opening[0]:
        raise RenderError("A 'Required production notice' section must follow the opening.")
    notice_text = " ".join(
        segment.text for segment in segments if segment.section == "required production notice"
    )
    if REQUIRED_PRODUCTION_NOTICE not in notice_text:
        raise RenderError(
            "The required production notice is missing or does not match the approved public-distribution text."
        )
    return {"opening_segments": opening, "production_notice_segments": notice}


def split_text(text: str, max_words: int) -> list[str]:
    """Prefer sentence boundaries; split long sentences only when necessary."""
    pieces: list[str] = []
    current: list[str] = []
    current_words = 0
    sentences = SENTENCE_BOUNDARY.split(text)

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        words = sentence.split()
        if len(words) > max_words:
            if current:
                pieces.append(" ".join(current))
                current, current_words = [], 0
            for start in range(0, len(words), max_words):
                pieces.append(" ".join(words[start : start + max_words]))
            continue
        if current and current_words + len(words) > max_words:
            pieces.append(" ".join(current))
            current, current_words = [], 0
        current.append(sentence)
        current_words += len(words)

    if current:
        pieces.append(" ".join(current))
    return pieces


def build_continuity_context(segments: list[Segment], position: int, characters: int) -> str:
    """Provide bounded adjacent dialogue as unspoken performance context."""
    notes: list[str] = []
    if position > 0:
        previous = segments[position - 1]
        notes.append(f"Previous {previous.speaker.title()} line: {previous.text[-characters:]}")
    if position + 1 < len(segments):
        following = segments[position + 1]
        notes.append(f"Next {following.speaker.title()} line: {following.text[:characters]}")
    return " | ".join(notes) or "No adjacent dialogue."


def decode_extended_80(raw: bytes) -> int:
    """Decode the AIFF 80-bit extended sample-rate field without a legacy module."""
    if len(raw) != 10:
        raise RenderError("Invalid AIFF sample-rate field.")
    sign_and_exponent = struct.unpack(">H", raw[:2])[0]
    exponent = sign_and_exponent & 0x7FFF
    mantissa = int.from_bytes(raw[2:], "big")
    if exponent == 0 or mantissa == 0:
        return 0
    value = mantissa * (2 ** (exponent - 16383 - 63))
    return round(value)


def read_aiff(path: Path) -> tuple[AiffProperties, bytes, int]:
    """Read the uncompressed AIFF/AIFC files produced by macOS say."""
    raw = path.read_bytes()
    if len(raw) < 12 or raw[:4] != b"FORM" or raw[8:12] not in (b"AIFF", b"AIFC"):
        raise RenderError(f"Not an AIFF/AIFC file: {path}")
    form_type = raw[8:12]
    offset = 12
    comm_data: bytes | None = None
    sound_data: bytes | None = None
    while offset + 8 <= len(raw):
        chunk_id = raw[offset : offset + 4]
        chunk_size = struct.unpack(">I", raw[offset + 4 : offset + 8])[0]
        data_start = offset + 8
        data_end = data_start + chunk_size
        if data_end > len(raw):
            raise RenderError(f"Truncated AIFF chunk in {path}")
        chunk = raw[data_start:data_end]
        if chunk_id == b"COMM":
            comm_data = chunk
        elif chunk_id == b"SSND":
            if len(chunk) < 8:
                raise RenderError(f"Invalid SSND chunk in {path}")
            audio_offset, _block_size = struct.unpack(">II", chunk[:8])
            if 8 + audio_offset > len(chunk):
                raise RenderError(f"Invalid SSND offset in {path}")
            sound_data = chunk[8 + audio_offset :]
        offset = data_end + (chunk_size % 2)

    if comm_data is None or sound_data is None or len(comm_data) < 18:
        raise RenderError(f"Missing COMM or SSND chunk in {path}")
    channels, declared_frames, sample_width_bits = struct.unpack(">HIH", comm_data[:8])
    sample_rate = decode_extended_80(comm_data[8:18])
    compression_type = comm_data[18:22] if form_type == b"AIFC" and len(comm_data) >= 22 else b"NONE"
    if compression_type not in (b"NONE", b"twos"):
        raise RenderError(
            f"Unsupported compressed AIFF segment {path}; expected uncompressed PCM, got {compression_type!r}."
        )
    if channels < 1 or sample_width_bits < 8 or sample_width_bits % 8 or sample_rate < 1:
        raise RenderError(f"Invalid PCM format in {path}")
    bytes_per_frame = channels * (sample_width_bits // 8)
    actual_frames = len(sound_data) // bytes_per_frame
    if actual_frames <= 0 or len(sound_data) % bytes_per_frame:
        raise RenderError(f"Renderer produced incomplete audio frames: {path}")
    if declared_frames and declared_frames != actual_frames:
        raise RenderError(f"AIFF frame-count mismatch in {path}")
    return (
        AiffProperties(
            form_type=form_type,
            comm_data=comm_data,
            channels=channels,
            sample_width_bits=sample_width_bits,
            sample_rate=sample_rate,
            compression_type=compression_type,
        ),
        sound_data,
        actual_frames,
    )


def write_aiff(path: Path, properties: AiffProperties, frames: int, audio_data: bytes) -> None:
    """Write a minimal, valid uncompressed AIFF/AIFC file."""
    comm_data = bytearray(properties.comm_data)
    struct.pack_into(">I", comm_data, 2, frames)
    comm_chunk = b"COMM" + struct.pack(">I", len(comm_data)) + bytes(comm_data)
    if len(comm_data) % 2:
        comm_chunk += b"\0"
    ssnd_data = struct.pack(">II", 0, 0) + audio_data
    ssnd_chunk = b"SSND" + struct.pack(">I", len(ssnd_data)) + ssnd_data
    if len(ssnd_data) % 2:
        ssnd_chunk += b"\0"
    form_size = 4 + len(comm_chunk) + len(ssnd_chunk)
    path.write_bytes(b"FORM" + struct.pack(">I", form_size) + properties.form_type + comm_chunk + ssnd_chunk)


def render_segment(
    segment: Segment,
    work_dir: Path,
    voice: str,
    rate: int,
    timeout_seconds: int,
) -> Path:
    text_path = work_dir / f"{segment.index:03d}-{segment.speaker.lower()}.txt"
    aiff_path = work_dir / f"{segment.index:03d}-{segment.speaker.lower()}.aiff"
    text_path.write_text(segment.text + "\n", encoding="utf-8")
    try:
        subprocess.run(
            ["say", "-v", voice, "-r", str(rate), "-o", str(aiff_path), "-f", str(text_path)],
            check=True,
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
        )
    except FileNotFoundError as exc:
        raise RenderError("macOS 'say' was not found. This renderer requires macOS.") from exc
    except subprocess.TimeoutExpired as exc:
        raise RenderError(
            f"Rendering segment {segment.index} exceeded {timeout_seconds} seconds. "
            "Use a smaller --max-words-per-segment value."
        ) from exc
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "no diagnostic output"
        raise RenderError(f"Rendering segment {segment.index} failed: {detail}") from exc
    read_aiff(aiff_path)
    return aiff_path


def render_openai_segment(
    segment: Segment,
    work_dir: Path,
    voice: str,
    model: str,
    api_key: str,
    delivery_pace: str,
    voice_style: str,
    continuity_context: str,
    timeout_seconds: int,
) -> Path:
    """Render a bounded WAV segment through the OpenAI TTS endpoint."""
    wav_path = work_dir / f"{segment.index:03d}-{segment.speaker.lower()}.wav"
    role = "Instructor" if segment.speaker == "INSTRUCTOR" else "Learner"
    role_instruction = (
        f"You are the {role} in a serious private-pilot study podcast. Maintain the same vocal identity, "
        "pace, and delivery throughout every segment of this episode, as though recording one continuous session. "
        f"Your delivery is {voice_style}. Use a {delivery_pace}. Preserve the supplied wording exactly: do not "
        "add, omit, summarize, or improvise. Do not use announcer delivery, exaggerated emotion, comedy, or "
        "gimmicky banter. Treat repeated technical terms as recurring ideas, not catchphrases: let their "
        "stress and cadence vary naturally with the sentence, while keeping the terminology precise. "
        "The following is silent continuity context only. Never speak, quote, or summarize it: "
        f"{continuity_context}"
    )
    payload = json.dumps(
        {
            "model": model,
            "voice": voice,
            "input": segment.text,
            "instructions": role_instruction,
            "response_format": "wav",
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        "https://api.openai.com/v1/audio/speech",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout_seconds) as response:
            audio = response.read()
    except urllib.error.HTTPError as exc:
        raise RenderError(
            f"OpenAI TTS rejected segment {segment.index} (HTTP {exc.code}). "
            "Check the API key, account billing, model access, and request limits."
        ) from exc
    except urllib.error.URLError as exc:
        raise RenderError(
            f"OpenAI TTS could not render segment {segment.index}: {exc.reason}"
        ) from exc
    if len(audio) < 44 or audio[:4] != b"RIFF" or audio[8:12] != b"WAVE":
        raise RenderError(f"OpenAI TTS returned invalid WAV audio for segment {segment.index}.")
    wav_path.write_bytes(audio)
    return wav_path


def join_aiff(parts: list[Path], output: Path) -> tuple[AiffProperties, int]:
    """Join matching AIFF parts into one lossless master and validate it."""
    if not parts:
        raise RenderError("No rendered segments to join.")
    expected, first_audio, first_frames = read_aiff(parts[0])
    total_frames = 0
    audio_parts = [first_audio]
    total_frames += first_frames
    for part in parts[1:]:
        actual, audio_data, frames = read_aiff(part)
        if (
            actual.form_type != expected.form_type
            or actual.channels != expected.channels
            or actual.sample_width_bits != expected.sample_width_bits
            or actual.sample_rate != expected.sample_rate
            or actual.compression_type != expected.compression_type
        ):
            raise RenderError(f"Incompatible audio format in {part}")
        audio_parts.append(audio_data)
        total_frames += frames
    write_aiff(output, expected, total_frames, b"".join(audio_parts))
    _finished, _audio, finished_frames = read_aiff(output)
    if finished_frames != total_frames:
        raise RenderError("Joined AIFF frame count does not match its source segments.")
    return expected, total_frames


def run_ffmpeg(input_path: Path, output_path: Path, bitrate: str) -> None:
    """Make an MP3 derivative when the user has installed ffmpeg."""
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RenderError(
            "MP3 output requires ffmpeg. Install it with 'brew install ffmpeg', "
            "or use --format aiff for the lossless master only."
        )
    try:
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                str(input_path),
                "-c:a",
                "libmp3lame",
                "-b:a",
                bitrate,
                str(output_path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        raise RenderError(f"ffmpeg MP3 encoding failed: {exc.stderr.strip()}") from exc


def join_with_ffmpeg(parts: list[Path], output: Path) -> float:
    """Join WAV segments into a lossless WAV master and return its duration."""
    ffmpeg = shutil.which("ffmpeg")
    ffprobe = shutil.which("ffprobe")
    if not ffmpeg or not ffprobe:
        raise RenderError("Joining OpenAI WAV segments requires ffmpeg and ffprobe on PATH.")
    if not parts:
        raise RenderError("No rendered segments to join.")
    concat_file = output.parent / "segments.txt"
    try:
        concat_file.write_text(
            "".join(f"file '{part.resolve().as_posix()}'\n" for part in parts), encoding="utf-8"
        )
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat_file),
                "-c:a",
                "pcm_s16le",
                str(output),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        probe = subprocess.run(
            [ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(output)],
            check=True,
            capture_output=True,
            text=True,
        )
        duration = float(json.loads(probe.stdout)["format"]["duration"])
        if duration <= 0:
            raise RenderError("Joined master has no audible duration.")
        return duration
    except subprocess.CalledProcessError as exc:
        raise RenderError(f"ffmpeg segment join failed: {exc.stderr.strip()}") from exc
    finally:
        concat_file.unlink(missing_ok=True)


def join_openai_wav_with_pauses(
    parts: list[tuple[Path, Segment]],
    output: Path,
    lead_in_ms: int,
    turn_pause_ms: int,
    speaker_pause_ms: int,
    section_pause_ms: int,
) -> float:
    """Join TTS WAVs with deliberate silence between turns and teaching sections."""
    if not parts:
        raise RenderError("No rendered segments to join.")
    expected_format: tuple[int, int, int, str] | None = None
    total_frames = 0
    previous_segment: Segment | None = None
    with wave.open(str(output), "wb") as destination:
        for part, segment in parts:
            with wave.open(str(part), "rb") as source:
                channels = source.getnchannels()
                sample_width = source.getsampwidth()
                sample_rate = source.getframerate()
                compression = source.getcomptype()
                if compression != "NONE" or sample_width != 2 or channels != 1:
                    raise RenderError(f"OpenAI segment must be uncompressed 16-bit mono WAV: {part}")
                actual_format = (channels, sample_width, sample_rate, compression)
                if expected_format is None:
                    expected_format = actual_format
                    destination.setnchannels(channels)
                    destination.setsampwidth(sample_width)
                    destination.setframerate(sample_rate)
                    destination.setcomptype(compression, "not compressed")
                    lead_frames = round(sample_rate * lead_in_ms / 1000)
                    destination.writeframes(b"\0" * lead_frames * sample_width * channels)
                    total_frames += lead_frames
                elif actual_format != expected_format:
                    raise RenderError(f"Incompatible WAV format in {part}")
                if previous_segment is not None:
                    if segment.section != previous_segment.section:
                        pause_ms = section_pause_ms
                    elif segment.speaker != previous_segment.speaker:
                        pause_ms = speaker_pause_ms
                    else:
                        pause_ms = turn_pause_ms
                    pause_frames = round(sample_rate * pause_ms / 1000)
                    destination.writeframes(b"\0" * pause_frames * sample_width * channels)
                    total_frames += pause_frames
                frames = source.readframes(source.getnframes())
                destination.writeframes(frames)
                total_frames += len(frames) // (sample_width * channels)
            previous_segment = segment
    if expected_format is None or total_frames <= 0:
        raise RenderError("Joined master has no audible duration.")
    return total_frames / expected_format[2]


def sha256(path: Path) -> str:
    import hashlib

    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--script", type=Path, required=True, help="Speaker-labeled master script Markdown file")
    parser.add_argument("--audio-dir", type=Path, required=True, help="Ignored directory for rendered audio")
    parser.add_argument("--episode-id", required=True, help="Stable lesson ID, for example core-03")
    parser.add_argument("--timestamp", help="UTC timestamp as YYYYMMDDTHHMMSSZ; defaults to current UTC")
    parser.add_argument("--provider", choices=("openai-tts", "macos-say"), default="openai-tts")
    parser.add_argument("--openai-model", default="gpt-4o-mini-tts")
    parser.add_argument("--instructor-voice", default="marin")
    parser.add_argument("--learner-voice", default="cedar")
    parser.add_argument("--rate", type=int, default=150, help="macOS say speech rate")
    parser.add_argument("--max-words-per-segment", type=int, default=240)
    parser.add_argument("--segment-timeout", type=int, default=55)
    parser.add_argument("--lead-in-ms", type=int, default=250)
    parser.add_argument("--turn-pause-ms", type=int, default=120)
    parser.add_argument("--speaker-pause-ms", type=int, default=220)
    parser.add_argument("--section-pause-ms", type=int, default=550)
    parser.add_argument(
        "--delivery-pace",
        default="steady, conversational study pace of approximately 135 words per minute, unhurried but not slow",
        help="Natural-language pace instruction for OpenAI TTS",
    )
    parser.add_argument("--instructor-style", default=DEFAULT_INSTRUCTOR_STYLE)
    parser.add_argument("--learner-style", default=DEFAULT_LEARNER_STYLE)
    parser.add_argument(
        "--continuity-context-characters",
        type=int,
        default=240,
        help="Characters from adjacent lines supplied silently to TTS for delivery continuity",
    )
    parser.add_argument("--work-dir", type=Path, help="Persistent ignored segment directory for resumable renders")
    parser.add_argument("--segment-start", type=int, default=1, help="First one-based segment to render")
    parser.add_argument("--segment-end", type=int, help="Last one-based segment to render; defaults to final segment")
    parser.add_argument("--render-only", action="store_true", help="Render the requested range without assembling output")
    parser.add_argument("--assemble-only", action="store_true", help="Assemble every existing segment in --work-dir")
    parser.add_argument("--format", choices=("aiff", "wav", "mp3"), default="mp3")
    parser.add_argument("--mp3-bitrate", default="192k")
    parser.add_argument("--keep-intermediates", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def assert_trusted_legacy_baseline(repository_root: Path, paths: tuple[Path, ...]) -> dict[Path, bytes]:
    """Return stable preserved-package bytes after comparing them to origin/main."""
    baseline = subprocess.run(
        ["git", "-C", str(repository_root), "rev-parse", "--verify", "origin/main^{commit}"],
        check=False,
        capture_output=True,
        text=True,
        timeout=5,
    )
    if baseline.returncode != 0 or not baseline.stdout.strip():
        raise RenderError(
            "The legacy renderer requires a locally fetched origin/main baseline to verify a preserved published package."
        )
    baseline_ref = baseline.stdout.strip()
    snapshots: dict[Path, bytes] = {}
    for tracked_path in paths:
        snapshot = tracked_path.read_bytes()
        relative = tracked_path.relative_to(repository_root)
        tracked = subprocess.run(
            ["git", "-C", str(repository_root), "ls-files", "--error-unmatch", "--", str(relative)],
            check=False,
            capture_output=True,
            text=True,
            timeout=5,
        )
        unchanged = subprocess.run(
            ["git", "-C", str(repository_root), "diff", "--quiet", baseline_ref, "--", str(relative)],
            check=False,
            timeout=5,
        )
        if tracked.returncode != 0 or unchanged.returncode != 0:
            raise RenderError(
                "The legacy renderer accepts only tracked historical package files unchanged from origin/main. "
                "Start revisions with episode:script-review --reset."
            )
        if tracked_path.read_bytes() != snapshot:
            raise RenderError(
                "The preserved legacy package changed during baseline verification; retry after restoring the published bytes."
            )
        snapshots[tracked_path] = snapshot
    return snapshots


def require_https_url(value: object, label: str) -> str:
    if not isinstance(value, str):
        raise RenderError(f"Published legacy release is missing {label}.")
    parsed = urllib.parse.urlparse(value)
    if parsed.scheme != "https" or not parsed.netloc:
        raise RenderError(f"Published legacy release {label} must be an HTTPS URL.")
    return value


def public_request(url: str, *, timeout: int = 20) -> urllib.response.addinfourl:
    request = urllib.request.Request(url, headers={"User-Agent": "ppl-study-guide-legacy-renderer/1"})
    try:
        return urllib.request.urlopen(request, timeout=timeout)
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
        raise RenderError(f"Could not verify the published legacy release artifact at {url}: {exc}") from exc


def verify_published_legacy_release(release: object, episode_id: str) -> None:
    """Verify live publisher provenance and immutable public artifact bytes."""
    if not isinstance(release, dict):
        raise RenderError("The legacy renderer requires a verifiable published release record.")
    repository = require_https_url(release.get("publisher_repository"), "publisher_repository")
    repository_match = re.fullmatch(r"https://github\.com/([^/]+)/([^/]+)", repository)
    commit = release.get("release_commit")
    if not repository_match or not isinstance(commit, str) or not re.fullmatch(r"[a-fA-F0-9]{40}", commit):
        raise RenderError("Published legacy release must identify an exact public GitHub publisher commit.")
    owner, repo = repository_match.groups()
    commit_url = f"https://api.github.com/repos/{owner}/{repo}/commits/{commit}"
    try:
        with public_request(commit_url) as response:
            confirmed = json.loads(response.read())
    except (json.JSONDecodeError, TypeError) as exc:
        raise RenderError("Could not parse the public publisher commit record for the legacy release.") from exc
    if not isinstance(confirmed, dict) or str(confirmed.get("sha", "")).lower() != commit.lower():
        raise RenderError("The recorded legacy publisher commit is not present at the public publisher repository.")

    episode_page = require_https_url(release.get("episode_page"), "episode_page")
    expected_title = release.get("title")
    expected_version = release.get("content_version")
    if release.get("episode_id") != episode_id or not isinstance(expected_title, str) or not expected_title.strip() or not isinstance(expected_version, str) or not expected_version.strip():
        raise RenderError("Published legacy release is missing its episode identity, title, or content version.")
    if episode_id not in urllib.parse.urlparse(episode_page).path:
        raise RenderError("The recorded legacy episode page URL does not identify the requested episode.")
    with public_request(episode_page) as response:
        page_url = response.geturl()
        page = response.read(1_000_000).decode("utf-8", errors="replace")

    enclosure_url = require_https_url(release.get("enclosure_url"), "enclosure_url")
    expected_bytes = release.get("bytes")
    expected_sha256 = release.get("sha256")
    if not isinstance(expected_bytes, int) or expected_bytes <= 0 or not isinstance(expected_sha256, str) or not re.fullmatch(r"[a-fA-F0-9]{64}", expected_sha256):
        raise RenderError("Published legacy release enclosure identity is incomplete.")
    parser = EpisodePageParser()
    parser.feed(page)
    page_text = " ".join(parser.text)
    page_links = {urllib.parse.urljoin(page_url, link).split("#", 1)[0] for link in parser.links}
    if episode_id not in page_text or expected_title not in page_text or expected_version not in page_text or enclosure_url not in page_links:
        raise RenderError("The public legacy episode page does not bind the requested episode, version, and recorded enclosure together.")
    digest = hashlib.sha256()
    observed_bytes = 0
    with public_request(enclosure_url, timeout=60) as response:
        content_length = response.headers.get("Content-Length")
        if content_length is not None and content_length.isdigit() and int(content_length) != expected_bytes:
            raise RenderError("The public legacy enclosure byte length does not match its recorded release identity.")
        while True:
            block = response.read(1024 * 1024)
            if not block:
                break
            observed_bytes += len(block)
            if observed_bytes > expected_bytes:
                raise RenderError("The public legacy enclosure exceeds its recorded byte length.")
            digest.update(block)
    if observed_bytes != expected_bytes or digest.hexdigest().lower() != expected_sha256.lower():
        raise RenderError("The public legacy enclosure bytes do not match the recorded release identity.")


def read_episode_contract(contract_reader: Path, episode_path: Path) -> dict:
    """Read a package contract without performing any network request."""
    try:
        result = subprocess.run(
            ["node", str(contract_reader), str(episode_path)],
            check=True,
            capture_output=True,
            text=True,
            timeout=5,
        )
        contract = json.loads(result.stdout)
    except (OSError, subprocess.CalledProcessError, subprocess.TimeoutExpired, json.JSONDecodeError) as exc:
        raise RenderError(
            "Could not determine the package production contract; the legacy renderer refuses an unverifiable episode package."
        ) from exc
    if not isinstance(contract, dict) or contract.get("kind") not in {"legacy", "current", "unsupported"}:
        raise RenderError("Could not determine the package production contract; the legacy renderer refuses an unverifiable episode package.")
    return contract


def trusted_legacy_contract(contract_reader: Path, snapshots: dict[Path, bytes], episode_path: Path, metadata_path: Path) -> dict:
    """Parse the contract only from the baseline-verified package snapshots."""
    with tempfile.TemporaryDirectory(prefix="ppl-legacy-contract-") as temporary:
        temporary_path = Path(temporary)
        temporary_episode = temporary_path / "episode.yaml"
        temporary_metadata = temporary_path / "hosting-metadata.yaml"
        temporary_episode.write_bytes(snapshots[episode_path])
        temporary_metadata.write_bytes(snapshots[metadata_path])
        return read_episode_contract(contract_reader, temporary_episode)


def assert_legacy_script_path(script_path: Path, episode_id: str, repository_root: Path | None = None) -> str:
    """Keep the retired renderer from bypassing current-contract render gates."""
    repository_root = (repository_root or Path(__file__).resolve().parent.parent).resolve()
    episodes_root = repository_root / "episodes"
    episode_path = script_path.parent / "episode.yaml"
    metadata_path = script_path.parent / "hosting-metadata.yaml"
    if not episode_path.is_file():
        raise RenderError(
            "render_episode_audio.py requires a sibling episode.yaml proving this is a preserved legacy package. "
            "Contract-v2 episodes must use render_episode_realtime.cjs."
        )
    # This local classification performs no outbound work. It preserves clear
    # errors for current and unsupported contracts before provenance handling.
    contract_reader = Path(__file__).with_name("read-episode-contract.cjs")
    local_contract = read_episode_contract(contract_reader, episode_path)
    if local_contract["kind"] == "current":
        raise RenderError(
            "render_episode_audio.py is for preserved legacy candidate reproduction only. "
            "Contract-v2 episodes must use render_episode_realtime.cjs so current source and editorial gates are enforced."
        )
    if local_contract["kind"] != "legacy":
        raise RenderError(
            "render_episode_audio.py requires production_contract_version to be absent for a preserved legacy package. "
            "Packages with a current or unsupported contract marker must use current release tooling."
        )
    try:
        package_path = script_path.resolve().parent
        package_path.relative_to(episodes_root.resolve())
    except ValueError as exc:
        raise RenderError("The legacy renderer accepts only preserved episode packages under the repository episodes directory.") from exc
    if script_path.name != "master-script.md" or not package_path.name.startswith(f"{episode_id}-"):
        raise RenderError("The legacy script path and package directory must identify the requested episode.")
    if not metadata_path.is_file() or not isinstance(local_contract.get("legacy_published_release"), dict):
        raise RenderError(
            "render_episode_audio.py accepts a preserved legacy package only when its episode.yaml and hosting-metadata.yaml "
            "agree on a valid published release timestamp. Draft and planned packages must use current release tooling."
        )
    resolved_script = script_path.resolve()
    resolved_episode = episode_path.resolve()
    resolved_metadata = metadata_path.resolve()
    snapshots = assert_trusted_legacy_baseline(
        repository_root,
        (resolved_script, resolved_episode, resolved_metadata),
    )
    contract = trusted_legacy_contract(
        contract_reader,
        snapshots,
        resolved_episode,
        resolved_metadata,
    )
    if contract["kind"] == "current":
        raise RenderError(
            "render_episode_audio.py is for preserved legacy candidate reproduction only. "
            "Contract-v2 episodes must use render_episode_realtime.cjs so current source and editorial gates are enforced."
        )
    if contract["kind"] != "legacy":
        raise RenderError(
            "render_episode_audio.py requires production_contract_version to be absent for a preserved legacy package. "
            "Packages with a current or unsupported contract marker must use current release tooling."
        )
    legacy_release = contract.get("legacy_published_release")
    if not isinstance(legacy_release, dict) or legacy_release.get("metadata_path") != "hosting-metadata.yaml":
        raise RenderError(
            "render_episode_audio.py accepts a preserved legacy package only when its episode.yaml and hosting-metadata.yaml "
            "agree on a valid published release timestamp. Draft and planned packages must use current release tooling."
        )
    if contract.get("episode_id") != episode_id:
        raise RenderError("The legacy script path, package directory, and episode.yaml id must identify the same episode.")
    # All URL, byte-count, and release values now come from origin/main-bound
    # snapshots, not from mutable worktree metadata.
    verify_published_legacy_release(legacy_release, episode_id)
    return snapshots[resolved_script].decode("utf-8")


def main() -> int:
    args = parse_args()
    if not SAFE_EPISODE_ID.fullmatch(args.episode_id):
        raise RenderError("--episode-id must use lowercase letters, digits, and hyphens only.")
    if args.max_words_per_segment < 25:
        raise RenderError("--max-words-per-segment must be at least 25.")
    if args.provider == "macos-say" and (args.rate < 80 or args.rate > 300):
        raise RenderError("--rate must be between 80 and 300.")
    if any(
        value < 0 or value > 5000
        for value in (args.lead_in_ms, args.turn_pause_ms, args.speaker_pause_ms, args.section_pause_ms)
    ):
        raise RenderError("Audio spacing values must be between 0 and 5000 milliseconds.")
    if args.continuity_context_characters < 0 or args.continuity_context_characters > 1000:
        raise RenderError("--continuity-context-characters must be between 0 and 1000.")
    if not args.script.is_file():
        raise RenderError(f"Master script not found: {args.script}")
    script_snapshot = assert_legacy_script_path(args.script, args.episode_id)

    timestamp = args.timestamp or dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    if not re.fullmatch(r"\d{8}T\d{6}Z", timestamp):
        raise RenderError("--timestamp must be formatted YYYYMMDDTHHMMSSZ.")
    segments = parse_script_text(script_snapshot, args.max_words_per_segment)
    front_matter = validate_front_matter(segments)
    segment_end = args.segment_end or len(segments)
    if args.render_only and args.assemble_only:
        raise RenderError("--render-only and --assemble-only cannot be used together.")
    if (args.render_only or args.assemble_only) and not args.work_dir:
        raise RenderError("--render-only and --assemble-only require --work-dir.")
    if args.segment_start < 1 or segment_end < args.segment_start or segment_end > len(segments):
        raise RenderError(f"Segment range must be within 1-{len(segments)}.")
    if args.dry_run:
        print(
            json.dumps(
                {
                    "segments": len(segments),
                    "words": sum(len(x.text.split()) for x in segments),
                    "requested_segment_range": f"{args.segment_start}-{segment_end}",
                    "front_matter": front_matter,
                },
                indent=2,
            )
        )
        return 0

    args.audio_dir.mkdir(parents=True, exist_ok=True)
    basename = f"{args.episode_id}-{timestamp}"
    master_suffix = ".wav" if args.provider == "openai-tts" else ".aiff"
    master_path = args.audio_dir / f"{basename}.master{master_suffix}"
    final_path = args.audio_dir / f"{basename}.{args.format}"
    manifest_path = args.audio_dir / f"{basename}.render-manifest.json"
    if not args.render_only and (master_path.exists() or final_path.exists() or manifest_path.exists()):
        raise RenderError(f"Refusing to overwrite existing artifact: {basename}")

    temporary: tempfile.TemporaryDirectory[str] | None = None
    if args.work_dir:
        work_dir = args.work_dir.resolve()
        work_dir.mkdir(parents=True, exist_ok=True)
    else:
        temporary = tempfile.TemporaryDirectory(prefix=f"{basename}-", dir=args.audio_dir)
        work_dir = Path(temporary.name)
    render_settings = {
        "script_sha256": sha256(args.script),
        "provider": args.provider,
        "model": args.openai_model if args.provider == "openai-tts" else None,
        "instructor_voice": args.instructor_voice,
        "learner_voice": args.learner_voice,
        "delivery_pace": args.delivery_pace if args.provider == "openai-tts" else None,
        "instructor_style": args.instructor_style if args.provider == "openai-tts" else None,
        "learner_style": args.learner_style if args.provider == "openai-tts" else None,
        "max_words_per_segment": args.max_words_per_segment,
        "lead_in_ms": args.lead_in_ms,
        "turn_pause_ms": args.turn_pause_ms,
        "speaker_pause_ms": args.speaker_pause_ms,
        "section_pause_ms": args.section_pause_ms,
        "continuity_context_characters": args.continuity_context_characters,
    }
    settings_path = work_dir / "render-settings.json"
    if settings_path.exists():
        try:
            existing_settings = json.loads(settings_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise RenderError(f"Invalid render settings file: {settings_path}") from exc
        if existing_settings != render_settings:
            raise RenderError(
                "The existing work directory was created with a different script, voice, style, pace, or "
                "segmentation setting. Use a new --work-dir rather than mixing incompatible renders."
            )
    elif args.assemble_only:
        raise RenderError(f"Cannot assemble without render settings: {settings_path}")
    else:
        settings_path.write_text(json.dumps(render_settings, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    part_suffix = ".wav" if args.provider == "openai-tts" else ".aiff"

    def part_path(segment: Segment) -> Path:
        return work_dir / f"{segment.index:03d}-{segment.speaker.lower()}{part_suffix}"

    try:
        all_parts = [part_path(segment) for segment in segments]
        if args.assemble_only:
            missing = [str(path) for path in all_parts if not path.is_file()]
            if missing:
                raise RenderError(f"Cannot assemble; {len(missing)} segment(s) are missing from {work_dir}.")
        else:
            api_key = os.environ.get("OPENAI_API_KEY")
            if args.provider == "openai-tts" and not api_key:
                raise RenderError(
                    "OPENAI_API_KEY is required for --provider openai-tts. Set it in your shell; do not add it to the repository."
                )
            for position, segment in enumerate(segments[args.segment_start - 1 : segment_end], start=args.segment_start - 1):
                output_part = part_path(segment)
                if output_part.is_file():
                    print(f"keeping segment {segment.index}/{len(segments)}: already rendered", file=sys.stderr, flush=True)
                    continue
                voice = args.instructor_voice if segment.speaker == "INSTRUCTOR" else args.learner_voice
                voice_style = args.instructor_style if segment.speaker == "INSTRUCTOR" else args.learner_style
                print(f"rendering segment {segment.index}/{len(segments)}: {segment.speaker.lower()}", file=sys.stderr, flush=True)
                if args.provider == "openai-tts":
                    render_openai_segment(
                        segment,
                        work_dir,
                        voice,
                        args.openai_model,
                        api_key,
                        args.delivery_pace,
                        voice_style,
                        build_continuity_context(segments, position, args.continuity_context_characters),
                        args.segment_timeout,
                    )
                else:
                    render_segment(segment, work_dir, voice, args.rate, args.segment_timeout)
            if args.render_only:
                print(json.dumps({"work_dir": str(work_dir), "rendered_segment_range": f"{args.segment_start}-{segment_end}"}))
                return 0

        if args.provider == "openai-tts":
            duration_seconds = join_openai_wav_with_pauses(
                list(zip(all_parts, segments)),
                master_path,
                args.lead_in_ms,
                args.turn_pause_ms,
                args.speaker_pause_ms,
                args.section_pause_ms,
            )
        else:
            audio_format, frames = join_aiff(all_parts, master_path)
            duration_seconds = frames / audio_format.sample_rate
        final_notice_segment = front_matter["production_notice_segments"][-1]
        front_master = args.audio_dir / f"{basename}.front-matter-check{master_suffix}"
        front_check = args.audio_dir / f"{basename}.front-matter-check.mp3"
        if args.provider == "openai-tts":
            front_duration_seconds = join_openai_wav_with_pauses(
                list(zip(all_parts[:final_notice_segment], segments[:final_notice_segment])),
                front_master,
                args.lead_in_ms,
                args.turn_pause_ms,
                args.speaker_pause_ms,
                args.section_pause_ms,
            )
        else:
            _front_format, front_frames = join_aiff(all_parts[:final_notice_segment], front_master)
            front_duration_seconds = front_frames / _front_format.sample_rate
        run_ffmpeg(front_master, front_check, args.mp3_bitrate)
        if args.format == "mp3":
            run_ffmpeg(master_path, final_path, args.mp3_bitrate)
        elif args.format == "wav" and master_path.suffix != ".wav":
            raise RenderError("WAV output is only available with --provider openai-tts; use --format aiff or mp3.")
        elif args.format == "aiff" and master_path.suffix != ".aiff":
            raise RenderError("AIFF output is only available with --provider macos-say; use --format wav or mp3.")
        else:
            final_path = master_path
        manifest = {
            "episode_id": args.episode_id,
            "timestamp_utc": timestamp,
            "source_script": str(args.script.resolve()),
            "output": str(final_path.resolve()),
            "lossless_master": str(master_path.resolve()),
            "format": args.format,
            "duration_seconds": round(duration_seconds, 3),
            "sha256": sha256(final_path),
            "segments": len(segments),
            "front_matter": front_matter,
            "front_matter_check": {
                "output": str(front_check.resolve()),
                "duration_seconds": round(front_duration_seconds, 3),
                "sha256": sha256(front_check),
            },
            "render_settings": str(settings_path.resolve()),
            "voices": {"instructor": args.instructor_voice, "learner": args.learner_voice},
            "provider": args.provider,
            "model": args.openai_model if args.provider == "openai-tts" else None,
            "macos_say_rate": args.rate if args.provider == "macos-say" else None,
            "delivery_pace": args.delivery_pace if args.provider == "openai-tts" else None,
            "voice_style": {
                "instructor": args.instructor_style,
                "learner": args.learner_style,
            }
            if args.provider == "openai-tts"
            else None,
            "max_words_per_segment": args.max_words_per_segment,
            "audio_spacing_ms": {
                "lead_in": args.lead_in_ms,
                "turn": args.turn_pause_ms,
                "speaker": args.speaker_pause_ms,
                "section": args.section_pause_ms,
            },
        }
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        if args.keep_intermediates and temporary:
            retained = args.audio_dir / f"{basename}.intermediates"
            shutil.copytree(work_dir, retained)
    finally:
        if temporary:
            temporary.cleanup()

    print(json.dumps(manifest, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RenderError as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)
