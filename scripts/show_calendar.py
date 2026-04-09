#!/usr/bin/env python3
"""Generate a calendar HTML view of the Moji Mash daily puzzle schedule.

Usage:
  python scripts/show_calendar.py                     # current + next month
  python scripts/show_calendar.py --months 3
  python scripts/show_calendar.py --from 2026-04-01
  python scripts/show_calendar.py --output calendar.html  # custom output path
"""

from __future__ import annotations

import argparse
import calendar
import re
import sys
from datetime import date, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
TS_PUZZLES = BASE_DIR / "src" / "data" / "mojiMashPuzzles.ts"
DEFAULT_OUT = BASE_DIR / "tmp" / "moji-mash" / "calendar.html"

DAILY_SEED = 942317

# Map word-count to a difficulty label
DIFFICULTY = {2: "easy", 3: "medium", 4: "hard"}

# Known holiday labels for date-pinned entries
HOLIDAY_LABELS: dict[str, str] = {
    "01-01": "New Year's",
    "02-14": "Valentine's Day",
    "03-17": "St. Patrick's Day",
    "04-15": "Tax Day",
    "04-22": "Earth Day",
    "05-25": "Memorial Day",
    "07-04": "Independence Day",
    "10-31": "Halloween",
    "11-27": "Thanksgiving",
    "12-25": "Christmas",
    "12-31": "New Year's Eve",
}
# Variable holidays (approximate, good enough for display)
VARIABLE_HOLIDAYS: dict[str, str] = {
    "2026-05-10": "Mother's Day",
    "2026-06-21": "Father's Day",
    "2026-09-07": "Labor Day",
    "2026-04-05": "Easter",
}


# ---------------------------------------------------------------------------
# PRNG — identical to show_schedule.py
# ---------------------------------------------------------------------------

def mulberry32(seed: int):
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
    return (d - date(1970, 1, 1)).days


# ---------------------------------------------------------------------------
# Puzzle loading — identical to show_schedule.py
# ---------------------------------------------------------------------------

def load_puzzles(ts_path: Path) -> list[dict]:
    text = ts_path.read_text()
    puzzles = []
    blocks = re.split(r"(?=\{\s*\n\s*image:\s*require)", text)
    for block in blocks:
        words_match = re.search(r"words:\s*\[([^\]]+)\]", block)
        date_match = re.search(r"date:\s*['\"](\d{4}-\d{2}-\d{2})['\"]", block)
        if not words_match:
            continue
        raw_words = words_match.group(1)
        words = [w.strip().strip("'\"") for w in raw_words.split(",") if w.strip()]
        puzzles.append({
            "words": words,
            "slug": "-".join(words),
            "date": date_match.group(1) if date_match else None,
        })
    return puzzles


def build_date_map(puzzles: list[dict], start: date, end: date) -> dict[str, dict]:
    date_pinned: dict[str, int] = {}
    for i, p in enumerate(puzzles):
        if p["date"]:
            date_pinned[p["date"]] = i

    rotation_indices = [i for i, p in enumerate(puzzles) if not p["date"]]
    shuffled = get_shuffled_indices(len(rotation_indices), DAILY_SEED)
    daily_order = [rotation_indices[i] for i in shuffled]

    result: dict[str, dict] = {}
    d = start
    while d <= end:
        key = d.isoformat()
        if key in date_pinned:
            p = puzzles[date_pinned[key]]
            pinned = True
        else:
            day_index = get_local_day_index(d)
            p = puzzles[daily_order[day_index % len(daily_order)]]
            pinned = False

        mm_dd = d.strftime("%m-%d")
        holiday = VARIABLE_HOLIDAYS.get(key) or HOLIDAY_LABELS.get(mm_dd)

        result[key] = {
            "words": p["words"],
            "slug": p["slug"],
            "pinned": pinned,
            "holiday": holiday,
            "difficulty": DIFFICULTY.get(len(p["words"]), "hard"),
        }
        d += timedelta(days=1)
    return result


# ---------------------------------------------------------------------------
# HTML generation
# ---------------------------------------------------------------------------

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
  padding: 32px 28px 64px;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: #6e6e73;
  margin-bottom: 28px;
}

.month-block {
  margin-bottom: 44px;
}

.month-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1d1d1f;
}

table.cal {
  width: 100%;
  border-collapse: separate;
  border-spacing: 5px;
  table-layout: fixed;
}

table.cal th {
  font-size: 11px;
  font-weight: 600;
  color: #6e6e73;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  padding: 4px 0 8px;
}

table.cal td {
  width: 14.28%;
  vertical-align: top;
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid transparent;
  padding: 9px 9px 11px;
  height: 110px;
}

table.cal td.empty {
  background: transparent;
  border-color: transparent;
}

table.cal td.today {
  border-color: #007aff;
  background: #f0f7ff;
}

table.cal td.pinned {
  background: #fffbf0;
  border-color: #e8b800;
}

.day-num {
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 5px;
}

td.today .day-num { color: #007aff; }

.holiday-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #b07000;
  margin-bottom: 4px;
  overflow: hidden;
  white-space: nowrap;
}

