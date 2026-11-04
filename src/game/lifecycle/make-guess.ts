import { evaluateGuess } from '@/game/core/evaluate-guess';
import { isValidGuess } from '@/game/core/is-valid-guess';
import {
  GAME_STATUS,
  GUESS_REJECTION_REASON,
  GUESS_SUBMISSION_STATUS,
} from '@/game/game.config';
import type {
  GameState,
  GuessAttempt,
  GuessFeedback,
  MakeGuessResult,
} from '@/game/game.type';

type MakeGuess = (
  gameState: GameState,
  guessSequence: string,
) => MakeGuessResult;

export const makeGuess: MakeGuess = (
  gameState: GameState,
  guessSequence: string,
): MakeGuessResult => {
  if (gameState.gameStatus === GAME_STATUS.WON) {
    return {
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.FINISHED,
      gameState,
    };
  }

  const { secretLength, numberBase } = gameState.gameSettings;

  const isGuessValid: boolean = isValidGuess(
    guessSequence,
    secretLength,
    numberBase,
  );

  if (!isGuessValid) {
    return {
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.INVALID,
      gameState,
    };
  }

  const normalizedGuess: string = guessSequence.toLowerCase();

  const isDuplicateGuess: boolean = gameState.attemptsHistory.some(
    (attempt: GuessAttempt): boolean =>
      attempt.guessSequence.toLowerCase() === normalizedGuess,
  );

  if (isDuplicateGuess) {
    return {
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.DUPLICATE,
      gameState,
    };
  }

  const guessResult: GuessFeedback = evaluateGuess(
    gameState.secretSequence,
    guessSequence,
  );

  const acceptedAttempt: GuessAttempt = {
    guessSequence,
    ...guessResult,
  };

  const attemptsHistory: GuessAttempt[] = [
    ...gameState.attemptsHistory,
    acceptedAttempt,
  ];

  const gameStatus: GameState['gameStatus'] =
    guessResult.bullsCount === secretLength
      ? GAME_STATUS.WON
      : GAME_STATUS.PLAYING;

  const updatedGameState: GameState = {
    ...gameState,
    attemptsHistory,
    gameStatus,
  };

  return {
    status: GUESS_SUBMISSION_STATUS.ACCEPTED,
    gameState: updatedGameState,
  };
};
