import { describe, expect, it } from 'vitest';

import type { Translate } from './translator';
import { createTranslator } from './translator';

describe('translations', (): void => {
  it('announces distinct attempts with their deduction feedback', (): void => {
    const t: Translate = createTranslator('en');
    expect(
      t('guessFeedback', { attempt: 2, guess: '0123', bulls: 1, cows: 2 }),
    ).toBe('Guess 2: 0123. Bulls: 1, cows: 2.');
    expect(t('guessLengthError', { length: 4 })).toBe(
      'Enter exactly 4 digits.',
    );
    expect(createTranslator('ru')('guessUniqueError')).toBe(
      'Цифры не должны повторяться.',
    );
  });
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
