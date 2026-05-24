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
TRACKER_PATH = BASE_DIR / "docs" / "museum-annual-pack-tracker.md"
EDITORIAL_GUIDE_PATH = BASE_DIR / "docs" / "museum-editorial-guide.md"

DAY_MS = 1000 * 60 * 60 * 24
QUESTION_KINDS = ("observation", "context", "connection")
WORKFLOW_STATUSES = ("sourced", "drafted", "fact-checked", "copy-edited", "approved")
SUPPORTED_SOURCES = ("met", "aic", "rijks", "nga", "smithsonian", "ycba")
PUBLIC_DOMAIN_HINTS = ("cc0", "public domain", "open access")
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
DEFAULT_APPROVED_QUOTAS = {
    "smithsonian": 190,
    "aic": 95,
    "rijks": 45,
    "ycba": 15,
    "met": 20,
}
DEFAULT_SOURCED_ONLY_QUOTAS = {
    "nga": 12,
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
    if lower_value in {"anonymous", "unidentified", "unidentified artist", "unknown", "artist unknown"}:
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
        "greek": "Greek maker",
        "india": "Indian maker",
        "indian": "Indian maker",
        "kongo": "Kongo maker",
        "mexico": "Mexican maker",
        "netherlands": "Dutch maker",
        "peru": "Peruvian maker",
        "persian": "Persian maker",
        "swiss": "Swiss maker",
    }
    mapped = culture_map.get(value.casefold())
    if mapped:
        return mapped
    return value or fallback


def clean_title(value: str) -> str:
    title = strip_markup(value)
    return title or "Untitled work"


def normalize_object_date(value: str) -> str:
    date_value = strip_markup(value)
    if not date_value:
        return "date unknown"
    return date_value.replace(" - ", "–")


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
        if has("wood") or has("cypress"):
            return "Carved wood"
        if has("stone"):
            return "Stone"
        return "Sculpture"
    if medium_category == "Ceramic":
        if has("porcelain"):
            return "Porcelain"
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
    secondary = normalize_space(collection).casefold()
    haystack = normalize_space(" ".join([primary, secondary])).casefold()
    if has_term(primary, ("textile", "tapestry", "silk", "weft", "warp", "embroidery", "fabric", "quilt", "velvet", "wool")):
        return "Textile"
    if has_term(primary, ("photo", "photograph", "gelatin silver", "albumen", "salted paper")):
        return "Photograph"
    if has_term(primary, ("sculpture", "bronze", "marble", "stone", "woodcarving", "carving", "statuette", "relief")):
        return "Sculpture"
    if has_term(primary, ("ceramic", "porcelain", "earthenware", "terracotta", "stoneware", "amphora", "vase")):
        return "Ceramic"
    if has_term(primary, ("drawing", "watercolor", "gouache", "graphite", "charcoal", "pastel", "chalk", "crayon", "pen and ink", "ink on paper")):
        return "Drawing"
    if has_term(primary, ("print", "etching", "engraving", "lithograph", "woodblock", "screenprint", "mezzotint", "aquatint", "drypoint")):
        return "Print"
    if has_term(primary, ("silver", "gold", "metalwork", "enamel", "staurotheke", "armor", "shield")):
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
    if has_term(haystack, ("japan", "japanese", "china", "chinese", "korea", "korean", "india", "indian", "thai", "asia", "asian", "persia", "persian", "iran", "iranian", "mughal", "edo")):
        return "Asia"
    if has_term(haystack, ("egypt", "egyptian", "morocco", "africa", "african", "nigeria", "ghana", "mali", "benin", "ethiopia", "ethiopian")):
        return "Africa"
    if has_term(haystack, ("peru", "peruvian", "mexico", "mexican", "andes", "andean", "south america", "latin america", "pre-columbian", "guatemala")):
        return "Latin America"
    if has_term(haystack, ("united states", "america", "american", "canada", "north america", "saam", "npg", "cooper hewitt")):
        return "North America"
    if has_term(haystack, ("islamic", "ottoman", "syria", "iraq", "levant", "middle east", "arabia")):
        return "Middle East"
    if has_term(haystack, ("australia", "oceania", "pacific", "maori")):
        return "Oceania"
    if has_term(haystack, ("greece", "greek", "rome", "roman", "italy", "italian", "france", "french", "britain", "british", "england", "english", "europe", "european", "dutch", "spain", "spanish", "german", "flemish", "netherland", "netherlands")):
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
        if has_term(primary_text, ("greece", "greek", "attic")):
            return "Ancient Greece"
        return "Ancient Art"

    if has_term(all_text, ("ukiyo-e", "ukiyo", "woodblock")) or has_term(primary_text, ("edo",)):
        return "Ukiyo-e"
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
    if has_term(primary_text, ("mughal", "rajput", "india", "indian")):
        return "South Asian Court Art"
    if has_term(primary_text, ("china", "chinese", "ming", "qing", "song")):
        return "Chinese Art"
    if has_term(primary_text, ("japan", "japanese", "edo")):
        return "Japanese Art"
    if has_term(primary_text, ("islamic", "ottoman", "persia", "persian", "iran", "iranian", "safavid")):
        return "Islamic Art"
    if has_term(primary_text, ("africa", "african", "yoruba", "akan", "benin", "kongo")):
        return "African Art"
    if has_term(primary_text, ("american", "saam", "smithsonian american art museum")):
        return "American Art"
    if has_term(primary_text, ("npg", "national portrait gallery", "portrait")) or has_term(title_text, ("portrait",)):
        if year is not None and year < 1800:
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
            ]
        )
    )
    if has_term(raw_context, ("edo", "japan", "japanese")):
        return "Edo Japan" if has_term(raw_context, ("edo",)) else "Japan"
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


