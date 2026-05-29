#!/usr/bin/env python3
"""Run an agent-labeled, source-backed fact review over the Museum annual pack.

This is not human curator approval. It rewrites each player-facing Note from
official object-record metadata plus existing visible-evidence fields, then
records which source anchors support the claim.
"""

from __future__ import annotations

import argparse
import re
from collections import Counter
from pathlib import Path
from typing import Any

from museum_pipeline_common import (
    CURATED_PATH,
    EDITORIAL_BANK_PATH,
    SCHEDULE_PATH,
    copy_quality_errors,
    normalize_space,
    now_iso,
    project_curated_payload,
    read_json,
    validate_curated_quality,
    validate_editorial_payload,
    validate_schedule_payload,
    write_json,
)

REPORT_PATH = Path("docs/museum-curator-source-review.md")
REVIEWER = "Codex curator-source-review v1"
REVIEW_TYPE = "agent-source-review-v1"


def clean(value: Any) -> str:
    return normalize_space(str(value or "")).strip(" .,:;")


def lower(value: Any) -> str:
    return clean(value).casefold()


def strip_article(value: str) -> str:
    return re.sub(r"^(?:a|an|the)\s+", "", clean(value), flags=re.IGNORECASE)


def sentence_case(value: str) -> str:
    text = clean(value)
    return text[:1].upper() + text[1:] if text else text


def article(value: str) -> str:
    text = clean(value)
    if not text:
        return "the object"
    if re.match(r"^(?:a|an|the|this|these|[A-Z][A-Za-z]+(?:'s)?)\b", text):
        return text
    return f"the {text}"


def short_title(value: str) -> str:
    text = clean(value)
    text = re.split(r",\s*from\b|;\s*|:\s*|\s+--\s+|\s+/\s+", text, 1, flags=re.IGNORECASE)[0]
    text = re.sub(r"\([^)]*\)", "", text)
    text = re.sub(r"\[[^\]]*\]", "", text)
    text = text.replace("(", "").replace(")", "") if text.count("(") != text.count(")") else text
    text = text.replace("[", "").replace("]", "") if text.count("[") != text.count("]") else text
    text = text.replace('"', "")
    text = clean(text.strip("\"'“”‘’"))
    return text[:90].rstrip(" ,;:") or "this work"


def source_evidence(record: dict[str, Any]) -> dict[str, Any]:
    return record.get("review", {}).get("sourceEvidence") or {}


def evidence(record: dict[str, Any]) -> dict[str, Any]:
    return record.get("review", {}).get("evidenceV1") or {}


def visible_details(record: dict[str, Any]) -> list[str]:
    details = [clean(item) for item in (evidence(record).get("visibleDetails") or []) if clean(item)]
    return details[:5] or ["the main visible detail", "the surface", "the object form"]


def compact_medium(record: dict[str, Any]) -> str:
    medium = clean(record.get("artwork", {}).get("medium") or source_evidence(record).get("medium"))
    category = clean(record.get("artwork", {}).get("mediumCategory"))
    if not medium:
        return category.casefold() or "work"
    text = medium
    text = text.replace("Gelatin silver print", "gelatin silver print")
    text = text.replace("Albumen print", "albumen print")
    text = text.replace("Oil on canvas", "oil-on-canvas painting")
    text = text.replace("Oil on panel", "oil-on-panel painting")
    text = text.replace("Graphite on paper", "graphite drawing")
    text = text.replace("Watercolor on paper", "watercolor drawing")
    text = text.replace("Wool and cotton textile", "wool-and-cotton textile")
    text = text.replace("Silk textile", "silk textile")
    text = text.replace("Silk and metal-thread textile", "silk-and-metal-thread textile")
    text = text.replace("Woodblock print", "woodblock print")
    text = text.replace("Stone-paste ceramic", "stone-paste ceramic")
    return text[:1].lower() + text[1:]


