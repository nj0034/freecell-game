import { Card, Suit, Rank, CardStack, GameState } from '../types/game.types';
import { v4 as uuidv4 } from 'uuid';

// 테스트용 카드 생성
const createTestCard = (suit: Suit, rank: Rank): Card => ({
  id: uuidv4(),
  suit,
  rank,
  color: (suit === Suit.HEARTS || suit === Suit.DIAMONDS) ? 'red' : 'black',
  faceUp: true,
  isDragging: false
});

// 테스트 시나리오 1: 파운데이션 테스트 (에이스부터 순서대로 쌓기)
export const createFoundationTestState = (): GameState => {
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  
  // 첫 번째 열에 에이스들 배치
  tableau[0] = [
    createTestCard(Suit.HEARTS, Rank.ACE),
    createTestCard(Suit.DIAMONDS, Rank.ACE),
    createTestCard(Suit.CLUBS, Rank.ACE),
    createTestCard(Suit.SPADES, Rank.ACE)
  ];
  
  // 두 번째 열에 2들 배치
  tableau[1] = [
    createTestCard(Suit.HEARTS, Rank.TWO),
    createTestCard(Suit.DIAMONDS, Rank.TWO),
    createTestCard(Suit.CLUBS, Rank.TWO),
    createTestCard(Suit.SPADES, Rank.TWO)
  ];
  
  // 세 번째 열에 3들 배치
  tableau[2] = [
    createTestCard(Suit.HEARTS, Rank.THREE),
    createTestCard(Suit.DIAMONDS, Rank.THREE),
    createTestCard(Suit.CLUBS, Rank.THREE),
    createTestCard(Suit.SPADES, Rank.THREE)
  ];
  
  return {
    tableau,
    foundations: [[], [], [], []],
    freeCells: [null, null, null, null],
    moveHistory: [],
    selectedCards: [],
    score: 0,
    moves: 0,
    isGameWon: false,
    isAutoCompleteActive: false,
    testMode: true
  };
};

// 테스트 시나리오 2: 테이블로 이동 테스트 (빨강-검정 교대)
export const createTableauTestState = (): GameState => {
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  
  // 교대로 쌓을 수 있는 카드들
  tableau[0] = [
    createTestCard(Suit.SPADES, Rank.KING),    // 검정 K
    createTestCard(Suit.HEARTS, Rank.QUEEN),   // 빨강 Q
    createTestCard(Suit.CLUBS, Rank.JACK),     // 검정 J
  ];
  
  tableau[1] = [
    createTestCard(Suit.HEARTS, Rank.KING),    // 빨강 K
    createTestCard(Suit.SPADES, Rank.QUEEN),   // 검정 Q
    createTestCard(Suit.DIAMONDS, Rank.JACK),  // 빨강 J
  ];
  
  tableau[2] = [
    createTestCard(Suit.DIAMONDS, Rank.TEN),   // 빨강 10
    createTestCard(Suit.SPADES, Rank.NINE),    // 검정 9
    createTestCard(Suit.HEARTS, Rank.EIGHT),   // 빨강 8
  ];
  
  tableau[3] = [
    createTestCard(Suit.CLUBS, Rank.TEN),      // 검정 10
    createTestCard(Suit.HEARTS, Rank.NINE),    // 빨강 9
    createTestCard(Suit.SPADES, Rank.EIGHT),   // 검정 8
  ];
  
  return {
    tableau,
    foundations: [[], [], [], []],
    freeCells: [null, null, null, null],
    moveHistory: [],
    selectedCards: [],
    score: 0,
    moves: 0,
    isGameWon: false,
    isAutoCompleteActive: false,
    testMode: true
  };
};

// 테스트 시나리오 3: 프리셀 테스트
export const createFreeCellTestState = (): GameState => {
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  
  // 각 열에 하나씩 카드 배치
  tableau[0] = [createTestCard(Suit.HEARTS, Rank.KING)];
  tableau[1] = [createTestCard(Suit.DIAMONDS, Rank.QUEEN)];
  tableau[2] = [createTestCard(Suit.CLUBS, Rank.JACK)];
  tableau[3] = [createTestCard(Suit.SPADES, Rank.TEN)];
  tableau[4] = [createTestCard(Suit.HEARTS, Rank.NINE)];
  tableau[5] = [createTestCard(Suit.DIAMONDS, Rank.EIGHT)];
  tableau[6] = [createTestCard(Suit.CLUBS, Rank.SEVEN)];
  tableau[7] = [createTestCard(Suit.SPADES, Rank.SIX)];
  
  // 프리셀에 일부 카드 미리 배치
  const freeCells: (Card | null)[] = [
    createTestCard(Suit.HEARTS, Rank.ACE),
    createTestCard(Suit.SPADES, Rank.TWO),
    null,
    null
  ];
  
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
    testMode: true
  };
};

