#!/usr/bin/env python3
"""Generate Composed editorial review queues from the static pack."""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
PACK_PATH = BASE_DIR / "src" / "data" / "kilter" / "pack.json"
OUT_PATH = BASE_DIR / "docs" / "composed-editorial-review-queue.md"

SWEEP_BONUS = 15
COMPOSED_PERCENT = 0.20
POISED_PERCENT = 0.40
MASTERED_PERCENT = 0.75

DRY_SWEEP_WORDS = {
    "ACCOUNTING",
    "ADVISER",
    "ANARCHIST",
    "APPARENTLY",
    "ARMISTICE",
    "ARISTOCRACY",
    "ATTORNEY",
    "BILATERAL",
    "CARTILAGE",
    "CENTRALLY",
    "CERTIFIED",
    "CHEATING",
    "COGNITIVE",
    "COMMENTATOR",
    "COMMERCIAL",
    "COMPENSATE",
    "CONDEMNING",
    "CONFEDERATE",
    "CONCLUSIVE",
    "CONSTRAINT",
    "CONSORTIUM",
    "CONSTITUENCY",
    "CONSTITUENT",
    "CONSTITUTE",
    "CONSULATE",
    "CONSULTING",
    "CONTINENTAL",
    "CONTINGENCY",
    "CONTRACTUAL",
    "CONNECTIVITY",
    "CONTROVERSY",
    "COUNTERFEIT",
    "COUNSELOR",
    "CORRELATED",
    "DERIVATIVE",
    "DEMOCRATIC",
    "DENTISTRY",
    "DIETARY",
    "DIRECTOR",
    "DIRECTORATE",
    "DISCONTENT",
    "DISRESPECT",
    "DOCTRINE",
    "DISTRIBUTE",
    "DISTRIBUTED",
    "EDUCATOR",
    "EDITORIAL",
    "ELECTRICIAN",
    "ESSENTIALLY",
    "EXISTENTIAL",
    "EXTERNALLY",
    "FORENSIC",
    "FRATERNITY",
    "GENERALLY",
    "HEADMASTER",
    "HEREDITARY",
    "IMPERATIVE",
    "IMPERIAL",
    "INDICATIVE",
    "INACCURATE",
    "INCOMPETENT",
    "INCORPORATE",
    "INDICATOR",
    "INSUFFICIENT",
    "INSPECTOR",
    "INSURED",
    "INTERFACE",
    "INTERNSHIP",
    "INTERNALLY",
    "IRRESPECTIVE",
    "IRRELEVANT",
    "INVESTOR",
    "LIBERTARIAN",
    "LEIGHTON",
    "MAGISTRATE",
    "MANAGERIAL",
    "MARKETING",
    "MEDIATOR",
    "MEANINGLESS",
    "MARGINALLY",
    "MATERIALLY",
    "NATIONALISM",
    "OBSTACLE",
    "OPERATIVE",
    "ORNAMENTAL",
    "PANCREATIC",
    "PATRONAGE",
    "PEDIATRIC",
    "PERSONNEL",
    "PERSPECTIVE",
    "POTENTIALLY",
    "PRACTITIONER",
    "PREPARATORY",
    "PREDICTIVE",
    "PRIVILEGED",
    "PROSPECTIVE",
    "PROTRACTED",
    "RECEPTIONIST",
    "REPEATEDLY",
    "RECRUITING",
    "REGULATED",
    "REGULATOR",
    "REPOSITORY",
    "RELIGION",
    "RESPECTIVE",
    "RESIDUAL",
    "RESIDENCY",
    "RESPONSIVE",
    "SECTARIAN",
    "SECONDLY",
    "SEMANTIC",
    "SHAREHOLDER",
    "SOCIETAL",
    "SPECIALIST",
    "SPECTRAL",
    "SPECTROSCOPY",
    "SUPERVISOR",
    "SURROGATE",
    "SYSTEMATIC",
    "TEMPORAL",
    "TERMINAL",
    "TERRITORIAL",
    "THERAPIST",
    "TRADEMARK",
    "TREASURY",
    "TESTIMONY",
    "UNCERTAINTY",
    "UNILATERAL",
    "UNPROTECTED",
    "UNRESTRICTED",
    "VETERINARY",
    "VISCERAL",
    "WAITRESS",
    "WHATSOEVER",
    "YOURSELVES",
}

