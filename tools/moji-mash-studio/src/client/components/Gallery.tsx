import { useSession } from '../hooks/useSSE.js';
import { ConceptCard } from './ConceptCard.js';

export function Gallery() {
  const { concepts } = useSession();
  if (concepts.length === 0) {
    return (
      <div className="gallery">
        <div className="empty">
          No candidates yet. Ask the editor to draft and generate some.
        </div>
      </div>
    );
  }
  return (
    <div className="gallery">
      {concepts.map((c) => (
        <ConceptCard key={c.id} concept={c} />
      ))}
    </div>
  );
}
