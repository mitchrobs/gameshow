import { describe, expect, it } from 'vitest';
import editorialBank from './museum/editorialBank.json';
import curatedData from './museum/curatedArtworks.json';
import scheduleData from './museum/schedule.json';
import {
  getDailyMuseumArtwork,
  getMuseumArtworkById,
  getMuseumPackMetadata,
  isMuseumPackDateCovered,
  type MuseumArtwork,
  type MuseumEditorialRecord,
} from './museumArtworks';

interface MuseumEditorialPayload {
  version: string;
  generatedAt: string;
  records: MuseumEditorialRecord[];
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

const EDITORIAL = editorialBank as MuseumEditorialPayload;
const CURATED = curatedData as MuseumCuratedPayload;
const SCHEDULE = scheduleData as MuseumSchedulePayload;

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function dayDiff(left: string, right: string): number {
  return Math.round((parseDate(right).getTime() - parseDate(left).getTime()) / (1000 * 60 * 60 * 24));
}

function monthKey(value: string): string {
  return value.slice(0, 7);
}

function maxCount(values: string[]): number {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return Math.max(...counts.values());
}

describe('museum annual pack', () => {
  it('keeps a review-tracked editorial bank and exports approved-only runtime content', () => {
    expect(EDITORIAL.records.length).toBeGreaterThanOrEqual(365);
    const supportedSources = new Set(EDITORIAL.records.map((record) => record.source.institution));
    expect(supportedSources).toEqual(new Set(['met', 'aic', 'rijks', 'nga', 'smithsonian', 'ycba']));

    const approved = EDITORIAL.records.filter((record) => record.workflow.status === 'approved');
    expect(approved).toHaveLength(CURATED.artworks.length);
    approved.forEach((record) => {
      expect(record.qa.structuralPass).toBe(true);
      expect(record.qa.blockers).toHaveLength(0);
      expect(record.review.approvedAt).toBeTruthy();
      expect(record.artwork).not.toBeNull();
    });
  });

  it('ships a 365-day zero-repeat annual schedule with explicit coverage metadata', () => {
    expect(SCHEDULE.days).toBe(365);
    expect(SCHEDULE.entries).toHaveLength(365);
    expect(new Set(SCHEDULE.entries.map((entry) => entry.date)).size).toBe(365);
    expect(new Set(SCHEDULE.entries.map((entry) => entry.artworkId)).size).toBe(365);
    expect(SCHEDULE.start).toBe(getMuseumPackMetadata().start);
    expect(SCHEDULE.through).toBe(getMuseumPackMetadata().through);
  });

  it('has no date gaps, no same-artist cooldown breaks, and no invalid streaks', () => {
    const artworkById = new Map(CURATED.artworks.map((artwork) => [artwork.id, artwork]));
    const europeByMonth = new Map<string, number>();
    const totalByMonth = new Map<string, number>();

    SCHEDULE.entries.forEach((entry, index) => {
      const artwork = artworkById.get(entry.artworkId);
      expect(artwork, `${entry.artworkId} should exist in curated export`).toBeTruthy();
      if (index > 0) {
        expect(dayDiff(SCHEDULE.entries[index - 1].date, entry.date)).toBe(1);
      }

      const recent = SCHEDULE.entries.slice(Math.max(0, index - 6), index).map((recentEntry) => {
        const recentArtwork = artworkById.get(recentEntry.artworkId);
        expect(recentArtwork).toBeTruthy();
        return recentArtwork!;
      });
      recent.forEach((recentArtwork) => {
        expect(recentArtwork.artist).not.toBe(artwork!.artist);
      });

      if (index >= 2) {
        const twoBack = artworkById.get(SCHEDULE.entries[index - 2].artworkId)!;
        const oneBack = artworkById.get(SCHEDULE.entries[index - 1].artworkId)!;
        expect(
          !(twoBack.periodKey === oneBack.periodKey && oneBack.periodKey === artwork!.periodKey)
        ).toBe(true);
        expect(
          !(twoBack.mediumCategory === oneBack.mediumCategory && oneBack.mediumCategory === artwork!.mediumCategory)
        ).toBe(true);
        expect(
          !(
            twoBack.source.institution === oneBack.source.institution &&
            oneBack.source.institution === artwork!.source.institution
          )
        ).toBe(true);
        expect(
          !(
            twoBack.source.collectionLabel === oneBack.source.collectionLabel &&
            oneBack.source.collectionLabel === artwork!.source.collectionLabel
          )
        ).toBe(true);
      }

      const key = monthKey(entry.date);
      totalByMonth.set(key, (totalByMonth.get(key) ?? 0) + 1);
      if (artwork!.geoRegion === 'Europe') {
        europeByMonth.set(key, (europeByMonth.get(key) ?? 0) + 1);
      }
    });

    [...totalByMonth.entries()].forEach(([key, total]) => {
      const europe = europeByMonth.get(key) ?? 0;
      expect(europe).toBeLessThanOrEqual(Math.floor(total * 0.4));
    });
  });

  it('resolves every scheduled date explicitly through the runtime accessor', () => {
    const answerPositions = new Set<number>();
    SCHEDULE.entries.forEach((entry) => {
      expect(isMuseumPackDateCovered(new Date(`${entry.date}T12:00:00`))).toBe(true);
      const artwork = getDailyMuseumArtwork(new Date(`${entry.date}T12:00:00`));
      expect(artwork.id).toBe(entry.artworkId);
      expect(getMuseumArtworkById(entry.artworkId)?.id).toBe(entry.artworkId);
      expect(artwork.source.collectionLabel.length).toBeGreaterThan(2);
      expect(artwork.review.status).toBe('approved');
      expect(artwork.questions).toHaveLength(3);
      expect(new Set(artwork.questions.map((question) => question.kind))).toEqual(
        new Set(['observation', 'context', 'connection'])
      );
      artwork.questions.forEach((question) => {
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options.map((option) => option.trim().toLowerCase())).size).toBe(4);
        answerPositions.add(question.answerIndex);
      });
    });
    expect(answerPositions.size).toBeGreaterThan(1);
    expect(answerPositions).not.toEqual(new Set([0]));
  });

