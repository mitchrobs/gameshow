import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '../config.js';

export interface CheckConceptInterpretation {
  /** Short label for this interpretation, e.g. "anthropomorphised potato on couch". */
  label: string;
  /** Draft LoRA-format prompt for this interpretation. */
  prompt: string;
}

export interface CheckConceptInput {
  words: string[];
  /**
   * Either a single draft prompt (the legacy mode) or omitted in favour of
   * `interpretations`. When both are present, `prompt` is ignored.
   */
  prompt?: string;
  /**
   * Optional: multiple alternative visual interpretations of the same concept.
   * The judge ranks them and recommends the strongest. Use this when you have
   * 2-4 plausible directions for a concept and want to pick before spending
   * a slow generate_moji call. Keep to ≤ 4 interpretations.
   */
  interpretations?: CheckConceptInterpretation[];
}

export interface CheckConceptInterpretationScore {
  label: string;
  rating: number;
  rationale: string;
}

export interface CheckConceptWordNote {
  word: string;
  /** "easy" | "ok" | "hard" — how easy this word is to depict visually. */
  difficulty: 'easy' | 'ok' | 'hard';
  /** One-sentence note about why. */
  note: string;
}

export interface CheckConceptResult {
  /** Overall renderability score, 1 (drop) to 5 (greenlight). */
  rating: number;
  /** Rating BEFORE the adversarial critic pass (if it ran). Undefined if no critic. */
  ratingBeforeCritic?: number;
  /** "drop" | "revise" | "proceed" — convenience verdict derived from rating. */
  verdict: 'drop' | 'revise' | 'proceed';
  /** Per-word commentary. */
  wordNotes: CheckConceptWordNote[];
  /** ≤2-sentence suggestion for tightening the prompt before calling generate_moji. */
  suggestedPromptHint: string;
  /** Risks the Claude judge flagged (e.g. "abstract word", "invisible element"). */
  risks: string[];
  /**
   * When the input provided `interpretations`, the judge ranks each one and
   * `recommendedInterpretation` names the strongest by label. Empty/undefined
   * in single-prompt mode.
   */
  interpretationScores?: CheckConceptInterpretationScore[];
  recommendedInterpretation?: string;
  /**
   * Adversarial critic pass output (only runs when the primary rating >= 4).
   * Designed to catch concepts that pass the primary judge but have a subtle
   * playtest-rank-1 failure mode — the critic is instructed to argue for
   * REJECTION. If the critic returns severity "major", the primary rating
   * is downgraded by 1.
   */
  critic?: {
    ran: boolean;
    severity: 'none' | 'minor' | 'major';
    objection: string;
    downgraded: boolean;
  };
  /** Raw Claude response for debugging — not shown to the user. */
  raw: string;
}

const MODEL = 'claude-haiku-4-5';

const SYSTEM_CRITIC = `You are the adversarial editor for the Moji Mash calendar. The primary judge has already rated a concept highly (4 or 5). Your job is to argue AGAINST shipping it — steelman every reason to reject.

Focus on failure modes the primary judge tends to miss:
  - Idiom traps: the phrase is so recognisable that the playtest will crack the answer on guess #1. If the image cannot misdirect away from the phrase, flag this.
  - Word-reuse dilution: if the draft prompt relies on a generic word that already appears in several puzzles (machine, party, green), the variant will feel derivative.
  - LoRA out-of-distribution: if the subject is a named human, a multi-figure scene, a readable logo, a distant building, or an action verb, the LoRA will render poorly regardless of prompt quality.
  - Category saturation: if the concept belongs to an over-represented category (idiom especially), we should skip it even if it's good on its own.
  - Invisible answer word: if one of the 2-4 words has no iconic shorthand declared in the prompt, the final image will fail word_clarity.
  - Near-duplicate of existing work: if the concept merely reskins something already in the pool, flag it.

You MUST pick one of three severities:
  "none"  — no real objection; the concept is as strong as the primary judge thinks.
  "minor" — worth a prompt tweak but not a rejection.
  "major" — a serious flaw that would likely cause a playtest-rank-1 / low word_clarity / derivative outcome. The primary rating should be downgraded.

Be specific. "It's an idiom" is not a major objection on its own. "This specific idiom has a visual that matches the phrase one-to-one (a literal pyramid with dollar signs = pyramid scheme), so the playtest will crack it instantly" IS.

Reply with STRICT JSON only:
{
  "severity": "none" | "minor" | "major",
  "objection": "<= 2 sentences naming the specific failure mode"
}`;