.word-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  padding: 1px 5px;
  border-radius: 4px;
  margin: 1px 1px 0 0;
  white-space: nowrap;
}

td.difficulty-easy  .word-tag { background: #e3f4e9; color: #1a6e35; }
td.difficulty-medium .word-tag { background: #e3eaff; color: #1a35a0; }
td.difficulty-hard  .word-tag { background: #f0e3ff; color: #6a1a9a; }
td.pinned           .word-tag { background: #fff0b0; color: #7a4e00; }

.legend {
  font-size: 12px;
  color: #6e6e73;
  margin-bottom: 28px;
}
.legend-item {
  display: inline-block;
  margin-right: 18px;
}
.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
}
"""


def month_html(year: int, month: int, date_map: dict[str, dict], today: date) -> str:
    cal = calendar.monthcalendar(year, month)
    month_name = date(year, month, 1).strftime("%B %Y")

    header_row = "".join(
        f"<th>{d}</th>"
        for d in ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    )

    week_rows = []
    for week in cal:
        cells = []
        for day_num in week:
            if day_num == 0:
                cells.append('<td class="empty"></td>')
                continue

            d = date(year, month, day_num)
            key = d.isoformat()
            info = date_map.get(key)

            is_today = d == today
            is_pinned = info["pinned"] if info else False
            difficulty = info["difficulty"] if info else "easy"

            classes = [f"difficulty-{difficulty}"]
            if is_today:
                classes.append("today")
            if is_pinned:
                classes.append("pinned")

            day_label = f'<div class="day-num">{day_num}{"&nbsp;&#x25CF;" if is_today else ""}{"&nbsp;&#128204;" if is_pinned else ""}</div>'

            content = day_label
            if info:
                if info.get("holiday"):
                    content += f'<div class="holiday-label">{info["holiday"]}</div>'
                for w in info["words"]:
                    content += f'<span class="word-tag">{w}</span>'

            cells.append(f'<td class="{" ".join(classes)}">{content}</td>')

        week_rows.append(f"<tr>{''.join(cells)}</tr>")

    table = (
        f'<table class="cal">'
        f"<tr>{header_row}</tr>"
        f"{''.join(week_rows)}"
        f"</table>"
    )
    return f'<div class="month-block"><div class="month-title">{month_name}</div>{table}</div>'


def build_html(date_map: dict[str, dict], start: date, months: int, today: date) -> str:
    pool_total = len(set(v["slug"] for v in date_map.values()))
    pinned_count = sum(1 for v in date_map.values() if v["pinned"])

    month_blocks = []
    y, m = start.year, start.month
    for _ in range(months):
        month_blocks.append(month_html(y, m, date_map, today))
        m += 1
        if m > 12:
            m = 1
            y += 1

    legend = (
        '<div class="legend">'
        '<span class="legend-item"><span class="swatch" style="background:#e3f4e9"></span>2-word</span>'
        '<span class="legend-item"><span class="swatch" style="background:#e3eaff"></span>3-word</span>'
        '<span class="legend-item"><span class="swatch" style="background:#f0e3ff"></span>4-word</span>'
        '<span class="legend-item"><span class="swatch" style="background:#fff0b0"></span>&#128204; Date-pinned</span>'
        '</div>'
    )

    body = f"""
    <h1>Moji Mash Schedule</h1>
    <p class="subtitle">Today: {today.isoformat()} &nbsp;·&nbsp; {pool_total} puzzles in view &nbsp;·&nbsp; {pinned_count} date-pinned</p>
    {legend}
    {"".join(month_blocks)}
    """

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Moji Mash Schedule</title>
<style>{CSS}</style>
</head>
<body>{body}</body>
</html>"""


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate a calendar HTML view of the Moji Mash schedule.")
    p.add_argument("--from", dest="start", default=None,
                   help="Start month YYYY-MM (default: current month)")
    p.add_argument("--months", type=int, default=2,
                   help="Number of months to show (default: 2)")
    p.add_argument("--output", type=Path, default=DEFAULT_OUT,
                   help=f"Output HTML path (default: {DEFAULT_OUT})")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    today = date.today()

    if args.start:
        try:
            y, m = map(int, args.start.split("-")[:2])
            start = date(y, m, 1)
        except Exception:
            sys.exit(f"Error: --from must be YYYY-MM, got '{args.start}'")
    else:
        start = date(today.year, today.month, 1)

    # Build date range: first day of start month to last day of final month
    end_month = start.month + args.months - 1
    end_year = start.year + (end_month - 1) // 12
    end_month = (end_month - 1) % 12 + 1
    last_day = calendar.monthrange(end_year, end_month)[1]
    end = date(end_year, end_month, last_day)

    puzzles = load_puzzles(TS_PUZZLES)
    if not puzzles:
        sys.exit(f"Error: no puzzles found in {TS_PUZZLES}")

    date_map = build_date_map(puzzles, start, end)
    html = build_html(date_map, start, args.months, today)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(html)
    print(f"Calendar saved: {args.output.relative_to(BASE_DIR)}")
    print(f"Open with:      open {args.output.relative_to(BASE_DIR)}")


if __name__ == "__main__":
    main()
