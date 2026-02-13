#!/usr/bin/env python3
"""Build a curated mini crossword bank with themed metadata and concise clues."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Set

from nltk.corpus import wordnet as wn
from wordfreq import top_n_list, zipf_frequency

BASE_DIR = Path(__file__).resolve().parents[1]
OUT_PATH = BASE_DIR / "src" / "data" / "miniCrosswordBank.json"

MIN_THREE_COUNT = 700
MIN_FIVE_COUNT = 900
SOURCE_WORD_LIMIT = 260_000
THREE_ZIPF_START = 3.0
FIVE_ZIPF_START = 3.85
ZIPF_FLOOR = 2.85

THEMES = [
    {
        "id": "tech",
        "label": "Tech Pulse",
        "description": "Code, devices, and digital work.",
    },
    {
        "id": "internet-culture",
        "label": "Internet Culture",
        "description": "Viral slang, feeds, and social moments.",
    },
    {
        "id": "food",
        "label": "Food Finds",
        "description": "Snacks, drinks, and kitchen staples.",
    },
    {
        "id": "travel",
        "label": "Travel Mode",
        "description": "Routes, rides, and getaway vibes.",
    },
    {
        "id": "music",
        "label": "Music Mix",
        "description": "Rhythm, songs, and listening culture.",
    },
    {
        "id": "wellness",
        "label": "Wellness Reset",
        "description": "Habits for calm, health, and energy.",
    },
    {
        "id": "city-life",
        "label": "City Life",
        "description": "Urban routines, transit, and neighborhoods.",
    },
    {
        "id": "weekend",
        "label": "Weekend Mode",
        "description": "Rest, plans, and off-hours fun.",
    },
]

TEMPLATES = [
    {"id": "harbor-left", "rows": [".....", ".....", ".....", "##...", "##..."]},
    {"id": "harbor-right", "rows": [".....", ".....", ".....", "...##", "...##"]},
    {"id": "harbor-gates", "rows": [".....", ".....", ".....", "#...#", "#...#"]},
    {"id": "trail-left", "rows": ["##...", "##...", ".....", ".....", "....."]},
    {"id": "trail-right", "rows": ["...##", "...##", ".....", ".....", "....."]},
]

THEME_WORDS: Dict[str, Set[str]] = {
    "tech": {
        "app",
        "bot",
        "web",
        "cloud",
        "debug",
        "drone",
        "laser",
        "pixel",
        "robot",
        "server",
        "bytes",
        "coder",
        "model",
        "logic",
        "smart",
    },
    "internet-culture": {
        "gif",
        "app",
        "bot",
        "web",
        "likes",
        "meme",
        "reels",
        "share",
        "trend",
        "tweet",
        "viral",
        "story",
        "posts",
        "feeds",
        "emoji",
    },
    "food": {
        "tea",
        "pie",
        "egg",
        "ale",
        "apple",
        "bagel",
        "berry",
        "honey",
        "latte",
        "pizza",
        "ramen",
        "salsa",
        "snack",
        "spice",
        "sushi",
        "toast",
    },
    "travel": {
        "air",
        "bus",
        "cab",
        "map",
        "beach",
        "drive",
        "hotel",
        "local",
        "metro",
        "route",
        "train",
        "trips",
        "board",
        "cabin",
        "flyer",
    },
    "music": {
        "rap",
        "pop",
        "jam",
        "band",
        "beats",
        "chord",
        "drums",
        "lyric",
        "notes",
        "piano",
        "radio",
        "album",
        "songs",
    },
    "wellness": {
        "gym",
        "run",
        "spa",
        "zen",
        "calm",
        "clean",
        "fresh",
        "focus",
        "peace",
        "sleep",
        "water",
        "vigor",
        "reset",
    },
    "city-life": {
        "bus",
        "cab",
        "bar",
        "park",
        "urban",
        "block",
        "crowd",
        "metro",
        "tower",
        "plaza",
        "bikes",
        "shops",
        "roads",
    },
    "weekend": {
        "fun",
        "nap",
        "sun",
        "trip",
        "chill",
        "games",
        "hikes",
        "movie",
        "party",
        "plans",
        "relax",
        "beach",
        "sleep",
    },
}

MODERN_WORDS = {
    "app",
    "bot",
    "emoji",
    "feeds",
    "gif",
    "likes",
    "meme",
    "model",
    "pixel",
    "posts",
    "reels",
    "share",
    "story",
    "trend",
    "tweet",
    "viral",
    "web",
}

COMMON_3_SUPPLEMENT = {
    "ace",
    "aid",
    "aim",
    "air",
    "ale",
    "ant",
    "ape",
    "arc",
    "arm",
    "ash",
    "bag",
    "bar",
    "bat",
    "bee",
    "bet",
    "box",
    "bus",
    "cab",
    "cap",
    "cat",
    "cow",
    "cup",
    "dad",
    "dog",
    "dry",
    "ear",
    "egg",
    "fan",
    "fig",
    "fox",
    "gas",
    "gel",
    "gym",
    "ham",
    "hat",
    "hen",
    "ice",
    "jam",
    "jar",
    "jet",
    "key",
    "kid",
    "leg",
    "map",
    "mix",
    "nap",
    "net",
    "nut",
    "oak",
    "oil",
    "owl",
    "pan",
    "pet",
    "pie",
    "pin",
    "pot",
    "rap",
    "rat",
    "red",
    "rib",
    "rug",
    "run",
    "rye",
    "saw",
    "sea",
    "set",
    "sip",
    "sky",
    "sun",
    "tea",
    "ten",
    "tie",
    "tin",
    "top",
    "toy",
    "van",
    "vet",
    "via",
    "web",
    "wet",
    "wig",
    "win",
    "yak",
    "yam",
    "zip",
    "car",
    "mom",
    "man",
    "boy",
    "day",
    "end",
    "fix",
    "hip",
    "pop",
    "era",
    "lap",
    "jam",
    "mix",
    "run",
    "sun",
    "win",
    "row",
    "wow",
    "act",
    "ask",
    "far",
    "odd",
    "eat",
    "yes",
    "yet",
    "age",
    "bed",
    "cow",
}

STOPWORD_3 = {
    "all",
    "and",
    "any",
    "are",
    "but",
    "did",
    "for",
    "had",
    "has",
    "her",
    "him",
    "his",
    "how",
    "its",
    "may",
    "new",
    "not",
    "now",
    "off",
    "old",
    "one",
    "our",
    "out",
    "she",
    "the",
    "too",
    "use",
    "was",
    "who",
    "why",
    "you",
}

LOW_SIGNAL_WORDS = {
    "acs",
    "adp",
    "asl",
    "ats",
    "bce",
    "cfo",
    "cli",
    "dba",
    "dci",
    "ecg",
    "eeg",
    "epl",
    "etf",
    "fha",
    "fob",
    "fao",
    "gsa",
    "idc",
    "iis",
    "irc",
    "isi",
    "itt",
    "lis",
    "mfa",
    "nys",
    "okc",
    "otc",
    "pda",
    "poc",
    "raf",
    "ron",
    "roi",
    "sba",
    "sas",
    "sec",
    "ses",
    "sse",
    "ssa",
    "tai",
    "tao",
    "tot",
    "ucl",
    "uva",
    "wto",
    "xxi",
    "xix",
    "ani",
    "ans",
    "ara",
    "ars",
    "dea",
    "ems",
    "ese",
    "hes",
    "ken",
    "nih",
}

BLACKLIST = {
    "anal",
    "ass",
    "bitch",
    "boob",
    "cum",
    "cunt",
    "dick",
    "fag",
    "fuck",
    "nig",
    "porn",
    "rape",
    "sex",
    "shit",
    "tit",
    "whore",
}

BLOCKED_ENTRY_LEXNAMES = {
    "noun.person",
    "noun.location",
}

BLOCKED_CLUE_LEXNAMES = {
    "noun.person",
    "noun.quantity",
    "noun.relation",
}

BAD_DEF_SNIPPETS = {
    "abbreviation",
    "acronym",
    "initialism",
    "roman numeral",
    "letter of",
    "city in",
    "village in",
    "capital of",
    "province",
}

MANUAL_CLUES: Dict[str, List[str]] = {
    "APP": ["Phone download from a store", "Tap this icon to launch, maybe?"],
    "BOT": ["Automated account online", "Not quite human in your DMs?"],
    "WEB": ["Browser's home turf", "Internet network, shorthand"],
    "GIF": ["Looping reaction image online", "Animated reply in the group chat?"],
    "MEME": ["Viral joke format online", "Image macro passed around all day?"],
    "TREND": ["What's rising on your feed", "Viral direction online?"],
    "VIRAL": ["Spreading rapidly online", "Like a post everyone suddenly shares?"],
    "LIKES": ["Hearts or thumbs on a post", "Feed metrics people chase"],
    "REELS": ["Short videos on social apps", "Scroll-stopping clips online"],
    "TWEET": ["Short post on X", "Bird app post, once"],
    "SHARE": ["Send to your followers", "Pass along to your group chat"],
    "PIXEL": ["Tiny unit on a display", "Smallest screen dot, basically"],
    "ROBOT": ["Machine helper with tasks", "Factory worker that never sleeps?"],
    "CLOUD": ["Online place to back up files", "Remote storage in tech-speak"],
    "DEBUG": ["Remove code errors", "Squash a software issue, say"],
    "LATTE": ["Espresso drink with milk", "Cafe order with foam art"],
    "PIZZA": ["Slice in a cardboard box", "Friday night delivery classic"],
    "RAMEN": ["Noodle bowl with broth", "Steamy soup with noodles"],
    "SUSHI": ["Rice-and-fish roll", "Wasabi's usual partner"],
    "BAGEL": ["Ring-shaped breakfast bread", "Toasted brunch bread ring"],
    "TRAIN": ["Railway transport", "Commute option on tracks"],
    "HOTEL": ["Traveler's overnight stop", "Place to check in on vacation"],
    "METRO": ["City rail line", "Urban train system"],
    "ROUTE": ["Planned path to a destination", "Way from A to B"],
    "BEATS": ["Rhythms in a track", "Pulses in a song"],
    "CHORD": ["Group of notes played together", "Guitar shape with several tones"],
    "LYRIC": ["Song's written line", "Words you sing along to"],
    "ALBUM": ["Collection of songs", "Full-length music release"],
    "PIANO": ["88-key instrument", "Keyboard in a recital hall"],
    "RADIO": ["Broadcast audio device", "AM/FM listener"],
    "CALM": ["Free from stress", "Quiet and steady mood"],
    "SLEEP": ["Nightly recharge", "Get some rest"],
    "FOCUS": ["Concentrate your attention", "Sharpen your mental lens"],
    "PEACE": ["State of quiet harmony", "Calm between conflicts"],
    "WATER": ["Hydration essential", "Drink this after a workout"],
    "URBAN": ["Related to city life", "Not rural"],
    "BLOCK": ["City square section", "Stop, as in defense"],
    "CROWD": ["Packed group of people", "Busy event turnout"],
    "TOWER": ["Tall city structure", "Skyline standout"],
    "PLAZA": ["Open city square", "Downtown gathering spot"],
    "CHILL": ["Relax and take it easy", "Low-key weekend vibe"],
    "MOVIE": ["Big-screen story", "Cinema feature"],
    "GAMES": ["Arcade or board options", "Weekend competition picks"],
    "PARTY": ["Social gathering", "Birthday bash, perhaps"],
    "RELAX": ["Unwind", "Kick back, maybe?"],
    "WOW": ["Reaction to something impressive", "What a surprise!"],
}

BONUS_WORDS = [
    {"answer": "NETWORK", "themeId": "tech", "clue": "Connected system of devices"},
    {"answer": "CIRCUIT", "themeId": "tech", "clue": "Path electricity follows"},
    {"answer": "BROWSER", "themeId": "tech", "clue": "App used to visit websites"},
    {"answer": "HASHTAG", "themeId": "internet-culture", "clue": "Topic marker in social posts"},
    {"answer": "EMOJIFY", "themeId": "internet-culture", "clue": "Add little icons to text"},
    {"answer": "REPOSTS", "themeId": "internet-culture", "clue": "Shares content again online"},
    {"answer": "DESSERT", "themeId": "food", "clue": "Sweet course after dinner"},
    {"answer": "BARISTA", "themeId": "food", "clue": "Cafe pro pulling espresso shots"},
    {"answer": "COOKING", "themeId": "food", "clue": "Making a meal from scratch"},
    {"answer": "AIRPORT", "themeId": "travel", "clue": "Place with gates and runways"},
    {"answer": "LAYOVER", "themeId": "travel", "clue": "Mid-journey stop between flights"},
    {"answer": "GETAWAY", "themeId": "travel", "clue": "Short trip to recharge"},
    {"answer": "BEATBOX", "themeId": "music", "clue": "Mouth-made rhythm performance"},
    {"answer": "GUITARS", "themeId": "music", "clue": "String instruments in many bands"},
    {"answer": "RHYTHMS", "themeId": "music", "clue": "Recurring patterns of sound"},
    {"answer": "BALANCE", "themeId": "wellness", "clue": "Steady state in body and mind"},
    {"answer": "MINDFUL", "themeId": "wellness", "clue": "Present and attentive"},
    {"answer": "BREATHE", "themeId": "wellness", "clue": "Inhale and exhale slowly"},
    {"answer": "SKYLINE", "themeId": "city-life", "clue": "Silhouette of tall buildings"},
    {"answer": "SUBWAYS", "themeId": "city-life", "clue": "Underground city rail systems"},
    {"answer": "TRAFFIC", "themeId": "city-life", "clue": "Road congestion in rush hour"},
    {"answer": "HANGOUT", "themeId": "weekend", "clue": "Casual place to spend free time"},
    {"answer": "PICNICS", "themeId": "weekend", "clue": "Outdoor meals on blankets"},
    {"answer": "OUTDOOR", "themeId": "weekend", "clue": "Like many weekend activities"},
]


def clean_definition(text: str, answer: str) -> Optional[str]:
    clue = re.sub(r"\([^)]*\)", "", text)
    clue = clue.replace("e.g.", "for example")
    clue = clue.split(";")[0]
    clue = clue.strip(" .,\t")
    if not clue:
        return None

    clue = re.sub(r"\s+", " ", clue)
    for lead in ("a ", "an ", "the ", "to "):
        if clue.lower().startswith(lead):
            clue = clue[len(lead) :]
            break
    clue = clue.strip()
    if not clue:
        return None

    words = clue.split()
    if len(words) > 10:
        clue = " ".join(words[:10])
    clue = clue[:60].rstrip(" ,;:-")
    clue = clue[0].upper() + clue[1:] if clue else clue

    if not clue:
        return None
    if answer.lower() in clue.lower():
        return None
    if clue.count(".") > 1:
        return None
    return clue


def has_allowed_synset(word: str) -> bool:
    synsets = wn.synsets(word)
    if not synsets:
        return False
    for syn in synsets:
        if syn.lexname() in BLOCKED_ENTRY_LEXNAMES:
            continue
        definition = syn.definition().lower()
        if any(snippet in definition for snippet in BAD_DEF_SNIPPETS):
            continue
        return True
    return False


def build_auto_clues(answer: str) -> List[str]:
    lower = answer.lower()
    clues: List[str] = []
    synsets = wn.synsets(lower)
    for syn in synsets:
        if syn.lexname() in BLOCKED_CLUE_LEXNAMES:
            continue
        cleaned = clean_definition(syn.definition(), answer)
        if not cleaned:
            continue
        clues.append(cleaned)
        if len(clues) >= 2:
            break

    if not clues:
        return []

    playful = clues[0]
    if "?" not in playful:
        playful = f"{playful}?" if len(playful) > 42 else f"{playful}, maybe?"
    if playful != clues[0]:
        clues.append(playful)

    normalized: List[str] = []
    seen = set()
    for clue in clues:
        c = clue.replace("\n", " ").strip()
        if not c:
            continue
        if len(c) > 60:
            c = c[:60].rstrip(" ,;:-")
        if c.lower() in seen:
            continue
        seen.add(c.lower())
        normalized.append(c)
    return normalized[:3]


def difficulty_for(word: str) -> str:
    z = zipf_frequency(word.lower(), "en")
    if len(word) == 3:
        if z >= 4.3:
            return "easy"
        if z >= 3.15:
            return "medium"
        return "hard"
    if z >= 4.6:
        return "easy"
    if z >= 3.8:
        return "medium"
    return "hard"


def candidate_allowed(word: str, target_len: int, threshold: float) -> bool:
    if len(word) != target_len:
        return False
    if not re.fullmatch(r"[a-z]+", word):
        return False
    if word in BLACKLIST or word in LOW_SIGNAL_WORDS:
        return False
    if target_len == 3 and word in STOPWORD_3:
        return False
    if zipf_frequency(word, "en") < threshold:
        return False
    if sum(ch in "aeiouy" for ch in word) == 0:
        return False
    return has_allowed_synset(word) or word.upper() in MANUAL_CLUES


def collect_candidates(target_len: int, min_count: int, threshold_start: float) -> List[str]:
    source = top_n_list("en", SOURCE_WORD_LIMIT)

    threshold = threshold_start
    best: List[str] = []
    while threshold >= ZIPF_FLOOR:
        seen = set()
        candidate: List[str] = []
        for word in source:
            w = word.strip().lower()
            if w in seen:
                continue
            if not candidate_allowed(w, target_len, threshold):
                continue
            seen.add(w)
            candidate.append(w)

        best = candidate
        if len(candidate) >= min_count:
            break
        threshold -= 0.05

    return [w.upper() for w in best]


def clean_clue_options(answer: str, clue_options: List[str]) -> List[str]:
    cleaned_options = []
    seen = set()
    for clue in clue_options:
        c = clue.strip().replace("\n", " ")
        if not c:
            continue
        if answer.lower() in c.lower():
            continue
        if len(c) > 60:
            continue
        if len(c.split()) > 12:
            continue
        if c.lower() in seen:
            continue
        seen.add(c.lower())
        cleaned_options.append(c)
    return cleaned_options[:3]


def build_entries() -> List[dict]:
    three = collect_candidates(3, MIN_THREE_COUNT, THREE_ZIPF_START)
    five = collect_candidates(5, MIN_FIVE_COUNT, FIVE_ZIPF_START)

    themed_manual_words = {
        word.upper()
        for words in THEME_WORDS.values()
        for word in words
        if len(word) in (3, 5)
    }

    three_set = set(three)
    five_set = set(five)
    three_set.update(word.upper() for word in COMMON_3_SUPPLEMENT)
    for word in themed_manual_words:
        if len(word) == 3:
            three_set.add(word)
        elif len(word) == 5:
            five_set.add(word)

    all_words = sorted(
        three_set | five_set,
        key=lambda answer: (-zipf_frequency(answer.lower(), "en"), answer),
    )

    entries: List[dict] = []
    for answer in all_words:
        lower = answer.lower()

        tags = sorted([theme_id for theme_id, words in THEME_WORDS.items() if lower in words])
        is_modern = lower in MODERN_WORDS

        clue_options = MANUAL_CLUES.get(answer)
        if not clue_options:
            clue_options = build_auto_clues(answer)

        cleaned_options = clean_clue_options(answer, clue_options)
        if not cleaned_options:
            cleaned_options = [f"Everyday {len(answer)}-letter word"]

        entry = {
            "answer": answer,
            "clueOptions": cleaned_options,
            "difficulty": difficulty_for(answer),
            "themeTags": tags,
            "isModern": is_modern,
            "isBonusEligible": False,
        }
        entries.append(entry)

    entries.sort(key=lambda item: item["answer"])
    return entries


def validate(entries: List[dict], bonus_words: List[dict]) -> None:
    three_count = sum(1 for e in entries if len(e["answer"]) == 3)
    five_count = sum(1 for e in entries if len(e["answer"]) == 5)
    if three_count < MIN_THREE_COUNT:
        raise SystemExit(f"Need at least {MIN_THREE_COUNT} 3-letter entries, got {three_count}")
    if five_count < MIN_FIVE_COUNT:
        raise SystemExit(f"Need at least {MIN_FIVE_COUNT} 5-letter entries, got {five_count}")

    total_clues = sum(len(e["clueOptions"]) for e in entries)
    question_clues = sum(1 for e in entries for c in e["clueOptions"] if "?" in c)
    ratio = question_clues / total_clues if total_clues else 0
    if ratio < 0.12:
        raise SystemExit(f"Question-mark clue ratio too low: {ratio:.2%}")

    theme_ids = {theme["id"] for theme in THEMES}
    for bonus in bonus_words:
        answer = bonus["answer"]
        if len(answer) != 7 or not re.fullmatch(r"[A-Z]+", answer):
            raise SystemExit(f"Bonus word must be 7 letters: {answer}")
        if bonus["themeId"] not in theme_ids:
            raise SystemExit(f"Unknown bonus theme: {bonus['themeId']}")

    by_theme = {}
    for bonus in bonus_words:
        by_theme.setdefault(bonus["themeId"], 0)
        by_theme[bonus["themeId"]] += 1
    missing = [theme_id for theme_id in theme_ids if by_theme.get(theme_id, 0) == 0]
    if missing:
        raise SystemExit(f"Missing bonus words for themes: {', '.join(sorted(missing))}")


def main():
    entries = build_entries()
    bonus_words = [
        {
            "answer": item["answer"],
            "themeId": item["themeId"],
            "clue": item["clue"],
            "difficulty": "hard",
        }
        for item in BONUS_WORDS
    ]

    validate(entries, bonus_words)

    payload = {
        "themes": THEMES,
        "templates": TEMPLATES,
        "entries": entries,
        "bonusWords": bonus_words,
    }
    OUT_PATH.write_text(json.dumps(payload, indent=2) + "\n")

    three_count = sum(1 for e in entries if len(e["answer"]) == 3)
    five_count = sum(1 for e in entries if len(e["answer"]) == 5)
    print(f"Wrote {OUT_PATH}")
    print(f"entries: {len(entries)} | 3-letter: {three_count} | 5-letter: {five_count}")


if __name__ == "__main__":
    main()
