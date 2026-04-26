import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO_ROOT } from '../config.js';
import { listPoolTool } from './listPool.js';

/**
 * Structured portfolio analysis for the moji-mash-editor agent to read at
 * session start (Step 0.5 of the agent loop) and for the UI's Portfolio tab.
 *
 * This is a *qualitative* view of the pool — it reads `docs/moji-mash-puzzle-notes.md`
 * to get each puzzle's category tag, and combines that with the word tuples
 * from `src/data/mojiMashPuzzles.ts` to produce:
 *   - category mix (vs. portfolio quotas)
 *   - word reuse histogram (over-used words)
 *   - seasonal / holiday coverage (pinned vs. open days)
 *   - anchor-calibrated difficulty counts (if anchors file exists)
 *   - next-batch focus recommendations
 */

const PUZZLE_NOTES_MD = resolve(REPO_ROOT, 'docs/moji-mash-puzzle-notes.md');
const ANCHORS_JSON = resolve(REPO_ROOT, 'docs/moji-mash-anchors.json');

export type PortfolioCategory = 'idiom' | 'absurd' | 'literal' | 'cultural' | 'unknown';

export interface CategoryShare {
  category: PortfolioCategory;
  count: number;
  share: number; // 0-1
  targetLow: number; // 0-1
  targetHigh: number; // 0-1
  status: 'below' | 'in-range' | 'above';
}

export interface AnalyzePoolResult {
  total: number;
  rotationCount: number;
  pinnedCount: number;
  categories: CategoryShare[];
  overusedWords: Array<{ word: string; count: number }>;
  nearLimitWords: Array<{ word: string; count: number }>;
  pinnedDates: string[];
  monthlyPinned: Record<string, number>; // "01".."12" -> count
  anchorsCalibrated: number;
  untaggedSlugs: string[];
  notesPresent: boolean;
  anchorsPresent: boolean;
  recommendations: string[];
}

const QUOTAS: Record<Exclude<PortfolioCategory, 'unknown'>, [number, number]> = {
  idiom: [0, 0.25],
  absurd: [0.3, 0.35],
  literal: [0.2, 0.25],
  cultural: [0.15, 0.2],
};

const WORD_REUSE_LIMIT = 2;

function slugify(words: string[]): string {
  return words.join('-').toLowerCase();
}

function parseNotes(): Map<string, PortfolioCategory> {
  if (!existsSync(PUZZLE_NOTES_MD)) return new Map();
  const text = readFileSync(PUZZLE_NOTES_MD, 'utf8');
  const out = new Map<string, PortfolioCategory>();
  // Match `### slug` followed (in the same section) by a `- **category**: <tag>` line.
  const blockRe = /^###\s+([a-z0-9-]+)\s*$/gm;
  const blocks: Array<{ slug: string; start: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(text)) !== null) {
    if (m[1]) blocks.push({ slug: m[1], start: m.index });
  }
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!;
    const next = blocks[i + 1];
    const end = next ? next.start : text.length;
    const section = text.slice(b.start, end);
    const cat = /\*\*category\*\*\s*:\s*([a-z]+)/i.exec(section);
    if (cat && cat[1]) {
      const tag = cat[1].toLowerCase();
      if (tag === 'idiom' || tag === 'absurd' || tag === 'literal' || tag === 'cultural') {
        out.set(b.slug, tag);
      }
    }
  }
  return out;
}

interface AnchorEntry {
  slug: string;
  difficulty: number; // 1-5
}

function parseAnchors(): AnchorEntry[] {
  if (!existsSync(ANCHORS_JSON)) return [];
  try {
    const parsed = JSON.parse(readFileSync(ANCHORS_JSON, 'utf8')) as unknown;
    if (!parsed || typeof parsed !== 'object') return [];
    const anchors = (parsed as { anchors?: unknown }).anchors;
    if (!Array.isArray(anchors)) return [];
    return anchors
      .map((a) => {
        if (!a || typeof a !== 'object') return null;
        const slug = (a as { slug?: unknown }).slug;
        const diff = (a as { difficulty?: unknown }).difficulty;
        if (typeof slug !== 'string') return null;
        if (typeof diff !== 'number') return null;
        return { slug, difficulty: diff };
      })
      .filter((x): x is AnchorEntry => x !== null);
  } catch {
    return [];
  }
}

