import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY, ANTHROPIC_MODEL } from '../config.js';

export interface CheckConceptInput {
  words: string[];
  /**
   * Optional draft prompt the agent has in mind. The check evaluates the
   * concept regardless, but a prompt lets the model flag risk specific to
   * how the agent intends to render it (e.g. abstract verbs that need a
   * concrete metonym).
   */
  prompt?: string;
}

export interface CheckConceptResult {
  /** 1–5 where 5 = a great Moji Mash (concrete, charming, satisfying reveal). */
  rating: number;
  /** One-sentence verdict the agent can paste into chat. */
  verdict: string;
  /** Per-word notes flagging anything hard to render or visually ambiguous. */
  wordNotes: { word: string; note: string }[];
  /** Concrete suggested-prompt fragment the agent can adapt. */
  suggestedPromptHint?: string;
  /** Free-form risks the model wants to flag (over-clutter, redundancy, etc). */
  risks: string[];
}

const SYSTEM = [
  'You are a critic for "Moji Mash", a daily emoji-rebus game.',
  'Players see ONE genmoji image and must guess 2-4 hidden answer words.',
  'A great puzzle has: every answer word visually present, a unified scene',
  '(not a literal collage), and a satisfying "aha" moment when revealed.',
  'You will be given a candidate word list and (optionally) a draft prompt.',
  'You evaluate WITHOUT generating an image — your job is fast triage so the',
  'expensive image-generation step only runs on viable concepts.',
  '',
  'Return a single JSON object that matches this exact schema:',
  '{',
  '  "rating": 1-5 integer,',
  '  "verdict": "one sentence",',
  '  "word_notes": [{"word": "...", "note": "..."}],',
  '  "suggested_prompt_hint": "string or null",',
  '  "risks": ["short string", ...]',
  '}',
  'No markdown fences, no commentary outside the JSON.',
].join('\n');

/**
 * Cheap LLM-only triage before spending ~45s/variant on image generation.
 * Asks Claude to rate the concept, flag hard-to-render words, and suggest a
 * sharper prompt fragment. Strictly text-out — no image is produced.
 *
 * Cost: one short Claude turn (≤ 800 tokens output) per call. Roughly 100x
 * cheaper than a 3-variant `generate_moji` call.
 */
export async function checkConceptTool(input: CheckConceptInput): Promise<CheckConceptResult> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in the server environment.');
  }
  const words = (input.words ?? []).map((w) => String(w).toLowerCase().trim());
  if (words.length < 2 || words.length > 4) {
    throw new Error(`check_concept: words must contain 2-4 tokens (got ${words.length})`);
  }
  for (const w of words) {
    if (!/^[a-z]+$/.test(w)) {
      throw new Error(`check_concept: word "${w}" must be lowercase letters only`);
    }
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const userParts: string[] = [`Candidate words: ${words.join(', ')}`];
  if (input.prompt && input.prompt.trim()) {
    userParts.push(`Draft prompt: ${input.prompt.trim()}`);
  } else {
    userParts.push('Draft prompt: (none — evaluate the words alone)');
  }
  userParts.push(
    'Score the concept and return the JSON object. Remember: every answer word',
    'must be unambiguously depictable in a single small emoji-style image.',
  );

  const resp = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 800,
    system: SYSTEM,
    messages: [{ role: 'user', content: userParts.join('\n') }],
  });

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  return parseJsonReply(text, words);
}

function parseJsonReply(raw: string, words: string[]): CheckConceptResult {
  // Tolerate accidental ```json fences.
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(stripped) as Record<string, unknown>;
  } catch {
    // Fallback to "did the model say something useful even if not JSON" so
    // the agent gets feedback rather than an opaque error.
    return {
      rating: 0,
      verdict: stripped.slice(0, 200) || 'Model returned non-JSON; treat as unevaluated.',
      wordNotes: words.map((w) => ({ word: w, note: '(no per-word note returned)' })),
      risks: ['model_returned_non_json'],
    };
  }
  const rating = clampInt(data.rating, 1, 5, 0);
  const verdict = typeof data.verdict === 'string' ? data.verdict : '';
  const wordNotesRaw = Array.isArray(data.word_notes) ? data.word_notes : [];
  const wordNotes = wordNotesRaw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const e = entry as Record<string, unknown>;
      const word = typeof e.word === 'string' ? e.word.toLowerCase() : '';
      const note = typeof e.note === 'string' ? e.note : '';
      if (!word) return null;
      return { word, note };
    })
    .filter((x): x is { word: string; note: string } => x !== null);
  const suggested =
    typeof data.suggested_prompt_hint === 'string' && data.suggested_prompt_hint.trim()
      ? data.suggested_prompt_hint.trim()
      : undefined;
  const risksRaw = Array.isArray(data.risks) ? data.risks : [];
  const risks = risksRaw.filter((x): x is string => typeof x === 'string');

  const result: CheckConceptResult = {
    rating,
    verdict,
    wordNotes,
    risks,
  };
  if (suggested) {
    result.suggestedPromptHint = suggested;
  }
  return result;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const n = Math.round(value);
  if (n < min) return min;
  if (n > max) return max;
  return n;
}
