import type { DigitValidator } from '@/game/core/create-digit-validator';
import { createDigitValidator } from '@/game/core/create-digit-validator';
import { NUMBER_BASE } from '@/game/game.config';
import type { GameSettings } from '@/game/game.type';
import type { Language } from '@/view/config/interface.config';
import { DEFAULT_LANGUAGE } from '@/view/config/interface.config';
import type { Translate } from '@/view/i18n/translator';
import { createTranslator } from '@/view/i18n/translator';
import { createButton } from '@/view/ui/ui-kit/button/button';
import { createTextInput } from '@/view/ui/ui-kit/text-input/text-input';

import './guess-form.css';

interface GuessFormOptions extends Readonly<Partial<HTMLFormElement>> {
  readonly language?: Language;
}

interface GuessForm {
  readonly element: HTMLFormElement;
  readonly input: HTMLInputElement;
}

type InputHandler = () => void;

type CreateGuessForm = (
  settings: GameSettings,
  options?: GuessFormOptions,
) => GuessForm;

export const createGuessForm: CreateGuessForm = (
  settings: GameSettings,
  options: GuessFormOptions = {},
): GuessForm => {
  const { language = DEFAULT_LANGUAGE, ...properties } = options;

  const t: Translate = createTranslator(language);

  const element: HTMLFormElement = document.createElement('form');
  Object.assign(element, { className: 'guess-form' }, properties);

  const label: HTMLLabelElement = document.createElement('label');
  label.htmlFor = 'guess-input';
  label.textContent = t('yourGuess');

  const input: HTMLInputElement = createTextInput({
    id: 'guess-input',
    name: 'guess',
    maxLength: settings.secretLength,
    inputMode:
      settings.numberBase === NUMBER_BASE.HEXADECIMAL ? 'text' : 'numeric',
    autocomplete: 'off',
    required: true,
  });

  const submitButton: HTMLButtonElement = createButton({
    text: t('checkGuess'),
    type: 'submit',
  });

  const isValidDigit: DigitValidator = createDigitValidator(
    settings.numberBase,
  );

  const filterNotice: HTMLParagraphElement = document.createElement('p');
  filterNotice.id = 'guess-filter-notice';
  filterNotice.className = 'settings-hint';
  filterNotice.setAttribute('role', 'status');

  const handleGuessInput: InputHandler = (): void => {
    const filteredGuess: string = [...input.value]
      .filter((character: string): boolean => isValidDigit(character))
      .slice(0, settings.secretLength)
      .join('');

    filterNotice.textContent =
      input.value !== filteredGuess ? t('filteredDigits') : '';
    if (input.value !== filteredGuess) input.value = filteredGuess;
    input.removeAttribute('aria-invalid');
  };

  input.addEventListener('input', handleGuessInput);

  element.append(label, input, submitButton, filterNotice);

  return { element, input };
};
