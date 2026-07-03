#!/usr/bin/env python3
"""Build the dated Daybreak mini crossword schedule."""

from __future__ import annotations

import argparse
import json
import os
import time
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Optional, Sequence, Set, Tuple

from mini_crossword_content import BAD_CLUE_RE, THEMES

BASE_DIR = Path(__file__).resolve().parents[1]
BANK_PATH = BASE_DIR / "src" / "data" / "miniCrosswordBank.json"
OUTPUT_PATH = BASE_DIR / "src" / "data" / "miniCrosswordSchedule.generated.ts"
CALIBRATION_PATH = BASE_DIR / "docs" / "mini-crossword-calibration.md"

DEFAULT_PACK_START = date(2026, 5, 15)
DEFAULT_PACK_END = date(2027, 5, 14)
MAX_CANDIDATES_PER_SLOT = 140
# Node budget is sized for the native kernel (~50x the retired pure-Python
# engine); MCW_ENGINE=py runs will be slow at this budget but correct.
MAX_SEARCH_NODES = 100000
MAX_GRID_ATTEMPTS_PER_DAY = 120
# A word may appear at most this many times inside any trailing cooldown
# window (one use per window: every re-use gap strictly exceeds the word's
# cooldown). Cooldowns are tiered by pool size — a flat 90 days on the
# 384-word 3-letter pool blocks nearly half of it at steady state and makes
# rigid templates unfillable — and jittered per word (deterministically) so
# re-uses cannot snap back on a fixed cadence the way the shipped pack's
# 45-day metronome did.
REPEAT_LIMIT_PER_WINDOW = 1
# Hard per-pack ceiling by answer length: a word may appear at most this many
# times across the whole generated window, regardless of cooldown relaxation.
# This is the audit-enforced guarantee; cooldowns shape spacing, caps bound
# totals. 3-letter English is nearly exhausted (~500 usable words for ~1,500
# slots, avg 3.0 uses), so short glue words get more headroom; everything
# else is capped tight.
MAX_USES_PER_PACK = {3: 8, 4: 4, 5: 4}
MAX_USES_DEFAULT = 3


def max_uses_for(word: str) -> int:
    return MAX_USES_PER_PACK.get(len(word), MAX_USES_DEFAULT)
WORD_COOLDOWN_BASE = {3: 35, 4: 60}
WORD_COOLDOWN_DEFAULT = 90
WORD_COOLDOWN_JITTER = 15
# First ladder window; >= every per-word cooldown so the per-word value
# governs on strict days.
STRICT_COOLDOWN_WINDOW = WORD_COOLDOWN_DEFAULT + WORD_COOLDOWN_JITTER


def word_cooldown_days(word: str) -> int:
    base = WORD_COOLDOWN_BASE.get(len(word), WORD_COOLDOWN_DEFAULT)
    return base + stable_hash("cooldown:" + word) % WORD_COOLDOWN_JITTER

# Answers that must never appear in a served grid. Seeded from a profanity
# audit of the current bank (ASS/ASSES shipped to prod once); the filter lives
# here so bank expansions cannot silently reintroduce crude fill.
BLOCKED_ANSWERS = {
    # found in the current bank
    "ASS",
    "ASSES",
    "BASTARD",
    "BITCH",
    "BITCHES",
    "BOOBS",
    "COCAINE",
    "COCK",
    "CRAP",
    "DAMN",
    "DICKS",
    "HELL",
    "HORNY",
    "NAZIS",
    "NIPPLES",
    "PEE",
    "PENIS",
    "PISS",
    "PRICK",
    "QUEER",
    "RAPE",
    "RAPED",
    "SHIT",
    "SHITS",
    "SPERM",
    "WHORE",
    # guard rail for future bank expansions
    "ANAL",
    "ANUS",
    "ARSE",
    "ARSES",
    "BONER",
    "CUNT",
    "CUNTS",
    "DILDO",
    "FAGGOT",
    "FUCK",
    "FUCKED",
    "FUCKS",
    "NIGGER",
    "ORGASM",
    "PORN",
    "PORNO",
    "SEMEN",
    "SLUT",
    "SLUTS",
    "TITS",
    "TURD",
    "TURDS",
    "TWAT",
    "TWATS",
    "VAGINA",
    "WANK",
    "WANKER",
}

# Overridden at build time from the bank payload: the shipped bank carries
# 100 theme lanes while the content module's THEMES stops at 60, and the
# rotation must span every lane the bank can clue and bonus.
THEME_IDS = [theme["id"] for theme in THEMES]
SEASONAL_THEMES = {
    "2026-05-10": "home-reset",  # Mother's Day
    "2026-05-25": "fresh-air",  # Memorial Day
    "2026-06-19": "culture-corner",  # Juneteenth
    "2026-06-21": "family-table",  # Father's Day
    "2026-07-04": "kitchen-table",  # Independence Day
    "2026-09-07": "fresh-air",  # Labor Day
    "2026-10-31": "culture-corner",  # Halloween
    "2026-11-26": "kitchen-table",  # Thanksgiving
    "2026-12-25": "kitchen-table",  # Christmas
    "2026-12-31": "culture-corner",  # New Year's Eve
    "2027-01-01": "fresh-air",  # New Year's Day
    "2027-01-18": "culture-corner",  # Martin Luther King Jr. Day
    "2027-02-14": "friend-date",  # Valentine's Day
    "2027-02-15": "culture-corner",  # Presidents' Day
    "2027-03-17": "culture-corner",  # St. Patrick's Day
    "2027-03-28": "brunch-hour",  # Easter
    "2027-04-22": "fresh-air",  # Earth Day
    "2027-05-09": "family-table",  # Mother's Day
}
HOLIDAY_THEME_DATES = set(SEASONAL_THEMES)
EASTER_EGG_ANSWERS = {
    "11-03": "HOPE",
}
# Pinned bonus answers (month-day keyed, like the grid easter eggs). Nov 3 is
# the shipped HOPE/CANDLES editorial override that the supertime backend guards
# with assertPreservedGridAnswer — the pinned word is reserved before general
# bonus assignment so an earlier day can never steal it.
EASTER_EGG_BONUS_ANSWERS = {
    "11-03": "CANDLES",
}

HOLIDAY_PROFILE_OVERRIDES = {
    "regular": {
        "theme_min": 2,
        "theme_target_min": 3,
        "theme_target_max": 4,
    },
    "mega": {
        "theme_min": 7,
        "theme_target_min": 9,
        "theme_target_max": 11,
    },
}
EASTER_EGG_THEMES = {
    "11-03": "mindful-morning",
}
SPECIAL_TEMPLATE_IDS = {"hope-square"}
# Templates the backend audit retires: mega-corners was an editorial
# retirement (bad layout), and full center-row/column-cross 7x7 layouts are
# rejected wholesale. Mirrored here so a regenerated pack cannot regress.
RETIRED_TEMPLATE_IDS = {"mega-corners"}


def has_full_center_cross(rows: Sequence[str]) -> bool:
    if not rows or len(rows) % 2 == 0:
        return False
    center = len(rows) // 2
    row_blocked = all(cell == "#" for cell in rows[center])
    col_blocked = all(center < len(row) and row[center] == "#" for row in rows)
    return row_blocked and col_blocked


def template_is_retired(meta: TemplateMeta) -> bool:
    if meta.template_id in RETIRED_TEMPLATE_IDS:
        return True
    return meta.size == 7 and has_full_center_cross(meta.rows)

DIFFICULTY_BY_WEEKDAY = {
    0: "easy",
    1: "easy",
    2: "medium",
    3: "medium",
    4: "medium",
    5: "tricky",
    6: "mega",
}

PROFILE = {
    "easy": {
        "min_anchor": 3,
        "max_hard": 0,
        "theme_min": 1,
        "theme_target_min": 2,
        "theme_target_max": 3,
        "theme_max": 6,
    },
    "medium": {
        "min_anchor": 3,
        "max_hard": 1,
        "theme_min": 1,
        "theme_target_min": 2,
        "theme_target_max": 3,
        "theme_max": 6,
    },
    "tricky": {
        "min_anchor": 3,
        "max_hard": 2,
        "theme_min": 2,
        "theme_target_min": 3,
        "theme_target_max": 4,
        "theme_max": 6,
    },
    "mega": {
        "min_anchor": 4,
        "max_hard": 3,
        "theme_min": 5,
        "theme_target_min": 6,
        "theme_target_max": 8,
        "theme_max": 13,
    },
}


def profile_for_day(day: Optional[date], difficulty: str) -> Dict[str, int]:
    profile = dict(PROFILE[difficulty])
    if day and day.isoformat() in HOLIDAY_THEME_DATES:
        override_key = "mega" if difficulty == "mega" else "regular"
        profile.update(HOLIDAY_PROFILE_OVERRIDES[override_key])
    return profile


def stable_hash(value: str) -> int:
    h = 2166136261
    for ch in value:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return h


def mulberry32(seed: int):
    t = seed & 0xFFFFFFFF

    def rand() -> float:
        nonlocal t
        t = (t + 0x6D2B79F5) & 0xFFFFFFFF
        z = t
        z = (z ^ (z >> 15)) * (z | 1)
        z &= 0xFFFFFFFF
        z ^= z + ((z ^ (z >> 7)) * (z | 61) & 0xFFFFFFFF)
        z &= 0xFFFFFFFF
        return ((z ^ (z >> 14)) & 0xFFFFFFFF) / 4294967296

    return rand


def shuffled(items: Sequence[str], seed: int) -> List[str]:
    rand = mulberry32(seed)
    out = list(items)
    for index in range(len(out) - 1, 0, -1):
        swap = int(rand() * (index + 1))
        out[index], out[swap] = out[swap], out[index]
    return out


@dataclass(frozen=True)
class Slot:
    direction: str
    row: int
    col: int
    length: int
    cells: Tuple[Tuple[int, int], ...]
    number: int


@dataclass(frozen=True)
class TemplateMeta:
    template_id: str
    rows: Tuple[str, ...]
    blocks: Tuple[Tuple[bool, ...], ...]
    slots: Tuple[Slot, ...]
    size: int


@dataclass(frozen=True)
class EntryMeta:
    answer: str
    clue_options: Tuple[str, ...]
    clue_metadata: Tuple[dict, ...]
    difficulty: str
    theme_tags: Tuple[str, ...]
    is_modern: bool


@dataclass(frozen=True)
class SolvedGrid:
    meta: TemplateMeta
    words: Tuple[str, ...]
    seed: int
    signature: str


def build_template_meta(template: Dict[str, object]) -> TemplateMeta:
    rows = tuple(str(row).strip() for row in template["rows"])
    size = len(rows)
    if size not in (5, 7):
        raise ValueError(f"Unsupported mini crossword size for {template['id']}: {size}")
    if any(len(row) != size for row in rows):
        raise ValueError(f"Template {template['id']} must be square")

    blocks = tuple(tuple(ch == "#" for ch in row) for row in rows)
    numbering: Dict[Tuple[int, int], int] = {}
    slots: List[Slot] = []
    next_number = 1

    for row in range(size):
        for col in range(size):
            if blocks[row][col]:
                continue
            starts_across = col == 0 or blocks[row][col - 1]
            starts_down = row == 0 or blocks[row - 1][col]
            if starts_across or starts_down:
                numbering[(row, col)] = next_number
                next_number += 1

            if starts_across:
                cells: List[Tuple[int, int]] = []
                cc = col
                while cc < size and not blocks[row][cc]:
                    cells.append((row, cc))
                    cc += 1
                # Runs shorter than 3 are not slots; their cells must be
                # covered by a crossing slot (checked below) — the shipped
                # mega-balanced layouts rely on this, matching the Go compiler.
                if len(cells) >= 3:
                    slots.append(Slot("across", row, col, len(cells), tuple(cells), numbering[(row, col)]))

            if starts_down:
                cells = []
                rr = row
                while rr < size and not blocks[rr][col]:
                    cells.append((rr, col))
                    rr += 1
                if len(cells) >= 3:
                    slots.append(Slot("down", row, col, len(cells), tuple(cells), numbering[(row, col)]))

    for row in range(size):
        for col in range(size):
            if blocks[row][col]:
                continue
            covered = any((row, col) in slot.cells for slot in slots)
            if not covered:
                raise ValueError(f"Template {template['id']} has an uncovered cell at {row}:{col}")

    return TemplateMeta(str(template["id"]), rows, blocks, tuple(slots), size)


