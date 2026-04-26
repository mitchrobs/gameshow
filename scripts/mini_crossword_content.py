"""Shared editorial content and validation helpers for Daybreak mini crosswords."""

from __future__ import annotations

import re
from typing import Dict, List, Sequence, Set, Tuple

THEMES = [
    {
        "id": "coffee-break",
        "label": "Coffee Break",
        "description": "Cafe orders, warm mugs, and small morning rituals.",
        "visual": {"motif": "steam", "accent": "#b66a3c", "tint": "#fff0e5"},
    },
    {
        "id": "fresh-air",
        "label": "Fresh Air",
        "description": "Walks, parks, gardens, and getting outside.",
        "visual": {"motif": "rays", "accent": "#3f8f72", "tint": "#e8f7ef"},
    },
    {
        "id": "home-reset",
        "label": "Home Reset",
        "description": "Quiet rooms, tidy counters, and weekend nesting.",
        "visual": {"motif": "window", "accent": "#7b6bb5", "tint": "#f0edff"},
    },
    {
        "id": "book-nook",
        "label": "Book Nook",
        "description": "Reading, journals, libraries, and soft curiosity.",
        "visual": {"motif": "pages", "accent": "#526fa3", "tint": "#eaf0ff"},
    },
    {
        "id": "kitchen-table",
        "label": "Kitchen Table",
        "description": "Breakfast, snacks, dinners, and shared meals.",
        "visual": {"motif": "tiles", "accent": "#c7782d", "tint": "#fff2dd"},
    },
    {
        "id": "weekend-glow",
        "label": "Weekend Glow",
        "description": "Plans, picnics, games, and unhurried fun.",
        "visual": {"motif": "confetti", "accent": "#d45b73", "tint": "#ffeaf0"},
    },
    {
        "id": "weather-watch",
        "label": "Weather Watch",
        "description": "Rain, sun, clouds, breezes, and looking up.",
        "visual": {"motif": "drops", "accent": "#3d86b8", "tint": "#e7f5ff"},
    },
    {
        "id": "city-stroll",
        "label": "City Stroll",
        "description": "Blocks, transit, shops, and neighborhood rhythms.",
        "visual": {"motif": "blocks", "accent": "#68727c", "tint": "#eef2f5"},
    },
    {
        "id": "soundtrack",
        "label": "Soundtrack",
        "description": "Songs, radio, albums, and tunes for the day.",
        "visual": {"motif": "bars", "accent": "#8a67c8", "tint": "#f2ecff"},
    },
    {
        "id": "mindful-morning",
        "label": "Mindful Morning",
        "description": "Calm starts, sleep, focus, stretching, and balance.",
        "visual": {"motif": "breathe", "accent": "#4f9a86", "tint": "#e8f7f2"},
    },
    {
        "id": "travel-lite",
        "label": "Travel Lite",
        "description": "Routes, maps, trains, airports, and little getaways.",
        "visual": {"motif": "path", "accent": "#2f7bbd", "tint": "#e8f2ff"},
    },
    {
        "id": "culture-corner",
        "label": "Culture Corner",
        "description": "Movies, museums, posts, games, and the internet hum.",
        "visual": {"motif": "spark", "accent": "#c35f8d", "tint": "#ffeaf6"},
    },
]


def _theme_expansion(
    theme_id: str,
    label: str,
    description: str,
    motif: str,
    accent: str,
    tint: str,
    words: str,
    bonus_answer: str,
    bonus_clue: str,
    keywords: str | None = None,
) -> Dict[str, object]:
    word_list = words.split()
    return {
        "id": theme_id,
        "label": label,
        "description": description,
        "visual": {"motif": motif, "accent": accent, "tint": tint},
        "words": word_list,
        "keywords": (keywords.split() if keywords else word_list),
        "bonus": {
            "answer": bonus_answer,
            "themeId": theme_id,
            "clue": bonus_clue,
        },
    }


_THEME_EXPANSIONS = [
    _theme_expansion(
        "first-cup",
        "First Cup",
        "The first warm sip, cafe aroma, and a gentle start.",
        "steam",
        "#a8643f",
        "#fff1e8",
        "aroma brew cafe coffee cup dawn eager early extra java joe light mug pause ready sip start steam tea toast",
        "ROASTED",
        "Like coffee beans after heat",
    ),
    _theme_expansion(
        "tea-kettle",
        "Tea Kettle",
        "Kettles, steeping, honey, and the quieter side of morning.",
        "steam",
        "#7b8f45",
        "#f3f8df",
        "brew calm cup honey kettle leaf light pause pot ready sip steam tea water warm",
        "STEEPED",
        "Left in hot water, as tea",
    ),
    _theme_expansion(
        "bakery-run",
        "Bakery Run",
        "Pastries, warm bread, and a little paper-bag delight.",
        "tiles",
        "#c8753b",
        "#fff0dd",
        "bag bagel bake bakery bread bun cake dawn eager extra jam light muffin ready risen roll start toast warm",
        "MUFFINS",
        "Bakery case treats with domed tops",
    ),
    _theme_expansion(
        "brunch-hour",
        "Brunch Hour",
        "Late breakfasts, cheerful tables, and easy weekend plates.",
        "tiles",
        "#d08a35",
        "#fff4df",
        "bagel brunch cafe cake egg eggs feast food fork jam late light lunch meal omelet pan plate ready table toast",
        "OMELETS",
        "Folded egg dishes",
    ),
    _theme_expansion(
        "sweet-treat",
        "Sweet Treat",
        "Small desserts, bakery joy, and a little reward.",
        "spark",
        "#d36a87",
        "#ffeaf1",
        "bake cake candy cookie cookies dessert extra feast fruit fun gift honey jam joy pie sweet treat wow yay",
        "COOKIES",
        "Sweet baked rounds",
    ),
    _theme_expansion(
        "farmers-market",
        "Farmers Market",
        "Stalls, produce, flowers, baskets, and morning errands.",
        "blocks",
        "#6f9b48",
        "#edf8df",
        "apple basket baskets bean berry bread carry egg farm farmers flower food fruit honey market produce shop stalls table",
        "PRODUCE",
        "Fruits and vegetables at a market",
    ),
    _theme_expansion(
        "garden-walk",
        "Garden Walk",
        "Flowers, paths, soil, and a slow look around.",
        "rays",
        "#4b9a66",
        "#e7f8e9",
        "air bloom flower flowers garden grass grow leaf light path plant rose sky soil sun walk water",
        "FLOWERS",
        "Garden blooms",
    ),
    _theme_expansion(
        "park-loop",
        "Park Loop",
        "Jogging paths, benches, lawns, and fresh-air loops.",
        "path",
        "#4f8d61",
        "#e9f6e7",
        "air bike bikes bird birds grass jog lane lap light loop oak park path ready run sky trail walk",
        "BICYCLE",
        "Two-wheeled park ride",
    ),
    _theme_expansion(
        "porch-sun",
        "Porch Sun",
        "A slow porch sit, warm light, and neighborhood quiet.",
        "rays",
        "#d09a3b",
        "#fff4d8",
        "chair dawn den ease home lamp light pause porch quiet ray ready rest slow sun sunny warm window",
        "ROCKING",
        "Porch chair motion",
    ),
    _theme_expansion(
        "beach-morning",
        "Beach Morning",
        "Sand, shore light, waves, and an easy coastal start.",
        "path",
        "#2f8ca8",
        "#e4f7fb",
        "air bay beach coast coastal dry light ocean sand sea seaside shore sky sun walk wave wet",
        "SEASIDE",
        "By the shore",
    ),
    _theme_expansion(
        "river-path",
        "River Path",
        "Water beside the trail, bridges, and steady movement.",
        "path",
        "#3d8fb6",
        "#e6f5ff",
        "air bridge current flow oar path river road row run stream streams trail water way wet",
        "STREAMS",
        "Small flowing waters",
    ),
    _theme_expansion(
        "trailhead",
        "Trailhead",
        "A map check, laced shoes, and the first steps out.",
        "path",
        "#4c8756",
        "#e8f5e7",
        "air camp hike hikes hill map marker oak outdoor path ready road start trail walk way",
        "MARKERS",
        "Signs that guide a trail",
    ),
    _theme_expansion(
        "rainy-window",
        "Rainy Window",
        "Drops on glass, low clouds, and cozy indoor weather.",
        "drops",
        "#3d86b8",
        "#e6f4ff",
        "cloud drops fog grey home light pause rain rainy room sky spray storm warm wet window",
        "DRIZZLE",
        "Light rain",
    ),
    _theme_expansion(
        "breezy-day",
        "Breezy Day",
        "Open windows, soft wind, and a moving sky.",
        "rays",
        "#5f9f9d",
        "#e7f8f6",
        "air breeze breezes clear cloud fresh light opens sky still warm wind window",
        "BREEZES",
        "Gentle winds",
    ),
    _theme_expansion(
        "golden-hour",
        "Golden Hour",
        "Warm late-day light and everything softly glowing.",
        "rays",
        "#cf8b2d",
        "#fff0cf",
        "amber beam bright dawn glow golden horizon light ray sky sun sunny warm",
        "SUNBEAM",
        "Shaft of sunlight",
    ),
    _theme_expansion(
        "snow-day",
        "Snow Day",
        "Quiet streets, mittens, and a bright winter pause.",
        "drops",
        "#5c91b6",
        "#eaf6ff",
        "blanket cold day dry ice icy light mittens quiet sky snow snowy soft warm window",
        "MITTENS",
        "Cozy hand warmers",
    ),
    _theme_expansion(
        "summer-light",
        "Summer Light",
        "Long days, bright plans, and easy warm weather.",
        "rays",
        "#d69d2d",
        "#fff6d8",
        "beach bright day daytime dry fun hot light park picnic plan ready sky sun sunny warm",
        "DAYTIME",
        "Bright part of the day",
    ),
    _theme_expansion(
        "moonrise",
        "Moonrise",
        "Evening sky, soft light, and the day winding down.",
        "spark",
        "#6f74b8",
        "#eeeeff",
        "calm dark dream evening glow light moon night quiet rest sky sleep star still",
        "EVENING",
        "Time after late afternoon",
    ),
    _theme_expansion(
        "tidy-desk",
        "Tidy Desk",
        "Clear surfaces, notes in order, and a ready workday.",
        "blocks",
        "#7b7480",
        "#f1eff3",
        "array book clean clear desk drawer edit file lamp list notes order page pen ready tidy work",
        "DRAWERS",
        "Desk storage slots",
    ),
    _theme_expansion(
        "laundry-day",
        "Laundry Day",
        "Fresh towels, folded stacks, and a small reset.",
        "window",
        "#7c8c9a",
        "#eef3f6",
        "basket clean dry fold fresh home laundry light room sheet soft towel warm wash",
        "HAMPERS",
        "Laundry baskets",
    ),
    _theme_expansion(
        "candle-hour",
        "Candle Hour",
        "A softer room, warm light, and a calm pause.",
        "spark",
        "#b77b55",
        "#fff0e7",
        "calm candle candles cozy den ease flame glow home lamp light pause quiet room warm",
        "CANDLES",
        "Small lights with wicks",
    ),
    _theme_expansion(
        "cozy-corner",
        "Cozy Corner",
        "Blankets, soft seats, and tucked-away comfort.",
        "window",
        "#8a6ca8",
        "#f4edff",
        "bed blanket chair cozy den ease home lamp nook quiet rest room rug soft warm",
        "COMFORT",
        "Cozy feeling",
    ),
    _theme_expansion(
        "plant-care",
        "Plant Care",
        "Watering, leaves, pots, and windowsill green.",
        "rays",
        "#56975e",
        "#e9f8e8",
        "grow leaf leaves light plant pot roots soil sun tends water watered window",
        "WATERED",
        "Gave a plant a drink",
    ),
    _theme_expansion(
        "bedroom-reset",
        "Bedroom Reset",
        "Made beds, quiet light, and a restful room.",
        "window",
        "#7782b8",
        "#eef0ff",
        "bed bedtime blanket calm dream light pillow rest room sheet sleep soft tidy window",
        "BLANKET",
        "Cozy bed layer",
    ),
    _theme_expansion(
        "newspaper-stack",
        "Newspaper Stack",
        "Headlines, columns, coffee, and morning reading.",
        "pages",
        "#657a9c",
        "#edf2fb",
        "article column edit ink news note page paper read story text title word write",
        "ARTICLE",
        "Newspaper piece",
    ),
    _theme_expansion(
        "puzzle-page",
        "Puzzle Page",
        "Clues, grids, answers, and the satisfying final square.",
        "tiles",
        "#5e7eb7",
        "#eaf1ff",
        "answer answers clue clues grid letters page puzzle solve square word words",
        "ANSWERS",
        "What solvers fill in",
    ),
    _theme_expansion(
        "poem-moment",
        "Poem Moment",
        "A line, an image, and a little word music.",
        "pages",
        "#7c6fb2",
        "#f2eeff",
        "art image ink line lyric ode page poem read rhyme song stanza word",
        "STANZAS",
        "Poem sections",
    ),
    _theme_expansion(
        "library-card",
        "Library Card",
        "Shelves, quiet aisles, and borrowed stories.",
        "pages",
        "#58739f",
        "#eaf0fb",
        "book card chapter library line page quiet read readers shelf story study word",
        "READERS",
        "People turning pages",
    ),
    _theme_expansion(
        "sketchbook",
        "Sketchbook",
        "Pencils, shapes, and a page filling with ideas.",
        "spark",
        "#7f858f",
        "#f0f2f5",
        "art draw drawing image line page paper pen pencil sketch study",
        "DRAWING",
        "Sketchbook creation",
    ),
    _theme_expansion(
        "letter-note",
        "Letter Note",
        "A small message, a pen, and words meant for someone.",
        "pages",
        "#8a6f5f",
        "#f7efe9",
        "card dear edit ink letter line message note page paper pen send word write",
        "MESSAGE",
        "Note sent to someone",
    ),
    _theme_expansion(
        "cinema-night",
        "Cinema Night",
        "Popcorn, previews, and a shared screen glow.",
        "spark",
        "#9b5b7a",
        "#ffeaf3",
        "ads cinema film light movie night popcorn screen seats show stage ticket video",
        "POPCORN",
        "Classic movie snack",
    ),
    _theme_expansion(
        "museum-hour",
        "Museum Hour",
        "Galleries, frames, quiet looking, and bright ideas.",
        "spark",
        "#826c55",
        "#f6efe7",
        "art artist artists gallery image light museum painting photo room study title",
        "GALLERY",
        "Museum room",
    ),
    _theme_expansion(
        "podcast-walk",
        "Podcast Walk",
        "A good episode in your ears while you wander.",
        "bars",
        "#6d73b8",
        "#eef0ff",
        "audio earbuds episode listen media podcast radio sound stream walk voice",
        "EPISODE",
        "Podcast installment",
    ),
    _theme_expansion(
        "photo-roll",
        "Photo Roll",
        "Snapshots, galleries, and the day saved in images.",
        "spark",
        "#4f86a0",
        "#e7f5fb",
        "camera capture gallery image lens light photo picture roll screen share shot",
        "CAPTURE",
        "Take, as a photo",
    ),
    _theme_expansion(
        "game-night",
        "Game Night",
        "Cards, turns, scores, and a friendly table.",
        "confetti",
        "#8a67c8",
        "#f2ecff",
        "card cards dice fun game games play players score table turn win yay",
        "PLAYERS",
        "People around a game table",
    ),
    _theme_expansion(
        "friend-date",
        "Friend Date",
        "Coffee, a walk, a laugh, and time together.",
        "confetti",
        "#cf627a",
        "#ffeaf0",
        "agree chat coffee company friend fun happy laugh lunch meet pep plan ready share talk walk yes",
        "COMPANY",
        "People you're glad to be with",
    ),
    _theme_expansion(
        "family-table",
        "Family Table",
        "Shared plates, stories, and familiar voices.",
        "tiles",
        "#bf7c39",
        "#fff1df",
        "dinner dinners family feast food fork home meal plate table talk warm",
        "DINNERS",
        "Evening family meals",
    ),
    _theme_expansion(
        "picnic-basket",
        "Picnic Basket",
        "Blankets, snacks, sunshine, and eating outside.",
        "confetti",
        "#5d9858",
        "#ecf8e8",
        "basket baskets blanket food grass lunch park picnic plate snack sun sunny",
        "BASKETS",
        "Picnic carriers",
    ),
    _theme_expansion(
        "soup-pot",
        "Soup Pot",
        "Warm bowls, simmering vegetables, and a comforting meal.",
        "steam",
        "#bd7442",
        "#fff0e4",
        "bean bowl broth dinner food kitchen meal pot soup spice spoon stew warm",
        "LENTILS",
        "Small legumes in many soups",
    ),
    _theme_expansion(
        "snack-plate",
        "Snack Plate",
        "A few bites, a little crunch, and an easy pause.",
        "tiles",
        "#c49a36",
        "#fff5da",
        "apple bowl chip cracker extra fruit plate snack table taste treat",
        "CRACKER",
        "Crisp snack",
    ),
    _theme_expansion(
        "dinner-party",
        "Dinner Party",
        "Guests, candles, plates, and dessert on the way.",
        "confetti",
        "#be6c67",
        "#ffefec",
        "candle company dessert dinner feast food friend guests meal plate table toast",
        "DESSERT",
        "Sweet final course",
    ),
    _theme_expansion(
        "train-ride",
        "Train Ride",
        "Stations, tickets, windows, and a steady rail rhythm.",
        "path",
        "#526fa3",
        "#eaf0ff",
        "arrival board gate map rail ride route station ticket train travel trip window",
        "STATION",
        "Train stop",
    ),
    _theme_expansion(
        "road-trip",
        "Road Trip",
        "Open roads, playlists, snacks, and the next stop.",
        "path",
        "#3f7ea8",
        "#e7f3fb",
        "bag car drive getaway map road roads route snack stop travel trip van way",
        "MILEAGE",
        "Distance logged on a road trip",
    ),
    _theme_expansion(
        "map-check",
        "Map Check",
        "Routes, turns, and the small ritual before heading out.",
        "path",
        "#5477a5",
        "#e9f1ff",
        "arrival compass map maps path ready road route start stop ticket trip way",
        "ROUTING",
        "Planning a path",
    ),
    _theme_expansion(
        "market-stroll",
        "Market Stroll",
        "Shop windows, stalls, bags, and a friendly errand.",
        "blocks",
        "#79815e",
        "#f0f4e8",
        "bag block cafe city errand market sales shop shops stall stroll street table walk",
        "VENDORS",
        "People selling at market stalls",
    ),
    _theme_expansion(
        "neighborhood-loop",
        "Neighborhood Loop",
        "Blocks, corners, porches, and a familiar walk.",
        "blocks",
        "#68727c",
        "#eef2f5",
        "alley block city corner home lane loop neighbor porch road route street walk way",
        "CORNERS",
        "Places where blocks meet",
    ),
    _theme_expansion(
        "jazz-morning",
        "Jazz Morning",
        "Soft brass, steady rhythm, and music with coffee.",
        "bars",
        "#8a67c8",
        "#f3ecff",
        "album band beat chord gig jazz light music piano radio rhythm sax song sound tune",
        "TRUMPET",
        "Brassy jazz instrument",
    ),
    _theme_expansion(
        "stretch-time",
        "Stretch Time",
        "A little movement, a deep breath, and a calmer body.",
        "breathe",
        "#4f9a86",
        "#e8f7f2",
        "air balance breathe calm ease focus pause ready rest slow stretch yoga zen",
        "LOOSENS",
        "Gets less stiff",
    ),
]

