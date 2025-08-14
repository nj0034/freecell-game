import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '../../types/game.types';
import { Card } from '../Card/Card';

interface AnimatedCardProps {
  card: CardType;
  index: number;
  stackIndex: number;
  onCardClick?: (card: CardType) => void;
  canDrag?: boolean;
  isStacked?: boolean;
  source: 'tableau' | 'freecell' | 'foundation';
  isMoving?: boolean;
  targetPosition?: { x: number; y: number };
  onAnimationComplete?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  index,
  stackIndex,
  onCardClick,
  canDrag = true,
  isStacked = false,
  source,
  isMoving = false,
  targetPosition,
  onAnimationComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isMoving && targetPosition) {
      setIsAnimating(true);
    }
  }, [isMoving, targetPosition]);

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  const moveVariants = {
    initial: {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 1000
    },
    moving: {
      x: targetPosition?.x || 0,
      y: targetPosition?.y || 0,
      scale: 1.1,
      zIndex: 1000,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    settled: {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: index,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  if (isAnimating) {
    return (
      <motion.div
        variants={moveVariants}
        initial="initial"
        animate="moving"
        onAnimationComplete={handleAnimationComplete}
        style={{
          position: 'absolute',
          top: isStacked ? `${index * 30}px` : 0,
          zIndex: 1000
        }}
      >
        <Card
          card={card}
          index={index}
          stackIndex={stackIndex}
          onCardClick={onCardClick}
          canDrag={false}
          isStacked={false}
          source={source}
        />
      </motion.div>
    );
  }

  return (
    <Card
      card={card}
      index={index}
      stackIndex={stackIndex}
      onCardClick={onCardClick}
      canDrag={canDrag}
      isStacked={isStacked}
      source={source}
    />
  );
};