def build_indexes(words_by_length: Dict[int, List[str]]) -> Tuple[Dict[int, Set[str]], Dict[int, List[Dict[str, Set[str]]]], Dict[Tuple[int, int], Set[str]]]:
    word_set_by_length = {length: set(words) for length, words in words_by_length.items()}
    position_index: Dict[int, List[Dict[str, Set[str]]]] = {}
    prefix_index: Dict[Tuple[int, int], Set[str]] = {}

    for length, words in words_by_length.items():
        buckets: List[Dict[str, Set[str]]] = [dict() for _ in range(length)]
        for word in words:
            for index, ch in enumerate(word):
                buckets[index].setdefault(ch, set()).add(word)
        position_index[length] = buckets
        for prefix_len in range(1, length + 1):
            prefix_index[(length, prefix_len)] = {word[:prefix_len] for word in words}

    return word_set_by_length, position_index, prefix_index


def make_signature(meta: TemplateMeta, assigned: Sequence[str]) -> str:
    across = []
    down = []
    for index, slot in enumerate(meta.slots):
        if slot.direction == "across":
            across.append(assigned[index])
        else:
            down.append(assigned[index])
    return f"{meta.template_id}:{'|'.join(across)}/{'|'.join(down)}"


def puzzle_metrics(words: Iterable[str], entries_by_answer: Dict[str, EntryMeta], theme_id: str) -> Dict[str, int]:
    word_list = list(words)
    anchor_count = sum(1 for word in word_list if entries_by_answer[word].difficulty == "easy")
    hard_count = sum(1 for word in word_list if entries_by_answer[word].difficulty == "hard")
    theme_count = sum(1 for word in word_list if theme_id in entries_by_answer[word].theme_tags)
    tricky_count = sum(
        1
        for word in word_list
        if entries_by_answer[word].difficulty == "hard"
        or any("?" in clue for clue in entries_by_answer[word].clue_options)
    )
    return {
        "anchorCount": anchor_count,
        "hardCount": hard_count,
        "themeAnswerCount": theme_count,
        "trickyClueCount": tricky_count,
    }


# Cooldown windows tried per day, strictest first. Only the full
# per-word cooldown window counts as "strict"; any shorter fallback marks the
# day cooldownRelaxed (a recorded, audited exception — used mostly by
# seasonal-theme days whose dense builders run out of fresh theme fill).
COOLDOWN_WINDOWS = (STRICT_COOLDOWN_WINDOW, 30, 7, 0)


def recent_words_within(word_history: Dict[str, List[int]], day_index: int, window: int) -> Set[str]:
    if window <= 0:
        return set()
    blocked: Set[str] = set()
    for word, seen_days in word_history.items():
        effective = min(window, word_cooldown_days(word))
        recent_uses = [seen_day for seen_day in seen_days if 0 < day_index - seen_day <= effective]
        if len(recent_uses) >= REPEAT_LIMIT_PER_WINDOW:
            blocked.add(word)
    return blocked


def date_month_day(day: date) -> str:
    return day.strftime("%m-%d")


def easter_egg_answer_for_day(day: date) -> Optional[str]:
    return EASTER_EGG_ANSWERS.get(date_month_day(day))


def easter_egg_theme_for_day(day: date) -> Optional[str]:
    return EASTER_EGG_THEMES.get(date_month_day(day))


def easter_egg_bonus_for_day(day: date) -> Optional[str]:
    return EASTER_EGG_BONUS_ANSWERS.get(date_month_day(day))


def theme_distance(theme_count: int, profile: Dict[str, int]) -> int:
    if theme_count < profile["theme_target_min"]:
        return profile["theme_target_min"] - theme_count
    if theme_count > profile["theme_target_max"]:
        return theme_count - profile["theme_target_max"]
    return 0


def clue_metadata_for_entry(entry: EntryMeta) -> Tuple[dict, ...]:
    if entry.clue_metadata:
        return entry.clue_metadata
    return tuple(
        {
            "text": clue,
            "type": "direct",
            "difficulty": "easy" if len(entry.answer) <= 5 else "medium",
            "tone": "straight",
            "source": "legacy",
            "score": 60,
            "themeTags": [],
            "rejectionNotes": [],
        }
        for clue in entry.clue_options
    )


def new_clue_state() -> Dict[str, object]:
    # Pack-global clue usage: last-use tick per (answer, text) pair and the
    # previous text served for each answer, so repeat occurrences of a word
    # rotate through its clue options least-recently-used first and never
    # repeat the immediately-previous surface when an alternative exists.
    return {"last_use": {}, "prev_text": {}, "tick": 0}


def commit_clue_usage(clue_state: Dict[str, object], used_pairs: Sequence[Tuple[str, str]]) -> None:
    last_use: Dict[Tuple[str, str], int] = clue_state["last_use"]  # type: ignore[assignment]
    prev_text: Dict[str, str] = clue_state["prev_text"]  # type: ignore[assignment]
    for answer, text in used_pairs:
        last_use[(answer, text)] = int(clue_state["tick"])  # type: ignore[arg-type]
        prev_text[answer] = text
        clue_state["tick"] = int(clue_state["tick"]) + 1  # type: ignore[arg-type]


def select_clue(
    answer: str,
    entry: EntryMeta,
    slot: Slot,
    theme_id: str,
    seed: int,
    clue_state: Optional[Dict[str, object]] = None,
    banned_texts: Optional[Set[str]] = None,
) -> Optional[dict]:
    options = list(clue_metadata_for_entry(entry))
    if not options:
        raise ValueError(f"Missing clue metadata for {answer}")

    banned = banned_texts or set()
    distinct_texts = {str(clue["text"]) for clue in options}
    candidates = [clue for clue in options if str(clue["text"]) not in banned]
    prev_text = None
    if clue_state is not None:
        prev_text = clue_state["prev_text"].get(answer)  # type: ignore[union-attr]
    if prev_text is not None and len(distinct_texts) > 1:
        candidates = [clue for clue in candidates if str(clue["text"]) != prev_text]
    if not candidates:
        return None

    last_use: Dict[Tuple[str, str], int] = clue_state["last_use"] if clue_state is not None else {}  # type: ignore[assignment]
    random_rank = {
        clue_text: rank
        for rank, clue_text in enumerate(
            shuffled([str(clue["text"]) for clue in candidates], seed ^ stable_hash(f"{answer}:{slot.number}:{slot.direction}"))
        )
    }
    chosen = sorted(
        candidates,
        key=lambda clue: (
            last_use.get((answer, str(clue["text"])), -1),
            0 if theme_id in set(entry.theme_tags).union(set(clue.get("themeTags", []))) else 1,
            0 if clue.get("difficulty") != "tricky" else 1,
            -int(clue.get("score", 0)),
            random_rank.get(str(clue["text"]), 999),
        ),
    )[0]

    answer_matches_day_theme = theme_id in set(entry.theme_tags)
    theme_tags = [theme_id] if answer_matches_day_theme else []
    return {
        "answer": answer,
        "text": chosen["text"],
        "type": chosen.get("type", "direct"),
        "difficulty": chosen.get("difficulty", "easy"),
        "tone": chosen.get("tone", "straight"),
        "source": chosen.get("source", "editorial"),
        "score": int(chosen.get("score", 0)),
        "themeTags": theme_tags,
        "themeMatch": bool(theme_tags),
        "rejectionNotes": chosen.get("rejectionNotes", []),
    }


def select_clues_for_day(
    meta: TemplateMeta,
    assigned: Sequence[str],
    entries_by_answer: Dict[str, EntryMeta],
    theme_id: str,
    seed: int,
    clue_state: Dict[str, object],
) -> Optional[Tuple[Dict[str, List[dict]], List[Tuple[str, str]]]]:
    """Pick a clue per slot with no duplicated clue text within the day.

    Returns None when the day cannot be cluied collision-free (the caller
    treats the grid as invalid and re-picks). Does not mutate clue_state —
    call commit_clue_usage once the grid is accepted.
    """
    selected: Dict[str, List[dict]] = {"across": [], "down": []}
    used_texts: Set[str] = set()
    used_pairs: List[Tuple[str, str]] = []
    for index, slot in enumerate(meta.slots):
        answer = assigned[index]
        clue = select_clue(answer, entries_by_answer[answer], slot, theme_id, seed, clue_state, used_texts)
        if clue is None:
            return None
        text = str(clue["text"])
        used_texts.add(text)
        used_pairs.append((answer, text))
        selected[slot.direction].append(clue)
    return selected, used_pairs


