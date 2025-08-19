import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Card } from '../Card/Card';
import { CardStack, GameState, PileType } from '../../types/game.types';
import { canMoveCard } from '../../utils/gameLogic';
import { canSelectCards } from '../../utils/gameLogic';
import { canDragCards, canMoveMultipleCards, findMultiCardDestination } from '../../utils/multiCardMove';
import { findAutoMoveDestination, executeAutoMove } from '../../utils/autoMove';
import { isSafeModeEnabled } from '../../utils/allToHomeHelper';
import { findAllMovesToFoundations } from '../../utils/moveAllToFoundations';
import { moveCardsSequentially, moveSingleCardWithAnimation, moveMultipleCardsToFoundationSequentially } from '../../utils/sequentialCardMove';
import { calculateCardHighlights, shouldUpdateHighlights } from '../../utils/cardHighlight';

const TableauColumn = styled.div<{ isOver: boolean; canDrop: boolean }>`
  min-height: 150px;
  width: 90px;
  background: ${props => 
    props.isOver && props.canDrop ? 'rgba(76, 175, 80, 0.3)' :
    props.isOver ? 'rgba(244, 67, 54, 0.3)' :
    'rgba(255, 255, 255, 0.1)'
  };
  border: 2px dashed ${props => 
    props.isOver && props.canDrop ? '#4CAF50' :
    props.isOver ? '#f44336' :
    'rgba(255, 255, 255, 0.3)'
  };
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const EmptySlot = styled.div`
  width: 100%;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 2em;
