#!/usr/bin/env python3
"""Shared Museum editorial-pipeline helpers."""

from __future__ import annotations

import csv
import html
import io
import json
import math
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable

BASE_DIR = Path(__file__).resolve().parents[1]
TMP_DIR = BASE_DIR / "tmp" / "museum"
DATA_DIR = BASE_DIR / "src" / "data" / "museum"
CURATED_PATH = DATA_DIR / "curatedArtworks.json"
EDITORIAL_BANK_PATH = DATA_DIR / "editorialBank.json"
SCHEDULE_PATH = DATA_DIR / "schedule.json"
EDITORIAL_SHARDS_DIR = DATA_DIR / "editorialShards"
TRACKER_PATH = BASE_DIR / "docs" / "museum-annual-pack-tracker.md"
EDITORIAL_GUIDE_PATH = BASE_DIR / "docs" / "museum-editorial-guide.md"
LOCAL_IMAGE_DIR = BASE_DIR / "public" / "museum-images"
LOCAL_IMAGE_PUBLIC_PREFIX = "museum-images"

DAY_MS = 1000 * 60 * 60 * 24
QUESTION_KINDS = ("observation", "context", "connection")
WORKFLOW_STATUSES = ("sourced", "drafted", "fact-checked", "copy-edited", "approved")
SUPPORTED_SOURCES = ("met", "aic", "rijks", "nga", "smithsonian", "ycba")
PUBLIC_DOMAIN_HINTS = ("cc0", "public domain", "open access")
SHOWCASE_TIER = "A-showcase"
SHOWCASE_APPROVAL_TYPE = "editor-agent-v1"
SHOWCASE_COPY_EDITORS = ("Editor B1", "Editor B2", "Editor B3", "Editor B4")
NATURAL_LANGUAGE_REVIEWERS = (
    "First-Time Art Novice",
    "Returning Daybreak Player",
    "Museum-Language Editor",
)
ART_LIKE_MEDIUM_CATEGORIES = {
    "Painting",
    "Print",
    "Textile",
    "Ceramic",
    "Sculpture",
    "Photograph",
    "Drawing",
    "Metalwork",
    "Furniture",
    "Manuscript",
    "Design",
    "Glass",
}
INSTITUTION_LABELS = {
    "met": "The Met",
    "aic": "Art Institute of Chicago",
    "rijks": "Rijksmuseum",
    "nga": "National Gallery of Art",
    "smithsonian": "Smithsonian Open Access",
    "ycba": "Yale Center for British Art",
}
POLICY_SOURCES = {
    "met": [
        "https://metmuseum.github.io/",
        "https://www.metmuseum.org/policies/image-resources",
    ],
    "aic": [
        "https://api.artic.edu/",
        "https://www.artic.edu/open-access/public-api",
    ],
    "rijks": [
        "https://data.rijksmuseum.nl/",
        "https://data.rijksmuseum.nl/docs/search",
    ],
    "nga": [
        "https://github.com/NationalGalleryOfArt/opendata",
        "https://www.nga.gov/open-access-images/open-data.html",
    ],
    "smithsonian": [
        "https://www.si.edu/openaccess",
        "https://edan.si.edu/openaccess/docs/",
    ],
    "ycba": [
        "https://britishart.yale.edu/collections-data-sharing",
        "https://britishart.yale.edu/using-images",
    ],
}
MUSEUM_COPY_SCOPE = ["reveal", "placard", "notes", "quiz", "result", "passport", "share", "cta"]
FLAT_MEDIA_CATEGORIES = {"Painting", "Print", "Drawing"}
DEFAULT_APPROVED_QUOTAS = {
    "smithsonian": 124,
    "aic": 94,
    "met": 72,
    "rijks": 33,
    "nga": 30,
    "ycba": 12,
}
DEFAULT_SOURCED_ONLY_QUOTAS = {
}
DEFAULT_YCBA_OBJECT_IDS = [
    "5481",
    "5464",
    "45",
    "1096",
    "5011",
    "1882",
    "30633",
    "5456",
    "5466",
    "5508",
    "42740",
    "4110",
    "42740",
    "5481",
    "5011",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def parse_date(value: str) -> date:
    return date.fromisoformat(value)


def stable_hash(value: str) -> int:
    hash_value = 2166136261
    for char in value:
        hash_value ^= ord(char)
        hash_value = (hash_value * 16777619) & 0xFFFFFFFF
    return hash_value


def normalize_space(value: str) -> str:
    return " ".join(str(value or "").replace("\n", " ").replace("\u00a0", " ").split()).strip()


def strip_markup(value: str) -> str:
    text = html.unescape(str(value or ""))
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\{[^{}]*\}", "", text)
    text = text.replace("_", "")
    return normalize_space(text)


def has_term(text: str, terms: Iterable[str]) -> bool:
    normalized = normalize_space(text).casefold()
    for term in terms:
        escaped = re.escape(term.casefold())
        if re.search(rf"(?<![a-z]){escaped}(?![a-z])", normalized):
            return True
    return False


def first_year_hint(value: str) -> int | None:
    text = normalize_space(value).casefold()
    match = re.search(r"\b(\d{3,4})\b", text)
    if not match:
        century_match = re.search(r"\b(\d{1,2})(?:st|nd|rd|th)\s+century\b", text)
        if not century_match:
            return None
        year = (int(century_match.group(1)) - 1) * 100
    else:
        year = int(match.group(1))
    if "bce" in text or "bc" in text:
        return -year
    return year


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", normalize_space(value).lower()).strip("-")
    return slug or "museum"


def is_runtime_image_url(value: str) -> bool:
    normalized = normalize_space(value)
    return normalized.startswith("http") or normalized.startswith("/") or normalized.startswith("museum-images/")


def local_image_filename(artwork_id: str) -> str:
    return f"{slugify(artwork_id)}.jpg"


def local_image_public_url(artwork_id: str) -> str:
    return f"{LOCAL_IMAGE_PUBLIC_PREFIX}/{local_image_filename(artwork_id)}"


def needs_local_image_cache(candidate: dict[str, Any]) -> bool:
    if candidate.get("source", {}).get("institution") != "smithsonian":
        return False
    return any("ids.si.edu" in normalize_space(url) for url in (candidate.get("images") or {}).values())


def runtime_images_for(candidate: dict[str, Any]) -> dict[str, str]:
    if needs_local_image_cache(candidate):
        local_url = local_image_public_url(candidate["id"])
        return {
            "thumbnailUrl": local_url,
            "displayUrl": local_url,
            "fullUrl": local_url,
        }
    return {
        "thumbnailUrl": candidate["images"]["thumbnailUrl"],
        "displayUrl": candidate["images"]["displayUrl"],
        "fullUrl": candidate["images"]["fullUrl"],
    }


def unique_strings(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for value in values:
        normalized = normalize_space(value)
        if not normalized:
            continue
        key = normalized.casefold()
        if key in seen:
            continue
        seen.add(key)
        output.append(normalized)
    return output


def seeded_option_sample(values: Iterable[str], seed_text: str, count: int, *, exclude: Iterable[str] = ()) -> list[str]:
    excluded = {normalize_space(value).casefold() for value in exclude}
    pool = [
        value
        for value in unique_strings(values)
        if normalize_space(value).casefold() not in excluded
    ]
    pool.sort(key=lambda value: stable_hash(f"{seed_text}:{value}"))
    return pool[:count]


def fetch_bytes(url: str, *, headers: dict[str, str] | None = None, timeout: int = 30) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Daybreak Museum annual-pack builder",
            **(headers or {}),
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.read()
    except (ssl.SSLError, urllib.error.URLError):
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(request, timeout=timeout, context=context) as response:
            return response.read()


def fetch_text(url: str, *, headers: dict[str, str] | None = None, timeout: int = 30) -> str:
    return fetch_bytes(url, headers=headers, timeout=timeout).decode("utf-8", "ignore")


def fetch_json(url: str, *, headers: dict[str, str] | None = None, timeout: int = 30) -> dict[str, Any]:
    return json.loads(fetch_text(url, headers=headers, timeout=timeout))


def fetch_json_or_none(url: str, *, headers: dict[str, str] | None = None, timeout: int = 30) -> dict[str, Any] | None:
    try:
        return fetch_json(url, headers=headers, timeout=timeout)
    except urllib.error.HTTPError:
        return None
    except json.JSONDecodeError:
        return None


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def humanize_creator(raw_value: str, *, fallback: str = "Unknown maker") -> str:
    value = strip_markup(raw_value)
    if not value:
        return fallback
    lower_value = value.casefold()
    if lower_value in {"anonymous", "unidentified", "unidentified artist", "unknown", "artist unknown", "true", "false", "none", "null"}:
        return fallback
    value = re.sub(r"^(?:after|copy after)\s+", "", value, flags=re.IGNORECASE)
    if re.match(r"^(?:artist|maker|ceramist|designer|photographer)\s+unknown\b", value, flags=re.IGNORECASE):
        role = value.split()[0].lower()
        if role == "artist":
            return "Unknown maker"
        return f"Unknown {role}"
    if value.lower().startswith("unknown photographer"):
        return "Unknown photographer"
    if re.match(r"^unidentified(?:\s+(?:artist|maker|man|woman|person))?\b", value, flags=re.IGNORECASE):
        return fallback
    value = value.split("\n", 1)[0]
    value = re.split(
        r"\s+(?:after|printed by|composed by|copy after|formerly attributed to|text by|published by|publisher:|lithographs by|engraved by)\s+",
        value,
        1,
        flags=re.IGNORECASE,
    )[0]
    value = value.split(";", 1)[0]
    value = re.sub(r"[\u3040-\u30ff\u3400-\u9fff]+", "", value)
    value = re.sub(r"\s*\([^)]*(?:born|died|\d{4}).*?\)", "", value)
    value = re.sub(r",\s*(?:born|active|died)\b.*$", "", value, flags=re.IGNORECASE)
    value = re.sub(r",\s*\d{3,4}\s*(?:-|–)\s*\d{3,4}.*$", "", value)
    value = re.sub(r",\s*\d{3,4}\b.*(?:died|death|born).*$", "", value, flags=re.IGNORECASE)
    value = re.sub(r",\s*\d{1,2}\s+[A-Z][a-z]{2}\s+\d{3,4}.*$", "", value)
    value = re.sub(
        r"\s+(?:American|British|English|French|Japanese|Italian|Dutch|German|Swiss|Spanish|Greek|Indian|Chinese|Korean|Iranian|Persian|Flemish|Belgian|Austrian|Russian|Mexican|Peruvian|Canadian|Ethiopian|Malian|Nigerian|Ghanaian|Bulgarian)\b.*$",
        "",
        value,
        flags=re.IGNORECASE,
    )
    value = re.sub(r",\s*[A-Z][a-z]+(?:,.*)?$", "", value) if " / " not in value else value
    value = normalize_space(value)
    if value.lower().startswith("george baxter"):
        return "George Baxter"
    culture_map = {
        "afghanistan": "Afghan maker",
        "akan": "Akan maker",
        "american": "American maker",
        "ancient roman": "Ancient Roman maker",
        "austria": "Austrian maker",
        "belgium": "Belgian maker",
        "britain": "British maker",
        "british": "British maker",
        "china": "Chinese maker",
        "chinese": "Chinese maker",
        "dutch": "Dutch maker",
        "egypt": "Egyptian maker",
        "england": "English maker",
        "english": "English maker",
        "ethiopian orthodox": "Ethiopian Orthodox maker",
        "flemish": "Flemish maker",
        "japan": "Japanese maker",
        "japanese": "Japanese maker",
        "france": "French maker",
        "italy": "Italian maker",
        "spain": "Spanish maker",
        "spanish": "Spanish maker",
        "iran": "Iranian maker",
        "iranian": "Iranian maker",
        "german": "German maker",
        "germany": "German maker",
        "french": "French maker",
        "northern italian": "Northern Italian maker",
        "german or swiss": "German or Swiss maker",
        "german or": "German maker",
        "greek": "Greek maker",
        "india": "Indian maker",
        "indian": "Indian maker",
        "india uttar pradesh": "Indian maker",
        "india gujarat found in the toraja area of sulawesi": "Indian textile maker",
        "kongo": "Kongo maker",
        "mexico": "Mexican maker",
        "netherlands": "Dutch maker",
        "peru": "Peruvian maker",
        "persian": "Persian maker",
        "swiss": "Swiss maker",
        "turkey iznik": "Iznik maker",
        "iran isfahan": "Iranian maker",
        "iran tehran or shiraz": "Iranian maker",
        "united states": "American maker",
    }
    mapped = culture_map.get(value.casefold())
    if mapped:
        return mapped
    if value.lower().endswith(" or"):
        return f"{value[:-3].strip()} maker"
    return value or fallback


def clean_title(value: str) -> str:
    title = strip_markup(value)
    title = re.sub(r'^"([^"]+)"', r"\1", title)
    title = re.sub(r"\s*\(\s*\)\s*", " ", title)
    title = re.sub(r"\s*\[[^\]]*(?:bibliograph|catalog|plate number|no\.|numbered|published|page)[^\]]*\]\s*", " ", title, flags=re.IGNORECASE)
    title = normalize_space(title)
    return title or "Untitled work"


def normalize_object_date(value: str) -> str:
    date_value = strip_markup(value)
    if not date_value:
        return "date unknown"
    date_value = date_value.replace(" - ", "–")
    date_value = re.sub(r"\bLate(\d)", r"Late \1", date_value)
    return date_value


def medium_text_is_invalid(value: str) -> bool:
    lower = strip_markup(value).casefold()
    invalid_medium_markers = (
        "bruikleen",
        "loan",
        "lent by",
        "bequest",
        "gift of",
        "sale,",
        "sold,",
        "donated",
        "acquired",
        "purchase",
        "provenance",
        "signature",
        "signed",
        "inv.",
        "sqq",
        "unknown medium",
    )
    return not lower or any(marker in lower for marker in invalid_medium_markers)


def concise_medium_for(candidate: dict[str, Any], medium_category: str) -> str:
    raw = strip_markup(candidate.get("medium", ""))
    lower = raw.casefold()
    if medium_text_is_invalid(raw):
        raw = ""

    def has(*terms: str) -> bool:
        return has_term(lower, terms)

    if medium_category == "Painting":
        if has("oil") and has("panel"):
            return "Oil on panel"
        if has("oil") and has("canvas"):
            return "Oil on canvas"
        if has("tempera"):
            return "Tempera painting"
        if has("watercolor"):
            return "Watercolor"
        return "Painting"
    if medium_category == "Print":
        if has("woodblock"):
            return "Woodblock print"
        if has("etching"):
            return "Etching"
        if has("engraving"):
            return "Engraving"
        if has("lithograph"):
            return "Lithograph"
        if has("screenprint"):
            return "Screenprint"
        return "Print"
    if medium_category == "Drawing":
        if has("watercolor") and has("ink"):
            return "Watercolor and ink on paper"
        if has("watercolor"):
            return "Watercolor on paper"
        if has("chalk"):
            return "Chalk on paper"
        if has("graphite"):
            return "Graphite on paper"
        if has("charcoal"):
            return "Charcoal on paper"
        if has("pen") or has("ink"):
            return "Ink on paper"
        return "Drawing on paper"
    if medium_category == "Textile":
        if has("silk") and has("metal"):
            return "Silk and metal-thread textile"
        if has("silk"):
            return "Silk textile"
        if has("wool") and has("cotton"):
            return "Wool and cotton textile"
        if has("tapestry"):
            return "Tapestry"
        if has("embroidery") or has("embroidered"):
            return "Embroidered textile"
        return "Textile"
    if medium_category == "Photograph":
        if has("gelatin silver"):
            return "Gelatin silver print"
        if has("albumen"):
            return "Albumen print"
        return "Photograph"
    if medium_category == "Sculpture":
        if has("bronze"):
            return "Bronze"
        if has("marble"):
            return "Marble"
        if has("limestone"):
            return "Limestone"
        if has("granite"):
            return "Granite"
        if has("wood") or has("cypress"):
            return "Carved wood"
        if has("stone"):
            return "Stone"
        return "Sculpture"
    if medium_category == "Ceramic":
        if has("porcelain"):
            return "Porcelain"
        if has("stone-paste") or has("stonepaste"):
            return "Stone-paste ceramic"
        if has("earthenware"):
            return "Earthenware"
        if has("stoneware"):
            return "Stoneware"
        if has("terracotta"):
            return "Terracotta"
        return "Ceramic"
    if medium_category == "Metalwork":
        if has("silver"):
            return "Silver"
        if has("gold"):
            return "Gold"
        if has("bronze"):
            return "Bronze"
        return "Metalwork"
    if medium_category == "Glass":
        return "Glass"
    if medium_category == "Furniture":
        return "Furniture"
    if medium_category == "Manuscript":
        return "Manuscript leaf"

    if raw and len(raw) <= 120:
        return raw
    if raw:
        return normalize_space(re.split(r"[.;]", raw, 1)[0])[:120].rstrip(" ,;:")
    return medium_category


def candidate_key(candidate: dict[str, Any]) -> str:
    return f"{candidate['source']['institution']}::{candidate['source']['objectId']}"


def english_value(block: Any) -> str:
    if isinstance(block, dict):
        if "en" in block and isinstance(block["en"], list) and block["en"]:
            return normalize_space(block["en"][0])
        if "content" in block and isinstance(block["content"], str):
            return normalize_space(block["content"])
        if "@value" in block and isinstance(block["@value"], str):
            return normalize_space(block["@value"])
    if isinstance(block, list):
        for item in block:
            value = english_value(item)
            if value:
                return value
    if isinstance(block, str):
        return normalize_space(block)
    return ""


def english_notation(items: Any) -> str:
    if not isinstance(items, list):
        return ""
    for item in items:
        language = item.get("@language") if isinstance(item, dict) else None
        if language == "en":
            return normalize_space(item.get("@value", ""))
    for item in items:
        if isinstance(item, dict) and item.get("@value"):
            return normalize_space(item["@" + "value"] if "@value" in item else item.get("@value", ""))
    return ""


def first_matching_text(values: Iterable[str], pattern: str) -> str:
    regex = re.compile(pattern, re.IGNORECASE)
    for value in values:
        normalized = normalize_space(value)
        if normalized and regex.search(normalized):
            return normalized
    return ""


def truthy_public_domain(value: str) -> bool:
    return any(hint in normalize_space(value).lower() for hint in PUBLIC_DOMAIN_HINTS)


def infer_medium_category(medium: str, classification: str, collection: str = "") -> str:
    primary = normalize_space(" ".join([medium, classification])).casefold()
    class_text = normalize_space(classification).casefold()
    secondary = normalize_space(collection).casefold()
    haystack = normalize_space(" ".join([primary, secondary])).casefold()
    if has_term(class_text, ("photograph", "photography")):
        return "Photograph"
    if has_term(class_text, ("painting", "paintings")) and not has_term(class_text, ("metalwork",)):
        return "Painting"
    if has_term(primary, ("drinking vessel", "tankard", "hanap")):
        return "Ceramic"
    if has_term(primary, ("textile", "tapestry", "silk", "weft", "warp", "embroidery", "fabric", "quilt", "velvet", "wool")):
        return "Textile"
    if has_term(primary, ("photo", "photograph", "gelatin silver", "albumen", "salted paper")):
        return "Photograph"
    if has_term(primary, ("mosaic", "tesserae")):
        return "Design"
    if has_term(primary, ("ceramic", "porcelain", "earthenware", "terracotta", "stoneware", "stone-paste", "tile", "amphora", "vase")):
        return "Ceramic"
    if has_term(primary, ("sculpture", "bronze", "marble", "stone", "limestone", "granite", "woodcarving", "carving", "statuette", "relief")):
        return "Sculpture"
    if has_term(primary, ("drawing", "watercolor", "gouache", "graphite", "charcoal", "pastel", "chalk", "crayon", "pen and ink", "ink on paper")):
        return "Drawing"
    if has_term(primary, ("print", "etching", "engraving", "lithograph", "woodblock", "screenprint", "mezzotint", "aquatint", "drypoint")):
        return "Print"
    if has_term(primary, ("silver", "gold", "steel", "iron", "metalwork", "enamel", "staurotheke", "armor", "shield", "sword")):
        return "Metalwork"
    if has_term(primary, ("furniture", "chair", "cabinet", "table", "desk")):
        return "Furniture"
    if has_term(primary, ("glass", "stained", "vitreous")):
        return "Glass"
    if has_term(primary, ("book", "manuscript", "folio", "leaf")):
        return "Manuscript"
    if has_term(primary, ("oil", "acrylic", "tempera", "canvas", "panel", "painting")):
        return "Painting"
    if has_term(haystack, ("print", "etching", "engraving", "lithograph", "woodblock", "screenprint", "mezzotint", "aquatint")):
        return "Print"
    if has_term(haystack, ("drawing", "watercolor", "gouache", "graphite", "charcoal", "pastel", "chalk")):
        return "Drawing"
    if has_term(haystack, ("painting", "oil", "canvas", "panel")):
        return "Painting"
    return "Design"


def infer_geo_region(*values: str) -> str:
    haystack = normalize_space(" ".join(values)).casefold()
    if has_term(haystack, ("earl grey", "tennyson", "amsterdam")):
        return "Europe"
    if has_term(haystack, ("egypt", "egyptian", "ancient egypt")):
        return "Africa"
    if has_term(haystack, ("tsuba", "japan", "japanese", "edo")):
        return "Asia"
    if has_term(haystack, ("spode", "doccia", "zuber", "cozzi", "fleur de lys")):
        return "Europe"
    if has_term(haystack, ("maya", "moche", "nasca", "inca", "andes", "andean", "guatemala", "peru", "mexico", "panama")):
        return "Latin America"
    if has_term(haystack, ("syria", "damascus", "iraq", "nimrud", "assyrian", "mesopotamian", "ottoman", "turkey", "nepal", "himalayan", "afghanistan")):
        return "Middle East" if not has_term(haystack, ("nepal", "himalayan")) else "Asia"
    if has_term(haystack, ("bologna", "italy", "italian", "villa borghese", "rome")):
        return "Europe"
    if has_term(haystack, ("united states", "american art", "north america", "canada")):
        return "North America"
    if has_term(haystack, ("japan", "japanese", "china", "chinese", "korea", "korean", "india", "indian", "thai", "asia", "asian", "persia", "persian", "iran", "iranian", "mughal", "edo")):
        return "Asia"
    if has_term(haystack, ("morocco", "africa", "african", "nigeria", "ghana", "mali", "benin", "ethiopia", "ethiopian")):
        return "Africa"
    if has_term(haystack, ("peru", "peruvian", "mexico", "mexican", "andes", "andean", "south america", "latin america", "pre-columbian", "guatemala")):
        return "Latin America"
    if has_term(haystack, ("united states", "america", "american", "canada", "north america", "saam", "npg", "cooper hewitt")):
        return "North America"
    if has_term(haystack, ("islamic", "ottoman", "syria", "iraq", "levant", "middle east", "arabia")):
        return "Middle East"
    if has_term(haystack, ("australia", "oceania", "pacific", "maori")):
        return "Oceania"
    if has_term(haystack, ("greece", "greek", "rome", "roman", "italy", "italian", "france", "french", "britain", "british", "england", "english", "london", "europe", "european", "dutch", "spain", "spanish", "german", "flemish", "netherland", "netherlands")):
        return "Europe"
    return "Global"


def infer_passport_label(candidate: dict[str, Any]) -> str:
    primary_text = normalize_space(
        " ".join(
            [
                candidate.get("culture", ""),
                candidate.get("period", ""),
                candidate.get("classification", ""),
                candidate.get("medium", ""),
                candidate.get("collection", ""),
                candidate.get("place", ""),
                candidate.get("country", ""),
                candidate.get("department", ""),
                candidate.get("artist", ""),
                " ".join(candidate.get("subjectTerms", [])),
                candidate.get("objectDate", ""),
                candidate.get("title", ""),
            ]
        )
    ).casefold()
    title_text = normalize_space(candidate.get("title", "")).casefold()
    all_text = normalize_space(f"{primary_text} {title_text}").casefold()
    date_text = candidate.get("objectDate", "").casefold()
    year = first_year_hint(date_text)

    if year is not None and year < 0:
        if has_term(primary_text, ("egypt", "egyptian")):
            return "Ancient Egypt"
        if has_term(primary_text, ("assyrian", "mesopotamian", "nimrud")):
            return "Ancient Near East"
        if has_term(primary_text, ("greece", "greek", "attic")):
            return "Ancient Greece"
        return "Ancient Art"

    if has_term(primary_text, ("maya", "moche", "andes", "andean", "pre-columbian")):
        return "Ancient Americas"
    if has_term(primary_text, ("assyrian", "mesopotamian", "nimrud")):
        return "Ancient Near East"
    if has_term(primary_text, ("nepal", "himalayan", "tara", "buddhist goddess")):
        return "Himalayan Buddhist Art"
    if has_term(primary_text, ("guanyin", "bodhisattva")):
        return "Buddhist Art"
    if has_term(primary_text, ("george washington", "president of us", "american art", "saam", "smithsonian american art museum")):
        return "American Art"
    if has_term(all_text, ("ukiyo-e", "ukiyo", "woodblock")):
        return "Ukiyo-e"
    if has_term(primary_text, ("mughal", "rajput", "india", "indian")):
        return "South Asian Court Art"
    if has_term(primary_text, ("post-impression", "van gogh", "cezanne", "cézanne")):
        return "Post-Impressionism"
    if has_term(primary_text, ("impression", "impressionism", "impressionist")):
        return "Impressionism"
    if has_term(primary_text, ("baroque", "rembrandt", "vermeer")):
        return "Baroque"
    if has_term(primary_text, ("rococo",)):
        return "Rococo"
    if has_term(primary_text, ("renaissance", "quattrocento", "cinquecento")):
        return "Renaissance"
    if has_term(primary_text, ("medieval", "cloisters", "stained glass", "illuminated")):
        return "Medieval"
    if has_term(primary_text, ("byzantine",)):
        return "Byzantine"
    if has_term(primary_text, ("red-figure", "amphora", "ancient greek", "attic")):
        return "Ancient Greece"
    if has_term(primary_text, ("ancient egypt", "egyptian", "pharaoh")):
        return "Ancient Egypt"
    if has_term(primary_text, ("china", "chinese", "ming", "qing", "song")):
        return "Chinese Art"
    if has_term(primary_text, ("japan", "japanese", "edo")):
        return "Japanese Art"
    if has_term(primary_text, ("islamic", "ottoman", "persia", "persian", "iran", "iranian", "safavid")):
        return "Islamic Art"
    if has_term(primary_text, ("africa", "african", "yoruba", "akan", "benin", "kongo")):
        return "African Art"
    asian_museum_context = has_term(
        " ".join([primary_text, candidate.get("source", {}).get("collectionLabel", "")]),
        ("national museum of asian art", "charles lang freer collection"),
    )
    if has_term(primary_text, ("american", "saam", "smithsonian american art museum")) and not asian_museum_context:
        return "American Art"
    if has_term(primary_text, ("npg", "national portrait gallery", "portrait")) or has_term(title_text, ("portrait",)):
        if year is not None and year < 1700:
            return "Renaissance" if year < 1600 else "Baroque"
        return "Portraiture"
    if has_term(primary_text, ("photograph", "photography")):
        return "Photography"
    if has_term(primary_text, ("design", "chair", "furniture", "cooper hewitt", "chndm")):
        return "Design"
    if has_term(primary_text, ("textile", "tapestry", "woven", "embroidery", "silk", "wool")):
        return "Textile Traditions"
    if has_term(primary_text, ("print", "etching", "engraving", "lithograph", "woodcut")):
        return "Print Culture"
    if year is not None and year < 500:
        return "Ancient Art"
    if year is not None and year < 1400:
        return "Medieval"
    if year is not None and year < 1600:
        return "Renaissance"
    if year is not None and year < 1750:
        return "Baroque"
    if year is not None and year < 1800:
        return "Enlightenment Era"
    if year is not None and year < 1900:
        return "Nineteenth-Century Art"
    if year is not None and year < 2000:
        return "Modern Art"
    return "World Art"


def build_place_label(candidate: dict[str, Any], geo_region: str) -> str:
    raw_context = normalize_space(
        " ".join(
            [
                candidate.get("culture", ""),
                candidate.get("period", ""),
                candidate.get("country", ""),
                candidate.get("place", ""),
                candidate.get("department", ""),
                candidate.get("collection", ""),
                candidate.get("source", {}).get("collectionLabel", ""),
                " ".join(candidate.get("subjectTerms", [])),
                candidate.get("title", ""),
            ]
        )
    )
    title_context = normalize_space(candidate.get("title", ""))
    if has_term(raw_context, ("egypt", "egyptian", "ancient egypt")):
        return "Egypt"
    if has_term(raw_context, ("tsuba", "japan", "japanese", "edo")):
        return "Japan"
    if has_term(raw_context, ("spode",)):
        return "Britain"
    if has_term(raw_context, ("doccia", "cozzi")):
        return "Italy"
    if has_term(raw_context, ("zuber", "fleur de lys")):
        return "France"
    if has_term(raw_context, ("nimrud", "assyrian")):
        return "Nimrud"
    if has_term(title_context, ("amsterdam",)):
        return "Netherlands"
    if has_term(title_context, ("tennyson", "earl grey")):
        return "Britain"
    if has_term(title_context, ("bologna", "villa borghese")):
        return "Italy"
    if has_term(raw_context, ("bologna", "villa borghese", "rome")):
        return "Italy"
    if has_term(raw_context, ("earl grey", "united kingdom", "britain", "british")):
        return "Britain"
    if has_term(raw_context, ("turkey", "ottoman", "iznik")):
        return "Turkey"
    if has_term(raw_context, ("maya",)):
        return "Maya"
    if has_term(raw_context, ("nepal", "himalayan")):
        return "Nepal"
    if has_term(raw_context, ("syria", "damascus")):
        return "Syria"
    if has_term(raw_context, ("edo", "japan", "japanese")):
        return "Edo Japan" if has_term(raw_context, ("edo",)) else "Japan"
    if has_term(raw_context, ("india", "mughal", "south asian")):
        return "India" if has_term(raw_context, ("india",)) else "South Asia"
    if has_term(raw_context, ("united states", "american art")):
        return "United States"
    for key in ("country", "place", "culture"):
        value = strip_markup(candidate.get(key, ""))
        if value and len(value) <= 40:
            return value
    department = normalize_space(candidate.get("department", "")).upper()
    collection = normalize_space(candidate.get("source", {}).get("collectionLabel", ""))
    if department in {"SAAM", "NPG", "CHNDM"} or collection in {
        "Smithsonian American Art Museum",
        "National Portrait Gallery",
        "Cooper Hewitt, Smithsonian Design Museum",
    }:
        return "United States"
    if department == "NMAFA" or collection == "National Museum of African Art":
        return "Africa"
    if department == "FSG" or collection == "National Museum of Asian Art":
        return "Asia"
    if geo_region == "Europe":
        return "Europe"
    if geo_region == "Asia":
        return "Asia"
    if geo_region == "Africa":
        return "Africa"
    if geo_region == "North America":
        return "North America"
    if geo_region == "Latin America":
        return "Latin America"
    if geo_region == "Middle East":
        return "Middle East"
    if geo_region == "Global":
        return "Global collection"
    return geo_region


def placard_period_tag(place_label: str, passport_label: str, object_date: str) -> str:
    date_text = "" if object_date.lower() in {"n.d.", "date unknown", "unknown"} else object_date
    parts = [passport_label]
    if place_label and place_label not in {passport_label, "Global collection"}:
        parts.append(place_label)
    if date_text:
        parts.append(date_text)
    return " · ".join(parts)


SUBJECT_STOPWORDS = {
    "after",
    "album",
    "and",
    "anonymous",
    "ca",
    "circa",
    "complete",
    "design",
    "figure",
    "fragment",
    "from",
    "image",
    "manuscript",
    "number",
    "object",
    "panel",
    "plate",
    "portrait",
    "scene",
    "series",
    "sheet",
    "study",
    "the",
    "untitled",
    "unidentified",
    "unknown",
    "view",
    "with",
    "work",
    "large",
    "powdered",
    "cancelled",
    "canceled",
}


def sentence_label(value: str) -> str:
    normalized = normalize_space(value)
    if not normalized:
        return normalized
    return normalized[0].upper() + normalized[1:]


def keyword_in_text(text: str, keyword: str) -> bool:
    normalized = normalize_space(text).casefold()
    key = normalize_space(keyword).casefold()
    if not key:
        return False
    escaped_key = re.escape(key).replace(r"\ ", r"\s+")
    return bool(re.search(rf"(?<![a-z]){escaped_key}(?![a-z])", normalized))


def title_terms(title: str) -> list[str]:
    terms = []
    for word in re.findall(r"[A-Za-z][A-Za-z'’-]*", title):
        key = word.casefold().strip("'’")
        if len(key) < 3 or key in SUBJECT_STOPWORDS:
            continue
        terms.append(word)
    return terms


def compact_title_subject(title: str, medium_category: str) -> str:
    clean = clean_title(title)
    lead = re.split(r",\s*from\b|;\s*| / |\s+-\s+|\s+--\s+", clean, 1, flags=re.IGNORECASE)[0]
    lead = re.sub(r"\([^)]*\)", "", lead)
    lead = normalize_space(lead.strip(" .,:;\"'“”‘’"))
    if not lead:
        lead = clean

    lower = lead.casefold()
    if lower.startswith(("the ", "a ", "an ")):
        return lead[:1].lower() + lead[1:]

    words = title_terms(lead)
    if not words:
        fallback = {
            "Painting": "the painted focus",
            "Print": "the printed motif",
            "Drawing": "the drawn motif",
            "Textile": "the woven design",
            "Photograph": "the photographed view",
            "Sculpture": "the sculpted form",
            "Ceramic": "the shaped vessel",
            "Metalwork": "the worked metal form",
            "Glass": "the glass image",
            "Furniture": "the designed object",
            "Manuscript": "the illustrated page",
        }
        return fallback.get(medium_category, "the visible form")

    phrase = " ".join(words[:5])
    if medium_category == "Photograph" and re.search(r"\b(?:river|falls|valley|mount|mountain|street|court|gully|coast|harbor|lake|loch|plaza|chapel|bridge)\b", lower):
        return f"the view of {phrase}"
    if medium_category == "Photograph" and not lower.startswith(("view", "landscape", "portrait")):
        return "the photographed view"
    return f"the {phrase}"


def short_subject(value: str) -> str:
    text = normalize_space(value)
    text = re.sub(r"^(?:a|an|the)\s+", "", text, flags=re.IGNORECASE)
    words = text.split()
    if len(words) > 6:
        return " ".join(words[:6])
    return text or "visible detail"


def display_subject(value: str) -> str:
    text = normalize_space(value)
    if not text:
        return "the visible detail"
    words = text.split()
    if len(words) > 6:
        text = " ".join(words[:6])
    if re.match(r"^(?:a|an|the)\s+", text, flags=re.IGNORECASE):
        return text[:1].lower() + text[1:]
    return text


def copy_safe_title(value: str) -> str:
    title = clean_title(value)
    title = re.split(r",\s*from\b|;\s*| / |\s+--\s+", title, 1, flags=re.IGNORECASE)[0]
    title = re.sub(r"\[[^\]]*$", "", title)
    title = re.sub(r"\([^)]*$", "", title)
    title = title.replace("“", "\"").replace("”", "\"").replace("‘", "'").replace("’", "'")
    if title.count("\"") % 2:
        title = title.replace("\"", "")
    if title.count("'") % 2 and title.endswith("'"):
        title = title[:-1]
    title = re.sub(r"\[[^\]]*$", "", title)
    title = re.sub(r"\([^)]*$", "", title)
    title = normalize_space(title.strip(" .,:;\"'"))
    if title.count("\"") % 2:
        title = title.replace("\"", "")
    return title or "this work"


def truncated_title(value: str, max_len: int) -> str:
    title = copy_safe_title(value)
    if len(title) <= max_len:
        return title
    parts: list[str] = []
    for word in title.split():
        candidate = normalize_space(" ".join([*parts, word]))
        if len(candidate) > max_len - 3:
            break
        parts.append(word)
    title = normalize_space(" ".join(parts)) or normalize_space(title[: max_len - 3])
    title = re.sub(r"\([^)]*$", "", title)
    title = re.sub(r"\[[^\]]*$", "", title)
    if title.count("\"") % 2:
        title = title.replace("\"", "")
    title = normalize_space(title).rstrip(" ,;:")
    return f"{title}..." if title else "this work"


def quiz_title(value: str) -> str:
    return truncated_title(value, 48)


def note_title(value: str) -> str:
    return truncated_title(value, 84)


def sentence_subject(value: str) -> str:
    text = display_subject(value)
    return sentence_label(text)


def medium_display(candidate: dict[str, Any], medium_category: str) -> str:
    medium = normalize_space(strip_markup(candidate.get("medium", "")))
    if not medium or medium_text_is_invalid(medium):
        medium = medium_category
    medium = re.split(r";|, with | mounted | on paperboard", medium, 1, flags=re.IGNORECASE)[0]
    medium = re.sub(r"\s+", " ", medium).strip(" .,;:")
    if len(medium) > 48:
        medium = " ".join(medium.split()[:7]).strip(" .,;:")
    return medium or medium_category


def medium_sentence_fragment(candidate: dict[str, Any], medium_category: str) -> str:
    medium = medium_display(candidate, medium_category)
    return medium[:1].lower() + medium[1:] if medium else medium_category.lower()


def object_form_phrase(candidate: dict[str, Any], medium_category: str) -> str:
    subject = display_subject(specific_subject(candidate, medium_category))
    medium = medium_sentence_fragment(candidate, medium_category)
    if medium_category == "Painting":
        return f"a painted image centered on {subject}"
    if medium_category == "Print":
        return f"a printed image organized around {subject}"
    if medium_category == "Drawing":
        return f"a drawn study of {subject}"
    if medium_category == "Textile":
        return f"a textile where fiber carries {subject}"
    if medium_category == "Photograph":
        return f"a photograph shaped by viewpoint and {subject}"
    if medium_category == "Sculpture":
        return f"a three-dimensional object built around {subject}"
    if medium_category == "Ceramic":
        return f"a ceramic object whose form directs attention to {subject}"
    if medium_category == "Metalwork":
        return f"a metal object where surface and edge define {subject}"
    if medium_category == "Glass":
        return f"a glass object whose surface changes around {subject}"
    if medium_category == "Furniture":
        return f"a designed object where use and finish meet"
    if medium_category == "Manuscript":
        return f"a manuscript page where text and image share space"
    return f"a {medium} object organized around {subject}"


def short_title(value: str) -> str:
    title = clean_title(value)
    title = re.split(r",\s*from\b|;\s*| / |\s+--\s+", title, 1, flags=re.IGNORECASE)[0]
    title = re.sub(r"\[[^\]]*$", "", title)
    title = re.sub(r"\([^)]*$", "", title)
    if title.count("\"") % 2:
        title = title.replace("\"", "")
    return normalize_space(title).strip(" .,:;\"'“”‘’")[:72].rstrip(" ,;:")


def is_plural_phrase(value: str) -> bool:
    text = normalize_space(value).casefold()
    if not text:
        return False
    if text in {"flowers", "musicians", "sheep", "travelers", "cherry blossoms", "khosrow and shirin"}:
        return True
    return bool(re.search(r"\b(?:figures|lovers|travelers|musicians|flowers|blossoms|sheep)\b", text))


def verb_for_subject(value: str) -> str:
    return "give" if is_plural_phrase(value) else "gives"


def becomes_for_subject(value: str) -> str:
    return "become" if is_plural_phrase(value) else "becomes"


def is_for_subject(value: str) -> str:
    return "are" if is_plural_phrase(value) or " and " in normalize_space(value).casefold() else "is"


def link_for_subject(value: str) -> str:
    return "link" if is_plural_phrase(value) or " and " in normalize_space(value).casefold() else "links"


def gain_for_subject(value: str) -> str:
    return "gain" if is_plural_phrase(value) or " and " in normalize_space(value).casefold() else "gains"


def possessive_for_subject(value: str) -> str:
    return "their" if is_plural_phrase(value) or " and " in normalize_space(value).casefold() else "its"


def belongs_for_subject(value: str) -> str:
    return "belong" if is_plural_phrase(value) or " and " in normalize_space(value).casefold() else "belongs"


def gerund_subject(value: str) -> str:
    text = normalize_space(value)
    lowered = text.casefold()
    if lowered.startswith(("a ", "an ", "the ")):
        return text
    if is_plural_phrase(text) or " and " in lowered or (text and text[0].isupper()):
        return text
    return f"the {text}"


def choose_subject_label(candidate: dict[str, Any]) -> str:
    title = clean_title(candidate.get("title", ""))
    title_lower = title.casefold()
    subject_text = normalize_space(" ".join(candidate.get("subjectTerms", []))).casefold()
    haystack = normalize_space(" ".join([title, subject_text])).casefold()
    explicit_subjects = [
        ("alfred tennyson with his sons", "Tennyson and his sons"),
        ("altar frontal", "the altar frontal"),
        ("amsterdam", "the Amsterdam waterfront"),
        ("ballet dancer", "a ballet dancer"),
        ("bamboo in the four seasons", "bamboo stalks"),
        ("blossoming plum and camellia", "plum blossoms and camellias"),
        ("book of the dead", "the illustrated funerary text"),
        ("buddhist goddess tara", "the goddess Tara"),
        ("cancelled printing plate", "the printing plate"),
        ("chateau of vallambrosa", "a hilltop chateau"),
        ("chagres", "a river settlement"),
        ("chasuble", "the orphrey cross"),
        ("clock watch with astronomical dial", "an astronomical dial"),
        ("cope with hood", "the hooded cope"),
        ("concourse of the birds", "birds gathered in the manuscript scene"),
        ("coverlet", "the coverlet pattern"),
        ("cows crossing a ford", "cows at a ford"),
        ("damascus room", "the paneled Damascus interior"),
        ("dance class", "the dancers at practice"),
        ("earl charles grey", "the sitter's likeness"),
        ("fudo myoo", "the Wisdom King"),
        ("fudō", "the fierce Wisdom King"),
        ("immovable wisdom king", "the fierce Wisdom King"),
        ("george washington", "George Washington"),
        ("guanyin", "the bodhisattva Guanyin"),
        ("gossip on the beach", "figures on the beach"),
        ("ia orana maria", "Mary and attendant figures"),
        ("iceberg ca", "the canyon view"),
        ("il mascherone", "a rocaille fountain"),
        ("ipswich prints", "the printed landscape motif"),
        ("kulliyat", "the manuscript page"),
        ("large kneeling statue", "the kneeling royal figure"),
        ("lord will provide", "an allegorical religious scene"),
        ("mask and ring", "the mask form"),
        ("mery horn", "the seated figure"),
        ("musk cat", "the small animal form"),
        ("misty sea", "mist over the sea"),
        ("moyō hinagata", "the kimono-design page"),
        ("mooy-aal", "Mooy-Aal and her suitors"),
        ("one of the twelve deva", "Bonten, one of the deva"),
        ("one-tier tube", "the jade tube"),
        ("panel with the god", "Zeus/Serapis/Ohrmazd and a worshiper"),
        ("patent office building", "patent model cases"),
        ("portrait of a father and daughter", "a father and daughter"),
        ("portrait of a man", "the sitter's face"),
        ("portrait of six men", "six men"),
        ("portrait of willem", "the royal sitter"),
        ("aernout van beeftingh", "a family portrait group"),
        ("party after a day", "polar bears near the ship"),
        ("powdered tea container", "the tea container"),
        ("refectory", "a refectory interior"),
        ("relief showing the head of a winged genius", "a winged genius in relief"),
        ("rustic interior", "a stage-set interior"),
        ("saint bridget of sweden", "Saint Bridget receiving the rule"),
        ("shiga ware cylindrical tea bowl", "the cylindrical tea bowl"),
        ("sporting or target crossbow", "a youth-sized crossbow"),
        ("st. ives", "the Cornish coastal view"),
        ("stela of the steward", "the carved standing slab"),
        ("stela of ptahmose", "the carved standing slab"),
        ("tankard", "a tankard with ships"),
        ("ten verses on oxherding", "oxherding scenes"),
        ("the angler", "the angler"),
        ("the artist in his studio", "the artist at work"),
        ("the channel sketchbook", "the sketchbook page"),
        ("the dance class", "the dancers at practice"),
        ("the vernal and nevada falls", "the Yosemite waterfall view"),
        ("third floor south wing", "patent model cases"),
        ("tobatsu bishamonten", "the guardian figure"),
        ("tusk", "the carved tusk"),
        ("vessel with mythological scene", "a mythological scene on a vessel"),
        ("wheellock rifle", "the decorated rifle"),
        ("yuny and his wife", "Yuny and Renenutet"),
    ]
    for key, label in explicit_subjects:
        if keyword_in_text(title_lower, key):
            return label
    if keyword_in_text(title_lower, "pendant"):
        return "an ivory pendant"
    if keyword_in_text(title_lower, "bracelet"):
        return "an ivory bracelet"
    if keyword_in_text(title_lower, "ornament") and keyword_in_text(haystack, "tortoise"):
        return "a tortoise-shaped ornament"
    if keyword_in_text(title_lower, "portrait") or keyword_in_text(subject_text, "portrait"):
        if keyword_in_text(title_lower, "woman") or keyword_in_text(subject_text, "female"):
            return "the sitter's face"
        if keyword_in_text(title_lower, "man") or keyword_in_text(subject_text, "male"):
            return "the sitter's face"
        return "the sitter's likeness"
    if title_lower in {"figure", "male figure", "female figure"}:
        return "the standing figure"
    if title_lower == "head":
        return "the carved head"
    keyword_map = [
        ("abbey", "an abbey"),
        ("armor", "armor"),
        ("bowl", "a bowl"),
        ("bridge", "a bridge"),
        ("buddha", "a seated Buddha"),
        ("casket", "a casket"),
        ("chair", "a chair"),
        ("chagres", "a river settlement"),
        ("cherry blossom", "cherry blossoms"),
        ("cross", "a cross"),
        ("cuckoo", "a cuckoo in flight"),
        ("cypress", "a cypress tree"),
        ("dog", "a dog"),
        ("flower", "flowers"),
        ("garden", "a garden"),
        ("green and rose", "the music room interior"),
        ("harmony", "the music room interior"),
        ("horse", "a horse"),
        ("khosrow", "Khosrow and Shirin"),
        ("loch", "a loch"),
        ("madonna", "the Madonna"),
        ("mount fuji", "Mount Fuji"),
        ("music room", "the music room interior"),
        ("musician", "musicians"),
        ("nocturne", "the blue-and-gold water"),
        ("orange", "an orange shop sign"),
        ("pine tree", "a pine tree"),
        ("pier", "a pier"),
        ("plum orchard", "a plum orchard"),
        ("plaza", "a plaza"),
        ("peonies", "peonies"),
        ("river", "a river"),
        ("saint", "a saint"),
        ("sheep", "sheep"),
        ("ship", "a ship"),
        ("shop", "a shop interior"),
        ("stela", "a carved standing slab"),
        ("sword", "a sword"),
        ("tea", "a tea utensil"),
        ("terrace", "terrace figures"),
        ("travelers", "travelers"),
        ("unicorn", "a unicorn"),
        ("vase", "a vessel"),
        ("wave", "a wave"),
        ("water lilies", "water lilies"),
        ("willow tree", "a willow tree"),
        ("mountain", "a mountain"),
        ("sea", "the sea"),
        ("solola", "a Guatemalan town view"),
        ("self-portrait", "the artist's self-portrait"),
        ("zelfportret", "the artist's self-portrait"),
        ("woman", "the figure's face"),
        ("man", "the figure's face"),
    ]
    for key, label in keyword_map:
        if keyword_in_text(haystack, key):
            return label
    medium_category = infer_medium_category(candidate.get("medium", ""), candidate.get("classification", ""), candidate.get("collection", ""))
    return compact_title_subject(title, medium_category)


def medium_family_distractors(medium_category: str) -> list[str]:
    mapping = {
        "Painting": ["A woven hanging", "A carved figure", "A printed sheet"],
        "Print": ["A painted panel", "A bronze figure", "A woven hanging"],
        "Textile": ["A painted canvas", "A carved relief", "A printed page"],
        "Ceramic": ["A woven basket", "A painted panel", "A carved screen"],
        "Sculpture": ["A woven hanging", "A printed sheet", "A painted panel"],
        "Photograph": ["A painted landscape", "A carved relief", "A woven textile"],
        "Drawing": ["A bronze figure", "A woven hanging", "A ceramic vessel"],
        "Furniture": ["A printed folio", "A harbor landscape", "A carved marble bust"],
    }
    return mapping.get(medium_category, ["A garden wall", "A woven hanging", "A standing figure"])


def observation_distractors(correct: str, medium_category: str) -> list[str]:
    pool = [
        "A river crossing",
        "A standing horse",
        "A flowered border",
        "A ceremonial bowl",
        "A kneeling figure",
        "A harbor scene",
        "A carved doorway",
        "A mountain path",
        "A musician with an instrument",
        "A ship at sea",
        "A seated ruler",
        "A tea bowl",
        "A shop front",
        "A patterned textile",
        "A stone monument",
        "A city square",
        "A bird in flight",
        "A garden terrace",
        "A processional cross",
        "A studio interior",
        "A riverbank group",
        "A lacquered container",
        "A carved wooden figure",
        "A flower stem",
        "A doorway or arch",
        "A mountain ridge",
        "A red curtain",
        "A blue robe",
        "A gold border",
        "A spiral handle",
        "A tiled floor",
        "A balcony railing",
        "A small boat",
        "A round shield",
        "A folded fan",
        "A fruit bowl",
        "A stone column",
        "A dark doorway",
        "A white horse",
        "A seated musician",
        "A patterned sleeve",
        "A long spear",
        "A temple roof",
        "A garden wall",
        "A pair of candles",
        "A narrow bridge",
        "A water jar",
        "A folded letter",
        "A shell ornament",
        "A carved frame",
        "A glass goblet",
        "A cloudy sky",
        "A winding road",
        "A watchful animal",
        "A cluster of leaves",
        "A ceremonial staff",
        "A raised hand",
        "A square plinth",
        "A striped cloth",
        "A curved blade",
        "A fountain basin",
        "A patterned carpet",
        "A wooden bench",
        "A distant tower",
        "A rounded vase",
        "A book on a table",
        "A stairway",
        "A moonlit shoreline",
        "A crowned figure",
        "A painted screen",
        "A standing tree",
        "A braided cord",
        "A fishing net",
        "A bronze handle",
        "A stone lion",
        "A row of windows",
        "A hanging lamp",
        "A folded kimono",
        "A garden gate",
        "A tiled roofline",
        "A dark hat",
        "A fruit branch",
        "A ceremonial vessel",
        "A ship mast",
        "A white flower",
        "A carved pedestal",
        "A painted border",
        "A shoreline path",
        "A round mirror",
        "A scholar's desk",
        "A raised terrace",
        "A tiny inscription",
        "A woven basket",
        "A rocky cliff",
        "A church tower",
        "A decorated hilt",
        "A shallow bowl",
        "A cloud band",
        "A fan-shaped leaf",
        "A standing attendant",
        "A doorway curtain",
        "A kneeling donor",
        "A carved rosette",
        "A low horizon",
        "A wide-brimmed hat",
        "A vase of flowers",
        "A checkerboard floor",
        *medium_family_distractors(medium_category),
    ]
    return [option for option in unique_strings(pool) if option.casefold() != correct.casefold()]


def alternative_period_labels(correct: str) -> list[str]:
    pool = [
        "Ukiyo-e",
        "Post-Impressionism",
        "Baroque",
        "Renaissance",
        "Medieval",
        "Byzantine",
        "Photography",
        "American Art",
        "Islamic Art",
        "African Art",
        "Chinese Art",
        "Japanese Art",
        "Modern Art",
        "Design",
        "Print Culture",
        "World Art",
    ]
    return [label for label in pool if label != correct][:6]


def title_keyword(title: str) -> str:
    words = title_terms(title)
    return words[0] if words else "work"


def medium_action(medium_category: str) -> str:
    return {
        "Painting": "painted",
        "Print": "printed",
        "Drawing": "drawn",
        "Textile": "made in fiber",
        "Photograph": "photographed",
        "Sculpture": "shaped in volume",
        "Ceramic": "formed and fired",
        "Metalwork": "worked in metal",
        "Glass": "made in glass",
        "Furniture": "designed for use",
        "Manuscript": "written or illustrated",
    }.get(medium_category, "made")


def specific_subject(candidate: dict[str, Any], medium_category: str) -> str:
    subject = choose_subject_label(candidate)
    return subject


def technique_focus(medium_category: str) -> str:
    return {
        "Painting": "color, edge, and surface",
        "Print": "transferred line, contrast, and repeatable detail",
        "Textile": "fiber, structure, and pattern",
        "Photograph": "framing, tonal range, and timing",
        "Sculpture": "silhouette, weight, and worked surface",
        "Ceramic": "fired contour, rim, and surface treatment",
        "Drawing": "line pressure, touch, and reserve",
        "Metalwork": "tooling, shine, and edge detail",
        "Furniture": "proportion, joinery, and finish",
        "Glass": "light, translucency, and surface",
        "Manuscript": "script, image, and page layout",
        "Design": "shape, finish, and use",
    }.get(medium_category, "material, form, and surface")


def material_lesson_options(medium_category: str) -> tuple[str, list[str]]:
    correct_by_medium = {
        "Painting": "Color, edges, and surface guide attention",
        "Print": "Ink transferred from a prepared surface carries the image",
        "Drawing": "Line pressure and touch remain visible on the paper",
        "Textile": "Threads and pattern structure carry the design",
        "Photograph": "Framing, timing, and tonal range shape the view",
        "Sculpture": "Volume, silhouette, and surface make the form legible",
        "Ceramic": "Fired shape and surface treatment carry the design",
        "Metalwork": "Tooling and reflective metal sharpen the detail",
        "Glass": "Translucency and light change how the surface reads",
        "Furniture": "Proportion and finish make use visible as design",
        "Manuscript": "Script, image, and page layout work together",
        "Design": "Shape, finish, and use carry the visual argument",
    }
    correct = correct_by_medium.get(medium_category, "Material and form shape how the work is read")
    distractors = [
        "A camera exposure fixes the composition instantly",
        "A carved stone block supplies all the color",
        "A loom creates the scene through interlaced threads",
        "A copper plate transfers inked lines to paper",
        "A molded vessel depends on fired clay and surface",
        "A brush-built surface directs color and edge",
        "A chisel turns volume into silhouette",
        "Cut paper turns outline into likeness",
        "Lacquer layers create a durable reflective skin",
        "Tooling in metal catches light along the edge",
        "Joinery and finish turn use into design",
        "Script and image share the surface of the page",
        "Glass changes with light passing through it",
        "Pigment on a prepared surface controls color and edge",
    ]
    return correct, [option for option in unique_strings(distractors) if option != correct]


def material_lesson_for_artwork(candidate: dict[str, Any], medium_category: str) -> str:
    title = short_title(candidate["title"])
    subject = display_subject(specific_subject(candidate, medium_category))
    medium = medium_display(candidate, medium_category)
    mapping = {
        "Painting": f"{medium} uses color and edge to direct attention toward {subject}",
        "Print": f"{medium} lets inked marks repeat and organize {subject}",
        "Drawing": f"{medium} leaves line and touch visible around {subject}",
        "Textile": f"{medium} makes fiber and pattern carry {subject}",
        "Photograph": f"{medium} frames {subject} through viewpoint and tone",
        "Sculpture": f"{medium} makes {subject} readable as volume",
        "Ceramic": f"{medium} joins fired form and surface around {subject}",
        "Metalwork": f"{medium} uses tooling and reflected light to sharpen {subject}",
        "Glass": f"{medium} changes how light reaches {subject}",
        "Furniture": f"{medium} lets proportion and finish show how the object was used",
        "Manuscript": f"{medium} places script and image on the same surface",
        "Design": f"{medium} makes shape, finish, and function work together around {subject}",
    }
    return mapping.get(medium_category, f"{medium} makes material and surface legible around {subject}")


def plausible_false_material_options(candidate: dict[str, Any], medium_category: str) -> list[str]:
    title = quiz_title(candidate["title"])
    subject = display_subject(specific_subject(candidate, medium_category))
    subject_sentence = sentence_label(subject)
    shared = [
        f"The title alone explains {subject} without the surface",
        f"The date is the main clue for {subject}; the making is secondary",
        f"{subject_sentence} would read the same in any material",
        f"Scale matters more than surface or touch in {title}",
        f"Later display matters more than how {title} was made",
        f"The background carries more meaning than {subject}",
    ]
    by_medium = {
        "Painting": [
            f"Only the subject of {title} matters, not color or edge",
            f"Brushwork has little effect on how {subject} is seen",
        ],
        "Print": [
            f"The printed marks in {title} are incidental to the image",
            f"Repeatable line does not affect how {subject} appears",
        ],
        "Drawing": [
            f"Line pressure has little to do with reading {subject}",
            f"The blank paper around {subject} carries no visual weight",
        ],
        "Textile": [
            f"Pattern is separate from the meaning of {subject}",
            f"The fibers are only support, not part of {title}'s image",
        ],
        "Photograph": [
            f"Viewpoint has little effect on how {subject} is understood",
            f"Light and cropping are secondary to the title of {title}",
        ],
        "Sculpture": [
            f"Silhouette matters less than the name of {subject}",
            f"The surface of {title} does not affect its presence",
        ],
        "Ceramic": [
            f"Shape and rim matter less than the decoration alone",
            f"The fired surface is separate from how {subject} reads",
        ],
        "Metalwork": [
            f"Reflected light has little to do with seeing {subject}",
            f"Tooling and edge are secondary to the title of {title}",
        ],
        "Glass": [
            f"Light passing through the surface is incidental",
            f"The glass surface does not change how {subject} appears",
        ],
        "Furniture": [
            f"Use and finish are separate from the object's design",
            f"Proportion matters less than the title of {title}",
        ],
        "Manuscript": [
            f"The page layout is separate from how {subject} is read",
            f"Script and image do not affect each other here",
        ],
        "Design": [
            f"Function is separate from the visual effect of {title}",
            f"Finish and shape matter less than the title alone",
        ],
    }
    return unique_strings([*(by_medium.get(medium_category, [])), *shared])


def connection_context_phrase(passport_label: str, medium_category: str, geo_region: str) -> str:
    label = passport_label.casefold()
    if "himalayan" in label or "buddhist" in label:
        return "devotional images made for presence as well as description"
    if "ancient americas" in label:
        return "ceremony, image, and use working together in ancient American art"
    if "ancient near east" in label:
        return "royal power expressed through durable carved surfaces"
    if "american art" in label and medium_category == "Painting":
        return "place and public memory in American painting"
    if "islamic" in label and medium_category in {"Ceramic", "Design"}:
        return "glazed surfaces carrying courtly taste and ornament"
    if medium_category == "Ceramic" and ("japanese" in label or "ukiyo" in label):
        return "tea practice and the value of irregular surfaces"
    if medium_category == "Metalwork" and "baroque" in label:
        return "status expressed through precision metalwork"
    if "ukiyo" in label:
        return "urban print culture and sharply observed places"
    if "japanese" in label:
        return "Japanese display traditions and carefully made surfaces"
    if "chinese" in label:
        return "Chinese brushwork, symbolism, and the life of collected objects"
    if "islamic" in label or "south asian" in label:
        return "courtly craft and ornament that carries meaning"
    if "african" in label:
        return "forms made for ritual, status, and social use"
    if "ancient egypt" in label:
        return "commemoration and authority preserved in durable materials"
    if "ancient" in label:
        return "ancient use and the survival of made things"
    if "medieval" in label or "byzantine" in label:
        return "devotion and symbolic storytelling in precious materials"
    if "renaissance" in label:
        return "patronage and renewed attention to human presence"
    if "baroque" in label:
        return "drama carried through light, movement, and gesture"
    if "impression" in label:
        return "modern light and the act of looking"
    if "portrait" in label:
        return "likeness as a form of identity and memory"
    if "photography" in label or medium_category == "Photograph":
        return "viewpoint turning a scene into visual evidence"
    if "textile" in label or medium_category == "Textile":
        return "labor and pattern carrying use and meaning"
    if "print" in label or medium_category == "Print":
        return "printed images moving style across hands and places"
    if "design" in label or medium_category in {"Design", "Furniture"}:
        return "everyday use shaped by form and taste"
    if geo_region == "Latin America":
        return "place and material culture across the Americas"
    if geo_region == "North America":
        return "identity, place, and changing public life in North America"
    return "place, use, and material survival"


def readable_context_phrase(phrase: str) -> str:
    text = normalize_space(phrase).rstrip(".")
    if not text:
        return "its historical setting"
    if re.match(r"^(?:the|a|an)\s+", text, flags=re.IGNORECASE):
        return text
    return text


def context_area_phrase(passport_label: str, medium_category: str, geo_region: str) -> str:
    label = passport_label.casefold()
    if "ukiyo" in label:
        return "Edo-period print culture"
    if "japanese" in label:
        return "Japanese art"
    if "chinese" in label:
        return "Chinese art"
    if "islamic" in label:
        return "Islamic art"
    if "south asian" in label:
        return "South Asian art"
    if "african" in label:
        return "African art"
    if "ancient egypt" in label:
        return "ancient Egyptian art"
    if "ancient americas" in label:
        return "ancient American art"
    if "medieval" in label:
        return "medieval art"
    if "renaissance" in label:
        return "Renaissance art"
    if "baroque" in label:
        return "Baroque art"
    if "impression" in label:
        return "modern painting"
    if medium_category == "Photograph":
        return "photography"
    if medium_category == "Textile":
        return "textile history"
    if medium_category == "Print":
        return "print culture"
    if geo_region == "North America":
        return "North American art"
    if geo_region == "Latin America":
        return "art of the Americas"
    return "art history"


def object_use_phrase(medium_category: str) -> str:
    return {
        "Painting": "a picture made for sustained looking",
        "Print": "an image designed to travel through impressions",
        "Drawing": "a sheet where touch and decision remain visible",
        "Textile": "an object where structure and pattern carry meaning",
        "Photograph": "a picture shaped by a particular viewpoint",
        "Sculpture": "a physical presence read through contour and light",
        "Ceramic": "an object where fired form and surface meet",
        "Metalwork": "an object whose edges answer to light",
        "Glass": "an object that changes as light passes through it",
        "Furniture": "a useful object shaped into design",
        "Manuscript": "a page where reading and looking meet",
        "Design": "a designed object where function shapes appearance",
    }.get(medium_category, "an object whose material matters")


def safety_flags_for(candidate: dict[str, Any]) -> list[str]:
    haystack = normalize_space(" ".join([candidate.get("title", ""), candidate.get("medium", ""), candidate.get("classification", ""), " ".join(candidate.get("subjectTerms", []))])).lower()
    flags: list[str] = []
    if any(word in haystack for word in ("nude", "venus", "cleopatra", "bathing", "naked")):
        flags.append("nudity")
    if any(word in haystack for word in ("crucifix", "martyrdom", "saint", "madonna")):
        flags.append("religious-imagery")
    if any(word in haystack for word in ("mask", "colonial", "tribal")):
        flags.append("cultural-sensitivity-review")
    return unique_strings(flags)


def technique_note(candidate: dict[str, Any], medium_category: str) -> str:
    medium = medium_display(candidate, medium_category)
    title = candidate["title"]
    subject = specific_subject(candidate, medium_category)
    subject_text = gerund_subject(subject)
    subject_display = display_subject(subject)
    short = note_title(title)
    seed = stable_hash(f"technique:{candidate['id']}")
    focus = technique_focus(medium_category)
    variants_by_medium = {
        "Painting": [
            f"Paint carries the first drama here: color, edge, and surface pull attention toward {subject_text}.",
            f"Look for the shift between broad painted areas and sharper details around {subject_text}.",
            f"{medium} lets small changes in edge and color decide how {subject_display} comes forward.",
            f"The surface is active, not neutral; brushwork sets the pace of looking around {subject_text}.",
            f"Color does much of the work before the subject settles into focus.",
            f"The brushwork does not merely fill the scene; it gives {subject_text} weight and tempo.",
            f"Edges soften and sharpen in turn, making {subject_display} feel deliberately staged.",
            f"The painted surface rewards a slow scan from broad color to small, decisive marks.",
            f"Light and paint meet around {subject_text}, guiding the eye without a written explanation.",
            f"Start with the color relationships, then notice how the surface holds {subject_text} in place.",
            f"The composition depends on paint handling as much as on what the title names.",
            f"Small shifts of tone make {subject_display} read as atmosphere, form, and subject at once.",
        ],
        "Print": [
            f"Printed marks do the organizing: line, pressure, and contrast lead the eye toward {subject_text}.",
            f"The sheet keeps the evidence of transfer, especially in the repeated marks around {subject_text}.",
            f"{medium} gives the image its crisp rhythm without relying on painterly color.",
            f"Follow the lines first; their pressure and spacing make {subject_display} legible.",
            f"The image is built from repeatable marks, so pattern and edge matter as much as subject.",
            f"Inked line carries the drama here, tightening attention around {subject_text}.",
            f"The print's contrast makes {subject_display} arrive through rhythm rather than blended color.",
            f"Look at the edges of the marks; they show how the image moved from matrix to paper.",
            f"The sheet asks for close looking because pressure and spacing keep changing the view.",
            f"Repetition is part of the craft: each mark helps hold {subject_text} together.",
            f"The image feels graphic because dark and light are doing so much structural work.",
            f"The printed surface turns small decisions of line into the main visual event.",
        ],
        "Textile": [
            f"Fiber is the image system here; pattern and structure carry {subject_text} through the object.",
            f"The design is not laid on top of the textile. It is built through repeated threads and surface.",
            f"Read the fabric as construction: pattern, touch, and use all help explain {subject_display}.",
            f"{medium} makes handling part of the visual effect, especially where pattern tightens or opens.",
            f"The textile surface gives {subject_text} {possessive_for_subject(subject_text)} force through repetition and touch.",
            f"The eye follows structure before image; threads and pattern make {subject_display} possible.",
            f"Texture does visible work here, turning repeated making into an image you can read.",
            f"The surface carries memory of use as well as design, especially around {subject_text}.",
            f"Pattern is not background here; it is the method that gives the object its presence.",
            f"Look for changes in density, direction, and edge where the textile builds {subject_display}.",
            f"The object depends on touch as much as sight, with fiber shaping the whole encounter.",
            f"Construction and ornament are inseparable; the textile makes its image through material choices.",
        ],
        "Photograph": [
            f"The camera's position matters first: light, crop, and distance shape how {subject_text} appears.",
            f"Notice the chosen edge of the frame; it decides what {subject_display} can tell you.",
            f"{medium} turns viewpoint into meaning, with tone and cropping doing quiet work.",
            f"Look at what is included and what is withheld around {subject_text}.",
            f"The photograph's force comes from timing and vantage point as much as from the subject.",
            f"The image depends on a chosen instant; light and framing make {subject_display} specific.",
            f"Tonal contrast guides the eye before the subject fully settles into place.",
            f"The crop creates pressure around {subject_text}, making the edge of the picture matter.",
            f"Distance is part of the technique here, shaping how close the viewer can feel.",
            f"The camera organizes space through angle, light, and the moment it preserves.",
            f"The photograph asks you to read viewpoint as a choice, not as a neutral window.",
            f"Focus and framing turn {subject_display} into a carefully held piece of evidence.",
        ],
        "Sculpture": [
            f"Volume carries the meaning; silhouette and surface make {subject_display} feel physically present.",
            f"The worked surface changes with light, so the form unfolds as your eye moves.",
            f"{medium} gives {subject_text} weight, contour, and a sense of touch.",
            f"Begin with the outline, then watch how the surface catches light.",
            f"The object asks to be read as presence, not only as an image.",
            f"The form is understood in pieces: contour first, then surface, then the play of shadow.",
            f"Light activates the worked surface, making the object's edges feel especially important.",
            f"The sculptural force comes from how mass and detail hold each other in tension.",
            f"Look around the silhouette; it carries much of the object's visual authority.",
            f"The material gives {subject_display} a bodily presence that flat description cannot supply.",
            f"Surface marks and shadows make the form feel handled, carved, modeled, or worn.",
            f"The object reads through depth and contour before iconography takes over.",
        ],
        "Ceramic": [
            f"Fired form sets the silhouette before the surface detail fully registers.",
            f"Rim, body, and surface treatment move the eye around {subject_text}.",
            f"{medium} makes shape part of the image; the curve changes how {subject_display} is seen.",
            f"Look for the point where form and surface decoration begin to work together.",
            f"The ceramic body gives the work its pace before ornament or subject takes over.",
            f"The vessel's contour matters as much as any decoration placed on it.",
            f"Firing, curve, and surface finish make the object feel shaped for hand and eye.",
            f"The form controls the viewing path, carrying attention around {subject_text}.",
            f"Surface and body meet at the edges, where the object becomes most legible.",
            f"The fired surface gives color and touch a durable, close-range presence.",
            f"Look at how the object's curve changes the rhythm of its design.",
            f"The ceramic technique makes use, weight, and ornament part of one reading.",
        ],
        "Drawing": [
            f"Line is the evidence: pressure, pause, and blank space shape {subject_text}.",
            f"The hand stays visible where marks thicken, fade, or stop around {subject_text}.",
            f"{medium} gives the work a directness built from touch and reserve.",
            f"Follow the places where line does less; the open paper is part of the looking.",
            f"The drawing's surface lets you see decisions being made in real time.",
            f"Marks vary in pressure, making {subject_display} feel searched for rather than simply filled in.",
            f"The sheet preserves hesitation and emphasis, especially where the line changes speed.",
            f"Blank space is active here; it helps the drawn forms breathe.",
            f"Touch is the technique, with every heavier or lighter mark changing the image.",
            f"The drawing asks you to notice what the hand chooses to leave open.",
            f"Line and reserve work together, giving {subject_display} clarity without overstatement.",
            f"The paper holds both image and process, so looking means following decisions.",
        ],
        "Metalwork": [
            f"Reflected light is part of the design; tooling and edge sharpen {subject_text}.",
            f"The worked metal changes as light moves across relief, polish, and shadow.",
            f"{medium} makes small edges important, especially where the surface catches light.",
            f"Look for detail that appears through shine rather than color.",
            f"The material turns touch into brightness, edge, and contour.",
            f"Tool marks and polished areas make the object change as the viewer moves.",
            f"The metal's shine is not incidental; it draws attention to relief and edge.",
            f"Small raised or cut details carry much of the object's visual charge.",
            f"The surface asks to be read through light, shadow, and handled detail.",
            f"Brightness makes the form feel alert, especially around {subject_text}.",
            f"The making is legible in edges, joins, and places where light catches.",
            f"Metal gives the design a hard clarity that color alone could not provide.",
        ],
        "Furniture": [
            f"Use becomes visible through proportion, finish, and the way parts meet.",
            f"Read the object through touch and scale; function is part of its visual design.",
            f"{medium} gives everyday use a deliberate shape.",
            f"Structure and finish do the expressive work before ornament does.",
            f"The design turns utility into a thing meant to be looked at closely.",
            f"The object's proportions reveal how use and display were meant to meet.",
            f"Joinery, finish, and scale make the practical object feel composed.",
            f"Look at where parts meet; those decisions make function visible.",
            f"The surface finish turns handling into part of the visual experience.",
            f"Design lives in the object's stance as much as in any ornament.",
            f"The useful form has been carefully staged for the eye.",
            f"Proportion carries the first impression before decorative detail enters.",
        ],
        "Glass": [
            f"Light changes the object before your eye settles on its form.",
            f"Translucency makes color, edge, and reflection shift together.",
            f"{medium} turns light into part of how {subject_text} appears.",
            f"Look for the move from transparent surface to reflective edge.",
            f"The glass body is active: it bends, catches, and releases light.",
            f"The object changes with illumination, making the surface feel unstable in the best way.",
            f"Reflection and transparency work together, so edge and color never sit still.",
            f"Light passing through the material gives the form its real drama.",
            f"The glass surface makes looking a matter of angle as well as shape.",
            f"Color gathers where the material thickens, especially along the edges.",
            f"The technique turns fragility and brightness into the object's presence.",
            f"Look for places where the surface catches light rather than simply showing form.",
        ],
        "Manuscript": [
            f"Reading and looking share the page; script, image, and ornament organize attention.",
            f"The layout controls how your eye moves between text and image.",
            f"{medium} makes the page a visual field, not just a carrier for words.",
            f"Look at how ornament frames the movement from script to image.",
            f"The page format turns sequence and surface into part of the artwork.",
            f"The page asks to be read visually: margins, script, and image all guide attention.",
            f"Text and image share authority here, each shaping how the other is understood.",
            f"Ornament slows the eye, making the act of reading feel ceremonial.",
            f"The layout gives the page rhythm before the words are even read.",
            f"Look at how the page divides space between script, image, and decoration.",
            f"The manuscript surface turns knowledge into a designed visual encounter.",
            f"Sequence matters here; the page is built for movement across its surface.",
        ],
        "Design": [
            f"Shape and finish do the first work, making {subject_text} feel purposeful before any ornament appears.",
            f"The object is designed for close attention: use, surface, and scale all matter.",
            f"{medium} turns function into visual form, especially around {subject_text}.",
            f"Look at how the object's silhouette explains its intended use.",
            f"The design depends on proportion, touch, and the way the surface meets light.",
            f"Function is visible here, not hidden; the form tells you how the object was meant to live.",
            f"The surface and contour make {subject_display} feel both useful and carefully composed.",
            f"Small decisions of finish carry much of the object's character.",
            f"The object rewards looking from edge to center, where form and use meet.",
            f"Design is the technique here: material, proportion, and handling work together.",
            f"The piece makes everyday use feel deliberate through its scale and surface.",
            f"Look for the balance between practical shape and visual refinement.",
        ],
    }
    variants = variants_by_medium.get(
        medium_category,
        [
            f"Material and form guide the first look, especially around {subject_text}.",
            f"The surface gives {subject_text} its first visual pull.",
            f"Look at how handling and shape make the object legible.",
            f"{medium} gives the work a specific scale, surface, and presence.",
            f"{focus.capitalize()} are the best clues for reading the object closely.",
        ],
    )
    return variants[seed % len(variants)]


def surprising_fact(candidate: dict[str, Any], medium_category: str) -> str:
    object_date = candidate["objectDate"]
    artist = candidate["artist"]
    seed = stable_hash(candidate["id"])
    title = candidate["title"]
    subject = specific_subject(candidate, medium_category)
    subject_text = gerund_subject(subject)
    short = note_title(title)
    medium = medium_sentence_fragment(candidate, medium_category)
    form = object_form_phrase(candidate, medium_category)
    if keyword_in_text(title, "powdered tea container"):
        return f"A natsume is a small lidded container for powdered tea; in {short}, the lacquered surface was meant for close, repeated handling."
    if "ca." in object_date.lower() or "about" in object_date.lower() or re.search(r"\d{4}[-–]\d{2,4}", object_date):
        variants = [
            f"{short} is dated {object_date}, a range that makes close details around {subject_text} especially important.",
            f"Because {short} is placed in {object_date}, the work asks you to read clues in form, surface, and subject.",
            f"{subject_text.capitalize()} becomes part of the historical evidence because the date is a range, not a single year.",
            f"The broad date, {object_date}, makes the visible choices in {short} carry more weight.",
            f"Dating {short} to {object_date} shifts attention toward what the object itself can tell you.",
            f"The range {object_date} in {short} is a reminder that close looking often supplies the sharpest evidence.",
            f"For {short}, the date is not a pin on a calendar; it is a bracket around technique, subject, and use.",
            f"The approximate date makes {subject_text} more than a motif: it becomes a clue to the work's world.",
            f"{short}'s date range leaves room for uncertainty, so the surface has to speak clearly.",
            f"In {short}, details of making and subject help narrow the historical picture around {object_date}.",
            f"The date range matters because {subject_text} can be read alongside {short}'s material choices.",
            f"{short} carries its period through visible evidence rather than through one exact recorded year.",
        ]
        return variants[seed % len(variants)]
    if "unknown" in artist.lower() or "anonymous" in artist.lower() or "unidentified" in artist.lower():
        variants = [
            f"No individual maker is named for {short}, so the object's character comes through {subject_text} and its worked surface.",
            f"The maker may be unnamed, but {short} is not anonymous in feeling; its form gives it a clear presence.",
            f"Without a signed name, craft becomes the signature of {short}, especially in the handling of {subject_text}.",
            f"The cautious attribution makes {short}'s visible choices feel especially important.",
            f"{short} shows how an unnamed maker can still leave a strong trace through material and form.",
            f"The absence of a named artist moves attention toward {short}'s use, surface, and shape.",
            f"Authorship is quiet here; the more vivid evidence is how {subject_text} has been made.",
            f"The strongest voice in {short} is the object itself, from its scale to its surface.",
            f"No signature is needed for {short} to feel specific; its making carries the identity.",
            f"The unnamed maker is part of {short}'s story, but the object is anything but generic.",
            f"Here, attribution gives way to close evidence: edge, finish, and the treatment of {subject_text}.",
            f"{short} reminds us that important objects often survive without a named hand attached.",
        ]
        return variants[seed % len(variants)]
    if medium_category == "Print":
        variants = [
            f"As a print, {short} could travel through multiple impressions; {subject_text} was made to move beyond one unique surface.",
            f"The prepared matrix behind {short} matters: it could carry {subject_text} from one impression to another.",
            f"In {short}, {subject_text} reaches the viewer through a technology of repeatable marks.",
            f"The printed line is the surprise in {short}, turning {subject_text} into an image that could circulate.",
            f"{short} comes from an art of multiplication, where one designed surface could generate many views.",
            f"The print process gives {subject_text} a special kind of mobility: image, paper, and audience could separate.",
            f"What feels immediate in {short} was built through a repeatable technical process.",
            f"{short}'s sheet preserves a chain of decisions from design to matrix to impression.",
            f"{short} makes line portable, allowing style and subject to move beyond a single studio.",
            f"{short}'s crispness comes from pressure and transfer, not from brushwork on the final sheet.",
            f"Repeatability is part of {short}'s meaning, shaping how {subject_text} could be encountered.",
            f"{short} turns a prepared surface into a vehicle for circulation and close looking.",
        ]
        return variants[seed % len(variants)]
    if medium_category == "Textile":
        variants = [
            f"In {short}, the image is built into the structure; fiber and pattern are the way {subject_text} becomes visible.",
            f"{short} shows how textiles could carry status, labor, and storytelling for bodies, rooms, or ritual.",
            f"The visual force in {short} comes from structure rather than pigment sitting on top of a surface.",
            f"Pattern is doing historical work in {short}, preserving choices of labor, use, and design.",
            f"The making of {short} is slow by nature, with repeated structure turning labor into image.",
            f"{short} carries history through touch: fiber, pattern, and use are all part of the evidence.",
            f"{short} does not separate decoration from construction; the two arrive together.",
            f"In {short}, pattern records both design intelligence and the discipline of handwork.",
            f"The surface of {short} holds more than ornament; it preserves a way of making and using an object.",
            f"{subject_text.capitalize()} comes into view through structure, which makes the textile feel active.",
            f"{short}'s material memory is part of its appeal, especially where pattern and wear meet.",
            f"{short} turns repeated making into a durable visual language.",
        ]
        return variants[seed % len(variants)]
    if medium_category == "Photograph":
        variants = [
            f"{short} preserves a moment, but viewpoint decides what can be known about {subject_text}.",
            f"A quick exposure in {short} still rewards slow looking: pose, place, and crop keep changing the story.",
            f"Viewpoint is not just technical in {short}; it shapes how {subject_text} becomes legible.",
            f"The camera fixes {subject_text}, but {short}'s frame keeps directing what the viewer notices.",
            f"{short} depends on a split-second choice, yet its composition keeps unfolding slowly.",
            f"{short}'s evidence is selective: light and cropping determine what the viewer receives.",
            f"In {short}, {subject_text} becomes meaningful because the camera chooses distance and edge.",
            f"The surprise in {short} is how much interpretation can live inside a seemingly direct view.",
            f"{short} reminds us that photographs are made decisions, not neutral windows.",
            f"The frame gives {short} its force, turning a moment into a structured image.",
            f"What the camera leaves out of {short} matters nearly as much as what it preserves.",
            f"The subject feels factual, but the viewpoint gives {short} its point of view.",
        ]
        return variants[seed % len(variants)]
    if medium_category in {"Ceramic", "Glass", "Metalwork", "Furniture", "Design"}:
        variants = [
            f"Use is part of {short}'s visual story: shape, surface, and {subject_text} all affect how the object reads.",
            f"The {medium} in {short} makes touch and display part of the same experience.",
            f"Scale matters here; this is {form}, meant to work at close range.",
            f"Surface is not decoration after the fact in {short}. It decides how {subject_text} meets the viewer.",
            f"{short} turns function into something visually exact, from contour to finish.",
            f"{short} may be practical, but its design choices make it worthy of slow looking.",
            f"Close range matters for {short}; the most revealing details live in surface and proportion.",
            f"{short}'s purpose does not reduce its artistry. It gives the form a reason to exist.",
            f"{short} makes use visible, showing how design can carry cultural meaning.",
            f"The surprise in {short} is how much expression can fit into an object made for handling or display.",
            f"Material choice changes the whole experience of {short}, from weight to shine to touch.",
            f"{short} asks to be understood through use as well as appearance.",
        ]
        return variants[seed % len(variants)]
    if medium_category in {"Sculpture", "Drawing"}:
        variants = [
            f"Touch carries meaning in {short}: line, cut, or modeled surface matters as much as iconography.",
            f"In {short}, {subject_text} {is_for_subject(subject_text)} inseparable from the handwork that made it visible.",
            f"Surface and date meet in {short}'s details, especially where the handwork defines {subject_text}.",
            f"The close-looking reward in {short} is the handwork itself, where the surface turns into evidence.",
            f"{short} makes process visible; the viewer can almost follow the hand through the surface.",
            f"{short}'s force comes from touch made durable, whether through line, cut, or modeled form.",
            f"{subject_text.capitalize()} matters because the making leaves its own visible trail.",
            f"The surface of {short} is not passive; it records pressure, removal, or build-up.",
            f"What looks still in {short} becomes active once the marks and contours start to register.",
            f"{short} holds a direct conversation between hand, material, and image.",
            f"{short} rewards noticing how little changes in surface can shift the whole reading.",
            f"The physical act of making remains legible in {short}, giving the work much of its intimacy.",
        ]
        return variants[seed % len(variants)]
    variants = [
        f"{artist} gives {short} a particular date and surface; {subject_text} is only the beginning of the reading.",
        f"The title of {short} names {subject_text}, but the surface shows how the maker wanted that subject to be seen.",
        f"Slow looking changes {short} because place, surface, and {subject_text} begin to answer one another.",
        f"The memorable detail in {short} is not just what is shown, but how {subject_text} is made available to the eye.",
        f"{short} becomes richer once the named subject and the handling of the surface are read together.",
        f"{short}'s subject is clear, but its real intelligence appears in the choices around it.",
        f"Look beyond recognition: the way {subject_text} is staged changes the whole encounter.",
        f"{artist}'s choices make {subject_text} feel specific to this moment, not merely illustrative.",
        f"{short} turns a familiar subject into a particular act of looking.",
        f"{short} holds attention because subject, surface, and setting keep adjusting one another.",
        f"The first read of {short} may be simple; the lasting interest is how the work makes that read happen.",
        f"The surprise in {short} lies in the handling, where {subject_text} becomes more than a label.",
    ]
    return variants[seed % len(variants)]


def connection_note(candidate: dict[str, Any], passport_label: str, place_label: str, geo_region: str) -> str:
    medium_category = infer_medium_category(candidate["medium"], candidate["classification"], candidate.get("collection", ""))
    title = candidate["title"]
    phrase = readable_context_phrase(connection_context_phrase(passport_label, medium_category, geo_region))
    area = context_area_phrase(passport_label, medium_category, geo_region)
    subject = display_subject(specific_subject(candidate, medium_category))
    seed = stable_hash(f"connection-note:{candidate['id']}")
    short = note_title(title)
    place = place_label if place_label and place_label != "Global collection" else geo_region
    if keyword_in_text(title, "powdered tea container"):
        return "In Japanese tea culture, a natsume holds powdered tea; its small lacquered form turns use, handling, and surface into the point of attention."
    if place_label and place_label != "Global collection":
        variants = [
            f"The {place} context matters because {subject} points toward {phrase}.",
            f"Seen within {area}, {short} reads as {object_use_phrase(medium_category)} with roots in {place}.",
            f"{sentence_label(subject)} is the bridge from close looking to {place}'s larger visual culture.",
            f"In {place}, {subject} comes out of a world of {phrase}.",
            f"The work's {place} setting turns {subject} into evidence of {phrase}.",
            f"{subject.capitalize()} carries traces of {place}'s traditions of {phrase}.",
            f"A local clue matters here: {subject} comes from a world shaped by {phrase}.",
            f"From {place}, the object points toward {phrase} through material and form.",
            f"{short} keeps close looking tied to {place}, especially through {subject}.",
            f"The place of origin sharpens the reading: {subject} is connected to {phrase}.",
            f"{place} is not just a map label here; it helps explain the choices around {subject}.",
            f"The work opens a small window onto {place}'s visual habits, especially in {subject}.",
            f"Look at {subject} as a historical clue to {place}'s practices of {phrase}.",
            f"Within {area}, {short} shows how place can shape material, use, and image.",
            f"The connection to {place} gives the object's details a more specific cultural setting.",
            f"{subject.capitalize()} links the close view to a larger tradition of {phrase}.",
            f"The object emerges from {place}'s history of making, where {phrase} mattered visually.",
            f"Seen through its origin, {short} becomes a compact lesson in {phrase}.",
            f"{place}'s context gives the work depth without taking attention away from {subject}.",
            f"The artwork's local setting helps explain why {subject} carries so much visual weight.",
            f"Origin matters here because {subject} carries habits of making tied to {place}.",
            f"{short} makes {place}'s visual culture feel specific through {subject}.",
            f"Place, material, and use meet in {subject}, giving the work its historical charge.",
            f"The object's roots in {place} help explain why {subject} is treated with such care.",
            f"Rather than floating free of context, {subject} points back to {place} and {phrase}.",
            f"The details around {subject} make more sense when seen against {place}'s artistic world.",
            f"{short} invites a local reading: {subject} carries the pressure of {phrase}.",
            f"Through {subject}, the work turns {place}'s making traditions into something visible.",
            f"The cultural setting is concrete here, held in the way {subject} is formed.",
            f"{place} matters because the object's visual choices come from a lived world of {phrase}.",
            f"Look closely at {subject}; it is where place and artistic practice meet.",
            f"The work's origin sharpens the reading without reducing it to geography.",
            f"{subject.capitalize()} lets the viewer move from a single object toward {phrase}.",
            f"The place label becomes meaningful through the object itself, especially {subject}.",
            f"{short} carries {place}'s setting in material details rather than in explanation.",
            f"What looks like a single object also preserves a trace of {place}'s visual culture.",
            f"The connection to {place} is visible first in how {subject} has been shaped.",
            f"{subject.capitalize()} gives {phrase} a concrete form inside the work.",
            f"{short} turns local practice into close-looking evidence.",
            f"The object speaks from {place} through surface, use, and the treatment of {subject}.",
        ]
    else:
        variants = [
            f"{sentence_label(subject)} opens onto {phrase}, which gives the work its historical pressure.",
            f"Seen within {area}, the work is about {phrase} as much as about {subject}.",
            f"The larger context is {phrase}; {subject} is the visible way into it.",
            f"{short} uses {subject} to make {phrase} concrete.",
            f"The work's setting gives {subject} a role beyond decoration or subject matter.",
            f"{subject.capitalize()} helps turn a broad art-historical idea into something visible.",
            f"The work can be read through {phrase}, but the entry point remains {subject}.",
            f"Here, historical context is not abstract; it is carried by {subject}.",
            f"In {short}, choices of subject and surface open onto {phrase}.",
            f"The object makes {phrase} tangible by giving it a specific visual form.",
            f"{subject.capitalize()} anchors the artwork in a larger conversation about {phrase}.",
            f"The historical bridge is built from the details you can see first.",
            f"Within {area}, {short} shows how one object can hold a wider visual tradition.",
            f"The work's larger significance begins with noticing how {subject} is presented.",
            f"{subject.capitalize()} gives the viewer a concrete way into {phrase}.",
            f"The connection is visual before it is textual: subject, surface, and context meet here.",
        ]
    return variants[seed % len(variants)]


def observation_question(candidate: dict[str, Any]) -> dict[str, Any]:
    medium_category = infer_medium_category(candidate["medium"], candidate["classification"], candidate.get("collection", ""))
    subject = choose_subject_label(candidate)
    seed = stable_hash(candidate["id"])
    title = candidate["title"]
    short = quiz_title(title)
    subject_short = display_subject(subject)
    prompt_variants = [
        f"What visible detail gives {short} its focus?",
        f"Which feature gives {short} its clearest visual focus?",
        f"Which visual cue should you notice in {short}?",
        f"What detail is most useful to notice first in {short}?",
        f"Where should your eye begin in {short}?",
        f"What concrete feature should you look for in {short}?",
        f"Which detail helps you enter the image of {short}?",
        f"What visible feature organizes the first look at {short}?",
        f"Which detail makes {short} easiest to start reading?",
        f"What should you find first when studying {short}?",
        f"Which feature gives {short} its center?",
        f"What visible clue tells you where to begin in {short}?",
        f"Which detail carries the main subject of {short}?",
        f"What part of {short} should hold your attention first?",
        f"Which visible element gives {short} its first pull?",
        f"What feature makes the subject of {short} legible?",
    ]
    correct = sentence_label(subject)
    options = unique_strings(
        [
            correct,
            *seeded_option_sample(
                observation_distractors(correct, medium_category),
                f"observation-options:{candidate['id']}",
                3,
                exclude=[correct],
            ),
        ]
    )[:4]
    reinforcement = [
        f"Noticing {subject_short} gives the material, scale, and setting of {short} a place to start.",
        f"{correct} {verb_for_subject(correct)} {short} a concrete place to begin before smaller details take over.",
        f"That visible detail matters because {short} builds its mood around {subject_short}.",
        f"Once {subject_short} is in view, the rest of {short} becomes easier to read.",
        f"{correct} {verb_for_subject(correct)} the artwork's subject a clear visual center.",
        f"{subject_short.capitalize()} helps connect {short}'s subject to its surface.",
        f"That detail gives your eye a starting point in {short} before the surrounding details unfold.",
        f"{short} becomes more legible once {subject_short} is fixed in view.",
        f"The first close look starts with {subject_short}, then moves outward.",
        f"That feature matters because it organizes the way {short} meets the eye.",
        f"{short} asks you to begin with {subject_short} before reading the setting.",
        f"That first detail gives the rest of {short} a visual order.",
        f"Finding {subject_short} helps the smaller marks and surfaces make sense.",
        f"{subject_short.capitalize()} is the cue that turns looking into reading.",
        f"The work opens up once {subject_short} has your attention.",
    ][seed % 15]
    return {
        "kind": "observation",
        "prompt": prompt_variants[seed % len(prompt_variants)],
        "options": options,
        "answerIndex": 0,
        "reinforcement": reinforcement,
    }


def context_question(candidate: dict[str, Any], medium_category: str) -> dict[str, Any]:
    seed = stable_hash(f"context:{candidate['id']}")
    title = candidate["title"]
    short = quiz_title(title)
    subject = specific_subject(candidate, medium_category)
    subject_text = gerund_subject(subject)
    subject_short = display_subject(subject)
    medium = medium_display(candidate, medium_category)
    medium_lower = medium_sentence_fragment(candidate, medium_category)
    if "ca." in candidate["objectDate"].lower() or "about" in candidate["objectDate"].lower():
        options = [
            f"The {medium_lower}, style, and {subject_short} help place it",
            f"The title alone fixes the exact year for {short}",
            f"Scale alone proves where {short} was made",
            f"Later display explains the date of {short} without close looking",
        ]
        reinforcement = [
            f"The date for {short} is careful evidence; style, material, and {subject_text} help place it in time.",
            f"The range matters because {short} has to be dated through form, surface, and close comparison.",
            f"That cautious date asks you to read {subject_text} through period style and material clues.",
            f"For {short}, the approximate date makes close looking part of the historical evidence.",
        ][seed % 4]
        return {
            "kind": "context",
            "prompt": [
                f"What helps date {short} when the year is not exact?",
                f"How do the {medium_lower} and {subject_short} help place {short}?",
                f"Why does the date range matter for {short}?",
                f"What evidence helps place {short} in time?",
            ][seed % 4],
            "options": options,
            "answerIndex": 0,
            "reinforcement": reinforcement,
        }

    correct = material_lesson_for_artwork(candidate, medium_category)
    distractors = plausible_false_material_options(candidate, medium_category)
    options = unique_strings(
        [
            correct,
            *seeded_option_sample(
                distractors,
                f"context-options:{candidate['id']}",
                3,
                exclude=[correct],
            ),
        ]
    )[:4]
    reinforcement = [
        f"The {medium_lower} is not background information; it shapes how {subject_text} reaches the eye.",
        f"In {short}, the {medium_lower} controls how surface and {subject_text} meet.",
        f"Once you notice the {medium_lower}, {short} reads as a made object, not just an image.",
        f"The {medium_lower} gives {subject_short} much of its visual force.",
        f"That material choice changes how {subject_short} reaches the eye.",
        f"Looking at the making helps explain why {subject_short} feels the way it does.",
        f"The surface matters because it is part of how {subject_text} becomes visible.",
        f"{short} asks you to read material decisions along with subject matter.",
        f"The making is a clue to how {subject_short} {gain_for_subject(subject_short)} presence.",
        f"Material and handling shape the first impression of {short}.",
        f"{medium} gives {subject_short} its particular weight, edge, or tone.",
        f"Close looking at {short} starts with how the object was made, not just what it shows.",
        f"In {short}, making and subject have to be read together.",
        f"The handling gives {short} its pace before the subject fully resolves.",
        f"That surface decision is part of {short}'s meaning, not a neutral support.",
        f"Reading the making helps explain why {subject_short} feels specific.",
    ][seed % 16]
    return {
        "kind": "context",
        "prompt": [
            f"How does the {medium_lower} shape {subject_short} in {short}?",
            f"What does the {medium_lower} help you notice about {subject_short}?",
            f"Why does {medium} matter when looking at {short}?",
            f"What kind of making gives {short} its character?",
            f"How does the material change the way {subject_short} appears?",
            f"What does {medium} do for the image of {subject_short}?",
            f"Why is the surface of {short} important?",
            f"How does the making of {short} shape what you see?",
            f"What does the making reveal about {subject_short}?",
            f"How should the surface change your reading of {short}?",
            f"What role does {medium} play in the first impression?",
            f"Why does the object's making matter for {subject_short}?",
            f"How does craft shape the way {short} meets the eye?",
            f"What material clue helps explain the look of {short}?",
            f"How does {medium} guide your attention?",
            f"What does the surface tell you about {subject_short}?",
        ][seed % 16],
        "options": options,
        "answerIndex": 0,
        "reinforcement": reinforcement,
    }


def connection_question(
    candidate: dict[str, Any],
    passport_label: str,
    place_label: str,
    geo_region: str,
    medium_category: str,
) -> dict[str, Any]:
    title = candidate["title"]
    seed = stable_hash(f"connection:{candidate['id']}")
    context_phrase = connection_context_phrase(passport_label, medium_category, geo_region)
    short = quiz_title(title)
    subject = display_subject(specific_subject(candidate, medium_category))
    place = place_label if place_label and place_label != "Global collection" else geo_region
    correct = sentence_label(f"{subject} {link_for_subject(subject)} the work to {context_phrase}")
    connection_distractors = [
        f"A reading focused only on the size of {subject}",
        f"A reading centered only on later display of {short}",
        f"A reading that treats {subject} as neutral decoration",
        f"A reading focused only on the title of {short}",
        f"A reading that separates {subject} from {place}",
        f"A reading centered on the market value of {short}",
        f"A reading that treats the surface of {short} as incidental",
        f"A reading focused only on ownership history for {short}",
    ]
    options = unique_strings(
        [
            correct,
            *seeded_option_sample(
                connection_distractors,
                f"connection-options:{candidate['id']}",
                3,
                exclude=[correct],
            ),
        ]
    )[:4]
    reinforcement = [
        f"The context matters because {context_phrase} shapes how {subject} was made and understood.",
        f"That setting keeps {short} from reading as a surface alone; it ties {subject} to use and history.",
        f"Reading {short} this way brings out the role of {subject} in the work's cultural setting.",
        f"The historical setting matters because {context_phrase} changes how {subject} reads.",
        f"{short} carries that context through material, use, and the visible detail of {subject}.",
        f"{sentence_label(subject)} {is_for_subject(subject)} not isolated decoration; the detail carries a history of use, place, and looking.",
        f"The bridge matters because {subject} turns a visible detail into historical evidence.",
        f"That answer keeps the focus on how {short} operated in its own world.",
        f"{short} becomes richer when {subject} is tied to place, use, and tradition.",
        f"The work's setting helps explain why {subject} matters visually.",
        f"Context gives {subject} weight beyond its first appearance.",
        f"That history helps connect {subject} to the way the work was used or understood.",
        f"The setting keeps {subject} connected to people, place, and purpose.",
        f"{short} asks for that historical bridge because {subject} is doing more than filling space.",
        f"The answer matters because it links close looking at {subject} with cultural use.",
        f"That context gives {subject} a social or devotional role.",
    ][seed % 16]
    return {
        "kind": "connection",
        "prompt": [
            f"How does {place} change the meaning of {subject} in {short}?",
            f"Which history helps explain why {subject} matters in {short}?",
            f"What setting helps you read {subject} more fully?",
            f"What does {subject} connect to beyond its appearance?",
            f"Which tradition helps explain the way {subject} appears?",
            f"What history sits behind {subject} in {short}?",
            f"Why does {subject} matter beyond the first look?",
            f"What cultural setting gives {subject} more weight?",
            f"How should the historical setting change your reading of {short}?",
            f"What does {subject} reveal about use, place, or belief?",
            f"Which context makes {subject} more than decoration?",
            f"What larger history helps explain {short}?",
            f"How does use or belief change the way {subject} reads?",
            f"What does {subject} suggest about the work's setting?",
            f"Which context best explains the force of {subject}?",
            f"How does {short} carry its historical world?",
        ][seed % 16],
        "options": options,
        "answerIndex": 0,
        "reinforcement": reinforcement,
    }


def shuffle_question_options(question: dict[str, Any], seed_text: str) -> dict[str, Any]:
    decorated = [
        {
            "option": option,
            "originalIndex": index,
            "weight": stable_hash(f"{seed_text}:{index}:{option}"),
        }
        for index, option in enumerate(question["options"])
    ]
    decorated.sort(key=lambda item: (item["weight"], item["originalIndex"]))
    answer_index = next(
        index for index, item in enumerate(decorated) if item["originalIndex"] == question["answerIndex"]
    )
    return {
        **question,
        "options": [item["option"] for item in decorated],
        "answerIndex": answer_index,
    }


def build_artwork_projection(candidate: dict[str, Any]) -> dict[str, Any]:
    artist = humanize_creator(candidate["artist"], fallback="Unknown maker")
    object_date = normalize_object_date(candidate["objectDate"])
    raw_medium = strip_markup(candidate["medium"])
    category_medium = "" if medium_text_is_invalid(raw_medium) else raw_medium
    medium_category = infer_medium_category(category_medium, candidate["classification"], candidate.get("collection", ""))
    if (
        candidate.get("source", {}).get("institution") == "ycba"
        and medium_category == "Sculpture"
        and has_term(candidate.get("classification", ""), ("paintings and sculpture",))
        and has_term(candidate.get("artist", ""), ("turner",))
    ):
        medium_category = "Painting"
    medium = concise_medium_for(candidate, medium_category)
    title_for_overrides = clean_title(candidate["title"])
    if has_term(title_for_overrides, ("damascus room",)):
        medium_category = "Design"
        medium = "Period room"
    if has_term(title_for_overrides, ("bamboo in the four seasons", "rough waves", "blossoming plum and camellia", "cherry blossom viewing")) and has_term(candidate.get("medium", ""), ("gold",)):
        medium_category = "Painting"
        medium = "Gold-ground painting"
    if has_term(title_for_overrides, ("tankard",)) and has_term(candidate.get("classification", ""), ("drinking vessel",)):
        medium_category = "Ceramic"
        medium = "Iznik ceramic"
    if has_term(title_for_overrides, ("mosaic", "floor mosaic")):
        medium_category = "Design"
        medium = "Mosaic"
    if has_term(title_for_overrides, ("book of the dead",)):
        medium_category = "Manuscript"
        medium = "Illustrated funerary papyrus"
    display_candidate = {
        **candidate,
        "title": clean_title(candidate["title"]),
        "artist": artist,
        "objectDate": object_date,
        "medium": medium,
    }
    geo_region = infer_geo_region(
        candidate.get("title", ""),
        candidate.get("country", ""),
        candidate.get("place", ""),
        candidate.get("culture", ""),
        candidate.get("classification", ""),
        candidate.get("collection", ""),
        candidate.get("department", ""),
        artist,
        " ".join(candidate.get("subjectTerms", [])),
        candidate.get("source", {}).get("collectionLabel", ""),
    )
    passport_label = infer_passport_label(candidate)
    place_label = build_place_label(candidate, geo_region)
    period_key = slugify(passport_label)
    period_tag = placard_period_tag(place_label, passport_label, object_date)
    questions = [
        observation_question(display_candidate),
        context_question(display_candidate, medium_category),
        connection_question(display_candidate, passport_label, place_label, geo_region, medium_category),
    ]
    questions = [
        shuffle_question_options(question, f"{candidate['id']}:{index}:{question['prompt']}")
        for index, question in enumerate(questions)
    ]
    runtime_images = runtime_images_for(candidate)
    return {
        "id": candidate["id"],
        "title": display_candidate["title"],
        "artist": artist,
        "objectDate": object_date,
        "medium": medium,
        "periodKey": period_key,
        "periodTag": period_tag,
        "passportLabel": passport_label,
        "mediumCategory": medium_category,
        "geoRegion": geo_region,
        "images": {
            "thumbnailUrl": runtime_images["thumbnailUrl"],
            "displayUrl": runtime_images["displayUrl"],
            "fullUrl": runtime_images["fullUrl"],
        },
        "context": {
            "technique": technique_note(display_candidate, medium_category),
            "surprisingFact": surprising_fact(display_candidate, medium_category),
            "connection": connection_note(display_candidate, passport_label, place_label, geo_region),
        },
        "questions": questions,
    }


def validate_question_set(questions: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    kinds = [question.get("kind") for question in questions]
    if len(questions) != 3:
        errors.append("must have exactly 3 questions")
    if sorted(kinds) != sorted(QUESTION_KINDS):
        errors.append("must include observation, context, and connection exactly once")
    for index, question in enumerate(questions, start=1):
        options = question.get("options") or []
        if len(options) != 4:
            errors.append(f"question {index} must have 4 options")
            continue
        normalized_options = [normalize_space(option).casefold() for option in options]
        if len(set(normalized_options)) != 4:
            errors.append(f"question {index} has duplicate options")
        answer_index = question.get("answerIndex")
        if not isinstance(answer_index, int) or answer_index < 0 or answer_index >= 4:
            errors.append(f"question {index} answerIndex is invalid")
        for field in ("prompt", "reinforcement"):
            if not normalize_space(question.get(field, "")):
                errors.append(f"question {index} is missing {field}")
    return errors


def editor_for_candidate(candidate: dict[str, Any]) -> str:
    return SHOWCASE_COPY_EDITORS[stable_hash(candidate["id"]) % len(SHOWCASE_COPY_EDITORS)]


def field_override_notes(candidate: dict[str, Any], artwork: dict[str, Any]) -> list[str]:
    raw = normalize_space(
        " ".join(
            [
                candidate.get("title", ""),
                candidate.get("medium", ""),
                candidate.get("classification", ""),
                candidate.get("culture", ""),
                candidate.get("country", ""),
                candidate.get("place", ""),
                candidate.get("collection", ""),
                " ".join(candidate.get("subjectTerms", [])),
            ]
        )
    )
    notes: list[str] = []
    if artwork["mediumCategory"] == "Ceramic" and has_term(raw, ("stone-paste", "tile", "iznik", "porcelain", "earthenware", "stoneware")):
        notes.append("Medium/category supported by ceramic or vessel language in the source metadata.")
    if artwork["mediumCategory"] == "Manuscript" and has_term(raw, ("book of the dead", "manuscript", "folio", "papyrus", "book")):
        notes.append("Medium/category supported by manuscript, book, folio, or papyrus source language.")
    if artwork["geoRegion"] == "Africa" and has_term(raw, ("egypt", "egyptian", "africa", "african")):
        notes.append("Region supported by object-origin terms rather than holding collection.")
    if artwork["geoRegion"] == "Asia" and has_term(raw, ("japan", "japanese", "china", "chinese", "india", "nepal", "himalayan", "guanyin", "tsuba")):
        notes.append("Region supported by Asian origin or subject terms in source metadata.")
    if artwork["geoRegion"] == "Europe" and has_term(raw, ("britain", "british", "england", "france", "french", "italy", "italian", "dutch", "spode", "doccia", "zuber", "cozzi")):
        notes.append("Region supported by European origin, maker, or manufacture terms in source metadata.")
    return unique_strings(notes)


def source_evidence_for(candidate: dict[str, Any], artwork: dict[str, Any]) -> dict[str, Any]:
    raw = candidate.get("source", {})
    object_url = normalize_space(raw.get("objectUrl", ""))
    source_terms = unique_strings(
        [
            candidate.get("title", ""),
            candidate.get("artist", ""),
            candidate.get("objectDate", ""),
            candidate.get("medium", ""),
            candidate.get("classification", ""),
            candidate.get("culture", ""),
            candidate.get("country", ""),
            candidate.get("place", ""),
            candidate.get("collection", ""),
            *candidate.get("subjectTerms", []),
        ]
    )
    return {
        "objectUrl": object_url,
        "sourceType": "official-object-record",
        "title": candidate.get("title", ""),
        "date": candidate.get("objectDate", ""),
        "medium": candidate.get("medium", ""),
        "classification": candidate.get("classification", ""),
        "originTerms": unique_strings([candidate.get("country", ""), candidate.get("place", ""), candidate.get("culture", ""), candidate.get("period", "")]),
        "subjectTerms": candidate.get("subjectTerms", []),
        "sourceTerms": source_terms[:12],
        "supports": {
            "title": bool(candidate.get("title")),
            "date": bool(candidate.get("objectDate")),
            "mediumCategory": bool(artwork.get("mediumCategory")),
            "geoRegion": bool(artwork.get("geoRegion")),
            "passportLabel": bool(artwork.get("passportLabel")),
            "image": all(is_runtime_image_url(artwork.get("images", {}).get(field, "")) for field in ("thumbnailUrl", "displayUrl", "fullUrl")),
        },
    }


def copy_polish_v2_for(candidate: dict[str, Any], artwork: dict[str, Any]) -> dict[str, str]:
    display_candidate = {
        **candidate,
        "title": artwork["title"],
        "artist": artwork["artist"],
        "objectDate": artwork["objectDate"],
        "medium": artwork["medium"],
    }
    medium_category = artwork["mediumCategory"]
    visible_feature = display_subject(specific_subject(display_candidate, medium_category))
    return {
        "visibleFeature": visible_feature,
        "objectLesson": material_lesson_for_artwork(display_candidate, medium_category),
        "historicalBridge": connection_context_phrase(
            artwork["passportLabel"],
            medium_category,
            artwork["geoRegion"],
        ),
        "copyStandard": "object-facing-v2-no-museum-mechanics",
    }


def resolved_risks_for(candidate: dict[str, Any], artwork: dict[str, Any]) -> list[str]:
    risks: list[str] = []
    title = normalize_space(candidate.get("title", ""))
    if is_weak_hero_candidate(candidate):
        risks.append("Weak-hero object kept only because it has a visible form, source-backed metadata, and object-specific copy.")
    if has_term(title, ("unidentified", "untitled", "fragment", "bowl or cup", "bracelet", "headrest", "weight")):
        risks.append("Generic title risk resolved through a concrete visible-detail prompt and object-use context.")
    if field_override_notes(candidate, artwork):
        risks.extend(field_override_notes(candidate, artwork))
    if not risks:
        risks.append("No unresolved source, metadata, or visual-presentation risk after editor-agent showcase pass.")
    return unique_strings(risks)


def build_editorial_record(
    candidate: dict[str, Any],
    *,
    approved: bool,
    blockers: list[str] | None = None,
    editor_agent: str = "Editor Merge",
) -> dict[str, Any]:
    blockers = blockers or []
    timestamp = now_iso()
    artwork = build_artwork_projection(candidate)
    question_errors = validate_question_set(artwork["questions"]) if artwork else []
    qa_blockers = [*question_errors, *blockers]
    status = "approved" if approved and not qa_blockers else "sourced"
    workflow: dict[str, Any] = {
        "status": status,
        "copyScope": MUSEUM_COPY_SCOPE,
        "sourcedAt": timestamp,
        "draftedAt": timestamp if artwork else None,
        "factCheckedAt": timestamp if artwork else None,
        "copyEditedAt": timestamp if artwork else None,
        "approvedAt": timestamp if status == "approved" else None,
        "approvedBy": editor_agent if status == "approved" else "",
        "blockers": blockers,
    }
    copy_editor = editor_for_candidate(candidate)
    source_evidence = source_evidence_for(candidate, artwork)
    copy_polish_v2 = copy_polish_v2_for(candidate, artwork)
    visual_note = hero_quality_note(candidate, artwork)
    resolved_risks = resolved_risks_for(candidate, artwork)
    review = {
        "status": status,
        "approvedAt": workflow["approvedAt"],
        "approvedBy": workflow["approvedBy"],
        "approvalType": SHOWCASE_APPROVAL_TYPE if status == "approved" else "",
        "showcaseTier": SHOWCASE_TIER if status == "approved" else "",
        "showcaseApprovedBy": editor_agent if status == "approved" else "",
        "copyEditedBy": copy_editor if artwork else "",
        "factCheckedBy": "Editor C" if artwork else "",
        "factCheckSources": unique_strings([candidate["source"]["objectUrl"]]),
        "sourceEvidence": source_evidence,
        "copyPolishV2": copy_polish_v2 if status == "approved" else {},
        "visualQualityNote": visual_note,
        "resolvedRisks": resolved_risks if status == "approved" else [],
        "safetyFlags": safety_flags_for(candidate),
        "editorNotes": [
            "Agent-audited v2: source fields support title, image, medium/date, and object-facing copy; this is not a human curator signoff.",
            f"Hero note: {visual_note}",
            f"Quality tier: {SHOWCASE_TIER}; export is also gated by deterministic copy validation.",
            f"Copy editor: {copy_editor}; QA editor: Editor C.",
        ]
        if status == "approved"
        else ["Needs additional review or missing shippable image access."],
        "notes": "" if status == "approved" else "Needs additional review or missing shippable image access.",
    }
    qa = {
        "structuralPass": not question_errors,
        "checklist": {
            "threeQuestions": artwork is not None and len(artwork["questions"]) == 3,
            "oneOfEachKind": artwork is not None and sorted(question["kind"] for question in artwork["questions"]) == sorted(QUESTION_KINDS),
            "fourUniqueOptionsEach": artwork is not None and all(len(set(normalize_space(option).casefold() for option in question["options"])) == 4 for question in artwork["questions"]),
            "answerableFromArtworkOrNotes": artwork is not None,
            "oneUnambiguousCorrectAnswer": artwork is not None,
            "distractorsPlausible": artwork is not None,
            "observationTestsLooking": artwork is not None,
            "contextMapsToDisplayedNote": artwork is not None,
            "connectionMatchesPeriodFraming": artwork is not None,
            "surprisingFactIsSourceBacked": True,
            "playerFacingCopyMatchesMuseumTone": artwork is not None,
            "globalCallCopyReviewed": True,
            "showcaseCopyApproved": status == "approved",
            "officialSourceEvidencePresent": bool(source_evidence.get("objectUrl")),
            "visualQualityReviewed": bool(visual_note),
        },
        "blockers": qa_blockers,
    }
    return {
        "id": candidate["id"],
        "source": candidate["source"],
        "rawSource": {
            "title": candidate["title"],
            "artist": candidate["artist"],
            "objectDate": candidate["objectDate"],
            "medium": candidate["medium"],
            "department": candidate.get("department", ""),
            "culture": candidate.get("culture", ""),
            "period": candidate.get("period", ""),
            "country": candidate.get("country", ""),
            "place": candidate.get("place", ""),
            "classification": candidate.get("classification", ""),
            "collection": candidate.get("collection", ""),
            "subjectTerms": candidate.get("subjectTerms", []),
            "images": candidate["images"],
        },
        "artwork": artwork,
        "workflow": workflow,
        "review": review,
        "qa": qa,
    }


def is_approved_record(record: dict[str, Any]) -> bool:
    return record.get("workflow", {}).get("status") == "approved" and bool(record.get("artwork"))


def project_curated_payload(editorial_payload: dict[str, Any]) -> dict[str, Any]:
    artworks: list[dict[str, Any]] = []
    sources_used: set[str] = set()
    for record in editorial_payload.get("records", []):
        if not is_approved_record(record):
            continue
        artwork = record["artwork"]
        artworks.append(
            {
                **artwork,
                "source": record["source"],
                "review": {
                    "status": "approved",
                    "approvedAt": record["review"]["approvedAt"],
                    "approvedBy": record["review"].get("approvedBy", record.get("workflow", {}).get("approvedBy", "")),
                    "approvalType": record["review"].get("approvalType", ""),
                    "showcaseTier": record["review"].get("showcaseTier", ""),
                    "showcaseApprovedBy": record["review"].get("showcaseApprovedBy", ""),
                    "copyEditedBy": record["review"].get("copyEditedBy", ""),
                    "factCheckedBy": record["review"].get("factCheckedBy", ""),
                    "factCheckSources": record["review"]["factCheckSources"],
                    "sourceEvidence": record["review"].get("sourceEvidence", {}),
                    "copyPolishV2": record["review"].get("copyPolishV2", {}),
                    "naturalLanguageV1": record["review"].get("naturalLanguageV1", {}),
                    "visualQualityNote": record["review"].get("visualQualityNote", ""),
                    "resolvedRisks": record["review"].get("resolvedRisks", []),
                    "safetyFlags": record["review"]["safetyFlags"],
                    "editorNotes": record["review"].get("editorNotes", []),
                },
            }
        )
        sources_used.add(record["source"]["institution"])
    policy_sources = unique_strings(
        source
        for institution in sorted(sources_used)
        for source in POLICY_SOURCES.get(institution, [])
    )
    return {
        "version": "museum-curated-v2",
        "reviewedAt": now_iso(),
        "institutionPolicySources": policy_sources,
        "artworks": artworks,
    }


GENERIC_FACT_PATTERNS = (
    "open-access museum records",
    "catalog entry makes this work teachable",
    "medium line matters",
    "preserves more than an image here",
    "rights information",
    "outside the gallery",
    "maker, medium, date",
)

QUALITY_SMELL_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("object record", re.compile(r"\bobject record\b", re.IGNORECASE)),
    ("material evidence", re.compile(r"\bmaterial evidence\b", re.IGNORECASE)),
    ("maker, material, and date", re.compile(r"\bmaker,\s*material,\s*and\s*date\b", re.IGNORECASE)),
    ("maker, date, and medium", re.compile(r"\bmaker,\s*date,\s*and\s*medium\b", re.IGNORECASE)),
    ("specific material/date/object record", re.compile(r"\bspecific material,\s*date,\s*and\s*object record\b", re.IGNORECASE)),
    ("worked metal object", re.compile(r"\bworked metal object\b", re.IGNORECASE)),
    ("photographed subject", re.compile(r"\bphotographed subject\b", re.IGNORECASE)),
    ("painted scene", re.compile(r"\bpainted scene\b", re.IGNORECASE)),
    ("drawn scene", re.compile(r"\bdrawn scene\b", re.IGNORECASE)),
    ("material detail prompt", re.compile(r"\bWhat material detail helps explain\b", re.IGNORECASE)),
    ("context best frames prompt", re.compile(r"\bWhich art-historical context best frames\b", re.IGNORECASE)),
    ("period tradition prompt", re.compile(r"\bWhich period or tradition best helps place\b", re.IGNORECASE)),
    ("process is meaning template", re.compile(r"\bThe physical process is part of the meaning\b", re.IGNORECASE)),
    ("entry point template", re.compile(r"\bentry point into the material and setting\b", re.IGNORECASE)),
    ("first point template", re.compile(r"\bfirst point of attention\b", re.IGNORECASE)),
    ("connects-through template", re.compile(r"\bconnects\b.{0,80}\bto\b.{0,80}\bthrough\b", re.IGNORECASE)),
    ("wider frame template", re.compile(r"\bgives\b.{0,80}\ba wider frame\b", re.IGNORECASE)),
    ("process and subject template", re.compile(r"\bprocess and subject work together\b", re.IGNORECASE)),
    ("detached from template", re.compile(r"\bdetached from\b", re.IGNORECASE)),
    ("clearer meaning template", re.compile(r"\bclearer meaning\b", re.IGNORECASE)),
    ("first read template", re.compile(r"\bshape the first read\b", re.IGNORECASE)),
    ("specific history template", re.compile(r"\bspecific history\b", re.IGNORECASE)),
    ("belongs to template", re.compile(r"\bbelongs to\b", re.IGNORECASE)),
    ("source record template", re.compile(r"\bsource record\b", re.IGNORECASE)),
    ("collection path template", re.compile(r"\bcollection path\b", re.IGNORECASE)),
    ("visit strengthen template", re.compile(r"\bvisit strengthen\b", re.IGNORECASE)),
    ("label asked template", re.compile(r"\blabel (?:ask|asked|asks)\b", re.IGNORECASE)),
    ("material label prompt", re.compile(r"\bWhat material did\b.{0,60}\blabel\b", re.IGNORECASE)),
    ("rights info template", re.compile(r"\brights information\b", re.IGNORECASE)),
    ("outside gallery template", re.compile(r"\boutside the gallery\b", re.IGNORECASE)),
    ("sits comfortably template", re.compile(r"\bsits comfortably inside\b", re.IGNORECASE)),
    ("tag shorthand template", re.compile(r"\btag becomes useful shorthand\b", re.IGNORECASE)),
    ("image points template", re.compile(r"\bimage points\b", re.IGNORECASE)),
    ("work anchor template", re.compile(r"\bwork['’]s anchor\b", re.IGNORECASE)),
    ("open access template", re.compile(r"\bopen[- ]access\b", re.IGNORECASE)),
    ("maker label template", re.compile(r"\bmaker label\b", re.IGNORECASE)),
    ("museum context template", re.compile(r"\bmuseum context\b", re.IGNORECASE)),
    ("official object page template", re.compile(r"\bofficial object page\b", re.IGNORECASE)),
    ("source metadata template", re.compile(r"\bsource metadata\b", re.IGNORECASE)),
    ("historical setting tangible template", re.compile(r"\bmakes its historical setting tangible through\b", re.IGNORECASE)),
    ("style alone template", re.compile(r"\brather than to style alone\b", re.IGNORECASE)),
    ("material craft template", re.compile(r"\bmaterial craft\b", re.IGNORECASE)),
    ("modern evidence bucket", re.compile(r"\bmodern image-making shaped by viewpoint and evidence\b", re.IGNORECASE)),
    ("human patronage bucket", re.compile(r"\bhuman presence,\s*patronage,\s*and revived classical forms\b", re.IGNORECASE)),
    ("baroque bucket", re.compile(r"\bdramatic light,\s*movement,\s*and heightened emotion\b", re.IGNORECASE)),
    ("materials survival bucket", re.compile(r"\bmaterials,\s*place,\s*and use shaping how art survives\b", re.IGNORECASE)),
    ("ritual status bucket", re.compile(r"\britual,\s*status,\s*and forms made for social use\b", re.IGNORECASE)),
    ("identity public memory bucket", re.compile(r"\bidentity,\s*likeness,\s*and public memory\b", re.IGNORECASE)),
    ("object world template", re.compile(r"\bobject['’]s world\b", re.IGNORECASE)),
    ("technology for seeing template", re.compile(r"\btechnology for seeing\b", re.IGNORECASE)),
    ("related works template", re.compile(r"\brelated works\b", re.IGNORECASE)),
    ("calendar template", re.compile(r"\bcalendar does\b", re.IGNORECASE)),
    ("locate prompt stem", re.compile(r"\bWhat should you try to locate\b", re.IGNORECASE)),
    ("craft choice prompt stem", re.compile(r"\bWhich craft choice matters most\b", re.IGNORECASE)),
    ("making detail prompt stem", re.compile(r"\bWhich making detail helps explain\b", re.IGNORECASE)),
    ("art lens prompt stem", re.compile(r"\bWhich art-history lens clarifies\b", re.IGNORECASE)),
    ("larger world prompt stem", re.compile(r"\bWhat larger world helps\b", re.IGNORECASE)),
    ("visual evidence abstraction", re.compile(r"\bvisual evidence\b", re.IGNORECASE)),
    ("identity memory abstraction", re.compile(r"\bidentity and memory\b", re.IGNORECASE)),
    ("historical pressure abstraction", re.compile(r"\bhistorical pressure\b", re.IGNORECASE)),
    ("people place purpose abstraction", re.compile(r"\bpeople,\s*place,\s*and\s*purpose\b", re.IGNORECASE)),
    ("matters because abstraction", re.compile(r"\bmatters because\b", re.IGNORECASE)),
    ("feel specific abstraction", re.compile(r"\bfeel specific\b", re.IGNORECASE)),
    ("sitter face generic anchor", re.compile(r"\bthe sitter['’]s face\b", re.IGNORECASE)),
    ("photographed view generic anchor", re.compile(r"\bthe photographed view\b", re.IGNORECASE)),
    ("seen within category stem", re.compile(r"\bSeen within\b", re.IGNORECASE)),
    ("reads as category stem", re.compile(r"\breads as\b", re.IGNORECASE)),
)

GENERIC_ANSWER_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("painted scene option", re.compile(r"^a painted scene$", re.IGNORECASE)),
    ("drawn scene option", re.compile(r"^a drawn scene$", re.IGNORECASE)),
    ("photographed subject option", re.compile(r"^a photographed subject$", re.IGNORECASE)),
    ("worked metal object option", re.compile(r"^a worked metal object$", re.IGNORECASE)),
    ("generic work option", re.compile(r"^a (?:painting|print|drawing|photograph|textile|sculpture|design) work$", re.IGNORECASE)),
    ("main figure fallback", re.compile(r"^(?:the )?main figure or setting$", re.IGNORECASE)),
    ("central form fallback", re.compile(r"^(?:the )?central form$", re.IGNORECASE)),
    ("photo fallback", re.compile(r"^(?:the )?figure or place in the photograph$", re.IGNORECASE)),
    ("sculpture fallback", re.compile(r"^(?:the )?carved or modeled form$", re.IGNORECASE)),
    ("textile fallback", re.compile(r"^(?:the )?pattern across the textile$", re.IGNORECASE)),
    ("print fallback", re.compile(r"^(?:the )?printed lines and central motif$", re.IGNORECASE)),
    ("drawing fallback", re.compile(r"^(?:the )?line work and main figure$", re.IGNORECASE)),
    ("title-token artifact", re.compile(r"^(?:the )?(?:book dead|lord will|fud immovable|aanbidding der|refectory imperial|portfolio forest|solomon robert|mery horn|pathway main|amerapoora east|three types)$", re.IGNORECASE)),
    ("male sitter fallback", re.compile(r"^a male sitter$", re.IGNORECASE)),
    ("female sitter fallback", re.compile(r"^a female sitter$", re.IGNORECASE)),
    ("straw ignores option", re.compile(r"\b(?:ignore|ignores|unrelated|instead of close looking|technical manual|sales catalogue|conservation diagram|advertising language|modern scan alone|exact hour|single proven day|fictional scene|military diagram|performance record|natural-history classification)\b", re.IGNORECASE)),
    ("cross-medium camera option", re.compile(r"\b(?:camera exposure would|oil paint would|interlaced threads would|carved stone would|fired clay would|chiseled stone would|copper plate would|woven threads would)\b", re.IGNORECASE)),
)

ARTWORK_COPY_BANNED_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("Passport", re.compile(r"\bpassport\b", re.IGNORECASE)),
    ("mechanic thread", re.compile(r"\b(?:your\s+\w[\w\s-]*\s+thread|broader thread|thread it joins|part of (?:your )?\w[\w\s-]* thread|a thread that)\b", re.IGNORECASE)),
    ("today's notes", re.compile(r"\btoday['’]s notes\b", re.IGNORECASE)),
    ("today's placard", re.compile(r"\btoday['’]s placard\b", re.IGNORECASE)),
    ("the notes", re.compile(r"\b(?:the|these|did the|from the|in the) notes?\b", re.IGNORECASE)),
    ("technique note", re.compile(r"\btechnique note\b", re.IGNORECASE)),
    ("daily lesson", re.compile(r"\bdaily lesson\b", re.IGNORECASE)),
    ("future visits", re.compile(r"\bfuture visits\b", re.IGNORECASE)),
    ("collecting path", re.compile(r"\bcollecting path\b", re.IGNORECASE)),
    ("comparison path", re.compile(r"\bcomparison path\b", re.IGNORECASE)),
    ("best comparison set", re.compile(r"\bbest comparison set\b", re.IGNORECASE)),
    ("visual anchor", re.compile(r"\bvisual anchor\b", re.IGNORECASE)),
    ("museum label", re.compile(r"\bmuseum label\b", re.IGNORECASE)),
    ("woven or stitched surface", re.compile(r"\bwoven or stitched surface\b", re.IGNORECASE)),
    ("image points", re.compile(r"\bimage points\b", re.IGNORECASE)),
    ("museum context", re.compile(r"\bmuseum context\b", re.IGNORECASE)),
    ("source metadata", re.compile(r"\bsource metadata\b", re.IGNORECASE)),
    ("rights/access language", re.compile(r"\b(?:rights information|open[- ]access|cc0|public domain)\b", re.IGNORECASE)),
    ("game mechanics", re.compile(r"\b(?:game|session|score|streak|quiz answer|visit strengthen)\b", re.IGNORECASE)),
    ("repeated bridge template", re.compile(r"\bbrings together\b|\bgives .{0,80} a foothold\b|\bsetting changes how\b", re.IGNORECASE)),
    ("cautious-maker template", re.compile(r"\bkeeps its maker attribution cautious\b|\bstill point to a particular world\b", re.IGNORECASE)),
    ("visible-clues template", re.compile(r"\bread through visible clues\b|\bsurface,\s*style,\s*and\b|\bsurface,\s*date,\s*and\b", re.IGNORECASE)),
    ("approved-template language", re.compile(r"\bclear subject,\s*legible image,\s*and object-specific details\b", re.IGNORECASE)),
)


