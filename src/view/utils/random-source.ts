import type { RandomSource } from '../../game/game.type';

const UINT32_RANGE: number = 2 ** 32;

const MULTIPLIER: number = 1664525;

const INCREMENT: number = 1013904223;

type CreateRandomSource = (seed: number) => RandomSource;

export const createRandomSource: CreateRandomSource = (
  seed: number,
): RandomSource => {
  const state: Uint32Array = new Uint32Array([seed]);

  return (): number => {
    state[0] = state[0] * MULTIPLIER + INCREMENT;

    return state[0] / UINT32_RANGE;
  };
};

const seedValues: Uint32Array = crypto.getRandomValues(new Uint32Array(1));

export const randomSource: RandomSource = createRandomSource(seedValues[0]);
