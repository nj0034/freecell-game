import { GameState } from '../types/game.types';

// 게임 상태 히스토리 타입
export interface GameHistory {
  states: GameState[];
  currentIndex: number;
}

// 초기 히스토리 생성
export const createHistory = (initialState: GameState): GameHistory => ({
  states: [initialState],
  currentIndex: 0
});

// 새로운 상태 추가
export const addStateToHistory = (
  history: GameHistory,
  newState: GameState
): GameHistory => {
  // 현재 인덱스 이후의 상태들은 제거 (redo 스택 초기화)
  const newStates = history.states.slice(0, history.currentIndex + 1);
  newStates.push(newState);
  
  // 최대 50개의 상태만 유지 (메모리 관리)
  if (newStates.length > 50) {
    newStates.shift();
    return {
      states: newStates,
      currentIndex: newStates.length - 1
    };
  }
  
  return {
    states: newStates,
    currentIndex: newStates.length - 1
  };
};

// Undo 수행
export const undo = (history: GameHistory): GameState | null => {
  if (history.currentIndex > 0) {
    return history.states[history.currentIndex - 1];
  }
  return null;
};

// Redo 수행
export const redo = (history: GameHistory): GameState | null => {
  if (history.currentIndex < history.states.length - 1) {
    return history.states[history.currentIndex + 1];
  }
  return null;
};

// 히스토리 인덱스 업데이트
export const updateHistoryIndex = (
  history: GameHistory,
  direction: 'undo' | 'redo'
): GameHistory => {
  const newIndex = direction === 'undo' 
    ? Math.max(0, history.currentIndex - 1)
    : Math.min(history.states.length - 1, history.currentIndex + 1);
    
  return {
    ...history,
    currentIndex: newIndex
  };
};

// Undo 가능 여부 확인
export const canUndo = (history: GameHistory): boolean => {
  return history.currentIndex > 0;
};

// Redo 가능 여부 확인
export const canRedo = (history: GameHistory): boolean => {
  return history.currentIndex < history.states.length - 1;
};

// 게임 상태 깊은 복사
export const cloneGameState = (state: GameState): GameState => {
  return {
    ...state,
    tableau: state.tableau.map(column => 
      column.map(card => ({ ...card }))
    ),
    foundations: state.foundations.map(foundation =>
      foundation.map(card => ({ ...card }))
    ),
    freeCells: state.freeCells.map(cell => 
      cell ? { ...cell } : null
    ),
    moveHistory: [...state.moveHistory],
    selectedCards: [...state.selectedCards]
  };
};