#!/usr/bin/env python3
"""Generate Moji Mash puzzle candidates using open-genmoji / mflux.

Usage:
  # Generate 3 candidate variants for a concept:
  python scripts/generate_moji.py --words "spring cleaning" \\
    --prompt "an expressive emoji of spring flowers tied to a broom sweeping dust..." \\
    --count 3

  # Promote a chosen candidate into assets/ and print the TS entry:
  python scripts/generate_moji.py --words "spring cleaning" \\
    --promote tmp/moji-mash/2026-04-09/spring-cleaning-s42-1.png
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import platform
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
ASSETS_DIR = BASE_DIR / "assets" / "genmoji"
TS_PUZZLES = BASE_DIR / "src" / "data" / "mojiMashPuzzles.ts"
STAGE_BASE = BASE_DIR / "tmp" / "moji-mash"

DEFAULT_OPEN_GENMOJI = Path.home() / "tools" / "open-genmoji"
OPEN_GENMOJI_PATH = Path(os.environ.get("OPEN_GENMOJI_PATH", DEFAULT_OPEN_GENMOJI))

LORA_RELATIVE = "lora/flux-dev.safetensors"
MFLUX_STEPS = 20
MFLUX_GUIDANCE = 5.0
MFLUX_WIDTH = 160
MFLUX_HEIGHT = 160
MFLUX_QUANTIZE = 8

# Rotation floor: warn if non-pinned puzzles drop below this.
ROTATION_FLOOR = 30


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(words: list[str]) -> str:
    return "-".join(w.lower().strip() for w in words)


def generate_hint(words: list[str]) -> str:
    letters = ", ".join(w[0].lower() for w in words)
    return f"Starts with: {letters}"


def load_existing_pool(ts_path: Path) -> tuple[set[tuple[str, ...]], dict[str, int]]:
    """Return (set of word-tuples, word -> count mapping) from mojiMashPuzzles.ts."""
    if not ts_path.exists():
        return set(), {}
    text = ts_path.read_text()
    tuples: set[tuple[str, ...]] = set()
    word_counts: dict[str, int] = {}
    for match in re.finditer(r"words:\s*\[([^\]]+)\]", text):
        raw = match.group(1)
        words = [w.strip().strip("'\"") for w in raw.split(",") if w.strip()]
        t = tuple(words)
        tuples.add(t)
        for w in words:
            word_counts[w] = word_counts.get(w, 0) + 1
    return tuples, word_counts


def count_pinned(ts_path: Path) -> int:
    """Count puzzles with a date: field in the TS file."""
    if not ts_path.exists():
        return 0
    text = ts_path.read_text()
    return len(re.findall(r"date:\s*['\"]", text))


def check_platform() -> None:
    if platform.system() != "Darwin" or platform.machine() != "arm64":
        sys.exit(
            "Error: mflux requires Apple Silicon (arm64 macOS). "
            "open-genmoji cannot run on this machine."
        )


def check_open_genmoji() -> Path:
    venv_python = OPEN_GENMOJI_PATH / ".venv" / "bin" / "python"
    if not OPEN_GENMOJI_PATH.exists():
        sys.exit(
            f"Error: open-genmoji not found at {OPEN_GENMOJI_PATH}\n"
            "Clone it: git clone https://github.com/EvanZhouDev/open-genmoji "
            f"{OPEN_GENMOJI_PATH}\n"
            "Then run the setup steps in docs/moji-mash-style-guide.md."
        )
    if not venv_python.exists():
        sys.exit(
            f"Error: venv not found at {OPEN_GENMOJI_PATH / '.venv'}\n"
            "Run: python3.11 -m venv .venv && source .venv/bin/activate && "
            "pip install -U huggingface_hub mflux"
        )
    return venv_python


# ---------------------------------------------------------------------------
# Vision check
# ---------------------------------------------------------------------------

def vision_check(images: list[Path], words: list[str]) -> list[dict]:
    """Ask Claude to describe each image; flag answer words that are absent or misread.

    Requires ANTHROPIC_API_KEY in the environment and `pip install anthropic`.
    Returns a list of result dicts (one per image). Prints a summary to stdout.
    On any setup failure, prints a warning and returns an empty list.
    """
    try:
        import anthropic
    except ImportError:
        print(
            "Warning: 'anthropic' package not installed — skipping vision check.\n"
            "  Install with: pip install anthropic",
            file=sys.stderr,
        )
        return []

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print(
            "Warning: ANTHROPIC_API_KEY not set — skipping vision check.",
            file=sys.stderr,
        )
        return []

    client = anthropic.Anthropic(api_key=api_key)
    answer_set = set(words)
    results: list[dict] = []

    print("\n  Running vision check…")
    for img_path in images:
        img_data = base64.standard_b64encode(img_path.read_bytes()).decode("utf-8")

        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=256,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": img_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": (
                                "This is a cartoon emoji sticker image. "
                                "Without being told the intended answer, list the 3–5 most "
                                "specific words that best describe the distinct visual elements "
                                "you see. Focus on concrete nouns and recognizable objects. "
                                'Reply with a JSON array of lowercase strings only, '
                                'e.g. ["dog", "fire", "helmet"]'
                            ),
                        },
                    ],
                }
            ],
        )

        raw = message.content[0].text.strip()
        try:
            decoded: list[str] = json.loads(raw)
        except Exception:
            decoded = re.findall(r'"([a-z]+)"', raw)

        matched = [w for w in decoded if w in answer_set]
        missing = [w for w in words if w not in decoded]

        results.append({
            "file": img_path.name,
            "decoded": decoded,
            "matched": matched,
            "missing": missing,
            "score": len(matched),
        })

        status = "✓" if not missing else "⚠"
        print(f"  {status} {img_path.name}")
        print(f"      Decoded : {decoded}")
        if missing:
            print(f"      Missing : {missing} (not visible or misnamed)")

    return results


def _build_contact_sheet(outputs: list[Path], check_results: list[dict]) -> str:
    """Return HTML string for the candidate review contact sheet."""
    result_by_name = {r["file"]: r for r in check_results}
    cards = []
    for p in outputs:
        r = result_by_name.get(p.name)
        if r:
            status_color = "#2a9d2a" if not r["missing"] else "#cc7700"
            status_icon = "✓" if not r["missing"] else "⚠"
            overlay = (
                f'<div style="font-size:11px;margin-top:4px;color:{status_color}">'
                f'{status_icon} {", ".join(r["decoded"])}</div>'
            )
            if r["missing"]:
                overlay += (
                    f'<div style="font-size:10px;color:#cc0000">'
                    f'missing: {", ".join(r["missing"])}</div>'
                )
        else:
            overlay = ""

        cards.append(
            f'<div style="text-align:center;margin:12px;font-family:sans-serif">'
            f'<img src="{p.name}" width="160" height="160" '
            f'style="border:1px solid #ccc;display:block">'
            f'<small style="display:block;margin-top:4px">{p.name}</small>'
            f"{overlay}"
            f"</div>"
        )

    body = "\n".join(cards)
    return f"<!doctype html><html><body style='display:flex;flex-wrap:wrap;padding:16px'>{body}</body></html>"


# ---------------------------------------------------------------------------
# Core operations
# ---------------------------------------------------------------------------

def generate(
    words: list[str],
    prompt: str,
    count: int,
    seed: int | None,
    stage_dir: Path,
    check: bool = False,
) -> list[Path]:
    check_platform()
    venv_python = check_open_genmoji()

    lora_path = OPEN_GENMOJI_PATH / LORA_RELATIVE
    if not lora_path.exists():
        sys.exit(
            f"Error: LoRA weights not found at {lora_path}\n"
            f"Run: cd {OPEN_GENMOJI_PATH} && python3 download.py"
        )

    stage_dir.mkdir(parents=True, exist_ok=True)
    slug = slugify(words)
    outputs: list[Path] = []

    for i in range(count):
        effective_seed = (seed if seed is not None else 42) + i
        out_file = stage_dir / f"{slug}-s{effective_seed}.png"

        cmd = [
            str(venv_python), "-m", "mflux.generate",
            "--model", "dev",
            "--prompt", prompt,
            "--steps", str(MFLUX_STEPS),
            "--seed", str(effective_seed),
            "--quantize", str(MFLUX_QUANTIZE),
            "--guidance", str(MFLUX_GUIDANCE),
            "--width", str(MFLUX_WIDTH),
            "--height", str(MFLUX_HEIGHT),
            "--lora-paths", str(lora_path),
            "--output", str(out_file),
        ]

        print(f"  Generating variant {i + 1}/{count} (seed {effective_seed})…")
        result = subprocess.run(cmd, cwd=OPEN_GENMOJI_PATH, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  mflux error:\n{result.stderr}", file=sys.stderr)
            sys.exit(3)

        outputs.append(out_file)
        print(f"  Saved: {out_file.relative_to(BASE_DIR)}")

    check_results = vision_check(outputs, words) if check else []

    html_path = stage_dir / "index.html"
    html_path.write_text(_build_contact_sheet(outputs, check_results))
    print(f"\n  Review sheet: {html_path.relative_to(BASE_DIR)}")
    return outputs


def promote(staged: Path, words: list[str], force: bool) -> None:
    slug = slugify(words)
    dest = ASSETS_DIR / f"{slug}.png"

    if dest.exists() and not force:
        sys.exit(
            f"Error: {dest.relative_to(BASE_DIR)} already exists.\n"
            "Use --force to overwrite."
        )

    if not staged.exists():
        sys.exit(f"Error: staged file not found: {staged}")

    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(staged, dest)
    print(f"Promoted: {dest.relative_to(BASE_DIR)}")

    hint = generate_hint(words)
    words_ts = ", ".join(f"'{w}'" for w in words)
    require_path = f"../../assets/genmoji/{slug}.png"

    print("\nPaste into src/data/mojiMashPuzzles.ts:\n")
    print(f"  {{")
    print(f"    image: require('{require_path}'),")
    print(f"    words: [{words_ts}],")
    print(f"    hint: '{hint}',")
    print(f"    // date: 'YYYY-MM-DD',  // uncomment to pin to a specific date")
    print(f"  }},")


def validate_words(words: list[str]) -> None:
    if len(words) < 2 or len(words) > 4:
        sys.exit(f"Error: --words must contain 2–4 tokens (got {len(words)}).")
    for w in words:
        if not re.fullmatch(r"[a-z]+", w):
            sys.exit(
                f"Error: word '{w}' is invalid — must be lowercase letters only."
            )


def check_pool(words: list[str]) -> None:
    tuples, word_counts = load_existing_pool(TS_PUZZLES)
    slug_tuple = tuple(words)

    if slug_tuple in tuples:
        print(f"Warning: {words!r} already exists in the puzzle pool.", file=sys.stderr)

    overused = [w for w in words if word_counts.get(w, 0) >= 2]
    if overused:
        print(
            f"Warning: word(s) {overused!r} already appear 2+ times in the pool.",
            file=sys.stderr,
        )

    total = len(tuples)
    pinned = count_pinned(TS_PUZZLES)
    rotation_count = total - pinned
    if rotation_count < ROTATION_FLOOR:
        print(
            f"Warning: only {rotation_count} non-pinned puzzles in rotation "
            f"(floor is {ROTATION_FLOOR}). Consider adding more evergreen puzzles.",
            file=sys.stderr,
        )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Generate and promote Moji Mash puzzle candidates."
    )
    p.add_argument(
        "--words", required=True,
        help='Space-separated word list, e.g. "spring cleaning"',
    )
    p.add_argument(
        "--prompt",
        help="Genmoji generation prompt. Required unless --promote is used alone.",
    )
    p.add_argument("--seed", type=int, default=None, help="Base seed (default: 42)")
    p.add_argument("--count", type=int, default=3, help="Number of variants to generate (default: 3)")
    p.add_argument(
        "--stage", type=Path, default=None,
        help="Stage directory (default: tmp/moji-mash/YYYY-MM-DD/)",
    )
    p.add_argument(
        "--promote", type=Path, default=None, metavar="FILE",
        help="Staged PNG to copy into assets/genmoji/ and print TS entry for.",
    )
    p.add_argument(
        "--force", action="store_true",
        help="Overwrite existing asset on slug collision.",
    )
    p.add_argument(
        "--check", action="store_true",
        help=(
            "After generation, run a Claude vision check on each variant: "
            "asks the model to describe what it sees and flags answer words "
            "that are absent or misnamed. Requires ANTHROPIC_API_KEY and "
            "'pip install anthropic'. Results appear in the contact sheet."
        ),
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()

    words = args.words.lower().split()
    validate_words(words)
    check_pool(words)

    if args.promote:
        promote(args.promote, words, args.force)
        return

    if not args.prompt:
        sys.exit("Error: --prompt is required when generating images.")

    stage_dir = args.stage or (STAGE_BASE / date.today().isoformat())
    generate(words, args.prompt, args.count, args.seed, stage_dir, check=args.check)


if __name__ == "__main__":
    main()
