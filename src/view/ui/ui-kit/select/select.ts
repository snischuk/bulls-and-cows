import './select.css';

type SelectOptions = Readonly<Partial<HTMLSelectElement>>;

type CreateSelect = (options?: SelectOptions) => HTMLSelectElement;

export const createSelect: CreateSelect = (
  options: SelectOptions = {},
): HTMLSelectElement => {
  const select: HTMLSelectElement = document.createElement('select');
  Object.assign(select, options);

  select.classList.add('ui-select');

  return select;
};
