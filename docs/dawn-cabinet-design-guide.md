# Dawn Cabinet Design Guide

This is the canonical handoff guide for Dawn Cabinet. It is meant for future
engineers, AI agents, and design tools that need to improve the game without
accidentally flattening the mechanics or breaking the UX decisions that make it
work.

## Short Description

Dawn Cabinet is a Mahjong-inspired daily logic puzzle. Players place a finite
set of Cabinet tiles onto a compact rail board so every rail resolves into a
valid set, hidden rail counts balance against the ledger, and the required
reserve tiles are left over.

The game is not Mahjong and should not be described as playing like Mahjong. It
borrows Mahjong's tile vocabulary and set-recognition pleasure, then turns that
grammar into a deterministic spatial deduction puzzle.

## Product Positioning

### Audience

- Logic-puzzle players who enjoy Sudoku, Kakuro, cross-sums, and constraint
  satisfaction.
- Mahjong-aware players who enjoy recognizing suited tiles, ranks, pairs,
  sequences, and repeated copies.
- Daily-game players who want a compact puzzle with a strong share result and
  escalating difficulty.

### Promise

Use Mahjong-flavored tile patterns to solve a rail cabinet. The appeal is not
hand management, discards, table reading, yaku/fan scoring, or probability. The
appeal is proving where every tile must go.

Good positioning language:

> A Mahjong-flavored tile logic puzzle. Place tiles so every rail resolves into
> a valid set.

Avoid:

- "It plays like Mahjong."
- "Mahjong solitaire."
- "A Mahjong variant."
- Any claim that rails are a Mahjong mechanic. Rails are Dawn Cabinet's puzzle
  invention.

## Core Terms

- **Cabinet**: The player-facing tile supply. Do not call this the Bank in UI.
  Internal names may still use `bank` for compatibility.
- **Cabinet tile**: A tile available to place into blank board cells.
- **Rail**: A visible board connection between two or three cells. Every rail is
  a set constraint.
- **Visible rail**: A rail whose set type is shown on the board with a code.
- **Hidden rail**: A rail shown as `?`. It must become one of the ledgered set
  types, but the board should not reveal which type early.
- **Ledger**: Counts of hidden rail set types that must be satisfied exactly.
- **Reserve**: Required leftover Cabinet tiles after the board is complete.
- **Dawn tile**: A special bounded wild tile used on daily difficulties. It has
  visible candidate values, but resolves only at its generator-chosen solution
  cell.
- **Easy Demo**: Tutorial/practice mode. It is not a daily difficulty.
- **Daily levels**: Standard, Hard, and Expert.

## Tile System

Dawn Cabinet uses modern Mahjong-inspired numbered suits.

- Tiles have a `suit` and `rank`.
- There are 14 rotating suit families:
  - bamboo, dots, characters, coins, lotus, jade, clouds, stars, waves, knots,
    moons, suns, lanterns, sparks.
- Daily puzzles use a subset of the 14 suits:
  - Standard uses fewer suits than Hard and Expert.
  - Expert uses the broadest suit variety.
- The suit labels such as `BAM`, `CHR`, `SUN`, and `DOT` are suit identifiers,
  not rules.
- Every suit should have a distinct Daybreak/Mahjong-flavored icon mark. Avoid
  falling back to generic first-letter circles for newer suits.
- Tile faces must reserve separate visual lanes for rank, suit icon, suit
  label, and copy pips. The icon should shrink before rank, label, or pips are
  clipped.
- Copy pips on Cabinet tiles show how many identical Cabinet tiles remain.
- The Cabinet supply is finite. Every placed tile comes from this supply.
- Standard, Hard, and Expert include exactly one Dawn tile. Easy Demo does not.

## Dawn Tile Rules

The Dawn tile is Dawn Cabinet's flower/season-inspired special tile. It adds
freshness and allocation tension without becoming an unbounded wild card.

- Standard and Hard each have one Dawn tile with three visible candidate values.
- Expert has one Dawn tile with four visible candidate values.
- The Dawn tile is placed from the Cabinet like any other Cabinet tile.
- The Dawn tile cannot be left as reserve.
- The concrete solution still has an ordinary tile at the Dawn cell.
- The Dawn tile resolves to that concrete solution tile only at its
  generator-chosen `solutionCell`.
