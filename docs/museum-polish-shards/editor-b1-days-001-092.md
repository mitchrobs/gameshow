# Museum 365 Polish Shard - Editor B1 Days 001-092

Scope: scheduled days 1-92 in the current generated baseline, from `2026-04-23` through `2026-07-23`.

Read sources:

- `src/data/museum/curatedArtworks.json`
- `src/data/museum/schedule.json`

## Rubric Applied

Using the object-specific rubric from the plan:

- `A`: The player-facing copy feels written for this object. The observation hook is visible and concrete, the technique/context note is anchored in the actual title, maker, date, medium, place, or use, and the quiz teaches something more specific than the passport label.
- `B`: Playable and probably structurally safe, but the generated template is doing most of the work. These records need polish before they feel premium.
- `replace`: Replace the line set, or hold the record for metadata/fact review, because the object hook is non-visual, the answer is a title-token accident, or the medium/category copy appears to contradict the object.

## Top Findings

The first 92 days are schema-valid but not yet object-specific enough. The main weakness is not grammar in isolation; it is that the baseline repeatedly swaps titles into a small set of templates.

High-frequency generated language should be treated as a rewrite target:

| Phrase or pattern | First-92 frequency | Why it weakens the pack |
|---|---:|---|
| `first visual footing` | 83 | Reinforcements sound generated and interchangeable. |
| `The medium matters because it shapes how... could be made and read` | 68 | Context questions collapse into raw medium recall instead of insight. |
| `through a specific material, date, and object record` | 46 | Connection copy names metadata categories without making a human connection. |
| `fits [passport label]` | 92 | Every connection reinforcement resolves to label recall. |
| `The material is not neutral` | 15 | Good idea once; too formulaic as a repeated opener. |
| `preserves uncertainty instead of pretending the object carries an exact timestamp` | 10 | Date nuance is useful but over-scripted. |
| `the date is part of the evidence` | 17 | Same problem as above, especially when clustered early. |
| `gives you the subject, but the medium tells you...` | 12 | Sounds like placeholder analysis unless followed by object-specific detail. |

Observation hooks are the biggest first-look problem. In days 1-92, the most common observation answers are broad classes rather than actual looking prompts: `A painted scene` (14), `A sculpted form` (11), `A human figure` (10), `A drawn scene` (9), `flowers` (7), `A photographed subject` (5), `A textile pattern` (5), `A worked metal object` (4), and `A printed image` (4).

## Representative Weak Phrases

- Day 1, `Lovers on a terrace with three musicians`: `A worked metal object` ignores the lovers, terrace, and musicians. The connection line `connects Asia with Baroque through a specific material, date, and object record` is metadata glue, not interpretation.
- Day 2, `An Orange Note: Sweet Shop`: `A painted scene` and `National Museum of Asian Art preserves... as both image and object record` are serviceable but could apply to dozens of paintings.
- Day 11, `Newark Abbey`: `Sculpture`/`A sculpted form` reads like a metadata-category collision for a Turner subject. This needs record-level review before copy polish.
- Day 17, `Powdered tea container (natsume)`: the correct observation answer is `Powdered`, which is an adjective pulled from the title, not a visible object.
- Day 30, `Large Kneeling Statue of Hatshepsut`: the correct observation answer is `Large`. The hook should be `kneeling figure`, `Hatshepsut`, `granite statue`, or a visible pose/form detail.
- Day 46, `Cancelled Printing Plate for The Piazzetta`: the correct observation answer is `Cancelled`, another title-token extraction failure.
- Day 66 and Day 87 textile records: `making pattern and labor part of how flowers reads` is ungrammatical and exposes the template.
- Day 70, `Dwarf (one of a pair)`: the observation answer `A ceramic vessel` is likely wrong for a figure titled `Dwarf`; replace the hook and fact-check the object type.
- Day 73, `Tsuba`: `connects United States with Design` is suspicious for a tsuba and should be checked before final copy.
- Day 86, `Fragment of a Floor Mosaic with a Personification of Ktisis`: `A sculpted form` is too blunt for a floor mosaic fragment and may mislead players.

## First-30 Calibration Recommendations

Treat days 1-30 as the calibration batch before broad rewriting. Roughly 23 of the first 30 observation prompts are either broad medium labels or title-token pulls, so this window is where the generator's standards should be reset.

