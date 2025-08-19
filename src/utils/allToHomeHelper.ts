import { GameState } from '../types/game.types';
import { findAllMovesToFoundations } from './moveAllToFoundations';
import { executeAutoMove } from './autoMove';

/**
 * Check if safe mode is enabled
 */
export const isSafeModeEnabled = (): boolean => {
  const saved = localStorage.getItem('solitaire-safemode');
  return saved === null ? true : saved === 'true';
};

/**
 * Execute all possible moves to foundations when in "all to home" mode
 * This is triggered when safe mode is OFF and a card is moved to foundation
 */
export const executeAllToHomeIfEnabled = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  // Only execute if safe mode is OFF (all to home mode)
  if (isSafeModeEnabled()) {
    return;
  }

  // Find all possible moves to foundations
  const moves = findAllMovesToFoundations(gameState);
  
  if (moves.length > 0) {
    console.log(`All to Home mode: Found ${moves.length} additional moves to foundations`);
    
    // Execute all moves in a single state update for proper undo
    setGameState(prevState => {
      let currentState = prevState;
      
      // Apply all moves sequentially to build final state
      moves.forEach((move) => {
        currentState = executeAutoMove(
          move.card,
          move.from,
          move.to,
          currentState
        );
        console.log(`All to Home: Moving ${move.card.rank} of ${move.card.suit} to foundation`);
      });
      
      return currentState;
    });
  }
};