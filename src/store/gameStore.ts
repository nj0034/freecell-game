// Simple state management without Zustand
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameState } from '../types/game.types';
import { cloneGameState } from '../utils/undoRedo';
import { initializeGame } from '../utils/gameLogic';
import { DifficultyLevel, difficultyConfigs } from '../utils/difficulty';
import { ScoreAction, calculateWinBonus } from '../utils/scoreSystem';

interface GameStore {
  // Current game state
  gameState: GameState;
  // Initial game state for restart
  initialGameState: GameState | null;
  // History stack for undo functionality
  history: GameState[];
  // Current difficulty and undo tracking
  currentDifficulty: DifficultyLevel;
  consecutiveUndoCount: number;
  // UI states
  showWinAnimation: boolean;
  safeMode: boolean;
  lastUndoTime: number;
  isAutoMoving: boolean;
  // Game time for scoring
  gameStartTime: number;
  
  // Actions
  updateGameState: (newState: GameState | ((prev: GameState) => GameState)) => void;
  setGameState: (newState: GameState) => void;
  undo: () => boolean;
  canUndo: () => boolean;
  newGame: (difficulty: DifficultyLevel) => void;
  restartGame: () => void;
  toggleSafeMode: () => void;
  setShowWinAnimation: (show: boolean) => void;
  setIsAutoMoving: (isMoving: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => {
    const initialGameState = initializeGame(DifficultyLevel.MEDIUM);
    return {
      // Initial state
      gameState: initialGameState,
      initialGameState: cloneGameState(initialGameState),
      history: [cloneGameState(initialGameState)],
      currentDifficulty: DifficultyLevel.MEDIUM,
      consecutiveUndoCount: 0,
      showWinAnimation: false,
      safeMode: (() => {
        const saved = localStorage.getItem('solitaire-safemode');
        return saved === null ? true : saved === 'true';
      })(),
      lastUndoTime: 0,
      isAutoMoving: false,
      gameStartTime: Date.now(),

      // Actions
      updateGameState: (newState) => {
        set((state) => {
          const current = state.gameState;
          const updated = typeof newState === 'function' ? newState(current) : newState;
          
          // Check if state actually changed
          if (JSON.stringify(current) !== JSON.stringify(updated)) {
            const newHistory = [...state.history, cloneGameState(updated)];
            // Keep only last 50 moves to prevent memory issues
            const limitedHistory = newHistory.length > 50 ? newHistory.slice(-50) : newHistory;
            
            return {
              ...state,
              gameState: updated,
              history: limitedHistory,
              consecutiveUndoCount: 0, // Reset consecutive undo count on new move
              lastUndoTime: 0 // Reset undo timer on new move
            };
          } else {
            return {
              ...state,
              gameState: updated
            };
          }
        });
      },

    setGameState: (newState) => {
      set({ gameState: newState });
    },

      undo: () => {
        const { history, lastUndoTime, currentDifficulty, consecutiveUndoCount } = get();
        const currentTime = Date.now();
        
        // Prevent consecutive undos within 2 seconds
        if (currentTime - lastUndoTime < 2000 && lastUndoTime > 0) {
          return false;
        }
        
        // Check difficulty-based undo limit
        const difficultyConfig = difficultyConfigs[currentDifficulty];
        if (difficultyConfig.maxConsecutiveUndos !== -1 && consecutiveUndoCount >= difficultyConfig.maxConsecutiveUndos) {
          return false;
        }
        
        // Need at least 2 states in history to undo (current + previous)
        if (history.length >= 2) {
          const newHistory = history.slice(0, -1); // Remove current state
          const previousState = newHistory[newHistory.length - 1]; // Get new current state
          
          // Apply undo penalty to score
          const undoState = cloneGameState(previousState);
          undoState.score = Math.max(0, undoState.score + ScoreAction.UNDO_PENALTY);
          
          set({
            gameState: undoState,
            history: newHistory,
            consecutiveUndoCount: consecutiveUndoCount + 1,
            lastUndoTime: currentTime
          });
          
          return true;
        }
        
        return false;
      },

      canUndo: () => {
        const { history, currentDifficulty, consecutiveUndoCount } = get();
        const difficultyConfig = difficultyConfigs[currentDifficulty];
        
        // Check if we have states to undo and haven't reached the difficulty limit
        const hasStates = history.length >= 2;
        const underLimit = difficultyConfig.maxConsecutiveUndos === -1 || consecutiveUndoCount < difficultyConfig.maxConsecutiveUndos;
        
        return hasStates && underLimit;
      },

      newGame: (difficulty) => {
        const newGameState = initializeGame(difficulty);
        set({
          gameState: newGameState,
          initialGameState: cloneGameState(newGameState),
          history: [cloneGameState(newGameState)],
          currentDifficulty: difficulty,
          consecutiveUndoCount: 0,
          showWinAnimation: false,
          gameStartTime: Date.now()
        });
      },

      restartGame: () => {
        const { initialGameState } = get();
        if (initialGameState) {
          const restartedState = cloneGameState(initialGameState);
          set({
            gameState: restartedState,
            history: [cloneGameState(restartedState)],
            consecutiveUndoCount: 0,
            showWinAnimation: false,
            lastUndoTime: 0,
            gameStartTime: Date.now()
          });
        }
      },

    toggleSafeMode: () => {
      const newMode = !get().safeMode;
      localStorage.setItem('solitaire-safemode', String(newMode));
      set({ safeMode: newMode });
    },

      setShowWinAnimation: (show) => {
        set({ showWinAnimation: show });
      },

      setIsAutoMoving: (isMoving) => {
        set({ isAutoMoving: isMoving });
      }
    };
  })
);

// Subscribe to game state changes for win condition
useGameStore.subscribe(
  (state) => state.gameState.isGameWon,
  (isGameWon) => {
    if (isGameWon) {
      console.log('Game won detected - showing win animation');
      const state = useGameStore.getState();
      
      // Calculate win bonus
      const gameTimeSeconds = Math.floor((Date.now() - state.gameStartTime) / 1000);
      const difficultyKey = Object.keys(DifficultyLevel).find(
        key => DifficultyLevel[key as keyof typeof DifficultyLevel] === state.currentDifficulty
      )?.toLowerCase() as 'easy' | 'medium' | 'hard' | 'expert' || 'medium';
      
      const winBonus = calculateWinBonus(
        state.gameState.moves,
        gameTimeSeconds,
        difficultyKey
      );
      
      // Update score with win bonus
      state.updateGameState((prev) => ({
        ...prev,
        score: prev.score + winBonus
      }));
      
      state.setShowWinAnimation(true);
    }
  }
);