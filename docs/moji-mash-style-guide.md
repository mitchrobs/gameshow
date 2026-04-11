# Moji Mash Style Guide

The editorial reference for creating great Moji Mash puzzles. The `moji-mash-editor` agent reads this file at the start of each brainstorming session.

---

## What Is a Moji Mash?

A Moji Mash puzzle is a single "genmoji" image — an emoji-style cartoon that visually blends 2–4 words into one picture — and the player must guess all the original words. A great puzzle has an **"aha!" moment**: the image looks strange or funny until you figure it out, and then it's instantly obvious.

---

## The Four Winning Patterns

### 1. Idioms & Compound Phrases
The most satisfying category. The words form a phrase (idiomatic or literal) that most people recognize, but the genmoji depicts it *literally*.

| Words | Why it works |
|---|---|
| `party`, `pooper` | Classic idiom — literally a party hat on a pile of poop |
| `shotgun`, `wedding` | Idiom with a sharp literal image |
| `pyramid`, `scheme` | Financial fraud visualized as a literal pyramid with money |
| `bike`, `share` | Modern concept, clean two-object visual |
| `plane`, `crash` | Blunt phrase — visually unambiguous |
| `date`, `night` | Romantic idiom — a calendar date + a nighttime sky |
| `oil`, `money` | Energy economics, literally an oil derrick dripping dollars |
| `green`, `machine` | Eco/slang phrase — a machine painted green |

**Signal**: if you can imagine the phrase on a T-shirt or a sticker, it's probably good here.

### 2. Absurd Creature / Object Mashups
Two nouns that have no business being combined. The comedy is the point. Visually distinctive individual elements that form a surreal whole.

| Words | Why it works |
|---|---|
| `disco`, `cactus` | Both visually bold; cactus in a disco ball outfit is absurd and delightful |
| `hedgehog`, `ninja` | Spiky + stealthy — instant character |
| `grumpy`, `rainbow` | Emotion + weather — an angry frowning rainbow is hilarious |
| `magic`, `horse` | Unicorn without saying "unicorn" — clever misdirect |
| `fire`, `helmet`, `dog` | Dalmatian fire-dog — familiar mascot, three distinct elements |
| `city`, `llama`, `family` | Absurd urban-nature mashup |

**Signal**: Would this be a funny sticker you'd put on your laptop? Good.

### 3. Literal Multi-Part Objects
The words together name one recognizable thing. Less punny, more observational. Works best when the compound is specific enough to be unmistakable.

| Words | Why it works |
|---|---|
| `espresso`, `machine` | Single iconic appliance, two words |
| `air`, `bed`, `mattress` | Specific product type — inflatable bed |
| `chandelier`, `glass` | Crystal chandelier — elegant image |
| `carrot`, `cake`, `icing` | Layered cake — three visual layers |
| `penguin`, `mountain`, `snow` | Antarctic scene — three elements form one coherent image |

**Signal**: The image should show one coherent thing, not a collage.

### 4. Cultural & Seasonal References
Themed around recognizable cultural touchstones, holidays, or brands. These are best used with a `date` pin so they appear on the right day.

| Words | Why it works |
|---|---|
| `spaghetti`, `western` | Film genre — Italian food + cowboy setting |
| `christmas`, `ham` | Holiday meal — unmistakable image |
| `clover`, `party`, `holiday` | St. Patrick's Day — shamrock + celebration |
| `pumpkin`, `shaped`, `chocolate`, `candy` | Halloween candy — very specific |
| `red`, `bull` | Energy drink brand = literal red bull animal |
| `spicy`, `curry` | Cuisine with visual heat indicators |

**Signal**: A player who knows the reference should immediately recognize the image.

---

## Word Quality Rules

### Concrete nouns and modifiers ✅
Words that refer to physical things or observable qualities:
`dog`, `fire`, `rainbow`, `machine`, `spicy`, `wedding`, `cactus`, `mountain`, `glass`

### Abstract concepts ❌
Words that exist as ideas only — difficult or impossible to depict unambiguously:
`freedom`, `trust`, `luck`, `power`, `justice`, `peace`, `hope`, `chaos`

