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

# Postprocessing: open-genmoji's reference pipeline upscales the 160px LoRA
# output 5× to 800px with a smooth resampler. Without this our images look
# tiny in the contact sheet and (more importantly) the vision check sees a
# pixelated thumbnail instead of the intended sticker.
UPSCALE_FACTOR = 5

# Rotation floor: warn if non-pinned puzzles drop below this.
ROTATION_FLOOR = 30

# Playtest rank → difficulty score. Sweet spot is rank 3 (fair challenge).
# Rank 1 (instant solve) signals an over-obvious / idiom-trivial puzzle;
# rank 0 (not in top 5) signals likely unsolvable. Both penalised in the
# composite via the bell curve in vision_check.
_RANK_TO_DIFFICULTY = {1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 0: 1}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(words: list[str]) -> str:
    return "-".join(w.lower().strip() for w in words)


def _upscale_in_place(png_path: Path, factor: int) -> None:
    """Resize the PNG at png_path by `factor` using Pillow's LANCZOS resampler.

    Mirrors open-genmoji's postprocessing step: the LoRA renders at 160×160
    for speed, then we upscale 5× to 800×800 so vision check + contact sheet
    see a sticker-sized image. Non-fatal on import or write errors — we
    leave the raw PNG and emit a stderr warning.
    """
    try:
        from PIL import Image  # type: ignore[import-untyped]
    except ImportError:
        print(
            f"  Warning: Pillow not installed — skipping {factor}× upscale of "
            f"{png_path.name}. Install with: pip install Pillow",
            file=sys.stderr,
        )
        return
    try:
        with Image.open(png_path) as img:
            new_size = (img.width * factor, img.height * factor)
            upscaled = img.resize(new_size, Image.LANCZOS)
            upscaled.save(png_path, "PNG")
    except Exception as e:  # noqa: BLE001 — non-fatal best-effort
        print(
            f"  Warning: failed to upscale {png_path.name}: {e}",
            file=sys.stderr,
        )


def generate_hint(words: list[str]) -> str:
    letters = ", ".join(w[0].lower() for w in words)
    return f"Starts with: {letters}"