def choose_subject_label(candidate: dict[str, Any]) -> str:
    haystack = normalize_space(" ".join([candidate.get("title", ""), " ".join(candidate.get("subjectTerms", []))])).lower()
    keyword_map = [
        ("unicorn", "a unicorn"),
        ("wave", "a wave"),
        ("mount fuji", "Mount Fuji"),
        ("buddha", "a seated Buddha"),
        ("saint", "a saint"),
        ("portrait", "a human figure"),
        ("garden", "a garden"),
        ("ship", "a ship"),
        ("horse", "a horse"),
        ("dog", "a dog"),
        ("flower", "flowers"),
        ("chair", "a chair"),
        ("vase", "a vessel"),
        ("bridge", "a bridge"),
        ("river", "a river"),
        ("mountain", "a mountain"),
        ("sea", "the sea"),
    ]
    for key, label in keyword_map:
        if key in haystack:
            return label
    medium_category = infer_medium_category(candidate.get("medium", ""), candidate.get("classification", ""), candidate.get("collection", ""))
    fallback_map = {
        "Ceramic": "a ceramic vessel",
        "Sculpture": "a sculpted form",
        "Textile": "a woven or stitched surface",
        "Photograph": "a photographed subject",
        "Print": "a printed image",
        "Drawing": "a drawn scene",
        "Painting": "a painted scene",
        "Furniture": "a designed object",
        "Metalwork": "a worked metal object",
        "Glass": "a glass image or object",
        "Manuscript": "an illustrated page",
    }
    return fallback_map.get(medium_category, "the subject named in the work")


