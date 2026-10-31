type IsValidGuess = (guess: string, length: number, base: number) => boolean;

export const isValidGuess: IsValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  void guess;
  void length;
  void base;

  throw new Error('Not implemented');
};
