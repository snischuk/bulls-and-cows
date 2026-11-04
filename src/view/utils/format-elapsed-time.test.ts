import { describe, expect, it } from 'vitest';

import { formatElapsedTime } from './format-elapsed-time';

describe('formatElapsedTime', (): void => {
  it('uses the selected language for decimal separators', (): void => {
    expect(formatElapsedTime(1500, 'en')).toBe('1.50');
    expect(formatElapsedTime(1500, 'ru')).toBe('1,50');
  });

  it('formats a zero duration and rounds to two decimal places', (): void => {
    expect(formatElapsedTime(0)).toBe('0.00');
    expect(formatElapsedTime(1234)).toBe('1.23');
  });
});
