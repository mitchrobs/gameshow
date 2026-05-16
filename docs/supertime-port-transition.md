# Gameshow to Supertime Port Transition

This document is the implementation handoff for moving Gameshow games into the
Supertime app while preserving game feel and making every result compatible with
stats, leaderboards, and challenges.

Scope is limited to standalone playable games. Support routes, editorial tools,
preview pages, and asset galleries are not part of this scoring inventory.

## Porting Principles

- Preserve the mechanic before preserving the screen. The Supertime UI can
  change layout, typography, animation, navigation, and share-copy treatment as
  long as the rules, completion condition, result meaning, and puzzle generation
  constraints stay intact.
- Every game should submit one canonical result event after a terminal outcome.
  Local progress may update often, but stats and challenges should consume only
  the terminal result event.
- Native metrics are the default. Guess-count games should rank on guesses,
  timed logic games should rank on solve time, point games should rank on
  points, and route-efficiency games should rank on moves or trades.
- Result summaries should be spoiler-safe enough for group threads until the
  viewer has completed the same pack.
- The scoring contract here is documentation only. Do not add runtime scoring
  code to Gameshow as part of this handoff.

## Result Event Contract

Supertime already has the right result-event shape for social stats and
challenge aggregation. Each ported game should produce:

```ts
type SupertimeGameResult = {
  result_summary: {
    score_text: string;
    did_win: boolean;
    [gameSpecificField: string]: unknown;
  };
  ranking_value_numeric: number | null;
  ranking_direction: 'lower' | 'higher';
};
```

Required conventions:

- `result_summary.did_win` is the source for completion quality and win-rate
  stats. It must be present for every terminal result.
- `result_summary.score_text` is the compact thread/share label. It should be
  stable, human-readable, and spoiler-light.
- `ranking_value_numeric` is the primary per-game leaderboard and challenge
  value. Use `null` only if the game cannot produce a fair ranking value.
- `ranking_direction` must be `"lower"` or `"higher"`. Avoid legacy aliases
  such as `"asc"` and `"desc"` for new ports.
- For losses, assign a ranking value that sorts worse than any valid win when
  the game has a bounded loss state.
- Keep optional presentation data in `result_summary`, not in the ranking value.
  Examples: visual grids, answer marks, bonus flags, theme names, and hint
  counts.

## Scoring Summary

| Game | Route | Canonical ranking | Direction | Loss handling |
| --- | --- | --- | --- | --- |
| Moji Mash | `/moji-mash` | Wrong guesses | lower | `max_wrong_guesses + 1` |
| Wordie | `/wordie` | Guesses used | lower | `max_guesses + 1` |
| Threadline | `/threadline` | Solved elapsed seconds | lower | No terminal loss today; incomplete results should not submit |
| Mini Crossword | `/mini-crossword` | Solved elapsed seconds | lower | No terminal loss today; incomplete results should not submit |
| Mini Sudoku | `/sudoku` | Solved elapsed seconds | lower | No terminal loss today; incomplete results should not submit |
| Dawn Cabinet | `/dawn-cabinet` | Solved elapsed seconds | lower | No terminal loss today; incomplete results should not submit |
| Bridges | `/bridges` | Solved elapsed seconds | lower | No terminal loss today; incomplete results should not submit |
| Whodunit | `/whodunit` | Penalized case time | lower | Wrong accusation sorts worse than any solved case |
| Ballpark | `/ballpark` | Composite daily score | higher | Failed rounds stay in the composite |
| Daily Mix | `/daily-mix` | Trivia points | higher | Score can be `0` |
| Daily Sports | `/daily-sports` | Trivia points | higher | Score can be `0` |
| Barter | `/barter` | Trades used | lower | `max_trades + 1` |

Support/editorial routes such as `/moji-mash-schedule` and preview galleries do
not submit game results.

## Game Inventory

### Moji Mash

- Source: `app/moji-mash.tsx`, `src/utils/mojiMashGame.ts`,
  `src/data/mojiMashPuzzles.ts`.
- Core mechanic to preserve: Guess the source words used to create the daily
  generated emoji image. Each correct word fills one slot. Incorrect guesses
  consume a limited miss budget.
- Completion: Win when all hidden source words are found. Lose when the wrong
  guess count reaches `MOJI_MASH_MAX_WRONG_GUESSES` (`3` today).
- Progress to persist: found words, wrong guesses, terminal state, date/pack
  identity, started/completed timestamps.
- Generation/content source: Date-pinned puzzle data with image assets and
  promoted generation metadata from `src/data/mojiMashPuzzles.ts` plus the
  generation/review workflow in `scripts/generate_moji.py`.
