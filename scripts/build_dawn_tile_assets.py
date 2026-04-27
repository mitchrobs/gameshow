#!/usr/bin/env python3
"""Build review PNG assets for Dawn Cabinet's premium Dawn tile direction.

The checked-in assets generated here are local review art. The manifest beside
them contains the prompt spec for a future AI/artist pass.
"""

from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


OUT_DIR = Path("assets/dawn-cabinet/dawn-tiles")
SIZE = 512
SCALE = 4
CANVAS = SIZE * SCALE

IVORY = (255, 246, 224, 255)
PAPER = (252, 232, 190, 255)
UMBER = (91, 52, 20, 255)
GOLD = (190, 128, 28, 255)
CINNABAR = (194, 78, 52, 255)
SOFT = (255, 250, 238, 255)
SHADOW = (54, 34, 18, 50)

VARIANTS = [
    ("plum-spray", "Plum spray", "angular plum branch with small cinnabar blossoms"),
    ("orchid-brush", "Orchid brush", "curved orchid leaves and one brushed bloom"),
    ("chrysanthemum-crest", "Chrysanthemum crest", "layered chrysanthemum bloom with engraved center"),
    ("peony-bud", "Peony bud", "round peony bud with folded petals"),
    ("camellia-branch", "Camellia branch", "camellia flower on a compact branch"),
    ("maple-leaf", "Maple leaf", "single warm maple leaf with ink vein"),
    ("willow-sprig", "Willow sprig", "hanging willow sprig with long brushed leaves"),
    ("pine-bough", "Pine bough", "short pine bough with restrained needles"),
    ("snowflower", "Snowflower", "soft six-petal winter flower, not a star"),
    ("spring-sprig", "Spring sprig", "fresh sprig with two leaves and a small bud"),
    ("autumn-leaf", "Autumn leaf", "long autumn leaf with cinnabar vein"),
    ("winter-branch", "Winter branch", "bare winter branch with two colored buds"),
    ("garden-gate", "Garden gate", "arched garden gate with low threshold"),
    ("mountain-pavilion", "Mountain pavilion", "small pavilion roof in front of distant peaks"),
    ("folding-fan", "Folding fan", "half-open painted fan with five ribs"),
    ("painted-scroll", "Painted scroll", "vertical scroll with brushed mark and red seal"),
    ("bronze-mirror", "Bronze mirror", "faceted bronze hand mirror, not a coin"),
    ("vermilion-tag", "Vermilion tag", "hanging vermilion talisman tag"),
    ("paper-charm", "Paper charm", "folded paper charm with a tied top"),
    ("morning-aster", "Morning aster", "small aster blossom with Dawn palette"),
]


def s(value: float) -> int:
    return round(value * SCALE)


def rgba(color: tuple[int, int, int, int], alpha: float = 1.0) -> tuple[int, int, int, int]:
    return (color[0], color[1], color[2], round(color[3] * alpha))


def draw_line(draw: ImageDraw.ImageDraw, points, fill=UMBER, width=8, joint="curve"):
    draw.line([(s(x), s(y)) for x, y in points], fill=fill, width=s(width), joint=joint)


def draw_leaf(draw: ImageDraw.ImageDraw, cx, cy, rx, ry, angle, fill=GOLD, outline=UMBER):
    pts = []
    for t in range(18):
        a = math.pi * t / 17
        x = math.sin(a) * rx
        y = -math.cos(a) * ry
        ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
        pts.append((s(cx + x * ca - y * sa), s(cy + x * sa + y * ca)))
    for t in range(18):
        a = math.pi - math.pi * t / 17
        x = -math.sin(a) * rx
        y = -math.cos(a) * ry
        ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
        pts.append((s(cx + x * ca - y * sa), s(cy + x * sa + y * ca)))
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=s(3), joint="curve")


