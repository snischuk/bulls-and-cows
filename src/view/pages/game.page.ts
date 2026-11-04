import { NUMBER_BASE_LABELS } from '../../game/game.config';
import type { GameSettings, GuessAttempt } from '../../game/game.type';
import { DEFAULT_LANGUAGE, type Language } from '../config/interface.config';
import { type Translate, createTranslator } from '../i18n/translator';
import { createAttemptsHistory } from '../ui/elements/attempts-history';
import { createGuessForm } from '../ui/elements/guess-form';
import { createButton } from '../ui/ui-kit/button';

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

  const element: HTMLElement = document.createElement('main');
  Object.assign(element, { className: 'game' }, properties);

  const card: HTMLElement = document.createElement('section');
  card.className = 'game-card';

  const title: HTMLHeadingElement = document.createElement('h1');
  title.textContent = t('title');

  const description: HTMLParagraphElement = document.createElement('p');
  description.className = 'settings-description';
  description.textContent = t('guessDescription', {
    length: settings.secretLength,
    base: NUMBER_BASE_LABELS[settings.numberBase],
  });

  const statusMessage: HTMLParagraphElement = document.createElement('p');
  statusMessage.className = 'status-message';
  statusMessage.setAttribute('role', 'status');
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

  card.append(
    title,
    description,
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