// 테스트 시나리오 4: 거의 완성된 게임 (자동 완성 테스트)
export const createAlmostWonTestState = (): GameState => {
  const foundations: CardStack[] = [[], [], [], []];
  
  // 파운데이션에 거의 다 쌓기
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  for (let i = 0; i < 4; i++) {
    foundations[i] = [];
    for (let rank = 1; rank <= 11; rank++) {
      foundations[i].push(createTestCard(suits[i], rank as Rank));
    }
  }
  
  // 테이블로에 나머지 카드들
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  tableau[0] = [
    createTestCard(Suit.HEARTS, Rank.QUEEN),
    createTestCard(Suit.HEARTS, Rank.KING)
  ];
  tableau[1] = [
    createTestCard(Suit.DIAMONDS, Rank.QUEEN),
    createTestCard(Suit.DIAMONDS, Rank.KING)
  ];
  tableau[2] = [
    createTestCard(Suit.CLUBS, Rank.QUEEN),
    createTestCard(Suit.CLUBS, Rank.KING)
  ];
  tableau[3] = [
    createTestCard(Suit.SPADES, Rank.QUEEN),
    createTestCard(Suit.SPADES, Rank.KING)
  ];
  
  return {
    tableau,
    foundations,
    freeCells: [null, null, null, null],
    moveHistory: [],
    selectedCards: [],
    score: 440, // 11 * 10 * 4
    moves: 44,
    isGameWon: false,
    isAutoCompleteActive: false,
    testMode: true
  };
};

// 테스트 시나리오 5: 복잡한 이동 테스트
export const createComplexTestState = (): GameState => {
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  
  // 복잡한 카드 배치
  tableau[0] = [
    createTestCard(Suit.SPADES, Rank.KING),
    createTestCard(Suit.HEARTS, Rank.QUEEN),
    createTestCard(Suit.CLUBS, Rank.JACK),
    createTestCard(Suit.DIAMONDS, Rank.TEN),
    createTestCard(Suit.SPADES, Rank.NINE),
    createTestCard(Suit.HEARTS, Rank.EIGHT),
    createTestCard(Suit.CLUBS, Rank.SEVEN)
  ];
  
  tableau[1] = [
    createTestCard(Suit.HEARTS, Rank.KING),
    createTestCard(Suit.SPADES, Rank.QUEEN),
    createTestCard(Suit.DIAMONDS, Rank.JACK),
    createTestCard(Suit.CLUBS, Rank.TEN),
    createTestCard(Suit.HEARTS, Rank.NINE)
  ];
  
  tableau[2] = [
    createTestCard(Suit.DIAMONDS, Rank.KING),
    createTestCard(Suit.CLUBS, Rank.QUEEN),
    createTestCard(Suit.HEARTS, Rank.JACK)
  ];
  
  tableau[3] = [
    createTestCard(Suit.CLUBS, Rank.KING)
  ];
  
  // 일부 에이스와 2를 다른 열에 배치
  tableau[4] = [
    createTestCard(Suit.HEARTS, Rank.ACE),
    createTestCard(Suit.SPADES, Rank.TWO),
    createTestCard(Suit.DIAMONDS, Rank.THREE)
  ];
  
  tableau[5] = [
    createTestCard(Suit.CLUBS, Rank.ACE),
    createTestCard(Suit.DIAMONDS, Rank.TWO),
    createTestCard(Suit.SPADES, Rank.THREE)
  ];
  
  return {
    tableau,
    foundations: [[], [], [], []],
    freeCells: [null, null, null, null],
    moveHistory: [],
    selectedCards: [],
    score: 0,
    moves: 0,
    isGameWon: false,
    isAutoCompleteActive: false,
    testMode: true
  };
};

