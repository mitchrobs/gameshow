import { useEffect } from 'react';
import { TopBar } from './components/TopBar.js';
import { ChatPane } from './components/ChatPane.js';
import { Gallery } from './components/Gallery.js';
import { hydrate } from './hooks/useSSE.js';

export function App() {
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
        <Gallery />
      </div>
    </div>
  );
}
