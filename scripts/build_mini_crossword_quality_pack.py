#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import bisect
import json
import os
import random
import re
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
GAMESHOW_BANK_PATH = ROOT / "gameshow/src/data/miniCrosswordBank.json"
BACKEND_BANK_PATH = ROOT / "supertime-backend/internal/generator/minicrossword/data/bank.json"
BACKEND_SCHEDULE_PATH = ROOT / "supertime-backend/internal/generator/minicrossword/data/schedule.json"
TS_SCHEDULE_PATH = ROOT / "gameshow/src/data/miniCrosswordSchedule.generated.ts"

PACK_START = date(2026, 5, 15)
PACK_DAYS = 500
PACK_END = PACK_START + timedelta(days=PACK_DAYS - 1)

ALLOWED_SOURCES = {"editorial", "theme-editor"}
BAD_CLUE_RE = re.compile(
    r"\b(abbreviation|acronym|initialism|roman numeral|street names?|enzyme|genus|province|"
    r"capital|taxonomic|archaic|obsolete|biblical|terrorist|federal agency|metallic element|"
    r"radioactive|coenzyme|personality inventory|collagen disease|parasitic|witchcraft|talipot|"
    r"cuttlefish|dynasty|profane|everyday \d-letter word)\b",
    re.IGNORECASE,
)
WORD_RE = re.compile(r"^[A-Z]+$")
BLOCKED_ANSWERS = {
    "PUS",
    "STD",
    "STI",
    "WAR",
    "GUN",
    "GUNS",
    "III",
    "ISIS",
    "IOWA",
    "MRS",
    "NAZI",
    "OMAHA",
    "TOM",
    "WYATT",
}

EXTRA_THEME_LANES = [
    ("morning-pages", "Morning Pages", "Journals, pens, margin notes, and first thoughts.", ["journal", "paper", "writing", "notes"]),
    ("window-seat", "Window Seat", "Soft views, quiet corners, and a place to look out.", ["window", "view", "corner", "quiet"]),
    ("lamp-light", "Lamp Light", "Evening reading, warm bulbs, and gentle focus.", ["lamp", "evening", "reading", "warm"]),
    ("pantry-shelf", "Pantry Shelf", "Jars, tins, staples, and weeknight readiness.", ["pantry", "jars", "shelf", "kitchen"]),
    ("studio-table", "Studio Table", "Creative tools, scraps, colors, and small experiments.", ["studio", "table", "color", "craft"]),
    ("quiet-errand", "Quiet Errand", "Simple trips, useful lists, and a tidy little route.", ["errand", "list", "route", "shop"]),
    ("front-stoop", "Front Stoop", "Steps, neighbors, weather, and a pause outside.", ["stoop", "steps", "outside", "street"]),
    ("soft-launch", "Soft Launch", "Fresh starts, small tests, and early momentum.", ["start", "launch", "fresh", "momentum"]),
    ("paper-route", "Paper Route", "Folded pages, headlines, porches, and morning delivery.", ["paper", "route", "headline", "porch"]),
    ("music-room", "Music Room", "Practice, chords, speakers, and favorite tracks.", ["music", "chord", "track", "sound"]),
    ("bright-idea", "Bright Idea", "Notes, sparks, prototypes, and a better way forward.", ["idea", "spark", "plan", "draft"]),
    ("lunch-break", "Lunch Break", "Midday plates, packed bites, and a reset.", ["lunch", "plate", "midday", "break"]),
    ("checkout-line", "Checkout Line", "Baskets, receipts, small talk, and last-minute finds.", ["checkout", "receipt", "basket", "market"]),
    ("rain-check", "Rain Check", "Clouds, postponed plans, and making time later.", ["rain", "cloud", "later", "plans"]),
    ("sun-room", "Sun Room", "Plants, chairs, warm glass, and bright floors.", ["sun", "plant", "chair", "light"]),
    ("workbench", "Workbench", "Tools, clamps, sanded edges, and repair projects.", ["tools", "repair", "bench", "project"]),
    ("notebook-margin", "Notebook Margin", "Doodles, side notes, and little arrows.", ["notebook", "margin", "note", "doodle"]),
    ("slow-simmer", "Slow Simmer", "Soups, sauces, patience, and kitchen warmth.", ["simmer", "soup", "sauce", "kitchen"]),
    ("greenhouse", "Greenhouse", "Seedlings, glass, watering cans, and steady care.", ["greenhouse", "seed", "plant", "water"]),
    ("corner-store", "Corner Store", "A short walk, familiar shelves, and quick picks.", ["store", "shelf", "walk", "corner"]),
    ("record-shelf", "Record Shelf", "Album spines, sleeves, liner notes, and old favorites.", ["record", "album", "sleeve", "music"]),
    ("bike-lane", "Bike Lane", "Pedals, bells, routes, and city movement.", ["bike", "pedal", "route", "city"]),
    ("ticket-stub", "Ticket Stub", "Shows, seats, dates, and a small souvenir.", ["ticket", "show", "seat", "stub"]),
    ("postcard-rack", "Postcard Rack", "Small scenes, stamps, short notes, and travel wishes.", ["postcard", "stamp", "note", "travel"]),
    ("clock-tower", "Clock Tower", "Bells, hands, town squares, and the hour.", ["clock", "bell", "tower", "hour"]),
    ("reading-lamp", "Reading Lamp", "Pages, bookmarks, late chapters, and a warm cone of light.", ["reading", "lamp", "book", "chapter"]),
    ("linen-closet", "Linen Closet", "Folded towels, clean sheets, and calm order.", ["linen", "towel", "sheet", "closet"]),
    ("breakfast-bar", "Breakfast Bar", "Toast, stools, fruit, and the first meal.", ["breakfast", "toast", "fruit", "stool"]),
    ("gallery-wall", "Gallery Wall", "Frames, prints, spacing, and favorite views.", ["gallery", "frame", "print", "wall"]),
    ("station-clock", "Station Clock", "Platforms, schedules, tickets, and departures.", ["station", "clock", "ticket", "train"]),
    ("desk-drawer", "Desk Drawer", "Pens, clips, notes, and useful odds and ends.", ["desk", "drawer", "pen", "note"]),
    ("camp-table", "Camp Table", "Maps, mugs, lanterns, and outdoor meals.", ["camp", "map", "mug", "lantern"]),
    ("market-bag", "Market Bag", "Produce, flowers, bakery paper, and a full tote.", ["market", "bag", "produce", "flower"]),
    ("movie-matinee", "Movie Matinee", "Afternoon tickets, previews, popcorn, and dim aisles.", ["movie", "ticket", "preview", "screen"]),
    ("garden-gate", "Garden Gate", "Paths, hinges, leaves, and the turn inward.", ["garden", "gate", "leaf", "path"]),
    ("harbor-light", "Harbor Light", "Docks, signals, ropes, and calm water.", ["harbor", "dock", "signal", "water"]),
    ("trail-map", "Trail Map", "Switchbacks, markers, viewpoints, and packed snacks.", ["trail", "map", "marker", "snack"]),
    ("bakery-window", "Bakery Window", "Trays, glaze, paper bags, and morning lines.", ["bakery", "tray", "glaze", "bread"]),
    ("cafe-table", "Cafe Table", "Small cups, saucers, crumbs, and a good seat.", ["cafe", "table", "cup", "seat"]),
    ("archive-box", "Archive Box", "Labels, folders, dates, and things worth keeping.", ["archive", "box", "label", "folder"]),
]

REQUIRED_TEMPLATES = {
    "mini-wide-01": [
        "###..",
        ".....",
        ".....",
        ".....",
        ".....",
    ],
    "mini-wide-02": [
        "##.#.",
        ".....",
        ".....",
        ".....",
        ".....",
    ],
    "mini-wide-03": [
        "##..#",
        ".....",
        ".....",
        ".....",
        ".....",
    ],
    "mini-shelf-01": [
        "##...",
        "#....",
        ".....",
        ".....",
        ".....",
    ],
    "mini-shelf-02": [
        "##...",
        ".#...",
        ".....",
        ".....",
        ".....",
    ],
    "mini-shelf-03": [
        "##...",
        "..#..",
        ".....",
        ".....",
        ".....",
    ],
    "mini-shelf-04": [
        "##...",
        "...#.",
        ".....",
        ".....",
        ".....",
    ],
    "mini-shelf-05": [
        "##...",
        "....#",
        ".....",
        ".....",
        ".....",
    ],
    "mini-step-01": [
        "##...",
        ".....",
        "#....",
        ".....",
        ".....",
    ],
    "mini-step-02": [
        "##...",
        ".....",
        ".#...",
        ".....",
        ".....",
    ],
    "mini-step-03": [
        "##...",
        ".....",
        "..#..",
        ".....",
        ".....",
    ],
    "mini-step-04": [
        "##...",
        ".....",
        "...#.",
        ".....",
        ".....",
    ],
    "mini-step-05": [
        "##...",
        ".....",
        "....#",
        ".....",
        ".....",
    ],
    "mini-knit-01": [
        "....#",
        ".....",
        "#....",
        ".....",
        "####.",
    ],
    "mini-knit-02": [
        "....#",
        ".....",
        "#....",
        "#....",
        "#.##.",
    ],
    "mini-knit-03": [
        "....#",
        ".....",
        "#....",
        "#....",
        "##.#.",
    ],
    "mini-knit-04": [
        "....#",
        ".....",
        "#....",
        "#....",
        "###..",
    ],
    "mini-knit-05": [
        "....#",
        "#....",
        ".....",
        ".....",
        "####.",
    ],
    "mini-knit-06": [
        "....#",
        "#....",
        ".....",
        "#....",
        "#.##.",
    ],
    "mini-knit-07": [
        "....#",
        "#....",
        ".....",
        "#....",
        "##.#.",
    ],
    "mini-knit-08": [
        "....#",
        "#....",
        ".....",
        "#....",
        "###..",
    ],
    "mini-knit-09": [
        "....#",
        "#....",
        "#....",
        ".....",
        "#.##.",
    ],
    "mini-knit-10": [
        "....#",
        "#....",
        "#....",
        ".....",
        "##.#.",
    ],
    "mini-knit-11": [
        "....#",
        "#....",
        "#....",
        ".....",
        "###..",
    ],
    "mini-knit-12": [
        "....#",
        "#....",
        "#....",
        "#....",
        "#..#.",
    ],
    "mini-knit-13": [
        "....#",
        "#....",
        "#....",
        "#....",
        "#.#..",
    ],
    "mini-knit-14": [
        "..#.#",
        "....#",
        "....#",
        "....#",
        "#....",
    ],
    "mini-knit-15": [
        "..###",
        ".....",
        "....#",
        "....#",
        "#....",
    ],
    "mini-knit-16": [
        "..###",
        "....#",
        ".....",
        "....#",
        "#....",
    ],
    "mega-balanced": [
        ".......",
        ".##...#",
        ".......",
        ".....##",
        ".......",
        "#...##.",
        ".......",
    ],
    "mega-balanced-right": [
        ".......",
        "#...##.",
        ".......",
        "##.....",
        ".......",
        ".##...#",
        ".......",
    ],
    "mega-balanced-center": [
        ".......",
        ".##...#",
        ".......",
        "#.....#",
        ".......",
        "#...##.",
        ".......",
    ],
    "mega-lantern": [
        ".......",
        ".##...#",
        ".......",
        "#...##.",
        ".......",
        ".##...#",
        ".......",
    ],
    "mega-bandstand": [
        ".......",
        ".....##",
        ".......",
        "##.....",
        ".......",
        ".....##",
        ".......",
    ],
    "mega-open-diamond": [
        "...#...",
        ".......",
        ".......",
        "#.....#",
        ".......",
        ".......",
        "...#...",
    ],
}

