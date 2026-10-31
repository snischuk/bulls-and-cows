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
  void length;
  void base;
  void random;

  throw new Error('Not implemented');
};
