import type { GuessAttempt } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import { DEFAULT_LANGUAGE } from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import { createList } from '@/view/ui/ui-kit/list';
import { createListItem } from '@/view/ui/ui-kit/list-item';

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
      (attempt: GuessAttempt): HTMLLIElement =>
        createListItem({
          className: 'attempt-item',
          text: t('attempt', {
            guess: attempt.guessSequence,
            bulls: attempt.bullsCount,
            cows: attempt.cowsCount,
          }),
        }),
    );

    element.replaceChildren(...attemptElements);
  };

  return { element, render };
};
