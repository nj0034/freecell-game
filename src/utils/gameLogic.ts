import { Card, Suit, Rank, CardStack, PileLocation, PileType, GameState } from '../types/game.types';
import { v4 as uuidv4 } from 'uuid';
import { DifficultyLevel, generateGameForDifficulty, difficultyConfigs } from './difficulty';

// 덱 생성
export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  
  for (const suit of suits) {
    const color = (suit === Suit.HEARTS || suit === Suit.DIAMONDS) ? 'red' : 'black';
    
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: uuidv4(),
        suit,
        rank: rank as Rank,
        color,
        faceUp: true,
        isDragging: false
      });
    }
  }
  
  return deck;
};

// 덱 셔플
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 게임 초기화 (난이도 지원)
export const initializeGame = (difficulty: DifficultyLevel = DifficultyLevel.MEDIUM): GameState => {
  const deck = generateGameForDifficulty(difficulty);
  const tableau: CardStack[] = [];
  
  // 프리셀 게임 배치: 첫 4열에 7장, 나머지 4열에 6장
  for (let i = 0; i < 8; i++) {
    const columnSize = i < 4 ? 7 : 6;
    tableau.push([]);
    
    for (let j = 0; j < columnSize; j++) {
      const card = deck.pop();
      if (card) {
        tableau[i].push(card);
      }
    }
  }
  
  // Expert 난이도에서는 프리셀 하나를 비활성화
  const config = difficultyConfigs[difficulty];
  const freeCells: (Card | null)[] = [];
  for (let i = 0; i < config.startingFreeCells; i++) {
    freeCells.push(null);
  }
  
  return {
    tableau,
    foundations: [[], [], [], []],
    freeCells,
    moveHistory: [],
    selectedCards: [],
    score: 0,
    moves: 0,
    isGameWon: false,
    isAutoCompleteActive: false,
    testMode: false,
    difficulty
  };
};

// 카드 이동 가능 여부 확인
export const canMoveCard = (
  card: Card,
  targetPile: CardStack | Card | null,
  targetType: PileType,
  targetIndex?: number
): boolean => {
  switch (targetType) {
    case PileType.FOUNDATION:
      return canMoveToFoundation(card, targetPile as CardStack);
    case PileType.FREECELL:
      return canMoveToFreeCell(targetPile as Card | null);
    case PileType.TABLEAU:
      return canMoveToTableau(card, targetPile as CardStack);
    default:
      return false;
  }
};

// 파운데이션으로 이동 가능 확인
const canMoveToFoundation = (card: Card, foundation: CardStack): boolean => {
  if (foundation.length === 0) {
    return card.rank === Rank.ACE;
  }
  
  const topCard = foundation[foundation.length - 1];
  return card.suit === topCard.suit && card.rank === topCard.rank + 1;
};

// 프리셀로 이동 가능 확인
const canMoveToFreeCell = (freeCell: Card | null): boolean => {
  return freeCell === null;
};

// 테이블로로 이동 가능 확인
const canMoveToTableau = (card: Card, tableau: CardStack): boolean => {
  if (tableau.length === 0) {
    return true; // 빈 컬럼에는 모든 카드 이동 가능
  }
  
  const topCard = tableau[tableau.length - 1];
  return card.color !== topCard.color && card.rank === topCard.rank - 1;
};

// 연속된 카드 선택 가능 여부 확인
export const canSelectCards = (cards: Card[], fromIndex: number): boolean => {
  for (let i = fromIndex; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];
    
    if (current.color === next.color || current.rank !== next.rank + 1) {
      return false;
    }
  }
  return true;
};

// 이동 가능한 카드 수 계산 (프리셀 규칙)
export const getMaxMovableCards = (
  emptyFreeCells: number,
  emptyTableauColumns: number
): number => {
  return (emptyFreeCells + 1) * Math.pow(2, emptyTableauColumns);
};

// 게임 승리 조건 확인
export const checkWinCondition = (foundations: CardStack[]): boolean => {
  return foundations.every(foundation => foundation.length === 13);
};

// 자동 완성 가능 여부 확인
export const canAutoComplete = (gameState: GameState): boolean => {
  // 모든 카드가 파운데이션에 올라갈 수 있는지 확인
  const allTableauCards = gameState.tableau.flat();
  const allFreeCellCards = gameState.freeCells.filter(c => c !== null) as Card[];
  const allCards = [...allTableauCards, ...allFreeCellCards];
  
  // 가장 낮은 파운데이션 카드 확인
  const minFoundationRank = Math.min(
    ...gameState.foundations.map(f => f.length === 0 ? 0 : f[f.length - 1].rank)
  );
  
  // 모든 카드가 파운데이션 최소값 + 2 이상인지 확인
  return allCards.every(card => card.rank <= minFoundationRank + 2);
};

// 힌트 찾기
export const findHint = (gameState: GameState): PileLocation[] | null => {
  // 파운데이션으로 이동 가능한 카드 찾기
  for (let i = 0; i < gameState.tableau.length; i++) {
    const column = gameState.tableau[i];
    if (column.length > 0) {
      const card = column[column.length - 1];
      for (let j = 0; j < gameState.foundations.length; j++) {
        if (canMoveToFoundation(card, gameState.foundations[j])) {
          return [
            { type: PileType.TABLEAU, index: i },
            { type: PileType.FOUNDATION, index: j }
          ];
        }
      }
    }
  }
  
  // 테이블로 간 이동 가능한 카드 찾기
  for (let i = 0; i < gameState.tableau.length; i++) {
    const fromColumn = gameState.tableau[i];
    if (fromColumn.length > 0) {
      for (let j = 0; j < gameState.tableau.length; j++) {
        if (i !== j) {
          const toColumn = gameState.tableau[j];
          const card = fromColumn[fromColumn.length - 1];
          if (canMoveToTableau(card, toColumn)) {
            return [
              { type: PileType.TABLEAU, index: i },
              { type: PileType.TABLEAU, index: j }
            ];
          }
        }
      }
    }
  }
  
  return null;
};

// 점수 계산
export const calculateScore = (move: PileLocation, gameState: GameState): number => {
  if (move.type === PileType.FOUNDATION) {
    return 10; // 파운데이션으로 이동 시 10점
  } else if (move.type === PileType.TABLEAU) {
    return 5; // 테이블로 간 이동 시 5점
  }
  return 0;
};