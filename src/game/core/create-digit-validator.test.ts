import { describe, expect, it } from 'vitest';

import { createDigitValidator } from './create-digit-validator';

describe('createDigitValidator', (): void => {
  it.each([2, 8, 10, 16])(
    'returns a function for base %i',
    (base: number): void => {
      expect(createDigitValidator(base)).toBeTypeOf('function');
    },
  );

  it('accepts binary digits', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(2);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('1')).toBe(true);
  });

  it('rejects digits outside the binary system', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(2);

    expect(isValidDigit('2')).toBe(false);
    expect(isValidDigit('9')).toBe(false);
  });

  it('accepts octal digits', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(8);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('7')).toBe(true);
  });

  it('rejects digits outside the octal system', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(8);

    expect(isValidDigit('8')).toBe(false);
    expect(isValidDigit('9')).toBe(false);
  });

  it('accepts decimal digits', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(10);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('9')).toBe(true);
  });

  it('rejects letters in the decimal system', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(10);

    expect(isValidDigit('a')).toBe(false);
  });

  it('accepts hexadecimal digits', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(16);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('9')).toBe(true);
    expect(isValidDigit('a')).toBe(true);
    expect(isValidDigit('f')).toBe(true);
  });

  it('accepts uppercase hexadecimal letters', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(16);

    expect(isValidDigit('A')).toBe(true);
    expect(isValidDigit('F')).toBe(true);
  });

  it('rejects characters outside the hexadecimal system', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(16);

    expect(isValidDigit('g')).toBe(false);
    expect(isValidDigit('z')).toBe(false);
  });

  it('rejects an empty string', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(16);

    expect(isValidDigit('')).toBe(false);
  });

  it('rejects whitespace characters', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(16);

    expect(isValidDigit(' ')).toBe(false);
    expect(isValidDigit('\n')).toBe(false);
    expect(isValidDigit('\t')).toBe(false);
  });

  it('rejects strings containing multiple characters', (): void => {
    const isValidDigit: (character: string) => boolean =
      createDigitValidator(16);

    expect(isValidDigit('10')).toBe(false);
    expect(isValidDigit('1a')).toBe(false);
  });
});
