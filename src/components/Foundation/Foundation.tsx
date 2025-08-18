import React from 'react';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Card } from '../Card/Card';
import { CardStack, GameState, PileType, Suit } from '../../types/game.types';
import { canMoveCard } from '../../utils/gameLogic';

const FoundationSlot = styled.div<{ isOver: boolean; canDrop: boolean; suit?: Suit }>`
  width: 90px;
  height: 125px;
  background: ${props => 
    props.isOver && props.canDrop ? props.theme.primaryColor + '66' :
    props.isOver ? props.theme.accentColor + '4d' :
    props.theme.boardBackground
  };
  border: 2px solid ${props => 
    props.isOver && props.canDrop ? props.theme.primaryColor :
    props.isOver ? props.theme.accentColor :
    props.theme.cardBorder
  };
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &::before {
    content: '${props => {
      switch(props.suit) {
        case Suit.HEARTS: return '♥';
        case Suit.DIAMONDS: return '♦';
        case Suit.CLUBS: return '♣';
        case Suit.SPADES: return '♠';
        default: return 'A';
      }
    }}';
    position: absolute;
    font-size: 3em;
    color: ${props => props.theme.text};
    opacity: 0.1;
    z-index: 0;
  }
  
  &:hover {
    background: ${props => props.theme.boardBackground};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  }
`;

const CardWrapper = styled.div`
  position: absolute;
  z-index: 1;
`;

const SuccessAnimation = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`;

interface FoundationProps {
  cards: CardStack;
  index: number;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const suitOrder = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];

export const Foundation: React.FC<FoundationProps> = ({
  cards,
  index,
  gameState,
  setGameState
}) => {
  const expectedSuit = cards.length > 0 ? cards[0].suit : suitOrder[index];
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CARD',
    canDrop: (item: any) => {
      return canMoveCard(item.card, cards, PileType.FOUNDATION);
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
      
      // 파운데이션에 카드 추가
      newState.foundations[index] = [...newState.foundations[index], card];
      
      // 점수 및 이동 횟수 업데이트
      newState.score += 10;
      newState.moves += 1;
      
      // 이동 기록 추가
      newState.moveHistory.push({
        from: { type: from === 'tableau' ? PileType.TABLEAU : PileType.FREECELL, index: stackIndex },
        to: { type: PileType.FOUNDATION, index },
        cards: [card],
        timestamp: Date.now()
      });
      
      return newState;
    });
  };

  const successVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [1, 1.5, 1],
      opacity: [1, 1, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardEntryVariants = {
    initial: {
      scale: 1.5,
      y: -50,
      opacity: 0,
      rotate: 180
    },
    animate: {
      scale: 1,
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <FoundationSlot 
      ref={drop} 
      isOver={isOver} 
      canDrop={canDrop}
      suit={expectedSuit}
    >
      <AnimatePresence mode="wait">
        {cards.length > 0 && (
          <CardWrapper>
            <motion.div
              key={cards[cards.length - 1].id}
              variants={cardEntryVariants}
              initial="initial"
              animate="animate"
            >
              <Card
                card={cards[cards.length - 1]}
                index={cards.length - 1}
                stackIndex={index}
                canDrag={false}
                source="foundation"
              />
            </motion.div>
          </CardWrapper>
        )}
      </AnimatePresence>
      
      {/* 카드가 추가될 때마다 성공 애니메이션 */}
      <AnimatePresence>
        {cards.length > 0 && (
          <SuccessAnimation
            key={`success-${cards.length}`}
            variants={successVariants}
            initial="initial"
            animate="animate"
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(76, 175, 80, 0.6), transparent)',
              borderRadius: '8px'
            }} />
          </SuccessAnimation>
        )}
      </AnimatePresence>
    </FoundationSlot>
  );
};