def solve_template_py(
    meta: TemplateMeta,
    seed: int,
    theme_id: str,
    difficulty: str,
    recent_words: Set[str],
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
    allow_theme_miss: bool,
    global_word_counts: Optional[Dict[str, int]] = None,
    required_words: Optional[Set[str]] = None,
    profile_override: Optional[Dict[str, int]] = None,
    allowed_words: Optional[Set[str]] = None,
    max_nodes: Optional[int] = None,
) -> Optional[List[str]]:
    node_budget = max_nodes if max_nodes is not None else MAX_SEARCH_NODES
    profile = profile_override or PROFILE[difficulty]
    required_theme_min = 0 if allow_theme_miss else profile["theme_min"]
    required_words = set(required_words or set())
    rand = mulberry32(seed)
    grid: List[List[str]] = [
        ["#" if meta.blocks[row][col] else "" for col in range(meta.size)] for row in range(meta.size)
    ]
    used_words: Set[str] = set()
    assigned: List[Optional[str]] = [None] * len(meta.slots)
    search_nodes = 0
    candidate_cache: Dict[Tuple[int, str], Tuple[str, ...]] = {}
    crossability_cache: Dict[str, int] = {}
    failed_states: Set[Tuple[str, ...]] = set()

    def pattern_for(slot: Slot) -> str:
        return "".join(grid[row][col] if grid[row][col] else "." for row, col in slot.cells)

    def pattern_allows(word: str, pattern: str) -> bool:
        return len(word) == len(pattern) and all(pattern[index] in (".", ch) for index, ch in enumerate(word))

    def prefix_valid() -> bool:
        for index, slot in enumerate(meta.slots):
            if assigned[index] is not None:
                continue
            pattern = pattern_for(slot)
            prefix_len = 0
            while prefix_len < len(pattern) and pattern[prefix_len] != ".":
                prefix_len += 1
            if prefix_len == 0:
                continue
            if pattern[:prefix_len] not in prefix_index.get((slot.length, prefix_len), set()):
                return False
        return True

    def remaining_slots_have_candidates() -> bool:
        for index, slot in enumerate(meta.slots):
            if assigned[index] is not None:
                continue
            has_candidate = False
            for word in base_candidates_for_pattern(slot.length, pattern_for(slot)):
                if word in used_words or word in recent_words:
                    continue
                entry = entries_by_answer[word]
                if difficulty == "easy" and entry.difficulty == "hard":
                    continue
                has_candidate = True
                break
            if not has_candidate:
                return False
        return True

    def base_candidates_for_pattern(length: int, pattern: str) -> Tuple[str, ...]:
        key = (length, pattern)
        if key in candidate_cache:
            return candidate_cache[key]

        candidate_pool: Optional[Set[str]] = None
        for index, ch in enumerate(pattern):
            if ch == ".":
                continue
            bucket = position_index.get(length, [])[index].get(ch)
            if not bucket:
                candidate_cache[key] = ()
                return ()
            candidate_pool = set(bucket) if candidate_pool is None else candidate_pool & bucket
            if not candidate_pool:
                candidate_cache[key] = ()
                return ()

        if candidate_pool is None:
            candidate_pool = set(words_by_length.get(length, []))
        if allowed_words is not None:
            candidate_pool &= allowed_words

        value = tuple(sorted(candidate_pool))
        candidate_cache[key] = value
        return value

    def word_crossability(word: str) -> int:
        if word in crossability_cache:
            return crossability_cache[word]
        score = sum(len(position_index[len(word)][index].get(ch, set())) for index, ch in enumerate(word))
        crossability_cache[word] = score
        return score

    def final_constraints_hold() -> bool:
        words = [word for word in assigned if word is not None]
        if len(words) != len(meta.slots):
            return False
        if len(set(words)) != len(words):
            return False
        if not required_words.issubset(set(words)):
            return False
        for index, slot in enumerate(meta.slots):
            word = assigned[index]
            if word is None or word not in word_set_by_length.get(slot.length, set()):
                return False
        metrics = puzzle_metrics(words, entries_by_answer, theme_id)
        if metrics["anchorCount"] < profile["min_anchor"]:
            return False
        if metrics["hardCount"] > profile["max_hard"]:
            return False
        if metrics["themeAnswerCount"] < required_theme_min:
            return False
        if metrics["themeAnswerCount"] > profile["theme_max"]:
            return False
        return True

    def ranked_candidates_for_slot(slot: Slot, assigned_count: int) -> List[str]:
        best_candidates = [
            word
            for word in base_candidates_for_pattern(slot.length, pattern_for(slot))
            if word not in used_words and word not in recent_words
        ]
        if not best_candidates:
            return []

        remaining_after = len(assigned) - assigned_count - 1
        current_words = [word for word in assigned if word is not None]
        current_word_set = set(current_words)
        current_metrics = puzzle_metrics(current_words, entries_by_answer, theme_id)
        current_theme = current_metrics["themeAnswerCount"]
        current_anchor = current_metrics["anchorCount"]
        current_hard = current_metrics["hardCount"]

        pool: List[str] = []
        for candidate in best_candidates:
            entry = entries_by_answer[candidate]
            if difficulty == "easy" and entry.difficulty == "hard":
                continue
            is_theme = theme_id in entry.theme_tags
            next_theme = current_theme + (1 if is_theme else 0)
            next_anchor = current_anchor + (1 if entry.difficulty == "easy" else 0)
            next_hard = current_hard + (1 if entry.difficulty == "hard" else 0)
            missing_required = required_words - current_word_set - {candidate}
            if next_hard > profile["max_hard"]:
                continue
            if next_theme > profile["theme_max"]:
                continue
            if next_theme + remaining_after < required_theme_min:
                continue
            if next_anchor + remaining_after < profile["min_anchor"]:
                continue
            if len(missing_required) > remaining_after:
                continue
            pool.append(candidate)

        if not pool:
            return []

        random_rank = {
            word: rank
            for rank, word in enumerate(
                shuffled(pool, seed ^ stable_hash(f"{slot.row}:{slot.col}:{slot.direction}"))
            )
        }
        theme_first = profile["theme_min"] > PROFILE[difficulty]["theme_min"]

        def candidate_sort_key(word: str) -> Tuple[int, int, int, int, int, int, str]:
            entry = entries_by_answer[word]
            difficulty_rank = 0 if entry.difficulty == "easy" else 1 if entry.difficulty == "medium" else 2
            required_rank = 0 if word in required_words else 1
            theme_rank = 0 if theme_id in entry.theme_tags else 2 if entry.theme_tags else 1
            reuse_count = min((global_word_counts or {}).get(word, 0), 3)
            if theme_first:
                return (required_rank, theme_rank, difficulty_rank, reuse_count, random_rank[word], -word_crossability(word), word)
            if difficulty == "easy":
                return (required_rank, difficulty_rank, theme_rank, reuse_count, random_rank[word], -word_crossability(word), word)
            return (required_rank, theme_rank, difficulty_rank, reuse_count, random_rank[word], -word_crossability(word), word)

        return sorted(pool, key=candidate_sort_key)

    def recurse() -> bool:
        nonlocal search_nodes
        search_nodes += 1
        if search_nodes > node_budget:
            return False

        state = tuple(word or "" for word in assigned)
        if state in failed_states:
            return False

        if all(word is not None for word in assigned):
            solved = final_constraints_hold()
            if not solved:
                failed_states.add(state)
            return solved

        best_index: Optional[int] = None
        best_candidates: Optional[List[str]] = None
        assigned_count = sum(1 for word in assigned if word is not None)
        missing_required = required_words - used_words
        for index, slot in enumerate(meta.slots):
            if assigned[index] is not None:
                continue
            candidates = ranked_candidates_for_slot(slot, assigned_count)
            if not candidates:
                failed_states.add(state)
                return False
            slot_priority = 0 if any(pattern_allows(word, pattern_for(slot)) for word in missing_required) else 1
            candidate_key = (
                slot_priority,
                len(candidates) / max(1, slot.length * slot.length),
                -slot.length,
                len(candidates),
            )
            best_key = (
                0
                if any(pattern_allows(word, pattern_for(meta.slots[best_index])) for word in missing_required)
                else 1,
                len(best_candidates) / max(1, meta.slots[best_index].length * meta.slots[best_index].length),
                -meta.slots[best_index].length,
                len(best_candidates),
            ) if best_candidates is not None and best_index is not None else None
            if best_key is None or candidate_key < best_key:
                best_index = index
                best_candidates = candidates

        if best_index is None or best_candidates is None:
            return False

        slot = meta.slots[best_index]
        ranked = best_candidates

        for candidate in ranked[:MAX_CANDIDATES_PER_SLOT]:
            assigned[best_index] = candidate
            used_words.add(candidate)
            touched: List[Tuple[int, int]] = []
            conflict = False
            for letter_index, (row, col) in enumerate(slot.cells):
                letter = candidate[letter_index]
                existing = grid[row][col]
                if existing and existing != letter:
                    conflict = True
                    break
                if not existing:
                    grid[row][col] = letter
                    touched.append((row, col))
            if not conflict and prefix_valid() and remaining_slots_have_candidates() and recurse():
                return True
            for row, col in touched:
                grid[row][col] = ""
            used_words.remove(candidate)
            assigned[best_index] = None
        failed_states.add(state)
        return False

    if recurse():
        return [word for word in assigned if word is not None]
    return None


# ---------------------------------------------------------------------------
# Native kernel dispatch. scripts/native/mcw_solver.cpp ports the fill search
# 1:1 (same seeded ordering, MRV key, budgets); build it with
# scripts/native/build.sh. Set MCW_ENGINE=py to force the pure-Python path.
try:
    import sys as _sys
    _NATIVE_DIR = str(BASE_DIR / "scripts" / "native")
    if _NATIVE_DIR not in _sys.path:
        _sys.path.insert(0, _NATIVE_DIR)
    import mcw_solver as _mcw_native
except ImportError:  # pragma: no cover - fallback path
    _mcw_native = None

import os as _os

SOLVER_ENGINE = "py" if _os.environ.get("MCW_ENGINE") == "py" or _mcw_native is None else "native"

_native_context: Dict[int, object] = {}


def _native_solver_for(entries_by_answer: Dict[str, EntryMeta], words_by_length: Dict[int, List[str]]):
    key = id(entries_by_answer)
    ctx = _native_context.get(key)
    if ctx is not None:
        return ctx
    flat_words: List[str] = []
    length_ranges: Dict[int, Tuple[int, int]] = {}
    for length in sorted(words_by_length):
        start = len(flat_words)
        flat_words.extend(sorted(words_by_length[length]))
        length_ranges[length] = (start, len(flat_words))
    word_id = {word: index for index, word in enumerate(flat_words)}
    difficulty_rank = {"easy": 0, "medium": 1, "hard": 2}
    difficulty_of = [difficulty_rank.get(entries_by_answer[w].difficulty, 1) for w in flat_words]
    length_of = [len(w) for w in flat_words]
    solver = _mcw_native.Solver(flat_words, length_of, difficulty_of, length_ranges)
    solver.set_has_theme_tags([1 if entries_by_answer[w].theme_tags else 0 for w in flat_words])
    theme_ids_cache: Dict[str, List[int]] = {}
    ctx = (solver, word_id, theme_ids_cache, flat_words)
    _native_context[key] = ctx
    return ctx


def solve_template(
    meta: TemplateMeta,
    seed: int,
    theme_id: str,
    difficulty: str,
    recent_words: Set[str],
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
    allow_theme_miss: bool,
    global_word_counts: Optional[Dict[str, int]] = None,
    required_words: Optional[Set[str]] = None,
    profile_override: Optional[Dict[str, int]] = None,
    allowed_words: Optional[Set[str]] = None,
    max_nodes: Optional[int] = None,
    randomized_order: bool = False,
) -> Optional[List[str]]:
    if SOLVER_ENGINE != "native":
        return solve_template_py(
            meta, seed, theme_id, difficulty, recent_words, words_by_length,
            word_set_by_length, position_index, prefix_index, entries_by_answer,
            allow_theme_miss, global_word_counts=global_word_counts,
            required_words=required_words, profile_override=profile_override,
            allowed_words=allowed_words, max_nodes=max_nodes,
        )

    solver, word_id, theme_ids_cache, _ = _native_solver_for(entries_by_answer, words_by_length)
    theme_word_ids = theme_ids_cache.get(theme_id)
    if theme_word_ids is None:
        theme_word_ids = [
            word_id[word]
            for word, entry in entries_by_answer.items()
            if word in word_id and theme_id in entry.theme_tags
        ]
        theme_ids_cache[theme_id] = theme_word_ids

    profile = profile_override or PROFILE[difficulty]
    native_profile = _mcw_native.Profile()
    native_profile.min_anchor = profile["min_anchor"]
    native_profile.max_hard = profile["max_hard"]
    native_profile.theme_min_required = 0 if allow_theme_miss else profile["theme_min"]
    native_profile.theme_max = profile["theme_max"]

    slots = []
    for slot in meta.slots:
        spec = _mcw_native.SlotSpec()
        spec.direction = slot.direction
        spec.row = slot.row
        spec.col = slot.col
        spec.length = slot.length
        spec.cells = [row * meta.size + col for row, col in slot.cells]
        slots.append(spec)

    recent_ids = [word_id[w] for w in recent_words if w in word_id]
    required_ids = [word_id[w] for w in (required_words or set()) if w in word_id]
    if required_words and len(required_ids) != len(set(required_words)):
        return None  # a required word is outside the bank: unsolvable
    allowed_ids = None
    if allowed_words is not None:
        allowed_ids = [word_id[w] for w in allowed_words if w in word_id]
    reuse_counts = {}
    if global_word_counts:
        reuse_counts = {word_id[w]: c for w, c in global_word_counts.items() if w in word_id and c}

    return solver.solve(
        grid_size=meta.size,
        slots=slots,
        seed=seed & 0xFFFFFFFF,
        theme_word_ids=theme_word_ids,
        recent_ids=recent_ids,
        required_ids=required_ids,
        allowed_ids=allowed_ids,
        reuse_counts=reuse_counts,
        profile=native_profile,
        exclude_hard=difficulty == "easy",
        theme_first=profile["theme_min"] > PROFILE[difficulty]["theme_min"],
        randomized_order=randomized_order,
        node_budget=max_nodes if max_nodes is not None else MAX_SEARCH_NODES,
        max_candidates_per_slot=MAX_CANDIDATES_PER_SLOT,
    )


def date_range(pack_start: date, pack_end: date) -> Iterable[date]:
    current = pack_start
    while current <= pack_end:
        yield current
        current += timedelta(days=1)


def theme_candidates(day: date, day_index: int, theme_counts: Dict[str, int]) -> List[str]:
    key = day.isoformat()
    rotation_rank = {
        theme_id: (index - day_index) % len(THEME_IDS)
        for index, theme_id in enumerate(THEME_IDS)
    }
    candidates = sorted(THEME_IDS, key=lambda theme_id: (theme_counts.get(theme_id, 0), rotation_rank[theme_id]))
    if key in SEASONAL_THEMES:
        seasonal = SEASONAL_THEMES[key]
        return [seasonal] + [theme_id for theme_id in candidates if theme_id != seasonal]
    return candidates


