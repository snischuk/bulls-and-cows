import {
  GAME_STATUS,
  GUESS_REJECTION_REASON,
  GUESS_SUBMISSION_STATUS,
} from '@/game/game.config';
import type { GuessRejectionReason, MakeGuessResult } from '@/game/game.type';
import { updateLeaderboard } from '@/game/leaderboard/update-leaderboard';
import { finishGame } from '@/game/lifecycle/finish-game';
import { makeGuess } from '@/game/lifecycle/make-guess';
import type { MessageKey, Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import { createGamePage } from '@/view/pages/game/game.page';
import type { AppPage, PageAction } from '@/view/pages/page.type';
import { leaderboardService } from '@/view/service/leaderboard-storage.service';
import type { AppState } from '@/view/state/app-state';
import { resetRound } from '@/view/state/reset-round';
import { formatElapsedTime } from '@/view/utils/format-elapsed-time';

type CreateGameController = (state: AppState, renderApp: PageAction) => AppPage;

type SubmitHandler = (event: SubmitEvent) => void;

const REJECTION_KEYS: Readonly<Record<GuessRejectionReason, MessageKey>> = {
  [GUESS_REJECTION_REASON.INVALID]: 'invalidGuess',
  [GUESS_REJECTION_REASON.DUPLICATE]: 'duplicateGuess',
  [GUESS_REJECTION_REASON.FINISHED]: 'finishedGame',
};

export const createGameController: CreateGameController = (
  state: AppState,
  renderApp: PageAction,
): AppPage => {
  if (state.gameState === null)
    throw new Error('Cannot display a round before it starts');

  const t: Translate = createTranslator(state.language);

  const page: ReturnType<typeof createGamePage> = createGamePage(
    state.gameState.gameSettings,
    { language: state.language },
  );
  page.renderAttempts(state.gameState.attemptsHistory);
  page.guessInput.value = state.guessDraft;
  page.statusMessage.textContent =
    state.gameResult === null
      ? t(state.notice)
      : t('victory', {
          secret: state.gameState.secretSequence,
          attempts: state.gameResult.attemptsCount,
          time: formatElapsedTime(state.gameResult.elapsedTime, state.language),
        });
  page.guessForm.hidden = state.gameState.gameStatus === GAME_STATUS.WON;
  page.newGameButton.hidden = state.gameState.gameStatus !== GAME_STATUS.WON;

  const preserve: PageAction = (): void => {
    state.guessDraft = page.guessInput.value;
  };

  const handleGuessSubmit: SubmitHandler = (event: SubmitEvent): void => {
    event.preventDefault();

    if (state.gameState === null) return;

    const result: MakeGuessResult = makeGuess(
      state.gameState,
      page.guessInput.value,
    );

    if (result.status === GUESS_SUBMISSION_STATUS.REJECTED) {
      state.notice = REJECTION_KEYS[result.reason];
      page.statusMessage.textContent = t(state.notice);
      return;
    }

    state.gameState = result.gameState;
    state.guessDraft = '';
    state.notice = 'tryAgain';

    if (state.gameState.gameStatus === GAME_STATUS.WON) {
      state.gameResult = finishGame(state.gameState, Date.now());
      state.entries = updateLeaderboard(state.entries, {
        id: crypto.randomUUID(),
        gameResult: state.gameResult,
      });

      try {
        leaderboardService.save(state.entries);
        state.storageMessage = undefined;
      } catch {
        state.storageMessage = 'saveError';
      }
    }

    renderApp();
  };

  const handleNewGame: PageAction = (): void => {
    resetRound(state);

    renderApp();
  };

  const focus: PageAction = (): void => {
    if (page.guessForm.hidden) page.newGameButton.focus();
    else page.guessInput.focus();
  };

  page.guessForm.addEventListener('submit', handleGuessSubmit);
  page.newGameButton.addEventListener('click', handleNewGame);

  return { element: page.element, preserve, focus };
};
