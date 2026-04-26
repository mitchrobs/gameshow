#!/usr/bin/env python3
"""Build a self-contained, clue-gated mini crossword bank."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

from mini_crossword_content import (
    BLOCKED_ANSWERS,
    BONUS_WORDS,
    QUALITY_CLUES,
    TEMPLATES,
    THEMES,
    clue_metadata_for,
    quality_clues_for,
    theme_tags_for,
)

BASE_DIR = Path(__file__).resolve().parents[1]
OUT_PATH = BASE_DIR / "src" / "data" / "miniCrosswordBank.json"
MIN_COUNTS = {3: 90, 4: 80, 5: 320, 7: 70}


def existing_entries() -> List[dict]:
    if not OUT_PATH.exists():
        return []
    payload = json.loads(OUT_PATH.read_text())
    return list(payload.get("entries", []))


def normalize_entry(raw: dict) -> dict | None:
    answer = "".join(ch for ch in str(raw.get("answer", "")).upper() if ch.isalpha())
    if len(answer) not in (3, 4, 5, 7):
        return None
    if answer in BLOCKED_ANSWERS:
        return None
    if len(answer) in (4, 7) and answer not in QUALITY_CLUES:
        return None

    metadata = clue_metadata_for(answer, raw.get("clueOptions", []))
    clues = [item["text"] for item in metadata]
    if not clues:
        return None

    difficulty = str(raw.get("difficulty", "medium"))
    if difficulty not in {"easy", "medium", "hard"}:
        difficulty = "medium"
    if len(answer) == 3 and answer in QUALITY_CLUES:
        difficulty = "easy"
    elif len(answer) == 7:
        difficulty = "medium"

    theme_tags = theme_tags_for(answer, raw.get("themeTags", []), clues)
    return {
        "answer": answer,
        "clueOptions": clues,
        "clueMetadata": metadata,
        "difficulty": difficulty,
        "themeTags": theme_tags,
        "isModern": bool(raw.get("isModern", False)) or "culture-corner" in theme_tags,
        "isBonusEligible": len(answer) == 7,
    }


def curated_entries_by_answer() -> Dict[str, dict]:
    entries: Dict[str, dict] = {}
    for answer, meta in QUALITY_CLUES.items():
        if len(answer) not in (3, 4, 5, 7):
            continue
        if answer in BLOCKED_ANSWERS:
            continue
        metadata = clue_metadata_for(answer)
        clues = [item["text"] for item in metadata]
        if not clues:
            continue
        theme_tags = theme_tags_for(answer, (), clues)
        entries[answer] = {
            "answer": answer,
            "clueOptions": clues,
            "clueMetadata": metadata,
            "difficulty": "easy" if len(answer) in (3, 4) else "medium",
            "themeTags": theme_tags,
            "isModern": "culture-corner" in theme_tags,
            "isBonusEligible": len(answer) == 7,
        }
    return entries


def build_entries() -> List[dict]:
    by_answer = curated_entries_by_answer()
    for raw in existing_entries():
        entry = normalize_entry(raw)
        if not entry:
            continue
        # Curated entries have hand-written clues and win over sanitized legacy data.
        by_answer.setdefault(entry["answer"], entry)

    entries = sorted(by_answer.values(), key=lambda item: (len(item["answer"]), item["answer"]))
    counts = {length: 0 for length in MIN_COUNTS}
    for entry in entries:
        counts[len(entry["answer"])] += 1
    missing = [
        f"{length}-letter: {counts[length]}/{minimum}"
        for length, minimum in MIN_COUNTS.items()
        if counts[length] < minimum
    ]
    if missing:
        raise SystemExit("Mini crossword bank is too small after filtering: " + ", ".join(missing))
    return entries


def validate_bonus_words() -> List[dict]:
    theme_ids = {theme["id"] for theme in THEMES}
    bonus_words = []
    for raw in BONUS_WORDS:
        answer = str(raw["answer"]).upper()
        theme_id = str(raw["themeId"])
        clue = str(raw["clue"]).strip()
        if len(answer) != 7 or not answer.isalpha():
            raise SystemExit(f"Bonus word must be 7 letters: {answer}")
        if theme_id not in theme_ids:
            raise SystemExit(f"Unknown bonus theme: {theme_id}")
        bonus_words.append(
            {
                "answer": answer,
                "themeId": theme_id,
                "clue": clue,
                "difficulty": "hard",
            }
        )

    by_theme = {theme_id: 0 for theme_id in theme_ids}
    for bonus in bonus_words:
        by_theme[bonus["themeId"]] += 1
    missing = [theme_id for theme_id, count in by_theme.items() if count == 0]
    if missing:
        raise SystemExit(f"Missing bonus words for themes: {', '.join(sorted(missing))}")
    return bonus_words


def main() -> None:
    entries = build_entries()
    payload = {
        "themes": THEMES,
        "templates": TEMPLATES,
        "entries": entries,
        "bonusWords": validate_bonus_words(),
    }
    OUT_PATH.write_text(json.dumps(payload, indent=2) + "\n")

    counts: Dict[int, int] = {}
    for entry in entries:
        counts[len(entry["answer"])] = counts.get(len(entry["answer"]), 0) + 1
    print(f"Wrote {OUT_PATH}")
    print("entries:", len(entries), "|", " | ".join(f"{k}-letter: {v}" for k, v in sorted(counts.items())))


if __name__ == "__main__":
    main()
