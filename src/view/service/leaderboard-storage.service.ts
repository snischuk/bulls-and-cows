import type { LeaderboardEntry } from '../../game/game.type';
import { updateLeaderboard } from '../../game/leaderboard/update-leaderboard';
import { isValidGameSettings } from '../../game/validation/is-valid-game-settings';
import { readStorage, writeStorage } from '../infrastructure/local-storage';

const LEADERBOARD_KEY: string = 'bulls-and-cows.leaderboard';

type IsRecord = (value: unknown) => value is Record<string, unknown>;

type IsLeaderboardEntry = (value: unknown) => value is LeaderboardEntry;

interface LeaderboardService {
  readonly load: () => LeaderboardEntry[];
  readonly save: (entries: readonly LeaderboardEntry[]) => void;
}

const isRecord: IsRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLeaderboardEntry: IsLeaderboardEntry = (
  value: unknown,
): value is LeaderboardEntry => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    !isRecord(value.gameResult)
  )
    return false;

  const result: Record<string, unknown> = value.gameResult;

  return (
    typeof result.attemptsCount === 'number' &&
    Number.isSafeInteger(result.attemptsCount) &&
    result.attemptsCount > 0 &&
    typeof result.elapsedTime === 'number' &&
    Number.isFinite(result.elapsedTime) &&
    result.elapsedTime >= 0 &&
    isValidGameSettings(result.gameSettings)
  );
};

export const leaderboardService: LeaderboardService = {
  load: (): LeaderboardEntry[] => {
    const stored: unknown = readStorage(LEADERBOARD_KEY);

    if (stored === null) return [];

    if (!Array.isArray(stored) || !stored.every(isLeaderboardEntry)) {
      throw new TypeError('Invalid leaderboard data');
    }

    return stored.reduce<LeaderboardEntry[]>(
      (
        entries: LeaderboardEntry[],
        entry: LeaderboardEntry,
      ): LeaderboardEntry[] => updateLeaderboard(entries, entry),
      [],
    );
  },

  save: (entries: readonly LeaderboardEntry[]): void => {
    writeStorage(LEADERBOARD_KEY, entries);
  },
};
