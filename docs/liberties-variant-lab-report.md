# Liberties Variant Lab Report

Date: 2026-05-18

## What Was Built

A standalone playable lab now lives at `tools/liberties-variant-lab/`. It does not touch the production homepage or the current Liberties route.

The lab includes:

- 12 playable rule variants
- a shared capture/liberty engine
- generated 12-day mini-packs per variant
- automated solver/audit output
- a browser UI for selecting variants and auto-playing solved samples
- a headless Chrome smoke test that clicks through every variant in the UI

## Automated Playtest Results

Command:

```bash
node tools/liberties-variant-lab/playtest.mjs --pack-size=12 --json=tmp/liberties-variant-lab-playtest.json
```

Result:

- Variants tested: 12
- Mini-pack size per variant: 12
- Solved samples: 144/144

Ranking from the playable lab:

| Rank | Variant | Avg score | Solved | Avg moves | Filler | Shared | Responses | Variance |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | Responsive Lights | 30.8 | 12/12 | 3.0 | 33% | 1.3 | 2.0 | 3.5 |
| 2 | Net / Ladder Chase | 24.7 | 12/12 | 3.0 | 25% | 1.5 | 2.0 | 1.5 |
| 3 | Capture Race | 22.9 | 12/12 | 4.0 | 31% | 2.8 | 0.5 | 3.2 |
| 4 | Shared Crossing | 22.1 | 12/12 | 4.3 | 13% | 3.0 | 0.0 | 7.2 |
| 5 | Snapback / Sacrifice | 19.7 | 12/12 | 4.5 | 25% | 2.3 | 0.0 | 4.1 |
| 6 | Ko Threat Miniature | 17.4 | 12/12 | 4.5 | 25% | 2.3 | 0.0 | 5.3 |
| 7 | Life Shape | 15.7 | 12/12 | 4.5 | 25% | 2.3 | 0.0 | 4.0 |
| 8 | Efficient Capture | 11.9 | 12/12 | 4.5 | 25% | 2.3 | 0.0 | 3.6 |
| 9 | Dark Chain Survival | 11.4 | 12/12 | 5.0 | 40% | 1.7 | 0.0 | 3.8 |
| 10 | Stone Budget | 11.0 | 12/12 | 4.5 | 25% | 2.3 | 0.0 | 4.5 |
| 11 | Green Release Locks | 8.8 | 12/12 | 8.0 | 69% | 0.0 | 0.0 | 0.1 |
| 12 | Territory Closure | 8.8 | 12/12 | 4.3 | 24% | 2.3 | 0.0 | 1.4 |

## Browser Smoke Test

Command:

```bash
node tools/liberties-variant-lab/browser-smoke.mjs
```

Result:

- 12/12 variants loaded in headless Chrome
- 12/12 variants auto-played through the browser UI
- 12/12 variants reached a settled state

## Interpretation

The playable tests changed the ranking from the earlier analysis in one important way: **Responsive Lights** and **Net / Ladder Chase** became much more convincing once built. The reason is simple: the board changes after quiet moves, so the player has to think about consequence, not just perimeter completion.

That said, Net / Ladder Chase should probably not be the primary version. It scores well because it creates movement and state change, but the teaching burden and path/chase flavor could push it toward a different game identity. It is better as a source of motifs inside a broader responsive-light system.

## Recommended Top 3

### 1. Responsive Lights

Best candidate for making Liberties feel like a real game. It creates visible consequence: if the player makes a quiet move, a light group extends. Captures become timing decisions.

Why it is strong:

- highest playable-lab score
- all mini-pack puzzles solved
- low filler compared with current production pack
- state changes are visible on the board
- distinct from Bridges and Dawn Cabinet

Risk:

- needs very careful instruction wording so it does not feel like an invisible opponent.

### 2. Shared Crossing

Best base-layer rule. It is the easiest idea to teach: one crossing can touch multiple separate light groups. It directly attacks filler because the player starts looking for high-leverage points.

Why it is strong:

- lowest filler ratio in the lab at 13%
- very teachable
- visible before the move
- works as the foundation for Responsive Lights and Capture Race

Risk:

- alone, it may become an efficiency puzzle rather than a dynamic tactics puzzle.

### 3. Capture Race

Best hard-mode spine. It gives urgency without requiring full Go vocabulary: when a light group has one open side, deal with it or it stretches into space.

Why it is strong:

- all mini-pack puzzles solved
- good shared-move rate
- creates order pressure
- closer to Go tactics without requiring terms like atari, semeai, or ladder

Risk:

- must stay small and readable. Too many urgent groups will feel chaotic.

## Rejected As Core

### Green Release Locks

Playable but weak. It solved all samples, but had the worst filler profile among the serious candidates: 69% filler, no shared moves, no responses, and almost no day-to-day variance. It also reinforces the Dawn Cabinet-adjacent key/lock feel.

### Efficient Capture / Stone Budget

Useful scoring shells, not enough as game identity. They do not create new spatial consequences.

### Ko / Life / Sacrifice

Good advanced motifs, poor onboarding. They rely on ideas that are elegant in Go but hard to teach in a daily puzzle without specialized vocabulary.

## Production Direction

The strongest next version of Liberties should be:

1. Base layer: Shared Crossings
2. Main dynamic: Responsive Lights
3. Hard-mode pressure: Capture Race
4. Scoring shell: small stone bowl, not visible par
5. Removed or rare: Green Release Locks

The public rule should avoid Go terms:

> Place dark pebbles to clear the light pebbles. A light group clears when all side-touching open crossings are closed. Quiet moves let light stretch into space, so look for shared crossings and clear groups before they run.
