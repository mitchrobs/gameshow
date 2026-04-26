#!/usr/bin/env python3
"""Build and audit the Mini Sudoku 365-day pack."""

from __future__ import annotations

import argparse
import json
import math
import random
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable

BASE_DIR = Path(__file__).resolve().parents[1]
PACK_PATH = BASE_DIR / "src" / "data" / "sudoku" / "pack.json"

START_DATE = "2026-04-24"
PACK_LENGTH = 365
ONBOARDING_DAYS = 28

DIFFICULTIES = ("Easy", "Medium", "Hard")
FAMILIES = ("ring", "cross", "diagonal", "pinwheel", "banded", "scatter")
SYMMETRIES = ("rotational", "mirror-h", "mirror-v", "diagonal", "anti-diagonal", "none")
VARIANT_IDS = ("a", "b", "c", "d", "e", "f")
DIFFICULTY_FAMILY_GAP = 7

TOTALS = {"Easy": 96, "Medium": 191, "Hard": 78}
ONBOARDING_TOTALS = {"Easy": 12, "Medium": 14, "Hard": 2}

WINDOW_14_MIN = {"Easy": 2, "Medium": 6, "Hard": 2}
WINDOW_14_MAX = {"Easy": 5, "Medium": 9, "Hard": 4}

ONBOARDING_BLOCK = (
    "Easy",
    "Medium",
    "Easy",
    "Medium",
    "Easy",
    "Medium",
    "Hard",
    "Medium",
    "Easy",
    "Medium",
    "Easy",
    "Medium",
    "Easy",
    "Medium",
)

REMAINDER_BLOCKS = {
    "A": (
        "Medium",
        "Easy",
        "Medium",
        "Hard",
        "Medium",
        "Easy",
        "Medium",
        "Medium",
        "Hard",
        "Easy",
        "Medium",
        "Medium",
        "Hard",
        "Easy",
    ),
    "B": (
        "Medium",
        "Easy",
        "Medium",
        "Hard",
        "Medium",
        "Medium",
        "Easy",
        "Medium",
        "Hard",
        "Medium",
        "Easy",
        "Medium",
        "Hard",
        "Medium",
    ),
    "C": (
        "Medium",
        "Hard",
        "Easy",
        "Medium",
        "Medium",
        "Hard",
        "Easy",
        "Medium",
        "Hard",
        "Medium",
        "Easy",
        "Medium",
        "Hard",
        "Medium",
    ),
}

RULE_ORDER = (
    "naked_singles",
    "hidden_singles",
    "box_line_reduction",
    "pointing_claiming",
    "locked_candidates",
    "naked_pairs",
    "hidden_pairs",
)

RULE_WEIGHTS = {
    "naked_singles": 1,
    "hidden_singles": 2,
    "box_line_reduction": 3,
    "pointing_claiming": 4,
    "locked_candidates": 4,
    "naked_pairs": 6,
    "hidden_pairs": 7,
}


@dataclass(frozen=True)
class SudokuSpec:
    difficulty: str
    size: int
    box_rows: int
    box_cols: int

    @property
    def digits(self) -> tuple[int, ...]:
        return tuple(range(1, self.size + 1))

    @property
    def cell_count(self) -> int:
        return self.size * self.size


@dataclass
class HumanAnalysis:
    solved: bool
    contradiction: bool
    opening_progress: bool
    stalled_passes: int
    passes: int
    used_advanced_rule: bool
    difficulty_score: int
    rule_counts: dict[str, int]


@dataclass
class CandidateEntry:
    difficulty: str
    pattern_family: str
    symmetry_id: str
    mask_slug: str
    givens: int
    difficulty_score: int
    signature: str
    puzzle: dict


SPECS = {
    "Easy": SudokuSpec(difficulty="Easy", size=6, box_rows=2, box_cols=3),
    "Medium": SudokuSpec(difficulty="Medium", size=6, box_rows=2, box_cols=3),
    "Hard": SudokuSpec(difficulty="Hard", size=9, box_rows=3, box_cols=3),
}

GIVEN_RANGES = {
    "Easy": (18, 19),
    "Medium": (14, 15),
    "Hard": (36, 40),
}

MIN_ROW_GIVENS = {"Easy": 2, "Medium": 1, "Hard": 2}
MIN_COL_GIVENS = {"Easy": 2, "Medium": 1, "Hard": 2}
MIN_BOX_GIVENS = {"Easy": 2, "Medium": 1, "Hard": 2}


def parse_date(value: str) -> date:
    return date.fromisoformat(value)


def date_range(start: date, days: int) -> Iterable[date]:
    cursor = start
    for _ in range(days):
        yield cursor
        cursor += timedelta(days=1)


def cell_index(spec: SudokuSpec, row: int, col: int) -> int:
    return row * spec.size + col


def index_to_cell(spec: SudokuSpec, index: int) -> tuple[int, int]:
    return divmod(index, spec.size)


