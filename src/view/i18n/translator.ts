import type { Language } from '@/view/config/interface.config';
import { LANGUAGE } from '@/view/config/interface.config';

interface Messages {
  readonly restartConfirmation: string;
  readonly continueGame: string;
  readonly restartGame: string;
  readonly title: string;
  readonly settingsTitle: string;
  readonly roundTitle: string;
  readonly availableDigits: string;
  readonly bullsLabel: string;
  readonly cowsLabel: string;
  readonly recordSettings: string;
  readonly recordResult: string;
  readonly introduction: string;
  readonly numberSystem: string;
  readonly base: string;
  readonly secretLength: string;
  readonly startGame: string;
  readonly binaryHint: string;
  readonly digitsHint: string;
  readonly possibilities: string;
  readonly guessDescription: string;
  readonly enterGuess: string;
  readonly history: string;
  readonly newGame: string;
  readonly yourGuess: string;
  readonly checkGuess: string;
  readonly attempt: string;
  readonly invalidGuess: string;
  readonly duplicateGuess: string;
  readonly finishedGame: string;
  readonly tryAgain: string;
  readonly victory: string;
  readonly leaderboardTitle: string;
  readonly rankingDescription: string;
  readonly leaderboardEntry: string;
  readonly emptyLeaderboard: string;
  readonly loadError: string;
  readonly saveError: string;
  readonly language: string;
  readonly theme: string;
  readonly light: string;
  readonly dark: string;
  readonly preferencesError: string;
}

export type MessageKey = keyof Messages;

const english: Messages = {
  restartConfirmation: 'Starting a new game will discard your current guesses.',
  continueGame: 'Continue playing',
  restartGame: 'Start over',
  title: 'Bulls and Cows',
  settingsTitle: 'Set up the board',
  roundTitle: 'Find the secret',
  availableDigits: 'Digits in play',
  bullsLabel: 'Bulls',
  cowsLabel: 'Cows',
  recordSettings: '{base}, {length} digits',
  recordResult: '{attempts} guesses in {time} s',
  introduction:
    'A secret with no repeated digits. Each guess brings you closer: bulls are in the right place, cows belong somewhere else.',
  numberSystem: 'Number system',
  base: 'base',
  secretLength: 'Secret length',
  startGame: 'Start game',
  binaryHint: 'Binary uses only 0 and 1, so the secret must be 2 digits long.',
  digitsHint: 'Digits do not repeat. The secret may start with zero.',
  possibilities: 'Possible secrets: {count}',
  guessDescription: 'Guess {length} unique digits in {base}.',
  enterGuess: 'Enter a guess to get feedback.',
  history: 'Guess history',
  newGame: 'New game',
  yourGuess: 'Your guess',
  checkGuess: 'Check guess',
  attempt: '{guess} — bulls: {bulls}, cows: {cows}',
  invalidGuess:
    'Your guess must have the required length and contain valid, unique digits.',
  duplicateGuess: 'You have already tried this guess.',
  finishedGame: 'This game has ended. Start a new game.',
  tryAgain: 'Not quite. Try again.',
  victory: 'You won! Secret: {secret}. Guesses: {attempts}, time: {time} s.',
  leaderboardTitle: 'Top {limit}',
  rankingDescription:
    'Fewer guesses rank higher. Ties are broken by the shortest time.',
  leaderboardEntry:
    '{base} · {length} digits — guesses: {attempts}, time: {time} s',
  emptyLeaderboard: 'No records yet. Win your first round!',
  loadError:
    'Could not load the leaderboard. You can still play; we will try to save new results when you win.',
  saveError:
    'Your result is on the leaderboard, but could not be saved. It may be lost when you reload the page.',
  language: 'Language',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  preferencesError:
    'Your preferences could not be saved. They will apply for this session.',
};

const russian: Messages = {
  restartConfirmation: 'При запуске новой игры текущие попытки будут потеряны.',
  continueGame: 'Продолжить игру',
  restartGame: 'Начать заново',
  title: 'Быки и коровы',
  settingsTitle: 'Настройте игру',
  roundTitle: 'Угадайте секрет',
  availableDigits: 'Цифры в игре',
  bullsLabel: 'Быки',
  cowsLabel: 'Коровы',
  recordSettings: '{base}, длина: {length}',
  recordResult: 'Попыток: {attempts}, время: {time} с',
  introduction:
    'В секрете нет повторяющихся цифр. Каждая попытка приближает к разгадке: быки стоят на своих местах, коровы — на других.',
  numberSystem: 'Система счисления',
  base: 'основание',
  secretLength: 'Длина секрета',
  startGame: 'Начать игру',
  binaryHint: 'В двоичной системе доступны только 0 и 1, поэтому длина — 2.',
  digitsHint: 'Цифры не повторяются. Секрет может начинаться с нуля.',
  possibilities: 'Возможных секретов: {count}',
  guessDescription: 'Угадайте {length} уникальные цифры в системе {base}.',
  enterGuess: 'Введите попытку и получите подсказку.',
  history: 'История попыток',
  newGame: 'Новая игра',
  yourGuess: 'Ваша попытка',
  checkGuess: 'Проверить',
  attempt: '{guess} — быки: {bulls}, коровы: {cows}',
  invalidGuess:
    'Попытка должна иметь нужную длину и содержать допустимые неповторяющиеся цифры.',
  duplicateGuess: 'Вы уже вводили эту попытку.',
  finishedGame: 'Игра уже завершена. Начните новую игру.',
  tryAgain: 'Не угадали. Попробуйте ещё раз.',
  victory: 'Победа! Секрет: {secret}. Попыток: {attempts}, время: {time} с.',
  leaderboardTitle: 'Топ-{limit}',
  rankingDescription:
    'Меньше попыток — выше место. При равенстве выигрывает меньшее время.',
  leaderboardEntry:
    '{base} · длина: {length} — попыток: {attempts}, время: {time} с',
  emptyLeaderboard: 'Рекордов пока нет. Выиграйте первый раунд!',
  loadError:
    'Не удалось загрузить рекорды. Можно продолжить игру; новые результаты попробуем сохранить после победы.',
  saveError:
    'Результат добавлен в таблицу, но сохранить его не удалось. После перезагрузки он может пропасть.',
  language: 'Язык',
  theme: 'Тема',
  light: 'Светлая',
  dark: 'Тёмная',
  preferencesError:
    'Не удалось сохранить настройки интерфейса. Они будут действовать до перезагрузки страницы.',
};

type Parameters = Readonly<Record<string, string | number>>;

export type Translate = (key: MessageKey, parameters?: Parameters) => string;

type CreateTranslator = (language: Language) => Translate;

export const createTranslator: CreateTranslator = (
  language: Language,
): Translate => {
  const messages: Messages = language === LANGUAGE.RUSSIAN ? russian : english;

  return (key: MessageKey, parameters: Parameters = {}): string =>
    messages[key].replace(
      /\{(\w+)\}/g,
      (placeholder: string, name: string): string =>
        parameters[name] === undefined ? placeholder : String(parameters[name]),
    );
};
