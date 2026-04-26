#!/usr/bin/env python3
"""
Anchor calibration suite for Moji Mash.

Runs ONLY the Pass-3 playtest (no regeneration, no rubric) against a curated
list of existing, already-promoted genmoji PNGs to establish ground-truth
difficulty anchors. The output is `docs/moji-mash-anchors.json`, which the
moji-mash-editor agent reads at session start so "difficulty" means the same
thing across sessions.

Why a separate suite (not just --check output):
- `generate_moji.py --check` playtests NEW variants during generation. Those
  scores drift with model updates and with the specific variant Claude
  happened to draw.
- Running the playtest against already-shipped assets gives us a STABLE
  reference for what "easy / medium / hard" means in the current calendar.
  When a new candidate playtests the same as `party-pooper`, we know it's
  an easy anchor, regardless of its composite score.

Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python3 scripts/calibrate_anchors.py

With no args it calibrates a default set of ~10 entries spanning the
easy/medium/hard buckets. Pass slugs to override:
  python3 scripts/calibrate_anchors.py party-pooper hedgehog-ninja
"""

from __future__ import annotations

import base64
import json
import os
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional

try:
    from anthropic import Anthropic
except ImportError:
    sys.exit("error: `pip install anthropic` first")


REPO_ROOT = Path(__file__).resolve().parent.parent
ASSETS = REPO_ROOT / "assets" / "genmoji"
PUZZLES_TS = REPO_ROOT / "src" / "data" / "mojiMashPuzzles.ts"
ANCHORS_JSON = REPO_ROOT / "docs" / "moji-mash-anchors.json"

MODEL = "claude-opus-4-6"

# Default slugs — spans easy, medium, and hard difficulty bands from
# docs/moji-mash-puzzle-notes.md. Small on purpose: the anchor suite is
# meant to be expensive but rare (one calibration pass per quarter).
DEFAULT_SLUGS = [
    "party-pooper",         # expected easy (rank 1)
    "date-night",           # expected easy
    "espresso-machine",     # expected easy (literal)
    "ghost-pepper",         # expected easy (already flagged rank-1)
    "hedgehog-ninja",       # expected medium (rank 2-3)
    "grumpy-rainbow",       # expected medium
    "pyramid-scheme",       # expected medium (idiom with misdirect)
    "very-obese-red-robin", # expected hard (4-word)
    "roller-skates-rubber-duck",  # expected hard (4-word)
    "pumpkin-shaped-chocolate-candy",  # expected hard (4-word)
]

_RANK_TO_DIFFICULTY = {1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 0: 1}
_RANK_LABEL = {5: "easy", 4: "easy-fair", 3: "sweet-spot", 2: "hard-fair", 1: "hard"}


@dataclass
class Anchor:
    slug: str
    words: list[str]
    playtest_rank: int  # 1-indexed, 0 = not in top 5
    difficulty: int  # 1-5 (sweet spot 3)
    label: str  # "easy" | "easy-fair" | "sweet-spot" | "hard-fair" | "hard"
    top_guesses: list[list[str]]


def load_pool() -> dict[str, list[str]]:
    """Parse `words: [...]` entries out of mojiMashPuzzles.ts, keyed by slug."""
    text = PUZZLES_TS.read_text("utf-8")
    tuples: list[list[str]] = []
    for m in re.finditer(r"words:\s*\[([^\]]+)\]", text):
        parts = [p.strip().strip("'\"") for p in m.group(1).split(",")]
        tuples.append([p for p in parts if p])
    return {"-".join(t): t for t in tuples}


def generate_hint(words: list[str]) -> str:
    letters = ", ".join(w[0].lower() for w in words)
    return f"Starts with: {letters}"


def _parse_playtest_guesses(raw: str, n_words: int) -> list[list[str]]:
    body = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.IGNORECASE)
    body = re.sub(r"```\s*$", "", body, flags=re.IGNORECASE).strip()
    start = body.find("{")
    end = body.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return []
    try:
        parsed = json.loads(body[start : end + 1])
    except json.JSONDecodeError:
        return []
    guesses = parsed.get("guesses") if isinstance(parsed, dict) else None
    if not isinstance(guesses, list):
        return []
    out: list[list[str]] = []
    for g in guesses:
        if isinstance(g, str):
            tokens = [t.lower() for t in re.split(r"[\s,]+", g) if t]
        elif isinstance(g, list):
            tokens = [str(t).lower().strip() for t in g if str(t).strip()]
        else:
            continue
        if len(tokens) == n_words:
            out.append(tokens)
    return out


