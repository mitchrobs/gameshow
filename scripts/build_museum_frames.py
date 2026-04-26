#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
from collections import deque
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
META_PATH = ROOT / "src/data/museumFrameCatalog.meta.json"
SOURCE_PATH = ROOT / "assets/museum/frame-contact-sheet.png"
ASSET_ROOT = ROOT / "assets/museum/frames"
MANIFEST_PATH = ROOT / "src/data/museumFrameCatalog.generated.ts"
COLS = 10
ROWS = 5
CELL_MARGIN_X = 8
CELL_MARGIN_TOP = 24
CELL_MARGIN_BOTTOM = 34
BACKGROUND_TOLERANCE = 10
INNER_PADDING = 0.96


SHAPE_ASPECT = {
    "portrait-2x3": 2 / 3,
    "portrait-3x4": 3 / 4,
    "portrait-4x5": 4 / 5,
    "square-1x1": 1.0,
    "landscape-4x3": 4 / 3,
    "landscape-3x2": 3 / 2,
    "landscape-16x9": 16 / 9,
    "arched-portrait": 3 / 4,
    "oval-portrait": 3 / 4,
}

TARGET_SIZE = {
    "portrait-2x3": (480, 720),
    "portrait-3x4": (540, 720),
    "portrait-4x5": (576, 720),
    "square-1x1": (720, 720),
    "landscape-4x3": (720, 540),
    "landscape-3x2": (720, 480),
    "landscape-16x9": (720, 405),
    "arched-portrait": (540, 720),
    "oval-portrait": (540, 720),
}

OPENING_DARK_THRESHOLDS = (45, 55, 65, 75, 90, 110)
OPENING_ALPHA_THRESHOLD = 60


def load_meta() -> dict[str, Any]:
    return json.loads(META_PATH.read_text())


def color_distance(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> float:
    return math.sqrt(sum((a[index] - b[index]) ** 2 for index in range(3)))


def clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, value))


def luminance(pixel: tuple[int, int, int, int]) -> float:
    red, green, blue, _alpha = pixel
    return red * 0.299 + green * 0.587 + blue * 0.114


def get_cell_bounds(width: int, height: int, source_index: int) -> tuple[int, int, int, int]:
    cell_w = width / COLS
    cell_h = height / ROWS
    row = (source_index - 1) // COLS
    col = (source_index - 1) % COLS
    x0 = round(col * cell_w + CELL_MARGIN_X)
    x1 = round((col + 1) * cell_w - CELL_MARGIN_X)
    y0 = round(row * cell_h + CELL_MARGIN_TOP)
    y1 = round((row + 1) * cell_h - CELL_MARGIN_BOTTOM)
    return (x0, y0, x1, y1)


