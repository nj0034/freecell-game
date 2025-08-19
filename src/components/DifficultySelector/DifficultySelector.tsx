import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { DifficultyLevel, difficultyConfigs } from '../../utils/difficulty';

const SelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DifficultyButton = styled(motion.button)`
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
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
    box-shadow: 0 6px 16px ${props => props.theme.shadowColor};
  }
`;

const DifficultyMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: ${props => props.theme.buttonBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  min-width: 250px;
  z-index: 100;
`;

const DifficultyOption = styled(motion.button)<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 12px;
  margin: 4px 0;
  background: ${props => props.isActive ? props.theme.primaryColor : 'transparent'};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${props => props.isActive ? props.theme.primaryColor : props.theme.buttonHoverBackground};
  }

  .difficulty-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .difficulty-description {
    font-size: 11px;
    opacity: 0.8;
    line-height: 1.3;
  }
`;

const DifficultyIcon = styled.span<{ level: DifficultyLevel }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch(props.level) {
      case DifficultyLevel.EASY: return '#4CAF50';
      case DifficultyLevel.MEDIUM: return '#FFC107';
      case DifficultyLevel.HARD: return '#FF9800';
      case DifficultyLevel.EXPERT: return '#F44336';
      default: return '#999';
    }
  }};
`;

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    onDifficultyChange(difficulty);
    setIsOpen(false);
  };

  const getDifficultyIcon = (level: DifficultyLevel) => {
    switch(level) {
      case DifficultyLevel.EASY: return '🟢';
      case DifficultyLevel.MEDIUM: return '🟡';
      case DifficultyLevel.HARD: return '🟠';
      case DifficultyLevel.EXPERT: return '🔴';
      default: return '⚪';
    }
  };

  return (
    <SelectorContainer>
      <DifficultyButton
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
      >
        {getDifficultyIcon(currentDifficulty)} {difficultyConfigs[currentDifficulty].name}
      </DifficultyButton>

      <AnimatePresence>
        {isOpen && !disabled && (
          <DifficultyMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {Object.values(DifficultyLevel).map((level) => {
              const config = difficultyConfigs[level];
              return (
                <DifficultyOption
                  key={level}
                  isActive={currentDifficulty === level}
                  onClick={() => handleDifficultySelect(level)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="difficulty-name">
                    {getDifficultyIcon(level)}
                    {config.name}
                    {level === DifficultyLevel.EXPERT && ' ⚠️'}
                  </div>
                  <div className="difficulty-description">
                    {config.description}
                  </div>
                </DifficultyOption>
              );
            })}
          </DifficultyMenu>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
};