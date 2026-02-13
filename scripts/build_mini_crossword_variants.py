#!/usr/bin/env python3
"""Build deterministic mini crossword variant seeds from curated bank metadata."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

from wordfreq import zipf_frequency

BASE_DIR = Path(__file__).resolve().parents[1]
BANK_PATH = BASE_DIR / "src" / "data" / "miniCrosswordBank.json"
OUTPUT_PATH = BASE_DIR / "src" / "data" / "miniCrosswordVariantSeeds.ts"

TARGET_VARIANTS = 400
MIN_REQUIRED_VARIANTS = 360
MAX_ATTEMPTS = 25_000
MAX_CANDIDATES_PER_SLOT = 180
THEMED_SLOT_MIN = 1
THEMED_SLOT_MAX = 3


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


def shuffle(arr: List[str], rand) -> List[str]:
    out = arr[:]
    for i in range(len(out) - 1, 0, -1):
        j = int(rand() * (i + 1))
        out[i], out[j] = out[j], out[i]
    return out


@dataclass(frozen=True)
class Slot:
    direction: str
    row: int
    col: int
    length: int
    cells: Tuple[Tuple[int, int], ...]
    number: int


@dataclass
class TemplateMeta:
    template_id: str
    rows: List[str]
    blocks: List[List[bool]]
    slots: List[Slot]


@dataclass(frozen=True)
class EntryMeta:
    answer: str
    clue_options: Tuple[str, ...]
    difficulty: str
    theme_tags: Tuple[str, ...]
    is_modern: bool


@dataclass(frozen=True)
class BonusWord:
    answer: str
    theme_id: str


def build_template_meta(template: Dict[str, object]) -> TemplateMeta:
    template_id = str(template["id"])
    rows = [str(row) for row in template["rows"]]
    size = len(rows)
    blocks = [[ch == "#" for ch in row] for row in rows]

    numbering: Dict[Tuple[int, int], int] = {}
    next_number = 1
    slots: List[Slot] = []

    for r in range(size):
        for c in range(size):
            if blocks[r][c]:
                continue
            starts_across = c == 0 or blocks[r][c - 1]
            starts_down = r == 0 or blocks[r - 1][c]
            if starts_across or starts_down:
                numbering[(r, c)] = next_number
                next_number += 1

            if starts_across:
                cells: List[Tuple[int, int]] = []
                cc = c
                while cc < size and not blocks[r][cc]:
                    cells.append((r, cc))
                    cc += 1
                if len(cells) >= 3:
                    slots.append(
                        Slot(
                            direction="across",
                            row=r,
                            col=c,
                            length=len(cells),
                            cells=tuple(cells),
                            number=numbering[(r, c)],
                        )
                    )

            if starts_down:
                cells = []
                rr = r
                while rr < size and not blocks[rr][c]:
                    cells.append((rr, c))
                    rr += 1
                if len(cells) >= 3:
                    slots.append(
                        Slot(
                            direction="down",
                            row=r,
                            col=c,
                            length=len(cells),
                            cells=tuple(cells),
                            number=numbering[(r, c)],
                        )
                    )

    return TemplateMeta(
        template_id=template_id,
        rows=rows,
        blocks=blocks,
        slots=slots,
    )


def build_indexes(
    words_by_length: Dict[int, List[str]],
) -> Tuple[
    Dict[int, Set[str]],
    Dict[int, List[Dict[str, Set[str]]]],
    Dict[Tuple[int, int], Set[str]],
]:
    word_set_by_length: Dict[int, Set[str]] = {
        length: set(words) for length, words in words_by_length.items()
    }

    position_index: Dict[int, List[Dict[str, Set[str]]]] = {}
    for length, words in words_by_length.items():
        buckets = [dict() for _ in range(length)]
        for word in words:
            for index, ch in enumerate(word):
                bucket = buckets[index]
                if ch not in bucket:
                    bucket[ch] = set()
                bucket[ch].add(word)
        position_index[length] = buckets

    prefix_index: Dict[Tuple[int, int], Set[str]] = {}
    for length, words in words_by_length.items():
        for prefix_len in range(1, length + 1):
            key = (length, prefix_len)
            prefix_index[key] = set()
            for word in words:
                prefix_index[key].add(word[:prefix_len])

    return word_set_by_length, position_index, prefix_index


def get_candidates(
    length: int,
    pattern: str,
    used_words: Set[str],
    words_by_length: Dict[int, List[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
) -> List[str]:
    candidate_pool: Optional[Set[str]] = None
    for i, ch in enumerate(pattern):
        if ch == ".":
            continue
        bucket = position_index[length][i].get(ch)
        if not bucket:
            return []
        if candidate_pool is None:
            candidate_pool = set(bucket)
        else:
            candidate_pool &= bucket
        if not candidate_pool:
            return []

    if candidate_pool is None:
        candidate_pool = set(words_by_length[length])

    if used_words:
        candidate_pool = {word for word in candidate_pool if word not in used_words}

    return sorted(candidate_pool)


def make_signature(meta: TemplateMeta, slot_words: List[str]) -> str:
    across_words = []
    down_words = []
    for index, slot in enumerate(meta.slots):
        if slot.direction == "across":
            across_words.append(slot_words[index])
        else:
            down_words.append(slot_words[index])
    return f"{meta.template_id}:{'|'.join(across_words)}/{'|'.join(down_words)}"


def solve_template(
    meta: TemplateMeta,
    seed: int,
    theme_id: str,
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
    entries_by_answer: Dict[str, EntryMeta],
    enforce_themed_range: bool,
    allow_hard_words: bool,
) -> Optional[List[str]]:
    rand = mulberry32(seed)
    size = len(meta.rows)
    grid: List[List[str]] = [
        ["#" if meta.blocks[r][c] else "" for c in range(size)] for r in range(size)
    ]
    used_words: Set[str] = set()
    assigned: List[Optional[str]] = [None] * len(meta.slots)

    def pattern_for_slot(slot: Slot) -> str:
        chars = []
        for r, c in slot.cells:
            value = grid[r][c]
            chars.append(value if value else ".")
        return "".join(chars)

    def prefix_valid_for_unassigned() -> bool:
        for slot_index, slot in enumerate(meta.slots):
            if assigned[slot_index] is not None:
                continue
            pattern = pattern_for_slot(slot)
            prefix_len = 0
            while prefix_len < len(pattern) and pattern[prefix_len] != ".":
                prefix_len += 1
            if prefix_len == 0:
                continue
            prefix = pattern[:prefix_len]
            if prefix not in prefix_index[(slot.length, prefix_len)]:
                return False
        return True

    def themed_count() -> int:
        count = 0
        for word in assigned:
            if not word:
                continue
            if theme_id in entries_by_answer[word].theme_tags:
                count += 1
        return count

    def final_constraints_hold() -> bool:
        across_words: List[str] = []
        down_words: List[str] = []
        for index, slot in enumerate(meta.slots):
            word = assigned[index]
            if word is None:
                return False
            if word not in word_set_by_length[slot.length]:
                return False
            if slot.direction == "across":
                across_words.append(word)
            else:
                down_words.append(word)

        if len(set(across_words)) != len(across_words):
            return False
        if len(set(down_words)) != len(down_words):
            return False
        if set(across_words) & set(down_words):
            return False

        if enforce_themed_range:
            count = themed_count()
            if count < THEMED_SLOT_MIN or count > THEMED_SLOT_MAX:
                return False
        return True

    def recurse() -> bool:
        if all(word is not None for word in assigned):
            return final_constraints_hold()

        best_slot_index: Optional[int] = None
        best_candidates: Optional[List[str]] = None

        for slot_index, slot in enumerate(meta.slots):
            if assigned[slot_index] is not None:
                continue
            pattern = pattern_for_slot(slot)
            candidates = get_candidates(
                slot.length,
                pattern,
                used_words,
                words_by_length,
                position_index,
            )
            if not candidates:
                return False
            if best_candidates is None or len(candidates) < len(best_candidates):
                best_slot_index = slot_index
                best_candidates = candidates

        if best_slot_index is None or best_candidates is None:
            return False

        slot = meta.slots[best_slot_index]
        candidate_pool = best_candidates
        if not allow_hard_words:
            non_hard = [
                word
                for word in best_candidates
                if entries_by_answer[word].difficulty in ("easy", "medium")
            ]
            if not non_hard:
                return False
            candidate_pool = non_hard
        ranked = shuffle(candidate_pool, rand)

        for candidate in ranked[:MAX_CANDIDATES_PER_SLOT]:
            assigned_count = sum(1 for word in assigned if word is not None)
            current_theme_count = themed_count()
            candidate_theme_increment = 1 if theme_id in entries_by_answer[candidate].theme_tags else 0
            next_theme_count = current_theme_count + candidate_theme_increment
            remaining_slots = len(assigned) - (assigned_count + 1)

            if enforce_themed_range:
                if next_theme_count > THEMED_SLOT_MAX:
                    continue
                if next_theme_count + remaining_slots < THEMED_SLOT_MIN:
                    continue

            assigned[best_slot_index] = candidate
            used_words.add(candidate)
            touched: List[Tuple[int, int]] = []

            is_conflict = False
            for idx, (r, c) in enumerate(slot.cells):
                letter = candidate[idx]
                existing = grid[r][c]
                if existing and existing != letter:
                    is_conflict = True
                    break
                if not existing:
                    grid[r][c] = letter
                    touched.append((r, c))

            if not is_conflict and prefix_valid_for_unassigned() and recurse():
                return True

            for r, c in touched:
                grid[r][c] = ""
            used_words.remove(candidate)
            assigned[best_slot_index] = None

        return False

    solved = recurse()
    if not solved:
        return None

    return [word for word in assigned if word is not None]


def choose_bonus_answer(
    theme_id: str,
    seed: int,
    bonus_by_theme: Dict[str, List[BonusWord]],
) -> str:
    options = bonus_by_theme.get(theme_id, [])
    if not options:
        raise ValueError(f"No bonus options configured for theme '{theme_id}'")
    index = ((seed % len(options)) + len(options)) % len(options)
    return options[index].answer


def is_quality_fill_word(word: str, entry: EntryMeta) -> bool:
    if entry.is_modern or entry.theme_tags:
        return True
    z = zipf_frequency(word.lower(), "en")
    if len(word) == 3:
        return z >= 3.1
    if len(word) == 5:
        return z >= 3.5
    return True


def main():
    if not BANK_PATH.exists():
        raise SystemExit(f"Bank file not found: {BANK_PATH}")

    payload = json.loads(BANK_PATH.read_text())
    templates = payload.get("templates", [])
    entries_payload = payload.get("entries", [])
    themes_payload = payload.get("themes", [])
    bonus_payload = payload.get("bonusWords", [])

    if not templates or not entries_payload:
        raise SystemExit("miniCrosswordBank.json is missing templates or entries")
    if not themes_payload:
        raise SystemExit("miniCrosswordBank.json is missing themes")
    if not bonus_payload:
        raise SystemExit("miniCrosswordBank.json is missing bonusWords")

    entries_by_answer: Dict[str, EntryMeta] = {}
    words_by_length: Dict[int, List[str]] = {}

    for raw in entries_payload:
        answer = str(raw["answer"]).upper()
        clue_options = tuple(str(c) for c in raw.get("clueOptions", []) if str(c).strip())
        if not answer.isalpha():
            continue
        if len(answer) not in (3, 5):
            continue
        if not clue_options:
            continue
        entry = EntryMeta(
            answer=answer,
            clue_options=clue_options,
            difficulty=str(raw.get("difficulty", "medium")),
            theme_tags=tuple(str(tag) for tag in raw.get("themeTags", [])),
            is_modern=bool(raw.get("isModern", False)),
        )
        entries_by_answer[answer] = entry
        words_by_length.setdefault(len(answer), []).append(answer)

    for length in list(words_by_length.keys()):
        words_by_length[length] = sorted(set(words_by_length[length]))

    (
        word_set_by_length,
        position_index,
        prefix_index,
    ) = build_indexes(words_by_length)

    theme_ids = [str(theme["id"]) for theme in themes_payload]
    bonus_by_theme: Dict[str, List[BonusWord]] = {}
    for raw in bonus_payload:
        answer = str(raw["answer"]).upper()
        theme_id = str(raw["themeId"])
        bonus_by_theme.setdefault(theme_id, []).append(BonusWord(answer=answer, theme_id=theme_id))

    for theme_id in theme_ids:
        options = bonus_by_theme.get(theme_id, [])
        if not options:
            raise SystemExit(f"No bonus words configured for theme '{theme_id}'")
        bonus_by_theme[theme_id] = sorted(options, key=lambda item: item.answer)

    metas = [build_template_meta(template) for template in templates]

    unique_signatures: Set[str] = set()
    variants: List[Dict[str, object]] = []

    attempt = 0
    while len(variants) < TARGET_VARIANTS and attempt < MAX_ATTEMPTS:
        attempt += 1
        meta = metas[attempt % len(metas)]
        theme_id = theme_ids[(attempt - 1) % len(theme_ids)]
        seed = 1013904223 + attempt * 7919

        slot_words = solve_template(
            meta,
            seed,
            theme_id,
            words_by_length,
            word_set_by_length,
            position_index,
            prefix_index,
            entries_by_answer,
            enforce_themed_range=True,
            allow_hard_words=False,
        )
        if not slot_words:
            slot_words = solve_template(
                meta,
                seed,
                theme_id,
                words_by_length,
                word_set_by_length,
                position_index,
                prefix_index,
                entries_by_answer,
                enforce_themed_range=False,
                allow_hard_words=False,
            )
        if not slot_words:
            slot_words = solve_template(
                meta,
                seed,
                theme_id,
                words_by_length,
                word_set_by_length,
                position_index,
                prefix_index,
                entries_by_answer,
                enforce_themed_range=True,
                allow_hard_words=True,
            )
        if not slot_words:
            slot_words = solve_template(
                meta,
                seed,
                theme_id,
                words_by_length,
                word_set_by_length,
                position_index,
                prefix_index,
                entries_by_answer,
                enforce_themed_range=False,
                allow_hard_words=True,
            )

        if not slot_words:
            continue

        hard_count = sum(
            1 for word in slot_words if entries_by_answer[word].difficulty == "hard"
        )
        if hard_count > 1:
            continue

        if any(
            not is_quality_fill_word(word, entries_by_answer[word])
            for word in slot_words
        ):
            continue

        signature = make_signature(meta, slot_words)
        if signature in unique_signatures:
            continue

        bonus_answer = choose_bonus_answer(theme_id, seed, bonus_by_theme)

        unique_signatures.add(signature)
        variants.append(
            {
                "templateId": meta.template_id,
                "seed": seed,
                "themeId": theme_id,
                "bonusAnswer": bonus_answer,
                "signature": signature,
            }
        )

    if len(variants) < MIN_REQUIRED_VARIANTS:
        raise SystemExit(
            f"Only generated {len(variants)} variants (minimum required: {MIN_REQUIRED_VARIANTS})"
        )
    if len(variants) < TARGET_VARIANTS:
        raise SystemExit(
            f"Only generated {len(variants)} variants (target required: {TARGET_VARIANTS})"
        )

    lines = [
        "// Auto-generated by scripts/build_mini_crossword_variants.py",
        "export interface MiniCrosswordVariantSeed {",
        "  templateId: string;",
        "  seed: number;",
        "  themeId: string;",
        "  bonusAnswer: string;",
        "  signature: string;",
        "}",
        "",
        "export const MINI_CROSSWORD_VARIANT_SEEDS: MiniCrosswordVariantSeed[] = [",
    ]
    for variant in variants:
        signature = str(variant["signature"]).replace("\\", "\\\\").replace("'", "\\'")
        lines.append(
            "  { "
            f"templateId: '{variant['templateId']}', "
            f"seed: {variant['seed']}, "
            f"themeId: '{variant['themeId']}', "
            f"bonusAnswer: '{variant['bonusAnswer']}', "
            f"signature: '{signature}' "
            "},"
        )
    lines.append("];")
    lines.append("")

    OUTPUT_PATH.write_text("\n".join(lines))

    theme_distribution = {theme_id: 0 for theme_id in theme_ids}
    for variant in variants:
        theme_distribution[str(variant["themeId"])] += 1

    print(f"Wrote {OUTPUT_PATH} with {len(variants)} variants after {attempt} attempts.")
    print("Theme distribution:", theme_distribution)


if __name__ == "__main__":
    main()
