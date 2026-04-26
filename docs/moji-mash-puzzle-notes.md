# Moji Mash Puzzle Notes

Per-puzzle design notes for the pool in `src/data/mojiMashPuzzles.ts`.
This file is read by the `analyze_pool` tool and by the agent at session start
so it can reason about the portfolio *qualitatively*, not just count tuples.

## Categories

Every puzzle is tagged with exactly one category. Batch quotas are enforced
at the portfolio level — see `docs/moji-mash-style-guide.md` for targets.

- **idiom** — answer is a common set phrase, pun, or figure of speech (e.g.
  `party pooper`, `pyramid scheme`, `spaghetti western`). High aha-factor,
  but prone to playtest rank-1 traps — use sparingly.
- **absurd** — a visually surprising mashup that has no single-word name
  (e.g. `hedgehog ninja`, `disco cactus`, `grumpy rainbow`). The engine of
  the game; the hardest to generate but the most satisfying when they land.
- **literal** — the words describe the scene at face value (e.g.
  `penguin mountain snow`, `fire helmet dog`). Easier to draw, lower
  aha-factor; good for rhythm and accessibility.
- **cultural** — pop-culture, holidays, or brand references
  (e.g. `christmas ham`, `red bull`, `music video`).

## Difficulty estimate

1–5 on the playtest scale, based on image + hint only:

- **5** — cracked on guess #1 (likely too easy; flag as trap)
- **4** — guessed in the top 2
- **3** — guessed in the top 3 (sweet spot)
- **2** — answer is rank 4–5
- **1** — answer not in the top 5 (likely unsolvable; flag)

Entries below marked `?` have not yet been anchor-calibrated — the anchor
suite (`docs/moji-mash-anchors.json`) will back-fill these.

## Fields

- `category` — one of the four tags above.
- `difficulty` — playtest rank estimate (int 1–5, or `?` if uncalibrated).
- `why_it_works` — what the puzzle is *for* in the portfolio.
- `notes` — gotchas, LoRA-behavior observations, variant quirks.

---

## Entries

### air-bed-mattress

- **category**: literal
- **difficulty**: ?
- **why_it_works**: 3-word literal scene, trains player on compound-word mechanic.
- **notes**: Redundant words (`air bed` ≈ `mattress`) — succeeds by showing a clearly inflated pool float rather than a household mattress.

### attic-stove

- **category**: literal
- **difficulty**: ?
- **why_it_works**: Two distinct, iconic objects with no idiomatic overlap — forces honest decoding.
- **notes**: Good counterweight to idiom-heavy weeks.

### bike-share

- **category**: cultural
- **difficulty**: ?
- **why_it_works**: Real-world product category (Lyft/Citibike). Rewards cultural literacy without being brand-locked.
- **notes**: Risk: LoRA defaults to generic bicycle; prompt must explicitly include the docking station or share-arrow.

### carrot-cake-icing

- **category**: literal
- **difficulty**: ?
- **why_it_works**: Specific dessert, three words, all visible. Shows the LoRA can carry three parallel nouns when one is a texture (icing).
- **notes**: Playtesters sometimes offer `frosting` — keep `icing` since the hint disambiguates.

### chandelier-glass

- **category**: literal
- **difficulty**: ?
- **why_it_works**: Redundant but aesthetically strong; good "gentle" daily.
- **notes**: Consider retiring or replacing — near-synonym pairs rarely earn their slot.

### christmas-ham

- **category**: cultural (pinned 2025-12-25)
- **difficulty**: ?
- **why_it_works**: Holiday anchor. Instantly readable on the target date.
- **notes**: Date-pinned — do NOT put another ham/holiday puzzle within 14 days.

### city-llama-family

- **category**: absurd
- **difficulty**: ?
- **why_it_works**: 3-word absurd scene; the llama-in-city gag is novel and memorable.
- **notes**: Strong example of what the absurd quota should look like.

### clover-party-holiday

- **category**: cultural (likely 2026-03-17)
- **difficulty**: ?
- **why_it_works**: St. Patrick's Day variant.
- **notes**: Consider date-pinning to 2026-03-17 explicitly.

### date-night

- **category**: idiom
- **difficulty**: ?
- **why_it_works**: Visual pun (fruit date + moon). Classic misdirection idiom.
- **notes**: ⚠ Likely playtest rank-1 trap — re-anchor. If too easy, retire to rare-rotation or swap for a harder puzzle.

### disco-cactus

- **category**: absurd
- **difficulty**: ?
- **why_it_works**: Strong absurd pairing; disco ball + spiky cactus is visually distinctive.
- **notes**: Exemplar of the "single-subject absurd mashup" framing.

### espresso-machine

- **category**: literal
- **difficulty**: ?
- **why_it_works**: Familiar object, two words.
- **notes**: Risk: the hint (`e, m`) lets players jump straight to the answer. Anchor-calibrate.

