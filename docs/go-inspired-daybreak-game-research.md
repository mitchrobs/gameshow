# Go-Inspired Daybreak Logic Game Research

## Research Goal

Design a daily Daybreak puzzle inspired by Go without shipping a full Go client. The useful target is a compact, deterministic puzzle that carries Go's distinctive tactical feel: groups, liberties, capture, pressure, and board shape.

## Go Mechanics Worth Preserving

Go's rules are small, but the emergent strategy is large. The British Go Association introduces the core loop as surrounding territory and capturing opposing stones by fully occupying their liberties. AGA-style rules define liberties as orthogonally adjacent vacant intersections, connected same-color stones as strings, and capture as removing opponent strings with no liberties.

Relevant mechanics:

- Orthogonal connection: diagonals do not connect groups or count as liberties.
- Shared liberties: a single empty intersection can be the last liberty for multiple opposing groups.
- Atari: a group with one liberty is under immediate capture threat.
- Capture and removal: captured stones leave empty points behind, changing future liberties.
- Self-capture rule: a move with no resulting liberties is illegal unless it first captures adjacent opposing stones.
- Ko/superko: prevents immediate repetition, but is likely too much for a first daily puzzle.
- Territory and area scoring: central to full Go, but ambiguous for casual solo puzzle onboarding.
- Life and death: the two-eye concept is Go's deepest tactical puzzle source; useful later, but too much for a first compact Daybreak launch unless heavily scaffolded.
- Seki: mutual life from shared liberties is fascinating but a poor first-puzzle rule because "do nothing" can be the correct state.

Source notes:

- British Go Association rules primer: https://www.britgo.org/intro/intro2.html
- AGA short rules hosted by BGA: https://www.britgo.org/rules/agashort.html
- Sensei's Library background on seki: https://senseis.xmp.net/?Seki=
- Life and death overview: https://en.wikipedia.org/wiki/Life_and_death

## Daily Logic Landscape

The strongest current daily logic games share a few traits:

- One-board daily cadence with streak/share language.
- Small board, short solve, high readability on mobile.
- Rules can be learned from one or two examples.
- Pure deduction is preferred over guessing.
- A daily "same puzzle for everyone" structure supports comparison.
- The best new logic entries add a physical or visual affordance, not just another number grid.

Comparable games:

- LinkedIn Queens: one queen per row, column, and colored region, with no adjacent queens. Its strength is simple constraints plus elimination marks. Source: https://www.linkedin.com/help/linkedin/answer/a6269510
- LinkedIn Tango: a thinking-oriented daily with high return behavior reported by LinkedIn. Its strength is binary state plus equality/opposition constraints. Source: https://news.linkedin.com/2024/October/linkedin-announces-tango-
- NYT Pips: a domino-based visual logic puzzle designed to complement NYT's word-heavy portfolio and appeal beyond native English speakers. Source: https://www.creativeboom.com/news/the-new-york-times-launches-its-first-original-logic-puzzle-pips/
- Puzzmo/Hearst: daily puzzle bundles work because the portfolio mixes known newspaper forms with modern variants like SpellTower, Typeshift, and Really Bad Chess. Source: https://www.axios.com/2023/10/20/puzzmo-hearst-zach-gage-new-york-times
- Nikoli/Simon Tatham-style logic families: Bridges, Loopy/Slitherlink, Tents, Net, and related puzzles show that compact graph/grid constraints can produce durable replayable formats.

## Daybreak Portfolio Fit

Current Daybreak logic coverage:

- Mini Sudoku: digit placement and Latin-square reasoning.
- Bridges: graph connectivity and exact numeric degrees.
- Dawn Cabinet: tile-bank combinatorics and overlapping line constraints.
- Barter: resource planning and route optimization.
- Whodunit: text deduction.

Gap:

- Daybreak does not yet have a tactical territory/capture puzzle. A Go-inspired game can occupy the "organic board pressure" slot: local shape, spatial reading, and satisfying capture moments without adding another number-grid game.

## Recommended MVG: Closeout

Title: Closeout

Logline: Clear the white targets by placing black blocks on every open side.

Rules:

- Tap empty grid spots to place black blocks.
- White targets that touch side-to-side form one target group.
- A target group clears when every open side touching it is blocked.
- A block must keep at least one open side unless it clears a target immediately.
- Finish by clearing every starting white target.

Why this slice:

- It preserves Go's most legible mechanic while replacing Go terms with concrete spatial language.
- It creates a tactile "seal the escape routes" solve loop.
- It avoids ko, territory scoring, passing, komi, and opponent modeling.
- It supports larger one-screen boards with multiple simultaneous target groups.
- It can later expand into deeper group-shape puzzles once players understand open sides.

MVG scope:

- 7x7 and 8x8 boards.
- 2-5 target groups with roughly 9-24 block placements at the clean target.
- One black block per confirmed placement; white does not respond.
- Locked starting blocks and frozen cells that close sides but cannot be tapped.
- Local storage progress, undo, reset, hint, timer, share text.
- Hand-authored daily pack validated by unit tests.
- Home page card and streak/play-count integration.

Nice-to-have later:

- Generator plus solver that confirms clean target solutions and flags weak puzzle structure.
- "Save the black group" variants.
- Two-eye life puzzles.
- Scripted opponent replies for tsumego-style sequences.
- Difficulty calendar and content review tooling.

Key design risk:

- If every puzzle is only "fill all open sides," it can become counting rather than deduction. The launch pack should use shared open sides, edge compression, final-key blocks, and multi-target-group boards. The next iteration should add deeper solver validation for uniqueness and richer motifs.
