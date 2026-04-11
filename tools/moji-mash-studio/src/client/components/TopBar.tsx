import { useSession } from '../hooks/useSSE.js';
import { HealthDots } from './HealthDots.js';

export function TopBar() {
  const state = useSession();
  const { health, statusLine, isStreaming, totalInput, totalOutput } = state;

  const reveal = async () => {
    if (!health) return;
    const dir = `tmp/moji-mash/${health.today}`;
    await fetch('/api/reveal', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: dir }),
    }).catch(() => {});
  };

  return (
    <div className="topbar">
      <div className="title">Moji Mash Studio</div>
      <div className={`status-pill ${isStreaming ? 'active' : ''}`}>{statusLine}</div>
      <div className="meta">
        <HealthDots health={health} />
        <span>{health?.today ?? '—'}</span>
        <span>{health?.poolCount ?? 0} puzzles</span>
        <span title="cumulative tokens this server session">
          {totalInput.toLocaleString()} in / {totalOutput.toLocaleString()} out
        </span>
        <button type="button" className="reveal-btn" onClick={reveal}>
          Reveal tmp/
        </button>
      </div>
    </div>
  );
}