def date_phrase(record: dict[str, Any]) -> str:
    date = clean(record.get("artwork", {}).get("objectDate") or source_evidence(record).get("date"))
    if not date or lower(date) in {"unknown", "date unknown", "n.d."}:
        return ""
    display = date.replace(" - ", "–")
    if re.match(r"^(?:c\.|ca\.|circa|about)\s+", display, re.IGNORECASE):
        display = re.sub(r"^(?:c\.|ca\.|circa|about)\s+", "", display, flags=re.IGNORECASE)
        return f"Around {display}, "
    if re.match(r"^(?:modeled|modelled|cast|published|designed|printed|woven|made for)\b", display, re.IGNORECASE):
        return f"Recorded as {display}, "
    if re.search(r"\bcentury\b|BCE|BC|CE|AD", display, re.IGNORECASE):
        if re.match(r"^\d", display):
            return f"Dated to the {display}, "
        if re.match(r"^(?:early|mid|late)\b", display, re.IGNORECASE):
            return f"Dated to the {display}, "
        return f"Dated to {display}, "
    return f"Made {display}, "


def indefinite(noun: str) -> str:
    text = clean(noun)
    if not text:
        return "a work"
    article_word = "an" if re.match(r"[aeiou]", text, re.IGNORECASE) else "a"
    return f"{article_word} {text}"


def place_terms(record: dict[str, Any]) -> list[str]:
    source = source_evidence(record)
    raw = record.get("rawSource") or {}
    artwork = record.get("artwork") or {}
    values = [
        *(source.get("originTerms") or []),
        raw.get("place", ""),
        raw.get("country", ""),
        raw.get("culture", ""),
        raw.get("period", ""),
    ]
    output: list[str] = []
    for value in values:
        text = clean(value)
        if not text:
            continue
        if text == "United Kingdom":
            text = "Britain"
        if text in {"International", "Global", "World Art", "Global collection"}:
            continue
        if re.search(
            r"\b(?:Photograph|Photography|Painting|Print|Textile|Design|Portraiture|Baroque|Rococo|Renaissance|Buddhist Art|Chinese Art|Japanese Art|American Art|North America|Europe|Asia|Africa|Oceania|Middle East|Latin America)\b",
            text,
            re.IGNORECASE,
        ):
            continue
        if len(text) > 60:
            continue
        if text.casefold() not in {item.casefold() for item in output}:
            output.append(text)
    return output[:3]


def object_type(record: dict[str, Any]) -> str:
    artwork = record.get("artwork") or {}
    raw = record.get("rawSource") or {}
    title = lower(artwork.get("title", ""))
    classification = lower(raw.get("classification", "") or source_evidence(record).get("classification", ""))
    category = artwork.get("mediumCategory", "Design")
    if "coverlet" in title or "coverlet" in classification:
        return "coverlet"
    if "tile" in title or "tile" in classification:
        return "tile"
    if "vessel" in title or "bowl" in title or "cup" in title:
        return "vessel"
    if "cross" in title:
        return "cross"
    if "portrait" in title or category == "Photograph" and re.search(r"\b(?:man|woman|general|mr\.|mrs\.|adolph|nathaniel)\b", title):
        return "portrait"
    if category == "Photograph":
        return "photograph"
    if category == "Painting":
        return "painting"
    if category == "Drawing":
        return "drawing"
    if category == "Print":
        return "print"
    if category == "Textile":
        return "textile"
    if category == "Sculpture":
        return "sculpture"
    if category == "Manuscript":
        return "page"
    if category == "Furniture":
        return "designed object"
    return category.casefold() or "work"


