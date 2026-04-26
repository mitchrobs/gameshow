import { readFileSync } from 'node:fs';
import { AGENT_MD } from '../config.js';

let cached: string | null = null;

/**
 * Load the moji-mash-editor instructions from .claude/agents/moji-mash-editor.md,
 * strip the YAML frontmatter, and prepend a small directive that adapts the
 * agent for this UI environment (where Bash isn't available — only the four
 * registered tools).
 *
 * Cached after the first call. Restart the server to pick up edits.
 */
export function loadSystemPrompt(today: string): string {
  if (cached) return appendDate(cached, today);
  const raw = readFileSync(AGENT_MD, 'utf8');
  const stripped = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  cached = stripped;
  return appendDate(stripped, today);
}

function appendDate(body: string, today: string): string {
  const preamble = [
    `Today is ${today}. You are running inside Moji Mash Studio, a local web UI on the user's Mac.`,
    'You do NOT have shell or Bash access here. Use the nine registered tools instead, grouped by cost:',
    '  FAST (free / negligible):',
    '    • read_file(path)         — sandboxed UTF-8 file read under the repo root',
    '    • list_pool()             — full structured summary of the current puzzle pool',
    '    • search_pool(words?, near_date?, within_days?, pinned_only?, limit?)',
    '                              — targeted query; use BEFORE pinning a date to confirm no recency conflict',
    '    • list_staged(date?, slug?) — what is sitting in tmp/moji-mash/<date>/ from this or prior sessions',
    '    • view_image(path)        — load a staged PNG and see it as a vision block. Use to inspect a non-recommended',
    '                              variant or an image from a prior session. generate_moji / refine_moji already',
    '                              auto-attach the recommended variant — do NOT call view_image on it.',
    '  CHEAP (~$0.002/call):',
    '    • check_concept(words, prompt) — Haiku judge rates renderability 1-5 BEFORE you spend on generation',
    '  SLOW (~$0.20+, ~45s/variant — counts against MAX_GENERATIONS_PER_TURN):',
    '    • generate_moji(words, prompt, count?, seed?) — fresh 3-variant batch with --check',
    '    • refine_moji(words, source_path, prompt, init_strength?, count?, seed?)',
    '                              — img2img tweak of an existing staged variant',
    '  FINAL (writes to disk, ASK FIRST):',
    '    • promote_moji(words, staged_path, force?) — moves variant to assets/genmoji/ and returns TS snippet',
    '',
    'Order of operations on a fresh batch:',
    '  1. list_staged   → see if anything from a prior session is already on disk',
    '  2. list_pool / search_pool → check duplicates and 14-day pinned recency',
    '  3. brainstorm 3× the requested count, self-reject the obviously bad ones',
    '  4. check_concept on every survivor (cheap, gates the slow step)',
    '  5. generate_moji only on rating-4-or-5 concepts',
    '  6. refine_moji to fix one element when composition is otherwise right',
    '  7. promote_moji ONLY after the user picks a specific variant',
    '',
    'When the workflow doc says "run python scripts/generate_moji.py", call generate_moji / refine_moji / promote_moji instead.',
    'When it says "Read src/data/mojiMashPuzzles.ts", prefer list_pool or search_pool over read_file.',
    'Generated images and rubric scores appear in a gallery panel next to the chat — the user can see everything you generate.',
    '',
  ].join('\n');
  return preamble + '\n' + body;
}
