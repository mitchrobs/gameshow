"""Shared word-safety helpers for generated word-game guess banks."""

from __future__ import annotations

from pathlib import Path

SEVERE_GUESS_BLACKLIST_CATEGORIES = {"slurs_profanity"}

SEVERE_GUESS_BLACKLIST_WORDS = {
    "ANAL",
    "BITCHING",
    "DOGGING",
    "INTERCOURSE",
    "LYNCH",
    "PENIS",
    "PISSING",
    "POOPING",
    "PROSTITUTE",
    "RAPE",
    "RAPED",
    "RAPEE",
    "RAPER",
    "RAPERS",
    "RAPES",
    "RAPEY",
    "SCREWING",
    "SUICIDE",
}


def read_blacklist_dir(blacklist_dir: Path) -> dict[str, set[str]]:
    blacklists: dict[str, set[str]] = {}
    for path in sorted(blacklist_dir.glob("*.txt")):
        words: set[str] = set()
        for raw_line in path.read_text().splitlines():
            word = raw_line.split("#", 1)[0].strip().upper()
            if word:
                words.add(word)
        blacklists[path.stem] = words
    return blacklists


def severe_guess_blacklist(blacklists: dict[str, set[str]]) -> set[str]:
    words: set[str] = set(SEVERE_GUESS_BLACKLIST_WORDS)
    for name in SEVERE_GUESS_BLACKLIST_CATEGORIES:
        words.update(blacklists.get(name, set()))
    return words
