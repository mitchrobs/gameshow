import type { Variant } from '../../shared/types.js';

const ROWS: Array<{ key: keyof Variant['rubric']; label: string }> = [
  { key: 'word_clarity', label: 'clarity' },
  { key: 'visual_appeal', label: 'appeal' },
  { key: 'concept_synergy', label: 'synergy' },
  { key: 'guessability', label: 'guess' },
  { key: 'aha_factor', label: 'aha' },
];

export function RubricTooltip({ variant }: { variant: Variant }) {
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
    </div>
  );
}

function bar(value: number | undefined): string {
  if (typeof value !== 'number') return '?';
  return '█'.repeat(value) + '░'.repeat(5 - value) + ' ' + value;
}
