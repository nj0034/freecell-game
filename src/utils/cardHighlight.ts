import { Card, GameState } from '../types/game.types';
import { canSelectCards, getMaxMovableCards } from './gameLogic';

export interface CardHighlight {
  level: 'high' | 'medium' | 'low' | 'none';
  maxMovable: number;
  cardsInSequence: number;
  canMove: boolean;
}

/**
 * 각 테이블로 컬럼의 카드별 이동 가능성을 분석하여 하이라이트 레벨 결정
 * 프리셀 빈칸 개수 + 1 만큼의 카드가 개별적으로 이동 가능하도록 강조
 */
export const calculateCardHighlights = (gameState: GameState): CardHighlight[][] => {
  // 빈 프리셀과 빈 테이블로 컬럼 수 계산
  const emptyFreeCells = gameState.freeCells.filter(cell => cell === null).length;
  const emptyTableauColumns = gameState.tableau.filter(column => column.length === 0).length;
  
  // 각 컬럼별 하이라이트 정보 계산
  return gameState.tableau.map((column, columnIndex) => {
    if (column.length === 0) return [];
    
    // 기본적으로 모든 카드는 강조되지 않음
    const highlights: CardHighlight[] = new Array(column.length).fill({
      level: 'none' as const,
      maxMovable: 0,
      cardsInSequence: 0,
      canMove: false
    });
    
    // 맨 뒤 카드부터 프리셀 빈칸 + 1 개수만큼 강조
    // 단, 유효한 시퀀스인 카드들만 강조
    const maxIndividualMovable = emptyFreeCells + 1;
    let highlightedCount = 0;
    
    for (let cardIndex = column.length - 1; cardIndex >= 0 && highlightedCount < maxIndividualMovable; cardIndex--) {
      // 이 카드부터 끝까지가 유효한 시퀀스인지 확인
      if (!canSelectCards(column, cardIndex)) {
        break; // 유효하지 않은 시퀀스이면 더 이상 진행하지 않음
      }
      
      // 이 위치부터 이동할 카드 수
      const cardsToMove = column.length - cardIndex;
      
      // 최대 이동 가능 카드 수 계산 (멀티카드 이동 규칙)
      const maxMovableToOccupied = getMaxMovableCards(emptyFreeCells, emptyTableauColumns);
      const maxMovableToEmpty = getMaxMovableCards(emptyFreeCells, Math.max(0, emptyTableauColumns - 1));
      const maxMovable = Math.max(maxMovableToOccupied, maxMovableToEmpty);
      
      // 개별 카드로 이동 가능한지 확인 (프리셀 + 1)
      const canMoveIndividually = highlightedCount < maxIndividualMovable;
      // 시퀀스 전체로 이동 가능한지 확인
      const canMoveAsSequence = cardsToMove <= maxMovable;
      
      const canMove = canMoveIndividually || canMoveAsSequence;
      
      if (!canMove) {
        break; // 이동할 수 없으면 더 이상 진행하지 않음
      }
      
      // 하이라이트 레벨 결정
      let level: 'high' | 'medium' | 'low' | 'none';
      
      if (canMoveIndividually && canMoveAsSequence) {
        level = 'high';   // 개별 + 시퀀스 모두 이동 가능
      } else if (canMoveIndividually) {
        level = 'medium'; // 개별적으로만 이동 가능
      } else if (canMoveAsSequence) {
        level = 'low';    // 시퀀스로만 이동 가능
      } else {
        level = 'none';
      }
      
      const highlight: CardHighlight = {
        level,
        maxMovable,
        cardsInSequence: cardsToMove,
        canMove
      };
      
      highlights[cardIndex] = highlight;
      highlightedCount++;
    }
    
    return highlights;
  });
};

/**
 * 하이라이트 레벨에 따른 CSS 스타일 반환
 */
export const getHighlightStyles = (highlight: CardHighlight): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    transition: 'all 0.3s ease',
    position: 'relative'
  };
  
  switch (highlight.level) {
    case 'high':
      return {
        ...baseStyle,
        filter: 'brightness(1.2) saturate(1.15)',
        boxShadow: '0 0 12px rgba(76, 175, 80, 0.4), 0 0 25px rgba(76, 175, 80, 0.2)',
        transform: 'scale(1.01)',
        opacity: 1,
        zIndex: 5
      };
      
    case 'medium':
      return {
        ...baseStyle,
        filter: 'brightness(1.1) saturate(1.08)',
        boxShadow: '0 0 8px rgba(255, 193, 7, 0.4), 0 0 16px rgba(255, 193, 7, 0.15)',
        opacity: 0.98
      };
      
    case 'low':
      return {
        ...baseStyle,
        filter: 'brightness(1.05)',
        boxShadow: '0 0 6px rgba(255, 152, 0, 0.3)',
        opacity: 0.95
      };
      
    case 'none':
    default:
      return {
        ...baseStyle,
        filter: 'brightness(0.75) saturate(0.7) grayscale(0.2)',
        opacity: 0.7
      };
  }
};

/**
 * 하이라이트 툴팁 텍스트 생성
 */
export const getHighlightTooltip = (highlight: CardHighlight): string => {
  if (!highlight.canMove) {
    return '이동 불가: 프리셀 공간이 부족합니다';
  }
  
  const { level, maxMovable, cardsInSequence } = highlight;
  
  switch (level) {
    case 'high':
      return `🟢 개별/연속 이동 가능: 이 카드부터 ${cardsInSequence}장 (최대 ${maxMovable}장 연속이동 가능)`;
    case 'medium':
      return `🟡 개별 이동만 가능: 프리셀 이용하여 개별 이동`;
    case 'low':
      return `🟠 연속 이동만 가능: ${cardsInSequence}장을 한번에 이동`;
    default:
      return '이동 불가';
  }
};

/**
 * 게임 상태가 변경될 때 하이라이트 업데이트가 필요한지 확인
 */
export const shouldUpdateHighlights = (
  prevGameState: GameState,
  currentGameState: GameState
): boolean => {
  // 프리셀이나 테이블로 상태가 변경된 경우 업데이트 필요
  const prevEmptyFreeCells = prevGameState.freeCells.filter(cell => cell === null).length;
  const currentEmptyFreeCells = currentGameState.freeCells.filter(cell => cell === null).length;
  
  const prevEmptyTableau = prevGameState.tableau.filter(column => column.length === 0).length;
  const currentEmptyTableau = currentGameState.tableau.filter(column => column.length === 0).length;
  
  // 카드 배치가 변경된 경우
  const tableauChanged = JSON.stringify(prevGameState.tableau) !== JSON.stringify(currentGameState.tableau);
  
  return (
    prevEmptyFreeCells !== currentEmptyFreeCells ||
    prevEmptyTableau !== currentEmptyTableau ||
    tableauChanged
  );
};