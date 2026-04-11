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
    'You do NOT have shell or Bash access here. Use the four registered tools instead:',
    '  • read_file(path)        — sandboxed UTF-8 file read under the repo root',
    '  • list_pool()            — structured summary of the current puzzle pool',
    '  • generate_moji(...)     — runs scripts/generate_moji.py with --check (slow, ~45s/variant)',
    '  • promote_moji(...)      — runs scripts/generate_moji.py --promote and returns the TS snippet',
    'When the workflow says "run python scripts/generate_moji.py", call generate_moji or promote_moji instead.',
    'When it says "Read src/data/mojiMashPuzzles.ts", call read_file or (preferred) list_pool.',
    'Generated images and rubric scores will appear in a gallery panel next to the chat — the user can see everything you generate.',
    '',
  ].join('\n');
  return preamble + '\n' + body;
}