def draw_petal(draw: ImageDraw.ImageDraw, cx, cy, rx, ry, angle, fill=CINNABAR):
    draw_leaf(draw, cx, cy, rx, ry, angle, fill=rgba(fill, 0.72), outline=rgba(UMBER, 0.72))


def draw_panel_base(seed: int) -> Image.Image:
    random.seed(seed)
    image = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([s(50), s(32), s(462), s(480)], radius=s(46), fill=SHADOW)
    shadow = shadow.filter(ImageFilter.GaussianBlur(s(8)))
    image.alpha_composite(shadow)

    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle([s(44), s(28), s(468), s(474)], radius=s(44), fill=PAPER, outline=UMBER, width=s(6))
    draw.rounded_rectangle([s(80), s(68), s(432), s(436)], radius=s(28), fill=IVORY, outline=GOLD, width=s(5))
    draw.rounded_rectangle([s(102), s(92), s(410), s(414)], radius=s(18), outline=rgba(UMBER, 0.2), width=s(2))
    for _ in range(300):
        x = random.randrange(s(84), s(428))
        y = random.randrange(s(72), s(432))
        a = random.randrange(10, 28)
        image.putpixel((x, y), (130, 90, 42, a))
    for x1, y1, x2, y2 in [(116, 110, 166, 110), (116, 110, 116, 160), (346, 110, 396, 110), (396, 110, 396, 160), (116, 394, 166, 394), (116, 344, 116, 394), (346, 394, 396, 394), (396, 344, 396, 394)]:
        draw_line(draw, [(x1, y1), (x2, y2)], fill=rgba(UMBER, 0.5), width=4)
    return image


def motif_plum(draw):
    draw_line(draw, [(150, 360), (205, 310), (272, 250), (356, 158)], width=9)
    draw_line(draw, [(226, 288), (202, 246), (218, 204)], width=5)
    draw_line(draw, [(286, 236), (338, 248), (366, 292)], width=5)
    for cx, cy in [(218, 204), (262, 254), (338, 248), (366, 292), (304, 198)]:
        for angle in [0, 72, 144, 216, 288]:
            draw_petal(draw, cx + math.cos(math.radians(angle)) * 13, cy + math.sin(math.radians(angle)) * 13, 8, 15, angle, CINNABAR if angle % 144 == 0 else GOLD)
        draw.ellipse([s(cx - 5), s(cy - 5), s(cx + 5), s(cy + 5)], fill=UMBER)


def motif_orchid(draw):
    draw_line(draw, [(168, 374), (208, 276), (290, 188), (360, 144)], width=8)
    draw_leaf(draw, 238, 272, 34, 76, -42, fill=rgba(GOLD, 0.62))
    draw_leaf(draw, 304, 236, 34, 78, 42, fill=rgba(CINNABAR, 0.58))
    draw_leaf(draw, 306, 302, 28, 70, 4, fill=rgba(GOLD, 0.42))
    draw_line(draw, [(196, 338), (250, 320), (300, 316)], fill=CINNABAR, width=5)


def motif_chrysanthemum(draw):
    for ring, scale, alpha in [(0, 1.0, 0.58), (18, 0.74, 0.48)]:
        for index in range(14):
            angle = index * 360 / 14 + ring
            draw_petal(draw, 256 + math.sin(math.radians(angle)) * 38 * scale, 258 - math.cos(math.radians(angle)) * 38 * scale, 13 * scale, 50 * scale, angle, CINNABAR if index % 2 else GOLD)
    draw.ellipse([s(238), s(240), s(274), s(276)], fill=UMBER)
    draw.ellipse([s(249), s(251), s(263), s(265)], fill=PAPER)


def motif_peony(draw):
    for cx, cy, rx, ry, angle, fill in [
        (214, 264, 40, 82, -32, CINNABAR),
        (298, 258, 44, 86, 28, GOLD),
        (256, 224, 38, 84, 0, CINNABAR),
        (250, 302, 34, 76, 180, GOLD),
    ]:
        draw_petal(draw, cx, cy, rx, ry, angle, fill)
    draw_line(draw, [(162, 360), (224, 334), (304, 334), (364, 360)], width=8)
    draw_line(draw, [(202, 390), (256, 368), (310, 390)], fill=CINNABAR, width=6)