def playtest_one(client: Anthropic, slug: str, words: list[str]) -> Optional[Anchor]:
    png = ASSETS / f"{slug}.png"
    if not png.exists():
        print(f"  skip {slug}: PNG not found at {png}", file=sys.stderr)
        return None
    b64 = base64.standard_b64encode(png.read_bytes()).decode("ascii")
    hint = generate_hint(words)
    n_words = len(words)
    print(f"  playtesting {slug} ({n_words} words)…")
    try:
        msg = client.messages.create(
            model=MODEL,
            max_tokens=384,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": "image/png", "data": b64},
                    },
                    {
                        "type": "text",
                        "text": (
                            "You are playing Moji Mash. Look at this emoji puzzle.\n"
                            f'The hint is: "{hint}". The answer is exactly {n_words} '
                            f"word{'s' if n_words != 1 else ''}.\n\n"
                            f"List your TOP 5 best guesses for the {n_words}-word answer, "
                            "from MOST likely to LEAST likely. Each guess is a JSON array "
                            f"of {n_words} lowercase words whose first letters MATCH the hint exactly.\n\n"
                            "Think like a typical player: what does the image most look like? "
                            "Do not reach for obscure idioms unless the image clearly demands it.\n\n"
                            "Reply with STRICT JSON only:\n"
                            '{"guesses": [["w1","w2"], ["w3","w4"], …]}'
                        ),
                    },
                ],
            }],
        )
    except Exception as e:  # noqa: BLE001
        print(f"  {slug}: API error: {e}", file=sys.stderr)
        return None

    raw = msg.content[0].text.strip()
    guesses = _parse_playtest_guesses(raw, n_words)
    target = [w.lower() for w in words]
    rank = 0
    for idx, g in enumerate(guesses[:5]):
        if g == target:
            rank = idx + 1
            break
    diff = _RANK_TO_DIFFICULTY.get(rank, 1)
    label = _RANK_LABEL.get(diff, "unknown")
    rank_str = f"#{rank}" if rank else "miss"
    print(f"    {slug}: rank {rank_str} → difficulty {diff} ({label})")
    return Anchor(
        slug=slug,
        words=words,
        playtest_rank=rank,
        difficulty=diff,
        label=label,
        top_guesses=guesses[:5],
    )


def main() -> int:
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key:
        sys.exit("error: ANTHROPIC_API_KEY is not set")

    pool = load_pool()
    slugs = sys.argv[1:] if len(sys.argv) > 1 else DEFAULT_SLUGS
    missing = [s for s in slugs if s not in pool]
    if missing:
        sys.exit(f"error: unknown slug(s) in pool: {missing}")

    client = Anthropic(api_key=key)
    anchors: list[Anchor] = []
    print(f"Calibrating {len(slugs)} anchor(s)…")
    for slug in slugs:
        a = playtest_one(client, slug, pool[slug])
        if a:
            anchors.append(a)

    # Bucket summary
    buckets: dict[str, list[str]] = {"easy": [], "easy-fair": [], "sweet-spot": [], "hard-fair": [], "hard": []}
    for a in anchors:
        buckets.setdefault(a.label, []).append(a.slug)
    print("\nBuckets:")
    for b in ("easy", "easy-fair", "sweet-spot", "hard-fair", "hard"):
        names = buckets.get(b, [])
        print(f"  {b:11s} ({len(names)}): {', '.join(names) if names else '—'}")

    payload = {
        "generated_at": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "model": MODEL,
        "anchors": [asdict(a) for a in anchors],
    }
    ANCHORS_JSON.parent.mkdir(parents=True, exist_ok=True)
    ANCHORS_JSON.write_text(json.dumps(payload, indent=2) + "\n", "utf-8")
    print(f"\nWrote {len(anchors)} anchor(s) to {ANCHORS_JSON.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
