import { GAME_STATUS } from '../game.config';
import type { GameResult, GameState } from '../game.type';

type FinishGame = (gameState: GameState, finishedAt: number) => GameResult;

export const finishGame: FinishGame = (
  gameState: GameState,
  finishedAt: number,
): GameResult => {
  if (gameState.gameStatus !== GAME_STATUS.WON) {
    throw new RangeError('Cannot finish a game that has not been won');
  }

  if (
    !Number.isFinite(gameState.startedAt) ||
    !Number.isFinite(finishedAt) ||
    finishedAt < gameState.startedAt
  ) {
    throw new RangeError(
      'Finish time must be finite and not precede start time',
    );
  }

  return {
    gameSettings: { ...gameState.gameSettings },
    attemptsCount: gameState.attemptsHistory.length,
    elapsedTime: finishedAt - gameState.startedAt,
  };
};
