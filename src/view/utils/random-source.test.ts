import { describe, expect, it } from 'vitest';

import type { RandomSource } from '@/game/game.type';

import { createRandomSource } from './random-source';

describe('createRandomSource', (): void => {
  it('produces a predictable sequence from a seed', (): void => {
    const random: RandomSource = createRandomSource(1);

    expect(random()).toBe(1015568748 / 2 ** 32);
    expect(random()).toBe(1586005467 / 2 ** 32);
    expect(random()).toBe(2165703038 / 2 ** 32);
  });

  it('keeps generators independent and repeatable', (): void => {
    const first: RandomSource = createRandomSource(42);

    const second: RandomSource = createRandomSource(42);

    expect(first()).toBe(second());

    const next: number = first();

    first();

    expect(second()).toBe(next);
  });

  it('produces different sequences for different seeds', (): void => {
    const first: RandomSource = createRandomSource(1);

    const second: RandomSource = createRandomSource(2);

    expect(first()).not.toBe(second());
  });

  it.each([0, 1, -1, 0xffffffff])(
    'returns finite values in [0, 1) for seed %s',
    (seed: number): void => {
      const random: RandomSource = createRandomSource(seed);

      for (let index: number = 0; index < 1000; index += 1) {
        const value: number = random();

        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    },
  );
});
