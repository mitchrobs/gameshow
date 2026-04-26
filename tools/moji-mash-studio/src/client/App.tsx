import { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar.js';
import { ChatPane } from './components/ChatPane.js';
import { Gallery } from './components/Gallery.js';
import { Portfolio } from './components/Portfolio.js';
import { hydrate } from './hooks/useSSE.js';

type RightView = 'gallery' | 'portfolio';

export function App() {
  const [view, setView] = useState<RightView>('gallery');

  useEffect(() => {
    hydrate().catch((err) => {
      console.error('hydrate failed', err);
    });
  }, []);

  return (
    <div className="app">
      <TopBar />
      <div className="panes">
        <ChatPane />
        <div className="right-pane">
          <div className="view-tabs">
            <button
              type="button"
              className={view === 'gallery' ? 'tab active' : 'tab'}
              onClick={() => setView('gallery')}
            >
              Gallery
            </button>
            <button
              type="button"
              className={view === 'portfolio' ? 'tab active' : 'tab'}
              onClick={() => setView('portfolio')}
            >
              Portfolio
            </button>
          </div>
          {view === 'gallery' ? <Gallery /> : <Portfolio />}
        </div>
      </div>
    </div>
  );
}