def choose_theme_for_words(
    day: date,
    day_index: int,
    theme_counts: Dict[str, int],
    words: Sequence[str],
    entries_by_answer: Dict[str, EntryMeta],
    difficulty: str,
) -> str:
    candidates = theme_candidates(day, day_index, theme_counts)
    key = day.isoformat()
    seasonal = SEASONAL_THEMES.get(key)
    profile = profile_for_day(day, difficulty)
    forced_theme = easter_egg_theme_for_day(day)
    if forced_theme and forced_theme in candidates:
        metrics = puzzle_metrics(words, entries_by_answer, forced_theme)
        if metrics["themeAnswerCount"] >= profile["theme_min"]:
            return forced_theme

    eligible = []
    scored = []
    for theme_id in candidates:
        metrics = puzzle_metrics(words, entries_by_answer, theme_id)
        item = (theme_id, metrics["themeAnswerCount"], theme_counts.get(theme_id, 0))
        scored.append(item)
        if profile["theme_min"] <= metrics["themeAnswerCount"] <= profile["theme_max"]:
            eligible.append(item)

    if seasonal:
        seasonal_score = next((score for score in eligible if score[0] == seasonal), None)
        if seasonal_score and seasonal_score[1] >= profile["theme_min"]:
            return seasonal

    if not seasonal:
        return sorted(
            scored,
            key=lambda item: (
                item[2],
                theme_distance(item[1], profile),
                -item[1],
                candidates.index(item[0]),
            ),
        )[0][0]

    pool = eligible or scored
    return sorted(pool, key=lambda item: (item[2], -item[1], candidates.index(item[0])))[0][0]


def template_feasibility_score(
    meta: TemplateMeta,
    theme_id: str,
    difficulty: str,
    recent_words: Set[str],
    words_by_length: Dict[int, List[str]],
    entries_by_answer: Dict[str, EntryMeta],
) -> Optional[int]:
    profile = PROFILE[difficulty]
    slot_counts: Dict[int, int] = {}
    for slot in meta.slots:
        slot_counts[slot.length] = slot_counts.get(slot.length, 0) + 1

    total_counts: Dict[int, int] = {}
    theme_counts: Dict[int, int] = {}
    anchor_counts: Dict[int, int] = {}
    for length, words in words_by_length.items():
        for word in words:
            if word in recent_words:
                continue
            entry = entries_by_answer[word]
            if difficulty == "easy" and entry.difficulty == "hard":
                continue
            total_counts[length] = total_counts.get(length, 0) + 1
            if theme_id in entry.theme_tags:
                theme_counts[length] = theme_counts.get(length, 0) + 1
            if entry.difficulty == "easy":
                anchor_counts[length] = anchor_counts.get(length, 0) + 1

    for length, required in slot_counts.items():
        if total_counts.get(length, 0) < required:
            return None

    def capped_capacity(counts: Dict[int, int]) -> int:
        return sum(min(counts.get(length, 0), required) for length, required in slot_counts.items())

    theme_capacity = capped_capacity(theme_counts)
    anchor_capacity = capped_capacity(anchor_counts)
    if theme_capacity < profile["theme_min"]:
        return None
    if anchor_capacity < profile["min_anchor"]:
        return None

    total_slack = sum(total_counts.get(length, 0) - required for length, required in slot_counts.items())
    return theme_capacity * 1000 + anchor_capacity * 100 + min(total_slack, 999)


class BonusAllocator:
    """Assigns each bonus word AT MOST ONCE across the entire pack.

    Pinned (easter-egg) bonus words are reserved up front so an earlier day
    whose theme owns the pinned word can never steal it. When a day's theme has
    no unused bonus word left the day is recorded as a deficit; the caller
    aborts after the full window so the report covers every theme.
    """

    def __init__(self, bonus_by_theme: Dict[str, List[str]], pinned_by_date: Dict[str, str]):
        self.bonus_by_theme = bonus_by_theme
        self.pinned_by_date = dict(pinned_by_date)
        self.reserved: Set[str] = set(pinned_by_date.values())
        self.used: Set[str] = set()
        self.deficits: Dict[str, int] = {}

    def allocate(self, date_key: str, theme_id: str) -> Optional[str]:
        pinned = self.pinned_by_date.get(date_key)
        if pinned is not None:
            self.used.add(pinned)
            return pinned
        options = [
            word
            for word in shuffled(self.bonus_by_theme.get(theme_id, []), stable_hash(f"daybreak-bonus:{theme_id}"))
            if word not in self.used and word not in self.reserved
        ]
        if not options:
            self.deficits[theme_id] = self.deficits.get(theme_id, 0) + 1
            return None
        word = options[0]
        self.used.add(word)
        return word

    def fail_if_deficient(self, pack_start: date, pack_end: date) -> None:
        if not self.deficits:
            return
        lines = [
            "Bonus word pool exhausted: each bonus word may be scheduled at most once,",
            f"and the {pack_start.isoformat()}..{pack_end.isoformat()} window needs more bonus words for these themes:",
        ]
        for theme_id in sorted(self.deficits):
            available = len(self.bonus_by_theme.get(theme_id, []))
            lines.append(
                f"  - {theme_id}: needs {self.deficits[theme_id]} more bonus word(s) (bank has {available})"
            )
        lines.append(f"Total additional bonus words needed: {sum(self.deficits.values())}")
        raise SystemExit("\n".join(lines))


def quality_score(metrics: Dict[str, int], profile: Dict[str, int], allow_theme_miss: bool) -> int:
    score = 100
    score -= max(0, profile["min_anchor"] - metrics["anchorCount"]) * 12
    score -= metrics["hardCount"] * 4
    score -= max(0, profile["theme_min"] - metrics["themeAnswerCount"]) * 16
    score -= theme_distance(metrics["themeAnswerCount"], profile) * 5
    score -= max(0, metrics["themeAnswerCount"] - profile["theme_max"]) * 3
    score -= metrics["trickyClueCount"] * 2
    return max(0, score)


def is_weak_clue(answer: str, clue: str) -> bool:
    if BAD_CLUE_RE.search(clue):
        return True
    return answer.lower() in clue.lower().replace(" ", "")


def has_editorial_clue(entry: EntryMeta) -> bool:
    metadata = clue_metadata_for_entry(entry)
    return any(
        int(clue.get("score", 0)) >= 70
        and str(clue.get("source", "")) not in {"legacy", "sanitized-legacy"}
        for clue in metadata
    )


def grid_has_editorial_clues(words: Sequence[str], entries_by_answer: Dict[str, EntryMeta]) -> bool:
    return all(has_editorial_clue(entries_by_answer[word]) for word in words)


def metrics_fit_profile(metrics: Dict[str, int], profile: Dict[str, int], allow_theme_shortfall: bool = False) -> bool:
    return (
        metrics["anchorCount"] >= profile["min_anchor"]
        and metrics["hardCount"] <= profile["max_hard"]
        and (allow_theme_shortfall or metrics["themeAnswerCount"] >= profile["theme_min"])
        and metrics["themeAnswerCount"] <= profile["theme_max"]
    )


