export type Language = 'en' | 'ru';

export type Theme = 'light' | 'dark';

export const LANGUAGE: Readonly<Record<'ENGLISH' | 'RUSSIAN', Language>> = {
  ENGLISH: 'en',
  RUSSIAN: 'ru',
};

export const THEME: Readonly<Record<'LIGHT' | 'DARK', Theme>> = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const DEFAULT_LANGUAGE: Language = LANGUAGE.ENGLISH;

export const DEFAULT_THEME: Theme = THEME.LIGHT;

export const LANGUAGE_LABELS: Readonly<Record<Language, string>> = {
  en: 'English',
  ru: 'Русский',
};

export const TIME_FRACTION_DIGITS: number = 2;

export const STATUS_REGION: Readonly<
  Record<'PREFERENCES' | 'ROUND' | 'LEADERBOARD', string>
> = {
  PREFERENCES: 'preferences',
  ROUND: 'round',
  LEADERBOARD: 'leaderboard',
};
