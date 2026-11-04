import type { GuessAttempt } from '../../../game/game.type';
import { createList } from '../ui-kit/list';
import { createListItem } from '../ui-kit/list-item';

type AttemptsHistoryOptions = Readonly<Partial<HTMLOListElement>>;

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
  const element: HTMLOListElement = createList({
    className: 'attempts-list',
    ...options,
  });

  const render: RenderAttempts = (
    attemptsHistory: readonly GuessAttempt[],
  ): void => {
    const attemptElements: HTMLLIElement[] = attemptsHistory.map(
      (attempt: GuessAttempt): HTMLLIElement =>
        createListItem({
          className: 'attempt-item',
          text: `${attempt.guessSequence} — ${attempt.bullsCount} быков, ${attempt.cowsCount} коров`,
        }),
    );
    element.replaceChildren(...attemptElements);
  };
  return { element, render };
};
