import './button.css';

interface ButtonOptions extends Readonly<Partial<HTMLButtonElement>> {
  readonly text?: string;
}

type CreateButton = (options?: ButtonOptions) => HTMLButtonElement;

export const createButton: CreateButton = (
  options: ButtonOptions = {},
): HTMLButtonElement => {
  const button: HTMLButtonElement = document.createElement('button');

  const { text, ...properties } = options;

  Object.assign(button, { type: 'button' }, properties);

  if (text !== undefined) {
    button.textContent = text;
  }

  button.classList.add('ui-button');

  return button;
};
