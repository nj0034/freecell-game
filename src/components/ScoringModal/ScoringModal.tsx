import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
  padding: 20px;
  padding-top: 100px;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: #ffffff;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #333333;
  margin: 0 0 20px 0;
  font-size: 1.8em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: #555555;
  margin: 0 0 10px 0;
  font-size: 1.2em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
`;

const ScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ScoreLabel = styled.span`
  color: #666666;
  font-size: 0.95em;
`;

const ScoreValue = styled.span<{ color?: string }>`
  color: ${props => props.color || '#333333'};
  font-weight: bold;
  font-size: 1em;
`;

const CloseButton = styled(motion.button)`
  width: 100%;
  padding: 12px 24px;
  background: #2196F3;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: #1976D2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Icon = styled.span`
  font-size: 1.2em;
`;

interface ScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoringModal: React.FC<ScoringModalProps> = ({
  isOpen,
  onClose
}) => {
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Title>
              <Icon>📊</Icon>
              Scoring Rules
            </Title>
            
            <Section>
              <SectionTitle>Basic Moves</SectionTitle>
              <ScoreItem>
                <ScoreLabel>Move to Foundation</ScoreLabel>
                <ScoreValue color="#4CAF50">+15</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Move between Tableau</ScoreLabel>
                <ScoreValue color="#2196F3">+5</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>FreeCell to Tableau</ScoreLabel>
                <ScoreValue color="#2196F3">+5</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Move to FreeCell</ScoreLabel>
                <ScoreValue color="#F44336">-5</ScoreValue>
              </ScoreItem>
            </Section>
            
            <Section>
              <SectionTitle>Bonuses</SectionTitle>
              <ScoreItem>
                <ScoreLabel>Complete a Suit (13 cards)</ScoreLabel>
                <ScoreValue color="#FFD700">+100</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Create Empty Column</ScoreLabel>
                <ScoreValue color="#4CAF50">+10</ScoreValue>
              </ScoreItem>
            </Section>
            
            <Section>
              <SectionTitle>Game Completion</SectionTitle>
              <ScoreItem>
                <ScoreLabel>Win Base Bonus</ScoreLabel>
                <ScoreValue color="#FFD700">+500</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Time Bonus (per second under limit)</ScoreLabel>
                <ScoreValue color="#4CAF50">+2</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Move Efficiency (per move under par)</ScoreLabel>
                <ScoreValue color="#4CAF50">+3</ScoreValue>
              </ScoreItem>
            </Section>
            
            <Section>
              <SectionTitle>Penalties</SectionTitle>
              <ScoreItem>
                <ScoreLabel>Undo Move</ScoreLabel>
                <ScoreValue color="#F44336">-10</ScoreValue>
              </ScoreItem>
            </Section>
            
            <Section>
              <SectionTitle>Par Moves by Difficulty</SectionTitle>
              <ScoreItem>
                <ScoreLabel>Easy</ScoreLabel>
                <ScoreValue>100 moves</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Medium</ScoreLabel>
                <ScoreValue>120 moves</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Hard</ScoreLabel>
                <ScoreValue>140 moves</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Expert</ScoreLabel>
                <ScoreValue>160 moves</ScoreValue>
              </ScoreItem>
            </Section>
            
            <Section>
              <SectionTitle>Time Limits by Difficulty</SectionTitle>
              <ScoreItem>
                <ScoreLabel>Easy</ScoreLabel>
                <ScoreValue>5 minutes</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Medium</ScoreLabel>
                <ScoreValue>7 minutes</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Hard</ScoreLabel>
                <ScoreValue>10 minutes</ScoreValue>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Expert</ScoreLabel>
                <ScoreValue>15 minutes</ScoreValue>
              </ScoreItem>
            </Section>
            
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};