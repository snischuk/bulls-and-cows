import type {
  GameResult,
  GameSettings,
  GameState,
  LeaderboardEntry,
} from '@/game/game.type';
import type { Language, Theme } from '@/view/config/interface.config';
import type { MessageKey } from '@/view/i18n/translator';
import { languageService } from '@/view/service/language-storage.service';
import { leaderboardService } from '@/view/service/leaderboard-storage.service';
import { themeService } from '@/view/service/theme-storage.service';

export interface AppState {
  language: Language;
  theme: Theme;
  entries: LeaderboardEntry[];
  storageMessage: MessageKey | undefined;
  preferencesError: boolean;
  settings: GameSettings | undefined;
  gameState: GameState | null;
  gameResult: GameResult | null;
  guessDraft: string;
  notice: MessageKey;
}

type CreateAppState = () => AppState;

export const createAppState: CreateAppState = (): AppState => {
  const state: AppState = {
    language: languageService.load(),
    theme: themeService.load(),
    entries: [],
    storageMessage: undefined,
    preferencesError: false,
    settings: undefined,
    gameState: null,
    gameResult: null,
    guessDraft: '',
    notice: 'enterGuess',
  };

  try {
    state.entries = leaderboardService.load();
  } catch {
    state.storageMessage = 'loadError';
  }

  return state;
};