`;

interface TableauProps {
  cards: CardStack;
  columnIndex: number;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onWarning?: (maxCards: number, attemptedCards: number) => void;
}

export const Tableau: React.FC<TableauProps> = ({
  cards,
  columnIndex,
  gameState,
  setGameState,
  onWarning
}) => {
  const [shakingCardIndex, setShakingCardIndex] = React.useState<number | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [cardHighlights, setCardHighlights] = React.useState(() => calculateCardHighlights(gameState));
  
  // Update highlights when game state changes
  React.useEffect(() => {
    const newHighlights = calculateCardHighlights(gameState);
    setCardHighlights(newHighlights);
  }, [gameState]); // gameState 전체를 의존성으로 하여 모든 변경사항 감지
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    canDrop: (item: any) => {
      // First check if single card can be moved
      if (!canMoveCard(item.card, cards, PileType.TABLEAU)) {
        return false;
      }
      
      // If dragging from tableau, check multi-card move limits
      if (item.from === 'tableau' && item.draggedCards) {
        const numCards = item.draggedCards.length;
        if (numCards > 1) {
          // Check if we can move this many cards
          const emptyFreeCells = gameState.freeCells.filter(cell => cell === null).length;
          let emptyTableauColumns = 0;
          
          // Count empty columns, excluding the target column if it's empty
          for (let i = 0; i < gameState.tableau.length; i++) {
            if (gameState.tableau[i].length === 0) {
              // Don't count the target column if it's empty
              if (i !== columnIndex) {
                emptyTableauColumns++;
              }
            }
          }
          
          // If target column is empty, we need to exclude it from the calculation
          const targetIsEmpty = cards.length === 0;
          const maxMovable = (emptyFreeCells + 1) * Math.pow(2, emptyTableauColumns);
          
          console.log(`Drag validation: ${numCards} cards, max allowed: ${maxMovable} (${emptyFreeCells} free cells, ${emptyTableauColumns} empty columns${targetIsEmpty ? ', target is empty' : ''})`);
          return numCards <= maxMovable;
        }
      }
      
      return true;
    },
    drop: (item: any) => {
      handleCardDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const handleCardDrop = (item: any) => {
    const { card, stackIndex, from } = item;
    
    // 카드 이동 로직
    setGameState(prev => {
      const newState = { 
        ...prev,
        tableau: prev.tableau.map(column => [...column]),
        foundations: prev.foundations.map(foundation => [...foundation]),
        freeCells: [...prev.freeCells],
        moveHistory: [...prev.moveHistory],
        selectedCards: [...prev.selectedCards]
      };
      
      // 원래 위치에서 카드 제거
      if (from === 'tableau') {
        const sourceColumn = [...newState.tableau[stackIndex]];
        const cardIndex = sourceColumn.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          // 여러 카드를 이동하는 경우 검증
          if (cardIndex < sourceColumn.length - 1) {
            const moveCheck = canMoveMultipleCards(sourceColumn, cardIndex, prev, columnIndex);
            if (!moveCheck.canMove) {
              console.log(`Cannot drop ${moveCheck.numCards} cards - max allowed is ${moveCheck.maxMovable}`);
              if (onWarning) {
                onWarning(moveCheck.maxMovable, moveCheck.numCards);
              }
              return prev; // 이동 취소
            }
          }
          
          const movedCards = sourceColumn.splice(cardIndex);
          newState.tableau[stackIndex] = sourceColumn;
          
          // 대상 위치에 카드 추가
          newState.tableau[columnIndex] = [...newState.tableau[columnIndex], ...movedCards];
        }
      } else if (from === 'freecell') {
        newState.freeCells[stackIndex] = null;
        newState.tableau[columnIndex] = [...newState.tableau[columnIndex], card];
      }
      
      // 이동 횟수 및 점수 업데이트
      newState.moves += 1;
      newState.score += 5;
      
      // 이동 기록 추가
      newState.moveHistory.push({
        from: { type: from === 'tableau' ? PileType.TABLEAU : PileType.FREECELL, index: stackIndex },
        to: { type: PileType.TABLEAU, index: columnIndex },
        cards: [card],
        timestamp: Date.now()
      });
      
      return newState;
    });
  };

  const handleCardClick = async (clickedCard: any, cardIndex: number) => {
    // 애니메이션 진행 중이면 무시
    if (isAnimating) return;
    
    // 여러 카드 이동 가능한지 확인
    if (cardIndex < cards.length - 1) {
      // 연속된 시퀀스인지 확인
      if (canSelectCards(cards, cardIndex)) {
        // 이동할 수 있는 대상 찾기
        const destination = findMultiCardDestination(cards, cardIndex, columnIndex, gameState);
        
        if (destination) {
          // 이동 가능한 수량 확인 (목적지 컬럼 인덱스 전달)
          const moveCheck = canMoveMultipleCards(cards, cardIndex, gameState, destination.columnIndex);
          
          if (!moveCheck.canMove) {
            // 경고 메시지 표시 및 shake 애니메이션
            if (onWarning) {
              onWarning(moveCheck.maxMovable, moveCheck.numCards);
            }
            setShakingCardIndex(cardIndex);
            return;
          }
          
          // 순차적 카드 이동 애니메이션 실행
          setIsAnimating(true);
          try {
            await moveCardsSequentially(
              cards,
              columnIndex,
              destination.columnIndex,
              cardIndex,
              gameState,
              setGameState,
              { delay: 80, animationDuration: 150 }
            );
          } catch (error) {
            console.error('Error during sequential card move:', error);
          } finally {
            setIsAnimating(false);
          }
        } else {
          // 이동할 수 있는 곳이 없는 경우 shake 애니메이션
          setShakingCardIndex(cardIndex);
        }
        return;
      } else {
        // 유효한 시퀀스가 아닌 경우 shake 애니메이션
        setShakingCardIndex(cardIndex);
      }
    }
    
    // 단일 카드 이동 (마지막 카드인 경우)
    if (cardIndex === cards.length - 1) {
      const fromLocation = { type: PileType.TABLEAU, index: columnIndex };
      // Single-click에서는 safe move 체크를 비활성화하여 Foundation 우선순위 보장
      const destination = findAutoMoveDestination(clickedCard, fromLocation, gameState, false);
      
      if (destination) {
        setIsAnimating(true);
        try {
          // 카드를 애니메이션과 함께 이동
          await moveSingleCardWithAnimation(
            clickedCard,
            fromLocation,
            destination,
            gameState,
            setGameState,
            150
          );
          
          // 파운데이션으로 이동했고 Safe mode가 꺼져있으면 추가 이동 확인
          if (destination.type === PileType.FOUNDATION && !isSafeModeEnabled()) {
            // 현재 상태를 가져오기 위해 executeAutoMove로 테스트
            const testState = executeAutoMove(clickedCard, fromLocation, destination, gameState);
            const additionalMoves = findAllMovesToFoundations(testState);
            
            if (additionalMoves.length > 0) {
              await moveMultipleCardsToFoundationSequentially(
                additionalMoves,
                setGameState,
                { delay: 80, animationDuration: 150 }
              );
            }
          }
          
        } catch (error) {
          console.error('Error during auto move animation:', error);
        } finally {
          setIsAnimating(false);
        }
      } else {
        // 이동할 수 없는 경우 shake 애니메이션
        setShakingCardIndex(cardIndex);
      }
    }
  };

  const columnVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  return (
    <TableauColumn ref={drop} isOver={isOver} canDrop={canDrop}>
      {cards.length === 0 ? (
        <EmptySlot>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            ♠
          </motion.span>
        </EmptySlot>
      ) : (
        <motion.div
          variants={columnVariants}
          initial="initial"
          animate="animate"
          style={{ position: 'relative', height: '100%' }}
        >
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              stackIndex={columnIndex}
              onCardClick={(card) => handleCardClick(card, index)}
              canDrag={canDragCards(cards, index, gameState)}
              isStacked={true}
              source="tableau"
              shouldShake={shakingCardIndex === index}
              onShakeComplete={() => setShakingCardIndex(null)}
              allCards={cards}
              highlight={cardHighlights[columnIndex]?.[index]}
            />
          ))}
        </motion.div>
      )}
    </TableauColumn>
  );
};