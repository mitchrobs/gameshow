#!/usr/bin/env python3
"""Extract Dawn tile art assets from a generated 20-tile contact sheet."""

from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

from PIL import Image


DEFAULT_MANIFEST = Path("assets/dawn-cabinet/dawn-tiles/dawn-tile-prompts.json")
DEFAULT_OUT_DIR = Path("assets/dawn-cabinet/dawn-tiles")


def bright_mask_components(image: Image.Image) -> list[tuple[int, int, int, int, int]]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    mask = bytearray(width * height)
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            if r > 180 and g > 160 and b > 120:
                mask[y * width + x] = 1

    seen = bytearray(width * height)
    boxes: list[tuple[int, int, int, int, int]] = []
    for y in range(height):
        for x in range(width):
            offset = y * width + x
            if not mask[offset] or seen[offset]:
                continue
            queue = deque([(x, y)])
            seen[offset] = 1
            min_x = max_x = x
            min_y = max_y = y
            count = 0
            while queue:
                cx, cy = queue.popleft()
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    n_offset = ny * width + nx
                    if mask[n_offset] and not seen[n_offset]:
                        seen[n_offset] = 1
                        queue.append((nx, ny))
            if count > 5000:
                boxes.append((min_x, min_y, max_x, max_y, count))
    boxes = sorted(boxes, key=lambda box: box[1])
    rows: list[list[tuple[int, int, int, int, int]]] = []
    for box in boxes:
        center_y = (box[1] + box[3]) / 2
        for row in rows:
            row_center_y = sum((item[1] + item[3]) / 2 for item in row) / len(row)
            if abs(center_y - row_center_y) < 80:
                row.append(box)
                break
        else:
            rows.append([box])
    return [
        box
        for row in rows
        for box in sorted(row, key=lambda item: item[0])
    ]


def panel_crop(image: Image.Image, box: tuple[int, int, int, int, int]) -> Image.Image:
    min_x, min_y, max_x, max_y, _ = box
    width = max_x - min_x
    height = max_y - min_y
    left = min_x + round(width * 0.10)
    top = min_y + round(height * 0.06)
    right = max_x - round(width * 0.10)
    bottom = max_y - round(height * 0.13)
    crop = image.crop((left, top, right, bottom))
    side = max(crop.size)
    square = Image.new("RGBA", (side, side), (255, 244, 218, 0))
    square.alpha_composite(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
    return isolate_center_mark(square.resize((512, 512), Image.Resampling.LANCZOS))


def isolate_center_mark(image: Image.Image) -> Image.Image:
    """Remove generated panel paper/frame so the art sits on the game tile face."""
    asset = image.convert("RGBA")
    pixels = asset.load()
    width, height = asset.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            max_channel = max(r, g, b)
            min_channel = min(r, g, b)
            chroma = max_channel - min_channel

            is_paper = max_channel > 205 and min_channel > 158 and chroma < 82
            is_low_contrast_wash = max_channel > 182 and min_channel > 126 and chroma < 62
            is_edge_frame = x < 58 or x > width - 58 or y < 58 or y > height - 58
            if is_paper or is_low_contrast_wash or is_edge_frame:
                pixels[x, y] = (r, g, b, 0)

    bounds = asset.getchannel("A").getbbox()
    if not bounds:
        return asset

    crop = asset.crop(bounds)
    side = max(crop.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.alpha_composite(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
    return square.resize((512, 512), Image.Resampling.LANCZOS)


def load_variants(manifest_path: Path) -> list[dict]:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    variants = manifest.get("variants")
    if not isinstance(variants, list) or len(variants) != 20:
        raise SystemExit(f"Expected 20 variants in {manifest_path}")
    return variants


def update_manifest(manifest_path: Path, source: Path, direction: str) -> None:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["status"] = "accepted-built-in-imagegen-assets"
    manifest["acceptedDirection"] = direction
    manifest["acceptedSourceContactSheet"] = f"generated_images/{source.name}"
    for variant in manifest.get("variants", []):
        variant["reviewStatus"] = f"accepted-{direction}"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", help="Generated 20-tile contact sheet PNG")
    parser.add_argument("--manifest", default=str(DEFAULT_MANIFEST))
    parser.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR))
    parser.add_argument("--direction", default="built-in-imagegen-porcelain-game-aligned")
    parser.add_argument("--no-manifest-update", action="store_true")
    args = parser.parse_args()

    source = Path(args.source)
    manifest_path = Path(args.manifest)
    out_dir = Path(args.out_dir)
    variants = load_variants(manifest_path)
    image = Image.open(source).convert("RGBA")
    boxes = bright_mask_components(image)
    if len(boxes) != 20:
        raise SystemExit(f"Expected 20 tile components, found {len(boxes)}")

    out_dir.mkdir(parents=True, exist_ok=True)
    for variant, box in zip(variants, boxes):
        asset = panel_crop(image, box)
        asset.save(out_dir / variant["filename"])

    if not args.no_manifest_update:
        update_manifest(manifest_path, source, args.direction)
    print(f"Extracted {len(boxes)} Dawn tile assets from {source} into {out_dir}")


if __name__ == "__main__":
    main()
