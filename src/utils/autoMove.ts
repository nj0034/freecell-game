import { Card, GameState, PileType, PileLocation } from '../types/game.types';
import { canMoveCard } from './gameLogic';
import { isSafeToAutoMove } from './safeAutoMove';

// 카드의 자동 이동 위치 찾기
export const findAutoMoveDestination = (
  card: Card,
  fromLocation: PileLocation,
  gameState: GameState,
  checkSafeMove: boolean = true
): PileLocation | null => {
  // 1. 먼저 파운데이션으로 이동 가능한지 확인 (우선순위 높음)
  // 안전 이동 체크가 활성화된 경우 안전한 이동만 허용
  for (let i = 0; i < gameState.foundations.length; i++) {
    if (canMoveCard(card, gameState.foundations[i], PileType.FOUNDATION)) {
      if (!checkSafeMove || isSafeToAutoMove(card, gameState)) {
        return { type: PileType.FOUNDATION, index: i };
      }
    }
  }
  
  // 2. 프리셀에서의 이동인 경우, 테이블로로 이동 가능한지 확인
  if (fromLocation.type === PileType.FREECELL) {
    for (let i = 0; i < gameState.tableau.length; i++) {
      if (canMoveCard(card, gameState.tableau[i], PileType.TABLEAU)) {
        return { type: PileType.TABLEAU, index: i };
      }
    }
  }
  
  // 3. 테이블로에서의 이동인 경우
  if (fromLocation.type === PileType.TABLEAU) {
    // 다른 테이블로 컬럼으로 이동 가능한지 확인
    for (let i = 0; i < gameState.tableau.length; i++) {
      if (i !== fromLocation.index && canMoveCard(card, gameState.tableau[i], PileType.TABLEAU)) {
        // 빈 컬럼으로의 이동은 킹만 가능
        if (gameState.tableau[i].length === 0 && card.rank === 13) {
          return { type: PileType.TABLEAU, index: i };
        }
        // 빈 컬럼이 아닌 경우
        else if (gameState.tableau[i].length > 0) {
          return { type: PileType.TABLEAU, index: i };
        }
      }
    }
    
    // 4. 프리셀로 이동 가능한지 확인 (마지막 옵션)
    for (let i = 0; i < gameState.freeCells.length; i++) {
      if (gameState.freeCells[i] === null) {
        return { type: PileType.FREECELL, index: i };
      }
    }
  }
  
  return null;
};

// 자동 이동 실행
export const executeAutoMove = (
  card: Card,
  fromLocation: PileLocation,
  toLocation: PileLocation,
  gameState: GameState
): GameState => {
  const newState = { ...gameState };
  
  // 원래 위치에서 카드 제거
  if (fromLocation.type === PileType.TABLEAU) {
    const sourceColumn = [...newState.tableau[fromLocation.index]];
    const cardIndex = sourceColumn.findIndex(c => c.id === card.id);
    
    if (cardIndex !== -1) {
      // 해당 카드부터 끝까지 모든 카드 이동 (연속된 카드들)
      const movedCards = sourceColumn.splice(cardIndex);
      newState.tableau[fromLocation.index] = sourceColumn;
      
      // 대상 위치에 카드 추가
      if (toLocation.type === PileType.FOUNDATION) {
        // 파운데이션은 한 장씩만 이동
        if (movedCards.length === 1) {
          newState.foundations[toLocation.index].push(movedCards[0]);
          newState.score += 10;
        }
      } else if (toLocation.type === PileType.TABLEAU) {
        newState.tableau[toLocation.index].push(...movedCards);
        newState.score += 5;
      } else if (toLocation.type === PileType.FREECELL && movedCards.length === 1) {
        newState.freeCells[toLocation.index] = movedCards[0];
      }
    }
  } else if (fromLocation.type === PileType.FREECELL) {
    const movedCard = newState.freeCells[fromLocation.index];
    if (movedCard) {
      newState.freeCells[fromLocation.index] = null;
      
      if (toLocation.type === PileType.FOUNDATION) {
        newState.foundations[toLocation.index].push(movedCard);
        newState.score += 10;
      } else if (toLocation.type === PileType.TABLEAU) {
        newState.tableau[toLocation.index].push(movedCard);
        newState.score += 5;
      }
    }
  }
  
  // 이동 횟수 증가
  newState.moves += 1;
  
  // 이동 기록 추가
  newState.moveHistory.push({
    from: fromLocation,
    to: toLocation,
    cards: [card],
    timestamp: Date.now()
  });
  
  return newState;
};

// 더블클릭으로 파운데이션 이동 (안전 이동 체크 포함)
export const tryMoveToFoundation = (
  card: Card,
  fromLocation: PileLocation,
  gameState: GameState,
  checkSafeMove: boolean = false // 더블클릭은 기본적으로 강제 이동 허용
): GameState | null => {
  // 파운데이션으로만 이동 시도
  for (let i = 0; i < gameState.foundations.length; i++) {
    if (canMoveCard(card, gameState.foundations[i], PileType.FOUNDATION)) {
      // 안전 이동 체크가 필요한 경우에만 확인
      if (!checkSafeMove || isSafeToAutoMove(card, gameState)) {
        const toLocation = { type: PileType.FOUNDATION, index: i };
        return executeAutoMove(card, fromLocation, toLocation, gameState);
      }
    }
  }
  
  return null;
};