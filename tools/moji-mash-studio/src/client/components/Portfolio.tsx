import { useEffect, useState } from 'react';

interface CategoryShare {
  category: 'idiom' | 'absurd' | 'literal' | 'cultural' | 'unknown';
  count: number;
  share: number;
  targetLow: number;
  targetHigh: number;
  status: 'below' | 'in-range' | 'above';
}

interface PortfolioData {
  total: number;
  rotationCount: number;
  pinnedCount: number;
  categories: CategoryShare[];
  overusedWords: Array<{ word: string; count: number }>;
  nearLimitWords: Array<{ word: string; count: number }>;
  pinnedDates: string[];
  monthlyPinned: Record<string, number>;
  anchorsCalibrated: number;
  untaggedSlugs: string[];
  notesPresent: boolean;
  anchorsPresent: boolean;
  recommendations: string[];
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function Portfolio() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = (await res.json()) as PortfolioData;
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  if (loading && !data) {
    return (
      <div className="gallery">
        <div className="empty">Loading portfolio…</div>
      </div>
    );
  }
  if (error && !data) {
    return (
      <div className="gallery">
        <div className="empty">Portfolio load failed: {error}</div>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="gallery portfolio">
      <div className="portfolio-header">
        <h2>Portfolio Overview</h2>
        <button type="button" onClick={refresh} className="refresh-btn">Refresh</button>
      </div>

      <div className="portfolio-summary">
        <div>
          <span className="kpi">{data.total}</span>
          <span className="kpi-label">total</span>
        </div>
        <div>
          <span className="kpi">{data.rotationCount}</span>
          <span className="kpi-label">rotation</span>
        </div>
        <div>
          <span className="kpi">{data.pinnedCount}</span>
          <span className="kpi-label">date-pinned</span>
        </div>
        <div>
          <span className="kpi">{data.anchorsCalibrated}</span>
          <span className="kpi-label">anchors</span>
        </div>
      </div>

      {!data.notesPresent && (
        <div className="portfolio-warn">
          Missing <code>docs/moji-mash-puzzle-notes.md</code> — category breakdown unavailable.
        </div>
      )}

      <section className="portfolio-section">
        <h3>Category mix vs. quotas</h3>
        <div className="category-bars">
          {data.categories.map((c) => (
            <CategoryBar key={c.category} c={c} />
          ))}
        </div>
      </section>

      <section className="portfolio-section">
        <h3>Seasonal coverage</h3>
        <div className="month-grid">
          {MONTH_LABELS.map((label, idx) => {
            const key = String(idx + 1).padStart(2, '0');
            const n = data.monthlyPinned[key] ?? 0;
            const cls = n === 0 ? 'month-cell empty' : n > 1 ? 'month-cell many' : 'month-cell';
            return (
              <div key={key} className={cls} title={`${label}: ${n} pinned`}>
                <div className="month-label">{label}</div>
                <div className="month-count">{n}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="portfolio-section">
        <h3>Word reuse</h3>
        {data.overusedWords.length === 0 && data.nearLimitWords.length === 0 && (
          <div className="portfolio-empty">No words over the 2-use cap. ✓</div>
        )}
        {data.overusedWords.length > 0 && (
          <div className="word-list">
            <div className="word-heading over">Over cap (retire before reusing):</div>
            {data.overusedWords.map((w) => (
              <span key={w.word} className="word-chip over">{w.word} × {w.count}</span>
            ))}
          </div>
        )}
        {data.nearLimitWords.length > 0 && (
          <div className="word-list">
            <div className="word-heading near">At 2-use limit:</div>
            {data.nearLimitWords.map((w) => (
              <span key={w.word} className="word-chip near">{w.word} × {w.count}</span>
            ))}
          </div>
        )}
      </section>

      <section className="portfolio-section">
        <h3>Recommendations</h3>
        {data.recommendations.length === 0 ? (
          <div className="portfolio-empty">Portfolio is on-target. ✓</div>
        ) : (
          <ul className="recs">
            {data.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </section>

      {data.untaggedSlugs.length > 0 && (
        <section className="portfolio-section">
          <h3>Untagged in notes</h3>
          <div className="word-list">
            {data.untaggedSlugs.map((s) => (
              <span key={s} className="word-chip untagged">{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CategoryBar({ c }: { c: CategoryShare }) {
  const pct = Math.round(c.share * 100);
  const loPct = Math.round(c.targetLow * 100);
  const hiPct = Math.round(c.targetHigh * 100);
  const rangeLabel =
    c.category === 'unknown' ? 'untagged' : `target ${loPct}–${hiPct}%`;
  const statusIcon =
    c.status === 'in-range' ? '✓' : c.status === 'below' ? '↓' : '↑';
  return (
    <div className={`cat-row ${c.status}`}>
      <div className="cat-label">
        <span className="cat-name">{c.category}</span>
        <span className="cat-share">
          {pct}% <span className={`cat-status ${c.status}`}>{statusIcon}</span>
        </span>
      </div>
      <div className="cat-bar-bg">
        {c.category !== 'unknown' && (
          <div
            className="cat-bar-target"
            style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
          />
        )}
        <div
          className={`cat-bar-fill ${c.status}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <div className="cat-meta">
        {c.count} puzzle{c.count === 1 ? '' : 's'} · {rangeLabel}
      </div>
    </div>
  );
}
