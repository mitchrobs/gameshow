# Barter puzzle generation: macro-strategy flowchart examples

This document captures five internal puzzle archetypes for generator validation.  
These are **not** player-facing labels; they are internal quality targets.

## 1) Engine vs Sprint

```mermaid
flowchart TD
  A[Start inventory] --> B{Turn 1 decision}
  B -->|Engine: trade for versatile intermediate| C[Lower immediate goal progress]
  B -->|Sprint: trade directly toward goal| D[Higher immediate goal progress]
  C --> E{Turn 2-3}
  D --> F{Turn 2-3}
  E -->|More affordable options| G[Late window: flexible finish]
  F -->|Fewer affordable options| H[Late window: tighter lines]
  G --> I[Outcome: safer solve, maybe +1 trade]
  H --> J[Outcome: faster solve if no miss]
```

Player tradeoff: short-term tempo vs long-term flexibility.

---

## 2) Hedge vs Concentrate

```mermaid
flowchart TD
  A[Start inventory] --> B{Early window}
  B -->|Hedge: hold fee goods + split resources| C[Lower concentration]
  B -->|Concentrate: push one pipeline| D[Higher concentration]
  C --> E{Late fees apply}
  D --> E
  E -->|Hedge branch| F[Absorb fees, slower conversion]
  E -->|Concentrate branch| G[Higher upside, higher fragility]
  F --> H[Consistent completion]
  G --> I[Either quick finish or stall]
```

Player tradeoff: robustness vs peak efficiency.

---

## 3) Tempo vs Value

```mermaid
flowchart TD
  A[Turn N inventory] --> B{Take trade now?}
  B -->|Yes, immediate affordable line| C[Consume scarce input]
  B -->|No, wait for better exchange| D[Preserve scarce input]
  C --> E[Guaranteed path but lower net value]
  D --> F{Can you still hit timing threshold?}
  F -->|Yes| G[Higher value route]
  F -->|No| H[Window lock penalty]
  E --> I[Finish within cap]
  G --> I
  H --> J[Likely needs recovery line]
```

Player tradeoff: timing certainty vs exchange efficiency.

---

## 4) Robust vs Greedy

```mermaid
flowchart TD
  A[Opening state] --> B{Choose policy}
  B -->|Greedy EV line| C[Max immediate gain]
  B -->|Robust line| D[Slightly lower gain]
  C --> E{If one key trade misses timing}
  D --> F{If one key trade misses timing}
  E -->|Miss| G[Large regret / stall risk]
  E -->|Hit| H[Best-score finish]
  F -->|Miss| I[Still recoverable]
  F -->|Hit| J[Solid score finish]
```

Player tradeoff: upside maximization vs regret minimization.

---

## 5) Sacrifice-and-Recover detour

```mermaid
flowchart TD
  A[Midgame inventory] --> B{Take reverse/side-grade trade?}
  B -->|No| C[Stay direct path]
  B -->|Yes| D[Temporary downgrade]
  C --> E[Needs exact follow-up chain]
  D --> F[Unlock alternate conversion graph]
  E --> G{Late window pressure}
  F --> G
  G -->|Direct branch| H[High precision required]
  G -->|Detour branch| I[More route redundancy]
  H --> J[Fast if clean]
  I --> K[Safer if earlier turns were imperfect]
```

Player tradeoff: apparent backward move now for wider comeback potential later.
