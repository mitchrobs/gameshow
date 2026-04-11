import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../../shared/types.js';
import { ToolCallCard } from './ToolCallCard.js';
import { useSession } from '../hooks/useSSE.js';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { toolProgress } = useSession();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, toolProgress]);

  return (
    <div className="message-list" ref={ref}>
      {messages.length === 0 && (
        <div style={{ color: '#6e6e73', fontSize: 13, padding: 24, textAlign: 'center' }}>
          Try: <em>"Draft 2 candidates for May 2026"</em> or{' '}
          <em>"What's in the current pool?"</em>
        </div>
      )}
      {messages.map((m) => (
        <Message key={m.id} message={m} progressMap={toolProgress} />
      ))}
    </div>
  );
}

function Message({
  message,
  progressMap,
}: {
  message: ChatMessage;
  progressMap: Record<string, string>;
}) {
  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">
        {message.blocks.map((block, i) => {
          if (block.type === 'text') {
            if (message.role === 'user') {
              return <span key={i}>{block.text}</span>;
            }
            return (
              <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                {block.text}
              </ReactMarkdown>
            );
          }
          const liveProgress = progressMap[block.toolUseId];
          return (
            <ToolCallCard
              key={i}
              card={liveProgress ? { ...block, progress: liveProgress } : block}
            />
          );
        })}
      </div>
    </div>
  );
}