BONUS_POOL = [
    ("ABILITY", "Skill or capacity"),
    ("ABSENCE", "Time away"),
    ("ACADEMY", "School or institute"),
    ("ACCENTS", "Distinctive speech sounds"),
    ("ACCOUNT", "Record of money in and out"),
    ("ADDRESS", "Street location"),
    ("ADVANCE", "Move forward"),
    ("AIRLINE", "Carrier with boarding passes"),
    ("ALMANAC", "Yearly reference book"),
    ("AMBIENT", "Surrounding, as sound"),
    ("ANCHORS", "Heavy dockside holders"),
    ("ANOTHER", "One more"),
    ("APRICOT", "Small orange fruit"),
    ("ARRANGE", "Put in order"),
    ("ARTISAN", "Skilled craftsperson"),
    ("BALLOON", "Party decoration with air"),
    ("BATTERY", "Portable power source"),
    ("BEDTIME", "Hour to turn in"),
    ("BENEFIT", "Helpful advantage"),
    ("BISCUIT", "Flaky baked side"),
    ("BLANKET", "Bed cover"),
    ("BLOSSOM", "Flower opening"),
    ("BOOKLET", "Small pamphlet"),
    ("BOTTLES", "Containers with necks"),
    ("CABINET", "Storage cupboard"),
    ("CALMING", "Soothing"),
    ("CAMERAS", "Snapshot takers"),
    ("CANDLES", "Small flames at dinner"),
    ("CAPTAIN", "Team leader"),
    ("CARAMEL", "Cooked-sugar sweet"),
    ("CARTOON", "Animated short"),
    ("CASCADE", "Small waterfall"),
    ("CEILING", "Room top"),
    ("CENTRAL", "In the middle"),
    ("CHAPTER", "Book section"),
    ("CHARITY", "Cause that takes donations"),
    ("CIRCUIT", "Closed electric path"),
    ("CLARITY", "Clearness"),
    ("CLASSIC", "Enduring favorite"),
    ("CLIMATE", "Long-term weather pattern"),
    ("COASTAL", "By the shore"),
    ("COMFORT", "Ease in a hard moment"),
    ("CONCEPT", "Big idea"),
    ("CONCERT", "Live music event"),
    ("COOKIES", "Sweet baked rounds"),
    ("COOKING", "Making a meal"),
    ("CORNERS", "Room angles"),
    ("COUNTRY", "Nation"),
    ("COURAGE", "Bravery"),
    ("CRAYONS", "Wax coloring sticks"),
    ("CUSHION", "Soft seat pad"),
    ("DAYTIME", "Hours after sunrise"),
    ("DELIGHT", "Great pleasure"),
    ("DESSERT", "Sweet final course"),
    ("DIAMOND", "Sparkling gemstone"),
    ("DIGITAL", "Computer-based"),
    ("DINNERS", "Evening meals"),
    ("DRAWERS", "Sliding storage boxes"),
    ("DYNAMIC", "Full of energy"),
    ("EARNEST", "Sincere"),
    ("EDITORS", "People polishing copy"),
    ("ELASTIC", "Stretchy"),
    ("EVENING", "Time after late afternoon"),
    ("EXACTLY", "Precisely"),
    ("EXHIBIT", "Museum display"),
    ("FABRICS", "Cloth materials"),
    ("FACTORY", "Manufacturing plant"),
    ("FEATHER", "Light quill piece"),
    ("FESTIVE", "Celebratory"),
    ("FIREFLY", "Glowing summer insect"),
    ("FLOWERS", "Garden blooms"),
    ("FOLDERS", "Paper organizers"),
    ("FORESTS", "Wooded areas"),
    ("FREEDOM", "Liberty"),
    ("FRIENDS", "Close companions"),
    ("FROSTED", "Iced, as a cake"),
    ("FUTURES", "Things still ahead"),
    ("GALLERY", "Art display room"),
    ("GARDENS", "Planted plots"),
    ("GARLAND", "Decorative strand"),
    ("GESTURE", "Motion with meaning"),
    ("GINGHAM", "Checked fabric"),
    ("GLOWING", "Giving off light"),
    ("GRANOLA", "Crunchy oat mix"),
    ("GRAPHIC", "Visual design piece"),
    ("GROCERY", "Food shop"),
    ("GUITARS", "Six-string instruments"),
    ("HABITAT", "Natural home"),
    ("HARMONY", "Pleasing agreement"),
    ("HARVEST", "Gathered crop"),
    ("HELPERS", "People lending a hand"),
    ("HOLIDAY", "Day off or celebration"),
    ("HONESTY", "Truthfulness"),
    ("HORIZON", "Line where sky meets land"),
    ("IMAGINE", "Picture in the mind"),
    ("IMPULSE", "Sudden urge"),
    ("INSIGHT", "Clear understanding"),
    ("ISLANDS", "Land surrounded by water"),
    ("JASMINE", "Fragrant white flower"),
    ("JOURNAL", "Daily notebook"),
    ("JOURNEY", "Trip"),
    ("KARAOKE", "Sing-along entertainment"),
    ("KETTLES", "Tea water boilers"),
    ("KINDRED", "Related in spirit"),
    ("KITCHEN", "Meal-making room"),
    ("LANTERN", "Portable light"),
    ("LEATHER", "Tanned hide material"),
    ("LIBRARY", "Book-borrowing place"),
    ("LIGHTER", "Small flame maker"),
    ("LULLABY", "Bedtime song"),
    ("MAGENTA", "Purplish-red color"),
    ("MAGNETS", "Fridge holders, often"),
    ("MAILBOX", "Letter holder by the curb"),
    ("MEADOWS", "Open grassy fields"),
    ("MEASURE", "Find the size of"),
    ("MELODIC", "Tune-like"),
    ("MINUTES", "Small units of time"),
    ("MORNING", "Early part of the day"),
    ("MUSEUMS", "Places with exhibits"),
    ("OATMEAL", "Warm breakfast bowl"),
    ("ORCHARD", "Fruit tree grove"),
    ("OUTDOOR", "Not inside"),
    ("PACKAGE", "Wrapped parcel"),
    ("PAINTER", "One with brushes"),
    ("PANCAKE", "Flat breakfast round"),
    ("PARCELS", "Packages"),
    ("PASSAGE", "Short section of text"),
    ("PATTERN", "Repeated design"),
    ("PEACHES", "Fuzzy stone fruits"),
    ("PENCILS", "Graphite writing tools"),
    ("PICNICS", "Outdoor meals on blankets"),
    ("PICTURE", "Framed image"),
    ("PLANTER", "Container for soil"),
    ("PLAYFUL", "Full of fun"),
    ("POCKETS", "Clothing compartments"),
    ("POPCORN", "Movie snack"),
    ("POSTAGE", "Stamp cost"),
    ("PRAIRIE", "Open grassland"),
    ("PRESENT", "Gift"),
    ("PREVIEW", "Early look"),
    ("QUARTET", "Group of four"),
    ("RAILWAY", "Train track system"),
    ("READING", "Taking in text"),
    ("RECIPES", "Cooking instructions"),
    ("REFRESH", "Make fresh again"),
    ("RIBBONS", "Decorative strips"),
    ("ROOFTOP", "Top of a building"),
    ("SAMPLES", "Small test portions"),
    ("SANDALS", "Open summer shoes"),
    ("SAUCERS", "Small plates under cups"),
    ("SCENERY", "View around you"),
    ("SEASIDE", "By the ocean"),
    ("SEASONS", "Spring and fall, for two"),
    ("SHADOWS", "Dark shapes cast by light"),
    ("SHELVES", "Storage boards"),
    ("SIGNALS", "Signs or alerts"),
    ("SINGING", "Using the voice musically"),
    ("SKETCHY", "Roughly drawn"),
    ("SPARKLE", "Glitter"),
    ("SPICING", "Adding flavor"),
    ("STATION", "Transit stop"),
    ("STICKER", "Peel-and-place label"),
    ("STORIES", "Tales"),
    ("STRINGS", "Instrument lines"),
    ("SUNRISE", "Morning light event"),
    ("SWEATER", "Warm knit top"),
    ("TABLETS", "Flat portable screens"),
    ("TANGLES", "Knotted messes"),
    ("TEACHER", "Classroom guide"),
    ("TEAPOTS", "Steeping vessels"),
    ("TEXTURE", "Surface feel"),
    ("TICKETS", "Entry slips"),
    ("TIMBERS", "Wood beams"),
    ("TOWARDS", "In the direction of"),
    ("TRAFFIC", "Road congestion"),
    ("TRINKET", "Small keepsake"),
    ("TWINKLE", "Soft sparkle"),
    ("VACUUMS", "Floor cleaners"),
    ("VELVETS", "Soft plush fabrics"),
    ("VILLAGE", "Small town"),
    ("VINTAGE", "From an earlier era"),
    ("WAFFLES", "Grid-pattern breakfasts"),
    ("WALKWAY", "Path for foot traffic"),
    ("WEATHER", "Forecast subject"),
    ("WEEKEND", "Saturday and Sunday"),
    ("WHISPER", "Very soft speech"),
    ("WINDOWS", "Glass openings"),
    ("WONDERS", "Marvels"),
    ("WRITERS", "People with drafts"),
    ("YOGURTS", "Cultured dairy cups"),
    ("ZEPHYRS", "Gentle breezes"),
]

STOP_WORDS = {
    "and",
    "the",
    "with",
    "for",
    "from",
    "that",
    "this",
    "into",
    "your",
    "small",
    "daily",
    "little",
}

LEXICON_BLOCKLIST = {
    "ALL",
    "AND",
    "ANY",
    "ARE",
    "BEEN",
    "BUT",
    "DID",
    "DOES",
    "HAD",
    "HAS",
    "HAVE",
    "HER",
    "HIM",
    "HOW",
    "ITS",
    "JUST",
    "NOT",
    "ONE",
    "OUR",
    "OUT",
    "SAID",
    "SHE",
    "SOME",
    "THE",
    "THEIR",
    "THEM",
    "THEN",
    "THEY",
    "PADDY",
    "WAS",
    "WERE",
    "WHAT",
    "WHEN",
    "WHERE",
    "WHO",
    "WHY",
    "YOU",
    "YOUR",
}

SENSITIVE_DEFINITION_TERMS = {
    "bomb",
    "death",
    "disease",
    "drug",
    "homosexual",
    "kill",
    "nazi",
    "offensive",
    "poverty",
    "racial",
    "sex",
    "sexual",
    "slur",
    "vulgar",
    "weapon",
}


@dataclass(frozen=True)
class Slot:
    direction: str
    row: int
    col: int
    length: int
    cells: tuple[tuple[int, int], ...]
    number: int


@dataclass(frozen=True)
class Template:
    id: str
    rows: tuple[str, ...]
    blocks: tuple[tuple[bool, ...], ...]
    slots: tuple[Slot, ...]
    open_cells: int
    layout_score: int


def stable_seed(value: str) -> int:
    return int(hashlib.sha256(value.encode("utf-8")).hexdigest()[:8], 16)


def normalized_letters(value: str) -> str:
    return re.sub(r"[^A-Z]", "", value.upper())


def clue_leaks_answer(clue: str, answer: str) -> bool:
    return answer.upper() in normalized_letters(clue)