SENSITIVE_SWEEP_WORDS = {
    "ADVERSELY",
    "BACTERIA",
    "BACTERIAL",
    "BATTLEFIELD",
    "BETRAYAL",
    "CONSENSUAL",
    "CONGENITAL",
    "CONTAGIOUS",
    "CRETACEOUS",
    "CRUSHING",
    "DEMONSTRATE",
    "DEPRESSING",
    "DISASTER",
    "DIVORCE",
    "DESTRUCTIVE",
    "DETRIMENTAL",
    "DEVASTATING",
    "ESPIONAGE",
    "FRIGHTENING",
    "HEARTLESS",
    "HYSTERIA",
    "INDIGENOUS",
    "MIGRAINE",
    "MISCONDUCT",
    "MORTGAGE",
    "NIGHTMARE",
    "OUTPATIENT",
    "OVERWATCH",
    "PANDEMIC",
    "PARASITE",
    "POINTLESS",
    "PREDATOR",
    "PREDATORY",
    "PREGNANT",
    "POSTERIOR",
    "RESPIRATORY",
    "SACRIFICING",
    "SOLDIER",
    "STEROID",
    "SUFFERING",
    "STRICKEN",
    "STRUGGLING",
    "TERMINATOR",
    "TERRIFYING",
    "THERAPY",
    "THREATENING",
    "TRAGEDY",
    "UNPLEASANT",
    "UNANSWERED",
    "UNFORTUNATE",
    "UNMARRIED",
    "UNSTABLE",
    "UNSETTLING",
    "UPSETTING",
    "VIGILANTE",
    "WASTEFUL",
}

GEOGRAPHIC_SWEEP_WORDS = {
    "NORTHEAST",
    "NORTHEASTERN",
    "NORTHWEST",
    "NORTHWESTERN",
    "SOUTHEASTERN",
    "SOUTHWESTERN",
}

ABSTRACT_SUFFIXES = (
    "ANCE",
    "ENCE",
    "ENCY",
    "ISM",
    "ITY",
    "MENT",
    "NESS",
    "SION",
    "TION",
)

HARD_SWEEP_WORDS = DRY_SWEEP_WORDS | SENSITIVE_SWEEP_WORDS | GEOGRAPHIC_SWEEP_WORDS

INFLECTION_SUFFIXES = (
    "ING",
    "ED",
    "ER",
    "ERS",
    "ES",
    "LY",
)


def core_score(word: str, sweeps: set[str]) -> int:
    base = 1 if len(word) == 4 else len(word)
    return base + (SWEEP_BONUS if word in sweeps else 0)


def threshold_words(entry: dict, percent: float) -> int:
    sweeps = set(entry["sweeps"])
    scores = sorted((core_score(word, sweeps) for word in entry["coreWords"]), reverse=True)
    target = int(entry["availableCoreScore"] * percent + 0.999999)
    total = 0
    for index, score in enumerate(scores, 1):
        total += score
        if total >= target:
            return index
    return len(scores)


def stem_family(word: str) -> str:
    for suffix in INFLECTION_SUFFIXES:
        if word.endswith(suffix) and len(word) > len(suffix) + 3:
            return word[: -len(suffix)]
    return word


def day_feel(entry: dict, mastered_words: int) -> str:
    key_length = len(entry["key"])
    if key_length == 1:
        base = "Open"
        if mastered_words >= 32:
            return f"{base} / Heavy"
        return base
    if key_length == 2:
        base = "Focused"
        if mastered_words >= 22:
            return f"{base} / Heavy"
        return base
    base = "Tight"
    if len(entry["coreWords"]) <= 15:
        return f"{base} / Lean"
    if mastered_words >= 15:
        return f"{base} / Heavy"
    return base


def hard_sweep_reasons(entry: dict) -> list[str]:
    reasons: list[str] = []
    for sweep in entry["sweeps"]:
        if sweep in HARD_SWEEP_WORDS:
            if sweep in DRY_SWEEP_WORDS:
                reasons.append(f"{sweep}: hard deny as dry/institutional prestige word")
            if sweep in SENSITIVE_SWEEP_WORDS:
                reasons.append(f"{sweep}: hard deny as sensitive or low-delight prestige word")
            if sweep in GEOGRAPHIC_SWEEP_WORDS:
                reasons.append(f"{sweep}: hard deny as geographic/adjectival prestige word")
        if sweep.endswith(ABSTRACT_SUFFIXES):
            reasons.append(f"{sweep}: hard deny as abstract suffix prestige word")
    return reasons


def sweep_reasons(entry: dict) -> list[str]:
    reasons = hard_sweep_reasons(entry)
    for sweep in entry["sweeps"]:
        if len(sweep) >= 12:
            reasons.append(f"{sweep}: long Sweep needs charm check")
    if len(entry["sweeps"]) == 2:
        reasons.append("two-Sweep day: decide whether both feel equally star-worthy")
    return reasons


