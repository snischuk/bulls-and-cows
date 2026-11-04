import type {
  GameConfig,
  GameStatuses,
  GuessRejectionReasons,
  GuessSubmissionStatuses,
  NumberBase,
} from './game.type';

export const NUMBER_BASE: {
  readonly BINARY: 2;
  readonly OCTAL: 8;
  readonly DECIMAL: 10;
  readonly HEXADECIMAL: 16;
} = {
  BINARY: 2,
  OCTAL: 8,
  DECIMAL: 10,
  HEXADECIMAL: 16,
};

export const NUMBER_BASE_LABELS: Readonly<Record<NumberBase, string>> = {
  [NUMBER_BASE.BINARY]: 'BIN',
  [NUMBER_BASE.OCTAL]: 'OCT',
  [NUMBER_BASE.DECIMAL]: 'DEC',
  [NUMBER_BASE.HEXADECIMAL]: 'HEX',
};

export const MILLISECONDS_PER_SECOND: number = 1_000;

export const GAME_STATUS: GameStatuses = {
  PLAYING: 'playing',
  WON: 'won',
};

export const GUESS_SUBMISSION_STATUS: GuessSubmissionStatuses = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const GUESS_REJECTION_REASON: GuessRejectionReasons = {
  INVALID: 'invalid',
  DUPLICATE: 'duplicate',
  FINISHED: 'finished',
};

export const GAME_CONFIG: GameConfig = {
  supportedBases: Object.values(NUMBER_BASE),
  minSecretLength: 2,
  maxSecretLength: 6,
  leaderboardLimit: 10,
};
