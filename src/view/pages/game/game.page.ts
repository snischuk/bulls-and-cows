import { NUMBER_BASE_LABELS } from '@/game/game.config';
import type { GameSettings, GuessAttempt } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import {
  DEFAULT_LANGUAGE,
  STATUS_REGION,
} from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import '@/view/styles/page.css';
import { createAttemptsHistory } from '@/view/ui/elements/attempts-history/attempts-history';
import { createGuessForm } from '@/view/ui/elements/guess-form/guess-form';
import { createButton } from '@/view/ui/ui-kit/button/button';

import './game.page.css';

interface GamePageOptions extends Readonly<Partial<HTMLElement>> {
  readonly language?: Language;
}

type RenderAttempts = (attemptsHistory: readonly GuessAttempt[]) => void;

interface GamePage {
  readonly element: HTMLElement;
  readonly guessForm: HTMLFormElement;
  readonly guessInput: HTMLInputElement;
  readonly statusMessage: HTMLParagraphElement;
  readonly newGameButton: HTMLButtonElement;
  readonly renderAttempts: RenderAttempts;
}

type CreateGamePage = (
  settings: GameSettings,
  options?: GamePageOptions,
) => GamePage;

export const createGamePage: CreateGamePage = (
  settings: GameSettings,
  options: GamePageOptions = {},
): GamePage => {
  const { language = DEFAULT_LANGUAGE, ...properties } = options;

  const t: Translate = createTranslator(language);

  const element: HTMLElement = document.createElement('section');
  Object.assign(element, { className: 'game' }, properties);

  const card: HTMLDivElement = document.createElement('div');
  card.className = 'game-card';

  const title: HTMLHeadingElement = document.createElement('h1');
  title.id = 'game-title';
  title.textContent = t('roundTitle');

  element.setAttribute('aria-labelledby', title.id);

  const description: HTMLParagraphElement = document.createElement('p');
  description.className = 'settings-description';
  description.textContent = t('guessDescription', {
    length: settings.secretLength,
    base: NUMBER_BASE_LABELS[settings.numberBase],
  });

  const statusMessage: HTMLParagraphElement = document.createElement('p');
  statusMessage.className = 'status-message';
  statusMessage.id = 'guess-status';
  statusMessage.dataset.statusRegion = STATUS_REGION.ROUND;
  statusMessage.textContent = t('enterGuess');

  const { element: guessForm, input: guessInput } = createGuessForm(settings, {
    language,
  });

  const attemptsTitle: HTMLHeadingElement = document.createElement('h2');
  attemptsTitle.textContent = t('history');

  const { element: attemptsList, render: renderAttempts } =
    createAttemptsHistory({ language });

  const newGameButton: HTMLButtonElement = createButton({
    text: t('newGame'),
    className: 'secondary-button',
    hidden: true,
  });

  const guidance: HTMLDivElement = document.createElement('div');
  guidance.className = 'round-guidance';
  guidance.id = 'guess-guidance';

  const alphabet: HTMLParagraphElement = document.createElement('p');
  alphabet.className = 'round-alphabet';
  alphabet.textContent = `${t('availableDigits')}: ${Array.from(
    { length: settings.numberBase },
    (_: unknown, index: number): string =>
      index.toString(settings.numberBase).toUpperCase(),
  ).join(' ')}`;

  const rules: HTMLParagraphElement = document.createElement('p');
  rules.className = 'settings-hint';
  rules.textContent = t('roundRules');
  guidance.append(alphabet, rules);

  guessInput.setAttribute(
    'aria-describedby',
    'guess-guidance guess-status guess-filter-notice',
  );

  card.append(
    title,
    description,
    guidance,
    statusMessage,
    guessForm,
    attemptsTitle,
    attemptsList,
    newGameButton,
  );

  element.append(card);

  return {
    element,
    guessForm,
    guessInput,
    statusMessage,
    newGameButton,
    renderAttempts,
  };
};
