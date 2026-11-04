import { describe, expect, it } from 'vitest';

import type { Translate } from './translator';
import { createTranslator } from './translator';

describe('translations', (): void => {
  it('keeps translators independent', (): void => {
    const english: Translate = createTranslator('en');

    const russian: Translate = createTranslator('ru');

    expect(english('startGame')).toBe('Start game');
    expect(russian('startGame')).toBe('Начать игру');
    expect(english('startGame')).toBe('Start game');
  });

  it('formats dynamic messages in both languages', (): void => {
    expect(
      createTranslator('en')('victory', {
        secret: '01',
        attempts: 2,
        time: '1.50',
      }),
    ).toBe('You won! Secret: 01. Guesses: 2, time: 1.50 s.');
    expect(
      createTranslator('ru')('victory', {
        secret: '01',
        attempts: 2,
        time: '1,50',
      }),
    ).toBe('Победа! Секрет: 01. Попыток: 2, время: 1,50 с.');
  });

  it('preserves zero values during interpolation', (): void => {
    expect(
      createTranslator('ru')('attempt', { guess: '10', bulls: 0, cows: 2 }),
    ).toBe('10 — быки: 0, коровы: 2');
  });
});
