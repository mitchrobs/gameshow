import {
  SUBSET_ALL_PACK_PUZZLES as AUTHORED_ALL_PACK_PUZZLES,
  SUBSET_LIVE_PUZZLES as AUTHORED_LIVE_PUZZLES,
  SUBSET_RESERVE_PUZZLES as AUTHORED_RESERVE_PUZZLES,
} from "./subsetPack";
import type {
  SubsetCategory,
  SubsetPuzzleDefinition,
  SubsetTile,
  SubsetTileId,
} from "./subsetPrototype";

export const SUBSET_SCHEDULE_START_DATE = "2026-05-15";
export const SUBSET_SCHEDULE_DAYS = 365;
export const SUBSET_RESERVE_DAYS = 35;
export const SUBSET_ALL_PACK_DAYS = 400;
export const SUBSET_SCHEDULE_VERSION = "v2-authored";
export const SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS = 21;
export const SUBSET_MAX_WORD_REUSE_TARGET = 14;

export type SubsetScheduleDifficulty = "easy" | "medium" | "hard";
export type SubsetScheduleLane =
  | "concrete"
  | "modern"
  | "word-form"
  | "phrase"
  | "hybrid"
  | "science"
  | "workshop"
  | "food"
  | "outdoors"
  | "culture"
  | "travel"
  | "music"
  | "everyday"
  | "civic"
  | "wordplay";
export type SubsetThemeType =
  | "place-context"
  | "role-context"
  | "interaction"
  | "phrase"
  | "wordplay"
  | "calendar"
  | "keystone";

export const SUBSET_LATERAL_THEME_TYPES: readonly SubsetThemeType[] = [
  "interaction",
  "phrase",
  "wordplay",
];

export const SUBSET_THEME_TYPE_KEYS: readonly SubsetThemeType[] = [
  "place-context",
  "role-context",
  "interaction",
  "phrase",
  "wordplay",
  "calendar",
  "keystone",
];

export const SUBSET_SCHEDULE_LANE_KEYS: readonly SubsetScheduleLane[] = [
  "concrete",
  "modern",
  "word-form",
  "phrase",
  "hybrid",
  "science",
  "workshop",
  "food",
  "outdoors",
  "culture",
  "travel",
  "music",
  "everyday",
  "civic",
  "wordplay",
];

export interface SubsetScheduleCategory {
  label: string;
  words: readonly string[];
}

export interface SubsetPackPuzzleBase {
  id: string;
  difficulty: SubsetScheduleDifficulty;
  editorialLane: SubsetScheduleLane;
  themeTypes: readonly SubsetThemeType[];
  theme: string;
  themeGroupId: string;
  centerWord: string;
  rows: readonly SubsetScheduleCategory[];
  columns: readonly SubsetScheduleCategory[];
  grid: readonly (readonly string[])[];
  pillarWord?: string;
  holiday?: {
    name: string;
    axis: "row" | "column";
    index: number;
    label: string;
  };
}

export interface SubsetScheduledPuzzle extends SubsetPackPuzzleBase {
  packRole: "live";
  date: string;
  dayIndex: number;
  reserveId?: never;
}

export interface SubsetReservePuzzle extends SubsetPackPuzzleBase {
  packRole: "reserve";
  reserveId: string;
  date?: never;
  dayIndex?: never;
}

export type SubsetPackPuzzle = SubsetScheduledPuzzle | SubsetReservePuzzle;

export interface SubsetThemeFeelScore {
  themePromise: number;
  axisContrast: number;
  crossFit: number;
  ahaQuality: number;
  freshness: number;
  centerAppeal: number;
  calendarTone: number;
  overallScore: number;
}

export interface SubsetScheduleEditorialAudit {
  difficultyCounts: Record<SubsetScheduleDifficulty, number>;
  laneCounts: Record<SubsetScheduleLane, number>;
  themeTypeCounts: Record<SubsetThemeType, number>;
  lateralThemeCount: number;
  satisfaction: {
    averageScore: number;
    minimumScore: number;
  };
  themeFeel: {
    averageScore: number;
    minimumScore: number;
  };
  wordReuse: {
    uniqueWords: number;
    maxUse: number;
    averageUse: number;
    underSoftCooldownCount: number;
    softCooldownDays: number;
  };
}

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

