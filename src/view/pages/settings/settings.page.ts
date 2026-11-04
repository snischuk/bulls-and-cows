import { countPossibleSecrets } from '@/game/core/count-possible-secrets';
import {
  GAME_CONFIG,
  NUMBER_BASE,
  NUMBER_BASE_LABELS,
} from '@/game/game.config';
import type { GameSettings, NumberBase } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import { DEFAULT_LANGUAGE } from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import '@/view/styles/page.css';
import { createButton } from '@/view/ui/ui-kit/button/button';
import { createOption } from '@/view/ui/ui-kit/option/option';
import { createSelect } from '@/view/ui/ui-kit/select/select';

import './settings.page.css';

interface SettingsPageOptions extends Readonly<Partial<HTMLElement>> {
  readonly language?: Language;
}

type ReadSettings = () => GameSettings;

type UpdateSettings = () => void;

interface SettingsPage {
  readonly element: HTMLElement;
  readonly form: HTMLFormElement;
  readonly readSettings: ReadSettings;
  readonly focus: () => void;
}

type CreateSettingsPage = (
  settings?: GameSettings,
  options?: SettingsPageOptions,
) => SettingsPage;

export const createSettingsPage: CreateSettingsPage = (
  settings: GameSettings | undefined = undefined,
  options: SettingsPageOptions = {},
): SettingsPage => {
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
  description.textContent = t('introduction');

  const form: HTMLFormElement = document.createElement('form');
  form.className = 'settings-form';

  const baseLabel: HTMLLabelElement = document.createElement('label');
  baseLabel.htmlFor = 'number-base';
  baseLabel.textContent = t('numberSystem');

  const baseSelect: HTMLSelectElement = createSelect({
    id: 'number-base',
    name: 'numberBase',
  });
  baseSelect.append(
    ...GAME_CONFIG.supportedBases.map((base: NumberBase): HTMLOptionElement =>
      createOption({
        value: String(base),
        text: `${NUMBER_BASE_LABELS[base]} — ${t('base')} ${base}`,
      }),
    ),
  );

  if (settings !== undefined) baseSelect.value = String(settings.numberBase);

  const lengthLabel: HTMLLabelElement = document.createElement('label');
  lengthLabel.htmlFor = 'secret-length';
  lengthLabel.textContent = t('secretLength');

  const lengthSelect: HTMLSelectElement = createSelect({
    id: 'secret-length',
    name: 'secretLength',
  });

  for (
    let length: number = GAME_CONFIG.minSecretLength;
    length <= GAME_CONFIG.maxSecretLength;
    length += 1
  ) {
    lengthSelect.append(
      createOption({ value: String(length), text: String(length) }),
    );
  }

  if (settings !== undefined)
    lengthSelect.value = String(settings.secretLength);

  const hint: HTMLParagraphElement = document.createElement('p');
  hint.className = 'settings-hint';
  hint.id = 'settings-hint';

  baseSelect.setAttribute('aria-describedby', hint.id);

  lengthSelect.setAttribute('aria-describedby', hint.id);

  const possibilities: HTMLParagraphElement = document.createElement('p');
  possibilities.className = 'status-message';
  possibilities.setAttribute('role', 'status');

  const startButton: HTMLButtonElement = createButton({
    type: 'submit',
    text: t('startGame'),
  });

  const readSettings: ReadSettings = (): GameSettings => {
    const numberBase: NumberBase | undefined = GAME_CONFIG.supportedBases.find(
      (base: NumberBase): boolean => String(base) === baseSelect.value,
    );

    if (numberBase === undefined)
      throw new RangeError('Unsupported number base');

    return { numberBase, secretLength: Number(lengthSelect.value) };
  };

  const updateSettings: UpdateSettings = (): void => {
    const base: number = Number(baseSelect.value);

    for (const option of Array.from(lengthSelect.options)) {
      option.disabled = Number(option.value) > base;
    }

    if (Number(lengthSelect.value) > base)
      lengthSelect.value = String(GAME_CONFIG.minSecretLength);

    const currentSettings: GameSettings = readSettings();

    hint.textContent =
      base === NUMBER_BASE.BINARY ? t('binaryHint') : t('digitsHint');

    const count: number = countPossibleSecrets(
      currentSettings.secretLength,
      currentSettings.numberBase,
    );

    possibilities.textContent = t('possibilities', {
      count: count.toLocaleString(language),
    });
  };

  baseSelect.addEventListener('change', updateSettings);

  lengthSelect.addEventListener('change', updateSettings);

  updateSettings();

  form.append(
    baseLabel,
    baseSelect,
    lengthLabel,
    lengthSelect,
    hint,
    possibilities,
    startButton,
  );

  card.append(title, description, form);

  element.append(card);

  return { element, form, readSettings, focus: (): void => baseSelect.focus() };
};