### fire-helmet-dog

- **category**: literal
- **difficulty**: ?
- **why_it_works**: 3-word literal scene (dalmation in helmet). Reads as "dalmation" or "firefighter dog" — the hint disambiguates.
- **notes**: Common playtester miss: `firefighter`, `dalmatian`. Accept this as healthy rank-3.

### ghost-pepper

- **category**: idiom
- **difficulty**: 5 (playtest rank-1 on generation)
- **why_it_works**: Visually clean: ghost-shaped pepper.
- **notes**: ⚠ Too easy — smoke test flagged this as a rank-1 trap. Flag for retirement unless we regenerate with a harder framing (e.g. bell pepper with ghost overlay rather than ghost-shaped pepper).

### green-machine

- **category**: idiom
- **difficulty**: ?
- **why_it_works**: Phrase-level pun; generic "green + machine" visual.
- **notes**: Weakest-category idiom — the phrase is loose enough that many visuals satisfy it. Consider replacing.

### grumpy-rainbow

- **category**: absurd
- **difficulty**: ?
- **why_it_works**: Emotion + object mashup — good training for the "adjective + noun" absurd pattern.
- **notes**: Anchor candidate for "medium" difficulty.

### hedgehog-ninja

- **category**: absurd
- **difficulty**: ?
- **why_it_works**: Gold standard for absurd category. Two specific, iconic nouns; LoRA renders both.
- **notes**: Medium-difficulty anchor candidate.

### magic-horse

- **category**: absurd (borderline cultural — unicorn)
- **difficulty**: ?
- **why_it_works**: Simple 2-word image.
- **notes**: Risk: players answer `unicorn` first. Possibly retire unless reframed.

### music-video

- **category**: cultural
- **difficulty**: ?
- **why_it_works**: Compound noun; easy daily.
- **notes**: May land as rank-1 (compound nouns often do). Anchor-check.

### oil-money

- **category**: idiom
- **difficulty**: ?
- **why_it_works**: Visual metaphor — oil barrel + cash.
- **notes**: Strong candidate; keep.

### party-pooper

- **category**: idiom
- **difficulty**: 5 (known easy anchor)
- **why_it_works**: Classic idiom with literal-visual payoff (sad face at party).
- **notes**: Reserved as the "easy" anchor for the calibration suite.

### penguin-mountain-snow

- **category**: literal
- **difficulty**: ?
- **why_it_works**: 3-word literal scene; all three elements render cleanly.
- **notes**: Risk: all three are ~co-occurring words. Could be too easy.

### plane-crash

- **category**: literal
- **difficulty**: ?
- **why_it_works**: Dramatic 2-word scene; distinct from idiomatic crashes.
- **notes**: Tone check: keep it cartoony, not graphic.

### pumpkin-shaped-chocolate-candy

- **category**: literal (seasonal — consider 2026-10-31 pin)
- **difficulty**: ? (likely hard — 4-word)
- **why_it_works**: Hard anchor candidate. 4 words pushes the format limit.
- **notes**: Reserved as a "hard" anchor for calibration. Verify LoRA handles 4 nouns without dropping one.

### pyramid-scheme

- **category**: idiom
- **difficulty**: ? (medium anchor candidate)
- **why_it_works**: Strong idiom — literal pyramid + dollar signs plays the pun overtly.
- **notes**: Medium-difficulty anchor.

### red-bull

- **category**: cultural
- **difficulty**: ?
- **why_it_works**: Brand reference + literal (red + bull). Double-read puzzle.
- **notes**: Legal: OK because we're not using the logo. Risk of rank-1 if the LoRA draws a can.

### roller-skates-rubber-duck

- **category**: absurd
- **difficulty**: ? (hard anchor candidate)
- **why_it_works**: 4-word absurd mashup; duck wearing skates is a memorable gag.
- **notes**: Reserved as a "hard" anchor for calibration.

### shotgun-wedding

- **category**: idiom
- **difficulty**: ?
- **why_it_works**: Cultural-idiom overlap; visually iconic (shotgun + wedding dress).
- **notes**: Tone risk — keep cartoon; no realism.

### spaghetti-western

- **category**: idiom (film-genre)
- **difficulty**: ?
- **why_it_works**: Genre pun; spaghetti bowl + cowboy hat.
- **notes**: Good medium-difficulty idiom; cultural literacy required.

### spicy-curry

- **category**: literal
- **difficulty**: ?
- **why_it_works**: Near-redundant (`spicy curry` ≈ `curry`). Accessible daily.
- **notes**: Consider retiring or swapping in a distinct second word.

### very-obese-red-robin

- **category**: absurd
- **difficulty**: ? (hard anchor candidate)
- **why_it_works**: 4-word, comic adjective stack. LoRA handles the comic-obese render surprisingly well.
- **notes**: Reserved as a "hard" anchor for calibration.