const SYSTEM_SINGLE = `You are the gatekeeper deciding whether a Moji Mash concept is worth a ~$0.20 image generation.

A Moji Mash puzzle is one AI-generated emoji (open-genmoji LoRA, single subject, 3D-shaded sticker style) that visually combines 2-4 concrete answer words. Players see only the image and must guess the words. A great concept has:
- Every word a concrete, depictable thing or recognisable modifier (no abstractions like "freedom", "trust", "luck").
- A single unified subject that anthropomorphises one noun or adds one or two props to it (LoRA fights multi-subject scenes).
- A draft prompt that explicitly describes a visual element for every answer word, with iconic shorthand for action/abstract words (e.g. "return" → looping arrow, not just the word).
- A reveal that earns an aha moment — either a pun/idiom the image makes literal, an absurd combination, a specific cultural touchstone, or a specific multi-part object.

IMPORTANT: you are calibrated for a curated 365-day calendar. The bar is HIGH. Do NOT reward concepts just for being "common phrases" — idioms that reduce to "party + pooper" are often too easy to guess and crowd out other categories. Balance matters.

Score the concept on a strict 1-5 scale. Anchor every score:
  5 = greenlight. Single clear visual subject; every word has obvious iconic shorthand; the reveal will be genuinely satisfying. Reserve for concepts you would champion in portfolio review.
  4 = solid keeper. One small prompt tweak away from a 5.
  3 = on the bubble. Workable but the prompt needs a specific revision before generating — or the concept is fine but unremarkable.
  2 = at least one word is hard to depict or the concept is over-literal (players will solve it instantly). Propose an alternative framing or a substitute word.
  1 = drop. Abstract word, duplicate of an existing puzzle, or no single-subject framing exists.

If you find yourself awarding 4s and 5s across every concept, re-read the anchors.

Reply with STRICT JSON only — no prose outside the JSON object. Schema:
{
  "rating": 1-5,
  "wordNotes": [{"word": "...", "difficulty": "easy"|"ok"|"hard", "note": "..."}],
  "suggestedPromptHint": "<= 2 sentences on how to tighten the draft prompt, or empty string if it's already good",
  "risks": ["short risk 1", ...]
}`;

const SYSTEM_MULTI = `You evaluate alternative visual interpretations of a Moji Mash puzzle concept.

A Moji Mash puzzle is one AI-generated emoji (open-genmoji LoRA, single subject, 3D-shaded sticker style) that visually combines 2-4 concrete answer words. The agent has drafted multiple interpretations of the same concept and wants to pick the strongest one before spending an expensive generate_moji call.

You are calibrated for a curated 365-day calendar — the bar is HIGH. For each interpretation, score strictly 1-5. Anchor every score:
  5 = greenlight. Single unified subject, every word obviously pointable, the reveal lands. Champion-level.
  4 = solid with one minor weakness (small prompt tweak fixes it).
  3 = workable but a clearer alternative likely exists in this set.
  2 = significant weakness: a word would be invisible, the scene is a collage, or style fights the LoRA.
  1 = drop this interpretation.

Then pick the BEST interpretation by label. Hard biases:
- Prefer single-subject framings. An anthropomorphised single noun with one or two props beats a two-subject scene every time.
- Prefer framings where EVERY answer word has iconic shorthand (a looping arrow for "return", not the word).
- Penalise over-literal interpretations that will trigger a playtest-rank-1 (too obvious) failure.

If every interpretation scores 3 or below, the concept itself probably needs rework — lower "rating" accordingly and name the fix in suggestedPromptHint.

Reply with STRICT JSON only — no prose outside the JSON object. Schema:
{
  "interpretationScores": [
    {"label": "...", "rating": 1-5, "rationale": "<= 1 sentence"}
  ],
  "recommendedInterpretation": "label of the best one",
  "rating": 1-5,                       // overall confidence in the best interpretation
  "wordNotes": [{"word": "...", "difficulty": "easy"|"ok"|"hard", "note": "..."}],
  "suggestedPromptHint": "<= 2 sentences on how to tighten the recommended prompt, or empty string",
  "risks": ["short risk 1", ...]
}`;

/**
 * Lightweight LLM-only renderability check. Costs ~$0.002 per call vs. ~$0.20
 * for a full 3-variant generate_moji run. The agent is supposed to call this
 * on every surviving concept after brainstorming and only invoke generate_moji
 * for concepts that score 4-5.
 */
