import {
  GAME_STATUS,
  GUESS_REJECTION_REASON,
  GUESS_SUBMISSION_STATUS,
} from '../game/game.config';
import type {
  GameResult,
  GameSettings,
  GameState,
  GuessRejectionReason,
  LeaderboardEntry,
  MakeGuessResult,
} from '../game/game.type';
import { updateLeaderboard } from '../game/leaderboard/update-leaderboard';
import { finishGame } from '../game/lifecycle/finish-game';
import { makeGuess } from '../game/lifecycle/make-guess';
import { startGame } from '../game/lifecycle/start-game';

import { createGamePage } from './pages/game.page';
import { createSettingsPage } from './pages/settings.page';
import { leaderboardService } from './service/leaderboard-storage.service';
import { createLeaderboard } from './ui/elements/leaderboard';
import { formatElapsedTime } from './utils/format-elapsed-time';
import { randomSource } from './utils/random-source';

type ShowSettings = (settings?: GameSettings) => void;
type PlayGame = (settings: GameSettings) => void;

type InitApp = (root: HTMLElement) => void;

export const initApp: InitApp = (root: HTMLElement): void => {
  const { element: leaderboardElement, render: renderLeaderboard } =
    createLeaderboard();
  let entries: LeaderboardEntry[] = [];
  let storageMessage: string = '';
  try {
    entries = leaderboardService.load();
  } catch {
    storageMessage =
      'Не удалось загрузить рекорды. Можно продолжить игру; новые результаты попробуем сохранить после победы.';
  }
  renderLeaderboard(entries, storageMessage);
  root.classList.add('app');
  const showSettings: ShowSettings = (settings?: GameSettings): void => {
    const { element, form, readSettings, focus } = createSettingsPage(settings);
    form.addEventListener('submit', (event: SubmitEvent): void => {
      event.preventDefault();
      playGame(readSettings());
    });
    root.replaceChildren(element, leaderboardElement);
    focus();
  };

  const playGame: PlayGame = (settings: GameSettings): void => {
    const {
      element,
      guessForm,
      guessInput,
      statusMessage,
      newGameButton,
      renderAttempts,
    } = createGamePage(settings);
    root.replaceChildren(element, leaderboardElement);

    let gameState: GameState = startGame(settings, randomSource, Date.now());

    guessForm.addEventListener('submit', (event: SubmitEvent): void => {
      event.preventDefault();

      const result: MakeGuessResult = makeGuess(gameState, guessInput.value);

      if (result.status === GUESS_SUBMISSION_STATUS.REJECTED) {
        const rejectionMessages: Record<GuessRejectionReason, string> = {
          [GUESS_REJECTION_REASON.INVALID]:
            'Попытка должна содержать допустимые неповторяющиеся цифры.',
          [GUESS_REJECTION_REASON.DUPLICATE]: 'Вы уже вводили эту попытку.',
          [GUESS_REJECTION_REASON.FINISHED]:
            'Игра уже завершена. Начните новую игру.',
        };

        statusMessage.textContent = rejectionMessages[result.reason];

        return;
      }

      gameState = result.gameState;
      renderAttempts(gameState.attemptsHistory);
      guessInput.value = '';

      if (gameState.gameStatus === GAME_STATUS.WON) {
        const gameResult: GameResult = finishGame(gameState, Date.now());
        const elapsedSeconds: string = formatElapsedTime(
          gameResult.elapsedTime,
        );

        statusMessage.textContent = `Победа! Секрет: ${gameState.secretSequence}. Попыток: ${gameResult.attemptsCount}, время: ${elapsedSeconds} с.`;
        const entry: LeaderboardEntry = { id: crypto.randomUUID(), gameResult };
        entries = updateLeaderboard(entries, entry);
        try {
          leaderboardService.save(entries);
          storageMessage = '';
        } catch {
          storageMessage =
            'Результат добавлен в таблицу, но сохранить его не удалось. После перезагрузки он может пропасть.';
        }
        renderLeaderboard(entries, storageMessage);
        guessForm.hidden = true;
        newGameButton.hidden = false;

        return;
      }

      statusMessage.textContent = 'Не угадали. Попробуйте ещё раз.';
    });

    newGameButton.addEventListener('click', (): void => {
      showSettings(settings);
    });
    guessInput.focus();
  };

  showSettings();
};