THEMES.extend(
    {
        "id": str(theme["id"]),
        "label": str(theme["label"]),
        "description": str(theme["description"]),
        "visual": theme["visual"],
    }
    for theme in _THEME_EXPANSIONS
)

THEME_IDS = {theme["id"] for theme in THEMES}

FILL_ONLY_THEME_WORDS = {
    "dawn",
    "day",
    "eager",
    "early",
    "extra",
    "late",
    "light",
    "opens",
    "pause",
    "ready",
    "risen",
    "start",
    "still",
    "timer",
    "way",
}

TEMPLATES = [
    {"id": "harbor-left", "rows": [".....", ".....", ".....", "##...", "##..."]},
    {"id": "harbor-right", "rows": [".....", ".....", ".....", "...##", "...##"]},
    {"id": "harbor-gates", "rows": [".....", ".....", ".....", "#...#", "#...#"]},
    {"id": "trail-left", "rows": ["##...", "##...", ".....", ".....", "....."]},
    {"id": "trail-right", "rows": ["...##", "...##", ".....", ".....", "....."]},
    {"id": "bay-left", "rows": ["#....", "#....", ".....", "....#", "....#"]},
    {"id": "bay-right", "rows": ["....#", "....#", ".....", "#....", "#...."]},
    {"id": "hope-square", "rows": ["....#", "....#", "....#", "....#", "#####"]},
    {"id": "mega-corners", "rows": ["...#...", "...#...", "...#...", "#######", "...#...", "...#...", "...#..."]},
    {"id": "mega-pinwheel", "rows": ["...#...", "...#...", ".......", "##...##", ".......", "...#...", "...#..."]},
    {"id": "mega-porch", "rows": ["##.....", "##.....", ".......", "...#...", ".......", ".....##", ".....##"]},
]

THEME_WORDS: Dict[str, Set[str]] = {
    "coffee-break": {
        "ale",
        "barista",
        "beans",
        "brew",
        "cafe",
        "coffee",
        "cup",
        "java",
        "latte",
        "mugs",
        "steam",
        "tea",
    },
    "fresh-air": {
        "beach",
        "breeze",
        "fresh",
        "garden",
        "grass",
        "hikes",
        "outdoor",
        "park",
        "path",
        "river",
        "sky",
        "trail",
        "walk",
        "walking",
    },
    "home-reset": {
        "bed",
        "blanket",
        "calm",
        "clean",
        "desk",
        "home",
        "house",
        "lamp",
        "room",
        "tidy",
        "window",
    },
    "book-nook": {
        "book",
        "bookish",
        "chapter",
        "journal",
        "library",
        "notes",
        "page",
        "read",
        "readers",
        "story",
        "study",
        "word",
    },
    "kitchen-table": {
        "apple",
        "bagel",
        "bake",
        "bread",
        "cake",
        "cooking",
        "dinners",
        "egg",
        "food",
        "honey",
        "kitchen",
        "lunch",
        "pancake",
        "pasta",
        "pizza",
        "ramen",
        "salsa",
        "snack",
        "soup",
        "spice",
        "sushi",
        "toast",
    },
    "weekend-glow": {
        "beach",
        "campers",
        "chill",
        "games",
        "getaway",
        "movie",
        "nap",
        "party",
        "picnics",
        "plans",
        "play",
        "playful",
        "relax",
        "rest",
        "weekend",
    },
    "weather-watch": {
        "cloud",
        "fog",
        "glow",
        "light",
        "moon",
        "rain",
        "rainbow",
        "snow",
        "solar",
        "sun",
        "sunrise",
        "thunder",
        "warm",
        "weather",
        "wind",
    },
    "city-stroll": {
        "block",
        "bus",
        "cab",
        "city",
        "lanes",
        "metro",
        "plaza",
        "road",
        "route",
        "shops",
        "skyline",
        "subways",
        "tower",
        "traffic",
        "train",
        "urban",
    },
    "soundtrack": {
        "album",
        "band",
        "beats",
        "chord",
        "guitars",
        "jam",
        "jazz",
        "lyric",
        "music",
        "notes",
        "opera",
        "piano",
        "radio",
        "rap",
        "rhythms",
        "sing",
        "songs",
        "tune",
    },
    "mindful-morning": {
        "balance",
        "breathe",
        "calm",
        "ease",
        "focus",
        "mindful",
        "peace",
        "reset",
        "rest",
        "sleep",
        "slow",
        "stretch",
        "water",
        "yoga",
        "zen",
    },
    "travel-lite": {
        "airport",
        "arrival",
        "cabin",
        "drive",
        "getaway",
        "hotel",
        "local",
        "map",
        "path",
        "road",
        "roam",
        "route",
        "train",
        "travels",
        "trips",
    },
    "culture-corner": {
        "app",
        "artists",
        "browser",
        "digital",
        "emoji",
        "games",
        "hashtag",
        "media",
        "meme",
        "movie",
        "museum",
        "podcast",
        "posts",
        "reposts",
        "share",
        "story",
        "trend",
        "tweet",
        "viral",
        "web",
    },
}

for _theme in _THEME_EXPANSIONS:
    THEME_WORDS[str(_theme["id"])] = set(str(word) for word in _theme["words"])

THEME_WORDS["fresh-air"].update(
    {
        "air",
        "bay",
        "bud",
        "earth",
        "green",
        "jog",
        "mud",
        "natural",
        "oak",
        "oar",
        "outside",
        "plant",
        "sea",
        "sun",
        "tree",
        "woods",
    }
)
THEME_WORDS["weekend-glow"].update(
    {
        "ale",
        "amazing",
        "bar",
        "dancing",
        "delight",
        "dip",
        "eve",
        "freedom",
        "friends",
        "fun",
        "green",
        "joy",
        "luck",
        "nap",
        "pop",
        "present",
        "river",
        "park",
        "sea",
        "sparkle",
        "sun",
        "win",
        "wow",
        "yay",
    }
)
THEME_WORDS["friend-date"].update(
    {
        "ate",
        "bar",
        "comfort",
        "cup",
        "date",
        "duo",
        "eat",
        "friends",
        "gifts",
        "heart",
        "hug",
        "joy",
        "love",
        "pal",
        "spa",
        "tea",
        "yes",
        "candles",
        "dinners",
    }
)
THEME_WORDS["family-table"].update(
    {
        "ate",
        "aunt",
        "bro",
        "carol",
        "cup",
        "dad",
        "blanket",
        "comfort",
        "company",
        "cookies",
        "cooking",
        "cottage",
        "eat",
        "fed",
        "friends",
        "gift",
        "gifts",
        "ham",
        "kin",
        "kitchen",
        "mom",
        "niece",
        "pie",
        "pot",
        "serving",
        "setting",
        "sharing",
        "sis",
        "son",
        "tea",
        "tin",
        "uncle",
        "yam",
    }
)
THEME_WORDS["brunch-hour"].update(
    {
        "ate",
        "basket",
        "bun",
        "cookies",
        "cooking",
        "cup",
        "eat",
        "fed",
        "granola",
        "ham",
        "kettles",
        "oat",
        "pancake",
        "pot",
        "tea",
        "teapots",
    }
)
THEME_WORDS["sweet-treat"].update({"candy", "gift", "gifts", "treat"})
THEME_WORDS["culture-corner"].update({"dream", "faith", "freedom", "history", "march", "peace", "trust"})
THEME_WORDS["mindful-morning"].update({"dream", "faith", "peace", "trust"})

