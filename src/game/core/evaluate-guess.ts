import type { GuessFeedback } from '@/game/game.type';

type EvaluateGuess = (secret: string, guess: string) => GuessFeedback;

export const evaluateGuess: EvaluateGuess = (
  secret: string,
  guess: string,
): GuessFeedback => {
  const secretDigits: string[] = [...secret.toLowerCase()];

  const guessDigits: string[] = [...guess.toLowerCase()];

  const secretDigitSet: Set<string> = new Set(secretDigits);

  const bullsCount: number = guessDigits.filter(
    (digit: string, digitIndex: number): boolean =>
      digit === secretDigits[digitIndex],
  ).length;

  const matchingDigitsCount: number = guessDigits.filter(
    (digit: string): boolean => secretDigitSet.has(digit),
  ).length;

  const cowsCount: number = matchingDigitsCount - bullsCount;

  return {
    bullsCount,
    cowsCount,
  };
};
