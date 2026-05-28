# Editor C Validation Report: Museum Object-Specific Polish

## Scope

This pass reviewed the current Museum validation/test posture without changing runtime JSON, scripts, app code, or tests. Read-only inputs:

- `scripts/museum_pipeline_common.py`
- `scripts/validate_museum_editorial_bank.py`
- `src/data/museumAnnualPack.test.ts`
- `src/data/museum/curatedArtworks.json` sample and pack-level profiles

Verification run from the repo root:

- `python3 scripts/validate_museum_editorial_bank.py`
  - Passed: 365 approved artworks, 365 scheduled days.
- `npx vitest run src/data/museumAnnualPack.test.ts`
  - Passed: 1 file, 6 tests.

## Current Posture

The current validation stack is strong on structure, approval metadata, schedule integrity, and broad pack mix. It is weaker on detecting template-shaped copy once the title or date has been inserted.

`scripts/validate_museum_editorial_bank.py` is a good CI entrypoint. It loads the editorial bank, derives curated runtime payload, validates editorial records, validates curated quality, validates schedule coverage, checks runtime export sync, and requires 365 approved runtime artworks.

`scripts/museum_pipeline_common.py` currently enforces:

- Supported source institutions and required source URLs.
- Approved record metadata: named editor approval, fact-check/copy-edit fields, editor notes, no QA blockers.
- Runtime artwork basics: title, artist, date, medium, period, images, markup removal, medium length, collection acronym cleanup.
- Question structure: exactly three questions, one of each kind, four unique options, valid answer index, prompt/reinforcement presence.
- Pack mix: source caps, top-two-source cap, title/family repeat caps, flat-media cap, photograph minimum.
- Copy quality: exact `surprisingFact` cap of 3, exact prompt cap of 25, exact reinforcement cap of 20, at least 250 distinct facts, banned self-referential phrases, generic surprising-fact phrases, 80% object-specific fact heuristic, raw-medium prompt overuse cap, passport-label prompt overuse cap.

`src/data/museumAnnualPack.test.ts` mirrors many runtime-facing gates and adds accessor coverage. It currently duplicates the banned artwork copy patterns, exact repetition caps, schedule cooldowns, source/medium/family mix checks, and player-facing field cleanup.

The curated JSON sample shows the new problem clearly: copy can pass because it mentions a title, date, medium, or period, while still reading like a reusable scaffold. Current data profile:

- 365 runtime artworks.
- Exact prompt max: 2; current cap is 25, so this gate is not doing much for title-inserted prompts.
- `surprisingFact` distinct count: 362; exact fact max: 3.
- Existing object-specific heuristic passes 358 of 365 facts.
- Banned phrase hits: 0.
- Generic fact phrase hits: 0.
- Top repeated incorrect answer options include `Baroque`, `Post-Impressionism`, and `Ukiyo-e` 365 times each.
- Other repeated options include `A ship` and `A woven hanging` 335 times each, and `A ceremonial object` 320 times.
- After masking obvious object tokens, top fact stems recur 28, 22, 16, 12, 11, and 11 times.

## Recommended Gates

### 1. Banned Quality-Smell Phrases

Keep the existing hard-fail banned phrase list for self-referential game/editorial mechanics:

- `passport`
- thread language
- `today's notes`
- `today's placard`
- `the notes`
- `technique note`
- `daily lesson`
- `future visits`
- `collecting path`
- `comparison path`
- `best comparison set`
- `visual anchor`
- `museum label`
- `woven or stitched surface`
- `image points`

Add a second tier for template-smell phrases. These should start as warnings or capped stems, not universal hard bans, because some phrases can be legitimate in isolated records:

- `maker, date, and medium all shape`
- `the medium tells you how`
- `label gives you several coordinates`
- `cataloged through`
- `study object, not just an illustration`
- `date is part of the evidence`
- `museum dating often compares style, material, and related works`
- `both image and object record`
- `first visual footing`
- `specific material, date, and object record`
- `how the object can be understood`
- `made and read`

Recommended implementation shape:

- Hard fail on self-referential/product-copy phrases anywhere in player-facing context, question prompts, reinforcements, or options.
- Hard fail when a single template-smell phrase appears in more than 5 artworks.
- Warn when a record has two or more template-smell phrases across context plus quiz copy.
- In Vitest, mirror only the hard-fail tier to avoid brittle warning-only logic in unit tests.

### 2. Exact Prompt Repetition Caps

The current exact prompt cap of 25 is too loose for object-specific polish. Because prompts embed titles, exact repetition will naturally look low even when the underlying stem repeats.

Recommended exact caps:

- Exact question prompt: max 2 pack-wide.
- Exact reinforcement: max 2 pack-wide.
- Exact `surprisingFact`: max 1 pack-wide, with a review-allowlist for true paired/series objects.
- Exact full answer option as an incorrect option: max 40 pack-wide, excluding source-backed correct medium or period labels.

Add a stem-level cap alongside exact caps:

- Normalize by replacing the artwork title, object date, artist, medium, collection label, passport label, and source object ID with placeholders.
- For normalized question prompt stems, max 20 per kind.
- For normalized reinforcement stems, max 15 per kind.
- For normalized `surprisingFact` stems, max 5 pack-wide.
- Hard fail any normalized fact stem over 10 even if exact facts are unique.

