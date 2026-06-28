#!/usr/bin/env python3
"""Build and audit the 400-day Composed word-game pack."""

from __future__ import annotations

import argparse
import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Iterable, Sequence

try:
    from wordfreq import top_n_list, zipf_frequency
except ImportError as exc:  # pragma: no cover - local tooling guard
    raise SystemExit(
        "Kilter pack generation requires the Python package `wordfreq`."
    ) from exc

from word_safety import read_blacklist_dir, severe_guess_blacklist


BASE_DIR = Path(__file__).resolve().parents[1]
WORDIE_BLACKLIST_DIR = BASE_DIR / "src" / "data" / "wordie" / "blacklist"
PACK_OUT = BASE_DIR / "src" / "data" / "kilter" / "pack.json"
AUDIT_OUT = BASE_DIR / "docs" / "kilter-editorial-audit.md"
SYSTEM_WORDS_PATH = Path("/usr/share/dict/words")
SYSTEM_PROPER_NAMES_PATH = Path("/usr/share/dict/propernames")

PACK_START = date(2026, 6, 1)
PACK_DAYS = 400
WORD_SOURCE_LIMIT = 80_000
ACCEPTED_BONUS_WORD_SOURCE_LIMIT = 400_000
SEED = 917_365
SWEEP_BONUS = 15
MIN_SWEEP_SINGLE_COUNT = 360
CORE_MIN_FREQUENCY = 3.07
BONUS_MIN_FREQUENCY = 2.55
SOURCE_MIN_FREQUENCY = 2.45
TRUSTED_NON_DICTIONARY_MIN_ZIPF = 2.9
COMMON_OMITTED_SAMPLE_WORDS = {
    "CARING",
    "CODING",
    "NOTING",
    "PRICING",
    "RAINING",
    "SIGNING",
}

KEY_LENGTH_TOTALS = {1: 100, 2: 260, 3: 40}
PINNED_SIGNATURES = {
    0: "IN:ACDGOR",
}
CORE_TARGETS = {
    1: (45, 90),
    2: (25, 55),
    3: (14, 35),
}

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
VOWELS = set("AEIOU")
RARE_LETTERS = set("QJXZ")
BAD_KEY_FRAGMENTS = {
    "ING",
    "ION",
    "TIO",
    "ENT",
    "ONS",
    "NTS",
    "IES",
    "ERS",
    "EST",
    "ATI",
}
COMMON_KEYS_2 = {
    "ST",
    "RE",
    "ER",
    "IN",
    "ON",
    "AN",
    "AR",
    "OR",
    "AL",
    "EN",
    "TE",
    "RA",
    "SE",
    "LE",
    "RO",
    "RI",
    "TI",
    "TR",
    "CH",
    "CO",
    "DE",
    "DI",
    "EA",
    "EL",
    "ES",
    "IC",
    "LI",
    "NE",
    "NT",
    "OU",
    "PR",
    "SI",
}
COMMON_KEYS_3 = {
    "COM",
    "CON",
    "PER",
    "PRO",
    "PRE",
    "TER",
    "TRA",
    "VER",
    "STA",
    "INT",
    "RES",
    "REC",
    "DIS",
    "OVE",
    "EVE",
    "MEN",
    "ENT",
    "ATI",
    "REP",
}

