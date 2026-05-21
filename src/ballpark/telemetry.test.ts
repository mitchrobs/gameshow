import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearBallparkTelemetryBuffer,
  getBallparkTelemetryBuffer,
  trackBallparkEvent,
} from './telemetry';

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };
}

describe('Ballpark telemetry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'fetch');
  });

  it('writes non-PII events to a capped local buffer', () => {
    const localStorage = createStorage();
    (globalThis as typeof globalThis & { window: unknown }).window = {
      localStorage,
      location: { search: '' },
    };

    const event = trackBallparkEvent({
      dateKey: '2026-05-21',
      event: 'guess_submitted',
      guessIndex: 2,
      mode: 'hard',
      pctOffBucket: 'within_50',
      questionKey: 'garden-shed-q2',
      themeKey: 'garden-shed',
      tier: 'close',
    });

    expect(event.id).toMatch(/^[a-z0-9]+-/);
    expect(event.createdAt).toMatch(/^\d{4}-/);
    expect(getBallparkTelemetryBuffer()).toHaveLength(1);
    expect(getBallparkTelemetryBuffer()[0]).toMatchObject({
      dateKey: '2026-05-21',
      event: 'guess_submitted',
      mode: 'hard',
      questionKey: 'garden-shed-q2',
      tier: 'close',
    });

    clearBallparkTelemetryBuffer();
    expect(getBallparkTelemetryBuffer()).toEqual([]);
  });

  it('uses the optional endpoint hook without requiring a backend', () => {
    const localStorage = createStorage();
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true }));
    (globalThis as typeof globalThis & { window: unknown; fetch: unknown }).window = {
      __GAMESHOW_BALLPARK_TELEMETRY_ENDPOINT__: 'https://example.test/ballpark',
      localStorage,
      location: { search: '?debugBallpark=1' },
    };
    (globalThis as typeof globalThis & { fetch: unknown }).fetch = fetchMock;
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    trackBallparkEvent({ event: 'summary_shown', metadata: { wins: 3 } });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/ballpark',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Ballpark telemetry]',
      expect.objectContaining({ event: 'summary_shown' })
    );
  });
});