This catches the current blind spot where title-inserted copy passes exact repetition gates while still feeling mass-produced.

### 3. Generic Answer Options

The present structure gate verifies four unique options per question, but does not ask whether the option pool has become generic. The current pack uses the same broad distractors at very high frequency.

Recommended gates:

- Count incorrect options separately from correct options.
- Hard fail if any incorrect option appears in more than 10% of questions for its kind.
- Hard fail if any connection-question incorrect option appears in more than 40 records pack-wide.
- Hard fail if any observation-question incorrect option appears in more than 40 records pack-wide.
- Warn if any context-question incorrect medium option appears in more than 60 records, because medium distractors can validly repeat more often.
- Require at least 60 distinct incorrect options across observation questions, 50 across context questions, and 40 across connection questions.
- Flag blanket distractor sets where the same three incorrect options appear together more than 20 times.

Known high-priority generic distractors to reduce:

- `Baroque`
- `Post-Impressionism`
- `Ukiyo-e`
- `A ship`
- `A woven hanging`
- `A ceremonial object`
- `Oil on canvas`
- `Etching`
- `Marble`

The best version of this gate should understand question kind:

- Observation distractors should be plausible visible alternatives tied to object type, subject terms, or medium category.
- Context distractors should stay close enough to the medium/process to be educational but not identical across hundreds of records.
- Connection distractors should vary by geo-region, period, and institution mix rather than using the same global trio.

### 4. Object-Specific Fact Heuristics

The existing `is_object_specific_fact` checks whether a fact contains any of these values: title, artist, medium, object date, collection label, passport label, or geo-region. That is useful as a floor, but too easy to satisfy. A fact that says `Because TITLE is dated DATE...` can pass while remaining generic.

Recommended stronger heuristic:

- Title-only specificity is insufficient.
- Date-only specificity is insufficient.
- Medium-category-only specificity is insufficient.
- Require either two non-title anchors or one high-value source anchor.

Suggested anchor scoring:

- High-value anchors: named maker/artist, named place/culture/dynasty, specific technique/process, subject term, source collection/object classification, accession/object ID when surfaced in source-backed copy.
- Medium-value anchors: object date/range, exact medium string, period/passport label, geo-region.
- Low-value anchors: title only, generic collection name, generic words such as `object`, `image`, `work`, `record`, `label`, `maker`, `date`, `medium`.

Pass examples:

- High-value anchor present plus one medium-value anchor.
- Two medium-value anchors plus a non-generic verb or material/process claim.
- For unknown/anonymous works, object class plus culture/place/dynasty plus material/process.

Fail examples:

- Fact only mentions title and says maker/date/medium matter.
- Fact only says the museum record preserves evidence.
- Fact only says date ranges require comparison.
- Fact repeats an unknown-maker sentence without object class, place, material, or source context.

Add normalized-template detection to the same gate:

- Replace title, artist, date, medium, collection, period, and place tokens with placeholders.
- Count normalized fact stems.
- Fail stems over 5 unless explicitly allowlisted for a small series.
- Report the top stems in validator output so editors can fix copy in batches.

### 5. False Positive Risks

The new gates should be strict enough to find polish debt without punishing legitimate museum data. Main risks:

- Generic titles such as `Coverlet`, `Fragment`, `Bowl or Cup`, and `Unidentified Man` make title-based matching noisy. These records need source/object ID and material/place anchors.
- Some broad answer options are correct for some records. Frequency caps should count incorrect options separately.
- Medium strings like `Oil on canvas`, `Etching`, and `Bronze` are valid correct answers. Avoid banning them globally.
- Museum copy sometimes legitimately references labels, records, attribution, and dating practice. Ban self-referential game phrases hard, but cap template stems rather than banning all museum terminology.
- Anonymous, ancient, archaeological, and decorative-art records may not have named artists or precise dates. Let culture/place/material/object-class anchors satisfy specificity.
- Paired objects and series can legitimately share title, medium, date, and some framing. Allow a small reviewed exception list for exact fact repeats and normalized stems.
- Non-English titles, punctuation, bracketed titles, and title variants can make masking brittle. Normalizers should preserve enough text for diagnostics and avoid destructive token stripping.
- Very short object titles can accidentally match ordinary words in a sentence. Require word-boundary matching and ignore title tokens below four characters unless the full title matches.

## Suggested Gate Placement

Put canonical logic in `scripts/museum_pipeline_common.py`, ideally inside or adjacent to `copy_quality_errors`, then mirror the most stable hard-fail checks in `src/data/museumAnnualPack.test.ts`.

Recommended split:

- Python validator: full editorial gate, normalized stem reporting, warning/fail severity, source-aware heuristics using editorial `rawSource`.
- Vitest: runtime invariants only, including banned hard-fail phrases, tightened exact caps, incorrect-option frequency caps, and basic normalized-stem caps that do not require raw source records.

Do not rely on exact prompt repetition alone. Use exact caps as a cheap smoke detector, but let normalized stem caps and option-pool diversity carry the object-specific polish signal.
