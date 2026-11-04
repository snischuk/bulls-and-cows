import type { GuessAttempt } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import { DEFAULT_LANGUAGE } from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import { createListItem } from '@/view/ui/ui-kit/list-item/list-item';
import { createList } from '@/view/ui/ui-kit/list/list';

import './attempts-history.css';

interface AttemptsHistoryOptions extends Readonly<Partial<HTMLOListElement>> {
  readonly language?: Language;
}

type RenderAttempts = (attemptsHistory: readonly GuessAttempt[]) => void;

interface AttemptsHistory {
  readonly element: HTMLOListElement;
  readonly render: RenderAttempts;
}

type CreateAttemptsHistory = (
  options?: AttemptsHistoryOptions,
) => AttemptsHistory;

export const createAttemptsHistory: CreateAttemptsHistory = (
  options: AttemptsHistoryOptions = {},
): AttemptsHistory => {
  const { language = DEFAULT_LANGUAGE, ...properties } = options;

  const t: Translate = createTranslator(language);

  const element: HTMLOListElement = createList({
    className: 'attempts-list',
    ...properties,
  });

  const render: RenderAttempts = (
    attemptsHistory: readonly GuessAttempt[],
  ): void => {
    const attemptElements: HTMLLIElement[] = attemptsHistory.map(
      (attempt: GuessAttempt): HTMLLIElement => {
        const item: HTMLLIElement = createListItem({
          className: 'attempt-item',
        });
        item.setAttribute(
          'aria-label',
          t('attempt', {
            guess: attempt.guessSequence,
            bulls: attempt.bullsCount,
            cows: attempt.cowsCount,
          }),
        );

        const sequence: HTMLSpanElement = document.createElement('span');
        sequence.className = 'attempt-sequence';
        sequence.textContent = attempt.guessSequence;

        const feedback: HTMLSpanElement = document.createElement('span');
        feedback.className = 'attempt-feedback';

        const bulls: HTMLSpanElement = document.createElement('span');
        bulls.className = 'feedback-bulls';
        bulls.textContent = `${t('bullsLabel')}: ${attempt.bullsCount}`;

        const cows: HTMLSpanElement = document.createElement('span');
        cows.className = 'feedback-cows';
        cows.textContent = `${t('cowsLabel')}: ${attempt.cowsCount}`;

        feedback.append(bulls, cows);
        item.append(sequence, feedback);

        return item;
      },
    );

    element.replaceChildren(...attemptElements);
  };

  return { element, render };
};
