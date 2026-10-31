export type NumberBase = 2 | 8 | 10 | 16;

export interface GameConfig {
  readonly supportedBases: readonly NumberBase[];
  readonly minSecretLength: number;
  readonly maxSecretLength: number;
  readonly leaderboardLimit: number;
}

export interface GameStatuses {
  readonly PLAYING: 'playing';
  readonly WON: 'won';
}

export interface GuessSubmissionStatuses {
  readonly ACCEPTED: 'accepted';
  readonly REJECTED: 'rejected';
}

export interface GuessRejectionReasons {
  readonly INVALID: 'invalid';
  readonly DUPLICATE: 'duplicate';
  readonly FINISHED: 'finished';
}

export type GameStatus = GameStatuses[keyof GameStatuses];

export type GuessRejectionReason =
  GuessRejectionReasons[keyof GuessRejectionReasons];

export interface GameSettings {
  readonly numberBase: NumberBase;
  readonly secretLength: number;
}

export interface GuessFeedback {
  readonly bullsCount: number;
  readonly cowsCount: number;
}

export interface GuessAttempt extends GuessFeedback {
  readonly guessSequence: string;
}

export interface GameState {
  readonly gameSettings: GameSettings;
  readonly secretSequence: string;
  readonly attemptsHistory: readonly GuessAttempt[];
  readonly gameStatus: GameStatus;
  readonly startedAt: number;
}

export interface GameResult {
  readonly gameSettings: GameSettings;
  readonly attemptsCount: number;
  readonly elapsedTime: number;
}

export interface LeaderboardEntry {
  readonly id: string;
  readonly gameResult: GameResult;
}

export type RandomSource = () => number;

export type MakeGuessResult =
  | {
      readonly status: GuessSubmissionStatuses['ACCEPTED'];
      readonly gameState: GameState;
    }
  | {
      readonly status: GuessSubmissionStatuses['REJECTED'];
      readonly reason: GuessRejectionReason;
      readonly gameState: GameState;
    };