### Borderline words — use carefully ⚠️
Words that are abstract but have a visual shorthand:
- `magic` → wand + sparkles ✅
- `party` → balloons + confetti ✅
- `money` → dollar bills ✅
- `scheme` → alone is abstract, but `pyramid scheme` works because the pyramid IS the visual
- `night` → moon + stars ✅
- `return` → boomerang or arrow looping back ✅

---

## Word Reuse Policy

Any single word may appear in at most **2 puzzles** across the entire pool. Check `mojiMashPuzzles.ts` before proposing. `generate_moji.py` will warn you if you exceed this.

Current words at or near the limit (check file for current state):
- `machine` appears in `espresso machine` and `green machine` (limit reached)
- `party` appears in `party pooper` and `clover party holiday` (limit reached)
- `red` appears in `red bull` — one slot remaining
- `mountain` appears in `penguin mountain snow` — one slot remaining

---

## Current Puzzle Pool

All 29 existing puzzles, tagged by category:

| Slug | Words | Category |
|---|---|---|
| air-bed-mattress | air, bed, mattress | literal |
| attic-stove | attic, stove | literal |
| bike-share | bike, share | idiom |
| carrot-cake-icing | carrot, cake, icing | literal |
| chandelier-glass | chandelier, glass | literal |
| christmas-ham | christmas, ham | cultural |
| city-llama-family | city, llama, family | absurd |
| clover-party-holiday | clover, party, holiday | cultural |
| date-night | date, night | idiom |
| disco-cactus | disco, cactus | absurd |
| espresso-machine | espresso, machine | literal |
| fire-helmet-dog | fire, helmet, dog | absurd |
| green-machine | green, machine | idiom |
| grumpy-rainbow | grumpy, rainbow | absurd |
| hedgehog-ninja | hedgehog, ninja | absurd |
| magic-horse | magic, horse | absurd |
| music-video | music, video | cultural |
| oil-money | oil, money | idiom |
| party-pooper | party, pooper | idiom |
| penguin-mountain-snow | penguin, mountain, snow | literal |
| plane-crash | plane, crash | idiom |
| pumpkin-shaped-chocolate-candy | pumpkin, shaped, chocolate, candy | cultural |
| pyramid-scheme | pyramid, scheme | idiom |
| red-bull | red, bull | cultural |
| roller-skates-rubber-duck | roller, skates, rubber, duck | absurd |
| shotgun-wedding | shotgun, wedding | idiom |
| spaghetti-western | spaghetti, western | cultural |
| spicy-curry | spicy, curry | cultural |
| very-obese-red-robin | very, obese, red, robin | absurd |

---

## Holiday Calendar

Suggested concepts by date. Mark with `date: 'YYYY-MM-DD'` when adding to the pool.

| Date / Event | Candidate Concepts |
|---|---|
| Jan 1 — New Year's | `champagne toast`, `midnight countdown`, `ball drop` |
| Feb 2 — Groundhog Day | `shadow groundhog`, `winter forecast` |
| Feb 14 — Valentine's Day | `candy heart`, `love letter`, `rose chocolate` |
| Mar 17 — St. Patrick's Day | `lucky charm`, `gold rainbow` *(clover-party-holiday exists)* |
| Easter (varies) | `bunny basket egg`, `spring egg hunt` |
| Apr 15 — Tax Day | `tax return`, `audit nightmare` |
| Apr 22 — Earth Day | `tree hug`, `solar panel garden`, `recycled earth` |
| May — Mother's Day | `breakfast bed bouquet`, `mother hen` |
| May — Memorial Day | `flag barbecue`, `parade float` |
| Jun — Father's Day | `dad joke crown`, `grill master` |
| Jul 4 — Independence Day | `firework flag`, `sparkler hot dog` |
| Sep — Labor Day | `backyard barbecue pool`, `summer closing` |
| Oct 31 — Halloween | `witch cauldron`, `ghost sheet` *(pumpkin-shaped-chocolate-candy exists)* |
| Nov — Thanksgiving | `turkey feast`, `pumpkin pie table` |
| Dec 25 — Christmas | `snowman gift` *(christmas-ham exists)* |
| Dec 31 — New Year's Eve | `countdown clock confetti`, `firework midnight` |

