import { Card, GameState, PileLocation, PileType } from '../types/game.types';
import { canMoveCard } from './gameLogic';

/**
 * 파운데이션으로 이동 가능한 모든 카드 찾기 (안전 여부 관계없이)
 */
export const findAllMovesToFoundations = (gameState: GameState): Array<{
  card: Card;
  from: PileLocation;
  to: PileLocation;
}> => {
  const moves: Array<{
    card: Card;
    from: PileLocation;
    to: PileLocation;
  }> = [];
  
  let foundMove = true;
  const simulatedState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  // 이동 가능한 카드가 없을 때까지 반복
  while (foundMove) {
    foundMove = false;
    
    // 태블로의 각 컬럼 최상위 카드 확인
    for (let colIndex = 0; colIndex < simulatedState.tableau.length; colIndex++) {
      const column = simulatedState.tableau[colIndex];
      if (column.length > 0) {
        const topCard = column[column.length - 1];
        if (topCard.faceUp) {
          // 이 카드가 어느 파운데이션으로 갈 수 있는지 확인
          for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveCard(topCard, simulatedState.foundations[foundationIndex], PileType.FOUNDATION, foundationIndex)) {
              moves.push({
                card: topCard,
                from: { type: PileType.TABLEAU, index: colIndex },
                to: { type: PileType.FOUNDATION, index: foundationIndex }
              });
              
              // 시뮬레이션 상태 업데이트
              column.pop();
              if (column.length > 0 && !column[column.length - 1].faceUp) {
                column[column.length - 1].faceUp = true;
              }
              simulatedState.foundations[foundationIndex].push(topCard);
              
              foundMove = true;
              break;
            }
          }
        }
      }
      if (foundMove) break;
    }
    
    // 프리셀의 카드 확인
    if (!foundMove) {
      for (let cellIndex = 0; cellIndex < simulatedState.freeCells.length; cellIndex++) {
        const card = simulatedState.freeCells[cellIndex];
        if (card) {
          // 이 카드가 어느 파운데이션으로 갈 수 있는지 확인
          for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveCard(card, simulatedState.foundations[foundationIndex], PileType.FOUNDATION, foundationIndex)) {
              moves.push({
                card: card,
                from: { type: PileType.FREECELL, index: cellIndex },
                to: { type: PileType.FOUNDATION, index: foundationIndex }
              });
              
              // 시뮬레이션 상태 업데이트
              simulatedState.freeCells[cellIndex] = null;
              simulatedState.foundations[foundationIndex].push(card);
              
              foundMove = true;
              break;
            }
          }
        }
        if (foundMove) break;
      }
    }
  }
  
  return moves;
};