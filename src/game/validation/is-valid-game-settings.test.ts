import { describe, expect, it } from 'vitest';

import { isValidGameSettings } from './is-valid-game-settings';

describe('isValidGameSettings', (): void => {
  it.each([
    { numberBase: 2, secretLength: 2 },
    { numberBase: 8, secretLength: 6 },
    { numberBase: 10, secretLength: 4 },
    { numberBase: 16, secretLength: 6 },
  ])('accepts supported settings %#', (settings: unknown): void => {
    expect(isValidGameSettings(settings)).toBe(true);
  });

  it.each([
    { settings: null },
    { settings: undefined },
    { settings: {} },
    { settings: { numberBase: 3, secretLength: 2 } },
    { settings: { numberBase: '16', secretLength: 4 } },
    { settings: { numberBase: 2, secretLength: 3 } },
    { settings: { numberBase: 10, secretLength: 1 } },
    { settings: { numberBase: 10, secretLength: 7 } },
    { settings: { numberBase: 10, secretLength: 2.5 } },
    { settings: { numberBase: 10, secretLength: NaN } },
  ])(
    'rejects invalid settings %#',
    ({ settings }: { settings: unknown }): void => {
      expect(isValidGameSettings(settings)).toBe(false);
    },
  );
});
