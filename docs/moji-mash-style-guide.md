# Moji Mash Style Guide

The editorial reference for creating great Moji Mash puzzles. The `moji-mash-editor` agent reads this file at the start of each brainstorming session.

---

## What Is a Moji Mash?

A Moji Mash puzzle is a single "genmoji" image — an emoji-style cartoon that visually blends 2–4 words into one picture — and the player must guess all the original words. A great puzzle has an **"aha!" moment**: the image looks strange or funny until you figure it out, and then it's instantly obvious.

---

## Portfolio Quotas

A great 365-day calendar is a *mix*, not 365 of the same pattern. Idioms feel clever but collapse the player's search space — once the phrase clicks, the puzzle is over, and the Pass-3 playtest will catch that (playtest_difficulty=5). Cap them. The absurd and literal categories take more brainstorming effort but produce the most memorable puzzles, because the player actually has to *look* at the image.

| Category | Target share | Player experience |
|---|---|---|
| Idiom / phrase | **≤ 25%** | Phrase clicks and the puzzle snaps closed |
| Absurd combo | **30–35%** | No phrase to fall back on; player enumerates |
| Literal compound | **20–25%** | Observational; single named object in parts |
| Cultural / seasonal | **15–20%** | Reference lands if you know it |

When drafting a batch, brainstorm *per-category* — not freeform, converge, and tag. Freeform brainstorming over-rewards idioms because they're the easiest to invent. The four patterns below are in deliberate balance; read all four before drafting.

---

## The Four Winning Patterns

### 1. Idioms & Compound Phrases
The most immediately satisfying category — but use them sparingly. The words form a phrase most people recognize; the genmoji depicts it *literally*. Great in small doses, but if a player spots the phrase in the image they don't really play the puzzle. **Use only when the literal image misdirects away from the phrase** (e.g. `party pooper` depicted as a poop wearing a party hat — looks like a sad poop first, phrase lands second).

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

We're not writing a free-form prompt — we're writing for the **open-genmoji LoRA**
(see `~/tools/open-genmoji/metaprompt/open-genmoji.md` for the canonical spec).
The trigger word is literally `emoji`. Phrases are separated by **periods**, not
commas. Style/lighting tokens are hard-coded at the tail.

### Canonical form

```
emoji of <subject description>. <addon phrase>. <addon phrase>. 3D lighting. no cast shadows.
```

### Hard rules (do not deviate)

- Open with exactly `emoji of`. No "an", no "expressive", no "cute" prefix — those words appear in addons later.
- Phrases end with a period (`.`). Treat the prompt as a list of declarative phrases, not a sentence.
- End **every** prompt with the literal tail `3D lighting. no cast shadows.` — these are the sticker-style anchor tokens the LoRA was trained on.
- **Never describe the background.** No "centered on white background", no "studio backdrop". The LoRA always renders on transparent/white; describing it fights training.
- **Never describe drop shadows or cast shadows.** The tail explicitly forbids them.
- Describe colors **per-part** ("red apple. green leaf.") rather than globally ("a red and green fruit").
- Keep the whole prompt ≤ 40 words.

### Conditional addons (apply only when they fit)

Add these as separate period-terminated phrases between the subject and the tail:

| Subject type | Addon | When to use |
|---|---|---|
| Non-object, non-human (animals, food, abstract subjects) | `cute.` | Almost always for these categories |
| Animal | `enlarged head in cartoon style.` | Apple-emoji style for any animal |
| Animal or human | `head is turned towards viewer.` | When a face is in frame |
| Object (tools, vehicles, food) | `detailed texture.` | Helps the LoRA push material detail |

If none apply, just go subject → tail.

### Single-subject discipline

The LoRA was trained on Apple emojis — **single subject, centered, no scene**. Multi-subject collages ("a man holding a coffee cup with a phone, books behind him") almost always look worse, regardless of how good the prompt is. Most weak Moji Mash variants from before Phase B failed here.

When a concept naturally splits across multiple subjects, before writing a prompt list **2–3 alternative single-subject framings** and let `check_concept` (multi-interpretation mode) pick the strongest. Examples:

| Concept | Multi-subject framing (bad) | Single-subject framings (good) |
|---|---|---|
| `couch potato` | a man on a sofa holding a potato | (a) anthropomorphised potato lounging on a sofa; (b) a potato-shaped person watching TV |
| `party pooper` | a poop emoji at a crowded party scene | (a) a sad poop wearing a tiny party hat; (b) a poop with a deflated balloon |
| `tax return` | a man at a desk with tax forms and money | (a) a tax form with money flying back via a looping arrow; (b) a calculator with a refund-shaped dollar bill |

Heuristics for picking:
- Anthropomorphise a single noun ("smiling potato lounging on sofa") instead of pairing two nouns ("man + couch")
- Reduce people/animals to single-subject scale; avoid named multi-character scenes
- A single subject with one or two interacting **props** is fine — it's the second subject that breaks
- When in doubt, draft both versions and run `check_concept` with both as `interpretations`

### Worked examples (LoRA-faithful)

