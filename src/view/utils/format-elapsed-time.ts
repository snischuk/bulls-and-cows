import { MILLISECONDS_PER_SECOND } from '@/game/game.config';
import {
  DEFAULT_LANGUAGE,
  TIME_FRACTION_DIGITS,
} from '@/view/config/interface.config';

type FormatElapsedTime = (elapsedTime: number, locale?: string) => string;

export const formatElapsedTime: FormatElapsedTime = (
  elapsedTime: number,
  locale: string = DEFAULT_LANGUAGE,
): string =>
  (elapsedTime / MILLISECONDS_PER_SECOND).toLocaleString(locale, {
    minimumFractionDigits: TIME_FRACTION_DIGITS,
    maximumFractionDigits: TIME_FRACTION_DIGITS,
  });