- Candidate values are visible so the puzzle remains deductive rather than
  guessy.
- The resolved Dawn value should be revealed only after the puzzle is solved.
- Dawn art uses 20 seeded Mahjong Bonus Panel asset variants. The target source
  is `gpt-image-2` generated PNGs reviewed as complete style sets, with
  deterministic local PNGs kept only as fallback/review placeholders. Dawn marks
  must remain cosmetic only and must not imply solution, candidate value,
  difficulty, or reserve status.
- The current art pipeline is asset-backed:
  - Accepted shipped PNGs live in `assets/dawn-cabinet/dawn-tiles/`.
  - The prompt manifest lives at
    `assets/dawn-cabinet/dawn-tiles/dawn-tile-prompts.json`.
  - `DawnTileMark` renders the accepted PNG first, then automatically falls
    back to the code-native vector mark if an image asset fails to load.
  - `scripts/build_dawn_tile_assets.py` creates deterministic local review
    assets when no external image-generation key or artist exports are present.
  - `scripts/generate_dawn_tile_art.py` prepares the `gpt-image-2` prompt
    matrix, writes raw candidates to `tmp/dawn-cabinet/dawn-art-review/`, and
    accepts one approved style set into the shipped asset folder.
  - `scripts/extract_dawn_tile_contact_sheet.py` extracts 20 reviewed tile
    panels from a generated contact sheet, strips the generated paper/frame
    background, and maps the mark-only PNGs back to the seeded Dawn filenames.
  - `scripts/dawn_tile_art_contact_sheet.ts` previews every asset at filter
    chip, compact-board, and Cabinet detail sizes. It can target either the
    shipped folder or a generated review direction folder.
  - `src/ui/dawnTileArt.tsx` renders assets with `Image` and keeps the older
    SVG renderer only as a lightweight fallback.
- Avoid visual overlap with numbered suits. Do not use bamboo bars, dot targets,
  character blocks, coin rings, lotus diamonds, jade-window marks, clouds, star
  pluses, wave bands, knots, moon crescents, sun crosses, lantern forms, or spark
  diamonds as Dawn marks. Use the contact sheet at all three gameplay sizes
  before accepting any future Dawn art pass.
- Dawn candidate values should be shown with the game's normal visual language:
  rank plus suit icon. Avoid compact letter-only codes like `8D` or `5S` in
  player-facing Dawn candidate displays.
- The Dawn tile face itself should show only the day's Dawn mark. Do not print
  candidate values, suit icons, or extra explanation on the tile face; those
  belong beside the tile in the filtered Cabinet detail card.
- The `Dawn` label belongs below the mark, in the same identity lane as normal
  tile suit labels.
- The Dawn filtered Cabinet card copy should stay short and product-native:
  `Today's Dawn Tile`, `Can be used as any of these tiles:`, candidate chips,
  then `Must be placed on the board.`
- When Cabinet filters are shown, the Dawn filter appears only if a Dawn tile is
  present and should be the final filter after all suit filters.
- The Dawn filtered view should replace the normal tile scroller with one
  horizontal detail card: the selectable Dawn tile on the left, and its
  candidate values plus a short non-spoiling reminder on the right.

Important implementation nuance: the Dawn tile is not an "any value anywhere"
wild. The solver and UI should treat it as a bounded special entry that can
resolve only where the generated solution says it belongs. This keeps the
strategic feeling of saving or placing a special tile while preserving a
single intended solution. The generator prefers a Dawn cell whose resolved
tile is not also required in reserve. This matters because reserve tiles are
real leftover Cabinet supply, not a visual afterthought. The solver still
requires the Dawn entry itself to be placed at its generated solution cell.

## Set Types

The rail code on the board is intentionally compact. The Attached rails strip
and the rules modal provide the full names.

| Code | Set Type | Rule | Availability |
| --- | --- | --- | --- |
| `R` | Run | Three consecutive ranks in one suit | All daily levels |
| `X` | Mixed Run | Three consecutive ranks, each in a different suit | All daily levels |
| `M` | Match | Three identical tiles | All daily levels |
| `P` | Pair | Two identical tiles | All daily levels |
| `F` | Flush | Three same-suit tiles that are not a Run, Gap Run, or Match | All daily levels |
| `G` | Gap Run | Three same-suit ranks stepping by two | Hard and Expert |
| `N` | Number Set | Three same-rank tiles across different suits | Hard and Expert |
| `Z` | Mixed Gap | Three different suits stepping by two ranks | Expert |
| `?` | Hidden | A hidden rail that resolves through the ledger | Depends on puzzle |

