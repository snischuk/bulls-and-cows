type TextInputOptions = Readonly<Partial<HTMLInputElement>>;

type CreateTextInput = (options?: TextInputOptions) => HTMLInputElement;

export const createTextInput: CreateTextInput = (
  options: TextInputOptions = {},
): HTMLInputElement => {
  const input: HTMLInputElement = document.createElement('input');

  Object.assign(input, { type: 'text' }, options);

  return input;
};