def _parse_playtest_guesses(raw: str, n_words: int) -> list[list[str]]:
    """Robustly extract the `guesses` array from Pass-3 output.

    Accepts fenced code blocks, trailing prose, and both list-of-lists
    and list-of-strings shapes. Each guess is normalised to a list of
    lowercase word tokens. Guesses whose length ≠ n_words are dropped.
    """
    body = raw.strip()
    body = re.sub(r"^```(?:json)?\s*", "", body, flags=re.IGNORECASE)
    body = re.sub(r"```\s*$", "", body, flags=re.IGNORECASE).strip()
    start = body.find("{")
    end = body.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return []
    try:
        obj = json.loads(body[start:end + 1])
    except Exception:
        return []
    arr = obj.get("guesses") if isinstance(obj, dict) else None
    if not isinstance(arr, list):
        return []
    out: list[list[str]] = []
    for g in arr:
        if isinstance(g, list):
            words = [str(w).lower().strip() for w in g if isinstance(w, (str, int, float))]
        elif isinstance(g, str):
            words = [w.lower().strip() for w in re.split(r"[\s,]+", g) if w.strip()]
        else:
            continue
        words = [w for w in words if re.fullmatch(r"[a-z]+", w)]
        if len(words) == n_words:
            out.append(words)
    return out


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
    """Three-pass visual quality evaluation for each generated image.

    Pass 1 — blind decode: ask Claude what it sees without knowing the answer.
    Pass 2 — scored rubric: 4 dimensions with strict 1–5 anchors. The
             anchors are deliberately tight: a 5 means top-decile work
             worth headlining a curated calendar, not "competent."
    Pass 3 — playtest: show Claude only the image + the public hint and ask
             it to list its top 5 guesses. The rank of the true answer is
             converted to `playtest_difficulty` (1–5, sweet spot 3). This
             is a *measured* difficulty signal, not Claude's opinion of
             how hard the puzzle is.

    Composite (max 25) = sum of 4 rubric dims (clarity, style, synergy,
    aha) + a bell-curve contribution from playtest_difficulty (5 pts at
    pd=3, dropping to 1 pt at pd=1 or pd=5). The bell curve penalises
    both "too obvious" (rank 1) and "unsolvable" (not in top 5).

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
        blind_msg = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=128,
            messages=[{
                "role": "user",
                "content": [
                    image_block,
                    {
                        "type": "text",
                        "text": (
                            "This is a cartoon emoji sticker. Without being told the answer, "
                            "list the 3–5 most specific words describing distinct visual elements "
                            "you see. Concrete nouns only. "
                            'Reply with a JSON array of lowercase strings, e.g. ["dog","fire"]'
                        ),
                    },
                ],
            }],
        )
        raw_blind = blind_msg.content[0].text.strip()
        try:
            decoded: list[str] = json.loads(raw_blind)
        except Exception:
            decoded = re.findall(r'"([a-z]+)"', raw_blind)

        matched = [w for w in decoded if w in answer_set]
        missing = [w for w in words if w not in decoded]

        # ── Pass 2: scored rubric (4 dims, strict anchors) ────────────────────
        # The bar is HIGH. We're scoring for inclusion in a curated 365-day
        # calendar, not for "is this a competent rendering". Each anchor must
        # be re-read on every variant — drift toward generous 4s is the main
        # failure mode of this rubric.
        rubric_msg = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=384,
            messages=[{
                "role": "user",
                "content": [
                    image_block,
                    {
                        "type": "text",
                        "text": (
                            "You are scoring this emoji for inclusion in a curated 365-day "
                            "puzzle calendar. The bar is HIGH — most variants are competent "
                            "but unremarkable; reserve 5s for genuine top-decile work that "
                            "would headline the calendar, and 4s for solid keepers.\n\n"
                            f"The answer words are: {answer_str}.\n\n"
                            "Score 4 dimensions strictly. Use the full 1–5 range. If you "
                            "find yourself awarding 4s and 5s across the board, re-read "
                            "the anchors.\n\n"
                            "word_clarity (every answer word visible and pointable?)\n"
                            "  5 = every word leaps out; a stranger names them all from a glance\n"
                            "  4 = every word is present, one requires a brief look\n"
                            "  3 = a word is present but ambiguous OR requires inferring from context\n"
                            "  2 = at least one word is depicted poorly or could be named differently "
                            "(e.g. 'boomerang' instead of 'return')\n"
                            "  1 = at least one word is missing or unrecognizable\n\n"
                            "style_fidelity (matches the open-genmoji LoRA / Apple-emoji style?)\n"
                            "  5 = indistinguishable from a real Apple emoji — single subject, "
                            "soft 3D shading, no shadow, no background\n"
                            "  4 = clearly LoRA-style with one minor flaw (slight texture issue, "
                            "mild lighting break)\n"
                            "  3 = recognizably emoji-style but a notable style break (small painted "
                            "backdrop, harsh shadow, second subject creeping in)\n"
                            "  2 = significant style failure (flat 2D illustration, photo-realistic, "
                            "painted scene, drop shadow present)\n"
                            "  1 = wrong style entirely\n\n"
                            "concept_synergy (one creative scene, or a collage of separate objects?)\n"
                            "  5 = the words feel made for each other; one unified, witty composition\n"
                            "  4 = unified scene with slightly forced integration\n"
                            "  3 = elements coexist but feel adjacent rather than integrated\n"
                            "  2 = mostly a collage; objects sit next to each other without interaction\n"
                            "  1 = pure collage / cropped objects pasted together\n\n"
                            "aha_factor (how satisfying is the 'of course!' moment on reveal?)\n"
                            "  5 = laugh-out-loud or 'that's clever' — image you'd screenshot and send a friend\n"
                            "  4 = a clear smile; the answer feels earned and fits perfectly\n"
                            "  3 = mild satisfaction; the connection is fine but unmemorable\n"
                            "  2 = the answer feels arbitrary or anticlimactic\n"
                            "  1 = no aha at all; it's just an image of the words\n\n"
                            "CALIBRATION: typical generations should average 13–17 composite. "
                            "20+ is reserved for variants you would champion in portfolio review.\n\n"
                            "Reply with JSON only, e.g.: "
                            '{"word_clarity":4,"style_fidelity":3,"concept_synergy":4,"aha_factor":4}'
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
            for key in ("word_clarity", "style_fidelity", "concept_synergy", "aha_factor"):
                m = re.search(rf'"{key}"\s*:\s*(\d)', raw_rubric)
                if m:
                    rubric[key] = int(m.group(1))

        # ── Pass 3: playtest difficulty (measured, not opinion) ───────────────
        # Show Claude only the image + the public hint (starting letters), ask
        # it to play. The rank of the true answer in its top-5 guesses gives
        # us an objective difficulty signal that catches idiom-trivial
        # puzzles (rank 1) and unsolvable puzzles (not in top 5) — both bad.
        hint = generate_hint(words)
        n_words = len(words)
        playtest_msg = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=384,
            messages=[{
                "role": "user",
                "content": [
                    image_block,
                    {
                        "type": "text",
                        "text": (
                            "You are playing Moji Mash. Look at this emoji puzzle.\n"
                            f'The hint is: "{hint}". The answer is exactly {n_words} '
                            f"word{'s' if n_words != 1 else ''}.\n\n"
                            f"List your TOP 5 best guesses for the {n_words}-word answer, "
                            "from MOST likely to LEAST likely. Each guess is a JSON array "
                            f"of {n_words} lowercase words whose first letters MATCH the hint exactly.\n\n"
                            "Think like a typical player: what does the image most look like? "
                            "Do not reach for obscure idioms unless the image clearly demands it. "
                            "It is fine to repeat words across guesses if you're trying variations.\n\n"
                            "Reply with STRICT JSON only:\n"
                            '{"guesses": [["w1","w2"], ["w3","w4"], …]}'
                        ),
                    },
                ],
            }],
        )
        raw_play = playtest_msg.content[0].text.strip()
        playtest_guesses = _parse_playtest_guesses(raw_play, n_words)
        target = [w.lower() for w in words]
        playtest_rank = 0  # 1-indexed rank; 0 means not found in top 5
        for idx, g in enumerate(playtest_guesses[:5]):
            if g == target:
                playtest_rank = idx + 1
                break
        # rank → difficulty score (sweet spot at 3 = "fair challenge")
        # rank=1 means trivial, rank=0 (not in top 5) means likely unsolvable
        playtest_difficulty = _RANK_TO_DIFFICULTY.get(playtest_rank, 1)
        rubric["playtest_difficulty"] = playtest_difficulty

        # Composite (max 25): sum of 4 rubric dims + bell-curved playtest
        # contribution. Peak 5 pts at pd=3, dropping to 1 pt at the extremes.
        composite = (
            rubric.get("word_clarity", 0)
            + rubric.get("style_fidelity", 0)
            + rubric.get("concept_synergy", 0)
            + rubric.get("aha_factor", 0)
            + max(0, 5 - abs(playtest_difficulty - 3) * 2)
        )

        result = {
            "file": img_path.name,
            "decoded": decoded,
            "matched": matched,
            "missing": missing,
            "rubric": rubric,
            "composite": round(composite, 1),
            "playtest_rank": playtest_rank,
            "playtest_guesses": playtest_guesses[:5],
        }
        results.append(result)

        # Terminal summary
        clarity = rubric.get("word_clarity", "?")
        style = rubric.get("style_fidelity", "?")
        synergy = rubric.get("concept_synergy", "?")
        aha = rubric.get("aha_factor", "?")
        rank_label = (
            f"#{playtest_rank}" if playtest_rank else "miss"
        )
        status = "✓" if not missing else "⚠"
        print(f"  {status} {img_path.name}  [composite: {composite:.1f}/25]")
        print(f"      Blind decode : {decoded}")
        if missing:
            print(f"      Missing      : {missing}")
        print(f"      clarity={clarity}  style={style}  synergy={synergy}  "
              f"aha={aha}  playtest={playtest_difficulty} ({rank_label})")
        if playtest_guesses:
            preview = ", ".join("[" + " ".join(g) + "]" for g in playtest_guesses[:3])
            print(f"      Player guesses: {preview}")

    # Recommend best variant
    if results:
        best = max(results, key=lambda r: r["composite"])
        print(f"\n  ★ Recommended: {best['file']} (composite {best['composite']:.1f}/25)")
        pd = best["rubric"].get("playtest_difficulty", 3)
        rank = best.get("playtest_rank", 0)
        if pd >= 5:
            print("    ⚠ Playtest too easy — the answer was guess #1. "
                  "Consider a subtler framing or a less literal visual.")
        elif pd <= 1 and rank == 0:
            print("    ⚠ Playtest missed — true answer not in top 5 guesses. "
                  "Players may find this unsolvable; make key elements more prominent.")
        elif pd <= 2:
            print("    ⚠ Playtest on the hard end — answer ranked low. "
                  "Fine for a 'challenge' pick, but flag for user review.")
        if best["rubric"].get("concept_synergy", 5) <= 2:
            print("    ⚠ Low concept synergy — image reads as a collage. "
                  "Try a prompt that integrates the words into a single scene.")
        if best["rubric"].get("word_clarity", 5) <= 2:
            print("    ⚠ Word clarity low — at least one answer word is hard to point to. "
                  "Rewrite the prompt to foreground the weak element.")

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
            composite = r.get("composite", 0)
            playtest_rank = r.get("playtest_rank", 0)
            playtest_guesses = r.get("playtest_guesses", [])

            status_color = "#2a9d2a" if not missing else "#cc7700"
            blind_line = (
                f'<div style="font-size:11px;color:{status_color};margin-top:6px">'
                f'👁 {", ".join(decoded)}</div>'
            )
            if missing:
                blind_line += (
                    f'<div style="font-size:10px;color:#cc0000">missing: {", ".join(missing)}</div>'
                )

            rows = [
                ("clarity", rb.get("word_clarity", "?"), 0, 0),
                ("style", rb.get("style_fidelity", "?"), 0, 0),
                ("synergy", rb.get("concept_synergy", "?"), 0, 0),
                ("aha", rb.get("aha_factor", "?"), 0, 0),
                ("playtest", rb.get("playtest_difficulty", "?"), 3, 3),
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

            if playtest_guesses:
                rank_label = f"rank #{playtest_rank}" if playtest_rank else "not in top 5"
                rank_color = (
                    "#cc0000" if playtest_rank == 1 or playtest_rank == 0
                    else ("#2a9d2a" if playtest_rank == 3 else "#cc7700")
                )
                guesses_html = (
                    f'<div style="font-size:10px;margin-top:6px;color:#555">'
                    f'🎮 playtest <span style="color:{rank_color};font-weight:600">{rank_label}</span></div>'
                )
                for i, g in enumerate(playtest_guesses):
                    is_answer = (i + 1) == playtest_rank
                    style = "font-weight:600;color:#2a9d2a" if is_answer else "color:#888"
                    guesses_html += (
                        f'<div style="font-size:10px;{style}">'
                        f'  {i + 1}. {" ".join(g)}{" ✓" if is_answer else ""}</div>'
                    )
            else:
                guesses_html = (
                    '<div style="font-size:10px;margin-top:6px;color:#aaa">'
                    '🎮 playtest: (no guesses parsed)</div>'
                )

            overlay = blind_line + rubric_html + guesses_html
        else:
            overlay = ""

        cards.append(
            f'<div style="text-align:left;margin:12px;font-family:sans-serif;'
            f'background:#fafafa;padding:10px;border-radius:8px;width:220px">'
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

        # Upscale the 160px LoRA output to 800px to match open-genmoji's
        # reference pipeline. Failures here are non-fatal — we keep the raw
        # output and warn so the rest of the run continues.
        _upscale_in_place(out_file, UPSCALE_FACTOR)

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
