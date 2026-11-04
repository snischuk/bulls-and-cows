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

  return item;
};
