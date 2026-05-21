const STORAGE_KEY = 'gameshow-ballpark-telemetry';
const MAX_BUFFERED_EVENTS = 200;

export type BallparkTelemetryEvent = {
  event:
    | 'unavailable_view'
    | 'start'
    | 'hard_mode_toggle'
    | 'question_shown'
    | 'guess_submitted'
    | 'round_complete'
    | 'summary_shown'
    | 'extra_inning_shown'
    | 'extra_inning_played'
    | 'extra_inning_skipped'
    | 'share_copied'
    | 'replay';
  dateKey?: string;
  themeKey?: string;
  questionKey?: string;
  mode?: 'normal' | 'hard';
  phase?: string;
  guessIndex?: number;
  tier?: string;
  pctOffBucket?: string;
  pctOff?: number;
  won?: boolean;
  elapsedMs?: number;
  metadata?: Record<string, unknown>;
};

type StoredTelemetryEvent = BallparkTelemetryEvent & {
  id: string;
  createdAt: string;
};

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage ?? null;
}

function getDebugEnabled() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('debugBallpark') === '1';
}

function getEndpoint() {
  if (typeof window === 'undefined') return null;
  const endpoint = (window as typeof window & {
    __GAMESHOW_BALLPARK_TELEMETRY_ENDPOINT__?: string;
  }).__GAMESHOW_BALLPARK_TELEMETRY_ENDPOINT__;
  return typeof endpoint === 'string' && endpoint.startsWith('http') ? endpoint : null;
}

function readBuffer(): StoredTelemetryEvent[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const rawValue = storage.getItem(STORAGE_KEY);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeBuffer(events: StoredTelemetryEvent[]) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_BUFFERED_EVENTS)));
  } catch {
    // Telemetry should never block play.
  }
}

export function getBallparkTelemetryBuffer() {
  return readBuffer();
}

export function clearBallparkTelemetryBuffer() {
  writeBuffer([]);
}

export function trackBallparkEvent(event: BallparkTelemetryEvent) {
  const safeEvent: StoredTelemetryEvent = {
    ...event,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const nextBuffer = [...readBuffer(), safeEvent].slice(-MAX_BUFFERED_EVENTS);
  writeBuffer(nextBuffer);

  if (getDebugEnabled()) {
    // eslint-disable-next-line no-console
    console.info('[Ballpark telemetry]', safeEvent);
  }

  const endpoint = getEndpoint();
  if (endpoint) {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeEvent),
      keepalive: true,
    }).catch(() => {
      // Keep this best-effort so a blocked endpoint cannot affect gameplay.
    });
  }

  return safeEvent;
}
