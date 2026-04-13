import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// tools/moji-mash-studio/src/server -> tools/moji-mash-studio -> tools -> repo root
export const STUDIO_ROOT = resolve(__dirname, '..', '..');
export const REPO_ROOT = resolve(STUDIO_ROOT, '..', '..');

export const PORT = Number(process.env.MOJI_STUDIO_PORT ?? 5737);
export const PYTHON = process.env.MOJI_STUDIO_PYTHON ?? 'python3';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
export const ANTHROPIC_MODEL = 'claude-opus-4-6';

// Safety caps
export const MAX_AGENT_ITERATIONS = 12;
export const MAX_GENERATIONS_PER_TURN = 3;
export const MAX_OUTPUT_TOKENS = 4096;

// Repo paths
export const PUZZLES_TS = resolve(REPO_ROOT, 'src/data/mojiMashPuzzles.ts');
export const STYLE_GUIDE_MD = resolve(REPO_ROOT, 'docs/moji-mash-style-guide.md');
export const AGENT_MD = resolve(REPO_ROOT, '.claude/agents/moji-mash-editor.md');
export const STAGE_BASE = resolve(REPO_ROOT, 'tmp/moji-mash');
export const ASSETS_GENMOJI = resolve(REPO_ROOT, 'assets/genmoji');
export const GENERATE_SCRIPT = resolve(REPO_ROOT, 'scripts/generate_moji.py');
