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

# Recency window for pinned puzzles: warn if the same word lands within this
# many days of another pinned puzzle. The pool is designed to scale to daily
# puzzles plus paid packs (hundreds per year), so absolute reuse counts stop
# being useful — date proximity is what actually matters to players.
PIN_RECENCY_DAYS = 14


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(words: list[str]) -> str:
    return "-".join(w.lower().strip() for w in words)


def generate_hint(words: list[str]) -> str:
    letters = ", ".join(w[0].lower() for w in words)
    return f"Starts with: {letters}"


def load_existing_pool(
    ts_path: Path,
) -> tuple[set[tuple[str, ...]], dict[str, int], list[dict]]:
    """Parse mojiMashPuzzles.ts into structured pool data.

    Returns:
      tuples       — set of word-tuples (for exact-duplicate detection)
      word_counts  — word → total occurrences across the entire pool
      entries      — ordered list of {words, date?} dicts; preserves insertion
                     order so callers can reason about recency for pinned items
    """
    if not ts_path.exists():
        return set(), {}, []
    text = ts_path.read_text()
    tuples: set[tuple[str, ...]] = set()
    word_counts: dict[str, int] = {}
    entries: list[dict] = []

    # Match each puzzle entry block so we can pair `words: [...]` with an
    # optional `date: '...'` from the same record. Entries are separated by
    # `},` at the top level — we use a non-greedy match on the surrounding
    # braces.
    for entry_match in re.finditer(r"\{([^{}]*?)\}", text, flags=re.DOTALL):
        body = entry_match.group(1)
        words_match = re.search(r"words:\s*\[([^\]]+)\]", body)
        if not words_match:
            continue
        raw = words_match.group(1)
        words = [w.strip().strip("'\"") for w in raw.split(",") if w.strip()]
        t = tuple(words)
        tuples.add(t)
        for w in words:
            word_counts[w] = word_counts.get(w, 0) + 1
        date_match = re.search(r"date:\s*['\"]([^'\"]+)['\"]", body)
        entries.append({
            "words": words,
            "date": date_match.group(1) if date_match else None,
        })
    return tuples, word_counts, entries


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
    """Two-pass visual quality evaluation for each generated image.

    Pass 1 — blind decode: ask Claude what it sees without knowing the answer.
    Pass 2 — scored rubric: given the answer words, score 5 quality dimensions.

    Dimensions (all 1–5):
      word_clarity   — are all answer words visually present and pointable?
      visual_appeal  — charming, expressive, funny as an emoji sticker?
      concept_synergy — unified creative scene vs. literal word collage?
      guessability   — how likely is a player to guess all words? (sweet spot 3–4)
      aha_factor     — how satisfying is the reveal moment?

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
    answer_str = ", ".join(f'"{w}"' for w in words)
    results: list[dict] = []

    print("\n  Running vision check…")
    for img_path in images:
        img_data = base64.standard_b64encode(img_path.read_bytes()).decode("utf-8")
        image_block = {
            "type": "image",
            "source": {"type": "base64", "media_type": "image/png", "data": img_data},
        }

        # ── Pass 1: blind decode ──────────────────────────────────────────────
        # Ask for both a one-sentence description AND a noun array. The
        # sentence is the highest-value diagnostic for prompt revision (it
        # tells the editor what a player actually sees), while the noun array
        # drives the word-clarity match check downstream.
        blind_msg = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=256,
            messages=[{
                "role": "user",
                "content": [
                    image_block,
                    {
                        "type": "text",
                        "text": (
                            "This is a cartoon emoji sticker. Without being told the answer, "
                            "describe what you see as if you were a player guessing the puzzle.\n\n"
                            "Reply with JSON only:\n"
                            '{"description": "one neutral sentence describing the scene, '
                            'mentioning the most prominent objects/actions/details", '
                            '"nouns": ["3-5 lowercase concrete nouns for the most distinct elements"]}'
                        ),
                    },
                ],
            }],
        )
        raw_blind = blind_msg.content[0].text.strip()
        decoded: list[str] = []
        description: str = ""
        try:
            parsed = json.loads(raw_blind)
            decoded = [str(w).lower() for w in parsed.get("nouns", []) if str(w).strip()]
            description = str(parsed.get("description", "")).strip()
        except Exception:
            # Fallback: extract whatever quoted lowercase words we can.
            decoded = re.findall(r'"([a-z]+)"', raw_blind)
            # Try to find a description-like sentence.
            desc_match = re.search(r'"description"\s*:\s*"([^"]+)"', raw_blind)
            if desc_match:
                description = desc_match.group(1).strip()

        matched = [w for w in decoded if w in answer_set]
        missing = [w for w in words if w not in decoded]

        # ── Pass 2: scored rubric ─────────────────────────────────────────────
        rubric_msg = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=256,
            messages=[{
                "role": "user",
                "content": [
                    image_block,
                    {
                        "type": "text",
                        "text": (
                            f"This emoji sticker is the answer to a word-guessing puzzle. "
                            f"The answer words are: {answer_str}.\n\n"
                            "Score this image on five dimensions from 1–5:\n"
                            "  word_clarity:    Are ALL answer words visually present and pointable? "
                            "(1=words missing, 5=every word clearly depicted)\n"
                            "  visual_appeal:   How charming/expressive/funny is it as an emoji? "
                            "(1=flat and generic, 5=delightful sticker)\n"
                            "  concept_synergy: Does it feel like a unified creative scene, "
                            "or a literal collage of separate objects? "
                            "(1=unrelated objects pasted together, 5=words feel made for each other)\n"
                            "  guessability:    How likely is an average player to name all words "
                            "correctly? (1=impossible, 3=fair challenge, 5=trivially obvious — "
                            "sweet spot is 3–4)\n"
                            "  aha_factor:      How satisfying is the 'of course!' moment on reveal? "
                            "(1=feels arbitrary, 5=deeply satisfying)\n\n"
                            "Reply with JSON only, e.g.: "
                            '{"word_clarity":4,"visual_appeal":3,"concept_synergy":4,'
                            '"guessability":3,"aha_factor":4}'
                        ),
                    },
                ],
            }],
        )
        raw_rubric = rubric_msg.content[0].text.strip()
        try:
            rubric = json.loads(raw_rubric)
        except Exception:
            # Try extracting key:value pairs if JSON is malformed
            rubric = {}
            for key in ("word_clarity", "visual_appeal", "concept_synergy", "guessability", "aha_factor"):
                m = re.search(rf'"{key}"\s*:\s*(\d)', raw_rubric)
                if m:
                    rubric[key] = int(m.group(1))

        # Composite score: sum all dims, penalise guessability far from sweet spot (3.5)
        g = rubric.get("guessability", 3)
        composite = (
            rubric.get("word_clarity", 0)
            + rubric.get("visual_appeal", 0)
            + rubric.get("concept_synergy", 0)
            + rubric.get("aha_factor", 0)
            + max(0, 5 - abs(g - 3.5) * 2)  # 5pts at g=3.5, 0pts at g=1 or g=5
        )

        result = {
            "file": img_path.name,
            "decoded": decoded,
            "description": description,
            "matched": matched,
            "missing": missing,
            "rubric": rubric,
            "composite": round(composite, 1),
        }
        results.append(result)

        # Terminal summary
        clarity = rubric.get("word_clarity", "?")
        appeal = rubric.get("visual_appeal", "?")
        synergy = rubric.get("concept_synergy", "?")
        guess = rubric.get("guessability", "?")
        aha = rubric.get("aha_factor", "?")
        status = "✓" if not missing else "⚠"
        print(f"  {status} {img_path.name}  [composite: {composite:.1f}/25]")
        if description:
            print(f"      Sees         : {description}")
        print(f"      Blind decode : {decoded}")
        if missing:
            print(f"      Missing      : {missing}")
        print(f"      clarity={clarity}  appeal={appeal}  synergy={synergy}  "
              f"guess={guess}  aha={aha}")

    # Recommend best variant
    if results:
        best = max(results, key=lambda r: r["composite"])
        print(f"\n  ★ Recommended: {best['file']} (composite {best['composite']:.1f}/25)")
        g = best["rubric"].get("guessability", 3)
        if g <= 1:
            print("    ⚠ Guessability very low — players may find this unsolvable. "
                  "Consider making key elements more prominent.")
        elif g >= 5:
            print("    ⚠ Too easy — answer is immediately obvious. "
                  "Consider a more subtle visual treatment.")
        if best["rubric"].get("concept_synergy", 5) <= 2:
            print("    ⚠ Low concept synergy — image reads as a collage. "
                  "Try a prompt that integrates the words into a single scene.")

    return results


def _score_bar(value: int | str, max_val: int = 5, sweet_low: int = 0, sweet_high: int = 0) -> str:
    """Render a compact score bar. Highlights sweet-spot range in green, else uses value-based colour."""
    try:
        v = int(value)
    except (TypeError, ValueError):
        return str(value)
    if sweet_low and sweet_high:
        color = "#2a9d2a" if sweet_low <= v <= sweet_high else ("#cc7700" if v < sweet_low else "#cc7700")
    else:
        color = "#2a9d2a" if v >= 4 else ("#cc7700" if v == 3 else "#cc0000")
    filled = "█" * v
    empty = "░" * (max_val - v)
    return f'<span style="color:{color};font-family:monospace">{filled}{empty}</span> <b>{v}</b>'


def _build_contact_sheet(outputs: list[Path], check_results: list[dict]) -> str:
    """Return HTML string for the candidate review contact sheet."""
    result_by_name = {r["file"]: r for r in check_results}

    # Sort by composite score descending if scores are available
    sorted_outputs = sorted(
        outputs,
        key=lambda p: -(result_by_name[p.name]["composite"] if p.name in result_by_name else 0),
    )

    cards = []
    for rank, p in enumerate(sorted_outputs):
        r = result_by_name.get(p.name)
        border = "3px solid #f0a800" if rank == 0 and r else "1px solid #ccc"
        star = " ★" if rank == 0 and r else ""

        if r:
            rb = r.get("rubric", {})
            missing = r.get("missing", [])
            decoded = r.get("decoded", [])
            description = r.get("description", "")
            composite = r.get("composite", 0)

            status_color = "#2a9d2a" if not missing else "#cc7700"
            blind_line = (
                f'<div style="font-size:11px;color:{status_color};margin-top:6px">'
                f'👁 {", ".join(decoded)}</div>'
            )
            if description:
                # Use a 💬 marker so the parser can extract this independently.
                # HTML-escape angle brackets & ampersands defensively.
                safe_desc = (
                    description.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                )
                blind_line += (
                    f'<div style="font-size:11px;color:#444;margin-top:2px;'
                    f'font-style:italic">💬 {safe_desc}</div>'
                )
            if missing:
                blind_line += (
                    f'<div style="font-size:10px;color:#cc0000">missing: {", ".join(missing)}</div>'
                )

            rows = [
                ("clarity", rb.get("word_clarity", "?"), 0, 0),
                ("appeal", rb.get("visual_appeal", "?"), 0, 0),
                ("synergy", rb.get("concept_synergy", "?"), 0, 0),
                ("guess", rb.get("guessability", "?"), 3, 4),
                ("aha", rb.get("aha_factor", "?"), 0, 0),
            ]
            rubric_html = '<table style="font-size:11px;margin-top:6px;border-collapse:collapse">'
            for label, val, sl, sh in rows:
                rubric_html += (
                    f'<tr><td style="padding:1px 6px 1px 0;color:#555">{label}</td>'
                    f'<td>{_score_bar(val, sweet_low=sl, sweet_high=sh)}</td></tr>'
                )
            rubric_html += "</table>"
            rubric_html += (
                f'<div style="font-size:12px;font-weight:700;margin-top:4px;color:#333">'
                f'composite: {composite:.1f}/25</div>'
            )
            overlay = blind_line + rubric_html
        else:
            overlay = ""

        cards.append(
            f'<div style="text-align:left;margin:12px;font-family:sans-serif;'
            f'background:#fafafa;padding:10px;border-radius:8px;width:200px">'
            f'<img src="{p.name}" width="160" height="160" '
            f'style="border:{border};border-radius:6px;display:block">'
            f'<small style="display:block;margin-top:4px;color:#666">{p.name}{star}</small>'
            f"{overlay}"
            f"</div>"
        )

    body = "\n".join(cards)
    return (
        "<!doctype html><html><head>"
        "<style>body{font-family:-apple-system,sans-serif;padding:16px;background:#f5f5f7}"
        "h2{margin:0 0 12px;font-size:15px;color:#333}</style>"
        "</head><body>"
        "<h2>Moji Mash candidates — sorted by composite score (★ = recommended)</h2>"
        f"<div style='display:flex;flex-wrap:wrap'>{body}</div>"
        "</body></html>"
    )


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
    init_image: Path | None = None,
    init_strength: float = 0.4,
) -> list[Path]:
    """Generate `count` variants for `words` into `stage_dir`.

    When `init_image` is provided, mflux runs in img2img mode using that PNG
    as the starting latent and `init_strength` (0.0-1.0) controlling how much
    the new prompt deviates from it. Suffix `_r<seed>` is appended to keep
    refined outputs distinct from the originals.
    """
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
    is_refine = init_image is not None

    if is_refine and not init_image.exists():
        sys.exit(f"Error: init image {init_image} does not exist.")

    for i in range(count):
        effective_seed = (seed if seed is not None else 42) + i
        suffix = f"-r{effective_seed}" if is_refine else f"-s{effective_seed}"
        out_file = stage_dir / f"{slug}{suffix}.png"

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
        if is_refine:
            cmd.extend([
                "--init-image-path", str(init_image),
                "--init-image-strength", str(init_strength),
            ])

        mode_label = "Refining" if is_refine else "Generating"
        print(f"  {mode_label} variant {i + 1}/{count} (seed {effective_seed})…")
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
    """Sanity-check a candidate word list against the existing pool.

    Hard rule (only true blocker): exact word tuple already exists. Anything
    else is informational. We used to enforce a hard cap on word reuse and a
    rotation-count floor, but those don't survive the move to daily puzzles +
    paid packs — at scale, common nouns will inevitably recur. What matters
    instead is *recency*: two pinned puzzles using the same word within
    PIN_RECENCY_DAYS feels repetitive to a player, while the same word months
    apart is invisible.
    """
    tuples, word_counts, entries = load_existing_pool(TS_PUZZLES)
    slug_tuple = tuple(words)

    if slug_tuple in tuples:
        print(
            f"Warning: {words!r} already exists in the puzzle pool — "
            "promotion would create a duplicate.",
            file=sys.stderr,
        )

    # Informational: how often is each candidate word already used? No
    # block — the agent decides if the pattern matters.
    reuse_summary = [(w, word_counts.get(w, 0)) for w in words if word_counts.get(w, 0) > 0]
    if reuse_summary:
        parts = ", ".join(f"{w}×{n}" for w, n in reuse_summary)
        print(f"Info: word reuse counts in pool — {parts}", file=sys.stderr)

    # Recency check: scan pinned entries for any that share a word with the
    # candidate AND have a date within PIN_RECENCY_DAYS of any other pinned
    # date for the same word. This catches "snake" appearing on April 1 and
    # April 10 both pinned, while ignoring months-apart reuse.
    today = date.today()
    pinned_dates_by_word: dict[str, list[tuple[date, list[str]]]] = {}
    for e in entries:
        if not e.get("date"):
            continue
        try:
            d = date.fromisoformat(e["date"])
        except ValueError:
            continue
        for w in e["words"]:
            pinned_dates_by_word.setdefault(w, []).append((d, e["words"]))

    recency_hits: list[str] = []
    for w in words:
        for d, other_words in pinned_dates_by_word.get(w, []):
            if abs((d - today).days) <= PIN_RECENCY_DAYS:
                recency_hits.append(
                    f"'{w}' is in pinned puzzle {other_words!r} on {d.isoformat()} "
                    f"({abs((d - today).days)}d from today)"
                )
    if recency_hits:
        print(
            "Warning: pinned-puzzle recency conflicts within "
            f"{PIN_RECENCY_DAYS} days:",
            file=sys.stderr,
        )
        for hit in recency_hits:
            print(f"  - {hit}", file=sys.stderr)

    # Pool stats — useful context for the agent, never a block.
    total = len(tuples)
    pinned = sum(1 for e in entries if e.get("date"))
    if word_counts:
        top = sorted(word_counts.items(), key=lambda kv: -kv[1])[:5]
        top_str = ", ".join(f"{w}×{n}" for w, n in top)
    else:
        top_str = "(empty)"
    print(
        f"Info: pool has {total} puzzles ({pinned} pinned). "
        f"Top words: {top_str}.",
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
    p.add_argument(
        "--refine", type=Path, default=None, metavar="FILE",
        help=(
            "Refine an existing staged PNG with img2img: pass the previous "
            "variant as the init image and use --prompt to steer the new "
            "render. Cannot be combined with --promote. Outputs use a "
            "`-r<seed>` suffix to keep them distinct from the originals."
        ),
    )
    p.add_argument(
        "--init-strength", type=float, default=0.4,
        help=(
            "Strength of the init image when --refine is used (0.0-1.0). "
            "Lower keeps the original layout; higher follows the new prompt "
            "more freely. Default 0.4."
        ),
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()

    words = args.words.lower().split()
    validate_words(words)
    check_pool(words)

    if args.promote:
        if args.refine:
            sys.exit("Error: --refine and --promote cannot be combined.")
        promote(args.promote, words, args.force)
        return

    if not args.prompt:
        sys.exit("Error: --prompt is required when generating images.")

    stage_dir = args.stage or (STAGE_BASE / date.today().isoformat())
    init_image: Path | None = args.refine
    if init_image is not None and not init_image.is_absolute():
        init_image = (BASE_DIR / init_image).resolve()
    generate(
        words,
        args.prompt,
        args.count,
        args.seed,
        stage_dir,
        check=args.check,
        init_image=init_image,
        init_strength=args.init_strength,
    )


if __name__ == "__main__":
    main()
