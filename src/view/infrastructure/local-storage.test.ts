import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { readStorage, removeStorage, writeStorage } from './local-storage';

afterEach((): void => {
  vi.unstubAllGlobals();
});

describe('local storage', (): void => {
  it('returns null for a missing key', (): void => {
    const getItem: Mock<() => null> = vi.fn((): null => null);

    vi.stubGlobal('localStorage', { getItem });

    expect(readStorage('missing')).toBeNull();
    expect(getItem).toHaveBeenCalledWith('missing');
  });

  it('parses stored JSON', (): void => {
    vi.stubGlobal('localStorage', { getItem: (): string => '{"score":3}' });

    expect(readStorage('result')).toEqual({ score: 3 });
  });

  it('reports corrupted JSON', (): void => {
    vi.stubGlobal('localStorage', { getItem: (): string => '{broken' });

    expect((): unknown => readStorage('result')).toThrow(SyntaxError);
  });

  it('serializes data before writing', (): void => {
    const setItem: Mock = vi.fn();

    vi.stubGlobal('localStorage', { setItem });

    writeStorage('result', { score: 3 });

    expect(setItem).toHaveBeenCalledWith('result', '{"score":3}');
  });

  it('rejects values that cannot be represented as JSON', (): void => {
    const setItem: Mock = vi.fn();

    vi.stubGlobal('localStorage', { setItem });

    expect((): void => writeStorage('result', undefined)).toThrow(TypeError);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('propagates storage write failures', (): void => {
    const error: Error = new Error('Storage unavailable');

    vi.stubGlobal('localStorage', {
      setItem: (): never => {
        throw error;
      },
    });

    expect((): void => writeStorage('result', [])).toThrow(error);
  });

  it('removes only the requested key', (): void => {
    const removeItem: Mock = vi.fn();

    vi.stubGlobal('localStorage', { removeItem });

    removeStorage('result');

    expect(removeItem).toHaveBeenCalledExactlyOnceWith('result');
  });
});