Important priority notes:

- A same-suit consecutive triple is a Run, not a Flush.
- A same-suit gapped triple is a Gap Run, not a Flush.
- Three identical tiles are a Match.
- A Pair is two identical tiles and only applies to two-cell rails or reserve
  goals.
- Hidden rails should be validated by the solution and ledger, but should not
  reveal their type on the board before the puzzle is solved.

## Board and Rail Rules

- Only tiles joined by a rail belong to the same set.
- Tiles may touch on the board and still be unrelated.
- A tile at a crossing must satisfy every rail that passes through that cell.
- Each visible rail has a fixed required set type.
- Each hidden `?` rail counts toward the hidden ledger.
- Every blank must be filled unless it is not part of the puzzle's active cells.
- The Cabinet reserve requirement must be satisfied after all placements.

## Difficulty Model

Easy exists only as demo/tutorial practice. Daily play lets the player choose
one of Standard, Hard, or Expert for the day.

Difficulty is driven by:

- Number of blanks.
- Number of rails.
- Hidden rail count.
- Overlap density.
- Suit variety.
- Number of active set types.
- Reserve pressure.
- Whether copy-count reasoning matters.
- Motif count and motif arrangement.
- Dawn tile presence and candidate count on daily difficulties.
- Solver branching and uniqueness.

The game should remain logically provable. Reject puzzles that are ambiguous,
pure trial-and-error, or difficult only because they are tedious.

## Generator and Puzzle Data

Primary implementation file: `src/data/dawnCabinetPuzzles.ts`.

The data module owns:

- Core puzzle types.
- Tile and suit labels.
- Set classification and validation.
- Puzzle solved checks.
- Ledger state.
- Reserve goal checks.
- Daily seeded puzzle generation.
- Demo puzzle generation.
- Difficulty rating.
- Solution counting.
- Share text formatting.

Important exported concepts:

- `DawnCabinetPuzzle`
- `DawnCabinetTile`
- `DawnCabinetLine`
- `DawnCabinetSetKind`
- `DawnCabinetLineGoal`
- `getDailyDawnCabinet`
- `getDemoDawnCabinet`
- `classifyCabinetLine`
- `isValidCabinetLine`
- `getCabinetLineState`
- `countCabinetSolutions`
- `formatDawnCabinetShareText`

Daily puzzles are seeded by date and difficulty. Standard, Hard, and Expert
should all be playable on the same day. The generator uses modular motifs,
seeded macro-layout recipes, rail exposure profiles, play-profile signatures,
and composite signatures to reduce pattern memorization over time.

The shipped daily pack currently includes 365 scheduled days:

- Start: May 2, 2026.
- End: May 1, 2027.
- File: `src/data/dawnCabinetSchedule.json`.
- Builder: `npm run build:dawn-cabinet-schedule`.

The schedule stores the selected variant and metadata for each date/difficulty.
Runtime daily loading instantiates that chosen variant directly, so players do
not pay the candidate-pool cost when opening the game. Rebuild the schedule
after generator changes that affect puzzle shape, rail exposure, Dawn placement,
ledger composition, reserve goals, play profiles, or composite signatures.

Motif and shape variety matters. Do not collapse the generator back to one fixed
board per difficulty.

### Player-Visible Rail Integrity

Generated macro connector rails are constraints the player must be able to read
directly from the board. They are not just solver metadata.

Every generated connector rail must pass the rail-visibility validator before a
candidate can be selected or written into the schedule:

- Every listed rail cell must exist in the active board.
- The rail path must be horizontal, vertical, or a clean 45-degree diagonal
  between consecutive listed cells.
- Connector segments must not pass through unrelated active tile centers.
- Connector spans must stay short enough for the difficulty: Standard shortest,
  Hard moderate, Expert widest but still readable.
- A generated connector should use legible pressure, such as a local bridge,
  edge hinge, diagonal stitch, reserve fork, or Dawn hinge, rather than an
  arbitrary long jump.

