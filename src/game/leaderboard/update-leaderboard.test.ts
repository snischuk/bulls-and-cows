import { describe, expect, it } from 'vitest';

import type { LeaderboardEntry } from '@/game/game.type';

import { updateLeaderboard } from './update-leaderboard';

type CreateEntry = (
  id: string,
  attemptsCount: number,
  elapsedTime: number,
) => LeaderboardEntry;

const createEntry: CreateEntry = (
  id: string,
  attemptsCount: number,
  elapsedTime: number,
): LeaderboardEntry => ({
  id,
  gameResult: {
    gameSettings: { numberBase: 10, secretLength: 4 },
    attemptsCount,
    elapsedTime,
  },
});

describe('updateLeaderboard', (): void => {
  it('orders by attempts then time without mutating previous results', (): void => {
    const previous: readonly LeaderboardEntry[] = Object.freeze([
      createEntry('slow', 2, 900),
      createEntry('many', 3, 100),
    ]);

    const winner: LeaderboardEntry = createEntry('fast', 2, 500);

    expect(
      updateLeaderboard(previous, winner).map(
        (entry: LeaderboardEntry): string => entry.id,
      ),
    ).toEqual(['fast', 'slow', 'many']);

    expect(previous.map((entry: LeaderboardEntry): string => entry.id)).toEqual(
      ['slow', 'many'],
    );
  });

  it('keeps only ten results and preserves arrival order on ties', (): void => {
    const previous: LeaderboardEntry[] = Array.from(
      { length: 10 },
      (_: unknown, index: number): LeaderboardEntry =>
        createEntry(String(index), 2, 500),
    );

    expect(updateLeaderboard(previous, createEntry('last', 2, 500))).toEqual(
      previous,
    );
  });

  it('does not add the same round twice', (): void => {
    const entry: LeaderboardEntry = createEntry('round', 1, 100);

    expect(updateLeaderboard([entry], entry)).toEqual([entry]);
  });
});
