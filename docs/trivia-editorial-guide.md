# Daily Trivia Editorial Guide

The first-principles reference for building great `Daily Mix` and `Daily Sports` episodes in Daybreak.

This guide is the source of truth for the static-first trivia overhaul in the `gameshow` repo. It translates the approved product plan, the deep research report, and the repo's strongest editorial patterns into machine-usable shipping rules.

## Source Hierarchy

Trivia quality rules should be applied in this order:

1. The user-approved Daily Trivia overhaul plan in this thread.
2. `/Users/mitchellmacmini/Downloads/deep-research-report.md`.
3. Existing repo editorial patterns, especially:
   - `docs/moji-mash-style-guide.md`
   - `src/data/museumArtworks.ts`
   - `src/data/wordiePuzzles.ts`

If two sources conflict, prefer the higher item in the list.

## Product Shape

Daily Trivia ships as two first-class feeds:

- `Daily Mix`
- `Daily Sports`

The daily flow is:

1. Choose feed.
2. Play the daily episode.
3. See an answer reveal after every question.
4. Finish with a Daybreak-style sharecode and answer review.

## Episode Rules

### Mix

- `12` questions per episode
- `12s` timer
- Hidden difficulty cadence:
  - Q1-Q4 approachable
  - Q5-Q8 medium climb
  - Q9 transition beat
  - Q10-Q12 hard finish

### Sports

- `9` questions per episode
- `12s` timer
- Hidden difficulty cadence:
  - Q1-Q3 approachable
  - Q4-Q6 medium climb
  - Q7-Q9 hard finish

### Shared gameplay rules

- Every question uses exactly `3` answer choices.
- A miss or timeout never ends the run.
- Each feed grants one daily `Shield`.
- The timer is shown, but not mode-labeled. Daily Trivia has one standard pace.
- Shield use must:
  - keep the run moving
  - mark the result row as `🟦`
  - disqualify clean-run status
- Sharecode row symbols are:
  - `🟩` correct
  - `🟦` shielded save
  - `🟨` wrong answer
  - `⬛` timeout
- Each feed should land three fair trick questions per month.
  - A trick question is a curveball with a satisfying reveal, not a dirty gotcha.
  - It should still have one clearly defensible answer.
  - Partial edge months may land fewer because the shipped schedule begins on `2026-04-26` and ends on `2027-04-25`, but they should still land at least one fair curveball if enough days remain.

## Question First Principles

A Daybreak trivia question should feel:

- teachable
- crisp
- fair
- light on its feet
- explainable after reveal

Every shipped question must satisfy all of the following:

- The prompt has exactly one clearly defensible answer.
- The correct answer is interesting enough to support a reveal explanation.
- The wrong answers are plausible enough to create tension, but not misleading in a dirty way.
- The wording is fast to parse on a timer.
- The item fits the feed and the daily mix around it.

Questions that fail any of these should not ship.

## What Makes A Good Question

Good questions:

- reward recognition or reasoning, not rote obscurity
- create a satisfying “oh right” reveal
- teach one clear fact or distinction
- sound natural when read aloud
- avoid feeling like a database export

Bad questions:

- depend on gotcha phrasing
- hinge on trivial wording traps
- rely on a barely remembered number without context
- require four separate leaps before the player even knows what is being asked
- feel grim, joyless, or needlessly combative

## Distractor Rules

Every distractor must be:

- plausible
- distinct
- wrong for a specific reason
- similar in reading load to the correct answer

Avoid distractors that are:

- joke answers
- obviously shorter or longer than the correct answer
- unrelated to the domain of the prompt
- near-duplicates of each other
- “all of the above”, “none of the above”, or exception-test gimmicks

If a distractor only works because it is silly or structurally obvious, rewrite the question.

## Tone And Voice

Daybreak trivia should sound:

- confident
- warm
- brisk
- editorial

Daybreak trivia should not sound:

- snarky
- smug
- over-written
- like a pub quiz hosted by a cynic
- like a raw trivia dataset

The reveal explanation should be one or two crisp sentences, not a lecture.

## Things To Reject

Reject or flag questions that are:

- too easy
- too lookupable
- too stale
- too US-centric without context
- too dark
- too niche for the slot
- structurally ambiguous

Always reject:

- `All of these` or `None of these`
- family, spouse, child, parent, sibling, or dating trivia
- bare height, middle-name, or birth-year trivia unless the reveal is genuinely iconic
- clue stems that read like broken archive snippets instead of Daybreak copy
- legacy pop-culture deep cuts with weak reveal value
- sports-adjacent miscellany where sport is only incidental

### Too easy

Reject if the question can be solved almost instantly by any casual player without real choice pressure.

Signals:

- one answer is obviously the only famous option
- the correct answer is a giveaway phrase in the stem
- the distractors are weak or unrelated

### Too lookupable

Reject or downgrade if the prompt is essentially:

- a naked date lookup
- a box-score lookup
- a stat lookup with no framing
- a pure jersey-number fact
- an acronym recall test with no context

Lookup-risk should be tagged as:

- `low`
- `medium`
- `high`

High-risk items belong late, sparse, or in reserve pools only.

### Too stale

Reject if the question depends on phrasing like:

- currently
- today
- recently
- this year
- last season
- now

unless the item is explicitly date-pinned and has freshness metadata plus swap coverage.

### US-centric default for phase one

Phase one may lean US-centric in content mix, answer familiarity, and sports framing.

Still avoid:

