# Liberties Player-Agent Report

Standard public puzzles tested: 365
Standard reserve puzzles tested: 72
Standard combined pool tested: 437
Hard public puzzles tested: 365
Hard reserve puzzles tested: 72
Hard combined pool tested: 437

| Pool | Persona | Solve rate | Median solve | Avg hints | Avg resets | Unclear-rule flags | Frustration flags |
|---|---|---:|---:|---:|---:|---:|---:|
| standard-public | First-time logic player | 100% | 5:44 | 1.98 | 0.01 | 24 | 0 |
| standard-public | LinkedIn Queens/Tango casual | 100% | 5:36 | 1.00 | 0.00 | 0 | 0 |
| standard-public | NYT Pips-style visual solver | 100% | 5:22 | 0.94 | 0.00 | 0 | 0 |
| standard-public | Sudoku/Bridges optimizer | 100% | 5:02 | 0.12 | 0.00 | 0 | 0 |
| standard-public | Go-aware tactical reader | 100% | 4:48 | 0.00 | 0.00 | 0 | 0 |
| standard-public | Impatient mobile tapper | 100% | 5:34 | 1.56 | 0.04 | 0 | 0 |
| standard-public | Accessibility / low-vision reviewer | 100% | 5:40 | 1.29 | 0.00 | 0 | 0 |
| standard-reserve | First-time logic player | 100% | 5:42 | 1.85 | 0.00 | 0 | 0 |
| standard-reserve | LinkedIn Queens/Tango casual | 100% | 5:35 | 1.00 | 0.00 | 0 | 0 |
| standard-reserve | NYT Pips-style visual solver | 100% | 5:21 | 1.00 | 0.00 | 0 | 0 |
| standard-reserve | Sudoku/Bridges optimizer | 100% | 5:00 | 0.01 | 0.00 | 0 | 0 |
| standard-reserve | Go-aware tactical reader | 100% | 4:46 | 0.00 | 0.00 | 0 | 0 |
| standard-reserve | Impatient mobile tapper | 100% | 5:32 | 1.38 | 0.00 | 0 | 0 |
| standard-reserve | Accessibility / low-vision reviewer | 100% | 5:38 | 1.19 | 0.00 | 0 | 0 |
| standard-combined | First-time logic player | 100% | 5:43 | 1.96 | 0.01 | 24 | 0 |
| standard-combined | LinkedIn Queens/Tango casual | 100% | 5:36 | 1.00 | 0.00 | 0 | 0 |
| standard-combined | NYT Pips-style visual solver | 100% | 5:22 | 0.95 | 0.00 | 0 | 0 |
| standard-combined | Sudoku/Bridges optimizer | 100% | 5:01 | 0.10 | 0.00 | 0 | 0 |
| standard-combined | Go-aware tactical reader | 100% | 4:47 | 0.00 | 0.00 | 0 | 0 |
| standard-combined | Impatient mobile tapper | 100% | 5:33 | 1.53 | 0.03 | 0 | 0 |
| standard-combined | Accessibility / low-vision reviewer | 100% | 5:39 | 1.28 | 0.00 | 0 | 0 |
| hard-public | First-time logic player | 100% | 12:05 | 2.10 | 0.01 | 35 | 0 |
| hard-public | LinkedIn Queens/Tango casual | 100% | 11:49 | 1.04 | 0.00 | 0 | 0 |
| hard-public | NYT Pips-style visual solver | 100% | 11:20 | 1.00 | 0.00 | 0 | 0 |
| hard-public | Sudoku/Bridges optimizer | 100% | 10:36 | 0.17 | 0.00 | 0 | 0 |
| hard-public | Go-aware tactical reader | 100% | 10:06 | 0.00 | 0.00 | 0 | 0 |
| hard-public | Impatient mobile tapper | 100% | 11:43 | 1.95 | 0.06 | 0 | 0 |
| hard-public | Accessibility / low-vision reviewer | 100% | 11:57 | 1.62 | 0.00 | 0 | 0 |
| hard-reserve | First-time logic player | 100% | 12:02 | 2.00 | 0.00 | 0 | 0 |
| hard-reserve | LinkedIn Queens/Tango casual | 100% | 11:47 | 1.00 | 0.00 | 0 | 0 |
| hard-reserve | NYT Pips-style visual solver | 100% | 11:18 | 1.00 | 0.00 | 0 | 0 |
| hard-reserve | Sudoku/Bridges optimizer | 100% | 10:33 | 0.00 | 0.00 | 0 | 0 |
| hard-reserve | Go-aware tactical reader | 100% | 10:04 | 0.00 | 0.00 | 0 | 0 |
| hard-reserve | Impatient mobile tapper | 100% | 11:40 | 1.63 | 0.00 | 0 | 0 |
| hard-reserve | Accessibility / low-vision reviewer | 100% | 11:54 | 1.07 | 0.00 | 0 | 0 |
| hard-combined | First-time logic player | 100% | 12:04 | 2.08 | 0.00 | 35 | 0 |
| hard-combined | LinkedIn Queens/Tango casual | 100% | 11:49 | 1.03 | 0.00 | 0 | 0 |
| hard-combined | NYT Pips-style visual solver | 100% | 11:20 | 1.00 | 0.00 | 0 | 0 |
| hard-combined | Sudoku/Bridges optimizer | 100% | 10:36 | 0.14 | 0.00 | 0 | 0 |
| hard-combined | Go-aware tactical reader | 100% | 10:06 | 0.00 | 0.00 | 0 | 0 |
| hard-combined | Impatient mobile tapper | 100% | 11:43 | 1.89 | 0.05 | 0 | 0 |
| hard-combined | Accessibility / low-vision reviewer | 100% | 11:57 | 1.53 | 0.00 | 0 | 0 |

## Interpretation

- The agent gate models Daybreak newcomers, LinkedIn-style daily players, NYT Pips visual solvers, existing logic optimizers, Go-aware players, impatient mobile players, and accessibility review.
- The pass target for this build is a Standard median near 4:45-5:45, a Hard median near 9:00-12:00, high solve rate, and no repeated rule-confusion concentration in one persona.
- These are simulated player agents, not a substitute for real external human testing.