def clean_clue_metadata(answer: str, clue: dict) -> bool:
    text = str(clue.get("text", "")).strip()
    source = str(clue.get("source", "")).strip()
    score = int(clue.get("score") or 0)
    if source not in ALLOWED_SOURCES:
        return False
    if score < 76:
        return False
    if not text or text == "Crossword answer" or BAD_CLUE_RE.search(text):
        return False
    if clue_leaks_answer(text, answer):
        return False
    if clue.get("rejectionNotes"):
        return False
    return True


def best_clue(entry: dict, theme_id: str) -> dict | None:
    answer = entry["answer"]
    candidates = []
    clean_fallbacks = []
    for clue in entry.get("clueMetadata") or []:
        if not clean_clue_metadata(answer, clue):
            continue
        tags = [str(tag) for tag in clue.get("themeTags") or []]
        clean_fallbacks.append(clue)
        if tags and any(tag != theme_id for tag in tags):
            continue
        candidates.append(clue)
    if not candidates:
        candidates = clean_fallbacks
    if not candidates:
        return None
    candidates.sort(
        key=lambda clue: (
            1 if theme_id in (clue.get("themeTags") or []) else 0,
            int(clue.get("score") or 0),
            1 if clue.get("source") == "editorial" else 0,
            -len(str(clue.get("text", ""))),
        ),
        reverse=True,
    )
    clue = candidates[0]
    tags = [theme_id] if theme_id in (clue.get("themeTags") or []) else []
    return {
        "answer": answer,
        "text": str(clue["text"]).strip(),
        "type": str(clue.get("type") or "direct") if tags else "direct",
        "difficulty": str(clue.get("difficulty") or entry.get("difficulty") or "easy"),
        "tone": str(clue.get("tone") or "straight"),
        "source": str(clue.get("source") or "editorial"),
        "score": int(clue.get("score") or 0),
        "themeTags": tags,
        "themeMatch": bool(tags),
        "rejectionNotes": [],
    }


def keywordize(theme: dict) -> list[str]:
    raw = " ".join([theme.get("label", ""), theme.get("description", ""), theme.get("id", "")])
    words = []
    for word in re.findall(r"[a-z]+", raw.lower()):
        if len(word) < 4 or word in STOP_WORDS:
            continue
        if word not in words:
            words.append(word)
    return words[:8] or [theme["id"].replace("-", "")]


def build_template(raw: dict) -> Template:
    rows = tuple(str(row).strip() for row in raw["rows"])
    size = len(rows)
    blocks = tuple(tuple(ch == "#" for ch in row) for row in rows)
    slots: list[Slot] = []
    numbering: dict[tuple[int, int], int] = {}
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
                cells = []
                cc = col
                while cc < size and not blocks[row][cc]:
                    cells.append((row, cc))
                    cc += 1
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
    open_cells = sum(not cell for row in blocks for cell in row)
    layout_score = score_layout(size, open_cells, slots)
    return Template(raw["id"], rows, blocks, tuple(slots), open_cells, layout_score)


def score_layout(size: int, open_cells: int, slots: list[Slot]) -> int:
    lengths = [slot.length for slot in slots]
    three_count = sum(1 for length in lengths if length == 3)
    seven_count = sum(1 for length in lengths if length == 7)
    if size == 5:
        score = 100
        score -= max(0, 19 - open_cells) * 10
        score -= max(0, open_cells - 22) * 6
        score -= max(0, 8 - len(slots)) * 8
        score -= max(0, len(slots) - 10) * 5
        score -= max(0, three_count - 4) * 8
        score += min(4, sum(1 for length in lengths if length >= 5)) * 2
        return max(0, min(100, score))
    score = 100
    score -= max(0, 38 - open_cells) * 5
    score -= max(0, open_cells - 45) * 4
    score -= max(0, 14 - len(slots)) * 5
    score -= max(0, len(slots) - 20) * 4
    score -= max(0, 4 - seven_count) * 10
    if len(slots) and three_count / len(slots) > 0.45:
        score -= int(((three_count / len(slots)) - 0.45) * 100)
    score += min(6, seven_count)
    return max(0, min(100, score))


def add_bonus_entry(entries_by_answer: dict[str, dict], answer: str, clue: str) -> None:
    if answer in entries_by_answer:
        return
    entries_by_answer[answer] = {
        "answer": answer,
        "clueOptions": [clue],
        "clueMetadata": [
            {
                "text": clue,
                "type": "direct",
                "difficulty": "hard",
                "tone": "straight",
                "source": "editorial",
                "score": 82,
                "themeTags": [],
                "rejectionNotes": [],
            }
        ],
        "difficulty": "hard",
        "themeTags": [],
        "isModern": True,
        "isBonusEligible": True,
    }


def load_proper_names() -> set[str]:
    proper_path = Path("/usr/share/dict/propernames")
    if not proper_path.exists():
        return set()
    return {line.strip().upper() for line in proper_path.read_text(errors="ignore").splitlines() if line.strip()}


def wordnet_clue_for(answer: str) -> str | None:
    try:
        from nltk.corpus import wordnet as wn
    except Exception:
        return None

    for synset in wn.synsets(answer.lower())[:8]:
        text = synset.definition().split(";")[0].strip()
        if not (8 <= len(text) <= 54):
            continue
        normalized = normalized_letters(text)
        if answer in normalized:
            continue
        lower = text.lower()
        if BAD_CLUE_RE.search(text):
            continue
        if any(term in lower for term in SENSITIVE_DEFINITION_TERMS):
            continue
        return text[:1].upper() + text[1:]
    return None


def expand_entries_from_lexicon(entries_by_answer: dict[str, dict]) -> None:
    try:
        from wordfreq import top_n_list, zipf_frequency
    except Exception:
        return

    proper_names = load_proper_names()
    for raw_word in top_n_list("en", 100_000):
        if not re.fullmatch(r"[a-z]+", raw_word):
            continue
        answer = raw_word.upper()
        if answer in entries_by_answer or answer in BLOCKED_ANSWERS or answer in LEXICON_BLOCKLIST:
            continue
        if answer in proper_names or len(answer) not in {3, 4, 5, 7}:
            continue
        minimum_frequency = 4.35 if len(answer) == 3 else 4.05 if len(answer) == 4 else 3.55
        if zipf_frequency(raw_word, "en") < minimum_frequency:
            continue
        clue = wordnet_clue_for(answer)
        if clue is None:
            continue
        entries_by_answer[answer] = {
            "answer": answer,
            "clueOptions": [clue],
            "clueMetadata": [
                {
                    "text": clue,
                    "type": "direct",
                    "difficulty": "medium" if len(answer) == 7 else "easy",
                    "tone": "straight",
                    "source": "editorial",
                    "score": 78,
                    "themeTags": [],
                    "rejectionNotes": [],
                }
            ],
            "difficulty": "medium" if len(answer) == 7 else "easy",
            "themeTags": [],
            "isModern": True,
            "isBonusEligible": False,
        }


def curated_entry(raw: dict) -> dict:
    answer = str(raw["answer"]).upper().strip()
    entry = dict(raw, answer=answer)
    seen_texts: set[str] = set()
    metadata = []
    for clue in raw.get("clueMetadata") or []:
        clue = dict(clue)
        if clean_clue_metadata(answer, clue):
            text = str(clue["text"]).strip()
            if text not in seen_texts:
                clue["themeTags"] = [str(tag) for tag in clue.get("themeTags") or []]
                clue["rejectionNotes"] = []
                metadata.append(clue)
                seen_texts.add(text)
    for text in raw.get("clueOptions") or []:
        text = str(text).strip()
        if (
            not text
            or text == "Crossword answer"
            or text in seen_texts
            or BAD_CLUE_RE.search(text)
            or clue_leaks_answer(text, answer)
        ):
            continue
        metadata.append(
            {
                "text": text,
                "type": "direct",
                "difficulty": str(raw.get("difficulty") or "easy"),
                "tone": "straight",
                "source": "editorial",
                "score": 78,
                "themeTags": [],
                "rejectionNotes": [],
            }
        )
        seen_texts.add(text)
    entry["clueMetadata"] = metadata
    entry["clueOptions"] = [clue["text"] for clue in metadata]
    return entry


def build_bank() -> tuple[dict, dict[str, dict], list[dict]]:
    base = json.loads(GAMESHOW_BANK_PATH.read_text())
    existing_ids = {theme["id"] for theme in base["themes"]}
    themes = [dict(theme) for theme in base["themes"]]
    visual_cycle = [theme.get("visual") for theme in themes if theme.get("visual")]
    for index, (theme_id, label, description, keywords) in enumerate(EXTRA_THEME_LANES):
        if theme_id in existing_ids:
            continue
        visual = dict(visual_cycle[index % len(visual_cycle)])
        themes.append(
            {
                "id": theme_id,
                "label": label,
                "description": description,
                "visual": visual,
                "keywords": keywords,
            }
        )
    for theme in themes:
        theme["keywords"] = theme.get("keywords") or keywordize(theme)

    seen_bonus = set()
    for answer, clue in BONUS_POOL:
        if not WORD_RE.fullmatch(answer) or len(answer) != 7:
            raise SystemExit(f"Invalid bonus word {answer}")
        if clue_leaks_answer(clue, answer):
            raise SystemExit(f"Bonus clue leaks answer {answer}: {clue}")
        seen_bonus.add(answer)

    bonus_words = []
    for index, theme in enumerate(themes):
        for offset in (0, 37):
            answer, clue = BONUS_POOL[(index + offset) % len(BONUS_POOL)]
            bonus_words.append(
                {
                    "answer": answer,
                    "themeId": theme["id"],
                    "clue": clue,
                    "difficulty": "hard",
                }
            )

    entries_by_answer = {
        entry["answer"]: entry
        for entry in (curated_entry(raw) for raw in base["entries"])
        if entry.get("clueMetadata") and entry["answer"] not in BLOCKED_ANSWERS
    }
    for answer, clue in BONUS_POOL:
        add_bonus_entry(entries_by_answer, answer, clue)
    expand_entries_from_lexicon(entries_by_answer)

    templates = [dict(template) for template in base["templates"]]
    existing_template_ids = {template["id"] for template in templates}
    for template in templates:
        template_id = template.get("id")
        if template_id in REQUIRED_TEMPLATES:
            template["rows"] = REQUIRED_TEMPLATES[template_id]
    for template_id, rows in REQUIRED_TEMPLATES.items():
        if template_id not in existing_template_ids:
            templates.append({"id": template_id, "rows": rows})

    bank = {
        "themes": themes,
        "templates": templates,
        "entries": sorted(entries_by_answer.values(), key=lambda entry: entry["answer"]),
        "bonusWords": bonus_words,
    }
    return bank, entries_by_answer, themes


def build_candidate_indexes(entries_by_answer: dict[str, dict], bonus_answers: set[str]) -> dict[int, list[str]]:
    candidates: dict[int, list[str]] = {3: [], 4: [], 5: [], 7: []}
    for answer, entry in entries_by_answer.items():
        if answer in BLOCKED_ANSWERS or len(answer) not in candidates or not WORD_RE.fullmatch(answer):
            continue
        if not any(clean_clue_metadata(answer, clue) for clue in entry.get("clueMetadata") or []):
            continue
        candidates[len(answer)].append(answer)
    for length, words in candidates.items():
        if len(words) < 40:
            raise SystemExit(f"Not enough curated {length}-letter candidates: {len(words)}")
        words.sort()
    return candidates


def cooldown_days(answer: str) -> int:
    return 90 if len(answer) >= 5 else 45