// 테스트 시나리오 6: 안전 자동 이동 테스트
export const createSafeAutoMoveTestState = (): GameState => {
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  const foundations: CardStack[] = [[], [], [], []];
  
  // 파운데이션에 기초 카드 설정
  // 하트(빨강) A-2, 다이아(빨강) A-3
  foundations[0] = [
    createTestCard(Suit.HEARTS, Rank.ACE),
    createTestCard(Suit.HEARTS, Rank.TWO)
  ];
  foundations[1] = [
    createTestCard(Suit.DIAMONDS, Rank.ACE),
    createTestCard(Suit.DIAMONDS, Rank.TWO),
    createTestCard(Suit.DIAMONDS, Rank.THREE)
  ];
  // 클럽(검정) A-2, 스페이드(검정) A
  foundations[2] = [
    createTestCard(Suit.CLUBS, Rank.ACE),
    createTestCard(Suit.CLUBS, Rank.TWO)
  ];
  foundations[3] = [
    createTestCard(Suit.SPADES, Rank.ACE)
  ];
  
  // 테스트 케이스:
  // min(빨강 파운데이션) = min(2, 3) = 2
  // min(검정 파운데이션) = min(2, 1) = 1
  
  // 안전하게 이동 가능한 카드들:
  // - 검정 카드: rank ≤ min(빨강) + 1 = 2 + 1 = 3 (즉, 검정 3까지 안전)
  // - 빨강 카드: rank ≤ min(검정) + 1 = 1 + 1 = 2 (즉, 빨강 2까지 안전)
  
  // 첫 번째 열: 안전하게 이동 가능한 카드들
  tableau[0] = [
    createTestCard(Suit.CLUBS, Rank.THREE),    // 검정 3 - 안전 (검정 ≤ 3)
    createTestCard(Suit.SPADES, Rank.TWO)      // 검정 2 - 안전 (검정 ≤ 3)
  ];
  
  // 두 번째 열: 안전하지 않은 카드들
  tableau[1] = [
    createTestCard(Suit.HEARTS, Rank.THREE),   // 빨강 3 - 위험! (빨강 ≤ 2만 안전)
    createTestCard(Suit.DIAMONDS, Rank.FOUR),  // 빨강 4 - 위험! (빨강 ≤ 2만 안전)
    createTestCard(Suit.CLUBS, Rank.FOUR)      // 검정 4 - 위험! (검정 ≤ 3만 안전)
  ];
  
  // 세 번째 열: 경계선 케이스
  tableau[2] = [
    createTestCard(Suit.SPADES, Rank.THREE),   // 검정 3 - 안전 (정확히 min+1)
    createTestCard(Suit.HEARTS, Rank.THREE)    // 빨강 3 - 위험! (min+1 초과)
  ];
  
  // 프리셀에도 테스트 카드 배치
  const freeCells: (Card | null)[] = [
    createTestCard(Suit.CLUBS, Rank.THREE),    // 검정 3 - 안전
    createTestCard(Suit.HEARTS, Rank.THREE),   // 빨강 3 - 위험!
    null,
    null
  ];
  
  return {
    tableau,
    foundations,
    freeCells,
    moveHistory: [],
    selectedCards: [],
    score: 60, // 기존 파운데이션 점수
    moves: 6,
    isGameWon: false,
    isAutoCompleteActive: false,
    testMode: true
  };
};

// 테스트 시나리오 7: 다중 카드 이동 제한 테스트
export const createMultiCardMoveTestState = (): GameState => {
  const tableau: CardStack[] = [[], [], [], [], [], [], [], []];
  
  // 첫 번째 열: 이동 가능한 긴 시퀀스 (검정K -> 빨강Q -> 검정J -> 빨강10 -> 검정9)
  tableau[0] = [
    createTestCard(Suit.SPADES, Rank.KING),
    createTestCard(Suit.HEARTS, Rank.QUEEN),
    createTestCard(Suit.CLUBS, Rank.JACK),
    createTestCard(Suit.DIAMONDS, Rank.TEN),
    createTestCard(Suit.SPADES, Rank.NINE)
  ];
  
  // 두 번째 열: 빈 컬럼 (이동 가능한 카드 수 2배)
  tableau[1] = [];
  
  // 세 번째 열: 또 다른 빈 컬럼 (이동 가능한 카드 수 4배)
  tableau[2] = [];
  
  // 네 번째 열: 이동 대상 컬럼 (빨강K)
  tableau[3] = [
    createTestCard(Suit.HEARTS, Rank.KING)
  ];
  
  // 다섯 번째 열: 또 다른 이동 대상 (검정K)
  tableau[4] = [
    createTestCard(Suit.CLUBS, Rank.KING)
  ];
  
  // 프리셀 상태:
  // 2개 비어있음 -> 기본 이동 가능 카드: (2+1) = 3장
  // 빈 테이블로 2개 -> 3 * 2^2 = 12장 이동 가능
  const freeCells: (Card | null)[] = [
    createTestCard(Suit.HEARTS, Rank.ACE),
    createTestCard(Suit.SPADES, Rank.TWO),
    null,
    null
  ];
  
  // 여섯 번째 열: 짧은 시퀀스 테스트
  tableau[5] = [
    createTestCard(Suit.DIAMONDS, Rank.SEVEN),
    createTestCard(Suit.CLUBS, Rank.SIX),
    createTestCard(Suit.HEARTS, Rank.FIVE)
  ];
  
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
    testMode: true
  };
};