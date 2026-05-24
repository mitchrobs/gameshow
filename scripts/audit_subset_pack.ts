import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SUBSET_ALL_PACK_DAYS,
  SUBSET_ALL_PACK_PUZZLES,
  SUBSET_LIVE_PUZZLES,
  SUBSET_MAX_WORD_REUSE_TARGET,
  SUBSET_RESERVE_DAYS,
  SUBSET_RESERVE_PUZZLES,
  SUBSET_SCHEDULE_DAYS,
  SUBSET_SCHEDULE_START_DATE,
  getSubsetScheduleEditorialAudit,
  isSubsetLateralThemePuzzle,
  scoreSubsetPuzzleSatisfaction,
  scoreSubsetThemeFeel,
  type SubsetPackPuzzle,
  type SubsetReservePuzzle,
  type SubsetScheduledPuzzle,
} from "../src/data/subsetSchedule";

const RAW_MECHANIC_MAX_DAYS = 0;
const RAW_MECHANIC_MIN_GAP_DAYS = 21;
const LAUNCH_WEEK_DAY_LIMIT = 6;
const LATERAL_THEME_MIN_DAYS = 65;
const LATERAL_THEME_MAX_DAYS = 85;
const MINIMUM_SATISFACTION_SCORE = 90;
const AVERAGE_SATISFACTION_SCORE = 95;
const THEME_FEEL_AVERAGE_SCORE = 95;
const WEAK_SCORE_ADJACENCY_THRESHOLD = 92;
const LABEL_HARD_MAX_LENGTH = 20;
const LABEL_SOFT_MAX_LENGTH = 16;
const LABEL_REUSE_CAP = 22;
const GENERIC_LABEL_REUSE_CAP = 22;
const CENTER_REUSE_COOLDOWN_DAYS = 60;
const FULL_AUDIT_PATH = "docs/subset-full-pack-editorial-audit.md";

const CIVIC_SUBSET_DATES = new Set([
  "2026-05-25",
  "2026-06-19",
  "2026-07-04",
  "2026-09-07",
  "2026-11-11",
  "2027-01-18",
  "2027-02-15",
]);

const PINNED_SPECIAL_DATES = new Set([
  "2026-05-25",
  "2026-06-19",
  "2026-07-04",
  "2026-09-07",
  "2026-10-31",
  "2026-11-03",
  "2026-11-11",
  "2026-11-26",
  "2026-12-24",
  "2026-12-25",
  "2026-12-31",
  "2027-01-01",
  "2027-01-18",
  "2027-02-14",
  "2027-02-15",
  "2027-03-17",
  "2027-04-01",
  "2027-04-04",
  "2027-05-05",
  "2027-05-09",
]);

const GENERIC_SUBSET_LABELS = new Set([
  "Actions",
  "Animals",
  "Clothes",
  "Food",
  "Foods",
  "Kitchen",
  "Motion",
  "Music",
  "Objects",
  "Office",
  "School",
  "Sounds",
  "Sports",
  "Storage",
  "Theater",
  "Wedding",
  "Work",
]);

const LABEL_LENGTH_ALLOWLIST = new Set(["St. Patrick's Day"]);

const STALE_SUBSET_BUILD_STRINGS = [
  "A light first-letter grid",
  "A light final-letter grid",
  "A light word-length grid",
] as const;

export const RAW_SUBSET_MECHANIC_LABEL_PATTERN =
  /^(?:Starts with [A-Z]|Ends in [A-Z]|\d+ Letters)$/;
export const PHRASE_TEMPLATE_LABEL_PATTERN = /___|^(?:After|Before)\s+/i;

const SAME_STRUCTURE_WORDPLAY_CARRIERS = new Set([
  "Line",
  "Pair",
  "Phrase",
]);

const SAME_STRUCTURE_PREFIX_PATTERNS: Array<[RegExp, string]> = [
  [/^Can Be\s+/i, "can-be-prefix"],
  [/^Words (?:After|Before)\s+/i, "words-before-after-prefix"],
];

const RESERVE_SAME_STRUCTURE_ALLOWLIST = new Map([
  [
    "reserve-012",
    "Reserve-only phrase-pair calibration; not reachable through public date lookup.",
  ],
  [
    "reserve-017",
    "Reserve-only line-phrase calibration; not reachable through public date lookup.",
  ],
  [
    "reserve-021",
    "Reserve-only phrase-pair calibration; not reachable through public date lookup.",
  ],
  [
    "reserve-025",
    "Reserve-only phrase-pair calibration; not reachable through public date lookup.",
  ],
  [
    "reserve-030",
    "Reserve-only phrase-pair calibration; not reachable through public date lookup.",
  ],
  [
    "reserve-033",
    "Reserve-only phrase-pair calibration; not reachable through public date lookup.",
  ],
]);

const SPECIALIST_FIT_TERMS = new Set([
  "ANEMONE",
  "CORDWAINER",
  "DUMBWAITER",
  "ESCAPEMENT",
  "FOCUSPULLER",
  "GARDEMANGER",
  "GRAVELTRAY",
  "HANDOFF",
  "HOROLOGIST",
  "NATURALIST",
  "PICTUREEDITOR",
  "PUNTER",
  "RESET",
  "Tide Pool",
]);

type AuditLine = { label: string; words: readonly string[] };
export type SubsetEditorialVerdict =
  | "pass"
  | "rewrite-live"
  | "reserve-tagged"
  | "manual-review";

