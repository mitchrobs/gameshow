#!/usr/bin/env python3
"""Prepare, generate, and accept GPT Image 2 Dawn tile art candidates.

This script owns the Dawn Cabinet-specific prompt matrix and review workflow.
It delegates actual OpenAI image generation to the bundled Codex imagegen CLI so
the API path stays consistent with the shared image-generation tooling.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


ASSET_DIR = Path("assets/dawn-cabinet/dawn-tiles")
MANIFEST_PATH = ASSET_DIR / "dawn-tile-prompts.json"
DEFAULT_REVIEW_ROOT = Path("tmp/dawn-cabinet/dawn-art-review/gpt-image-2-v1")
DEFAULT_MODEL = "gpt-image-2"
DEFAULT_PROMPT_VERSION = "gpt-image-2-v1"
DEFAULT_SIZE = "1024x1024"
DEFAULT_QUALITY = "high"
DEFAULT_OUTPUT_FORMAT = "png"

BASE_PROMPT = (
    "Create one premium realistic Mahjong bonus tile panel for the game Dawn Cabinet. "
    "Show a single isolated ivory Mahjong tile face with softly rounded corners, subtle "
    "carved border, shallow porcelain depth, and one centered hand-painted motif. "
    "Use refined ink linework, cinnabar red, warm gold, and muted botanical accents. "
    "The image must read clearly when reduced to a tiny game icon. Square crop, full "
    "tile visible, generous padding, no surrounding scene."
)

NEGATIVE_PROMPT = (
    "Avoid bamboo bars, dot targets, bullseyes, coin rings, lotus diamonds, jade-window "
    "marks, clouds, stars, waves, knots, moon crescents, sun crosses, lantern forms, "
    "spark diamonds, Chinese characters, Latin letters, numbers, logos, watermarks, "
    "photorealistic hands, clutter, busy backgrounds, heavy shadows, and anything that "
    "resembles Dawn Cabinet's numbered suit marks."
)


@dataclass(frozen=True)
class Variant:
    slug: str
    label: str
    motif: str

    def filename(self, index: int) -> str:
        return f"dawn-{index:02d}-{self.slug}.png"


@dataclass(frozen=True)
class Direction:
    id: str
    title: str
    guidance: str


VARIANTS: tuple[Variant, ...] = (
    Variant("plum-spray", "Plum spray", "angular plum branch with small cinnabar blossoms"),
    Variant("orchid-brush", "Orchid brush", "curved orchid leaves and one brushed bloom"),
    Variant("chrysanthemum-crest", "Chrysanthemum crest", "layered chrysanthemum bloom with engraved center"),
    Variant("peony-bud", "Peony bud", "round peony bud with folded petals"),
    Variant("camellia-branch", "Camellia branch", "camellia flower on a compact branch"),
    Variant("maple-leaf", "Maple leaf", "single warm maple leaf with ink vein"),
    Variant("willow-sprig", "Willow sprig", "hanging willow sprig with long brushed leaves"),
    Variant("pine-bough", "Pine bough", "short pine bough with restrained needles"),
    Variant("snowflower", "Snowflower", "soft six-petal winter flower, clearly botanical and not a star"),
    Variant("spring-sprig", "Spring sprig", "fresh sprig with two leaves and a small bud"),
    Variant("autumn-leaf", "Autumn leaf", "long autumn leaf with cinnabar vein"),
    Variant("winter-branch", "Winter branch", "bare winter branch with two colored buds"),
    Variant("garden-gate", "Garden gate", "arched garden gate with a low threshold"),
    Variant("mountain-pavilion", "Mountain pavilion", "small pavilion roof before distant mountain peaks"),
    Variant("folding-fan", "Folding fan", "half-open painted fan with a small botanical painting"),
    Variant("painted-scroll", "Painted scroll", "vertical painted scroll with an abstract brush mark and red seal shape"),
    Variant("bronze-mirror", "Bronze mirror", "faceted bronze hand mirror, visibly not a coin"),
    Variant("vermilion-tag", "Vermilion tag", "hanging vermilion talisman tag without writing"),
    Variant("paper-charm", "Paper charm", "folded paper charm with a tied top and no writing"),
    Variant("morning-aster", "Morning aster", "small aster blossom in the Dawn Cabinet palette"),
)

DIRECTIONS: tuple[Direction, ...] = (
    Direction(
        "porcelain-garden-panels",
        "Porcelain Garden Panels",
        "Elegant hand-painted porcelain bonus tiles, soft glaze, delicate botanical brushwork, restrained luxury.",
    ),
    Direction(
        "antique-literati-panels",
        "Antique Literati Panels",
        "Scholar-object and seasonal brush-painting panels, museum catalog quality, ink wash restraint, warm gold accents.",
    ),
    Direction(
        "carved-season-panels",
        "Carved Season Panels",
        "Shallow carved relief motifs on ivory tile faces, premium tactile depth, sparse cinnabar and gold fill.",
    ),
    Direction(
        "heirloom-bonus-panels",
        "Heirloom Bonus Panels",
        "Vintage luxury Mahjong bonus tiles, hand-painted heirloom feel, crisp silhouette, refined border ornament.",
    ),
)


def _direction_ids() -> set[str]:
    return {direction.id for direction in DIRECTIONS}


def parse_directions(raw: str) -> list[Direction]:
    if raw == "all":
        return list(DIRECTIONS)
    requested = [item.strip() for item in raw.split(",") if item.strip()]
    unknown = sorted(set(requested) - _direction_ids())
    if unknown:
        raise SystemExit(f"Unknown direction(s): {', '.join(unknown)}")
    return [direction for direction in DIRECTIONS if direction.id in requested]


def prompt_for(direction: Direction, variant: Variant) -> str:
    return "\n".join(
        [
            BASE_PROMPT,
            f"Art direction: {direction.title}. {direction.guidance}",
            f"Main motif: {variant.motif}.",
            "Composition: motif centered inside the tile's decorative panel, bold enough for 22px chip use.",
            "Output requirements: no text of any kind, no symbols from existing Dawn Cabinet suits, no watermark.",
            f"Negative prompt: {NEGATIVE_PROMPT}",
        ]
    )


def build_manifest(
    *,
    directions: list[Direction],
    review_root: Path,
    model: str,
    prompt_version: str,
    size: str,
    quality: str,
    output_format: str,
) -> dict:
    direction_entries = [
        {"id": direction.id, "title": direction.title, "guidance": direction.guidance}
        for direction in directions
    ]
    variants = []
    for index, variant in enumerate(VARIANTS):
        filename = variant.filename(index)
        art_sets = []
        for direction in directions:
            generated_path = review_root / direction.id / filename
            art_sets.append(
                {
                    "directionId": direction.id,
                    "model": model,
                    "promptVersion": prompt_version,
                    "size": size,
                    "quality": quality,
                    "outputFormat": output_format,
                    "prompt": prompt_for(direction, variant),
                    "negativePrompt": NEGATIVE_PROMPT,
                    "generatedSourcePath": str(generated_path),
                    "reviewStatus": "pending-generation",
                    "acceptedAssetPath": str(ASSET_DIR / filename),
                }
            )
        variants.append(
            {
                "index": index,
                "id": variant.slug,
                "label": variant.label,
                "filename": filename,
                "motif": variant.motif,
                "acceptedAssetPath": str(ASSET_DIR / filename),
                "reviewStatus": "accepted-local-review-asset",
                "artSets": art_sets,
            }
        )
    return {
        "version": 2,
        "status": "gpt-image-2-review-ready",
        "acceptedDirection": "local-review-assets",
        "acceptedAssetDir": str(ASSET_DIR),
        "model": model,
        "promptVersion": prompt_version,
        "size": size,
        "quality": quality,
        "outputFormat": output_format,
        "basePrompt": BASE_PROMPT,
        "negativePrompt": NEGATIVE_PROMPT,
        "reviewRoot": str(review_root),
        "directions": direction_entries,
        "variants": variants,
    }


def write_jobs_jsonl(
    *,
    directions: list[Direction],
    review_root: Path,
    model: str,
    size: str,
    quality: str,
    output_format: str,
    limit: int | None,
) -> list[tuple[Direction, Path]]:
    review_root.mkdir(parents=True, exist_ok=True)
    job_paths: list[tuple[Direction, Path]] = []
    count = 0
    for direction in directions:
        (review_root / direction.id).mkdir(parents=True, exist_ok=True)
        job_path = review_root / f"{direction.id}.jsonl"
        wrote_for_direction = 0
        with job_path.open("w", encoding="utf-8") as handle:
            for index, variant in enumerate(VARIANTS):
                if limit is not None and count >= limit:
                    break
                filename = variant.filename(index)
                job = {
                    "prompt": prompt_for(direction, variant),
                    "model": model,
                    "size": size,
                    "quality": quality,
                    "output_format": output_format,
                    "out": filename,
                }
                handle.write(json.dumps(job, ensure_ascii=False) + "\n")
                count += 1
                wrote_for_direction += 1
        if wrote_for_direction:
            job_paths.append((direction, job_path))
        else:
            job_path.unlink(missing_ok=True)
        if limit is not None and count >= limit:
            break
    return job_paths


def write_manifest(manifest: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def image_gen_cli_path() -> Path:
    if os.environ.get("IMAGE_GEN"):
        return Path(os.environ["IMAGE_GEN"])
    codex_home = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex")))
    return codex_home / "skills/.system/imagegen/scripts/image_gen.py"


def prepare(args: argparse.Namespace) -> list[tuple[Direction, Path]]:
    directions = parse_directions(args.directions)
    review_root = Path(args.review_root)
    manifest = build_manifest(
        directions=directions,
        review_root=review_root,
        model=args.model,
        prompt_version=args.prompt_version,
        size=args.size,
        quality=args.quality,
        output_format=args.output_format,
    )
    write_manifest(manifest, Path(args.manifest))
    job_paths = write_jobs_jsonl(
        directions=directions,
        review_root=review_root,
        model=args.model,
        size=args.size,
        quality=args.quality,
        output_format=args.output_format,
        limit=args.limit,
    )
    print(f"Wrote manifest: {args.manifest}")
    for direction, job_path in job_paths:
        print(f"Wrote jobs for {direction.id}: {job_path}")
    print(f"Directions: {', '.join(direction.id for direction in directions)}")
    return job_paths


def generate(args: argparse.Namespace) -> None:
    job_paths = prepare(args)
    cli = image_gen_cli_path()
    if not cli.exists():
        raise SystemExit(f"Image generation CLI not found: {cli}")
    if not args.dry_run and not os.environ.get("OPENAI_API_KEY"):
        raise SystemExit(
            "OPENAI_API_KEY is not set. Re-run with --dry-run to inspect jobs, or set the key before live generation."
        )
    for direction, job_path in job_paths:
        cmd = [
            sys.executable,
            str(cli),
            "generate-batch",
            "--input",
            str(job_path),
            "--out-dir",
            str(Path(args.review_root) / direction.id),
            "--model",
            args.model,
            "--size",
            args.size,
            "--quality",
            args.quality,
            "--output-format",
            args.output_format,
            "--concurrency",
            str(args.concurrency),
            "--max-attempts",
            str(args.max_attempts),
        ]
        if args.force:
            cmd.append("--force")
        if args.dry_run:
            cmd.append("--dry-run")
        print("Running:", " ".join(cmd))
        subprocess.run(cmd, check=True)


def accept(args: argparse.Namespace) -> None:
    manifest_path = Path(args.manifest)
    if not manifest_path.exists():
        raise SystemExit(f"Manifest not found: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    direction_id = args.direction
    review_root = Path(args.review_root)
    src_dir = review_root / direction_id
    if not src_dir.exists():
        raise SystemExit(f"Generated direction folder not found: {src_dir}")
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    copied = []
    for variant in manifest["variants"]:
        filename = variant["filename"]
        src = src_dir / filename
        dst = ASSET_DIR / filename
        if not src.exists():
            raise SystemExit(f"Missing generated asset: {src}")
        shutil.copy2(src, dst)
        variant["reviewStatus"] = f"accepted-{direction_id}"
        variant["acceptedAssetPath"] = str(dst)
        for art_set in variant.get("artSets", []):
            if art_set.get("directionId") == direction_id:
                art_set["reviewStatus"] = "accepted"
        copied.append(str(dst))
    manifest["status"] = "accepted-gpt-image-2-assets"
    manifest["acceptedDirection"] = direction_id
    write_manifest(manifest, manifest_path)
    print(f"Accepted {len(copied)} assets from {src_dir}")
    print(f"Updated manifest: {manifest_path}")


def add_common_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--directions", default="all", help="all or comma-separated direction IDs")
    parser.add_argument("--review-root", default=str(DEFAULT_REVIEW_ROOT))
    parser.add_argument("--manifest", default=str(MANIFEST_PATH))
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--prompt-version", default=DEFAULT_PROMPT_VERSION)
    parser.add_argument("--size", default=DEFAULT_SIZE)
    parser.add_argument("--quality", default=DEFAULT_QUALITY)
    parser.add_argument("--output-format", default=DEFAULT_OUTPUT_FORMAT)
    parser.add_argument("--limit", type=int, default=None, help="Limit jobs for quick dry runs")


def main(argv: Iterable[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    prepare_parser = subparsers.add_parser("prepare", help="Write manifest and JSONL jobs without API calls")
    add_common_args(prepare_parser)
    prepare_parser.set_defaults(func=prepare)

    generate_parser = subparsers.add_parser("generate", help="Run the GPT Image 2 batch through the imagegen CLI")
    add_common_args(generate_parser)
    generate_parser.add_argument("--concurrency", type=int, default=4)
    generate_parser.add_argument("--max-attempts", type=int, default=3)
    generate_parser.add_argument("--force", action="store_true")
    generate_parser.add_argument("--dry-run", action="store_true")
    generate_parser.set_defaults(func=generate)

    accept_parser = subparsers.add_parser("accept", help="Copy an approved direction into shipped Dawn tile assets")
    accept_parser.add_argument("--direction", required=True, choices=sorted(_direction_ids()))
    accept_parser.add_argument("--review-root", default=str(DEFAULT_REVIEW_ROOT))
    accept_parser.add_argument("--manifest", default=str(MANIFEST_PATH))
    accept_parser.set_defaults(func=accept)

    args = parser.parse_args(list(argv) if argv is not None else None)
    args.func(args)


if __name__ == "__main__":
    main()
