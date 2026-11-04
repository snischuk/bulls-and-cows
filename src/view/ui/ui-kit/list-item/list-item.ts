import './list-item.css';

interface ListItemOptions extends Readonly<Partial<HTMLLIElement>> {
  readonly text?: string;
}

type CreateListItem = (options?: ListItemOptions) => HTMLLIElement;

export const createListItem: CreateListItem = (
  options: ListItemOptions = {},
): HTMLLIElement => {
  const item: HTMLLIElement = document.createElement('li');

  const { text, ...properties } = options;

  Object.assign(item, properties);

  if (text !== undefined) {
    item.textContent = text;
  }

  item.classList.add('ui-list-item');

  return item;
};
