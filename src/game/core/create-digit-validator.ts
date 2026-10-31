type DigitValidator = (character: string) => boolean;
type DigitValidatorFactory = (base: number) => DigitValidator;

export const createDigitValidator: DigitValidatorFactory = (
  base: number,
): DigitValidator => {
  void base;

  throw new Error('Not implemented');
};