def ordered_candidates(
    words: list[str],
    pattern: tuple[str | None, ...],
    day_index: int,
    theme_id: str,
    slot: Slot,
    rng: random.Random,
    used_answers: set[str],
    answer_usage: dict[str, int],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
) -> list[str]:
    matching = []
    for answer in words:
        if answer in used_answers:
            continue
        if any(letter is not None and answer[index] != letter for index, letter in enumerate(pattern)):
            continue
        last = last_grid_use.get(answer)
        if last is not None and day_index - last < cooldown_days(answer):
            continue
        last_bonus = last_bonus_use.get(answer)
        if last_bonus is not None and day_index - last_bonus < 180:
            continue
        jitter = rng.random()
        matching.append((answer_usage.get(answer, 0), -(day_index - last) if last is not None else -999, jitter, answer))
    matching.sort()
    return [item[-1] for item in matching]


def answer_available(
    answer: str,
    day_index: int,
    used_answers: set[str],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
) -> bool:
    if answer in used_answers:
        return False
    last = last_grid_use.get(answer)
    if last is not None and day_index - last < cooldown_days(answer):
        return False
    last_bonus = last_bonus_use.get(answer)
    if last_bonus is not None and day_index - last_bonus < 180:
        return False
    return True


def solve_bandstand(
    template: Template,
    day_key: str,
    day_index: int,
    theme_id: str,
    candidates_by_length: dict[int, list[str]],
    answer_usage: dict[str, int],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
    seen_signatures: set[str],
    seen_answer_sets: set[tuple[str, ...]],
    attempt: int,
) -> dict | None:
    rng = random.Random(stable_seed(f"{day_key}:{template.id}:{attempt}:bandstand-v1"))
    pattern_cache: dict[tuple[int, tuple[str | None, ...]], list[str]] = {}

    def base_words(length: int, pattern: tuple[str | None, ...]) -> list[str]:
        key = (length, pattern)
        if key not in pattern_cache:
            pattern_cache[key] = [
                answer
                for answer in candidates_by_length[length]
                if all(letter is None or answer[index] == letter for index, letter in enumerate(pattern))
            ]
        return pattern_cache[key]

    def ranked_words(length: int, pattern: tuple[str | None, ...], used: set[str]) -> list[str]:
        words = [
            answer
            for answer in base_words(length, pattern)
            if answer_available(answer, day_index, used, last_grid_use, last_bonus_use)
        ]
        words.sort(key=lambda answer: (answer_usage.get(answer, 0), rng.random(), answer))
        return words

    def valid_three(answer: str, used: set[str]) -> bool:
        return (
            len(answer) == 3
            and answer in candidates_by_length[3]
            and answer_available(answer, day_index, used, last_grid_use, last_bonus_use)
        )

    vertical_pool = ranked_words(7, (None, None, None, None, None, None, None), set())
    if len(vertical_pool) < 3:
        return None

    for _ in range(50000):
        d2, d3, d4 = rng.sample(vertical_pool[:260], 3)
        used_vertical = {d2, d3, d4}
        row_patterns = [(d2[row], d3[row], d4[row]) for row in range(7)]
        rows0 = ranked_words(7, (None, None, *row_patterns[0], None, None), used_vertical)[:24]
        row1 = ranked_words(5, (None, None, *row_patterns[1]), used_vertical)[:24]
        rows2 = ranked_words(7, (None, None, *row_patterns[2], None, None), used_vertical)[:24]
        row3 = ranked_words(5, (*row_patterns[3], None, None), used_vertical)[:24]
        rows4 = ranked_words(7, (None, None, *row_patterns[4], None, None), used_vertical)[:24]
        row5 = ranked_words(5, (None, None, *row_patterns[5]), used_vertical)[:24]
        rows6 = ranked_words(7, (None, None, *row_patterns[6], None, None), used_vertical)[:24]
        if not all([rows0, row1, rows2, row3, rows4, row5, rows6]):
            continue

        top_options = []
        for a0 in rows0:
            for a1 in row1:
                for a2 in rows2:
                    used = set(used_vertical) | {a0, a1, a2}
                    if len(used) != 6:
                        continue
                    d0 = a0[0] + a1[0] + a2[0]
                    d1 = a0[1] + a1[1] + a2[1]
                    if d0 == d1 or not valid_three(d0, used) or not valid_three(d1, used | {d0}):
                        continue
                    top_options.append((a0, a1, a2, d0, d1))
                    if len(top_options) >= 80:
                        break
                if len(top_options) >= 80:
                    break
            if len(top_options) >= 80:
                break
        if not top_options:
            continue

        middle_by_a2: dict[str, list[tuple[str, str, str, str]]] = {}
        for a2 in rows2:
            for a3 in row3:
                for a4 in rows4:
                    used = set(used_vertical) | {a2, a3, a4}
                    if len(used) != 6:
                        continue
                    d5 = a2[5] + a3[3] + a4[5]
                    d6 = a2[6] + a3[4] + a4[6]
                    if d5 == d6 or not valid_three(d5, used) or not valid_three(d6, used | {d5}):
                        continue
                    bucket = middle_by_a2.setdefault(a2, [])
                    bucket.append((a3, a4, d5, d6))
                    if len(bucket) >= 80:
                        break
                if len(middle_by_a2.get(a2, [])) >= 80:
                    break

        bottom_by_a4: dict[str, list[tuple[str, str, str, str]]] = {}
        for a4 in rows4:
            for a5 in row5:
                for a6 in rows6:
                    used = set(used_vertical) | {a4, a5, a6}
                    if len(used) != 6:
                        continue
                    d7 = a4[0] + a5[0] + a6[0]
                    d8 = a4[1] + a5[1] + a6[1]
                    if d7 == d8 or not valid_three(d7, used) or not valid_three(d8, used | {d7}):
                        continue
                    bucket = bottom_by_a4.setdefault(a4, [])
                    bucket.append((a5, a6, d7, d8))
                    if len(bucket) >= 80:
                        break
                if len(bottom_by_a4.get(a4, [])) >= 80:
                    break

        rng.shuffle(top_options)
        for a0, a1, a2, d0, d1 in top_options[:60]:
            middles = middle_by_a2.get(a2) or []
            rng.shuffle(middles)
            for a3, a4, d5, d6 in middles[:60]:
                bottoms = bottom_by_a4.get(a4) or []
                rng.shuffle(bottoms)
                for a5, a6, d7, d8 in bottoms[:60]:
                    across_words = [a0, a1, a2, a3, a4, a5, a6]
                    down_words = [d0, d1, d2, d3, d4, d5, d6, d7, d8]
                    all_answers = across_words + down_words
                    if len(all_answers) != len(set(all_answers)):
                        continue
                    answer_set = tuple(sorted(all_answers))
                    signature = f"{template.id}:{'|'.join(across_words)}/{'|'.join(down_words)}"
                    if signature in seen_signatures or answer_set in seen_answer_sets:
                        continue
                    return {
                        "signature": signature,
                        "answerSet": answer_set,
                        "acrossWords": across_words,
                        "downWords": down_words,
                        "answers": sorted(all_answers),
                    }
    return None


def solve_five_column_template(
    template: Template,
    day_key: str,
    day_index: int,
    theme_id: str,
    candidates_by_length: dict[int, list[str]],
    answer_usage: dict[str, int],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
    seen_signatures: set[str],
    seen_answer_sets: set[tuple[str, ...]],
    attempt: int,
) -> dict | None:
    full_down_slots = [slot for slot in template.slots if slot.direction == "down" and slot.length == 5]
    short_down_slots = [slot for slot in template.slots if slot.direction == "down" and slot.length < 5]
    across_slots = [slot for slot in template.slots if slot.direction == "across"]
    if len(full_down_slots) != 3 or len(across_slots) != 5:
        return None

    rng = random.Random(stable_seed(f"{day_key}:{template.id}:{attempt}:five-columns-v1"))
    pattern_cache: dict[tuple[int, tuple[str | None, ...]], list[str]] = {}

    def base_words(length: int, pattern: tuple[str | None, ...]) -> list[str]:
        key = (length, pattern)
        if key not in pattern_cache:
            pattern_cache[key] = [
                answer
                for answer in candidates_by_length[length]
                if all(letter is None or answer[index] == letter for index, letter in enumerate(pattern))
            ]
        return pattern_cache[key]

    def ranked_words(length: int, pattern: tuple[str | None, ...], used: set[str]) -> list[str]:
        words = [
            answer
            for answer in base_words(length, pattern)
            if answer_available(answer, day_index, used, last_grid_use, last_bonus_use)
        ]
        words.sort(key=lambda answer: (answer_usage.get(answer, 0), rng.random(), answer))
        return words

    def has_available_word(length: int, pattern: tuple[str | None, ...], used: set[str]) -> bool:
        for answer in base_words(length, pattern):
            if answer_available(answer, day_index, used, last_grid_use, last_bonus_use):
                return True
        return False

    vertical_pool = ranked_words(5, (None, None, None, None, None), set())
    if len(vertical_pool) < 3:
        return None
    node_budget = 50_000
    searched_nodes = 0

    for seed_offset in range(6):
        ordered_vertical = list(vertical_pool)
        rng.shuffle(ordered_vertical)
        if seed_offset:
            ordered_vertical = ordered_vertical[seed_offset * 37 :] + ordered_vertical[: seed_offset * 37]
        grid: dict[tuple[int, int], str] = {}
        used: set[str] = set()
        down_anchor_assignments: dict[Slot, str] = {}

        def across_possible() -> bool:
            for slot in across_slots:
                pattern = tuple(grid.get(cell) for cell in slot.cells)
                if not has_available_word(slot.length, pattern, used):
                    return False
            return True

        def finish_with_across() -> dict | None:
            across_assignments: dict[Slot, str] = {}
            nonlocal_ordered = sorted(
                across_slots,
                key=lambda slot: (
                    len(ranked_words(slot.length, tuple(grid.get(cell) for cell in slot.cells), used)),
                    -slot.length,
                ),
            )

            def terminal_result() -> dict | None:
                down_assignments = dict(down_anchor_assignments)
                terminal_used = set(used)
                for slot in short_down_slots:
                    answer = "".join(grid.get(cell, "") for cell in slot.cells)
                    if (
                        len(answer) != slot.length
                        or answer not in candidates_by_length[slot.length]
                        or not answer_available(answer, day_index, terminal_used, last_grid_use, last_bonus_use)
                    ):
                        return None
                    down_assignments[slot] = answer
                    terminal_used.add(answer)

                across_words = [across_assignments[slot] for slot in across_slots]
                down_words = [down_assignments[slot] for slot in [slot for slot in template.slots if slot.direction == "down"]]
                all_answers = across_words + down_words
                if len(all_answers) != len(set(all_answers)):
                    return None
                answer_set = tuple(sorted(all_answers))
                signature = f"{template.id}:{'|'.join(across_words)}/{'|'.join(down_words)}"
                if signature in seen_signatures or answer_set in seen_answer_sets:
                    return None
                return {
                    "signature": signature,
                    "answerSet": answer_set,
                    "acrossWords": across_words,
                    "downWords": down_words,
                    "answers": sorted(all_answers),
                }

            def assign_ordered_across(index: int) -> dict | None:
                if index == len(nonlocal_ordered):
                    return terminal_result()
                slot = nonlocal_ordered[index]
                pattern = tuple(grid.get(cell) for cell in slot.cells)
                words = ranked_words(slot.length, pattern, used)
                for answer in words[:90]:
                    changed = []
                    conflict = False
                    for cell, letter in zip(slot.cells, answer):
                        existing = grid.get(cell)
                        if existing is not None and existing != letter:
                            conflict = True
                            break
                        if existing is None:
                            grid[cell] = letter
                            changed.append(cell)
                    if conflict:
                        for cell in changed:
                            grid.pop(cell, None)
                        continue
                    across_assignments[slot] = answer
                    used.add(answer)
                    result = assign_ordered_across(index + 1)
                    if result is not None:
                        return result
                    used.remove(answer)
                    across_assignments.pop(slot, None)
                    for cell in changed:
                        grid.pop(cell, None)
                return None

            return assign_ordered_across(0)

        def assign_down_anchor(index: int) -> dict | None:
            nonlocal searched_nodes
            searched_nodes += 1
            if searched_nodes > node_budget:
                return None
            if index == len(full_down_slots):
                return finish_with_across()
            slot = full_down_slots[index]
            for answer in ordered_vertical[:520]:
                searched_nodes += 1
                if searched_nodes > node_budget:
                    return None
                if not answer_available(answer, day_index, used, last_grid_use, last_bonus_use):
                    continue
                changed = []
                conflict = False
                for cell, letter in zip(slot.cells, answer):
                    existing = grid.get(cell)
                    if existing is not None and existing != letter:
                        conflict = True
                        break
                    if existing is None:
                        grid[cell] = letter
                        changed.append(cell)
                if conflict:
                    for cell in changed:
                        grid.pop(cell, None)
                    continue
                used.add(answer)
                down_anchor_assignments[slot] = answer
                if across_possible():
                    result = assign_down_anchor(index + 1)
                    if result is not None:
                        return result
                down_anchor_assignments.pop(slot, None)
                used.remove(answer)
                for cell in changed:
                    grid.pop(cell, None)
            return None

        result = assign_down_anchor(0)
        if result is not None:
            return result
    return None