FUNCTION_WORDS = {
    "ABLE",
    "ABOUT",
    "ABOVE",
    "AFTER",
    "AGAIN",
    "ALSO",
    "AMONG",
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

PROPER_NOUN_DENYLIST = {
    "AFRICA",
    "ALABAMA",
    "ALASKA",
    "AMERICA",
    "AMERICAN",
    "AMERICANS",
    "ARIZONA",
    "ARKANSAS",
    "ASIA",
    "AUSTRALIA",
    "BOSTON",
    "BRITAIN",
    "BRITISH",
    "CALIFORNIA",
    "CANADA",
    "CAROLINA",
    "CHICAGO",
    "CHINA",
    "CHRISTMAS",
    "COLORADO",
    "CONNECTICUT",
    "DAKOTA",
    "DELAWARE",
    "ENGLAND",
    "ENGLISH",
    "EUROPE",
    "EUROPEAN",
    "FLORIDA",
    "FRANCE",
    "GEORGIA",
    "GERMAN",
    "GERMANY",
    "HAWAII",
    "IDAHO",
    "ILLINOIS",
    "INDIA",
    "INDIANA",
    "IOWA",
    "IRELAND",
    "ITALIAN",
    "ITALY",
    "JAPAN",
    "KANSAS",
    "KENTUCKY",
    "LONDON",
    "LOUISIANA",
    "MANCHESTER",
    "MARYLAND",
    "MASSACHUSETTS",
    "MEXICO",
    "MICHIGAN",
    "MINNESOTA",
    "MISSISSIPPI",
    "MISSOURI",
    "MONTANA",
    "NEBRASKA",
    "NEVADA",
    "OHIO",
    "OKLAHOMA",
    "OREGON",
    "PENNSYLVANIA",
    "SCOTLAND",
    "SINGAPORE",
    "TEXAS",
    "VIRGINIA",
    "WASHINGTON",
    "WISCONSIN",
}

KILTER_DENYLIST = {
    "ABORIGINAL",
    "ANAL",
    "APARTHEID",
    "ABUSING",
    "BARCELONA",
    "BITCHING",
    "BOMBING",
    "CHANDLER",
    "CHOKING",
    "CIGARETTE",
    "CISCO",
    "COCO",
    "CONN",
    "COCKING",
    "CRASHING",
    "ATTACKING",
    "DAMNING",
    "DOGGING",
    "DROWNING",
    "CRORE",
    "DONT",
    "FIGHTING",
    "FREAKING",
    "FRIGGING",
    "GAGGING",
    "GROOMING",
    "HARASSING",
    "INTERCOURSE",
    "KENSINGTON",
    "KILLING",
    "ELLE",
    "INTERRACIAL",
    "LAMBERT",
    "LEIGHTON",
    "LING",
    "LEVIN",
    "MATER",
    "MEDITERRANEAN",
    "MURDERING",
    "NESS",
    "ORIENTAL",
    "PARA",
    "PENIS",
    "POOPING",
    "PISSING",
    "PRICKING",
    "PROSTATE",
    "PROTESTANT",
    "PROTESTING",
    "PROSTITUTE",
    "PUNISHING",
    "REESE",
    "SCREWING",
    "SCHNEIDER",
    "SHOOTING",
    "SLAIN",
    "SLASHING",
    "SLAUGHTER",
    "SLAUGHTERING",
    "SLAVING",
    "STALKING",
    "STABBING",
    "STARVING",
    "SWEARING",
    "TARA",
    "TATE",
    "TERRORISM",
    "TITANIC",
    "VIOLATING",
    "WELLINGTON",
    "BEGINING",
    "REFERING",
    "WRITTING",
}

KILTER_INVALID_WORDS = {
    "BEGINING",
    "REFERING",
    "WRITTING",
}

SWEEP_ONLY_DENYLIST = {
    "APPLICATION",
    "APPROPRIATE",
    "ARGUMENT",
    "ASSOCIATION",
    "COMMISSION",
    "COMMUNICATE",
    "COMMUNIST",
    "COMPETITION",
    "CONCENTRATED",
    "CONSIDERING",
    "CONVENTIONAL",
    "CONVERSION",
    "CORPORATION",
    "DEDICATION",
    "DEMOCRAT",
    "DEPARTMENT",
    "DEPRESSION",
    "DEVELOPMENT",
    "ECONOMIST",
    "ENTERPRISE",
    "ENVIRONMENT",
    "GOVERNMENT",
    "IMPROVEMENT",
    "INDEPENDENT",
    "INSTITUTION",
    "INTERACTION",
    "INTERSECTION",
    "INTERNATIONAL",
    "LEGISLATIVE",
    "MANAGEMENT",
    "MEASUREMENT",
    "MINISTER",
    "OPERATION",
    "ORGANIZATION",
    "PERSISTENT",
    "PERCENTAGE",
    "POTENTIAL",
    "PRESIDENT",
    "PRODUCTION",
    "PROSECUTOR",
    "RECOGNITION",
    "REGISTRATION",
    "REPRESENT",
    "REPRESENTED",
    "RESIDENT",
    "RESIDENTIAL",
    "RESIGNATION",
    "RESISTANCE",
    "RESOLUTION",
    "RESTORATION",
    "RESULTING",
    "SECRETARY",
    "SELECTION",
    "STRATEGIC",
    "TOLERANCE",
    "TRANSACTION",
}

# These words can remain valid core/bonus answers, but they should not be the
# starred prestige solve in a five-minute Composed puzzle.
DRY_SWEEP_DENYLIST = {
    "ACCOUNTING",
    "ADVISER",
    "ANARCHIST",
    "APPARENTLY",
    "ARMISTICE",
    "ARISTOCRACY",
    "ATTORNEY",
    "BILATERAL",
    "CARTILAGE",
    "CENTRALLY",
    "CERTIFIED",
    "CHEATING",
    "COGNITIVE",
    "COMMENTATOR",
    "COMMERCIAL",
    "COMPENSATE",
    "CONDEMNING",
    "CONFEDERATE",
    "CONCLUSIVE",
    "CONSTRAINT",
    "CONSORTIUM",
    "CONSTITUENCY",
    "CONSTITUENT",
    "CONSTITUTE",
    "CONSULATE",
    "CONSULTING",
    "CONTINENTAL",
    "CONTINGENCY",
    "CONTRACTUAL",
    "CONNECTIVITY",
    "CONTROVERSY",
    "COUNTERFEIT",
    "COUNSELOR",
    "CORRELATED",
    "DERIVATIVE",
    "DEMOCRATIC",
    "DENTISTRY",
    "DIETARY",
    "DIRECTOR",
    "DIRECTORATE",
    "DISCONTENT",
    "DISRESPECT",
    "DOCTRINE",
    "DISTRIBUTE",
    "DISTRIBUTED",
    "EDUCATOR",
    "EDITORIAL",
    "ELECTRICIAN",
    "ESSENTIALLY",
    "EXISTENTIAL",
    "EXTERNALLY",
    "FORENSIC",
    "FRATERNITY",
    "GENERALLY",
    "HEADMASTER",
    "HEREDITARY",
    "IMPERATIVE",
    "IMPERIAL",
    "INDICATIVE",
    "INACCURATE",
    "INCOMPETENT",
    "INCORPORATE",
    "INDICATOR",
    "INSUFFICIENT",
    "INSPECTOR",
    "INSURED",
    "INTERFACE",
    "INTERNSHIP",
    "INTERNALLY",
    "IRRESPECTIVE",
    "IRRELEVANT",
    "INVESTOR",
    "LIBERTARIAN",
    "MAGISTRATE",
    "MANAGERIAL",
    "MARKETING",
    "MEDIATOR",
    "MEANINGLESS",
    "MARGINALLY",
    "MATERIALLY",
    "NATIONALISM",
    "OBSTACLE",
    "OPERATIVE",
    "ORNAMENTAL",
    "PANCREATIC",
    "PATRONAGE",
    "PEDIATRIC",
    "PERSONNEL",
    "PERSPECTIVE",
    "POTENTIALLY",
    "PRACTITIONER",
    "PREPARATORY",
    "PREDICTIVE",
    "PRIVILEGED",
    "PROSPECTIVE",
    "PROTRACTED",
    "RECEPTIONIST",
    "REPEATEDLY",
    "REPOSITORY",
    "RECRUITING",
    "REGULATED",
    "REGULATOR",
    "RELIGION",
    "RESPECTIVE",
    "RESIDUAL",
    "RESIDENCY",
    "RESPONSIVE",
    "SECTARIAN",
    "SECONDLY",
    "SEMANTIC",
    "SHAREHOLDER",
    "SOCIETAL",
    "SPECIALIST",
    "SPECTRAL",
    "SPECTROSCOPY",
    "SUPERVISOR",
    "SURROGATE",
    "SYSTEMATIC",
    "TEMPORAL",
    "TERMINAL",
    "TERRITORIAL",
    "THERAPIST",
    "TRADEMARK",
    "TREASURY",
    "TESTIMONY",
    "UNCERTAINTY",
    "UNILATERAL",
    "UNPROTECTED",
    "UNRESTRICTED",
    "VETERINARY",
    "VISCERAL",
    "WAITRESS",
    "WHATSOEVER",
    "YOURSELVES",
}

SENSITIVE_SWEEP_DENYLIST = {
    "ADVERSELY",
    "BACTERIA",
    "BACTERIAL",
    "BATTLEFIELD",
    "BETRAYAL",
    "CONSENSUAL",
    "CONGENITAL",
    "CONTAGIOUS",
    "CRETACEOUS",
    "CRUSHING",
    "DEMONSTRATE",
    "DEPRESSING",
    "DISASTER",
    "DIVORCE",
    "DESTRUCTIVE",
    "DETRIMENTAL",
    "DEVASTATING",
    "ESPIONAGE",
    "FRIGHTENING",
    "HEARTLESS",
    "HYSTERIA",
    "INDIGENOUS",
    "MIGRAINE",
    "MISCONDUCT",
    "MORTGAGE",
    "OUTPATIENT",
    "PANDEMIC",
    "PARASITE",
    "POINTLESS",
    "PREDATOR",
    "PREDATORY",
    "PREGNANT",
    "POSTERIOR",
    "RESPIRATORY",
    "NIGHTMARE",
    "OVERWATCH",
    "SACRIFICING",
    "SOLDIER",
    "STEROID",
    "SUFFERING",
    "STRICKEN",
    "STRUGGLING",
    "TERMINATOR",
    "TERRIFYING",
    "THERAPY",
    "THREATENING",
    "TRAGEDY",
    "UNPLEASANT",
    "UNANSWERED",
    "UNFORTUNATE",
    "UNMARRIED",
    "UNSTABLE",
    "UNSETTLING",
    "UPSETTING",
    "VIGILANTE",
    "WASTEFUL",
}

GEOGRAPHIC_SWEEP_DENYLIST = {
    "NORTHEAST",
    "NORTHEASTERN",
    "NORTHWEST",
    "NORTHWESTERN",
    "SOUTHEASTERN",
    "SOUTHWESTERN",
}

SWEEP_DENYLIST = (
    SWEEP_ONLY_DENYLIST
    | DRY_SWEEP_DENYLIST
    | SENSITIVE_SWEEP_DENYLIST
    | GEOGRAPHIC_SWEEP_DENYLIST
)

SWEEP_SUFFIX_DENYLIST = (
    "ANCE",
    "ENCE",
    "ENCY",
    "ICAL",
    "ISM",
    "ISTIC",
    "ITY",
    "IZATION",
    "ISATION",
    "ITION",
    "MENT",
    "NESS",
    "SION",
    "TIONAL",
    "TION",
    "UTOR",
    "SIONAL",
)

SWEEP_LONG_ALLOWLIST = {
    "UNDERSTANDING",
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

REQUIRED_SAMPLE_WORDS = {
    "STARE",
    "STONE",
    "TOAST",
    "ROOST",
    "STARTER",
    "EARNEST",
    "TENSION",
    "CARTON",
    "RECITAL",
    "TRIANGLE",
    "SECTION",
    "CONTRAST",
    "PROTEIN",
    "KILTER",
}


@dataclass(frozen=True)
class WordEntry:
    word: str
    frequency: float
    mask: int


@dataclass(frozen=True)
class Candidate:
    key: str
    letters: tuple[str, ...]
    core_words: tuple[str, ...]
    bonus_words: tuple[str, ...]
    sweeps: tuple[str, ...]
    primary_sweep: str
    quality_score: float
    signature: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audit-only", action="store_true")
    parser.add_argument("--self-test-omitted-obvious", action="store_true")
    return parser.parse_args()


def read_curated_blacklists() -> set[str]:
    words: set[str] = set()
    for blacklist in read_blacklist_dir(WORDIE_BLACKLIST_DIR).values():
        words.update(blacklist)
    words.update(PROPER_NOUN_DENYLIST)
    words.update(KILTER_DENYLIST)
    if SYSTEM_PROPER_NAMES_PATH.exists():
        for raw_line in SYSTEM_PROPER_NAMES_PATH.read_text(errors="ignore").splitlines():
            word = raw_line.strip().upper()
            if re.fullmatch(r"[A-Z]+", word):
                words.add(word)
    return words


def read_guess_blacklist() -> set[str]:
    return severe_guess_blacklist(read_blacklist_dir(WORDIE_BLACKLIST_DIR))


def read_system_dictionary() -> set[str]:
    if not SYSTEM_WORDS_PATH.exists():
        return set()
    words: set[str] = set()
    for raw_line in SYSTEM_WORDS_PATH.read_text(errors="ignore").splitlines():
        word = raw_line.strip().upper()
        if re.fullmatch(r"[A-Z]+", word):
            words.add(word)
    return words


def bit_for(letter: str) -> int:
    return 1 << (ord(letter) - ord("A"))


def word_mask(word: str) -> int:
    mask = 0
    for letter in set(word):
        mask |= bit_for(letter)
    return mask


def mask_letters(mask: int) -> list[str]:
    return [letter for letter in ALPHABET if mask & bit_for(letter)]


def submasks(mask: int) -> Iterable[int]:
    cursor = mask
    while True:
        yield cursor
        if cursor == 0:
            break
        cursor = (cursor - 1) & mask


def sorted_words(words: Iterable[str]) -> tuple[str, ...]:
    return tuple(sorted(set(words), key=lambda word: (len(word), word)))


def is_simple_plural(word: str, word_set: set[str]) -> bool:
    if not word.endswith("S") or word.endswith("SS") or word in INTRINSIC_FINAL_S_WORDS:
        return False
    if word[:-1] in word_set:
        return True
    if word.endswith("ES") and word[:-2] in word_set:
        return True
    if word.endswith("IES") and f"{word[:-3]}Y" in word_set:
        return True
    return False


def is_low_value_inflection(word: str, word_set: set[str]) -> bool:
    if word.endswith("ED") and len(word) > 5:
        return word[:-2] in word_set or f"{word[:-1]}E" in word_set
    if word.endswith("ER") and len(word) > 5:
        return word[:-2] in word_set or f"{word[:-1]}E" in word_set
    return False


def ing_base_candidates(word: str) -> set[str]:
    if not word.endswith("ING") or len(word) <= 6:
        return set()
    stem = word[:-3]
    candidates = {stem, f"{stem}E"}
    if len(stem) >= 2 and stem[-1] == stem[-2]:
        candidates.add(stem[:-1])
    return candidates


def is_common_natural_ing_form(word: str, dictionary_words: set[str]) -> bool:
    return bool(ing_base_candidates(word) & dictionary_words)


def is_trusted_word_source(word: str, dictionary_words: set[str]) -> bool:
    if word in dictionary_words:
        return True
    if word in COMMON_OMITTED_SAMPLE_WORDS:
        return True
    if not is_common_natural_ing_form(word, dictionary_words):
        return False
    return zipf_frequency(word.lower(), "en") >= TRUSTED_NON_DICTIONARY_MIN_ZIPF


def has_bad_shape(word: str) -> bool:
    if re.search(r"(.)\1\1", word):
        return True
    if len(word) <= 4 and sum(1 for letter in word if letter in VOWELS) == 0:
        return True
    return False


def rank_frequency(rank: int) -> float:
    return max(2.35, 7.2 - math.log10(rank + 2) * 0.95)


def load_word_entries() -> tuple[list[WordEntry], list[WordEntry], list[WordEntry], dict[str, float]]:
    curated_blacklists = read_curated_blacklists()
    guess_blacklist = read_guess_blacklist()
    dictionary_words = read_system_dictionary()
    raw: dict[str, float] = {}
    accepted_raw: dict[str, float] = {}

    def is_accepted_guess_word(word: str) -> bool:
        return (
            re.fullmatch(r"[A-Z]+", word) is not None
            and 4 <= len(word) <= 14
            and word not in guess_blacklist
            and word not in KILTER_INVALID_WORDS
            and not has_bad_shape(word)
        )

    for rank, word in enumerate(top_n_list("en", ACCEPTED_BONUS_WORD_SOURCE_LIMIT, ascii_only=True)):
        normalized = word.upper()
        if not is_accepted_guess_word(normalized):
            continue
        frequency = rank_frequency(rank)
        accepted_raw.setdefault(normalized, max(BONUS_MIN_FREQUENCY, frequency))
        if not is_trusted_word_source(normalized, dictionary_words):
            continue
        if rank >= WORD_SOURCE_LIMIT or frequency < SOURCE_MIN_FREQUENCY:
            continue
        raw.setdefault(normalized, frequency)

    for word in dictionary_words:
        if is_accepted_guess_word(word):
            accepted_raw.setdefault(word, BONUS_MIN_FREQUENCY)

    for word in REQUIRED_SAMPLE_WORDS:
        if is_accepted_guess_word(word):
            frequency = max(3.4, zipf_frequency(word.lower(), "en"))
            accepted_raw.setdefault(word, frequency)
            raw.setdefault(word, frequency)

    word_set = set(raw)
    plural_base_words = word_set | dictionary_words
    core: list[WordEntry] = []
    bonus: list[WordEntry] = []
    accepted_bonus: list[WordEntry] = [
        WordEntry(word, frequency, word_mask(word))
        for word, frequency in accepted_raw.items()
    ]

    for word, frequency in raw.items():
        if word in curated_blacklists:
            continue
        entry = WordEntry(word, frequency, word_mask(word))
        plain_plural = is_simple_plural(word, plural_base_words)
        low_value = is_low_value_inflection(word, word_set)
        is_function = word in FUNCTION_WORDS
        if frequency >= CORE_MIN_FREQUENCY and not plain_plural and not low_value and not is_function:
            core.append(entry)
        elif frequency >= BONUS_MIN_FREQUENCY and not plain_plural:
            bonus.append(entry)

    return core, bonus, accepted_bonus, raw


def find_omitted_obvious_words(
    entry: dict,
    core_by_mask: dict[int, list[WordEntry]],
) -> list[str]:
    key = str(entry.get("key", ""))
    letters = entry.get("letters", [])
    if len(key) not in (1, 2, 3) or not isinstance(letters, list):
        return []

    allowed_mask = 0
    for letter in set(key) | set(letters):
        if letter not in ALPHABET:
            return []
        allowed_mask |= bit_for(letter)

    accepted = set(entry.get("coreWords", [])) | set(entry.get("bonusWords", []))
    omitted = [
        candidate.word
        for candidate in words_for_allowed_mask(allowed_mask, core_by_mask)
        if key in candidate.word and candidate.word not in accepted
    ]
    return sorted_words(omitted)


def run_omitted_obvious_self_test() -> None:
    core, _, _, _ = load_word_entries()
    core_by_mask = index_by_mask(core)
    fixtures = [
        (
            {
                "key": "IN",
                "letters": ["A", "C", "D", "G", "O", "R"],
                "coreWords": ["DARING"],
                "bonusWords": [],
            },
            {"CARING", "CODING", "RAINING"},
        ),
        (
            {
                "key": "IN",
                "letters": ["A", "C", "G", "O", "P", "R"],
                "coreWords": [],
                "bonusWords": [],
            },
            {"PRICING"},
        ),
        (
            {
                "key": "IN",
                "letters": ["A", "C", "D", "G", "O", "S"],
                "coreWords": [],
                "bonusWords": [],
            },
            {"SIGNING"},
        ),
        (
            {
                "key": "IN",
                "letters": ["A", "C", "G", "N", "O", "T"],
                "coreWords": [],
                "bonusWords": [],
            },
            {"NOTING"},
        ),
    ]
    for fixture, expected in fixtures:
        omitted = set(find_omitted_obvious_words(fixture, core_by_mask))
        if not expected.issubset(omitted):
            missing = ", ".join(sorted(expected - omitted))
            raise SystemExit(f"omitted obvious self-test failed; missing {missing}")
    print("omitted obvious word audit self-test passed")


def index_by_mask(entries: Sequence[WordEntry]) -> dict[int, list[WordEntry]]:
    out: dict[int, list[WordEntry]] = defaultdict(list)
    for entry in entries:
        out[entry.mask].append(entry)
    return out


def words_for_allowed_mask(
    allowed_mask: int,
    entries_by_mask: dict[int, list[WordEntry]],
) -> list[WordEntry]:
    out: list[WordEntry] = []
    for mask in submasks(allowed_mask):
        out.extend(entries_by_mask.get(mask, ()))
    return out


def key_fragments(word: str, key_length: int) -> list[str]:
    keys = {
        word[index : index + key_length]
        for index in range(0, len(word) - key_length + 1)
        if len(set(word[index : index + key_length])) == key_length
    }
    return sorted(keys)


def core_score(word: str, sweeps: set[str]) -> int:
    base = 1 if len(word) == 4 else len(word)
    return base + (SWEEP_BONUS if word in sweeps else 0)


def sweep_rejection_reason(word: str) -> str | None:
    if word in SWEEP_DENYLIST:
        return "title-like, institutional, or low-charm sweep"
    if len(word) > 12 and word not in SWEEP_LONG_ALLOWLIST:
        return "sweep is over 12 letters"
    if word.endswith(SWEEP_SUFFIX_DENYLIST):
        return "abstract suffix-heavy sweep"
    return None


def is_editorial_sweep(word: str) -> bool:
    return sweep_rejection_reason(word) is None


def common_key_bonus(key: str) -> int:
    if len(key) == 2 and key in COMMON_KEYS_2:
        return 12
    if len(key) == 3 and key in COMMON_KEYS_3:
        return 8
    return 0


def key_quality_penalty(key: str) -> int:
    penalty = 0
    if len(key) == 1:
        if key in RARE_LETTERS:
            penalty += 18
        if key not in VOWELS:
            penalty += 3
    if len(key) >= 2:
        if key in BAD_KEY_FRAGMENTS:
            penalty += 18
        if all(letter not in VOWELS for letter in key):
            penalty += 8
        if any(letter in RARE_LETTERS for letter in key):
            penalty += 12
    return penalty


def build_candidates_for_key_length(
    key_length: int,
    core: Sequence[WordEntry],
    bonus: Sequence[WordEntry],
    accepted_bonus: Sequence[WordEntry],
    raw_frequencies: dict[str, float],
) -> list[Candidate]:
    target_min, target_max = CORE_TARGETS[key_length]
    target_mid = (target_min + target_max) / 2
    core_by_mask = index_by_mask(core)
    bonus_by_mask = index_by_mask(bonus)
    accepted_bonus_by_mask = index_by_mask(accepted_bonus)
    candidates: list[Candidate] = []

    for sweep_entry in core:
        if sweep_entry.frequency < CORE_MIN_FREQUENCY:
            continue
        if len(set(sweep_entry.word)) != key_length + 6:
            continue
        if len(sweep_entry.word) < key_length + 6:
            continue

        for key in key_fragments(sweep_entry.word, key_length):
            if key in BAD_KEY_FRAGMENTS:
                continue
            loose_letters = tuple(sorted(set(sweep_entry.word) - set(key)))
            if len(loose_letters) != 6:
                continue
            allowed_letters = set(loose_letters) | set(key)
            allowed_mask = 0
            for letter in allowed_letters:
                allowed_mask |= bit_for(letter)

            core_words = [
                entry.word
                for entry in words_for_allowed_mask(allowed_mask, core_by_mask)
                if key in entry.word
            ]
            if not (target_min <= len(core_words) <= target_max):
                continue

            sweeps = sorted_words(
                word
                for word in core_words
                if set(loose_letters).issubset(set(word)) and key in word
            )
            if len(sweeps) < 1 or len(sweeps) > 2:
                continue
            if sweep_entry.word not in sweeps:
                continue
            if any(not is_editorial_sweep(word) for word in sweeps):
                continue
            if min(raw_frequencies.get(word, 0) for word in sweeps) < 3.05:
                continue

            bonus_words = [
                entry.word
                for entry in words_for_allowed_mask(allowed_mask, bonus_by_mask)
                if key in entry.word and entry.word not in core_words
            ]
            if len(bonus_words) > max(70, len(core_words) * 2):
                continue
            expanded_bonus_words = [
                entry.word
                for entry in words_for_allowed_mask(allowed_mask, accepted_bonus_by_mask)
                if key in entry.word and entry.word not in core_words
            ]

            total_core_score = sum(core_score(word, set(sweeps)) for word in core_words)
            if total_core_score <= 0:
                continue

            rare_count = len(set(sweep_entry.word) & RARE_LETTERS)
            vowel_count = len(set(sweep_entry.word) & VOWELS)
            quality = (
                sweep_entry.frequency * 20
                + common_key_bonus(key)
                - abs(len(core_words) - target_mid) * 0.7
                - key_quality_penalty(key)
                - rare_count * 8
                + min(8, vowel_count * 2)
                - len(sweeps) * 0.4
            )
            signature = f"{key}:{''.join(loose_letters)}"
            candidates.append(
                Candidate(
                    key=key,
                    letters=loose_letters,
                    core_words=sorted_words(core_words),
                    bonus_words=sorted_words(expanded_bonus_words),
                    sweeps=sweeps,
                    primary_sweep=sweep_entry.word,
                    quality_score=quality,
                    signature=signature,
                )
            )

    deduped: dict[str, Candidate] = {}
    for candidate in candidates:
        existing = deduped.get(candidate.signature)
        if existing is None or candidate.quality_score > existing.quality_score:
            deduped[candidate.signature] = candidate
    return sorted(
        deduped.values(),
        key=lambda item: (len(item.sweeps), -item.quality_score, item.signature),
    )


def distributed_positions(total: int, count: int, offset: int, occupied: set[int]) -> list[int]:
    positions: list[int] = []
    for index in range(count):
        preferred = int(math.floor(((index + 0.5) * total) / count + offset)) % total
        cursor = preferred
        while cursor in occupied:
            cursor = (cursor + 1) % total
        occupied.add(cursor)
        positions.append(cursor)
    return positions


def build_key_length_schedule() -> list[int]:
    occupied: set[int] = set()
    schedule = [2] * PACK_DAYS
    for position in distributed_positions(PACK_DAYS, KEY_LENGTH_TOTALS[1], 0, occupied):
        schedule[position] = 1
    for position in distributed_positions(PACK_DAYS, KEY_LENGTH_TOTALS[3], 3, occupied):
        schedule[position] = 3
    counts = Counter(schedule)
    if dict(counts) != KEY_LENGTH_TOTALS:
        raise RuntimeError(f"Bad Kilter key length mix: {counts}")
    return schedule


def choose_pack(candidates_by_key_length: dict[int, list[Candidate]]) -> list[Candidate]:
    schedule = build_key_length_schedule()
    used_signatures: set[str] = set()
    used_primary_sweeps: set[str] = set()
    last_key_seen: dict[str, int] = {}
    chosen: list[Candidate] = []

    for day_index, key_length in enumerate(schedule):
        candidates = candidates_by_key_length[key_length]
        picked: Candidate | None = None
        pinned_signature = PINNED_SIGNATURES.get(day_index)
        if pinned_signature:
            picked = next(
                (candidate for candidate in candidates if candidate.signature == pinned_signature),
                None,
            )
            if picked is None:
                raise RuntimeError(f"No pinned Kilter candidate for day {day_index + 1}: {pinned_signature}")
        for candidate in candidates:
            if picked is not None:
                break
            if candidate.signature in used_signatures:
                continue
            if candidate.primary_sweep in used_primary_sweeps:
                continue
            if day_index - last_key_seen.get(candidate.key, -999) < 18:
                continue
            picked = candidate
            break
        if picked is None:
            for candidate in candidates:
                if candidate.signature in used_signatures:
                    continue
                if candidate.primary_sweep in used_primary_sweeps:
                    continue
                picked = candidate
                break
        if picked is None:
            raise RuntimeError(f"No Kilter candidate for day {day_index + 1} key length {key_length}")
        chosen.append(picked)
        used_signatures.add(picked.signature)
        used_primary_sweeps.add(picked.primary_sweep)
        last_key_seen[picked.key] = day_index

    return chosen


def date_range(start: date, days: int) -> Iterable[date]:
    for offset in range(days):
        yield start + timedelta(days=offset)


def puzzle_id(day_index: int, candidate: Candidate) -> str:
    return f"kilter-{day_index + 1:03d}-{candidate.key.lower()}-{''.join(candidate.letters).lower()}"


def build_pack_payload(chosen: Sequence[Candidate], candidate_depth: dict[int, int]) -> dict:
    entries = []
    for day_index, (day, candidate) in enumerate(zip(date_range(PACK_START, PACK_DAYS), chosen)):
        sweeps = set(candidate.sweeps)
        available_core_score = sum(core_score(word, sweeps) for word in candidate.core_words)
        entries.append(
            {
                "id": puzzle_id(day_index, candidate),
                "date": day.isoformat(),
                "dayIndex": day_index,
                "key": candidate.key,
                "letters": list(candidate.letters),
                "coreWords": list(candidate.core_words),
                "bonusWords": list(candidate.bonus_words),
                "sweeps": list(candidate.sweeps),
                "availableCoreScore": available_core_score,
                "signature": candidate.signature,
            }
        )

    return {
        "version": "1.0.0",
        "generatedAt": "2026-05-28T00:00:00Z",
        "seed": SEED,
        "startDate": PACK_START.isoformat(),
        "endDate": (PACK_START + timedelta(days=PACK_DAYS - 1)).isoformat(),
        "days": PACK_DAYS,
        "keyMix": {str(key): value for key, value in KEY_LENGTH_TOTALS.items()},
        "candidateDepth": {str(key): value for key, value in candidate_depth.items()},
        "sweepBonus": SWEEP_BONUS,
        "entries": entries,
    }


def expected_date_for_index(index: int) -> str:
    return (PACK_START + timedelta(days=index)).isoformat()


def audit_pack(payload: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    entries = payload.get("entries", [])
    common_core, _, _, _ = load_word_entries()
    common_core_by_mask = index_by_mask(common_core)

    if len(entries) != PACK_DAYS:
        errors.append(f"Expected {PACK_DAYS} entries, found {len(entries)}.")

    signatures: set[str] = set()
    key_counts: Counter[int] = Counter()
    single_sweep_count = 0

    for index, entry in enumerate(entries):
        prefix = f"Day {index + 1}"
        date_key = entry.get("date")
        if date_key != expected_date_for_index(index):
            errors.append(f"{prefix}: expected date {expected_date_for_index(index)}, found {date_key}.")

        key = str(entry.get("key", ""))
        letters = entry.get("letters", [])
        core_words = entry.get("coreWords", [])
        bonus_words = entry.get("bonusWords", [])
        sweeps = entry.get("sweeps", [])

        if len(key) not in (1, 2, 3):
            errors.append(f"{prefix}: bad key `{key}`.")
            continue
        key_counts[len(key)] += 1
        if len(set(key)) != len(key):
            warnings.append(f"{prefix}: key `{key}` repeats a letter.")
        if not isinstance(letters, list) or len(letters) != 6 or len(set(letters)) != 6:
            errors.append(f"{prefix}: loose letters must be 6 distinct letters.")
            continue

        allowed = set(key) | set(letters)
        signature = f"{key}:{''.join(letters)}"
        if signature in signatures:
            errors.append(f"{prefix}: duplicate signature {signature}.")
        signatures.add(signature)

        target_min, target_max = CORE_TARGETS[len(key)]
        if not (target_min <= len(core_words) <= target_max):
            errors.append(f"{prefix}: core count {len(core_words)} outside {target_min}-{target_max}.")
        if not (1 <= len(sweeps) <= 2):
            errors.append(f"{prefix}: sweep count {len(sweeps)} outside 1-2.")
        if len(sweeps) == 1:
            single_sweep_count += 1

        overlap = set(core_words) & set(bonus_words)
        if overlap:
            errors.append(f"{prefix}: core/bonus overlap {sorted(overlap)[:4]}.")

        for bucket_name, words in (("core", core_words), ("bonus", bonus_words)):
            for word in words:
                if not re.fullmatch(r"[A-Z]{4,14}", word):
                    errors.append(f"{prefix}: bad {bucket_name} word `{word}`.")
                if key not in word:
                    errors.append(f"{prefix}: {bucket_name} word `{word}` lacks key `{key}`.")
                if any(letter not in allowed for letter in word):
                    errors.append(f"{prefix}: {bucket_name} word `{word}` uses letters outside bank.")
        accepted_word_set = set(core_words) | set(bonus_words)
        omitted_obvious = find_omitted_obvious_words(entry, common_core_by_mask)
        if omitted_obvious:
            preview = ", ".join(omitted_obvious[:8])
            if len(omitted_obvious) > 8:
                preview += f", +{len(omitted_obvious) - 8} more"
            errors.append(f"{prefix}: omitted obvious core words {preview}.")
        for word in sweeps:
            if word not in core_words:
                errors.append(f"{prefix}: sweep `{word}` is not a core word.")
            if not set(letters).issubset(set(word)):
                errors.append(f"{prefix}: sweep `{word}` misses loose letters.")
            rejection_reason = sweep_rejection_reason(word)
            if rejection_reason:
                warnings.append(f"{prefix}: sweep `{word}` fails editorial sweep gate ({rejection_reason}).")
            if is_simple_plural(word, accepted_word_set):
                warnings.append(f"{prefix}: sweep `{word}` may read as a plural.")

        families = defaultdict(list)
        for word in core_words:
            family = re.sub(r"(?:S|ES|ED|ER)$", "", word)
            families[family].append(word)
        crowded = [words for words in families.values() if len(words) >= 4]
        if crowded:
            warnings.append(f"{prefix}: crowded word family {crowded[0][:5]}.")

    if dict(key_counts) != KEY_LENGTH_TOTALS:
        errors.append(f"Key mix mismatch: expected {KEY_LENGTH_TOTALS}, found {dict(key_counts)}.")
    if single_sweep_count < MIN_SWEEP_SINGLE_COUNT:
        errors.append(
            f"Expected at least {MIN_SWEEP_SINGLE_COUNT} one-sweep days, found {single_sweep_count}."
        )

    return errors, warnings


def trusted_non_dictionary_words(entry: dict, dictionary_words: set[str]) -> list[str]:
    words = set(entry.get("coreWords", [])) | set(entry.get("bonusWords", []))
    return sorted_words(
        word
        for word in words
        if word not in dictionary_words and is_trusted_word_source(word, dictionary_words)
    )


def table(rows: Sequence[dict], columns: Sequence[tuple[str, str]]) -> list[str]:
    if not rows:
        return ["None."]
    lines = [
        "| " + " | ".join(label for label, _ in columns) + " |",
        "| " + " | ".join("---" for _ in columns) + " |",
    ]
    for row in rows:
        values = [str(row.get(key, "")).replace("\n", " ") for _, key in columns]
        lines.append("| " + " | ".join(values) + " |")
    return lines


def audit_markdown(payload: dict, errors: Sequence[str], warnings: Sequence[str]) -> str:
    entries = payload.get("entries", [])
    dictionary_words = read_system_dictionary()
    key_counts = Counter(len(entry["key"]) for entry in entries)
    sweep_counts = Counter(len(entry["sweeps"]) for entry in entries)
    core_counts = [len(entry["coreWords"]) for entry in entries]
    bonus_counts = [len(entry["bonusWords"]) for entry in entries]
    score_counts = [entry["availableCoreScore"] for entry in entries]
    candidate_depth = payload.get("candidateDepth", {})
    key_mix_parts = [
        f"{length}-letter {key_counts[length]} ({key_counts[length] / len(entries) * 100:.0f}%)"
        for length in (1, 2, 3)
    ]

    lines = [
        "# Composed Editorial Audit",
        "",
        f"- Pack: {payload.get('startDate')} through {payload.get('endDate')}",
        f"- Days: {len(entries)}",
        f"- Key mix: {', '.join(key_mix_parts)}",
        "- Candidate depth: "
        + ", ".join(
            f"{length}-letter {candidate_depth.get(str(length), 'n/a')}"
            for length in (1, 2, 3)
        ),
        f"- Sweep counts: 1-sweep {sweep_counts[1]}, 2-sweep {sweep_counts[2]}",
        f"- Core words: min {min(core_counts)}, max {max(core_counts)}, average {sum(core_counts) / len(core_counts):.1f}",
        f"- Bonus words: min {min(bonus_counts)}, max {max(bonus_counts)}, average {sum(bonus_counts) / len(bonus_counts):.1f}",
        f"- Available core score: min {min(score_counts)}, max {max(score_counts)}, average {sum(score_counts) / len(score_counts):.1f}",
        f"- Live errors: {len(errors)}",
        f"- Live warnings: {len(warnings)}",
        "",
    ]

    if errors:
        lines.extend(["## Errors", ""])
        lines.extend(f"- {error}" for error in errors)
        lines.append("")
    if warnings:
        lines.extend(["## Warnings", ""])
        lines.extend(f"- {warning}" for warning in warnings)
        lines.append("")
    if not errors and not warnings:
        lines.extend(
            [
                "## Verdict",
                "",
                "Pass. The live 400-day Composed pack has zero unresolved generator, rules, or sweep-editorial warnings.",
                "",
            ]
        )

    trust_rows = []
    for entry in entries:
        trusted_words = trusted_non_dictionary_words(entry, dictionary_words)
        if trusted_words:
            trust_rows.append(
                {
                    "date": entry["date"],
                    "center": entry["key"],
                    "letters": "".join(entry["letters"]),
                    "count": len(trusted_words),
                    "words": ", ".join(trusted_words[:16])
                    + (f", +{len(trusted_words) - 16} more" if len(trusted_words) > 16 else ""),
                }
            )
    lines.extend(
        [
            "## Word-Trust Additions",
            "",
            "These accepted words come from wordfreq plus Composed trust rules rather than the local system dictionary.",
            f"- Days with trust additions: {len(trust_rows)}",
            f"- Total trust additions: {sum(row['count'] for row in trust_rows)}",
            "",
        ]
    )
    lines.extend(
        table(
            sorted(trust_rows, key=lambda row: (-row["count"], row["date"]))[:30],
            [
                ("Date", "date"),
                ("Center", "center"),
                ("Letters", "letters"),
                ("Count", "count"),
                ("Words", "words"),
            ],
        )
    )
    lines.append("")

    lines.extend(["## Editorial Sweep Review", ""])
    flagged_sweeps = sorted(
        {
            word
            for entry in entries
            for word in entry["sweeps"]
            if sweep_rejection_reason(word)
        }
    )
    longest_sweeps = sorted(
        (
            (word, entry["date"], entry["key"], "".join(entry["letters"]))
            for entry in entries
            for word in entry["sweeps"]
        ),
        key=lambda item: (-len(item[0]), item[1], item[0]),
    )[:12]
    two_sweep_entries = [entry for entry in entries if len(entry["sweeps"]) == 2]
    lines.append(
        "- Rejected/flagged sweep terms in live pack: "
        + (", ".join(flagged_sweeps) if flagged_sweeps else "None")
    )
    lines.append("- Longest live sweeps reviewed:")
    for word, date_key, key, letters in longest_sweeps:
        lines.append(f"  - {date_key}: {word} ({len(word)} letters), center {key} / {letters}")
    all_sweeps = sorted({word for entry in entries for word in entry["sweeps"]})
    lines.append(f"- All live Sweep terms reviewed: {len(all_sweeps)}")
    for index in range(0, len(all_sweeps), 20):
        lines.append(f"  - {', '.join(all_sweeps[index:index + 20])}")
    lines.append(f"- Two-sweep days reviewed: {len(two_sweep_entries)}")
    if two_sweep_entries:
        for entry in two_sweep_entries[:12]:
            lines.append(
                f"  - {entry['date']}: center {entry['key']} / {''.join(entry['letters'])}, "
                f"Sweeps {', '.join(entry['sweeps'])}"
            )
        if len(two_sweep_entries) > 12:
            lines.append(f"  - ...and {len(two_sweep_entries) - 12} more")
    lines.append("")

    lines.extend(["## Outlier Review", ""])
    outlier_sets = [
        ("Lowest core counts", sorted(entries, key=lambda entry: (len(entry["coreWords"]), entry["date"]))[:5]),
        ("Highest core counts", sorted(entries, key=lambda entry: (-len(entry["coreWords"]), entry["date"]))[:5]),
        ("Highest bonus counts", sorted(entries, key=lambda entry: (-len(entry["bonusWords"]), entry["date"]))[:5]),
        ("Highest available scores", sorted(entries, key=lambda entry: (-entry["availableCoreScore"], entry["date"]))[:5]),
    ]
    for label, selected_entries in outlier_sets:
        lines.append(f"- {label}:")
        for entry in selected_entries:
            lines.append(
                f"  - {entry['date']}: center {entry['key']} / {''.join(entry['letters'])}, "
                f"{len(entry['coreWords'])} core, {len(entry['bonusWords'])} bonus, "
                f"{entry['availableCoreScore']} points, Sweep {', '.join(entry['sweeps'])}"
            )
    lines.append("")

    lines.extend(["## Opening 14 Days", ""])
    for entry in entries[:14]:
        lines.append(
            f"- {entry['date']}: center {entry['key']} / {''.join(entry['letters'])} "
            f"({len(entry['coreWords'])} core, {len(entry['bonusWords'])} bonus, "
            f"Sweep {', '.join(entry['sweeps'])})"
        )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    args = parse_args()

    if args.self_test_omitted_obvious:
        run_omitted_obvious_self_test()
        return

    if args.audit_only:
        if not PACK_OUT.exists():
            raise SystemExit("No Kilter pack found. Run `npm run build:kilter-pack` first.")
        payload = json.loads(PACK_OUT.read_text())
    else:
        core, bonus, accepted_bonus, raw_frequencies = load_word_entries()
        candidates_by_key_length = {
            key_length: build_candidates_for_key_length(key_length, core, bonus, accepted_bonus, raw_frequencies)
            for key_length in (1, 2, 3)
        }
        candidate_depth = {
            key_length: len(candidates)
            for key_length, candidates in candidates_by_key_length.items()
        }
        for key_length, candidates in candidates_by_key_length.items():
            required = KEY_LENGTH_TOTALS[key_length]
            if len(candidates) < required:
                raise RuntimeError(
                    f"Only {len(candidates)} Kilter candidates for key length {key_length}; need {required}."
                )
        payload = build_pack_payload(choose_pack(candidates_by_key_length), candidate_depth)
        PACK_OUT.write_text(json.dumps(payload, indent=2) + "\n")

    errors, warnings = audit_pack(payload)
    AUDIT_OUT.write_text(audit_markdown(payload, errors, warnings))
    if errors or warnings:
        for error in errors:
            print(f"ERROR: {error}")
        for warning in warnings:
            print(f"WARNING: {warning}")
        raise SystemExit(1)
    print(f"Kilter pack audit passed: {len(payload['entries'])} days, zero live warnings.")


if __name__ == "__main__":
    main()
