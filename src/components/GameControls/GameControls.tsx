import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { GameState } from '../../types/game.types';
import { canAutoComplete } from '../../utils/gameLogic';

const ControlsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 20px;
  background: ${props => props.theme.boardBackground};
  border-radius: 15px;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ControlButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.buttonHoverBackground};
    box-shadow: 0 6px 16px ${props => props.theme.shadowColor};
  }
`;

const InfoGroup = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .label {
    font-size: 0.9em;
    color: ${props => props.theme.text};
    opacity: 0.7;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .value {
    font-size: 1.4em;
    color: ${props => props.theme.text};
    font-weight: bold;
  }
`;

interface GameControlsProps {
  gameState: GameState;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo?: () => void;
  onHint: () => void;
  onAutoComplete: () => void;
  onSafeAutoMove?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onNewGame,
  onUndo,
  onRedo,
  onHint,
  onAutoComplete,
  onSafeAutoMove,
  canUndo: canUndoProp = true,
  canRedo: canRedoProp = false
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const canComplete = canAutoComplete(gameState);

  return (
    <ControlsContainer>
      <ButtonGroup>
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onNewGame}
        >
          🎮 New Game
        </ControlButton>
        
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onUndo}
          disabled={!canUndoProp}
        >
          ↩️ Undo
        </ControlButton>
        
        {onRedo && (
          <ControlButton
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onRedo}
            disabled={!canRedoProp}
          >
            ↪️ Redo
          </ControlButton>
        )}
        
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onHint}
        >
          💡 Hint
        </ControlButton>
        
        {onSafeAutoMove && (
          <ControlButton
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onSafeAutoMove}
          >
            🎯 Safe Move
          </ControlButton>
        )}
        
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onAutoComplete}
          disabled={!canComplete}
        >
          ⚡ Auto Complete
        </ControlButton>
      </ButtonGroup>
      
      <InfoGroup>
        <InfoItem>
          <span className="label">Moves</span>
          <motion.span 
            className="value"
            key={gameState.moves}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {gameState.moves}
          </motion.span>
        </InfoItem>
        
        <InfoItem>
          <span className="label">Score</span>
          <motion.span 
            className="value"
            key={gameState.score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {gameState.score}
          </motion.span>
        </InfoItem>
        
        <InfoItem>
          <span className="label">Time</span>
          <span className="value">{formatTime(gameState.time)}</span>
        </InfoItem>
      </InfoGroup>
    </ControlsContainer>
  );
};