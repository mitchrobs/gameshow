#!/usr/bin/env python3
"""Fetch normalized Museum candidates from one or more open-access sources."""

from __future__ import annotations

import argparse
from pathlib import Path

from museum_pipeline_common import SUPPORTED_SOURCES, TMP_DIR, collect_candidates_for_sources, now_iso, write_json


def parse_sources(raw: str) -> list[str]:
    sources = [value.strip() for value in raw.split(",") if value.strip()]
    unknown = [source for source in sources if source not in SUPPORTED_SOURCES]
    if unknown:
        raise ValueError(f"Unknown Museum sources: {', '.join(unknown)}")
    return sources


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sources",
        default="met,aic,rijks,smithsonian,ycba,nga",
        help="Comma-separated source ids. Supported: met,aic,rijks,nga,smithsonian,ycba",
    )
    parser.add_argument(
        "--target-per-source",
        type=int,
        default=25,
        help="Target normalized candidates per source",
    )
    parser.add_argument(
        "--query",
        help="Legacy compatibility flag. When provided without --sources, candidate building defaults to met only.",
    )
    parser.add_argument("--output", type=Path, help="Optional output JSON path")
    args = parser.parse_args()

    if args.query and args.sources == parser.get_default("sources"):
        sources = ["met"]
    else:
        sources = parse_sources(args.sources)
    if args.target_per_source <= 0:
        raise ValueError("--target-per-source must be greater than 0")

    requested_targets = {source: args.target_per_source for source in sources}
    candidate_pools = collect_candidates_for_sources(requested_targets)
    payload = {
        "version": "museum-candidates-v2",
        "generatedAt": now_iso(),
        "sources": sources,
        "targetPerSource": args.target_per_source,
        "pools": candidate_pools,
    }
    output = args.output or TMP_DIR / "candidates-batch.json"
    write_json(output, payload)
    total = sum(len(pool) for pool in candidate_pools.values())
    print(f"Wrote {total} normalized candidates across {len(candidate_pools)} sources to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
