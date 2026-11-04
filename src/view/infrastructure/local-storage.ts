type ReadStorage = (key: string) => unknown;

type WriteStorage = (key: string, value: unknown) => void;

type RemoveStorage = (key: string) => void;

export const readStorage: ReadStorage = (key: string): unknown => {
  const storedValue: string | null = localStorage.getItem(key);

  return storedValue === null ? null : JSON.parse(storedValue);
};

export const writeStorage: WriteStorage = (
  key: string,
  value: unknown,
): void => {
  const serializedValue: string | undefined = JSON.stringify(value);

  if (serializedValue === undefined) {
    throw new TypeError('Value cannot be represented as JSON');
  }

  localStorage.setItem(key, serializedValue);
};

export const removeStorage: RemoveStorage = (key: string): void => {
  localStorage.removeItem(key);
};
