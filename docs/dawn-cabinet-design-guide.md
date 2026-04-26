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
- **Easy Demo**: Tutorial/practice mode. It is not a daily difficulty.
- **Daily levels**: Standard, Hard, and Expert.

## Tile System

Dawn Cabinet uses modern Mahjong-inspired numbered suits.

- Tiles have a `suit` and `rank`.
- There are 12 rotating suit families:
  - bamboo, dots, characters, coins, lotus, jade, clouds, stars, waves, knots,
    moons, suns.
- Daily puzzles use a subset of the 12 suits:
  - Standard uses fewer suits than Hard and Expert.
  - Expert uses the broadest suit variety.
- The suit labels such as `BAM`, `CHR`, `SUN`, and `DOT` are suit identifiers,
  not rules.
- Copy pips on Cabinet tiles show how many identical Cabinet tiles remain.
- The Cabinet supply is finite. Every placed tile comes from this supply.

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
should all be playable on the same day. The generator uses modular motifs and a
shape signature to reduce pattern memorization over time.

Motif and shape variety matters. Do not collapse the generator back to one fixed
board per difficulty.

## UX Architecture

Primary screen file: `app/dawn-cabinet.tsx`.

The route owns:

- Start screen and daily level selection.
- Easy Demo entry.
- Rules modal and tutorial content.
- Puzzle state, local storage, timer, solved state, and share state.
- Tile placement interactions.
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
- Standard, Hard, Expert choices in one row when possible.
- Qualitative difficulty summaries, not exact spoilers.
- Start button.
- How to Play.
- Try Easy Demo.

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
- Daily generation through future dates.
- Shape variety.
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
- Board fits on mobile width around 390px.
- Expert remains usable on mobile.
- Cabinet tray does not cover board controls.
- Rail labels are readable and non-blocking.
- Hidden `?` rails stay non-spoiling.
- No fresh console errors.

## Do Not Break

- Do not rename player-facing Cabinet back to Bank.
- Do not hide board rail labels and rely only on Attached rails.
- Do not make hidden rails turn green before the puzzle is solved.
- Do not simplify difficulty by removing ledger or reserve pressure.
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
10. Keep changes scoped unless intentionally doing a broader redesign.