export async function checkConceptTool(input: CheckConceptInput): Promise<CheckConceptResult> {
  const words = (input.words ?? []).map((w) => String(w).toLowerCase().trim());
  if (words.length < 2 || words.length > 4) {
    throw new Error(`check_concept: words must contain 2-4 tokens (got ${words.length})`);
  }
  for (const w of words) {
    if (!/^[a-z]+$/.test(w)) {
      throw new Error(`check_concept: word "${w}" must be lowercase letters only`);
    }
  }
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set in the server environment');

  const interpretations = (input.interpretations ?? []).filter(
    (i) => i && typeof i.label === 'string' && i.label.trim().length > 0
      && typeof i.prompt === 'string' && i.prompt.trim().length > 0,
  );
  if (interpretations.length > 4) {
    throw new Error(`check_concept: at most 4 interpretations allowed (got ${interpretations.length})`);
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let result: CheckConceptResult;
  let promptForCritic: string;

  if (interpretations.length >= 2) {
    // Multi-interpretation mode
    const userText = [
      `Words: ${words.map((w) => `"${w}"`).join(', ')}`,
      'Interpretations:',
      ...interpretations.map(
        (i, idx) => `  [${idx + 1}] label="${i.label}"\n      prompt: ${i.prompt}`,
      ),
      '',
      'Score each interpretation, pick the best by label, and return JSON only.',
    ].join('\n');

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_MULTI,
      messages: [{ role: 'user', content: userText }],
    });
    const textBlock = response.content.find((b) => b.type === 'text');
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';
    result = parseJson(raw, words, interpretations);
    // Feed the critic the prompt for the RECOMMENDED interpretation.
    const chosen = interpretations.find((i) => i.label === result.recommendedInterpretation);
    promptForCritic = chosen?.prompt ?? interpretations[0]?.prompt ?? '';
  } else {
    // Single-prompt mode (legacy path)
    const prompt = String(input.prompt ?? '').trim();
    if (!prompt) {
      throw new Error('check_concept: either `prompt` or `interpretations` (≥2) is required');
    }

    const userText = [
      `Words: ${words.map((w) => `"${w}"`).join(', ')}`,
      `Draft prompt: ${prompt}`,
      '',
      'Return JSON only.',
    ].join('\n');

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: SYSTEM_SINGLE,
      messages: [{ role: 'user', content: userText }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    result = parseJson(raw, words, []);
    promptForCritic = prompt;
  }

  // Adversarial critic pass — only runs when the primary rating is 4 or 5.
  // The critic argues FOR rejection and we downgrade on "major" objections.
  if (result.rating >= 4) {
    const critic = await runCritic(client, words, promptForCritic);
    const ratingBefore = result.rating;
    let downgraded = false;
    if (critic.severity === 'major') {
      result.rating = Math.max(1, result.rating - 1);
      downgraded = true;
    }
    result.verdict = result.rating >= 4 ? 'proceed' : result.rating === 3 ? 'revise' : 'drop';
    result.ratingBeforeCritic = ratingBefore;
    result.critic = {
      ran: true,
      severity: critic.severity,
      objection: critic.objection,
      downgraded,
    };
    if (critic.severity === 'major' && critic.objection) {
      result.risks = [...result.risks, `critic(major): ${critic.objection}`];
    } else if (critic.severity === 'minor' && critic.objection) {
      result.risks = [...result.risks, `critic(minor): ${critic.objection}`];
    }
  }

  return result;
}

interface CriticVerdict {
  severity: 'none' | 'minor' | 'major';
  objection: string;
}

async function runCritic(
  client: Anthropic,
  words: string[],
  prompt: string,
): Promise<CriticVerdict> {
  try {
    const userText = [
      `Words: ${words.map((w) => `"${w}"`).join(', ')}`,
      `Prompt (the primary judge already rated this 4 or 5): ${prompt}`,
      '',
      'Argue for rejection. Return JSON only.',
    ].join('\n');
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM_CRITIC,
      messages: [{ role: 'user', content: userText }],
    });
    const textBlock = response.content.find((b) => b.type === 'text');
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';
    let body = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const start = body.indexOf('{');
    const end = body.lastIndexOf('}');
    if (start === -1 || end === -1) return { severity: 'none', objection: '' };
    const obj = JSON.parse(body.slice(start, end + 1)) as {
      severity?: unknown;
      objection?: unknown;
    };
    const sev = String(obj.severity ?? 'none').toLowerCase();
    const severity: CriticVerdict['severity'] =
      sev === 'major' ? 'major' : sev === 'minor' ? 'minor' : 'none';
    const objection = typeof obj.objection === 'string' ? obj.objection.trim() : '';
    return { severity, objection };
  } catch {
    // Critic errors are non-fatal — fall back to no objection.
    return { severity: 'none', objection: '' };
  }
}

interface ParsedShape {
  rating?: unknown;
  wordNotes?: unknown;
  suggestedPromptHint?: unknown;
  risks?: unknown;
  interpretationScores?: unknown;
  recommendedInterpretation?: unknown;
}

