# Liberties Pack Player-Test Comparison

Baseline: HEAD:src/data/libertiesPack.generated.ts

## Method

Automated play checks are run for each puzzle by validating generated routes, minimum-route solvability, move-floor bounds, blocker bounds, response-pressure requirements, and release legality.

## Standard mode comparison

Standard public: 750 new vs 365 baseline
Standard reserve: 72 new vs 35 baseline
Standard combined: 822 new vs 400 baseline
Public overlap IDs with baseline: 365/365
Reserve overlap IDs with baseline: 0/35
Combined overlap IDs with baseline: 400/400

Public overlap IDs: liberties-clock-square, liberties-glass-court-tight-room-41, liberties-corner-market-corner-pocket-20-mirror-wide-0-0-0, liberties-promenade-corner-pocket-80-mirror-tall-1-1-1, liberties-side-door-tight-room-31-mirror-tall-0-0-0, liberties-clock-square-soft-net-302-turn-left-0-0-0, liberties-lantern-row-turn-around-0-0-0, liberties-market-grid-swap-anti-diagonal-0-0-0, liberties-cross-traffic-turn-around-1-0-0, liberties-glass-court
Reserve overlap IDs: none

Public difficulty mix: Easy 93, Standard 411, Hard 246 (old Easy 45, Standard 200, Hard 120)
Reserve difficulty mix: Easy 10, Standard 48, Hard 14 (old Easy 5, Standard 23, Hard 7)
Combined difficulty mix: Easy 103, Standard 459, Hard 260 (old Easy 50, Standard 223, Hard 127)
Public size mix: 7: 72, 8: 206, 9: 447, 10: 25 vs 7: 28, 8: 107, 9: 218, 10: 12
Reserve size mix: 7: 8, 8: 35, 9: 28, 10: 1 vs 7: 3, 8: 12, 9: 19, 10: 1

Top reasoned public failures:
- None

Top hardest public examples:
- liberties-mosaic-hall-tempo-pocket-213-turn-left-2-2-0 (Hard, size 10, 39 moves, 70 dependency, 35 stretches)
- liberties-copper-lane-tight-room-270-swap-diagonal-2-0-1 (Hard, size 10, 37 moves, 66 dependency, 35 stretches)
- liberties-shutter-row-mirror-wide-2-1-2 (Hard, size 10, 35 moves, 66 dependency, 34 stretches)
- liberties-city-block-fake-room-174-turn-around-2-0-0 (Hard, size 10, 34 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-split-gate-215-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 65 dependency, 34 stretches)
- liberties-foundry-tight-room-280-turn-around-2-0-2 (Hard, size 10, 36 moves, 65 dependency, 33 stretches)
- liberties-city-block-soft-net-171-swap-anti-diagonal-2-0-2 (Hard, size 10, 34 moves, 64 dependency, 33 stretches)
- liberties-copper-lane-tight-room-270-mirror-tall-2-1-1 (Hard, size 10, 35 moves, 63 dependency, 34 stretches)
- liberties-copper-lane-tight-room-270-mirror-tall-2-1-0 (Hard, size 10, 37 moves, 62 dependency, 34 stretches)

Top reasoned reserve failures:
- None

Top hardest reserve examples:
- liberties-shutter-row-tempo-pocket-193-swap-diagonal-2-1-0 (Hard, size 10, 33 moves, 63 dependency, 32 stretches)
- liberties-south-arcade-chase-lane-143-swap-diagonal-1-0-0 (Standard, size 9, 28 moves, 51 dependency, 26 stretches)
- liberties-south-arcade-corner-pocket-140-mirror-wide-1-0-0 (Standard, size 9, 26 moves, 49 dependency, 24 stretches)
- liberties-rail-yard-tempo-pocket-203-turn-left-1-1-1 (Hard, size 9, 26 moves, 49 dependency, 24 stretches)
- liberties-rail-yard-tempo-pocket-203-mirror-wide-1-0-0 (Hard, size 9, 26 moves, 48 dependency, 25 stretches)
- liberties-canal-turn-tight-room-111-turn-right-1-0-1 (Standard, size 9, 25 moves, 48 dependency, 24 stretches)
- liberties-arc-light-tempo-pocket-263-turn-left-1-0-1 (Hard, size 9, 25 moves, 48 dependency, 24 stretches)
- liberties-shutter-row-tempo-pocket-193-swap-diagonal-1-0-1 (Hard, size 9, 26 moves, 47 dependency, 25 stretches)
- liberties-canal-turn-soft-net-112-mirror-tall-1-1-1 (Standard, size 9, 23 moves, 47 dependency, 22 stretches)
- liberties-tile-yard-split-gate-135-mirror-wide-1-1-0 (Standard, size 9, 27 moves, 46 dependency, 25 stretches)

