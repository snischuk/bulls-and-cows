import { GAME_CONFIG, NUMBER_BASE_LABELS } from '@/game/game.config';
import type { LeaderboardEntry } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import { DEFAULT_LANGUAGE } from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import { createListItem } from '@/view/ui/ui-kit/list-item/list-item';
import { createList } from '@/view/ui/ui-kit/list/list';
import { formatElapsedTime } from '@/view/utils/format-elapsed-time';

import './leaderboard.css';

interface LeaderboardOptions extends Readonly<Partial<HTMLElement>> {
  readonly language?: Language;
}

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
  const { language = DEFAULT_LANGUAGE, ...properties } = options;

  const t: Translate = createTranslator(language);

  const element: HTMLElement = document.createElement('section');
  Object.assign(element, { className: 'leaderboard game-card' }, properties);

  const title: HTMLHeadingElement = document.createElement('h2');
  title.id = 'leaderboard-title';
  title.textContent = t('leaderboardTitle', {
    limit: GAME_CONFIG.leaderboardLimit,
  });

  element.setAttribute('aria-labelledby', title.id);

  const description: HTMLParagraphElement = document.createElement('p');
  description.className = 'settings-description';
  description.textContent = t('rankingDescription');

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

        const item: HTMLLIElement = createListItem({
          className: 'leaderboard-item',
        });

        const settings: HTMLSpanElement = document.createElement('span');
        settings.className = 'record-settings';
        settings.textContent = t('recordSettings', {
          base: NUMBER_BASE_LABELS[gameSettings.numberBase],
          length: gameSettings.secretLength,
        });

        const result: HTMLSpanElement = document.createElement('span');
        result.className = 'record-result';
        result.textContent = t('recordResult', {
          attempts: attemptsCount,
          time: formatElapsedTime(elapsedTime, language),
        });

        item.append(settings, result);

        return item;
      }),
    );
    list.hidden = entries.length === 0;

    status.textContent =
      message || (entries.length === 0 ? t('emptyLeaderboard') : '');
    status.hidden = status.textContent === '';
  };
  render([]);

  return { element, render };
};