**`spring cleaning`** (idiom — single-subject scene)
```
emoji of a cartoon broom sweeping pastel spring flowers and dust clouds. cute. detailed texture. 3D lighting. no cast shadows.
```

**`bunny basket egg`** (seasonal — animal subject)
```
emoji of a small bunny holding a wicker basket of pastel eggs. cute. enlarged head in cartoon style. head is turned towards viewer. 3D lighting. no cast shadows.
```

**`couch potato`** (idiom — anthropomorphised food)
```
emoji of a smiling potato lounging on a small green sofa with a TV remote. cute. enlarged head in cartoon style. head is turned towards viewer. 3D lighting. no cast shadows.
```

**`night owl`** (idiom — animal subject)
```
emoji of a wide-eyed owl wearing a tiny nightcap perched on a yellow crescent moon. cute. enlarged head in cartoon style. head is turned towards viewer. 3D lighting. no cast shadows.
```

**`tax return`** (object scene — no animal/human)
```
emoji of a tax form with a looping arrow returning a stack of dollar bills. detailed texture. 3D lighting. no cast shadows.
```

### Common mistakes

| Bad prompt | Problem | Fix |
|---|---|---|
| `an expressive emoji of …, cute cartoon sticker, thick outline, saturated colors, centered on white background` | Old template — fights LoRA. `centered on white background` makes the model render a literal painted backdrop. | Use the canonical form above. Never describe background. |
| `… with a subtle drop shadow.` | Directly contradicts the mandatory `no cast shadows.` tail. | Drop the shadow phrase entirely. |
| `emoji of spring and cleaning.` | "spring" and "cleaning" aren't visualized — both need a concrete depictable form. | Pick one unified subject that embodies both: `cartoon broom sweeping pastel spring flowers`. |
| `emoji of a magical horse.` | "magic" has no concrete form. | Make it pointable: `emoji of a horse with a glowing wand and sparkles`. |
| `emoji of a man holding a coffee cup with a phone, books behind him, …` | Too many elements; LoRA was trained on single-subject Apple emojis. | Reframe as one subject (`a coffee cup`) with one or two interacting props. |

---

## What the LoRA Has Seen

The open-genmoji LoRA is a Flux.1 Dev fine-tune on the Apple-emoji set — a few
hundred single-subject, centered, soft-shaded stickers. Its fluency is
strongly skewed toward concepts that *look like existing emojis*. Prompts that
stray from the training distribution degrade fast, no matter how carefully
worded. Plan around this.

### Categories the LoRA is fluent in

These render well on the first pass — expect a good variant in 2–3 tries:

- **Common animals** (cat, dog, owl, fox, bear, bunny, duck) — especially with
  `enlarged head in cartoon style` + `head is turned towards viewer`
- **Food** (fruit, pastry, hot meals in bowls, individual desserts) — add
  `detailed texture`
- **Household objects** (phone, clock, hat, key, suitcase) — clean renders
- **Vehicles** (car, plane, bike, train) — front/side profile is strongest
- **Celestial / weather** (sun, moon, cloud, star, rainbow)
- **Clothing & accessories** (shoe, ring, tie, crown) — iconic outlines
- **Faces & hands** — as small accents on another subject

### Categories that struggle

Expect more regenerations or a fundamentally different framing:

- **Named humans / characters** — ninja, chef, cowboy — shapes work but
  identity drifts; treat as generic-role costume on an animal/object
- **Multi-figure scenes** — any time you want two agents interacting, it
  collapses. See "Single-subject discipline" above.
- **Actions / verbs** — `sweeping`, `sharing`, `crashing` — the LoRA has no
  reference for motion. Fake it with a prop (broom = sweeping; sparks = crash)
- **Text / logos** — readable words almost never render. Keep brand marks
  implicit (color + silhouette, not wordmark)
- **Architecture at distance** — buildings become blobs; zoom into one element
  (a door, a chimney) instead
- **Liquid in motion** — waterfalls, splashes — LoRA smears them; use a glass
  with a stylized wave instead

### Framings that succeed

Patterns we've seen score 4–5 on word_clarity + style_fidelity:

- `emoji of a <cute animal> wearing a <tiny costume element>` — the
  `tiny` keeps the prop from eating the subject
- `emoji of a <object> with <contrasting color detail>` — color asymmetry
  is the LoRA's favourite trick
- `emoji of a smiling <anthropomorphised food>` — potato, avocado, pepper
  all take faces well
- `emoji of a <object> made of <material>` — chocolate key, glass flower
  — the material-swap LoRA-clicks reliably

### Framings that fail

If your prompt looks like one of these, rewrite before generating:

- `emoji of a <person> doing <action> at <location>` — too scene-like
- `emoji of <noun1> and <noun2>` with no interaction — collages score
  concept_synergy ≤ 2
- `emoji of a <group of animals>` — the LoRA renders one and a blur
- `emoji of <abstract concept>` — `luck`, `freedom`, `trust` — no visual anchor

