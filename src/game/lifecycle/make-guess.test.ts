import { describe, expect, it } from 'vitest';

import {
  GAME_STATUS,
  GUESS_REJECTION_REASON,
  GUESS_SUBMISSION_STATUS,
} from '@/game/game.config';
import type {
  GameSettings,
  GameState,
  GuessAttempt,
  MakeGuessResult,
} from '@/game/game.type';

import { makeGuess } from './make-guess';

const SETTINGS: GameSettings = { secretLength: 4, numberBase: 10 };

type CreateGameState = (overrides?: Partial<GameState>) => GameState;

const createGameState: CreateGameState = (
  overrides: Partial<GameState> = {},
): GameState => ({
  gameSettings: SETTINGS,
  secretSequence: '1234',
  attemptsHistory: [],
  gameStatus: GAME_STATUS.PLAYING,
  startedAt: 1_000,
  ...overrides,
});

describe('makeGuess', (): void => {
  it('adds a valid guess immutably with its feedback', (): void => {
    const gameState: GameState = createGameState();

    const result: MakeGuessResult = makeGuess(gameState, '1243');

    expect(result.status).toBe(GUESS_SUBMISSION_STATUS.ACCEPTED);

    if (result.status !== GUESS_SUBMISSION_STATUS.ACCEPTED) return;

    const expectedAttempt: GuessAttempt = {
      guessSequence: '1243',
      bullsCount: 2,
      cowsCount: 2,
    };

    expect(result.gameState.attemptsHistory).toEqual([expectedAttempt]);
    expect(result.gameState).not.toBe(gameState);
    expect(result.gameState.attemptsHistory).not.toBe(
      gameState.attemptsHistory,
    );
    expect(gameState.attemptsHistory).toEqual([]);
    expect(result.gameState.gameStatus).toBe(GAME_STATUS.PLAYING);
  });

  it('rejects an invalid guess without changing the game state', (): void => {
    const gameState: GameState = createGameState();

    const result: MakeGuessResult = makeGuess(gameState, '12A4');

    expect(result).toEqual({
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.INVALID,
      gameState,
    });
    expect(gameState.attemptsHistory).toEqual([]);
  });

  it('rejects a repeated guess without adding another history entry', (): void => {
    const previousAttempt: GuessAttempt = {
      guessSequence: '5678',
      bullsCount: 0,
      cowsCount: 0,
    };

    const gameState: GameState = createGameState({
      attemptsHistory: [previousAttempt],
    });

    const result: MakeGuessResult = makeGuess(gameState, '5678');

    expect(result).toEqual({
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.DUPLICATE,
      gameState,
    });
    expect(gameState.attemptsHistory).toHaveLength(1);
  });

  it('treats hexadecimal guesses with different casing as duplicates', (): void => {
    const hexSettings: GameSettings = {
      secretLength: 4,
      numberBase: 16,
    };

    const previousAttempt: GuessAttempt = {
      guessSequence: 'a2e0',
      bullsCount: 3,
      cowsCount: 0,
    };

    const gameState: GameState = createGameState({
      gameSettings: hexSettings,
      secretSequence: 'a2f0',
      attemptsHistory: [previousAttempt],
    });

    const result: MakeGuessResult = makeGuess(gameState, 'A2E0');

    expect(result).toEqual({
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.DUPLICATE,
      gameState,
    });
    expect(gameState.attemptsHistory).toHaveLength(1);
  });

  it('marks a correct guess as a win', (): void => {
    const gameState: GameState = createGameState();

    const result: MakeGuessResult = makeGuess(gameState, '1234');

    expect(result.status).toBe(GUESS_SUBMISSION_STATUS.ACCEPTED);

    if (result.status !== GUESS_SUBMISSION_STATUS.ACCEPTED) return;

    expect(result.gameState.gameStatus).toBe(GAME_STATUS.WON);
    expect(result.gameState.attemptsHistory).toHaveLength(1);
  });

  it('rejects guesses after the game has been won', (): void => {
    const gameState: GameState = createGameState({
      gameStatus: GAME_STATUS.WON,
    });

    const result: MakeGuessResult = makeGuess(gameState, '5678');

    expect(result).toEqual({
      status: GUESS_SUBMISSION_STATUS.REJECTED,
      reason: GUESS_REJECTION_REASON.FINISHED,
      gameState,
    });
  });

  it.each(['', '123', '12345', '1123', '12 4', '12a4'])(
    'rejects invalid guess %j with the original state',
    (guess: string): void => {
      const gameState: GameState = createGameState();

      const result: MakeGuessResult = makeGuess(gameState, guess);

      expect(result.status).toBe(GUESS_SUBMISSION_STATUS.REJECTED);
      expect(result.gameState).toBe(gameState);
      expect(result).toHaveProperty('reason', GUESS_REJECTION_REASON.INVALID);
    },
  );

  it('preserves frozen history, settings, secret and start time when appending', (): void => {
    const previousAttempt: GuessAttempt = Object.freeze({
      guessSequence: '5678',
      bullsCount: 0,
      cowsCount: 0,
    });

    const gameState: GameState = Object.freeze(
      createGameState({
        gameSettings: Object.freeze({ ...SETTINGS }),
        attemptsHistory: Object.freeze([previousAttempt]),
      }),
    );

    const result: MakeGuessResult = makeGuess(gameState, '1243');

    expect(result.status).toBe(GUESS_SUBMISSION_STATUS.ACCEPTED);
    expect(result.gameState.attemptsHistory).toEqual([
      previousAttempt,
      { guessSequence: '1243', bullsCount: 2, cowsCount: 2 },
    ]);
    expect(result.gameState.attemptsHistory[0]).toBe(previousAttempt);
    expect(gameState.attemptsHistory).toEqual([previousAttempt]);
    expect(result.gameState.gameSettings).toBe(gameState.gameSettings);
    expect(result.gameState.secretSequence).toBe(gameState.secretSequence);
    expect(result.gameState.startedAt).toBe(gameState.startedAt);
  });

  it('wins with uppercase hexadecimal digits and preserves the submitted guess', (): void => {
    const gameState: GameState = createGameState({
      gameSettings: { numberBase: 16, secretLength: 4 },
      secretSequence: 'a2f0',
    });

    const result: MakeGuessResult = makeGuess(gameState, 'A2F0');

    expect(result.status).toBe(GUESS_SUBMISSION_STATUS.ACCEPTED);
    expect(result.gameState.gameStatus).toBe(GAME_STATUS.WON);
    expect(result.gameState.attemptsHistory).toEqual([
      { guessSequence: 'A2F0', bullsCount: 4, cowsCount: 0 },
    ]);
    expect(gameState.gameStatus).toBe(GAME_STATUS.PLAYING);
  });
});
