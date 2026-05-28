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
const BANNED_ARTWORK_COPY_PATTERNS = [
  /\bpassport\b/i,
  /\b(?:your\s+\w[\w\s-]*\s+thread|broader thread|thread it joins|part of (?:your )?\w[\w\s-]* thread|a thread that)\b/i,
  /\btoday['’]s notes\b/i,
  /\btoday['’]s placard\b/i,
  /\b(?:the|these|did the|from the|in the) notes?\b/i,
  /\btechnique note\b/i,
  /\bdaily lesson\b/i,
  /\bfuture visits\b/i,
  /\bcollecting path\b/i,
  /\bcomparison path\b/i,
  /\bbest comparison set\b/i,
  /\bvisual anchor\b/i,
  /\bmuseum label\b/i,
  /\bwoven or stitched surface\b/i,
  /\bimage points\b/i,
  /\bobject record\b/i,
  /\bmaterial evidence\b/i,
  /\bmaker,\s*material,\s*and\s*date\b/i,
  /\bmaker,\s*date,\s*and\s*medium\b/i,
  /\bspecific material,\s*date,\s*and\s*object record\b/i,
  /\bworked metal object\b/i,
  /\bphotographed subject\b/i,
  /\bpainted scene\b/i,
  /\bdrawn scene\b/i,
  /\bWhat material detail helps explain\b/i,
  /\bWhich art-historical context best frames\b/i,
  /\bWhich period or tradition best helps place\b/i,
  /\bprocess and subject work together\b/i,
  /\bdetached from\b/i,
  /\bclearer meaning\b/i,
  /\bshape the first read\b/i,
  /\bspecific history\b/i,
  /\bsource record\b/i,
  /\bcollection path\b/i,
  /\bvisit strengthen\b/i,
  /\blabel (?:ask|asked|asks)\b/i,
  /\bWhat material did\b.{0,60}\blabel\b/i,
  /\brights information\b/i,
  /\boutside the gallery\b/i,
  /\bsits comfortably inside\b/i,
  /\btag becomes useful shorthand\b/i,
  /\bwork['’]s anchor\b/i,
  /\bopen[- ]access\b/i,
  /\bmaker label\b/i,
  /\bmuseum context\b/i,
  /\bofficial object page\b/i,
  /\bsource metadata\b/i,
  /\bmakes its historical setting tangible through\b/i,
  /\brather than to style alone\b/i,
  /\bmaterial craft\b/i,
  /\bmodern image-making shaped by viewpoint and evidence\b/i,
  /\bhuman presence,\s*patronage,\s*and revived classical forms\b/i,
  /\bdramatic light,\s*movement,\s*and heightened emotion\b/i,
  /\bmaterials,\s*place,\s*and use shaping how art survives\b/i,
  /\britual,\s*status,\s*and forms made for social use\b/i,
  /\bidentity,\s*likeness,\s*and public memory\b/i,
  /\bobject['’]s world\b/i,
  /\btechnology for seeing\b/i,
  /\brelated works\b/i,
  /\bcalendar does\b/i,
  /\bWhat should you try to locate\b/i,
  /\bWhich craft choice matters most\b/i,
  /\bWhich making detail helps explain\b/i,
  /\bWhich art-history lens clarifies\b/i,
  /\bWhat larger world helps\b/i,
  /\bcc0\b/i,
  /\bpublic domain\b/i,
];

const GENERIC_ANSWER_PATTERNS = [
  /^a painted scene$/i,
  /^a drawn scene$/i,
  /^a photographed subject$/i,
  /^a worked metal object$/i,
  /^a (?:painting|print|drawing|photograph|textile|sculpture|design) work$/i,
  /^a male sitter$/i,
  /^a female sitter$/i,
  /\b(?:ignore|ignores|unrelated|instead of close looking|technical manual|sales catalogue|conservation diagram|advertising language|modern scan alone|exact hour|single proven day|fictional scene|military diagram|performance record|natural-history classification)\b/i,
  /\b(?:camera exposure would|oil paint would|interlaced threads would|carved stone would|fired clay would|chiseled stone would|copper plate would|woven threads would)\b/i,
];

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

function countValues(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return counts;
}

function titleFamily(title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\b(?:a|an|the|of|with|from|for|and|or|in|on|at|to|study|fragment|untitled)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return normalized.split(' ').slice(0, 3).join(' ') || title.toLowerCase();
}

function shortTitle(title: string): string {
  return title
    .replace(/,\s*from\b.*$/i, '')
    .replace(/;\s*.*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 72)
    .replace(/[ ,;:]+$/g, '');
}

function isObjectSpecificFact(artwork: MuseumArtwork): boolean {
  const fact = artwork.context.surprisingFact.toLowerCase();
  const tokens = [
    artwork.title,
    shortTitle(artwork.title),
    artwork.artist,
    artwork.medium,
    artwork.objectDate,
    artwork.source.collectionLabel,
    artwork.passportLabel,
    artwork.geoRegion,
  ]
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  return tokens.some((token) => fact.includes(token));
}

function normalizedCopyStem(copy: string, artwork: MuseumArtwork): string {
  let stem = copy.trim().toLowerCase().replace(/\s+/g, ' ');
  const replacements = [
    artwork.title,
    shortTitle(artwork.title),
    artwork.artist,
    artwork.medium,
    artwork.objectDate,
    artwork.passportLabel,
    artwork.periodTag,
    artwork.geoRegion,
    artwork.source.collectionLabel,
  ]
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);
  replacements.forEach((token) => {
    stem = stem.split(token).join('{x}');
  });
  return stem
    .replace(/\b\d{3,4}(?:[-–]\d{2,4})?\b/g, '{date}')
    .replace(/\b(?:ca\.|c\.|about)\s*\{date\}/g, '{date}')
    .split(' ')
    .slice(0, 14)
    .join(' ');
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
      expect(record.review.approvalType).toBe('editor-agent-v1');
      expect(record.review.showcaseTier).toBe('A-showcase');
      expect(record.review.showcaseApprovedBy).toBeTruthy();
      expect(record.review.sourceEvidence?.objectUrl).toBeTruthy();
      expect(record.review.visualQualityNote).toBeTruthy();
      expect(record.review.resolvedRisks?.length ?? 0).toBeGreaterThan(0);
      expect(record.review.approvedBy).toBeTruthy();
      expect(record.review.approvedBy).not.toBe('codex-seed-pass');
      expect(record.review.copyEditedBy).toBeTruthy();
      expect(record.review.factCheckedBy).toBeTruthy();
      expect(record.review.copyPolishV2?.copyStandard).toBe('object-facing-v2-no-museum-mechanics');
      expect(record.review.editorNotes?.length ?? 0).toBeGreaterThan(0);
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
    const facts = CURATED.artworks.map((artwork) => artwork.context.surprisingFact);
    const reinforcements = CURATED.artworks.flatMap((artwork) =>
      artwork.questions.map((question) => question.reinforcement)
    );
    const observationPrompts = CURATED.artworks.flatMap((artwork) =>
      artwork.questions.filter((question) => question.kind === 'observation').map((question) => question.prompt)
    );
    const contextPrompts = CURATED.artworks.flatMap((artwork) =>
      artwork.questions.filter((question) => question.kind === 'context').map((question) => question.prompt)
    );
    const connectionPrompts = CURATED.artworks.flatMap((artwork) =>
      artwork.questions.filter((question) => question.kind === 'connection').map((question) => question.prompt)
    );

    expect(new Set(facts).size).toBeGreaterThanOrEqual(250);
    expect(maxCount(facts)).toBeLessThanOrEqual(3);
    expect(maxCount(prompts)).toBeLessThanOrEqual(12);
    expect(maxCount(reinforcements)).toBeLessThanOrEqual(20);
    expect(CURATED.artworks.filter(isObjectSpecificFact).length).toBeGreaterThanOrEqual(
      Math.ceil(CURATED.artworks.length * 0.95)
    );
    const optionCounts = countValues(CURATED.artworks.flatMap((artwork) =>
      artwork.questions.flatMap((question) => question.options)
    ));
    optionCounts.forEach((count) => {
      expect(count).toBeLessThanOrEqual(40);
    });
    expect(contextPrompts.filter((prompt) => /\b(?:official medium|which medium|recorded medium)\b/i.test(prompt))).toHaveLength(0);
    expect(connectionPrompts.filter((prompt) => /\b(?:passport|thread|label)\b/i.test(prompt)).length).toBeLessThanOrEqual(
      Math.floor(connectionPrompts.length * 0.25)
    );
    observationPrompts.forEach((prompt) => {
      expect(prompt.toLowerCase()).not.toContain('named in today');
    });

    CURATED.artworks.forEach((artwork) => {
      const artworkLearningCopy = [
        ...Object.values(artwork.context),
        ...artwork.questions.flatMap((question) => [
          question.prompt,
          question.reinforcement,
          ...question.options,
        ]),
      ];
      artworkLearningCopy.forEach((copy) => {
        BANNED_ARTWORK_COPY_PATTERNS.forEach((pattern) => {
          expect(copy).not.toMatch(pattern);
        });
      });
      artwork.questions.forEach((question) => {
        question.options.forEach((option) => {
      GENERIC_ANSWER_PATTERNS.forEach((pattern) => {
            expect(option).not.toMatch(pattern);
          });
        });
      });
      const delimiters = [
        [/\(/g, /\)/g],
        [/\[/g, /\]/g],
      ] as const;
      artworkLearningCopy.forEach((copy) => {
        delimiters.forEach(([left, right]) => {
          expect(copy.match(left)?.length ?? 0).toBe(copy.match(right)?.length ?? 0);
        });
        expect((copy.match(/"/g)?.length ?? 0) % 2).toBe(0);
      });
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

    const normalizedStemCounts = countValues(
      CURATED.artworks.flatMap((artwork) => [
        ...Object.values(artwork.context).map((copy) => normalizedCopyStem(copy, artwork)),
        ...artwork.questions.flatMap((question) => [
          normalizedCopyStem(question.prompt, artwork),
          normalizedCopyStem(question.reinforcement, artwork),
        ]),
      ])
    );
    normalizedStemCounts.forEach((count) => {
      expect(count).toBeLessThanOrEqual(40);
    });
  });

  it('meets annual source, medium, and object-family mix gates', () => {
    const sourceCounts = countValues(CURATED.artworks.map((artwork) => artwork.source.institution));
    expect(new Set(sourceCounts.keys())).toEqual(new Set(['met', 'aic', 'rijks', 'nga', 'smithsonian', 'ycba']));
    sourceCounts.forEach((count) => {
      expect(count).toBeLessThanOrEqual(Math.floor(CURATED.artworks.length * 0.35));
    });
    const topTwoSources = [...sourceCounts.values()].sort((left, right) => right - left).slice(0, 2);
    expect(topTwoSources.reduce((sum, count) => sum + count, 0)).toBeLessThanOrEqual(
      Math.floor(CURATED.artworks.length * 0.6)
    );

    const titleCounts = countValues(CURATED.artworks.map((artwork) => artwork.title.toLowerCase().trim()));
    titleCounts.forEach((count) => {
      expect(count).toBeLessThanOrEqual(2);
    });
    const familyCounts = countValues(CURATED.artworks.map((artwork) => titleFamily(artwork.title)));
    familyCounts.forEach((count) => {
      expect(count).toBeLessThanOrEqual(4);
    });

    const mediumCounts = countValues(CURATED.artworks.map((artwork) => artwork.mediumCategory));
    const flatTotal = ['Painting', 'Print', 'Drawing'].reduce((sum, medium) => sum + (mediumCounts.get(medium) ?? 0), 0);
    expect(flatTotal).toBeLessThanOrEqual(Math.floor(CURATED.artworks.length * 0.45));
    expect(mediumCounts.get('Photograph') ?? 0).toBeGreaterThanOrEqual(20);
  });
});
