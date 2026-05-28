#!/usr/bin/env python3
"""Validate the Museum annual-pack editorial bank, curated export, and schedule."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from museum_pipeline_common import (
    CURATED_PATH,
    EDITORIAL_BANK_PATH,
    SCHEDULE_PATH,
    project_curated_payload,
    read_json,
    validate_curated_quality,
    validate_editorial_payload,
    validate_schedule_payload,
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--editorial-bank", type=Path, default=EDITORIAL_BANK_PATH, help="Museum editorial bank JSON")
    parser.add_argument("--curated", type=Path, default=CURATED_PATH, help="Museum runtime curated JSON")
    parser.add_argument("--schedule", type=Path, default=SCHEDULE_PATH, help="Museum annual schedule JSON")
    parser.add_argument("--days", type=int, default=365, help="Required schedule length")
    args = parser.parse_args()

    editorial_payload = read_json(args.editorial_bank)
    derived_curated_payload = project_curated_payload(editorial_payload)
    curated_payload = read_json(args.curated)
    schedule_payload = read_json(args.schedule)

    errors: list[str] = []
    errors.extend(validate_editorial_payload(editorial_payload))
    errors.extend(validate_curated_quality(derived_curated_payload))
    errors.extend(validate_schedule_payload(derived_curated_payload, schedule_payload, require_days=args.days))

    approved_ids = {artwork["id"] for artwork in derived_curated_payload.get("artworks", [])}
    runtime_ids = {artwork["id"] for artwork in curated_payload.get("artworks", [])}
    if approved_ids != runtime_ids:
        errors.append("curated runtime export is out of sync with approved editorial bank")

    if len(approved_ids) != args.days:
        errors.append(f"approved runtime artwork count must be {args.days}; found {len(approved_ids)}")

    if errors:
        print("Museum editorial validation failed:", file=sys.stderr)
        for error in errors[:120]:
            print(f"- {error}", file=sys.stderr)
        if len(errors) > 120:
            print(f"...and {len(errors) - 120} more", file=sys.stderr)
        return 1

    print(f"Museum editorial validation passed: {len(approved_ids)} approved artworks, {len(schedule_payload.get('entries') or [])} scheduled days.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
