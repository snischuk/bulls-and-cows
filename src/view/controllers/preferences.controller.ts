import { LANGUAGE, THEME } from '../config/interface.config';
import { type Translate, createTranslator } from '../i18n/translator';
import type { PageAction } from '../pages/page.type';
import { languageService } from '../service/language-storage.service';
import { themeService } from '../service/theme-storage.service';
import type { AppState } from '../state/app-state';
import { createPreferencesControls } from '../ui/elements/preferences-controls';

type CreatePreferencesController = (
  state: AppState,
  preserveView: PageAction,
  renderApp: PageAction,
) => HTMLElement;

type ChangeHandler = () => void;

export const createPreferencesController: CreatePreferencesController = (
  state: AppState,
  preserveView: PageAction,
  renderApp: PageAction,
): HTMLElement => {
  const t: Translate = createTranslator(state.language);

  const controls: ReturnType<typeof createPreferencesControls> =
    createPreferencesControls({ language: state.language, theme: state.theme });

  const status: HTMLParagraphElement = document.createElement('p');
  status.className = 'preferences-status settings-hint';
  status.setAttribute('role', 'status');
  status.hidden = !state.preferencesError;
  status.textContent = state.preferencesError ? t('preferencesError') : '';

  controls.element.append(status);

  const handleLanguageChange: ChangeHandler = (): void => {
    preserveView();

    state.language =
      controls.languageSelect.value === LANGUAGE.RUSSIAN
        ? LANGUAGE.RUSSIAN
        : LANGUAGE.ENGLISH;

    try {
      languageService.save(state.language);
      state.preferencesError = false;
    } catch {
      state.preferencesError = true;
    }

    renderApp();
    document.getElementById(controls.languageSelect.id)?.focus();
  };

  const handleThemeChange: ChangeHandler = (): void => {
    preserveView();

    state.theme =
      controls.themeSelect.value === THEME.DARK ? THEME.DARK : THEME.LIGHT;

    try {
      themeService.save(state.theme);
      state.preferencesError = false;
    } catch {
      state.preferencesError = true;
    }

    renderApp();
    document.getElementById(controls.themeSelect.id)?.focus();
  };

  controls.languageSelect.addEventListener('change', handleLanguageChange);
  controls.themeSelect.addEventListener('change', handleThemeChange);

  return controls.element;
};
