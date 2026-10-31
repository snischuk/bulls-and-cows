import { describe, expect, it } from 'vitest';

import { isValidGuess } from './is-valid-guess';

describe('isValidGuess', (): void => {
  describe('guess length', (): void => {
    it('accepts a guess with the required length', (): void => {
      expect(isValidGuess('1234', 4, 10)).toBe(true);
    });

    it.each<[string, number, number]>([
      ['123', 4, 10],
      ['12345', 4, 10],
    ])(
      'rejects a guess with an incorrect length: %s',
      (guess: string, length: number, base: number): void => {
        expect(isValidGuess(guess, length, base)).toBe(false);
      },
    );

    it('accepts a binary guess at the maximum unique length', (): void => {
      expect(isValidGuess('01', 2, 2)).toBe(true);
    });

    it('rejects a guess whose length exceeds the base', (): void => {
      expect(isValidGuess('012', 3, 2)).toBe(false);
    });
  });

  describe('digit validity', (): void => {
    it('rejects characters outside the decimal system', (): void => {
      expect(isValidGuess('12A3', 4, 10)).toBe(false);
    });

    it('rejects characters outside the hexadecimal system', (): void => {
      expect(isValidGuess('G2F0', 4, 16)).toBe(false);
    });
  });

  describe('digit uniqueness', (): void => {
    it('rejects repeated decimal digits', (): void => {
      expect(isValidGuess('1123', 4, 10)).toBe(false);
    });

    it('rejects hexadecimal digits repeated in different cases', (): void => {
      expect(isValidGuess('aA20', 4, 16)).toBe(false);
    });
  });

  describe('case sensitivity', (): void => {
    it.each<[string, string]>([
      ['lowercase', 'a2f0'],
      ['uppercase', 'A2F0'],
      ['mixed case', 'a2F0'],
    ])(
      'accepts %s hexadecimal digits',
      (_caseName: string, guess: string): void => {
        expect(isValidGuess(guess, 4, 16)).toBe(true);
      },
    );
  });
});
