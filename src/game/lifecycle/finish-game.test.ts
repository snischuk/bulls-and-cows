import { describe, expect, it } from 'vitest';

import { GAME_STATUS, GUESS_SUBMISSION_STATUS } from '../game.config';
import type {
  GameResult,
  GameSettings,
  GameState,
  MakeGuessResult,
  RandomSource,
} from '../game.type';

import { finishGame } from './finish-game';
import { makeGuess } from './make-guess';
import { startGame } from './start-game';

describe('finishGame', (): void => {
  it('creates a result from a won game and its finish time', (): void => {
    const gameSettings: GameSettings = {
      secretLength: 4,
      numberBase: 10,
    };

    const gameState: GameState = {
      gameSettings,
      secretSequence: '1234',
      attemptsHistory: [
        {
          guessSequence: '1234',
          bullsCount: 4,
          cowsCount: 0,
        },
      ],
      gameStatus: GAME_STATUS.WON,
      startedAt: 1_000,
    };

    const finishedAt: number = 5_500;

    const gameResult: GameResult = finishGame(gameState, finishedAt);

    expect(gameResult).toEqual({
      gameSettings,
      attemptsCount: 1,
      elapsedTime: 4_500,
    });
  });

  it('rejects a game that has not been won', (): void => {
    const gameSettings: GameSettings = {
      secretLength: 4,
      numberBase: 10,
    };

    const gameState: GameState = {
      gameSettings,
      secretSequence: '1234',
      attemptsHistory: [],
      gameStatus: GAME_STATUS.PLAYING,
      startedAt: 1_000,
    };

    expect((): GameResult => finishGame(gameState, 5_500)).toThrow(RangeError);
  });

  it('finishes a complete round, counting only accepted attempts', (): void => {
    const settings: GameSettings = Object.freeze({
      numberBase: 2,
      secretLength: 2,
    });

    const random: RandomSource = (): number => 0;

    const initial: GameState = startGame(settings, random, 1000);

    const invalid: MakeGuessResult = makeGuess(initial, '11');

    expect(invalid.gameState).toBe(initial);

    const wrong: MakeGuessResult = makeGuess(initial, '10');

    expect(wrong.status).toBe(GUESS_SUBMISSION_STATUS.ACCEPTED);

    const duplicate: MakeGuessResult = makeGuess(wrong.gameState, '10');

    expect(duplicate.gameState).toBe(wrong.gameState);

    const winning: MakeGuessResult = makeGuess(wrong.gameState, '01');

    expect(winning.gameState.gameStatus).toBe(GAME_STATUS.WON);

    Object.freeze(winning.gameState.attemptsHistory);
    Object.freeze(winning.gameState);

    const result: GameResult = finishGame(winning.gameState, 5500);

    expect(result).toEqual({
      gameSettings: settings,
      attemptsCount: 2,
      elapsedTime: 4500,
    });
    expect(result.gameSettings).not.toBe(winning.gameState.gameSettings);
    expect(makeGuess(winning.gameState, '10').gameState).toBe(
      winning.gameState,
    );
    expect(initial.attemptsHistory).toEqual([]);
    expect(wrong.gameState.attemptsHistory).toHaveLength(1);
    expect(finishGame(winning.gameState, 5500)).toEqual(result);
  });

  it.each([999, NaN, Infinity, -Infinity])(
    'rejects an invalid finish time %s',
    (finishedAt: number): void => {
      const gameState: GameState = {
        gameSettings: { numberBase: 2, secretLength: 2 },
        secretSequence: '01',
        attemptsHistory: [{ guessSequence: '01', bullsCount: 2, cowsCount: 0 }],
        gameStatus: GAME_STATUS.WON,
        startedAt: 1000,
      };

      expect((): GameResult => finishGame(gameState, finishedAt)).toThrow(
        RangeError,
      );
    },
  );

  it('allows a round to finish in the same millisecond it starts', (): void => {
    const gameState: GameState = {
      gameSettings: { numberBase: 2, secretLength: 2 },
      secretSequence: '01',
      attemptsHistory: [{ guessSequence: '01', bullsCount: 2, cowsCount: 0 }],
      gameStatus: GAME_STATUS.WON,
      startedAt: 1000,
    };

    expect(finishGame(gameState, 1000).elapsedTime).toBe(0);
  });
});
