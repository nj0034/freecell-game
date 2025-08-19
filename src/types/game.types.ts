// 카드 슈트 정의
export enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades'
}

// 카드 랭크 정의
export enum Rank {
  ACE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  JACK = 11,
  QUEEN = 12,
  KING = 13
}

// 카드 인터페이스
export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  color: 'red' | 'black';
  faceUp: boolean;
  isDragging: boolean;
}

// 카드 스택 타입
export type CardStack = Card[];

// 게임 영역 타입
export enum PileType {
  TABLEAU = 'tableau',
  FOUNDATION = 'foundation',
  FREECELL = 'freecell'
}

// 파일 위치 인터페이스
export interface PileLocation {
  type: PileType;
  index: number;
}

// 이동 정보 인터페이스
export interface Move {
  from: PileLocation;
  to: PileLocation;
  cards: Card[];
  timestamp: number;
}

// 애니메이션 상태
export interface AnimationState {
  isAnimating: boolean;
  movingCard: Card | null;
  fromPosition: { x: number; y: number } | null;
  toPosition: { x: number; y: number } | null;
}

// 게임 상태 인터페이스
export interface GameState {
  tableau: CardStack[];        // 8개의 테이블로 컬럼
  foundations: CardStack[];    // 4개의 파운데이션
  freeCells: (Card | null)[];  // 4개의 프리셀 (Expert 모드에서는 3개)
  moveHistory: Move[];
  selectedCards: Card[];
  score: number;
  moves: number;
  isGameWon: boolean;
  isAutoCompleteActive: boolean;
  testMode: boolean;           // 테스트 모드 플래그
  animationState?: AnimationState; // 애니메이션 상태
  difficulty?: string;         // 현재 난이도 레벨
}

// 드래그 정보 인터페이스
export interface DragInfo {
  cards: Card[];
  source: PileLocation;
}

// 애니메이션 설정
export interface AnimationConfig {
  duration: number;
  ease: string;
  stagger: number;
}