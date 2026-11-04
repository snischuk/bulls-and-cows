import type { AppState } from '@/view/state/app-state';

type ResetRound = (state: AppState) => void;

export const resetRound: ResetRound = (state: AppState): void => {
  state.gameState = null;
  state.gameResult = null;
  state.guessDraft = '';
  state.notice = 'enterGuess';
};