---

## Genmoji Prompt Template

```
an expressive emoji of <describe visual for word 1> and <describe visual for word 2>[, <word 3 visual>], cute cartoon sticker, thick outline, saturated colors, centered on white background
```

### Rules
- Open with `"an expressive emoji of"`
- Name a concrete visual element for **every word** — the model can't infer it
- Keep it ≤ 40 words
- Don't describe style twice (one mention of "cute cartoon sticker" is enough)
- Avoid negations ("not realistic") — describe what you want, not what you don't want

### Worked examples

**`spring cleaning`** (idiom)
```
an expressive emoji of spring flowers tied to a broom sweeping away dust clouds, cute cartoon sticker, thick outline, saturated colors, centered on white background
```

**`bunny basket egg`** (seasonal literal)
```
an expressive emoji of a cartoon bunny holding a wicker basket overflowing with pastel Easter eggs, cute cartoon sticker, thick outline, saturated colors, centered on white background
```

**`couch potato`** (idiom — a great future candidate)
```
an expressive emoji of a cartoon potato lounging on a small sofa holding a TV remote with a contented smile, cute cartoon sticker, thick outline, saturated colors, centered on white background
```

**`night owl`** (idiom — another good candidate)
```
an expressive emoji of a wide-eyed owl wearing a tiny nightcap perched on a crescent moon, cute cartoon sticker, thick outline, saturated colors, centered on white background
```

### Common mistakes

| Bad prompt | Problem | Fix |
|---|---|---|
| `"emoji of spring and cleaning"` | "spring" and "cleaning" aren't visualized | Describe the visual objects explicitly |
| `"cute emoji of a magical horse"` | misses "magic" as a distinct element | Add wand + sparkles so the word is "pointable" |
| `"emoji of a very complex scene with lots of details"` | too vague, model will hallucinate | Be specific about the 2–4 key elements |

---

## Evaluating Generated Images

A Moji Mash puzzle is a **three-way relationship** between concept, image, and player experience. All three must work:

- A clever concept with a mediocre image → forgettable
- A beautiful image that's too literal → no aha moment
- A perfect image of a weak concept → players solve it but feel nothing

Use the automated vision check plus the blind test to evaluate all three axes.

### The Scored Rubric (automated via `--check`)

Running `generate_moji.py --check` performs a two-pass evaluation on each variant:

**Pass 1 — Blind decode**: Claude describes what it sees without knowing the answer. This simulates a player's first look. Answer words absent from the blind decode are flagged ⚠.

**Pass 2 — Scored rubric**: given the answer words, Claude scores 5 dimensions (1–5):

| Dimension | What it measures | Target | Flag if… |
|---|---|---|---|
| `word_clarity` | All answer words visible and pointable? | 4–5 | ≤ 2: a word is missing |
| `visual_appeal` | Charming, expressive, funny as a sticker? | 4–5 | ≤ 2: flat and generic |
| `concept_synergy` | Unified creative scene vs. literal word collage? | 4–5 | ≤ 2: just objects next to each other |
| `guessability` | How likely is a player to guess all words? | **3–4** | ≤ 1: unsolvable; ≥ 5: trivially easy |
| `aha_factor` | How satisfying is the reveal moment? | 4–5 | ≤ 2: concept itself may be weak |

**Composite score** (max 25): sum of all dimensions, with guessability penalised when far from the sweet spot of 3–4. The contact sheet sorts variants by composite and stars the recommended one.

**Decision tree:**
- `word_clarity` ≤ 2 on all variants → rewrite prompt to foreground the missing element, regenerate
- `concept_synergy` ≤ 2 on all variants → redesign prompt around a single interacting scene
- `aha_factor` ≤ 2 on all variants → consider dropping the concept entirely
- Composite < 12/25 on all variants → concept + prompt combination isn't working; start over
- One strong variant (composite ≥ 18/25) → promote it with confidence

### The Guessability Dimension

Guessability is the most nuanced dimension — both extremes are wrong:

**Too easy (score 5)**: Answer is immediately obvious from a glance. The image is just a literal depiction with nothing to figure out. Players feel no satisfaction.

