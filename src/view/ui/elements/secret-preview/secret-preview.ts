import type { GameSettings } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import { DEFAULT_LANGUAGE } from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';

import './secret-preview.css';

interface SecretPreviewOptions extends Readonly<Partial<HTMLElement>> {
  readonly language?: Language;
}

type RenderSecretPreview = (settings: GameSettings) => void;

interface SecretPreview {
  readonly element: HTMLElement;
  readonly render: RenderSecretPreview;
}

type CreateSecretPreview = (
  settings: GameSettings,
  options?: SecretPreviewOptions,
) => SecretPreview;

export const createSecretPreview: CreateSecretPreview = (
  settings: GameSettings,
  options: SecretPreviewOptions = {},
): SecretPreview => {
  const { language = DEFAULT_LANGUAGE, ...properties } = options;

  const t: Translate = createTranslator(language);

  const element: HTMLElement = document.createElement('div');
  Object.assign(element, { className: 'secret-preview' }, properties);

  const slots: HTMLDivElement = document.createElement('div');
  slots.className = 'secret-slots';
  slots.setAttribute('aria-hidden', 'true');

  const label: HTMLParagraphElement = document.createElement('p');
  label.className = 'alphabet-label';
  label.textContent = t('availableDigits');

  const alphabet: HTMLParagraphElement = document.createElement('p');
  alphabet.className = 'digit-alphabet';

  element.append(slots, label, alphabet);

  const render: RenderSecretPreview = (current: GameSettings): void => {
    slots.replaceChildren(
      ...Array.from({ length: current.secretLength }, (): HTMLSpanElement => {
        const slot: HTMLSpanElement = document.createElement('span');
        slot.className = 'secret-slot';
        slot.textContent = '?';
        return slot;
      }),
    );

    alphabet.textContent = Array.from(
      { length: current.numberBase },
      (_: unknown, index: number): string =>
        index.toString(current.numberBase).toUpperCase(),
    ).join(' ');
  };

  render(settings);

  return { element, render };
};
