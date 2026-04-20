#!/usr/bin/env python3
"""Build the static Wordie schedule and allowed-guess bank."""

from __future__ import annotations

import argparse
import calendar
import hashlib
import json
import random
import re
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Iterable

BASE_DIR = Path(__file__).resolve().parents[1]
WORDIE_DIR = BASE_DIR / "src" / "data" / "wordie"
CANDIDATES_PATH = WORDIE_DIR / "candidates.json"
CONFIG_PATH = WORDIE_DIR / "generatorConfig.json"
KEY_DATES_PATH = WORDIE_DIR / "keyDates.json"
OVERRIDES_PATH = WORDIE_DIR / "editorialOverrides.json"
PRIOR_WORDS_PATH = WORDIE_DIR / "priorWords.json"
BLACKLIST_DIR = WORDIE_DIR / "blacklist"
SCHEDULE_OUT = BASE_DIR / "src" / "data" / "wordieSchedule.json"
ALLOWED_OUT = BASE_DIR / "src" / "data" / "wordieAllowedGuesses.json"

RARE_LETTERS = set("QJXZ")
VOWELS = set("AEIOU")
SUPPORTED_LENGTHS = (4, 5, 6)
SAFE_SWAP_COUNT = 50
MIN_ANSWER_FREQUENCY = {
    4: 4.0,
    5: 3.8,
    6: 3.8,
}
INTRINSIC_FINAL_S_WORDS = {
    "ACROSS",
    "AMISS",
    "BASIS",
    "BONUS",
    "CHAOS",
    "CLASS",
    "CROSS",
    "FOCUS",
    "GENIUS",
    "GLASS",
    "GLOSS",
    "GROSS",
    "GUESS",
    "MINUS",
    "PRESS",
    "PLUS",
    "SWISS",
    "THIS",
}

FUNCTION_WORDS = {
    "ABLE",
    "ABOUT",
    "ABOVE",
    "AFTER",
    "AGAIN",
    "AIN'T",
    "ALSO",
    "AMONG",
    "ANOTHER",
    "ANY",
    "ARE",
    "BEEN",
    "BEING",
    "BOTH",
    "CAN",
    "COULD",
    "DID",
    "DOES",
    "DONE",
    "DOWN",
    "EACH",
    "EVEN",
    "EVER",
    "EVERY",
    "FROM",
    "HAD",
    "HAS",
    "HAVE",
    "HERE",
    "INTO",
    "JUST",
    "LIKE",
    "MAKE",
    "MANY",
    "MORE",
    "MOST",
    "MUCH",
    "NEVER",
    "ONLY",
    "OTHER",
    "OVER",
    "SAME",
    "SHALL",
    "SHOULD",
    "SOME",
    "STILL",
    "SUCH",
    "THAN",
    "THAT",
    "THEIR",
    "THEM",
    "THEN",
    "THERE",
    "THESE",
    "THEY",
    "THIS",
    "THOSE",
    "THROUGH",
    "UNDER",
    "VERY",
    "WANT",
    "WERE",
    "WHAT",
    "WHEN",
    "WHERE",
    "WHICH",
    "WHILE",
    "WITH",
    "WOULD",
    "YOUR",
}

DAY_TARGETS = {
    0: ("easy", 25),
    1: ("easy", 35),
    2: ("medium", 45),
    3: ("medium", 55),
    4: ("medium", 60),
    5: ("medium", 50),
    6: ("hard", 65),
}


@dataclass(frozen=True)
class Candidate:
    word: str
    frequency: float
    tags: tuple[str, ...]
    difficulty_score: int
    difficulty_tier: str
    scoring: dict[str, int | float | bool]


@dataclass(frozen=True)
class Slot:
    date: date
    length: int
    guesses_allowed: int
    target_tier: str
    target_score: int
    key_date: dict | None


def read_json(path: Path) -> dict:
    return json.loads(path.read_text())


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2, sort_keys=False) + "\n")


def parse_date(value: str) -> date:
    return date.fromisoformat(value)


