#!/usr/bin/env python3
"""Audit Museum for launch-level editorial product readiness.

This is intentionally stricter than the structural annual-pack validator. A
pack can be runnable, scheduled, and internally consistent while still sounding
too generated to ship as a Daybreak editorial product. This audit names those
product blockers directly.
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from museum_pipeline_common import CURATED_PATH, SCHEDULE_PATH, normalize_space, read_json


REPORT_PATH = Path("docs/museum-editorial-product-readiness.md")

REPEATED_STEM_CAP = 5
WEAK_RECORD_SAMPLE_LIMIT = 60

PRODUCT_BLOCKER_PHRASES: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("use/place/viewing formula", re.compile(r"\buse,\s*place,\s*and viewing\b", re.IGNORECASE)),
    ("visible detail abstraction", re.compile(r"\bvisible detail\b", re.IGNORECASE)),
    ("generic in-this-work hinge", re.compile(r"\bin this work\b", re.IGNORECASE)),
    ("not-just formulation", re.compile(r"\bnot just\b", re.IGNORECASE)),
    ("work-setting abstraction", re.compile(r"\bthe work['’]s setting\b", re.IGNORECASE)),
    ("viewer-habits abstraction", re.compile(r"\bhabits of viewing\b", re.IGNORECASE)),
    ("human-scale abstraction", re.compile(r"\bhuman scale\b", re.IGNORECASE)),
    ("tied-to attribution shortcut", re.compile(r"\btied to\b", re.IGNORECASE)),
    ("close-look filler", re.compile(r"\b(?:close look|slow looking|look back to|keep .{0,40} in mind)\b", re.IGNORECASE)),
    ("generic material phrasing", re.compile(r"\b(?:material handling|material decisions|surface character|surface, weight, or rhythm)\b", re.IGNORECASE)),
    ("generic process phrasing", re.compile(r"\b(?:process changes your view|technique gives|making changes how|craft reveal)\b", re.IGNORECASE)),
    ("decorative-only foil", re.compile(r"\b(?:only as surface decoration|beyond decoration|decorative interest)\b", re.IGNORECASE)),
    ("maker attribution as fact", re.compile(r"\bnamed as maker\b|\battribution feel visible\b|\bname gives .{0,80} a maker\b", re.IGNORECASE)),
    ("materials legible template", re.compile(r"\bmaterials become legible\b", re.IGNORECASE)),
    ("making collect template", re.compile(r"\blets the making collect\b", re.IGNORECASE)),
    ("best entry template", re.compile(r"\bbest entry point into the making\b", re.IGNORECASE)),
    ("one-context-another template", re.compile(r"\bone context\b.{0,100}\banother\b", re.IGNORECASE)),
    ("more precise template", re.compile(r"\bbecomes more precise\b", re.IGNORECASE)),
    ("attention-on-work template", re.compile(r"\bkeeps your attention on the work itself\b", re.IGNORECASE)),
    ("less anonymous template", re.compile(r"\bless anonymous\b", re.IGNORECASE)),
    ("visible-fact template", re.compile(r"\bdate or maker into a visible fact\b", re.IGNORECASE)),
    ("generic clue template", re.compile(r"\bmost useful clue\b|\bsmall enough to miss\b|\bcan begin with one detail\b", re.IGNORECASE)),
    ("larger-world template", re.compile(r"\blarger world\b|\bkeeps that world concrete\b", re.IGNORECASE)),
    ("point-of-entry template", re.compile(r"\bphysical point of entry\b", re.IGNORECASE)),
    ("maker-setting template", re.compile(r"\bmaker['’]s setting\b", re.IGNORECASE)),
    ("malformed textile maker", re.compile(r"\b(?:India,\s*Gujarat|textile maker India|maker India)\b", re.IGNORECASE)),
    ("toy foil language", re.compile(r"\b(?:frame color|wall color|weather report|shipping route|theatre prop|furniture plan)\b", re.IGNORECASE)),
    ("generated form noun", re.compile(r"\b(?:cluster of forms|flower forms)\b", re.IGNORECASE)),
    ("wrong-object near-title foil", re.compile(r"\b(?:glazed ceramic lip|cast metal handle|woven border|mounted photo corner|raised brushstroke|carved stone base|woven floral border|gilded manuscript initial|camera lens|carved marble foot|printed skyline|ceramic glaze pool|photo mount edge|painted canvas corner|camera shadow|manuscript margin|distant mountain|painted saint|printed riverbank|woven robe edge)\s+near the\b", re.IGNORECASE)),
    ("connection sentence factory", re.compile(r"\bconnects\b.{0,90}\bwith\b", re.IGNORECASE)),
    ("thought-in-motion abstraction", re.compile(r"\bthought in motion\b", re.IGNORECASE)),
    ("photographed-places abstraction", re.compile(r"\bhistory of photographed places\b", re.IGNORECASE)),
    ("cross-cultural design abstraction", re.compile(r"\bcross-cultural design history\b", re.IGNORECASE)),
    ("global-design abstraction", re.compile(r"\bglobal design exchange\b", re.IGNORECASE)),
    ("flat-backdrop filler", re.compile(r"\bflat backdrop\b", re.IGNORECASE)),
    ("context-as-place misuse", re.compile(r"\b(?:distance from|turns)\s+(?:documentary photography|designed-object history|textile exchange|print culture|works on paper|world art)\b", re.IGNORECASE)),
    ("viewpoint-does-work filler", re.compile(r"\bviewpoint does real work\b", re.IGNORECASE)),
    ("source-note subject formula", re.compile(r"\bnames its subject directly\b", re.IGNORECASE)),
    ("source-note generic made form", re.compile(r"\bwithin (?:the made|a practical) form\b", re.IGNORECASE)),
    ("source-note fallback view detail", re.compile(r"\b(?:full length|river colorado river|guggenheim:\s*male)\b", re.IGNORECASE)),
    ("nearby-forms reinforcement", re.compile(r"\bnearby forms easier to read\b", re.IGNORECASE)),
    ("work-opens-up reinforcement", re.compile(r"\bwork opens up\b", re.IGNORECASE)),
    ("beyond-first-glance reinforcement", re.compile(r"\bbeyond first glance\b", re.IGNORECASE)),
    ("attached-to-place reinforcement", re.compile(r"\battached to place,\s*handling,\s*or display\b", re.IGNORECASE)),
    ("visible-character reinforcement", re.compile(r"\bvisible character\b", re.IGNORECASE)),
    ("close-to-hand formula", re.compile(r"\bclose to the artist['’]s hand\b", re.IGNORECASE)),
    ("treated-as context foil", re.compile(r"\bwith .{0,80}\btreated as\b", re.IGNORECASE)),
    ("read-through context foil", re.compile(r"\bread through\b", re.IGNORECASE)),
    ("seen-through context foil", re.compile(r"\bseen through\b", re.IGNORECASE)),
    ("understood-through context foil", re.compile(r"\bunderstood through\b", re.IGNORECASE)),
    ("fits-which-context prompt", re.compile(r"\bfits which context\b", re.IGNORECASE)),
    ("what-history-helps prompt", re.compile(r"\bwhat history helps\b", re.IGNORECASE)),
    ("surrounding-story prompt", re.compile(r"\bsurrounding story helps\b", re.IGNORECASE)),
    ("notice-the-making prompt", re.compile(r"\bwhat should you notice about the making\b", re.IGNORECASE)),
    ("medium-work prompt", re.compile(r"\bhow does the medium work\b", re.IGNORECASE)),
    ("cultural-weight reinforcement", re.compile(r"\bcultural weight\b", re.IGNORECASE)),
    ("reason-to-matter reinforcement", re.compile(r"\breason to matter\b", re.IGNORECASE)),
    ("holds-light-weight-line reinforcement", re.compile(r"\bholds? light,\s*weight,\s*or line\b", re.IGNORECASE)),
    ("looks-the-way reinforcement", re.compile(r"\blooks? the way\b", re.IGNORECASE)),
    ("sets-looking-motion reinforcement", re.compile(r"\bsets? the looking in motion\b", re.IGNORECASE)),
    ("main-structure reinforcement", re.compile(r"\bmain structure is easier to follow\b", re.IGNORECASE)),
    ("shaped-by-generic context", re.compile(r"\bshaped by (?:camera position|working line|pattern,\s*touch|scale,\s*light|[^.,;!?]{0,35}use,\s*and form)\b", re.IGNORECASE)),
    ("long-title option", re.compile(r"\b(?:a|an|the)\s+[a-z][a-z'’.-]*(?:\s+[a-z][a-z'’.-]*){1,5}\s+in\s+[A-Z][^.,;!?]{55,}\b")),
)

WEAK_VISIBLE_DETAIL_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("medium-as-visible-detail", re.compile(r"\b(?:oil on canvas|graphite on paper|albumen print|gelatin silver print|watercolor|etching|engraving|lithograph|bronze|marble|terracotta|earthenware|porcelain|silk|wool|cotton)\b", re.IGNORECASE)),
    ("period-as-visible-detail", re.compile(r"\b(?:impressionism|post impressionism|modernism|baroque|rococo|renaissance|late period|19th century|17th century|18th century|20th century)\b", re.IGNORECASE)),
    ("category-as-visible-detail", re.compile(r"\b(?:painting|drawing|photograph|print|textile|design|sculpture|ceramic|metalwork|manuscript)(?:\b|s\b)", re.IGNORECASE)),
    ("fallback-composition-detail", re.compile(r"\b(?:foreground form|background space|arranged composition|central grouping|cluster of forms|flower forms|strongest contour|color transitions|visible paint handling|painted surface|study-like surface|chosen viewpoint|fixed viewpoint|photographic print surface|finished material|designed silhouette|working scale)\b", re.IGNORECASE)),
    ("title-token-detail", re.compile(r"\bin\s+[A-Z][^|]{3,90}$")),
    ("culture-or-abstract-label-as-visible-detail", re.compile(r"^(?:the\s+)?(?:japanese|south asian|late assyrian|louis xv|roman|moche|japanism|nayarit|american|european|french|british|italian|chinese|korean|islamic|egyptian|greek|persian|indian|african|japan|korea|casting|incising|iridescence|cloisonné|cloisonne|status|initiation|leadership|warfare|commemorative|human|agricultural|allegory|poetry|adornment|household|healing|tobacco|gilding|farm|mine|self|syria|brocading|interior)$", re.IGNORECASE)),
)

GENERIC_QUIZ_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("what-making-detail stem", re.compile(r"\bwhat (?:does|making|material|craft|process|technique).{0,70}\b(?:notice|view|shape|reveal|explain|clarify)\b", re.IGNORECASE)),
    ("which-detail-near stem", re.compile(r"\bwhich (?:detail|visible detail|answer|option).{0,80}\b(?:near|around|alongside|with)\b", re.IGNORECASE)),
    ("larger-setting stem", re.compile(r"\bwhat (?:larger setting|world|surrounding story|context).{0,80}\b", re.IGNORECASE)),
    ("surface-decoration foil", re.compile(r"\b(?:surface decoration|later framing choice|modern advertising|stage design|display support)\b", re.IGNORECASE)),
    ("plural agreement artifact", re.compile(r"\b(?:forms|buildings|columns|ruins|trees|flowers|figures|marks|lines|mountains)\s+(?:suggests|connects|turns|gives|keeps|shows|carries|points|sits|holds|shares)\b", re.IGNORECASE)),
    ("collective agreement artifact", re.compile(r"\b(?:arcade|arrangement|cluster|field|group|line|pair|row|series|set)\s+of\s+\w+\s+(?:share|suggest|connect|turn|give|keep|show|carry|point|sit|hold)\b", re.IGNORECASE)),
)


@dataclass(frozen=True)
class ScheduledArtwork:
    day: int
    date: str
    artwork: dict[str, Any]


def norm(value: str) -> str:
    return re.sub(r"\s+", " ", normalize_space(value).casefold()).strip()


def stem(value: str, words: int = 6) -> str:
    text = re.sub(r"[^a-z0-9 ]+", " ", norm(value))
    return " ".join(text.split()[:words])


def copy_fields(artwork: dict[str, Any]) -> list[tuple[str, str]]:
    fields: list[tuple[str, str]] = []
    fields.append(("artist", normalize_space(artwork.get("artist", ""))))
    for name, value in (artwork.get("context") or {}).items():
        fields.append((f"context.{name}", normalize_space(value)))
    for index, question in enumerate(artwork.get("questions", []), start=1):
        fields.append((f"questions[{index}].prompt", normalize_space(question.get("prompt", ""))))
        fields.append((f"questions[{index}].reinforcement", normalize_space(question.get("reinforcement", ""))))
        for option_index, option in enumerate(question.get("options", []), start=1):
            fields.append((f"questions[{index}].options[{option_index}]", normalize_space(option)))
    return fields


def scheduled_artworks(curated: dict[str, Any], schedule: dict[str, Any]) -> list[ScheduledArtwork]:
    by_id = {artwork["id"]: artwork for artwork in curated.get("artworks", [])}
    output: list[ScheduledArtwork] = []
    for day, entry in enumerate(schedule.get("entries", []), start=1):
        artwork = by_id.get(entry.get("artworkId"))
        if artwork:
            output.append(ScheduledArtwork(day=day, date=entry["date"], artwork=artwork))
    return output


def count_pattern_hits(artworks: Iterable[dict[str, Any]], patterns: tuple[tuple[str, re.Pattern[str]], ...]) -> Counter[str]:
    hits: Counter[str] = Counter()
    for artwork in artworks:
        for _, text in copy_fields(artwork):
            for label, pattern in patterns:
                matches = pattern.findall(text)
                if matches:
                    hits[label] += len(matches)
    return hits


def weak_evidence_records(scheduled: list[ScheduledArtwork]) -> list[tuple[ScheduledArtwork, list[str]]]:
    weak: list[tuple[ScheduledArtwork, list[str]]] = []
    for item in scheduled:
        evidence = item.artwork.get("review", {}).get("evidenceV1") or {}
        details = [normalize_space(detail) for detail in evidence.get("visibleDetails", []) if normalize_space(detail)]
        failures: list[str] = []
        for detail in details:
            for label, pattern in WEAK_VISIBLE_DETAIL_PATTERNS:
                if pattern.search(detail):
                    failures.append(f"{label}: {detail}")
                    break
        if failures:
            weak.append((item, failures))
    return weak


def repeated_context_stems(artworks: list[dict[str, Any]]) -> dict[str, list[tuple[str, int]]]:
    counts: dict[str, Counter[str]] = {
        "technique": Counter(),
        "surprisingFact": Counter(),
        "connection": Counter(),
    }
    for artwork in artworks:
        context = artwork.get("context") or {}
        for field in counts:
            value = normalize_space(context.get(field, ""))
            if value:
                counts[field][stem(value)] += 1
    return {
        field: [(value, count) for value, count in counter.most_common() if count > REPEATED_STEM_CAP]
        for field, counter in counts.items()
    }


def repeated_question_stems(artworks: list[dict[str, Any]]) -> list[tuple[str, int]]:
    counts: Counter[str] = Counter()
    for artwork in artworks:
        for question in artwork.get("questions", []):
            counts[stem(question.get("prompt", ""))] += 1
    return [(value, count) for value, count in counts.most_common() if count > REPEATED_STEM_CAP]


def per_record_blockers(item: ScheduledArtwork) -> list[str]:
    artwork = item.artwork
    blockers: list[str] = []
    for field, text in copy_fields(artwork):
        for label, pattern in PRODUCT_BLOCKER_PHRASES:
            if pattern.search(text):
                blockers.append(f"{field}: {label}")
                break
        for label, pattern in GENERIC_QUIZ_PATTERNS:
            if pattern.search(text):
                blockers.append(f"{field}: {label}")
                break
    evidence = artwork.get("review", {}).get("evidenceV1") or {}
    for detail in evidence.get("visibleDetails", []):
        for label, pattern in WEAK_VISIBLE_DETAIL_PATTERNS:
            if pattern.search(normalize_space(detail)):
                blockers.append(f"evidence.visibleDetails: {label}")
                break
    return blockers


def report_markdown(curated: dict[str, Any], schedule: dict[str, Any]) -> tuple[str, list[str]]:
    artworks = curated.get("artworks", [])
    scheduled = scheduled_artworks(curated, schedule)
    product_hits = count_pattern_hits(artworks, PRODUCT_BLOCKER_PHRASES)
    generic_quiz_hits = count_pattern_hits(artworks, GENERIC_QUIZ_PATTERNS)
    weak_records = weak_evidence_records(scheduled)
    context_stems = repeated_context_stems(artworks)
    question_stems = repeated_question_stems(artworks)
    record_blockers = [(item, per_record_blockers(item)) for item in scheduled]
    record_blockers = [(item, blockers) for item, blockers in record_blockers if blockers]

    errors: list[str] = []
    if product_hits:
        errors.append(f"{sum(product_hits.values())} product-blocker phrase hits remain")
    if generic_quiz_hits:
        errors.append(f"{sum(generic_quiz_hits.values())} generic quiz/formula hits remain")
    if weak_records:
        errors.append(f"{len(weak_records)} records have weak visible-evidence anchors")
    repeated_context_total = sum(len(values) for values in context_stems.values())
    if repeated_context_total:
        errors.append(f"{repeated_context_total} repeated T/N/C stems exceed cap {REPEATED_STEM_CAP}")
    if question_stems:
        errors.append(f"{len(question_stems)} repeated question stems exceed cap {REPEATED_STEM_CAP}")

    lines = [
        "# Museum Editorial Product Readiness",
        "",
        "This report is stricter than the annual-pack validator. It checks whether the 365-day pack reads like a real Museum product instead of a structurally valid generated dataset.",
        "",
        "## Verdict",
        "",
        "- Status: **not editorial-product shippable**" if errors else "- Status: **editorial-product ready**",
        f"- Runtime artworks checked: {len(artworks)}",
        f"- Scheduled days checked: {len(scheduled)}",
        f"- Record-level blockers: {len(record_blockers)}",
        f"- Weak evidence-anchor records: {len(weak_records)}",
        f"- Product phrase hits: {sum(product_hits.values())}",
        f"- Generic quiz/formula hits: {sum(generic_quiz_hits.values())}",
        "",
        "## Blocking Errors",
        "",
    ]
    if errors:
        lines.extend(f"- {error}" for error in errors)
    else:
        lines.append("- None.")

    lines.extend(["", "## Product Phrase Hits", "", "| Phrase Family | Hits |", "|---|---:|"])
    if product_hits:
        for label, count in product_hits.most_common():
            lines.append(f"| {label} | {count} |")
    else:
        lines.append("| None | 0 |")

    lines.extend(["", "## Generic Quiz/Formulation Hits", "", "| Pattern | Hits |", "|---|---:|"])
    if generic_quiz_hits:
        for label, count in generic_quiz_hits.most_common():
            lines.append(f"| {label} | {count} |")
    else:
        lines.append("| None | 0 |")

    lines.extend(["", "## Repeated Technique/Note/Connection Stems", ""])
    for field, values in context_stems.items():
        lines.extend([f"### {field}", "", "| Stem | Count |", "|---|---:|"])
        if values:
            for value, count in values[:20]:
                safe_value = value.replace("|", "\\|")
                lines.append(f"| {safe_value} | {count} |")
        else:
            lines.append("| None | 0 |")
        lines.append("")

    lines.extend(["## Repeated Question Stems", "", "| Stem | Count |", "|---|---:|"])
    if question_stems:
        for value, count in question_stems[:30]:
            safe_value = value.replace("|", "\\|")
            lines.append(f"| {safe_value} | {count} |")
    else:
        lines.append("| None | 0 |")

    lines.extend(["", "## Weak Evidence Anchors", ""])
    if weak_records:
        for item, failures in weak_records[:WEAK_RECORD_SAMPLE_LIMIT]:
            title = item.artwork["title"]
            lines.append(f"- Day {item.day} ({item.date}) `{item.artwork['id']}` — {title}: {failures[0]}")
        if len(weak_records) > WEAK_RECORD_SAMPLE_LIMIT:
            lines.append(f"- ...and {len(weak_records) - WEAK_RECORD_SAMPLE_LIMIT} more.")
    else:
        lines.append("- None.")

    lines.extend(["", "## First 45 Scheduled Days", "", "| Day | Date | Artwork | Source | Blockers |", "|---:|---|---|---|---|"])
    for item in scheduled[:45]:
        blockers = per_record_blockers(item)
        title = item.artwork["title"].replace("|", "\\|")
        source = item.artwork["source"]["collectionLabel"].replace("|", "\\|")
        blocker_text = "; ".join(blockers[:3]).replace("|", "\\|") if blockers else "none"
        if len(blocker_text) > 180:
            blocker_text = blocker_text[:177].rstrip() + "..."
        lines.append(f"| {item.day} | {item.date} | {title} | {source} | {blocker_text} |")

    lines.extend(
        [
            "",
            "## Required Remediation",
            "",
            "1. Replace weak visibleDetails with object-specific evidence from the image or official object page. Mediums, periods, categories, and title fragments cannot count as visible evidence.",
            "2. Rewrite Technique, Note, and Connection from distinct evidence jobs: making, object fact, and historical bridge. Avoid shared filler such as `use, place, and viewing`.",
            "3. Rewrite quiz prompts so each question has a different natural sentence shape and tests a concrete visible or contextual detail.",
            "4. Re-run this audit as a launch gate after each pack-wide rewrite pass.",
        ]
    )

    return "\n".join(lines) + "\n", errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--curated", type=Path, default=CURATED_PATH)
    parser.add_argument("--schedule", type=Path, default=SCHEDULE_PATH)
    parser.add_argument("--write-report", type=Path, default=REPORT_PATH)
    parser.add_argument("--no-fail", action="store_true", help="Write/report findings without nonzero exit.")
    args = parser.parse_args()

    curated = read_json(args.curated)
    schedule = read_json(args.schedule)
    report, errors = report_markdown(curated, schedule)

    if args.write_report:
        args.write_report.parent.mkdir(parents=True, exist_ok=True)
        args.write_report.write_text(report)

    print(report)
    if errors and not args.no_fail:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