const KEYSTONE_CENTER_WORDS = new Set([
  "HOPE",
  "VOTE",
  "HEART",
  "LIGHT",
  "HOME",
  "PEACE",
  "UNITY",
]);

const RAW_SUBSET_MECHANIC_LABEL_PATTERN =
  /^(?:Starts with [A-Z]|Ends in [A-Z]|\d+ Letters)$/;
const PHRASE_TEMPLATE_LABEL_PATTERN = /___|^(?:After|Before)\s+/i;

export const SUBSET_LIVE_PUZZLES: readonly SubsetScheduledPuzzle[] =
  AUTHORED_LIVE_PUZZLES;
export const SUBSET_RESERVE_PUZZLES: readonly SubsetReservePuzzle[] =
  AUTHORED_RESERVE_PUZZLES;
export const SUBSET_ALL_PACK_PUZZLES: readonly SubsetPackPuzzle[] =
  AUTHORED_ALL_PACK_PUZZLES;
export const SUBSET_SCHEDULE: readonly SubsetScheduledPuzzle[] =
  SUBSET_LIVE_PUZZLES;

export const SUBSET_HOLIDAYS = SUBSET_SCHEDULE.filter(
  (puzzle) => puzzle.holiday,
).map((puzzle) => ({
  date: puzzle.date,
  name: puzzle.holiday?.name ?? "",
}));

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createTileId(word: string, index: number): SubsetTileId {
  return `${slugify(word)}-${index}`;
}

function createFallbackUnsolvedBoard(
  solutionBoard: SubsetTileId[],
): SubsetTileId[] {
  const fallbackPattern = [0, 1, 3, 2, 4, 6, 5, 8, 7];
  return fallbackPattern.map((index) => solutionBoard[index]);
}

export function createSubsetPuzzleDefinitionFromScheduledPuzzle(
  puzzle: SubsetPackPuzzle,
): SubsetPuzzleDefinition {
  const words = puzzle.grid.flat();
  const idsByWord = new Map<string, SubsetTileId>(
    words.map((word, index) => [word, createTileId(word, index)]),
  );
  const tiles: SubsetTile[] = words.map((word) => ({
    id: idsByWord.get(word) ?? slugify(word),
    word,
  }));
  const solutionGrid = puzzle.grid.map((row) =>
    row.map((word) => idsByWord.get(word) ?? slugify(word)),
  );
  const solutionBoard = solutionGrid.flat();
  const rowCategories: SubsetCategory[] = puzzle.rows.map((row, index) => ({
    id: `row-${index}-${slugify(row.label)}`,
    axis: "row",
    index,
    label: row.label,
    tileIds: row.words.map((word) => idsByWord.get(word) ?? slugify(word)),
  }));
  const columnCategories: SubsetCategory[] = puzzle.columns.map(
    (column, index) => ({
      id: `column-${index}-${slugify(column.label)}`,
      axis: "column",
      index,
      label: column.label,
      tileIds: column.words.map((word) => idsByWord.get(word) ?? slugify(word)),
    }),
  );

  return {
    id: puzzle.id,
    date: puzzle.packRole === "live" ? puzzle.date : undefined,
    title: puzzle.holiday?.name ?? puzzle.pillarWord ?? "Daily puzzle",
    tiles,
    solutionGrid,
    solutionBoard,
    fallbackUnsolvedBoard: createFallbackUnsolvedBoard(solutionBoard),
    fixedCell: {
      index: 4,
      tileId: solutionBoard[4],
    },
    rowCategories,
    columnCategories,
    categories: [...rowCategories, ...columnCategories],
  };
}

function countBy<T extends string>(
  values: readonly T[],
  keys: readonly T[],
): Record<T, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<
    T,
    number
  >;
  values.forEach((value) => {
    counts[value] += 1;
  });
  return counts;
}

function labelPenalty(labels: readonly string[]): number {
  const phraseTemplateCount = labels.filter((label) =>
    PHRASE_TEMPLATE_LABEL_PATTERN.test(label),
  ).length;
  return labels.reduce((penalty, label) => {
    if (GENERIC_SUBSET_LABELS.has(label)) return penalty + 1.5;
    if (RAW_SUBSET_MECHANIC_LABEL_PATTERN.test(label)) return penalty + 20;
    if (label.length > 20) return penalty + 2;
    return penalty;
  }, Math.max(0, phraseTemplateCount - 2) * 4);
}