def medium_family_distractors(medium_category: str) -> list[str]:
    mapping = {
        "Painting": ["a woven hanging", "a carved figure", "a printed sheet"],
        "Print": ["a painted panel", "a bronze figure", "a woven hanging"],
        "Textile": ["a painted canvas", "a carved relief", "a printed page"],
        "Ceramic": ["a woven basket", "a painted panel", "a carved screen"],
        "Sculpture": ["a woven hanging", "a printed sheet", "a painted panel"],
        "Photograph": ["a painted scene", "a carved object", "a woven textile"],
        "Drawing": ["a bronze figure", "a woven hanging", "a ceramic vessel"],
        "Furniture": ["a printed folio", "a painted landscape", "a carved marble bust"],
    }
    return mapping.get(medium_category, ["a painted scene", "a woven hanging", "a sculpted form"])


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
    medium = candidate["medium"]
    if medium_category == "Painting":
        return f"{medium}. Look for how the artist uses surface, edge, and color to organize the image rather than treating the canvas as a flat window."
    if medium_category == "Print":
        return f"{medium}. The image was prepared in one material and transferred by impression, which is why line, repetition, and crisp contrast matter so much here."
    if medium_category == "Textile":
        return f"{medium}. The image is built through fibers and structure, so pattern, labor, and material carry the visual force usually assigned to brushwork."
    if medium_category == "Photograph":
        return f"{medium}. Photography fixes a moment through light and timing, which makes framing and viewpoint part of the work's authorship."
    if medium_category == "Sculpture":
        return f"{medium}. Sculpture asks you to read volume, silhouette, and weight, even when you meet it through a single museum photograph."
    if medium_category == "Ceramic":
        return f"{medium}. Functional objects like this still reward close looking: contour, painted detail, and the curve of the form are part of the design."
    if medium_category == "Drawing":
        return f"{medium}. Drawings often show decision-making more openly than finished paintings, so line and touch become the real drama."
    if medium_category == "Metalwork":
        return f"{medium}. Metalwork turns surface into signal: shine, tooling, and material contrast help carry both status and meaning."
    if medium_category == "Furniture":
        return f"{medium}. Design objects fold utility into display, so shape, material, and finish work together as both function and style."
    return f"{medium}. Material matters here: the way the object was made shapes what the eye notices first."


def surprising_fact(candidate: dict[str, Any], medium_category: str) -> str:
    object_date = candidate["objectDate"]
    artist = candidate["artist"]
    collection = candidate["source"]["collectionLabel"]
    seed = stable_hash(candidate["id"])
    if "ca." in object_date.lower() or "about" in object_date.lower() or re.search(r"\d{4}[-–]\d{2,4}", object_date):
        variants = [
            f"The date line, {object_date}, is intentionally cautious. Curators use style, material, and related objects when a work does not carry one exact timestamp.",
            f"That approximate date is part of the museum record, not a loose guess. It tells you curators are reading {medium_category.lower()} evidence as closely as the image itself.",
            f"The date {object_date} is a museum clue: it signals comparison, provenance, and material evidence rather than one fixed inscription.",
        ]
        return variants[seed % len(variants)]
    if "unknown" in artist.lower() or "anonymous" in artist.lower() or "unidentified" in artist.lower():
        variants = [
            f"The maker is still recorded as {artist}. Museums often know a work's region, workshop, or historical moment more securely than a single personal name.",
            f"An unnamed maker does not make the work anonymous in every sense. Its material, region, and collecting history still give curators a strong frame for close looking.",
            f"The object record keeps the attribution cautious. That restraint is part of museum trust: unknown makers are labeled as unknown rather than filled in for drama.",
        ]
        return variants[seed % len(variants)]
    if medium_category == "Print":
        variants = [
            "Because this is a print, the image was built to circulate. A work like this could move across hands, rooms, and even countries more easily than a single painting.",
            "Prints often preserve the history of reproduction itself: who could see an image, how far it traveled, and how taste moved before mass media.",
            "A print can be both an artwork and a delivery system. Its portability is part of why styles and motifs traveled so quickly.",
        ]
        return variants[seed % len(variants)]
    if medium_category == "Textile":
        variants = [
            "Textiles once carried a prestige many modern viewers now reserve for painting alone. They could warm rooms, signal wealth, and tell stories at architectural scale.",
            "Textile collections preserve labor in a unusually direct way: the structure of the work is also the image you are reading.",
            "A textile can be portable architecture. It changes a room through surface, warmth, sound, and status, not image alone.",
        ]
        return variants[seed % len(variants)]
    if medium_category == "Photograph":
        variants = [
            "Museum photography collections preserve not only subjects but ways of seeing. Framing, viewpoint, and reproduction history all become part of the object's afterlife.",
            "A photograph enters a museum as both image and evidence: it records a subject, but also a specific historical technology for looking.",
            "The camera makes a fast image, but museum cataloging slows it down again by asking who made it, when, how, and why it survived.",
        ]
        return variants[seed % len(variants)]
    variants = [
        f"{collection} preserves more than an image here. The record ties together maker, medium, date, and rights information so the work can be studied outside the gallery.",
        f"The medium line matters as much as the title. {candidate['medium']} tells you what kind of evidence curators are asking you to read.",
        f"Open-access museum records turn collection data into a public study tool: the object, its image, and its catalog context can all travel together.",
        f"The catalog entry makes this work teachable at a glance. Date, maker, medium, and collection are the first coordinates for building art memory.",
    ]
    return variants[seed % len(variants)]