def flood_fill_outer_background(cell: Image.Image) -> list[list[bool]]:
    width, height = cell.size
    pixels = cell.load()
    samples = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
        pixels[width // 2, 0],
        pixels[width // 2, min(3, height - 1)],
        pixels[0, height // 2],
        pixels[width - 1, height // 2],
    ]
    background = tuple(int(sum(sample[index] for sample in samples) / len(samples)) for index in range(4))
    outer = [[False for _ in range(height)] for _ in range(width)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= width or y >= height or outer[x][y]:
            continue
        if color_distance(pixels[x, y], background) > BACKGROUND_TOLERANCE:
            continue
        outer[x][y] = True
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return outer


def extract_frame_crop(sheet: Image.Image, source_index: int) -> Image.Image:
    x0, y0, x1, y1 = get_cell_bounds(*sheet.size, source_index)
    cell = sheet.crop((x0, y0, x1, y1)).convert("RGBA")
    outer = flood_fill_outer_background(cell)
    width, height = cell.size

    xs: list[int] = []
    ys: list[int] = []
    for x in range(width):
        for y in range(height):
            if not outer[x][y]:
                xs.append(x)
                ys.append(y)

    if not xs or not ys:
        raise RuntimeError(f"Unable to detect frame bounds for source index {source_index}")

    bbox = (min(xs), min(ys), max(xs) + 1, max(ys) + 1)
    crop = cell.crop(bbox)
    crop_pixels = crop.load()
    crop_width, crop_height = crop.size

    for x in range(crop_width):
        for y in range(crop_height):
            cell_x = bbox[0] + x
            cell_y = bbox[1] + y
            if outer[cell_x][cell_y]:
                crop_pixels[x, y] = (0, 0, 0, 0)

    return crop


def fit_crop_to_canvas(crop: Image.Image, shape: str) -> Image.Image:
    canvas_width, canvas_height = TARGET_SIZE[shape]
    canvas = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))
    crop = ImageOps.exif_transpose(crop)
    scale = min((canvas_width * INNER_PADDING) / crop.width, (canvas_height * INNER_PADDING) / crop.height)
    resized = crop.resize(
        (max(1, round(crop.width * scale)), max(1, round(crop.height * scale))),
        Image.Resampling.LANCZOS,
    ).filter(ImageFilter.UnsharpMask(radius=1.1, percent=135, threshold=2))
    paste_x = (canvas_width - resized.width) // 2
    paste_y = (canvas_height - resized.height) // 2
    canvas.alpha_composite(resized, (paste_x, paste_y))
    return canvas


def find_opening_seed(image: Image.Image, threshold: float) -> tuple[int, int] | None:
    width, height = image.size
    pixels = image.load()
    center_x = width // 2
    center_y = height // 2
    max_radius = max(width, height) // 3

    for radius in range(0, max_radius + 1, 4):
        points = [
            (center_x, center_y),
            (center_x + radius, center_y),
            (center_x - radius, center_y),
            (center_x, center_y + radius),
            (center_x, center_y - radius),
            (center_x + radius, center_y + radius),
            (center_x - radius, center_y + radius),
            (center_x + radius, center_y - radius),
            (center_x - radius, center_y - radius),
        ]
        for x, y in points:
            if not (0 <= x < width and 0 <= y < height):
                continue
            pixel = pixels[x, y]
            if pixel[3] <= OPENING_ALPHA_THRESHOLD:
                continue
            if luminance(pixel) < threshold:
                return (x, y)

    return None


def detect_opening_rect(placed_frame: Image.Image) -> tuple[int, int, int, int]:
    width, height = placed_frame.size
    pixels = placed_frame.load()

    for threshold in OPENING_DARK_THRESHOLDS:
        seed = find_opening_seed(placed_frame, threshold)
        if seed is None:
            continue

        visited: set[tuple[int, int]] = {seed}
        queue: deque[tuple[int, int]] = deque([seed])
        points: list[tuple[int, int]] = []

        while queue:
            x, y = queue.popleft()
            points.append((x, y))

            for next_x, next_y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if not (0 <= next_x < width and 0 <= next_y < height):
                    continue
                if (next_x, next_y) in visited:
                    continue
                pixel = pixels[next_x, next_y]
                if pixel[3] <= OPENING_ALPHA_THRESHOLD:
                    continue
                if luminance(pixel) >= threshold:
                    continue
                visited.add((next_x, next_y))
                queue.append((next_x, next_y))

        if not points:
            continue

        xs = [point[0] for point in points]
        ys = [point[1] for point in points]
        rect = (min(xs), min(ys), max(xs) + 1, max(ys) + 1)
        rect_width = rect[2] - rect[0]
        rect_height = rect[3] - rect[1]
        coverage = (rect_width * rect_height) / float(width * height)

        if rect_width < width * 0.24 or rect_height < height * 0.24:
            continue
        if coverage > 0.72:
            continue

        return rect

    return detect_opening_rect_by_scan(placed_frame)


def detect_opening_rect_by_scan(placed_frame: Image.Image) -> tuple[int, int, int, int]:
    width, height = placed_frame.size
    pixels = placed_frame.load()
    band_y0 = int(height * 0.35)
    band_y1 = int(height * 0.65)
    band_x0 = int(width * 0.35)
    band_x1 = int(width * 0.65)

    column_profile: list[float] = []
    for x in range(width):
        values: list[float] = []
        for y in range(band_y0, band_y1):
            pixel = pixels[x, y]
            if pixel[3] > OPENING_ALPHA_THRESHOLD:
                values.append(luminance(pixel))
        column_profile.append(sum(values) / len(values) if values else 255)

    row_profile: list[float] = []
    for y in range(height):
        values = []
        for x in range(band_x0, band_x1):
            pixel = pixels[x, y]
            if pixel[3] > OPENING_ALPHA_THRESHOLD:
                values.append(luminance(pixel))
        row_profile.append(sum(values) / len(values) if values else 255)

    center_column = column_profile[width // 2]
    center_row = row_profile[height // 2]
    threshold_delta = 8
    run_length = 4

    def find_left() -> int:
        for x in range(width // 2, run_length, -1):
            if all(column_profile[index] > center_column + threshold_delta for index in range(x - run_length + 1, x + 1)):
                return x + 1
        return 0

    def find_right() -> int:
        for x in range(width // 2, width - run_length):
            if all(column_profile[index] > center_column + threshold_delta for index in range(x, x + run_length)):
                return x - 1
        return width - 1

    def find_top() -> int:
        for y in range(height // 2, run_length, -1):
            if all(row_profile[index] > center_row + threshold_delta for index in range(y - run_length + 1, y + 1)):
                return y + 1
        return 0

    def find_bottom() -> int:
        for y in range(height // 2, height - run_length):
            if all(row_profile[index] > center_row + threshold_delta for index in range(y, y + run_length)):
                return y - 1
        return height - 1

    rect = (find_left(), find_top(), find_right() + 1, find_bottom() + 1)
    rect_width = rect[2] - rect[0]
    rect_height = rect[3] - rect[1]
    if rect_width < width * 0.2 or rect_height < height * 0.2:
        raise RuntimeError("Unable to detect the visible opening for a frame asset")
    return rect


def draw_window_mask(draw: ImageDraw.ImageDraw, rect: tuple[int, int, int, int], art_mask: str, fill: int) -> None:
    x0, y0, x1, y1 = rect
    if art_mask == "oval":
        draw.ellipse((x0, y0, x1, y1), fill=fill)
        return
    if art_mask == "arch":
        arch_radius = round((x1 - x0) / 2)
        arch_height = min(arch_radius * 2, round((y1 - y0) * 1.16))
        draw.rectangle((x0, y0 + arch_height // 2, x1, y1), fill=fill)
        draw.ellipse((x0, y0, x1, y0 + arch_height), fill=fill)
        return
    draw.rectangle((x0, y0, x1, y1), fill=fill)


def inset_rect(rect: tuple[int, int, int, int], inset: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = rect
    return (x0 + inset, y0 + inset, x1 - inset, y1 - inset)


def derive_landscape_shape(base_shape: str) -> str:
    if base_shape == "portrait-2x3":
        return "landscape-3x2"
    return "landscape-4x3"


def build_overlay(
    placed_frame: Image.Image,
    opening_rect: tuple[int, int, int, int],
    art_mask: str,
    mat: dict[str, Any] | None,
) -> tuple[Image.Image, Image.Image | None, dict[str, float]]:
    width, height = placed_frame.size
    overlay = placed_frame.copy()
    window = opening_rect

    clear_mask = Image.new("L", overlay.size, 0)
    clear_draw = ImageDraw.Draw(clear_mask)
    draw_window_mask(clear_draw, window, art_mask, 255)
    overlay.putalpha(ImageChops.subtract(overlay.getchannel("A"), clear_mask))

    mask_image = None
    if art_mask != "rect":
        mask_image = Image.new("RGBA", overlay.size, (0, 0, 0, 0))
        mask_draw = ImageDraw.Draw(mask_image)
        draw_window_mask(mask_draw, window, art_mask, 255)

    aperture = window
    if mat and mat.get("enabled", True):
        opening_width = max(1, window[2] - window[0])
        opening_height = max(1, window[3] - window[1])
        max_inset = max(0, min((opening_width - 8) // 2, (opening_height - 8) // 2))
        inset = round(float(mat["width"]) * min(opening_width, opening_height))
        inset = min(max_inset, max(2, inset))
        aperture = inset_rect(window, inset)
        mat_layer = Image.new("RGBA", overlay.size, (0, 0, 0, 0))
        mat_draw = ImageDraw.Draw(mat_layer)
        mat_mask = Image.new("L", overlay.size, 0)
        mat_mask_draw = ImageDraw.Draw(mat_mask)
        draw_window_mask(mat_mask_draw, window, art_mask, 255)
        mat_color = mat["color"]
        mat_draw.bitmap((0, 0), mat_mask, fill=mat_color)
        aperture_mask = Image.new("L", overlay.size, 0)
        aperture_draw = ImageDraw.Draw(aperture_mask)
        draw_window_mask(aperture_draw, aperture, art_mask, 255)
        mat_layer.putalpha(ImageChops.subtract(mat_mask, aperture_mask))
        overlay.alpha_composite(mat_layer)

    inner_window = {
        "x": round(aperture[0] / width, 4),
        "y": round(aperture[1] / height, 4),
        "width": round((aperture[2] - aperture[0]) / width, 4),
        "height": round((aperture[3] - aperture[1]) / height, 4),
    }
    validate_inner_window(inner_window)
    return overlay, mask_image, inner_window


def build_shadow(alpha_source: Image.Image) -> Image.Image:
    width, height = alpha_source.size
    alpha = alpha_source.getchannel("A").filter(ImageFilter.GaussianBlur(radius=18))
    shadow = Image.new("RGBA", alpha_source.size, (0, 0, 0, 0))
    layer = Image.new("RGBA", alpha_source.size, (0, 0, 0, 112))
    layer.putalpha(alpha)
    shadow.alpha_composite(layer, (0, 8))
    return shadow


def build_preview(overlay: Image.Image, shadow: Image.Image) -> Image.Image:
    preview = Image.new("RGBA", overlay.size, (24, 20, 18, 255))
    preview.alpha_composite(shadow)
    preview.alpha_composite(overlay)
    return preview


def validate_inner_window(inner: dict[str, float]) -> None:
    for key in ("x", "y", "width", "height"):
        value = float(inner[key])
        if not 0 <= value <= 1:
            raise ValueError(f"Inner window {key} is out of bounds: {value}")
    if inner["x"] + inner["width"] > 1 or inner["y"] + inner["height"] > 1:
        raise ValueError(f"Inner window exceeds bounds: {inner}")


def write_frame_assets(
    frame_id: str,
    overlay: Image.Image,
    shadow: Image.Image,
    preview: Image.Image,
    mask: Image.Image | None,
) -> None:
    frame_dir = ASSET_ROOT / frame_id
    if frame_dir.exists():
        shutil.rmtree(frame_dir)
    frame_dir.mkdir(parents=True, exist_ok=True)
    overlay.save(frame_dir / "overlay.png")
    shadow.save(frame_dir / "shadow.png")
    preview.save(frame_dir / "preview.png")
    if mask is not None:
        mask.save(frame_dir / "mask.png")


def normalize_tags(tags: list[str], extra: list[str]) -> list[str]:
    seen: list[str] = []
    for tag in [*tags, *extra]:
        if tag not in seen:
            seen.append(tag)
    return seen


def generate_runtime_entries(sheet: Image.Image, meta: dict[str, Any]) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []

    for seed in meta["frames"]:
        crop = extract_frame_crop(sheet, int(seed["sourceIndex"]))
        base_canvas = fit_crop_to_canvas(crop, seed["shape"])
        opening_rect = detect_opening_rect(base_canvas)
        overlay, mask, inner_window = build_overlay(
            base_canvas,
            opening_rect,
            seed["artMask"],
            seed.get("recommendedMat"),
        )
        shadow = build_shadow(overlay)
        preview = build_preview(overlay, shadow)
        write_frame_assets(seed["id"], overlay, shadow, preview, mask)

        entry = {
            "id": seed["id"],
            "label": seed["label"],
            "shape": seed["shape"],
            "style": seed["style"],
            "outerAspectRatio": round(SHAPE_ASPECT[seed["shape"]], 4),
            "innerWindow": inner_window,
            "artMask": seed["artMask"],
            "safeArtFit": seed["safeArtFit"],
            "tags": seed["tags"],
            "recommendedMat": seed["recommendedMat"],
            "assets": {
                "overlay": f"../../assets/museum/frames/{seed['id']}/overlay.png",
                "shadow": f"../../assets/museum/frames/{seed['id']}/shadow.png",
                "preview": f"../../assets/museum/frames/{seed['id']}/preview.png",
            },
        }
        if mask is not None:
            entry["assets"]["mask"] = f"../../assets/museum/frames/{seed['id']}/mask.png"
        entries.append(entry)

        if seed["allowRotateLandscape"]:
            landscape_shape = derive_landscape_shape(seed["shape"])
            rotated_id = f"{seed['id']}-landscape"
            rotated_canvas = fit_crop_to_canvas(crop.rotate(90, expand=True), landscape_shape)
            rotated_opening_rect = detect_opening_rect(rotated_canvas)
            rotated_overlay, rotated_mask, rotated_inner = build_overlay(
                rotated_canvas,
                rotated_opening_rect,
                seed["artMask"],
                seed.get("recommendedMat"),
            )
            rotated_shadow = build_shadow(rotated_overlay)
            rotated_preview = build_preview(rotated_overlay, rotated_shadow)
            write_frame_assets(rotated_id, rotated_overlay, rotated_shadow, rotated_preview, rotated_mask)

            rotated_entry = {
                "id": rotated_id,
                "label": f"{seed['label']} Landscape",
                "shape": landscape_shape,
                "style": seed["style"],
                "outerAspectRatio": round(SHAPE_ASPECT[landscape_shape], 4),
                "innerWindow": rotated_inner,
                "artMask": seed["artMask"],
                "safeArtFit": seed["safeArtFit"],
                "tags": normalize_tags(seed["tags"], ["landscape"]),
                "recommendedMat": seed["recommendedMat"],
                "assets": {
                    "overlay": f"../../assets/museum/frames/{rotated_id}/overlay.png",
                    "shadow": f"../../assets/museum/frames/{rotated_id}/shadow.png",
                    "preview": f"../../assets/museum/frames/{rotated_id}/preview.png",
                },
            }
            if rotated_mask is not None:
                rotated_entry["assets"]["mask"] = f"../../assets/museum/frames/{rotated_id}/mask.png"
            entries.append(rotated_entry)

    return entries


def emit_manifest(entries: list[dict[str, Any]]) -> None:
    lines = [
        "import type { FrameMeta } from './museumFrames';",
        "",
        "export const FRAME_MANIFEST: FrameMeta[] = [",
    ]

    for entry in entries:
        lines.extend(
            [
                "  {",
                f"    id: {json.dumps(entry['id'])},",
                f"    label: {json.dumps(entry['label'])},",
                f"    shape: {json.dumps(entry['shape'])},",
                f"    style: {json.dumps(entry['style'])},",
                f"    outerAspectRatio: {entry['outerAspectRatio']},",
                "    innerWindow: {",
                f"      x: {entry['innerWindow']['x']},",
                f"      y: {entry['innerWindow']['y']},",
                f"      width: {entry['innerWindow']['width']},",
                f"      height: {entry['innerWindow']['height']},",
                "    },",
                f"    artMask: {json.dumps(entry['artMask'])},",
                f"    safeArtFit: {json.dumps(entry['safeArtFit'])},",
                f"    tags: {json.dumps(entry['tags'])},",
                "    recommendedMat: {",
                f"      enabled: {str(entry['recommendedMat']['enabled']).lower()},",
                f"      color: {json.dumps(entry['recommendedMat']['color'])},",
                f"      width: {entry['recommendedMat']['width']},",
                "    },",
                "    assets: {",
                f"      overlay: require({json.dumps(entry['assets']['overlay'])}),",
                f"      shadow: require({json.dumps(entry['assets']['shadow'])}),",
                f"      preview: require({json.dumps(entry['assets']['preview'])}),",
            ]
        )
        if "mask" in entry["assets"]:
            lines.append(f"      mask: require({json.dumps(entry['assets']['mask'])}),")
        lines.extend(["    },", "  },"])

    lines.extend(["];", ""])
    MANIFEST_PATH.write_text("\n".join(lines))


def validate_output(entries: list[dict[str, Any]]) -> None:
    for entry in entries:
        validate_inner_window(entry["innerWindow"])
        for asset_path in entry["assets"].values():
            if not (ROOT / asset_path.replace("../../", "")).exists():
                raise FileNotFoundError(f"Missing generated asset for {entry['id']}: {asset_path}")


def main() -> None:
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(
            f"Reference sheet not found at {SOURCE_PATH}. Copy the provided contact sheet there and rerun."
        )

    meta = load_meta()
    sheet = Image.open(SOURCE_PATH).convert("RGBA")
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    entries = generate_runtime_entries(sheet, meta)
    emit_manifest(entries)
    validate_output(entries)
    print(f"Generated {len(entries)} Museum frame entries")
    print(f"Assets: {ASSET_ROOT}")
    print(f"Manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