If a macro family cannot create a visible connector, prefer another visible
connector candidate or a different selected variant. Do not solve invisibility
by deleting connector pressure; the schedule builder should fail rather than
write a puzzle with a generated rail the player cannot see.

### Composite 90

The freshness target is **Composite 90**: no exact repeat of the combined layout
and rail profile within a 90-day window per difficulty. This does not promise
that broad macro-layout families never repeat for 90 days. Instead, the
fingerprint combines:

- normalized active-cell shape,
- rail topology,
- visible versus hidden rail distribution,
- visible rail-type mix,
- motif multiset,
- reserve goal profile,
- Dawn profile when present.

This is deliberately stricter than "different seed" and looser than "never use
the same broad family." It gives the game longevity without requiring every day
to invent a new board species.

### Play Profiles and Posture 21

Every generated daily candidate also gets a `playProfile`. This is a compact
description of how the puzzle is likely to be read:

- macro layout family,
- motif multiset,
- visible rail-type mix,
- hidden ledger mix,
- opening clue style,
- Dawn pressure,
- reserve pressure,
- solve posture,
- silhouette class,
- count profile.

Candidate selection uses a soft **Posture 21** rule: avoid repeating the same
play-profile key within 21 days for the same difficulty. Fairness wins over
novelty, so a rare fallback is allowed only when the fresher candidates fail
unique-solution or Dawn-quality checks. The tests protect Composite 90 strictly
and cap Posture 21 fallbacks.

### Layout Recipes and Rail Exposure

The generator should vary boards through macro recipes and motif composition.
Current intended recipe families are:

- Standard: `splitHinge`, `cornerExchange`, `threePocket`, `shortBasin`.
- Hard: `braidedReservoir`, `mirrorTrap`, `offsetBridge`, `reserveFork`.
- Expert: `ringCabinet`, `fiveDistrict`, `doubleBasin`, `brokenSpine`,
  `lanternWeb`.

These names are not just labels for analytics. The generator uses them to add
different connector rails and motif pressure so the same difficulty does not
always open with the same visual or logical posture.

Visible rails should not collapse into mostly Pair clues. Use seeded exposure
profiles so visible clues teach local board logic without giving away the
ledger:

- `friendlyStart`
- `ledgerFirst`
- `reserveFirst`
- `dawnFork`
- `copyPressure`
- `bridgeRead`

- Standard: 2-4 visible set types.
- Hard: 3-5 visible set types.
- Expert: 4-6 visible set types.

If visible rail variety increases, preserve hidden-ledger pressure by keeping
enough hidden rails and overlaps. Richer visible rail types should make the
board more readable, not simply easier.

### Dawn Pressure Targets

Standard, Hard, and Expert each include exactly one Dawn tile.

- Standard: usually touches two rails, sometimes three. It should create a
  small pause without making Standard feel like a trap.
- Hard: usually touches at least three rails. It should often remain a real
  mid-solve question.
- Expert: must touch at least three rails, with a meaningful subset of days at
  four or more rails. Prefer cells that bridge districts or combine hidden
  ledger pressure with visible rail pressure, but do not force four-rail Dawn
  placement when it would make generation brittle or ambiguous.

Dawn cannot be left in reserve and should not steal a tile that the reserve goal
needs. If a Dawn candidate breaks the reserve proof or creates multiple
solutions, reject it.

## UX Architecture

Primary screen file: `app/dawn-cabinet.tsx`.

Supporting Dawn art files:

- `src/ui/dawnTileArt.tsx` owns the Dawn asset renderer, the Dawn variant count,
  and the code-native SVG fallback renderer.
- `assets/dawn-cabinet/dawn-tiles/` stores the 20 Dawn PNG assets and the prompt
  manifest used to regenerate or replace them.
- `scripts/build_dawn_tile_assets.py` generates deterministic local review PNGs
  for the Mahjong Bonus Panel set.
- `scripts/generate_dawn_tile_art.py` owns the `gpt-image-2` style-set workflow:
  prepare prompt JSONL, run the batch through the shared imagegen CLI, and copy
  an approved direction into the shipped assets.
- `scripts/extract_dawn_tile_contact_sheet.py` supports built-in imagegen review
  sheets by cropping the 20 generated panels, removing the panel background, and
  writing transparent mark-only PNGs into the shipped Dawn names.
