import { Card, GameState, PileType, PileLocation } from '../types/game.types';
import { canMoveCard, checkWinCondition } from './gameLogic';
import { isSafeToAutoMove } from './safeAutoMove';
import { calculateMoveScore } from './scoreSystem';

// 카드의 자동 이동 위치 찾기
export const findAutoMoveDestination = (
  card: Card,
  fromLocation: PileLocation,
  gameState: GameState,
  checkSafeMove: boolean = true
): PileLocation | null => {
  // 1. 첫 번째 우선순위: 파운데이션 (홈셀)
  // 안전 이동 체크가 활성화된 경우 안전한 이동만 허용
  for (let i = 0; i < gameState.foundations.length; i++) {
    if (canMoveCard(card, gameState.foundations[i], PileType.FOUNDATION)) {
      if (!checkSafeMove || isSafeToAutoMove(card, gameState)) {
        return { type: PileType.FOUNDATION, index: i };
      }
    }
  }
  
  // 2. 두 번째 우선순위: 카드가 있는 테이블로 컬럼
  for (let i = 0; i < gameState.tableau.length; i++) {
    // 같은 테이블로 컬럼에서 이동하는 경우만 체크
    if (fromLocation.type === PileType.TABLEAU && i === fromLocation.index) continue;
    
    if (gameState.tableau[i].length > 0) {
      if (canMoveCard(card, gameState.tableau[i], PileType.TABLEAU)) {
        return { type: PileType.TABLEAU, index: i };
      }
    }
  }
  
  // 3. 세 번째 우선순위: 빈 테이블로 컬럼 (빈줄)
  // 모든 카드가 빈 컬럼으로 이동 가능
  for (let i = 0; i < gameState.tableau.length; i++) {
    // 같은 테이블로 컬럼에서 이동하는 경우만 체크
    if (fromLocation.type === PileType.TABLEAU && i === fromLocation.index) continue;
    
    if (gameState.tableau[i].length === 0) {
      return { type: PileType.TABLEAU, index: i };
    }
  }
  
  // 4. 마지막 우선순위: 프리셀
  // 테이블로에서의 이동인 경우에만 프리셀 사용
  if (fromLocation.type === PileType.TABLEAU) {
    for (let i = 0; i < gameState.freeCells.length; i++) {
      if (gameState.freeCells[i] === null) {
        return { type: PileType.FREECELL, index: i };
      }
    }
  }
  
  // 프리셀에서의 이동인 경우, 이미 위에서 테이블로 체크를 했으므로 추가 처리 불필요
  
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
          // Check if completing a suit (13 cards)
          const isCompletingSuit = newState.foundations[toLocation.index].length === 13;
          newState.score += calculateMoveScore('tableau', 'foundation', isCompletingSuit);
          
          // 파운데이션에 카드 추가 후 승리 조건 확인
          newState.isGameWon = checkWinCondition(newState.foundations);
        }
      } else if (toLocation.type === PileType.TABLEAU) {
        const wasEmpty = newState.tableau[toLocation.index].length === 0;
        newState.tableau[toLocation.index].push(...movedCards);
        newState.score += calculateMoveScore('tableau', 'tableau', false, wasEmpty);
      } else if (toLocation.type === PileType.FREECELL && movedCards.length === 1) {
        newState.freeCells[toLocation.index] = movedCards[0];
        newState.score += calculateMoveScore('tableau', 'freecell');
      }
    }
  } else if (fromLocation.type === PileType.FREECELL) {
    const movedCard = newState.freeCells[fromLocation.index];
    if (movedCard) {
      newState.freeCells[fromLocation.index] = null;
      
      if (toLocation.type === PileType.FOUNDATION) {
        newState.foundations[toLocation.index].push(movedCard);
        const isCompletingSuit = newState.foundations[toLocation.index].length === 13;
        newState.score += calculateMoveScore('freecell', 'foundation', isCompletingSuit);
        
        // 파운데이션에 카드 추가 후 승리 조건 확인
        newState.isGameWon = checkWinCondition(newState.foundations);
      } else if (toLocation.type === PileType.TABLEAU) {
        const wasEmpty = newState.tableau[toLocation.index].length === 0;
        newState.tableau[toLocation.index].push(movedCard);
        newState.score += calculateMoveScore('freecell', 'tableau', false, wasEmpty);
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