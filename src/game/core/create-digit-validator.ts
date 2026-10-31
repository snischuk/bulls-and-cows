export type DigitValidator = (character: string) => boolean;

type DigitValidatorFactory = (base: number) => DigitValidator;

export const createDigitValidator: DigitValidatorFactory = (
  base: number,
): DigitValidator => {
  const validDigits: string[] = Array.from(
    { length: base },
    (_digit: unknown, index: number): string => index.toString(base),
  );

  return (char: string): boolean => {
    const normalizedChar: string = char.toLowerCase();

    const isSingleCharacter: boolean = char.length === 1;

    const isValidDigit: boolean = validDigits.includes(normalizedChar);

    return isSingleCharacter && isValidDigit;
  };
};
