import { Card, GameState, PileLocation, PileType } from '../types/game.types';
import { canMoveCard } from './gameLogic';

/**
 * 카드가 안전하게 파운데이션으로 이동할 수 있는지 확인
 * 
 * 안전 조건:
 * - 빨간색 카드 r: r ≤ min(F[♣], F[♠]) + 1
 * - 검은색 카드 r: r ≤ min(F[♥], F[♦]) + 1
 * 
 * 이는 태블로에서 임시 배치용으로 필요할 수 있는 카드가
 * 조기에 파운데이션으로 이동하는 것을 방지합니다.
 */
export const isSafeToAutoMove = (card: Card, gameState: GameState): boolean => {
  // 파운데이션의 현재 최상위 카드 랭크 가져오기
  const getFoundationTopRank = (foundation: Card[]): number => {
    if (foundation.length === 0) return 0;
    return foundation[foundation.length - 1].rank;
  };

  // 각 파운데이션의 최상위 랭크
  const foundationRanks = {
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    spades: 0
  };

  // 각 파운데이션의 슈트 확인 (파운데이션은 순서가 정해져 있지 않을 수 있음)
  gameState.foundations.forEach((foundation, index) => {
    if (foundation.length > 0) {
      const suit = foundation[0].suit;
      foundationRanks[suit] = getFoundationTopRank(foundation);
    }
  });

  // 카드 색상에 따른 안전 조건 확인
  if (card.color === 'red') {
    // 빨간색 카드: 검은색 파운데이션의 최소값 + 1과 비교
    const minBlack = Math.min(foundationRanks.clubs, foundationRanks.spades);
    return card.rank <= minBlack + 1;
  } else {
    // 검은색 카드: 빨간색 파운데이션의 최소값 + 1과 비교
    const minRed = Math.min(foundationRanks.hearts, foundationRanks.diamonds);
    return card.rank <= minRed + 1;
  }
};

/**
 * 게임 상태에서 안전하게 자동 이동할 수 있는 모든 카드 찾기
 */
export const findSafeAutoMoves = (gameState: GameState): Array<{
  card: Card;
  from: PileLocation;
  to: PileLocation;
}> => {
  const safeMoves: Array<{
    card: Card;
    from: PileLocation;
    to: PileLocation;
  }> = [];

  // 태블로의 각 컬럼 최상위 카드 확인
  gameState.tableau.forEach((column, columnIndex) => {
    if (column.length > 0) {
      const topCard = column[column.length - 1];
      if (topCard.faceUp && isSafeToAutoMove(topCard, gameState)) {
        // 이 카드가 어느 파운데이션으로 갈 수 있는지 확인
        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
          const move = {
            from: { type: PileType.TABLEAU, index: columnIndex },
            to: { type: PileType.FOUNDATION, index: foundationIndex },
            cards: [topCard]
          };
          
          if (canMoveCard(topCard, gameState.foundations[foundationIndex], PileType.FOUNDATION)) {
            safeMoves.push({
              card: topCard,
              from: move.from,
              to: move.to
            });
            break; // 첫 번째 유효한 파운데이션만 사용
          }
        }
      }
    }
  });

  // 프리셀의 카드 확인
  gameState.freeCells.forEach((card, cellIndex) => {
    if (card && isSafeToAutoMove(card, gameState)) {
      // 이 카드가 어느 파운데이션으로 갈 수 있는지 확인
      for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
        const move = {
          from: { type: PileType.FREECELL, index: cellIndex },
          to: { type: PileType.FOUNDATION, index: foundationIndex },
          cards: [card]
        };
        
        if (canMoveCard(card, gameState.foundations[foundationIndex], PileType.FOUNDATION)) {
          safeMoves.push({
            card: card,
            from: move.from,
            to: move.to
          });
          break; // 첫 번째 유효한 파운데이션만 사용
        }
      }
    }
  });

  return safeMoves;
};

/**
 * 모든 안전한 자동 이동 수행
 * 연속적으로 안전한 이동이 있을 때까지 반복
 */
export const performAllSafeAutoMoves = (
  gameState: GameState,
  moveCard: (cards: Card[], from: PileLocation, to: PileLocation) => void
): number => {
  let moveCount = 0;
  let hasMoreMoves = true;

  while (hasMoreMoves) {
    const safeMoves = findSafeAutoMoves(gameState);
    
    if (safeMoves.length > 0) {
      // 첫 번째 안전한 이동 수행
      const move = safeMoves[0];
      moveCard([move.card], move.from, move.to);
      moveCount++;
    } else {
      hasMoreMoves = false;
    }
  }

  return moveCount;
};