import type {
  ChatMessage,
  Concept,
  HealthStatus,
  ChatMessageToolCall,
} from '../../shared/types.js';

interface StoreState {
  messages: ChatMessage[];
  concepts: Concept[];
  health: HealthStatus | null;
  isStreaming: boolean;
  totalInput: number;
  totalOutput: number;
  /** Latest progress line keyed by toolUseId — drives the live tail in tool cards. */
  toolProgress: Record<string, string>;
  /** "idle" / "generating tax-return 2/3" / etc. surfaced in the top bar. */
  statusLine: string;
}

type Listener = () => void;

class SessionStore {
  private state: StoreState = {
    messages: [],
    concepts: [],
    health: null,
    isStreaming: false,
    totalInput: 0,
    totalOutput: 0,
    toolProgress: {},
    statusLine: 'idle',
  };
  private listeners = new Set<Listener>();

  getState = (): StoreState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private set(patch: Partial<StoreState>): void {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l();
  }

  setHealth(h: HealthStatus): void {
    this.set({ health: h });
  }

  hydrate(messages: ChatMessage[], concepts: Concept[], totals: { totalInput: number; totalOutput: number }): void {
    this.set({
      messages,
      concepts,
      totalInput: totals.totalInput,
      totalOutput: totals.totalOutput,
    });
  }

  setStreaming(streaming: boolean): void {
    this.set({ isStreaming: streaming, statusLine: streaming ? this.state.statusLine : 'idle' });
  }

  setStatus(line: string): void {
    this.set({ statusLine: line });
  }

  appendMessage(message: ChatMessage): void {
    this.set({ messages: [...this.state.messages, message] });
  }

  appendToken(messageId: string, blockIndex: number, delta: string): void {
    const messages = this.state.messages.map((m) => {
      if (m.id !== messageId) return m;
      const blocks = m.blocks.slice();
      while (blocks.length <= blockIndex) {
        blocks.push({ type: 'text', text: '' });
      }
      const block = blocks[blockIndex];
      if (block && block.type === 'text') {
        blocks[blockIndex] = { type: 'text', text: block.text + delta };
      }
      return { ...m, blocks };
    });
    this.set({ messages });
  }

  appendToolCall(
    messageId: string,
    toolUseId: string,
    name: string,
    input: Record<string, unknown>,
  ): void {
    const messages = this.state.messages.map((m) => {
      if (m.id !== messageId) return m;
      const card: ChatMessageToolCall = {
        type: 'tool_call',
        toolUseId,
        name,
        input,
        status: 'running',
      };
      return { ...m, blocks: [...m.blocks, card] };
    });
    this.set({ messages });
  }

  setToolProgress(toolUseId: string, line: string): void {
    this.set({ toolProgress: { ...this.state.toolProgress, [toolUseId]: line } });
    this.set({ statusLine: line });
  }

  resolveTool(
    toolUseId: string,
    status: 'ok' | 'error',
    summary: string,
    error?: string,
  ): void {
    const messages = this.state.messages.map((m) => ({
      ...m,
      blocks: m.blocks.map((b) => {
        if (b.type !== 'tool_call' || b.toolUseId !== toolUseId) return b;
        return { ...b, status, summary, error };
      }),
    }));
    const { [toolUseId]: _gone, ...restProgress } = this.state.toolProgress;
    void _gone;
    this.set({ messages, toolProgress: restProgress });
  }

  upsertConcept(concept: Concept): void {
    const idx = this.state.concepts.findIndex((c) => c.id === concept.id);
    let concepts: Concept[];
    if (idx === -1) {
      concepts = [concept, ...this.state.concepts];
    } else {
      concepts = this.state.concepts.slice();
      concepts[idx] = concept;
    }
    this.set({ concepts });
  }

  addUsage(input: number, output: number, totalInput: number, totalOutput: number): void {
    void input;
    void output;
    this.set({ totalInput, totalOutput });
  }
}

export const sessionStore = new SessionStore();
export type { StoreState };
