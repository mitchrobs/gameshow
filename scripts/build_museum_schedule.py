#!/usr/bin/env python3
"""Validate curated Museum artwork records and build a deterministic schedule."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parents[1]
CURATED_PATH = BASE_DIR / "src" / "data" / "museum" / "curatedArtworks.json"
SCHEDULE_PATH = BASE_DIR / "src" / "data" / "museum" / "schedule.json"
QUESTION_KINDS = {"observation", "context", "connection"}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def parse_date(value: str) -> date:
    return date.fromisoformat(value)


def normalize(value: str) -> str:
    return " ".join(value.strip().lower().split())


def validate_artwork(artwork: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    artwork_id = artwork.get("id", "<missing>")
    required = [
        "id",
        "title",
        "artist",
        "objectDate",
        "medium",
        "periodKey",
        "periodTag",
        "mediumCategory",
        "geoRegion",
    ]
    for field in required:
        if not isinstance(artwork.get(field), str) or not artwork[field].strip():
            errors.append(f"{artwork_id}: missing {field}")

    images = artwork.get("images") or {}
    for field in ("thumbnailUrl", "displayUrl", "fullUrl"):
        if not isinstance(images.get(field), str) or not images[field].startswith("https://"):
            errors.append(f"{artwork_id}: invalid images.{field}")

    source = artwork.get("source") or {}
    if source.get("institution") != "met":
        errors.append(f"{artwork_id}: source.institution must be met")
    if source.get("license") != "CC0":
        errors.append(f"{artwork_id}: source.license must be CC0")
    if not isinstance(source.get("objectId"), int):
        errors.append(f"{artwork_id}: source.objectId must be an int")
    if not isinstance(source.get("objectUrl"), str) or "metmuseum.org/art/collection/search/" not in source["objectUrl"]:
        errors.append(f"{artwork_id}: source.objectUrl must be a Met object URL")

    context = artwork.get("context") or {}
    for field in ("technique", "surprisingFact", "connection"):
        if not isinstance(context.get(field), str) or len(context[field].strip()) < 20:
            errors.append(f"{artwork_id}: context.{field} is too short")

    questions = artwork.get("questions") or []
    if len(questions) != 3:
        errors.append(f"{artwork_id}: must have exactly 3 questions")
        return errors

    seen_kinds = {question.get("kind") for question in questions}
    if seen_kinds != QUESTION_KINDS:
        errors.append(f"{artwork_id}: question kinds must be observation, context, connection")

    for index, question in enumerate(questions):
        options = question.get("options") or []
        if len(options) != 4:
            errors.append(f"{artwork_id}: question {index + 1} must have 4 options")
            continue
        normalized_options = [normalize(str(option)) for option in options]
        if len(set(normalized_options)) != 4:
            errors.append(f"{artwork_id}: question {index + 1} has duplicate options")
        answer_index = question.get("answerIndex")
        if not isinstance(answer_index, int) or answer_index < 0 or answer_index >= 4:
            errors.append(f"{artwork_id}: question {index + 1} answerIndex is invalid")
        if not isinstance(question.get("reinforcement"), str) or not question["reinforcement"].strip():
            errors.append(f"{artwork_id}: question {index + 1} needs reinforcement")

    review = artwork.get("review") or {}
    if review.get("status") != "reviewed":
        errors.append(f"{artwork_id}: review.status must be reviewed before scheduling")
    if not review.get("factCheckSources"):
        errors.append(f"{artwork_id}: review.factCheckSources is required")

    return errors


def violates_window(candidate: dict[str, Any], recent: list[dict[str, Any]]) -> bool:
    artist = normalize(candidate["artist"])
    if any(normalize(item["artist"]) == artist for item in recent[-6:]):
        return True

    if len(recent) >= 2:
        last_two = recent[-2:]
        if all(item["periodKey"] == candidate["periodKey"] for item in last_two):
            return True
        if all(item["mediumCategory"] == candidate["mediumCategory"] for item in last_two):
            return True

    return False


def build_schedule(artworks: list[dict[str, Any]], start: date, days: int) -> list[dict[str, str]]:
    if not artworks:
        raise ValueError("No curated artworks available")

    scheduled: list[dict[str, Any]] = []
    entries: list[dict[str, str]] = []
    cursor = 0
    scheduled_counts = {artwork["id"]: 0 for artwork in artworks}

    for offset in range(days):
        chosen: dict[str, Any] | None = None
        ordered_candidates = sorted(
            range(len(artworks)),
            key=lambda index: (
                scheduled_counts[artworks[index]["id"]],
                (index - cursor) % len(artworks),
            ),
        )
        for index in ordered_candidates:
            candidate = artworks[index]
            if not violates_window(candidate, scheduled):
                chosen = candidate
                cursor = (index + 1) % len(artworks)
                break
        if chosen is None:
            raise ValueError(f"Could not schedule day {offset + 1} without violating rotation rules")

        scheduled.append(chosen)
        scheduled_counts[chosen["id"]] += 1
        entries.append({
            "date": (start + timedelta(days=offset)).isoformat(),
            "artworkId": chosen["id"],
        })

    return entries


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", required=True, help="First scheduled date, YYYY-MM-DD")
    parser.add_argument("--days", type=int, required=True, help="Number of days to schedule")
    parser.add_argument("--output", type=Path, default=SCHEDULE_PATH, help="Output schedule JSON")
    args = parser.parse_args()

    curated = read_json(CURATED_PATH)
    artworks = curated.get("artworks") or []
    errors: list[str] = []
    for artwork in artworks:
        errors.extend(validate_artwork(artwork))
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1

    start = parse_date(args.start)
    entries = build_schedule(artworks, start, args.days)
    payload = {
        "version": "museum-schedule-v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "start": start.isoformat(),
        "days": args.days,
        "entries": entries,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(entries)} scheduled Museum days to {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
