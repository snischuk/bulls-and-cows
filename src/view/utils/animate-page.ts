import { GAME_STATUS } from '@/game/game.config';
import type { GameState } from '@/game/game.type';

type AnimatePage = (element: HTMLElement, gameState: GameState | null) => void;

type CreatePageAnimator = () => AnimatePage;

export const createPageAnimator: CreatePageAnimator = (): AnimatePage => {
  let previousGameState: GameState | null | undefined;

  return (element: HTMLElement, gameState: GameState | null): void => {
    const hasChangedPage: boolean =
      previousGameState === undefined ||
      (previousGameState === null) !== (gameState === null);

    if (hasChangedPage) {
      element.classList.add('page-enter');
    } else if (
      gameState !== null &&
      previousGameState !== null &&
      previousGameState !== undefined &&
      gameState.attemptsHistory.length >
        previousGameState.attemptsHistory.length
    ) {
      element
        .querySelector('.attempt-item:last-child')
        ?.classList.add('attempt-enter');

      if (gameState.gameStatus === GAME_STATUS.WON) {
        element
          .querySelector('.status-message')
          ?.classList.add('victory-enter');
      }
    }

    previousGameState = gameState;
  };
};
