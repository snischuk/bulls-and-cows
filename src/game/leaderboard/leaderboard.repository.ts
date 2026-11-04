import type { LeaderboardEntry } from '../game.type';

export interface LeaderboardRepository {
  load(): Promise<LeaderboardEntry[]>;
  save(entries: LeaderboardEntry[]): Promise<void>;
}
