#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BACKEND_BANK_PATH = ROOT / "supertime-backend/internal/generator/minicrossword/data/bank.json"
BACKEND_SCHEDULE_PATH = ROOT / "supertime-backend/internal/generator/minicrossword/data/schedule.json"

PACK_START = date(2026, 5, 15)
PACK_DAYS = 500
PACK_END = PACK_START + timedelta(days=PACK_DAYS - 1)
ALLOWED_SOURCES = {"editorial", "theme-editor"}
BAD_CLUE_RE = re.compile(
    r"\b(abbreviation|acronym|initialism|roman numeral|street names?|enzyme|genus|province|"
    r"capital|taxonomic|archaic|obsolete|biblical|terrorist|federal agency|metallic element|"
    r"radioactive|coenzyme|personality inventory|collagen disease|parasitic|witchcraft|talipot|"
    r"cuttlefish|dynasty|profane|everyday \d-letter word|crossword answer)\b",
    re.IGNORECASE,
)
BLOCKED_ANSWERS = {"PUS", "STD", "STI", "WAR", "GUN", "GUNS", "NAZI"}


def letters_only(value: str) -> str:
    return re.sub(r"[^A-Z]", "", value.upper())


def template_slots(rows: list[str]) -> list[tuple[str, int]]:
    slots: list[tuple[str, int]] = []
    size = len(rows)
    for row in range(size):
        for col in range(size):
            if rows[row][col] == "#":
                continue
            starts_across = col == 0 or rows[row][col - 1] == "#"
            starts_down = row == 0 or rows[row - 1][col] == "#"
            if starts_across:
                cc = col
                length = 0
                while cc < size and rows[row][cc] != "#":
                    length += 1
                    cc += 1
                if length >= 3:
                    slots.append(("across", length))
            if starts_down:
                rr = row
                length = 0
                while rr < size and rows[rr][col] != "#":
                    length += 1
                    rr += 1
                if length >= 3:
                    slots.append(("down", length))
    return slots


def template_covered_cells(rows: list[str]) -> set[tuple[int, int]]:
    covered: set[tuple[int, int]] = set()
    size = len(rows)
    for row in range(size):
        for col in range(size):
            if rows[row][col] == "#":
                continue
            if col == 0 or rows[row][col - 1] == "#":
                cells = []
                cc = col
                while cc < size and rows[row][cc] != "#":
                    cells.append((row, cc))
                    cc += 1
                if len(cells) >= 3:
                    covered.update(cells)
            if row == 0 or rows[row - 1][col] == "#":
                cells = []
                rr = row
                while rr < size and rows[rr][col] != "#":
                    cells.append((rr, col))
                    rr += 1
                if len(cells) >= 3:
                    covered.update(cells)
    return covered


def add(failures: list[str], message: str) -> None:
    failures.append(message)


