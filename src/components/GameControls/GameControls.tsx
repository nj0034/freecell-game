import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { GameState } from '../../types/game.types';
import { DifficultyLevel, difficultyConfigs } from '../../utils/difficulty';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { HamburgerMenu } from '../HamburgerMenu/HamburgerMenu';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { formatScore, getScoreColor } from '../../utils/scoreSystem';
import { useGameStore } from '../../store/gameStore';

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
  position: relative;
  z-index: 100;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 1000;
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
  position: relative;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.buttonHoverBackground};
    box-shadow: 0 6px 16px ${props => props.theme.shadowColor};
  }
`;

const UndoCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => props.theme.accentColor || '#ff6b6b'};
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.75em;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  gameTime: number;
  currentDifficulty: DifficultyLevel;
  onNewGame: (difficulty?: DifficultyLevel) => void;
  onRestartGame: () => void;
  onUndo: () => void;
  canUndo?: boolean;
  safeMode: boolean;
  onSafeModeToggle: () => void;
  isAutoMoving?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  gameTime,
  currentDifficulty,
  onNewGame,
  onRestartGame,
  onUndo,
  canUndo: canUndoProp = true,
  safeMode,
  onSafeModeToggle,
  isAutoMoving = false
}) => {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<DifficultyLevel | undefined>(undefined);
  
  // Get undo count from store
  const consecutiveUndoCount = useGameStore(state => state.consecutiveUndoCount);
  const difficultyConfig = difficultyConfigs[currentDifficulty];
  const maxUndos = difficultyConfig.maxConsecutiveUndos;
  const remainingUndos = maxUndos === -1 ? '∞' : Math.max(0, maxUndos - consecutiveUndoCount);
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const handleNewGameClick = (difficulty?: DifficultyLevel) => {
    // 항상 확인 모달 표시
    setPendingDifficulty(difficulty);
    setShowNewGameModal(true);
  };

  const confirmNewGame = () => {
    onNewGame(pendingDifficulty);
    setShowNewGameModal(false);
    setPendingDifficulty(undefined);
  };

  const cancelNewGame = () => {
    setShowNewGameModal(false);
    setPendingDifficulty(undefined);
  };

  const handleRestartClick = () => {
    // 게임이 진행 중일 때만 확인 모달 표시
    if (gameState.moves > 0) {
      setShowRestartModal(true);
    } else {
      onRestartGame();
    }
  };

  const confirmRestart = () => {
    onRestartGame();
    setShowRestartModal(false);
  };

  const cancelRestart = () => {
    setShowRestartModal(false);
  };

  return (
    <ControlsContainer>
      <ButtonGroup>
        <HamburgerMenu
          onNewGame={() => handleNewGameClick()}
          onHint={() => {}}
          safeMode={safeMode}
          onSafeModeToggle={onSafeModeToggle}
        />
        
        <DifficultySelector
          currentDifficulty={currentDifficulty}
          onDifficultyChange={(difficulty) => handleNewGameClick(difficulty)}
          disabled={isAutoMoving}
        />
        
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => handleNewGameClick()}
          disabled={isAutoMoving}
        >
          🎮 New Game
        </ControlButton>
        
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleRestartClick}
          disabled={isAutoMoving || gameState.moves === 0}
        >
          🔄 Restart
        </ControlButton>
        
        <ControlButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onUndo}
          disabled={!canUndoProp || isAutoMoving}
        >
          ↩️ Undo
          {maxUndos !== -1 && (
            <UndoCount style={{
              background: remainingUndos === 0 ? '#F44336' : 
                         remainingUndos === 1 ? '#FF9800' : 
                         '#4CAF50'
            }}>
              {remainingUndos}
            </UndoCount>
          )}
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
            style={{ color: getScoreColor(gameState.score) }}
          >
            {formatScore(gameState.score)}
          </motion.span>
        </InfoItem>
        
        <InfoItem>
          <span className="label">Time</span>
          <span className="value">{formatTime(gameTime)}</span>
        </InfoItem>
      </InfoGroup>
      
      <ConfirmationModal
        isOpen={showNewGameModal}
        title="Start New Game"
        message={
          gameState.moves > 0 && !gameState.isGameWon
            ? "Are you sure you want to abandon the current game and start a new one?"
            : "Start a new game?"
        }
        confirmText="New Game"
        cancelText="Cancel"
        onConfirm={confirmNewGame}
        onCancel={cancelNewGame}
      />
      
      <ConfirmationModal
        isOpen={showRestartModal}
        title="Restart Game"
        message="Are you sure you want to restart the same game from the beginning?"
        confirmText="Restart"
        cancelText="Continue"
        onConfirm={confirmRestart}
        onCancel={cancelRestart}
      />
    </ControlsContainer>
  );
};