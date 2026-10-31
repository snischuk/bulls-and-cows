import { describe, expect, it } from 'vitest';

import { countPossibleSecrets } from './count-possible-secrets';

describe('countPossibleSecrets', (): void => {
  describe('base cases', (): void => {
    it('returns 1 when length is zero', (): void => {
      expect(countPossibleSecrets(0, 10)).toBe(1);
    });

    it('returns 0 when length exceeds base', (): void => {
      expect(countPossibleSecrets(11, 10)).toBe(0);
    });

    it('returns base when length is one', (): void => {
      expect(countPossibleSecrets(1, 10)).toBe(10);
    });
  });

  describe('permutation count', (): void => {
    it('counts permutations for decimal numbers of length two', (): void => {
      expect(countPossibleSecrets(2, 10)).toBe(90);
    });

    it('counts permutations for decimal numbers of length four', (): void => {
      expect(countPossibleSecrets(4, 10)).toBe(5040);
    });

    it('counts permutations for binary numbers', (): void => {
      expect(countPossibleSecrets(2, 2)).toBe(2);
    });

    it('counts permutations for hexadecimal numbers', (): void => {
      expect(countPossibleSecrets(4, 16)).toBe(43680);
    });

    it('counts all permutations when length equals base', (): void => {
      expect(countPossibleSecrets(4, 4)).toBe(24);
    });
  });
});
