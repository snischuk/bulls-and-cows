type CountPossibleSecrets = (length: number, base: number) => number;

const possibleSecretsCache: Map<string, number> = new Map();

export const countPossibleSecrets: CountPossibleSecrets = (
  length: number,
  base: number,
): number => {
  if (!Number.isInteger(length) || !Number.isInteger(base)) return 0;

  if (length < 0 || base < 0) return 0;

  if (length === 0) return 1;

  if (length > base) return 0;

  if (length === 1) return base;

  const cacheKey: string = `${length}:${base}`;

  const cachedCount: number | undefined = possibleSecretsCache.get(cacheKey);

  if (cachedCount !== undefined) return cachedCount;

  const possibleSecretsCount: number =
    base * countPossibleSecrets(length - 1, base - 1);

  possibleSecretsCache.set(cacheKey, possibleSecretsCount);

  return possibleSecretsCount;
};