def crowding_reasons(entry: dict) -> list[str]:
    families: dict[str, list[str]] = defaultdict(list)
    for word in entry["coreWords"]:
        families[stem_family(word)].append(word)
    crowded = sorted(
        (words for words in families.values() if len(words) >= 3),
        key=lambda words: (-len(words), words[0]),
    )
    return [f"crowded family: {', '.join(words[:5])}" for words in crowded[:2]]


def summarize_entry(entry: dict) -> dict:
    composed_words = threshold_words(entry, COMPOSED_PERCENT)
    poised_words = threshold_words(entry, POISED_PERCENT)
    mastered_words = threshold_words(entry, MASTERED_PERCENT)
    core_count = len(entry["coreWords"])
    bonus_count = len(entry["bonusWords"])
    bonus_ratio = bonus_count / max(1, core_count)
    reasons = []
    hard_reasons = hard_sweep_reasons(entry)

    reasons.extend(sweep_reasons(entry))

    if len(entry["key"]) == 1 and mastered_words >= 32:
        reasons.append(f"1-letter Mastered load: optimistic {mastered_words} core words plus Sweep")
    if len(entry["key"]) == 2 and mastered_words >= 22:
        reasons.append(f"2-letter Mastered load: optimistic {mastered_words} core words plus Sweep")
    if len(entry["key"]) == 3 and mastered_words >= 15:
        reasons.append(f"3-letter Mastered load: optimistic {mastered_words} core words plus Sweep")
    if bonus_ratio >= 2:
        reasons.append(f"bonus/core boundary: {bonus_count} bonus vs {core_count} core")
    if bonus_count >= 90:
        reasons.append(f"large bonus surface: {bonus_count} accepted bonus words")
    if core_count <= 15:
        reasons.append(f"lean core surface: {core_count} core words")
    if core_count >= 70:
        reasons.append(f"large core surface: {core_count} core words")
    reasons.extend(crowding_reasons(entry))

    priority = 0
    priority += 10 * len(hard_reasons)
    priority += 5 * (len(sweep_reasons(entry)) - len(hard_reasons))
    priority += 3 if "Heavy" in day_feel(entry, mastered_words) else 0
    priority += 2 if bonus_ratio >= 2 or bonus_count >= 90 else 0
    priority += 2 if core_count <= 15 or core_count >= 70 else 0
    priority += 1 if reasons else 0

    return {
        "date": entry["date"],
        "day": entry["dayIndex"] + 1,
        "center": entry["key"],
        "letters": "".join(entry["letters"]),
        "feel": day_feel(entry, mastered_words),
        "core": core_count,
        "bonus": bonus_count,
        "sweep_count": len(entry["sweeps"]),
        "score": entry["availableCoreScore"],
        "sweeps": ", ".join(entry["sweeps"]),
        "composed_words": composed_words,
        "poised_words": poised_words,
        "mastered_words": mastered_words,
        "reasons": reasons,
        "hard_reasons": hard_reasons,
        "priority": priority,
    }


def table(rows: list[dict], columns: list[tuple[str, str]]) -> list[str]:
    if not rows:
        return ["None."]
    lines = []
    lines.append("| " + " | ".join(label for label, _ in columns) + " |")
    lines.append("| " + " | ".join("---" for _ in columns) + " |")
    for row in rows:
        values = []
        for _, key in columns:
            value = row[key]
            if isinstance(value, list):
                value = "<br>".join(value)
            values.append(str(value).replace("|", "\\|"))
        lines.append("| " + " | ".join(values) + " |")
    return lines


