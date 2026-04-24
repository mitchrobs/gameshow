export type BridgesDifficulty = 'Easy' | 'Medium' | 'Hard';

export type BridgesThemeId =
  | 'ocean'
  | 'ice'
  | 'desert'
  | 'volcano'
  | 'forest'
  | 'chicago';

export type BridgesShapeFamily =
  | 'archipelago'
  | 'channel'
  | 'ring'
  | 'spine'
  | 'fan'
  | 'grid';

export interface BridgesThemeDescriptor {
  id: BridgesThemeId;
  emoji: string;
  label: string;
}

export const BRIDGES_THEME_ORDER: readonly BridgesThemeDescriptor[] = [
  { id: 'ocean', emoji: '🌊', label: 'Deep Harbor' },
  { id: 'ice', emoji: '❄️', label: 'Hoarfrost' },
  { id: 'desert', emoji: '🏜️', label: 'Desert Trails' },
  { id: 'volcano', emoji: '🌋', label: 'Ember Isles' },
  { id: 'forest', emoji: '🌿', label: 'Mossbrook' },
  { id: 'chicago', emoji: '🌉', label: 'Chicago' },
];

export const BRIDGES_THEME_IDS = BRIDGES_THEME_ORDER.map((theme) => theme.id);

export const BRIDGES_THEME_BY_ID: Record<BridgesThemeId, BridgesThemeDescriptor> =
  Object.fromEntries(
    BRIDGES_THEME_ORDER.map((theme) => [theme.id, theme])
  ) as Record<BridgesThemeId, BridgesThemeDescriptor>;

export const BRIDGES_SHAPE_FAMILIES: readonly BridgesShapeFamily[] = [
  'archipelago',
  'channel',
  'ring',
  'spine',
  'fan',
  'grid',
];

export const BRIDGES_PACK_LENGTH = 365;
export const BRIDGES_PACK_START_DATE = '2026-04-24';
export const BRIDGES_ONBOARDING_DAYS = 28;

export const BRIDGES_DIFFICULTY_TOTALS: Record<BridgesDifficulty, number> = {
  Easy: 44,
  Medium: 212,
  Hard: 109,
};

export const BRIDGES_ONBOARDING_DIFFICULTY_TOTALS: Record<BridgesDifficulty, number> = {
  Easy: 10,
  Medium: 13,
  Hard: 5,
};

export const BRIDGES_THEME_TOTALS: Record<BridgesThemeId, number> = {
  ocean: 61,
  ice: 61,
  desert: 61,
  volcano: 61,
  forest: 61,
  chicago: 60,
};

export const BRIDGES_THEME_DIFFICULTY_TOTALS: Record<
  BridgesThemeId,
  Record<BridgesDifficulty, number>
> = {
  ocean: { Easy: 8, Medium: 35, Hard: 18 },
  ice: { Easy: 7, Medium: 36, Hard: 18 },
  desert: { Easy: 7, Medium: 35, Hard: 19 },
  volcano: { Easy: 8, Medium: 35, Hard: 18 },
  forest: { Easy: 7, Medium: 36, Hard: 18 },
  chicago: { Easy: 7, Medium: 35, Hard: 18 },
};

export const BRIDGES_THEME_FAMILY_WEIGHTS: Record<
  BridgesThemeId,
  Partial<Record<BridgesShapeFamily, number>>
> = {
  ocean: { archipelago: 45, channel: 35, ring: 20 },
  ice: { channel: 40, ring: 30, fan: 30 },
  desert: { spine: 45, fan: 30, channel: 25 },
  volcano: { ring: 45, spine: 35, archipelago: 20 },
  forest: { fan: 45, archipelago: 30, channel: 25 },
  chicago: { grid: 55, channel: 30, spine: 15 },
};

export const BRIDGES_THEME_FAMILY_TARGETS: Record<
  BridgesThemeId,
  Partial<Record<BridgesShapeFamily, number>>
> = {
  ocean: { archipelago: 27, channel: 22, ring: 12 },
  ice: { channel: 24, ring: 18, fan: 19 },
  desert: { spine: 27, fan: 18, channel: 16 },
  volcano: { ring: 27, spine: 21, archipelago: 13 },
  forest: { fan: 27, archipelago: 18, channel: 16 },
  chicago: { grid: 33, channel: 18, spine: 9 },
};
