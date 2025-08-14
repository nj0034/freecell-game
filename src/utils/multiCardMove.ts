import { Card, GameState, PileType } from '../types/game.types';
import { canSelectCards, getMaxMovableCards } from './gameLogic';

/**
 * 여러 카드를 한 번에 이동할 수 있는지 확인
 * 프리셀 규칙: (빈 프리셀 + 1) * 2^(빈 테이블로 컬럼)
 */
export const canMoveMultipleCards = (
  cards: Card[],
  fromIndex: number,
  gameState: GameState
): { canMove: boolean; maxMovable: number; numCards: number } => {
  // 1. 먼저 카드들이 연속된 시퀀스인지 확인 (교대 색상, 내림차순)
  if (!canSelectCards(cards, fromIndex)) {
    return { canMove: false, maxMovable: 0, numCards: 0 };
  }
  
  // 2. 이동하려는 카드 수 계산
  const numCardsToMove = cards.length - fromIndex;
  
  // 3. 빈 프리셀 수 계산
  const emptyFreeCells = gameState.freeCells.filter(cell => cell === null).length;
  
  // 4. 빈 테이블로 컬럼 수 계산
  const emptyTableauColumns = gameState.tableau.filter(column => column.length === 0).length;
  
  // 5. 최대 이동 가능한 카드 수 계산
  const maxMovable = getMaxMovableCards(emptyFreeCells, emptyTableauColumns);
  
  // 6. 이동 가능 여부와 정보 반환
  return {
    canMove: numCardsToMove <= maxMovable,
    maxMovable,
    numCards: numCardsToMove
  };
};

/**
 * 테이블로 컬럼 간 여러 카드 이동 실행
 */
export const moveMultipleCards = (
  cards: Card[],
  fromColumnIndex: number,
  toColumnIndex: number,
  fromCardIndex: number,
  gameState: GameState
): GameState | null => {
  // 이동 가능한지 먼저 확인
  const moveCheck = canMoveMultipleCards(cards, fromCardIndex, gameState);
  if (!moveCheck.canMove) {
    console.log(`Cannot move ${moveCheck.numCards} cards - max allowed is ${moveCheck.maxMovable}`);
    return null;
  }
  
  const newState = { ...gameState };
  
  // 원본 컬럼에서 카드들 제거
  const sourceColumn = [...newState.tableau[fromColumnIndex]];
  const movedCards = sourceColumn.splice(fromCardIndex);
  newState.tableau[fromColumnIndex] = sourceColumn;
  
  // 대상 컬럼에 카드들 추가
  const targetColumn = [...newState.tableau[toColumnIndex]];
  targetColumn.push(...movedCards);
  newState.tableau[toColumnIndex] = targetColumn;
  
  // 이동 횟수와 점수 업데이트
  newState.moves += 1;
  newState.score += 5;
  
  // 이동 기록 추가
  newState.moveHistory.push({
    from: { type: PileType.TABLEAU, index: fromColumnIndex },
    to: { type: PileType.TABLEAU, index: toColumnIndex },
    cards: movedCards,
    timestamp: Date.now()
  });
  
  console.log(`Moved ${movedCards.length} cards from column ${fromColumnIndex} to ${toColumnIndex}`);
  return newState;
};

/**
 * 드래그 가능한 카드 수 확인
 * 선택한 위치부터 연속된 시퀀스이면서 이동 가능한 수량 내에 있는지 확인
 */
export const canDragCards = (
  cards: Card[],
  fromIndex: number,
  gameState: GameState
): boolean => {
  // 마지막 카드는 항상 드래그 가능
  if (fromIndex === cards.length - 1) {
    return true;
  }
  
  // 연속된 시퀀스인지 확인
  if (!canSelectCards(cards, fromIndex)) {
    return false;
  }
  
  // 이동 가능한 수량 내에 있는지 확인
  const moveCheck = canMoveMultipleCards(cards, fromIndex, gameState);
  return moveCheck.canMove;
};

/**
 * 여러 카드를 클릭으로 이동할 수 있는 대상 찾기
 */
export const findMultiCardDestination = (
  cards: Card[],
  fromIndex: number,
  fromColumnIndex: number,
  gameState: GameState
): { columnIndex: number; canMove: boolean } | null => {
  // 이동할 카드들
  const cardsToMove = cards.slice(fromIndex);
  if (cardsToMove.length === 0) return null;
  
  // 맨 아래 카드 (이동할 카드 중 첫 번째)
  const bottomCard = cardsToMove[0];
  
  // 각 테이블로 컬럼 확인
  for (let i = 0; i < gameState.tableau.length; i++) {
    // 같은 컬럼은 건너뛰기
    if (i === fromColumnIndex) continue;
    
    const targetColumn = gameState.tableau[i];
    
    // 빈 컬럼인 경우
    if (targetColumn.length === 0) {
      return { columnIndex: i, canMove: true };
    }
    
    // 마지막 카드와 연결 가능한지 확인
    const topCard = targetColumn[targetColumn.length - 1];
    if (topCard.color !== bottomCard.color && topCard.rank === bottomCard.rank + 1) {
      return { columnIndex: i, canMove: true };
    }
  }
  
  return null;
};