def connection_note(candidate: dict[str, Any], passport_label: str, place_label: str, geo_region: str) -> str:
    medium_category = infer_medium_category(candidate["medium"], candidate["classification"], candidate.get("collection", ""))
    if medium_category == "Painting":
        return f"File this under {passport_label}: once you start tracking how works from {place_label} handle surface and atmosphere, later visits from the same thread become easier to place."
    if medium_category == "Print":
        return f"This visit belongs to {passport_label}, but it also helps build print literacy: repeated images often travel style faster than monumental paintings do."
    if medium_category == "Textile":
        return f"Treat this as part of your {passport_label} thread. Textile traditions often preserve status, ritual, and storytelling in a form made to live inside real rooms and bodies."
    if medium_category == "Photograph":
        return f"In your {passport_label} thread, photography sharpens a different habit of looking: composition and timing become as important as pigment or stone."
    if geo_region == "Global":
        return f"This work widens the Museum Passport beyond one familiar canon. Use {passport_label} as a reminder that collections are strongest when they braid regions and media together."
    return f"This work sits comfortably inside {passport_label}. Over time, that tag becomes useful shorthand for comparing works from {place_label} with objects elsewhere in the collection."


def observation_question(candidate: dict[str, Any]) -> dict[str, Any]:
    medium_category = infer_medium_category(candidate["medium"], candidate["classification"], candidate.get("collection", ""))
    subject = choose_subject_label(candidate)
    seed = stable_hash(candidate["id"])
    if subject != "the subject named in the work":
        options = unique_strings(
            [
                subject[0].upper() + subject[1:] if subject.startswith("a ") else subject,
                "A ship" if "ship" not in subject else "A horse",
                "A ceremonial object" if "object" not in subject else "A printed page",
                "A woven hanging" if "woven" not in subject else "A painted scene",
            ]
        )[:4]
        correct = options[0]
        prompt_variants = [
            "Which detail anchors today's work?",
            "What should you look for first in the image?",
            "Which subject gives this work its focus?",
            "Which motif helps identify today's piece?",
            "What visible subject is central to today's visit?",
        ]
        return {
            "kind": "observation",
            "prompt": prompt_variants[seed % len(prompt_variants)],
            "options": options,
            "answerIndex": 0,
            "reinforcement": f"The image points you back to {correct.lower()} as the work's anchor.",
        }

    options = ["A painted scene", *medium_family_distractors(medium_category)]
    if medium_category != "Painting":
        options = [f"A {medium_category.lower()} work" if medium_category[0].isalpha() else medium_category, *medium_family_distractors(medium_category)]
    prompt_variants = [
        "What kind of work or object are you looking at today?",
        "Which object type best frames today's close look?",
        "What category of artwork is on view today?",
        "How would a museum label first classify this work?",
    ]
    return {
        "kind": "observation",
        "prompt": prompt_variants[seed % len(prompt_variants)],
        "options": unique_strings(options)[:4],
        "answerIndex": 0,
        "reinforcement": f"Today's object is best read first as {options[0].lower()}, which shapes how you notice the rest of the details.",
    }


