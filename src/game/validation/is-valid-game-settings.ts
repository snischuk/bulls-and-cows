import { GAME_CONFIG } from '../game.config';
import type { GameSettings, NumberBase } from '../game.type';

type IsValidGameSettings = (settings: unknown) => settings is GameSettings;

export const isValidGameSettings: IsValidGameSettings = (
  settings: unknown,
): settings is GameSettings => {
  if (typeof settings !== 'object' || settings === null) return false;

  return (
    'numberBase' in settings &&
    'secretLength' in settings &&
    GAME_CONFIG.supportedBases.some(
      (base: NumberBase): boolean => base === settings.numberBase,
    ) &&
    typeof settings.secretLength === 'number' &&
    Number.isInteger(settings.secretLength) &&
    typeof settings.numberBase === 'number' &&
    settings.secretLength >= GAME_CONFIG.minSecretLength &&
    settings.secretLength <= GAME_CONFIG.maxSecretLength &&
    settings.secretLength <= settings.numberBase
  );
};