export function analyzePoolTool(): AnalyzePoolResult {
  const pool = listPoolTool();
  const noteCategories = parseNotes();
  const anchors = parseAnchors();

  // Category counts
  const counts: Record<PortfolioCategory, number> = {
    idiom: 0,
    absurd: 0,
    literal: 0,
    cultural: 0,
    unknown: 0,
  };
  const untaggedSlugs: string[] = [];
  for (const tuple of pool.tuples) {
    const slug = slugify(tuple);
    const cat = noteCategories.get(slug) ?? 'unknown';
    counts[cat] += 1;
    if (cat === 'unknown') untaggedSlugs.push(slug);
  }

  const total = pool.total || 1;
  const categories: CategoryShare[] = (Object.keys(QUOTAS) as Array<keyof typeof QUOTAS>).map(
    (cat) => {
      const [lo, hi] = QUOTAS[cat];
      const count = counts[cat];
      const share = count / total;
      const status: CategoryShare['status'] =
        share < lo ? 'below' : share > hi ? 'above' : 'in-range';
      return { category: cat, count, share, targetLow: lo, targetHigh: hi, status };
    },
  );
  // Always include an "unknown" row if any untagged
  if (counts.unknown > 0) {
    categories.push({
      category: 'unknown',
      count: counts.unknown,
      share: counts.unknown / total,
      targetLow: 0,
      targetHigh: 0,
      status: 'above',
    });
  }

  // Word reuse histogram
  const entries = Object.entries(pool.wordCounts).sort((a, b) => b[1] - a[1]);
  const overusedWords = entries.filter(([, n]) => n > WORD_REUSE_LIMIT).map(([word, count]) => ({ word, count }));
  const nearLimitWords = entries.filter(([, n]) => n === WORD_REUSE_LIMIT).map(([word, count]) => ({ word, count }));

  // Seasonal coverage — bucket pinned dates by month
  const monthlyPinned: Record<string, number> = {};
  for (let i = 1; i <= 12; i++) {
    monthlyPinned[String(i).padStart(2, '0')] = 0;
  }
  for (const d of pool.pinnedDates) {
    const mo = d.slice(5, 7);
    if (monthlyPinned[mo] !== undefined) monthlyPinned[mo] += 1;
  }

  // Next-batch focus recommendations
  const recommendations: string[] = [];
  for (const c of categories) {
    if (c.category === 'unknown') continue;
    if (c.status === 'below') {
      const needed = Math.ceil((c.targetLow - c.share) * total);
      recommendations.push(
        `Under-represented: ${c.category} (${(c.share * 100).toFixed(0)}% — target ${(c.targetLow * 100).toFixed(0)}%+). Add ~${needed} ${c.category} puzzles in the next batch.`,
      );
    } else if (c.status === 'above') {
      recommendations.push(
        `Over-represented: ${c.category} (${(c.share * 100).toFixed(0)}% — cap ${(c.targetHigh * 100).toFixed(0)}%). Pause new ${c.category} entries and replace any rank-1 idiom traps.`,
      );
    }
  }
  if (untaggedSlugs.length > 0) {
    recommendations.push(
      `${untaggedSlugs.length} puzzle(s) missing category tags in docs/moji-mash-puzzle-notes.md — category mix is approximate until these are tagged.`,
    );
  }
  if (overusedWords.length > 0) {
    const list = overusedWords.map((w) => `${w.word}×${w.count}`).join(', ');
    recommendations.push(`Words over the 2-use cap: ${list}. Retire older entries before reusing.`);
  }
  // Thin months — flag months with zero pinned puzzles
  const thinMonths = Object.entries(monthlyPinned)
    .filter(([, n]) => n === 0)
    .map(([m]) => m);
  if (thinMonths.length > 4) {
    recommendations.push(
      `Seasonal coverage is sparse — ${thinMonths.length}/12 months have no pinned holiday puzzle. See Holiday Calendar in the style guide.`,
    );
  }

  return {
    total: pool.total,
    rotationCount: pool.rotationCount,
    pinnedCount: pool.pinnedCount,
    categories,
    overusedWords,
    nearLimitWords,
    pinnedDates: pool.pinnedDates,
    monthlyPinned,
    anchorsCalibrated: anchors.length,
    untaggedSlugs,
    notesPresent: existsSync(PUZZLE_NOTES_MD),
    anchorsPresent: existsSync(ANCHORS_JSON),
    recommendations,
  };
}