def motif_camellia(draw):
    for angle in range(0, 360, 60):
        draw_petal(draw, 256 + math.cos(math.radians(angle)) * 34, 258 + math.sin(math.radians(angle)) * 28, 26, 64, angle + 90, GOLD if angle % 120 else CINNABAR)
    draw.ellipse([s(238), s(240), s(274), s(276)], fill=UMBER)
    draw_leaf(draw, 322, 344, 28, 56, 58, fill=rgba(GOLD, 0.42))
    draw_line(draw, [(166, 370), (244, 332), (350, 356)], width=8)


def motif_maple(draw):
    pts = [(256, 128), (280, 220), (352, 184), (324, 262), (396, 292), (318, 318), (342, 398), (256, 344), (170, 398), (194, 318), (116, 292), (188, 262), (160, 184), (232, 220)]
    draw.polygon([(s(x), s(y)) for x, y in pts], fill=rgba(CINNABAR, 0.64))
    draw.line([(s(x), s(y)) for x, y in pts + [pts[0]]], fill=UMBER, width=s(6), joint="curve")
    draw_line(draw, [(256, 344), (256, 420)], width=7)
    draw_line(draw, [(256, 344), (210, 282), (180, 238)], fill=rgba(GOLD, 0.8), width=4)
    draw_line(draw, [(256, 344), (306, 282), (338, 238)], fill=rgba(GOLD, 0.8), width=4)


def motif_willow(draw):
    draw_line(draw, [(190, 138), (264, 206), (312, 300), (330, 406)], width=8)
    for idx, y in enumerate([202, 248, 294, 340]):
        draw_line(draw, [(230 + idx * 12, y), (178, y + 54), (184, y + 102)], fill=GOLD if idx % 2 else CINNABAR, width=6)
        draw_line(draw, [(276 + idx * 10, y + 10), (354, y + 52), (340, y + 96)], fill=CINNABAR if idx % 2 else GOLD, width=6)


def motif_pine(draw):
    draw_line(draw, [(268, 134), (246, 274), (286, 410)], width=8)
    for y, color in [(188, GOLD), (250, UMBER), (314, CINNABAR), (366, GOLD)]:
        draw_line(draw, [(132, y), (230, y - 42), (360, y), (402, y + 18)], fill=color, width=8)
        draw_line(draw, [(200, y - 14), (258, y + 38)], fill=rgba(UMBER, 0.66), width=4)


def motif_snowflower(draw):
    for angle in range(0, 360, 60):
        draw_petal(draw, 256 + math.sin(math.radians(angle)) * 52, 256 - math.cos(math.radians(angle)) * 52, 16, 72, angle, GOLD if angle % 120 else CINNABAR)
    draw.ellipse([s(234), s(234), s(278), s(278)], fill=UMBER)
    draw_line(draw, [(182, 372), (242, 338), (322, 338), (380, 372)], width=7)


def motif_spring(draw):
    draw_line(draw, [(160, 390), (206, 304), (278, 226), (356, 152)], width=8)
    draw_leaf(draw, 214, 300, 28, 72, -44, fill=rgba(GOLD, 0.56))
    draw_leaf(draw, 300, 220, 28, 72, 48, fill=rgba(CINNABAR, 0.52))
    draw.ellipse([s(340), s(136), s(380), s(176)], fill=rgba(CINNABAR, 0.78), outline=UMBER, width=s(5))