def build_base_grid(spec: SudokuSpec) -> list[list[int]]:
    return [
        [((row % spec.box_rows) * spec.box_cols + row // spec.box_rows + col) % spec.size + 1 for col in range(spec.size)]
        for row in range(spec.size)
    ]


def shuffle_grouped(group_size: int, group_count: int, rng: random.Random) -> list[int]:
    groups = list(range(group_count))
    rng.shuffle(groups)
    order: list[int] = []
    for group in groups:
        inner = list(range(group_size))
        rng.shuffle(inner)
        order.extend(group * group_size + offset for offset in inner)
    return order


def generate_solution(spec: SudokuSpec, rng: random.Random) -> tuple[list[list[int]], dict[str, list[int]]]:
    base = build_base_grid(spec)
    row_order = shuffle_grouped(spec.box_rows, spec.size // spec.box_rows, rng)
    col_order = shuffle_grouped(spec.box_cols, spec.size // spec.box_cols, rng)
    digit_order = list(spec.digits)
    rng.shuffle(digit_order)

    solution = [
        [digit_order[base[row_order[row]][col_order[col]] - 1] for col in range(spec.size)]
        for row in range(spec.size)
    ]
    return solution, {"row_order": row_order, "col_order": col_order, "digit_order": digit_order}


def clone_grid(grid: list[list[int]]) -> list[list[int]]:
    return [row[:] for row in grid]


def box_index(spec: SudokuSpec, row: int, col: int) -> int:
    return (row // spec.box_rows) * (spec.size // spec.box_cols) + (col // spec.box_cols)


def bit_count(mask: int) -> int:
    return mask.bit_count()


def solve_count(grid: list[list[int]], spec: SudokuSpec, limit: int = 2) -> int:
    full_mask = (1 << spec.size) - 1
    row_used = [0] * spec.size
    col_used = [0] * spec.size
    box_used = [0] * spec.size
    empties: list[tuple[int, int]] = []

    for row in range(spec.size):
        for col in range(spec.size):
            value = grid[row][col]
            if value == 0:
                empties.append((row, col))
                continue
            bit = 1 << (value - 1)
            box = box_index(spec, row, col)
            if row_used[row] & bit or col_used[col] & bit or box_used[box] & bit:
                return 0
            row_used[row] |= bit
            col_used[col] |= bit
            box_used[box] |= bit

    solutions = 0

    def search() -> None:
        nonlocal solutions
        if solutions >= limit:
            return

        best_pos = -1
        best_mask = 0
        best_count = 99
        for pos, (row, col) in enumerate(empties):
            if grid[row][col] != 0:
                continue
            mask = full_mask & ~(row_used[row] | col_used[col] | box_used[box_index(spec, row, col)])
            if mask == 0:
                return
            count = bit_count(mask)
            if count < best_count:
                best_pos = pos
                best_mask = mask
                best_count = count
                if count == 1:
                    break

        if best_pos == -1:
            solutions += 1
            return

        row, col = empties[best_pos]
        box = box_index(spec, row, col)
        mask = best_mask
        while mask and solutions < limit:
            bit = mask & -mask
            digit = bit.bit_length()
            grid[row][col] = digit
            row_used[row] |= bit
            col_used[col] |= bit
            box_used[box] |= bit
            search()
            grid[row][col] = 0
            row_used[row] &= ~bit
            col_used[col] &= ~bit
            box_used[box] &= ~bit
            mask &= mask - 1

    search()
    return solutions


def build_units(spec: SudokuSpec) -> tuple[list[list[int]], list[set[int]], list[list[int]], list[list[int]], list[list[int]]]:
    row_units = [[cell_index(spec, row, col) for col in range(spec.size)] for row in range(spec.size)]
    col_units = [[cell_index(spec, row, col) for row in range(spec.size)] for col in range(spec.size)]
    box_units: list[list[int]] = []
    for box_row in range(0, spec.size, spec.box_rows):
        for box_col in range(0, spec.size, spec.box_cols):
            box_units.append(
                [
                    cell_index(spec, box_row + row_offset, box_col + col_offset)
                    for row_offset in range(spec.box_rows)
                    for col_offset in range(spec.box_cols)
                ]
            )
    units = row_units + col_units + box_units
    peers: list[set[int]] = []
    for index in range(spec.cell_count):
        row, col = index_to_cell(spec, index)
        peer_set = set(row_units[row]) | set(col_units[col]) | set(box_units[box_index(spec, row, col)])
        peer_set.discard(index)
        peers.append(peer_set)
    return units, peers, row_units, col_units, box_units


UNITS_BY_SPEC = {name: build_units(spec) for name, spec in SPECS.items()}


def initialize_candidates(grid: list[list[int]], spec: SudokuSpec) -> tuple[list[int], list[int], bool]:
    full_mask = (1 << spec.size) - 1
    values = [0] * spec.cell_count
    candidates = [full_mask] * spec.cell_count
    units, peers, _, _, _ = UNITS_BY_SPEC[spec.difficulty]
    del units

    for row in range(spec.size):
        for col in range(spec.size):
            index = cell_index(spec, row, col)
            value = grid[row][col]
            if value == 0:
                continue
            bit = 1 << (value - 1)
            if values[index] not in (0, value):
                return values, candidates, True
            values[index] = value
            candidates[index] = 0
            for peer in peers[index]:
                if values[peer] == value:
                    return values, candidates, True

    row_used = [0] * spec.size
    col_used = [0] * spec.size
    box_used = [0] * spec.size
    for row in range(spec.size):
        for col in range(spec.size):
            value = grid[row][col]
            if value == 0:
                continue
            bit = 1 << (value - 1)
            row_used[row] |= bit
            col_used[col] |= bit
            box_used[box_index(spec, row, col)] |= bit
    for row in range(spec.size):
        for col in range(spec.size):
            if grid[row][col] != 0:
                continue
            index = cell_index(spec, row, col)
            mask = full_mask & ~(row_used[row] | col_used[col] | box_used[box_index(spec, row, col)])
            if mask == 0:
                return values, candidates, True
            candidates[index] = mask
    return values, candidates, False


def assign_value(values: list[int], candidates: list[int], spec: SudokuSpec, index: int, digit: int) -> bool:
    units, peers, _, _, _ = UNITS_BY_SPEC[spec.difficulty]
    del units
    current = values[index]
    if current == digit:
        return True
    if current != 0 and current != digit:
        return False
    bit = 1 << (digit - 1)
    values[index] = digit
    candidates[index] = 0
    for peer in peers[index]:
        if values[peer] == digit:
            return False
        if values[peer] == 0 and candidates[peer] & bit:
            candidates[peer] &= ~bit
            if candidates[peer] == 0:
                return False
    return True


def apply_naked_singles(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    progress = False
    for index, value in enumerate(values):
        if value != 0:
            continue
        mask = candidates[index]
        if bit_count(mask) != 1:
            continue
        digit = mask.bit_length()
        if not assign_value(values, candidates, spec, index, digit):
            return progress, True
        progress = True
    return progress, False


def apply_hidden_singles(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    units, _, _, _, _ = UNITS_BY_SPEC[spec.difficulty]
    progress = False
    for unit in units:
        for digit in spec.digits:
            bit = 1 << (digit - 1)
            slots = [index for index in unit if values[index] == 0 and candidates[index] & bit]
            if len(slots) != 1:
                continue
            if not assign_value(values, candidates, spec, slots[0], digit):
                return progress, True
            progress = True
    return progress, False


def apply_box_line_reduction(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    _, _, row_units, col_units, box_units = UNITS_BY_SPEC[spec.difficulty]
    progress = False
    for box_unit in box_units:
        for digit in spec.digits:
            bit = 1 << (digit - 1)
            cells = [index for index in box_unit if values[index] == 0 and candidates[index] & bit]
            if len(cells) < 2:
                continue
            rows = {index_to_cell(spec, index)[0] for index in cells}
            cols = {index_to_cell(spec, index)[1] for index in cells}
            if len(rows) == 1:
                row = next(iter(rows))
                for peer in row_units[row]:
                    if peer in box_unit or values[peer] != 0 or not candidates[peer] & bit:
                        continue
                    candidates[peer] &= ~bit
                    if candidates[peer] == 0:
                        return progress, True
                    progress = True
            if len(cols) == 1:
                col = next(iter(cols))
                for peer in col_units[col]:
                    if peer in box_unit or values[peer] != 0 or not candidates[peer] & bit:
                        continue
                    candidates[peer] &= ~bit
                    if candidates[peer] == 0:
                        return progress, True
                    progress = True
    return progress, False


def apply_pointing_claiming(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    _, _, row_units, col_units, box_units = UNITS_BY_SPEC[spec.difficulty]
    progress = False
    for units in (row_units, col_units):
        for unit in units:
            for digit in spec.digits:
                bit = 1 << (digit - 1)
                cells = [index for index in unit if values[index] == 0 and candidates[index] & bit]
                if len(cells) < 2:
                    continue
                boxes = {box_index(spec, *index_to_cell(spec, index)) for index in cells}
                if len(boxes) != 1:
                    continue
                box = next(iter(boxes))
                for peer in box_units[box]:
                    if peer in unit or values[peer] != 0 or not candidates[peer] & bit:
                        continue
                    candidates[peer] &= ~bit
                    if candidates[peer] == 0:
                        return progress, True
                    progress = True
    return progress, False


def apply_locked_candidates(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    # The explicit line/box interactions are handled by the two preceding rules.
    # Keep this rule in the ordered pipeline so the solver report matches the product spec.
    return False, False


def apply_naked_pairs(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    units, _, _, _, _ = UNITS_BY_SPEC[spec.difficulty]
    progress = False
    for unit in units:
        pair_cells: dict[int, list[int]] = defaultdict(list)
        for index in unit:
            if values[index] != 0:
                continue
            mask = candidates[index]
            if bit_count(mask) == 2:
                pair_cells[mask].append(index)
        for mask, cells in pair_cells.items():
            if len(cells) != 2:
                continue
            for peer in unit:
                if peer in cells or values[peer] != 0 or not (candidates[peer] & mask):
                    continue
                candidates[peer] &= ~mask
                if candidates[peer] == 0:
                    return progress, True
                progress = True
    return progress, False


def apply_hidden_pairs(values: list[int], candidates: list[int], spec: SudokuSpec) -> tuple[bool, bool]:
    units, _, _, _, _ = UNITS_BY_SPEC[spec.difficulty]
    progress = False
    digits = spec.digits
    for unit in units:
        digit_cells: dict[int, set[int]] = {}
        for digit in digits:
            bit = 1 << (digit - 1)
            cells = {index for index in unit if values[index] == 0 and candidates[index] & bit}
            if 1 <= len(cells) <= 2:
                digit_cells[digit] = cells
        for left_idx, left_digit in enumerate(digits):
            left_cells = digit_cells.get(left_digit)
            if not left_cells or len(left_cells) != 2:
                continue
            for right_digit in digits[left_idx + 1 :]:
                right_cells = digit_cells.get(right_digit)
                if right_cells != left_cells or not right_cells:
                    continue
                pair_mask = (1 << (left_digit - 1)) | (1 << (right_digit - 1))
                for cell in left_cells:
                    if candidates[cell] == pair_mask:
                        continue
                    candidates[cell] &= pair_mask
                    if candidates[cell] == 0:
                        return progress, True
                    progress = True
    return progress, False


RULE_FUNCS = {
    "naked_singles": apply_naked_singles,
    "hidden_singles": apply_hidden_singles,
    "box_line_reduction": apply_box_line_reduction,
    "pointing_claiming": apply_pointing_claiming,
    "locked_candidates": apply_locked_candidates,
    "naked_pairs": apply_naked_pairs,
    "hidden_pairs": apply_hidden_pairs,
}


def analyze_human(grid: list[list[int]], spec: SudokuSpec) -> HumanAnalysis:
    values, candidates, contradiction = initialize_candidates(grid, spec)
    rule_counts = {rule: 0 for rule in RULE_ORDER}
    if contradiction:
        return HumanAnalysis(
            solved=False,
            contradiction=True,
            opening_progress=False,
            stalled_passes=0,
            passes=0,
            used_advanced_rule=False,
            difficulty_score=0,
            rule_counts=rule_counts,
        )

    passes = 0
    opening_progress = False
    stalled_passes = 0

    while True:
        if all(value != 0 for value in values):
            break
        passes += 1
        progress = False
        for rule in RULE_ORDER:
            changed, contradiction = RULE_FUNCS[rule](values, candidates, spec)
            if contradiction:
                return HumanAnalysis(
                    solved=False,
                    contradiction=True,
                    opening_progress=opening_progress,
                    stalled_passes=stalled_passes,
                    passes=passes,
                    used_advanced_rule=False,
                    difficulty_score=0,
                    rule_counts=rule_counts,
                )
            if changed:
                progress = True
                rule_counts[rule] += 1
                if passes <= 2:
                    opening_progress = True
                break
        if not progress:
            stalled_passes += 1
            break

    solved = all(value != 0 for value in values)
    advanced_count = sum(rule_counts[rule] for rule in ("box_line_reduction", "pointing_claiming", "naked_pairs", "hidden_pairs"))
    givens = sum(1 for row in grid for value in row if value != 0)
    difficulty_score = (
        (70 if spec.size == 9 else 18)
        + max(0, (42 - givens) if spec.size == 9 else (22 - givens)) * 2
        + passes * 2
        + sum(RULE_WEIGHTS[rule] * count for rule, count in rule_counts.items())
    )
    return HumanAnalysis(
        solved=solved,
        contradiction=False,
        opening_progress=opening_progress,
        stalled_passes=stalled_passes,
        passes=passes,
        used_advanced_rule=advanced_count > 0,
        difficulty_score=difficulty_score,
        rule_counts=rule_counts,
    )


def classify_analysis(spec: SudokuSpec, givens: int, analysis: HumanAnalysis) -> str | None:
    if not analysis.solved or analysis.contradiction or not analysis.opening_progress or analysis.stalled_passes > 3:
        return None
    if spec.size == 9:
        if analysis.passes < 5 and not analysis.used_advanced_rule:
            return None
        return "Hard"
    if givens >= 18 and analysis.rule_counts["hidden_pairs"] == 0 and analysis.passes <= 12:
        return "Easy"
    return "Medium"


def symmetry_group(spec: SudokuSpec, row: int, col: int, symmetry: str) -> tuple[tuple[int, int], ...]:
    size = spec.size
    points = {(row, col)}
    if symmetry == "rotational":
        points.add((size - 1 - row, size - 1 - col))
    elif symmetry == "mirror-h":
        points.add((size - 1 - row, col))
    elif symmetry == "mirror-v":
        points.add((row, size - 1 - col))
    elif symmetry == "diagonal":
        points.add((col, row))
    elif symmetry == "anti-diagonal":
        points.add((size - 1 - col, size - 1 - row))
    return tuple(sorted(points))


def build_symmetry_groups(spec: SudokuSpec, symmetry: str) -> list[tuple[tuple[int, int], ...]]:
    seen: set[tuple[tuple[int, int], ...]] = set()
    groups: list[tuple[tuple[int, int], ...]] = []
    for row in range(spec.size):
        for col in range(spec.size):
            group = symmetry_group(spec, row, col, symmetry)
            if group in seen:
                continue
            seen.add(group)
            groups.append(group)
    return groups


def family_preserve_score(spec: SudokuSpec, family: str, variant_index: int, row: int, col: int) -> float:
    center = (spec.size - 1) / 2
    if center == 0:
        return 0.0
    dx = abs(col - center) / center
    dy = abs(row - center) / center
    edge = max(dx, dy)
    diag_main = abs(row - col) / max(1, spec.size - 1)
    diag_anti = abs((row + col) - (spec.size - 1)) / max(1, spec.size - 1)
    if family == "ring":
        return edge * 2.3 + min(dx, dy) * 0.3
    if family == "cross":
        return (1.8 - min(dx, dy)) + (0.2 if variant_index % 2 == 0 else -0.1) * (1 - abs(dx - dy))
    if family == "diagonal":
        target = min(diag_main, diag_anti if variant_index % 2 == 0 else max(diag_main, diag_anti))
        return 1.8 - target * 2.2
    if family == "pinwheel":
        anchors = [
            (0.2 * center, 0.8 * center),
            (0.8 * center, 1.8 * center),
            (1.8 * center, 1.2 * center),
            (1.2 * center, 0.2 * center),
        ]
        ax, ay = anchors[variant_index % len(anchors)]
        distance = math.hypot(col - ax, row - ay) / max(1.0, spec.size)
        return 1.6 - distance * 2.4 + edge * 0.2
    if family == "banded":
        row_band = 1.0 - ((row % spec.box_rows) / max(1, spec.box_rows - 1)) if spec.box_rows > 1 else 1.0
        col_band = 1.0 - ((col % spec.box_cols) / max(1, spec.box_cols - 1)) if spec.box_cols > 1 else 1.0
        return row_band + col_band + (0.25 if variant_index % 2 == 0 else 0.0)
    seed = (row + 1) * 31 + (col + 1) * 17 + variant_index * 13 + spec.size * 7
    rng = random.Random(seed)
    return 0.8 + rng.random() * 0.7 - abs(dx - dy) * 0.2


def group_priority(spec: SudokuSpec, family: str, variant_index: int, group: tuple[tuple[int, int], ...], rng: random.Random) -> float:
    preserve = sum(family_preserve_score(spec, family, variant_index, row, col) for row, col in group) / len(group)
    return preserve + rng.random() * 0.18


def can_remove_group(
    puzzle: list[list[int]],
    spec: SudokuSpec,
    group: tuple[tuple[int, int], ...],
    target_min: int,
) -> bool:
    row_counts = [sum(1 for value in row if value != 0) for row in puzzle]
    col_counts = [sum(1 for row in range(spec.size) if puzzle[row][col] != 0) for col in range(spec.size)]
    box_counts = [0] * spec.size
    for row in range(spec.size):
        for col in range(spec.size):
            if puzzle[row][col] == 0:
                continue
            box_counts[box_index(spec, row, col)] += 1

    givens = sum(1 for row in puzzle for value in row if value != 0)
    if givens - len(group) < target_min:
        return False

    for row, col in group:
        if row_counts[row] - 1 < MIN_ROW_GIVENS[spec.difficulty]:
            return False
        if col_counts[col] - 1 < MIN_COL_GIVENS[spec.difficulty]:
            return False
        if box_counts[box_index(spec, row, col)] - 1 < MIN_BOX_GIVENS[spec.difficulty]:
            return False
    return True


def canonical_signature(grid: list[list[int]], transform: dict[str, list[int]], spec: SudokuSpec) -> str:
    canonical = [[0] * spec.size for _ in range(spec.size)]
    inverse_digit = {actual: index + 1 for index, actual in enumerate(transform["digit_order"])}
    row_order = transform["row_order"]
    col_order = transform["col_order"]
    for row in range(spec.size):
        for col in range(spec.size):
            canonical[row_order[row]][col_order[col]] = inverse_digit.get(grid[row][col], 0)
    flattened = "".join("".join(str(value) for value in row) for row in canonical)
    return f"{spec.size}:{flattened}"


def build_candidate(spec: SudokuSpec, family: str, target_index: int, rng: random.Random) -> CandidateEntry | None:
    symmetry = SYMMETRIES[target_index % len(SYMMETRIES)]
    variant_index = target_index % len(VARIANT_IDS)
    variant_id = VARIANT_IDS[variant_index]
    solution, transform = generate_solution(spec, rng)
    puzzle = clone_grid(solution)
    target_min, target_max = GIVEN_RANGES[spec.difficulty]
    groups = build_symmetry_groups(spec, symmetry)
    groups = sorted(groups, key=lambda group: group_priority(spec, family, variant_index, group, rng))

    for group in groups:
        if not can_remove_group(puzzle, spec, group, target_min):
            continue
        removed: list[tuple[int, int, int]] = []
        for row, col in group:
            if puzzle[row][col] == 0:
                continue
            removed.append((row, col, puzzle[row][col]))
            puzzle[row][col] = 0
        if not removed:
            continue
        if solve_count(clone_grid(puzzle), spec, limit=2) != 1:
            for row, col, value in removed:
                puzzle[row][col] = value

    givens = sum(1 for row in puzzle for value in row if value != 0)
    if not (target_min <= givens <= target_max):
        return None

    analysis = analyze_human(puzzle, spec)
    if classify_analysis(spec, givens, analysis) != spec.difficulty:
        return None

    digits = list(spec.digits)
    signature = canonical_signature(puzzle, transform, spec)
    mask_slug = f"{family}-{spec.size}x{spec.size}-{symmetry}-{variant_id}"
    puzzle_payload = {
        "id": f"{family}-{spec.difficulty.lower()}-{target_index + 1:03d}",
        "difficulty": spec.difficulty,
        "size": spec.size,
        "boxRows": spec.box_rows,
        "boxCols": spec.box_cols,
        "digits": digits,
        "grid": puzzle,
        "solution": solution,
    }
    return CandidateEntry(
        difficulty=spec.difficulty,
        pattern_family=family,
        symmetry_id=symmetry,
        mask_slug=mask_slug,
        givens=givens,
        difficulty_score=analysis.difficulty_score,
        signature=signature,
        puzzle=puzzle_payload,
    )


def build_candidate_pools(
    seed: int,
    pool_targets: dict[str, dict[str, int]],
) -> dict[tuple[str, str], list[CandidateEntry]]:
    pools: dict[tuple[str, str], list[CandidateEntry]] = {}
    global_signatures: set[str] = set()
    for difficulty in DIFFICULTIES:
        spec = SPECS[difficulty]
        for family in FAMILIES:
            target_count = pool_targets[difficulty][family]
            family_seed = seed + sum(ord(char) for char in f"{difficulty}:{family}") * 101
            family_rng = random.Random(family_seed)
            pool: list[CandidateEntry] = []
            local_signatures: set[str] = set()
            attempts = 0
            while len(pool) < target_count and attempts < target_count * 400:
                attempts += 1
                candidate = build_candidate(spec, family, attempts, family_rng)
                if candidate is None:
                    continue
                if candidate.signature in local_signatures or candidate.signature in global_signatures:
                    continue
                local_signatures.add(candidate.signature)
                global_signatures.add(candidate.signature)
                pool.append(candidate)
            if len(pool) < target_count:
                raise RuntimeError(
                    f"Only generated {len(pool)} accepted {difficulty}/{family} puzzles; expected {target_count}."
                )
            pools[(difficulty, family)] = pool
    return pools


def build_difficulty_schedule(seed: int) -> list[str]:
    del seed
    sequence = list(ONBOARDING_BLOCK) + list(ONBOARDING_BLOCK)
    remainder_pattern = ("A", "B", "A", "C", "A", "B")
    for _ in range(4):
        for key in remainder_pattern:
            sequence.extend(REMAINDER_BLOCKS[key])
    sequence.append("Medium")

    if len(sequence) != PACK_LENGTH:
        raise RuntimeError(f"Mini Sudoku difficulty schedule length {len(sequence)} did not match {PACK_LENGTH}.")

    counts = Counter(sequence)
    if any(counts[difficulty] != TOTALS[difficulty] for difficulty in DIFFICULTIES):
        raise RuntimeError(f"Mini Sudoku difficulty totals drifted: {counts}")

    onboarding = Counter(sequence[:ONBOARDING_DAYS])
    if any(onboarding[difficulty] != ONBOARDING_TOTALS[difficulty] for difficulty in DIFFICULTIES):
        raise RuntimeError(f"Mini Sudoku onboarding totals drifted: {onboarding}")

    return sequence


def build_family_schedule(difficulty_schedule: list[str], seed: int) -> list[str]:
    del seed
    adjacency = [set() for _ in range(len(difficulty_schedule))]
    for index, difficulty in enumerate(difficulty_schedule):
        for past in range(max(0, index - 4), index):
            adjacency[index].add(past)
            adjacency[past].add(index)
        for past in range(max(0, index - DIFFICULTY_FAMILY_GAP), index):
            if difficulty_schedule[past] != difficulty:
                continue
            adjacency[index].add(past)
            adjacency[past].add(index)

    colors: list[int | None] = [None] * len(difficulty_schedule)
    uncolored = set(range(len(difficulty_schedule)))
    neighbor_colors = [set() for _ in range(len(difficulty_schedule))]

    def choose_node() -> int:
        return max(
            uncolored,
            key=lambda node: (len(neighbor_colors[node]), len(adjacency[node])),
        )

    def search() -> bool:
        if not uncolored:
            return True
        node = choose_node()
        used = neighbor_colors[node]
        color_counts = Counter(color for color in colors if color is not None)
        valid_colors = sorted(
            (color for color in range(len(FAMILIES)) if color not in used),
            key=lambda color: (color_counts[color], color),
        )
        for color in valid_colors:
            colors[node] = color
            uncolored.remove(node)
            touched: list[int] = []
            for neighbor in adjacency[node]:
                if neighbor not in uncolored or color in neighbor_colors[neighbor]:
                    continue
                neighbor_colors[neighbor].add(color)
                touched.append(neighbor)
            if search():
                return True
            for neighbor in touched:
                neighbor_colors[neighbor].remove(color)
            uncolored.add(node)
            colors[node] = None
        return False

    if not search():
        raise RuntimeError("Could not build a Mini Sudoku family schedule.")
    return [FAMILIES[color] for color in colors if color is not None]


def pick_candidate(
    pool: list[CandidateEntry],
    used_signatures: set[str],
    recent_mask_slugs: list[str],
    symmetry_usage: dict[str, int],
) -> CandidateEntry:
    viable = [
        candidate
        for candidate in pool
        if candidate.signature not in used_signatures and candidate.mask_slug not in recent_mask_slugs
    ]
    if not viable:
        viable = [candidate for candidate in pool if candidate.signature not in used_signatures]
    if not viable:
        raise RuntimeError("Ran out of viable Mini Sudoku candidates during pack assembly.")
    viable.sort(
        key=lambda candidate: (
            symmetry_usage[candidate.symmetry_id],
            candidate.difficulty_score,
            candidate.mask_slug,
        )
    )
    return viable[0]


def build_pack(start_date: str, seed: int) -> tuple[list[dict], dict]:
    start = parse_date(start_date)
    difficulty_schedule = build_difficulty_schedule(seed)
    family_schedule = build_family_schedule(difficulty_schedule, seed)
    family_counts = {difficulty: Counter() for difficulty in DIFFICULTIES}
    for difficulty, family in zip(difficulty_schedule, family_schedule):
        family_counts[difficulty][family] += 1
    pool_targets = {
        difficulty: {
            family: max(24, family_counts[difficulty][family] + 4) for family in FAMILIES
        }
        for difficulty in DIFFICULTIES
    }
    pools = build_candidate_pools(seed, pool_targets)

    used_signatures: set[str] = set()
    mask_history: list[str] = []
    symmetry_usage = {difficulty: {symmetry: 0 for symmetry in SYMMETRIES} for difficulty in DIFFICULTIES}
    family_usage = {difficulty: Counter() for difficulty in DIFFICULTIES}
    pool_positions = {key: list(pool) for key, pool in pools.items()}
    entries: list[dict] = []

    for offset, current_date in enumerate(date_range(start, PACK_LENGTH)):
        difficulty = difficulty_schedule[offset]
        family = family_schedule[offset]
        candidate = pick_candidate(
            pool_positions[(difficulty, family)],
            used_signatures,
            mask_history[-21:],
            symmetry_usage[difficulty],
        )
        pool_positions[(difficulty, family)].remove(candidate)
        used_signatures.add(candidate.signature)
        mask_history.append(candidate.mask_slug)
        symmetry_usage[difficulty][candidate.symmetry_id] += 1
        family_usage[difficulty][family] += 1

        puzzle = json.loads(json.dumps(candidate.puzzle))
        puzzle["id"] = f"sudoku-{current_date.isoformat()}"
        entries.append(
            {
                "date": current_date.isoformat(),
                "difficulty": difficulty,
                "patternFamily": family,
                "symmetryId": candidate.symmetry_id,
                "maskSlug": candidate.mask_slug,
                "givens": candidate.givens,
                "difficultyScore": candidate.difficulty_score,
                "signature": candidate.signature,
                "source": "pack",
                "puzzle": puzzle,
            }
        )

    summary = audit_pack(entries, difficulty_schedule, family_schedule, pools)
    return entries, summary


def audit_pack(
    entries: list[dict],
    difficulty_schedule: list[str],
    family_schedule: list[str],
    pools: dict[tuple[str, str], list[CandidateEntry]],
) -> dict:
    difficulty_counts = Counter(entry["difficulty"] for entry in entries)
    onboarding_counts = Counter(entry["difficulty"] for entry in entries[:ONBOARDING_DAYS])
    family_counts = defaultdict(Counter)
    symmetry_counts = defaultdict(Counter)
    mask_recent: dict[str, int] = {}
    signature_set: set[str] = set()
    spacing_errors: list[str] = []

    for index, entry in enumerate(entries):
        difficulty = entry["difficulty"]
        family = entry["patternFamily"]
        family_counts[difficulty][family] += 1
        symmetry_counts[difficulty][entry["symmetryId"]] += 1
        signature = entry["signature"]
        if signature in signature_set:
            spacing_errors.append(f"duplicate signature on day {index + 1}")
        signature_set.add(signature)

        recent_families = family_schedule[max(0, index - 4) : index]
        if family in recent_families:
            spacing_errors.append(f"{family} repeated within 4 days at {entry['date']}")

        for past in range(max(0, index - DIFFICULTY_FAMILY_GAP), index):
            if difficulty_schedule[past] == difficulty and family_schedule[past] == family:
                spacing_errors.append(
                    f"{difficulty}/{family} repeated within {DIFFICULTY_FAMILY_GAP} days at {entry['date']}"
                )
                break

        if difficulty == "Hard" and difficulty_schedule[max(0, index - 1) : index] == ["Hard"]:
            spacing_errors.append(f"back-to-back hard at {entry['date']}")
        if difficulty_schedule[max(0, index - 6) : index + 1].count("Hard") > 2:
            spacing_errors.append(f"more than 2 hard puzzles in a 7-day window ending {entry['date']}")

        last_mask = mask_recent.get(entry["maskSlug"])
        if last_mask is not None and index - last_mask < 21:
            spacing_errors.append(f"mask {entry['maskSlug']} repeated too soon at {entry['date']}")
        mask_recent[entry["maskSlug"]] = index

    for index in range(ONBOARDING_DAYS, len(entries) - 13):
        window = entries[index : index + 14]
        counts = Counter(entry["difficulty"] for entry in window)
        for difficulty in DIFFICULTIES:
            if counts[difficulty] < WINDOW_14_MIN[difficulty] or counts[difficulty] > WINDOW_14_MAX[difficulty]:
                spacing_errors.append(f"14-day difficulty window out of range starting {window[0]['date']}")
                break

    candidate_counts = {
        difficulty: {family: len(pools[(difficulty, family)]) for family in FAMILIES} for difficulty in DIFFICULTIES
    }

    return {
        "difficultyCounts": dict(difficulty_counts),
        "onboardingCounts": dict(onboarding_counts),
        "familyCounts": {difficulty: dict(counts) for difficulty, counts in family_counts.items()},
        "symmetryCounts": {difficulty: dict(counts) for difficulty, counts in symmetry_counts.items()},
        "candidatePoolCounts": candidate_counts,
        "spacingErrors": spacing_errors,
    }


def write_payload(output: Path, start_date: str, entries: list[dict], summary: dict) -> None:
    payload = {
        "version": "mini-sudoku-pack-v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "startDate": start_date,
        "endDate": entries[-1]["date"],
        "length": len(entries),
        "auditSummary": summary,
        "entries": entries,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default=START_DATE, help="Pack start date (YYYY-MM-DD)")
    parser.add_argument("--seed", type=int, default=20260424, help="Deterministic seed")
    parser.add_argument("--output", type=Path, default=PACK_PATH, help="Output JSON path")
    parser.add_argument("--audit-only", action="store_true", help="Validate an existing output file without rewriting it")
    args = parser.parse_args()

    if args.audit_only:
        payload = json.loads(args.output.read_text())
        entries = payload["entries"]
        stored_summary = payload.get("auditSummary") or {}
        pools = {(difficulty, family): [] for difficulty in DIFFICULTIES for family in FAMILIES}
        summary = audit_pack(
            entries,
            [entry["difficulty"] for entry in entries],
            [entry["patternFamily"] for entry in entries],
            pools,
        )
        if stored_summary.get("candidatePoolCounts"):
            summary["candidatePoolCounts"] = stored_summary["candidatePoolCounts"]
        print(json.dumps(summary, indent=2))
        return 1 if summary["spacingErrors"] else 0

    entries, summary = build_pack(args.start, args.seed)
    write_payload(args.output, args.start, entries, summary)
    print(
        f"Wrote {len(entries)} Mini Sudoku pack entries to {args.output} "
        f"({entries[0]['date']} -> {entries[-1]['date']})"
    )
    print(json.dumps(summary, indent=2))
    return 1 if summary["spacingErrors"] else 0


if __name__ == "__main__":
    sys.exit(main())
