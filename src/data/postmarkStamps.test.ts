import { describe, expect, it } from 'vitest';
import {
  getPostmarkStampForStart,
  hashPostmarkStampSeed,
  postmarkStampDirectionSpecs,
  type PostmarkStampFamily,
} from './postmarkStamps';

describe('Postmark stamp direction specs', () => {
  it('ships exactly 40 notification stamps with the expected family mix', () => {
    const familyCounts: Record<PostmarkStampFamily, number> = {
      'inbox-tile': 0,
      'signal-block': 0,
      'soft-alert': 0,
    };
    const ids = new Set<string>();

    postmarkStampDirectionSpecs.forEach((spec) => {
      ids.add(spec.id);
      familyCounts[spec.family] += 1;
    });

    expect(postmarkStampDirectionSpecs).toHaveLength(40);
    expect(ids.size).toBe(40);
    expect(familyCounts).toEqual({
      'inbox-tile': 14,
      'signal-block': 13,
      'soft-alert': 13,
    });
  });

  it('keeps stamp art inside the mask and lets the notification badge overhang the rim', () => {
    postmarkStampDirectionSpecs.forEach((spec) => {
      expect(spec.viewBox).toBe('0 0 100 100');
      expect(spec.path.length).toBeGreaterThan(20);
      expect(spec.numberBox.x).toBeGreaterThanOrEqual(60);
      expect(spec.numberBox.y).toBeGreaterThanOrEqual(-8);
      expect(spec.numberBox.width).toBeGreaterThan(0);
      expect(spec.numberBox.height).toBeGreaterThan(0);
      expect(spec.numberBox.x + spec.numberBox.width).toBeGreaterThan(100);
      expect(spec.numberBox.x + spec.numberBox.width).toBeLessThanOrEqual(108);
      expect(spec.numberBox.y + spec.numberBox.height).toBeLessThanOrEqual(40);
      expect(spec.artBox.x).toBeGreaterThanOrEqual(0);
      expect(spec.artBox.y).toBeGreaterThanOrEqual(0);
      expect(spec.artBox.width).toBeGreaterThan(0);
      expect(spec.artBox.height).toBeGreaterThan(0);
      expect(spec.artBox.x + spec.artBox.width).toBeLessThanOrEqual(100);
      expect(spec.artBox.y + spec.artBox.height).toBeLessThanOrEqual(100);
    });
  });

  it('uses full-stamp artwork with a large square notification box', () => {
    postmarkStampDirectionSpecs.forEach((spec) => {
      expect(spec.artBox.x).toBe(0);
      expect(spec.artBox.y).toBe(0);
      expect(spec.artBox.width).toBe(100);
      expect(spec.artBox.height).toBe(100);
      expect(spec.artBox.width).toBe(spec.artBox.height);
      expect(spec.numberBox.width).toBe(spec.numberBox.height);
      expect(spec.numberBox.width).toBeGreaterThanOrEqual(40);
    });
  });

  it('keeps notification numbers readable through 14', () => {
    postmarkStampDirectionSpecs.forEach((spec) => {
      ['1', '6', '12', '13', '14'].forEach((label) => {
        const digits = label.length;
        const fontSize = Math.min(
          spec.numberBox.height * 0.58,
          spec.numberBox.width / (digits * 0.58)
        );
        const estimatedTextWidth = digits * fontSize * 0.58;

        expect(fontSize).toBeGreaterThanOrEqual(23);
        expect(estimatedTextWidth).toBeLessThanOrEqual(spec.numberBox.width);
        expect(fontSize * 1.15).toBeLessThanOrEqual(spec.numberBox.height);
      });
    });
  });

  it('selects stamps deterministically from date, day, and start id', () => {
    const seed = {
      date: '2026-05-29',
      dayNumber: 36,
      startId: 's2',
      startIndex: 2,
    };

    expect(getPostmarkStampForStart(seed)).toBe(getPostmarkStampForStart(seed));
    expect(hashPostmarkStampSeed('2026-05-29|36|s2|2')).toBe(
      hashPostmarkStampSeed('2026-05-29|36|s2|2')
    );
  });
});
