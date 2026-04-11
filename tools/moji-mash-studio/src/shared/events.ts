// SSE event names sent over /api/chat. Shared between server and client so
// the typed dispatcher can't drift.

export const SSE = {
  Token: 'token',
  ToolCall: 'tool_call',
  ToolProgress: 'tool_progress',
  ToolResult: 'tool_result',
  ConceptUpdated: 'concept_updated',
  MessageAppended: 'message_appended',
  Usage: 'usage',
  Error: 'error',
  Done: 'done',
} as const;

export type SSEEventName = (typeof SSE)[keyof typeof SSE];
