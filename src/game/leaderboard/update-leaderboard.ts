import { GAME_CONFIG } from '../game.config';
import type { LeaderboardEntry } from '../game.type';

type UpdateLeaderboard = (
  entries: readonly LeaderboardEntry[],
  entry: LeaderboardEntry,
) => LeaderboardEntry[];

export const updateLeaderboard: UpdateLeaderboard = (
  entries: readonly LeaderboardEntry[],
  entry: LeaderboardEntry,
): LeaderboardEntry[] => {
  const updatedEntries: LeaderboardEntry[] = entries.some(
    (existing: LeaderboardEntry): boolean => existing.id === entry.id,
  )
    ? [...entries]
    : [...entries, entry];

  return updatedEntries
    .sort(
      (first: LeaderboardEntry, second: LeaderboardEntry): number =>
        first.gameResult.attemptsCount - second.gameResult.attemptsCount ||
        first.gameResult.elapsedTime - second.gameResult.elapsedTime,
    )
    .slice(0, GAME_CONFIG.leaderboardLimit);
};
