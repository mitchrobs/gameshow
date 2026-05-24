import { writeFileSync } from 'node:fs';
import {
  THREADLINE_DATED_SCHEDULE,
  THREADLINE_EDITOR_REVIEW,
  THREADLINE_GRID_COLS,
  THREADLINE_GRID_ROWS,
  THREADLINE_PUZZLE_BANK,
  THREADLINE_PUZZLE_BY_ID,
  THREADLINE_RESERVES,
  getThreadlineShippedCopyAudit,
} from '../src/data/threadlineShippedPack.ts';
import {
  getThreadlineNoLeadSurfaceKey,
  getThreadlineWeaveStructureSignature,
} from '../src/data/threadlineCopyAudit.ts';
import type { ThreadlineCoord, ThreadlinePuzzle } from '../src/data/threadlinePuzzles.ts';

declare const console: { error(message?: unknown): void; log(message?: unknown): void };
declare const process: { argv: string[]; exitCode?: number };

type ReviewScope = 'dated' | 'reserve';
type ReviewStatus = 'team-pass' | 'editor-watch' | 'rewrite-candidate';
type IssueSeverity = 'rewrite' | 'watch';

interface PackEntry {
  scope: ReviewScope;
  slot: string;
  sortKey: string;
  puzzle: ThreadlinePuzzle;
}

interface ReviewIssue {
  surface: 'title' | 'theme' | 'subcopy' | 'weave' | 'board' | 'schedule';
  severity: IssueSeverity;
  label: string;
}

interface TeamReviewRow {
  entry: PackEntry;
  status: ReviewStatus;
  titleScore: number;
  themeScore: number;
  weaveScore: number;
  boardScore: number;
  rhythmScore: number;
  teamScore: number;
  issues: ReviewIssue[];
}

interface DuplicateCluster {
  value: string;
  count: number;
  slots: string[];
}

const WORD_STOP_LIST = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'inside',
  'into',
  'near',
  'of',
  'on',
  'over',
  'the',
  'to',
  'under',
  'with',
]);

const META_SUBCOPY_PATTERN = /\b(words?|nouns?|verbs?|language|signals?|cues?|moves?|motions?|things?|habits?|choices?|actions?|details?|parts?|items?)\b/i;
const GENERIC_THEME_PATTERN = /\b(details?|cues?|moves?|things?|signals?|pieces?|objects?|steps?|motions?|textures?|habits?|items?|parts?)\b/i;
const ABSTRACT_TITLE_TOKENS = new Set([
  'air',
  'care',
  'day',
  'edge',
  'gentle',
  'hour',
  'light',
  'little',
  'morning',
  'quiet',
  'room',
  'small',
  'soft',
  'still',
  'warm',
]);
const CONCRETE_TITLE_TOKENS = new Set([
  'aisle',
  'alarm',
  'bakery',
  'basket',
  'bell',
  'bench',
  'boat',
  'booth',
  'box',
  'bridge',
  'cafe',
  'camp',
  'card',
  'case',
  'chair',
  'clock',
  'coffee',
  'counter',
  'curtain',
  'desk',
  'diner',
  'door',
  'drawer',
  'fire',
  'garden',
  'gate',
  'glass',
  'harbor',
  'hive',
  'kettle',
  'lamp',
  'lantern',
  'library',
  'market',
  'page',
  'paper',
  'path',
  'porch',
  'rail',
  'rain',
  'room',
  'rope',
  'shelf',
  'shore',
  'sign',
  'stage',
  'station',
  'table',
  'ticket',
  'train',
  'trail',
  'window',
]);
const WEAK_WEAVE_VERBS = /\b(becomes?|makes?|gives?|keeps?|turns?|stays?|gathers?|holds?|leaves?|finds?|feels?)\b/i;
const EXPLANATORY_WEAVE_PATTERN = /\b(because|where|through|when|without|inside)\b/i;
const ABSTRACT_WEAVE_TOKENS = /\b(day|room|quiet|care|hands|moment|purpose|attention|distance|time|work|shape|rhythm|morning)\b/i;
const FALSE_AGENCY_WEAVE_PATTERN =
  /\b(?:shelf|shelves|aisle|materials?|flaw|damage|cloth|bottle|box|page|room|hour|day|morning|path|stall|tank|light|distance|air)\s+(?:knows?|talks?|tells?|accepts?|claims?|earns?|belongs?|learns?|remembers?|decides?|wants?|waits?|keeps?)\b/i;
