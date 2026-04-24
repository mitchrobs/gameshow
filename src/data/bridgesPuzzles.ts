import { bridgesPack, bridgesPackStartDate } from './bridgesPack.generated';
import {
  analyzePuzzle,
  bridgesAnchorPuzzles,
  buildFallbackEntry,
  getPackStartOrdinal,
  type BridgesBridge,
  type BridgesIsland,
  type BridgesPackEntry,
  type BridgesPuzzle,
} from './bridgesGenerator';
import {
  BRIDGES_PACK_LENGTH,
  BRIDGES_PACK_START_DATE,
  type BridgesDifficulty,
  type BridgesShapeFamily,
  type BridgesThemeId,
} from './bridgesMetadata';
import { getUtcDateKey } from '../utils/dailyUtc';

export type {
  BridgesBridge,
  BridgesDifficulty,
  BridgesIsland,
  BridgesPackEntry,
  BridgesPuzzle,
  BridgesShapeFamily,
  BridgesThemeId,
};

export const bridgesPuzzles = bridgesAnchorPuzzles;

const packByDate = new Map(bridgesPack.map((entry) => [entry.date, entry]));
const fallbackCache = new Map<string, BridgesPackEntry>();

export function isBridgesPackDateCovered(date: Date = new Date()): boolean {
  return packByDate.has(getUtcDateKey(date));
}

export function getDailyBridgesPackEntry(date: Date = new Date()): BridgesPackEntry {
  const key = getUtcDateKey(date);
  const fromPack = packByDate.get(key);
  if (fromPack) return fromPack;

  const cached = fallbackCache.get(key);
  if (cached) return cached;

  const fallback = buildFallbackEntry(date);
  fallbackCache.set(key, fallback);
  return fallback;
}

export function getDailyBridges(date: Date = new Date()): BridgesPuzzle {
  return getDailyBridgesPackEntry(date).puzzle;
}

export function getBridgesPackMetadata() {
  return {
    startDate: bridgesPackStartDate || BRIDGES_PACK_START_DATE,
    length: bridgesPack.length || BRIDGES_PACK_LENGTH,
    startOrdinal: getPackStartOrdinal(),
  };
}

export { analyzePuzzle };
