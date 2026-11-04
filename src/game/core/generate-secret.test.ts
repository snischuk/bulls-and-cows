import { describe, expect, it, vi } from 'vitest';

import { createDigitValidator } from './create-digit-validator';
import { generateSecret } from './generate-secret';

type RandomSource = () => number;

type CreateDeterministicRandom = () => RandomSource;

const createDeterministicRandom: CreateDeterministicRandom = () => {
  const randomValues: number[] = [
    0.01, 0.07, 0.13, 0.19, 0.25, 0.31, 0.37, 0.43, 0.49, 0.55, 0.61, 0.67,
    0.73, 0.79, 0.85, 0.91, 0.97,
  ];

  let randomValueIndex: number = 0;

  return (): number => {
    const randomValue: number =
      randomValues[randomValueIndex % randomValues.length] ?? 0;

    randomValueIndex += 1;

    return randomValue;
  };
};

const supportedBaseCases: Array<[number, number]> = [
  [2, 2],
  [8, 4],
  [10, 4],
  [16, 6],
];

describe('generateSecret', (): void => {
  describe('secret length', (): void => {
    it.each(supportedBaseCases)(
      'generates a base-%i secret of length %i',
      (base: number, length: number): void => {
        const secret: string = generateSecret(
          length,
          base,
          createDeterministicRandom(),
        );

        expect(secret).toHaveLength(length);
      },
    );
  });

  describe('digit uniqueness', (): void => {
    it.each(supportedBaseCases)(
      'generates unique digits for base %i',
      (base: number, length: number): void => {
        const secret: string = generateSecret(
          length,
          base,
          createDeterministicRandom(),
        );

        expect(new Set(secret).size).toBe(length);
      },
    );
  });

  describe('digit validity', (): void => {
    it.each(supportedBaseCases)(
      'generates only digits valid in base %i',
      (base: number, length: number): void => {
        const secret: string = generateSecret(
          length,
          base,
          createDeterministicRandom(),
        );

        const isDigitValid: (character: string) => boolean =
          createDigitValidator(base);

        const secretDigits: string[] = [...secret];

        expect(secretDigits.every(isDigitValid)).toBe(true);
      },
    );

    it('can generate the complete hexadecimal digit set', (): void => {
      const secret: string = generateSecret(
        16,
        16,
        createDeterministicRandom(),
      );

      expect(secret).toHaveLength(16);
      expect(new Set(secret)).toEqual(new Set('0123456789abcdef'));
    });
  });

  describe('random source', (): void => {
    it('uses the provided random source', (): void => {
      const random: RandomSource = vi.fn(createDeterministicRandom());

      generateSecret(4, 10, random);

      expect(random).toHaveBeenCalled();
    });

    it('produces reproducible results with the same random sequence', (): void => {
      const firstSecret: string = generateSecret(
        4,
        10,
        createDeterministicRandom(),
      );

      const secondSecret: string = generateSecret(
        4,
        10,
        createDeterministicRandom(),
      );

      expect(secondSecret).toBe(firstSecret);
    });
  });

  describe('input validation', (): void => {
    it.each<number>([0, -1, 1.5, 17])(
      'throws RangeError for invalid length: %i',
      (length: number): void => {
        expect(() => generateSecret(length, 16)).toThrow(RangeError);
      },
    );

    it.each<number>([1, 3, 4, 12, 17, 2.5, Number.NaN])(
      'throws RangeError for unsupported base: %i',
      (base: number): void => {
        expect(() => generateSecret(1, base)).toThrow(RangeError);
      },
    );

    it('throws RangeError when the length exceeds the base', (): void => {
      expect(() => generateSecret(11, 10)).toThrow(RangeError);
    });
  });
});
