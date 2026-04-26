import type { Variant } from '../../shared/types.js';

const ROWS: Array<{ key: keyof Variant['rubric']; label: string }> = [
  { key: 'word_clarity', label: 'clarity' },
  { key: 'style_fidelity', label: 'style' },
  { key: 'concept_synergy', label: 'synergy' },
  { key: 'aha_factor', label: 'aha' },
  { key: 'playtest_difficulty', label: 'playtest' },
];

export function RubricTooltip({ variant }: { variant: Variant }) {
  const rank = variant.playtest_rank ?? 0;
  const guesses = variant.playtest_guesses ?? [];
  const rankLabel = rank > 0 ? `rank #${rank}` : 'not in top 5';
  const rankClass = rank === 1 || rank === 0 ? 'rank-warn' : rank === 3 ? 'rank-good' : 'rank-ok';

  return (
    <div className="rubric-tooltip">
      <table>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.key}>
              <td className="label">{r.label}</td>
              <td>{bar(variant.rubric[r.key])}</td>
            </tr>
          ))}
          <tr>
            <td className="label">comp</td>
            <td>{variant.composite.toFixed(1)} / 25</td>
          </tr>
        </tbody>
      </table>
      {variant.decoded.length > 0 && (
        <div className="decoded">👁 {variant.decoded.join(', ')}</div>
      )}
      {variant.missing.length > 0 && (
        <div className="missing">missing: {variant.missing.join(', ')}</div>
      )}
      {guesses.length > 0 && (
        <div className="playtest">
          <div className={`playtest-header ${rankClass}`}>🎮 playtest {rankLabel}</div>
          <ol>
            {guesses.map((g, i) => (
              <li key={i} className={i + 1 === rank ? 'playtest-hit' : ''}>
                {g.join(' ')}
                {i + 1 === rank ? ' ✓' : ''}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function bar(value: number | undefined): string {
  if (typeof value !== 'number') return '?';
  return '█'.repeat(value) + '░'.repeat(5 - value) + ' ' + value;
}