- `scripts/dawn_tile_art_contact_sheet.ts` generates the contact sheet for
  checking every Dawn asset at filter-chip, compact-board, and Cabinet sizes.

The route owns:

- Start screen and daily level selection.
- Easy Demo entry.
- Rules modal and tutorial content.
- Puzzle state, local storage, timer, solved state, and share state.
- Tile placement interactions.
- Dawn tile rendering and candidate display.
- Board rendering.
- Rail focus behavior.
- Cabinet tile area.
- Mobile pinned Cabinet tray.
- Suit filters.
- Cabinet progress panel.
- Win state and share result.

### Start Screen

The start screen is intentionally separate from active play. It should include:

- Date.
- A compact "The Basics" summary before level choice.
- Standard, Hard, Expert choices in one row when possible.
- Qualitative difficulty summaries, not exact spoilers.
- Standard marked as the recommended first daily.
- Start button.
- How to Play.
- Practice a Small Cabinet.

Do not put the daily difficulty picker back on the active puzzle surface.

### Active Puzzle View

The active puzzle view should be board-first:

- Minimal header.
- Board.
- Attached rails strip only when a cell is selected.
- Cabinet tile area and progress panel.
- Check, reset, and related controls.

Avoid cluttering the board with large summary pills. Progress belongs with the
Cabinet area.

### Cabinet Area

Use the word Cabinet in player-facing UI. The Cabinet area should show:

- Available tile stacks.
- Copy pips/counts.
- Dawn tile stack when present.
- Suit filters on mobile.
- A compact progress panel.

Desktop can use a larger tile grid. Mobile uses a pinned bottom tray with
horizontally scrollable tile stacks and progress.

### Cabinet Progress Panel

The progress panel should show:

- Visible rails completed out of visible rail count.
- Hidden ledger progress by set type.
- Reserve requirement: examples include `Use every tile`, `Leave 2`, `Leave
  Pair`, `Leave Gap Run`.
- Actionable warnings after Check.

It should be quieter than the board. It is information support, not the main
visual focus.

### Attached Rails Strip

When a cell is selected:

- Dim unrelated cells and rails.
- Elevate rails using that cell.
- Lightly highlight the borders of every tile place used by the elevated rails.
  This should clarify the footprint of the selected rail group without covering
  tile ranks, suit art, or suit labels.
- Show the Attached rails strip below the board.
- List full names for attached rails.
- Keep hidden rails non-spoiling as `Hidden ?`.
- Include the info button that reveals the set-type legend for the current
  cabinet.

The Attached rails strip is a readable detail panel. It is not a replacement for
on-board rail labels.

## Rail Label Design Rules

Rail labels are critical. Future UI work should preserve these constraints:

- Rail labels must remain visible on the board at all times.
- Rail labels must remain visible when a cell is selected.
- Rail labels must not be shown only in the Attached rails strip.
- Labels should be readable at a glance on Standard, Hard, and Expert boards.
- Labels must avoid covering essential tile identity:
  - top rank,
  - center suit art,
  - bottom suit label.
- Labels may overlap rail strokes, empty slots, cell borders, and tile
  whitespace.
- Labels should remain on the rail/grid itself, not become detached callouts.
  Nudge them along the rail, or only slightly beside the rail stroke, when
  avoiding tile identity.
- Hidden rails show `?`.
- Hidden `?` labels and rails must not turn green before solve, even if the
  hidden rail is already locally valid.
- Invalid checked rails may turn red.

The current implementation uses a label overlay with collision-aware candidate
placement. If replacing it, preserve the behavior rather than merely matching
the old code shape.

## Daily Completion and Share

Daily completion should produce a compact, non-spoiling share result. It should
include:

- Game name and date.
- Difficulty.
- Time.
- Rail count.
- A small tile trail based on early correct tiles.
- URL.

Do not include ledger counts or solution information in share text. Easy Demo
should not produce daily share output.

## Persistence and Counting

The screen uses local storage for:

- Chosen daily difficulty.
- In-progress placements.
- Puzzle solved state.
- Daily play count bookkeeping.

The current storage prefix is `dawn-cabinet-v10`. Be cautious when changing
storage keys because players may have in-progress or solved daily state.

## Testing and Verification

Primary test file: `src/data/dawnCabinetPuzzles.test.ts`.

Important coverage includes:

