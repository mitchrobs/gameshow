#!/usr/bin/env python3
"""Audit Museum 365 editorial-polish quality and optionally write a report."""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any

from museum_pipeline_common import (
    ARTWORK_COPY_BANNED_PATTERNS,
    CURATED_PATH,
    EDITORIAL_BANK_PATH,
    QUALITY_SMELL_PATTERNS,
    SCHEDULE_PATH,
    copy_quality_errors,
    is_object_specific_fact,
    mix_quality_errors,
    normalize_space,
    read_json,
    validate_schedule_payload,
)


def count_values(values: list[str]) -> Counter[str]:
    return Counter(normalize_space(value) for value in values if normalize_space(value))


def scheduled_artworks(curated: dict[str, Any], schedule: dict[str, Any]) -> list[tuple[int, dict[str, Any], dict[str, str]]]:
    by_id = {artwork["id"]: artwork for artwork in curated.get("artworks", [])}
    output: list[tuple[int, dict[str, Any], dict[str, str]]] = []
    for index, entry in enumerate(schedule.get("entries", []), start=1):
        artwork = by_id.get(entry["artworkId"])
        if artwork:
            output.append((index, artwork, entry))
    return output


def quality_tier(artwork: dict[str, Any]) -> str:
    texts = list((artwork.get("context") or {}).values())
    texts.extend(question.get("prompt", "") for question in artwork.get("questions", []))
    texts.extend(question.get("reinforcement", "") for question in artwork.get("questions", []))
    combined = "\n".join(texts)
    if any(pattern.search(combined) for _, pattern in QUALITY_SMELL_PATTERNS):
        return "replace"
    if not is_object_specific_fact(artwork):
        return "B ship after polish"
    return "A ship"


def phrase_hits(artworks: list[dict[str, Any]], patterns: tuple[tuple[str, re.Pattern[str]], ...]) -> Counter[str]:
    hits: Counter[str] = Counter()
    for artwork in artworks:
        fields: list[str] = []
        fields.extend((artwork.get("context") or {}).values())
        for question in artwork.get("questions", []):
            fields.append(question.get("prompt", ""))
            fields.append(question.get("reinforcement", ""))
            fields.extend(question.get("options", []))
        for label, pattern in patterns:
            if any(pattern.search(normalize_space(field)) for field in fields):
                hits[label] += 1
    return hits


def report_markdown(
    editorial: dict[str, Any],
    curated: dict[str, Any],
    schedule: dict[str, Any],
    *,
    schedule_regenerated: bool = False,
) -> str:
    artworks = curated.get("artworks", [])
    scheduled = scheduled_artworks(curated, schedule)
    source_counts = count_values([artwork["source"]["institution"] for artwork in artworks])
    media_counts = count_values([artwork["mediumCategory"] for artwork in artworks])
    region_counts = count_values([artwork["geoRegion"] for artwork in artworks])
    option_counts = count_values(
        [
            option
            for artwork in artworks
            for question in artwork.get("questions", [])
            for option in question.get("options", [])
        ]
    )
    fact_hits = sum(1 for artwork in artworks if is_object_specific_fact(artwork))
    showcase_hits = sum(1 for artwork in artworks if artwork.get("review", {}).get("showcaseTier") == "A-showcase")
    quality_hits = phrase_hits(artworks, QUALITY_SMELL_PATTERNS)
    self_ref_hits = phrase_hits(artworks, ARTWORK_COPY_BANNED_PATTERNS)
    validation_errors = [
        *mix_quality_errors(artworks),
        *copy_quality_errors(artworks),
        *validate_schedule_payload(curated, schedule, require_days=365),
    ]

    lines = [
        "# Museum 365 Polish Report",
        "",
        "## Summary",
        "",
        f"- Editorial records: {len(editorial.get('records', []))}",
        f"- Runtime artworks: {len(artworks)}",
        f"- Scheduled days: {len(schedule.get('entries', []))}",
        f"- Unique scheduled artwork IDs: {len({entry['artworkId'] for entry in schedule.get('entries', [])})}",
        f"- Object-specific surprising facts: {fact_hits}/{len(artworks)}",
        f"- A-showcase approvals: {showcase_hits}/{len(artworks)}",
        f"- Validation errors: {len(validation_errors)}",
        "- Replacements made in this pass: 0",
        f"- Schedule regenerated: {'yes' if schedule_regenerated else 'no'}",
        "",
        "## First 30 Calibration",
        "",
        "| Day | Date | Tier | Artwork | Source | Medium | Region |",
        "|---:|---|---|---|---|---|---|",
    ]
    for day, artwork, entry in scheduled[:30]:
        title = artwork["title"].replace("|", "\\|")
        lines.append(
            f"| {day} | {entry['date']} | {quality_tier(artwork)} | {title} | "
            f"{artwork['source']['collectionLabel']} | {artwork['mediumCategory']} | {artwork['geoRegion']} |"
        )

    lines.extend(
        [
            "",
            "## Full-Pack Mix",
            "",
            "### Sources",
            "",
            "| Source | Count |",
            "|---|---:|",
        ]
    )
    for label, count in source_counts.most_common():
        lines.append(f"| {label} | {count} |")

    lines.extend(["", "### Media", "", "| Medium | Count |", "|---|---:|"])
    for label, count in media_counts.most_common():
        lines.append(f"| {label} | {count} |")

    lines.extend(["", "### Regions", "", "| Region | Count |", "|---|---:|"])
    for label, count in region_counts.most_common():
        lines.append(f"| {label} | {count} |")

    lines.extend(
        [
            "",
            "## Copy QA",
            "",
            "### Quality-Smell Phrase Hits",
            "",
            "| Phrase | Artworks Hit |",
            "|---|---:|",
        ]
    )
    if quality_hits:
        for label, count in quality_hits.most_common():
            lines.append(f"| {label} | {count} |")
    else:
        lines.append("| None | 0 |")

    lines.extend(["", "### Self-Reference Phrase Hits", "", "| Phrase | Artworks Hit |", "|---|---:|"])
    if self_ref_hits:
        for label, count in self_ref_hits.most_common():
            lines.append(f"| {label} | {count} |")
    else:
        lines.append("| None | 0 |")

    lines.extend(["", "### Top Repeated Quiz Options", "", "| Option | Count |", "|---|---:|"])
    for option, count in option_counts.most_common(12):
        safe_option = option.replace("|", "\\|")
        lines.append(f"| {safe_option} | {count} |")

    lines.extend(["", "## Weak/Replacement List", ""])
    weak = [
        (day, entry["date"], artwork)
        for day, artwork, entry in scheduled
        if quality_tier(artwork) != "A ship"
    ]
    if weak:
        for day, entry_date, artwork in weak[:30]:
            lines.append(f"- Day {day} ({entry_date}) `{artwork['id']}`: {quality_tier(artwork)}.")
    else:
        lines.append("- No records require replacement under the current automated gates.")

    lines.extend(["", "## Validation", ""])
    if validation_errors:
        lines.extend(f"- {error}" for error in validation_errors)
    else:
        lines.append("- Automated Museum quality validation passes.")

    return "\n".join(lines) + "\n"