- UX that can change: Word-slot reveal timing, hint placement, image framing,
  miss-row styling, copy/share presentation, and keyboard/form layout.
- UX constraints to retain: Hint should remain a recovery aid after misses, not
  a default reveal. The image must remain inspectable enough to support visual
  reasoning.
- Result summary:
  - `score_text`: `"Perfect"`, `"{n} miss"`/`"{n} misses"`, or
    `"{found}/{total} found"` on loss.
  - Fields: `found_words`, `found_word_count`, `total_words`,
    `wrong_guesses`, `wrong_guess_count`, `max_wrong_guesses`,
    `hint_unlocked`, `elapsed_seconds`, `did_win`.
  - Ranking: wrong guesses for wins; `max_wrong_guesses + 1` for losses.
  - Direction: `"lower"`.

### Wordie

- Source: `app/wordie.tsx`, `src/data/wordiePuzzles.ts`,
  `src/data/wordieSchedule.json`, `src/data/wordieAllowedGuesses.json`.
- Core mechanic to preserve: Wordle-style deduction with 4, 5, or 6 letter
  answers, length-specific allowed guesses, and exact/present/absent feedback.
- Completion: Win when the guess equals the answer. Lose when the player uses
  all allowed guesses.
- Progress to persist: guess list, current guess if needed, terminal state,
  word length, max guesses, started/completed timestamps.
- Generation/content source: Gameshow Wordie schedule, candidate pools,
  blacklists, prior-word protection, allowed-guess banks, key dates, and
  editorial overrides.
- UX that can change: Keyboard animation, ghost-letter treatment, board spacing,
  validation copy, and share grid styling.
- UX constraints to retain: Feedback semantics must stay exact. Allowed-guess
  validation must remain length-specific. Variable word length and max guesses
  are gameplay, not polish.
- Result summary:
  - `score_text`: `"{guesses}/{max_guesses}"` on win, `"X/{max_guesses}"`
    on loss.
  - Fields: `guesses`, `max_guesses`, `word_length`, `did_win`,
    `hit_pattern`, `elapsed_seconds`.
  - Ranking: guesses used for wins; `max_guesses + 1` for losses.
  - Direction: `"lower"`.

### Threadline

- Source: `app/threadline.tsx`, `src/data/threadlinePuzzles.ts`,
  `src/data/threadlineShippedPack.ts`, `scripts/review_threadline_calendar.ts`.
- Core mechanic to preserve: Fill story blanks by tracing each missing word as
  a contiguous path through the letter grid. Words belong to hidden theme
  threads that become more legible as words are found.
- Completion: Win when all puzzle words are found. There is no current loss
  condition.
- Progress to persist: found word IDs, found paths if needed for replay,
  hint-used state, elapsed time, terminal state, date/pack identity.
- Generation/content source: Shipped authored pack and calendar review tooling.
  The current rotation is not enough by itself for long-term scheduling without
  either a larger bank or a real generator.
- UX that can change: Board gesture feel, theme reveal cards, timer visibility,
  completion modal, and share formatting.
- UX constraints to retain: Path tracing is the core action. Themes should
  reveal through play rather than being fully exposed at the start.
- Result summary:
  - `score_text`: `"Solved {m:ss}"` or `"{found}/{total}"` for local
    in-progress display only.
  - Fields: `found_count`, `word_count`, `thread_stats`, `hint_used`,
    `elapsed_seconds`, `difficulty`, `did_win`.
  - Ranking: elapsed seconds on solved results.
  - Direction: `"lower"`.

### Mini Crossword

- Source: `app/mini-crossword.tsx`, `src/data/miniCrosswordPuzzles.ts`,
  `src/data/miniCrosswordBank.json`,
  `src/data/miniCrosswordSchedule.generated.ts`,
  `scripts/build_mini_crossword_bank.py`,
  `scripts/build_mini_crossword_variants.py`.
- Core mechanic to preserve: Fill a compact crossword grid from across/down
  clues, with 5x5 daily puzzles and 7x7 mega variants. A bonus answer unlocks
  after the main grid is solved.
- Completion: Main puzzle is won when every open cell matches the solution.
  Bonus solve is extra result detail and should not block main completion.
- Progress to persist: letters by cell, active clue/cell if useful, hints used,
  checked wrong cells, bonus answer state, elapsed time, terminal state.
- Generation/content source: Generated 365-day schedule built from templates,
  curated clue/fill data, themes, cooldowns, quality scores, and calibration
  docs.