function parseJson(
  raw: string,
  words: string[],
  interpretations: CheckConceptInterpretation[],
): CheckConceptResult {
  let body = raw.trim();
  // Strip ``` fences if Claude added them.
  body = body.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return fallback(raw, words, 'JSON object not found in response');
  }
  let obj: ParsedShape;
  try {
    obj = JSON.parse(body.slice(start, end + 1)) as ParsedShape;
  } catch (err) {
    return fallback(raw, words, `JSON parse error: ${err instanceof Error ? err.message : String(err)}`);
  }
  const rating = clampRating(obj.rating);
  const wordNotes = normaliseWordNotes(obj.wordNotes, words);
  const suggestedPromptHint = typeof obj.suggestedPromptHint === 'string' ? obj.suggestedPromptHint : '';
  const risks = Array.isArray(obj.risks)
    ? obj.risks.filter((r): r is string => typeof r === 'string')
    : [];

  let interpretationScores: CheckConceptInterpretationScore[] | undefined;
  let recommendedInterpretation: string | undefined;
  if (interpretations.length > 0) {
    interpretationScores = normaliseInterpretationScores(obj.interpretationScores, interpretations);
    if (typeof obj.recommendedInterpretation === 'string') {
      const r = obj.recommendedInterpretation.trim();
      // Only accept a label the caller actually provided.
      if (interpretations.some((i) => i.label === r)) {
        recommendedInterpretation = r;
      }
    }
    // Fallback: top-rated interpretation by score
    if (!recommendedInterpretation && interpretationScores.length > 0) {
      const top = [...interpretationScores].sort((a, b) => b.rating - a.rating)[0];
      if (top) recommendedInterpretation = top.label;
    }
  }

  return {
    rating,
    verdict: rating >= 4 ? 'proceed' : rating === 3 ? 'revise' : 'drop',
    wordNotes,
    suggestedPromptHint,
    risks,
    interpretationScores,
    recommendedInterpretation,
    raw,
  };
}

function normaliseInterpretationScores(
  v: unknown,
  interpretations: CheckConceptInterpretation[],
): CheckConceptInterpretationScore[] {
  if (!Array.isArray(v)) {
    return interpretations.map((i) => ({ label: i.label, rating: 3, rationale: '(no commentary)' }));
  }
  const out: CheckConceptInterpretationScore[] = [];
  for (const i of interpretations) {
    const found = v.find((item) =>
      item && typeof item === 'object'
        && typeof (item as Record<string, unknown>).label === 'string'
        && String((item as Record<string, unknown>).label) === i.label,
    ) as Record<string, unknown> | undefined;
    if (!found) {
      out.push({ label: i.label, rating: 3, rationale: '(not scored)' });
      continue;
    }
    out.push({
      label: i.label,
      rating: clampRating(found.rating),
      rationale: typeof found.rationale === 'string' ? found.rationale : '',
    });
  }
  return out;
}

function clampRating(v: unknown): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : NaN;
  if (!Number.isFinite(n)) return 3;
  return Math.max(1, Math.min(5, Math.round(n)));
}

function normaliseWordNotes(v: unknown, words: string[]): CheckConceptWordNote[] {
  if (!Array.isArray(v)) {
    return words.map((w) => ({ word: w, difficulty: 'ok', note: '(no commentary)' }));
  }
  const out: CheckConceptWordNote[] = [];
  for (const w of words) {
    const found = v.find((item) =>
      item && typeof item === 'object' && typeof (item as Record<string, unknown>).word === 'string'
        && String((item as Record<string, unknown>).word).toLowerCase() === w,
    ) as Record<string, unknown> | undefined;
    if (!found) {
      out.push({ word: w, difficulty: 'ok', note: '(not commented)' });
      continue;
    }
    const rawDiff = String(found.difficulty ?? 'ok').toLowerCase();
    const difficulty: CheckConceptWordNote['difficulty'] =
      rawDiff === 'easy' || rawDiff === 'hard' ? rawDiff : 'ok';
    out.push({ word: w, difficulty, note: String(found.note ?? '') });
  }
  return out;
}

function fallback(raw: string, words: string[], reason: string): CheckConceptResult {
  return {
    rating: 3,
    verdict: 'revise',
    wordNotes: words.map((w) => ({ word: w, difficulty: 'ok', note: '(parser fallback)' })),
    suggestedPromptHint: `Could not parse Claude's response (${reason}). Treat as 'revise' and inspect the raw text.`,
    risks: ['parser_fallback'],
    raw,
  };
}
