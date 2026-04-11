import { MessageList } from './MessageList.js';
import { ChatInput } from './ChatInput.js';
import { useSession } from '../hooks/useSSE.js';

export function ChatPane() {
  const { messages } = useSession();
  return (
    <div className="chat-pane">
      <MessageList messages={messages} />
      <ChatInput />
    </div>
  );
}
