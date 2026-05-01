import { upstashCommand } from './upstashRedis';

function getTodayKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/**
 * Atomically increment today's global play count for a game.
 * Returns the new count, or null on failure.
 */
export async function incrementGlobalPlayCount(
  game: string
): Promise<number | null> {
  const key = `plays:${game}:${getTodayKey()}`;
  const result = await upstashCommand(['INCR', key]);
  if (typeof result === 'number') {
    // Fire-and-forget: set 48h TTL so old keys auto-expire
    upstashCommand(['EXPIRE', key, '172800']);
    return result;
  }
  return null;
}

/**
 * Fetch today's global play counts for all given games in one round-trip.
 * Returns a Record<string, number>, falling back to empty on failure.
 */
export async function getGlobalPlayCounts(
  games: string[]
): Promise<Record<string, number>> {
  const today = getTodayKey();
  const keys = games.map((g) => `plays:${g}:${today}`);
  const results = await upstashCommand(['MGET', ...keys]);
  const counts: Record<string, number> = {};
  if (Array.isArray(results)) {
    games.forEach((g, i) => {
      counts[g] = results[i] ? parseInt(results[i], 10) : 0;
    });
  }
  return counts;
}
