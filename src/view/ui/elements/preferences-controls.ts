import { type Language } from '../../config/interface.config';
import {
  LANGUAGE,
  LANGUAGE_LABELS,
  THEME,
  type Theme,
} from '../../config/interface.config';
import { type Translate, createTranslator } from '../../i18n/translator';
import { createOption } from '../ui-kit/option';
import { createSelect } from '../ui-kit/select';

interface Preferences {
  readonly language: Language;
  readonly theme: Theme;
}

type ControlsOptions = Readonly<Partial<HTMLElement>>;

interface PreferencesControls {
  readonly element: HTMLElement;
  readonly languageSelect: HTMLSelectElement;
  readonly themeSelect: HTMLSelectElement;
}

type CreatePreferencesControls = (
  preferences: Preferences,
  options?: ControlsOptions,
) => PreferencesControls;

export const createPreferencesControls: CreatePreferencesControls = (
  preferences: Preferences,
  options: ControlsOptions = {},
): PreferencesControls => {
  const t: Translate = createTranslator(preferences.language);

  const element: HTMLElement = document.createElement('header');
  Object.assign(element, { className: 'preferences-controls' }, options);

  const languageLabel: HTMLLabelElement = document.createElement('label');
  languageLabel.textContent = t('language');

  const languageSelect: HTMLSelectElement = createSelect({
    id: 'language-select',
  });
  languageSelect.append(
    createOption({
      value: LANGUAGE.ENGLISH,
      text: LANGUAGE_LABELS[LANGUAGE.ENGLISH],
    }),
    createOption({
      value: LANGUAGE.RUSSIAN,
      text: LANGUAGE_LABELS[LANGUAGE.RUSSIAN],
    }),
  );
  languageSelect.value = preferences.language;

  languageLabel.htmlFor = languageSelect.id;

  const themeLabel: HTMLLabelElement = document.createElement('label');
  themeLabel.textContent = t('theme');

  const themeSelect: HTMLSelectElement = createSelect({ id: 'theme-select' });
  themeSelect.append(
    createOption({ value: THEME.LIGHT, text: t('light') }),
    createOption({ value: THEME.DARK, text: t('dark') }),
  );
  themeSelect.value = preferences.theme;

  themeLabel.htmlFor = themeSelect.id;

  element.append(languageLabel, languageSelect, themeLabel, themeSelect);

  return { element, languageSelect, themeSelect };
};