- accidental ambiguity where “football” or similar terms could mean something else
- claims of universal obviousness when the item is really US-default

Regional pools can come later. For now, clarity matters more than neutrality.

### Too dark

Default Daybreak tone should avoid:

- gore
- sexual violence
- cruelty as punchline
- disaster as cheap spectacle

Historical conflict can appear, but not with a sensational or joyless feel.

### Too niche

Reject if the player must already be deep inside a fandom, roster, or subculture unless the slot is intentionally a hard finish question and the reveal still teaches something worthwhile.

## Portfolio Quotas

### Daily Mix

Target rolling share across the schedule:

- `70% evergreen`
- `20% topical/trendy`
- `10% experimental`

Mix should balance:

- domains
- geographies
- eras
- media types
- surprise types

Mix should not become:

- all entertainment
- all history dates
- all science factoids
- sports by another name

### Daily Sports

Target rolling share across the schedule:

- `60% evergreen`
- `25% current-season`
- `15% event-driven`

Sports should balance:

- leagues
- sports
- eras
- genders
- event types
- player/team/history distribution

Sports should not collapse into:

- men’s US team sports only
- standings trivia only
- ring-count trivia only
- roster-deep-cut trivia every day
- film, TV, or book tie-ins where sport is incidental
- legal, political, military, or historical detours that only brush sports indirectly
- mascot, sponsor, or favorite-team fluff
- European-club or archival-soccer trivia as a schedule backbone in phase one
- Olympics miscellany that depends on obscure venues, medal art, or narrow historical firsts

### Sports launch backbone

For phase one, `Daily Sports` should feel core-heavy:

- NFL, NBA, MLB, NHL, golf, tennis, and mainstream Olympic recognition items should anchor the feed.
- Soccer, motorsport, combat, and Olympics should appear as rotation flavors, not as the main backbone.
- `general-sports` should behave like a reserve bucket, not a personality substitute for real sports coverage.

## Difficulty Targets

The schedule should encode a hidden ladder, not visible acts.

### Mix

- Q1-Q4 should feel inviting
- Q5-Q8 should feel like the climb
- Q9 should feel like the handoff
- Q10-Q12 should feel like the final stretch

### Sports

- Q1-Q3 should feel inviting
- Q4-Q6 should feel like the climb
- Q7-Q9 should feel like the final stretch

Per-slot targets should be stored in episode metadata and validated during assembly.

## Metadata Requirements

Every question record must include:

- `id`
- `feed`
- `stem`
- `options`
- `answerIndex`
- `rationaleShort`
- `rationaleLong`
- `citations`
- `domain`
- `subdomain`
- `entities`
- `difficultyTarget`
- `lookupRisk`
- `freshUntil`
- `status`
- `schemaVersion`
- `promptKind`
- `salienceScore`
- `obscurityFlags`
- `sourceTier`
- `sourceLabel`
- `anchorSubdomain`
- `curveballKind`
- `legacyFamily`

Optional but encouraged:

- `variantGroup`
- `editorialBucket`
- `themeTags`

## Freshness Rules

- Evergreen facts need at least one authoritative or near-primary source.
- Current, statistical, or time-sensitive facts need two confirming sources when available, including one primary source.
- Every question needs a `freshUntil` date.
- Any question scheduled after its `freshUntil` date is invalid.
- Topical or current-season slots must have swap coverage.

## Correction Rules

If a live question is flawed:

- drop it from scoring and renormalize, or
- accept multiple answers if warranted, or
- replace it with a reserve item if the affected locale has not started, and
- log a correction note in the audit trail

## AI Editorial Pipeline

The trivia system is AI-driven, but it must still behave like an editorial operation.

Required pipeline:

1. `Research agent`
2. `Writing agent`
3. `Distractor agent`
4. `Fact-check agent`
5. `Fairness/style agent`
6. `Scheduler agent`
7. `Player agents`

The publish gate is AI-only after calibration. The first `28` days of `Mix` and the first `28` days of `Sports` are the calibration window used to tune the generator, not a required manual signoff checkpoint.

Player agents should include multiple archetypes, including:

- a casual commuter
- a streak hunter
- a culture-first player
- a US-centric sports regular
- an analytical player
- a balanced broad-interest fan

Their job is to play the calibration window, surface timer friction, reveal weak distractors, and flag days that feel too flat, too sharp, or too dirty.

The audit layer should also emit:

- an opening `90`-day cohort report
- a full-year cohort report
- slot-level friction summaries
- top repeated groups
- monthly curveball coverage
- a final `launchReady` boolean

## Calibration Rules

Before trusting the year pack:

- generate `28` days of Mix
- generate `28` days of Sports
- review cadence
- review sharecode feel
- review distractor fairness
- review reveal quality
- tune heuristics, quotas, and lints

Calibration targets:

- early questions should not feel free
- hard-finish questions should feel memorable, not random
- reveal text should feel worth reading
- the feed should feel varied over a week, not interchangeable day to day
- the monthly trick-question cadence should feel delightful, not punitive

## Machine-Usable Checklist

The codebase must implement validators or lint rules for:

- duplicate stems
- repeated variant groups in the scheduled year
- invalid option counts
- invalid answer indices
- stale relative phrasing
- expired freshness dates
- weak or gimmick distractor patterns
- answer-position drift
- quota drift
- entity cooldown violations
- missing citations
- missing rationales

If a rule lives only in prose and not in code, the implementation is incomplete.
