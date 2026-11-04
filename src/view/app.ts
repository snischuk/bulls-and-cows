import { createGameController } from './controllers/game.controller';
import { createPreferencesController } from './controllers/preferences.controller';
import { createSettingsController } from './controllers/settings.controller';
import { type Translate, createTranslator } from './i18n/translator';
import type { AppPage, PageAction } from './pages/page.type';
import { type AppState, createAppState } from './state/app-state';
import { createLeaderboard } from './ui/elements/leaderboard';

type InitApp = (root: HTMLElement) => void;

export const initApp: InitApp = (root: HTMLElement): void => {
  const state: AppState = createAppState();

  root.classList.add('app');

  const renderApp: PageAction = (): void => {
    const t: Translate = createTranslator(state.language);

    document.documentElement.lang = state.language;
    document.documentElement.dataset.theme = state.theme;
    document.title = t('title');

    const page: AppPage =
      state.gameState === null
        ? createSettingsController(state, renderApp)
        : createGameController(state, renderApp);

    const controls: HTMLElement = createPreferencesController(
      state,
      page.preserve,
      renderApp,
    );

    const leaderboard: ReturnType<typeof createLeaderboard> = createLeaderboard(
      { language: state.language },
    );
    leaderboard.render(
      state.entries,
      state.storageMessage === undefined ? '' : t(state.storageMessage),
    );

    root.replaceChildren(controls, page.element, leaderboard.element);

    page.focus();
  };

  renderApp();
};
