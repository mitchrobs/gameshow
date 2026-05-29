# Composed Editorial Review Guide

Composed quality is not just dictionary quality. A day is good when the center, Sweep, timed scoring ladder, and accepted word boundary all feel like one intentional five-minute puzzle.

## Review Goals

- Protect the center as the daily identity.
- Make every Sweep feel like a satisfying prestige solve.
- Keep Mastered fair for a strong five-minute run.
- Keep core words familiar enough to define Form progress.
- Let bonus words absorb plausible edge cases without making them required.

## Day Feel Labels

- **Open**: 1-letter center. The day should feel fast, generous, and word-rich. Risk: too many words for Mastered.
- **Focused**: 2-letter center. This is the signature Composed lane. The center should feel like a useful word fragment, not a trap.
- **Tight**: 3-letter center. The day should feel compact and special. Risk: a forced Sweep or too few natural entry points.
- **Heavy**: Mastered requires a lot of high-value words even under an optimistic solve order.
- **Dry**: The puzzle is technically valid but leans bureaucratic, clinical, institutional, grim, or suffix-heavy.
- **Crowded**: Too many words come from the same inflection or family, making the day feel repetitive.

## Pass Order

1. **Sweep Prestige Pass**
   Review every flagged Sweep before touching the rest of the day. A weak Sweep should trigger a regenerate or denylist decision because Mastered depends on it.

2. **Center Feel Pass**
   Judge whether the center is a satisfying anchor:
   - 1-letter centers need flow and variety.
   - 2-letter centers need strong fragment identity.
   - 3-letter centers need natural words and a non-forced Sweep.

3. **Timed Mastery Pass**
   Use the optimistic Mastered word estimate as a lower bound. If even best-first scoring needs too many words, the day may be too heavy for five minutes.

4. **Core/Bonus Boundary Pass**
   Core words should feel fair to require for Form. Bonus words should be accepted but nonessential. Promote common bonus words only when they improve trust without making ranks harder.

5. **Opening Run Pass**
   Review the first 30 days as a product experience. The opening run should teach the range: open, focused, tight, and delightful Sweeps.

6. **Second Reader Pass**
   Any day marked regenerate, denylist, or promote/demote should get a second read before rebuilding the pack.

## Sweep Decisions

- **Approve**: Natural, satisfying, and worth starring.
- **Allow but monitor**: Acceptable, but not charming enough to use often.
- **Deny as Sweep**: Valid word, but too dry or awkward for prestige.
- **Deny entirely**: Proper-feeling, offensive, obscure, or trust-breaking as an accepted word.
- **Regenerate day**: The center/Sweep combination does not have a better local fix.

## Center Decisions

- **Keep**: The center creates natural entries and the Sweep feels built around it.
- **Keep as rare texture**: Interesting but sharp; fine if not clustered near similar days.
- **Regenerate**: Center produces samey forms, obscure words, or a forced Sweep.
- **Deny center fragment**: Add to generator key-fragment penalties or denylist when the fragment repeatedly causes awkward days.

## Core/Bonus Decisions

- **Core stays core** when a regular word-game player could reasonably know and find it.
- **Core demotes to bonus** when it is valid but niche, variant-like, highly technical, or region-specific.
- **Bonus promotes to core** when it is common enough that rejection from Form progress would feel stingy.
- **Word denied** when acceptance itself would reduce trust.

## Review Notes Template

Use this shape when recording manual decisions:

```text
Date:
Center / Letters:
Day feel:
Sweep decision:
Core/bonus decision:
Timed fairness:
Action:
Second reader:
```

## Final Gate

A pack is editorially ready only when:

- The generated pack audit has zero live errors and warnings.
- Every Priority A hard blocker has been resolved by regeneration, denylist, or explicit allowlist.
- Opening 30 days have been read in order.
- Any denylist or regenerate action has been applied and the pack regenerated.
- The regenerated pack has a fresh review queue with no unresolved Priority A blockers.