def showcase_tracker_markdown(curated: dict[str, Any], schedule: dict[str, Any]) -> str:
    scheduled = scheduled_artworks(curated, schedule)
    lines = [
        "# Museum 365 Showcase Tracker",
        "",
        "This tracker is generated from the runtime annual pack and records the editor-agent showcase gate by scheduled date.",
        "",
        "| Day | Date | Artwork ID | Title | Source | Medium | Region | Showcase | Evidence | Visual QA |",
        "|---:|---|---|---|---|---|---|---|---|---|",
    ]
    for day, artwork, entry in scheduled:
        review = artwork.get("review", {})
        evidence = review.get("sourceEvidence") or {}
        title = artwork["title"].replace("|", "\\|")
        visual = normalize_space(review.get("visualQualityNote", "")).replace("|", "\\|")
        if len(visual) > 86:
            visual = f"{visual[:83].rstrip()}..."
        lines.append(
            f"| {day} | {entry['date']} | `{artwork['id']}` | {title} | "
            f"{artwork['source']['collectionLabel']} | {artwork['mediumCategory']} | {artwork['geoRegion']} | "
            f"{review.get('showcaseTier', '—')} | {evidence.get('sourceType', '—')} | {visual or '—'} |"
        )
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--editorial-bank", type=Path, default=EDITORIAL_BANK_PATH)
    parser.add_argument("--curated", type=Path, default=CURATED_PATH)
    parser.add_argument("--schedule", type=Path, default=SCHEDULE_PATH)
    parser.add_argument("--write-report", type=Path)
    parser.add_argument("--write-showcase-tracker", type=Path)
    parser.add_argument("--schedule-regenerated", action="store_true")
    args = parser.parse_args()

    editorial = read_json(args.editorial_bank)
    curated = read_json(args.curated)
    schedule = read_json(args.schedule)
    report = report_markdown(editorial, curated, schedule, schedule_regenerated=args.schedule_regenerated)

    if args.write_report:
        args.write_report.parent.mkdir(parents=True, exist_ok=True)
        args.write_report.write_text(report)

    if args.write_showcase_tracker:
        args.write_showcase_tracker.parent.mkdir(parents=True, exist_ok=True)
        args.write_showcase_tracker.write_text(showcase_tracker_markdown(curated, schedule))

    artworks = curated.get("artworks", [])
    errors = [
        *mix_quality_errors(artworks),
        *copy_quality_errors(artworks),
        *validate_schedule_payload(curated, schedule, require_days=365),
    ]
    print(report)
    if errors:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