- UX that can change: Cell input implementation, clue list layout, keyboard
  avoidance, bonus reveal animation, and share-card design.
- UX constraints to retain: Clue/grid consistency, one-letter hint limit, and
  bonus answer as optional post-solve delight.
- Result summary:
  - `score_text`: `"Solved"` or `"Solved {m:ss}"`.
  - Fields: `filled_count`, `open_cell_count`, `difficulty`, `theme`,
    `hints_used`, `max_hints`, `bonus_solved`, `elapsed_seconds`, `did_win`.
  - Ranking: elapsed seconds on solved results.
  - Direction: `"lower"`.

### Mini Sudoku

- Source: `app/sudoku.tsx`, `src/data/sudokuPuzzles.ts`,
  `src/data/sudoku/pack.json`, `scripts/build_sudoku_pack.py`.
- Core mechanic to preserve: Solve a 6x6 or 9x9 Sudoku using fixed givens,
  valid row/column/box constraints, notes, and limited hints.
- Completion: Win when the grid is fully filled with no row, column, box, or
  solution conflicts.
- Progress to persist: grid, notes, selected cell if desired, hints used,
  revealed/marked hint cells, elapsed time, terminal state, date/pack identity.
- Generation/content source: A 365-day pack with difficulty totals, onboarding
  distribution, mask families, pattern gaps, and audit output.
- UX that can change: Number pad layout, notes toggle, conflict styling, hint
  affordance, and board scaling.
- UX constraints to retain: Givens cannot be edited. Notes are player-owned
  state. Hints remain limited (`3` today) and should not become an unlimited
  solver.
- Result summary:
  - `score_text`: `"Solved {m:ss}"` or `"Solved"`.
  - Fields: `filled_count`, `cell_count`, `difficulty`, `size`,
    `pattern_family`, `hints_used`, `max_hints`, `elapsed_seconds`, `did_win`.
  - Ranking: elapsed seconds on solved results.
  - Direction: `"lower"`.

### Dawn Cabinet

- Source: `app/dawn-cabinet.tsx`, `src/data/dawnCabinetPuzzles.ts`,
  `src/ui/dawnTileArt.tsx`, `docs/dawn-cabinet-design-guide.md`.
- Core mechanic to preserve: Place a finite Cabinet tile supply onto a rail
  board so every visible rail satisfies its set code, hidden rails satisfy the
  ledger, and reserve/bank goals are met exactly.
- Completion: Win when all cells are filled, all cell clues are obeyed, every
  rail is valid, the ledger is satisfied, and reserve goals are satisfied.
- Progress to persist: placed entry IDs by cell, selected difficulty, practice
  vs daily mode, first correct cells if retained for share trail, elapsed time,
  terminal state.
- Generation/content source: Date/difficulty seeded puzzles with Standard,
  Hard, and Expert daily levels, bounded Dawn tile rules, anti-fingerprint
  selection, solver constraints, and Dawn art asset pipeline.
- UX that can change: Cabinet tray layout, filter chips, rail-code presentation,
  tutorial surface, animations, and share-card design.
- UX constraints to retain: The Dawn tile is bounded, not a free wild. It must
  resolve only at the generated solution cell. Hidden rail ledger logic and
  reserve requirements are gameplay, not optional UI.
- Result summary:
  - `score_text`: `"Solved {mm:ss}"` or `"Cabinet complete"`.
  - Fields: `difficulty`, `rail_count`, `visible_rail_count`,
    `hidden_rail_count`, `elapsed_seconds`, `reserve_rule`, `dawn_tile_used`,
    `did_win`.
  - Ranking: elapsed seconds on solved daily results.
  - Direction: `"lower"`.

### Bridges

- Source: `app/bridges.tsx`, `src/data/bridgesPuzzles.ts`,
  `src/data/bridgesGenerator.ts`, `src/data/bridgesPack.generated.ts`,
  `scripts/build_bridges_pack.ts`.
- Core mechanic to preserve: Hashiwokakero-style island puzzle. Connect
  orthogonally visible islands with one or two bridges so required bridge
  counts are met, bridges do not cross, and the final graph is connected.
- Completion: Win when every island count is satisfied and the bridge graph is
  one connected component.
- Progress to persist: bridges by island-pair key, hints used, selected visual
  theme if product wants it, elapsed time, terminal state, date/pack identity.
- Generation/content source: Deterministic pack builder with difficulty,
  theme/family distribution, legal-neighbor constraints, uniqueness checks, and
  human-solver diagnostics.
- UX that can change: Island art, theme toggle, preview lines, board cropping,
  undo placement, and celebration copy.