const WEAVE_FOG_PATTERN =
  /\b(blue weather|impossible distance|turns distance human|keeps danger|becoming specific|something the room can hold|less straight|gets a body)\b/i;
const IDEAL_WEAVE_MAX_WORDS = 10;

function readArg(name: string): string | null {
  const prefix = `--${name}=`;
  const entry = process.argv.find((arg) => arg.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : null;
}

function normalize(copy: string): string {
  return copy
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(copy: string): string[] {
  return normalize(copy)
    .split(' ')
    .filter((token) => token.length > 1 && !WORD_STOP_LIST.has(token));
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function countBy<T>(values: readonly T[], keyFor: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const key = keyFor(value);
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
}

function roundScore(value: number): number {
  return Math.round(Math.max(1, Math.min(5, value)) * 100) / 100;
}

function markdownCell(value: string | number): string {
  return String(value).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function clippedMarkdownCell(value: string, limit = 96): string {
  const clean = markdownCell(value);
  return clean.length <= limit ? clean : `${clean.slice(0, limit - 1).trim()}...`;
}

function summarizeIssues(issues: readonly ReviewIssue[], limit = 4): string {
  if (issues.length === 0) return 'Clean under team heuristics.';
  return issues
    .slice(0, limit)
    .map((issue) => `${issue.surface}: ${issue.label}`)
    .join('; ');
}

function orientationFor(path: readonly ThreadlineCoord[]): 'horizontal' | 'vertical' | 'diagonal' | 'irregular' {
  if (path.length < 2) return 'irregular';
  const first = path[0];
  const second = path[1];
  const rowStep = Math.sign(second.row - first.row);
  const colStep = Math.sign(second.col - first.col);
  if (rowStep === 0 && colStep !== 0) return 'horizontal';
  if (colStep === 0 && rowStep !== 0) return 'vertical';
  if (Math.abs(rowStep) === 1 && Math.abs(colStep) === 1) return 'diagonal';
  return 'irregular';
}

function compactThemeCards(puzzle: ThreadlinePuzzle): string {
  return puzzle.threads.map((thread) => `${thread.name}: ${thread.clue}`).join(' / ');
}

function makeEntries(): PackEntry[] {
  const dated: PackEntry[] = THREADLINE_DATED_SCHEDULE.map((entry) => ({
    scope: 'dated',
    slot: entry.dateKey,
    sortKey: entry.dateKey,
    puzzle: THREADLINE_PUZZLE_BY_ID[entry.puzzleId],
  }));
  const reserves: PackEntry[] = THREADLINE_RESERVES.map((reserve, index) => ({
    scope: 'reserve',
    slot: reserve.reserveId,
    sortKey: `reserve-${String(index).padStart(3, '0')}`,
    puzzle: THREADLINE_PUZZLE_BY_ID[reserve.puzzleId],
  }));
  return [...dated, ...reserves].filter((entry) => Boolean(entry.puzzle));
}

function scoreTitle(
  entry: PackEntry,
  titleTokenCounts: ReadonlyMap<string, number>
): { score: number; issues: ReviewIssue[] } {
  const title = entry.puzzle.title.trim();
  const titleTokens = tokens(title);
  const issues: ReviewIssue[] = [];
  let penalty = 0;

  if (titleTokens.length <= 1) {
    penalty += 0.45;
    issues.push({ surface: 'title', severity: 'watch', label: 'too little orientation before the solve' });
  }
  if (titleTokens.length > 5) {
    penalty += 0.25;
    issues.push({ surface: 'title', severity: 'watch', label: 'long enough to feel titled by system copy' });
  }

  const concreteTokens = titleTokens.filter((token) => CONCRETE_TITLE_TOKENS.has(token));
  const abstractTokens = titleTokens.filter((token) => ABSTRACT_TITLE_TOKENS.has(token));
  if (concreteTokens.length === 0 && abstractTokens.length >= Math.max(1, titleTokens.length - 1)) {
    penalty += 0.55;
    issues.push({ surface: 'title', severity: 'watch', label: 'leans on mood/place abstraction rather than a crisp image' });
  }

  const repeatedTokens = titleTokens.filter((token) => (titleTokenCounts.get(token) ?? 0) >= 24);
  if (repeatedTokens.length > 0) {
    penalty += Math.min(0.45, repeatedTokens.length * 0.18);
    issues.push({
      surface: 'schedule',
      severity: 'watch',
      label: `title token overuse: ${unique(repeatedTokens).join(', ')}`,
    });
  }

  if (/[&:]/.test(title)) {
    penalty += 1.1;
    issues.push({ surface: 'title', severity: 'rewrite', label: 'uses puzzle-construction punctuation' });
  }

  return { score: roundScore(5 - penalty), issues };
}

function scoreThemes(
  entry: PackEntry,
  themeNameCounts: ReadonlyMap<string, number>,
  subcopyCounts: ReadonlyMap<string, number>
): { score: number; issues: ReviewIssue[] } {
  const issues: ReviewIssue[] = [];
  let penalty = 0;

  entry.puzzle.threads.forEach((thread) => {
    const themeKey = getThreadlineNoLeadSurfaceKey(thread.name);
    const subcopyKey = getThreadlineNoLeadSurfaceKey(thread.clue);
    const nameUseCount = themeNameCounts.get(themeKey) ?? 0;
    const subcopyUseCount = subcopyCounts.get(subcopyKey) ?? 0;

    if (GENERIC_THEME_PATTERN.test(thread.name)) {
      penalty += 0.6;
      issues.push({ surface: 'theme', severity: 'rewrite', label: `"${thread.name}" sounds like a bucket label` });
    }
    if (nameUseCount >= 14) {
      penalty += 0.22;
      issues.push({ surface: 'schedule', severity: 'watch', label: `theme name repeats ${nameUseCount}x: ${thread.name}` });
    }
    if (META_SUBCOPY_PATTERN.test(thread.clue)) {
      penalty += 0.34;
      issues.push({ surface: 'subcopy', severity: 'watch', label: `"${thread.clue}" uses meta/category language` });
    }
    if (subcopyUseCount >= 8) {
      penalty += 0.26;
      issues.push({
        surface: 'schedule',
        severity: 'watch',
        label: `exact subcopy repeats ${subcopyUseCount}x`,
      });
    }
    if (thread.clue.split(/\s+/).filter(Boolean).length > 9) {
      penalty += 0.16;
      issues.push({ surface: 'subcopy', severity: 'watch', label: `"${thread.clue}" is long for a reveal card` });
    }
  });

  return { score: roundScore(5 - penalty), issues };
}

function scoreWeave(
  entry: PackEntry,
  weaveStructureCounts: ReadonlyMap<string, number>
): { score: number; issues: ReviewIssue[] } {
  const weave = entry.puzzle.weave.trim();
  const weaveWords = weave.split(/\s+/).filter(Boolean);
  const weaveTokens = tokens(weave);
  const structure = getThreadlineWeaveStructureSignature(weave);
  const issues: ReviewIssue[] = [];
  let penalty = 0;

  if (weaveWords.length > IDEAL_WEAVE_MAX_WORDS) {
    penalty += Math.min(0.65, (weaveWords.length - IDEAL_WEAVE_MAX_WORDS) * 0.13);
    issues.push({ surface: 'weave', severity: 'watch', label: `${weaveWords.length} words; reveal may explain instead of land` });
  }
  if (WEAK_WEAVE_VERBS.test(weave) && ABSTRACT_WEAVE_TOKENS.test(weave)) {
    penalty += 0.45;
    issues.push({ surface: 'weave', severity: 'watch', label: 'abstract noun plus generic verb risks sounding drafted' });
  }
  if (FALSE_AGENCY_WEAVE_PATTERN.test(weave)) {
    penalty += 0.52;
    issues.push({ surface: 'weave', severity: 'watch', label: 'false agency makes the sentence sound written around a category' });
  }
  if (WEAVE_FOG_PATTERN.test(weave)) {
    penalty += 0.68;
    issues.push({ surface: 'weave', severity: 'rewrite', label: 'poetic fog obscures the theme relationship' });
  }
  if (EXPLANATORY_WEAVE_PATTERN.test(weave) && weaveWords.length > 8) {
    penalty += 0.25;
    issues.push({ surface: 'weave', severity: 'watch', label: 'connective phrasing may explain the aha instead of making it felt' });
  }
  if ((weaveStructureCounts.get(structure) ?? 0) > 10) {
    penalty += 0.22;
    issues.push({
      surface: 'schedule',
      severity: 'watch',
      label: `weave sentence shape repeats ${weaveStructureCounts.get(structure)}x`,
    });
  }
  const answerTokens = new Set(entry.puzzle.words.flatMap((word) => tokens(word.answer)));
  const repeatedAnswers = weaveTokens.filter((token) => answerTokens.has(token));
  if (repeatedAnswers.length > 0) {
    penalty += 1.1;
    issues.push({
      surface: 'weave',
      severity: 'rewrite',
      label: `names answer token(s): ${unique(repeatedAnswers).join(', ')}`,
    });
  }
  if (!/[.!?]$/.test(weave)) {
    penalty += 0.8;
    issues.push({ surface: 'weave', severity: 'rewrite', label: 'not punctuated as a finished thought' });
  }

  return { score: roundScore(5 - penalty), issues };
}

function scoreBoard(entry: PackEntry, auditBoardScore: number | null): { score: number; issues: ReviewIssue[] } {
  const issues: ReviewIssue[] = [];
  let score = auditBoardScore ?? 4.55;
  const orientations = entry.puzzle.words.map((word) => orientationFor(word.path));
  const diagonalCount = orientations.filter((orientation) => orientation === 'diagonal').length;
  const horizontalCount = orientations.filter((orientation) => orientation === 'horizontal').length;
  const verticalCount = orientations.filter((orientation) => orientation === 'vertical').length;

  if (score < 4.8) {
    issues.push({ surface: 'board', severity: 'watch', label: `board presentation is near the floor (${score.toFixed(2)})` });
  }
  if (diagonalCount >= 4) {
    score -= 0.2;
    issues.push({ surface: 'board', severity: 'watch', label: `${diagonalCount}/6 words are diagonal` });
  }
  if (horizontalCount === 0 || verticalCount === 0) {
    score -= 0.16;
    issues.push({ surface: 'board', severity: 'watch', label: 'orientation mix may feel less intentional' });
  }

  return { score: roundScore(score), issues };
}

function reviewRows(): TeamReviewRow[] {
  const audit = getThreadlineShippedCopyAudit();
  const noLeadById = new Map(audit.noLead.rows.map((row) => [row.puzzleId, row]));
  const entries = makeEntries();
  const themeNameCounts = countBy(
    entries.flatMap((entry) => entry.puzzle.threads),
    (thread) => getThreadlineNoLeadSurfaceKey(thread.name)
  );
  const subcopyCounts = countBy(
    entries.flatMap((entry) => entry.puzzle.threads),
    (thread) => getThreadlineNoLeadSurfaceKey(thread.clue)
  );
  const titleTokenCounts = countBy(
    entries.flatMap((entry) => tokens(entry.puzzle.title)),
    (token) => token
  );
  const weaveStructureCounts = countBy(entries.map((entry) => entry.puzzle.weave), getThreadlineWeaveStructureSignature);

  return entries.map((entry) => {
    const title = scoreTitle(entry, titleTokenCounts);
    const themes = scoreThemes(entry, themeNameCounts, subcopyCounts);
    const weave = scoreWeave(entry, weaveStructureCounts);
    const board = scoreBoard(entry, noLeadById.get(entry.puzzle.id)?.boardScore ?? null);
    const rhythmScore = roundScore(
      5 -
        Math.max(0, 4.75 - title.score) * 0.4 -
        Math.max(0, 4.75 - themes.score) * 0.5 -
        Math.max(0, 4.75 - weave.score) * 0.7
    );
    const teamScore = roundScore(
      title.score * 0.18 + themes.score * 0.26 + weave.score * 0.32 + board.score * 0.14 + rhythmScore * 0.1
    );
    const issues = [...title.issues, ...themes.issues, ...weave.issues, ...board.issues];
    const hasRewriteIssue = issues.some((issue) => issue.severity === 'rewrite');
    const status: ReviewStatus =
      hasRewriteIssue || teamScore < 4.25 || title.score < 4.1 || themes.score < 4.1 || weave.score < 4.1
        ? 'rewrite-candidate'
        : teamScore >= 4.62 && issues.length === 0
          ? 'team-pass'
          : 'editor-watch';

    return {
      entry,
      status,
      titleScore: title.score,
      themeScore: themes.score,
      weaveScore: weave.score,
      boardScore: board.score,
      rhythmScore,
      teamScore,
      issues,
    };
  });
}

function statusCount(rows: readonly TeamReviewRow[], status: ReviewStatus, scope?: ReviewScope): number {
  return rows.filter((row) => row.status === status && (!scope || row.entry.scope === scope)).length;
}

function average(rows: readonly TeamReviewRow[], valueFor: (row: TeamReviewRow) => number): number {
  if (rows.length === 0) return 0;
  return rows.reduce((total, row) => total + valueFor(row), 0) / rows.length;
}

function issueCountRows(rows: readonly TeamReviewRow[], surface: ReviewIssue['surface']): number {
  return rows.filter((row) => row.issues.some((issue) => issue.surface === surface)).length;
}

function issueCountRowsForSurfaces(rows: readonly TeamReviewRow[], surfaces: readonly ReviewIssue['surface'][]): number {
  const surfaceSet = new Set(surfaces);
  return rows.filter((row) => row.issues.some((issue) => surfaceSet.has(issue.surface))).length;
}

function issueLabelCounts(rows: readonly TeamReviewRow[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    unique(row.issues.map((issue) => `${issue.surface}: ${issue.label}`)).forEach((label) => {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function duplicateClusters(entries: readonly PackEntry[], valueFor: (entry: PackEntry) => string): DuplicateCluster[] {
  const clusters = new Map<string, DuplicateCluster>();
  entries.forEach((entry) => {
    const value = valueFor(entry).trim();
    const key = normalize(value);
    if (!key) return;
    const cluster = clusters.get(key) ?? { value, count: 0, slots: [] };
    cluster.count += 1;
    cluster.slots.push(`${entry.scope}:${entry.slot}`);
    clusters.set(key, cluster);
  });
  return Array.from(clusters.values()).filter((cluster) => cluster.count > 1);
}

function formatDuplicateClusters(clusters: readonly DuplicateCluster[], limit = 16): string {
  if (clusters.length === 0) return '| None | 0 |  |';
  return clusters
    .slice()
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    .slice(0, limit)
    .map(
      (cluster) =>
        `| ${markdownCell(cluster.value)} | ${cluster.count} | ${clippedMarkdownCell(cluster.slots.join(', '), 180)} |`
    )
    .join('\n');
}

function scoreHistogram(rows: readonly TeamReviewRow[], valueFor: (row: TeamReviewRow) => number): string {
  const buckets = [
    { label: '< 4.25', count: 0, test: (score: number) => score < 4.25 },
    { label: '4.25-4.49', count: 0, test: (score: number) => score >= 4.25 && score < 4.5 },
    { label: '4.50-4.69', count: 0, test: (score: number) => score >= 4.5 && score < 4.7 },
    { label: '4.70-4.84', count: 0, test: (score: number) => score >= 4.7 && score < 4.85 },
    { label: '>= 4.85', count: 0, test: (score: number) => score >= 4.85 },
  ];
  rows.forEach((row) => {
    const bucket = buckets.find((candidate) => candidate.test(valueFor(row)));
    if (bucket) bucket.count += 1;
  });
  return buckets.map((bucket) => `| ${bucket.label} | ${bucket.count} |`).join('\n');
}

function automatedNoLeadScoreHistogram(): string {
  const buckets = new Map<string, number>();
  getThreadlineShippedCopyAudit().noLead.rows.forEach((row) => {
    const key = row.scores.noLeadEditorialScore.toFixed(2);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  return Array.from(buckets.entries())
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([score, count]) => `| ${score} | ${count} |`)
    .join('\n');
}

function formatEditorialTeamReviewMarkdown(reviewRowsForReport: readonly TeamReviewRow[]): string {
  const rows = reviewRowsForReport.slice().sort((a, b) => a.entry.sortKey.localeCompare(b.entry.sortKey));
  const datedRows = rows.filter((row) => row.entry.scope === 'dated');
  const reserveRows = rows.filter((row) => row.entry.scope === 'reserve');
  const entries = makeEntries();
  const duplicateTitles = duplicateClusters(entries, (entry) => entry.puzzle.title);
  const duplicateWeaves = duplicateClusters(entries, (entry) => entry.puzzle.weave);
  const duplicateThemeCards = duplicateClusters(entries, (entry) => compactThemeCards(entry.puzzle));
  const weakestDated = datedRows
    .slice()
    .sort((a, b) => a.teamScore - b.teamScore || a.entry.slot.localeCompare(b.entry.slot))
    .slice(0, 40);
  const strongestDated = datedRows
    .slice()
    .sort((a, b) => b.teamScore - a.teamScore || a.entry.slot.localeCompare(b.entry.slot))
    .slice(0, 16);
  const weakestReserves = reserveRows
    .slice()
    .sort((a, b) => a.teamScore - b.teamScore || a.entry.slot.localeCompare(b.entry.slot))
    .slice(0, 30);
  const topIssueRows = issueLabelCounts(rows)
    .slice(0, 18)
    .map(([label, count]) => `| ${markdownCell(label)} | ${count} |`)
    .join('\n');
  const scoreRange = (valueFor: (row: TeamReviewRow) => number) => {
    const values = rows.map(valueFor);
    return `${Math.min(...values).toFixed(2)}-${Math.max(...values).toFixed(2)} avg ${average(rows, valueFor).toFixed(2)}`;
  };
  const copyAudit = getThreadlineShippedCopyAudit();
  const currentAuditWarnings = copyAudit.warningIssues.length;
  const currentAuditCritical = copyAudit.criticalIssues.length;

  const formatRow = (row: TeamReviewRow): string => {
    const review = THREADLINE_EDITOR_REVIEW[row.entry.puzzle.id];
    return `| ${row.entry.scope} | ${row.entry.slot} | ${markdownCell(row.entry.puzzle.title)} | ${row.teamScore.toFixed(
      2
    )} | ${row.titleScore.toFixed(2)} | ${row.themeScore.toFixed(2)} | ${row.weaveScore.toFixed(
      2
    )} | ${row.boardScore.toFixed(2)} | ${row.status} | ${clippedMarkdownCell(
      compactThemeCards(row.entry.puzzle),
      120
    )} | ${clippedMarkdownCell(row.entry.puzzle.weave, 92)} | ${clippedMarkdownCell(
      summarizeIssues(row.issues),
      140
    )} | ${markdownCell(review?.tags.slice(0, 3).join(', ') ?? '')} |`;
  };

  return [
    '# Threadline Editorial Team Review',
    '',
    'This report is deliberately stricter than the automated no-lead gate. The current shipped audit answers "is it structurally valid?"; this team review asks "would a player believe a person wrote this day with care?"',
    '',
    '## Review Team',
    '',
    '| Role | Owns | Primary rejection question |',
    '| --- | --- | --- |',
    '| Editorial voice editor | Title, theme names, theme subcopy | Does this sound like human game copy, or like a generated category label? |',
    '| Weave editor | Final reveal sentence | Does the weave connect the two revealed theme worlds in one concrete, satisfying thought? |',
    '| Game manager | Whole-day player feel | Does the title orient, the reveal cards help, the board feel intentional, and the finish reward the solve? |',
    '| QA systems editor | Repeatability and gates | Can the same weakness be found, queued, rewritten, and prevented next pass? |',
    '',
    '## Floor Rubric',
    '',
    '| Surface | Exceptional floor | Rewrite trigger |',
    '| --- | --- | --- |',
    '| Title | Specific, memorable, nonspoiling, useful before any word is found. | Puzzle punctuation, answer/theme leakage, or a vague mood phrase that could fit dozens of days. |',
    '| Theme cards | Names feel clear after reveal; subcopy gives a concrete clue without sounding like category metadata. | Bucket labels, exact repeated subcopy at scale, or meta phrases like "words for" carrying the card. |',
    '| Weave | Short, concrete, theme-level aha; it should land as a tiny sentence, not an explanation. | Answer-name reveals, generic abstract verbs, lead dependence, or "two buckets meet" logic. |',
    `| Board | ${THREADLINE_GRID_ROWS}x${THREADLINE_GRID_COLS} layout feels intentional and mobile-readable. | Near-floor score, diagonal dominance, or samey path rhythm. |`,
    '| Schedule | A random week feels authored, not mechanically varied by domain. | Repeated title tokens, theme names, subcopy, or weave structures visible to repeat players. |',
    '',
    '## Verdict Layers',
    '',
    '| Layer | What it means | Owner | Ship meaning |',
    '| --- | --- | --- | --- |',
    '| Automated gate | Known structural and banned-pattern checks passed. | QA systems editor | Necessary, never sufficient. |',
    '| Agent team review | Heuristic editorial desk found rows most likely to feel generated, repeated, or unrewarding. | Editorial voice, weave, and game-manager reviewers | Creates the rewrite queue and pass/watch labels. |',
    '| Human sign-off | A person read title, theme cards, board, and weave in play order and accepted the day. | Human editor/game director | Required for the exceptional floor. |',
    '',
    'Recommended human sign-off fields: reviewer, timestamp, status, rationale, exception reason, requires-reread flag, and final approved copy snapshot.',
    '',
    '## Current Team Read',
    '',
    `Validated bank reviewed: ${THREADLINE_PUZZLE_BANK.length}`,
    `Dated rows reviewed: ${datedRows.length}`,
    `Reserve rows reviewed: ${reserveRows.length}`,
    `Current automated critical failures: ${currentAuditCritical}`,
    `Current automated warning exceptions: ${currentAuditWarnings}`,
    '',
    '| Scope | Team pass | Editor watch | Rewrite candidate |',
    '| --- | ---: | ---: | ---: |',
    `| Dated | ${statusCount(rows, 'team-pass', 'dated')} | ${statusCount(rows, 'editor-watch', 'dated')} | ${statusCount(rows, 'rewrite-candidate', 'dated')} |`,
    `| Reserve | ${statusCount(rows, 'team-pass', 'reserve')} | ${statusCount(rows, 'editor-watch', 'reserve')} | ${statusCount(rows, 'rewrite-candidate', 'reserve')} |`,
    `| Total | ${statusCount(rows, 'team-pass')} | ${statusCount(rows, 'editor-watch')} | ${statusCount(rows, 'rewrite-candidate')} |`,
    '',
    '| Dimension | Range | Rows with watch/rewrite notes |',
    '| --- | ---: | ---: |',
    `| Title | ${scoreRange((row) => row.titleScore)} | ${issueCountRowsForSurfaces(rows, ['title', 'schedule'])} |`,
    `| Theme/subcopy | ${scoreRange((row) => row.themeScore)} | ${issueCountRowsForSurfaces(rows, ['theme', 'subcopy', 'schedule'])} |`,
    `| Weave | ${scoreRange((row) => row.weaveScore)} | ${issueCountRows(rows, 'weave')} |`,
    `| Board | ${scoreRange((row) => row.boardScore)} | ${issueCountRows(rows, 'board')} |`,
    `| Whole day | ${scoreRange((row) => row.teamScore)} | ${rows.filter((row) => row.issues.length > 0).length} |`,
    '',
    '## Score Distribution',
    '',
    'Automated no-lead scores are proxy scores. They are useful for catching known failures, but their flat distribution should not be treated as editorial proof.',
    '',
    '| Automated no-lead score | Rows |',
    '| ---: | ---: |',
    automatedNoLeadScoreHistogram(),
    '',
    'Team scores are stricter because they penalize repetition, meta subcopy, abstract title language, generic weave verbs, and board rhythm.',
    '',
    '| Team score bucket | Rows |',
    '| --- | ---: |',
    scoreHistogram(rows, (row) => row.teamScore),
    '',
    '## Biggest Recurring Risks',
    '',
    '| Risk pattern | Rows touched |',
    '| --- | ---: |',
    topIssueRows || '| None | 0 |',
    '',
    '## Full-Bank Duplicate Watch',
    '',
    'Scheduled rows remain unique under the shipping audit, but reserves still matter because they can become live fallback days. These clusters should be resolved before reserves are promoted.',
    '',
    '| Duplicate title | Uses | Slots |',
    '| --- | ---: | --- |',
    formatDuplicateClusters(duplicateTitles),
    '',
    '| Duplicate weave | Uses | Slots |',
    '| --- | ---: | --- |',
    formatDuplicateClusters(duplicateWeaves),
    '',
    '| Duplicate theme-card pair | Uses | Slots |',
    '| --- | ---: | --- |',
    formatDuplicateClusters(duplicateThemeCards),
    '',
    '## Weave Editor Notes',
    '',
    '- The most common weak pattern is transformation math: "turns", "becomes", "gives", or "makes" plus a broad subject like room, day, hour, or morning.',
    '- Strong weaves make the relationship visible through a concrete object, gesture, or consequence: a finger on glass, a tied boat, a checked story, a lit step.',
    '- Review false agency carefully: shelves should not know, aisles should not talk, materials should not accept marks, and damage should not call a hand unless the sentence truly earns that move.',
    '- Later expansion domains need extra sensory anchors before abstract weaves are approved, especially printshop, apothecary, laboratory, lighthouse, aquarium, and observatory.',
    '- If the weave sounds natural after "This means," it is probably explaining the connection instead of landing it.',
    '- Title can sharpen the weave, but the title should not supply missing logic.',
    '',
    '## Weakest Dated Queue',
    '',
    '| Scope | Slot | Title | Team | Title | Theme | Weave | Board | Status | Theme cards | Weave | Team notes | Tags |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |',
    weakestDated.map(formatRow).join('\n'),
    '',
    '## Strongest Dated References',
    '',
    '| Scope | Slot | Title | Team | Title | Theme | Weave | Board | Status | Theme cards | Weave | Team notes | Tags |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |',
    strongestDated.map(formatRow).join('\n'),
    '',
    '## Reserve Rewrite Queue',
    '',
    '| Scope | Slot | Title | Team | Title | Theme | Weave | Board | Status | Theme cards | Weave | Team notes | Tags |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |',
    weakestReserves.map(formatRow).join('\n'),
    '',
    '## Editorial Operating Process',
    '',
    '1. Read the row blind: title only. Mark whether it orients a human scene without giving away answer/theme language.',
    '2. Reveal theme A after one found word. Read the name and subcopy aloud; mark whether it helps the remaining two words without saying "words for" or category filler.',
    '3. Reveal theme B the same way. Check whether the two theme cards feel like they belong in the same authored day.',
    '4. Solve the board path review: count diagonal dominance, scan crowding, and reject boards that feel technically valid but visually accidental.',
    '5. Read the weave alone, with no lead sentence. It must connect the two themes, not recite answers or explain the mechanism.',
    '6. Assign one of three outcomes: team-pass, editor-watch, or rewrite-candidate. Dated rows cannot ship as rewrite-candidate; reserves keep their note until rewritten.',
    '7. After each rewrite batch, add any newly rejected phrase shape to the QA watchlist so a weak pattern cannot quietly re-enter the pack.',
    '',
    '## Full 594-Row Ledger',
    '',
    '| Scope | Slot | Title | Team | Title | Theme | Weave | Board | Status | Theme cards | Weave | Team notes | Tags |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |',
    rows.map(formatRow).join('\n'),
    '',
  ].join('\n');
}

const gateRows = reviewRows();
const markdown = formatEditorialTeamReviewMarkdown(gateRows);
const writePath = readArg('write');
const jsonPath = readArg('json');

if (writePath) {
  writeFileSync(writePath, markdown);
} else {
  console.log(markdown);
}

if (jsonPath) {
  const rows = gateRows.map((row) => ({
    scope: row.entry.scope,
    slot: row.entry.slot,
    puzzleId: row.entry.puzzle.id,
    title: row.entry.puzzle.title,
    themeCards: row.entry.puzzle.threads.map((thread) => ({ name: thread.name, subcopy: thread.clue })),
    weave: row.entry.puzzle.weave,
    status: row.status,
    scores: {
      title: row.titleScore,
      theme: row.themeScore,
      weave: row.weaveScore,
      board: row.boardScore,
      rhythm: row.rhythmScore,
      team: row.teamScore,
    },
    issues: row.issues,
  }));
  writeFileSync(jsonPath, JSON.stringify({ generatedBy: 'threadline-editorial-team', rows }, null, 2));
}

const nonPassingRows = gateRows.filter((row) => row.status !== 'team-pass');
if (nonPassingRows.length > 0) {
  const datedFailures = nonPassingRows.filter((row) => row.entry.scope === 'dated').length;
  const reserveFailures = nonPassingRows.length - datedFailures;
  console.error(
    `Threadline editorial-team gate failed: ${nonPassingRows.length} row(s) below team-pass (${datedFailures} dated, ${reserveFailures} reserve).`
  );
  process.exitCode = 1;
}
