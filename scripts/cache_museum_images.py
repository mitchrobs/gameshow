#!/usr/bin/env python3
"""Cache browser-hostile Museum image URLs into local public assets."""

from __future__ import annotations

import argparse
from pathlib import Path

from museum_pipeline_common import (
    EDITORIAL_BANK_PATH,
    LOCAL_IMAGE_DIR,
    fetch_bytes,
    local_image_filename,
    needs_local_image_cache,
    read_json,
)


def source_image_url(record: dict) -> str:
    images = ((record.get("rawSource") or {}).get("images") or {})
    for key in ("displayUrl", "fullUrl", "thumbnailUrl"):
        value = str(images.get(key) or "")
        if value.startswith("http"):
            return value
    return ""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--editorial-bank", type=Path, default=EDITORIAL_BANK_PATH)
    parser.add_argument("--output-dir", type=Path, default=LOCAL_IMAGE_DIR)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    payload = read_json(args.editorial_bank)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    cached = 0
    skipped = 0
    failed: list[str] = []
    for record in payload.get("records", []):
        candidate = {
            "id": record["id"],
            "source": record.get("source", {}),
            "images": ((record.get("rawSource") or {}).get("images") or {}),
        }
        if not needs_local_image_cache(candidate):
            continue
        url = source_image_url(record)
        if not url:
            failed.append(f"{record['id']}: missing source image URL")
            continue
        output = args.output_dir / local_image_filename(record["id"])
        if output.exists() and not args.force:
            skipped += 1
            continue
        try:
            output.write_bytes(fetch_bytes(url))
            cached += 1
        except Exception as error:  # pragma: no cover - network/file-system dependent
            failed.append(f"{record['id']}: {error}")

    print(f"Cached {cached} Museum images to {args.output_dir}; skipped {skipped}.")
    if failed:
        for item in failed[:20]:
            print(f"- {item}")
        if len(failed) > 20:
            print(f"...and {len(failed) - 20} more")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
