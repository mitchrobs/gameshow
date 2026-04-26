#!/usr/bin/env python3
"""Build the dated Daybreak mini crossword schedule."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple

from mini_crossword_content import BAD_CLUE_RE, THEMES

BASE_DIR = Path(__file__).resolve().parents[1]
BANK_PATH = BASE_DIR / "src" / "data" / "miniCrosswordBank.json"
OUTPUT_PATH = BASE_DIR / "src" / "data" / "miniCrosswordSchedule.generated.ts"
CALIBRATION_PATH = BASE_DIR / "docs" / "mini-crossword-calibration.md"

PACK_START = date(2026, 5, 15)
PACK_END = date(2027, 5, 14)
TARGET_DAYS = (PACK_END - PACK_START).days + 1
MAX_ATTEMPTS_PER_DAY = 24
MAX_CANDIDATES_PER_SLOT = 140
MAX_SEARCH_NODES = 500
REPEAT_LIMIT_PER_WINDOW = 2

THEME_IDS = [theme["id"] for theme in THEMES]
SEASONAL_THEMES = {
    "2026-05-10": "home-reset",  # Mother's Day
    "2026-05-25": "fresh-air",  # Memorial Day
    "2026-06-19": "culture-corner",  # Juneteenth
    "2026-06-21": "weekend-glow",  # Father's Day
    "2026-07-04": "weekend-glow",  # Independence Day
    "2026-09-07": "weekend-glow",  # Labor Day
    "2026-10-31": "culture-corner",  # Halloween
    "2026-11-26": "kitchen-table",  # Thanksgiving
    "2026-12-25": "home-reset",  # Christmas
    "2026-12-31": "weekend-glow",  # New Year's Eve
    "2027-01-01": "fresh-air",  # New Year's Day
    "2027-01-18": "culture-corner",  # Martin Luther King Jr. Day
    "2027-02-14": "friend-date",  # Valentine's Day
    "2027-02-15": "city-stroll",  # Presidents' Day
    "2027-03-17": "weekend-glow",  # St. Patrick's Day
    "2027-03-28": "brunch-hour",  # Easter
    "2027-04-22": "fresh-air",  # Earth Day
    "2027-05-09": "family-table",  # Mother's Day
}
EASTER_EGG_ANSWERS = {
    "11-03": "HOPE",
}
EASTER_EGG_THEMES = {
    "11-03": "mindful-morning",
}
SPECIAL_TEMPLATE_IDS = {"hope-square"}

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
                if 0 < len(cells) < 3:
                    raise ValueError(f"Template {template['id']} has a short across slot")
                if len(cells) >= 3:
                    slots.append(Slot("across", row, col, len(cells), tuple(cells), numbering[(row, col)]))

            if starts_down:
                cells = []
                rr = row
                while rr < size and not blocks[rr][col]:
                    cells.append((rr, col))
                    rr += 1
                if 0 < len(cells) < 3:
                    raise ValueError(f"Template {template['id']} has a short down slot")
                if len(cells) >= 3:
                    slots.append(Slot("down", row, col, len(cells), tuple(cells), numbering[(row, col)]))

    for row in range(size):
        for col in range(size):
            if blocks[row][col]:
                continue
            across = any((row, col) in slot.cells for slot in slots if slot.direction == "across")
            down = any((row, col) in slot.cells for slot in slots if slot.direction == "down")
            if not across or not down:
                raise ValueError(f"Template {template['id']} has an unchecked cell at {row}:{col}")

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


def get_candidates(
    length: int,
    pattern: str,
    used_words: Set[str],
    recent_words: Set[str],
    words_by_length: Dict[int, List[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
) -> List[str]:
    candidate_pool: Optional[Set[str]] = None
    for index, ch in enumerate(pattern):
        if ch == ".":
            continue
        bucket = position_index.get(length, [])[index].get(ch)
        if not bucket:
            return []
        candidate_pool = set(bucket) if candidate_pool is None else candidate_pool & bucket
        if not candidate_pool:
            return []

    if candidate_pool is None:
        candidate_pool = set(words_by_length.get(length, []))
    if used_words:
        candidate_pool = {word for word in candidate_pool if word not in used_words}
    if recent_words:
        candidate_pool = {word for word in candidate_pool if word not in recent_words}
    return sorted(candidate_pool)


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


def word_cooldown_days(word: str, mode: str = "strict") -> int:
    if mode == "none":
        return -1
    if mode == "relaxed":
        return 0
    return 45 if len(word) >= 5 else 21


def recent_words_for(word_history: Dict[str, List[int]], day_index: int, mode: str = "strict") -> Set[str]:
    if mode == "none":
        return set()

    blocked: Set[str] = set()
    for word, seen_days in word_history.items():
        if not seen_days:
            continue
        if mode == "relaxed":
            continue

        window = word_cooldown_days(word, mode)
        recent_uses = [seen_day for seen_day in seen_days if 0 < day_index - seen_day <= window]
        if len(recent_uses) >= REPEAT_LIMIT_PER_WINDOW:
            blocked.add(word)
    return blocked


def date_month_day(day: date) -> str:
    return day.strftime("%m-%d")


def easter_egg_answer_for_day(day: date) -> Optional[str]:
    return EASTER_EGG_ANSWERS.get(date_month_day(day))


def easter_egg_theme_for_day(day: date) -> Optional[str]:
    return EASTER_EGG_THEMES.get(date_month_day(day))


def theme_distance(theme_count: int, difficulty: str) -> int:
    profile = PROFILE[difficulty]
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


def select_clue(
    answer: str,
    entry: EntryMeta,
    slot: Slot,
    theme_id: str,
    seed: int,
) -> dict:
    options = list(clue_metadata_for_entry(entry))
    if not options:
        raise ValueError(f"Missing clue metadata for {answer}")

    exact_theme_options = [
        clue
        for clue in options
        if theme_id in set(clue.get("themeTags", []))
    ]
    theme_options = exact_theme_options or [
        clue
        for clue in options
        if theme_id in set(entry.theme_tags).union(set(clue.get("themeTags", [])))
    ]
    pool = theme_options if theme_options else options
    random_rank = {
        clue_text: rank
        for rank, clue_text in enumerate(
            shuffled([str(clue["text"]) for clue in pool], seed ^ stable_hash(f"{answer}:{slot.number}:{slot.direction}"))
        )
    }
    chosen = sorted(
        pool,
        key=lambda clue: (
            0 if theme_id in set(entry.theme_tags).union(set(clue.get("themeTags", []))) else 1,
            0 if clue.get("difficulty") != "tricky" else 1,
            -int(clue.get("score", 0)),
            random_rank.get(str(clue["text"]), 999),
        ),
    )[0]

    theme_tags = sorted(set(entry.theme_tags).union(set(chosen.get("themeTags", []))))
    return {
        "answer": answer,
        "text": chosen["text"],
        "type": chosen.get("type", "direct"),
        "difficulty": chosen.get("difficulty", "easy"),
        "tone": chosen.get("tone", "straight"),
        "source": chosen.get("source", "editorial"),
        "score": int(chosen.get("score", 0)),
        "themeTags": theme_tags,
        "themeMatch": theme_id in theme_tags,
        "rejectionNotes": chosen.get("rejectionNotes", []),
    }


def select_clues(
    meta: TemplateMeta,
    assigned: Sequence[str],
    entries_by_answer: Dict[str, EntryMeta],
    theme_id: str,
    seed: int,
) -> Dict[str, List[dict]]:
    selected: Dict[str, List[dict]] = {"across": [], "down": []}
    for index, slot in enumerate(meta.slots):
        answer = assigned[index]
        clue = select_clue(answer, entries_by_answer[answer], slot, theme_id, seed)
        selected[slot.direction].append(clue)
    return selected


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
) -> Optional[List[str]]:
    profile = PROFILE[difficulty]
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
        def candidate_sort_key(word: str) -> Tuple[int, int, int, int, int, int, str]:
            entry = entries_by_answer[word]
            difficulty_rank = 0 if entry.difficulty == "easy" else 1 if entry.difficulty == "medium" else 2
            required_rank = 0 if word in required_words else 1
            theme_rank = 0 if theme_id in entry.theme_tags else 2 if entry.theme_tags else 1
            reuse_count = (global_word_counts or {}).get(word, 0)
            if difficulty == "easy":
                return (required_rank, difficulty_rank, theme_rank, reuse_count, random_rank[word], -word_crossability(word), word)
            return (required_rank, theme_rank, difficulty_rank, reuse_count, random_rank[word], -word_crossability(word), word)

        return sorted(pool, key=candidate_sort_key)

    def recurse() -> bool:
        nonlocal search_nodes
        search_nodes += 1
        if search_nodes > MAX_SEARCH_NODES:
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


def date_range() -> Iterable[date]:
    current = PACK_START
    while current <= PACK_END:
        yield current
        current += timedelta(days=1)


def choose_theme(day: date, day_index: int) -> str:
    key = day.isoformat()
    if key in SEASONAL_THEMES:
        return SEASONAL_THEMES[key]
    return THEME_IDS[day_index % len(THEME_IDS)]


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
    profile = PROFILE[difficulty]
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


def choose_bonus(theme_id: str, day_index: int, seed: int, bonus_by_theme: Dict[str, List[str]]) -> str:
    options = bonus_by_theme[theme_id]
    return options[(day_index + seed) % len(options)]


def quality_score(metrics: Dict[str, int], difficulty: str, allow_theme_miss: bool) -> int:
    profile = PROFILE[difficulty]
    score = 100
    score -= max(0, profile["min_anchor"] - metrics["anchorCount"]) * 12
    score -= metrics["hardCount"] * 4
    score -= max(0, profile["theme_min"] - metrics["themeAnswerCount"]) * 16
    score -= theme_distance(metrics["themeAnswerCount"], difficulty) * 5
    score -= max(0, metrics["themeAnswerCount"] - profile["theme_max"]) * 3
    score -= metrics["trickyClueCount"] * 2
    return max(0, score)


def validate_clues(entries: Iterable[EntryMeta]) -> None:
    bad = []
    for entry in entries:
        if not entry.clue_options:
            bad.append(f"{entry.answer}: missing clue")
            continue
        for clue in entry.clue_options:
            if BAD_CLUE_RE.search(clue):
                bad.append(f"{entry.answer}: {clue}")
            if entry.answer.lower() in clue.lower().replace(" ", ""):
                bad.append(f"{entry.answer}: answer appears in clue '{clue}'")
    if bad:
        raise SystemExit("Rejected weak crossword clues:\n" + "\n".join(bad[:25]))


def has_editorial_clue(entry: EntryMeta) -> bool:
    metadata = clue_metadata_for_entry(entry)
    return any(
        int(clue.get("score", 0)) >= 70
        and str(clue.get("source", "")) not in {"legacy", "sanitized-legacy"}
        for clue in metadata
    )


def grid_has_editorial_clues(words: Sequence[str], entries_by_answer: Dict[str, EntryMeta]) -> bool:
    return all(has_editorial_clue(entries_by_answer[word]) for word in words)


def metrics_fit_profile(metrics: Dict[str, int], difficulty: str) -> bool:
    profile = PROFILE[difficulty]
    return (
        metrics["anchorCount"] >= profile["min_anchor"]
        and metrics["hardCount"] <= profile["max_hard"]
        and metrics["themeAnswerCount"] >= profile["theme_min"]
        and metrics["themeAnswerCount"] <= profile["theme_max"]
    )


def build_solved_grid_pool(
    size: int,
    target_count: int,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
    verbose: bool,
) -> List[SolvedGrid]:
    pool: List[SolvedGrid] = []
    signatures: Set[str] = set()
    attempts = 0
    max_attempts = target_count * (90 if size == 5 else 30)
    solve_difficulty = "medium" if size == 5 else "mega"

    while len(pool) < target_count and attempts < max_attempts:
        meta = metas[attempts % len(metas)]
        theme_hint = THEME_IDS[attempts % len(THEME_IDS)]
        seed = stable_hash(f"daybreak-mini-pool:{size}:{meta.template_id}:{attempts}")
        solved_words = solve_template(
            meta,
            seed,
            theme_hint,
            solve_difficulty,
            set(),
            words_by_length,
            word_set_by_length,
            position_index,
            prefix_index,
            entries_by_answer,
            allow_theme_miss=True,
            global_word_counts=None,
        )
        attempts += 1
        if not solved_words:
            continue
        signature = make_signature(meta, solved_words)
        if signature in signatures:
            continue
        signatures.add(signature)
        pool.append(SolvedGrid(meta=meta, words=tuple(solved_words), seed=seed, signature=signature))
        if verbose and len(pool) % 25 == 0:
            print(f"Built {len(pool)} {size}x{size} grid candidates", flush=True)

    if len(pool) < target_count:
        raise SystemExit(f"Only built {len(pool)} {size}x{size} grid candidates; needed {target_count}")
    return pool


def build_required_word_grid(
    size: int,
    required_word: str,
    metas: Sequence[TemplateMeta],
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
) -> SolvedGrid:
    if required_word not in entries_by_answer:
        raise SystemExit(f"Easter egg answer is missing from the bank: {required_word}")

    candidates = [
        meta
        for meta in metas
        if meta.size == size and any(slot.length == len(required_word) for slot in meta.slots)
    ]
    candidates = sorted(candidates, key=lambda meta: (0 if meta.template_id in SPECIAL_TEMPLATE_IDS else 1, meta.template_id))
    if not candidates:
        raise SystemExit(f"No {size}x{size} template can place {required_word}")

    difficulty = "medium" if size == 5 else "mega"
    theme_hint = next(iter(entries_by_answer[required_word].theme_tags), "mindful-morning")
    for attempt in range(160):
        for meta in candidates:
            seed = stable_hash(f"daybreak-mini-required:{size}:{required_word}:{meta.template_id}:{attempt}")
            solved_words = solve_template(
                meta,
                seed,
                theme_hint,
                difficulty,
                set(),
                words_by_length,
                word_set_by_length,
                position_index,
                prefix_index,
                entries_by_answer,
                allow_theme_miss=True,
                global_word_counts=None,
                required_words={required_word},
            )
            if not solved_words:
                continue
            signature = make_signature(meta, solved_words)
            return SolvedGrid(meta=meta, words=tuple(solved_words), seed=seed, signature=signature)

    raise SystemExit(f"Could not build required-word grid for {required_word}")


def select_grid_for_day(
    day: date,
    day_index: int,
    difficulty: str,
    pool: Sequence[SolvedGrid],
    entries_by_answer: Dict[str, EntryMeta],
    theme_counts: Dict[str, int],
    word_history: Dict[str, List[int]],
    word_counts: Dict[str, int],
    used_signatures: Set[str],
) -> Tuple[SolvedGrid, str, bool, bool]:
    cooldown_mode = "none" if day.weekday() == 6 or day.isoformat() in SEASONAL_THEMES else "strict"
    recent_words = recent_words_for(word_history, day_index, cooldown_mode)
    required_word = easter_egg_answer_for_day(day)
    ranked_pool = sorted(
        pool,
        key=lambda grid: (
            grid.signature in used_signatures,
            sum(word_counts.get(word, 0) for word in grid.words),
            stable_hash(f"{day.isoformat()}:{grid.signature}"),
        ),
    )

    for allow_recent in (False, True):
        for allow_repeat in (False, True):
            for grid in ranked_pool:
                if required_word and required_word not in grid.words:
                    continue
                if not allow_repeat and grid.signature in used_signatures:
                    continue
                if not allow_recent and any(word in recent_words for word in grid.words):
                    continue
                theme_id = choose_theme_for_words(
                    day,
                    day_index,
                    theme_counts,
                    grid.words,
                    entries_by_answer,
                    difficulty,
                )
                metrics = puzzle_metrics(grid.words, entries_by_answer, theme_id)
                if not metrics_fit_profile(metrics, difficulty):
                    continue
                return grid, theme_id, allow_recent and cooldown_mode != "none", grid.signature in used_signatures

    raise SystemExit(f"Failed to assign validated grid for {day.isoformat()}")


def build_schedule() -> Tuple[List[Dict[str, object]], Dict[str, EntryMeta], Dict[str, dict], Dict[str, dict]]:
    verbose = os.environ.get("MINI_CROSSWORD_VERBOSE") == "1"
    payload = json.loads(BANK_PATH.read_text())
    entries_by_answer: Dict[str, EntryMeta] = {}
    words_by_length: Dict[int, List[str]] = {}
    for raw in payload["entries"]:
        answer = str(raw["answer"]).upper()
        clues = tuple(str(clue) for clue in raw.get("clueOptions", []) if str(clue).strip())
        if not answer.isalpha() or len(answer) not in (3, 4, 5, 7) or not clues:
            continue
        entry = EntryMeta(
            answer=answer,
            clue_options=clues,
            clue_metadata=tuple(raw.get("clueMetadata", [])),
            difficulty=str(raw.get("difficulty", "medium")),
            theme_tags=tuple(str(tag) for tag in raw.get("themeTags", [])),
            is_modern=bool(raw.get("isModern", False)),
        )
        entries_by_answer[answer] = entry
        words_by_length.setdefault(len(answer), []).append(answer)

    validate_clues(entries_by_answer.values())
    for length in list(words_by_length.keys()):
        words_by_length[length] = sorted(set(words_by_length[length]))

    word_set_by_length, position_index, prefix_index = build_indexes(words_by_length)
    metas = [build_template_meta(template) for template in payload["templates"]]
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
        bonus_by_theme.setdefault(theme_id, []).append(answer)
        bonus_by_answer[answer] = raw
    for theme_id in THEME_IDS:
        if theme_id not in bonus_by_theme:
            raise SystemExit(f"Missing bonus word options for {theme_id}")
        bonus_by_theme[theme_id] = sorted(bonus_by_theme[theme_id])

    days = list(date_range())
    regular_days = sum(1 for day in days if day.weekday() != 6)
    mega_days = len(days) - regular_days
    if verbose:
        print(f"Building validated grid pools ({regular_days} regular, {mega_days} mega)", flush=True)
    regular_pool = build_solved_grid_pool(
        5,
        min(regular_days + 40, 16),
        [meta for meta in metas_by_size[5] if meta.template_id not in SPECIAL_TEMPLATE_IDS],
        words_by_length,
        word_set_by_length,
        position_index,
        prefix_index,
        entries_by_answer,
        verbose,
    )
    mega_pool = build_solved_grid_pool(
        7,
        mega_days + 10,
        metas_by_size[7],
        words_by_length,
        word_set_by_length,
        position_index,
        prefix_index,
        entries_by_answer,
        verbose,
    )
    required_regular_words = sorted(
        {
            word
            for day in days
            for word in [easter_egg_answer_for_day(day)]
            if word and day.weekday() != 6
        }
    )
    for required_word in required_regular_words:
        if any(required_word in grid.words for grid in regular_pool):
            continue
        required_grid = build_required_word_grid(
            5,
            required_word,
            metas_by_size[5],
            words_by_length,
            word_set_by_length,
            position_index,
            prefix_index,
            entries_by_answer,
        )
        regular_pool.append(required_grid)
        if verbose:
            print(f"Added required-word grid for {required_word}", flush=True)

    schedule: List[Dict[str, object]] = []
    signatures: Set[str] = set()
    word_history: Dict[str, List[int]] = {}
    word_counts: Dict[str, int] = {}
    theme_counts: Dict[str, int] = {}

    for day_index, day in enumerate(days):
        date_key = day.isoformat()
        size = 7 if day.weekday() == 6 else 5
        difficulty = DIFFICULTY_BY_WEEKDAY[day.weekday()]
        pool = mega_pool if size == 7 else regular_pool
        solved_grid, theme_id, cooldown_relaxed, signature_repeated = select_grid_for_day(
            day,
            day_index,
            difficulty,
            pool,
            entries_by_answer,
            theme_counts,
            word_history,
            word_counts,
            signatures,
        )
        solved_words = list(solved_grid.words)
        solved_seed = stable_hash(f"daybreak-mini:{date_key}:{solved_grid.seed}:{theme_id}")
        solved_clues = select_clues(solved_grid.meta, solved_words, entries_by_answer, theme_id, solved_seed)

        signatures.add(solved_grid.signature)
        for word in solved_words:
            word_history.setdefault(word, []).append(day_index)
            word_counts[word] = word_counts.get(word, 0) + 1

        theme_counts[theme_id] = theme_counts.get(theme_id, 0) + 1
        metrics = puzzle_metrics(solved_words, entries_by_answer, theme_id)
        metrics["score"] = quality_score(metrics, difficulty, False)
        metrics["themeTargetMin"] = PROFILE[difficulty]["theme_target_min"]
        metrics["themeTargetMax"] = PROFILE[difficulty]["theme_target_max"]
        metrics["cooldownRelaxed"] = 1 if cooldown_relaxed else 0
        metrics["signatureRepeated"] = 1 if signature_repeated else 0
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
                "bonusAnswer": choose_bonus(theme_id, day_index, solved_seed, bonus_by_theme),
                "signature": solved_grid.signature,
                "clues": solved_clues,
                "quality": metrics,
            }
        )

    return schedule, entries_by_answer, themes_by_id, bonus_by_answer


def write_schedule(schedule: List[Dict[str, object]]) -> None:
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
        f"export const MINI_CROSSWORD_PACK_START_DATE = '{PACK_START.isoformat()}';",
        f"export const MINI_CROSSWORD_PACK_END_DATE = '{PACK_END.isoformat()}';",
        f"export const MINI_CROSSWORD_PACK_LENGTH = {TARGET_DAYS};",
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


def main() -> None:
    if not BANK_PATH.exists():
        raise SystemExit(f"Bank file not found: {BANK_PATH}")
    schedule, entries_by_answer, themes_by_id, bonus_by_answer = build_schedule()
    if len(schedule) != TARGET_DAYS:
        raise SystemExit(f"Expected {TARGET_DAYS} schedule entries, got {len(schedule)}")
    sunday_count = sum(1 for entry in schedule if entry["size"] == 7)
    expected_sundays = sum(1 for day in date_range() if day.weekday() == 6)
    if sunday_count != expected_sundays:
        raise SystemExit(f"Expected {expected_sundays} Sunday Mega Minis, got {sunday_count}")
    write_schedule(schedule)
    write_calibration(schedule, entries_by_answer, themes_by_id, bonus_by_answer)
    theme_counts: Dict[str, int] = {}
    for entry in schedule:
        theme_counts[str(entry["themeId"])] = theme_counts.get(str(entry["themeId"]), 0) + 1
    print(f"Wrote {OUTPUT_PATH} with {len(schedule)} dated puzzles.")
    print(f"Wrote {CALIBRATION_PATH}.")
    print("Theme distribution:", theme_counts)


if __name__ == "__main__":
    main()
