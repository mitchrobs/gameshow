// Shared types between server and client. The server is the source of truth
// for state shape; the client mirrors it.

export interface Rubric {
  word_clarity?: number;
  visual_appeal?: number;
  concept_synergy?: number;
  guessability?: number;
  aha_factor?: number;
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
  /**
   * Free-form sentence Claude wrote describing what it sees, before knowing
   * the answer. The richest diagnostic for prompt revision — tells you what
   * a player would actually perceive rather than just a noun list.
   */
  description?: string;
  /** Answer words that did NOT appear in the blind decode. */
  missing: string[];
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