- UX constraints to retain: Counts, non-crossing bridge geometry, legal visible
  neighbors, double-bridge cap, and connectivity are the rules. Themed boards
  are presentation only.
- Result summary:
  - `score_text`: `"Solved {m:ss}"`.
  - Fields: `satisfied_island_count`, `island_count`, `bridge_count`,
    `hints_used`, `difficulty`, `theme`, `elapsed_seconds`, `did_win`.
  - Ranking: elapsed seconds on solved results.
  - Direction: `"lower"`.

### Whodunit

- Source: `app/whodunit.tsx`, `src/data/whodunitPuzzles.ts`.
- Core mechanic to preserve: Daily deduction case. Players inspect suspects,
  reveal clues, optionally pursue one lead, eliminate suspects manually, and
  make one accusation.
- Completion: Win when the selected suspect matches `killerIndex`. Lose on a
  wrong accusation.
- Progress to persist: revealed clues, revealed order, lead choice, eliminated
  suspects, selected suspect, elapsed seconds, clue time penalties, terminal
  state, date/pack identity.
- Generation/content source: Procedural case generator from suspect, victim,
  setting, weapon, room, clue, and lead-choice pools. Before production, add
  stronger ambiguity/uniqueness validation.
- UX that can change: Case-file layout, suspect cards, lead-card animation,
  clue reveal ordering, and accusation modal.
- UX constraints to retain: Revealing locked clues adds a time penalty (`10`
  seconds today). There is one final accusation. Manual elimination is player
  reasoning support, not an automatic solver.
- Result summary:
  - `score_text`: `"Case Closed"` on win or `"Wrong Suspect"` on loss.
  - Fields: `elapsed_seconds`, `time_penalty_seconds`, `total_time_seconds`,
    `clues_used`, `total_clues`, `lead_choice_id`, `accused_suspect_index`,
    `did_win`.
  - Ranking: total penalized time for wins. Wrong accusations should sort
    worse than any solve, for example `86400 + total_time_seconds`.
  - Direction: `"lower"`.

### Ballpark

- Source: `app/ballpark.jsx`, `src/ballpark/daybreak-v1-data.mjs`.
- Core mechanic to preserve: Numeric estimation. For each prompt, the player
  has up to `MAX_GUESSES` (`4` today) to land within the win threshold. Normal
  mode uses `WIN_THRESHOLD` (`10%` today), and hard mode uses `5%`.
- Completion: The daily set ends after all required questions are resolved.
  Optional Friday extra inning adds one bonus result when played.
- Progress to persist: daily phase, question index, per-question history,
  hard-mode choice, required-round results, optional extra-inning result,
  current question state, date/content fingerprint.
- Generation/content source: Authored Daybreak v1 data set with theme, prompt,
  answer, difficulty score, scale band, fun fact, Friday extra inning, and
  content fingerprint.
- UX that can change: Keypad design, feedback labels, progress segments, hard
  mode toggle placement, reveal cards, and summary screen layout.
- UX constraints to retain: Directional feedback must preserve scale reasoning.
  The target is "close enough," not exact answer entry. Extra inning should
  remain optional.
- Result summary:
  - `score_text`: `"{wins}/{total}"`.
  - Fields: `wins`, `round_count`, `extra_inning_played`,
    `extra_inning_won`, `total_guesses`, `hard_mode`, `best_pct_off_by_round`,
    `answer_marks`, `did_win`.
  - Ranking: higher composite score. Recommended v1 formula:
    `wins * 1000 - total_guesses`, adding extra-inning win into `wins` when
    played. This preserves the product priority: more solved rounds beats fewer
    guesses.
  - Direction: `"higher"`.

### Daily Mix

- Source: `app/daily-mix.tsx`, `src/ui/trivia/TriviaGameScreen.tsx`,
  `src/data/trivia/mixRuntime.ts`, `src/data/trivia/results.ts`,
  `src/data/trivia/gameplay.ts`, `src/data/trivia/types.ts`.
- Core mechanic to preserve: Timed multiple-choice trivia episode with Easy and
  Hard variants, speed bonus, one shield mechanic, rationales, and result
  marks.
- Completion: Episode completes when every question is answered or timed out.
- Progress to persist: selected difficulty, active question index, answer
  records, shield availability and use count, timer state if resumable,
  terminal result, date/feed/version.
- Generation/content source: Trivia question libraries and episode schedules
  with freshness, source, lookup-risk, entity cooldown, calibration, and audit
  metadata.
- UX that can change: Start screen, transition/reveal timing, answer card
  styling, shield controls, rationale layout, and share-card design.