function hasDistinctLabels(lines: readonly SubsetScheduleCategory[]): boolean {
  return new Set(lines.map((line) => line.label)).size === lines.length;
}

export function isSubsetLateralThemeType(
  themeType: SubsetThemeType,
): boolean {
  return SUBSET_LATERAL_THEME_TYPES.includes(themeType);
}

export function isSubsetLateralThemePuzzle(
  puzzle: Pick<SubsetPackPuzzle, "themeTypes">,
): boolean {
  return puzzle.themeTypes.some(isSubsetLateralThemeType);
}

export function scoreSubsetPuzzleStructure(puzzle: SubsetPackPuzzle): number {
  const words = puzzle.grid.flat();
  const labels = [...puzzle.rows, ...puzzle.columns].map(
    (category) => category.label,
  );
  let score = 91;

  if (puzzle.holiday) score += 3;
  if (puzzle.pillarWord) score += 3;
  if (puzzle.editorialLane === "word-form") score -= 8;
  if (puzzle.editorialLane === "concrete" || puzzle.editorialLane === "modern")
    score += 2;
  if (puzzle.editorialLane === "phrase" || puzzle.editorialLane === "hybrid")
    score += 3;
  if (puzzle.editorialLane === "wordplay") score += 3;
  if (puzzle.themeTypes.includes("place-context")) score += 2;
  if (puzzle.themeTypes.includes("role-context")) score += 2;
  if (puzzle.themeTypes.includes("interaction")) score += 2;
  if (puzzle.themeTypes.includes("phrase")) score += 2;
  if (puzzle.themeTypes.includes("wordplay")) score += 2;
  if (puzzle.themeTypes.includes("calendar")) score += 1;
  if (puzzle.themeTypes.includes("keystone")) score += 2;
  if (puzzle.difficulty === "easy") score += 1;
  if (puzzle.difficulty === "hard") score -= 1;
  if (words.some((word) => word.length > 11)) score -= 1;
  if (hasDistinctLabels(puzzle.rows)) score += 2;
  if (hasDistinctLabels(puzzle.columns)) score += 2;
  score -= labelPenalty(labels);
  if (KEYSTONE_CENTER_WORDS.has(puzzle.centerWord)) score += 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreSubsetThemeFeel(
  puzzle: SubsetPackPuzzle,
): SubsetThemeFeelScore {
  const labels = [...puzzle.rows, ...puzzle.columns].map(
    (category) => category.label,
  );
  const genericPenalty = labels.filter((label) =>
    GENERIC_SUBSET_LABELS.has(label),
  ).length;
  const rawPenalty = labels.some((label) =>
    RAW_SUBSET_MECHANIC_LABEL_PATTERN.test(label),
  )
    ? 24
    : 0;
  const phraseTemplatePenalty =
    Math.max(
      0,
      labels.filter((label) => PHRASE_TEMPLATE_LABEL_PATTERN.test(label))
        .length - 2,
    ) * 5;
  const longWordPenalty = puzzle.grid
    .flat()
    .filter((word) => word.length > 12).length;
  const calendarFillerPenalty =
    puzzle.holiday &&
    labels.some((label) => label === "Wedding" || label === "School")
      ? 10
      : 0;

  const themePromise =
    99 - rawPenalty - phraseTemplatePenalty - (puzzle.theme.length < 12 ? 4 : 0);
  const axisContrast =
    99 -
    (hasDistinctLabels(puzzle.rows) ? 0 : 4) -
    (hasDistinctLabels(puzzle.columns) ? 0 : 4) -
    genericPenalty;
  const crossFit = 99 - rawPenalty / 2 - longWordPenalty;
  const ahaQuality =
    99 -
    genericPenalty * 2 -
    phraseTemplatePenalty +
    (isSubsetLateralThemePuzzle(puzzle) ? 1 : 0) +
    (puzzle.pillarWord ? 1 : 0);
  const freshness =
    99 -
    genericPenalty * 2 -
    (puzzle.editorialLane === "word-form" ? 5 : 0);
  const centerAppeal =
    98 +
    (KEYSTONE_CENTER_WORDS.has(puzzle.centerWord) ? 2 : 0) -
    (puzzle.centerWord.length <= 3 ? 2 : 0);
  const calendarTone = 99 - calendarFillerPenalty;

  const parts = {
    themePromise,
    axisContrast,
    crossFit,
    ahaQuality,
    freshness,
    centerAppeal,
    calendarTone,
  };
  const clampedParts = Object.fromEntries(
    Object.entries(parts).map(([key, value]) => [
      key,
      Math.max(0, Math.min(100, Math.round(value))),
    ]),
  ) as Omit<SubsetThemeFeelScore, "overallScore">;
  const values = Object.values(clampedParts);
  const overallScore = Math.round(
    values.reduce((total, score) => total + score, 0) / values.length,
  );

  return {
    ...clampedParts,
    overallScore,
  };
}

export function scoreSubsetPuzzleSatisfaction(
  puzzle: SubsetPackPuzzle,
): number {
  const structuralScore = scoreSubsetPuzzleStructure(puzzle);
  const themeFeelScore = scoreSubsetThemeFeel(puzzle).overallScore;
  return Math.max(
    0,
    Math.min(100, Math.round(structuralScore * 0.35 + themeFeelScore * 0.65)),
  );
}

export function getSubsetScheduleEditorialAudit(
  schedule: readonly SubsetPackPuzzle[] = SUBSET_SCHEDULE,
): SubsetScheduleEditorialAudit {
  const wordCounts = new Map<string, number>();
  const wordLastSeen = new Map<string, number>();
  let underSoftCooldownCount = 0;

  schedule.forEach((puzzle, orderIndex) => {
    const puzzleOrder = puzzle.packRole === "live" ? puzzle.dayIndex : orderIndex;
    puzzle.grid.flat().forEach((word) => {
      const lastSeen = wordLastSeen.get(word);
      if (
        lastSeen !== undefined &&
        puzzleOrder - lastSeen < SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS
      ) {
        underSoftCooldownCount += 1;
      }
      wordLastSeen.set(word, puzzleOrder);
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
    });
  });

  const uses = [...wordCounts.values()];
  const satisfactionScores = schedule.map(scoreSubsetPuzzleSatisfaction);
  const themeFeelScores = schedule.map(
    (puzzle) => scoreSubsetThemeFeel(puzzle).overallScore,
  );

  return {
    difficultyCounts: countBy(
      schedule.map((puzzle) => puzzle.difficulty),
      ["easy", "medium", "hard"],
    ),
    laneCounts: countBy(
      schedule.map((puzzle) => puzzle.editorialLane),
      SUBSET_SCHEDULE_LANE_KEYS,
    ),
    themeTypeCounts: countBy(
      schedule.flatMap((puzzle) => puzzle.themeTypes),
      SUBSET_THEME_TYPE_KEYS,
    ),
    lateralThemeCount: schedule.filter(isSubsetLateralThemePuzzle).length,
    satisfaction: {
      averageScore:
        satisfactionScores.reduce((total, score) => total + score, 0) /
        satisfactionScores.length,
      minimumScore: Math.min(...satisfactionScores),
    },
    themeFeel: {
      averageScore:
        themeFeelScores.reduce((total, score) => total + score, 0) /
        themeFeelScores.length,
      minimumScore: Math.min(...themeFeelScores),
    },
    wordReuse: {
      uniqueWords: wordCounts.size,
      maxUse: Math.max(...uses),
      averageUse: uses.reduce((total, count) => total + count, 0) / uses.length,
      underSoftCooldownCount,
      softCooldownDays: SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS,
    },
  };
}

export function getSubsetPuzzleForDate(
  dateKey: string,
): SubsetScheduledPuzzle | null {
  return SUBSET_SCHEDULE.find((puzzle) => puzzle.date === dateKey) ?? null;
}

export function getSubsetPackPuzzleForDate(
  dateKey: string,
): SubsetScheduledPuzzle | null {
  if (dateKey < SUBSET_SCHEDULE_START_DATE) return null;
  return getSubsetPuzzleForDate(dateKey);
}

export function getTodaysSubsetPuzzle(
  today = new Date(),
): SubsetScheduledPuzzle | null {
  return getSubsetPackPuzzleForDate(toDateKey(today));
}