THEME_CLUE_KEYWORDS: Dict[str, Set[str]] = {
    "coffee-break": {
        "bagel",
        "barista",
        "bean",
        "breakfast",
        "brew",
        "brunch",
        "cafe",
        "coffee",
        "cup",
        "espresso",
        "foam",
        "griddle",
        "honey",
        "kettle",
        "latte",
        "morning",
        "mug",
        "order",
        "pour",
        "sip",
        "sugar",
        "tea",
        "toast",
    },
    "fresh-air": {
        "beach",
        "bicycle",
        "breeze",
        "camp",
        "coast",
        "field",
        "flower",
        "forest",
        "garden",
        "grass",
        "hike",
        "lawn",
        "meadow",
        "ocean",
        "outdoor",
        "park",
        "river",
        "shore",
        "sky",
        "stroll",
        "trail",
        "tree",
        "walk",
        "water",
    },
    "home-reset": {
        "apartment",
        "bed",
        "blanket",
        "cabinet",
        "calm",
        "clean",
        "comfort",
        "cozy",
        "desk",
        "home",
        "house",
        "kitchen",
        "lamp",
        "laundry",
        "light",
        "nest",
        "quiet",
        "reset",
        "room",
        "shelf",
        "sleep",
        "soothing",
        "tidy",
        "window",
    },
    "book-nook": {
        "book",
        "chapter",
        "dictionary",
        "draft",
        "edit",
        "journal",
        "library",
        "line",
        "note",
        "novel",
        "page",
        "paper",
        "pen",
        "poem",
        "read",
        "shelf",
        "story",
        "study",
        "tale",
        "text",
        "word",
        "write",
    },
    "kitchen-table": {
        "bake",
        "bean",
        "bowl",
        "bread",
        "cake",
        "chip",
        "coffee",
        "cook",
        "dinner",
        "dish",
        "egg",
        "feast",
        "food",
        "fork",
        "fruit",
        "griddle",
        "kitchen",
        "lunch",
        "meal",
        "noodle",
        "pancake",
        "pan",
        "pasta",
        "plate",
        "salsa",
        "sauce",
        "sip",
        "snack",
        "soup",
        "spice",
        "sugar",
        "table",
        "taste",
        "toast",
    },
    "weekend-glow": {
        "beach",
        "birthday",
        "brunch",
        "camp",
        "chill",
        "friend",
        "fun",
        "game",
        "getaway",
        "movie",
        "party",
        "picnic",
        "plan",
        "play",
        "relax",
        "ride",
        "saturday",
        "social",
        "trip",
        "weekend",
    },
    "weather-watch": {
        "breeze",
        "cloud",
        "forecast",
        "fog",
        "glow",
        "gust",
        "horizon",
        "ice",
        "light",
        "moon",
        "rain",
        "rainbow",
        "sky",
        "snow",
        "solar",
        "storm",
        "sun",
        "sunrise",
        "thunder",
        "warm",
        "weather",
        "wind",
    },
    "city-stroll": {
        "alley",
        "apartment",
        "block",
        "bus",
        "cab",
        "cafe",
        "city",
        "commute",
        "downtown",
        "lane",
        "metro",
        "neighborhood",
        "plaza",
        "road",
        "shop",
        "sidewalk",
        "skyline",
        "store",
        "street",
        "subway",
        "traffic",
        "train",
        "urban",
    },
    "soundtrack": {
        "album",
        "aria",
        "audio",
        "band",
        "beat",
        "choir",
        "chord",
        "dance",
        "guitar",
        "harmony",
        "jazz",
        "lyric",
        "melody",
        "music",
        "note",
        "opera",
        "piano",
        "playlist",
        "radio",
        "rhythm",
        "sing",
        "song",
        "sound",
        "track",
        "tune",
        "voice",
    },
    "mindful-morning": {
        "balance",
        "bedtime",
        "breath",
        "calm",
        "comfort",
        "dream",
        "ease",
        "focus",
        "gentle",
        "hydrate",
        "meditation",
        "mind",
        "morning",
        "peace",
        "quiet",
        "recharge",
        "relax",
        "reset",
        "rest",
        "sleep",
        "slow",
        "stretch",
        "water",
        "yoga",
        "zen",
    },
    "travel-lite": {
        "airport",
        "arrival",
        "board",
        "cabin",
        "coast",
        "commute",
        "drive",
        "gate",
        "getaway",
        "hotel",
        "journey",
        "map",
        "path",
        "port",
        "road",
        "roam",
        "route",
        "seaside",
        "ticket",
        "train",
        "travel",
        "trip",
    },
    "culture-corner": {
        "app",
        "art",
        "artist",
        "audio",
        "browser",
        "camera",
        "cinema",
        "code",
        "digital",
        "feed",
        "film",
        "game",
        "hashtag",
        "internet",
        "media",
        "meme",
        "movie",
        "museum",
        "online",
        "photo",
        "podcast",
        "post",
        "screen",
        "share",
        "social",
        "story",
        "stream",
        "trend",
        "video",
        "web",
    },
}

for _theme in _THEME_EXPANSIONS:
    THEME_CLUE_KEYWORDS[str(_theme["id"])] = set(str(word) for word in _theme["keywords"])

BONUS_WORDS = [
    {"answer": "BARISTA", "themeId": "coffee-break", "clue": "Cafe pro pulling espresso shots"},
    {"answer": "TEACUPS", "themeId": "coffee-break", "clue": "Small vessels for a steeped drink"},
    {"answer": "SUNRISE", "themeId": "fresh-air", "clue": "Morning light at the horizon"},
    {"answer": "OUTDOOR", "themeId": "fresh-air", "clue": "Not inside"},
    {"answer": "BLANKET", "themeId": "home-reset", "clue": "Cozy layer on a bed or couch"},
    {"answer": "WINDOWS", "themeId": "home-reset", "clue": "They let the morning light in"},
    {"answer": "JOURNAL", "themeId": "book-nook", "clue": "Notebook for daily thoughts"},
    {"answer": "LIBRARY", "themeId": "book-nook", "clue": "Quiet place with shelves of books"},
    {"answer": "COOKING", "themeId": "kitchen-table", "clue": "Making a meal from scratch"},
    {"answer": "PANCAKE", "themeId": "kitchen-table", "clue": "Flat breakfast stack item"},
    {"answer": "PICNICS", "themeId": "weekend-glow", "clue": "Outdoor meals on blankets"},
    {"answer": "GETAWAY", "themeId": "weekend-glow", "clue": "Short trip to recharge"},
    {"answer": "WEATHER", "themeId": "weather-watch", "clue": "Daily forecast subject"},
    {"answer": "RAINBOW", "themeId": "weather-watch", "clue": "Colorful arc after rain"},
    {"answer": "SKYLINE", "themeId": "city-stroll", "clue": "Silhouette of tall buildings"},
    {"answer": "SUBWAYS", "themeId": "city-stroll", "clue": "Underground city rail systems"},
    {"answer": "GUITARS", "themeId": "soundtrack", "clue": "String instruments in many bands"},
    {"answer": "RHYTHMS", "themeId": "soundtrack", "clue": "Recurring patterns of sound"},
    {"answer": "BALANCE", "themeId": "mindful-morning", "clue": "Steady state in body and mind"},
    {"answer": "BREATHE", "themeId": "mindful-morning", "clue": "Inhale and exhale slowly"},
    {"answer": "AIRPORT", "themeId": "travel-lite", "clue": "Place with gates and runways"},
    {"answer": "ARRIVAL", "themeId": "travel-lite", "clue": "End of a trip"},
    {"answer": "PODCAST", "themeId": "culture-corner", "clue": "Downloadable audio show"},
    {"answer": "HASHTAG", "themeId": "culture-corner", "clue": "Topic marker in social posts"},
]

BONUS_WORDS.extend(dict(theme["bonus"]) for theme in _THEME_EXPANSIONS)

