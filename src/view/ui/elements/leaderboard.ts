import { GAME_CONFIG, NUMBER_BASE_LABELS } from '../../../game/game.config';
import type { LeaderboardEntry } from '../../../game/game.type';
import { formatElapsedTime } from '../../utils/format-elapsed-time';
import { createList } from '../ui-kit/list';
import { createListItem } from '../ui-kit/list-item';

type LeaderboardOptions = Readonly<Partial<HTMLElement>>;
type RenderLeaderboard = (
  entries: readonly LeaderboardEntry[],
  message?: string,
) => void;
interface Leaderboard {
  readonly element: HTMLElement;
  readonly render: RenderLeaderboard;
}
type CreateLeaderboard = (options?: LeaderboardOptions) => Leaderboard;

export const createLeaderboard: CreateLeaderboard = (
  options: LeaderboardOptions = {},
): Leaderboard => {
  const element: HTMLElement = document.createElement('section');
  Object.assign(element, { className: 'leaderboard game-card' }, options);
  const title: HTMLHeadingElement = document.createElement('h2');
  title.id = 'leaderboard-title';
  title.textContent = `Топ-${GAME_CONFIG.leaderboardLimit}`;
  element.setAttribute('aria-labelledby', title.id);
  const description: HTMLParagraphElement = document.createElement('p');
  description.className = 'settings-description';
  description.textContent =
    'Меньше попыток — выше место. При равенстве выигрывает меньшее время.';
  const list: HTMLOListElement = createList({ className: 'leaderboard-list' });
  const status: HTMLParagraphElement = document.createElement('p');
  status.className = 'settings-hint';
  status.setAttribute('role', 'status');
  element.append(title, description, list, status);
  const render: RenderLeaderboard = (
    entries: readonly LeaderboardEntry[],
    message: string = '',
  ): void => {
    list.replaceChildren(
      ...entries.map((entry: LeaderboardEntry): HTMLLIElement => {
        const { gameSettings, attemptsCount, elapsedTime } = entry.gameResult;
        return createListItem({
          className: 'leaderboard-item',
          text: `${NUMBER_BASE_LABELS[gameSettings.numberBase]} · ${gameSettings.secretLength} цифр — попыток: ${attemptsCount}, время: ${formatElapsedTime(elapsedTime)} с`,
        });
      }),
    );
    list.hidden = entries.length === 0;
    status.textContent =
      message ||
      (entries.length === 0
        ? 'Рекордов пока нет. Выиграйте первый раунд!'
        : '');
    status.hidden = status.textContent === '';
  };
  render([]);
  return { element, render };
};
