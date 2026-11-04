import { describe, expect, it } from 'vitest';

import { GAME_STATUS } from '../game.config';
import type {
  GameSettings,
  GameState,
  NumberBase,
  RandomSource,
} from '../game.type';

import { startGame } from './start-game';

describe('startGame', (): void => {
  it('creates a playing game with an empty history and the start time', (): void => {
    const settings: GameSettings = { secretLength: 4, numberBase: 10 };

    const random: RandomSource = (): number => 0.5;

    const startedAt: number = 1_000;

    const gameState: GameState = startGame(settings, random, startedAt);

    expect(gameState).toMatchObject({
      gameSettings: settings,
      attemptsHistory: [],
      gameStatus: GAME_STATUS.PLAYING,
      startedAt,
    });
    expect(gameState.secretSequence).toHaveLength(settings.secretLength);
    expect(new Set(gameState.secretSequence).size).toBe(settings.secretLength);
  });

  it('rejects settings with a length greater than the base', (): void => {
    const settings: GameSettings = { secretLength: 3, numberBase: 2 };

    const random: RandomSource = (): number => 0.5;

    expect((): GameState => startGame(settings, random, 1_000)).toThrow(
      RangeError,
    );
  });

  it.each<NumberBase>([2, 8, 10, 16])(
    'supports base %i with a leading zero',
    (numberBase: NumberBase): void => {
      const settings: GameSettings = { numberBase, secretLength: 2 };

      const random: RandomSource = (): number => 0;

      const gameState: GameState = startGame(settings, random, 1000);

      expect(gameState.secretSequence).toBe('01');
      expect(gameState.gameSettings).toEqual(settings);
      expect(gameState.gameSettings).not.toBe(settings);
    },
  );

  it.each([2, 3, 4, 5, 6])(
    'supports secret length %i',
    (secretLength: number): void => {
      const settings: GameSettings = { numberBase: 10, secretLength };

      const random: RandomSource = (): number => 0;

      expect(startGame(settings, random, 1000).secretSequence).toHaveLength(
        secretLength,
      );
    },
  );

  it.each([0, 1, 7, 2.5, NaN, Infinity])(
    'rejects invalid length %s',
    (secretLength: number): void => {
      const settings: GameSettings = { numberBase: 10, secretLength };

      const random: RandomSource = (): number => 0;

      expect((): GameState => startGame(settings, random, 1000)).toThrow(
        RangeError,
      );
    },
  );

  it('creates independent rounds without changing frozen settings', (): void => {
    const settings: GameSettings = Object.freeze({
      numberBase: 16,
      secretLength: 6,
    });

    const random: RandomSource = (): number => 0;

    const first: GameState = startGame(settings, random, 1000);

    const second: GameState = startGame(settings, random, 2000);

    expect(first.secretSequence).toBe('012345');
    expect(second).not.toBe(first);
    expect(second.attemptsHistory).not.toBe(first.attemptsHistory);
    expect(second.gameSettings).not.toBe(first.gameSettings);
    expect(first.startedAt).toBe(1000);
    expect(second.startedAt).toBe(2000);
  });

  it.each([NaN, Infinity, -Infinity])(
    'rejects a non-finite start time %s',
    (startedAt: number): void => {
      const settings: GameSettings = { numberBase: 10, secretLength: 4 };

      const random: RandomSource = (): number => 0;

      expect((): GameState => startGame(settings, random, startedAt)).toThrow(
        RangeError,
      );
    },
  );
});