RAW_QUALITY_CLUES = """
ACE|Top playing card|Serve that cannot be returned
ACT|Do something|Part of a play
ADD|Put one more in|Make a sum larger
AGE|Number on a birthday card|Grow older
AIM|Point with purpose|Goal
AIR|What a tire holds|Breathe this in
ALE|Pub pour|Beer style with a warm fermentation
ANT|Tiny picnic visitor|Small insect in a colony
APE|Imitate|Chimp or gorilla, for example
APP|Phone download|Tap-to-open program|culture-corner
ARC|Curved path|Shape of a rainbow
ARM|Sleeve filler|Pitcher's limb
ART|Museum collection|Creative work|culture-corner
ASH|Fireplace residue|What a burned log leaves
ASK|Pose a question|Request
ATE|Had dinner|Took a bite
AWE|Big wonder|Feeling at a grand view
BAD|Not good|In need of improvement
BAM|Sudden comic-book burst|Sound of a door slamming
BAG|Grocery carrier|Pack for a trip
BAR|Place with stools|Counter for drinks
BAT|Baseball club|Nocturnal winged mammal
BAY|Small inlet|Window nook, sometimes
BED|Place to sleep|Garden plot or mattress
BEE|Honey maker|Spelling contest
BET|Wager|Risk a little money
BIG|Large|Hard to miss
BIT|Tiny amount|Computer unit
BOY|Young lad|Son
BRO|Brother, casually|Male sibling, casually
BUS|City ride|Vehicle with many seats|city-stroll
CAB|Taxi|Front part of a truck|city-stroll
CAN|Is able to|Soup container
CAP|Bottle top|Graduation hat
CAR|Road vehicle|Garage occupant
CAT|Purring pet|Mouse watcher
COD|Fish in many fry-ups|White fish
COP|Police officer, informally|Take, as a quick look
COW|Farm milk producer|Barnyard grazer
CRY|Loud tearful sound|Shout from the heart
CUP|Mug or teacup|Small drinking vessel|coffee-break
DAD|Father|Pop
DAY|Sunrise-to-sunset stretch|Calendar square
DEN|Cozy room|Animal's hidden home
DOG|Barking pet|Leash wearer
DRY|Not wet|Like laundry after a cycle
DUE|Expected to arrive|Owed
EAR|Side of a head|Corn unit
EAT|Have a meal|Take a bite
EGG|Breakfast shell|Omelet ingredient|kitchen-table
END|Finish|Movie's final part
ERA|Long stretch of history|Distinct time period
ERR|Make a mistake|Slip up
EVE|Night before|Holiday lead-in
FAB|Wonderful, casually|Delightfully stylish
FAN|Air mover|Devoted supporter
FAR|Not nearby|A long way off
FED|Gave dinner to|Supplied with food
FEW|Not many|A small number
FIG|Jam fruit|Fruit in a Newton
FIX|Repair|Quick solution
FLY|Travel by air|Insect with wings
FOG|Low cloud|Morning visibility problem|weather-watch
FUN|Good time|Weekend goal
GAS|Fuel at a station|Stove fuel
GEL|Hair product|Set into a soft solid
GIF|Looping reaction image|Short animated image online|culture-corner
GYM|Workout place|Fitness room
HAM|Deli meat|Over-the-top performer
HAT|Headwear|Cap or fedora
HEN|Egg-laying bird|Chicken coop resident
HIP|Trendy|Part below the waist
HOT|High in temperature|Spicy, maybe
HUG|Warm squeeze|Quick embrace
ICE|Freezer cubes|Rink surface
ICY|Slick with frozen water|Very chilly
INN|Small hotel|Cozy overnight stop|travel-lite
JAM|Fruit spread|Loose music session|soundtrack
JAR|Jam container|Small glass vessel
JAB|Quick poke|Short straight punch
JET|Fast plane|Black gemstone
JOY|Delight|Happy feeling
KEG|Party-size beer barrel|Small barrel for ale
KEY|Door opener|Piano part
KID|Child|Young goat
KIN|Family|Relatives
LAP|Pool length|Place for a laptop, perhaps
LEG|Table support|Trip segment
LED|Guided the way|Was in front
MAP|Route planner|Traveler's guide|travel-lite
MARSH|Wetland with grasses|Reedy wetland
MEANS|Method or resources|Way to get something done
MIX|Blend|DJ's set, perhaps
MOM|Mother|Parent celebrated in May
NAP|Short sleep|Afternoon recharge|mindful-morning
NET|Goal backing|Web, in brief
NOD|Silent yes|Small sign of agreement
OAK|Acorn tree|Sturdy hardwood
OAR|Rowboat tool|Paddle cousin
ODD|Not even|A little unusual
OIL|Pan slicker|Engine fluid
OWL|Night bird|Wise-looking bird
PAN|Skillet|Kitchen vessel|kitchen-table
PAR|Golf target|Standard golf score
PEN|Writing tool|Small animal enclosure
PET|Cat or dog, often|Animal companion
PIE|Dessert slice|Thanksgiving dish|kitchen-table
PIG|Farm animal with a snout|Barnyard oinker
PIN|Tiny fastener|Bowling target
POP|Soda|Top-40 music style|soundtrack
POT|Tea vessel|Cooking container
RAP|Rhymed music style|Knock lightly|soundtrack
RAT|Lab animal|Cheese-nibbling cartoon foe
RED|Stop-sign color|Ruby hue
RIB|Barbecue piece|Chest bone
ROW|Line of seats|Paddle a boat
RUG|Floor covering|Small carpet
RUN|Jog|Operate, as a program
RYE|Deli bread|Whiskey grain
SAD|Blue|Not happy
SAW|Cutting tool|Past tense of see
SEA|Ocean|Large body of salt water
SET|Group of things|Put in place
SEW|Create with needle and thread|Stitch cloth
SIP|Small drink|Tiny taste of tea|coffee-break
SIS|Sister, informally|Female sibling, casually
SKY|What clouds cross|Blue overhead view|weather-watch
SPA|Relaxing retreat|Place for a massage|mindful-morning
SUN|Daytime star|Forecast icon|weather-watch
TAP|Touch lightly|Faucet
TAN|Light brown|Sun-browned shade
TEA|Steeped drink|Afternoon cup|coffee-break
TEN|One more than nine|Perfect score, sometimes
TIE|Neckwear|Even score
TIN|Metal can material|Cookie container
TOP|Highest point|Lid
TOW|Pull behind a vehicle|Drag by a rope
TOY|Plaything|Kid's gift
TRY|Make an attempt|Give it a go
VAN|Moving vehicle|Roomy ride
VET|Animal doctor|Former service member
VIA|By way of|Through
WEB|Browser's home turf|Online network|culture-corner
WED|Get married|Tie the knot
WET|Not dry|Rain-soaked
WIG|Costume hair|Hairpiece
WIN|Victory|Come out on top
WOW|Impress greatly|Reaction to a surprise
YAM|Sweet potato cousin|Holiday side
YES|Affirmative answer|Opposite of no
YET|Still|So far
ZEN|Calm state|Meditation vibe|mindful-morning
ZIP|Fast energy|Postal code, informally
ADO|Fuss|Big to-do
ADS|Promos|Sponsored spots|culture-corner
AGO|In the past|Before now
AID|Help|Assistance
AGENT|Representative|Person acting for another
ARENA|Sports venue|Place for a big event
ARROW|Direction marker|Pointer on a sign
ASSET|Useful resource|Valuable item
BAA|Sheep sound|Farmyard bleat
BASES|Foundations|Places runners touch
COB|Corn center|Corn-on-the-___ piece|kitchen-table
DELTA|River-mouth triangle|Greek letter
DRAIN|Sink outlet|Let water out
DUO|Pair|Two performers|soundtrack
DOE|Female deer|Forest doe
EATEN|Consumed|Had, as dinner
EEL|Long slippery fish|Snakelike swimmer
EGO|Sense of self|Prideful self-image
ELK|Large antlered animal|Big deer cousin
ELITE|Top-tier|Selected as the best
GENRE|Story category|Kind of music or art|book-nook,soundtrack
HAN|Chinese dynasty|Historic Chinese era
INK|Pen filler|Printer fluid|book-nook
INPUT|What you type in|Feedback to consider|culture-corner
IRE|Anger|Rage
LEE|Sheltered side|Away from the wind|weather-watch
LEASE|Rental contract|Agreement for an apartment
LOT|Parking area|A great deal
NIP|Small bite|Tiny pinch
ORE|Metal-bearing rock|Mine find
OWE|Need to repay|Have a debt
PAD|Notebook|Soft cushion|book-nook
PANEL|Flat section|Discussion group
PEARL|Round gem|Lustrous bead
POD|Pea holder|Podcast, for short|kitchen-table,culture-corner
POLAR|Like the Arctic|Opposite, as views|weather-watch
PRO|Expert|In favor of
RADAR|Storm-tracking screen|Detection system|weather-watch
RAN|Moved quickly on foot|Operated, as software
RID|Free of|Clear away
RIM|Outer edge|Wheel edge
RNA|Genetic messenger molecule|DNA's single-strand cousin
ROT|Decay|Go bad
SADLY|Unfortunately|With sadness
SANDY|Covered with sand|Beach-like|fresh-air
SAX|Jazz horn, briefly|Reed instrument, for short|soundtrack
SEE|Use your eyes|Perceive visually
SOL|Fifth note in do-re-mi|Sun, in Spanish|soundtrack
SOLVE|Find the answer|Work out a puzzle
SON|Family boy|Male child
SOS|Distress call|Urgent help signal
STEAL|Take without asking|Base-running play
STORE|Shop|Keep for later|city-stroll
TALES|Stories|Narratives|book-nook
TENTH|Number ten in a series|One of ten equal parts
THREE|One more than two|Number after two
TREES|Maples and oaks|Forest standouts|fresh-air
UPSET|Surprise win|Knock off balance
WEE|Tiny|Very small
ACHE|Dull pain|Workout reminder, maybe
ACRE|Plot of land|Farm measure
AIRS|Broadcasts|Puts on TV
AUNT|Parent's sister|Family member at the table
BAKE|Make in an oven|Prepare bread or cookies|kitchen-table
BALM|Soothing salve|Gentle comfort
BARN|Farm building|Place for hay
BEAM|Ray of light|Smile broadly
BEAN|Chili ingredient|Coffee seed, casually|coffee-break
BEAR|Large forest animal|Carry a burden
BELL|Ringing signal|Door chime
BIRD|Feathered flyer|Morning singer
BITE|Small mouthful|Nibble
BLUE|Sky color|A little sad
BOAT|Lake ride|Small vessel
BOOK|Library item|Reserve, as a table|book-nook
BOWL|Soup dish|Cereal vessel|kitchen-table
BREW|Make coffee|Steep a drink|coffee-break
CAFE|Coffee shop|Place for a latte|coffee-break
CAKE|Birthday dessert|Sweet baked treat|kitchen-table
CALM|Free from stress|Quiet mood|mindful-morning
CARD|Birthday note|Deck piece
CHAT|Friendly talk|Message back and forth
CITY|Urban place|Where skyscrapers cluster|city-stroll
CLAY|Pottery material|Soft earth
CLUB|Group with members|Sandwich with layers
COAT|Jacket|Paint layer
CODE|Programmer's work|Secret system
COZY|Warm and comfortable|Like a soft reading nook
DAWN|First morning light|Start of day
DATE|Calendar square|Meetup with someone you like
DESK|Work surface|Home office table
DICE|Game cubes|Chop into cubes
DINE|Eat dinner|Have a meal
DOOR|Room entrance|Thing with a knob
DRAW|Sketch|Tie, as a game
DUST|Fine powder|Clean a shelf, in a way
EASE|Comfort|Make less difficult
EAST|Sunrise direction|Compass point
ECHO|Repeated sound|Canyon reply
EDIT|Revise text|Polish a draft
EVEN|Flat or level|Divisible by two
FAIR|Just|Carnival with rides
FALL|Autumn|Drop down
FALSE|Not true|Incorrect
FARM|Place with fields|Rural workplace
FILM|Movie|Thin coating
FIND|Discover|Come across
FIRE|Camp heat source|Flames
FIZZ|Bubbly sound|Soda sparkle
FLOW|Move smoothly|River movement
FOLK|Everyday people|Acoustic music style
FOOD|Meal material|What recipes become|kitchen-table
FORK|Table utensil|Road split
FREE|Costing nothing|Not tied down
GIFT|Present|Birthday package
GLOW|Soft light|Gentle shine|weather-watch
GOAL|Aim|Soccer score
GOOD|Not bad|Kind or useful
GRID|Crossword frame|Rows and columns
GROW|Get larger|Sprout
HALF|One of two equal parts|Fifty percent
HAND|Clock pointer|Part with fingers
HATS|Headwear collection|Caps and beanies
HILL|Small rise|Slope to climb
HOME|Where the heart is|Place to come back to|home-reset
HOPE|Optimistic feeling|Wish for the best|mindful-morning,weekend-glow
IDEA|Thought|Bright notion
JAVA|Coffee, casually|Programming language|coffee-break
JAZZ|Improvised music style|Music with swing|soundtrack
JUMP|Leap|Sudden rise
KIND|Thoughtful|Type or sort
LAMP|Desk light|Reading nook glow|home-reset
LANE|Road strip|Bowling path
LATE|Not on time|After the expected hour
LEAF|Page in a book|Tree greenery
LENS|Camera part|Glasses piece
LIFT|Raise|Elevator, in Britain
LINE|Queue|Bit of dialogue
LIST|Errand helper|Set of items
LOVE|Deep affection|Tennis score of zero
LUCK|Good fortune|Chance going your way
MAIL|Letters and packages|Inbox contents
MILD|Not spicy|Gentle
MINT|Fresh herb|Place coins are made
MOON|Night-sky body|Orbiter of Earth
MORN|Morning, poetically|Early day
MOVE|Change places|Chess turn
MUGS|Coffee cups|Faces, informally|coffee-break
NOTE|Short message|Musical sound|soundtrack
OPEN|Not closed|Start business for the day
PAGE|Book leaf|Website screen|book-nook
PARK|Green city space|Place to leave a car|fresh-air
PATH|Walking route|Way forward
PLAY|Have fun|Stage performance
POUR|Fill a cup|Serve coffee, say|coffee-break
RAIN|Wet weather|Drops from clouds|weather-watch
READ|Enjoy a book|Look over text|book-nook
REELS|Short social videos|Fishing rod parts
REST|Take a break|Sleep lightly|mindful-morning
RIDE|Trip in a car|Amusement-park attraction
RISE|Get up|Move upward
ROAD|Route for cars|Way to travel|travel-lite
ROAM|Wander|Travel without a strict plan|travel-lite
ROOM|Part of a house|Space available
ROSE|Garden flower|Went up
SAND|Beach grains|Hourglass material
SEED|Garden starter|Tournament rank
SHOP|Store|Browse for things|city-stroll
SIDE|Edge|Team in a match
SIGN|Posted notice|Zodiac symbol
SING|Use your voice musically|Carry a tune|soundtrack
SLOW|Not fast|Unhurried
SNEAK|Move quietly|Slip in without being noticed
SNOW|Winter flakes|Cold forecast item|weather-watch
SOUP|Bowlful with broth|Comfort-food starter|kitchen-table
SPY|Secret agent|Watch secretly
SPOT|Small mark|Place
STAR|Night-sky point|Famous performer
STEEP|Soak, as tea|Very sharply sloped
STEP|Stair part|One move forward
STOP|Red-light command|Come to a halt
SWIM|Move through water|Pool activity
TALK|Conversation|Speak
TAPE|Sticky strip|Record, old-style
TEAM|Group on the same side|Players together
TIDE|Ocean rise and fall|Shore schedule
TIME|Clock reading|What a timer tracks
TREE|Oak or maple|Leafy plant
TUNE|Melody|Adjust a radio|soundtrack
TURN|Change direction|Board-game move
WALK|Casual stroll|Move on foot|fresh-air
WARM|Not cold|Cozy in temperature|weather-watch
WAVE|Ocean curl|Hello gesture
WAY|Route|Method
WEEK|Seven days|Calendar stretch
WIND|Moving air|Breeze|weather-watch
WISH|Hopeful request|Birthday candle thought
WIT|Quick humor|Sharp mental spark
WOE|Deep sorrow|Trouble or distress
WOOD|Tree material|Cabin material
WORD|Dictionary entry|Crossword answer, often|book-nook
WORK|Job tasks|Operate properly
YOGA|Stretching practice|Mat-based exercise|mindful-morning
ABOUT|Nearly|On the topic of
ABOVE|Higher than|Earlier in text
ACTED|Performed onstage|Behaved
ADAPT|Adjust to fit|Change with the situation
AIMED|Pointed|Tried for
AGAIN|One more time|Once more
AGREE|Be in accord|Say yes together
ALARM|Wake-up sound|Cause for concern
ALBUM|Collection of songs|Record release|soundtrack
ALERT|Warning|Quick to notice
ALIEN|Visitor from space|Unfamiliar
ALIVE|Living|Full of energy
ALONE|By oneself|Without company
ALLEY|Narrow city passage|Lane behind buildings
ALLOW|Permit|Let happen
ALPHA|First Greek letter|Early test version
ALTER|Change|Modify
AMBER|Honey-colored|Yellow traffic light
ANKLE|Joint above the foot|Sock-adjacent joint
APPLE|Orchard fruit|Pie fruit|kitchen-table
APART|Separate|Not together
ACUTE|Sharp|Severe
AREAS|Regions|Sections
ARGUE|Disagree out loud|Make a case
ARISE|Come up|Get out of bed
APRIL|Month after March|Spring month
AUDIO|Sound, technically|What headphones deliver
AWAKE|Not asleep|Up and alert
AWARD|Prize|Give a trophy to
AWARE|In the know|Not oblivious
BAGEL|Ring-shaped breakfast bread|Toasted brunch order|coffee-break,kitchen-table
BASIC|Simple|No-frills
BASIN|Sink bowl|Low-lying area
BEACH|Sandy shore|Weekend getaway spot|fresh-air,weekend-glow
BEANS|Chili ingredients|Coffee starters|coffee-break,kitchen-table
BEERS|Pub pours|Brewery offerings
BEARD|Face hair|Chin covering
BEAST|Wild animal|Large creature
BEATS|Rhythms in a song|Pulses in music|soundtrack
BERRY|Small juicy fruit|Smoothie fruit
BIKES|Two-wheeled rides|Cycling gear|fresh-air
BLACK|Darkest color|Coffee order without milk|coffee-break
BLOCK|City square section|Stop, as in defense|city-stroll
BOARD|Flat plank|Get on a train or plane|travel-lite
BREAD|Bakery staple|Toast source|kitchen-table
BRING|Carry here|Take along
BROWN|Coffee color, often|Like toasted bread
CABIN|Small getaway house|Plane section|travel-lite
CAMPS|Sleeps outdoors|Summer retreat sites|fresh-air,weekend-glow
CANDY|Sweet wrapped treat|Halloween-bag item
CANON|Accepted story lore|Official body of work|book-nook,culture-corner
CARDS|Deck pieces|Game-night stack
CARES|Feels concern|Looks after
CAROL|Holiday song|Sing merrily
CARRY|Hold while moving|Bring along
CATCH|Grab|Understand, as a joke
CASES|Examples|Containers for gear
CAUSE|Reason why|Make happen
CENTS|Pennies|Small change
CHAIR|Seat with a back|Meeting leader
CHARM|Delight|Small bracelet piece
CHILL|Relax|Low-key vibe|weekend-glow
CHORD|Group of notes|Guitar shape|soundtrack
CLEAN|Not dirty|Tidy up|home-reset
CLOUD|Fluffy sky sight|Online storage metaphor|weather-watch,culture-corner
CODES|Secret systems|Programmer's lines|culture-corner
COLOR|Hue|Paint choice
CHOIR|Singing group|Voices in harmony|soundtrack
COULD|Was able to, maybe|Might
CROWD|Large group|Busy-event turnout
DAILY|Every day|Like this puzzle
DANCE|Move to music|Ballroom activity|soundtrack
DENSE|Packed closely|Hard to see through
DEBUG|Remove code errors|Fix software bugs|culture-corner
DELAY|Hold-up|Wait
DREAM|Sleep story|Hopeful goal|mindful-morning
DRESS|Get clothed|Party outfit
DATES|Calendar days|Days on a schedule
DRIVE|Road trip|Operate a car|travel-lite
DRONE|Remote flying device|Low humming sound
DOT|Tiny spot|Period mark
EARTH|Our planet|Soil
ENTER|Go in|Submit, as data
EVENT|Scheduled happening|Calendar item
EVERY|Each one|Without exception
EAGLE|Big soaring bird|Golf score two under par
EAGER|Keen|Excited
ELDER|Older|Senior
ERROR|Mistake|Bug to fix|culture-corner
FAITH|Trust|Belief
FEEDS|Social streams|Gives food to|culture-corner
FEAST|Big meal|Holiday spread|kitchen-table
FIELD|Open meadow|Area of study
FLAME|Fire tongue|Candle feature
FLOOR|Room bottom|Lowest level
FOCUS|Concentrate|Sharpen attention|mindful-morning
FRESH|New and crisp|Like morning air|fresh-air
FRUIT|Apple or pear|Smoothie ingredient
GAMES|Weekend competitions|Arcade picks|weekend-glow,culture-corner
GATES|Airport boarding points|Fence openings|travel-lite
GIFTS|Wrapped presents|Things given
GIVES|Hands over|Donates
GRADE|School mark|Level in school
GOODS|Merchandise|Things for sale
GRAND|Impressive|A thousand dollars, slangily
GRASS|Lawn covering|Park greenery|fresh-air
GREEN|Garden color|Go-light color
GROSS|Total before deductions|Yucky
GUIDE|Show the way|Helpful manual
HAPPY|Joyful|Feeling good
HANDS|Clock pointers|Parts with fingers
HAVEN|Safe place|Shelter|home-reset
HEART|Card suit|Center of emotion
HIKES|Trail walks|Outdoor treks|fresh-air
HONEY|Sweet tea add-in|Bee-made sweetener|coffee-break,kitchen-table
HOTEL|Traveler's overnight stop|Place to check in|travel-lite
HOUSE|Home|Put up, as guests|home-reset
INDEX|Book back matter|List for lookup
ITEMS|Things on a list|Objects
INDIE|Independent|Small-label release|culture-corner
KIT|Set of tools|Small gear set
LAB|Science classroom|Research room
LARGE|Big|Size above medium
LAYER|Single thickness|Cake tier|kitchen-table
LASER|Focused light beam|Pointer light
LATTE|Espresso drink with milk|Cafe order with foam art|coffee-break
LEAST|Smallest amount|Opposite of most
LEVEL|Flat|Difficulty setting
LIGHT|Morning glow|Not heavy|weather-watch
LIKES|Social-media hearts|Approves of|culture-corner
LOCAL|Nearby|Neighborhood-based
LOGIC|Reasoning|Puzzle-solving tool
LUNCH|Midday meal|Noon break|kitchen-table
LYRIC|Song line|Words you sing along to|soundtrack
MARCH|Walk in a parade|Move forward together
MEDIA|News and entertainment outlets|Photos and video, collectively|culture-corner
METRO|City rail system|Urban train|city-stroll
MODEL|Example to copy|Runway walker
MONEY|Cash|What a wallet holds
MOVIE|Cinema feature|Big-screen story|culture-corner,weekend-glow
MESSY|Not tidy|In need of a cleanup|home-reset
MUSIC|Songs and sounds|Playlist material|soundtrack
NEEDS|Requires|Must-haves
NIECE|Sibling's daughter|Family member one generation down
NOTES|Jottings|Musical sounds|book-nook,soundtrack
NORTH|Compass direction|Up on many maps|travel-lite
OCEAN|Vast salt water|Beach view
ODE|Poem of praise|Lyric poem|book-nook
OLIVE|Martini garnish|Small green fruit
OPERA|Sung stage drama|Aria-filled show|soundtrack
OPENS|Begins|Unlocks
ORDER|Cafe request|Put in sequence|coffee-break
OTHER|Different|Not this one
PAINT|Wall color|Artist's medium
PANTS|Trousers|Breathes hard
PARTY|Social gathering|Birthday bash|weekend-glow
PASTA|Noodles, broadly|Dinner with sauce|kitchen-table
PASTE|Sticky spread|Glue-like substance
PEACE|Calm between conflicts|Quiet harmony|mindful-morning
PHONE|Pocket device|Call maker
PHOTO|Picture|Camera shot|culture-corner
PIANO|88-key instrument|Recital keyboard|soundtrack
PIXEL|Tiny screen dot|Smallest display unit|culture-corner
PIZZA|Slice in a box|Friday delivery classic|kitchen-table
PLANS|Calendar intentions|Ideas for later|weekend-glow
PLATE|Dinner dish|Flat serving dish|kitchen-table
PLAZA|Open city square|Downtown gathering place|city-stroll
POINT|Main idea|Precise spot
PORTS|Harbors|Computer connections|travel-lite,culture-corner
POSTS|Social updates|Fence supports|culture-corner
PRESS|Push down|News media|culture-corner
PRINT|Put on paper|Newspaper edition
QUIET|Low-noise|Peaceful
RADIO|Broadcast audio|Car dashboard sound source|soundtrack
RAMEN|Noodle bowl|Brothy comfort meal|kitchen-table
RANGE|Stove top|Span
RATIO|Comparison of two amounts|Proportion
REACT|Respond|Show a feeling
RACES|Contests|Runs competitively
RELAX|Unwind|Take it easy|weekend-glow,mindful-morning
READS|Looks over text|Peruses|book-nook
RESET|Fresh start|Put back to default|home-reset,mindful-morning
RISEN|Gone up|Baked higher|kitchen-table
RIDES|Theme-park attractions|Takes a lift
RIVER|Flowing water|Bridge crosser
ROBOT|Machine helper|Automated worker
ROUTE|Way from A to B|Planned path|travel-lite,city-stroll
SAVES|Keeps for later|Rescues
SALSA|Dip for chips|Dance with Latin roots|kitchen-table
SALON|Hair studio|Art gathering|culture-corner
SAFER|Less risky|More protected
SALES|Store totals|Revenue
SAUCE|Pasta topper|Flavorful liquid
SEATS|Places to sit|Theater tickets, maybe
SEEKS|Looks for|Searches
SEEMS|Appears|Looks like
SEVEN|Number of days in a week|One more than six
SHARE|Send along|Split with others|culture-corner
SHOPS|Small stores|Browses for things|city-stroll
SHORE|Water's edge|Beach boundary|fresh-air
SKILL|Learned ability|Talent
SLEEP|Nightly recharge|Get some rest|mindful-morning
SMART|Clever|Phone type
SMILE|Happy expression|Grin
SLIDE|Playground chute|Move smoothly
SNACK|Small bite|Afternoon nibble|kitchen-table
SOD|Grass layer|Lawn patch|fresh-air
SOLAR|Sun-powered|Related to the sun|weather-watch
SONGS|Playlist entries|Things singers sing|soundtrack
SPEND|Pay out|Use money
SPICE|Flavor booster|Cinnamon or cumin|kitchen-table
STACK|Neat pile|Pancake serving, maybe|kitchen-table
STAKE|Garden marker|Share in a bet|fresh-air
STAGE|Theater platform|Phase
STARE|Look fixedly|Gaze
START|Beginning|Commence
STEEL|Strong metal|Rail material|city-stroll
STEAM|Kettle vapor|Rising coffee wisps|coffee-break
STONE|Pebble|Hard building material
STORY|Tale|Social-media update|book-nook,culture-corner
STRAW|Smoothie sipper|Dry plant stem
STUDY|Read closely|Work room|book-nook
SUGAR|Coffee sweetener|Cookie ingredient|coffee-break,kitchen-table
SWEAR|Promise solemnly|Use strong language
SUSHI|Rice-and-fish roll|Wasabi partner|kitchen-table
TABLE|Dining surface|Spreadsheet layout|kitchen-table
TASTE|Flavor|Sample a bite|kitchen-table
TEENS|13-to-19-year-olds|High schoolers, often
TENSE|Past or present, in grammar|Not relaxed
TESTS|Exams|Checks for bugs
TEXTS|Phone messages|Sends a message
THING|Object|Matter at hand
THERE|In that place|Opposite of here
TODAY|This date|The present day
TOE|Foot digit|Shoe tip
TIRED|Ready for sleep|Low on energy|mindful-morning
TOAST|Browned bread|Raise a glass|coffee-break,kitchen-table
TOWER|Skyline standout|Tall structure|city-stroll
TRACK|Running oval|Song on an album|soundtrack
TRADE|Swap|Exchange
TRAIN|Rail ride|Commute option on tracks|travel-lite,city-stroll
TREND|What's rising online|Popular direction|culture-corner
TRIAL|Test run|Court proceeding
TRIPS|Short journeys|Stumbles
TRUST|Believe in|Confidence
TREAT|Sweet bite|Small reward
TWEET|Short post on X|Birdlike chirp|culture-corner
TWO|Number after one|Pair count
ULTRA|Extreme|Beyond the usual
UNCLE|Parent's brother|Family member at the table
UNITE|Join together|Become one
URBAN|City-related|Not rural|city-stroll
URGED|Encouraged|Pushed
VIDEO|Moving image clip|What a camera records|culture-corner
VIRAL|Spreading fast online|Shared everywhere suddenly|culture-corner
VISIT|Stop by|Go see
WATER|Hydration essential|Garden need|mindful-morning,fresh-air
VERSE|Poetry line|Bit of a song|book-nook,soundtrack
WORLD|The globe|All of us, broadly
WORKS|Functions|Everything included
FLU|Seasonal bug|Winter illness
GAUGE|Measure|Instrument dial
HEADS|Leaders|Top parts
HORSE|Stable animal|Riding lesson partner
HUB|Central point|Wheel center
LASTS|Continues|Endures
MAR|Spoil|Damage
PAT|Gentle tap|Soft touch
PENNY|One-cent coin|Copper-colored coin
RAISE|Lift|Increase
SENSE|Meaning|Feel
TAR|Road-paving goo|Dark sticky stuff
TIS|Carol word before "the season"|Apostrophe-starting old word
UTTER|Speak|Complete
AIRPORT|Place with gates and runways|Travel hub|travel-lite
ALMANAC|Yearly reference book|Calendar-filled reference|book-nook
ANCHORS|Keeps in place|News desk figures
ANOTHER|One more|A different one
ARRIVAL|End of a trip|Getting-there moment|travel-lite
ARTISTS|Creative makers|Museum names, often|culture-corner
BALANCE|Steady state|What a tightrope walker needs|mindful-morning
BARISTA|Cafe pro|Espresso-shot expert|coffee-break
BASKETS|Picnic carriers|Woven containers|weekend-glow
BEDTIME|Lights-out hour|Nightly wind-down|home-reset,mindful-morning
BICYCLE|Two-wheeled ride|Pedaled vehicle|fresh-air
BLANKET|Cozy layer|Picnic spread or bed cover|home-reset,weekend-glow
BOOKISH|Fond of reading|Library-loving|book-nook
BREATHE|Inhale and exhale|Take a calming breath|mindful-morning
BREEZES|Gentle winds|Light gusts|weather-watch,fresh-air
BRIGHTS|Vivid colors|Cheery hues
BROWSER|App for websites|Web-surfing tool|culture-corner
CABINET|Kitchen storage|Cupboard
CAMPERS|People sleeping outdoors|Tent users|weekend-glow,fresh-air
CANDLES|Soft light sources|Wax table glow|home-reset
CAPTURE|Catch on camera|Record a moment
CHAPTER|Book section|Novel division|book-nook
CIRCUIT|Loop for electricity|Path in electronics
CLASSIC|Timeless|Enduring favorite
COASTAL|Near the shore|By the sea|fresh-air,travel-lite
COMFORT|Cozy ease|Soothing feeling|home-reset
COOKING|Making a meal|Kitchen work|kitchen-table
COTTAGE|Small cozy house|Weekend cabin cousin|home-reset,weekend-glow
DAYBOOK|Daily planner|Journal for appointments|book-nook
DAYDREAM|Wandering thought|Pleasant mental escape|mindful-morning
DESSERT|Sweet final course|Treat after dinner|kitchen-table
DIGITAL|Screen-based|Made of bits|culture-corner
DINNERS|Evening meals|Suppers|kitchen-table
DRAWING|Sketch|Pencil artwork|culture-corner
EARLIER|Before now|Not as late
EVENING|Day's closing stretch|After-work time|home-reset
FARMERS|Market vendors, often|People who grow food|fresh-air,kitchen-table
FEATURE|Prominent part|Magazine story
FRIENDS|People you like|Chosen companions|weekend-glow
GARDENS|Places with flowers|Backyard growing spots|fresh-air
GETAWAY|Short trip|Quick escape|travel-lite,weekend-glow
GLOWING|Giving off soft light|Beaming|weather-watch
GRANOLA|Breakfast oat mix|Yogurt topper|kitchen-table
GUITARS|String instruments|Band gear|soundtrack
HARVEST|Gather crops|Autumn farm yield|kitchen-table,fresh-air
HASHTAG|Social topic marker|Post label with a pound sign|culture-corner
HISTORY|Shared past|What a museum helps tell
HORIZON|Where sky meets land|Distant line at sunrise|weather-watch
JOURNAL|Daily notebook|Place for thoughts|book-nook
KETTLES|Tea-making vessels|Stovetop water warmers|coffee-break
KITCHEN|Room with a stove|Where dinner starts|kitchen-table
LANTERN|Portable light|Camp glow|fresh-air,weekend-glow
LIBRARY|Place with book stacks|Quiet reading haven|book-nook
LIGHTER|Less heavy|Small flame starter
LISTENS|Pays attention to sound|Hears closely|soundtrack
MORNING|Start of the day|Coffee time, often|coffee-break
MUSEUMS|Places for art and history|Culture stops|culture-corner
NETWORK|Connected system|Group of linked things|culture-corner
NOTEPAD|Desk jotter|Paper for quick ideas|book-nook
OUTDOOR|Not inside|Under the open sky|fresh-air
PAINTER|Artist with brushes|Wall-color pro
PANCAKE|Flat breakfast item|Griddle cake|kitchen-table
PICNICS|Outdoor meals|Blanket lunches|weekend-glow,fresh-air
PLAYFUL|Full of fun|Lighthearted
PODCAST|Audio show|Downloadable listening series|culture-corner,soundtrack
RAINBOW|Colorful arc after rain|Prism-like sky sight|weather-watch
READERS|Book lovers|People turning pages|book-nook
REPOSTS|Shares again online|Sends back to the feed|culture-corner
RESTFUL|Calm and relaxing|Good for recharging|mindful-morning
RHYTHMS|Musical patterns|Beats over time|soundtrack
ROUTINE|Daily habit|Morning sequence|mindful-morning
SCIENCE|Lab subject|Way to study nature
SEASIDE|By the ocean|Coastal place|fresh-air,travel-lite
SINGERS|Vocal performers|Choir members|soundtrack
SKYLINE|City silhouette|Buildings against the sky|city-stroll
STORIES|Tales|Social updates, sometimes|book-nook,culture-corner
STRETCH|Reach and lengthen|Yoga-class move|mindful-morning
SUBWAYS|Underground trains|City transit lines|city-stroll
SUNRISE|Morning horizon glow|Start-of-day light|weather-watch,fresh-air
TEACUPS|Small steeped-drink vessels|Tiny cups with saucers|coffee-break
THUNDER|Storm rumble|Sound after lightning|weather-watch
TRAFFIC|Road congestion|Rush-hour slowdown|city-stroll
TRAVELS|Goes from place to place|Takes trips|travel-lite
TUNEFUL|Melodic|Pleasant to hear|soundtrack
VILLAGE|Small town|Cozy community
WALKING|Moving on foot|Taking a stroll|fresh-air
WEATHER|Forecast subject|Rain-or-shine report|weather-watch
WEEKEND|Saturday-Sunday stretch|Time for plans|weekend-glow
WINDOWS|Light-catching wall openings|House features with views|home-reset
WORKDAY|Nine-to-five stretch|Office day
AROMA|Coffee's inviting smell|Fresh-brew scent|coffee-break
BLEND|Coffee mix|Combine smoothly|coffee-break
BREAK|Short pause|Coffee pause, often|coffee-break,mindful-morning
CAFES|Coffee shops|Places with small tables|coffee-break,city-stroll
CREAM|Coffee lightener|Rich dairy layer|coffee-break,kitchen-table
DONUT|Coffee-shop ring|Glazed treat|coffee-break,kitchen-table
DRINK|Beverage|Sip from a cup|coffee-break,kitchen-table
FOAMY|Like a cappuccino top|Full of bubbles|coffee-break
GRIND|Prepare beans for brewing|Work steadily|coffee-break
MOCHA|Chocolatey coffee drink|Cafe order with cocoa|coffee-break
ROAST|Coffee-bean style|Cook with dry heat|coffee-break,kitchen-table
SPOON|Stirring utensil|Tool for sugar in coffee|coffee-break,kitchen-table
SWEET|Sugary|Like a honeyed tea|coffee-break,kitchen-table
MUG|Coffee cup|Handle-bearing cup|coffee-break
JOE|Coffee, casually|Everyday guy|coffee-break
OAT|Granola grain|Latte milk option|coffee-break,kitchen-table
BUN|Bakery roll|Cafe pastry|coffee-break,kitchen-table
CAFE|Coffee shop|Place for a latte|coffee-break,city-stroll
PLANT|Garden starter|Living green thing|fresh-air,home-reset
BLOOM|Flower opening|Garden color burst|fresh-air
WOODS|Forest area|Place for a quiet walk|fresh-air
CREEK|Small stream|Water along a trail|fresh-air
TRAIL|Hiking path|Marked outdoor route|fresh-air,travel-lite
LEAVES|Tree greenery|Autumn fallers|fresh-air,weather-watch
BIRDS|Feathered singers|Morning tree visitors|fresh-air
BLOWS|Moves like wind|Sends through the air|weather-watch,fresh-air
SUNNY|Bright with sun|Cheerfully clear|weather-watch,fresh-air
RAINY|Wet outside|Like umbrella weather|weather-watch
WINDY|Full of gusts|Breezy|weather-watch,fresh-air
STORM|Rough weather|Thunder-and-rain event|weather-watch
CLOUD|Fluffy sky sight|Online storage metaphor|weather-watch,culture-corner
SHEET|Bed layer|Single page|home-reset,book-nook
SHELF|Book holder|Tidy storage ledge|home-reset,book-nook
COUCH|Living-room seat|Comfy sofa|home-reset
BROOM|Sweeping tool|Closet cleanup item|home-reset
CLOTH|Cleaning rag|Fabric piece|home-reset
SOFAS|Living-room seats|Couches|home-reset
TIDY|Neat|Put in order|home-reset
NOVEL|Long fiction book|Fresh and new|book-nook
PROSE|Ordinary written language|Fiction writing style|book-nook
PAGES|Book leaves|Things readers turn|book-nook
POEMS|Verse pieces|Short literary works|book-nook
ESSAY|Short nonfiction piece|Class writing assignment|book-nook
COVER|Book front|Put over|book-nook
SPINE|Book backbone|Part along a shelf|book-nook
TITLE|Book name|Heading|book-nook
PLOTS|Story lines|Garden sections|book-nook,fresh-air
KNIFE|Cutting utensil|Chef's tool|kitchen-table
FLOUR|Baking powder|Bread ingredient|kitchen-table
ONION|Soup starter, often|Layered vegetable|kitchen-table
SALAD|Leafy dish|Bowl of greens|kitchen-table,fresh-air
BRINE|Pickling liquid|Salty solution|kitchen-table
HERBS|Flavorful leaves|Basil and mint, for example|kitchen-table,fresh-air
GRAPE|Small vine fruit|Snack from a bunch|kitchen-table
MELON|Picnic fruit|Cantaloupe or honeydew|kitchen-table,weekend-glow
BRUNCH|Late-morning meal|Weekend breakfast-lunch|coffee-break,kitchen-table,weekend-glow
HOBBY|Weekend pursuit|Free-time activity|weekend-glow
FUNNY|Amusing|Good for a laugh|weekend-glow
CHEER|Happy shout|Game-day encouragement|weekend-glow
LAUGH|Sound of amusement|Weekend mood booster|weekend-glow
DRUMS|Percussion set|Beat makers|soundtrack
VINYL|Record material|Old-school album format|soundtrack,culture-corner
TEMPO|Song speed|Pace in music|soundtrack
TIMER|Device for a short break|Kitchen countdown tool|coffee-break,kitchen-table
STILL|Calm and quiet|Not moving|mindful-morning
BREATHS|Inhales and exhales|Calming counts|mindful-morning
MANTRA|Repeated calming phrase|Meditation line|mindful-morning
PLANE|Airport vehicle|Flat surface|travel-lite
TAXIS|City rides|Cab line vehicles|city-stroll,travel-lite
MAPS|Route guides|Foldouts for trips|travel-lite
ROADS|Travel routes|Ways for cars|travel-lite,city-stroll
LANES|Road strips|Bowling paths|city-stroll,travel-lite
TICKET|Pass for travel or a show|Train proof, maybe|travel-lite,culture-corner
MEMES|Online jokes|Shareable internet bits|culture-corner
STREAM|Watch online|Flow of water|culture-corner,fresh-air
CLIPS|Short videos|Small snips|culture-corner
CANVAS|Painter's surface|Artwork base|culture-corner
GALLERY|Art display room|Image collection|culture-corner
THEATER|Stage venue|Movie house|culture-corner,soundtrack
BALCONY|Apartment overlook|Outdoor perch|home-reset,city-stroll
MARKET|Place with stalls|Neighborhood shopping spot|city-stroll,kitchen-table
ERRAND|Short task out|Quick neighborhood chore|city-stroll,home-reset
SUNBEAM|Ray through a window|Warm shaft of light|home-reset,weather-watch
COASTER|Cup protector|Tabletop drink mat|coffee-break,home-reset
TEAPOTS|Vessels for steeping|Table tea servers|coffee-break,kitchen-table
ROASTER|Coffee-bean pro|Oven cook, sometimes|coffee-break
BOOKLET|Small bound guide|Little printed read|book-nook
BOOKEND|Shelf support|Item beside novels|book-nook,home-reset
STOVES|Kitchen cookers|Ranges|kitchen-table
SKILLET|Frying pan|Breakfast pan|kitchen-table
PLAYERS|Game participants|Team members|weekend-glow
FORECAST|Weather prediction|Rain-or-shine outlook|weather-watch
BUSSTOP|Place to catch a ride|Transit waiting spot|city-stroll,travel-lite
PLAYLIST|Set of songs|Curated listening queue|soundtrack
AIRFARE|Plane-ticket cost|Travel price|travel-lite
WEBCAM|Computer camera|Video-call lens|culture-corner
DON|Put on, as a jacket|Mafia title
EAR|Listening organ|Corn unit
NOS|Votes against|Negative replies
ADDRESS|Place for mail|Where a letter is sent|city-stroll,home-reset
AIRLINE|Company with flights|Carrier with gates|travel-lite
AMAZING|Wonderful|Hard to believe|weekend-glow
ARTICLE|Magazine piece|News story|book-nook,culture-corner
AVERAGE|Typical|Middle-of-the-pack
BEDROOM|Room with a pillow|Place to sleep|home-reset
BELIEVE|Trust as true|Have faith in
BETWEEN|In the middle of|Separating two things
BOTTLES|Drink containers|Recycling-bin items|kitchen-table
BRACKET|Tournament chart|Shelf support, maybe|weekend-glow
CALMING|Soothing|Good for slowing down|mindful-morning
CAREERS|Work lives|Professional paths
CAREFUL|Not reckless|Taking pains
CARRIER|Mail deliverer|Company that transports|travel-lite,city-stroll
CENTRAL|In the middle|Main or key
CHANNEL|TV option|Water passage|culture-corner
CHOICES|Options|Things to pick from
CLEANER|Tidying spray, maybe|More spotless|home-reset
CLOSEST|Nearest|Most nearby|city-stroll
COLLECT|Gather|Bring together
COMPANY|Business|Guests, casually
COOKIES|Sweet baked rounds|Dessert-plate treats|kitchen-table
COUNTER|Kitchen surface|Place to prep food|kitchen-table,home-reset
COUNTRY|Rural area|Nation
CURRENT|Present-day|Flow in a river|fresh-air,culture-corner
CUTTING|Using scissors|Chopping, in a kitchen|kitchen-table
DANCING|Moving to music|Party-floor activity|soundtrack,weekend-glow
DAYTIME|When the sun is up|Morning-to-evening stretch|weather-watch
DELIGHT|Joy|Small happy surprise|weekend-glow
DISPLAY|Showcase|Screen presentation|culture-corner,city-stroll
DRAWERS|Desk storage spots|Dresser compartments|home-reset
DRESSED|Ready to go|Wearing clothes
DRIVING|Steering a car|Taking the wheel|travel-lite,city-stroll
EARNING|Making money|Bringing in pay
EDITING|Revising copy|Polishing a draft|book-nook,culture-corner
EXACTLY|Precisely|Just so
EXAMPLE|Sample|Thing to learn from
FEELING|Emotion|Sense or hunch|mindful-morning
FINALLY|At last|After a wait
FOLDERS|Desk organizers|Computer file holders|home-reset,culture-corner
FORESTS|Wooded places|Tree-filled areas|fresh-air
FORWARD|Ahead|Onward
FREEDOM|Independence|Room to choose
GENERAL|Broad, not specific|Army rank, sometimes
GETTING|Receiving|Becoming
GOODIES|Treats|Fun extras|weekend-glow,kitchen-table
GROCERY|Food-shopping trip|Market errand|kitchen-table,city-stroll
HANDLES|Door pulls|Names online, sometimes|home-reset,culture-corner
HEADING|Title line|Direction of travel|travel-lite,book-nook
HELPERS|People who assist|Useful extras
HOLDING|Keeping in hand|Carrying
JOURNEY|Trip|Long path|travel-lite
KEEPING|Holding onto|Continuing
LAUNDRY|Clothes to wash|Hamper contents|home-reset
LEADING|Out in front|Guiding
LEARNED|Picked up knowledge|Scholarly
LETTERS|Mail pieces|Alphabet marks|book-nook,home-reset
LIGHTLY|Gently|With a soft touch|mindful-morning
LISTING|Catalog entry|Item in a lineup|culture-corner
LOOKING|Using your eyes|Searching
MAILBOX|Place for letters|Curbside delivery spot|home-reset,city-stroll
MEASURE|Find the size of|Kitchen amount|kitchen-table
MEETING|Calendar event|Getting together
MOMENTS|Little bits of time|Brief occasions|mindful-morning
NATURAL|Not artificial|Easy and unforced|fresh-air
NOTEBOOK|Bound place for notes|Classroom writing pad|book-nook
OPENING|Start|First scene, maybe|culture-corner,weekend-glow
OUTSIDE|Not indoors|In the open air|fresh-air
PACKAGE|Parcel|Box at the door|home-reset
PARKING|Leaving a car|Lot activity|city-stroll,travel-lite
PATTERN|Repeated design|Regular arrangement
PICTURE|Image|Framed memory|culture-corner,home-reset
PLANNER|Calendar notebook|Schedule keeper|book-nook,home-reset
PLAYING|Having fun|Taking part in a game|weekend-glow
PRESENT|Gift|Here now|weekend-glow
PRINTED|On paper|Made in ink|book-nook
PROJECT|Planned piece of work|Weekend task, maybe|home-reset
READING|Book session|Taking in text|book-nook
REQUEST|Ask for|Polite ask
RESERVE|Hold back|Book ahead|travel-lite
RESPOND|Answer|Reply
ROLLING|Moving on wheels|In motion|travel-lite
RUNNING|Going at a jog|Operating|fresh-air
SECTION|Part of a whole|Newspaper slice|book-nook
SERVING|Helping at the table|Portion of food|kitchen-table
SETTING|Scene|Table arrangement|book-nook,kitchen-table
SHOPPER|Market visitor|One with a cart|city-stroll,kitchen-table
SHARING|Passing along|Posting for friends|culture-corner
SILENCE|Quiet|Absence of sound|mindful-morning
SITTING|Resting in a chair|Taking a seat|home-reset
SMALLER|Less large|More compact
SPARKLE|Shine brightly|Tiny gleam|weekend-glow
STARTER|First course|Thing that begins|kitchen-table
STUDIOS|Creative workrooms|Recording spaces|culture-corner,soundtrack
SUPPORT|Hold up|Offer help
SURFACE|Top layer|Countertop, for one|home-reset,kitchen-table
TALKING|Chatting|Using words aloud|culture-corner
TEACHER|Class leader|One giving lessons
THROUGH|From end to end|Finished with
TICKETS|Passes for entry|Travel documents|travel-lite,culture-corner
TONIGHT|This evening|Later today
TURNING|Changing direction|Rotating
VERSION|Edition|Take on something|culture-corner
WAITING|Staying until later|In line, maybe|city-stroll
WALKWAY|Path for pedestrians|Paved route|fresh-air,city-stroll
WELCOME|Friendly greeting|Gladly received|weekend-glow
WRITING|Putting words on a page|Text-making|book-nook
AFT|Toward the back of a boat|Near the stern
BEARS|Carries|Puts up with
BIN|Storage container|Recycling holder
BOG|Get stuck|Marshy spot
BOA|Feathery scarf|Snake with a strong squeeze
BRAKE|Car's slowing pedal|Way to slow a bike
CEASE|Come to a stop|End, formally
DIP|Brief swim|Chip partner at a party
GAP|Opening|Space between things
HELPS|Assists|Makes easier
JAG|Sharp edge|Sudden spree
LAW|Rule on the books|Courtroom subject
LOW|Not high|Quiet, as a voice
LOB|High arcing toss|Soft tennis return
MOT|Clever remark|Witty saying
OPT|Choose|Decide to go for
PAL|Close friend|Buddy
PAPER|Morning read|Sheet for notes|book-nook
PEERS|Looks closely|People your own age
PEG|Small wooden pin|Hang-it-up hook
ROB|Steal from|Hold up, in a crime story
ROD|Thin stick|Fishing pole
RUGBY|Oval-ball sport|Scrum-centered game
SAINT|Person honored for holiness|Very patient person, casually
SAT|Took a seat|Did nothing, as a parked car
SOP|Small concession|Appeasing gesture
SPENT|Used up|Out of energy
TAKEN|No longer available|Already claimed
TOM|Male cat|Turkey, when male
UPS|Raises|Increases
USA|Olympic scoreboard letters|Country in many postal addresses
ABC|Basics|First letters learned
ADOPT|Take as one's own|Choose and start using
ALP|High mountain|Swiss peak
ARRAY|Neatly ordered display|Impressive spread
BEN|Mountain, in Scottish place names|Name that sounds like a clock tower
BOB|Short haircut|Quick up-and-down motion
BOT|Automated account|Scripted online helper|culture-corner
BUM|Ask for, as a ride|Person who loafs around
COG|Gear tooth|Small part in a machine
DAB|Tiny amount|Light touch
DIE|Game cube|Stop living
DIN|Loud racket|Cafeteria clamor
DUG|Made a hole|Unearthed
EBB|Tide going out|Fade away
EDGES|Borders|Moves carefully along
EYE|Organ of sight|Needle opening
GAY|Joyful|Pride parade word
GOO|Sticky stuff|Mystery slime
GUT|Instinctive feeling|Belly, casually
HAW|Hesitation sound|Partner of "hem"
JAY|Blue backyard bird|Bird with a crest
LAY|Put down|Set in place
LIV|Super Bowl 54 letters|Roman 54
LOO|Bathroom, in Britain|British restroom
MAD|Angry|Wildly enthusiastic
NAB|Catch in the act|Grab quickly
NAY|No vote|Opposite of yea
NEVER|At no time|Not ever
NIB|Pen point|Part that touches ink to paper|book-nook
OLDER|Not as young|Further along in years
ORB|Sphere|Round glowing shape
PATHS|Walking routes|Ways through a park|fresh-air
PAW|Pet's foot|Swipe with a hand
PEE|Bathroom need, informally|Little kid's potty word
PEP|Lively energy|Spark in one's step
PEW|Church bench|Long seat in a sanctuary
PIP|Tiny seed|Small dot on dice
PIT|Fruit stone|Deep hole
PUS|Infection fluid|Gross wound stuff
RAG|Cleaning cloth|Tease, playfully
RAW|Uncooked|Unfiltered, emotionally
RAY|Beam of light|Sunbeam
SPITE|Petty malice|Mean-spiritedness
TAB|Restaurant bill|Browser page marker|culture-corner
TAM|Soft Scottish cap|Round wool cap
TENDS|Looks after|Is likely to
TOOTH|Molar or canine|Gear notch
TRIED|Attempted|Tested in court
URN|Coffee dispenser|Vessel for ashes
WON|Took first place|Earned a victory
WOO|Try to win over|Court romantically
WORTH|Value|Merit
WRY|Dryly funny|Twisted, as a smile
YEA|Yes vote|Affirmative in Congress
ZAP|Hit with a jolt|Microwave quickly
APT|Small apartment, informally|Fitting
AVID|Eager|Really into
BEG|Plead|Ask urgently
BOP|Dance to a beat|Punch lightly|soundtrack
BOW|Tied ribbon shape|Ship's front
BYE|Farewell|Free pass to the next round
EDDY|Swirling current|Little whirlpool|fresh-air,weather-watch
GIN|Card game|Clear cocktail spirit
HALT|Come to a stop|Stop
HAY|Barn feed|Dried grass on a farm
IOS|iPhone operating system|Apple mobile platform|culture-corner
LAM|Run away, in old slang|Quick escape
LEND|Let someone borrow|Give for now
MAT|Entryway landing spot|Yoga class rectangle|home-reset,mindful-morning
MED|Pill, informally|Health class, for short
MOB|Crowd|Crime group
OVER|Finished|More than
PINE|Evergreen tree|Forest cone-dropper|fresh-air
PUP|Young dog|Newborn seal, too
RUB|Massage motion|Small problem
SAY|Chance to speak|Utter
SEEDS|Garden starters|Tiny salad toppers|fresh-air,kitchen-table
SUE|Take to court|File a lawsuit against
TIP|Helpful hint|Restaurant extra
TREY|Three on a card|Low card after deuce
WAD|Small bundle|Crumpled lump
"""