When a concept keeps failing, the root cause is almost always "you're asking
the LoRA for something outside its training set." Reach for a concrete,
single-subject reframing from the tables above.

---

## Evaluating Generated Images

A Moji Mash puzzle is a **three-way relationship** between concept, image, and player experience. All three must work:

- A clever concept with a mediocre image → forgettable
- A beautiful image that's too literal → no aha moment
- A perfect image of a weak concept → players solve it but feel nothing

Use the automated vision check plus the blind test to evaluate all three axes.

### The Scored Rubric (automated via `--check`)

Running `generate_moji.py --check` performs a **three-pass** evaluation on each variant:

**Pass 1 — Blind decode**: Claude describes what it sees without knowing the answer. This simulates a player's first look. Answer words absent from the blind decode are flagged ⚠.

**Pass 2 — Scored rubric**: given the answer words, Claude scores 4 dimensions on a strict 1–5 scale. The anchors are deliberately tight: a 5 means top-decile work that would headline the calendar; a 4 is a solid keeper; a 3 has a real flaw. If you see a run where everything scores 4s and 5s, the rubric is drifting — inspect manually before trusting.

**Pass 3 — Playtest**: Claude plays the puzzle with only the image + the public hint (starting letters), and lists its top 5 guess combinations. The rank of the true answer becomes `playtest_difficulty`. This is a *measured* behavior, not an opinion — it catches the idiom-trivial failure mode that Pass 2 alone cannot (a clever idiom image can score 5/5/5/5 on Pass 2 and still playtest at rank 1 because the phrase is too recognisable).

| Dimension | What it measures | Target | Flag if… |
|---|---|---|---|
| `word_clarity` | All answer words visible and pointable? | 4–5 | ≤ 2: a word is missing |
| `style_fidelity` | Matches the open-genmoji LoRA style — single 3D-shaded sticker, soft lighting, no painted background, no cast shadow, no photorealism? | 4–5 | ≤ 2: wrong style entirely (flat 2D, painted scene, photo, has a shadow) |
| `concept_synergy` | Unified creative scene vs. literal word collage? | 4–5 | ≤ 2: just objects next to each other |
| `aha_factor` | How satisfying is the reveal moment? | 4–5 | ≤ 2: concept itself may be weak |
| `playtest_difficulty` | **Measured.** 5 = playtest cracked the answer on guess #1; 3 = ranked #3 (sweet spot); 1 = not in top 5. | **3** | = 5: too easy (idiom-trivial); = 1 or 0: too hard |

**Composite score** (max 25): sum of the 4 rubric dims + a bell-curved playtest contribution (5 pts at pd=3, 1 pt at pd=1 or pd=5). The contact sheet sorts variants by composite, stars the recommended one, and lists the playtest's top-5 guesses underneath.

**Calibration**: expect most composites to land between **13 and 17**. A composite of 20+ is rare and reserved for portfolio-worthy variants. If a run produces three 22/25s, the rubric is inflating — check manually before promoting anything.

**Decision tree:**
- `word_clarity` ≤ 2 on all variants → rewrite prompt to foreground the missing element, regenerate
- `concept_synergy` ≤ 2 on all variants → redesign prompt around a single interacting scene
- `aha_factor` ≤ 2 on all variants → consider dropping the concept entirely
- `playtest_difficulty = 5` on all variants AND category=idiom → the puzzle is too easy. Reframe or reject — do not ship a playtest-rank-1 puzzle just because its composite is high
- `playtest_difficulty = 1` on all variants (answer not in top 5 anywhere) → the puzzle is unsolvable as framed. Make the weakest word more prominent
- Composite < 12/25 on all variants → concept + prompt combination isn't working; start over
- One variant with composite ≥ 17 AND playtest_difficulty ∈ {3, 4} → promote it with confidence

### The Playtest Dimension

`playtest_difficulty` is a *behavioural* measurement, not Claude's opinion. Claude is shown only the image and the public starting-letter hint, and asked to list its top 5 guesses. Where the true answer lands in that list determines the score:

| Rank | Playtest difficulty | Meaning |
|---|---|---|
| 1 | **5** | Cracked on guess #1 — too obvious / idiom-trivial |
| 2 | 4 | Easy-fair — answer was the second guess |
| 3 | **3** ★ sweet spot | Fair challenge — exactly the "mild work, then aha" zone |
| 4 | 2 | Hard-fair — answer was low in the list but present |
| 5 | 1 | Very hard but solvable — last guess still found it |
| not in top 5 | 1 | Unsolvable as framed — likely a missing visual cue |

The contact sheet prints the full top-5 guess list under each card. **Read it.** It tells you *what the player sees in the image*. If Claude's top guesses are `[party, hat]` and `[birthday, cake]` but the answer is `[party, pooper]`, the visual is sending the wrong signal — the prompt needs to foreground the "pooper" element, not the "party" element.

A playtest-rank-1 variant starred as "recommended" is a trap: the composite is high because Pass 2 rubric loved the image, but the puzzle will feel trivial to play. Prefer a lower-composite variant that playtests at 3–4 over a high-composite variant that playtests at 5.

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
