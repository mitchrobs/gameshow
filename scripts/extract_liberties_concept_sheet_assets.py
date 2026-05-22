from __future__ import annotations

import json
import shutil
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "tmp" / "liberties-theme-source.png"
WEB_DIR = ROOT / "assets" / "liberties" / "themes"
IOS_DIR = ROOT / "tmp" / "liberties-ios-assets" / "LibertiesPieces.xcassets"
CONTACT_PATH = ROOT / "tmp" / "liberties-concept-assets-contact.png"

KINDS = ("black", "white", "blocker")
ROWS = (
    ("pebble", 0),
    ("knob", 1),
    ("neo-city-light", 2),
    ("neo-city-dark", 2),
    ("soft-ceramic", 3),
)
WEB_THEME_DIRS = {
    "pebble": WEB_DIR / "pebble",
    "knob": WEB_DIR / "knob",
    "neo-city-light": WEB_DIR / "neo-city" / "light",
    "neo-city-dark": WEB_DIR / "neo-city" / "dark",
    "soft-ceramic": WEB_DIR / "soft-ceramic",
}


def write_ios_contents(path: Path, images: list[dict[str, str]] | None = None) -> None:
    path.mkdir(parents=True, exist_ok=True)
    payload: dict[str, object] = {"info": {"author": "xcode", "version": 1}}
    if images is not None:
        payload["images"] = images
    (path / "Contents.json").write_text(json.dumps(payload, indent=2) + "\n")


def remove_green_key(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    alpha = Image.new("L", rgba.size, 255)
    alpha_pixels = alpha.load()

    for y in range(height):
        for x in range(width):
            red, green, blue, _ = pixels[x, y]
            green_score = green - max(red, blue)
            if green > 90 and green_score > 22:
                if green_score >= 86:
                    value = 0
                else:
                    value = round(255 * (86 - green_score) / 64)
                alpha_pixels[x, y] = max(0, min(255, value))
                if value < 255:
                    neutral_green = min(green, round((red + blue) / 2) + 8)
                    pixels[x, y] = (red, neutral_green, blue, 255)

    alpha = alpha.filter(ImageFilter.GaussianBlur(0.45))
    rgba.putalpha(alpha)
    return rgba


def normalize_piece(piece: Image.Image) -> Image.Image:
    alpha = piece.getchannel("A")
    box = alpha.point(lambda value: 255 if value > 14 else 0).getbbox()
    if box is None:
        raise RuntimeError("empty extracted asset")
    pad = 14
    box = (
        max(0, box[0] - pad),
        max(0, box[1] - pad),
        min(piece.width, box[2] + pad),
        min(piece.height, box[3] + pad),
    )
    subject = piece.crop(box)
    scale = 448 / max(subject.size)
    subject = subject.resize(
        (max(1, round(subject.width * scale)), max(1, round(subject.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.alpha_composite(subject, ((512 - subject.width) // 2, (512 - subject.height) // 2 + 4))
    return canvas


def extract_assets(source_path: Path) -> dict[tuple[str, str], Image.Image]:
    source = Image.open(source_path).convert("RGBA")
    col_width = source.width / 3
    row_height = source.height / 4
    assets: dict[tuple[str, str], Image.Image] = {}
    for theme, row_index in ROWS:
        for col_index, kind in enumerate(KINDS):
            margin_x = round(col_width * 0.05)
            margin_y = round(row_height * 0.06)
            left = round(col_index * col_width + margin_x)
            top = round(row_index * row_height + margin_y)
            right = round((col_index + 1) * col_width - margin_x)
            bottom = round((row_index + 1) * row_height - margin_y)
            crop = source.crop((left, top, right, bottom))
            assets[(theme, kind)] = normalize_piece(remove_green_key(crop))
    return assets


def save_web_assets(assets: dict[tuple[str, str], Image.Image]) -> None:
    for theme, _ in ROWS:
        theme_dir = WEB_THEME_DIRS[theme]
        theme_dir.mkdir(parents=True, exist_ok=True)
        for stale in theme_dir.glob("*.png"):
            stale.unlink()
        for kind in KINDS:
            assets[(theme, kind)].save(theme_dir / f"{kind}.png")


def save_ios_assets(assets: dict[tuple[str, str], Image.Image]) -> None:
    if IOS_DIR.exists():
        shutil.rmtree(IOS_DIR)
    write_ios_contents(IOS_DIR)
    for theme, _ in ROWS:
        for kind in KINDS:
            image_set = IOS_DIR / f"liberties-{theme}-{kind}.imageset"
            image_set.mkdir(parents=True, exist_ok=True)
            images: list[dict[str, str]] = []
            for scale, size in (("1x", 96), ("2x", 192), ("3x", 288)):
                filename = f"liberties-{theme}-{kind}@{scale}.png"
                assets[(theme, kind)].resize((size, size), Image.Resampling.LANCZOS).save(image_set / filename)
                images.append({"idiom": "universal", "filename": filename, "scale": scale})
            write_ios_contents(image_set, images)


def save_contact_sheet(assets: dict[tuple[str, str], Image.Image]) -> None:
    sheet = Image.new("RGB", (1080, 1410), (17, 29, 35))
    draw = ImageDraw.Draw(sheet)
    labels = {
        "pebble": "pebble",
        "knob": "knob",
        "neo-city-light": "neo / light",
        "neo-city-dark": "neo / dark",
        "soft-ceramic": "soft",
    }
    for row, (theme, _) in enumerate(ROWS):
        y = 34 + row * 270
        draw.text((34, y), labels[theme], fill=(230, 236, 233))
        for col, kind in enumerate(KINDS):
            asset = assets[(theme, kind)].resize((184, 184), Image.Resampling.LANCZOS)
            x = 245 + col * 275
            draw.line((x + 92, y + 12, x + 92, y + 172), fill=(78, 96, 100), width=1)
            draw.line((x + 12, y + 92, x + 172, y + 92), fill=(78, 96, 100), width=1)
            sheet.paste(asset.convert("RGB"), (x, y), asset)
            draw.text((x + 54, y + 200), kind, fill=(160, 176, 178))
    sheet.save(CONTACT_PATH)
    print(CONTACT_PATH)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract Liberties theme assets from a concept sheet.")
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help="Path to a 3-column by 4-row Liberties concept sheet.",
    )
    args = parser.parse_args()
    if not args.source.exists():
        raise SystemExit(f"Source sheet not found: {args.source}")

    assets = extract_assets(args.source)
    save_web_assets(assets)
    save_ios_assets(assets)
    save_contact_sheet(assets)


if __name__ == "__main__":
    main()