BAD_CLUE_RE = re.compile(
    r"\b("
    r"abbreviation|acronym|initialism|roman numeral|letter of|city in|village in|"
    r"capital|largest city|province|street names?|enzyme|genus|family of|subfamily|taxonomic|archaic|"
    r"obsolete|biblical|chemical formula|isotope|command that|proteolytic|"
    r"hypothetical description|denoting a quantity|superlative of|everyday \d-letter word|"
    r"terrorist|federal agency|metallic element|radioactive|coenzyme|personality inventory|"
    r"collagen disease|student's academic|parasitic on mammals|religious system|religious belief|"
    r"religious ceremony|witchcraft|predaceous|effigy|worshipped|buoy resembling|western siberia|"
    r"hard grey|talipot|cuttlefish|covalent|lanthanide|hominidae|maiden or family name|"
    r"worth 10 dollars|obscene terms|government agencies|clear or unobstructed|walk of life|"
    r"ancient roman|standardized procedure|remote and separate|brilliant lead glass|"
    r"group or class of persons|emptying something|card or badge|marked by skill in deception|"
    r"living organism characterized|weapon that discharges|discharges a missile|"
    r"substance that|sheet that forms|message that tells|statement that expresses|"
    r"contract granting|protective covering made|coming next after|supply of something|"
    r"not the same one|of hair color|lowest support|period of time containing|"
    r"independent agency|federal department|distress signal in radio code|place in a grave|"
    r"polymer|tributary|equal and opposite charges|federation|dynasty|profane|promotion of some|"
    r"occurrence of something|artificial language|dehiscent|homogeneous substance|"
    r"commercial exchange|act of going|number of sheets|component of|person's mouth|"
    r"urge to attack"
    r")\b",
    re.IGNORECASE,
)

