import type { Language } from '@/view/config/interface.config';
import type { Theme } from '@/view/config/interface.config';
import {
  LANGUAGE,
  LANGUAGE_LABELS,
  THEME,
} from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import { createOption } from '@/view/ui/ui-kit/option/option';
import { createSelect } from '@/view/ui/ui-kit/select/select';

import './preferences-controls.css';

const BRAND_PEG_COUNT: number = 4;

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

  const brand: HTMLDivElement = document.createElement('div');
  brand.className = 'game-brand';

  const mark: HTMLSpanElement = document.createElement('span');
  mark.className = 'game-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.append(
    ...Array.from({ length: BRAND_PEG_COUNT }, (): HTMLSpanElement =>
      document.createElement('span'),
    ),
  );

  const brandName: HTMLSpanElement = document.createElement('span');
  brandName.textContent = t('title');

  brand.append(mark, brandName);

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

  element.append(brand, languageLabel, languageSelect, themeLabel, themeSelect);

  return { element, languageSelect, themeSelect };
};
