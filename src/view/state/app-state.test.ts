import { afterEach, describe, expect, it, vi } from 'vitest';

import { type AppState, createAppState } from './app-state';

afterEach((): void => {
  vi.unstubAllGlobals();
});

describe('createAppState', (): void => {
  it('creates an independent initial state for each application', (): void => {
    vi.stubGlobal('localStorage', { getItem: (): null => null });

    const first: AppState = createAppState();

    const second: AppState = createAppState();

    expect(first).toMatchObject({
      language: 'en',
      theme: 'light',
      entries: [],
      gameState: null,
      gameResult: null,
      guessDraft: '',
      notice: 'enterGuess',
      preferencesError: false,
    });
    expect(first.storageMessage).toBeUndefined();
    expect(first.settings).toBeUndefined();
    expect(first).not.toBe(second);
    expect(first.entries).not.toBe(second.entries);
  });

  it('loads language and theme independently', (): void => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string): string | null => {
        if (key === 'bulls-and-cows.language') return '{broken';

        if (key === 'bulls-and-cows.theme') return '"dark"';

        return null;
      },
    });

    const state: AppState = createAppState();

    expect(state.language).toBe('en');
    expect(state.theme).toBe('dark');
    expect(state.storageMessage).toBeUndefined();
  });

  it('starts with defaults and reports unavailable leaderboard storage', (): void => {
    vi.stubGlobal('localStorage', {
      getItem: (): never => {
        throw new Error('Unavailable');
      },
    });

    const state: AppState = createAppState();

    expect(state.language).toBe('en');
    expect(state.theme).toBe('light');
    expect(state.entries).toEqual([]);
    expect(state.storageMessage).toBe('loadError');
  });
});