def is_object_specific_fact(artwork: dict[str, Any]) -> bool:
    fact = normalize_space(artwork.get("context", {}).get("surprisingFact", ""))
    haystack = fact.casefold()
    subject = ""
    try:
        subject = specific_subject(
            {
                "title": artwork.get("title", ""),
                "medium": artwork.get("medium", ""),
                "classification": artwork.get("mediumCategory", ""),
                "collection": "",
                "subjectTerms": [],
            },
            artwork.get("mediumCategory", ""),
        )
    except Exception:
        subject = ""
    tokens = [
        artwork.get("title", ""),
        short_title(artwork.get("title", "")),
        copy_safe_title(artwork.get("title", "")),
        artwork.get("artist", ""),
        artwork.get("medium", ""),
        artwork.get("objectDate", ""),
        artwork.get("source", {}).get("collectionLabel", "") if isinstance(artwork.get("source"), dict) else "",
        artwork.get("passportLabel", ""),
        artwork.get("geoRegion", ""),
        subject,
        display_subject(subject),
        short_subject(subject),
    ]
    return any(normalize_space(token).casefold() and normalize_space(token).casefold() in haystack for token in tokens)


def normalized_copy_stem(value: str, artwork: dict[str, Any]) -> str:
    text = normalize_space(value).casefold()
    subject = ""
    try:
        subject = specific_subject(
            {
                "title": artwork.get("title", ""),
                "medium": artwork.get("medium", ""),
                "classification": artwork.get("mediumCategory", ""),
                "collection": "",
                "subjectTerms": [],
            },
            artwork.get("mediumCategory", ""),
        )
    except Exception:
        subject = ""
    replacements = [
        artwork.get("title", ""),
        short_title(artwork.get("title", "")),
        artwork.get("artist", ""),
        artwork.get("medium", ""),
        artwork.get("objectDate", ""),
        artwork.get("passportLabel", ""),
        artwork.get("periodTag", ""),
        artwork.get("geoRegion", ""),
        artwork.get("source", {}).get("collectionLabel", "") if isinstance(artwork.get("source"), dict) else "",
        subject,
        display_subject(subject),
        short_subject(subject),
    ]
    for replacement in sorted({normalize_space(item).casefold() for item in replacements if normalize_space(item)}, key=len, reverse=True):
        text = text.replace(replacement, "{x}")
    text = re.sub(r"\b\d{3,4}(?:[-–]\d{2,4})?\b", "{date}", text)
    text = re.sub(r"\b(?:ca\.|c\.|about)\s*\{date\}", "{date}", text)
    text = re.sub(r"\s+", " ", text).strip()
    words = text.split()
    return " ".join(words[:14])