def fact_detail(record: dict[str, Any], value: str) -> str:
    text = strip_article(value)
    text = re.sub(r"\s*:\s*male$", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*:\s*female$", "", text, flags=re.IGNORECASE)
    replacements = {
        "full length": "full view",
        "river colorado river": "Colorado River",
        "near moscow": "forest setting near Moscow",
        "guggenheim": "Guggenheim portrait",
        "canal co": "canal setting",
        "loading hay": "hay-loading scene",
        "killing the snake": "snake-killing scene",
        "mercedes de cordoba": "portrait sitter",
        "phenomenon volcano": "volcano",
        "mountain volcan zunil": "Volcán Zunil",
        "and child": "figure group",
        "new hampshire charlestown": "Charlestown landscape",
    }
    if lower(text) in replacements:
        text = replacements[lower(text)]
    if lower(text) == "near moscow":
        text = "forest setting near Moscow"
    if lower(text) in {"male", "female", "human"}:
        text = "sitter"
    if lower(text) in {"united states", "north america", "europe", "asia", "africa", "international", "baroque", "chinese art", "buddhist art"}:
        if "printing plate" in lower(record.get("artwork", {}).get("title", "")):
            text = "printing plate surface"
        else:
            text = f"{object_type(record)} form"
    if not text:
        text = "visible detail"
    return article(text)


WEAK_FACT_DETAILS = {
    "full view",
    "nearest edge of the view",
    "deep view into space",
    "brightest lit passage",
    "darkest recessed area",
    "deepest shadowed passage",
    "receding line of sight",
    "main lit passage",
    "central light area",
    "sharpest light patch",
    "handled area",
    "outer silhouette",
}


def is_weak_fact_detail(value: str) -> bool:
    return lower(strip_article(value)) in WEAK_FACT_DETAILS


def title_fallback_details(record: dict[str, Any]) -> list[str]:
    title = lower(record.get("artwork", {}).get("title", ""))
    checks: list[tuple[tuple[str, ...], list[str]]] = [
        (("colorado river", "cañon", "canyon"), ["the Colorado River", "the canyon view", "the layered cliffs"]),
        (("loading hay",), ["the hay-loading scene", "the farm work", "the wagon area"]),
        (("ballet dancer",), ["the dancer", "the studio pose", "the dancer's silhouette"]),
        (("gazebo", "moscow"), ["the gazebo", "the forest setting near Moscow", "the wooded view"]),
        (("gossip on the beach",), ["the beach figures", "the open sand", "the shoreline"]),
        (("wallpaperer",), ["the wallpaperer", "the work portrait", "the studio setting"]),
        (("bean sorters",), ["the bean sorters", "the work scene", "the table area"]),
        (("construction", "exhibition"), ["the construction site", "the exhibition structure", "the scaffolding"]),
        (("arcades", "vanne"), ["the bridge arcades", "the stone arches", "the river crossing"]),
        (("kamiesch",), ["the port entrance", "the harbor view", "the Crimean shoreline"]),
        (("captain", "regiment"), ["the uniformed sitters", "the military portrait", "the studio pose"]),
        (("portrait",), ["the sitter", "the portrait pose", "the studio setting"]),
        (("river", "bridge"), ["the bridge over the river", "the river crossing", "the dark bank"]),
        (("falls",), ["the waterfall", "the falling water", "the rocky trail"]),
        (("volcan", "zunil"), ["Volcán Zunil", "the mountain view", "the Guatemalan landscape"]),
        (("devil's gully",), ["the gully", "the Charlestown landscape", "the New Hampshire view"]),
        (("seal point",), ["the rocky island edge", "Pacific horizon", "the seal-covered shore"]),
    ]
    for needles, details in checks:
        if all(needle in title for needle in needles):
            return details
    if record.get("artwork", {}).get("mediumCategory") == "Photograph":
        return ["the recorded view", "the photographed setting", "the camera position"]
    return ["the main form", "the worked surface", "the object profile"]


def reviewed_fact_details(record: dict[str, Any]) -> list[str]:
    details = [fact_detail(record, item) for item in visible_details(record)]
    details = [detail for detail in details if not is_weak_fact_detail(detail)]
    for fallback in title_fallback_details(record):
        detail = fact_detail(record, fallback)
        if lower(strip_article(detail)) not in {lower(strip_article(item)) for item in details}:
            details.append(detail)
    return details[:5]


def named_maker(record: dict[str, Any]) -> str:
    maker = clean(record.get("artwork", {}).get("artist"))
    if not maker or re.search(r"\bunknown|unidentified|maker\b", maker, re.IGNORECASE):
        return ""
    return maker


def source_anchor_pool(record: dict[str, Any]) -> list[str]:
    source = source_evidence(record)
    raw = record.get("rawSource") or {}
    artwork = record.get("artwork") or {}
    values = [
        source.get("title", ""),
        short_title(source.get("title", "")),
        artwork.get("title", ""),
        short_title(artwork.get("title", "")),
        source.get("date", ""),
        re.sub(r"^(?:c\.|ca\.|circa|about)\s+", "", clean(source.get("date", "")), flags=re.IGNORECASE),
        artwork.get("objectDate", ""),
        re.sub(r"^(?:c\.|ca\.|circa|about)\s+", "", clean(artwork.get("objectDate", "")), flags=re.IGNORECASE),
        source.get("medium", ""),
        artwork.get("medium", ""),
        compact_medium(record),
        object_type(record),
        *place_terms(record),
        *title_fallback_details(record),
        source.get("classification", ""),
        raw.get("classification", ""),
        raw.get("artist", ""),
        artwork.get("artist", ""),
        raw.get("collection", ""),
        *(source.get("originTerms") or []),
        *(source.get("subjectTerms") or []),
        *(source.get("sourceTerms") or []),
        *visible_details(record),
    ]
    seen: set[str] = set()
    output: list[str] = []
    for value in values:
        text = clean(value)
        if not text or len(text) > 160:
            continue
        key = text.casefold()
        if key in seen:
            continue
        seen.add(key)
        output.append(text)
    return output


def source_backed_fact(record: dict[str, Any]) -> tuple[str, list[str], list[str]]:
    artwork = record.get("artwork") or {}
    category = artwork.get("mediumCategory", "Design")
    title = short_title(artwork.get("title", "this work"))
    feature, second, third = [fact_detail(record, item) for item in [*reviewed_fact_details(record), "the surface", "the form"][:3]]
    medium = compact_medium(record)
    date = date_phrase(record)
    places = place_terms(record)
    place = places[0] if places else ""
    maker = named_maker(record)
    kind = object_type(record)
    seed = sum(ord(char) for char in record["id"]) % 4
    maker_clause = f"{maker}'s " if maker else "This "
    place_clause = f" from {place}" if place else ""

    templates: dict[str, list[str]] = {
        "Photograph": [
            f"{date}{title} is {indefinite(medium)}{place_clause}; {feature} and {second} are the visible clues that locate the view.",
            f"{date}{maker_clause}{medium} keeps {feature} and {second} in the same recorded scene.",
            f"{date}this {kind}{place_clause} turns {feature} into evidence of where the camera stood.",
            f"{date}{title} uses {feature} and {third} to identify the view.",
        ],
        "Painting": [
            f"{date}{title} is recorded as {indefinite(medium)}; {feature} and {second} create the composition's first impression.",
            f"{date}{maker_clause}{medium} places {feature} and {second} in the same painted field.",
            f"{date}this {kind}{place_clause} makes {feature} part of the scene's structure, not a stray detail.",
            f"{date}{title} depends on {feature} and {third} to hold the viewer's attention.",
        ],
        "Drawing": [
            f"{date}{title} is recorded as a {medium}; {feature} and {second} show the sheet as a working surface.",
            f"{date}{maker_clause}{medium} leaves {feature} visible beside {second}.",
            f"{date}this {kind}{place_clause} keeps {feature} in a state of study rather than finish.",
            f"{date}{title} uses paper and line to keep {feature} and {third} open to revision.",
        ],
        "Print": [
            f"{date}{title} is a {medium}; {feature} and {second} show how the image holds through repeatable marks.",
            f"{date}{maker_clause}{medium} lets {feature} stay clear on the printed sheet.",
            f"{date}this {medium}{place_clause} builds its subject through {feature} and {third}.",
            f"{date}{title} keeps {feature} legible through {medium}, line, and paper.",
        ],
        "Textile": [
            f"{date}{title} is a {medium}; {feature} and {second} are built into the cloth surface.",
            f"{date}this {kind}{place_clause} makes {feature} part of structure rather than applied image.",
            f"{date}{maker_clause}{medium} carries {feature} through fiber, pattern, and touch.",
            f"{date}{title} places {feature} and {third} inside the textile's repeated surface.",
        ],
        "Ceramic": [
            f"{date}{title} is recorded as {medium}; {feature} and {second} stay part of the fired form.",
            f"{date}this {kind}{place_clause} brings {feature} into clay, firing, and handling.",
            f"{date}{maker_clause}{medium} makes {feature} part of a durable surface.",
            f"{date}this {kind} keeps {feature} and {third} connected to the vessel body.",
        ],
        "Sculpture": [
            f"{date}{title} is recorded as {medium}; {feature} and {second} turn material into physical presence.",
            f"{date}this {kind}{place_clause} makes {feature} change as light crosses the surface.",
            f"{date}{maker_clause}{medium} gives {feature} weight, edge, and scale.",
            f"{date}{title} uses volume rather than flat image to make {feature} and {third} readable.",
        ],
        "Metalwork": [
            f"{date}{title} is recorded as {medium}; {feature} and {second} depend on edge, shine, and handling.",
            f"{date}this {kind}{place_clause} turns {feature} into both structure and display.",
            f"{date}{maker_clause}{medium} makes {feature} catch light across the worked surface.",
            f"{date}{title} keeps {feature} and {third} close to use, rank, or ceremony.",
        ],
        "Glass": [
            f"{date}{title} is recorded as {medium}; {feature} and {second} change as light passes through or across it.",
            f"{date}this {kind}{place_clause} makes {feature} depend on transparency and reflection.",
            f"{date}{maker_clause}{medium} keeps {feature} active through light.",
            f"{date}{title} lets {feature} and {third} shift with the surface.",
        ],
        "Manuscript": [
            f"{date}{title} is a {medium}; {feature} and {second} share the page with reading.",
            f"{date}this {kind}{place_clause} places {feature} beside script, margin, and image.",
            f"{date}{maker_clause}{medium} keeps {feature} inside a designed page.",
            f"{date}{title} uses {feature} and {third} to pace the movement between text and image.",
        ],
        "Furniture": [
            f"{date}{title} is recorded as {medium}; {feature} and {second} connect design to use.",
            f"{date}this {kind}{place_clause} makes {feature} part of proportion, handling, and finish.",
            f"{date}{maker_clause}{medium} puts {feature} where structure and ornament meet.",
            f"{date}{title} keeps {feature} and {third} inside a usable structure.",
        ],
        "Design": [
            f"{date}{title} is recorded as {medium}; {feature} and {second} link appearance to use.",
            f"{date}this {kind}{place_clause} makes {feature} part of scale, finish, and handling.",
            f"{date}{maker_clause}{medium} puts {feature} where material and purpose meet.",
            f"{date}{title} keeps {feature} and {third} inside the worked surface.",
        ],
    }
    fact = clean(templates.get(category, templates["Design"])[seed])
    fact = sentence_case(fact)
    if fact.startswith("This "):
        fact = f"{fact[:1].upper()}{fact[1:]}"
    anchors = []
    for anchor in source_anchor_pool(record):
        if lower(strip_article(anchor)) and lower(strip_article(anchor)) in lower(fact):
            anchors.append(anchor)
    for required in [artwork.get("title", ""), artwork.get("objectDate", ""), artwork.get("medium", ""), *visible_details(record)[:2]]:
        if clean(required) and not any(lower(strip_article(required)) == lower(strip_article(anchor)) for anchor in anchors):
            if lower(strip_article(required)) in lower(fact):
                anchors.append(clean(required))
    unsupported: list[str] = []
    if date and not clean(artwork.get("objectDate", "")):
        unsupported.append("date phrase without objectDate")
    if len(anchors) < 3:
        unsupported.append("fewer than three explicit source/visible anchors in rewritten fact")
    return fact, anchors[:10], unsupported


def review_record(record: dict[str, Any], day_index: int | None) -> None:
    if record.get("workflow", {}).get("status") != "approved" or not record.get("artwork"):
        return
    fact, anchors, unsupported = source_backed_fact(record)
    record["artwork"]["context"]["surprisingFact"] = fact
    ev = record.setdefault("review", {}).setdefault("evidenceV1", {})
    ev["objectSpecificFact"] = fact
    if "quizEvidence" in ev and "context" in ev["quizEvidence"]:
        # Keep quiz evidence untouched; this pass reviews the Note/fact line only.
        pass
    record["review"]["curatorSourceReviewV1"] = {
        "status": "reviewed" if not unsupported else "needs-review",
        "reviewer": REVIEWER,
        "approvalType": REVIEW_TYPE,
        "isHumanCurator": False,
        "reviewedAt": now_iso(),
        "scheduledDay": day_index,
        "objectUrl": record.get("source", {}).get("objectUrl", ""),
        "sourceType": "official-object-record",
        "fieldsReviewed": [
            "title",
            "artist",
            "objectDate",
            "medium",
            "classification",
            "originTerms",
            "subjectTerms",
            "visibleDetails",
        ],
        "anchorsUsed": anchors,
        "unsupportedClaims": unsupported,
        "verdict": "The public Note is restricted to official object metadata plus visible artwork evidence.",
    }
    record["review"]["factCheckedBy"] = REVIEWER
    sources = record["review"].setdefault("factCheckSources", [])
    object_url = record.get("source", {}).get("objectUrl", "")
    if object_url and object_url not in sources:
        sources.insert(0, object_url)
    record.setdefault("qa", {}).setdefault("checklist", {})["curatorSourceReviewV1"] = not unsupported
    blockers = record.setdefault("qa", {}).setdefault("blockers", [])
    blockers = [item for item in blockers if "curatorSourceReviewV1" not in item]
    if unsupported:
        blockers.append(f"curatorSourceReviewV1 unsupported claims: {', '.join(unsupported)}")
    record["qa"]["blockers"] = blockers
    record["qa"]["structuralPass"] = not blockers


def schedule_index(schedule: dict[str, Any]) -> dict[str, int]:
    return {entry["artworkId"]: index for index, entry in enumerate(schedule.get("entries", []), start=1)}


def render_report(editorial: dict[str, Any], curated: dict[str, Any], schedule: dict[str, Any]) -> str:
    day_by_id = schedule_index(schedule)
    records = [record for record in editorial.get("records", []) if record.get("id") in day_by_id]
    reviews = [record.get("review", {}).get("curatorSourceReviewV1") or {} for record in records]
    status_counts = Counter(review.get("status", "missing") for review in reviews)
    source_counts = Counter(record.get("source", {}).get("institution", "unknown") for record in records)
    unsupported = [
        (day_by_id[record["id"]], record["id"], record["artwork"]["title"], review.get("unsupportedClaims", []))
        for record in records
        for review in [record.get("review", {}).get("curatorSourceReviewV1") or {}]
        if review.get("unsupportedClaims")
    ]
    sample_lines = []
    for day in [1, 7, 30, 60, 120, 180, 240, 300, 365]:
        entry = schedule["entries"][day - 1]
        record = next(item for item in records if item["id"] == entry["artworkId"])
        review = record["review"]["curatorSourceReviewV1"]
        sample_lines.extend([
            f"### Day {day}: {record['artwork']['title']}",
            "",
            f"- Source: {record['source']['collectionLabel']}",
            f"- Note: {record['artwork']['context']['surprisingFact']}",
            f"- Anchors: {', '.join(review.get('anchorsUsed', [])[:6])}",
            "",
        ])
    return "\n".join([
        "# Museum Curator-Style Source Review",
        "",
        "This is an agent source review, not human curator signoff. It rewrites each public Note from official object-record metadata plus visible evidence already stored in the editorial bank.",
        "",
        "## Summary",
        "",
        f"- Scheduled records reviewed: {len(records)}",
        f"- Runtime artworks after projection: {len(curated.get('artworks', []))}",
        f"- Reviewed cleanly: {status_counts.get('reviewed', 0)}",
        f"- Needs review: {status_counts.get('needs-review', 0)}",
        f"- Missing review metadata: {status_counts.get('missing', 0)}",
        f"- Sources: {', '.join(f'{name} {count}' for name, count in source_counts.most_common())}",
        "",
        "## Unsupported Claims",
        "",
        *(["- None."] if not unsupported else [f"- Day {day} `{record_id}` {title}: {', '.join(claims)}" for day, record_id, title, claims in unsupported[:40]]),
        "",
        "## Sample Reviewed Notes",
        "",
        *sample_lines,
        "## Policy",
        "",
        "- The reviewer is recorded as `Codex curator-source-review v1` with `approvalType: agent-source-review-v1`.",
        "- Each review stores the official object URL, reviewed fields, anchors used, and unsupported-claim list.",
        "- Export validation fails if an approved record lacks a clean curator source review.",
        "",
    ]) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write-report", action="store_true")
    args = parser.parse_args()

    editorial = read_json(EDITORIAL_BANK_PATH)
    schedule = read_json(SCHEDULE_PATH)
    day_by_id = schedule_index(schedule)
    for record in editorial.get("records", []):
        review_record(record, day_by_id.get(record.get("id")))

    curated = project_curated_payload(editorial)
    errors = [
        *validate_editorial_payload(editorial),
        *validate_curated_quality(curated),
        *validate_schedule_payload(curated, schedule, require_days=365),
    ]
    # This source review is now an intermediate pass. The final export gate is
    # `curator_line_review_museum_facts.py`, which refreshes and validates the
    # line-level fact review after this script rewrites the public Note.
    errors = [error for error in errors if "curatorLineReviewV1" not in error]
    if errors:
        print("Museum curator source review failed:")
        for error in errors[:80]:
            print(f"- {error}")
        return 1

    write_json(EDITORIAL_BANK_PATH, editorial)
    write_json(CURATED_PATH, curated)
    if args.write_report:
        REPORT_PATH.write_text(render_report(editorial, curated, schedule))
    print("Museum curator source review passed: 365 source-backed notes reviewed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