def write_report(pack: dict, rows: list[dict]) -> str:
    by_center = Counter(len(entry["key"]) for entry in pack["entries"])
    priority_rows = sorted(
        [row for row in rows if row["priority"] > 0],
        key=lambda row: (-row["priority"], row["date"]),
    )
    hard_rows = [row for row in priority_rows if row["hard_reasons"]]
    sweep_rows = [
        row
        for row in priority_rows
        if any("prestige" in reason or "Sweep" in reason or "geographic" in reason for reason in row["reasons"])
        and not row["hard_reasons"]
    ]
    mastery_rows = sorted(rows, key=lambda row: (-row["mastered_words"], row["date"]))[:30]
    boundary_rows = sorted(
        [row for row in rows if any("bonus/core" in reason or "large bonus" in reason or "large core" in reason for reason in row["reasons"])],
        key=lambda row: (-row["bonus"], -row["core"], row["date"]),
    )[:30]
    two_sweep_rows = [row for row in rows if row["sweep_count"] == 2]
    opening_rows = rows[:30]

    lines = [
        "# Composed Editorial Review Queue",
        "",
        f"- Pack: {pack['startDate']} through {pack['endDate']} ({pack['days']} days)",
        f"- Center mix: 1-letter {by_center[1]}, 2-letter {by_center[2]}, 3-letter {by_center[3]}",
        f"- Review candidates: {len(priority_rows)} days with at least one taste-review flag",
        f"- Hard Sweep blockers: {len(hard_rows)}",
        f"- Sweep prompt rows: {len(sweep_rows)}",
        "- Resolved hard blocker classes: dry/institutional, clinical/sensitive, geographic/adjectival, and abstract suffix prestige Sweeps are denied at generation time.",
        "",
        "Use this queue with `docs/composed-editorial-review-guide.md`. These are editorial prompts, not automatic failures.",
        "",
        "## Priority A: Hard Sweep Blockers",
        "",
    ]
    lines.extend(
        table(
            hard_rows,
            [
                ("Date", "date"),
                ("Center", "center"),
                ("Letters", "letters"),
                ("Feel", "feel"),
                ("Sweeps", "sweeps"),
                ("Blocker", "hard_reasons"),
            ],
        )
    )
    lines.extend(
        [
            "",
            "## Priority B: Sweep Prestige Prompts",
            "",
            "These rows need human taste review, but are not automatic blockers.",
            "",
        ]
    )
    lines.extend(
        table(
            sweep_rows[:60],
            [
                ("Date", "date"),
                ("Center", "center"),
                ("Letters", "letters"),
                ("Feel", "feel"),
                ("Sweeps", "sweeps"),
                ("Review Prompt", "reasons"),
            ],
        )
    )
    lines.extend(
        [
            "",
            "## Two-Sweep Days",
            "",
            "Two-Sweep days are allowed when both prestige words feel satisfying.",
            "",
        ]
    )
    lines.extend(
        table(
            two_sweep_rows,
            [
                ("Date", "date"),
                ("Center", "center"),
                ("Letters", "letters"),
                ("Feel", "feel"),
                ("Core", "core"),
                ("Bonus", "bonus"),
                ("Sweeps", "sweeps"),
                ("Review Prompt", "reasons"),
            ],
        )
    )
    lines.extend(
        [
            "",
            "## Priority C: Five-Minute Mastery Load",
            "",
            "The word counts are optimistic lower bounds: they assume the player finds the highest-value core words first.",
            "",
        ]
    )
    lines.extend(
        table(
            mastery_rows,
            [
                ("Date", "date"),
                ("Center", "center"),
                ("Feel", "feel"),
                ("Core", "core"),
                ("Score", "score"),
                ("Poised Words", "poised_words"),
                ("Mastered Words", "mastered_words"),
                ("Sweeps", "sweeps"),
            ],
        )
    )
    lines.extend(["", "## Priority D: Core / Bonus Boundary", ""])
    lines.extend(
        table(
            boundary_rows,
            [
                ("Date", "date"),
                ("Center", "center"),
                ("Feel", "feel"),
                ("Core", "core"),
                ("Bonus", "bonus"),
                ("Sweeps", "sweeps"),
                ("Review Prompt", "reasons"),
            ],
        )
    )
    lines.extend(["", "## Opening 30-Day Run", ""])
    lines.extend(
        table(
            opening_rows,
            [
                ("Day", "day"),
                ("Date", "date"),
                ("Center", "center"),
                ("Letters", "letters"),
                ("Feel", "feel"),
                ("Core", "core"),
                ("Bonus", "bonus"),
                ("Sweeps", "sweeps"),
            ],
        )
    )
    return "\n".join(lines) + "\n"


def main() -> None:
    pack = json.loads(PACK_PATH.read_text())
    rows = [summarize_entry(entry) for entry in pack["entries"]]
    OUT_PATH.write_text(write_report(pack, rows))
    flagged = sum(1 for row in rows if row["priority"] > 0)
    hard_flagged = sum(1 for row in rows if row["hard_reasons"])
    sweep_flagged = sum(1 for row in rows if any("prestige" in reason or "Sweep" in reason for reason in row["reasons"]))
    print(f"Wrote {OUT_PATH.relative_to(BASE_DIR)}")
    print(
        f"Flagged {flagged} editorial review days; "
        f"{hard_flagged} hard Sweep blockers; {sweep_flagged} include Sweep review prompts."
    )


if __name__ == "__main__":
    main()