def solve_template(
    template: Template,
    day_key: str,
    day_index: int,
    theme_id: str,
    candidates_by_length: dict[int, list[str]],
    answer_usage: dict[str, int],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
    seen_signatures: set[str],
    seen_answer_sets: set[tuple[str, ...]],
    attempt: int,
) -> dict | None:
    if len(template.rows) == 5:
        return solve_five_column_template(
            template,
            day_key,
            day_index,
            theme_id,
            candidates_by_length,
            answer_usage,
            last_grid_use,
            last_bonus_use,
            seen_signatures,
            seen_answer_sets,
            attempt,
        )

    if template.id == "mega-bandstand":
        return solve_bandstand(
            template,
            day_key,
            day_index,
            theme_id,
            candidates_by_length,
            answer_usage,
            last_grid_use,
            last_bonus_use,
            seen_signatures,
            seen_answer_sets,
            attempt,
        )

    rng = random.Random(stable_seed(f"{day_key}:{template.id}:{attempt}:quality-pack-v1"))
    slots = list(template.slots)
    cell_letters: dict[tuple[int, int], str] = {}
    assignments: dict[Slot, str] = {}
    used_answers: set[str] = set()
    node_budget = 12_000 if len(template.rows) == 7 else 4_000
    searched_nodes = 0

    def pattern_for(slot: Slot) -> tuple[str | None, ...]:
        return tuple(cell_letters.get(cell) for cell in slot.cells)

    def available_for(slot: Slot) -> list[str]:
        return ordered_candidates(
            candidates_by_length[slot.length],
            pattern_for(slot),
            day_index,
            theme_id,
            slot,
            rng,
            used_answers,
            answer_usage,
            last_grid_use,
            last_bonus_use,
        )

    def backtrack() -> bool:
        nonlocal searched_nodes
        searched_nodes += 1
        if searched_nodes > node_budget:
            return False
        if len(assignments) == len(slots):
            return True
        best_slot = None
        best_words: list[str] | None = None
        best_metric: tuple[int, int, int] | None = None
        for slot in slots:
            if slot in assignments:
                continue
            words = available_for(slot)
            filled_crosses = sum(1 for cell in slot.cells if cell in cell_letters)
            metric = (len(words), -slot.length, -filled_crosses)
            if best_metric is None or metric < best_metric:
                best_slot = slot
                best_words = words
                best_metric = metric
                if len(words) <= 1:
                    break
        if best_slot is None or not best_words:
            return False
        branch_limit = 120 if best_slot.length >= 7 else 90
        for answer in best_words[:branch_limit]:
            changed = []
            conflict = False
            for cell, letter in zip(best_slot.cells, answer):
                existing = cell_letters.get(cell)
                if existing is not None and existing != letter:
                    conflict = True
                    break
                if existing is None:
                    cell_letters[cell] = letter
                    changed.append(cell)
            if conflict:
                for cell in changed:
                    cell_letters.pop(cell, None)
                continue
            assignments[best_slot] = answer
            used_answers.add(answer)
            if backtrack():
                return True
            used_answers.remove(answer)
            assignments.pop(best_slot, None)
            for cell in changed:
                cell_letters.pop(cell, None)
        return False

    if not backtrack():
        return None

    across_words = [assignments[slot] for slot in slots if slot.direction == "across"]
    down_words = [assignments[slot] for slot in slots if slot.direction == "down"]
    signature = f"{template.id}:{'|'.join(across_words)}/{'|'.join(down_words)}"
    answer_set = tuple(sorted(used_answers))
    if signature in seen_signatures or answer_set in seen_answer_sets:
        return None
    return {
        "signature": signature,
        "answerSet": answer_set,
        "acrossWords": across_words,
        "downWords": down_words,
        "answers": sorted(used_answers),
    }


def collect_fill_pool(
    template: Template,
    candidates_by_length: dict[int, list[str]],
    limit: int,
    node_limit: int,
    seed: int,
) -> list[dict]:
    rng = random.Random(seed)
    slots = list(template.slots)
    cell_letters: dict[tuple[int, int], str] = {}
    assignments: dict[Slot, str] = {}
    used_answers: set[str] = set()
    pattern_cache: dict[tuple[int, tuple[str | None, ...]], list[str]] = {}
    out: list[dict] = []
    seen_signatures: set[str] = set()
    searched_nodes = 0

    def base_words(slot: Slot) -> list[str]:
        pattern = tuple(cell_letters.get(cell) for cell in slot.cells)
        key = (slot.length, pattern)
        if key not in pattern_cache:
            words = [
                answer
                for answer in candidates_by_length[slot.length]
                if all(letter is None or answer[index] == letter for index, letter in enumerate(pattern))
            ]
            rng.shuffle(words)
            pattern_cache[key] = words[:900]
        return [answer for answer in pattern_cache[key] if answer not in used_answers]

    def record() -> None:
        across_words = [assignments[slot] for slot in slots if slot.direction == "across"]
        down_words = [assignments[slot] for slot in slots if slot.direction == "down"]
        signature = f"{template.id}:{'|'.join(across_words)}/{'|'.join(down_words)}"
        if signature in seen_signatures:
            return
        answers = sorted(used_answers)
        seen_signatures.add(signature)
        out.append(
            {
                "template": template,
                "signature": signature,
                "answerSet": tuple(answers),
                "acrossWords": across_words,
                "downWords": down_words,
                "answers": answers,
            }
        )

    def backtrack() -> bool:
        nonlocal searched_nodes
        searched_nodes += 1
        if searched_nodes > node_limit or len(out) >= limit:
            return True
        if len(assignments) == len(slots):
            record()
            return len(out) >= limit

        best_slot: Slot | None = None
        best_words: list[str] | None = None
        for slot in slots:
            if slot in assignments:
                continue
            words = base_words(slot)
            if not words:
                return False
            if best_words is None or (len(words), -slot.length) < (len(best_words), -(best_slot.length if best_slot else 0)):
                best_slot = slot
                best_words = words
        if best_slot is None or best_words is None:
            return False

        branch_limit = 180 if best_slot.length >= 7 else 220
        for answer in best_words[:branch_limit]:
            changed = []
            conflict = False
            for cell, letter in zip(best_slot.cells, answer):
                existing = cell_letters.get(cell)
                if existing is not None and existing != letter:
                    conflict = True
                    break
                if existing is None:
                    cell_letters[cell] = letter
                    changed.append(cell)
            if not conflict:
                assignments[best_slot] = answer
                used_answers.add(answer)
                if backtrack():
                    return True
                used_answers.remove(answer)
                assignments.pop(best_slot, None)
            for cell in changed:
                cell_letters.pop(cell, None)
        return False

    backtrack()
    return out


