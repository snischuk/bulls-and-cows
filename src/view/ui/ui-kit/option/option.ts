import './option.css';

type OptionOptions = Readonly<Partial<HTMLOptionElement>>;

type CreateOption = (options?: OptionOptions) => HTMLOptionElement;

export const createOption: CreateOption = (
  options: OptionOptions = {},
): HTMLOptionElement => {
  const option: HTMLOptionElement = document.createElement('option');
  Object.assign(option, options);

  option.classList.add('ui-option');

  return option;
};
