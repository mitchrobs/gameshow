const UPSTASH_URL = 'https://bright-feline-51515.upstash.io';
const UPSTASH_TOKEN = 'Ack7AAIncDJkNTY1MmIyMjhmMjY0NTgwOTEzM2UxNmVkNTRlMTViY3AyNTE1MTU';

function getTodayKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

async function redisCommand(args: string[]): Promise<any> {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

/**
 * Atomically increment today's global play count for a game.
 * Returns the new count, or null on failure.
 */
export async function incrementGlobalPlayCount(
  game: string
): Promise<number | null> {
  const key = `plays:${game}:${getTodayKey()}`;
  const result = await redisCommand(['INCR', key]);
  if (typeof result === 'number') {
    // Fire-and-forget: set 48h TTL so old keys auto-expire
    redisCommand(['EXPIRE', key, '172800']);
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
  const results = await redisCommand(['MGET', ...keys]);
  const counts: Record<string, number> = {};
  if (Array.isArray(results)) {
    games.forEach((g, i) => {
      counts[g] = results[i] ? parseInt(results[i], 10) : 0;
    });
  }
  return counts;
}
