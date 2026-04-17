import type Anthropic from '@anthropic-ai/sdk';

/**
 * The four tools we expose to the moji-mash-editor agent. Schemas are kept
 * deliberately tight so Claude has to think before calling the slow ones.
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
      'Filter the puzzle pool by word membership and/or date recency. Faster and more targeted than list_pool when you have a specific question — e.g. "any pinned puzzle within 14 days of 2026-04-20 that uses \'spring\'?" or "every entry that contains \'snake\'". Returns matching entries with their words, optional date, and original insertion order.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          description: 'Words to look for (OR semantics). Lowercase.',
        },
        near_date: {
          type: 'string',
          description: 'ISO YYYY-MM-DD anchor for a recency window.',
        },
        within_days: {
          type: 'integer',
          description: 'Window in days around near_date (default 14).',
        },
        pinned_only: {
          type: 'boolean',
          description: 'Only return puzzles with a date: field.',
        },
        limit: {
          type: 'integer',
          description: 'Max matches returned (default 50).',
        },
      },
    },
  },
  {
    name: 'list_staged',
    description:
      'List previously staged candidates under tmp/moji-mash/YYYY-MM-DD/, grouped by slug, most recent date first. Restores cross-session continuity: shows what was already generated (and any vision-check rubric scores) so you can pick up where a previous session left off without re-running expensive generations.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'check_concept',
    description:
      'Cheap LLM-only triage of a candidate concept BEFORE spending ~45s/variant on generate_moji. Asks Claude to rate the concept (1-5), flag hard-to-render words, and suggest a sharper prompt fragment. No image is generated. Use this to filter shaky ideas early — only call generate_moji on concepts that score 4+ here.',
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
          description: 'Optional draft prompt — sharpens the per-word feedback.',
        },
      },
      required: ['words'],
    },
  },
  {
    name: 'generate_moji',
    description:
      'Generate N image variants for a Moji Mash candidate by running scripts/generate_moji.py with --check. Returns staged file paths, per-variant rubric scores (word_clarity, visual_appeal, concept_synergy, guessability, aha_factor), composite scores, and the recommended variant. Variants and scores also appear in the gallery panel automatically. This is SLOW: ~45 seconds per variant on M2. Only call after you have a concrete prompt that visually depicts every answer word.',
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
            'The genmoji prompt. Must explicitly describe a visual element for every answer word. Start with "an expressive emoji of" and end with "cute cartoon sticker, thick outline, saturated colors, centered on white background". Keep ≤ 40 words.',
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
      'Img2img refinement: take an existing staged variant as the init image and re-render with a revised prompt. mflux uses the source image as the starting latent so the new render preserves composition/colors while responding to what changed. Best for targeted fixes ("make the broom bigger", "drop the sunburst"). Slower than check_concept but ~2× faster than a fresh generate_moji because fewer seed sweeps are needed. Outputs land in today\'s staged dir with a -r<seed> suffix and appear in the gallery automatically.',
    input_schema: {
      type: 'object',
      properties: {
        words: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
          description: 'Lowercase answer words, same as the original concept.',
        },
        staged_path: {
          type: 'string',
          description:
            'Repo-relative path to the existing variant you want to iterate on, e.g. "tmp/moji-mash/2026-04-15/spring-cleaning-s42.png".',
        },
        prompt: {
          type: 'string',
          description:
            'Revised prompt — describe what should change vs. the original. Same format as generate_moji.',
        },
        count: {
          type: 'integer',
          minimum: 1,
          maximum: 4,
          description: 'Refined variants to generate (default 2).',
        },
        seed: {
          type: 'integer',
          description:
            'Optional base seed override. Defaults to source seed + 100 to keep outputs distinct.',
        },
        init_strength: {
          type: 'number',
          description:
            '0.0–1.0. Lower = keeps original layout more faithfully; higher = follows new prompt more freely. Default 0.4.',
        },
      },
      required: ['words', 'staged_path', 'prompt'],
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
