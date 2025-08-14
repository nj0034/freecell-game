import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Card } from '../Card/Card';
import { Card as CardType, GameState, PileType } from '../../types/game.types';
import { findAutoMoveDestination, executeAutoMove, tryMoveToFoundation } from '../../utils/autoMove';

const FreeCellSlot = styled.div<{ isOver: boolean; canDrop: boolean; isEmpty: boolean }>`
  width: 90px;
  height: 125px;
  background: ${props => 
    props.isOver && props.canDrop ? 'rgba(76, 175, 80, 0.3)' :
    props.isOver ? 'rgba(244, 67, 54, 0.3)' :
    props.isEmpty ? 'rgba(255, 255, 255, 0.1)' :
    'transparent'
  };
  border: 2px solid ${props => 
    props.isOver && props.canDrop ? '#4CAF50' :
    props.isOver ? '#f44336' :
    'rgba(255, 255, 255, 0.3)'
  };
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.02);
  }
  
  &::before {
    content: 'Free';
    position: absolute;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.2);
    font-weight: bold;
    letter-spacing: 1px;
    display: ${props => props.isEmpty ? 'block' : 'none'};
  }
`;

interface FreeCellProps {
  card: CardType | null;
  index: number;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const FreeCell: React.FC<FreeCellProps> = ({
  card,
  index,
  gameState,
  setGameState
}) => {
  const [shouldShake, setShouldShake] = React.useState(false);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    canDrop: (item: any) => {
      return card === null; // 프리셀이 비어있을 때만 드롭 가능
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
    const { card: droppedCard, stackIndex, from } = item;
    
    setGameState(prev => {
      const newState = { ...prev };
      
      // 원래 위치에서 카드 제거
      if (from === 'tableau') {
        const sourceColumn = [...newState.tableau[stackIndex]];
        sourceColumn.pop();
        newState.tableau[stackIndex] = sourceColumn;
      } else if (from === 'freecell') {
        newState.freeCells[stackIndex] = null;
      }
      
      // 프리셀에 카드 추가
      newState.freeCells[index] = droppedCard;
      
      // 이동 횟수 업데이트
      newState.moves += 1;
      
      // 이동 기록 추가
      newState.moveHistory.push({
        from: { type: from === 'tableau' ? PileType.TABLEAU : PileType.FREECELL, index: stackIndex },
        to: { type: PileType.FREECELL, index },
        cards: [droppedCard],
        timestamp: Date.now()
      });
      
      return newState;
    });
  };

  const handleCardClick = (clickedCard: any) => {
    if (!card) return;
    
    // 더블클릭인 경우 파운데이션으로만 이동
    if (clickedCard.doubleClick) {
      const fromLocation = { type: PileType.FREECELL, index };
      const newState = tryMoveToFoundation(clickedCard, fromLocation, gameState);
      if (newState) {
        setGameState(newState);
        console.log('Double-clicked freecell card moved to foundation');
      } else {
        // 이동할 수 없는 경우 shake 애니메이션
        setShouldShake(true);
      }
      return;
    }
    
    // 일반 클릭: 자동으로 가능한 위치로 이동
    const fromLocation = { type: PileType.FREECELL, index };
    const destination = findAutoMoveDestination(clickedCard, fromLocation, gameState);
    
    if (destination) {
      const newState = executeAutoMove(clickedCard, fromLocation, destination, gameState);
      setGameState(newState);
      console.log('Auto-moved freecell card to:', destination);
    } else {
      // 이동할 수 없는 경우 shake 애니메이션
      setShouldShake(true);
    }
  };

  const cardVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      scale: 0,
      rotate: 180,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <FreeCellSlot 
      ref={drop} 
      isOver={isOver} 
      canDrop={canDrop}
      isEmpty={card === null}
    >
      {card && (
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card
            card={card}
            index={0}
            stackIndex={index}
            onCardClick={handleCardClick}
            canDrag={true}
            source="freecell"
            shouldShake={shouldShake}
            onShakeComplete={() => setShouldShake(false)}
          />
        </motion.div>
      )}
    </FreeCellSlot>
  );
};