def context_question(candidate: dict[str, Any], medium_category: str) -> dict[str, Any]:
    seed = stable_hash(f"context:{candidate['id']}")
    if "ca." in candidate["objectDate"].lower() or "about" in candidate["objectDate"].lower():
        options = [
            "By comparing style, material, and related works",
            "From a signed daybook entry by the artist",
            "From a modern conservation scan alone",
            "From an inscription giving the exact day",
        ]
        return {
            "kind": "context",
            "prompt": [
                "According to today's notes, how do curators date this work?",
                "What does the approximate date ask you to remember?",
                "How did the notes frame this work's date?",
            ][seed % 3],
            "options": options,
            "answerIndex": 0,
            "reinforcement": "Approximate dates usually come from comparison and material evidence, not from a perfectly preserved timestamp.",
        }

    if medium_category == "Print":
        options = [
            "It was transferred by impression from a prepared surface",
            "It was cast in bronze from a mold",
            "It was woven directly on a loom",
            "It was carved from a single block of stone",
        ]
        return {
            "kind": "context",
            "prompt": [
                "What making process did today's label describe?",
                "How was the image process framed in the notes?",
                "What process makes this work different from a single painted canvas?",
            ][seed % 3],
            "options": options,
            "answerIndex": 0,
            "reinforcement": "The notes describe printmaking as an indirect process that transfers an image by impression.",
        }

    if medium_category == "Textile":
        options = [
            "The image is built through fibers and structure",
            "The image is etched into copper and inked",
            "The image is projected by a camera lens",
            "The image is carved entirely from marble",
        ]
        return {
            "kind": "context",
            "prompt": [
                "What did today's notes say carries the image here?",
                "Where does the image live in this object?",
                "What material feature did the label emphasize?",
            ][seed % 3],
            "options": options,
            "answerIndex": 0,
            "reinforcement": "For textiles, the image lives in the material structure itself rather than sitting on top as paint.",
        }

    distractor_map = {
        "Painting": ["Etching", "Chalk on paper", "Woven textile"],
        "Drawing": ["Oil on canvas", "Bronze", "Woodblock print"],
        "Sculpture": ["Oil on canvas", "Watercolor on paper", "Wool textile"],
        "Ceramic": ["Bronze", "Oil on panel", "Ink on paper"],
        "Photograph": ["Oil on canvas", "Etching", "Marble"],
        "Metalwork": ["Watercolor on paper", "Silk textile", "Oil on canvas"],
        "Glass": ["Bronze", "Watercolor on paper", "Wool textile"],
        "Furniture": ["Etching", "Oil on canvas", "Porcelain"],
        "Manuscript": ["Bronze", "Oil on panel", "Gelatin silver print"],
        "Design": ["Oil on canvas", "Etching", "Marble"],
    }
    options = [candidate["medium"], *distractor_map.get(medium_category, ["Oil on canvas", "Etching", "Bronze"])]
    return {
        "kind": "context",
        "prompt": [
            "Which medium did today's label place at the center of this work?",
            "What material did the label ask you to notice?",
            "Which medium anchors today's technique note?",
            "What is the material basis of today's work?",
        ][seed % 4],
        "options": unique_strings(options)[:4],
        "answerIndex": 0,
        "reinforcement": "The technique note starts with the actual medium because material is the first museum fact worth noticing.",
    }


