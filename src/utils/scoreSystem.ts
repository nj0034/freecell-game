/**
 * FreeCell Solitaire Scoring System
 * 
 * A comprehensive scoring system that rewards strategic play and efficiency
 */

export enum ScoreAction {
  // Foundation moves (highest value)
  MOVE_TO_FOUNDATION = 15,        // Moving card to foundation
  
  // Tableau moves
  TABLEAU_TO_TABLEAU = 5,         // Moving between tableau columns
  FREECELL_TO_TABLEAU = 5,        // Moving from freecell to tableau
  
  // FreeCell moves (penalty for using freecells)
  MOVE_TO_FREECELL = -5,           // Moving to freecell (slight penalty)
  
  // Bonuses
  COMPLETE_SUIT = 100,             // Completing a full suit in foundation
  EXPOSE_CARD = 3,                 // Exposing a face-down card (if any)
  EMPTY_COLUMN_BONUS = 10,         // Creating an empty tableau column
  
  // Game completion bonuses
  WIN_BASE_BONUS = 500,            // Base bonus for winning
  TIME_BONUS_PER_SECOND = 2,      // Bonus per second under time limit
  MOVE_EFFICIENCY_BONUS = 3,       // Bonus per move under par
  
  // Penalties
  UNDO_PENALTY = -10,              // Penalty for using undo
  HINT_PENALTY = -5,               // Penalty for using hint (if implemented)
}

// Par moves for different difficulties
export const PAR_MOVES = {
  easy: 100,
  medium: 120,
  hard: 140,
  expert: 160,
};

// Time limits for bonus calculation (in seconds)
export const TIME_LIMITS = {
  easy: 300,    // 5 minutes
  medium: 420,  // 7 minutes
  hard: 600,    // 10 minutes
  expert: 900,  // 15 minutes
};

/**
 * Calculate bonus score for game completion
 */
export const calculateWinBonus = (
  moves: number,
  timeInSeconds: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
): number => {
  let bonus = ScoreAction.WIN_BASE_BONUS;
  
  // Time bonus: points for each second under the time limit
  const timeLimit = TIME_LIMITS[difficulty];
  if (timeInSeconds < timeLimit) {
    const timeBonus = (timeLimit - timeInSeconds) * ScoreAction.TIME_BONUS_PER_SECOND;
    bonus += Math.floor(timeBonus);
  }
  
  // Move efficiency bonus: points for each move under par
  const parMoves = PAR_MOVES[difficulty];
  if (moves < parMoves) {
    const moveBonus = (parMoves - moves) * ScoreAction.MOVE_EFFICIENCY_BONUS;
    bonus += Math.floor(moveBonus);
  }
  
  return bonus;
};

/**
 * Calculate score for a move action
 */
export const calculateMoveScore = (
  fromType: 'tableau' | 'freecell' | 'foundation',
  toType: 'tableau' | 'freecell' | 'foundation',
  isCompletingSuit?: boolean,
  isCreatingEmptyColumn?: boolean
): number => {
  let score = 0;
  
  // Base move score
  if (toType === 'foundation') {
    score += ScoreAction.MOVE_TO_FOUNDATION;
    if (isCompletingSuit) {
      score += ScoreAction.COMPLETE_SUIT;
    }
  } else if (toType === 'tableau') {
    if (fromType === 'tableau') {
      score += ScoreAction.TABLEAU_TO_TABLEAU;
    } else if (fromType === 'freecell') {
      score += ScoreAction.FREECELL_TO_TABLEAU;
    }
    if (isCreatingEmptyColumn) {
      score += ScoreAction.EMPTY_COLUMN_BONUS;
    }
  } else if (toType === 'freecell') {
    score += ScoreAction.MOVE_TO_FREECELL;
  }
  
  return score;
};

/**
 * Format score with thousand separators
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

/**
 * Get score color based on score value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 1000) return '#FFD700'; // Gold
  if (score >= 500) return '#4CAF50';  // Green
  if (score >= 100) return '#2196F3';  // Blue
  if (score < 0) return '#F44336';     // Red
  return '#9E9E9E';                    // Grey
};