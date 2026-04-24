import curatedData from './museum/curatedArtworks.json';
import scheduleData from './museum/schedule.json';

export type MuseumQuestionKind = 'observation' | 'context' | 'connection';

export interface MuseumQuestion {
  kind: MuseumQuestionKind;
  prompt: string;
  options: string[];
  answerIndex: number;
  reinforcement: string;
}

export interface MuseumArtwork {
  id: string;
  title: string;
  artist: string;
  objectDate: string;
  medium: string;
  periodKey: string;
  periodTag: string;
  mediumCategory: string;
  geoRegion: string;
  images: {
    thumbnailUrl: string;
    displayUrl: string;
    fullUrl: string;
  };
  context: {
    technique: string;
    surprisingFact: string;
    connection: string;
  };
  questions: MuseumQuestion[];
  source: {
    institution: 'met';
    objectId: number;
    objectUrl: string;
    license: 'CC0';
  };
  presentation?: {
    preferredFrameId?: string;
    allowSpecialShapes?: boolean;
  };
  review: {
    status: 'reviewed';
    factCheckSources: string[];
    safetyFlags: string[];
  };
}

interface MuseumCuratedPayload {
  version: string;
  reviewedAt: string;
  institutionPolicySources: string[];
  artworks: MuseumArtwork[];
}

interface MuseumScheduleEntry {
  date: string;
  artworkId: string;
}

interface MuseumSchedulePayload {
  version: string;
  generatedAt: string;
  start: string;
  days: number;
  entries: MuseumScheduleEntry[];
}

const DAY_MS = 1000 * 60 * 60 * 24;
const CURATED = curatedData as MuseumCuratedPayload;
const SCHEDULE = scheduleData as MuseumSchedulePayload;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function reorderQuestionOptions(question: MuseumQuestion, seed: string): MuseumQuestion {
  const decorated = question.options.map((option, index) => ({
    option,
    originalIndex: index,
    weight: hashString(`${seed}:${index}:${option}`),
  }));

  decorated.sort((left, right) => {
    if (left.weight !== right.weight) return left.weight - right.weight;
    return left.originalIndex - right.originalIndex;
  });

  let answerIndex = decorated.findIndex((entry) => entry.originalIndex === question.answerIndex);

  if (answerIndex === 0 && decorated.length > 1) {
    decorated.push(decorated.shift()!);
    answerIndex = decorated.findIndex((entry) => entry.originalIndex === question.answerIndex);
  }

  return {
    ...question,
    options: decorated.map((entry) => entry.option),
    answerIndex,
  };
}

function prepareArtwork(artwork: MuseumArtwork): MuseumArtwork {
  return {
    ...artwork,
    questions: artwork.questions.map((question, index) =>
      reorderQuestionOptions(question, `${artwork.id}:${index}:${question.prompt}`)
    ),
  };
}

const ARTWORKS = CURATED.artworks.map(prepareArtwork);
const ARTWORK_BY_ID = new Map(ARTWORKS.map((artwork) => [artwork.id, artwork]));
const SCHEDULE_BY_DATE = new Map(SCHEDULE.entries.map((entry) => [entry.date, entry.artworkId]));

function getLocalDayIndex(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

export function getMuseumLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getMuseumArtworkById(id: string): MuseumArtwork | undefined {
  return ARTWORK_BY_ID.get(id);
}

export function getDailyMuseumArtwork(date: Date = new Date()): MuseumArtwork {
  if (ARTWORKS.length === 0) {
    throw new Error('Museum requires at least one curated artwork.');
  }

  const dateKey = getMuseumLocalDateKey(date);
  const scheduledId = SCHEDULE_BY_DATE.get(dateKey);
  const scheduledArtwork = scheduledId ? ARTWORK_BY_ID.get(scheduledId) : undefined;
  if (scheduledArtwork) return scheduledArtwork;

  return ARTWORKS[getLocalDayIndex(date) % ARTWORKS.length];
}

export function getNextMuseumArtwork(date: Date = new Date()): MuseumArtwork {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return getDailyMuseumArtwork(nextDate);
}

export function getMuseumSchedule(): MuseumSchedulePayload {
  return SCHEDULE;
}

export function getMuseumPolicySources(): string[] {
  return CURATED.institutionPolicySources;
}

export const MUSEUM_ARTWORKS = ARTWORKS;
