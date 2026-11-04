import './list.css';

type ListOptions = Readonly<Partial<HTMLOListElement>>;

type CreateList = (options?: ListOptions) => HTMLOListElement;

export const createList: CreateList = (
  options: ListOptions = {},
): HTMLOListElement => {
  const list: HTMLOListElement = document.createElement('ol');

  Object.assign(list, options);

  list.classList.add('ui-list');

  return list;
};
