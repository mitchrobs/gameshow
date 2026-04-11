import { useState, type KeyboardEvent } from 'react';
import { sendChat, abortChat } from '../hooks/useSSE.js';
import { useSession } from '../hooks/useSSE.js';

export function ChatInput() {
  const { isStreaming, health } = useSession();
  const [text, setText] = useState('');

  const disabled = isStreaming || !health?.anthropicKeyPresent;

  const submit = async () => {
    if (disabled) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    try {
      await sendChat(trimmed);
    } catch (err) {
      console.error('chat send failed', err);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={
          health?.anthropicKeyPresent
            ? 'Tell the moji-mash-editor what you need…  (⌘+Enter to send)'
            : 'Set ANTHROPIC_API_KEY in the server env to enable chat'
        }
        disabled={!health?.anthropicKeyPresent}
      />
      {isStreaming ? (
        <button type="button" className="stop" onClick={() => abortChat()}>
          Stop
        </button>
      ) : (
        <button type="button" onClick={submit} disabled={disabled || !text.trim()}>
          Send
        </button>
      )}
    </div>
  );
}
