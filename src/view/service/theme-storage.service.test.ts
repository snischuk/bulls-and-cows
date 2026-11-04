import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Theme } from '@/view/config/interface.config';

import { themeService } from './theme-storage.service';

afterEach((): void => {
  vi.unstubAllGlobals();
});

describe('theme service', (): void => {
  it.each([{ stored: null }, { stored: 'invalid' }, { stored: {} }])(
    'uses the default for absent or invalid values %#',
    ({ stored }: { stored: unknown }): void => {
      vi.stubGlobal('localStorage', {
        getItem: (): string | null =>
          stored === null ? null : JSON.stringify(stored),
      });

      expect(themeService.load()).toBe('light');
    },
  );

  it('saves and restores its own setting without changing other data', (): void => {
    const records: Map<string, string> = new Map([
      ['bulls-and-cows.language', '"unchanged"'],
      ['bulls-and-cows.leaderboard', '[]'],
    ]);

    vi.stubGlobal('localStorage', {
      getItem: (key: string): string | null => records.get(key) ?? null,
      setItem: (key: string, value: string): void => {
        records.set(key, value);
      },
    });

    const setting: Theme = 'dark';

    themeService.save(setting);

    expect(themeService.load()).toBe(setting);
    expect(records.get('bulls-and-cows.language')).toBe('"unchanged"');
    expect(records.get('bulls-and-cows.leaderboard')).toBe('[]');
  });

  it('reports storage errors to the caller', (): void => {
    vi.stubGlobal('localStorage', {
      setItem: (): never => {
        throw new Error('Unavailable');
      },
    });

    expect((): void => themeService.save('dark')).toThrow('Unavailable');
  });

  it('falls back when reading storage fails', (): void => {
    vi.stubGlobal('localStorage', {
      getItem: (): never => {
        throw new Error('Unavailable');
      },
    });

    expect(themeService.load()).toBe('light');
  });

  it('falls back for corrupted JSON', (): void => {
    vi.stubGlobal('localStorage', { getItem: (): string => '{broken' });

    expect(themeService.load()).toBe('light');
  });
});
