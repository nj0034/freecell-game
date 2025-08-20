import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  z-index: 10000;
  pointer-events: none;
`;

const ModalContent = styled(motion.div)`
  background: #ffffff;
  border-radius: 15px;
  padding: 30px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  border: 2px solid #ff6b6b;
  pointer-events: auto;
`;

const Title = styled.h2`
  color: #d32f2f;
  margin: 0 0 15px 0;
  font-size: 1.6em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Message = styled.p`
  color: #555555;
  margin: 0 0 25px 0;
  text-align: center;
  line-height: 1.6;
  font-size: 1.05em;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled(motion.button)<{ variant: 'undo' | 'restart' }>`
  padding: 12px 24px;
  background: ${props => {
    switch(props.variant) {
      case 'undo': return '#2196F3';
      case 'restart': return '#FF9800';
      default: return '#9E9E9E';
    }
  }};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover {
    background: ${props => {
      switch(props.variant) {
        case 'undo': return '#1976D2';
        case 'restart': return '#F57C00';
        default: return '#757575';
      }
    }};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WarningIcon = styled.span`
  font-size: 1.4em;
`;

interface DeadlockModalProps {
  isOpen: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
}

export const DeadlockModal: React.FC<DeadlockModalProps> = ({
  isOpen,
  canUndo,
  onUndo,
  onRestart
}) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          >
            <Title>
              <WarningIcon>⚠️</WarningIcon>
              더 이상 이동할 수 없습니다
            </Title>
            <Message>
              현재 상태에서 이동 가능한 카드가 없습니다.<br />
              실행 취소하거나 게임을 다시 시작해보세요.
            </Message>
            <ButtonGroup>
              <Button
                variant="undo"
                onClick={onUndo}
                disabled={!canUndo}
                whileHover={{ scale: canUndo ? 1.05 : 1 }}
                whileTap={{ scale: canUndo ? 0.95 : 1 }}
              >
                ↩️ 실행 취소
              </Button>
              <Button
                variant="restart"
                onClick={onRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 다시 시작
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};