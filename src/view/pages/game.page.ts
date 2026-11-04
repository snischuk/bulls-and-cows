import { NUMBER_BASE_LABELS } from '../../game/game.config';
import type { GameSettings, GuessAttempt } from '../../game/game.type';
import { createAttemptsHistory } from '../ui/elements/attempts-history';
import { createGuessForm } from '../ui/elements/guess-form';
import { createButton } from '../ui/ui-kit/button';

type GamePageOptions = Readonly<Partial<HTMLElement>>;
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
  const element: HTMLElement = document.createElement('main');
  Object.assign(element, { className: 'game' }, options);
  const card: HTMLElement = document.createElement('section');
  card.className = 'game-card';
  const title: HTMLHeadingElement = document.createElement('h1');
  title.textContent = 'Быки и коровы';
  const description: HTMLParagraphElement = document.createElement('p');
  description.className = 'settings-description';
  description.textContent = `Угадайте ${settings.secretLength} уникальные цифры в системе ${NUMBER_BASE_LABELS[settings.numberBase]}.`;
  const statusMessage: HTMLParagraphElement = document.createElement('p');
  statusMessage.className = 'status-message';
  statusMessage.setAttribute('role', 'status');
  statusMessage.textContent = 'Введите попытку и получите подсказку.';
  const { element: guessForm, input: guessInput } = createGuessForm(settings);
  const attemptsTitle: HTMLHeadingElement = document.createElement('h2');
  attemptsTitle.textContent = 'История попыток';
  const { element: attemptsList, render: renderAttempts } =
    createAttemptsHistory();
  const newGameButton: HTMLButtonElement = createButton({
    text: 'Новая игра',
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
