import type { Concept, Variant } from '../../shared/types.js';
import { RubricTooltip } from './RubricTooltip.js';
import { sendChat, useSession } from '../hooks/useSSE.js';

export function VariantTile({
  variant,
  concept,
}: {
  variant: Variant;
  concept: Concept;
}) {
  const { isStreaming } = useSession();
  const isPromoted = concept.promoted?.variantFile === variant.file;

  // The staged path looks like "tmp/moji-mash/2026-04-11/tax-return-s42.png"
  const parts = variant.stagedPath.split('/');
  const date = parts[parts.length - 2] ?? '';
  const file = parts[parts.length - 1] ?? variant.file;
  const imgUrl = `/api/images/staged/${date}/${file}`;

  const promote = async () => {
    const message = `Promote \`${variant.stagedPath}\` for words ${concept.words.join(' ')}`;
    try {
      await sendChat(message);
    } catch (err) {
      console.error('promote send failed', err);
    }
  };

  return (
    <div className={`variant-tile ${variant.recommended ? 'recommended' : ''}`}>
      <img src={imgUrl} alt={variant.file} loading="lazy" />
      <div className="variant-meta">
        <span className="composite">{variant.composite.toFixed(1)}/25</span>
        {variant.recommended && <span className="star">★</span>}
        {variant.missing.length > 0 && (
          <span title={`missing: ${variant.missing.join(', ')}`} style={{ color: '#cc0000' }}>
            ⚠
          </span>
        )}
      </div>
      {!isPromoted && (
        <button
          type="button"
          className="promote-btn"
          disabled={isStreaming || !!concept.promoted}
          onClick={promote}
        >
          Promote
        </button>
      )}
      <RubricTooltip variant={variant} />
    </div>
  );
}
