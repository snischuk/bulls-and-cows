import { createDigitValidator } from './create-digit-validator';

type IsValidGuess = (guess: string, length: number, base: number) => boolean;

export const isValidGuess: IsValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  if (guess.length !== length || length > base) return false;

  const digits: string[] = [...guess.toLowerCase()];

  const isValidDigit: (character: string) => boolean =
    createDigitValidator(base);

  const hasOnlyValidDigits: boolean = digits.every(isValidDigit);
  const hasUniqueDigits: boolean = new Set(digits).size === digits.length;

  return hasOnlyValidDigits && hasUniqueDigits;
};