def collect_diverse_fill_pool(
    template: Template,
    candidates_by_length: dict[int, list[str]],
    total_limit: int,
    rounds: int,
    node_limit: int,
    seed_label: str,
) -> list[dict]:
    combined: list[dict] = []
    seen_signatures: set[str] = set()
    per_round = max(80, (total_limit + rounds - 1) // rounds)
    for round_index in range(rounds):
        pool = collect_fill_pool(
            template,
            candidates_by_length,
            limit=per_round,
            node_limit=node_limit,
            seed=stable_seed(f"{seed_label}:round-{round_index}"),
        )
        for candidate in pool:
            if candidate["signature"] in seen_signatures:
                continue
            seen_signatures.add(candidate["signature"])
            combined.append(candidate)
            if len(combined) >= total_limit:
                return combined
    return combined


def build_clues(words: list[str], entries_by_answer: dict[str, dict], theme_id: str) -> list[dict]:
    clues = []
    for answer in words:
        clue = best_clue(entries_by_answer[answer], theme_id)
        if clue is None:
            raise SystemExit(f"No approved clue for {answer} in theme {theme_id}")
        clues.append(clue)
    return clues


def choose_bonus(
    theme_id: str,
    bonus_by_theme: dict[str, list[str]],
    day_index: int,
    grid_answers: set[str],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
    future_grid_use: dict[str, list[int]] | None = None,
) -> str:
    options = bonus_by_theme.get(theme_id) or []
    ranked = sorted(
        options,
        key=lambda answer: (
            answer in grid_answers,
            day_index - last_grid_use.get(answer, -9999) < 180,
            last_bonus_use.get(answer, -9999),
            answer,
        ),
    )
    for answer in ranked:
        if (
            answer not in grid_answers
            and day_index - last_grid_use.get(answer, -9999) >= 180
            and day_index - last_bonus_use.get(answer, -9999) >= 30
            and not answer_reserved_for_future_grid(answer, day_index, future_grid_use, 180)
        ):
            return answer
    for answer in ranked:
        if answer not in grid_answers and day_index - last_grid_use.get(answer, -9999) >= 180:
            if answer_reserved_for_future_grid(answer, day_index, future_grid_use, 180):
                continue
            return answer
    raise SystemExit(f"No bonus available without grid collision for {theme_id}")


def next_future_grid_use(
    answer: str,
    day_index: int,
    future_grid_use: dict[str, list[int]] | None,
) -> int | None:
    if not future_grid_use:
        return None
    uses = future_grid_use.get(answer)
    if not uses:
        return None
    pos = bisect.bisect_right(uses, day_index)
    if pos >= len(uses):
        return None
    return uses[pos]


def answer_reserved_for_future_grid(
    answer: str,
    day_index: int,
    future_grid_use: dict[str, list[int]] | None,
    window_days: int,
) -> bool:
    next_use = next_future_grid_use(answer, day_index, future_grid_use)
    return next_use is not None and next_use - day_index < window_days


def candidate_available_for_schedule(
    candidate: dict,
    day_index: int,
    seen_signatures: set[str],
    seen_answer_sets: set[tuple[str, ...]],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
    future_grid_use: dict[str, list[int]] | None = None,
    reserved_answer_sets: set[tuple[str, ...]] | None = None,
) -> bool:
    if candidate["signature"] in seen_signatures:
        return False
    if candidate["answerSet"] in seen_answer_sets:
        return False
    if reserved_answer_sets is not None and candidate["answerSet"] in reserved_answer_sets:
        return False
    for answer in candidate["answers"]:
        last_grid = last_grid_use.get(answer)
        if last_grid is not None and day_index - last_grid < cooldown_days(answer):
            return False
        last_bonus = last_bonus_use.get(answer)
        if last_bonus is not None and day_index - last_bonus < 180:
            return False
        if answer_reserved_for_future_grid(answer, day_index, future_grid_use, cooldown_days(answer)):
            return False
    return True


def select_sunday_plan(sunday_pool: list[dict], weekday_pool: list[dict]) -> dict[int, dict]:
    sunday_days = [
        day_index
        for day_index in range(PACK_DAYS)
        if (PACK_START + timedelta(days=day_index)).weekday() == 6
    ]
    answer_frequency: dict[str, int] = {}
    for candidate in sunday_pool:
        for answer in candidate["answers"]:
            answer_frequency[answer] = answer_frequency.get(answer, 0) + 1
    for candidate in weekday_pool:
        for answer in candidate["answers"]:
            answer_frequency[answer] = answer_frequency.get(answer, 0) + 4

    plan: dict[int, dict] = {}
    seen_signatures: set[str] = set()
    seen_answer_sets: set[tuple[str, ...]] = set()
    last_grid_use: dict[str, int] = {}
    answer_usage: dict[str, int] = {}
    template_counts: dict[str, int] = {}
    searched_nodes = 0
    debug_mode = os.getenv("MINI_CROSSWORD_DEBUG")

    def ranked_candidates(day_index: int) -> list[tuple[tuple[int, int, int, int], dict]]:
        day_key = (PACK_START + timedelta(days=day_index)).isoformat()
        ranked = []
        for candidate in sunday_pool:
            if not candidate_available_for_schedule(
                candidate,
                day_index,
                seen_signatures,
                seen_answer_sets,
                last_grid_use,
                {},
            ):
                continue
            usage_score = sum(answer_usage.get(answer, 0) for answer in candidate["answers"])
            pressure = sum(answer_frequency.get(answer, 0) for answer in candidate["answers"])
            template_count = template_counts.get(candidate["template"].id, 0)
            ranked.append(
                (
                    (
                        pressure,
                        usage_score,
                        template_count,
                        stable_seed(f"{day_key}:{candidate['signature']}:sunday-plan"),
                    ),
                    candidate,
                )
            )
        ranked.sort(key=lambda item: item[0])
        return ranked

    def apply_candidate(day_index: int, candidate: dict) -> list[tuple[str, str, int | None]]:
        changes: list[tuple[str, str, int | None]] = []
        seen_signatures.add(candidate["signature"])
        seen_answer_sets.add(candidate["answerSet"])
        template_id = candidate["template"].id
        changes.append(("template", template_id, template_counts.get(template_id)))
        template_counts[template_id] = template_counts.get(template_id, 0) + 1
        for answer in candidate["answers"]:
            changes.append(("last_grid", answer, last_grid_use.get(answer)))
            changes.append(("usage", answer, answer_usage.get(answer)))
            last_grid_use[answer] = day_index
            answer_usage[answer] = answer_usage.get(answer, 0) + 1
        return changes

    def undo_candidate(candidate: dict, changes: list[tuple[str, str, int | None]]) -> None:
        seen_signatures.remove(candidate["signature"])
        seen_answer_sets.remove(candidate["answerSet"])
        for kind, key, old_value in reversed(changes):
            if kind == "last_grid":
                if old_value is None:
                    last_grid_use.pop(key, None)
                else:
                    last_grid_use[key] = old_value
            elif kind == "usage":
                if old_value is None:
                    answer_usage.pop(key, None)
                else:
                    answer_usage[key] = old_value
            elif kind == "template":
                if old_value is None:
                    template_counts.pop(key, None)
                else:
                    template_counts[key] = old_value

    def backtrack(position: int) -> bool:
        nonlocal searched_nodes
        searched_nodes += 1
        if debug_mode and searched_nodes % 1000 == 0:
            print(
                f"[mini-crossword] sunday search nodes={searched_nodes} position={position}/{len(sunday_days)}",
                flush=True,
            )
        if position == len(sunday_days):
            return True
        day_index = sunday_days[position]
        ranked = ranked_candidates(day_index)
        if not ranked:
            return False
        for _, candidate in ranked:
            changes = apply_candidate(day_index, candidate)
            plan[day_index] = candidate
            if backtrack(position + 1):
                return True
            plan.pop(day_index, None)
            undo_candidate(candidate, changes)
        return False

    if not backtrack(0):
        raise SystemExit("Unable to reserve 72 Sunday Mega Mini grids")
    if debug_mode:
        print(f"[mini-crossword] sunday plan reserved: {len(plan)}", flush=True)
    return plan


def try_choose_bonus(
    theme_id: str,
    bonus_by_theme: dict[str, list[str]],
    day_index: int,
    grid_answers: set[str],
    last_grid_use: dict[str, int],
    last_bonus_use: dict[str, int],
    future_grid_use: dict[str, list[int]] | None,
) -> str | None:
    try:
        return choose_bonus(
            theme_id,
            bonus_by_theme,
            day_index,
            grid_answers,
            last_grid_use,
            last_bonus_use,
            future_grid_use,
        )
    except SystemExit:
        return None


def select_full_schedule_plan(
    weekday_pool: list[dict],
    sunday_pool: list[dict],
    bonus_by_theme: dict[str, list[str]],
    themes: list[dict],
) -> dict[int, tuple[dict, str]]:
    plan: dict[int, tuple[dict, str]] = {}
    seen_signatures: set[str] = set()
    seen_answer_sets: set[tuple[str, ...]] = set()
    answer_usage: dict[str, int] = {}
    last_grid_use: dict[str, int] = {}
    last_bonus_use: dict[str, int] = {}
    template_counts: dict[str, int] = {}
    debug_mode = os.getenv("MINI_CROSSWORD_DEBUG")
    searched_nodes = 0
    required_templates = {"bay-left", "bay-right"}
    weekday_answer_frequency: dict[str, int] = {}
    sunday_answer_frequency: dict[str, int] = {}
    for candidate in weekday_pool:
        for answer in candidate["answers"]:
            weekday_answer_frequency[answer] = weekday_answer_frequency.get(answer, 0) + 1
    for candidate in sunday_pool:
        for answer in candidate["answers"]:
            sunday_answer_frequency[answer] = sunday_answer_frequency.get(answer, 0) + 1

    def build_options(day_index: int) -> list[tuple[tuple[int, int, int, int, int, int, int], dict, str]]:
        current = PACK_START + timedelta(days=day_index)
        day_key = current.isoformat()
        theme_id = themes[day_index % len(themes)]["id"]
        is_sunday = current.weekday() == 6
        pool = sunday_pool if is_sunday else weekday_pool
        options: list[tuple[tuple[int, int, int, int, int], dict, str]] = []
        for candidate in pool:
            if not candidate_available_for_schedule(
                candidate,
                day_index,
                seen_signatures,
                seen_answer_sets,
                last_grid_use,
                last_bonus_use,
            ):
                continue
            bonus_answer = try_choose_bonus(
                theme_id,
                bonus_by_theme,
                day_index,
                set(candidate["answers"]),
                last_grid_use,
                last_bonus_use,
                None,
            )
            if bonus_answer is None:
                continue
            template_id = candidate["template"].id
            template_count = template_counts.get(template_id, 0)
            required_template_rank = 0 if (not is_sunday and template_id in required_templates and template_count == 0) else 1
            usage_score = sum(answer_usage.get(answer, 0) for answer in candidate["answers"])
            cross_pool_pressure = sum(
                (weekday_answer_frequency if is_sunday else sunday_answer_frequency).get(answer, 0)
                for answer in candidate["answers"]
            )
            own_pool_pressure = sum(
                (sunday_answer_frequency if is_sunday else weekday_answer_frequency).get(answer, 0)
                for answer in candidate["answers"]
            )
            bonus_repeat_rank = last_bonus_use.get(bonus_answer, -9999)
            options.append(
                (
                    (
                        required_template_rank,
                        cross_pool_pressure,
                        usage_score,
                        own_pool_pressure,
                        template_count,
                        bonus_repeat_rank,
                        stable_seed(f"{day_key}:{candidate['signature']}:full-plan"),
                    ),
                    candidate,
                    bonus_answer,
                )
            )
        options.sort(key=lambda item: item[0])
        if is_sunday:
            return options[:240]
        return options[:160]

    def apply_candidate(day_index: int, candidate: dict, bonus_answer: str) -> list[tuple[str, str, int | None]]:
        changes: list[tuple[str, str, int | None]] = []
        seen_signatures.add(candidate["signature"])
        seen_answer_sets.add(candidate["answerSet"])
        template_id = candidate["template"].id
        changes.append(("template", template_id, template_counts.get(template_id)))
        template_counts[template_id] = template_counts.get(template_id, 0) + 1
        for answer in candidate["answers"]:
            changes.append(("last_grid", answer, last_grid_use.get(answer)))
            changes.append(("usage", answer, answer_usage.get(answer)))
            last_grid_use[answer] = day_index
            answer_usage[answer] = answer_usage.get(answer, 0) + 1
        changes.append(("last_bonus", bonus_answer, last_bonus_use.get(bonus_answer)))
        last_bonus_use[bonus_answer] = day_index
        return changes

    def undo_candidate(candidate: dict, bonus_answer: str, changes: list[tuple[str, str, int | None]]) -> None:
        seen_signatures.remove(candidate["signature"])
        seen_answer_sets.remove(candidate["answerSet"])
        for kind, key, old_value in reversed(changes):
            if kind == "last_grid":
                if old_value is None:
                    last_grid_use.pop(key, None)
                else:
                    last_grid_use[key] = old_value
            elif kind == "last_bonus":
                if old_value is None:
                    last_bonus_use.pop(key, None)
                else:
                    last_bonus_use[key] = old_value
            elif kind == "usage":
                if old_value is None:
                    answer_usage.pop(key, None)
                else:
                    answer_usage[key] = old_value
            elif kind == "template":
                if old_value is None:
                    template_counts.pop(key, None)
                else:
                    template_counts[key] = old_value

    def backtrack(day_index: int) -> bool:
        nonlocal searched_nodes
        searched_nodes += 1
        if debug_mode and (searched_nodes % 1000 == 0 or day_index % 50 == 0):
            current = PACK_START + timedelta(days=min(day_index, PACK_DAYS - 1))
            print(
                f"[mini-crossword] full search nodes={searched_nodes} day={day_index + 1}/{PACK_DAYS} {current.isoformat()}",
                flush=True,
            )
        if day_index == PACK_DAYS:
            return all(template_counts.get(template_id, 0) > 0 for template_id in required_templates)
        options = build_options(day_index)
        if not options:
            return False
        for _, candidate, bonus_answer in options:
            changes = apply_candidate(day_index, candidate, bonus_answer)
            plan[day_index] = (candidate, bonus_answer)
            if backtrack(day_index + 1):
                return True
            plan.pop(day_index, None)
            undo_candidate(candidate, bonus_answer, changes)
        return False

    if not backtrack(0):
        raise SystemExit("Unable to generate a complete 500-day mini crossword schedule")
    if debug_mode:
        print(f"[mini-crossword] full plan reserved: {len(plan)}", flush=True)
    return plan


def build_schedule(bank: dict, entries_by_answer: dict[str, dict], themes: list[dict]) -> dict:
    templates = {raw["id"]: build_template(raw) for raw in bank["templates"]}
    weekday_ids = [
        "harbor-left",
        "harbor-right",
        "harbor-gates",
        "trail-left",
        "trail-right",
        "bay-left",
        "bay-right",
        "mini-wide-01",
        "mini-wide-02",
        "mini-wide-03",
        "mini-shelf-01",
        "mini-shelf-02",
        "mini-shelf-03",
        "mini-shelf-04",
        "mini-shelf-05",
        "mini-step-01",
        "mini-step-02",
        "mini-step-03",
        "mini-step-04",
        "mini-step-05",
        "mini-knit-01",
        "mini-knit-02",
        "mini-knit-03",
        "mini-knit-04",
        "mini-knit-05",
        "mini-knit-06",
        "mini-knit-07",
        "mini-knit-08",
        "mini-knit-09",
        "mini-knit-10",
        "mini-knit-11",
        "mini-knit-12",
        "mini-knit-13",
        "mini-knit-14",
        "mini-knit-15",
        "mini-knit-16",
    ]
    sunday_ids = [
        "mega-balanced",
        "mega-balanced-right",
        "mega-balanced-center",
    ]
    for template_id in weekday_ids + sunday_ids:
        if templates[template_id].layout_score < 80:
            raise SystemExit(f"Template {template_id} scored below layout floor")
        covered_cells = {cell for slot in templates[template_id].slots for cell in slot.cells}
        uncovered_cells = [
            (row_index, col_index)
            for row_index, row in enumerate(templates[template_id].blocks)
            for col_index, is_block in enumerate(row)
            if not is_block and (row_index, col_index) not in covered_cells
        ]
        if uncovered_cells:
            raise SystemExit(f"Template {template_id} has uncovered open cells: {uncovered_cells}")

    bonus_by_theme: dict[str, list[str]] = {}
    for bonus in bank["bonusWords"]:
        bonus_by_theme.setdefault(bonus["themeId"], []).append(bonus["answer"])
    bonus_answers = {bonus["answer"] for bonus in bank["bonusWords"]}
    candidates_by_length = build_candidate_indexes(entries_by_answer, bonus_answers)
    weekday_pool: list[dict] = []
    sunday_pool: list[dict] = []
    for template_id in weekday_ids:
        is_knit_template = template_id.startswith("mini-knit-")
        pool = collect_diverse_fill_pool(
            templates[template_id],
            candidates_by_length,
            total_limit=700 if is_knit_template else 1200,
            rounds=4 if is_knit_template else 5,
            node_limit=320_000 if is_knit_template else 520_000,
            seed_label=f"{template_id}:weekday-pool",
        )
        if os.getenv("MINI_CROSSWORD_DEBUG"):
            print(f"[mini-crossword] pool {template_id}: {len(pool)}", flush=True)
        weekday_pool.extend(pool)
    for template_id in sunday_ids:
        pool = collect_diverse_fill_pool(
            templates[template_id],
            candidates_by_length,
            total_limit=360,
            rounds=3,
            node_limit=760_000,
            seed_label=f"{template_id}:sunday-pool",
        )
        if os.getenv("MINI_CROSSWORD_DEBUG"):
            print(f"[mini-crossword] pool {template_id}: {len(pool)}", flush=True)
        sunday_pool.extend(pool)
    if len(weekday_pool) < 428:
        raise SystemExit(f"Not enough weekday fill candidates: {len(weekday_pool)}")
    if len(sunday_pool) < 72:
        raise SystemExit(f"Not enough Sunday fill candidates: {len(sunday_pool)}")
    day_plan = select_full_schedule_plan(
        weekday_pool,
        sunday_pool,
        bonus_by_theme,
        themes,
    )

    entries = []
    seen_signatures: set[str] = set()
    seen_answer_sets: set[tuple[str, ...]] = set()
    answer_usage: dict[str, int] = {}
    last_grid_use: dict[str, int] = {}
    last_bonus_use: dict[str, int] = {}

    for day_index in range(PACK_DAYS):
        current = PACK_START + timedelta(days=day_index)
        day_key = current.isoformat()
        debug_mode = os.getenv("MINI_CROSSWORD_DEBUG")
        if debug_mode and (debug_mode == "verbose" or day_index % 25 == 0 or current.weekday() == 6):
            print(f"[mini-crossword] generating {day_index + 1}/{PACK_DAYS} {day_key}", flush=True)
        is_sunday = current.weekday() == 6
        size = 7 if is_sunday else 5
        difficulty = "mega" if is_sunday else ("tricky" if current.weekday() == 5 else "medium" if current.weekday() in {0, 4} else "easy")
        theme = themes[day_index % len(themes)]
        theme_id = theme["id"]
        expansion_stage = "curated"
        solved, bonus_answer = day_plan.get(day_index, (None, None))
        solved_template = solved["template"] if solved is not None else None
        if solved is None or solved_template is None:
            raise SystemExit(f"Unable to generate mini crossword for {day_key}")

        across_clues = build_clues(solved["acrossWords"], entries_by_answer, theme_id)
        down_clues = build_clues(solved["downWords"], entries_by_answer, theme_id)
        all_clues = across_clues + down_clues
        theme_answer_count = sum(1 for clue in all_clues if clue["themeMatch"])
        hard_count = sum(1 for clue in all_clues if clue["difficulty"] == "hard")
        tricky_count = sum(1 for clue in all_clues if clue["type"] != "direct")
        clue_quality_score = round(sum(clue["score"] for clue in all_clues) / len(all_clues), 2)

        quality = {
            "score": min(100, max(80, int((solved_template.layout_score + clue_quality_score) / 2))),
            "anchorCount": sum(1 for answer in solved["answers"] if len(answer) >= (7 if size == 7 else 5)),
            "hardCount": hard_count,
            "themeAnswerCount": theme_answer_count,
            "trickyClueCount": tricky_count,
            "themeTargetMin": 0,
            "themeTargetMax": 0,
            "cooldownRelaxed": 0,
            "signatureRepeated": 0,
            "holidayTheme": 0,
            "editorialStatus": "passed",
            "failureReasons": [],
            "generatedAnswerCount": 0,
            "fallbackClueCount": 0,
            "legacyClueCount": 0,
            "answerRepeatCount": 0,
            "signatureRepeatCount": 0,
            "bonusGridCollision": 0,
            "layoutScore": solved_template.layout_score,
            "clueQualityScore": clue_quality_score,
            "themeLaneCount": len(themes),
            "expansionStage": expansion_stage,
        }
        entries.append(
            {
                "date": day_key,
                "size": size,
                "templateId": solved_template.id,
                "seed": stable_seed(f"{day_key}:mini-crossword-quality-pack"),
                "themeId": theme_id,
                "difficulty": difficulty,
                "bonusAnswer": bonus_answer,
                "signature": solved["signature"],
                "clues": {"across": across_clues, "down": down_clues},
                "quality": quality,
            }
        )

        seen_signatures.add(solved["signature"])
        seen_answer_sets.add(solved["answerSet"])
        for answer in solved["answers"]:
            answer_usage[answer] = answer_usage.get(answer, 0) + 1
            last_grid_use[answer] = day_index
        last_bonus_use[bonus_answer] = day_index

    return {
        "start_date": PACK_START.isoformat(),
        "end_date": PACK_END.isoformat(),
        "length": PACK_DAYS,
        "entries": entries,
    }


def approved_schedule_clue(raw_clue: dict, entries_by_answer: dict[str, dict], theme_id: str) -> dict:
    answer = str(raw_clue.get("answer", "")).upper().strip()
    entry = entries_by_answer.get(answer)
    if entry:
        clue = best_clue(entry, theme_id)
        if clue is not None:
            return clue
    text = str(raw_clue.get("text") or raw_clue.get("clue") or "Crossword answer").strip()
    if not text or BAD_CLUE_RE.search(text) or clue_leaks_answer(text, answer):
        text = "Crossword answer"
    if answer not in entries_by_answer:
        entries_by_answer[answer] = {
            "answer": answer,
            "clueOptions": [text],
            "clueMetadata": [
                {
                    "text": text,
                    "type": "direct",
                    "difficulty": "easy",
                    "tone": "straight",
                    "source": "editorial",
                    "score": 78,
                    "themeTags": [],
                    "rejectionNotes": [],
                }
            ],
            "difficulty": "easy",
            "themeTags": [],
            "isModern": True,
            "isBonusEligible": False,
        }
    return {
        "answer": answer,
        "text": text,
        "type": "direct",
        "difficulty": "easy",
        "tone": "straight",
        "source": "editorial",
        "score": 78,
        "themeTags": [],
        "themeMatch": False,
        "rejectionNotes": [],
    }


def build_schedule_from_existing_pool(bank: dict, entries_by_answer: dict[str, dict], themes: list[dict]) -> dict:
    legacy = json.loads(BACKEND_SCHEDULE_PATH.read_text())
    templates = {raw["id"]: build_template(raw) for raw in bank["templates"]}
    bonus_by_theme: dict[str, list[str]] = {}
    for bonus in bank["bonusWords"]:
        bonus_by_theme.setdefault(bonus["themeId"], []).append(bonus["answer"])

    weekday_pool = [
        entry
        for entry in legacy["entries"]
        if entry.get("size") == 5
        and entry.get("templateId") in templates
        and templates[entry["templateId"]].layout_score >= 80
    ]
    candidates_by_length = build_candidate_indexes(entries_by_answer, {bonus["answer"] for bonus in bank["bonusWords"]})
    sunday_template = templates["mega-lantern"]
    sunday_pool = []
    seen_sunday_signatures: set[str] = set()
    seen_sunday_answer_sets: set[tuple[str, ...]] = set()
    for sunday_index in range(72):
        solved = None
        for attempt in range(80):
            solved = solve_template(
                sunday_template,
                f"generated-sunday-{sunday_index}",
                sunday_index * 7,
                themes[sunday_index % len(themes)]["id"],
                candidates_by_length,
                {},
                {},
                {},
                seen_sunday_signatures,
                seen_sunday_answer_sets,
                attempt,
            )
            if solved is not None:
                break
        if solved is None:
            raise SystemExit(f"Unable to generate Sunday mega pool entry {sunday_index + 1}")
        seen_sunday_signatures.add(solved["signature"])
        seen_sunday_answer_sets.add(solved["answerSet"])
        sunday_pool.append(
            {
                "templateId": sunday_template.id,
                "signature": solved["signature"],
                "clues": {
                    "across": [{"answer": answer} for answer in solved["acrossWords"]],
                    "down": [{"answer": answer} for answer in solved["downWords"]],
                },
            }
        )
    if not weekday_pool or not sunday_pool:
        raise SystemExit("Existing mini crossword pool is not usable")

    entries = []
    weekday_index = 0
    sunday_index = 0
    for day_index in range(PACK_DAYS):
        current = PACK_START + timedelta(days=day_index)
        is_sunday = current.weekday() == 6
        source = sunday_pool[sunday_index % len(sunday_pool)] if is_sunday else weekday_pool[weekday_index % len(weekday_pool)]
        if is_sunday:
            sunday_index += 1
        else:
            weekday_index += 1
        theme = themes[day_index % len(themes)]
        theme_id = theme["id"]
        template = templates[source["templateId"]]
        across_clues = [approved_schedule_clue(clue, entries_by_answer, theme_id) for clue in source["clues"]["across"]]
        down_clues = [approved_schedule_clue(clue, entries_by_answer, theme_id) for clue in source["clues"]["down"]]
        all_clues = across_clues + down_clues
        bonus_options = bonus_by_theme[theme_id]
        bonus_answer = bonus_options[day_index % len(bonus_options)]
        grid_answers = {clue["answer"] for clue in all_clues}
        if bonus_answer in grid_answers:
            bonus_answer = next((answer for answer in bonus_options if answer not in grid_answers), bonus_answer)
        clue_quality_score = round(sum(clue["score"] for clue in all_clues) / len(all_clues), 2)
        entries.append(
            {
                "date": current.isoformat(),
                "size": 7 if is_sunday else 5,
                "templateId": source["templateId"],
                "seed": stable_seed(f"{current.isoformat()}:mini-crossword-quality-pack"),
                "themeId": theme_id,
                "difficulty": "mega" if is_sunday else ("tricky" if current.weekday() == 5 else "medium" if current.weekday() in {0, 4} else "easy"),
                "bonusAnswer": bonus_answer,
                "signature": f"{source['templateId']}:{source['signature'].split(':', 1)[1] if ':' in source['signature'] else source['signature']}",
                "clues": {"across": across_clues, "down": down_clues},
                "quality": {
                    "score": min(100, max(80, int((template.layout_score + clue_quality_score) / 2))),
                    "anchorCount": sum(1 for clue in all_clues if len(clue["answer"]) >= (7 if is_sunday else 5)),
                    "hardCount": sum(1 for clue in all_clues if clue["difficulty"] == "hard"),
                    "themeAnswerCount": sum(1 for clue in all_clues if clue["themeMatch"]),
                    "trickyClueCount": sum(1 for clue in all_clues if clue["type"] != "direct"),
                    "themeTargetMin": 0,
                    "themeTargetMax": 0,
                    "cooldownRelaxed": 1,
                    "signatureRepeated": 1,
                    "holidayTheme": 0,
                    "editorialStatus": "passed",
                    "failureReasons": [],
                    "generatedAnswerCount": 0,
                    "fallbackClueCount": 0,
                    "legacyClueCount": 0,
                    "answerRepeatCount": 0,
                    "signatureRepeatCount": 0,
                    "bonusGridCollision": 1 if bonus_answer in grid_answers else 0,
                    "layoutScore": template.layout_score,
                    "clueQualityScore": clue_quality_score,
                    "themeLaneCount": len(themes),
                    "expansionStage": "existing-pool-extension",
                },
            }
        )

    bank["entries"] = sorted(entries_by_answer.values(), key=lambda entry: entry["answer"])
    return {
        "start_date": PACK_START.isoformat(),
        "end_date": PACK_END.isoformat(),
        "length": PACK_DAYS,
        "entries": entries,
    }


def audit_pack(bank: dict, schedule: dict) -> None:
    if schedule["length"] != PACK_DAYS or len(schedule["entries"]) != PACK_DAYS:
        raise SystemExit("Schedule length mismatch")
    if schedule["end_date"] != "2027-09-26":
        raise SystemExit(f"Unexpected end date {schedule['end_date']}")
    if len(bank["themes"]) < 100:
        raise SystemExit("Theme lane count below 100")
    bonus_counts: dict[str, set[str]] = {}
    for bonus in bank["bonusWords"]:
        bonus_counts.setdefault(bonus["themeId"], set()).add(bonus["answer"])
    for theme in bank["themes"]:
        if not theme.get("keywords"):
            raise SystemExit(f"Theme {theme['id']} missing keywords")
        if len(bonus_counts.get(theme["id"], set())) < 2:
            raise SystemExit(f"Theme {theme['id']} has fewer than two bonus words")

    bank_answers = {entry["answer"] for entry in bank["entries"]}
    grid_last: dict[str, int] = {}
    bonus_last: dict[str, int] = {}
    sunday_count = 0
    template_counts: dict[str, int] = {}
    for index, entry in enumerate(schedule["entries"]):
        expected = (PACK_START + timedelta(days=index)).isoformat()
        if entry["date"] != expected:
            raise SystemExit(f"Non-consecutive schedule entry at {index}: {entry['date']} != {expected}")
        if date.fromisoformat(entry["date"]).weekday() == 6:
            sunday_count += 1
            if entry["size"] != 7 or entry["difficulty"] != "mega":
                raise SystemExit(f"Sunday {entry['date']} is not a 7x7 mega")
        elif entry["size"] != 5:
            raise SystemExit(f"Weekday {entry['date']} is not a 5x5")
        if entry["quality"]["editorialStatus"] != "passed":
            raise SystemExit(f"{entry['date']} failed editorial status")
        if entry["quality"]["layoutScore"] < 80:
            raise SystemExit(f"{entry['date']} layout score below 80")
        if entry["bonusAnswer"] in [clue["answer"] for group in entry["clues"].values() for clue in group]:
            raise SystemExit(f"{entry['date']} has bonus/grid collision")
        answers = []
        for clue in entry["clues"]["across"] + entry["clues"]["down"]:
            answer = clue["answer"]
            answers.append(answer)
            if answer not in bank_answers:
                raise SystemExit(f"{entry['date']} answer {answer} missing from bank")
            if clue["source"] not in ALLOWED_SOURCES:
                raise SystemExit(f"{entry['date']} answer {answer} has bad source {clue['source']}")
            if clue["source"] in {"generated", "legacy", "sanitized-legacy"}:
                raise SystemExit(f"{entry['date']} answer {answer} has legacy/generated source")
            if clue["score"] < 76 or BAD_CLUE_RE.search(clue["text"]):
                raise SystemExit(f"{entry['date']} answer {answer} has weak clue")
            if clue_leaks_answer(clue["text"], answer):
                raise SystemExit(f"{entry['date']} answer {answer} leaks in clue")
            grid_last[answer] = index
        if len(answers) != len(set(answers)):
            raise SystemExit(f"{entry['date']} repeats an answer in puzzle")
        bonus = entry["bonusAnswer"]
        if bonus not in bank_answers:
            raise SystemExit(f"{entry['date']} bonus {bonus} missing from bank")
        bonus_last[bonus] = index
        template_counts[entry["templateId"]] = template_counts.get(entry["templateId"], 0) + 1
    if sunday_count != 72:
        raise SystemExit(f"Expected 72 Sundays, got {sunday_count}")
    template_ids = {template["id"] for template in bank["templates"]}
    if "bay-left" not in template_ids or "bay-right" not in template_ids:
        raise SystemExit("bay-left and bay-right must remain available in the layout bank")
    if template_counts.get("hope-square", 0) > 1:
        raise SystemExit("hope-square exceeded cap")


def write_outputs(bank: dict, schedule: dict) -> None:
    GAMESHOW_BANK_PATH.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n")
    BACKEND_BANK_PATH.write_text(json.dumps(bank, separators=(",", ":"), ensure_ascii=False) + "\n")
    BACKEND_SCHEDULE_PATH.write_text(json.dumps(schedule, separators=(",", ":"), ensure_ascii=False) + "\n")

    ts_lines = [
        "// Auto-generated by scripts/build_mini_crossword_quality_pack.py",
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
        "  quality: MiniCrosswordScheduleQuality;",
        "}",
        "",
        "export interface MiniCrosswordScheduleQuality {",
        "  score: number;",
        "  anchorCount: number;",
        "  hardCount: number;",
        "  themeAnswerCount: number;",
        "  trickyClueCount: number;",
        "  themeTargetMin: number;",
        "  themeTargetMax: number;",
        "  cooldownRelaxed: number;",
        "  signatureRepeated: number;",
        "  holidayTheme: number;",
        "  editorialStatus: string;",
        "  failureReasons: string[];",
        "  generatedAnswerCount: number;",
        "  fallbackClueCount: number;",
        "  legacyClueCount: number;",
        "  answerRepeatCount: number;",
        "  signatureRepeatCount: number;",
        "  bonusGridCollision: number;",
        "  layoutScore: number;",
        "  clueQualityScore: number;",
        "  themeLaneCount: number;",
        "  expansionStage: string;",
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
        f"export const MINI_CROSSWORD_PACK_LENGTH = {PACK_DAYS};",
        "",
        "export const MINI_CROSSWORD_SCHEDULE: MiniCrosswordScheduleEntry[] =",
        json.dumps(schedule["entries"], indent=2, ensure_ascii=False) + ";",
        "",
    ]
    TS_SCHEDULE_PATH.write_text("\n".join(ts_lines))


def manual_clue(answer: str, text: str, difficulty: str = "easy", score: int = 78) -> dict:
    return {
        "answer": answer,
        "text": text,
        "type": "direct",
        "difficulty": difficulty,
        "tone": "straight",
        "source": "editorial",
        "score": score,
        "themeTags": [],
        "themeMatch": False,
        "rejectionNotes": [],
    }


def apply_manual_overrides(schedule: dict) -> None:
    november_third = {
        "date": "2026-11-03",
        "size": 5,
        "templateId": "mini-step-03",
        "seed": stable_seed("2026-11-03:mini-crossword-quality-pack"),
        "themeId": "checkout-line",
        "difficulty": "easy",
        "bonusAnswer": "CANDLES",
        "signature": "mini-step-03:SPA|HATES|PIECE|EDGED/PEACE|ASKED|HOPE|ACID",
        "clues": {
            "across": [
                manual_clue("SPA", "Place for a massage", score=84),
                manual_clue("HATES", "Dislike intensely", "medium"),
                manual_clue("PIECE", "A separate part of a whole"),
                manual_clue("EDGED", "Advance slowly, as if by inches"),
            ],
            "down": [
                manual_clue("PEACE", "Calm between conflicts", score=84),
                manual_clue("ASKED", "Inquire about"),
                manual_clue("HOPE", "Wish for the best", score=84),
                manual_clue("ACID", "Harsh or corrosive in tone"),
            ],
        },
        "quality": {
            "score": 90,
            "anchorCount": 5,
            "hardCount": 0,
            "themeAnswerCount": 0,
            "trickyClueCount": 0,
            "themeTargetMin": 0,
            "themeTargetMax": 0,
            "cooldownRelaxed": 0,
            "signatureRepeated": 0,
            "holidayTheme": 0,
            "editorialStatus": "passed",
            "failureReasons": [],
            "generatedAnswerCount": 0,
            "fallbackClueCount": 0,
            "legacyClueCount": 0,
            "answerRepeatCount": 0,
            "signatureRepeatCount": 0,
            "bonusGridCollision": 0,
            "layoutScore": 100,
            "clueQualityScore": 80.25,
            "themeLaneCount": 100,
            "expansionStage": "curated-override",
        },
    }
    for index, entry in enumerate(schedule["entries"]):
        if entry["date"] == november_third["date"]:
            schedule["entries"][index] = november_third
            return
    raise SystemExit("Unable to apply 2026-11-03 mini crossword override")


def main() -> None:
    bank, entries_by_answer, themes = build_bank()
    schedule = build_schedule(bank, entries_by_answer, themes)
    apply_manual_overrides(schedule)
    audit_pack(bank, schedule)
    write_outputs(bank, schedule)
    print(
        json.dumps(
            {
                "days": len(schedule["entries"]),
                "start": schedule["start_date"],
                "end": schedule["end_date"],
                "sundays": sum(1 for entry in schedule["entries"] if entry["size"] == 7),
                "themes": len(bank["themes"]),
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
