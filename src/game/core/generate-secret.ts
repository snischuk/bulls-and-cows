import { GAME_CONFIG } from '@/game/game.config';

const DIGIT_ALPHABET: string = '0123456789abcdef';

type GenerateSecret = (
  length: number,
  base: number,
  random?: () => number,
) => string;

export const generateSecret: GenerateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (
    !GAME_CONFIG.supportedBases.some(
      (supportedBase: number): boolean => supportedBase === base,
    )
  ) {
    throw new RangeError('base must be one of 2, 8, 10, or 16');
  }

  if (!Number.isInteger(length) || length < 1) {
    throw new RangeError('length must be a positive integer');
  }

  if (length > base) {
    throw new RangeError('length cannot exceed base');
  }

  const availableDigits: string[] = DIGIT_ALPHABET.slice(0, base).split('');

  for (let digitIndex: number = 0; digitIndex < length; digitIndex += 1) {
    const randomIndex: number =
      digitIndex + Math.floor(random() * (base - digitIndex));

    const currentDigit: string = availableDigits[digitIndex];

    const randomDigit: string = availableDigits[randomIndex];

    availableDigits[digitIndex] = randomDigit;
    availableDigits[randomIndex] = currentDigit;
  }

  return availableDigits.slice(0, length).join('');
};