def audit() -> tuple[list[str], dict[str, object]]:
    bank = json.loads(BACKEND_BANK_PATH.read_text())
    schedule = json.loads(BACKEND_SCHEDULE_PATH.read_text())
    failures: list[str] = []

    if schedule.get("start_date") != PACK_START.isoformat():
        add(failures, f"schedule start_date is {schedule.get('start_date')}, expected {PACK_START.isoformat()}")
    if schedule.get("end_date") != PACK_END.isoformat():
        add(failures, f"schedule end_date is {schedule.get('end_date')}, expected {PACK_END.isoformat()}")
    entries = schedule.get("entries", [])
    if schedule.get("length") != PACK_DAYS or len(entries) != PACK_DAYS:
        add(failures, f"schedule length is metadata={schedule.get('length')} entries={len(entries)}, expected {PACK_DAYS}")

    themes = {theme["id"]: theme for theme in bank.get("themes", [])}
    bonus_by_theme: dict[str, set[str]] = defaultdict(set)
    for bonus in bank.get("bonusWords", []):
        bonus_by_theme[bonus["themeId"]].add(bonus["answer"])
    if len(themes) < 100:
        add(failures, f"theme lane count is {len(themes)}, expected at least 100")
    for theme_id, theme in themes.items():
        if not theme.get("keywords"):
            add(failures, f"theme {theme_id} is missing keywords")
        if len(bonus_by_theme[theme_id]) < 2:
            add(failures, f"theme {theme_id} has fewer than two bonus words")

    answer_bank = {entry["answer"] for entry in bank.get("entries", [])}
    templates = {template["id"]: template["rows"] for template in bank.get("templates", [])}
    template_counts = Counter()
    signatures = Counter()
    answer_sets = Counter()
    last_grid_use: dict[str, int] = {}
    last_bonus_use: dict[str, int] = {}
    sunday_count = 0

    for index, entry in enumerate(entries):
        expected_date = (PACK_START + timedelta(days=index)).isoformat()
        entry_date = entry.get("date")
        if entry_date != expected_date:
            add(failures, f"entry {index} date is {entry_date}, expected {expected_date}")
        parsed_date = date.fromisoformat(entry_date)
        is_sunday = parsed_date.weekday() == 6
        if is_sunday:
            sunday_count += 1
            if entry.get("size") != 7 or entry.get("difficulty") != "mega":
                add(failures, f"{entry_date} is Sunday but size/difficulty is {entry.get('size')}/{entry.get('difficulty')}")
        elif entry.get("size") != 5:
            add(failures, f"{entry_date} is not Sunday but size is {entry.get('size')}")

        template_id = entry.get("templateId")
        template_counts[template_id] += 1
        rows = templates.get(template_id)
        if rows is None:
            add(failures, f"{entry_date} references missing template {template_id}")
            rows = []
        else:
            open_cells = sum(cell != "#" for row in rows for cell in row)
            slot_lengths = [length for _, length in template_slots(rows)]
            covered_cells = template_covered_cells(rows)
            uncovered_cells = [
                (row_index, col_index)
                for row_index, row in enumerate(rows)
                for col_index, cell in enumerate(row)
                if cell != "#" and (row_index, col_index) not in covered_cells
            ]
            if uncovered_cells:
                add(failures, f"{entry_date} template {template_id} has uncovered open cells: {uncovered_cells}")
            if entry.get("size") == 5:
                if not (19 <= open_cells <= 22):
                    add(failures, f"{entry_date} 5x5 has {open_cells} open cells, expected 19-22")
                if not (8 <= len(slot_lengths) <= 10):
                    add(failures, f"{entry_date} 5x5 has {len(slot_lengths)} answers, expected 8-10")
                if slot_lengths.count(3) > 4:
                    add(failures, f"{entry_date} 5x5 has {slot_lengths.count(3)} three-letter answers, max 4")
            elif entry.get("size") == 7:
                if not (38 <= open_cells <= 45):
                    add(failures, f"{entry_date} 7x7 has {open_cells} open cells, expected 38-45")
                if not (14 <= len(slot_lengths) <= 20):
                    add(failures, f"{entry_date} 7x7 has {len(slot_lengths)} answers, expected 14-20")
                if slot_lengths.count(7) < 4:
                    add(failures, f"{entry_date} 7x7 has {slot_lengths.count(7)} seven-letter answers, expected at least 4")
                if slot_lengths.count(3) / len(slot_lengths) > 0.45:
                    add(failures, f"{entry_date} 7x7 has {slot_lengths.count(3)}/{len(slot_lengths)} three-letter answers")

        quality = entry.get("quality", {})
        if quality.get("editorialStatus") != "passed":
            add(failures, f"{entry_date} editorialStatus is {quality.get('editorialStatus')}")
        for key in ("generatedAnswerCount", "fallbackClueCount", "legacyClueCount", "answerRepeatCount", "signatureRepeatCount", "bonusGridCollision"):
            if quality.get(key) != 0:
                add(failures, f"{entry_date} quality {key} is {quality.get(key)}, expected 0")
        if quality.get("layoutScore", 0) < 80:
            add(failures, f"{entry_date} layoutScore is {quality.get('layoutScore')}, expected >=80")
        if quality.get("themeLaneCount", 0) < 100:
            add(failures, f"{entry_date} themeLaneCount is {quality.get('themeLaneCount')}, expected >=100")

        clues = entry.get("clues", {}).get("across", []) + entry.get("clues", {}).get("down", [])
        answers = [clue.get("answer", "") for clue in clues]
        if len(answers) != len(set(answers)):
            add(failures, f"{entry_date} repeats an answer inside the puzzle")
        for clue in clues:
            answer = clue.get("answer", "")
            text = clue.get("text", "")
            if answer not in answer_bank:
                add(failures, f"{entry_date} answer {answer} is missing from the curated bank")
            if answer in BLOCKED_ANSWERS:
                add(failures, f"{entry_date} answer {answer} is blocked")
            if clue.get("source") not in ALLOWED_SOURCES:
                add(failures, f"{entry_date} answer {answer} source is {clue.get('source')}")
            if clue.get("score", 0) < 76:
                add(failures, f"{entry_date} answer {answer} clue score is {clue.get('score')}")
            if BAD_CLUE_RE.search(text):
                add(failures, f"{entry_date} answer {answer} clue uses banned phrasing: {text}")
            if answer and answer in letters_only(text):
                add(failures, f"{entry_date} answer {answer} leaks in clue: {text}")

        signature = entry.get("signature", "")
        signatures[signature] += 1
        answer_set = tuple(sorted(answers))
        answer_sets[answer_set] += 1
        bonus = entry.get("bonusAnswer", "")
        if bonus in set(answers):
            add(failures, f"{entry_date} bonus {bonus} collides with same-day grid")
        if bonus not in answer_bank:
            add(failures, f"{entry_date} bonus {bonus} is missing from the curated bank")
        for answer in answers:
            cooldown = 90 if len(answer) >= 5 else 45
            if answer in last_grid_use and index - last_grid_use[answer] < cooldown:
                add(failures, f"{entry_date} answer {answer} repeats after {index - last_grid_use[answer]} days, expected {cooldown}+")
            if answer in last_bonus_use and index - last_bonus_use[answer] < 180:
                add(failures, f"{entry_date} answer {answer} appears {index - last_bonus_use[answer]} days after bonus use, expected 180+")
            last_grid_use[answer] = index
        if bonus in last_grid_use and index - last_grid_use[bonus] < 180:
            add(failures, f"{entry_date} bonus {bonus} appears {index - last_grid_use[bonus]} days after grid use, expected 180+")
        last_bonus_use[bonus] = index

    if sunday_count != 72:
        add(failures, f"Sunday count is {sunday_count}, expected 72")
    if template_counts.get("bay-left", 0) == 0 or template_counts.get("bay-right", 0) == 0:
        add(failures, "bay-left and bay-right must both appear in the shipped schedule")
    if template_counts.get("hope-square", 0) > 1:
        add(failures, f"hope-square appears {template_counts.get('hope-square', 0)} times, expected at most 1")
    for signature, count in signatures.items():
        if count > 1:
            add(failures, f"signature repeats {count} times: {signature}")
    for answer_set, count in answer_sets.items():
        if count > 1:
            add(failures, f"answer set repeats {count} times: {'|'.join(answer_set)}")

    summary = {
        "days": len(entries),
        "sundays": sunday_count,
        "themes": len(themes),
        "templates": dict(template_counts),
        "uniqueSignatures": sum(1 for count in signatures.values() if count == 1),
        "repeatedSignatures": sum(1 for count in signatures.values() if count > 1),
        "failureCount": len(failures),
    }
    return failures, summary


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="print JSON summary")
    parser.add_argument("--max-failures", type=int, default=80)
    args = parser.parse_args()
    failures, summary = audit()
    if args.json:
        print(json.dumps({"summary": summary, "failures": failures[: args.max_failures]}, indent=2))
    else:
        print(json.dumps(summary, sort_keys=True))
        for failure in failures[: args.max_failures]:
            print(f"- {failure}")
        if len(failures) > args.max_failures:
            print(f"- ... {len(failures) - args.max_failures} more failures")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
