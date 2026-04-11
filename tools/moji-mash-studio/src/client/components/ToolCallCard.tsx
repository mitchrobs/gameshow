import type { ChatMessageToolCall } from '../../shared/types.js';

export function ToolCallCard({ card }: { card: ChatMessageToolCall }) {
  const summary = card.summary ?? defaultSummary(card);
  const showProgress = card.status === 'running';
  return (
    <div className={`tool-card ${card.status}`}>
      <div className="tool-name">🔧 {card.name}</div>
      <div className="tool-summary">{summary}</div>
      {showProgress && card.progress && <div className="tool-progress">{card.progress}</div>}
      {card.status === 'error' && card.error && (
        <div className="tool-error">{card.error}</div>
      )}
    </div>
  );
}

function defaultSummary(card: ChatMessageToolCall): string {
  if (card.status === 'running') {
    if (card.name === 'generate_moji') {
      const words = Array.isArray(card.input.words) ? (card.input.words as string[]).join(' ') : '';
      return `Generating variants for \`${words}\`…`;
    }
    if (card.name === 'promote_moji') {
      return `Promoting \`${String(card.input.staged_path ?? '')}\`…`;
    }
    if (card.name === 'read_file') {
      return `Reading \`${String(card.input.path ?? '')}\`…`;
    }
    if (card.name === 'list_pool') {
      return 'Loading pool…';
    }
  }
  return card.name;
}
