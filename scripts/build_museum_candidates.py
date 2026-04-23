#!/usr/bin/env python3
"""Fetch Met Museum candidate artwork records for human Museum review."""

from __future__ import annotations

import argparse
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parents[1]
OUT_DIR = BASE_DIR / "tmp" / "museum"
MET_API = "https://collectionapi.metmuseum.org/public/collection/v1"


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "Daybreak Museum candidate builder"})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except (ssl.SSLError, urllib.error.URLError):
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(request, timeout=20, context=context) as response:
            return json.loads(response.read().decode("utf-8"))


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "museum"


def has_required_metadata(obj: dict[str, Any]) -> bool:
    creator = (obj.get("artistDisplayName") or obj.get("culture") or obj.get("department") or "").strip()
    required_strings = [
        obj.get("title"),
        obj.get("objectDate"),
        obj.get("medium"),
        obj.get("objectURL"),
        obj.get("primaryImage"),
        obj.get("primaryImageSmall"),
        creator,
    ]
    return all(isinstance(value, str) and value.strip() for value in required_strings)


def build_candidate(obj: dict[str, Any]) -> dict[str, Any]:
    creator = (obj.get("artistDisplayName") or obj.get("culture") or obj.get("department") or "").strip()
    return {
        "source": {
            "institution": "met",
            "objectId": obj["objectID"],
            "objectUrl": obj["objectURL"],
            "license": "CC0",
        },
        "metadata": {
            "title": obj.get("title", "").strip(),
            "artistOrCulture": creator,
            "objectDate": obj.get("objectDate", "").strip(),
            "medium": obj.get("medium", "").strip(),
            "department": obj.get("department", "").strip(),
            "culture": obj.get("culture", "").strip(),
            "period": obj.get("period", "").strip(),
            "country": obj.get("country", "").strip(),
            "classification": obj.get("classification", "").strip(),
            "isHighlight": bool(obj.get("isHighlight")),
            "isTimelineWork": bool(obj.get("isTimelineWork")),
        },
        "images": {
            "thumbnailUrl": obj.get("primaryImageSmall", "").strip(),
            "displayUrl": obj.get("primaryImageSmall", "").strip(),
            "fullUrl": obj.get("primaryImage", "").strip(),
        },
        "reviewTemplate": {
            "periodKey": "",
            "periodTag": "",
            "mediumCategory": "",
            "geoRegion": "",
            "context": {
                "technique": "",
                "surprisingFact": "",
                "connection": "",
            },
            "questions": [
                {"kind": "observation", "prompt": "", "options": [], "answerIndex": 0, "reinforcement": ""},
                {"kind": "context", "prompt": "", "options": [], "answerIndex": 0, "reinforcement": ""},
                {"kind": "connection", "prompt": "", "options": [], "answerIndex": 0, "reinforcement": ""},
            ],
            "review": {
                "status": "needs_review",
                "factCheckSources": [obj.get("objectURL", "").strip()],
                "safetyFlags": [],
            },
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--query", required=True, help="Met search query, for example: sunflowers")
    parser.add_argument("--limit", type=int, default=80, help="Maximum reviewed candidates to write")
    parser.add_argument("--highlight-only", action="store_true", help="Only request Met highlights")
    parser.add_argument("--output", type=Path, help="Optional output JSON path")
    args = parser.parse_args()

    params = {
        "q": args.query,
        "hasImages": "true",
    }
    if args.highlight_only:
        params["isHighlight"] = "true"

    search_url = f"{MET_API}/search?{urllib.parse.urlencode(params)}"
    search = fetch_json(search_url)
    object_ids = search.get("objectIDs") or []
    candidates: list[dict[str, Any]] = []

    for object_id in object_ids:
        if len(candidates) >= args.limit:
            break
        obj = fetch_json(f"{MET_API}/objects/{object_id}")
        if not obj.get("isPublicDomain"):
            continue
        if not has_required_metadata(obj):
            continue
        candidates.append(build_candidate(obj))
        time.sleep(0.025)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output = args.output or OUT_DIR / f"candidates-{slugify(args.query)}.json"
    payload = {
        "version": "museum-candidates-v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "query": args.query,
        "searchUrl": search_url,
        "resultCount": len(candidates),
        "candidates": candidates,
    }
    output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(candidates)} candidates to {output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