def motif_autumn(draw):
    pts = [(142, 314), (186, 178), (322, 130), (388, 198), (354, 322), (254, 392)]
    draw.polygon([(s(x), s(y)) for x, y in pts], fill=rgba(GOLD, 0.56))
    draw.line([(s(x), s(y)) for x, y in pts + [pts[0]]], fill=UMBER, width=s(6), joint="curve")
    draw_line(draw, [(154, 314), (226, 260), (306, 202), (382, 198)], fill=CINNABAR, width=7)
    draw_line(draw, [(226, 260), (212, 204), (256, 160)], width=4)
    draw_line(draw, [(280, 220), (332, 240), (356, 286)], width=4)


def motif_winter(draw):
    draw_line(draw, [(148, 372), (218, 320), (282, 238), (364, 150)], width=9)
    draw_line(draw, [(230, 304), (204, 244), (234, 190)], width=5)
    draw_line(draw, [(282, 238), (352, 252), (386, 306)], width=5)
    draw_leaf(draw, 236, 190, 16, 34, 34, fill=rgba(CINNABAR, 0.72))
    draw_leaf(draw, 386, 306, 16, 34, -34, fill=rgba(GOLD, 0.64))
    draw.ellipse([s(276), s(228), s(296), s(248)], fill=CINNABAR)


def motif_gate(draw):
    draw.arc([s(142), s(128), s(370), s(356)], start=180, end=360, fill=UMBER, width=s(10))
    draw_line(draw, [(142, 242), (142, 396)], width=10)
    draw_line(draw, [(370, 242), (370, 396)], width=10)
    draw.arc([s(190), s(178), s(322), s(346)], start=180, end=360, fill=GOLD, width=s(7))
    draw_line(draw, [(190, 262), (190, 396)], fill=GOLD, width=7)
    draw_line(draw, [(322, 262), (322, 396)], fill=GOLD, width=7)
    draw_line(draw, [(130, 396), (382, 396)], fill=CINNABAR, width=8)


def motif_pavilion(draw):
    draw_line(draw, [(126, 340), (190, 250), (252, 308), (330, 184), (398, 340)], fill=GOLD, width=8)
    roof = [(164, 264), (348, 264), (300, 208), (212, 208)]
    draw.polygon([(s(x), s(y)) for x, y in roof], fill=rgba(CINNABAR, 0.62))
    draw.line([(s(x), s(y)) for x, y in roof + [roof[0]]], fill=UMBER, width=s(6), joint="curve")
    draw_line(draw, [(198, 264), (198, 382)], width=7)
    draw_line(draw, [(314, 264), (314, 382)], width=7)
    draw_line(draw, [(164, 382), (348, 382)], width=8)


def motif_fan(draw):
    draw.pieslice([s(110), s(116), s(402), s(408)], start=200, end=340, fill=rgba(GOLD, 0.45), outline=UMBER, width=s(7))
    for x in [150, 188, 226, 256, 286, 324, 362]:
        draw_line(draw, [(256, 398), (x, 180)], fill=rgba(CINNABAR, 0.72), width=4)
    draw_line(draw, [(138, 398), (374, 398)], width=9)
    draw.ellipse([s(242), s(384), s(270), s(412)], fill=UMBER)


def motif_scroll(draw):
    draw.rounded_rectangle([s(184), s(134), s(328), s(376)], radius=s(18), fill=SOFT, outline=UMBER, width=s(7))
    draw_line(draw, [(154, 134), (358, 134)], fill=GOLD, width=11)
    draw_line(draw, [(154, 376), (358, 376)], fill=GOLD, width=11)
    draw_line(draw, [(224, 204), (284, 178), (300, 238), (240, 270), (300, 324)], width=7)
    draw.rounded_rectangle([s(290), s(306), s(336), s(352)], radius=s(5), fill=CINNABAR)


