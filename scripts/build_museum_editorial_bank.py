#!/usr/bin/env python3
"""Build the Museum editorial bank and tracker from normalized source pools."""

from __future__ import annotations

import argparse
from pathlib import Path

from museum_pipeline_common import (
    DEFAULT_APPROVED_QUOTAS,
    DEFAULT_SOURCED_ONLY_QUOTAS,
    EDITORIAL_SHARDS_DIR,
    EDITORIAL_BANK_PATH,
    SCHEDULE_PATH,
    TRACKER_PATH,
    TMP_DIR,
    build_editorial_payload,
    build_schedule_entries,
    collect_candidates_for_sources,
    now_iso,
    parse_date,
    project_curated_payload,
    read_json,
    tracker_markdown,
    validate_curated_quality,
    validate_editorial_payload,
    write_json,
)

EXPECTED_EDITOR_AGENTS = {"Editor A", "Editor B1", "Editor B2", "Editor B3", "Editor B4"}


def parse_quota_pairs(raw_pairs: list[str]) -> dict[str, int]:
    quotas: dict[str, int] = {}
    for pair in raw_pairs:
        source, _, raw_value = pair.partition("=")
        source = source.strip()
        if not source or not raw_value.strip():
            raise ValueError(f"Invalid quota override: {pair}")
        quotas[source] = int(raw_value)
    return quotas


def load_editor_agent_roster() -> list[str]:
    if not EDITORIAL_SHARDS_DIR.exists():
        raise FileNotFoundError(f"Museum editorial shard directory is missing: {EDITORIAL_SHARDS_DIR}")

    agents: set[str] = set()
    for path in sorted(EDITORIAL_SHARDS_DIR.glob("*.json")):
        payload = read_json(path)
        agent = str(payload.get("agent") or "").strip()
        if agent:
            agents.add(agent)

    missing = sorted(EXPECTED_EDITOR_AGENTS - agents)
    if missing:
        raise ValueError(f"Museum editorial shards are missing required editor-agent approvals: {missing}")
    return sorted(agents)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--approved-target", type=int, default=365, help="Approved artworks to ship into the runtime annual pack")
    parser.add_argument("--start", default="2026-04-23", help="Start date used for tracker/schedule preview, YYYY-MM-DD")
    parser.add_argument(
        "--candidates-file",
        type=Path,
        default=TMP_DIR / "museum-annual-candidates.json",
        help="Optional candidate-pool cache JSON path",
    )
    parser.add_argument(
        "--reuse-candidates",
        action="store_true",
        help="Reuse the cached candidate pool file instead of refetching source data",
    )
    parser.add_argument(
        "--source-target",
        action="append",
        default=[],
        help="Override candidate collection targets, e.g. --source-target met=120",
    )
    parser.add_argument(
        "--approved-quota",
        action="append",
        default=[],
        help="Override approved-per-source quotas, e.g. --approved-quota smithsonian=165",
    )
    parser.add_argument(
        "--sourced-only-quota",
        action="append",
        default=[],
        help="Override sourced-only quotas, e.g. --sourced-only-quota nga=10",
    )
    parser.add_argument("--output", type=Path, default=EDITORIAL_BANK_PATH, help="Editorial bank JSON output")
    parser.add_argument("--tracker", type=Path, default=TRACKER_PATH, help="Generated markdown tracker output")
    args = parser.parse_args()

    approved_target = args.approved_target
    if approved_target < 365:
        raise ValueError("--approved-target must be at least 365 for the annual pack")

    candidate_targets = {
        "smithsonian": 240,
        "met": 95,
        "aic": 140,
        "rijks": 45,
        "ycba": 20,
        "nga": 45,
    }
    candidate_targets.update(parse_quota_pairs(args.source_target))
    approved_quotas = dict(DEFAULT_APPROVED_QUOTAS)
    approved_quotas.update(parse_quota_pairs(args.approved_quota))
    sourced_only_quotas = dict(DEFAULT_SOURCED_ONLY_QUOTAS)
    sourced_only_quotas.update(parse_quota_pairs(args.sourced_only_quota))
    editor_agents = load_editor_agent_roster()

    if args.reuse_candidates and args.candidates_file.exists():
        cached = read_json(args.candidates_file)
        candidate_pools = cached.get("pools") or {}
    else:
        candidate_pools = collect_candidates_for_sources(candidate_targets)
        write_json(
            args.candidates_file,
            {
                "version": "museum-candidate-cache-v1",
                "generatedAt": now_iso(),
                "targets": candidate_targets,
                "pools": candidate_pools,
            },
        )
    editorial_payload = build_editorial_payload(
        candidate_pools,
        approved_target=approved_target,
        approved_quotas=approved_quotas,
        sourced_only_quotas=sourced_only_quotas,
        editor_agent=f"Editor Merge ({', '.join(editor_agents)})",
    )
    errors = validate_editorial_payload(editorial_payload)
    if errors:
        raise ValueError("\n".join(errors[:50]))

    curated_payload = project_curated_payload(editorial_payload)
    curated_errors = validate_curated_quality(curated_payload)
    if curated_errors:
        raise ValueError("\n".join(curated_errors[:50]))
    entries = build_schedule_entries(curated_payload["artworks"], parse_date(args.start), approved_target)
    schedule_payload = {
        "version": "museum-schedule-v2",
        "generatedAt": now_iso(),
        "start": args.start,
        "through": entries[-1]["date"],
        "days": len(entries),
        "entries": entries,
    }

    write_json(args.output, editorial_payload)
    tracker = tracker_markdown(editorial_payload, curated_payload, schedule_payload)
    args.tracker.parent.mkdir(parents=True, exist_ok=True)
    args.tracker.write_text(tracker)
    print(
        f"Wrote Museum editorial bank with {len(editorial_payload['records'])} records to {args.output} "
        f"and tracker to {args.tracker}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