Top reasoned combined failures:
- None

Top hardest combined examples:
- liberties-mosaic-hall-tempo-pocket-213-turn-left-2-2-0 (Hard, size 10, 39 moves, 70 dependency, 35 stretches)
- liberties-copper-lane-tight-room-270-swap-diagonal-2-0-1 (Hard, size 10, 37 moves, 66 dependency, 35 stretches)
- liberties-shutter-row-mirror-wide-2-1-2 (Hard, size 10, 35 moves, 66 dependency, 34 stretches)
- liberties-city-block-fake-room-174-turn-around-2-0-0 (Hard, size 10, 34 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-split-gate-215-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 65 dependency, 34 stretches)
- liberties-foundry-tight-room-280-turn-around-2-0-2 (Hard, size 10, 36 moves, 65 dependency, 33 stretches)
- liberties-city-block-soft-net-171-swap-anti-diagonal-2-0-2 (Hard, size 10, 34 moves, 64 dependency, 33 stretches)
- liberties-copper-lane-tight-room-270-mirror-tall-2-1-1 (Hard, size 10, 35 moves, 63 dependency, 34 stretches)
- liberties-shutter-row-tempo-pocket-193-swap-diagonal-2-1-0 (Hard, size 10, 33 moves, 63 dependency, 32 stretches)

## Hard mode comparison

Hard public: 750 new vs 365 baseline
Hard reserve: 72 new vs 35 baseline
Hard combined: 822 new vs 400 baseline
Public overlap IDs with baseline: 244/365
Reserve overlap IDs with baseline: 10/35
Combined overlap IDs with baseline: 289/400

Public overlap IDs: liberties-clock-square, liberties-glass-court-tight-room-41, liberties-promenade-corner-pocket-80-mirror-tall-1-1-1, liberties-cross-traffic-turn-around-1-0-0, liberties-glass-court, liberties-frozen-lanes-soft-net-72-turn-left-1-0-0, liberties-mosaic-hall-swap-diagonal-1-0-0, liberties-shared-court-chase-lane-63-turn-right-1-0-0, liberties-river-stones-swap-diagonal-1-0-0, liberties-promenade-corner-pocket-80-turn-around-1-0-0
Reserve overlap IDs: liberties-promenade-mirror-wide-2-0-1, liberties-canal-turn-tight-room-111-swap-anti-diagonal-1-1-0, liberties-clock-square-soft-net-302-mirror-wide-1-0-1, liberties-clock-square-soft-net-302-turn-left-1-1-0, liberties-shared-court-tight-room-61-turn-around-2-1-1, liberties-promenade-tempo-pocket-84-swap-anti-diagonal-2-2-0, liberties-market-grid-tempo-pocket-94-swap-diagonal-1-1-1, liberties-tile-yard-soft-net-132-mirror-wide-1-0-1, liberties-clock-square-corner-pocket-300-swap-anti-diagonal-1-1-1, liberties-market-grid-tight-room-91-swap-diagonal-1-0-0

Public difficulty mix: Easy 93, Standard 411, Hard 246 (old Easy 45, Standard 200, Hard 120)
Reserve difficulty mix: Easy 10, Standard 48, Hard 14 (old Easy 5, Standard 23, Hard 7)
Combined difficulty mix: Easy 103, Standard 459, Hard 260 (old Easy 50, Standard 223, Hard 127)
Public size mix: 7: 5, 8: 128, 9: 170, 10: 434, 11: 13 vs 7: 28, 8: 107, 9: 218, 10: 12
Reserve size mix: 7: 2, 8: 8, 9: 40, 10: 22 vs 7: 3, 8: 12, 9: 19, 10: 1