def motif_mirror(draw):
    pts = [(186, 148), (326, 148), (394, 218), (394, 334), (326, 402), (186, 402), (118, 334), (118, 218)]
    draw.polygon([(s(x), s(y)) for x, y in pts], fill=rgba(GOLD, 0.32))
    draw.line([(s(x), s(y)) for x, y in pts + [pts[0]]], fill=UMBER, width=s(7), joint="curve")
    inner = [(220, 202), (292, 202), (340, 250), (340, 318), (292, 366), (220, 366), (172, 318), (172, 250)]
    draw.polygon([(s(x), s(y)) for x, y in inner], fill=rgba(CINNABAR, 0.18))
    draw.line([(s(x), s(y)) for x, y in inner + [inner[0]]], fill=CINNABAR, width=s(5), joint="curve")
    draw_line(draw, [(256, 402), (256, 452), (210, 452), (302, 452)], width=7)


def motif_tag(draw):
    pts = [(196, 144), (316, 144), (352, 388), (256, 438), (160, 388)]
    draw.polygon([(s(x), s(y)) for x, y in pts], fill=rgba(CINNABAR, 0.66))
    draw.line([(s(x), s(y)) for x, y in pts + [pts[0]]], fill=UMBER, width=s(7), joint="curve")
    draw.arc([s(220), s(104), s(292), s(180)], start=200, end=340, fill=UMBER, width=s(5))
    draw_line(draw, [(214, 238), (298, 238)], fill=SOFT, width=7)
    draw_line(draw, [(230, 306), (282, 306)], fill=SOFT, width=7)
    draw_line(draw, [(256, 202), (256, 356)], fill=SOFT, width=6)


def motif_charm(draw):
    draw_line(draw, [(256, 122), (256, 170)], width=7)
    pts = [(188, 170), (324, 170), (296, 410), (216, 410)]
    draw.polygon([(s(x), s(y)) for x, y in pts], fill=rgba(GOLD, 0.44))
    draw.line([(s(x), s(y)) for x, y in pts + [pts[0]]], fill=UMBER, width=s(7), joint="curve")
    draw_line(draw, [(220, 252), (292, 252)], fill=CINNABAR, width=7)
    draw_line(draw, [(230, 316), (282, 316)], fill=CINNABAR, width=7)
    draw.arc([s(208), s(382), s(304), s(456)], start=20, end=160, fill=CINNABAR, width=s(6))


def motif_aster(draw):
    for index in range(13):
        angle = index * 360 / 13
        draw_petal(draw, 256 + math.sin(math.radians(angle)) * 44, 256 - math.cos(math.radians(angle)) * 44, 12, 54, angle, GOLD if index % 2 else CINNABAR)
    draw_line(draw, [(164, 372), (228, 336), (310, 336), (374, 372)], width=8)
    draw.ellipse([s(236), s(236), s(276), s(276)], fill=UMBER)
    draw.ellipse([s(250), s(250), s(262), s(262)], fill=PAPER)


DRAWERS = [
    motif_plum,
    motif_orchid,
    motif_chrysanthemum,
    motif_peony,
    motif_camellia,
    motif_maple,
    motif_willow,
    motif_pine,
    motif_snowflower,
    motif_spring,
    motif_autumn,
    motif_winter,
    motif_gate,
    motif_pavilion,
    motif_fan,
    motif_scroll,
    motif_mirror,
    motif_tag,
    motif_charm,
    motif_aster,
]


