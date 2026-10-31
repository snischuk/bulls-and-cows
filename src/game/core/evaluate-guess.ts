type GuessResult = {
  bullsCount: number;
  cowsCount: number;
};

type EvaluateGuess = (secret: string, guess: string) => GuessResult;

export const evaluateGuess: EvaluateGuess = (
  secret: string,
  guess: string,
): GuessResult => {
  void secret;
  void guess;

  throw new Error('Not implemented');
};