- Set classifiers and priority cases.
- Hidden ledger behavior.
- Reserve goals.
- Share text.
- Difficulty target ranges.
- Monotonic difficulty rating.
- The 365-day scheduled pack from May 2, 2026 through May 1, 2027.
- Shape variety.
- Composite 90 anti-repeat behavior.
- Posture 21 play-profile behavior, with uniqueness allowed to win rare
  fallbacks.
- Player-visible generated connector rails.
- Visible rail-type variety targets.
- Dawn tile presence, candidate bounds, and non-reserve behavior.
- Dawn/reserve supply integrity when the Dawn tile's resolved value has
  duplicate copies elsewhere in the Cabinet.
- Unique solvability via `countCabinetSolutions(puzzle, 2) === 1`.

Run before shipping Dawn Cabinet changes:

```sh
npx vitest run src/data/dawnCabinetPuzzles.test.ts
npm run build:web
```

For UI changes, also smoke test `/dawn-cabinet` in the browser:

- Start screen loads.
- How to Play opens.
- Easy Demo starts.
- Standard, Hard, and Expert start.
- Standard, Hard, and Expert show one Dawn tile in the Cabinet.
- The Dawn tile face shows only the day mark; candidate values appear beside it
  in the Dawn filtered Cabinet view.
- The mobile tray includes a final-position Dawn filter when the Dawn tile is
  present.
- The Dawn filtered Cabinet view includes the short Dawn explanation.
- Board fits on mobile width around 390px.
- Expert remains usable on mobile.
- Cabinet tray does not cover board controls.
- Rail labels are readable and non-blocking.
- Tile ranks, suit icons, suit labels, and Cabinet copy pips are not clipped.
- Hidden `?` rails stay non-spoiling.
- No fresh console errors.

## Do Not Break

- Do not rename player-facing Cabinet back to Bank.
- Do not hide board rail labels and rely only on Attached rails.
- Do not make hidden rails turn green before the puzzle is solved.
- Do not simplify difficulty by removing ledger or reserve pressure.
- Do not turn the Dawn tile into an unlimited wild card.
- Do not add Dawn to Easy Demo without a separate design pass.
- Do not add multiple Dawn tiles without first designing the `dawnTiles[]`
  schema, solver, rating, Cabinet UI, and uniqueness rules together.
- Do not collapse Standard, Hard, and Expert into similar boards.
- Do not make the pre-game cards reveal exact spoiler-heavy stats.
- Do not make Easy a normal daily difficulty.
- Do not add winds, dragons, full Mahjong scoring, discards, calls, or yaku/fan
  rules without a separate design pass.
- Do not describe the game as Mahjong or Mahjong solitaire.

## Future Design Directions

Good candidates for future iteration:

- More motif families, as long as uniqueness and mobile geometry survive.
- Better rail label placement heuristics or visual routing.
- More expressive but still compact tile art.
- More polished share text.
- More tutorial interactivity.
- Accessibility work for color, contrast, and rail labels.

Risky directions:

- Adding too many set types at once.
- Increasing board width beyond mobile-safe geometry.
- Making progress display so explicit that hidden rails become spoilers.
- Reducing all difficulty to tile count instead of deduction structure.
- Treating Mahjong authenticity as more important than Dawn Cabinet's own
  logic-puzzle identity.

## Quick Handoff Checklist for Future Agents

Before changing Dawn Cabinet:

1. Read this guide.
2. Inspect `app/dawn-cabinet.tsx`.
3. Inspect `src/data/dawnCabinetPuzzles.ts`.
4. Run or review `src/data/dawnCabinetPuzzles.test.ts`.
5. Preserve Cabinet terminology.
6. Preserve rail labels on the board.
7. Preserve hidden rail non-spoiling behavior.
8. Test dense Expert boards and mobile width.
9. Run the Dawn Cabinet tests and web build.
10. For Dawn art changes, use `npm run prepare:dawn-art` to write the
    `gpt-image-2` prompt matrix, `npm run generate:dawn-art -- --dry-run` to
    inspect the exact batch, and only run the live batch when `OPENAI_API_KEY`
    is intentionally set.
11. Before shipping generated Dawn assets, run `npm run preview:dawn-art` against
    the accepted or review folder and inspect the contact sheet at all three
    gameplay sizes.
12. Keep changes scoped unless intentionally doing a broader redesign.
