import { GAME_CONFIG } from '../game.config';

import { createDigitValidator } from './create-digit-validator';

type IsValidGuess = (guess: string, length: number, base: number) => boolean;

export const isValidGuess: IsValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  if (
    !GAME_CONFIG.supportedBases.some(
      (supportedBase: number): boolean => supportedBase === base,
    )
  )
    return false;

  if (!Number.isInteger(length) || length < 1 || length > base) {
    return false;
  }

  if (guess.length !== length) return false;

  const digits: string[] = [...guess.toLowerCase()];

  const isValidDigit: (character: string) => boolean =
    createDigitValidator(base);

  const hasOnlyValidDigits: boolean = digits.every(isValidDigit);

  const hasUniqueDigits: boolean = new Set(digits).size === digits.length;

  return hasOnlyValidDigits && hasUniqueDigits;
};