Top reasoned public failures:
- None

Top hardest public examples:
- liberties-mosaic-hall-tempo-pocket-213-turn-left-2-2-0 (Hard, size 10, 39 moves, 70 dependency, 35 stretches)
- liberties-ladder-garden-chase-lane-292-turn-left-2-2-0 (Hard, size 11, 36 moves, 66 dependency, 36 stretches)
- liberties-copper-lane-tight-room-270-swap-diagonal-2-0-1 (Hard, size 10, 37 moves, 66 dependency, 35 stretches)
- liberties-shutter-row-mirror-wide-2-1-2 (Hard, size 10, 35 moves, 66 dependency, 34 stretches)
- liberties-copper-lane-tempo-pocket-273-turn-left-2-2-1 (Hard, size 10, 36 moves, 66 dependency, 34 stretches)
- liberties-city-block-fake-room-174-turn-around-2-0-0 (Hard, size 10, 34 moves, 66 dependency, 33 stretches)
- liberties-ladder-garden-turn-left-2-2-0 (Hard, size 11, 35 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-split-gate-215-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 65 dependency, 34 stretches)
- liberties-foundry-tight-room-280-turn-around-2-0-2 (Hard, size 10, 36 moves, 65 dependency, 33 stretches)

Top reasoned reserve failures:
- None

Top hardest reserve examples:
- liberties-rail-yard-split-gate-205-swap-anti-diagonal-2-2-1 (Hard, size 10, 31 moves, 58 dependency, 30 stretches)
- liberties-city-block-split-gate-175-swap-anti-diagonal-2-0-2 (Hard, size 10, 30 moves, 57 dependency, 29 stretches)
- liberties-city-block-split-gate-175-swap-diagonal-2-0-1 (Hard, size 10, 31 moves, 56 dependency, 30 stretches)
- liberties-south-arcade-corner-pocket-140-swap-diagonal-2-0-2 (Standard, size 10, 30 moves, 56 dependency, 29 stretches)
- liberties-tile-yard-tight-room-131-turn-around-2-1-2 (Standard, size 10, 30 moves, 56 dependency, 29 stretches)
- liberties-rail-yard-tight-room-200-turn-around-2-0-2 (Hard, size 10, 30 moves, 56 dependency, 28 stretches)
- liberties-shutter-row-mirror-wide-2-1-0 (Hard, size 10, 28 moves, 56 dependency, 27 stretches)
- liberties-foundry-split-gate-285-mirror-tall-2-2-0 (Hard, size 10, 32 moves, 55 dependency, 29 stretches)
- liberties-copper-lane-tight-room-270-mirror-tall-2-0-0 (Hard, size 10, 30 moves, 55 dependency, 28 stretches)
- liberties-rail-yard-fake-room-204-swap-diagonal-2-2-0 (Hard, size 10, 29 moves, 55 dependency, 27 stretches)

Top reasoned combined failures:
- None

Top hardest combined examples:
- liberties-mosaic-hall-tempo-pocket-213-turn-left-2-2-0 (Hard, size 10, 39 moves, 70 dependency, 35 stretches)
- liberties-ladder-garden-chase-lane-292-turn-left-2-2-0 (Hard, size 11, 36 moves, 66 dependency, 36 stretches)
- liberties-copper-lane-tight-room-270-swap-diagonal-2-0-1 (Hard, size 10, 37 moves, 66 dependency, 35 stretches)
- liberties-shutter-row-mirror-wide-2-1-2 (Hard, size 10, 35 moves, 66 dependency, 34 stretches)
- liberties-copper-lane-tempo-pocket-273-turn-left-2-2-1 (Hard, size 10, 36 moves, 66 dependency, 34 stretches)
- liberties-city-block-fake-room-174-turn-around-2-0-0 (Hard, size 10, 34 moves, 66 dependency, 33 stretches)
- liberties-ladder-garden-turn-left-2-2-0 (Hard, size 11, 35 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-split-gate-215-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 66 dependency, 33 stretches)
- liberties-mosaic-hall-swap-diagonal-2-0-0 (Hard, size 10, 35 moves, 65 dependency, 34 stretches)
- liberties-foundry-tight-room-280-turn-around-2-0-2 (Hard, size 10, 36 moves, 65 dependency, 33 stretches)

