#!/usr/bin/env python3
"""Export approved Museum runtime data and build a zero-repeat annual schedule."""

from __future__ import annotations

import argparse
from datetime import timedelta
from pathlib import Path

from museum_pipeline_common import (
    CURATED_PATH,
    EDITORIAL_BANK_PATH,
    SCHEDULE_PATH,
    build_schedule_entries,
    now_iso,
    parse_date,
    project_curated_payload,
    read_json,
    validate_editorial_payload,
    validate_curated_quality,
    validate_schedule_payload,
    write_json,
)


def copy_editor_for_day(day_index: int) -> str:
    if day_index <= 92:
        return "Editor B1"
    if day_index <= 184:
        return "Editor B2"
    if day_index <= 276:
        return "Editor B3"
    return "Editor B4"


def apply_scheduled_editor_ownership(editorial_payload: dict, entries: list[dict[str, str]]) -> None:
    records_by_id = {record.get("id"): record for record in editorial_payload.get("records", [])}
    for index, entry in enumerate(entries, start=1):
        record = records_by_id.get(entry["artworkId"])
        if not record or record.get("workflow", {}).get("status") != "approved":
            continue
        copy_editor = copy_editor_for_day(index)
        record.setdefault("review", {})["copyEditedBy"] = copy_editor
        notes = record.setdefault("review", {}).setdefault("editorNotes", [])
        notes = [note for note in notes if not str(note).startswith("Copy editor:")]
        notes.append(f"Copy editor: {copy_editor}; QA editor: Editor C; scheduled day {index:03d}.")
        record["review"]["editorNotes"] = notes


def resolve_days(start, days: int | None, through: str | None) -> tuple[int, str]:
    if days is None and through is None:
        days = 365
    if days is not None:
        if days <= 0:
            raise ValueError("--days must be greater than 0")
        end = start + timedelta(days=days - 1)
        return days, end.isoformat()
    end = parse_date(through)
    total_days = (end - start).days + 1
    if total_days <= 0:
        raise ValueError("--through must be on or after --start")
    return total_days, end.isoformat()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", required=True, help="First scheduled date, YYYY-MM-DD")
    parser.add_argument("--days", type=int, help="Number of consecutive days to schedule (defaults to 365)")
    parser.add_argument("--through", help="Last scheduled date, YYYY-MM-DD")
    parser.add_argument("--editorial-bank", type=Path, default=EDITORIAL_BANK_PATH, help="Input editorial bank JSON")
    parser.add_argument("--curated-output", type=Path, default=CURATED_PATH, help="Approved runtime artwork JSON output")
    parser.add_argument("--schedule-output", type=Path, default=SCHEDULE_PATH, help="Schedule JSON output")
    args = parser.parse_args()

    editorial_payload = read_json(args.editorial_bank)
    editorial_errors = validate_editorial_payload(editorial_payload)
    if editorial_errors:
        raise ValueError("\n".join(editorial_errors[:50]))

    curated_payload = project_curated_payload(editorial_payload)
    curated_errors = validate_curated_quality(curated_payload)
    if curated_errors:
        raise ValueError("\n".join(curated_errors[:50]))
    approved_artworks = curated_payload.get("artworks") or []
    if len(approved_artworks) < 365:
        raise ValueError(f"Need at least 365 approved artworks before scheduling; found {len(approved_artworks)}")

    start = parse_date(args.start)
    days, through = resolve_days(start, args.days, args.through)
    entries = build_schedule_entries(approved_artworks, start, days)
    apply_scheduled_editor_ownership(editorial_payload, entries)
    curated_payload = project_curated_payload(editorial_payload)
    schedule_payload = {
        "version": "museum-schedule-v2",
        "generatedAt": now_iso(),
        "start": start.isoformat(),
        "through": through,
        "days": len(entries),
        "entries": entries,
    }
    schedule_errors = validate_schedule_payload(curated_payload, schedule_payload, require_days=days)
    if schedule_errors:
        raise ValueError("\n".join(schedule_errors[:50]))

    write_json(args.editorial_bank, editorial_payload)
    write_json(args.curated_output, curated_payload)
    write_json(args.schedule_output, schedule_payload)
    print(
        f"Wrote {len(curated_payload['artworks'])} approved Museum artworks to {args.curated_output} "
        f"and a {days}-day schedule to {args.schedule_output}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