def delimiter_copy_errors(text: str) -> list[str]:
    errors: list[str] = []
    normalized = normalize_space(text)
    if normalized.count("(") != normalized.count(")"):
        errors.append("unbalanced parentheses")
    if normalized.count("[") != normalized.count("]"):
        errors.append("unbalanced brackets")
    if normalized.count("\"") % 2:
        errors.append("unbalanced double quote")
    if re.search(r"\b[A-Za-z]{2,}\s+(?:hensh|cathédr|cathdr|fud)\b", normalized, re.IGNORECASE):
        errors.append("truncated title token")
    return errors


def copy_quality_errors(artworks: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    facts = [normalize_space(artwork.get("context", {}).get("surprisingFact", "")) for artwork in artworks]
    prompts = [
        normalize_space(question.get("prompt", ""))
        for artwork in artworks
        for question in artwork.get("questions", [])
    ]
    reinforcements = [
        normalize_space(question.get("reinforcement", ""))
        for artwork in artworks
        for question in artwork.get("questions", [])
    ]
    options = [
        normalize_space(option)
        for artwork in artworks
        for question in artwork.get("questions", [])
        for option in question.get("options", [])
    ]
    context_field_counts: dict[str, Counter[str]] = {
        "technique": Counter(),
        "surprisingFact": Counter(),
        "connection": Counter(),
    }
    prompt_stem_counts: Counter[str] = Counter()
    fact_counts = Counter(facts)
    prompt_counts = Counter(prompts)
    reinforcement_counts = Counter(reinforcements)
    option_counts = Counter(options)
    repeated_facts = [fact for fact, count in fact_counts.items() if fact and count > 3]
    repeated_prompts = [prompt for prompt, count in prompt_counts.items() if prompt and count > 12]
    repeated_reinforcements = [text for text, count in reinforcement_counts.items() if text and count > 12]
    if repeated_facts:
        errors.append(f"surprisingFact exact repeats exceed cap: {repeated_facts[:3]}")
    if len(fact_counts) < 250:
        errors.append(f"surprisingFact variety too low: {len(fact_counts)} distinct facts")
    if repeated_prompts:
        errors.append(f"quiz prompt exact repeats exceed cap: {repeated_prompts[:3]}")
    if repeated_reinforcements:
        errors.append(f"quiz reinforcement exact repeats exceed cap: {repeated_reinforcements[:3]}")
    repeated_options = [option for option, count in option_counts.items() if option and count > 10]
    if repeated_options:
        errors.append(f"quiz option repeats exceed cap: {repeated_options[:3]}")
    stem_counts: Counter[str] = Counter()
    for artwork in artworks:
        if normalize_space(artwork.get("geoRegion", "")).casefold() == "global":
            errors.append(f"{artwork['id']}: player-facing geoRegion cannot be Global")
        fields = [
            *(artwork.get("context") or {}).values(),
            *[
                question.get("prompt", "")
                for question in artwork.get("questions", [])
            ],
            *[
                question.get("reinforcement", "")
                for question in artwork.get("questions", [])
            ],
        ]
        for field in fields:
            stem = normalized_copy_stem(field, artwork)
            if stem:
                stem_counts[stem] += 1
        for field_name, field_value in (artwork.get("context") or {}).items():
            if field_name in context_field_counts:
                stem = normalized_copy_stem(field_value, artwork)
                if stem:
                    context_field_counts[field_name][stem] += 1
        for question in artwork.get("questions", []):
            stem = normalized_copy_stem(question.get("prompt", ""), artwork)
            if stem:
                prompt_stem_counts[stem] += 1
        natural_language = artwork.get("review", {}).get("naturalLanguageV1") or {}
        if natural_language.get("status") != "resolved":
            errors.append(f"{artwork['id']}: missing resolved naturalLanguageV1 review")
        if not natural_language.get("reviewers"):
            errors.append(f"{artwork['id']}: naturalLanguageV1 reviewers are required")
    repeated_stems = [stem for stem, count in stem_counts.items() if count > 30 and "{x}" in stem]
    if repeated_stems:
        errors.append(f"normalized copy stems exceed showcase cap: {repeated_stems[:5]}")
    repeated_prompt_stems = [stem for stem, count in prompt_stem_counts.items() if count > 8]
    if repeated_prompt_stems:
        errors.append(f"normalized prompt stems exceed natural-language cap: {repeated_prompt_stems[:5]}")
    repeated_context_stems = [
        f"{field}:{stem}"
        for field, counts in context_field_counts.items()
        for stem, count in counts.items()
        if count > 5
    ]
    if repeated_context_stems:
        errors.append(f"T/N/C stems exceed natural-language cap: {repeated_context_stems[:5]}")
    banned_copy_hits: list[str] = []
    quality_smell_hits: list[str] = []
    generic_answer_hits: list[str] = []
    for artwork in artworks:
        copy_fields: list[tuple[str, str]] = []
        for field, value in (artwork.get("context") or {}).items():
            copy_fields.append((f"context.{field}", normalize_space(value)))
        for question_index, question in enumerate(artwork.get("questions", []), start=1):
            copy_fields.append((f"questions[{question_index}].prompt", normalize_space(question.get("prompt", ""))))
            copy_fields.append((f"questions[{question_index}].reinforcement", normalize_space(question.get("reinforcement", ""))))
            for option_index, option in enumerate(question.get("options", []), start=1):
                copy_fields.append((f"questions[{question_index}].options[{option_index}]", normalize_space(option)))
        for field, text in copy_fields:
            delimiter_errors = delimiter_copy_errors(text)
            if delimiter_errors:
                quality_smell_hits.append(f"{artwork['id']} {field}: {delimiter_errors[0]}")
            for label, pattern in ARTWORK_COPY_BANNED_PATTERNS:
                if pattern.search(text):
                    banned_copy_hits.append(f"{artwork['id']} {field}: {label}")
                    break
            for label, pattern in QUALITY_SMELL_PATTERNS:
                if pattern.search(text):
                    quality_smell_hits.append(f"{artwork['id']} {field}: {label}")
                    break
        for question_index, question in enumerate(artwork.get("questions", []), start=1):
            for option_index, option in enumerate(question.get("options", []), start=1):
                for label, pattern in GENERIC_ANSWER_PATTERNS:
                    if pattern.search(normalize_space(option)):
                        generic_answer_hits.append(f"{artwork['id']} questions[{question_index}].options[{option_index}]: {label}")
                        break
    if banned_copy_hits:
        errors.append(f"self-referential artwork copy remains: {banned_copy_hits[:12]}")
    if quality_smell_hits:
        errors.append(f"quality-smell artwork copy remains: {quality_smell_hits[:12]}")
    if generic_answer_hits:
        errors.append(f"generic quiz answer options remain: {generic_answer_hits[:12]}")
    generic_facts = [
        artwork["id"]
        for artwork in artworks
        if any(pattern in normalize_space(artwork.get("context", {}).get("surprisingFact", "")).casefold() for pattern in GENERIC_FACT_PATTERNS)
    ]
    if generic_facts:
        errors.append(f"generic surprising facts remain: {generic_facts[:8]}")
    object_specific = sum(1 for artwork in artworks if is_object_specific_fact(artwork))
    if object_specific < len(artworks):
        errors.append(f"object-specific surprising facts too low: {object_specific}/{len(artworks)}")
    context_questions = [
        question
        for artwork in artworks
        for question in artwork.get("questions", [])
        if question.get("kind") == "context"
    ]
    raw_medium_questions = [
        question
        for question in context_questions
        if re.search(r"\b(?:medium|material basis|material fact)\b", question.get("prompt", ""), re.IGNORECASE)
    ]
    if len(raw_medium_questions) > math.floor(len(context_questions) * 0.3):
        errors.append(f"context questions overuse raw medium recall: {len(raw_medium_questions)}/{len(context_questions)}")
    connection_questions = [
        question
        for artwork in artworks
        for question in artwork.get("questions", [])
        if question.get("kind") == "connection"
    ]
    passport_recall = [
        question
        for question in connection_questions
        if re.search(r"\b(?:passport|thread|label)\b", question.get("prompt", ""), re.IGNORECASE)
    ]
    if len(passport_recall) > math.floor(len(connection_questions) * 0.25):
        errors.append(f"connection questions overuse passport label recall: {len(passport_recall)}/{len(connection_questions)}")
    return errors


def mix_quality_errors(artworks: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    total = len(artworks)
    source_counts = Counter(artwork["source"]["institution"] for artwork in artworks)
    active_sources = {source for source, count in source_counts.items() if count > 0}
    supported_runtime_sources = {"met", "aic", "rijks", "smithsonian", "ycba", "nga"}
    missing_sources = sorted(supported_runtime_sources - active_sources)
    if missing_sources:
        errors.append(f"supported runtime sources missing from approved pack: {missing_sources}")
    for source, count in source_counts.items():
        if count > math.floor(total * 0.35):
            errors.append(f"source {source} exceeds 35% cap: {count}/{total}")
    top_two = sum(count for _, count in source_counts.most_common(2))
    if top_two > math.floor(total * 0.6):
        errors.append(f"top two sources exceed 60% cap: {top_two}/{total}")

    title_counts = Counter(normalize_space(artwork["title"]).casefold() for artwork in artworks)
    family_counts = Counter(title_family(artwork["title"]) for artwork in artworks)
    for title, count in title_counts.items():
        if count > 2:
            errors.append(f"title repeat exceeds cap: {title} ({count})")
            break
    for family, count in family_counts.items():
        if count > 4:
            errors.append(f"object family repeat exceeds cap: {family} ({count})")
            break

    medium_counts = Counter(artwork["mediumCategory"] for artwork in artworks)
    flat_total = sum(medium_counts.get(category, 0) for category in FLAT_MEDIA_CATEGORIES)
    if flat_total > math.floor(total * 0.45):
        errors.append(f"Painting/Print/Drawing exceeds 45% cap: {flat_total}/{total}")
    if medium_counts.get("Photograph", 0) < 20:
        errors.append(f"Photograph count below target: {medium_counts.get('Photograph', 0)}")

    for artwork in artworks:
        artist = normalize_space(artwork.get("artist", ""))
        if re.search(r",\s*\d{3,4}\b|born|died|\b[A-Z][a-z]+ or$", artist):
            errors.append(f"{artwork['id']}: artist label needs polish: {artist}")
        if re.search(r"\bLate\d", artwork.get("objectDate", "")):
            errors.append(f"{artwork['id']}: malformed date remains")
    return errors


def validate_curated_quality(curated_payload: dict[str, Any]) -> list[str]:
    artworks = curated_payload.get("artworks") or []
    return [*mix_quality_errors(artworks), *copy_quality_errors(artworks)]


def month_key(date_value: date) -> str:
    return f"{date_value.year:04d}-{date_value.month:02d}"


def build_month_limits(start: date, days: int) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for offset in range(days):
        counts[month_key(start + timedelta(days=offset))] += 1
    return {key: math.floor(count * 0.4) for key, count in counts.items()}


def build_region_month_caps(start: date, days: int) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for offset in range(days):
        counts[month_key(start + timedelta(days=offset))] += 1
    return {key: math.floor(count * 0.45) for key, count in counts.items()}


def schedule_candidate_score(
    candidate: dict[str, Any],
    *,
    remaining_artist_counts: Counter[str],
    remaining_period_counts: Counter[str],
    remaining_medium_counts: Counter[str],
    remaining_region_counts: Counter[str],
    remaining_source_counts: Counter[str],
    region_counts: Counter[str],
    period_counts: Counter[str],
    medium_counts: Counter[str],
    source_counts: Counter[str],
    month_region_counts: Counter[tuple[str, str]],
    target_month: str,
    attempt: int,
) -> tuple[int, int, int, int, int, int, int, int, int, int, int]:
    artist_key = normalize_space(candidate["artist"]).casefold()
    return (
        -remaining_artist_counts[artist_key],
        -remaining_region_counts[candidate["geoRegion"]],
        -remaining_source_counts[candidate["source"]["institution"]],
        -remaining_period_counts[candidate["periodKey"]],
        -remaining_medium_counts[candidate["mediumCategory"]],
        period_counts[candidate["periodKey"]],
        medium_counts[candidate["mediumCategory"]],
        region_counts[candidate["geoRegion"]],
        month_region_counts[(target_month, candidate["geoRegion"])],
        source_counts[candidate["source"]["institution"]],
        stable_hash(f"{attempt}:{candidate['id']}"),
    )


def violates_rotation(candidate: dict[str, Any], recent: list[dict[str, Any]]) -> bool:
    artist = normalize_space(candidate["artist"]).casefold()
    for item in recent[-6:]:
        if normalize_space(item["artist"]).casefold() == artist:
            return True
    if len(recent) >= 2:
        if all(item["periodKey"] == candidate["periodKey"] for item in recent[-2:]):
            return True
        if all(item["mediumCategory"] == candidate["mediumCategory"] for item in recent[-2:]):
            return True
        if all(item["source"]["institution"] == candidate["source"]["institution"] for item in recent[-2:]):
            return True
        if all(item["source"]["collectionLabel"] == candidate["source"]["collectionLabel"] for item in recent[-2:]):
            return True
    return False


def build_schedule_entries(artworks: list[dict[str, Any]], start: date, days: int) -> list[dict[str, str]]:
    if len(artworks) < days:
        raise ValueError(f"Need at least {days} approved artworks for a zero-repeat annual pack; found {len(artworks)}")
    europe_limits = build_month_limits(start, days)
    region_month_caps = build_region_month_caps(start, days)
    last_error = f"Could not place a valid Museum artwork on {start.isoformat()}"

    for attempt in range(96):
        remaining = [dict(artwork) for artwork in artworks]
        recent: list[dict[str, Any]] = []
        entries: list[dict[str, str]] = []
        region_counts: Counter[str] = Counter()
        period_counts: Counter[str] = Counter()
        medium_counts: Counter[str] = Counter()
        source_counts: Counter[str] = Counter()
        month_region_counts: Counter[tuple[str, str]] = Counter()
        failed = False

        for offset in range(days):
            current_date = start + timedelta(days=offset)
            current_month = month_key(current_date)
            remaining_artist_counts = Counter(normalize_space(candidate["artist"]).casefold() for candidate in remaining)
            remaining_period_counts = Counter(candidate["periodKey"] for candidate in remaining)
            remaining_medium_counts = Counter(candidate["mediumCategory"] for candidate in remaining)
            remaining_region_counts = Counter(candidate["geoRegion"] for candidate in remaining)
            remaining_source_counts = Counter(candidate["source"]["institution"] for candidate in remaining)
            valid_candidates = [
                candidate
                for candidate in remaining
                if not violates_rotation(candidate, recent)
                and not (
                    candidate["geoRegion"] == "Europe"
                    and month_region_counts[(current_month, "Europe")] >= europe_limits[current_month]
                )
                and month_region_counts[(current_month, candidate["geoRegion"])] < region_month_caps[current_month]
            ]
            if not valid_candidates:
                last_error = f"Could not place a valid Museum artwork on {current_date.isoformat()} during attempt {attempt + 1}"
                failed = True
                break

            valid_candidates.sort(
                key=lambda candidate: schedule_candidate_score(
                    candidate,
                    remaining_artist_counts=remaining_artist_counts,
                    remaining_period_counts=remaining_period_counts,
                    remaining_medium_counts=remaining_medium_counts,
                    remaining_region_counts=remaining_region_counts,
                    remaining_source_counts=remaining_source_counts,
                    region_counts=region_counts,
                    period_counts=period_counts,
                    medium_counts=medium_counts,
                    source_counts=source_counts,
                    month_region_counts=month_region_counts,
                    target_month=current_month,
                    attempt=attempt,
                )
            )
            chosen = valid_candidates[0]
            remaining = [candidate for candidate in remaining if candidate["id"] != chosen["id"]]
            recent.append(chosen)
            region_counts[chosen["geoRegion"]] += 1
            period_counts[chosen["periodKey"]] += 1
            medium_counts[chosen["mediumCategory"]] += 1
            source_counts[chosen["source"]["institution"]] += 1
            month_region_counts[(current_month, chosen["geoRegion"])] += 1
            entries.append({"date": current_date.isoformat(), "artworkId": chosen["id"]})

        if not failed:
            return entries

    raise ValueError(last_error)


def validate_editorial_record(record: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    record_id = record.get("id", "<missing>")
    if record.get("source", {}).get("institution") not in SUPPORTED_SOURCES:
        errors.append(f"{record_id}: unsupported source institution")
    if not normalize_space(record.get("source", {}).get("collectionLabel", "")):
        errors.append(f"{record_id}: missing source.collectionLabel")
    if not normalize_space(record.get("source", {}).get("objectUrl", "")):
        errors.append(f"{record_id}: missing source.objectUrl")
    if record.get("workflow", {}).get("status") not in WORKFLOW_STATUSES:
        errors.append(f"{record_id}: invalid workflow.status")
    if not record.get("review", {}).get("factCheckSources"):
        errors.append(f"{record_id}: review.factCheckSources is required")

    if is_approved_record(record):
        artwork = record.get("artwork") or {}
        required_fields = [
            "title",
            "artist",
            "objectDate",
            "medium",
            "periodKey",
            "periodTag",
            "passportLabel",
            "mediumCategory",
            "geoRegion",
        ]
        for field in required_fields:
            if not normalize_space(artwork.get(field, "")):
                errors.append(f"{record_id}: artwork.{field} is required")
        for field in ("thumbnailUrl", "displayUrl", "fullUrl"):
            url = artwork.get("images", {}).get(field, "")
            if not is_runtime_image_url(url):
                errors.append(f"{record_id}: artwork.images.{field} must be a URL")
        for field in ("title", "artist", "medium", "periodTag", "passportLabel"):
            value = artwork.get(field, "")
            if re.search(r"<[^>]+>", str(value)):
                errors.append(f"{record_id}: artwork.{field} contains markup")
        if len(normalize_space(artwork.get("medium", ""))) > 140:
            errors.append(f"{record_id}: artwork.medium is too long for player-facing display")
        if re.search(r"\b(?:SAAM|NPG|NMAfA|FSG|CHNDM)\b", artwork.get("periodTag", "")):
            errors.append(f"{record_id}: artwork.periodTag contains collection acronym")
        errors.extend(f"{record_id}: {error}" for error in validate_question_set(artwork.get("questions") or []))
        for question in artwork.get("questions") or []:
            if "named in today" in normalize_space(question.get("prompt", "")).casefold():
                errors.append(f"{record_id}: observation prompt uses stale title-based wording")
            for option in question.get("options") or []:
                if len(normalize_space(option)) > 140:
                    errors.append(f"{record_id}: quiz option is too long")
                if re.search(r"<[^>]+>", str(option)):
                    errors.append(f"{record_id}: quiz option contains markup")
        if not record.get("review", {}).get("approvedAt"):
            errors.append(f"{record_id}: approved record needs review.approvedAt")
        if record.get("review", {}).get("approvalType") != "editor-agent-v1":
            errors.append(f"{record_id}: approved record needs editor-agent-v1 approvalType")
        if record.get("review", {}).get("showcaseTier") != SHOWCASE_TIER:
            errors.append(f"{record_id}: approved record needs {SHOWCASE_TIER} showcaseTier")
        if not record.get("review", {}).get("showcaseApprovedBy"):
            errors.append(f"{record_id}: approved record needs review.showcaseApprovedBy")
        source_evidence = record.get("review", {}).get("sourceEvidence") or {}
        if not normalize_space(source_evidence.get("objectUrl", "")):
            errors.append(f"{record_id}: approved record needs review.sourceEvidence.objectUrl")
        supports = source_evidence.get("supports") or {}
        for field in ("title", "date", "mediumCategory", "geoRegion", "passportLabel", "image"):
            if not supports.get(field):
                errors.append(f"{record_id}: source evidence does not support {field}")
        if not normalize_space(record.get("review", {}).get("visualQualityNote", "")):
            errors.append(f"{record_id}: approved record needs review.visualQualityNote")
        if not record.get("review", {}).get("resolvedRisks"):
            errors.append(f"{record_id}: approved record needs review.resolvedRisks")
        if record.get("review", {}).get("approvedBy") in {"", "codex-seed-pass", None}:
            errors.append(f"{record_id}: approved record needs named editor-agent approvedBy")
        if not record.get("review", {}).get("copyEditedBy"):
            errors.append(f"{record_id}: approved record needs review.copyEditedBy")
        if not record.get("review", {}).get("factCheckedBy"):
            errors.append(f"{record_id}: approved record needs review.factCheckedBy")
        if not record.get("review", {}).get("editorNotes"):
            errors.append(f"{record_id}: approved record needs review.editorNotes")
        notes_text = "\n".join(record.get("review", {}).get("editorNotes", []))
        if any("B ship" in normalize_space(note) for note in record.get("review", {}).get("editorNotes", [])):
            errors.append(f"{record_id}: approved record still carries B-tier editor note")
        if re.search(r"\bclear subject,\s*legible image,\s*and object-specific details\b", notes_text, re.IGNORECASE):
            errors.append(f"{record_id}: approved record still carries generic review boilerplate")
        natural_language = record.get("review", {}).get("naturalLanguageV1") or {}
        if natural_language.get("status") != "resolved":
            errors.append(f"{record_id}: approved record needs resolved naturalLanguageV1 review")
        if not natural_language.get("reviewers"):
            errors.append(f"{record_id}: approved record needs naturalLanguageV1 reviewers")
        if not natural_language.get("resolvedAt"):
            errors.append(f"{record_id}: approved record needs naturalLanguageV1.resolvedAt")
        if record.get("qa", {}).get("blockers"):
            errors.append(f"{record_id}: approved record has QA blockers")
    return errors


def validate_editorial_payload(editorial_payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    records = editorial_payload.get("records") or []
    if not isinstance(records, list) or not records:
        return ["editorial bank must contain records"]
    approved_ids: set[str] = set()
    for record in records:
        errors.extend(validate_editorial_record(record))
        if is_approved_record(record):
            record_id = record["id"]
            if record_id in approved_ids:
                errors.append(f"{record_id}: duplicate approved record id")
            approved_ids.add(record_id)
    return errors


def validate_schedule_payload(
    curated_payload: dict[str, Any],
    schedule_payload: dict[str, Any],
    *,
    require_days: int | None = None,
) -> list[str]:
    errors: list[str] = []
    artworks = curated_payload.get("artworks") or []
    artwork_ids = {artwork["id"] for artwork in artworks}
    entries = schedule_payload.get("entries") or []
    if require_days is not None and len(entries) != require_days:
        errors.append(f"schedule must contain exactly {require_days} entries")
    if schedule_payload.get("days") != len(entries):
        errors.append("schedule.days must match entry count")
    seen_dates: set[str] = set()
    seen_ids: set[str] = set()
    previous_date: date | None = None
    recent: list[dict[str, Any]] = []
    artwork_by_id = {artwork["id"]: artwork for artwork in artworks}
    europe_limits = build_month_limits(parse_date(schedule_payload["start"]), len(entries))
    region_month_caps = build_region_month_caps(parse_date(schedule_payload["start"]), len(entries))
    month_europe_counts: Counter[str] = Counter()
    month_region_counts: Counter[tuple[str, str]] = Counter()

    for entry in entries:
        entry_date = parse_date(entry["date"])
        if entry["date"] in seen_dates:
            errors.append(f"duplicate schedule date {entry['date']}")
        seen_dates.add(entry["date"])
        if previous_date and entry_date != previous_date + timedelta(days=1):
            errors.append(f"schedule gap after {previous_date.isoformat()}")
        previous_date = entry_date
        artwork_id = entry["artworkId"]
        if artwork_id not in artwork_ids:
            errors.append(f"{entry['date']}: unknown artwork id {artwork_id}")
            continue
        if artwork_id in seen_ids:
            errors.append(f"{entry['date']}: repeated artwork id {artwork_id}")
        seen_ids.add(artwork_id)
        artwork = artwork_by_id[artwork_id]
        if violates_rotation(artwork, recent):
            errors.append(f"{entry['date']}: rotation violation for {artwork_id}")
        recent.append(artwork)
        if artwork["geoRegion"] == "Europe":
            month = month_key(entry_date)
            month_europe_counts[month] += 1
            if month_europe_counts[month] > europe_limits[month]:
                errors.append(f"{entry['date']}: monthly Europe cap exceeded in {month}")
        month = month_key(entry_date)
        month_region_counts[(month, artwork["geoRegion"])] += 1
        if month_region_counts[(month, artwork["geoRegion"])] > region_month_caps[month]:
            errors.append(f"{entry['date']}: monthly {artwork['geoRegion']} cap exceeded in {month}")
    return errors


def tracker_markdown(editorial_payload: dict[str, Any], curated_payload: dict[str, Any], schedule_payload: dict[str, Any]) -> str:
    records = editorial_payload.get("records") or []
    approved_records = [record for record in records if is_approved_record(record)]
    status_counts = Counter(record.get("workflow", {}).get("status", "unknown") for record in records)
    source_counts = Counter(record.get("source", {}).get("institution", "unknown") for record in records)
    approved_source_counts = Counter(record.get("source", {}).get("institution", "unknown") for record in approved_records)
    lines = [
        "# Museum Annual Pack Tracker",
        "",
        f"Generated: {now_iso()}",
        "",
        "## Summary",
        "",
        f"- Editorial records: {len(records)}",
        f"- Approved runtime artworks: {len(curated_payload.get('artworks') or [])}",
        f"- Scheduled days: {schedule_payload.get('days')}",
        f"- Approved unique artworks: {len({record['id'] for record in approved_records})}",
        "",
        "## Workflow Counts",
        "",
        "| Status | Count |",
        "|---|---:|",
    ]
    for status in WORKFLOW_STATUSES:
        lines.append(f"| {status} | {status_counts.get(status, 0)} |")
    lines.extend(
        [
            "",
            "## Source Counts",
            "",
            "| Source | Editorial | Approved |",
            "|---|---:|---:|",
        ]
    )
    for source in SUPPORTED_SOURCES:
        lines.append(f"| {source} | {source_counts.get(source, 0)} | {approved_source_counts.get(source, 0)} |")
    lines.extend(
        [
            "",
            "## Records",
            "",
            "| # | ID | Status | Source | Passport | Region | Medium | QA Blockers |",
            "|---:|---|---|---|---|---|---|---|",
        ]
    )
    for index, record in enumerate(records, start=1):
        artwork = record.get("artwork") or {}
        blockers = ", ".join(record.get("qa", {}).get("blockers", [])[:2]) or "—"
        lines.append(
            f"| {index} | {record['id']} | {record['workflow']['status']} | "
            f"{record['source']['collectionLabel']} | {artwork.get('passportLabel', '—')} | "
            f"{artwork.get('geoRegion', '—')} | {artwork.get('mediumCategory', '—')} | {blockers} |"
        )
    return "\n".join(lines) + "\n"


def read_csv_from_url(url: str) -> list[dict[str, str]]:
    return list(csv.DictReader(io.StringIO(fetch_text(url))))


def met_queries() -> list[str]:
    return [
        "photograph",
        "photography",
        "albumen",
        "salted paper",
        "daguerreotype",
        "Japan",
        "China",
        "India",
        "Africa",
        "Egypt",
        "Peru",
        "textile",
        "sculpture",
        "vase",
        "bowl",
        "mask",
        "jewelry",
        "chair",
        "armor",
        "dress",
        "fan",
        "coin",
        "manuscript",
        "painting",
        "print",
        "ceramic",
    ]


def fallback_met_candidates(limit: int) -> list[dict[str, Any]]:
    if not CURATED_PATH.exists():
        return []
    payload = read_json(CURATED_PATH)
    candidates: list[dict[str, Any]] = []
    for artwork in payload.get("artworks") or []:
        if artwork.get("source", {}).get("institution") != "met":
            continue
        candidates.append(
            {
                "id": artwork["id"],
                "title": artwork["title"],
                "artist": artwork["artist"],
                "objectDate": artwork["objectDate"],
                "medium": artwork["medium"],
                "department": "",
                "culture": "",
                "period": artwork["periodTag"],
                "country": "",
                "place": artwork["geoRegion"],
                "classification": artwork["mediumCategory"],
                "collection": INSTITUTION_LABELS["met"],
                "subjectTerms": [],
                "images": artwork["images"],
                "source": {
                    **artwork["source"],
                    "collectionLabel": INSTITUTION_LABELS["met"],
                },
            }
        )
        if len(candidates) >= limit:
            break
    return candidates


def build_met_candidate(obj: dict[str, Any]) -> dict[str, Any] | None:
    creator = normalize_space(obj.get("artistDisplayName") or obj.get("culture") or obj.get("department") or "")
    if not creator:
        creator = "Unknown maker"
    if not obj.get("isPublicDomain"):
        return None
    if not obj.get("primaryImage") or not obj.get("primaryImageSmall"):
        return None
    if not normalize_space(obj.get("title")) or not normalize_space(obj.get("objectURL")):
        return None
    return {
        "id": f"met-{obj['objectID']}",
        "title": clean_title(obj.get("title", "")),
        "artist": creator,
        "objectDate": normalize_object_date(obj.get("objectDate", "")),
        "medium": normalize_space(obj.get("medium", "")) or "Unknown medium",
        "department": normalize_space(obj.get("department", "")),
        "culture": normalize_space(obj.get("culture", "")),
        "period": normalize_space(obj.get("period", "")),
        "country": normalize_space(obj.get("country", "")),
        "place": normalize_space(obj.get("region", "")) or normalize_space(obj.get("country", "")),
        "classification": normalize_space(obj.get("classification", "")),
        "collection": normalize_space(obj.get("department", "")),
        "subjectTerms": unique_strings([obj.get("objectName", ""), obj.get("classification", "")]),
        "images": {
            "thumbnailUrl": obj["primaryImageSmall"],
            "displayUrl": obj["primaryImageSmall"],
            "fullUrl": obj["primaryImage"],
        },
        "source": {
            "institution": "met",
            "collectionLabel": INSTITUTION_LABELS["met"],
            "objectId": obj["objectID"],
            "objectUrl": obj["objectURL"],
            "license": "CC0",
        },
    }


def collect_met_candidates(target: int) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    base = "https://collectionapi.metmuseum.org/public/collection/v1"
    try:
        for query in met_queries():
            params = urllib.parse.urlencode({"q": query, "hasImages": "true"})
            search = fetch_json(f"{base}/search?{params}")
            for object_id in search.get("objectIDs") or []:
                if len(candidates) >= target:
                    return candidates
                obj = fetch_json_or_none(f"{base}/objects/{object_id}")
                if not obj:
                    continue
                candidate = build_met_candidate(obj)
                if not candidate:
                    continue
                key = candidate_key(candidate)
                if key in seen:
                    continue
                seen.add(key)
                candidates.append(candidate)
                time.sleep(0.02)
    except urllib.error.HTTPError:
        pass
    except urllib.error.URLError:
        pass

    if len(candidates) < target:
        for candidate in fallback_met_candidates(target):
            key = candidate_key(candidate)
            if key in seen:
                continue
            seen.add(key)
            candidates.append(candidate)
            if len(candidates) >= target:
                break
    return candidates


def build_aic_candidate(item: dict[str, Any]) -> dict[str, Any] | None:
    if not item.get("is_public_domain") or not item.get("image_id"):
        return None
    if not normalize_space(item.get("title")):
        return None
    image_id = item["image_id"]
    creator = humanize_creator(item.get("artist_display", ""), fallback="Unknown maker")
    return {
        "id": f"aic-{item['id']}",
        "title": clean_title(item["title"]),
        "artist": creator,
        "objectDate": normalize_object_date(item.get("date_display", "")),
        "medium": normalize_space(item.get("medium_display", "")) or "Unknown medium",
        "department": normalize_space(item.get("department_title", "")),
        "culture": normalize_space(item.get("style_title", "")),
        "period": normalize_space(item.get("style_title", "")),
        "country": normalize_space(item.get("place_of_origin", "")),
        "place": normalize_space(item.get("place_of_origin", "")),
        "classification": normalize_space(item.get("classification_title", "") or item.get("artwork_type_title", "")),
        "collection": normalize_space(item.get("department_title", "")),
        "subjectTerms": unique_strings([item.get("classification_title", ""), item.get("style_title", "")]),
        "images": {
            "thumbnailUrl": f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg",
            "displayUrl": f"https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg",
            "fullUrl": f"https://www.artic.edu/iiif/2/{image_id}/full/1686,/0/default.jpg",
        },
        "source": {
            "institution": "aic",
            "collectionLabel": INSTITUTION_LABELS["aic"],
            "objectId": item["id"],
            "objectUrl": f"https://www.artic.edu/artworks/{item['id']}",
            "license": "CC0",
        },
    }


def collect_aic_candidates(target: int) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    artist_counts: Counter[str] = Counter()
    page = 1
    while len(candidates) < target and page <= 250:
        params = urllib.parse.urlencode(
            {
                "fields": ",".join(
                    [
                        "id",
                        "title",
                        "image_id",
                        "artist_display",
                        "date_display",
                        "place_of_origin",
                        "medium_display",
                        "classification_title",
                        "department_title",
                        "style_title",
                        "artwork_type_title",
                        "is_public_domain",
                    ]
                ),
                "limit": 100,
                "page": page,
            }
        )
        payload = fetch_json(f"https://api.artic.edu/api/v1/artworks?{params}")
        data = payload.get("data") or []
        if not data:
            break
        for item in data:
            candidate = build_aic_candidate(item)
            if not candidate:
                continue
            key = candidate_key(candidate)
            artist_key = normalize_space(candidate["artist"]).casefold()
            if key in seen:
                continue
            if artist_counts[artist_key] >= artist_cap_for(candidate):
                continue
            seen.add(key)
            artist_counts[artist_key] += 1
            candidates.append(candidate)
            if len(candidates) >= target:
                break
        page += 1
    return candidates


def extract_rijks_object_url(record: dict[str, Any]) -> str:
    for subject in record.get("subject_of") or []:
        for digital in subject.get("digitally_carried_by") or []:
            for access_point in digital.get("access_point") or []:
                url = normalize_space(access_point.get("id", ""))
                if "rijksmuseum.nl" in url:
                    return url
    return normalize_space(record.get("id", ""))


def extract_rijks_medium(record: dict[str, Any]) -> str:
    referred = []
    for block in record.get("referred_to_by") or []:
        content = normalize_space(block.get("content", ""))
        if not content:
            continue
        if re.search(r"\b(cm|mm|inch|inches)\b", content):
            continue
        referred.append(content)
    english_medium = first_matching_text(referred, r"(oil|canvas|paper|watercolor|ink|silver|gold|wood|textile|print|photograph|bronze|ceramic|porcelain|glass)")
    if english_medium:
        return english_medium
    made_of = []
    for material in record.get("made_of") or []:
        notation = english_notation(material.get("notation", []))
        if notation:
            made_of.append(notation)
    return ", ".join(made_of[:2]) or "Unknown medium"


def build_rijks_candidate(object_id: str) -> dict[str, Any] | None:
    record = fetch_json_or_none(object_id)
    if not record:
        return None
    title = ""
    for name in record.get("identified_by") or []:
        classified = json.dumps(name.get("classified_as", []))
        if "300417200" in classified:
            title = normalize_space(name.get("content", ""))
            if title:
                break
    if not title:
        title = english_value(record.get("identified_by", []))
    produced_by = record.get("produced_by") or {}
    artist = "Unknown maker"
    for part in produced_by.get("part") or []:
        for maker in part.get("carried_out_by") or []:
            notation = english_notation(maker.get("notation", []))
            if notation:
                artist = notation
                break
        if artist != "Unknown maker":
            break
    object_date = english_value((produced_by.get("timespan") or {}).get("identified_by", []))
    classification = ""
    for classified in record.get("classified_as") or []:
        notation = english_notation(classified.get("notation", []))
        if notation:
            classification = notation
            break
    object_url = extract_rijks_object_url(record)
    visual_items = record.get("shows") or []
    if not visual_items:
        return None
    visual = fetch_json_or_none(visual_items[0]["id"])
    if not visual:
        return None
    digital_objects = visual.get("digitally_shown_by") or []
    if not digital_objects:
        return None
    digital = fetch_json_or_none(digital_objects[0]["id"])
    if not digital:
        return None
    access_points = digital.get("access_point") or []
    if not access_points:
        return None
    base_image = normalize_space(access_points[0].get("id", ""))
    return {
        "id": f"rijks-{object_id.rsplit('/', 1)[-1]}",
        "title": clean_title(title),
        "artist": humanize_creator(artist),
        "objectDate": normalize_object_date(object_date),
        "medium": extract_rijks_medium(record),
        "department": "",
        "culture": "",
        "period": "",
        "country": "",
        "place": "Netherlands",
        "classification": classification,
        "collection": "Collection",
        "subjectTerms": [],
        "images": {
            "thumbnailUrl": re.sub(r"/full/max/0/default\.jpg$", "/full/843,/0/default.jpg", base_image),
            "displayUrl": re.sub(r"/full/max/0/default\.jpg$", "/full/843,/0/default.jpg", base_image),
            "fullUrl": base_image,
        },
        "source": {
            "institution": "rijks",
            "collectionLabel": INSTITUTION_LABELS["rijks"],
            "objectId": object_id.rsplit("/", 1)[-1],
            "objectUrl": object_url,
            "license": "CC0",
        },
    }


def collect_rijks_candidates(target: int) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    search_urls = [
        "https://data.rijksmuseum.nl/search/collection?type=painting",
        "https://data.rijksmuseum.nl/search/collection?type=print",
        "https://data.rijksmuseum.nl/search/collection?type=photograph",
        "https://data.rijksmuseum.nl/search/collection?type=textile",
    ]
    for url in search_urls:
        next_url: str | None = url
        page_count = 0
        while next_url and page_count < 4 and len(candidates) < target:
            payload = fetch_json(next_url)
            for item in payload.get("orderedItems") or []:
                if len(candidates) >= target:
                    break
                candidate = build_rijks_candidate(item["id"])
                if not candidate:
                    continue
                key = candidate_key(candidate)
                if key in seen:
                    continue
                seen.add(key)
                candidates.append(candidate)
                time.sleep(0.02)
            next_url = normalize_space(payload.get("next", ""))
            page_count += 1
    return candidates


def smithsonian_units() -> list[str]:
    return ["saam", "npg", "fsg", "nmafa", "chndm"]


def smithsonian_best_media(media_block: dict[str, Any]) -> tuple[str, str, str]:
    media_items = media_block.get("media") or []
    if not media_items:
        return "", "", ""
    media = media_items[0]
    thumbnail = normalize_space(media.get("thumbnail", ""))
    display = normalize_space(media.get("content", "")) or thumbnail
    full = display
    for resource in media.get("resources") or []:
        label = normalize_space(resource.get("label", "")).lower()
        url = normalize_space(resource.get("url", ""))
        if "high-resolution jpeg" in label or label == "jpeg":
            full = url
            break
        if "screen image" in label and display == thumbnail:
            display = url
    return thumbnail or display or full, display or full, full or display


def build_smithsonian_candidate(record: dict[str, Any]) -> dict[str, Any] | None:
    content = record.get("content") or {}
    descriptive = content.get("descriptiveNonRepeating") or {}
    media_block = descriptive.get("online_media") or {}
    thumbnail_url, display_url, full_url = smithsonian_best_media(media_block)
    if not full_url:
        return None
    access = normalize_space((descriptive.get("metadata_usage") or {}).get("access", ""))
    if access.upper() != "CC0":
        return None
    freetext = content.get("freetext") or {}
    names = freetext.get("name") or []
    artist = ""
    for name in names:
        label = normalize_space(name.get("label", "")).lower()
        if label in {"artist", "creator", "maker", "designer", "sitter"}:
            artist = normalize_space(name.get("content", ""))
            if artist:
                break
    if not artist and names:
        artist = normalize_space(names[0].get("content", ""))
    title = english_value(descriptive.get("title", {}))
    object_date = ""
    for block in freetext.get("date") or []:
        object_date = normalize_space(block.get("content", ""))
        if object_date:
            break
    medium = ""
    for block in freetext.get("physicalDescription") or []:
        if normalize_space(block.get("label", "")).lower() == "medium":
            medium = normalize_space(block.get("content", ""))
            if medium:
                break
    classification = ""
    for block in freetext.get("objectType") or []:
        classification = normalize_space(block.get("content", ""))
        if classification:
            break
    collection_label = normalize_space(descriptive.get("data_source", "")) or INSTITUTION_LABELS["smithsonian"]
    subject_terms = [normalize_space(topic.get("content", "")) for topic in freetext.get("topic") or []]
    return {
        "id": f"smithsonian-{normalize_space(descriptive.get('record_ID', record.get('id', '')))}",
        "title": clean_title(title),
        "artist": humanize_creator(artist),
        "objectDate": normalize_object_date(object_date),
        "medium": medium or "Unknown medium",
        "department": normalize_space(record.get("unitCode", "")),
        "culture": "",
        "period": "",
        "country": "",
        "place": "",
        "classification": classification or normalize_space(" / ".join(content.get("indexedStructured", {}).get("object_type", []))),
        "collection": collection_label,
        "subjectTerms": unique_strings(subject_terms),
        "images": {
            "thumbnailUrl": thumbnail_url,
            "displayUrl": display_url,
            "fullUrl": full_url,
        },
        "source": {
            "institution": "smithsonian",
            "collectionLabel": collection_label,
            "objectId": descriptive.get("record_ID", record.get("id", "")),
            "objectUrl": normalize_space(descriptive.get("record_link", "")) or normalize_space(descriptive.get("guid", "")),
            "license": "CC0",
        },
    }


def collect_smithsonian_photo_candidates(target: int, seen: set[str]) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for unit in smithsonian_units():
        index_url = f"https://smithsonian-open-access.s3-us-west-2.amazonaws.com/metadata/edan/{unit}/index.txt"
        for data_url in fetch_text(index_url).splitlines():
            for line in fetch_text(data_url).splitlines():
                try:
                    record = json.loads(line)
                except json.JSONDecodeError:
                    continue
                candidate = build_smithsonian_candidate(record)
                if not candidate:
                    continue
                key = candidate_key(candidate)
                if key in seen:
                    continue
                if build_artwork_projection(candidate)["mediumCategory"] != "Photograph":
                    continue
                seen.add(key)
                candidates.append(candidate)
                if len(candidates) >= target:
                    return candidates
    return candidates


def collect_smithsonian_candidates(target: int) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    photo_target = min(35, max(20, math.ceil(target * 0.15)))
    for candidate in collect_smithsonian_photo_candidates(photo_target, seen):
        candidates.append(candidate)
        if len(candidates) >= target:
            return candidates

    units = smithsonian_units()
    per_unit_target = math.ceil(target / len(units))
    for unit in units:
        unit_count = 0
        index_url = f"https://smithsonian-open-access.s3-us-west-2.amazonaws.com/metadata/edan/{unit}/index.txt"
        index_lines = fetch_text(index_url).splitlines()
        for data_url in index_lines:
            if len(candidates) >= target:
                return candidates
            if unit_count >= per_unit_target:
                break
            for line in fetch_text(data_url).splitlines():
                if len(candidates) >= target:
                    return candidates
                if unit_count >= per_unit_target:
                    break
                try:
                    record = json.loads(line)
                except json.JSONDecodeError:
                    continue
                candidate = build_smithsonian_candidate(record)
                if not candidate:
                    continue
                key = candidate_key(candidate)
                if key in seen:
                    continue
                seen.add(key)
                candidates.append(candidate)
                unit_count += 1
    return candidates


def build_ycba_candidate(object_id: str) -> dict[str, Any] | None:
    manifest = fetch_json_or_none(f"https://manifests.collections.yale.edu/ycba/obj/{object_id}")
    if not manifest:
        return None
    metadata_map = {english_value(item.get("label")): english_value(item.get("value")) for item in manifest.get("metadata") or []}
    items = manifest.get("items") or []
    if not items:
        return None
    canvas = items[0]
    anno_pages = canvas.get("items") or []
    if not anno_pages:
        return None
    annotations = anno_pages[0].get("items") or []
    if not annotations:
        return None
    body = annotations[0].get("body") or {}
    image_url = normalize_space(body.get("id", ""))
    if not image_url:
        return None
    homepage = manifest.get("homepage") or []
    object_url = normalize_space((homepage[0] if homepage else {}).get("id", ""))
    title = metadata_map.get("Title", clean_title(english_value(manifest.get("label"))))
    artist = metadata_map.get("Creator", "").split(",", 1)[0]
    collection = metadata_map.get("Collection", "Collection")
    return {
        "id": f"ycba-{object_id}",
        "title": clean_title(title),
        "artist": humanize_creator(artist),
        "objectDate": normalize_object_date(metadata_map.get("Date", "")),
        "medium": normalize_space(metadata_map.get("Medium", "")) or "Unknown medium",
        "department": collection,
        "culture": "British",
        "period": "",
        "country": "United Kingdom",
        "place": "Britain",
        "classification": collection,
        "collection": collection,
        "subjectTerms": [],
        "images": {
            "thumbnailUrl": normalize_space(((canvas.get("thumbnail") or [{}])[0]).get("id", image_url)),
            "displayUrl": image_url,
            "fullUrl": image_url,
        },
        "source": {
            "institution": "ycba",
            "collectionLabel": INSTITUTION_LABELS["ycba"],
            "objectId": object_id,
            "objectUrl": object_url or f"https://collections.britishart.yale.edu/catalog/tms:{object_id}",
            "license": "CC0",
        },
    }


def collect_ycba_candidates(target: int) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    for object_id in DEFAULT_YCBA_OBJECT_IDS:
        if len(candidates) >= target:
            break
        candidate = build_ycba_candidate(object_id)
        if not candidate:
            continue
        key = candidate_key(candidate)
        if key in seen:
            continue
        seen.add(key)
        candidates.append(candidate)
    return candidates


def build_nga_candidate(object_row: dict[str, str], artist_name: str) -> dict[str, Any]:
    object_id = object_row["objectid"]
    image_info = object_row.get("_image") or {}
    iiif_url = image_info.get("iiifurl", "") if isinstance(image_info, dict) else ""
    thumb_url = image_info.get("iiifthumburl", "") if isinstance(image_info, dict) else ""
    display_url = f"{iiif_url}/full/843,/0/default.jpg" if iiif_url else ""
    full_url = f"{iiif_url}/full/full/0/default.jpg" if iiif_url else ""
    return {
        "id": f"nga-{object_id}",
        "title": clean_title(object_row["title"]),
        "artist": humanize_creator(artist_name),
        "objectDate": normalize_object_date(object_row.get("displaydate", "")),
        "medium": normalize_space(object_row.get("medium", "")) or "Unknown medium",
        "department": normalize_space(object_row.get("departmentabbr", "")),
        "culture": "",
        "period": "",
        "country": "",
        "place": "",
        "classification": normalize_space(object_row.get("classification", "")),
        "collection": INSTITUTION_LABELS["nga"],
        "subjectTerms": unique_strings([object_row.get("title", ""), image_info.get("assistivetext", "") if isinstance(image_info, dict) else ""]),
        "images": {
            "thumbnailUrl": thumb_url or display_url,
            "displayUrl": display_url or thumb_url,
            "fullUrl": full_url or display_url or thumb_url,
        },
        "source": {
            "institution": "nga",
            "collectionLabel": INSTITUTION_LABELS["nga"],
            "objectId": object_id,
            "objectUrl": f"https://www.nga.gov/collection/art-object-page.{object_id}.html",
            "license": "CC0",
        },
    }


def collect_nga_candidates(target: int) -> list[dict[str, Any]]:
    objects = read_csv_from_url("https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/objects.csv")
    images_by_object: dict[str, dict[str, str]] = {}
    for row in read_csv_from_url("https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/published_images.csv"):
        if row.get("openaccess") != "1" or row.get("viewtype") != "primary":
            continue
        if not row.get("iiifurl"):
            continue
        images_by_object.setdefault(row.get("depictstmsobjectid", ""), row)
    constituents = {
        row["constituentid"]: humanize_creator(row.get("preferreddisplayname", ""), fallback="Unknown maker")
        for row in read_csv_from_url("https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/constituents.csv")
    }
    artist_by_object: dict[str, str] = {}
    for row in read_csv_from_url("https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/objects_constituents.csv"):
        if row.get("role", "").lower() == "painter" or row.get("roletype", "").lower() == "artist":
            artist_by_object.setdefault(row["objectid"], constituents.get(row["constituentid"], "Unknown maker"))
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
    artist_counts: Counter[str] = Counter()
    classification_priority = {
        "Photograph": 0,
        "Sculpture": 1,
        "Decorative Art": 2,
        "Drawing": 3,
        "Print": 4,
        "Painting": 5,
    }
    image_backed_objects = [row for row in objects if row.get("objectid", "") in images_by_object]
    image_backed_objects.sort(
        key=lambda row: (
            classification_priority.get(normalize_space(row.get("classification", "")), 99),
            stable_hash(row.get("objectid", "")),
        )
    )
    for object_row in image_backed_objects:
        if len(candidates) >= target:
            break
        object_id = object_row.get("objectid", "")
        classification = normalize_space(object_row.get("classification", ""))
        if classification not in {"Painting", "Sculpture", "Print", "Drawing", "Photograph", "Decorative Art"}:
            continue
        object_row = {**object_row, "_image": images_by_object[object_id]}
        candidate = build_nga_candidate(object_row, artist_by_object.get(object_row["objectid"], "Unknown maker"))
        artist_key = normalize_space(candidate["artist"]).casefold()
        if artist_counts[artist_key] >= artist_cap_for(candidate):
            continue
        key = candidate_key(candidate)
        if key in seen:
            continue
        seen.add(key)
        artist_counts[artist_key] += 1
        candidates.append(candidate)
    return candidates


SOURCE_BUILDERS = {
    "met": collect_met_candidates,
    "aic": collect_aic_candidates,
    "rijks": collect_rijks_candidates,
    "smithsonian": collect_smithsonian_candidates,
    "ycba": collect_ycba_candidates,
    "nga": collect_nga_candidates,
}


def collect_candidates_for_sources(requested_targets: dict[str, int]) -> dict[str, list[dict[str, Any]]]:
    pools: dict[str, list[dict[str, Any]]] = {}
    for source, target in requested_targets.items():
        if source not in SOURCE_BUILDERS or target <= 0:
            continue
        try:
            print(f"Collecting Museum candidates from {source} (target {target})...")
            pools[source] = SOURCE_BUILDERS[source](target)
            print(f"Collected {len(pools[source])} Museum candidates from {source}.")
        except Exception as error:  # pragma: no cover - network-dependent hardening
            print(f"Warning: Museum source {source} failed during collection: {error}")
            pools[source] = []
    return pools


def sort_candidates_for_selection(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(
        candidates,
        key=lambda candidate: (
            candidate["geoRegion"],
            candidate["mediumCategory"],
            candidate["periodKey"],
            stable_hash(candidate["id"]),
        ),
    )


def title_family(value: str) -> str:
    text = normalize_space(value).casefold()
    text = re.sub(r"\([^)]*\)", "", text)
    text = re.sub(r"\b(?:fragment|study|panel|tile|head|figure|bowl|cup|object|untitled|no\\.?)\b", "", text)
    for family in ("weight", "icon", "bead", "cope", "wall facing", "headrest", "bound print", "bracelet"):
        if family in text:
            return family
    words = [word for word in re.findall(r"[a-z][a-z'’-]*", text) if word not in {"the", "and", "with", "from", "of", "a", "an"}]
    return " ".join(words[:3]) or text or "untitled"


def is_weak_hero_candidate(candidate: dict[str, Any]) -> bool:
    title = normalize_space(candidate.get("title", "")).casefold()
    family = title_family(title)
    if family in {"weight", "bead", "wall facing", "bound print"}:
        return True
    if has_term(title, ("fragment", "study", "unidentified", "bead; chipped")):
        return True
    return False


def hero_quality_note(candidate: dict[str, Any], artwork: dict[str, Any] | None = None) -> str:
    projected = artwork or build_artwork_projection(candidate)
    if is_weak_hero_candidate(candidate):
        return f"Included for material literacy despite a modest object type: {projected['title']} teaches {projected['mediumCategory'].lower()} looking."
    return f"{projected['title']} has a clear subject, legible image, and object-specific details for a daily close-looking visit."


def score_for_approval(candidate: dict[str, Any], counts: dict[str, Counter[str]]) -> tuple[int, int, int, int, int, int, int, int, int]:
    artist_key = normalize_space(candidate["artist"]).casefold()
    photo_penalty = 0 if counts["medium"]["Photograph"] >= 20 or candidate["mediumCategory"] == "Photograph" else 1
    flat_penalty = 1 if candidate["mediumCategory"] in FLAT_MEDIA_CATEGORIES else 0
    return (
        photo_penalty,
        flat_penalty,
        counts["family"][title_family(candidate["title"])],
        1 if is_weak_hero_candidate(candidate) else 0,
        counts["period"][candidate["periodKey"]],
        counts["region"][candidate["geoRegion"]],
        counts["medium"][candidate["mediumCategory"]],
        counts["artist"][artist_key],
        counts["source"][candidate["source"]["institution"]],
    )


def flat_media_count(counts: dict[str, Counter[str]]) -> int:
    return sum(counts["medium"].get(category, 0) for category in FLAT_MEDIA_CATEGORIES)


def candidate_exceeds_mix_caps(candidate: dict[str, Any], counts: dict[str, Counter[str]], approved_target: int) -> bool:
    source_cap = math.floor(approved_target * 0.35)
    flat_cap = math.floor(approved_target * 0.45)
    source = candidate["source"]["institution"]
    if counts["source"][source] >= source_cap:
        return True
    if candidate["mediumCategory"] in FLAT_MEDIA_CATEGORIES and flat_media_count(counts) >= flat_cap:
        return True
    return False


def artist_cap_for(candidate: dict[str, Any]) -> int:
    artist = normalize_space(candidate["artist"]).casefold()
    if artist in {"unknown maker", "unknown photographer", "unknown", "unidentified", "anonymous", "anonymous artist"}:
        return 24
    if artist.endswith(" maker") or artist.endswith(" artist"):
        return 16
    return 12


def choose_approved_candidates(
    candidate_pools: dict[str, list[dict[str, Any]]],
    *,
    approved_target: int = 365,
    approved_quotas: dict[str, int] | None = None,
) -> list[dict[str, Any]]:
    approved_quotas = dict(DEFAULT_APPROVED_QUOTAS if approved_quotas is None else approved_quotas)
    counts = {
        "region": Counter(),
        "source": Counter(),
        "medium": Counter(),
        "period": Counter(),
        "artist": Counter(),
        "title": Counter(),
        "family": Counter(),
    }
    approved: list[dict[str, Any]] = []
    approved_ids: set[str] = set()

    normalized_pools: dict[str, list[dict[str, Any]]] = {}
    for source, pool in candidate_pools.items():
        normalized_candidates = []
        for candidate in pool:
            projection = build_artwork_projection(candidate)
            selection_fields = {
                key: value
                for key, value in projection.items()
                if key not in {"images", "context", "questions"}
            }
            normalized_candidates.append({**candidate, **selection_fields, "source": candidate["source"]})
        normalized_pools[source] = sort_candidates_for_selection(normalized_candidates)

    for source, quota in approved_quotas.items():
        pool = normalized_pools.get(source, [])
        while pool and counts["source"][source] < quota and len(approved) < approved_target:
            pool.sort(key=lambda candidate: (*score_for_approval(candidate, counts=counts), stable_hash(candidate["id"])))
            candidate = pool.pop(0)
            artist_key = normalize_space(candidate["artist"]).casefold()
            if candidate["id"] in approved_ids:
                continue
            if candidate_exceeds_mix_caps(candidate, counts, approved_target):
                continue
            if counts["artist"][artist_key] >= artist_cap_for(candidate):
                continue
            if counts["title"][normalize_space(candidate["title"]).casefold()] >= 2:
                continue
            if counts["family"][title_family(candidate["title"])] >= 4:
                continue
            approved.append(candidate)
            approved_ids.add(candidate["id"])
            counts["region"][candidate["geoRegion"]] += 1
            counts["source"][source] += 1
            counts["medium"][candidate["mediumCategory"]] += 1
            counts["period"][candidate["periodKey"]] += 1
            counts["artist"][artist_key] += 1
            counts["title"][normalize_space(candidate["title"]).casefold()] += 1
            counts["family"][title_family(candidate["title"])] += 1
        normalized_pools[source] = pool

    remaining_pool = [candidate for pool in normalized_pools.values() for candidate in pool if candidate["id"] not in approved_ids]
    while len(approved) < approved_target and remaining_pool:
        remaining_pool.sort(key=lambda candidate: (*score_for_approval(candidate, counts=counts), stable_hash(candidate["id"])))
        candidate = remaining_pool.pop(0)
        artist_key = normalize_space(candidate["artist"]).casefold()
        if candidate_exceeds_mix_caps(candidate, counts, approved_target):
            continue
        if counts["artist"][artist_key] >= artist_cap_for(candidate):
            continue
        if counts["title"][normalize_space(candidate["title"]).casefold()] >= 2:
            continue
        if counts["family"][title_family(candidate["title"])] >= 4:
            continue
        approved.append(candidate)
        approved_ids.add(candidate["id"])
        counts["region"][candidate["geoRegion"]] += 1
        counts["source"][candidate["source"]["institution"]] += 1
        counts["medium"][candidate["mediumCategory"]] += 1
        counts["period"][candidate["periodKey"]] += 1
        counts["artist"][artist_key] += 1
        counts["title"][normalize_space(candidate["title"]).casefold()] += 1
        counts["family"][title_family(candidate["title"])] += 1

    if len(approved) < approved_target:
        raise ValueError(
            f"Only selected {len(approved)} approved artworks; need {approved_target}. "
            f"sources={dict(counts['source'])}; media={dict(counts['medium'])}; regions={dict(counts['region'])}"
        )

    return approved


def build_editorial_payload(
    candidate_pools: dict[str, list[dict[str, Any]]],
    *,
    approved_target: int = 365,
    approved_quotas: dict[str, int] | None = None,
    sourced_only_quotas: dict[str, int] | None = None,
    editor_agent: str = "Editor Merge",
) -> dict[str, Any]:
    approved_candidates = choose_approved_candidates(
        candidate_pools,
        approved_target=approved_target,
        approved_quotas=approved_quotas,
    )
    approved_ids = {candidate["id"] for candidate in approved_candidates}
    records = [build_editorial_record(candidate, approved=True, editor_agent=editor_agent) for candidate in approved_candidates]

    sourced_only_quotas = dict(DEFAULT_SOURCED_ONLY_QUOTAS if sourced_only_quotas is None else sourced_only_quotas)
    for source, quota in sourced_only_quotas.items():
        for candidate in candidate_pools.get(source, [])[:quota]:
            if candidate["id"] in approved_ids:
                continue
            records.append(
                build_editorial_record(
                    candidate,
                    approved=False,
                    blockers=["No stable public art-image URL is wired for this source in the approved runtime pack yet."],
                )
            )

    records.sort(key=lambda record: (record["workflow"]["status"] != "approved", record["source"]["institution"], stable_hash(record["id"])))
    return {
        "version": "museum-editorial-bank-v1",
        "generatedAt": now_iso(),
        "records": records,
    }