def date_range(start: date, end: date) -> Iterable[date]:
    cursor = start
    while cursor <= end:
        yield cursor
        cursor += timedelta(days=1)


def load_blacklists() -> dict[str, set[str]]:
    out: dict[str, set[str]] = {}
    for path in sorted(BLACKLIST_DIR.glob("*.txt")):
        words: set[str] = set()
        for raw_line in path.read_text().splitlines():
            line = raw_line.split("#", 1)[0].strip().upper()
            if line:
                words.add(line)
        out[path.stem] = words
    return out


def stable_random(seed: int, label: str) -> float:
    digest = hashlib.sha256(f"{seed}:{label}".encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big") / 2**64


def has_repeat_letter(word: str) -> bool:
    return len(set(word)) < len(word)


def rare_letter_count(word: str) -> int:
    return sum(1 for letter in set(word) if letter in RARE_LETTERS)


def same_position_overlap(a: str, b: str) -> int:
    return sum(1 for left, right in zip(a, b) if left == right)


def score_candidate(word: str, frequency: float, min_freq: float, max_freq: float) -> tuple[int, str, dict[str, int | float | bool]]:
    if max_freq == min_freq:
        commonness_penalty = 20
    else:
        normalized_commonness = (frequency - min_freq) / (max_freq - min_freq)
        commonness_penalty = round((1 - normalized_commonness) * 45)

    rare_penalty = min(24, rare_letter_count(word) * 12)
    repeat_penalty = 14 if has_repeat_letter(word) else 0
    vowel_count = sum(1 for letter in word if letter in VOWELS)
    ideal_vowels = 2 if len(word) in (4, 5) else 3
    vowel_penalty = min(12, abs(vowel_count - ideal_vowels) * 6)
    keyboard_depletion = min(10, rare_letter_count(word) * 5 + max(0, 2 - vowel_count) * 3)
    homograph_flag = word in {"BASS", "BOWS", "LEAD", "LIVE", "MINUTE", "POLISH", "TEARS", "WIND"}
    score = max(0, min(100, commonness_penalty + rare_penalty + repeat_penalty + vowel_penalty + keyboard_depletion))
    tier = "easy" if score < 38 else "medium" if score < 65 else "hard"
    return (
        score,
        tier,
        {
            "commonness": commonness_penalty,
            "rare_letters": rare_penalty,
            "repeat_letters": repeat_penalty,
            "vowel_balance": vowel_penalty,
            "keyboard_depletion": keyboard_depletion,
            "homograph": homograph_flag,
        },
    )


def is_added_plural(word: str, all_words: set[str]) -> bool:
    if not word.endswith("S") or word in INTRINSIC_FINAL_S_WORDS:
        return False
    if word.endswith("SS"):
        return False
    return True


def is_added_conjugation(word: str, all_words: set[str]) -> bool:
    if word.endswith("ING"):
        return True
    if word.endswith("ED") and not word.endswith(("EED", "IED")):
        return True
    if word.endswith("ED") and len(word) > 4:
        stem = word[:-2]
        return stem in all_words or f"{stem}E" in all_words
    return False


def is_structurally_excluded_answer(word: str, all_words: set[str]) -> bool:
    if word in FUNCTION_WORDS:
        return True
    if is_added_plural(word, all_words):
        return True
    if is_added_conjugation(word, all_words):
        return True
    if not re.fullmatch(r"[A-Z]+", word):
        return True
    return False


def build_candidates(raw_candidates: dict, blacklists: dict[str, set[str]], prior_words: set[str]) -> tuple[dict[int, list[Candidate]], dict[int, list[str]]]:
    all_input_words = {
        item["word"].upper()
        for entries in raw_candidates["words"].values()
        for item in entries
    }
    sensitivity_blacklist = set().union(
        *(words for name, words in blacklists.items() if name != "regional_variants")
    )
    answer_blacklist = set().union(*blacklists.values())

    answer_pools: dict[int, list[Candidate]] = {}
    allowed_words: dict[int, list[str]] = {}

    for length in SUPPORTED_LENGTHS:
        entries = raw_candidates["words"][str(length)]
        frequencies = [float(entry["frequency"]) for entry in entries]
        min_freq = min(frequencies)
        max_freq = max(frequencies)
        answer_pool: list[Candidate] = []
        allowed: list[str] = []

        for entry in entries:
            word = str(entry["word"]).upper()
            if len(word) != length or not re.fullmatch(r"[A-Z]+", word):
                continue
            if word not in sensitivity_blacklist:
                allowed.append(word)
            if word in prior_words or word in answer_blacklist:
                continue
            if float(entry["frequency"]) < MIN_ANSWER_FREQUENCY[length]:
                continue
            if is_structurally_excluded_answer(word, all_input_words):
                continue
            frequency = float(entry["frequency"])
            score, tier, scoring = score_candidate(word, frequency, min_freq, max_freq)
            tags = tuple(sorted(str(tag) for tag in entry.get("tags", [])))
            answer_pool.append(Candidate(word, frequency, tags, score, tier, scoring))

        answer_pools[length] = sorted(
            answer_pool,
            key=lambda candidate: (candidate.difficulty_score, -candidate.frequency, candidate.word),
        )
        allowed_words[length] = sorted(dict.fromkeys(allowed))

    return answer_pools, allowed_words


def slot_for_date(day: date, key_dates: dict[str, dict]) -> Slot:
    weekday = day.weekday()
    if weekday == 0:
        length = 4
        guesses = 5
    elif weekday == 6:
        length = 6
        guesses = 7
    else:
        length = 5
        guesses = 6
    target_tier, target_score = DAY_TARGETS[weekday]
    return Slot(day, length, guesses, target_tier, target_score, key_dates.get(day.isoformat()))


def violates_constraints(candidate: Candidate, slot: Slot, scheduled: list[dict], used_words: set[str]) -> str | None:
    word = candidate.word
    if word in used_words:
        return "repeat"
    if scheduled:
        previous = scheduled[-1]["word"]
        if word[0] == previous[0]:
            return "same_start_consecutive"
        if len(word) >= 3 and len(previous) >= 3 and word[:3] == previous[:3]:
            return "same_prefix_consecutive"
        if scheduled[-1]["difficulty_tier"] == "hard" and candidate.difficulty_tier == "hard":
            return "stacked_hard_days"

    for item in scheduled[-30:]:
        other = item["word"]
        if same_position_overlap(word, other) >= 3:
            return "position_cluster"

    iso_year, iso_week, _ = slot.date.isocalendar()
    if has_repeat_letter(word):
        weekly_repeats = sum(
            1
            for item in scheduled
            if item["iso_year"] == iso_year and item["iso_week"] == iso_week and item["has_repeat_letter"]
        )
        if weekly_repeats >= 1:
            return "weekly_double_letter_cap"

    if rare_letter_count(word) > 0:
        month_key = slot.date.strftime("%Y-%m")
        monthly_rares = sum(
            1
            for item in scheduled
            if item["month_key"] == month_key and item["rare_letter_count"] > 0
        )
        if monthly_rares >= 2:
            return "monthly_rare_letter_cap"

    return None


def candidate_rank(candidate: Candidate, slot: Slot, seed: int) -> tuple[float, float, str]:
    jitter = stable_random(seed, f"{slot.date.isoformat()}:{candidate.word}") * 2
    tier_penalty = 0 if candidate.difficulty_tier == slot.target_tier else 12
    return (
        tier_penalty + abs(candidate.difficulty_score - slot.target_score) * 0.25 - candidate.frequency * 2 + jitter,
        -candidate.frequency,
        candidate.word,
    )


def pick_candidate(
    slot: Slot,
    pool: list[Candidate],
    scheduled: list[dict],
    used_words: set[str],
    seed: int,
    override: str | None,
) -> tuple[Candidate, list[str], bool]:
    flags: list[str] = []
    if override:
        match = next((candidate for candidate in pool if candidate.word == override), None)
        if not match:
            raise SystemExit(f"Override {override} for {slot.date.isoformat()} is not in the filtered answer pool.")
        reason = violates_constraints(match, slot, scheduled, used_words)
        if reason:
            raise SystemExit(f"Override {override} for {slot.date.isoformat()} violates {reason}.")
        return match, ["editorial_override"], True

    usable = [
        candidate
        for candidate in pool
        if not violates_constraints(candidate, slot, scheduled, used_words)
    ]
    if not usable:
        raise SystemExit(f"No valid Wordie candidate for {slot.date.isoformat()}.")

    requested_tags = set(slot.key_date.get("tags", [])) if slot.key_date else set()
    requested_tags.discard("memorial-sensitive")
    themed = [candidate for candidate in usable if requested_tags.intersection(candidate.tags)]
    if themed:
        chosen = sorted(themed, key=lambda candidate: candidate_rank(candidate, slot, seed))[0]
        if slot.key_date:
            flags.append(f"theme:{slot.key_date['label']}")
        return chosen, flags, False

    if slot.key_date and requested_tags:
        flags.append(f"theme_not_forced:{slot.key_date['label']}")
    chosen = sorted(usable, key=lambda candidate: candidate_rank(candidate, slot, seed))[0]
    return chosen, flags, False


def schedule_year(
    answer_pools: dict[int, list[Candidate]],
    config: dict,
    key_dates: dict[str, dict],
    overrides: dict[str, str],
) -> list[dict]:
    seed = int(config["seed"])
    start = parse_date(config["year_start"])
    end = parse_date(config["year_end"])
    scheduled: list[dict] = []
    used_words: set[str] = set()

    for day in date_range(start, end):
        slot = slot_for_date(day, key_dates)
        candidate, flags, is_override = pick_candidate(
            slot,
            answer_pools[slot.length],
            scheduled,
            used_words,
            seed,
            overrides.get(day.isoformat()),
        )
        iso_year, iso_week, _ = day.isocalendar()
        item = {
            "date": day.isoformat(),
            "day_of_week": calendar.day_name[day.weekday()],
            "word": candidate.word,
            "length": slot.length,
            "guesses_allowed": slot.guesses_allowed,
            "difficulty_score": candidate.difficulty_score,
            "difficulty_tier": candidate.difficulty_tier,
            "flags": flags + (["homograph"] if candidate.scoring["homograph"] else []),
            "editorial_override": is_override,
            "_scoring": candidate.scoring,
            "_frequency": candidate.frequency,
            "iso_year": iso_year,
            "iso_week": iso_week,
            "month_key": day.strftime("%Y-%m"),
            "has_repeat_letter": has_repeat_letter(candidate.word),
            "rare_letter_count": rare_letter_count(candidate.word),
        }
        scheduled.append(item)
        used_words.add(candidate.word)

    return scheduled


def build_safe_swap_pool(answer_pools: dict[int, list[Candidate]], used_words: set[str], seed: int) -> dict[str, list[dict]]:
    out: dict[str, list[dict]] = {}
    for length, pool in answer_pools.items():
        remaining = [candidate for candidate in pool if candidate.word not in used_words]
        ordered = sorted(
            remaining,
            key=lambda candidate: (
                candidate.difficulty_score,
                stable_random(seed, f"swap:{length}:{candidate.word}"),
                candidate.word,
            ),
        )
        out[str(length)] = [
            {
                "word": candidate.word,
                "difficulty_score": candidate.difficulty_score,
                "difficulty_tier": candidate.difficulty_tier,
                "flags": ["homograph"] if candidate.scoring["homograph"] else [],
            }
            for candidate in ordered[:SAFE_SWAP_COUNT]
        ]
        if len(out[str(length)]) < SAFE_SWAP_COUNT:
            raise SystemExit(f"Safe-swap pool for length {length} only has {len(out[str(length)])} words.")
    return out


def validate_schedule(payload: dict, prior_words: set[str], blacklists: dict[str, set[str]]) -> None:
    puzzles = payload["puzzles"]
    used: set[str] = set()
    all_blacklisted = set().union(*blacklists.values())
    previous: dict | None = None

    if len(puzzles) != 365:
        raise SystemExit(f"Expected 365 Wordie puzzles, got {len(puzzles)}.")

    for index, puzzle in enumerate(puzzles):
        day = parse_date(puzzle["date"])
        slot = slot_for_date(day, {})
        word = puzzle["word"]
        if word in used:
            raise SystemExit(f"Repeated answer: {word}.")
        if word in prior_words:
            raise SystemExit(f"Prior answer reused: {word}.")
        if word in all_blacklisted:
            raise SystemExit(f"Blacklisted answer scheduled: {word}.")
        if len(word) != slot.length or puzzle["length"] != slot.length:
            raise SystemExit(f"Length mismatch on {puzzle['date']}: {word}.")
        if puzzle["guesses_allowed"] != slot.guesses_allowed:
            raise SystemExit(f"Guess-count mismatch on {puzzle['date']}.")
        if previous:
            if word[0] == previous["word"][0]:
                raise SystemExit(f"Consecutive same starting letter: {previous['date']} and {puzzle['date']}.")
            if word[:3] == previous["word"][:3]:
                raise SystemExit(f"Consecutive same prefix: {previous['date']} and {puzzle['date']}.")
        for other in puzzles[max(0, index - 30):index]:
            if same_position_overlap(other["word"], word) >= 3:
                raise SystemExit(f"Position cluster: {other['date']} {other['word']} and {puzzle['date']} {word}.")
        used.add(word)
        previous = puzzle


def public_puzzle(item: dict) -> dict:
    return {
        "date": item["date"],
        "day_of_week": item["day_of_week"],
        "word": item["word"],
        "length": item["length"],
        "guesses_allowed": item["guesses_allowed"],
        "difficulty_score": item["difficulty_score"],
        "difficulty_tier": item["difficulty_tier"],
        "flags": item["flags"],
        "editorial_override": item["editorial_override"],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Build and validate in memory without writing output files.")
    args = parser.parse_args()

    config = read_json(CONFIG_PATH)
    raw_candidates = read_json(CANDIDATES_PATH)
    key_dates = {item["date"]: item for item in read_json(KEY_DATES_PATH)["dates"]}
    prior_words = set(read_json(PRIOR_WORDS_PATH)["words"])
    blacklists = load_blacklists()
    override_items = read_json(OVERRIDES_PATH).get("overrides", [])
    overrides = {item["date"]: str(item["word"]).upper() for item in override_items}

    answer_pools, allowed_words = build_candidates(raw_candidates, blacklists, prior_words)
    for length in SUPPORTED_LENGTHS:
        if len(answer_pools[length]) < 365:
            raise SystemExit(f"Filtered answer pool for length {length} is too small: {len(answer_pools[length])}.")

    scheduled = schedule_year(answer_pools, config, key_dates, overrides)
    used_words = {item["word"] for item in scheduled}
    schedule_payload = {
        "version": config["version"],
        "generated_at": config["generated_at"],
        "seed": config["seed"],
        "year_start": config["year_start"],
        "year_end": config["year_end"],
        "puzzles": [public_puzzle(item) for item in scheduled],
        "safe_swap_pool": build_safe_swap_pool(answer_pools, used_words, int(config["seed"])),
    }
    allowed_payload = {
        "version": config["version"],
        "generated_at": config["generated_at"],
        "source": "Generated from checked-in Wordie candidate pools after sensitivity filtering.",
        "words": {str(length): allowed_words[length] for length in SUPPORTED_LENGTHS},
    }

    validate_schedule(schedule_payload, prior_words, blacklists)

    if not args.check:
        write_json(SCHEDULE_OUT, schedule_payload)
        write_json(ALLOWED_OUT, allowed_payload)

    print(
        json.dumps(
            {
                "puzzles": len(schedule_payload["puzzles"]),
                "answer_pool_sizes": {str(k): len(v) for k, v in answer_pools.items()},
                "allowed_guess_sizes": {str(k): len(v) for k, v in allowed_words.items()},
                "safe_swap_sizes": {k: len(v) for k, v in schedule_payload["safe_swap_pool"].items()},
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
