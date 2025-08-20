import { Card, Suit, GameState } from '../types/game.types';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface DifficultyConfig {
  name: string;
  description: string;
  level: DifficultyLevel;
  guaranteedMoves: number; // 보장된 초기 이동 수
  shuffleIntensity: number; // 셔플 강도 (0-1)
  startingFreeCells: number; // 시작 시 비어있는 프리셀 수
  maxConsecutiveUndos: number; // 연속 undo 최대 횟수
}

export const difficultyConfigs: Record<DifficultyLevel, DifficultyConfig> = {
  [DifficultyLevel.EASY]: {
    name: 'Easy',
    description: 'More solvable deals with guaranteed opening moves',
    level: DifficultyLevel.EASY,
    guaranteedMoves: 8,
    shuffleIntensity: 0.3,
    startingFreeCells: 4,
    maxConsecutiveUndos: 5 // 5 undos
  },
  [DifficultyLevel.MEDIUM]: {
    name: 'Medium',
    description: 'Standard Freecell rules and randomization',
    level: DifficultyLevel.MEDIUM,
    guaranteedMoves: 4,
    shuffleIntensity: 0.5,
    startingFreeCells: 4,
    maxConsecutiveUndos: 3 // 3 undos
  },
  [DifficultyLevel.HARD]: {
    name: 'Hard',
    description: 'More challenging deals with fewer obvious moves',
    level: DifficultyLevel.HARD,
    guaranteedMoves: 2,
    shuffleIntensity: 0.7,
    startingFreeCells: 4,
    maxConsecutiveUndos: 2 // 2 undos
  },
  [DifficultyLevel.EXPERT]: {
    name: 'Expert',
    description: 'Very difficult deals requiring advanced strategy',
    level: DifficultyLevel.EXPERT,
    guaranteedMoves: 0,
    shuffleIntensity: 0.9,
    startingFreeCells: 3, // Expert mode starts with one less free cell
    maxConsecutiveUndos: 1 // 1 undo only
  }
};

/**
 * 난이도에 따라 덱을 셔플
 */
const shuffleDeck = (deck: Card[], intensity: number): Card[] => {
  const shuffled = [...deck];
  const iterations = Math.floor(intensity * 100) + 50;
  
  for (let i = 0; i < iterations; i++) {
    const j = Math.floor(Math.random() * shuffled.length);
    const k = Math.floor(Math.random() * shuffled.length);
    [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
  }
  
  return shuffled;
};

/**
 * 특정 난이도로 해결 가능한 게임을 생성
 */
export const generateGameForDifficulty = (difficulty: DifficultyLevel): Card[] => {
  const config = difficultyConfigs[difficulty];
  
  // 기본 덱 생성
  const suits: Suit[] = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  const deck: Card[] = [];
  
  suits.forEach(suit => {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank: rank as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
        color: suit === Suit.HEARTS || suit === Suit.DIAMONDS ? 'red' : 'black',
        faceUp: true,
        isDragging: false
      });
    }
  });
  
  // 난이도별 특별 처리
  if (difficulty === DifficultyLevel.EASY) {
    // Easy 모드: 에이스와 낮은 카드를 위쪽에 배치
    const aces = deck.filter(card => card.rank === 1);
    const lowCards = deck.filter(card => card.rank >= 2 && card.rank <= 4);
    const otherCards = deck.filter(card => card.rank > 4);
    
    // 가벼운 셔플
    const shuffledLow = shuffleDeck(lowCards, 0.3);
    const shuffledOthers = shuffleDeck(otherCards, config.shuffleIntensity);
    
    // 에이스를 앞쪽에, 낮은 카드를 중간에 배치
    return [...aces, ...shuffledLow, ...shuffledOthers];
  } else if (difficulty === DifficultyLevel.EXPERT) {
    // Expert 모드: 높은 카드를 아래쪽에 묻어서 난이도 증가
    const highCards = deck.filter(card => card.rank >= 10);
    const midCards = deck.filter(card => card.rank >= 5 && card.rank < 10);
    const lowCards = deck.filter(card => card.rank < 5);
    
    // 강한 셔플
    const shuffledHigh = shuffleDeck(highCards, config.shuffleIntensity);
    const shuffledMid = shuffleDeck(midCards, config.shuffleIntensity);
    const shuffledLow = shuffleDeck(lowCards, config.shuffleIntensity);
    
    // 높은 카드를 먼저 배치 (아래에 깔림)
    return [...shuffledHigh, ...shuffledMid, ...shuffledLow];
  } else {
    // Medium, Hard 모드: 일반 셔플
    return shuffleDeck(deck, config.shuffleIntensity);
  }
};

/**
 * 난이도 기반 힌트 시스템
 */
export const getDifficultyHints = (difficulty: DifficultyLevel): string[] => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return [
        'Look for Aces first - they can go straight to foundations',
        'Free up columns with low cards',
        'Use free cells strategically'
      ];
    case DifficultyLevel.MEDIUM:
      return [
        'Plan your moves ahead',
        'Try to keep at least one free cell available',
        'Focus on freeing up buried high cards'
      ];
    case DifficultyLevel.HARD:
      return [
        'Be very careful with free cell usage',
        'Sometimes you need to move backwards to progress',
        'Look for card sequences that can be moved together'
      ];
    case DifficultyLevel.EXPERT:
      return [
        'Every move counts - think carefully',
        'You have one less free cell to work with',
        'Master the art of temporary card storage'
      ];
    default:
      return [];
  }
};

/**
 * 게임이 해결 가능한지 빠르게 체크 (휴리스틱)
 */
export const isGameSolvable = (gameState: GameState): boolean => {
  // 간단한 휴리스틱 체크
  // 실제로는 더 복잡한 알고리즘이 필요하지만, 기본적인 체크만 수행
  
  // 모든 카드가 앞면인지 확인
  for (const column of gameState.tableau) {
    if (column.some(card => !card.faceUp)) {
      return false; // 뒷면 카드가 있으면 아직 해결 불가능
    }
  }
  
  // 프리셀이 모두 차있고 이동할 수 없는 경우
  const filledFreeCells = gameState.freeCells.filter(cell => cell !== null).length;
  if (filledFreeCells === 4) {
    // 프리셀에서 파운데이션으로 이동 가능한지 체크
    let canMoveFromFreeCell = false;
    for (const card of gameState.freeCells) {
      if (card) {
        for (const foundation of gameState.foundations) {
          if (foundation.length === 0 && card.rank === 1) {
            canMoveFromFreeCell = true;
            break;
          } else if (foundation.length > 0) {
            const topCard = foundation[foundation.length - 1];
            if (card.suit === topCard.suit && card.rank === topCard.rank + 1) {
              canMoveFromFreeCell = true;
              break;
            }
          }
        }
      }
    }
    if (!canMoveFromFreeCell) {
      return false;
    }
  }
  
  return true; // 기본적으로는 해결 가능하다고 가정
};