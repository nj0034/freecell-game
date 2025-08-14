import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Card } from '../Card/Card';
import { CardStack, GameState, PileType } from '../../types/game.types';
import { canMoveCard } from '../../utils/gameLogic';
import { canSelectCards } from '../../utils/gameLogic';
import { canDragCards, canMoveMultipleCards, moveMultipleCards, findMultiCardDestination } from '../../utils/multiCardMove';
import { findAutoMoveDestination, executeAutoMove, tryMoveToFoundation } from '../../utils/autoMove';

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
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    canDrop: (item: any) => {
      return canMoveCard(item.card, cards, PileType.TABLEAU);
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
    console.log('Dropping card to tableau:', columnIndex, 'from:', from, 'card:', card);
    
    // 카드 이동 로직
    setGameState(prev => {
      const newState = { ...prev };
      
      // 원래 위치에서 카드 제거
      if (from === 'tableau') {
        const sourceColumn = [...newState.tableau[stackIndex]];
        const cardIndex = sourceColumn.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
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

  const handleCardClick = (clickedCard: any, cardIndex: number) => {
    // 더블클릭인 경우 파운데이션으로만 이동
    if (clickedCard.doubleClick) {
      const fromLocation = { type: PileType.TABLEAU, index: columnIndex };
      const newState = tryMoveToFoundation(clickedCard, fromLocation, gameState);
      if (newState) {
        setGameState(newState);
        console.log('Double-clicked card moved to foundation');
      } else {
        // 이동할 수 없는 경우 shake 애니메이션
        setShakingCardIndex(cardIndex);
      }
      return;
    }
    
    // 여러 카드 이동 가능한지 확인
    if (cardIndex < cards.length - 1) {
      // 연속된 시퀀스인지 확인
      if (canSelectCards(cards, cardIndex)) {
        // 이동 가능한 수량 확인
        const moveCheck = canMoveMultipleCards(cards, cardIndex, gameState);
        
        if (!moveCheck.canMove) {
          // 경고 메시지 표시 및 shake 애니메이션
          if (onWarning) {
            onWarning(moveCheck.maxMovable, moveCheck.numCards);
          }
          setShakingCardIndex(cardIndex);
          return;
        }
        
        // 이동할 수 있는 대상 찾기
        const destination = findMultiCardDestination(cards, cardIndex, columnIndex, gameState);
        if (destination) {
          const newState = moveMultipleCards(
            cards,
            columnIndex,
            destination.columnIndex,
            cardIndex,
            gameState
          );
          
          if (newState) {
            setGameState(newState);
            console.log(`Moved ${cards.length - cardIndex} cards to column ${destination.columnIndex}`);
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
      const destination = findAutoMoveDestination(clickedCard, fromLocation, gameState, true);
      
      if (destination) {
        const newState = executeAutoMove(clickedCard, fromLocation, destination, gameState);
        setGameState(newState);
        console.log('Auto-moved card to:', destination);
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
            />
          ))}
        </motion.div>
      )}
    </TableauColumn>
  );
};