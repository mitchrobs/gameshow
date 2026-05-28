import curatedData from './museum/curatedArtworks.json';
import scheduleData from './museum/schedule.json';

export type MuseumQuestionKind = 'observation' | 'context' | 'connection';
export type MuseumInstitution = 'met' | 'aic' | 'rijks' | 'nga' | 'smithsonian' | 'ycba';

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
  passportLabel: string;
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
  source: MuseumArtworkSource;
  presentation?: {
    preferredFrameId?: string;
    allowSpecialShapes?: boolean;
  };
  review: MuseumArtworkReview;
}

export interface MuseumArtworkSource {
  institution: MuseumInstitution;
  collectionLabel: string;
  objectId: number | string;
  objectUrl: string;
  license: string;
}

export interface MuseumArtworkReview {
  status: 'approved';
  approvedAt: string;
  approvedBy?: string;
  approvalType?: 'editor-agent-v1';
  showcaseTier?: 'A-showcase';
  showcaseApprovedBy?: string;
  copyEditedBy?: string;
  factCheckedBy?: string;
  factCheckSources: string[];
  sourceEvidence?: {
    objectUrl?: string;
    sourceType?: string;
    title?: string;
    date?: string;
    medium?: string;
    classification?: string;
    originTerms?: string[];
    subjectTerms?: string[];
    sourceTerms?: string[];
    supports?: Record<string, boolean>;
  };
  copyPolishV2?: {
    visibleFeature?: string;
    objectLesson?: string;
    historicalBridge?: string;
    copyStandard?: string;
  };
  naturalLanguageV1?: {
    status: 'resolved';
    reviewers: string[];
    issues: string[];
    resolvedAt: string;
  };
  visualQualityNote?: string;
  resolvedRisks?: string[];
  safetyFlags: string[];
  editorNotes?: string[];
}

export interface MuseumEditorialRecord {
  id: string;
  source: MuseumArtworkSource;
  rawSource: {
    title: string;
    artist: string;
    objectDate: string;
    medium: string;
    department: string;
    culture: string;
    period: string;
    country: string;
    place: string;
    classification: string;
    collection: string;
    subjectTerms: string[];
    images: MuseumArtwork['images'];
  };
  artwork: Omit<MuseumArtwork, 'source' | 'review'> | null;
  workflow: {
    status: 'sourced' | 'drafted' | 'fact-checked' | 'copy-edited' | 'approved';
    copyScope: string[];
    sourcedAt: string;
    draftedAt?: string | null;
    factCheckedAt?: string | null;
    copyEditedAt?: string | null;
    approvedAt?: string | null;
    approvedBy?: string;
    blockers: string[];
  };
  review: {
    status: 'sourced' | 'drafted' | 'fact-checked' | 'copy-edited' | 'approved';
    approvedAt?: string | null;
    approvedBy?: string;
    approvalType?: 'editor-agent-v1' | '';
    showcaseTier?: 'A-showcase' | '';
    showcaseApprovedBy?: string;
    copyEditedBy?: string;
    factCheckedBy?: string;
    factCheckSources: string[];
    sourceEvidence?: MuseumArtworkReview['sourceEvidence'];
    copyPolishV2?: MuseumArtworkReview['copyPolishV2'];
    naturalLanguageV1?: MuseumArtworkReview['naturalLanguageV1'];
    visualQualityNote?: string;
    resolvedRisks?: string[];
    safetyFlags: string[];
    editorNotes?: string[];
    notes?: string;
  };
  qa: {
    structuralPass: boolean;
    checklist: Record<string, boolean>;
    blockers: string[];
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
  through: string;
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

function resolveMuseumImageUrl(url: string): string {
  const normalized = url.trim();
  if (normalized.startsWith('/museum-images/')) {
    return normalized.slice(1);
  }
  return normalized;
}

function prepareArtwork(artwork: MuseumArtwork): MuseumArtwork {
  return {
    ...artwork,
    images: {
      thumbnailUrl: resolveMuseumImageUrl(artwork.images.thumbnailUrl),
      displayUrl: resolveMuseumImageUrl(artwork.images.displayUrl),
      fullUrl: resolveMuseumImageUrl(artwork.images.fullUrl),
    },
    questions: artwork.questions.map((question, index) =>
      reorderQuestionOptions(question, `${artwork.id}:${index}:${question.prompt}`)
    ),
  };
}

const ARTWORKS = CURATED.artworks.map(prepareArtwork);
const ARTWORK_BY_ID = new Map(ARTWORKS.map((artwork) => [artwork.id, artwork]));
const SCHEDULE_BY_DATE = new Map(SCHEDULE.entries.map((entry) => [entry.date, entry.artworkId]));
const FIRST_SCHEDULED_ARTWORK = SCHEDULE.entries[0]
  ? ARTWORK_BY_ID.get(SCHEDULE.entries[0].artworkId)
  : undefined;
const LAST_SCHEDULED_ARTWORK = SCHEDULE.entries.length
  ? ARTWORK_BY_ID.get(SCHEDULE.entries[SCHEDULE.entries.length - 1].artworkId)
  : undefined;

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

export function isMuseumPackDateCovered(date: Date = new Date()): boolean {
  const dateKey = getMuseumLocalDateKey(date);
  return dateKey >= SCHEDULE.start && dateKey <= SCHEDULE.through;
}

export function getMuseumPackMetadata(): Pick<MuseumSchedulePayload, 'start' | 'through' | 'days'> {
  return {
    start: SCHEDULE.start,
    through: SCHEDULE.through,
    days: SCHEDULE.days,
  };
}

export function getDailyMuseumArtwork(date: Date = new Date()): MuseumArtwork {
  if (ARTWORKS.length === 0) {
    throw new Error('Museum requires at least one curated artwork.');
  }

  const dateKey = getMuseumLocalDateKey(date);
  if (isMuseumPackDateCovered(date)) {
    const scheduledId = SCHEDULE_BY_DATE.get(dateKey);
    if (!scheduledId) {
      throw new Error(`Museum annual pack is missing an entry for ${dateKey}.`);
    }
    const scheduledArtwork = ARTWORK_BY_ID.get(scheduledId);
    if (!scheduledArtwork) {
      throw new Error(`Museum annual pack references unknown artwork ${scheduledId}.`);
    }
    return scheduledArtwork;
  }

  if (dateKey < SCHEDULE.start && FIRST_SCHEDULED_ARTWORK) return FIRST_SCHEDULED_ARTWORK;
  if (dateKey > SCHEDULE.through && LAST_SCHEDULED_ARTWORK) return LAST_SCHEDULED_ARTWORK;

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