BAD_FALLBACK_CLUE_RE = re.compile(
    r"\b("
    r"that|which|where|who|whose|vertebrates|forcibly|perverts|taken for granted|"
    r"calendar year|advanced in years|supplying|impel|characteristic|attribute|"
    r"state of|act of|process of|one of the|member of|part of|type of|made by|"
    r"resulting|result|substance|structure|organism|division|condition|quality|"
    r"situation|towards|specific|usually|especially|department|equipment|"
    r"constellation|zodiac|nucleotide|infectious|anatom|legislative|property having|"
    r"laceration|republic|destiny|quadruped|vessel for holding|personal facade|"
    r"fabric with|waterproof raincoat|spoken of as|line spoken by an actor|"
    r"dressed hairy coat|adult female hog|unofficial association|profitless activity|"
    r"metal-bearing rock|genetic messenger|historic chinese era|old word"
    r")\b",
    re.IGNORECASE,
)

STALE_CLUE_RE = re.compile(
    r"\b("
    r"very small|in the past|not ever|one more than|opposite of|side of a head|"
    r"highest point|use your eyes|make a mistake|long stretch of history|"
    r"distinct time period|top playing card|put one more in"
    r")\b",
    re.IGNORECASE,
)

BLOCKED_ANSWERS = {
    "AAA",
    "ABA",
    "ABS",
    "ACC",
    "ADA",
    "ADAMS",
    "ADE",
    "ALA",
    "ALS",
    "ANA",
    "ANI",
    "APR",
    "ARS",
    "ARMED",
    "ASIAN",
    "BCE",
    "BAS",
    "BES",
    "BOS",
    "CAS",
    "CES",
    "CIS",
    "COS",
    "CPU",
    "CURSE",
    "DAT",
    "DEC",
    "DER",
    "DOS",
    "EDS",
    "EMS",
    "EPA",
    "EPI",
    "ERS",
    "ESP",
    "EST",
    "ETA",
    "FDA",
    "FRAUD",
    "FUCK",
    "FUCKS",
    "GAO",
    "GAR",
    "GEE",
    "GIA",
    "GOD",
    "GPA",
    "GUN",
    "HAP",
    "ICC",
    "IED",
    "ICS",
    "IDS",
    "INS",
    "IPO",
    "IPS",
    "IRS",
    "JAN",
    "KOS",
    "LAO",
    "LAS",
    "LES",
    "MAK",
    "MAS",
    "MEN",
    "MIS",
    "MOA",
    "MON",
    "MOS",
    "NAD",
    "NASTY",
    "NEC",
    "NEE",
    "NEO",
    "NES",
    "NIS",
    "NIT",
    "NON",
    "NSA",
    "NUN",
    "OBI",
    "OBS",
    "OLA",
    "OSS",
    "OVA",
    "PAC",
    "PAP",
    "PARIS",
    "PAS",
    "PIA",
    "PLO",
    "POS",
    "PSA",
    "RAS",
    "RAIDS",
    "RANDY",
    "RET",
    "ROE",
    "ROM",
    "SEP",
    "SIC",
    "SOT",
    "SUP",
    "TAS",
    "TSA",
    "UFO",
    "WAR",
    "WEI",
    "YEN",
    "YON",
    "AGA",
    "AIN",
    "AMS",
    "ANG",
    "ARK",
    "BAI",
    "CIA",
    "CIO",
    "COL",
    "COO",
    "DOD",
    "ELA",
    "GEN",
    "IDA",
    "INTER",
    "IRA",
    "IRE",
    "MBA",
    "MIT",
    "NRA",
    "ORA",
    "ORE",
    "PES",
    "RES",
    "ROS",
    "SOL",
    "RUS",
    "SAC",
    "SNAKE",
    "TAT",
    "TIA",
    "TOD",
    "UMA",
    "UTC",
    "YRS",
    "CUL",
    "DAG",
    "DUN",
    "FEY",
    "GAN",
    "GIS",
    "HAN",
    "HEP",
    "HET",
    "HOY",
    "HOMER",
    "IDF",
    "III",
    "LUO",
    "RAJ",
    "RNA",
    "TAY",
    "THO",
    "TIS",
    "VAS",
    "VER",
    "VII",
    "VIS",
    "WEN",
    "XIV",
    "XVI",
}