export interface SubsetPuzzleAuditRow {
  id: string;
  role: "live" | "reserve";
  date: string;
  themeGroupTheme: string;
  laneTypes: string;
  rowLabels: string;
  columnLabels: string;
  score: number;
  themeFeelScore: number;
  sameStructureRisk: string;
  recognizabilityRisk: string;
  editorialVerdict: SubsetEditorialVerdict;
  issueTags: string[];
  strongestLine: string;
  weakestLine: string;
  recommendedAction: string;
}

export interface SubsetThemeGroupSummary {
  themeGroupId: string;
  puzzleCount: number;
  averageScore: number;
  averageThemeFeel: number;
}

export interface SubsetPackAuditReport {
  rows: SubsetPuzzleAuditRow[];
  themeGroupSummaries: SubsetThemeGroupSummary[];
  summary: {
    liveCount: number;
    reserveCount: number;
    allCount: number;
    rawMechanicCount: number;
    lateralThemeCount: number;
    averageScore: number;
    minimumScore: number;
    averageThemeFeel: number;
    minimumThemeFeel: number;
    maxWordUse: number;
    uniqueWords: number;
    sameStructureRiskCount: number;
    liveSameStructureFailureCount: number;
    recognizabilityRiskCount: number;
    liveRecognizabilityFailureCount: number;
    rewriteLiveCount: number;
    reserveTaggedCount: number;
  };
  issueCounts: Record<string, number>;
}

interface CheckOptions {
  schedule?: readonly SubsetScheduledPuzzle[];
  livePuzzles?: readonly SubsetScheduledPuzzle[];
  reservePuzzles?: readonly SubsetReservePuzzle[];
  allPuzzles?: readonly SubsetPackPuzzle[];
  rootDir?: string;
  checkBuildOutput?: boolean;
}

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function markdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function formatList(values: readonly string[]): string {
  return values.join("; ");
}

function formatWords(words: readonly string[]): string {
  return words.join("/");
}

function labelsForPuzzle(puzzle: SubsetPackPuzzle): string[] {
  return [...puzzle.rows, ...puzzle.columns].map((category) => category.label);
}

function hasRawMechanicLabel(puzzle: SubsetPackPuzzle): boolean {
  return labelsForPuzzle(puzzle).some((label) =>
    RAW_SUBSET_MECHANIC_LABEL_PATTERN.test(label),
  );
}

function phraseTemplateLabelCount(puzzle: SubsetPackPuzzle): number {
  return labelsForPuzzle(puzzle).filter((label) =>
    PHRASE_TEMPLATE_LABEL_PATTERN.test(label),
  ).length;
}

function sameStructurePatternForLabel(label: string): string | null {
  const trimmed = label.trim();
  if (PHRASE_TEMPLATE_LABEL_PATTERN.test(trimmed)) return "phrase-template";
  const prefixPattern = SAME_STRUCTURE_PREFIX_PATTERNS.find(([pattern]) =>
    pattern.test(trimmed),
  );
  if (prefixPattern) return prefixPattern[1];
  const suffixMatch = trimmed.match(/^(.+)\s+([A-Z][a-z]+)$/);
  if (!suffixMatch) return null;
  const suffix = suffixMatch[2];
  if (!SAME_STRUCTURE_WORDPLAY_CARRIERS.has(suffix)) return null;
  return `wordplay-${suffix.toLowerCase()}`;
}

