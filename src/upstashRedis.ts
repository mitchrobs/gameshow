const UPSTASH_URL = 'https://bright-feline-51515.upstash.io';
const UPSTASH_TOKEN = 'Ack7AAIncDJkNTY1MmIyMjhmMjY0NTgwOTEzM2UxNmVkNTRlMTViY3AyNTE1MTU';

async function parseResponse(response: Response): Promise<any | null> {
  if (!response.ok) return null;
  try {
    const data = await response.json();
    return data.result ?? data;
  } catch {
    return null;
  }
}

export async function upstashCommand(args: string[]): Promise<any | null> {
  try {
    const response = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    return await parseResponse(response);
  } catch {
    return null;
  }
}

export async function upstashPipeline(commands: string[][]): Promise<any[] | null> {
  if (commands.length === 0) return [];
  try {
    const response = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as Array<{ result?: unknown }>;
    if (!Array.isArray(data)) return null;
    return data.map((entry) => entry?.result ?? null);
  } catch {
    return null;
  }
}