def _normalize_answer(answer: str) -> str:
    return re.sub(r"[^A-Z]", "", answer.upper())


def _parse_quality_clues() -> Dict[str, Dict[str, object]]:
    parsed: Dict[str, Dict[str, object]] = {}
    for raw_line in RAW_QUALITY_CLUES.strip().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        parts = [part.strip() for part in line.split("|")]
        answer = _normalize_answer(parts[0])
        clues = [part for part in parts[1:3] if part]
        tags: Sequence[str] = ()
        if len(parts) >= 4 and parts[3]:
            tags = tuple(tag.strip() for tag in parts[3].split(",") if tag.strip())
        parsed[answer] = {"clues": clues, "tags": tags}
    return parsed


QUALITY_CLUES = _parse_quality_clues()

THEME_TINTED_CLUES: Dict[str, Dict[str, str]] = {
    "coffee-break": {
        "BUN": "Cafe pastry",
        "CUP": "Morning brew holder",
        "EARLY": "When the first pot often starts",
        "EAGER": "Ready for the first sip, say",
        "EGG": "Breakfast order",
        "EXTRA": "Bonus espresso shot",
        "JAM": "Toast topper",
        "JOE": "Coffee, casually",
        "LIGHT": "How some take coffee",
        "MIX": "Cafe blend",
        "MUG": "Coffee cup",
        "OAT": "Latte milk option",
        "PAUSE": "Coffee break, by another name",
        "POT": "Coffee maker's vessel",
        "READY": "Set for a morning cup",
        "RISEN": "Up, like breakfast dough",
        "SIP": "Small taste of tea",
        "START": "First move of the morning",
        "TEA": "Steeped morning cup",
        "TIMER": "Break-room countdown",
    },
    "fresh-air": {
        "AIR": "What you step outside for",
        "BAY": "Water by the shore",
        "BAA": "Sound on a country walk",
        "DRY": "Good, as picnic weather",
        "EAGER": "Ready to get outside, say",
        "FOG": "Low cloud on a morning walk",
        "JOG": "Park loop, maybe",
        "LIGHT": "Morning park glow",
        "OAK": "Sturdy park tree",
        "OAR": "Paddle on a lake",
        "OPENS": "Lets in the breeze",
        "RAY": "Bit of sunlight",
        "RAN": "Did a park loop, say",
        "READY": "Set for a walk",
        "RISEN": "Up with the sun",
        "ROW": "Paddle a boat",
        "RUN": "Trail outing",
        "SEA": "Saltwater view",
        "SKY": "Open-air view",
        "SPRAY": "Mist from a garden hose",
        "START": "Trailhead moment",
        "STILL": "Calm, like a quiet lake",
        "STREAM": "Water along a trail",
        "SUN": "Bright thing overhead",
        "WALK": "Fresh-air outing",
        "WET": "Like grass after rain",
    },
    "home-reset": {
        "ARRAY": "Neat arrangement",
        "BASIN": "Sink bowl",
        "BED": "Place to smooth a sheet",
        "DEN": "Cozy room",
        "EASE": "What a clean room can bring",
        "LIGHT": "Window glow",
        "MAT": "Entryway landing spot",
        "MESSY": "Ready for a reset",
        "OPENS": "Lets in fresh room air",
        "PAUSE": "Reset moment between chores",
        "PASTE": "Adhesive for a fix-it drawer",
        "PEACE": "Quiet-room feeling",
        "PRESS": "Smooth clothes with an iron",
        "RUG": "Floor softener",
        "READY": "Set for a tidy day",
        "ROOMS": "Places to straighten",
        "SHEET": "Bed-making layer",
        "START": "First step in a reset",
        "TENDS": "Cares for houseplants",
    },
    "book-nook": {
        "ART": "Illustration, maybe",
        "INK": "What words may be printed in",
        "IMAGE": "Picture in a storybook",
        "NAMES": "Character list entries",
        "ODE": "Poem of praise",
        "OPENS": "Starts a new chapter",
        "PAUSE": "Reading-break moment",
        "PEARL": "Little gem of a line",
        "PEN": "Writer's tool",
        "READY": "Set to turn pages",
        "SALLY": "Witty line in dialogue",
        "SHEET": "Loose page",
        "STAGE": "Scene-setting place",
        "TITLE": "Name on a cover",
    },
    "kitchen-table": {
        "ARRAY": "Brunch spread, maybe",
        "BUN": "Bakery roll",
        "COD": "Fish for dinner",
        "EAGER": "Ready for seconds, say",
        "EAT": "Have a meal",
        "EGG": "Breakfast staple",
        "EXTRA": "Another helping",
        "FEAST": "Table full of food",
        "HAM": "Brunch slice",
        "JAM": "Toast spread",
        "LIGHT": "Not too heavy, as a meal",
        "MIX": "Combine in a bowl",
        "OIL": "Pan coating",
        "PAUSE": "Moment before dessert",
        "PAN": "Stovetop vessel",
        "PIE": "Dessert wedge",
        "POT": "Soup vessel",
        "RISEN": "Like proofed dough",
        "SPRAY": "Oil from a cooking can",
        "TIMER": "Oven watcher",
        "YAM": "Orange side dish",
    },
    "weekend-glow": {
        "EAGER": "Ready for Saturday plans",
        "EXTRA": "A little bonus free time",
        "FEAST": "Celebratory spread",
        "FUN": "Weekend goal",
        "FUNNY": "Good for a weekend laugh",
        "JOY": "Sunny mood",
        "LAUGH": "Weekend mood booster",
        "LIGHT": "Easy, as weekend plans",
        "MOVIE": "Weekend screen pick",
        "OPENS": "Begins the weekend",
        "READY": "Set for fun",
        "SUNNY": "Good for outdoor plans",
        "WOW": "Reaction to great plans",
        "YAY": "Weekend cheer",
    },
    "weather-watch": {
        "ARRAY": "Radar display, maybe",
        "DRY": "Rain-free",
        "EARLY": "Before the forecast changes, maybe",
        "FOG": "Low-visibility weather",
        "HOT": "Like a July forecast",
        "ICE": "Freezing-weather hazard",
        "ICY": "Like a slick sidewalk",
        "LIGHT": "Kind of rain",
        "OPENS": "Clears, as the sky",
        "RAY": "Bit of sun",
        "READY": "Set for the forecast",
        "SKY": "Forecast canvas",
        "SPRAY": "Windblown mist",
        "START": "When the rain begins",
        "STILL": "Without wind",
        "STREAM": "Rain-swollen flow",
        "SUN": "Clear-day feature",
        "SUNRISE": "Clear morning signal",
        "WET": "Rain-soaked",
    },
    "city-stroll": {
        "ARRAY": "Storefront display",
        "BAR": "Corner stop, maybe",
        "BUS": "City ride",
        "CAB": "City ride for hire",
        "CAR": "Street vehicle",
        "EAGER": "Ready to wander downtown",
        "ERRAND": "Quick neighborhood chore",
        "INN": "Small place to stay",
        "LIGHT": "Crosswalk signal",
        "MAP": "Guide to a neighborhood",
        "MARKET": "Place with stalls",
        "OPENS": "Unlocks for the morning crowd",
        "READY": "Set for a stroll",
        "ROADS": "City grid lines",
        "STAGE": "Theater district spot",
        "START": "First block of a walk",
        "TAX": "Cab meter add-on, maybe",
        "WAY": "Street route",
    },
    "soundtrack": {
        "ARRAY": "Playlist lineup",
        "BOP": "Catchy tune",
        "GIG": "Musician's booking",
        "LIGHT": "Soft, as background music",
        "MIX": "DJ's set, perhaps",
        "OPENS": "Starts the show",
        "PAUSE": "Button between tracks",
        "POP": "Radio-friendly genre",
        "RAP": "Rhymed music style",
        "READY": "Set to press play",
        "SALLY": "Witty lyric turn",
        "SAX": "Brassy jazz horn",
        "STAGE": "Concert platform",
        "START": "First beat",
        "TIMER": "Metronome cousin",
    },
    "mindful-morning": {
        "AIR": "Breath focus",
        "EAGER": "Ready after a deep breath",
        "EASE": "Calm feeling",
        "LIGHT": "Soft morning glow",
        "NAP": "Short rest",
        "PAUSE": "Small breath between tasks",
        "PAT": "Gentle touch",
        "READY": "Centered and set",
        "REST": "Recharge",
        "RISEN": "Up for the day",
        "SPA": "Relaxing retreat",
        "START": "First mindful moment",
        "STILL": "Calm and unmoving",
        "TIMER": "Meditation helper",
        "ZEN": "Calm state",
    },
    "travel-lite": {
        "BAG": "Carry-on, perhaps",
        "BAY": "Scenic stop by the water",
        "BUS": "Budget ride",
        "CAB": "Airport ride",
        "CAR": "Road-trip vehicle",
        "EAGER": "Ready for a getaway",
        "EXTRA": "Spare item in a bag",
        "INN": "Small overnight stop",
        "JET": "Fast flight",
        "LIGHT": "How to pack",
        "MAP": "Trip guide",
        "MAPS": "Route guides",
        "OPENS": "Starts a trip",
        "READY": "Packed and set",
        "ROADS": "Travel routes",
        "SEA": "Cruise view",
        "START": "First leg of a trip",
        "TAX": "Ticket add-on, maybe",
        "TAXIS": "Airport line vehicles",
        "TRAIN": "Rail ride",
        "VAN": "Group-trip vehicle",
        "WAY": "Route",
    },
    "culture-corner": {
        "ADS": "Spots before a video",
        "APP": "Phone-screen tool",
        "ART": "Museum draw",
        "ARRAY": "Gallery display",
        "GIF": "Looping internet image",
        "IMAGE": "Gallery piece, perhaps",
        "LIGHT": "Museum spotlight",
        "NAMES": "Credits entries",
        "ODE": "Poetic tribute",
        "OPENS": "Begins a show",
        "POP": "Mass-culture style",
        "READY": "Set for the screening",
        "SALLY": "Witty line onstage",
        "STAGE": "Theater platform",
        "START": "Opening moment",
        "STREAM": "Watch online",
        "WEB": "Online world",
    },
}


