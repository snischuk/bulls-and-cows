import {
  DEFAULT_LANGUAGE,
  LANGUAGE,
  type Language,
} from '../config/interface.config';
import { readStorage, writeStorage } from '../infrastructure/local-storage';

interface LanguageService {
  readonly load: () => Language;
  readonly save: (language: Language) => void;
}

const LANGUAGE_KEY: string = 'bulls-and-cows.language';

export const languageService: LanguageService = {
  load: (): Language => {
    try {
      const stored: unknown = readStorage(LANGUAGE_KEY);

      if (stored === LANGUAGE.RUSSIAN) return LANGUAGE.RUSSIAN;

      if (stored === LANGUAGE.ENGLISH) return LANGUAGE.ENGLISH;

      return DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  },
  save: (language: Language): void => writeStorage(LANGUAGE_KEY, language),
};
