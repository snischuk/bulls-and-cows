import { createGameController } from '@/view/controllers/game.controller';
import { createPreferencesController } from '@/view/controllers/preferences.controller';
import { createSettingsController } from '@/view/controllers/settings.controller';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import type { AppPage, PageAction } from '@/view/pages/page.type';
import type { AppState } from '@/view/state/app-state';
import { createAppState } from '@/view/state/app-state';
import { createLeaderboard } from '@/view/ui/elements/leaderboard/leaderboard';
import { createLiveStatus } from '@/view/ui/elements/live-status/live-status';
import { createPageAnimator } from '@/view/utils/animate-page';

type InitApp = (root: HTMLElement) => void;

export const initApp: InitApp = (root: HTMLElement): void => {
  const state: AppState = createAppState();

  const animatePage: ReturnType<typeof createPageAnimator> =
    createPageAnimator();

  root.classList.add('app');

  const content: HTMLDivElement = document.createElement('div');
  content.className = 'app-content';

  const liveStatus: HTMLDivElement = createLiveStatus(content);
  root.replaceChildren(content, liveStatus);

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

    const main: HTMLElement = document.createElement('main');
    main.className = 'app-main';
    main.append(page.element, leaderboard.element);

    content.replaceChildren(controls, main);

    animatePage(page.element, state.gameState);

    page.focus();
  };

  renderApp();
};
