export type PostmarkDifficulty = 'Easy' | 'Medium' | 'Hard';

export const POSTMARK_PACK_START_DATE = '2026-04-24';
export const POSTMARK_PACK_LENGTH = 500;

export const POSTMARK_DIFFICULTY_TOTALS: Record<PostmarkDifficulty, number> = {
  Easy: 85,
  Medium: 305,
  Hard: 110,
};

export const POSTMARK_SIZE_TOTALS: Record<5 | 6 | 7, number> = {
  5: 115,
  6: 375,
  7: 10,
};

export const POSTMARK_ROUTE_TARGETS: Record<
  5 | 6 | 7,
  Record<PostmarkDifficulty, { min: number; max: number }>
> = {
  5: {
    Easy: { min: 3, max: 4 },
    Medium: { min: 3, max: 4 },
    Hard: { min: 4, max: 5 },
  },
  6: {
    Easy: { min: 4, max: 4 },
    Medium: { min: 4, max: 5 },
    Hard: { min: 5, max: 5 },
  },
  7: {
    Easy: { min: 6, max: 6 },
    Medium: { min: 7, max: 7 },
    Hard: { min: 8, max: 8 },
  },
};