- UX constraints to retain: Speed bonus and shield scoring are mechanics.
  Current scoring is `100` base points plus up to `50` speed bonus for a correct
  answer, or `50` shield points when the shield saves a miss.
- Result summary:
  - `score_text`: `"{correct}/{total} - {score} pts"`.
  - Fields: `feed`, `difficulty`, `score`, `correct_count`,
    `total_questions`, `shield_used`, `clean_run`, `answer_marks`,
    `timer_seconds`, `elapsed_seconds`, `did_win`.
  - Ranking: total points.
  - Direction: `"higher"`.

### Daily Sports

- Source: `app/daily-sports.tsx`, `src/ui/trivia/TriviaGameScreen.tsx`,
  `src/data/trivia/sportsRuntime.ts`, `src/data/trivia/results.ts`,
  `src/data/trivia/gameplay.ts`, `src/data/trivia/types.ts`.
- Core mechanic to preserve: Same trivia engine as Daily Mix, using sports
  content, sports-specific schedules, and the feed's episode shape.
- Completion: Episode completes when every question is answered or timed out.
- Progress to persist: same as Daily Mix, plus sports feed identity.
- Generation/content source: Sports curated sources, sports question library,
  sports schedules, freshness/lookup-risk validation, calibration, and audit
  metadata.
- UX that can change: Feed branding, intro copy, cards, transitions, and share
  presentation.
- UX constraints to retain: This should share the trivia engine with Daily Mix.
  Do not fork scoring behavior unless product explicitly decides the feeds need
  different rules.
- Result summary:
  - `score_text`: `"{correct}/{total} - {score} pts"`.
  - Fields: `feed`, `difficulty`, `score`, `correct_count`,
    `total_questions`, `shield_used`, `clean_run`, `answer_marks`,
    `timer_seconds`, `elapsed_seconds`, `did_win`.
  - Ranking: total points.
  - Direction: `"higher"`.

### Barter

- Source: `app/barter.tsx`, `src/data/barterPuzzles.ts`,
  `src/data/barter/*`, `scripts/build_barter_precomputed.ts`,
  `scripts/check-barter.ts`, `scripts/inspect_barter.ts`.
- Core mechanic to preserve: Market-route optimization. Players spend a finite
  sequence of day and night trades to transform starting inventory into the goal
  good by par or before max trades.
- Completion: Win when inventory satisfies the goal. Lose when the player hits
  `maxTrades` without the goal.
- Progress to persist: inventory, trade history, game state, elapsed seconds,
  night-window state, selected/active UI state if useful, date/pack identity.
- Generation/content source: Topology templates, market skins, quality targets,
  route enumeration, par validation, regret pressure, hidden-vendor usage, and
  precomputed daily puzzles.
- UX that can change: Market flavor, vendor cards, inventory layout, day/night
  reveal treatment, affordance highlighting, and result modal.
- UX constraints to retain: Early vs late trade windows are gameplay. Par,
  max trades, hidden vendor usage, route quality, and opening-regret pressure
  must survive the port.
- Result summary:
  - `score_text`: `"{trades_used}/{par}"` on win or `"X/{max_trades}"` on
    loss.
  - Fields: `trades_used`, `par`, `max_trades`, `result_tier`,
    `goal_good`, `goal_qty`, `market_name`, `difficulty`, `elapsed_seconds`,
    `route_trade_keys`, `did_win`.
  - Ranking: trades used for wins; `max_trades + 1` for losses.
  - Direction: `"lower"`.

## Implementation Checklist For Each Port

1. Define the Supertime `game_id`, title, category, status, rules version,
   metric label, and ranking direction before UI work.
2. Port or wrap the Gameshow generator/content source into Supertime pack
   generation so clients consume Supertime packs, not Gameshow runtime data.
3. Add typed pack payload, typed progress payload, result summary builder, and
   engine tests.
4. Confirm every terminal path submits `did_win`, `score_text`,
   `ranking_value_numeric`, and `ranking_direction`.
5. Add group-thread, stats, leaderboard, and challenge fixtures for at least one
   win and one loss if the game has a loss condition.
6. Preserve share/result copy as a UX layer over the result summary rather than
   the source of truth for scoring.

## Verification Notes

- This document was checked against the current route inventory in
  `app/index.tsx`.
- The result event shape matches the existing Supertime backend fields:
  `result_summary`, `ranking_value_numeric`, `ranking_direction`, and `did_win`.
- No runtime code, build output, generated packs, or scoring helpers are changed
  by this handoff.