1. Require a concrete visible noun phrase for every observation answer. Ban category-only answers such as `A painted scene`, `A drawn scene`, `A sculpted form`, `A photographed subject`, and `A worked metal object` unless the object is truly abstract or materially illegible.
2. Add a title-token guard. Correct answers such as `Powdered`, `Large`, and `Cancelled` should fail copy QA automatically.
3. Rework Q2 so the answer is not usually just the medium string. If the note says `Albumen print`, ask what albumen printing changes about tone, surface, or photographic evidence. If the note says `woodblock print`, ask about transfer, editioning, or color blocks.
4. Rework Q3 so it is not passport-label recall. The connection question should connect the object to function, series, maker, place, use, display, or circulation.
5. Fact-check or replace the first-30 records where category and copy visibly fight the title: Day 11 `Newark Abbey`, Day 19 `Wreckers -- Coast of Northumberland...`, and Day 26 `Inverary Pier, Loch Fyne: Morning` all carry Turner/YCBA subjects but are framed as `World Art`/`Sculpture`.
6. Use the strongest early records as models, especially Day 5 `Stela of the Steward Mentuwoser` and Day 12 `Khosrow and Shirin in a Garden...`, where object type, date range, material, and cultural frame have enough specificity to support real copy.

## Rewrite Patterns To Avoid

- Do not build observation answers from the first word of the title.
- Do not use a medium category as the observation hook when the image has a clearer subject, object type, setting, figure, animal, or motif.
- Do not make every context question a raw medium recall question.
- Do not let connection questions end at `Which art-history category best fits...` unless there is a more specific connection note available.
- Do not repeat institution-preservation filler such as `preserves as both image and object record` without naming what the record preserves.
- Do not overuse uncertainty boilerplate for anonymous makers and approximate dates. One good sentence about uncertainty is useful; repeated daily, it becomes textureless.
- Do not rely on broad labels such as `World Art`, `Design`, or `Nineteenth-Century Art` as if they are self-explanatory interpretation.
- Do not carry a template through ungrammatical substitutions such as `how flowers reads` or awkward substitutions such as `how a horse reads`.

## First 15 Quality Table

| Day | Date | Title | Tier | Why |
|---:|---|---|---|---|
| 1 | 2026-04-23 | Lovers on a terrace with three musicians | B | Vivid title, but the copy reduces the visit to `worked metal object` and generic Asia/Baroque metadata. |
| 2 | 2026-04-24 | An Orange Note: Sweet Shop | B | Coherent painting copy, but `painted scene` and source-record language are not object-specific. |
| 3 | 2026-04-25 | Sheep-Washing, Windsor | B | Print process is relevant, but the observation remains `printed image` and the connection is label recall. |
| 4 | 2026-04-26 | Solola, Guatemala | B | Albumen/framing frame works, but `photographed subject` and the camera-record line are template-heavy. |
| 5 | 2026-04-27 | Stela of the Steward Mentuwoser | A | Strongest early calibration example: object type, limestone/paint, approximate date, and Ancient Egypt frame align. |
| 6 | 2026-04-28 | Flying Cuckoo | B | The cuckoo itself disappears behind generic `painted scene`, surface, and date boilerplate. |
| 7 | 2026-04-29 | Unidentified Woman | B | Portrait silhouette and cut-paper medium are useful, but unknown-maker/date copy is generic. |
| 8 | 2026-04-30 | Boar Sword | B | The boar hook is better than a medium class, but the copy misses sword function and staghorn/steel specifics. |
| 9 | 2026-05-01 | Shiga ware cylindrical tea bowl in Oribe style | B | `flowers` may be visible, but the copy underuses Shiga ware, Oribe style, tea use, and ceramic form. |
| 10 | 2026-05-02 | Harmony in Green and Rose: The Music Room | B | Clear Whistler painting, but observation and context are almost entirely painting-template language. |
| 11 | 2026-05-03 | Newark Abbey | replace | The Turner/abbey subject is framed as `World Art`/`Sculpture`; copy should be held for metadata review. |
| 12 | 2026-05-04 | Khosrow and Shirin in a Garden, a Scene from the Khamsa of Nizami | A | Garden, Khamsa, Safavid range, watercolor/ink, and Islamic Art all give the copy real object support. |
| 13 | 2026-05-05 | Cherry Blossom Viewing at Itsukushima and Yoshino | B | Needs fact-check attention because `Ukiyo-e`, `Gold`, and `worked metal object` do not yet cohere for a player. |
| 14 | 2026-05-06 | Chagres, Panama | B | `river` gives a visible hook, but the Muybridge/camera copy repeats the same photograph template. |
| 15 | 2026-05-07 | Processional cross | B | Strong object candidate, but `sculpted form` and source-preservation language miss the cross's function and form. |

## Priority Queue For This Shard

Replace or fact-check first: Days 11, 17, 19, 26, 30, 46, 70, 73, 86, and 87.

Rewrite but keep object: most remaining B-tier days, especially records whose observation answer is one of the broad classes listed above.

Preserve as calibration models after light polish: Days 5 and 12.
