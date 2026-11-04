import { startGame } from '../../game/lifecycle/start-game';
import type { AppPage, PageAction } from '../pages/page.type';
import { createSettingsPage } from '../pages/settings.page';
import type { AppState } from '../state/app-state';
import { randomSource } from '../utils/random-source';

type CreateSettingsController = (
  state: AppState,
  renderApp: PageAction,
) => AppPage;

type SubmitHandler = (event: SubmitEvent) => void;

export const createSettingsController: CreateSettingsController = (
  state: AppState,
  renderApp: PageAction,
): AppPage => {
  const page: ReturnType<typeof createSettingsPage> = createSettingsPage(
    state.settings,
    { language: state.language },
  );

  const preserve: PageAction = (): void => {
    state.settings = page.readSettings();
  };

  const handleStartGame: SubmitHandler = (event: SubmitEvent): void => {
    event.preventDefault();

    state.settings = page.readSettings();
    state.gameState = startGame(state.settings, randomSource, Date.now());
    state.gameResult = null;
    state.guessDraft = '';
    state.notice = 'enterGuess';

    renderApp();
  };

  page.form.addEventListener('submit', handleStartGame);

  return { element: page.element, preserve, focus: page.focus };
};