  it('keeps player-facing copy varied and label-like across the pack', () => {
    const prompts = CURATED.artworks.flatMap((artwork) => artwork.questions.map((question) => question.prompt));
    const observationPrompts = CURATED.artworks.flatMap((artwork) =>
      artwork.questions.filter((question) => question.kind === 'observation').map((question) => question.prompt)
    );

    expect(maxCount(prompts)).toBeLessThanOrEqual(130);
    observationPrompts.forEach((prompt) => {
      expect(prompt.toLowerCase()).not.toContain('named in today');
    });

    CURATED.artworks.forEach((artwork) => {
      expect(artwork.title).not.toMatch(/<[^>]+>/);
      expect(artwork.medium).not.toMatch(/<[^>]+>/);
      expect(artwork.medium.length).toBeLessThanOrEqual(140);
      expect(artwork.periodTag).not.toMatch(/\b(?:SAAM|NPG|NMAfA|FSG|CHNDM)\b/);
      expect(artwork.artist).not.toMatch(/,\s*\d{1,2}\s+[A-Z][a-z]{2}\s+\d{3,4}/);
      expect(artwork.artist).not.toMatch(/\b(?:Japanese|French|Italian|Dutch|German|British|American),?\s+\d{4}/i);
      expect(artwork.artist).not.toMatch(/[\u3040-\u30ff\u3400-\u9fff]/);
      expect(artwork.artist).not.toMatch(/^anonymous$/i);
      expect(artwork.artist).not.toMatch(/^unidentified(?: artist)?$/i);
    });
  });
});