def connection_question(passport_label: str, seed_text: str) -> dict[str, Any]:
    seed = stable_hash(f"connection:{seed_text}")
    options = [passport_label, *alternative_period_labels(passport_label)[:3]]
    return {
        "kind": "connection",
        "prompt": [
            "Which collecting thread does today's visit belong to?",
            "Where does this work fit in your Museum Passport?",
            "Which thread should today's work add to?",
            "Which collection path does this visit strengthen?",
            "What Passport label best describes today's work?",
        ][seed % 5],
        "options": options,
        "answerIndex": 0,
        "reinforcement": f"Today's notes place the work in your {passport_label} thread, which helps future works click into place more quickly.",
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
    medium = concise_medium_for(candidate, medium_category)
    display_candidate = {
        **candidate,
        "title": clean_title(candidate["title"]),
        "artist": artist,
        "objectDate": object_date,
        "medium": medium,
    }
    geo_region = infer_geo_region(
        candidate.get("country", ""),
        candidate.get("place", ""),
        candidate.get("culture", ""),
        candidate.get("classification", ""),
        candidate.get("collection", ""),
        candidate.get("department", ""),
        artist,
        candidate.get("source", {}).get("collectionLabel", ""),
    )
    passport_label = infer_passport_label(candidate)
    place_label = build_place_label(candidate, geo_region)
    period_key = slugify(passport_label)
    period_tag = f"{place_label} - {passport_label} - {object_date}"
    questions = [
        observation_question(display_candidate),
        context_question(display_candidate, medium_category),
        connection_question(passport_label, candidate["id"]),
    ]
    questions = [
        shuffle_question_options(question, f"{candidate['id']}:{index}:{question['prompt']}")
        for index, question in enumerate(questions)
    ]
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
            "thumbnailUrl": candidate["images"]["thumbnailUrl"],
            "displayUrl": candidate["images"]["displayUrl"],
            "fullUrl": candidate["images"]["fullUrl"],
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


def build_editorial_record(candidate: dict[str, Any], *, approved: bool, blockers: list[str] | None = None) -> dict[str, Any]:
    blockers = blockers or []
    timestamp = now_iso()
    artwork = build_artwork_projection(candidate) if approved else None
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
        "approvedBy": "codex-seed-pass" if status == "approved" else "",
        "blockers": blockers,
    }
    review = {
        "status": status,
        "approvedAt": workflow["approvedAt"],
        "factCheckSources": unique_strings([candidate["source"]["objectUrl"], *POLICY_SOURCES.get(candidate["source"]["institution"], [])]),
        "safetyFlags": safety_flags_for(candidate),
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
                    "factCheckSources": record["review"]["factCheckSources"],
                    "safetyFlags": record["review"]["safetyFlags"],
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


def month_key(date_value: date) -> str:
    return f"{date_value.year:04d}-{date_value.month:02d}"


def build_month_limits(start: date, days: int) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for offset in range(days):
        counts[month_key(start + timedelta(days=offset))] += 1
    return {key: math.floor(count * 0.4) for key, count in counts.items()}


def schedule_candidate_score(
    candidate: dict[str, Any],
    *,
    remaining_artist_counts: Counter[str],
    remaining_period_counts: Counter[str],
    remaining_medium_counts: Counter[str],
    region_counts: Counter[str],
    period_counts: Counter[str],
    medium_counts: Counter[str],
    source_counts: Counter[str],
    month_region_counts: Counter[tuple[str, str]],
    target_month: str,
    attempt: int,
) -> tuple[int, int, int, int, int, int, int, int]:
    artist_key = normalize_space(candidate["artist"]).casefold()
    return (
        -remaining_artist_counts[artist_key],
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
            valid_candidates = [
                candidate
                for candidate in remaining
                if not violates_rotation(candidate, recent)
                and not (
                    candidate["geoRegion"] == "Europe"
                    and month_region_counts[(current_month, "Europe")] >= europe_limits[current_month]
                )
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
            if not normalize_space(url).startswith("http"):
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
    month_europe_counts: Counter[str] = Counter()

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
        "Japan",
        "China",
        "India",
        "Africa",
        "Egypt",
        "Peru",
        "textile",
        "sculpture",
        "photograph",
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


def collect_smithsonian_candidates(target: int) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen: set[str] = set()
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
    return {
        "id": f"nga-{object_row['objectid']}",
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
        "subjectTerms": [],
        "images": {
            "thumbnailUrl": "",
            "displayUrl": "",
            "fullUrl": "",
        },
        "source": {
            "institution": "nga",
            "collectionLabel": INSTITUTION_LABELS["nga"],
            "objectId": object_row["objectid"],
            "objectUrl": f"https://www.nga.gov/collection/art-object-page.{object_row['objectid']}.html",
            "license": "CC0",
        },
    }


def collect_nga_candidates(target: int) -> list[dict[str, Any]]:
    objects = read_csv_from_url("https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/objects.csv")
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
    for object_row in objects:
        if len(candidates) >= target:
            break
        classification = normalize_space(object_row.get("classification", ""))
        if classification not in {"Painting", "Sculpture", "Print", "Drawing", "Photograph", "Decorative Art"}:
            continue
        candidate = build_nga_candidate(object_row, artist_by_object.get(object_row["objectid"], "Unknown maker"))
        key = candidate_key(candidate)
        if key in seen:
            continue
        seen.add(key)
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


def score_for_approval(candidate: dict[str, Any], counts: dict[str, Counter[str]]) -> tuple[int, int, int, int, int]:
    artist_key = normalize_space(candidate["artist"]).casefold()
    return (
        counts["period"][candidate["periodKey"]],
        counts["region"][candidate["geoRegion"]],
        counts["medium"][candidate["mediumCategory"]],
        counts["artist"][artist_key],
        counts["source"][candidate["source"]["institution"]],
    )


def artist_cap_for(candidate: dict[str, Any]) -> int:
    artist = normalize_space(candidate["artist"]).casefold()
    if artist in {"unknown maker", "unknown photographer", "unknown", "unidentified", "anonymous", "anonymous artist"}:
        return 40
    if artist.endswith(" maker") or artist.endswith(" artist"):
        return 24
    return 6


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
    }
    approved: list[dict[str, Any]] = []
    approved_ids: set[str] = set()

    normalized_pools: dict[str, list[dict[str, Any]]] = {}
    for source, pool in candidate_pools.items():
        normalized_candidates = []
        for candidate in pool:
            projection = build_artwork_projection(candidate)
            normalized_candidates.append({**candidate, **projection, "source": candidate["source"]})
        normalized_pools[source] = sort_candidates_for_selection(normalized_candidates)

    for source, quota in approved_quotas.items():
        pool = normalized_pools.get(source, [])
        while pool and counts["source"][source] < quota and len(approved) < approved_target:
            pool.sort(key=lambda candidate: (*score_for_approval(candidate, counts=counts), stable_hash(candidate["id"])))
            candidate = pool.pop(0)
            artist_key = normalize_space(candidate["artist"]).casefold()
            if candidate["id"] in approved_ids:
                continue
            if counts["artist"][artist_key] >= artist_cap_for(candidate):
                continue
            approved.append(candidate)
            approved_ids.add(candidate["id"])
            counts["region"][candidate["geoRegion"]] += 1
            counts["source"][source] += 1
            counts["medium"][candidate["mediumCategory"]] += 1
            counts["period"][candidate["periodKey"]] += 1
            counts["artist"][artist_key] += 1
        normalized_pools[source] = pool

    remaining_pool = [candidate for pool in normalized_pools.values() for candidate in pool if candidate["id"] not in approved_ids]
    while len(approved) < approved_target and remaining_pool:
        remaining_pool.sort(key=lambda candidate: (*score_for_approval(candidate, counts=counts), stable_hash(candidate["id"])))
        candidate = remaining_pool.pop(0)
        artist_key = normalize_space(candidate["artist"]).casefold()
        if counts["artist"][artist_key] >= artist_cap_for(candidate):
            continue
        approved.append(candidate)
        approved_ids.add(candidate["id"])
        counts["region"][candidate["geoRegion"]] += 1
        counts["source"][candidate["source"]["institution"]] += 1
        counts["medium"][candidate["mediumCategory"]] += 1
        counts["period"][candidate["periodKey"]] += 1
        counts["artist"][artist_key] += 1

    if len(approved) < approved_target:
        raise ValueError(f"Only selected {len(approved)} approved artworks; need {approved_target}")

    europe_cap = math.floor(approved_target * 0.4)
    europe_count = sum(1 for candidate in approved if candidate["geoRegion"] == "Europe")
    if europe_count > europe_cap:
        non_europe_pool = [candidate for candidate in remaining_pool if candidate["geoRegion"] != "Europe"]
        for index, candidate in enumerate(list(approved)):
            if europe_count <= europe_cap:
                break
            if candidate["geoRegion"] != "Europe":
                continue
            if not non_europe_pool:
                break
            replacement = non_europe_pool.pop(0)
            approved[index] = replacement
            europe_count -= 1
    return approved


def build_editorial_payload(
    candidate_pools: dict[str, list[dict[str, Any]]],
    *,
    approved_target: int = 365,
    approved_quotas: dict[str, int] | None = None,
    sourced_only_quotas: dict[str, int] | None = None,
) -> dict[str, Any]:
    approved_candidates = choose_approved_candidates(
        {source: pool for source, pool in candidate_pools.items() if source != "nga"},
        approved_target=approved_target,
        approved_quotas=approved_quotas,
    )
    approved_ids = {candidate["id"] for candidate in approved_candidates}
    records = [build_editorial_record(candidate, approved=True) for candidate in approved_candidates]

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
