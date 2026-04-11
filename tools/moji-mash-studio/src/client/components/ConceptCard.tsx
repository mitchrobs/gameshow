import { useState } from 'react';
import type { Concept } from '../../shared/types.js';
import { VariantTile } from './VariantTile.js';

export function ConceptCard({ concept }: { concept: Concept }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!concept.promoted) return;
    try {
      await navigator.clipboard.writeText(concept.promoted.tsSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const date = concept.stagedDir.split('/').pop() ?? '';
  const sheetUrl = `/api/images/staged/${date}/index.html`;

  return (
    <div className={`concept-card ${concept.promoted ? 'promoted' : ''}`}>
      <div className="concept-header">
        <div>
          <h3>{concept.words.join(' ')}</h3>
          <div className="slug">{concept.slug}</div>
        </div>
        <div className="timestamp">{new Date(concept.createdAt).toLocaleTimeString()}</div>
      </div>
      <div
        className={`prompt ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded((x) => !x)}
        title="click to expand"
      >
        {concept.prompt}
      </div>
      <div className="variants">
        {concept.variants.map((v) => (
          <VariantTile key={v.file} variant={v} concept={concept} />
        ))}
      </div>
      {concept.promoted && (
        <div className="promotion">
          <div className="label">✓ Promoted to {concept.promoted.assetPath}</div>
          <pre onClick={copy} title="click to copy">
            {concept.promoted.tsSnippet}
          </pre>
          {copied && <div style={{ marginTop: 4, color: '#2a9d2a', fontSize: 11 }}>copied!</div>}
        </div>
      )}
      <div className="actions">
        <a href={sheetUrl} target="_blank" rel="noreferrer">
          open contact sheet ↗
        </a>
      </div>
    </div>
  );
}
