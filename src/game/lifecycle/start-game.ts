import { generateSecret } from '@/game/core/generate-secret';
import { GAME_STATUS } from '@/game/game.config';
import type { GameSettings, GameState, RandomSource } from '@/game/game.type';
import { isValidGameSettings } from '@/game/validation/is-valid-game-settings';

type StartGame = (
  gameSettings: GameSettings,
  random: RandomSource,
  startedAt: number,
) => GameState;

export const startGame: StartGame = (
  gameSettings: GameSettings,
  random: RandomSource,
  startedAt: number,
): GameState => {
  if (!Number.isFinite(startedAt)) {
    throw new RangeError('Start time must be finite');
  }

  if (!isValidGameSettings(gameSettings)) {
    throw new RangeError('Game settings are invalid');
  }

  const secretSequence: string = generateSecret(
    gameSettings.secretLength,
    gameSettings.numberBase,
    random,
  );

  return {
    gameSettings: { ...gameSettings },
    secretSequence,
    attemptsHistory: [],
    gameStatus: GAME_STATUS.PLAYING,
    startedAt,
  };
};
