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
    'You do NOT have shell or Bash access here. Use the registered tools instead:',
    '',
    '  FAST (milliseconds):',
    '  • read_file(path)             — sandboxed UTF-8 file read under the repo root',
    '  • list_pool()                 — structured summary of the entire puzzle pool',
    '  • search_pool(words, near_date, within_days, pinned_only, limit)',
    '                                — filter the pool by word membership and/or date recency',
    '  • list_staged()               — show previously staged candidates across all sessions',
    '  • check_concept(words, prompt)— LLM triage: rate a concept 1-5 BEFORE spending ~45s on images',
    '',
    '  SLOW (~45s/variant — only call after concepts pass check_concept):',
    '  • generate_moji(words, prompt, count, seed)',
    '                                — generate N fresh variants via mflux + vision check',
    '  • refine_moji(words, staged_path, prompt, count, seed, init_strength)',
    '                                — img2img iterate on an existing staged variant',
    '',
    '  FINAL (after user approval):',
    '  • promote_moji(words, staged_path, force)',
    '                                — copy to assets/ and return the paste-ready TS snippet',
    '',
    'When the style-guide says "run python scripts/generate_moji.py", call generate_moji or promote_moji.',
    'When it says "Read src/data/mojiMashPuzzles.ts", call list_pool or search_pool (preferred) or read_file.',
    'Generated images and rubric scores appear in the gallery panel next to chat — the user sees everything.',
    'IMPORTANT: After generate_moji / refine_moji, PNG bytes are attached as image blocks — you CAN see them.',
    'Inspect visually, compare rubric scores, and use what you observe to refine prompts before the next call.',
    '',
  ].join('\n');
  return preamble + '\n' + body;
}
