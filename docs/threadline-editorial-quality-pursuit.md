# Threadline Editorial Quality Pursuit

Threadline should feel authored before it feels generated. This pass turns that expectation into a repeatable production loop for the full shipped schedule.

## Breakthrough Standard

- Titles are specific, natural, and nonspoiling.
- Filled leads read aloud as ordinary human sentences.
- Answers occupy believable grammatical slots: object, person, signal, verb, motion, place, or detail.
- Final weaves are concise, concrete aha lines that connect the two theme worlds.
- Difficulty comes from word/grid texture, not from awkward grammar.
- Schedule review keeps checking the weakest rows until the floor feels good, not just valid.

## Implemented Gates

- Banned puzzle-meta lead language, colon-style title frames, abstract suffix titles, and repeated generated scaffolds.
- Banned mechanical final-line bridges such as answer adjacency, "start with/listen for" copy, and abstract phrases like "has a voice."
- Added role-aware private answer metadata so motion pools prefer usable bare verbs and avoid gerunds/adjectives in verb slots.
- Added title/payoff cooldowns, payoff uniqueness reporting, lead-structure repetition reporting, and lowest-copy-score review rows.
- Added calibration rows in the shipped-pack report so known taste examples stay visible.

## Ongoing Review Loop

1. Run `npm run threadline:review -- --write=docs/threadline-365-review.md`.
2. Start with `Lowest Copy Scores`, then inspect random dates from each season and difficulty band.
3. Rewrite weak title/lead/weave patterns or prune/role-tag words that force bad prose.
4. Tighten the audit whenever a weak example passes.
5. Repeat until samples from any date range sound natural aloud.

## Next Tightening Pass

The current gates prove structural validity, but the next pass should focus on rows that are valid yet still sound drafted. Use `Voice Floor Watchlist` in the QA report as the queue.

| Order | Batch | Current scope | Rewrite move | Proof required | Gate promotion |
| ---: | --- | --- | --- | --- | --- |
| 1 | Weave subject rewrite | Answer-as-subject weaves | Replace answer-led reveals with theme-level lines that name the shared human situation. | Watchlist count drops by domain; random samples no longer sound like a selected answer is doing the whole reveal. | Promote to a critical gate after each high-volume domain has a replacement weave family. |
| 2 | Lead point-of-view rewrite | Static list-location leads | Give each lead a human vantage point, small action, or sensory turn instead of parking two lists in places. | Filled leads read aloud without list-plus-preposition rhythm across a sampled week from each quarter. | Lower the lead-structure repeat ceiling once the top signatures are replaced. |
| 3 | Utility phrase removal | "Nearby ... wait," "then someone can," and "is ready to" leads | Rewrite procedural phrasing into domain-specific sentences. | The phrase counters trend toward zero without introducing worse grammatical slots. | Move each phrase into banned lead copy after two replacement patterns pass review. |
| 4 | Taste calibration read | Opening month, holiday-adjacent days, expansion domains, and final month | Read title, filled lead, and weave as a player, then record before/after notes for weak rows. | Gold-set examples include at least one improved row from each sampled window. | Require every approval note to reference the actual voice choice, not just a cleared audit. |
| 5 | Gate promotion | Every solved watchlist pattern | Convert repeatedly rejected language from watchlist to hard audit checks only after the replacement is stable. | Threadline tests fail on the old pattern and pass on the rewritten schedule. | No "audit green but taste weak" pattern remains untracked. |

### Batch Method

- Work by domain, not by isolated date, so one improved sentence family repairs a cluster.
- Keep three before/after examples per batch in the QA report until the new voice is stable.
- Do not promote a watchlist item to a hard gate until the generator can produce a better alternative at scale.
- After each batch, run the review command and compare the watchlist counts; the next batch is the largest remaining count unless a sampled row exposes a worse taste failure.

## Human Read-Aloud Checks

- Does the title sound like a person named the puzzle?
- Does the filled lead sound like something someone might actually say?
- Does every answer have a plausible job in the sentence?
- Does the weave connect the two themes rather than merely naming two answers?
- Is the weave short enough to feel like a reveal, not an explanation?
- Would a random week feel intentionally written rather than mechanically varied?
