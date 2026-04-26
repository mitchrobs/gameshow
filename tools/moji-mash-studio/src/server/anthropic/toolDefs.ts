import type Anthropic from '@anthropic-ai/sdk';

/**
 * The nine tools we expose to the moji-mash-editor agent. Schemas are kept
 * deliberately tight so Claude has to think before calling the slow ones.
 *
 * Speed/cost classes:
 *   FAST (free or ~$0)        read_file, list_pool, search_pool, list_staged, view_image
 *   CHEAP (~$0.002/call)      check_concept
 *   SLOW (~$0.20+, ~45s/var)  generate_moji, refine_moji
 *   FINAL (writes to disk)    promote_moji
 */
export const TOOL_DEFS: Anthropic.Tool[] = [
  {
    name: 'read_file',
    description:
      'Read a UTF-8 text file from the gameshow repo. Path must be relative to the repo root, e.g. "src/data/mojiMashPuzzles.ts" or "docs/moji-mash-style-guide.md". Use this to load the style guide and existing puzzles before brainstorming. Whitelisted extensions: .ts .tsx .md .json .py .txt .js .mjs. Max 256KB.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Repo-relative path, e.g. "docs/moji-mash-style-guide.md"',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'analyze_pool',
    description:
      'Portfolio-level analysis of the current Moji Mash pool. Returns category mix vs. quotas (idiom ≤25%, absurd 30-35%, literal 20-25%, cultural 15-20%), over-used words, word-reuse histogram, seasonal/monthly pinned coverage, anchor-calibration count, and a list of `recommendations` strings telling you which categories are under/over target and which months are thin. Reads docs/moji-mash-puzzle-notes.md for category tags and docs/moji-mash-anchors.json (if present) for calibrated difficulties. CALL THIS FIRST when starting a batch session — before brainstorming — so your candidates are category-balanced from the start. Prefer this over list_pool when planning a batch.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_pool',
    description:
      'Return a structured summary of the current Moji Mash puzzle pool: every word tuple, each word\'s usage count, the set of pinned dates, and totals. Prefer this over read_file when you only need the pool summary for word-reuse and duplicate checks.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_pool',
    description:
      'Targeted query against the puzzle pool. Use this BEFORE pinning a date-tagged puzzle to confirm none of its answer words appear in another pinned puzzle within `within_days` of `near_date`. Also use it to check whether a specific word/tuple has appeared anywhere. Cheaper than list_pool when you only care about a few words.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lowercase words to look for. An entry matches if it contains ANY of these words.',
        },
        near_date: {
          type: 'string',
          description: 'ISO date YYYY-MM-DD. Combined with within_days for recency filtering.',
        },
        within_days: {
          type: 'integer',
          minimum: 0,
          maximum: 365,
          description: 'Window size in days around near_date. Defaults to 14 (the recency rule).',
        },
        pinned_only: {
          type: 'boolean',
          description: 'If true, ignore rotation puzzles and consider only date-pinned ones.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 500,
          description: 'Max entries to return (default 50).',
        },
      },
    },
  },
  {
    name: 'list_staged',
    description:
      'List Moji Mash candidates that have been generated this session or in previous sessions and are sitting in tmp/moji-mash/<date>/. Returns slug, date, variant filenames, and (if a contact sheet was generated with --check) the per-variant rubric scores. Call this FIRST when the user asks to continue a previous session, so you don\'t re-run expensive generations.',
    input_schema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Optional ISO date YYYY-MM-DD to limit the listing to one day.',
        },
        slug: {
          type: 'string',
          description: 'Optional slug filter, e.g. "tax-return".',
        },
      },
    },
  },
  {
    name: 'view_image',
    description:
      'Load a staged or promoted PNG and attach it to the tool result as a vision block so you can see the image. Use this to inspect a non-recommended variant from a prior generate_moji run, or to resume work on a previous session\'s staged images. Fresh generate_moji / refine_moji calls already attach the recommended variant automatically — you do NOT need to call view_image after generating. Path must be repo-relative (e.g. "tmp/moji-mash/2026-04-18/tax-return-s42.png") and must resolve under the repo root. PNG files only, 5MB max.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Repo-relative path to a staged PNG, e.g. "tmp/moji-mash/2026-04-18/tax-return-s42.png".',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'check_concept',
    description:
      'CHEAP (~$0.004) LLM-only renderability check. Two modes: (1) single-prompt — pass `prompt` to evaluate one draft; (2) multi-interpretation — pass `interpretations` (2-4 alternatives) and the judge ranks them and picks the strongest BEFORE you spend a slow generate_moji call. Use multi-interpretation when a concept has multiple plausible visual framings (e.g. couch potato → anthropomorphised potato vs. literal potato on couch); use single-prompt for routine renderability checks. ALWAYS call check_concept before generate_moji on each surviving brainstorm concept. The judge is calibrated for a curated 365-day calendar with tight anchors — only spend the slow ~$0.20 generation budget on concepts rated 4-5 (not 3 — that means "needs rework before generating"). Rated 4-5 concepts get an AUTOMATIC adversarial critic pass that argues for rejection (idiom traps, LoRA out-of-distribution, category saturation) — if the critic flags a "major" objection the rating is downgraded by 1, so a concept that returns rating=4 has already survived two independent judgments. The `critic` field on the result explains any downgrade.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
        },
        prompt: {
          type: 'string',
          description: 'Single-mode: draft LoRA-format prompt, same shape you would pass to generate_moji. Ignored if `interpretations` is provided.',
        },
        interpretations: {
          type: 'array',
          minItems: 2,
          maxItems: 4,
          description: 'Multi-mode: 2-4 alternative visual interpretations of the same concept. Use to pick a direction before spending generate_moji.',
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
                description: 'Short label naming this interpretation, e.g. "anthropomorphised potato on couch".',
              },
              prompt: {
                type: 'string',
                description: 'LoRA-format draft prompt for this interpretation (same constraints as generate_moji.prompt).',
              },
            },
            required: ['label', 'prompt'],
          },
        },
      },
      required: ['words'],
    },
  },
  {
    name: 'generate_moji',
    description:
      'Generate N image variants for a Moji Mash candidate by running scripts/generate_moji.py with --check. Returns staged file paths, per-variant rubric scores (word_clarity, style_fidelity, concept_synergy, aha_factor, playtest_difficulty), composite scores (max 25), the top-5 playtest guesses, and the recommended variant. The recommended variant is auto-attached as a vision block so you can see it. Variants and scores also appear in the gallery panel automatically. This is SLOW: ~60 seconds per variant on M2 (generation + 3 vision passes). The rubric anchors are tight: composite averages 13-17 are normal; 20+ is rare and reserved for top-decile work. The playtest_difficulty dimension is measured (Claude plays the puzzle with only the hint) — playtest_difficulty=5 means the puzzle was cracked on guess #1 (too obvious); playtest_difficulty=1 means the answer was not in the top 5 guesses (likely unsolvable). Sweet spot is 3 (a fair challenge). The prompt MUST follow the open-genmoji LoRA format (see docs/moji-mash-style-guide.md): start with `emoji of`, separate phrases with periods, end with `3D lighting. no cast shadows.`, never describe the background.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
          description: 'Lowercase answer words, 2-4 tokens.',
        },
        prompt: {
          type: 'string',
          description:
            'open-genmoji LoRA prompt. Must explicitly describe a visual element for every answer word. Start with `emoji of`, separate phrases with periods (`.`), end with the literal tail `3D lighting. no cast shadows.`, never describe the background. Optional addons (each as its own period-terminated phrase): `cute.` (non-object/non-human), `enlarged head in cartoon style.` (animals), `head is turned towards viewer.` (humans/animals), `detailed texture.` (objects). Keep ≤ 40 words. See docs/moji-mash-style-guide.md for examples.',
        },
        count: {
          type: 'integer',
          minimum: 1,
          maximum: 4,
          description: 'Number of variants to generate (default 3).',
        },
        seed: {
          type: 'integer',
          description: 'Optional base seed. Defaults to 42 if omitted.',
        },
      },
      required: ['words', 'prompt'],
    },
  },
  {
    name: 'refine_moji',
    description:
      'img2img iteration on an already-staged variant. Use this when the composition is basically right but one element needs a targeted tweak — call generate_moji from scratch instead when the concept direction was wrong entirely. Same SLOW (~45s/variant) cost class as generate_moji, but the result keeps the source pose. Counts against MAX_GENERATIONS_PER_TURN just like generate_moji.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
          description: 'Same answer words as the source concept.',
        },
        source_path: {
          type: 'string',
          description: 'Repo-relative staged path of the variant to seed from, e.g. "tmp/moji-mash/2026-04-11/tax-return-s42.png".',
        },
        prompt: {
          type: 'string',
          description: 'Revised prompt describing the targeted tweak. Same LoRA-format constraints as generate_moji.prompt: start with `emoji of`, separate phrases with periods, end with `3D lighting. no cast shadows.`, never describe the background.',
        },
        init_strength: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'How much to deviate from the source. 0.3-0.5 = minor tweak, 0.6-0.8 = bigger steer. Default 0.4.',
        },
        count: {
          type: 'integer',
          minimum: 1,
          maximum: 3,
          description: 'Number of refined variants to produce (default 2).',
        },
        seed: {
          type: 'integer',
          description: 'Optional seed override; defaults to source seed + 100.',
        },
      },
      required: ['words', 'source_path', 'prompt'],
    },
  },
  {
    name: 'promote_moji',
    description:
      'Promote a previously-staged variant into assets/genmoji/ and return the paste-ready TypeScript snippet. Only call AFTER the user has explicitly approved a specific variant — never auto-promote. The user will see the snippet in the chat and paste it into src/data/mojiMashPuzzles.ts themselves.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
        },
        staged_path: {
          type: 'string',
          description: 'Repo-relative path like "tmp/moji-mash/2026-04-11/tax-return-s42.png".',
        },
        force: {
          type: 'boolean',
          description: 'Overwrite an existing asset on slug collision. Ask the user first.',
        },
      },
      required: ['words', 'staged_path'],
    },
  },
];
