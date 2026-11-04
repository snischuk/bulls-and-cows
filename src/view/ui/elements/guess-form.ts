import {
  type DigitValidator,
  createDigitValidator,
} from '../../../game/core/create-digit-validator';
import type { GameSettings } from '../../../game/game.type';
import { createButton } from '../ui-kit/button';
import { createTextInput } from '../ui-kit/text-input';

type GuessFormOptions = Readonly<Partial<HTMLFormElement>>;

interface GuessForm {
  readonly element: HTMLFormElement;
  readonly input: HTMLInputElement;
}

type CreateGuessForm = (
  settings: GameSettings,
  options?: GuessFormOptions,
) => GuessForm;

export const createGuessForm: CreateGuessForm = (
  settings: GameSettings,
  options: GuessFormOptions = {},
): GuessForm => {
  const element: HTMLFormElement = document.createElement('form');
  Object.assign(element, { className: 'guess-form' }, options);
  const label: HTMLLabelElement = document.createElement('label');
  label.htmlFor = 'guess-input';
  label.textContent = 'Ваша попытка';
  const input: HTMLInputElement = createTextInput({
    id: 'guess-input',
    name: 'guess',
    maxLength: settings.secretLength,
    inputMode: settings.numberBase === 16 ? 'text' : 'numeric',
    autocomplete: 'off',
    required: true,
  });
  const submitButton: HTMLButtonElement = createButton({
    text: 'Проверить',
    type: 'submit',
  });
  const isValidDigit: DigitValidator = createDigitValidator(
    settings.numberBase,
  );
  input.addEventListener('input', (): void => {
    const filteredGuess: string = [...input.value]
      .filter((character: string): boolean => isValidDigit(character))
      .slice(0, settings.secretLength)
      .join('');
    if (input.value !== filteredGuess) input.value = filteredGuess;
  });
  element.append(label, input, submitButton);
  return { element, input };
};