def clean_clue(answer: str, clue: str) -> str | None:
    answer = _normalize_answer(answer)
    clue = re.sub(r"\s+", " ", clue.replace("\n", " ")).strip(" .,\t")
    if not clue:
        return None
    if len(clue) > 72:
        return None
    if len(clue.split()) > 10:
        return None
    if BAD_CLUE_RE.search(clue):
        return None
    if answer.lower() in clue.lower().replace(" ", ""):
        return None
    if clue.count("?") > 1:
        return None
    return clue[0].upper() + clue[1:]


def _raw_clues_for(answer: str, fallback_clues: Sequence[str] = ()) -> tuple[List[str], bool]:
    answer = _normalize_answer(answer)
    curated = QUALITY_CLUES.get(answer)
    raw_clues = list(curated["clues"]) if curated else list(fallback_clues)
    return raw_clues, curated is not None


def quality_clues_for(answer: str, fallback_clues: Sequence[str] = ()) -> List[str]:
    answer = _normalize_answer(answer)
    raw_clues, curated = _raw_clues_for(answer, fallback_clues)
    cleaned: List[str] = []
    seen = set()
    for raw in raw_clues:
        clue = clean_clue(answer, raw)
        if not clue:
            continue
        if not curated and (len(clue) > 42 or BAD_FALLBACK_CLUE_RE.search(clue)):
            continue
        key = clue.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(clue)
    return cleaned[:3]


def clue_theme_tags(answer: str, clue: str) -> List[str]:
    answer = _normalize_answer(answer)
    tokens = set(re.findall(r"[a-z]+", f"{answer.lower()} {clue.lower()}"))
    tags = {
        theme_id
        for theme_id, keywords in THEME_CLUE_KEYWORDS.items()
        if tokens.intersection(keywords)
    }
    return sorted(tags)


def theme_tags_for(
    answer: str,
    existing_tags: Sequence[str] = (),
    clue_options: Sequence[str] = (),
) -> List[str]:
    answer = _normalize_answer(answer)
    lower = answer.lower()
    tags = set(tag for tag in existing_tags if tag in THEME_IDS)
    curated = QUALITY_CLUES.get(answer)
    if curated:
        tags.update(str(tag) for tag in curated["tags"])
    for theme_id, words in THEME_WORDS.items():
        if lower in words and lower not in FILL_ONLY_THEME_WORDS:
            tags.add(theme_id)
    return sorted(tags)


def clue_difficulty(answer: str, clue: str) -> str:
    if "?" in clue:
        return "tricky"
    if len(answer) <= 3 and len(clue.split()) <= 4:
        return "easy"
    if STALE_CLUE_RE.search(clue):
        return "easy"
    if len(clue.split()) >= 7:
        return "medium"
    return "easy" if len(answer) <= 5 else "medium"


def clue_type(answer: str, clue: str, theme_tags: Sequence[str]) -> str:
    if "?" in clue:
        return "wordplay"
    if theme_tags:
        return "theme"
    if clue.lower() in {"opposite of no", "not dry", "not wet"}:
        return "contrast"
    return "direct"


def clue_score(answer: str, clue: str, theme_tags: Sequence[str], curated: bool) -> int:
    score = 78 if curated else 66
    score += min(10, len(theme_tags) * 3)
    if 3 <= len(clue.split()) <= 6:
        score += 6
    if "?" in clue:
        score += 4
    if STALE_CLUE_RE.search(clue):
        score -= 8
    if len(clue) > 46:
        score -= 5
    if len(answer) <= 3 and len(clue) > 36:
        score -= 6
    return max(0, min(100, score))


def clue_metadata_for(answer: str, fallback_clues: Sequence[str] = ()) -> List[dict]:
    answer = _normalize_answer(answer)
    raw_clues, curated = _raw_clues_for(answer, fallback_clues)
    metadata: List[dict] = []
    seen = set()
    themed_raw_clues: List[Tuple[str, Tuple[str, ...], str]] = [
        (raw, (), "editorial" if curated else "sanitized-legacy") for raw in raw_clues
    ]
    for theme_id, clue_by_answer in THEME_TINTED_CLUES.items():
        if answer in clue_by_answer:
            themed_raw_clues.append((clue_by_answer[answer], (theme_id,), "theme-editor"))

    for raw, explicit_theme_tags, source in themed_raw_clues:
        clue = clean_clue(answer, raw)
        rejection_notes: List[str] = []
        if not clue:
            rejection_notes.append("failed editorial cleanup")
            continue
        if source == "sanitized-legacy" and (len(clue) > 42 or BAD_FALLBACK_CLUE_RE.search(clue)):
            rejection_notes.append("legacy fallback fragment")
            continue
        key = clue.lower()
        if key in seen:
            continue
        seen.add(key)
        theme_tags = sorted(tag for tag in explicit_theme_tags if tag in THEME_IDS)
        metadata.append(
            {
                "text": clue,
                "type": clue_type(answer, clue, theme_tags),
                "difficulty": clue_difficulty(answer, clue),
                "tone": "daybreak" if theme_tags else "straight",
                "source": source,
                "score": clue_score(answer, clue, theme_tags, source != "sanitized-legacy"),
                "themeTags": theme_tags,
                "rejectionNotes": rejection_notes,
            }
        )

    metadata.sort(key=lambda item: (-int(item["score"]), str(item["text"])))
    return metadata[:8]
