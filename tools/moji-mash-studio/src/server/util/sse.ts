import type { SSEEventName } from '../../shared/events.js';

/**
 * Tiny typed SSE writer. Each call sends one named event with a JSON payload.
 */
export interface SSESink {
  send: (event: SSEEventName, data: unknown) => Promise<void>;
  comment: (text: string) => Promise<void>;
}

export function createSSESink(stream: {
  writeSSE: (msg: { event?: string; data: string; id?: string }) => Promise<void>;
}): SSESink {
  let id = 0;
  return {
    async send(event, data) {
      id += 1;
      await stream.writeSSE({
        event,
        data: JSON.stringify(data ?? null),
        id: String(id),
      });
    },
    async comment(text) {
      await stream.writeSSE({ data: `: ${text}` });
    },
  };
}
