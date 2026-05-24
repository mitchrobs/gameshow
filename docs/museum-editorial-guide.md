# Museum Editorial Guide

The reference guide for building and approving the annual Museum pack in Daybreak.

This guide exists alongside the repo-tracked editorial bank and quality tracker. The bank is the canonical workflow state. The tracker is the human-readable summary. The runtime curated file is the approved-only export.

## Product Shape

Museum ships as a daily annual pack:

- `365` consecutive days
- `365` unique artworks inside the active pack
- no repeated artwork ids in the annual run
- one artwork per day
- three quiz questions per artwork:
  - `observation`
  - `context`
  - `connection`

## Workflow

Every Museum record moves through this fixed sequence:

1. `sourced`
2. `drafted`
3. `fact-checked`
4. `copy-edited`
5. `approved`

Only `approved` records can ship into:

- `/Users/mitchellmacmini/Documents/Documents - Mitchell’s Mac mini/New project/gameshow/src/data/museum/curatedArtworks.json`
- `/Users/mitchellmacmini/Documents/Documents - Mitchell’s Mac mini/New project/gameshow/src/data/museum/schedule.json`

## Copy Scope

Museum editorial review covers all player-facing language, not only the notes:

- reveal and placard details
- technique note
- surprising fact
- connection note
- quiz prompts
- answer options
- reinforcements
- result copy
- passport labels
- share text
- CTA naming

## Quiz Rules

Every approved artwork must satisfy all of the following:

- exactly `3` questions
- exactly `1` question of each kind
- exactly `4` unique options per question
- exactly `1` unambiguous correct answer per question
- observation question stays tied to what the player can see or what the artwork plainly foregrounds
- context question maps to one explicit note shown in the session
- connection question reinforces period, movement, region, or collecting thread without requiring outside expertise
- distractors are plausible and same-family
- reinforcements explain the right answer crisply

## Fact-Check Rules

- every approved record must keep at least one object-level source URL
- surprising facts must be supportable from the source metadata or institution page
- approximate dates, anonymous attributions, and medium/process notes must be framed honestly
- if a source lacks stable image delivery or reliable verification, the record can stay in the editorial bank as `sourced`, but it cannot ship

## Scheduling Rules

The annual schedule must enforce:

- `365` explicit dates
- `365` unique artwork ids
- no date gaps
- same-artist cooldown of `7` days
- no more than `2` consecutive works from the same period key
- no more than `2` consecutive works from the same medium category
- monthly Europe share at or below `40%`

## Source Notes

The pipeline supports these source ids:

- `met`
- `aic`
- `rijks`
- `nga`
- `smithsonian`
- `ycba`

Not every source will always be runtime-ready on every build. The editorial bank is allowed to contain `sourced` records with blockers. The runtime export is not.
