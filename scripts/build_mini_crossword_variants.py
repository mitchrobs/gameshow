#!/usr/bin/env python3
"""Build deterministic mini-crossword variant seeds.

This script solves template grids using a deterministic seeded backtracking
solver and writes the first 400 unique variants to a TypeScript seed file.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

BASE_DIR = Path(__file__).resolve().parents[1]
BANK_PATH = BASE_DIR / "src" / "data" / "miniCrosswordBank.json"
OUTPUT_PATH = BASE_DIR / "src" / "data" / "miniCrosswordVariantSeeds.ts"

TARGET_VARIANTS = 400
MIN_REQUIRED_VARIANTS = 360
MAX_ATTEMPTS = 20000
MAX_CANDIDATES_PER_SLOT = 180


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
    return f"{meta.template_id}:{'|'.join(across_words)}/{ '|'.join(down_words) }"


def solve_template(
    meta: TemplateMeta,
    seed: int,
    words_by_length: Dict[int, List[str]],
    word_set_by_length: Dict[int, Set[str]],
    position_index: Dict[int, List[Dict[str, Set[str]]]],
    prefix_index: Dict[Tuple[int, int], Set[str]],
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
            candidates = shuffle(candidates, rand)
            if best_candidates is None or len(candidates) < len(best_candidates):
                best_slot_index = slot_index
                best_candidates = candidates

        if best_slot_index is None or best_candidates is None:
            return False

        slot = meta.slots[best_slot_index]
        for candidate in best_candidates[:MAX_CANDIDATES_PER_SLOT]:
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


def main():
    if not BANK_PATH.exists():
        raise SystemExit(f"Bank file not found: {BANK_PATH}")

    payload = json.loads(BANK_PATH.read_text())
    templates = payload.get("templates", [])
    entries = payload.get("entries", [])
    if not templates or not entries:
        raise SystemExit("miniCrosswordBank.json is missing templates or entries")

    words_by_length: Dict[int, List[str]] = {}
    for entry in entries:
        answer = str(entry["answer"]).upper()
        words_by_length.setdefault(len(answer), []).append(answer)
    for length in list(words_by_length.keys()):
        words_by_length[length] = sorted(set(words_by_length[length]))

    (
        word_set_by_length,
        position_index,
        prefix_index,
    ) = build_indexes(words_by_length)

    metas = [build_template_meta(template) for template in templates]

    unique_signatures: Set[str] = set()
    variants: List[Dict[str, object]] = []

    attempt = 0
    while len(variants) < TARGET_VARIANTS and attempt < MAX_ATTEMPTS:
        attempt += 1
        meta = metas[attempt % len(metas)]
        seed = 1013904223 + attempt * 7919
        slot_words = solve_template(
            meta,
            seed,
            words_by_length,
            word_set_by_length,
            position_index,
            prefix_index,
        )
        if not slot_words:
            continue
        signature = make_signature(meta, slot_words)
        if signature in unique_signatures:
            continue
        unique_signatures.add(signature)
        variants.append(
            {
                "templateId": meta.template_id,
                "seed": seed,
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
        "  signature: string;",
        "}",
        "",
        "export const MINI_CROSSWORD_VARIANT_SEEDS: MiniCrosswordVariantSeed[] = [",
    ]
    for variant in variants:
        signature = str(variant["signature"]).replace("\\", "\\\\").replace("'", "\\'")
        lines.append(
            f"  {{ templateId: '{variant['templateId']}', seed: {variant['seed']}, signature: '{signature}' }},"
        )
    lines.append("];")
    lines.append("")

    OUTPUT_PATH.write_text("\n".join(lines))
    print(
        f"Wrote {OUTPUT_PATH} with {len(variants)} variants after {attempt} attempts."
    )


if __name__ == "__main__":
    main()
