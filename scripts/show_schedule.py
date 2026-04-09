#!/usr/bin/env python3
"""Print the Moji Mash daily puzzle schedule.

Usage:
  python scripts/show_schedule.py           # next 30 days from today
  python scripts/show_schedule.py --days 60
  python scripts/show_schedule.py --from 2026-04-15 --days 14
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
TS_PUZZLES = BASE_DIR / "src" / "data" / "mojiMashPuzzles.ts"

DAILY_SEED = 942317
DAY_MS = 1000 * 60 * 60 * 24


# ---------------------------------------------------------------------------
# Replicate the TypeScript PRNG (mulberry32 + Fisher-Yates)
# ---------------------------------------------------------------------------

def mulberry32(seed: int):
    """Port of the JS mulberry32 PRNG used in mojiMashPuzzles.ts."""
    t = [(seed + 0x6D2B79F5) & 0xFFFFFFFF]

    def next_val() -> float:
        x = t[0]
        x = ((x ^ (x >> 15)) * (x | 1)) & 0xFFFFFFFF
        x = (x ^ (x + (((x ^ (x >> 7)) * (x | 61)) & 0xFFFFFFFF))) & 0xFFFFFFFF
        t[0] = x
        return (x ^ (x >> 14)) / 4294967296

    return next_val


def get_shuffled_indices(length: int, seed: int) -> list[int]:
    indices = list(range(length))
    rand = mulberry32(seed)
    for i in range(length - 1, 0, -1):
        j = int(rand() * (i + 1))
        indices[i], indices[j] = indices[j], indices[i]
    return indices


def get_local_day_index(d: date) -> int:
    """Days since Unix epoch — matches getLocalDayIndex() in TypeScript."""
    epoch = date(1970, 1, 1)
    return (d - epoch).days


# ---------------------------------------------------------------------------
# Parse mojiMashPuzzles.ts
# ---------------------------------------------------------------------------

def load_puzzles(ts_path: Path) -> list[dict]:
    """Extract puzzle metadata from the TypeScript source via regex."""
    text = ts_path.read_text()

    # Extract each puzzle block: everything between { and the matching }
    # Each block has image:, words:, hint:, and optionally date:
    puzzles = []
    # Split on puzzle boundaries using the known require() pattern
    blocks = re.split(r"(?=\{\s*\n\s*image:\s*require)", text)

    for block in blocks:
        words_match = re.search(r"words:\s*\[([^\]]+)\]", block)
        date_match = re.search(r"date:\s*['\"](\d{4}-\d{2}-\d{2})['\"]", block)
        image_match = re.search(r"require\(['\"].*?/([^/'\"]+\.png)['\"]", block)

        if not words_match:
            continue

        raw_words = words_match.group(1)
        words = [w.strip().strip("'\"") for w in raw_words.split(",") if w.strip()]

        puzzles.append({
            "words": words,
            "slug": "-".join(words),
            "date": date_match.group(1) if date_match else None,
            "filename": image_match.group(1) if image_match else None,
        })

    return puzzles


# ---------------------------------------------------------------------------
# Schedule computation
# ---------------------------------------------------------------------------

def build_schedule(puzzles: list[dict], start: date, days: int) -> list[tuple[date, dict]]:
    # Date-pinned map: YYYY-MM-DD → puzzle index (last write wins)
    date_pinned: dict[str, int] = {}
    for i, p in enumerate(puzzles):
        if p["date"]:
            date_pinned[p["date"]] = i

    # Rotation indices: exclude date-pinned puzzles
    rotation_indices = [i for i, p in enumerate(puzzles) if not p["date"]]

    if not rotation_indices:
        print("Error: no puzzles in rotation pool.", file=sys.stderr)
        sys.exit(1)

    shuffled = get_shuffled_indices(len(rotation_indices), DAILY_SEED)
    daily_order = [rotation_indices[i] for i in shuffled]

    schedule = []
    for offset in range(days):
        d = start + timedelta(days=offset)
        key = d.isoformat()
        if key in date_pinned:
            puzzle_idx = date_pinned[key]
            pinned = True
        else:
            day_index = get_local_day_index(d)
            puzzle_idx = daily_order[day_index % len(daily_order)]
            pinned = False
        schedule.append((d, puzzles[puzzle_idx], pinned))

    return schedule


# ---------------------------------------------------------------------------
# Display
# ---------------------------------------------------------------------------

def print_schedule(schedule: list[tuple[date, dict, bool]]) -> None:
    today = date.today()
    print(f"\n{'DATE':<14} {'WORDS':<38} {'PIN'}")
    print("─" * 60)
    for d, puzzle, pinned in schedule:
        marker = ""
        if d == today:
            marker = " ◀ today"
        pin_label = "📌" if pinned else ""
        words_str = ", ".join(puzzle["words"])
        print(f"{d.isoformat():<14} {words_str:<38} {pin_label}{marker}")
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Show the Moji Mash daily puzzle schedule.")
    p.add_argument("--from", dest="start", default=None,
                   help="Start date YYYY-MM-DD (default: today)")
    p.add_argument("--days", type=int, default=30,
                   help="Number of days to show (default: 30)")
    return p.parse_args()


def main() -> None:
    args = parse_args()

    start = date.fromisoformat(args.start) if args.start else date.today()
    puzzles = load_puzzles(TS_PUZZLES)

    if not puzzles:
        sys.exit(f"Error: no puzzles found in {TS_PUZZLES}")

    rotation_count = sum(1 for p in puzzles if not p["date"])
    pinned_count = sum(1 for p in puzzles if p["date"])
    print(f"\nPool: {len(puzzles)} puzzles total  "
          f"({rotation_count} in rotation, {pinned_count} date-pinned)")

    schedule = build_schedule(puzzles, start, args.days)
    print_schedule(schedule)


if __name__ == "__main__":
    main()
