import { GameState, PileType } from '../types/game.types';
import { canMoveCard } from './gameLogic';

/**
 * 게임이 데드락 상태인지 확인
 * 모든 가능한 이동을 체크하여 이동 가능한 카드가 있는지 확인
 */
export const isGameDeadlocked = (gameState: GameState): boolean => {
  // 이미 게임을 이겼으면 데드락이 아님
  if (gameState.isGameWon) {
    return false;
  }

  // 1. 프리셀에서 이동 가능한지 확인
  for (let i = 0; i < gameState.freeCells.length; i++) {
    const card = gameState.freeCells[i];
    if (card) {
      // 파운데이션으로 이동 가능한지
      for (let j = 0; j < gameState.foundations.length; j++) {
        if (canMoveCard(card, gameState.foundations[j], PileType.FOUNDATION)) {
          return false; // 이동 가능한 카드가 있음
        }
      }
      
      // 테이블로로 이동 가능한지
      for (let j = 0; j < gameState.tableau.length; j++) {
        if (gameState.tableau[j].length === 0) {
          return false; // 빈 컬럼이 있으면 이동 가능
        }
        if (canMoveCard(card, gameState.tableau[j], PileType.TABLEAU)) {
          return false; // 이동 가능한 카드가 있음
        }
      }
    }
  }

  // 2. 빈 프리셀이 있는지 확인
  const hasEmptyFreeCell = gameState.freeCells.some(cell => cell === null);

  // 3. 테이블로에서 이동 가능한지 확인
  for (let i = 0; i < gameState.tableau.length; i++) {
    const column = gameState.tableau[i];
    if (column.length === 0) continue;

    // 각 컬럼의 맨 위 카드 확인
    const topCard = column[column.length - 1];
    
    // 파운데이션으로 이동 가능한지
    for (let j = 0; j < gameState.foundations.length; j++) {
      if (canMoveCard(topCard, gameState.foundations[j], PileType.FOUNDATION)) {
        return false; // 이동 가능한 카드가 있음
      }
    }
    
    // 다른 테이블로 컬럼으로 이동 가능한지
    for (let j = 0; j < gameState.tableau.length; j++) {
      if (i === j) continue; // 같은 컬럼 제외
      
      if (gameState.tableau[j].length === 0) {
        // 빈 컬럼이 있고, 현재 컬럼에 2장 이상 있으면 이동 가능
        if (column.length > 1) {
          return false;
        }
      } else if (canMoveCard(topCard, gameState.tableau[j], PileType.TABLEAU)) {
        return false; // 이동 가능한 카드가 있음
      }
    }
    
    // 프리셀로 이동 가능한지 (빈 프리셀이 있는 경우)
    if (hasEmptyFreeCell) {
      return false; // 프리셀로 이동 가능
    }

    // 연속된 카드 시퀀스 확인 (여러 카드 이동)
    for (let cardIndex = column.length - 2; cardIndex >= 0; cardIndex--) {
      const currentCard = column[cardIndex];
      const nextCard = column[cardIndex + 1];
      
      // 연속된 시퀀스가 아니면 중단
      if (currentCard.color === nextCard.color || currentCard.rank !== nextCard.rank + 1) {
        break;
      }
      
      // 이 시퀀스를 다른 컬럼으로 이동할 수 있는지 확인
      for (let j = 0; j < gameState.tableau.length; j++) {
        if (i === j) continue;
        
        if (gameState.tableau[j].length === 0) {
          // 빈 컬럼으로 이동 가능
          return false;
        } else if (canMoveCard(currentCard, gameState.tableau[j], PileType.TABLEAU)) {
          // 연속된 카드들을 이동할 수 있는지 확인
          const numCardsToMove = column.length - cardIndex;
          const emptyFreeCells = gameState.freeCells.filter(cell => cell === null).length;
          const emptyTableauColumns = gameState.tableau.filter(col => col.length === 0).length;
          const maxMovable = (emptyFreeCells + 1) * Math.pow(2, emptyTableauColumns);
          
          if (numCardsToMove <= maxMovable) {
            return false; // 이동 가능
          }
        }
      }
    }
  }

  // 모든 경우를 확인했는데 이동 가능한 카드가 없으면 데드락
  return true;
};

/**
 * 가능한 이동 힌트 찾기
 */
export const findPossibleMoves = (gameState: GameState): string[] => {
  const hints: string[] = [];

  // 프리셀에서 이동 가능한 카드 찾기
  for (let i = 0; i < gameState.freeCells.length; i++) {
    const card = gameState.freeCells[i];
    if (card) {
      for (let j = 0; j < gameState.foundations.length; j++) {
        if (canMoveCard(card, gameState.foundations[j], PileType.FOUNDATION)) {
          hints.push(`프리셀의 ${card.suit} ${card.rank}를 파운데이션으로 이동 가능`);
        }
      }
      
      for (let j = 0; j < gameState.tableau.length; j++) {
        if (canMoveCard(card, gameState.tableau[j], PileType.TABLEAU)) {
          hints.push(`프리셀의 ${card.suit} ${card.rank}를 ${j+1}번째 열로 이동 가능`);
        }
      }
    }
  }

  // 테이블로에서 이동 가능한 카드 찾기
  for (let i = 0; i < gameState.tableau.length; i++) {
    const column = gameState.tableau[i];
    if (column.length > 0) {
      const topCard = column[column.length - 1];
      
      for (let j = 0; j < gameState.foundations.length; j++) {
        if (canMoveCard(topCard, gameState.foundations[j], PileType.FOUNDATION)) {
          hints.push(`${i+1}번째 열의 ${topCard.suit} ${topCard.rank}를 파운데이션으로 이동 가능`);
        }
      }
      
      for (let j = 0; j < gameState.tableau.length; j++) {
        if (i !== j && canMoveCard(topCard, gameState.tableau[j], PileType.TABLEAU)) {
          hints.push(`${i+1}번째 열의 ${topCard.suit} ${topCard.rank}를 ${j+1}번째 열로 이동 가능`);
        }
      }
    }
  }

  return hints;
};