import { DEFAULT_THEME, THEME, type Theme } from '../config/interface.config';
import { readStorage, writeStorage } from '../infrastructure/local-storage';

interface ThemeService {
  readonly load: () => Theme;
  readonly save: (theme: Theme) => void;
}

const THEME_KEY: string = 'bulls-and-cows.theme';

export const themeService: ThemeService = {
  load: (): Theme => {
    try {
      const stored: unknown = readStorage(THEME_KEY);

      if (stored === THEME.DARK) return THEME.DARK;

      if (stored === THEME.LIGHT) return THEME.LIGHT;

      return DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  },
  save: (theme: Theme): void => writeStorage(THEME_KEY, theme),
};