**Too hard (score 1)**: Key elements are invisible, ambiguous, or too abstract. Players give up. No aha moment because there's no way to get there.

**Sweet spot (score 3–4)**: Player sees something funny or weird. They can identify the elements if they look. The answer requires a moment of thought but feels completely fair in retrospect.

The `--check` flag will warn when guessability is outside 2–4. A single image that scores guessability=2 can still be good — it means the puzzle is on the challenging end, which is fine. Guessability=1 or guessability=5 both warrant regeneration.

### The Blind Test (manual)

The automated check simulates a player — but Claude may outperform average players on iconic references. Do a manual blind pass before final selection:

1. Open the contact sheet **without** reading the concept labels
2. Look at each image and say the first 2–3 words out loud
3. Write them down — this is your **first-read transcript**

If your spoken words overlap the answer, the image is doing its job. If they don't match, check which rubric dimension explains it: missing word (clarity), too much noise (synergy), or just hard (guessability).

Requires `ANTHROPIC_API_KEY` in your environment and `pip install anthropic`.

### The "Iconic Visual" Rule for Words

Word quality has a second dimension beyond "is this concrete?" — **does this word have an unambiguous iconic visual at emoji scale?**

Action words and relational concepts all need a declared visual shorthand in the prompt. Don't leave it for the model to infer:

| Word | Visual shorthand | Risk if left implicit |
|---|---|---|
| `return` | looping arrow (foregrounded) or boomerang | Boomerang reads as `boomerang`, not `return` |
| `share` | two hands exchanging an object | Renders as generic handshake |
| `crash` | impact sparks + crumple | Renders as explosion (→ `bomb`, `fire`) |
| `scheme` | dotted-line conspiracy board | Invisible without explicit description |
| `magic` | wand + sparkle burst | Renders as generic glitter |
| `night` | crescent moon + stars | Usually works without help |
| `green` | color applied to a recognizable object | Needs an object to apply to |

If a word doesn't have an iconic visual you can describe in ≤5 words, reconsider whether it belongs in the puzzle. The prompt must make every word pointable.

---

## First-Time Setup (open-genmoji)

Run once on your Apple Silicon Mac. open-genmoji lives **outside** the repo.

```bash
# 1. Clone open-genmoji
git clone https://github.com/EvanZhouDev/open-genmoji ~/tools/open-genmoji
cd ~/tools/open-genmoji

# 2. Create Python 3.11 venv
python3.11 -m venv .venv && source .venv/bin/activate

# 3. Install dependencies
pip install -U huggingface_hub mflux

# 4. Authenticate with HuggingFace
#    You must accept the Flux.1 Dev license at https://huggingface.co/black-forest-labs/FLUX.1-dev
huggingface-cli login

# 5. Download LoRA weights (~209MB)
python3 download.py

# 6. Smoke test (~45s on M2)
python3 genmoji.py "couch potato" --direct
# Should produce a 160x160 PNG of a cartoon potato on a couch in the repo root
```

To use a custom path, set:
```bash
export OPEN_GENMOJI_PATH=~/tools/open-genmoji
```

---

## Licensing

Flux.1 Dev is licensed under the [Flux.1 Dev Non-Commercial License](https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/LICENSE.md). Generated images may only be used for **non-commercial purposes**. The gameshow site must remain free of advertising, paid features, or monetization for generated genmoji to be compliant.

---

## Running a Batch Session

```
# In Claude Code:
/agents moji-mash-editor draft 8 candidates for May 2026
```

The agent will:
1. Read this file and `mojiMashPuzzles.ts`
2. Brainstorm 24 concepts, self-filter to 8
3. Generate 3 image variants per concept (24 PNGs total), running `--check` for automated vision evaluation
4. Open a review contact sheet at `tmp/moji-mash/<date>/index.html` with decoded-word overlays
5. Ask you to pick the best frame for each concept (use the blind test on variants flagged ⚠)
6. Promote winners and print a paste-ready TypeScript block

After pasting the entries into `mojiMashPuzzles.ts`, run:
```bash
npm run build:web
```
to verify the build succeeds before committing.
