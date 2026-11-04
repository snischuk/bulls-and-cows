import { MILLISECONDS_PER_SECOND } from '../../game/game.config';

type FormatElapsedTime = (elapsedTime: number) => string;

export const formatElapsedTime: FormatElapsedTime = (
  elapsedTime: number,
): string => (elapsedTime / MILLISECONDS_PER_SECOND).toFixed(2);
