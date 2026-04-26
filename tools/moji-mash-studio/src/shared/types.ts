// Shared types between server and client. The server is the source of truth
// for state shape; the client mirrors it.

export interface Rubric {
  /** 1 = a word missing; 5 = every word leaps out. Target 4-5. */
  word_clarity?: number;
  /**
   * How closely the image matches the open-genmoji LoRA style: single
   * 3D-shaded sticker subject, soft volumetric lighting, no painted
   * background, no cast/drop shadow, no photorealism. Target 4-5.
   * Replaces the older `visual_appeal` dimension (which conflated charm
   * with style).
   */
  style_fidelity?: number;
  /** 1 = collage of separate objects; 5 = unified witty composition. Target 4-5. */
  concept_synergy?: number;
  /** 1 = no aha; 5 = laugh-out-loud clever reveal. Target 4-5. */
  aha_factor?: number;
  /**
   * Measured puzzle difficulty from Pass-3 playtest. Claude plays the
   * puzzle with only the image + public hint and lists its top 5 guesses;
   * the rank of the true answer determines this score. Sweet spot 3
   * (fair challenge). 5 means playtest cracked it on guess #1 (too
   * obvious / idiom-trivial); 1 means playtest missed entirely (likely
   * unsolvable). Replaces the older `guessability` dimension (which was
   * Claude's *opinion* of difficulty rather than a measured behaviour).
   */
  playtest_difficulty?: number;
}

export interface Variant {
  /** PNG filename inside stagedDir, e.g. "tax-return-s42.png" */
  file: string;
  /** Repo-relative path to the staged PNG. */
  stagedPath: string;
  /** Effective seed used by mflux. */
  seed: number;
  /** Composite score from the vision check, 0-25. */
  composite: number;
  rubric: Rubric;
  /** Words Claude blind-decoded from the image (before knowing the answer). */
  decoded: string[];
  /** Answer words that did NOT appear in the blind decode. */
  missing: string[];
  /**
   * 1-indexed rank of the true answer in the playtest guess list, or 0
   * if the answer was not in the top-5 playtest guesses.
   */
  playtest_rank?: number;
  /**
   * Playtest's top-5 guess list (each guess is an array of N lowercase
   * words matching the hint starting-letter constraints). Empty if the
   * contact sheet is older than the playtest pass.
   */
  playtest_guesses?: string[][];
  /** True for the variant with the highest composite score. */
  recommended: boolean;
}

export interface Promotion {
  variantFile: string;
  /** Repo-relative path under assets/genmoji/ */
  assetPath: string;
  tsSnippet: string;
}

export interface Concept {
  id: string;
  words: string[];
  slug: string;
  prompt: string;
  /** Repo-relative directory like "tmp/moji-mash/2026-04-11" */
  stagedDir: string;
  variants: Variant[];
  createdAt: string;
  promoted?: Promotion;
}

// ---------------------------------------------------------------------------
// Chat / messages
// ---------------------------------------------------------------------------

export interface ChatMessageText {
  type: 'text';
  text: string;
}

export interface ChatMessageToolCall {
  type: 'tool_call';
  toolUseId: string;
  name: string;
  input: Record<string, unknown>;
  /** Final summary line for the collapsed card, populated when the tool resolves. */
  summary?: string;
  /** Latest progress line streamed from the tool while it's running. */
  progress?: string;
  status: 'running' | 'ok' | 'error';
  /** Short error preview if status === 'error'. */
  error?: string;
}

export type ChatBlock = ChatMessageText | ChatMessageToolCall;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  blocks: ChatBlock[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export interface HealthStatus {
  appleSilicon: boolean;
  openGenmojiInstalled: boolean;
  anthropicKeyPresent: boolean;
  pythonVersion: string | null;
  poolCount: number;
  today: string;
  repoRoot: string;
  port: number;
}

// ---------------------------------------------------------------------------
// SSE event payloads
// ---------------------------------------------------------------------------

export interface TokenEvent {
  /** Streaming text delta from the assistant. */
  delta: string;
  /** Index of the assistant content block this delta belongs to. */
  blockIndex: number;
  /** Stable id of the assistant message in the session. */
  messageId: string;
}

export interface ToolCallEvent {
  messageId: string;
  toolUseId: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolProgressEvent {
  toolUseId: string;
  line: string;
}

export interface ToolResultEvent {
  toolUseId: string;
  status: 'ok' | 'error';
  summary: string;
  error?: string;
}

export interface ConceptUpdatedEvent {
  concept: Concept;
}

export interface MessageAppendedEvent {
  message: ChatMessage;
}

export interface UsageEvent {
  inputTokens: number;
  outputTokens: number;
  /** Cumulative tokens since the server started. */
  totalInput: number;
  totalOutput: number;
}

export interface ErrorEvent {
  message: string;
}