def dense_candidate_words(
    theme_id: str,
    entries_by_answer: Dict[str, EntryMeta],
    words_by_length: Dict[int, List[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
) -> Set[str]:
    caps = {3: 220, 4: 140, 5: 240, 7: 180}
    allowed: Set[str] = set()
    for length, words in words_by_length.items():
        essential = {
            word
            for word in words
            if theme_id in entries_by_answer[word].theme_tags
            or entries_by_answer[word].difficulty == "easy"
        }
        allowed.update(essential)

        def crossability(word: str) -> int:
            return sum(len(position_index[length][index].get(ch, set())) for index, ch in enumerate(word))

        neutral = [word for word in words if word not in essential]
        neutral.sort(
            key=lambda word: (
                0 if entries_by_answer[word].difficulty == "medium" else 1,
                -crossability(word),
                word,
            )
        )
        allowed.update(neutral[: caps.get(length, 160)])
    return allowed


def three_letter_word_squares(
    theme_id: str,
    words_by_length: Dict[int, List[str]],
    entries_by_answer: Dict[str, EntryMeta],
    recent_words: Set[str],
) -> List[Tuple[Tuple[str, ...], Tuple[str, ...], int]]:
    words = [
        word
        for word in words_by_length.get(3, [])
        if entries_by_answer[word].difficulty != "hard" and word not in recent_words
    ]
    word_set = set(words)
    third_letters_by_prefix: Dict[str, Set[str]] = {}
    position_words: List[Dict[str, Set[str]]] = [dict() for _ in range(3)]
    for word in words:
        third_letters_by_prefix.setdefault(word[:2], set()).add(word[2])
        for index, ch in enumerate(word):
            position_words[index].setdefault(ch, set()).add(word)

    squares: List[Tuple[Tuple[str, ...], Tuple[str, ...], int]] = []
    for first in words:
        for second in words:
            third_candidates: Optional[Set[str]] = None
            for index in range(3):
                letters = third_letters_by_prefix.get(first[index] + second[index], set())
                if not letters:
                    third_candidates = set()
                    break
                index_matches: Set[str] = set()
                for letter in letters:
                    index_matches.update(position_words[index].get(letter, set()))
                third_candidates = index_matches if third_candidates is None else third_candidates & index_matches
                if not third_candidates:
                    break
            for third in sorted(third_candidates or set()):
                columns = (
                    first[0] + second[0] + third[0],
                    first[1] + second[1] + third[1],
                    first[2] + second[2] + third[2],
                )
                if not all(column in word_set for column in columns):
                    continue
                slot_words = (first, second, third, *columns)
                if len(set(slot_words)) != len(slot_words):
                    continue
                theme_count = sum(1 for word in slot_words if theme_id in entries_by_answer[word].theme_tags)
                anchor_count = sum(1 for word in slot_words if entries_by_answer[word].difficulty == "easy")
                squares.append(((first, second, third), columns, theme_count * 100 + anchor_count))
    squares.sort(key=lambda item: (-item[2], item[0], item[1]))
    return squares[:180]


def build_mega_corner_grid(
    day: date,
    theme_id: str,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    entries_by_answer: Dict[str, EntryMeta],
    recent_words: Set[str],
    banned_signatures: Optional[Set[str]] = None,
    profile_override: Optional[Dict[str, int]] = None,
) -> Optional[SolvedGrid]:
    meta = next((candidate for candidate in metas if candidate.template_id == "mega-corners"), None)
    if not meta:
        return None

    banned = banned_signatures or set()
    profile = profile_override or profile_for_day(day, "mega")
    squares = three_letter_word_squares(theme_id, words_by_length, entries_by_answer, recent_words)
    if not squares:
        return None

    corner_specs = (
        (0, 0),
        (0, 4),
        (4, 0),
        (4, 4),
    )
    slot_index = {(slot.direction, slot.row, slot.col): index for index, slot in enumerate(meta.slots)}

    def square_words(square: Tuple[Tuple[str, ...], Tuple[str, ...], int]) -> Tuple[str, ...]:
        rows, columns, _score = square
        return (*rows, *columns)

    def assign_square(assigned: List[Optional[str]], square: Tuple[Tuple[str, ...], Tuple[str, ...], int], row: int, col: int) -> None:
        rows, columns, _score = square
        for offset, word in enumerate(rows):
            assigned[slot_index[("across", row + offset, col)]] = word
        for offset, word in enumerate(columns):
            assigned[slot_index[("down", row, col + offset)]] = word

    def grid_from_squares(chosen: Sequence[Tuple[Tuple[str, ...], Tuple[str, ...], int]]) -> Optional[SolvedGrid]:
        assigned: List[Optional[str]] = [None] * len(meta.slots)
        for square, (row, col) in zip(chosen, corner_specs):
            assign_square(assigned, square, row, col)
        words = [word for word in assigned if word is not None]
        metrics = puzzle_metrics(words, entries_by_answer, theme_id)
        if not metrics_fit_profile(metrics, profile):
            return None
        signature = make_signature(meta, words)
        if signature in banned:
            return None
        return SolvedGrid(
            meta=meta,
            words=tuple(words),
            seed=stable_hash(f"mega-corners:{day.isoformat()}:{theme_id}:{signature}"),
            signature=signature,
        )

    for offset in range(min(120, len(squares))):
        ordered = squares[offset:] + squares[:offset]
        chosen: List[Tuple[Tuple[str, ...], Tuple[str, ...], int]] = []
        used_words: Set[str] = set()
        for square in ordered:
            words = set(square_words(square))
            if used_words.intersection(words):
                continue
            chosen.append(square)
            used_words.update(words)
            if len(chosen) == len(corner_specs):
                grid = grid_from_squares(chosen)
                if grid:
                    return grid
                break

    best: Optional[Tuple[int, List[Tuple[Tuple[str, ...], Tuple[str, ...], int]]]] = None

    def recurse(
        corner_index: int,
        chosen: List[Tuple[Tuple[str, ...], Tuple[str, ...], int]],
        used_words: Set[str],
    ) -> None:
        nonlocal best
        if corner_index == len(corner_specs):
            grid = grid_from_squares(chosen)
            if not grid:
                return
            metrics = puzzle_metrics(grid.words, entries_by_answer, theme_id)
            distance = theme_distance(metrics["themeAnswerCount"], profile)
            score = distance * 100 - metrics["anchorCount"]
            if best is None or score < best[0]:
                best = (score, list(chosen))
            return

        remaining = len(corner_specs) - corner_index - 1
        current_theme = sum(
            1
            for square in chosen
            for word in square_words(square)
            if theme_id in entries_by_answer[word].theme_tags
        )
        for square in squares[:120]:
            words = set(square_words(square))
            if used_words.intersection(words):
                continue
            square_theme = sum(1 for word in words if theme_id in entries_by_answer[word].theme_tags)
            if current_theme + square_theme + remaining * 6 < profile["theme_min"]:
                continue
            chosen.append(square)
            recurse(corner_index + 1, chosen, used_words | words)
            chosen.pop()
            if best and best[0] <= -profile["min_anchor"]:
                return

    if profile_override is not None:
        # Fast-path callers want a quick yes/no; the exhaustive corner search
        # below can be very expensive when no combination exists.
        return None
    recurse(0, [], set())
    if best is None:
        return None

    return grid_from_squares(best[1])


def build_harbor_gates_grid(
    day: date,
    theme_id: str,
    difficulty: str,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    entries_by_answer: Dict[str, EntryMeta],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    recent_words: Set[str],
    banned_signatures: Optional[Set[str]] = None,
) -> Optional[SolvedGrid]:
    meta = next((candidate for candidate in metas if candidate.template_id == "harbor-gates"), None)
    if not meta:
        return None

    banned = banned_signatures or set()
    profile = profile_for_day(day, difficulty)
    allowed = dense_candidate_words(theme_id, entries_by_answer, words_by_length, position_index)
    allowed -= recent_words
    words3 = [
        word
        for word in words_by_length.get(3, [])
        if word in allowed and entries_by_answer[word].difficulty != "hard"
    ]
    words5 = [
        word
        for word in words_by_length.get(5, [])
        if word in allowed and entries_by_answer[word].difficulty != "hard"
    ]
    word3_set = set(words3)

    third_letters_by_prefix: Dict[str, Set[str]] = {}
    for word in words3:
        third_letters_by_prefix.setdefault(word[:2], set()).add(word[2])

    prefix5: Dict[str, List[str]] = {}
    for word in words5:
        prefix5.setdefault(word[:3], []).append(word)

    def crossability(word: str) -> int:
        return sum(
            len(position_index[len(word)][index].get(ch, set())) for index, ch in enumerate(word)
        )

    def word_rank(word: str) -> Tuple[int, int, int, str]:
        entry = entries_by_answer[word]
        return (
            0 if theme_id in entry.theme_tags else 1,
            0 if entry.difficulty == "easy" else 1,
            -crossability(word),
            word,
        )

    words5 = sorted(words5, key=word_rank)[:420]
    best: Optional[Tuple[int, List[str]]] = None

    for first in words5:
        for second in words5:
            if second == first:
                continue
            third_candidates = set(words5)
            letters0 = third_letters_by_prefix.get(first[0] + second[0], set())
            letters4 = third_letters_by_prefix.get(first[4] + second[4], set())
            if not letters0 or not letters4:
                continue
            third_candidates &= set().union(*(position_index[5][0].get(letter, set()) for letter in letters0))
            third_candidates &= set().union(*(position_index[5][4].get(letter, set()) for letter in letters4))
            for third in sorted(third_candidates, key=word_rank):
                if third in {first, second} or third not in allowed:
                    continue
                left_down = first[0] + second[0] + third[0]
                right_down = first[4] + second[4] + third[4]
                if left_down not in word3_set or right_down not in word3_set:
                    continue
                middle_options = (
                    prefix5.get(first[1] + second[1] + third[1], []),
                    prefix5.get(first[2] + second[2] + third[2], []),
                    prefix5.get(first[3] + second[3] + third[3], []),
                )
                if not all(middle_options):
                    continue
                for down_one in middle_options[0]:
                    for down_two in middle_options[1]:
                        if down_two == down_one:
                            continue
                        for down_three in middle_options[2]:
                            if down_three in {down_one, down_two}:
                                continue
                            fourth = down_one[3] + down_two[3] + down_three[3]
                            fifth = down_one[4] + down_two[4] + down_three[4]
                            words = [
                                first,
                                left_down,
                                down_one,
                                down_two,
                                down_three,
                                right_down,
                                second,
                                third,
                                fourth,
                                fifth,
                            ]
                            if fourth not in word3_set or fifth not in word3_set:
                                continue
                            if len(set(words)) != len(words):
                                continue
                            metrics = puzzle_metrics(words, entries_by_answer, theme_id)
                            if not metrics_fit_profile(metrics, profile):
                                continue
                            if make_signature(meta, words) in banned:
                                continue
                            distance = theme_distance(metrics["themeAnswerCount"], profile)
                            score = distance * 100 - metrics["anchorCount"]
                            if best is None or score < best[0]:
                                best = (score, words)
                            if best and best[0] <= -profile["min_anchor"]:
                                return SolvedGrid(
                                    meta=meta,
                                    words=tuple(best[1]),
                                    seed=stable_hash(f"harbor-gates:{day.isoformat()}:{theme_id}:{'|'.join(best[1])}"),
                                    signature=make_signature(meta, best[1]),
                                )
    if best is None:
        return None
    return SolvedGrid(
        meta=meta,
        words=tuple(best[1]),
        seed=stable_hash(f"harbor-gates:{day.isoformat()}:{theme_id}:{'|'.join(best[1])}"),
        signature=make_signature(meta, best[1]),
    )


def build_trail_left_grid(
    day: date,
    theme_id: str,
    difficulty: str,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    entries_by_answer: Dict[str, EntryMeta],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    recent_words: Set[str],
    banned_signatures: Optional[Set[str]] = None,
) -> Optional[SolvedGrid]:
    meta = next((candidate for candidate in metas if candidate.template_id == "trail-left"), None)
    if not meta:
        return None

    banned = banned_signatures or set()
    profile = profile_for_day(day, difficulty)
    allowed = dense_candidate_words(theme_id, entries_by_answer, words_by_length, position_index)
    allowed -= recent_words
    words3 = [
        word
        for word in words_by_length.get(3, [])
        if word in allowed and entries_by_answer[word].difficulty != "hard"
    ]
    words5 = [
        word
        for word in words_by_length.get(5, [])
        if word in allowed and entries_by_answer[word].difficulty != "hard"
    ]
    word3_set = set(words3)
    word5_set = set(words5)

    prefix5: Dict[str, List[str]] = {}
    suffix5: Dict[str, List[str]] = {}
    for word in words5:
        prefix5.setdefault(word[:2], []).append(word)
        suffix5.setdefault(word[2:], []).append(word)

    def crossability(word: str) -> int:
        return sum(
            len(position_index[len(word)][index].get(ch, set())) for index, ch in enumerate(word)
        )

    def word_rank(word: str) -> Tuple[int, int, int, str]:
        entry = entries_by_answer[word]
        return (
            0 if theme_id in entry.theme_tags else 1,
            0 if entry.difficulty == "easy" else 1,
            -crossability(word),
            word,
        )

    words3 = sorted(words3, key=word_rank)
    best: Optional[Tuple[int, List[str]]] = None

    for first in words3:
        for second in words3:
            if second == first:
                continue
            down_options = (
                prefix5.get(first[0] + second[0], []),
                prefix5.get(first[1] + second[1], []),
                prefix5.get(first[2] + second[2], []),
            )
            if not all(down_options):
                continue
            for down_one in sorted(down_options[0], key=word_rank):
                for down_two in sorted(down_options[1], key=word_rank):
                    if down_two == down_one:
                        continue
                    for down_three in sorted(down_options[2], key=word_rank):
                        if down_three in {down_one, down_two}:
                            continue
                        suffixes = (
                            down_one[2] + down_two[2] + down_three[2],
                            down_one[3] + down_two[3] + down_three[3],
                            down_one[4] + down_two[4] + down_three[4],
                        )
                        row_options = tuple(suffix5.get(suffix, []) for suffix in suffixes)
                        if not all(row_options):
                            continue
                        for third in row_options[0]:
                            for fourth in row_options[1]:
                                if fourth == third:
                                    continue
                                for fifth in row_options[2]:
                                    if fifth in {third, fourth}:
                                        continue
                                    left_down = third[0] + fourth[0] + fifth[0]
                                    next_down = third[1] + fourth[1] + fifth[1]
                                    words = [
                                        first,
                                        down_one,
                                        down_two,
                                        down_three,
                                        second,
                                        third,
                                        left_down,
                                        next_down,
                                        fourth,
                                        fifth,
                                    ]
                                    if left_down not in word3_set or next_down not in word3_set:
                                        continue
                                    if any(word not in word5_set and len(word) == 5 for word in words):
                                        continue
                                    if len(set(words)) != len(words):
                                        continue
                                    metrics = puzzle_metrics(words, entries_by_answer, theme_id)
                                    if not metrics_fit_profile(metrics, profile):
                                        continue
                                    if make_signature(meta, words) in banned:
                                        continue
                                    distance = theme_distance(metrics["themeAnswerCount"], profile)
                                    score = distance * 100 - metrics["anchorCount"]
                                    if best is None or score < best[0]:
                                        best = (score, words)
                                    if best and best[0] <= -profile["min_anchor"]:
                                        return SolvedGrid(
                                            meta=meta,
                                            words=tuple(best[1]),
                                            seed=stable_hash(f"trail-left:{day.isoformat()}:{theme_id}:{'|'.join(best[1])}"),
                                            signature=make_signature(meta, best[1]),
                                        )
    if best is None:
        return None
    return SolvedGrid(
        meta=meta,
        words=tuple(best[1]),
        seed=stable_hash(f"trail-left:{day.isoformat()}:{theme_id}:{'|'.join(best[1])}"),
        signature=make_signature(meta, best[1]),
    )


def build_theme_dense_grid(
    day: date,
    size: int,
    theme_id: str,
    difficulty: str,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
    recent_words: Set[str],
    banned_signatures: Set[str],
    accept: Callable[[SolvedGrid], bool],
) -> Optional[SolvedGrid]:
    profile = profile_for_day(day, difficulty)
    candidate_metas = [
        meta
        for meta in metas
        if meta.size == size
        and not template_is_retired(meta)
        and (size == 7 or meta.template_id not in SPECIAL_TEMPLATE_IDS)
    ]
    if not candidate_metas:
        raise SystemExit(f"No {size}x{size} templates available for {day.isoformat()}")

    verbose = os.environ.get("MINI_CROSSWORD_VERBOSE") == "1"
    # The dense builders are the primary holiday path; when accept() rejects a
    # candidate (e.g. an unresolvable same-day clue collision) its signature is
    # banned locally so the next round yields a different grid.
    local_banned = set(banned_signatures)
    for _ in range(4):
        if size == 7:
            dense_grid = build_mega_corner_grid(
                day, theme_id, candidate_metas, words_by_length, entries_by_answer, recent_words, local_banned
            )
        else:
            dense_grid = build_harbor_gates_grid(
                day,
                theme_id,
                difficulty,
                candidate_metas,
                words_by_length,
                entries_by_answer,
                position_index,
                recent_words,
                local_banned,
            ) or build_trail_left_grid(
                day,
                theme_id,
                difficulty,
                candidate_metas,
                words_by_length,
                entries_by_answer,
                position_index,
                recent_words,
                local_banned,
            )
        if dense_grid is None:
            break
        if accept(dense_grid):
            if verbose:
                metrics = puzzle_metrics(dense_grid.words, entries_by_answer, theme_id)
                print(
                    f"Built holiday grid {day.isoformat()} {theme_id} via {dense_grid.meta.template_id} theme={metrics['themeAnswerCount']}",
                    flush=True,
                )
            return dense_grid
        local_banned.add(dense_grid.signature)

    # Small safety net only: on the current bank the dense builders above are
    # the realistic holiday path and this generic search almost never lands a
    # theme-dense grid, so keep its budget tight.
    max_attempts = 10
    seed_namespaces = ("profile-min", "daybreak-holiday")
    allowed_words = dense_candidate_words(theme_id, entries_by_answer, words_by_length, position_index)
    allowed_words -= recent_words
    for namespace in seed_namespaces:
        for attempt in range(max_attempts):
            if verbose and attempt and attempt % 100 == 0:
                print(
                    f"Searching holiday grid {day.isoformat()} {theme_id}: {namespace} attempt {attempt}",
                    flush=True,
                )
            meta = candidate_metas[attempt % len(candidate_metas)]
            if namespace == "profile-min":
                seed = stable_hash(f"test:{profile['theme_min']}:{attempt}:{meta.template_id}")
            else:
                seed = stable_hash(f"{namespace}:{day.isoformat()}:{theme_id}:{meta.template_id}:{attempt}")
            solved_words = solve_template(
                meta,
                seed,
                theme_id,
                difficulty,
                recent_words,
                words_by_length,
                word_set_by_length,
                position_index,
                prefix_index,
                entries_by_answer,
                allow_theme_miss=True,
                global_word_counts=None,
                profile_override=profile,
                allowed_words=allowed_words,
                max_nodes=30000,
            )
            if not solved_words:
                continue
            signature = make_signature(meta, solved_words)
            if signature in local_banned:
                continue
            metrics = puzzle_metrics(solved_words, entries_by_answer, theme_id)
            if not metrics_fit_profile(metrics, profile):
                continue
            if not grid_has_editorial_clues(solved_words, entries_by_answer):
                continue
            grid = SolvedGrid(meta=meta, words=tuple(solved_words), seed=seed, signature=signature)
            if not accept(grid):
                continue
            if verbose:
                print(
                    f"Built holiday grid {day.isoformat()} {theme_id} via {namespace} attempt {attempt}",
                    flush=True,
                )
            return grid

    return None


def build_regular_day_grid(
    day: date,
    day_index: int,
    size: int,
    difficulty: str,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
    recent_words: Set[str],
    banned_signatures: Set[str],
    word_counts: Dict[str, int],
    theme_counts: Dict[str, int],
    required_word: Optional[str],
    accept: Callable[[SolvedGrid], bool],
    profile_override: Optional[Dict[str, int]] = None,
    randomized_order: bool = False,
) -> Optional[SolvedGrid]:
    """Solve a fresh, never-before-used grid for a non-holiday day.

    Every day gets its own fill (a grid signature is scheduled at most once,
    ever) built against the strict word cooldown; the accept callback layers on
    theme/metrics/clue validation and rejects the grid otherwise.
    """
    if required_word is not None and required_word not in entries_by_answer:
        raise SystemExit(f"Easter egg answer is missing from the bank: {required_word}")

    candidate_metas = [meta for meta in metas if meta.size == size and not template_is_retired(meta)]
    if required_word is not None:
        candidate_metas = [
            meta
            for meta in candidate_metas
            if any(slot.length == len(required_word) for slot in meta.slots)
        ]
        candidate_metas.sort(key=lambda meta: (0 if meta.template_id in SPECIAL_TEMPLATE_IDS else 1, meta.template_id))
    else:
        candidate_metas = [meta for meta in candidate_metas if meta.template_id not in SPECIAL_TEMPLATE_IDS]
        # The 3-letter pool is by far the scarcest (384 words vs 1,563 fives /
        # 1,874 sevens), so prefer layouts with the fewest 3-letter slots to
        # keep the 90-day no-reuse window feasible; rotate ties per day.
        day_rank = {
            template_id: rank
            for rank, template_id in enumerate(
                shuffled([meta.template_id for meta in candidate_metas], stable_hash(f"meta-order:{day.isoformat()}"))
            )
        }
        candidate_metas.sort(
            key=lambda meta: (
                sum(1 for slot in meta.slots if slot.length == 3),
                day_rank[meta.template_id],
            )
        )
    if not candidate_metas:
        raise SystemExit(f"No {size}x{size} templates available for {day.isoformat()}")

    theme_hint = theme_candidates(day, day_index, theme_counts)[0]

    verbose = os.environ.get("MINI_CROSSWORD_VERBOSE") == "1"

    if size == 7 and required_word is None:
        # Fast path for Sunday megas: assembling interlocking 3x3 corners is
        # far cheaper than the backtracking solver on 7x7 layouts. Theme
        # density is not required on regular Sundays (shortfall is allowed),
        # so run the corner builder with theme_min relaxed.
        shortfall_profile = dict(PROFILE["mega"])
        shortfall_profile["theme_min"] = 0
        local_banned = set(banned_signatures)
        for _ in range(4):
            dense_grid = build_mega_corner_grid(
                day,
                theme_hint,
                candidate_metas,
                words_by_length,
                entries_by_answer,
                recent_words,
                local_banned,
                shortfall_profile,
            )
            if dense_grid is None:
                break
            if accept(dense_grid):
                return dense_grid
            local_banned.add(dense_grid.signature)

    solve_failures = 0
    reject_failures = 0
    banned_sig_failures = 0
    # Some templates are unfillable for a given day's constraints and burn the
    # whole node budget every time; drop a template from the rotation after a
    # couple of failed solves so the attempt budget goes to viable layouts.
    active_metas = list(candidate_metas)
    failures_by_template: Dict[str, int] = {}
    attempts_by_template: Dict[str, int] = {}
    max_attempts = MAX_GRID_ATTEMPTS_PER_DAY if size == 5 else 128
    for attempt in range(max_attempts):
        if not active_metas:
            break
        meta = active_metas[attempt % len(active_metas)]
        template_attempt = attempts_by_template.get(meta.template_id, 0)
        attempts_by_template[meta.template_id] = template_attempt + 1
        seed = stable_hash(f"daybreak-daily:{day.isoformat()}:{meta.template_id}:{template_attempt}")
        # Escalating budget: cheap early attempts, deep search only for
        # stubborn template/seed combinations.
        attempt_budget = min(MAX_SEARCH_NODES, 4000 << min(template_attempt, 5))
        solved_words = solve_template(
            meta,
            seed,
            theme_hint,
            difficulty,
            recent_words,
            words_by_length,
            word_set_by_length,
            position_index,
            prefix_index,
            entries_by_answer,
            allow_theme_miss=True,
            global_word_counts=word_counts,
            required_words={required_word} if required_word else None,
            profile_override=profile_override,
            max_nodes=attempt_budget,
            randomized_order=randomized_order,
        )
        if not solved_words:
            solve_failures += 1
            # Only substantial-budget failures count toward dropping a
            # template: the escalating budget probes each template cheaply
            # first, and a 4k-node miss says nothing about fillability.
            if attempt_budget >= 32000:
                failures_by_template[meta.template_id] = failures_by_template.get(meta.template_id, 0) + 1
                if failures_by_template[meta.template_id] >= 2 and len(active_metas) > 1:
                    active_metas = [candidate for candidate in active_metas if candidate.template_id != meta.template_id]
            continue
        signature = make_signature(meta, solved_words)
        if signature in banned_signatures:
            banned_sig_failures += 1
            continue
        grid = SolvedGrid(meta=meta, words=tuple(solved_words), seed=seed, signature=signature)
        if accept(grid):
            if verbose and attempt > 20:
                print(
                    f"Daily grid {day.isoformat()} took {attempt + 1} attempts "
                    f"(solve failures {solve_failures}, banned signatures {banned_sig_failures}, rejections {reject_failures})",
                    flush=True,
                )
            return grid
        reject_failures += 1
    if verbose:
        print(
            f"Daily grid {day.isoformat()} gave up after {sum(attempts_by_template.values())} attempts "
            f"(solve failures {solve_failures}, banned signatures {banned_sig_failures}, rejections {reject_failures})",
            flush=True,
        )
    return None


def build_schedule(
    pack_start: date,
    pack_end: date,
) -> Tuple[List[Dict[str, object]], Dict[str, EntryMeta], Dict[str, dict], Dict[str, dict], Dict[str, object]]:
    verbose = os.environ.get("MINI_CROSSWORD_VERBOSE") == "1"
    payload = json.loads(BANK_PATH.read_text())
    global THEME_IDS
    THEME_IDS = [str(theme["id"]) for theme in payload["themes"]]
    entries_by_answer: Dict[str, EntryMeta] = {}
    blocked_entry_count = 0
    weak_clue_entry_count = 0
    for raw in payload["entries"]:
        answer = str(raw["answer"]).upper()
        raw_clues = tuple(str(clue) for clue in raw.get("clueOptions", []) if str(clue).strip())
        if not answer.isalpha() or len(answer) not in (3, 4, 5, 7) or not raw_clues:
            continue
        if answer in BLOCKED_ANSWERS:
            blocked_entry_count += 1
            continue
        # Weak clue surfaces (BAD_CLUE_RE / answer leaked into the clue) must
        # never be served: drop the option, and drop the entry when nothing
        # usable remains.
        clues = tuple(clue for clue in raw_clues if not is_weak_clue(answer, clue))
        if not clues:
            weak_clue_entry_count += 1
            continue
        metadata = tuple(
            option
            for option in raw.get("clueMetadata", [])
            if not is_weak_clue(answer, str(option.get("text", "")))
        )
        entry = EntryMeta(
            answer=answer,
            clue_options=clues,
            clue_metadata=metadata,
            difficulty=str(raw.get("difficulty", "medium")),
            theme_tags=tuple(str(tag) for tag in raw.get("themeTags", [])),
            is_modern=bool(raw.get("isModern", False)),
        )
        entries_by_answer[answer] = entry
    if blocked_entry_count:
        print(f"Excluded {blocked_entry_count} blocklisted answers from the candidate pool.", flush=True)
    if weak_clue_entry_count:
        print(f"Excluded {weak_clue_entry_count} answers whose every clue option is weak.", flush=True)
    entries_by_answer = {
        answer: entry
        for answer, entry in entries_by_answer.items()
        if has_editorial_clue(entry)
    }
    words_by_length: Dict[int, List[str]] = {}
    for answer in sorted(entries_by_answer):
        words_by_length.setdefault(len(answer), []).append(answer)

    word_set_by_length, position_index, prefix_index = build_indexes(words_by_length)
    metas: List[TemplateMeta] = []
    skipped_templates: List[str] = []
    for template in payload["templates"]:
        try:
            metas.append(build_template_meta(template))
        except ValueError:
            # Shipped bank templates with 2-letter runs are not supported by
            # this builder's slot model; they stay in the bank for the backend
            # but cannot be scheduled from here.
            skipped_templates.append(str(template["id"]))
    if skipped_templates:
        print(
            f"Skipped {len(skipped_templates)} bank templates unsupported by this builder "
            f"(short slots): {', '.join(skipped_templates[:6])}...",
            flush=True,
        )
    metas_by_size: Dict[int, List[TemplateMeta]] = {
        5: [meta for meta in metas if meta.size == 5],
        7: [meta for meta in metas if meta.size == 7],
    }
    if not metas_by_size[5] or not metas_by_size[7]:
        raise SystemExit("Mini crossword templates must include both 5x5 and 7x7 layouts")

    themes_by_id = {str(theme["id"]): theme for theme in payload["themes"]}
    bonus_by_theme: Dict[str, List[str]] = {}
    bonus_by_answer: Dict[str, dict] = {}
    for raw in payload["bonusWords"]:
        answer = str(raw["answer"]).upper()
        theme_id = str(raw["themeId"])
        if answer in BLOCKED_ANSWERS:
            continue
        bonus_by_theme.setdefault(theme_id, []).append(answer)
        bonus_by_answer[answer] = raw
    for theme_id in THEME_IDS:
        if theme_id not in bonus_by_theme:
            raise SystemExit(f"Missing bonus word options for {theme_id}")
        bonus_by_theme[theme_id] = sorted(bonus_by_theme[theme_id])

    days = list(date_range(pack_start, pack_end))

    # Pinned editorial overrides come first: a blocked or missing pin is a
    # data error, and pinned bonus words are reserved before general
    # assignment so an earlier day can never take them.
    pinned_bonus_by_date: Dict[str, str] = {}
    for day in days:
        date_key = day.isoformat()
        egg_answer = easter_egg_answer_for_day(day)
        if egg_answer:
            if egg_answer in BLOCKED_ANSWERS:
                raise SystemExit(f"Pinned easter-egg answer for {date_key} is blocklisted: {egg_answer}")
            if egg_answer not in entries_by_answer:
                raise SystemExit(f"Pinned easter-egg answer for {date_key} is missing from the bank: {egg_answer}")
        pinned_bonus = easter_egg_bonus_for_day(day)
        if pinned_bonus:
            if pinned_bonus in BLOCKED_ANSWERS:
                raise SystemExit(f"Pinned bonus answer for {date_key} is blocklisted: {pinned_bonus}")
            if pinned_bonus not in bonus_by_answer:
                raise SystemExit(f"Pinned bonus answer for {date_key} is missing from the bank: {pinned_bonus}")
            if pinned_bonus in pinned_bonus_by_date.values():
                raise SystemExit(
                    f"Bonus answer {pinned_bonus} is pinned to more than one day in the window; each bonus word may run once"
                )
            pinned_bonus_by_date[date_key] = pinned_bonus
    bonus_allocator = BonusAllocator(bonus_by_theme, pinned_bonus_by_date)

    schedule: List[Dict[str, object]] = []
    signatures: Set[str] = set()
    # Player-facing grid identity: the sorted answer set, independent of
    # template/arrangement. Two days may never share one (the template-
    # qualified signature check alone missed a same-words-different-layout
    # repeat between two culture-corner holidays).
    answer_sets: Set[frozenset] = set()
    word_history: Dict[str, List[int]] = {}
    word_counts: Dict[str, int] = {}
    theme_counts: Dict[str, int] = {}
    clue_state = new_clue_state()

    day_started = time.monotonic()
    for day_index, day in enumerate(days):
        if day_index and day_index % 25 == 0:
            print(f"... {day_index}/{len(days)} days built ({time.monotonic() - day_started:.0f}s)", flush=True)
        date_key = day.isoformat()
        size = 7 if day.weekday() == 6 else 5
        difficulty = DIFFICULTY_BY_WEEKDAY[day.weekday()]
        profile = profile_for_day(day, difficulty)
        holiday_theme = SEASONAL_THEMES.get(date_key)
        required_word = easter_egg_answer_for_day(day)
        accepted: Dict[str, Tuple[str, int, Dict[str, List[dict]], List[Tuple[str, str]]]] = {}

        def make_accept(
            fixed_theme: Optional[str],
            gate_profile: Optional[Dict[str, int]] = None,
            allow_shortfall: Optional[bool] = None,
        ) -> Callable[[SolvedGrid], bool]:
            resolved_profile = gate_profile if gate_profile is not None else profile
            resolved_shortfall = (
                allow_shortfall if allow_shortfall is not None else date_key not in HOLIDAY_THEME_DATES
            )

            def accept(grid: SolvedGrid) -> bool:
                if frozenset(grid.words) in answer_sets:
                    return False
                if fixed_theme is not None:
                    theme_id = fixed_theme
                else:
                    theme_id = choose_theme_for_words(
                        day,
                        day_index,
                        theme_counts,
                        grid.words,
                        entries_by_answer,
                        difficulty,
                    )
                    metrics = puzzle_metrics(grid.words, entries_by_answer, theme_id)
                    if not metrics_fit_profile(
                        metrics, resolved_profile, allow_theme_shortfall=resolved_shortfall
                    ):
                        return False
                solved_seed = stable_hash(f"daybreak-mini:{date_key}:{grid.seed}:{theme_id}")
                clue_result = select_clues_for_day(
                    grid.meta, grid.words, entries_by_answer, theme_id, solved_seed, clue_state
                )
                if clue_result is None:
                    # Same-day clue-text collision that no alternate option can
                    # resolve: the grid is invalid, re-pick.
                    return False
                accepted[grid.signature] = (theme_id, solved_seed, clue_result[0], clue_result[1])
                return True

            return accept

        cooldown_relaxed = False
        solved_grid: Optional[SolvedGrid] = None
        accept = make_accept(holiday_theme)
        tried_recent_sets: Set[frozenset] = set()
        for window in COOLDOWN_WINDOWS:
            recent_words = recent_words_within(word_history, day_index, window) | {
                word for word, count in word_counts.items() if count >= max_uses_for(word)
            }
            frozen = frozenset(recent_words)
            if frozen in tried_recent_sets:
                # Early in the pack shorter windows collapse to the same
                # blocked set; retrying it would just repeat the failure.
                continue
            tried_recent_sets.add(frozen)
            if required_word and required_word in recent_words:
                # The pinned answer is inside this cooldown window; only a
                # shorter window can host it (recorded as relaxed below).
                continue
            if holiday_theme:
                solved_grid = build_theme_dense_grid(
                    day,
                    size,
                    holiday_theme,
                    difficulty,
                    metas_by_size[size],
                    words_by_length,
                    word_set_by_length,
                    position_index,
                    prefix_index,
                    entries_by_answer,
                    recent_words,
                    signatures,
                    accept,
                )
            else:
                solved_grid = build_regular_day_grid(
                    day,
                    day_index,
                    size,
                    difficulty,
                    metas_by_size[size],
                    words_by_length,
                    word_set_by_length,
                    position_index,
                    prefix_index,
                    entries_by_answer,
                    recent_words,
                    signatures,
                    word_counts,
                    theme_counts,
                    required_word,
                    accept,
                )
            if solved_grid is not None:
                cooldown_relaxed = window < STRICT_COOLDOWN_WINDOW
                break
        profile_relaxed = False
        holiday_theme_missed = False
        if solved_grid is None and holiday_theme:
            # Holiday theming is best-effort: some pinned themes cannot
            # interlock in the dense holiday shapes (culture-corner has no
            # 4-letter words and few crossable 5s). Fall back to a regular
            # theme-free day rather than failing the pack, and say so loudly —
            # the day still ships, just without the seasonal flavor.
            holiday_theme_missed = True
            print(f"WARNING: holiday theme {holiday_theme} not buildable for {date_key}; using regular grid", flush=True)
            accept = make_accept(None, gate_profile=PROFILE[difficulty], allow_shortfall=True)
            tried_recent_sets = set()
            for window in COOLDOWN_WINDOWS:
                recent_words = recent_words_within(word_history, day_index, window) | {
                word for word, count in word_counts.items() if count >= max_uses_for(word)
            }
                frozen = frozenset(recent_words)
                if frozen in tried_recent_sets:
                    continue
                tried_recent_sets.add(frozen)
                if required_word and required_word in recent_words:
                    continue
                solved_grid = build_regular_day_grid(
                    day,
                    day_index,
                    size,
                    difficulty,
                    metas_by_size[size],
                    words_by_length,
                    word_set_by_length,
                    position_index,
                    prefix_index,
                    entries_by_answer,
                    recent_words,
                    signatures,
                    word_counts,
                    theme_counts,
                    required_word,
                    accept,
                )
                if solved_grid is not None:
                    cooldown_relaxed = window < STRICT_COOLDOWN_WINDOW
                    break
        if solved_grid is None:
            profile_relaxed = True
            relaxed = dict(PROFILE[difficulty])
            relaxed["min_anchor"] = max(0, relaxed["min_anchor"] - 1)
            relaxed["max_hard"] = relaxed["max_hard"] + 1
            print(
                f"WARNING: relaxing profile gates for {date_key} after exhausting the standard ladder",
                flush=True,
            )
            accept = make_accept(None, gate_profile=relaxed, allow_shortfall=True)
            for window in (30, 7, 0):
                recent_words = recent_words_within(word_history, day_index, window) | {
                word for word, count in word_counts.items() if count >= max_uses_for(word)
            }
                solved_grid = build_regular_day_grid(
                    day,
                    day_index,
                    size,
                    difficulty,
                    metas_by_size[size],
                    words_by_length,
                    word_set_by_length,
                    position_index,
                    prefix_index,
                    entries_by_answer,
                    recent_words,
                    signatures,
                    word_counts,
                    theme_counts,
                    required_word,
                    accept,
                    profile_override=relaxed,
                    randomized_order=True,
                )
                if solved_grid is not None:
                    cooldown_relaxed = True
                    break
        if solved_grid is None:
            raise SystemExit(f"Failed to assign validated grid for {date_key}")

        theme_id, solved_seed, solved_clues, used_pairs = accepted[solved_grid.signature]
        solved_words = list(solved_grid.words)
        commit_clue_usage(clue_state, used_pairs)

        signatures.add(solved_grid.signature)
        answer_sets.add(frozenset(solved_grid.words))
        for word in solved_words:
            word_history.setdefault(word, []).append(day_index)
            word_counts[word] = word_counts.get(word, 0) + 1

        theme_counts[theme_id] = theme_counts.get(theme_id, 0) + 1
        bonus_answer = bonus_allocator.allocate(date_key, theme_id)
        scoring_profile = PROFILE[difficulty] if holiday_theme_missed else profile
        metrics = puzzle_metrics(solved_words, entries_by_answer, theme_id)
        metrics["score"] = quality_score(metrics, scoring_profile, False)
        metrics["themeTargetMin"] = scoring_profile["theme_target_min"]
        metrics["themeTargetMax"] = scoring_profile["theme_target_max"]
        metrics["holidayTheme"] = 1 if (date_key in HOLIDAY_THEME_DATES and not holiday_theme_missed) else 0
        # The end-of-run audit gates the whole pack; a written schedule is by
        # definition an audit-passed one.
        metrics["editorialStatus"] = "passed"
        metrics["cooldownRelaxed"] = 1 if cooldown_relaxed else 0
        metrics["signatureRepeated"] = 0
        if verbose:
            print(
                f"Assigned {date_key} {size}x{size} {difficulty} {theme_id} theme={metrics['themeAnswerCount']} anchors={metrics['anchorCount']}",
                flush=True,
            )
        schedule.append(
            {
                "date": date_key,
                "size": size,
                "templateId": solved_grid.meta.template_id,
                "seed": solved_seed,
                "themeId": theme_id,
                "difficulty": difficulty,
                "bonusAnswer": bonus_answer or "",
                "signature": solved_grid.signature,
                "clues": solved_clues,
                "quality": metrics,
            }
        )

    # Aborts with a per-theme deficit report when the bank cannot cover the
    # window with once-ever bonus words.
    bonus_allocator.fail_if_deficient(pack_start, pack_end)

    return schedule, entries_by_answer, themes_by_id, bonus_by_answer, payload


def write_schedule(schedule: List[Dict[str, object]], pack_start: date, pack_end: date) -> None:
    lines = [
        "// Auto-generated by scripts/build_mini_crossword_variants.py",
        "export type MiniCrosswordScheduleDifficulty = 'easy' | 'medium' | 'tricky' | 'mega';",
        "",
        "export interface MiniCrosswordScheduleEntry {",
        "  date: string;",
        "  size: 5 | 7;",
        "  templateId: string;",
        "  seed: number;",
        "  themeId: string;",
        "  difficulty: MiniCrosswordScheduleDifficulty;",
        "  bonusAnswer: string;",
        "  signature: string;",
        "  clues: {",
        "    across: MiniCrosswordScheduleClue[];",
        "    down: MiniCrosswordScheduleClue[];",
        "  };",
        "  quality: {",
        "    score: number;",
        "    anchorCount: number;",
        "    hardCount: number;",
        "    themeAnswerCount: number;",
        "    trickyClueCount: number;",
        "    themeTargetMin: number;",
        "    themeTargetMax: number;",
        "    cooldownRelaxed: number;",
        "    signatureRepeated: number;",
        "    holidayTheme: number;",
        "  };",
        "}",
        "",
        "export interface MiniCrosswordScheduleClue {",
        "  answer: string;",
        "  text: string;",
        "  type: string;",
        "  difficulty: string;",
        "  tone: string;",
        "  source: string;",
        "  score: number;",
        "  themeTags: string[];",
        "  themeMatch: boolean;",
        "  rejectionNotes: string[];",
        "}",
        "",
        f"export const MINI_CROSSWORD_PACK_START_DATE = '{pack_start.isoformat()}';",
        f"export const MINI_CROSSWORD_PACK_END_DATE = '{pack_end.isoformat()}';",
        f"export const MINI_CROSSWORD_PACK_LENGTH = {(pack_end - pack_start).days + 1};",
        "",
        "export const MINI_CROSSWORD_SCHEDULE: MiniCrosswordScheduleEntry[] =",
        json.dumps(schedule, indent=2),
        ";",
        "",
    ]
    OUTPUT_PATH.write_text("\n".join(lines))


def write_calibration(
    schedule: List[Dict[str, object]],
    entries_by_answer: Dict[str, EntryMeta],
    themes_by_id: Dict[str, dict],
    bonus_by_answer: Dict[str, dict],
) -> None:
    lines = [
        "# Mini Crossword Calibration Packet",
        "",
        "Generated sample from the fully automatic editorial builder. Use this to tune clue voice, theme mix, and difficulty before trusting the rest of the 2026 pack.",
        "",
        "## Full-Pack Audit",
        "",
        f"- Dates: {len(schedule)}",
        f"- Theme-answer range: {min(int(entry['quality']['themeAnswerCount']) for entry in schedule)}-{max(int(entry['quality']['themeAnswerCount']) for entry in schedule)}",
        f"- Average theme answers: {sum(int(entry['quality']['themeAnswerCount']) for entry in schedule) / len(schedule):.2f}",
        f"- Unique grid signatures: {len({str(entry['signature']) for entry in schedule})}",
        f"- Relaxed cooldown fallbacks: {sum(int(entry['quality'].get('cooldownRelaxed', 0)) for entry in schedule)}",
        f"- Repeated signature fallbacks: {sum(int(entry['quality'].get('signatureRepeated', 0)) for entry in schedule)}",
        "- Agent stages: Fill Builder -> Clue Writer -> Theme Editor -> Crossword Editor -> Difficulty Calibrator",
        "",
    ]
    for entry in schedule[:28]:
        theme = themes_by_id[str(entry["themeId"])]
        bonus = bonus_by_answer[str(entry["bonusAnswer"])]
        signature = str(entry["signature"])
        encoded = signature.split(":", 1)[1]
        across_part, down_part = encoded.split("/")
        across_words = across_part.split("|") if across_part else []
        down_words = down_part.split("|") if down_part else []
        across_clues = list(entry["clues"]["across"])
        down_clues = list(entry["clues"]["down"])
        lines.extend(
            [
                f"## {entry['date']} - {entry['size']}x{entry['size']} - {theme['label']}",
                "",
                f"Difficulty: {entry['difficulty']} | Score: {entry['quality']['score']} | Theme answers: {entry['quality']['themeAnswerCount']} (target {entry['quality']['themeTargetMin']}-{entry['quality']['themeTargetMax']}) | Cooldown: {'relaxed' if entry['quality'].get('cooldownRelaxed') else 'strict'} | Signature: {'repeat fallback' if entry['quality'].get('signatureRepeated') else 'fresh'} | Bonus: {bonus['answer']} - {bonus['clue']}",
                "",
                "Editorial notes:",
                f"- Fill Builder: selected `{entry['templateId']}` with a unique signature.",
                f"- Theme Editor: matched {entry['quality']['themeAnswerCount']} entries to `{entry['themeId']}`.",
                "- Crossword Editor: selected final clue surfaces from scored metadata.",
                "- Difficulty Calibrator: checked anchor count, hard clue ceiling, and weekday target.",
                "",
                "Across:",
            ]
        )
        for index, word in enumerate(across_words):
            clue = across_clues[index]
            marker = "theme" if clue["themeMatch"] else "fill"
            lines.append(f"- {word}: {clue['text']} [{marker}, {clue['difficulty']}, score {clue['score']}]")
        lines.append("")
        lines.append("Down:")
        for index, word in enumerate(down_words):
            clue = down_clues[index]
            marker = "theme" if clue["themeMatch"] else "fill"
            lines.append(f"- {word}: {clue['text']} [{marker}, {clue['difficulty']}, score {clue['score']}]")
        lines.append("")
    CALIBRATION_PATH.write_text("\n".join(lines))


def write_backend_export(
    schedule: List[Dict[str, object]],
    pack_start: date,
    pack_end: date,
    bank_payload: Dict[str, object],
    out_dir: Path,
) -> None:
    """Write the supertime-backend data files (minified, matching the committed style)."""
    out_dir.mkdir(parents=True, exist_ok=True)
    schedule_payload = {
        "start_date": pack_start.isoformat(),
        "end_date": pack_end.isoformat(),
        "length": len(schedule),
        "entries": schedule,
    }
    (out_dir / "schedule.json").write_text(json.dumps(schedule_payload, separators=(",", ":")) + "\n")
    (out_dir / "bank.json").write_text(json.dumps(bank_payload, separators=(",", ":")) + "\n")


def audit_schedule(schedule: List[Dict[str, object]]) -> List[str]:
    """Print the post-generation audit summary; return hard-constraint failures."""
    failures: List[str] = []
    total_days = len(schedule)
    signatures = [str(entry["signature"]) for entry in schedule]
    distinct_signatures = len(set(signatures))
    if distinct_signatures != total_days:
        failures.append(f"grid signatures are not unique: {distinct_signatures} distinct over {total_days} days")

    answer_dates: Dict[str, List[date]] = {}
    pair_counts: Dict[Tuple[str, str], int] = {}
    same_day_collisions = 0
    relaxed_dates: Set[str] = set()
    for entry in schedule:
        entry_date = date.fromisoformat(str(entry["date"]))
        if int(entry["quality"].get("cooldownRelaxed", 0)):
            relaxed_dates.add(str(entry["date"]))
        texts: Dict[str, int] = {}
        for direction in ("across", "down"):
            for clue in entry["clues"][direction]:
                answer = str(clue["answer"])
                text = str(clue["text"])
                answer_dates.setdefault(answer, []).append(entry_date)
                pair_counts[(answer, text)] = pair_counts.get((answer, text), 0) + 1
                texts[text] = texts.get(text, 0) + 1
        same_day_collisions += sum(count - 1 for count in texts.values() if count > 1)

    seen_answer_sets: Dict[frozenset, str] = {}
    for entry in schedule:
        words = frozenset(
            str(clue["answer"]).upper()
            for group in ("across", "down")
            for clue in entry["clues"][group]
        )
        prior = seen_answer_sets.get(words)
        if prior is not None:
            failures.append(f"{entry['date']} repeats the {prior} grid (same answer set)")
        else:
            seen_answer_sets[words] = str(entry["date"])

    max_uses = max((len(dates) for dates in answer_dates.values()), default=0)
    cap_offenders = sorted(
        answer for answer, dates in answer_dates.items() if len(dates) > max_uses_for(answer)
    )
    if cap_offenders:
        failures.append(
            f"answer usage cap exceeded for {len(cap_offenders)} answer(s) "
            f"(e.g. {', '.join(cap_offenders[:10])})"
        )
    min_gap: Optional[int] = None
    min_strict_gap: Optional[int] = None
    gap_violations = 0
    for answer, dates in answer_dates.items():
        ordered = sorted(dates)
        for earlier, later in zip(ordered, ordered[1:]):
            gap = (later - earlier).days
            if min_gap is None or gap < min_gap:
                min_gap = gap
            if later.isoformat() not in relaxed_dates:
                if min_strict_gap is None or gap < min_strict_gap:
                    min_strict_gap = gap
                if gap <= WORD_COOLDOWN_BASE.get(len(answer), WORD_COOLDOWN_DEFAULT):
                    gap_violations += 1
                    if gap_violations <= 5:
                        failures.append(f"answer {answer} re-used after {gap} days ({earlier} -> {later})")
    if gap_violations > 5:
        failures.append(f"... and {gap_violations - 5} more re-use gap violations")

    pair_repeats = sum(count - 1 for count in pair_counts.values() if count > 1)
    if same_day_collisions:
        failures.append(f"{same_day_collisions} same-day clue-text collision(s)")

    bonuses = [str(entry["bonusAnswer"]) for entry in schedule]
    bonus_unique = len(set(bonuses)) == len(bonuses) and "" not in bonuses
    if not bonus_unique:
        failures.append("bonus answers are not all-unique")
    relaxed_count = len(relaxed_dates)

    print("Audit summary:")
    print(f"  Total days: {total_days}")
    print(f"  Distinct grid signatures: {distinct_signatures} (must equal days)")
    print(f"  Max uses per answer: {max_uses}")
    print(
        f"  Minimum re-use gap (strict days): {min_strict_gap if min_strict_gap is not None else 'n/a'} "
        f"(per-length floors 35/60/90); including relaxed days: {min_gap if min_gap is not None else 'n/a'}"
    )
    print(f"  Verbatim answer+clue pair repeats: {pair_repeats}")
    print(f"  Same-day clue-text collisions: {same_day_collisions} (must be 0)")
    print(f"  Bonus uniqueness: {'all-unique' if bonus_unique else 'DUPLICATES'} ({len(set(bonuses))}/{len(bonuses)})")
    print(f"  Cooldown relaxed days: {relaxed_count}")
    return failures


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the dated Daybreak mini crossword schedule.")
    parser.add_argument("--start", type=date.fromisoformat, default=DEFAULT_PACK_START, metavar="YYYY-MM-DD")
    parser.add_argument("--end", type=date.fromisoformat, default=DEFAULT_PACK_END, metavar="YYYY-MM-DD")
    parser.add_argument(
        "--backend-out",
        type=Path,
        default=None,
        metavar="DIR",
        help="Also write supertime-backend schedule.json + bank.json into DIR",
    )
    args = parser.parse_args()
    if args.end < args.start:
        parser.error("--end must not be before --start")
    return args


def main() -> None:
    args = parse_args()
    pack_start: date = args.start
    pack_end: date = args.end
    if not BANK_PATH.exists():
        raise SystemExit(f"Bank file not found: {BANK_PATH}")
    schedule, entries_by_answer, themes_by_id, bonus_by_answer, bank_payload = build_schedule(pack_start, pack_end)
    target_days = (pack_end - pack_start).days + 1
    if len(schedule) != target_days:
        raise SystemExit(f"Expected {target_days} schedule entries, got {len(schedule)}")
    sunday_count = sum(1 for entry in schedule if entry["size"] == 7)
    expected_sundays = sum(1 for day in date_range(pack_start, pack_end) if day.weekday() == 6)
    if sunday_count != expected_sundays:
        raise SystemExit(f"Expected {expected_sundays} Sunday Mega Minis, got {sunday_count}")
    failures = audit_schedule(schedule)
    if failures:
        raise SystemExit("Schedule audit failed:\n" + "\n".join(f"  - {failure}" for failure in failures))
    write_schedule(schedule, pack_start, pack_end)
    write_calibration(schedule, entries_by_answer, themes_by_id, bonus_by_answer)
    theme_counts: Dict[str, int] = {}
    for entry in schedule:
        theme_counts[str(entry["themeId"])] = theme_counts.get(str(entry["themeId"]), 0) + 1
    print(f"Wrote {OUTPUT_PATH} with {len(schedule)} dated puzzles.")
    print(f"Wrote {CALIBRATION_PATH}.")
    if args.backend_out is not None:
        write_backend_export(schedule, pack_start, pack_end, bank_payload, args.backend_out)
        print(f"Wrote backend export (schedule.json, bank.json) to {args.backend_out}.")
    print("Theme distribution:", theme_counts)


if __name__ == "__main__":
    main()