function labelTokens(label: string): string[] {
  return label
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function sharedTokenPrefix(labels: readonly string[]): string[] {
  const tokenRows = labels.map(labelTokens);
  if (tokenRows.some((tokens) => tokens.length < 2)) return [];
  const shortest = Math.min(...tokenRows.map((tokens) => tokens.length));
  const shared: string[] = [];
  for (let index = 0; index < shortest - 1; index += 1) {
    const token = tokenRows[0][index];
    if (!tokenRows.every((tokens) => tokens[index] === token)) break;
    shared.push(token);
  }
  return shared;
}

function sharedTokenSuffix(labels: readonly string[]): string[] {
  const tokenRows = labels.map(labelTokens);
  if (tokenRows.some((tokens) => tokens.length < 2)) return [];
  const shortest = Math.min(...tokenRows.map((tokens) => tokens.length));
  const shared: string[] = [];
  for (let offset = 1; offset < shortest; offset += 1) {
    const token = tokenRows[0][tokenRows[0].length - offset];
    if (!tokenRows.every((tokens) => tokens[tokens.length - offset] === token)) {
      break;
    }
    shared.unshift(token);
  }
  return shared;
}

function sameStructureRiskForAxis(
  labels: readonly string[],
  axisName: "rows" | "columns",
): string | null {
  const patterns = labels.map(sameStructurePatternForLabel);
  if (patterns.every(Boolean) && new Set(patterns).size === 1) {
    return `${axisName} share ${patterns[0]} grammar (${labels.join(" / ")})`;
  }
  const prefix = sharedTokenPrefix(labels);
  if (prefix.length > 0) {
    return `${axisName} share ${prefix.join(" ")} prefix grammar (${labels.join(
      " / ",
    )})`;
  }
  const suffix = sharedTokenSuffix(labels);
  if (suffix.length > 0) {
    return `${axisName} share ${suffix.join(" ")} suffix grammar (${labels.join(
      " / ",
    )})`;
  }
  return null;
}

export function sameStructureRiskForPuzzle(
  puzzle: SubsetPackPuzzle,
): string | null {
  return (
    sameStructureRiskForAxis(
      puzzle.rows.map((row) => row.label),
      "rows",
    ) ??
    sameStructureRiskForAxis(
      puzzle.columns.map((column) => column.label),
      "columns",
    )
  );
}

function specialistFitTermsForPuzzle(puzzle: SubsetPackPuzzle): string[] {
  const labels = labelsForPuzzle(puzzle);
  const words = puzzle.grid.flat();
  return [...labels, ...words].filter((term) => SPECIALIST_FIT_TERMS.has(term));
}

function propsResetRiskForPuzzle(puzzle: SubsetPackPuzzle): string | null {
  const propsLines = [...puzzle.rows, ...puzzle.columns].filter(
    (line) => line.label === "Props",
  );
  const hasPropsReset = propsLines.some((line) => line.words.includes("RESET"));
  return hasPropsReset ? "RESET is not a clear enough Props fit" : null;
}

export function recognizabilityRiskForPuzzle(
  puzzle: SubsetPackPuzzle,
): string | null {
  const propsResetRisk = propsResetRiskForPuzzle(puzzle);
  if (propsResetRisk) return propsResetRisk;
  const specialistTerms = specialistFitTermsForPuzzle(puzzle);
  if (specialistTerms.length === 0) return null;
  return `specialist terms: ${[...new Set(specialistTerms)].join(", ")}`;
}

function reserveSameStructureAllowlistReason(
  puzzle: SubsetPackPuzzle,
): string | null {
  if (puzzle.packRole !== "reserve") return null;
  return RESERVE_SAME_STRUCTURE_ALLOWLIST.get(puzzle.reserveId) ?? null;
}

function editorialVerdictForPuzzle(
  puzzle: SubsetPackPuzzle,
  issueTags: readonly string[],
  sameStructureRisk: string | null,
  recognizabilityRisk: string | null,
): SubsetEditorialVerdict {
  if (
    puzzle.packRole === "live" &&
    (sameStructureRisk ||
      recognizabilityRisk ||
      issueTags.includes("raw-mechanic") ||
      issueTags.includes("civic-filler"))
  ) {
    return "rewrite-live";
  }
  if (
    puzzle.packRole === "reserve" &&
    (sameStructureRisk || recognizabilityRisk)
  ) {
    return "reserve-tagged";
  }
  if (
    issueTags.includes("watch-score") ||
    issueTags.includes("theme-feel-review")
  ) {
    return "manual-review";
  }
  return "pass";
}

function wordCountsForPuzzles(
  puzzles: readonly SubsetPackPuzzle[],
): Map<string, number> {
  const wordCounts = new Map<string, number>();
  puzzles.forEach((puzzle) => {
    puzzle.grid.flat().forEach((word) => {
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
    });
  });
  return wordCounts;
}

function lineScore(
  line: AuditLine,
  wordCounts: Map<string, number>,
): number {
  let score = 0;
  if (!GENERIC_SUBSET_LABELS.has(line.label)) score += 4;
  if (line.label.includes(" ") || line.label.includes("___")) score += 1;
  if (RAW_SUBSET_MECHANIC_LABEL_PATTERN.test(line.label)) score -= 8;
  if (line.words.every((word) => word.length <= 11)) score += 1;
  score -= Math.max(...line.words.map((word) => wordCounts.get(word) ?? 0)) / 4;
  return score;
}

function describeLine(line: AuditLine): string {
  return `${line.label}: ${formatWords(line.words)}`;
}

function strongestLineForPuzzle(
  puzzle: SubsetPackPuzzle,
  wordCounts: Map<string, number>,
): string {
  const lines = [...puzzle.rows, ...puzzle.columns];
  return describeLine(
    lines.reduce((best, candidate) =>
      lineScore(candidate, wordCounts) > lineScore(best, wordCounts)
        ? candidate
        : best,
    ),
  );
}

function weakestLineForPuzzle(
  puzzle: SubsetPackPuzzle,
  wordCounts: Map<string, number>,
): string {
  const lines = [...puzzle.rows, ...puzzle.columns];
  return describeLine(
    lines.reduce((weakest, candidate) =>
      lineScore(candidate, wordCounts) < lineScore(weakest, wordCounts)
        ? candidate
        : weakest,
    ),
  );
}

function issueTagsForPuzzle(
  puzzle: SubsetPackPuzzle,
  wordCounts: Map<string, number>,
): string[] {
  const tags: string[] = [];
  const labels = labelsForPuzzle(puzzle);
  const score = scoreSubsetPuzzleSatisfaction(puzzle);
  const themeFeel = scoreSubsetThemeFeel(puzzle).overallScore;
  const sameStructureRisk = sameStructureRiskForPuzzle(puzzle);
  const recognizabilityRisk = recognizabilityRiskForPuzzle(puzzle);

  if (hasRawMechanicLabel(puzzle)) tags.push("raw-mechanic");
  if (sameStructureRisk) tags.push("same-structure-risk");
  if (phraseTemplateLabelCount(puzzle) > 2) tags.push("phrase-stack");
  if (recognizabilityRisk) tags.push("recognizability-risk");
  if (
    puzzle.packRole === "live" &&
    puzzle.date === "2026-05-20" &&
    labels.some((label) => /^Starts with /.test(label))
  ) {
    tags.push("may-20-starts-with");
  }
  if (score < 95) tags.push("watch-score");
  if (themeFeel < 95) tags.push("theme-feel-review");
  if (labels.some((label) => GENERIC_SUBSET_LABELS.has(label))) {
    tags.push("generic-label");
  }
  if (puzzle.grid.flat().some((word) => (wordCounts.get(word) ?? 0) >= 13)) {
    tags.push("high-reuse-word");
  }
  if (
    puzzle.packRole === "live" &&
    CIVIC_SUBSET_DATES.has(puzzle.date) &&
    labels.some((label) => label === "Wedding" || label === "School")
  ) {
    tags.push("civic-filler");
  }
  if (puzzle.themeTypes.includes("phrase") || puzzle.themeTypes.includes("wordplay")) {
    tags.push("phrase-fit-review");
  }
  return [...new Set(tags)];
}

function recommendedActionForTags(tags: string[]): string {
  if (tags.includes("may-20-starts-with")) {
    return "Replace immediately; May 20 must stay semantic color-cue wordplay.";
  }
  if (tags.includes("raw-mechanic")) {
    return "Remove unless explicitly approved for a rare palette cleanser.";
  }
  if (tags.includes("same-structure-risk")) {
    return "Rewrite live puzzles; reserve only with an explicit editorial tag.";
  }
  if (tags.includes("phrase-stack")) {
    return "Mix phrase-template reveals with concrete or interaction labels.";
  }
  if (tags.includes("recognizability-risk")) {
    return "Swap toward more player-facing labels or more recognizable words.";
  }
  if (tags.includes("civic-filler")) {
    return "Rebuild with date-appropriate civic or community comparison rows.";
  }
  if (tags.includes("generic-label")) {
    return "Sharpen broad reveal labels into specific player-facing categories.";
  }
  if (tags.includes("theme-feel-review")) {
    return "Improve promise, axis contrast, center appeal, or reveal labels.";
  }
  if (tags.includes("watch-score")) {
    return "Manual editorial review for theme promise and cross-fit.";
  }
  if (tags.includes("high-reuse-word")) {
    return "Keep only if the cross-fit is excellent; consider synonym swaps.";
  }
  if (tags.includes("phrase-fit-review")) {
    return "Spot-check exact phrase/common-language fit.";
  }
  return "Keep; no automated editorial issue.";
}

function puzzleDisplayDate(puzzle: SubsetPackPuzzle): string {
  return puzzle.packRole === "live" ? puzzle.date : puzzle.reserveId;
}

export function getRawSubsetMechanicPuzzles(
  puzzles: readonly SubsetPackPuzzle[] = SUBSET_ALL_PACK_PUZZLES,
): SubsetPackPuzzle[] {
  return puzzles.filter(hasRawMechanicLabel);
}

function buildThemeGroupSummaries(
  puzzles: readonly SubsetPackPuzzle[],
): SubsetThemeGroupSummary[] {
  const groups = new Map<string, SubsetPackPuzzle[]>();
  puzzles.forEach((puzzle) => {
    groups.set(puzzle.themeGroupId, [
      ...(groups.get(puzzle.themeGroupId) ?? []),
      puzzle,
    ]);
  });

  return [...groups.entries()]
    .map(([themeGroupId, groupPuzzles]) => {
      const scores = groupPuzzles.map(scoreSubsetPuzzleSatisfaction);
      const themeFeelScores = groupPuzzles.map(
        (puzzle) => scoreSubsetThemeFeel(puzzle).overallScore,
      );
      return {
        themeGroupId,
        puzzleCount: groupPuzzles.length,
        averageScore:
          scores.reduce((total, score) => total + score, 0) / scores.length,
        averageThemeFeel:
          themeFeelScores.reduce((total, score) => total + score, 0) /
          themeFeelScores.length,
      };
    })
    .sort(
      (first, second) =>
        first.averageScore - second.averageScore ||
        first.averageThemeFeel - second.averageThemeFeel,
    );
}

export function buildSubsetPackAuditReport(
  puzzles: readonly SubsetPackPuzzle[] = SUBSET_ALL_PACK_PUZZLES,
): SubsetPackAuditReport {
  const editorialAudit = getSubsetScheduleEditorialAudit(puzzles);
  const wordCounts = wordCountsForPuzzles(puzzles);
  const rows = puzzles.map((puzzle): SubsetPuzzleAuditRow => {
    const issueTags = issueTagsForPuzzle(puzzle, wordCounts);
    const sameStructureRisk = sameStructureRiskForPuzzle(puzzle);
    const recognizabilityRisk = recognizabilityRiskForPuzzle(puzzle);
    return {
      id: puzzle.id,
      role: puzzle.packRole,
      date: puzzleDisplayDate(puzzle),
      themeGroupTheme: `${puzzle.themeGroupId} / ${puzzle.theme}`,
      laneTypes: `${puzzle.editorialLane} / ${puzzle.themeTypes.join(", ")}`,
      rowLabels: formatList(puzzle.rows.map((row) => row.label)),
      columnLabels: formatList(puzzle.columns.map((column) => column.label)),
      score: scoreSubsetPuzzleSatisfaction(puzzle),
      themeFeelScore: scoreSubsetThemeFeel(puzzle).overallScore,
      sameStructureRisk: sameStructureRisk ?? "none",
      recognizabilityRisk: recognizabilityRisk ?? "none",
      editorialVerdict: editorialVerdictForPuzzle(
        puzzle,
        issueTags,
        sameStructureRisk,
        recognizabilityRisk,
      ),
      issueTags,
      strongestLine: strongestLineForPuzzle(puzzle, wordCounts),
      weakestLine: weakestLineForPuzzle(puzzle, wordCounts),
      recommendedAction: recommendedActionForTags(issueTags),
    };
  });
  const issueCounts: Record<string, number> = {};
  rows.forEach((row) => {
    row.issueTags.forEach((tag) => {
      issueCounts[tag] = (issueCounts[tag] ?? 0) + 1;
    });
  });

  return {
    rows,
    themeGroupSummaries: buildThemeGroupSummaries(puzzles),
    summary: {
      liveCount: puzzles.filter((puzzle) => puzzle.packRole === "live").length,
      reserveCount: puzzles.filter((puzzle) => puzzle.packRole === "reserve")
        .length,
      allCount: puzzles.length,
      rawMechanicCount: getRawSubsetMechanicPuzzles(puzzles).length,
      lateralThemeCount: puzzles.filter(isSubsetLateralThemePuzzle).length,
      averageScore: editorialAudit.satisfaction.averageScore,
      minimumScore: editorialAudit.satisfaction.minimumScore,
      averageThemeFeel: editorialAudit.themeFeel.averageScore,
      minimumThemeFeel: editorialAudit.themeFeel.minimumScore,
      maxWordUse: editorialAudit.wordReuse.maxUse,
      uniqueWords: editorialAudit.wordReuse.uniqueWords,
      sameStructureRiskCount: rows.filter(
        (row) => row.sameStructureRisk !== "none",
      ).length,
      liveSameStructureFailureCount: rows.filter(
        (row) => row.role === "live" && row.sameStructureRisk !== "none",
      ).length,
      recognizabilityRiskCount: rows.filter(
        (row) => row.recognizabilityRisk !== "none",
      ).length,
      liveRecognizabilityFailureCount: rows.filter(
        (row) => row.role === "live" && row.recognizabilityRisk !== "none",
      ).length,
      rewriteLiveCount: rows.filter(
        (row) => row.editorialVerdict === "rewrite-live",
      ).length,
      reserveTaggedCount: rows.filter(
        (row) => row.editorialVerdict === "reserve-tagged",
      ).length,
    },
    issueCounts,
  };
}

export function findStaleSubsetBuildStrings(text: string): string[] {
  return STALE_SUBSET_BUILD_STRINGS.filter((needle) => text.includes(needle));
}

function walkFiles(rootDir: string): string[] {
  if (!existsSync(rootDir)) return [];
  return readdirSync(rootDir).flatMap((entry) => {
    const path = join(rootDir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return walkFiles(path);
    return stats.isFile() ? [path] : [];
  });
}

export function findSubsetBuildDrift(rootDir = process.cwd()): string[] {
  const distDir = join(rootDir, "dist");
  if (!existsSync(distDir)) return [];
  const violations: string[] = [];
  walkFiles(distDir)
    .filter((filePath) => /\.(?:html|js|json|txt)$/.test(filePath))
    .forEach((filePath) => {
      const text = readFileSync(filePath, "utf8");
      const staleStrings = findStaleSubsetBuildStrings(text);
      if (staleStrings.length > 0) {
        violations.push(
          `${relative(rootDir, filePath)} contains stale Subset strings: ${staleStrings.join(
            ", ",
          )}`,
        );
      }
    });
  return violations;
}

function checkLiveOrder(livePuzzles: readonly SubsetScheduledPuzzle[]): string[] {
  const violations: string[] = [];

  livePuzzles.forEach((puzzle, dayIndex) => {
    const expectedDate = addUtcDays(SUBSET_SCHEDULE_START_DATE, dayIndex);
    if (puzzle.date !== expectedDate) {
      violations.push(
        `Expected day ${dayIndex} to be ${expectedDate}, found ${puzzle.date}.`,
      );
    }
    if (puzzle.dayIndex !== dayIndex) {
      violations.push(
        `Expected ${puzzle.date} dayIndex ${dayIndex}, found ${puzzle.dayIndex}.`,
      );
    }
  });

  PINNED_SPECIAL_DATES.forEach((date) => {
    const puzzle = livePuzzles.find((candidate) => candidate.date === date);
    if (!puzzle) {
      violations.push(`${date} pinned special date is missing.`);
      return;
    }
    if (!puzzle.holiday && !puzzle.pillarWord) {
      violations.push(`${date} is not marked as a holiday or special pillar.`);
    }
  });

  for (let index = 1; index < livePuzzles.length; index += 1) {
    const previous = livePuzzles[index - 1];
    const current = livePuzzles[index];
    if (
      scoreSubsetPuzzleSatisfaction(previous) < WEAK_SCORE_ADJACENCY_THRESHOLD &&
      scoreSubsetPuzzleSatisfaction(current) < WEAK_SCORE_ADJACENCY_THRESHOLD
    ) {
      violations.push(
        `${previous.date} and ${current.date} are adjacent low-score puzzles.`,
      );
    }
  }

  let laneStreak = 1;
  for (let index = 1; index < livePuzzles.length; index += 1) {
    if (livePuzzles[index].editorialLane === livePuzzles[index - 1].editorialLane) {
      laneStreak += 1;
      if (laneStreak > 3) {
        violations.push(
          `${livePuzzles[index].date} creates a ${laneStreak}-day ${livePuzzles[index].editorialLane} lane streak.`,
        );
      }
    } else {
      laneStreak = 1;
    }
  }

  for (let index = 0; index <= livePuzzles.length - 7; index += 1) {
    const window = livePuzzles.slice(index, index + 7);
    const primaryTypes = new Set(
      window.flatMap((puzzle) => puzzle.themeTypes),
    );
    const lateralCount = window.filter(isSubsetLateralThemePuzzle).length;
    if (primaryTypes.size < 3) {
      violations.push(
        `${window[0].date}-${window[6].date} has only ${primaryTypes.size} primary theme types.`,
      );
    }
    if (lateralCount > 3) {
      violations.push(
        `${window[0].date}-${window[6].date} has ${lateralCount} lateral themes; max is 3.`,
      );
    }
  }

  for (let index = 0; index <= livePuzzles.length - 14; index += 1) {
    const window = livePuzzles.slice(index, index + 14);
    const lateralCount = window.filter(isSubsetLateralThemePuzzle).length;
    if (lateralCount < 2 || lateralCount > 5) {
      violations.push(
        `${window[0].date}-${window[13].date} has ${lateralCount} lateral themes; expected 2-5.`,
      );
    }
  }

  return violations;
}

export function checkSubsetPackEditorialStandards({
  schedule,
  livePuzzles = schedule ?? SUBSET_LIVE_PUZZLES,
  reservePuzzles = SUBSET_RESERVE_PUZZLES,
  allPuzzles = schedule
    ? [...schedule, ...reservePuzzles]
    : SUBSET_ALL_PACK_PUZZLES,
  rootDir = process.cwd(),
  checkBuildOutput = true,
}: CheckOptions = {}): string[] {
  const violations: string[] = [];
  const liveAudit = getSubsetScheduleEditorialAudit(livePuzzles);
  const allAudit = getSubsetScheduleEditorialAudit(allPuzzles);
  const rawMechanicPuzzles = getRawSubsetMechanicPuzzles(allPuzzles);

  if (livePuzzles.length !== SUBSET_SCHEDULE_DAYS) {
    violations.push(
      `Expected ${SUBSET_SCHEDULE_DAYS} live Subset puzzles, found ${livePuzzles.length}.`,
    );
  }
  if (!schedule && reservePuzzles.length !== SUBSET_RESERVE_DAYS) {
    violations.push(
      `Expected ${SUBSET_RESERVE_DAYS} reserve Subset puzzles, found ${reservePuzzles.length}.`,
    );
  }
  if (!schedule && allPuzzles.length !== SUBSET_ALL_PACK_DAYS) {
    violations.push(
      `Expected ${SUBSET_ALL_PACK_DAYS} total Subset puzzles, found ${allPuzzles.length}.`,
    );
  }

  violations.push(...checkLiveOrder(livePuzzles));

  const boardSignatures = allPuzzles.map((puzzle) =>
    [...puzzle.grid.flat()].sort().join("|"),
  );
  if (new Set(boardSignatures).size !== boardSignatures.length) {
    violations.push("Subset pack contains duplicate board word sets.");
  }

  reservePuzzles.forEach((puzzle) => {
    if ("date" in puzzle && puzzle.date !== undefined) {
      violations.push(`${puzzle.reserveId} reserve unexpectedly has a public date.`);
    }
    if ("dayIndex" in puzzle && puzzle.dayIndex !== undefined) {
      violations.push(`${puzzle.reserveId} reserve unexpectedly has a dayIndex.`);
    }
  });

  if (rawMechanicPuzzles.length > RAW_MECHANIC_MAX_DAYS) {
    violations.push(
      `Raw letter/length mechanics exceed approved cap: ${rawMechanicPuzzles.length}/${RAW_MECHANIC_MAX_DAYS}.`,
    );
  }

  const rawLivePuzzles = rawMechanicPuzzles.filter(
    (puzzle): puzzle is SubsetScheduledPuzzle => puzzle.packRole === "live",
  );
  rawLivePuzzles.forEach((puzzle, index) => {
    if (puzzle.dayIndex <= LAUNCH_WEEK_DAY_LIMIT) {
      violations.push(
        `${puzzle.date} uses a raw mechanic in launch week day ${puzzle.dayIndex}.`,
      );
    }
    const previous = rawLivePuzzles[index - 1];
    if (
      previous &&
      puzzle.dayIndex - previous.dayIndex < RAW_MECHANIC_MIN_GAP_DAYS
    ) {
      violations.push(
        `${puzzle.date} raw mechanic is only ${
          puzzle.dayIndex - previous.dayIndex
        } days after ${previous.date}; minimum is ${RAW_MECHANIC_MIN_GAP_DAYS}.`,
      );
    }
  });

  const may20Puzzle = livePuzzles.find((puzzle) => puzzle.date === "2026-05-20");
  if (!may20Puzzle) {
    violations.push("Missing protected May 20 Subset puzzle.");
  } else {
    if (!/color[- ]cue/.test(may20Puzzle.theme.toLowerCase())) {
      violations.push(
        `May 20 theme drifted to "${may20Puzzle.theme}"; expected color-cue wordplay.`,
      );
    }
    if (
      labelsForPuzzle(may20Puzzle).some((label) => /^Starts with /.test(label))
    ) {
      violations.push("May 20 must not use raw Starts with labels.");
    }
  }

  if (
    liveAudit.lateralThemeCount < LATERAL_THEME_MIN_DAYS ||
    liveAudit.lateralThemeCount > LATERAL_THEME_MAX_DAYS
  ) {
    violations.push(
      `Lateral theme count ${liveAudit.lateralThemeCount} is outside ${LATERAL_THEME_MIN_DAYS}-${LATERAL_THEME_MAX_DAYS}.`,
    );
  }
  if (allAudit.wordReuse.maxUse > SUBSET_MAX_WORD_REUSE_TARGET) {
    violations.push(
      `Max word reuse ${allAudit.wordReuse.maxUse} exceeds ${SUBSET_MAX_WORD_REUSE_TARGET}.`,
    );
  }
  if (allAudit.satisfaction.minimumScore < MINIMUM_SATISFACTION_SCORE) {
    violations.push(
      `All-pack minimum satisfaction ${allAudit.satisfaction.minimumScore} is below ${MINIMUM_SATISFACTION_SCORE}.`,
    );
  }
  if (allAudit.satisfaction.averageScore < AVERAGE_SATISFACTION_SCORE) {
    violations.push(
      `All-pack average satisfaction ${allAudit.satisfaction.averageScore.toFixed(
        2,
      )} is below ${AVERAGE_SATISFACTION_SCORE}.`,
    );
  }
  if (liveAudit.satisfaction.averageScore < AVERAGE_SATISFACTION_SCORE) {
    violations.push(
      `Live average satisfaction ${liveAudit.satisfaction.averageScore.toFixed(
        2,
      )} is below ${AVERAGE_SATISFACTION_SCORE}.`,
    );
  }
  if (allAudit.themeFeel.averageScore < THEME_FEEL_AVERAGE_SCORE) {
    violations.push(
      `Theme-feel average ${allAudit.themeFeel.averageScore.toFixed(
        2,
      )} is below ${THEME_FEEL_AVERAGE_SCORE}.`,
    );
  }

  const labelCounts = new Map<string, number>();
  const genericLabelCounts = new Map<string, number>();
  const centerLastSeen = new Map<string, number>();
  allPuzzles.forEach((puzzle) => {
    const sameStructureRisk = sameStructureRiskForPuzzle(puzzle);
    if (sameStructureRisk) {
      if (puzzle.packRole === "live") {
        violations.push(
          `${puzzle.date} repeats same category structure: ${sameStructureRisk}.`,
        );
      } else if (!reserveSameStructureAllowlistReason(puzzle)) {
        violations.push(
          `${puzzle.reserveId} has same-structure reserve content without an allowlist reason: ${sameStructureRisk}.`,
        );
      }
    }

    if (phraseTemplateLabelCount(puzzle) > 2) {
      violations.push(
        `${puzzleDisplayDate(puzzle)} stacks ${phraseTemplateLabelCount(
          puzzle,
        )} phrase-template labels; cap is 2.`,
      );
    }

    const recognizabilityRisk = recognizabilityRiskForPuzzle(puzzle);
    if (recognizabilityRisk && puzzle.packRole === "live") {
      violations.push(
        `${puzzle.date} has recognizability risk: ${recognizabilityRisk}.`,
      );
    }

    labelsForPuzzle(puzzle).forEach((label) => {
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
      if (GENERIC_SUBSET_LABELS.has(label)) {
        genericLabelCounts.set(label, (genericLabelCounts.get(label) ?? 0) + 1);
      }
      if (label.length > LABEL_HARD_MAX_LENGTH) {
        violations.push(
          `${puzzleDisplayDate(puzzle)} label "${label}" exceeds hard length cap.`,
        );
      }
      if (
        !LABEL_LENGTH_ALLOWLIST.has(label) &&
        label.length > LABEL_SOFT_MAX_LENGTH
      ) {
        violations.push(
          `${puzzleDisplayDate(puzzle)} label "${label}" exceeds soft length cap.`,
        );
      }
    });

    if (puzzle.packRole === "live") {
      const lastCenterSeen = centerLastSeen.get(puzzle.centerWord);
      if (
        lastCenterSeen !== undefined &&
        puzzle.dayIndex - lastCenterSeen < CENTER_REUSE_COOLDOWN_DAYS
      ) {
        violations.push(
          `${puzzle.date} center ${puzzle.centerWord} repeats after ${
            puzzle.dayIndex - lastCenterSeen
          } days; minimum is ${CENTER_REUSE_COOLDOWN_DAYS}.`,
        );
      }
      centerLastSeen.set(puzzle.centerWord, puzzle.dayIndex);

      if (CIVIC_SUBSET_DATES.has(puzzle.date)) {
        const labels = labelsForPuzzle(puzzle);
        if (labels.includes("Wedding") || labels.includes("School")) {
          violations.push(
            `${puzzle.date} civic/remembrance puzzle uses stock Wedding or School filler.`,
          );
        }
      }
    }
  });

  labelCounts.forEach((count, label) => {
    if (count > LABEL_REUSE_CAP) {
      violations.push(`Label "${label}" is used ${count} times; cap is ${LABEL_REUSE_CAP}.`);
    }
  });
  genericLabelCounts.forEach((count, label) => {
    if (count > GENERIC_LABEL_REUSE_CAP) {
      violations.push(
        `Generic label "${label}" is used ${count} times; cap is ${GENERIC_LABEL_REUSE_CAP}.`,
      );
    }
  });

  if (checkBuildOutput) {
    violations.push(...findSubsetBuildDrift(rootDir));
  }

  return violations;
}

export function buildSubsetFullPackAuditMarkdown(
  report = buildSubsetPackAuditReport(),
): string {
  const liveRows = report.rows.filter((row) => row.role === "live");
  const reserveRows = report.rows.filter((row) => row.role === "reserve");
  const averageScore = (rows: readonly SubsetPuzzleAuditRow[]) =>
    rows.reduce((total, row) => total + row.score, 0) / rows.length;
  const minimumScore = (rows: readonly SubsetPuzzleAuditRow[]) =>
    Math.min(...rows.map((row) => row.score));
  const liveLateralCount = SUBSET_LIVE_PUZZLES.filter(
    isSubsetLateralThemePuzzle,
  ).length;
  const reserveLateralCount = SUBSET_RESERVE_PUZZLES.filter(
    isSubsetLateralThemePuzzle,
  ).length;
  const sortedIssueCounts = Object.entries(report.issueCounts).sort(
    (first, second) => second[1] - first[1],
  );
  const issueSummary =
    sortedIssueCounts.length > 0
      ? sortedIssueCounts
          .map(([issue, count]) => `- ${issue}: ${count}`)
          .join("\n")
      : "- none: 400";

  const themeGroupRows = report.themeGroupSummaries
    .map(
      (summary) =>
        `| ${markdownCell(summary.themeGroupId)} | ${summary.puzzleCount} | ${summary.averageScore.toFixed(
          2,
        )} | ${summary.averageThemeFeel.toFixed(2)} |`,
    )
    .join("\n");

  const rows = report.rows
    .map((row) =>
      [
        row.date,
        row.role,
        row.themeGroupTheme,
        row.laneTypes,
        row.rowLabels,
        row.columnLabels,
        String(row.score),
        String(row.themeFeelScore),
        row.sameStructureRisk,
        row.recognizabilityRisk,
        row.editorialVerdict,
        row.issueTags.length > 0 ? row.issueTags.join(", ") : "none",
        row.strongestLine,
        row.weakestLine,
        row.recommendedAction,
      ]
        .map(markdownCell)
        .join(" | "),
    )
    .map((row) => `| ${row} |`)
    .join("\n");

  return `# Subset Full-Pack Editorial Audit

Audit date: 2026-05-21

Source: \`src/data/subsetPack.ts\`

## Summary

- Live puzzles: ${report.summary.liveCount}
- Reserve puzzles: ${report.summary.reserveCount}
- All pack puzzles: ${report.summary.allCount}
- Raw letter/length mechanic puzzles: ${report.summary.rawMechanicCount}
- Lateral theme live target: ${LATERAL_THEME_MIN_DAYS}-${LATERAL_THEME_MAX_DAYS}
- Lateral theme puzzles: ${liveLateralCount} live, ${reserveLateralCount} reserve, ${
    report.summary.lateralThemeCount
  } all
- Live satisfaction: ${averageScore(liveRows).toFixed(2)} average, ${minimumScore(
    liveRows,
  )} minimum
- Reserve satisfaction: ${averageScore(reserveRows).toFixed(
    2,
  )} average, ${minimumScore(reserveRows)} minimum
- All-pack satisfaction: ${report.summary.averageScore.toFixed(2)} average, ${
    report.summary.minimumScore
  } minimum
- Theme feel: ${report.summary.averageThemeFeel.toFixed(2)} average, ${
    report.summary.minimumThemeFeel
  } minimum
- Word reuse: ${report.summary.uniqueWords} unique words, ${
    report.summary.maxWordUse
  } max uses
- Same-structure risks: ${report.summary.sameStructureRiskCount} total, ${
    report.summary.liveSameStructureFailureCount
  } live failures
- Recognizability risks: ${report.summary.recognizabilityRiskCount} total, ${
    report.summary.liveRecognizabilityFailureCount
  } live failures
- Editorial verdicts: ${report.summary.rewriteLiveCount} live rewrites, ${
    report.summary.reserveTaggedCount
  } reserve tags

## Issue Counts

${issueSummary}

## Editorial Standard

Raw \`Starts with X\`, \`Ends in X\`, and \`N Letters\` mechanics are not approved for this authored pack. Live puzzles must not depend on three repeated category-grammar labels on one axis, and technically valid but player-unclear fits are rewrite issues rather than relabeling issues. Reserve experiments may be tagged only when they are not reachable through public date lookup.

## Theme Group Averages

| Theme Group | Puzzles | Average Score | Average Theme Feel |
| --- | ---: | ---: | ---: |
${themeGroupRows}

## Full-Pack Notes

| Date / Reserve | Role | Theme Group / Theme | Lane / Theme Types | Row Labels | Column Labels | Score | Theme Feel | Same-Structure Risk | Recognizability Risk | Verdict | Issue Tags | Strongest Line | Weakest Line | Recommended Action |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
${rows}
`;
}

function writeAuditArtifact(rootDir: string): void {
  const outputPath = join(rootDir, FULL_AUDIT_PATH);
  writeFileSync(outputPath, buildSubsetFullPackAuditMarkdown(), "utf8");
  console.log(`Wrote ${FULL_AUDIT_PATH}`);
}

function printUsageAndExit(): never {
  console.error("Usage: npx tsx scripts/audit_subset_pack.ts --check|--write");
  process.exit(1);
}

export function runSubsetPackAuditCli(argv = process.argv.slice(2)): void {
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const command = argv[0];
  if (command === "--write") {
    writeAuditArtifact(rootDir);
    return;
  }
  if (command === "--check") {
    const violations = checkSubsetPackEditorialStandards({ rootDir });
    if (violations.length > 0) {
      console.error("Subset pack editorial audit failed:");
      violations.forEach((violation) => console.error(`- ${violation}`));
      process.exit(1);
    }
    console.log("Subset pack editorial audit passed.");
    return;
  }
  printUsageAndExit();
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === thisFile) {
  runSubsetPackAuditCli();
}
