import { Card, GameState, PileType } from '../types/game.types';
import { checkWinCondition } from './gameLogic';

/**
 * 카드를 한 장씩 순차적으로 애니메이션과 함께 이동하는 유틸리티
 */

export interface SequentialMoveOptions {
  delay?: number; // 각 카드 이동 사이의 지연 시간 (ms)
  animationDuration?: number; // 각 카드의 애니메이션 지속 시간 (ms)
}

export const moveCardsSequentially = async (
  cards: Card[],
  fromColumnIndex: number,
  toColumnIndex: number,
  fromCardIndex: number,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  options: SequentialMoveOptions = {}
): Promise<void> => {
  const { delay = 200, animationDuration = 300 } = options;
  
  const cardsToMove = cards.slice(fromCardIndex);
  if (cardsToMove.length === 0) return;

  // 각 카드를 순차적으로 이동
  for (let i = 0; i < cardsToMove.length; i++) {
    const cardToMove = cardsToMove[i];
    
    // 카드 이동 실행
    await new Promise<void>((resolve) => {
      setGameState(prevState => {
        const newState = { ...prevState };
        
        // 원본 컬럼에서 카드 제거 (현재 카드 인덱스 계산)
        const sourceColumn = [...newState.tableau[fromColumnIndex]];
        const currentCardIndex = sourceColumn.findIndex(c => c.id === cardToMove.id);
        
        if (currentCardIndex !== -1) {
          const [movedCard] = sourceColumn.splice(currentCardIndex, 1);
          newState.tableau[fromColumnIndex] = sourceColumn;
          
          // 대상 컬럼에 카드 추가
          const targetColumn = [...newState.tableau[toColumnIndex]];
          targetColumn.push(movedCard);
          newState.tableau[toColumnIndex] = targetColumn;
          
          // 첫 번째 카드 이동 시에만 점수와 이동 횟수 업데이트
          if (i === 0) {
            newState.moves += 1;
            newState.score += 5;
            
            // 이동 기록 추가 (전체 카드 이동으로 기록)
            newState.moveHistory.push({
              from: { type: PileType.TABLEAU, index: fromColumnIndex },
              to: { type: PileType.TABLEAU, index: toColumnIndex },
              cards: cardsToMove,
              timestamp: Date.now()
            });
          }
        }
        
        return newState;
      });
      
      // 애니메이션 완료 후 다음 카드로 진행
      setTimeout(() => {
        resolve();
      }, animationDuration);
    });
    
    // 마지막 카드가 아니라면 지연
    if (i < cardsToMove.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * 단일 카드의 순차 이동 (더블클릭이나 자동 이동용)
 */
export const moveSingleCardWithAnimation = async (
  card: Card,
  from: { type: PileType; index: number },
  to: { type: PileType; index: number },
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  animationDuration: number = 300
): Promise<void> => {
  return new Promise<void>((resolve) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      
      // 원본에서 카드 제거
      if (from.type === PileType.TABLEAU) {
        const sourceColumn = [...newState.tableau[from.index]];
        const cardIndex = sourceColumn.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          sourceColumn.splice(cardIndex, 1);
          newState.tableau[from.index] = sourceColumn;
        }
      } else if (from.type === PileType.FREECELL) {
        newState.freeCells[from.index] = null;
      }
      
      // 대상에 카드 추가
      if (to.type === PileType.TABLEAU) {
        const targetColumn = [...newState.tableau[to.index]];
        targetColumn.push(card);
        newState.tableau[to.index] = targetColumn;
      } else if (to.type === PileType.FOUNDATION) {
        const targetFoundation = [...newState.foundations[to.index]];
        targetFoundation.push(card);
        newState.foundations[to.index] = targetFoundation;
        
        // 파운데이션에 카드 추가 후 승리 조건 확인
        newState.isGameWon = checkWinCondition(newState.foundations);
      } else if (to.type === PileType.FREECELL) {
        newState.freeCells[to.index] = card;
      }
      
      // 점수와 이동 횟수 업데이트
      newState.moves += 1;
      newState.score += to.type === PileType.FOUNDATION ? 15 : 5;
      
      // 이동 기록 추가
      newState.moveHistory.push({
        from,
        to,
        cards: [card],
        timestamp: Date.now()
      });
      
      return newState;
    });
    
    setTimeout(() => {
      resolve();
    }, animationDuration);
  });
};

/**
 * 여러 카드를 파운데이션으로 순차적으로 이동
 */
export const moveMultipleCardsToFoundationSequentially = async (
  moves: Array<{
    card: Card;
    from: { type: PileType; index: number };
    to: { type: PileType; index: number };
  }>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  options: SequentialMoveOptions = {}
): Promise<void> => {
  const { delay = 100, animationDuration = 200 } = options;
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    
    await new Promise<void>((resolve) => {
      setGameState(prevState => {
        const newState = { ...prevState };
        
        // 원본에서 카드 제거
        if (move.from.type === PileType.TABLEAU) {
          const sourceColumn = [...newState.tableau[move.from.index]];
          const cardIndex = sourceColumn.findIndex(c => c.id === move.card.id);
          if (cardIndex !== -1) {
            sourceColumn.splice(cardIndex, 1);
            newState.tableau[move.from.index] = sourceColumn;
          }
        } else if (move.from.type === PileType.FREECELL) {
          newState.freeCells[move.from.index] = null;
        }
        
        // 파운데이션에 카드 추가
        if (move.to.type === PileType.FOUNDATION) {
          const targetFoundation = [...newState.foundations[move.to.index]];
          targetFoundation.push(move.card);
          newState.foundations[move.to.index] = targetFoundation;
          
          // 파운데이션에 카드 추가 후 승리 조건 확인
          newState.isGameWon = checkWinCondition(newState.foundations);
        }
        
        // 점수와 이동 횟수 업데이트
        newState.moves += 1;
        newState.score += 15; // 파운데이션으로 이동 시 점수
        
        // 이동 기록 추가
        newState.moveHistory.push({
          from: move.from,
          to: move.to,
          cards: [move.card],
          timestamp: Date.now()
        });
        
        return newState;
      });
      
      setTimeout(() => {
        resolve();
      }, animationDuration);
    });
    
    // 마지막 카드가 아니라면 지연
    if (i < moves.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};