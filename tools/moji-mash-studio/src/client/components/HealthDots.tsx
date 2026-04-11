import type { HealthStatus } from '../../shared/types.js';

export function HealthDots({ health }: { health: HealthStatus | null }) {
  if (!health) {
    return (
      <div className="health-dots">
        <div className="health-dot" title="loading…" />
        <div className="health-dot" title="loading…" />
        <div className="health-dot" title="loading…" />
      </div>
    );
  }
  return (
    <div className="health-dots">
      <div
        className={`health-dot ${health.appleSilicon ? 'ok' : 'bad'}`}
        title={health.appleSilicon ? 'Apple Silicon ✓' : 'Not Apple Silicon — image generation will fail'}
      />
      <div
        className={`health-dot ${health.openGenmojiInstalled ? 'ok' : 'bad'}`}
        title={
          health.openGenmojiInstalled
            ? 'open-genmoji venv ✓'
            : 'open-genmoji not installed at ~/tools/open-genmoji'
        }
      />
      <div
        className={`health-dot ${health.anthropicKeyPresent ? 'ok' : 'bad'}`}
        title={
          health.anthropicKeyPresent
            ? 'ANTHROPIC_API_KEY ✓'
            : 'ANTHROPIC_API_KEY missing — chat will fail'
        }
      />
    </div>
  );
}
