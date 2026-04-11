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