## Dimension comparison

|Dimension|Old|New|Δ|Score (0-100)|Direction|
|---|---|---|---|---|---|
|Hard Public: Size mix target match|48.4|65.5|17.04|65.5|target|
|Hard Combined: Size mix target match|47.5|65.6|18.11|65.6|target|
|Hard Reserve: Size mix target match|37.4|66.7|29.28|66.7|target|
|Standard Reserve: Avg generated-to-floor gap|8.3|6.5|-1.76|78.7|stable|
|Hard Public: Avg generated-to-floor gap|9.3|11.1|1.81|80.4|stable|
|Hard Combined: Avg generated-to-floor gap|9.2|11.0|1.78|80.7|stable|
|Hard Public: Dynamic moves / puzzle|16.7|19.5|2.84|82.9|stable|
|Hard Reserve: Avg generated-to-floor gap|8.3|9.7|1.40|83.1|stable|
|Hard Combined: Dynamic moves / puzzle|16.6|19.4|2.80|83.1|stable|
|Hard Public: Response events / puzzle|22.4|25.9|3.52|84.3|stable|
|Hard Combined: Response events / puzzle|22.3|25.8|3.47|84.4|stable|
|Hard Reserve: Dynamic moves / puzzle|15.5|17.8|2.38|84.6|stable|
|Hard Public: Avg target moves|24.0|27.5|3.51|85.4|stable|
|Hard Combined: Avg target moves|23.9|27.3|3.46|85.5|stable|
|Standard Reserve: Dynamic moves / puzzle|15.5|13.3|-2.19|85.8|stable|
|Hard Reserve: Response events / puzzle|20.9|23.9|2.96|85.8|stable|
|Hard Reserve: Avg target moves|22.5|25.4|2.97|86.8|stable|
|Standard Reserve: Terrain coverage|7|7|0.00|87.5|higher|
|Hard Public: Avg minimum moves|14.7|16.4|1.69|88.5|stable|
|Hard Combined: Avg minimum moves|14.7|16.4|1.68|88.5|stable|
|Hard Reserve: Avg minimum moves|14.2|15.8|1.58|88.9|stable|
|Standard Reserve: Response events / puzzle|20.9|18.8|-2.11|89.9|stable|
|Standard Reserve: Avg target moves|22.5|20.3|-2.21|90.2|stable|
|Standard Combined: Avg generated-to-floor gap|9.2|8.4|-0.81|91.1|stable|
|Standard Public: Avg generated-to-floor gap|9.3|8.5|-0.72|92.2|stable|
|Hard Reserve: Avg blocker impact|30.4|28.2|-2.23|92.7|stable|
|Standard Reserve: Avg blocker impact|30.4|28.3|-2.18|92.8|stable|
|Standard Combined: Dynamic moves / puzzle|16.6|15.6|-0.98|94.1|stable|
|Standard Public: Dynamic moves / puzzle|16.7|15.8|-0.87|94.8|stable|
|Standard Combined: Response events / puzzle|22.3|21.3|-0.99|95.6|stable|
|Standard Combined: Avg target moves|23.9|22.8|-1.03|95.7|stable|
|Standard Public: Response events / puzzle|22.4|21.5|-0.88|96.1|stable|
|Standard Public: Avg target moves|24.0|23.1|-0.92|96.2|stable|
|Standard Reserve: Avg minimum moves|14.2|13.8|-0.45|96.8|stable|
|Standard Combined: Avg blocker impact|31.9|31.1|-0.79|97.5|stable|
|Standard Public: Avg blocker impact|32.0|31.3|-0.66|97.9|stable|
|Standard Combined: Avg minimum moves|14.7|14.4|-0.22|98.5|stable|
|Standard Public: Avg minimum moves|14.7|14.5|-0.20|98.6|stable|
|Hard Combined: Avg blocker impact|31.9|31.5|-0.33|99.0|stable|
|Hard Public: Avg blocker impact|32.0|31.9|-0.15|99.5|stable|
|Standard Public: Puzzle count|365|750|385.00|100.0|target|
|Standard Public: Duplicate IDs|0|0|385.00|100.0|lower|
|Standard Public: Duplicate layouts|0|0|0.00|100.0|lower|
|Standard Public: Player-gate failures|0|0|0.00|100.0|lower|
|Standard Public: Difficulty mix target match|65.5|100.0|34.53|100.0|target|
|Standard Public: Size mix target match|65.5|100.0|34.53|100.0|target|
|Standard Public: Release moves per puzzle|0.0|0.0|0.00|100.0|stable|
|Standard Public: Tag coverage|8|8|0.00|100.0|higher|
|Standard Public: Terrain coverage|8|8|0.00|100.0|higher|
|Standard Reserve: Puzzle count|35|72|37.00|100.0|target|
|Standard Reserve: Duplicate IDs|0|0|37.00|100.0|lower|
|Standard Reserve: Duplicate layouts|0|0|0.00|100.0|lower|
|Standard Reserve: Player-gate failures|0|0|0.00|100.0|lower|
|Standard Reserve: Difficulty mix target match|65.4|100.0|34.58|100.0|target|
|Standard Reserve: Size mix target match|65.4|100.0|34.58|100.0|target|
|Standard Reserve: Release moves per puzzle|0.0|0.0|0.00|100.0|stable|
|Standard Reserve: Tag coverage|8|8|0.00|100.0|higher|
|Standard Combined: Puzzle count|400|822|422.00|100.0|target|
|Standard Combined: Duplicate IDs|0|0|422.00|100.0|lower|
|Standard Combined: Duplicate layouts|0|0|0.00|100.0|lower|
|Standard Combined: Player-gate failures|0|0|0.00|100.0|lower|
|Standard Combined: Difficulty mix target match|65.5|100.0|34.53|100.0|target|
|Standard Combined: Size mix target match|65.5|100.0|34.53|100.0|target|
|Standard Combined: Release moves per puzzle|0.0|0.0|0.00|100.0|stable|
|Standard Combined: Tag coverage|8|8|0.00|100.0|higher|
|Standard Combined: Terrain coverage|8|8|0.00|100.0|higher|
|Hard Public: Puzzle count|365|750|385.00|100.0|target|
|Hard Public: Duplicate IDs|0|0|385.00|100.0|lower|
|Hard Public: Duplicate layouts|0|0|0.00|100.0|lower|
|Hard Public: Player-gate failures|0|0|0.00|100.0|lower|
|Hard Public: Difficulty mix target match|65.5|100.0|34.53|100.0|target|
|Hard Public: Release moves per puzzle|0.0|0.0|0.00|100.0|stable|
|Hard Public: Tag coverage|8|8|0.00|100.0|higher|
|Hard Public: Terrain coverage|8|8|0.00|100.0|higher|
|Hard Reserve: Puzzle count|35|72|37.00|100.0|target|
|Hard Reserve: Duplicate IDs|0|0|37.00|100.0|lower|
|Hard Reserve: Duplicate layouts|0|0|0.00|100.0|lower|
|Hard Reserve: Player-gate failures|0|0|0.00|100.0|lower|
|Hard Reserve: Difficulty mix target match|65.4|100.0|34.58|100.0|target|
|Hard Reserve: Release moves per puzzle|0.0|0.0|0.00|100.0|stable|
|Hard Reserve: Tag coverage|8|8|0.00|100.0|higher|
|Hard Reserve: Terrain coverage|7|8|1.00|100.0|higher|
|Hard Combined: Puzzle count|400|822|422.00|100.0|target|
|Hard Combined: Duplicate IDs|0|0|422.00|100.0|lower|
|Hard Combined: Duplicate layouts|0|0|0.00|100.0|lower|
|Hard Combined: Player-gate failures|0|0|0.00|100.0|lower|
|Hard Combined: Difficulty mix target match|65.5|100.0|34.53|100.0|target|
|Hard Combined: Release moves per puzzle|0.0|0.0|0.00|100.0|stable|
|Hard Combined: Tag coverage|8|8|0.00|100.0|higher|
|Hard Combined: Terrain coverage|8|8|0.00|100.0|higher|
