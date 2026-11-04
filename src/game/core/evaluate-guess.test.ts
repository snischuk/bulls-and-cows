import { describe, expect, it } from 'vitest';

import { evaluateGuess } from './evaluate-guess';

describe('evaluateGuess', (): void => {
  it('returns all bulls when secret and guess are identical', (): void => {
    expect(evaluateGuess('1234', '1234')).toEqual({
      bullsCount: 4,
      cowsCount: 0,
    });
  });

  it('counts bulls and cows correctly for partially matching digits', (): void => {
    expect(evaluateGuess('1234', '1243')).toEqual({
      bullsCount: 2,
      cowsCount: 2,
    });
  });

  it('returns all cows when every digit matches but no position matches', (): void => {
    expect(evaluateGuess('1234', '4321')).toEqual({
      bullsCount: 0,
      cowsCount: 4,
    });
  });

  it('returns zero bulls and cows when no digits match', (): void => {
    expect(evaluateGuess('1234', '5678')).toEqual({
      bullsCount: 0,
      cowsCount: 0,
    });
  });

  it('does not count bulls as cows', (): void => {
    expect(evaluateGuess('1234', '1256')).toEqual({
      bullsCount: 2,
      cowsCount: 0,
    });
  });

  it('compares hexadecimal digits without case sensitivity', (): void => {
    expect(evaluateGuess('a2f0', 'A2F0')).toEqual({
      bullsCount: 4,
      cowsCount: 0,
    });
  });

  it('counts hexadecimal matches with different cases and positions', (): void => {
    expect(evaluateGuess('a2f0', '2A0F')).toEqual({
      bullsCount: 0,
      cowsCount: 4,
    });
  });

  it('preserves leading zeroes when comparing digits', (): void => {
    expect(evaluateGuess('0123', '0132')).toEqual({
      bullsCount: 2,
      cowsCount: 2,
    });
  });
});