def build_asset(index: int, slug: str) -> Image.Image:
    image = draw_panel_base(index)
    draw = ImageDraw.Draw(image)
    DRAWERS[index](draw)
    image = image.filter(ImageFilter.UnsharpMask(radius=s(0.25), percent=65, threshold=3))
    image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    return image


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base_prompt = (
        "Create one premium realistic Mahjong bonus tile panel for the game Dawn Cabinet. "
        "Show a single isolated ivory Mahjong tile face with softly rounded corners, subtle "
        "carved border, shallow porcelain depth, and one centered hand-painted motif. "
        "Use refined ink linework, cinnabar red, warm gold, and muted botanical accents. "
        "The image must read clearly when reduced to a tiny game icon. Square crop, full "
        "tile visible, generous padding, no surrounding scene."
    )
    negative_prompt = (
        "Avoid bamboo bars, dot targets, bullseyes, coin rings, lotus diamonds, jade-window "
        "marks, clouds, stars, waves, knots, moon crescents, sun crosses, lantern forms, "
        "spark diamonds, Chinese characters, Latin letters, numbers, logos, watermarks, "
        "photorealistic hands, clutter, busy backgrounds, heavy shadows, and anything that "
        "resembles Dawn Cabinet's numbered suit marks."
    )
    manifest = {
        "version": 2,
        "status": "gpt-image-2-review-ready",
        "acceptedDirection": "local-review-assets",
        "acceptedAssetDir": str(OUT_DIR),
        "model": "gpt-image-2",
        "promptVersion": "gpt-image-2-v1",
        "size": "1024x1024",
        "quality": "high",
        "outputFormat": "png",
        "basePrompt": base_prompt,
        "negativePrompt": negative_prompt,
        "reviewRoot": "tmp/dawn-cabinet/dawn-art-review/gpt-image-2-v1",
        "directions": [
            {
                "id": "porcelain-garden-panels",
                "title": "Porcelain Garden Panels",
                "guidance": "Elegant hand-painted porcelain bonus tiles, soft glaze, delicate botanical brushwork, restrained luxury.",
            },
            {
                "id": "antique-literati-panels",
                "title": "Antique Literati Panels",
                "guidance": "Scholar-object and seasonal brush-painting panels, museum catalog quality, ink wash restraint, warm gold accents.",
            },
            {
                "id": "carved-season-panels",
                "title": "Carved Season Panels",
                "guidance": "Shallow carved relief motifs on ivory tile faces, premium tactile depth, sparse cinnabar and gold fill.",
            },
            {
                "id": "heirloom-bonus-panels",
                "title": "Heirloom Bonus Panels",
                "guidance": "Vintage luxury Mahjong bonus tiles, hand-painted heirloom feel, crisp silhouette, refined border ornament.",
            },
        ],
        "variants": [],
    }
    for index, (slug, label, prompt_focus) in enumerate(VARIANTS):
        filename = f"dawn-{index:02d}-{slug}.png"
        image = build_asset(index, slug)
        image.save(OUT_DIR / filename)
        manifest["variants"].append(
            {
                "index": index,
                "id": slug,
                "label": label,
                "filename": filename,
                "motif": prompt_focus,
                "acceptedAssetPath": str(OUT_DIR / filename),
                "reviewStatus": "accepted-local-review-asset",
                "artSets": [
                    {
                        "directionId": direction["id"],
                        "model": manifest["model"],
                        "promptVersion": manifest["promptVersion"],
                        "size": manifest["size"],
                        "quality": manifest["quality"],
                        "outputFormat": manifest["outputFormat"],
                        "prompt": (
                            f"{base_prompt}\n"
                            f"Art direction: {direction['title']}. {direction['guidance']}\n"
                            f"Main motif: {prompt_focus}.\n"
                            "Composition: motif centered inside the tile's decorative panel, bold enough for 22px chip use.\n"
                            "Output requirements: no text of any kind, no symbols from existing Dawn Cabinet suits, no watermark.\n"
                            f"Negative prompt: {negative_prompt}"
                        ),
                        "negativePrompt": negative_prompt,
                        "generatedSourcePath": f"{manifest['reviewRoot']}/{direction['id']}/{filename}",
                        "reviewStatus": "pending-generation",
                        "acceptedAssetPath": str(OUT_DIR / filename),
                    }
                    for direction in manifest["directions"]
                ],
            }
        )
    (OUT_DIR / "dawn-tile-prompts.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Wrote {len(VARIANTS)} Dawn tile PNG assets to {OUT_DIR}")


if __name__ == "__main__":
    main()
