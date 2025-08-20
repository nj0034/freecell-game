import React from 'react';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { Card as CardType, Suit } from '../../types/game.types';
import { CardContainer, CardFace, CardBack, SuitSymbol, RankText } from './Card.styles';
import { CardHighlight, getHighlightStyles } from '../../utils/cardHighlight';

interface CardProps {
  card: CardType;
  index: number;
  stackIndex: number;
  onCardClick?: (card: CardType) => void;
  canDrag?: boolean;
  isStacked?: boolean;
  source: 'tableau' | 'freecell' | 'foundation';
  shouldShake?: boolean;
  onShakeComplete?: () => void;
  allCards?: CardType[];  // All cards in the column (for multi-card drag)
  highlight?: CardHighlight;  // Highlight information for card movability
}

const suitSymbols: Record<Suit, string> = {
  [Suit.HEARTS]: '♥',
  [Suit.DIAMONDS]: '♦',
  [Suit.CLUBS]: '♣',
  [Suit.SPADES]: '♠'
};

const rankLabels: Record<number, string> = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K'
};

export const Card: React.FC<CardProps> = ({
  card,
  index,
  stackIndex,
  onCardClick,
  canDrag = true,
  isStacked = false,
  source,
  shouldShake = false,
  onShakeComplete,
  allCards = [],
  highlight
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: () => {
      // Calculate how many cards are being dragged (from this card to the end)
      const draggedCards = allCards.length > 0 ? allCards.slice(index) : [card];
      console.log('Dragging card:', card, 'from:', source, 'stackIndex:', stackIndex, 'draggedCards:', draggedCards.length);
      return { card, index, stackIndex, from: source, draggedCards };
    },
    canDrag: canDrag && card.faceUp,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [card, index, stackIndex, source, canDrag, allCards]);

  const handleClick = () => {
    if (onCardClick && card.faceUp) {
      onCardClick(card);
    }
  };


  const cardVariants = {
    initial: {
      scale: 1,
      rotateY: 0,
      x: 0,
      y: 0
    },
    hover: {
      scale: 1.05,
      y: isStacked ? -10 : -5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    dragging: {
      scale: 1.1,
      rotate: 5,
      opacity: 0.8,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    flip: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: 'easeInOut'
      }
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    }
  };

  const getRankLabel = (rank: number): string => {
    return rankLabels[rank] || rank.toString();
  };

  return (
    <motion.div
      layout
      layoutId={card.id}
      ref={drag}
      style={{
        position: isStacked ? 'absolute' : 'relative',
        top: isStacked ? `${index * 30}px` : 0,
        zIndex: index,
        cursor: canDrag && card.faceUp ? 'grab' : 'default',
      }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.5
        }
      }}
    >
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover={!isDragging ? "hover" : undefined}
        animate={
          shouldShake ? "shake" :
          isDragging ? "dragging" : 
          !card.faceUp ? "flip" : 
          "initial"
        }
        onClick={handleClick}
        onAnimationComplete={() => {
          if (shouldShake && onShakeComplete) {
            onShakeComplete();
          }
        }}
        style={{
          opacity: isDragging ? 0.5 : 1,
          ...( highlight && source === 'tableau' ? getHighlightStyles(highlight) : {} )
        }}
      >
        <CardContainer isSelected={false}>
          {card.faceUp ? (
            <CardFace color={card.color}>
              <div className="card-header">
                <RankText color={card.color}>
                  {getRankLabel(card.rank)}
                </RankText>
                <SuitSymbol color={card.color}>
                  {suitSymbols[card.suit]}
                </SuitSymbol>
              </div>
              <div className="card-center">
                <SuitSymbol color={card.color} size="large">
                  {suitSymbols[card.suit]}
                </SuitSymbol>
              </div>
              <div className="card-footer">
                <RankText color={card.color}>
                  {getRankLabel(card.rank)}
                </RankText>
                <SuitSymbol color={card.color}>
                  {suitSymbols[card.suit]}
                </SuitSymbol>
              </div>
            </CardFace>
          ) : (
            <CardBack>
              <div className="pattern"></div>
            </CardBack>
          )}
        </CardContainer>
      </motion.div>
    </motion.div>
  );
};