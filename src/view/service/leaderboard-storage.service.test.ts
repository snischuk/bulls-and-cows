import { afterEach, describe, expect, it, vi } from 'vitest';

import type { LeaderboardEntry } from '@/game/game.type';

import { leaderboardService } from './leaderboard-storage.service';

const ENTRY: LeaderboardEntry = {
  id: 'round',
  gameResult: {
    gameSettings: { numberBase: 16, secretLength: 4 },
    attemptsCount: 2,
    elapsedTime: 1500,
  },
};

afterEach((): void => {
  vi.unstubAllGlobals();
});

describe('leaderboard storage', (): void => {
  it('loads an empty leaderboard for a missing key', (): void => {
    vi.stubGlobal('localStorage', { getItem: (): null => null });

    expect(leaderboardService.load()).toEqual([]);
  });

  it('restores saved results using the same storage key', (): void => {
    const records: Map<string, string> = new Map();

    vi.stubGlobal('localStorage', {
      getItem: (key: string): string | null => records.get(key) ?? null,
      setItem: (key: string, value: string): void => {
        records.set(key, value);
      },
    });

    leaderboardService.save([ENTRY]);

    expect(leaderboardService.load()).toEqual([ENTRY]);
    expect(records.size).toBe(1);
  });

  const invalidRecords: readonly unknown[] = [
    {},
    [{ ...ENTRY, id: '' }],
    [{ ...ENTRY, gameResult: { ...ENTRY.gameResult, attemptsCount: 0 } }],
    [{ ...ENTRY, gameResult: { ...ENTRY.gameResult, elapsedTime: -1 } }],
    [
      {
        ...ENTRY,
        gameResult: {
          ...ENTRY.gameResult,
          gameSettings: { numberBase: 3, secretLength: 2 },
        },
      },
    ],
    [
      {
        ...ENTRY,
        gameResult: {
          ...ENTRY.gameResult,
          gameSettings: { numberBase: 2, secretLength: 3 },
        },
      },
    ],
    [null],
  ];

  it.each(
    invalidRecords.map((stored: unknown): { stored: unknown } => ({ stored })),
  )(
    'rejects invalid saved data %#',
    ({ stored }: { stored: unknown }): void => {
      vi.stubGlobal('localStorage', {
        getItem: (): string => JSON.stringify(stored),
      });

      expect((): LeaderboardEntry[] => leaderboardService.load()).toThrow(
        TypeError,
      );
    },
  );

  it('restores only the best ten results in order', (): void => {
    const entries: LeaderboardEntry[] = Array.from(
      { length: 12 },
      (_: unknown, index: number): LeaderboardEntry => ({
        id: String(index),
        gameResult: { ...ENTRY.gameResult, attemptsCount: 12 - index },
      }),
    );

    vi.stubGlobal('localStorage', {
      getItem: (): string => JSON.stringify(entries),
    });

    const loaded: LeaderboardEntry[] = leaderboardService.load();

    expect(loaded).toHaveLength(10);
    expect(loaded[0].gameResult.attemptsCount).toBe(1);
    expect(loaded[9].gameResult.attemptsCount).toBe(10);
  });
});
