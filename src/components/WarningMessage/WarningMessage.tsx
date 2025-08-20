import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const MessageContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.accentColor || '#ff6b6b'};
  color: ${props => props.theme.buttonText};
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 5px 20px ${props => props.theme.shadowColor};
  backdrop-filter: blur(10px);
  z-index: 10000;
  max-width: 400px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.95em;
  line-height: 1.3;
`;

const MaxCards = styled.span`
  font-weight: bold;
  font-size: 1.2em;
  color: ${props => props.theme.primaryColor || '#ffeb3b'};
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const Title = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 5px;
`;

interface WarningMessageProps {
  show: boolean;
  maxCards: number;
  attemptedCards: number;
  onClose: () => void;
}

export const WarningMessage: React.FC<WarningMessageProps> = ({
  show,
  maxCards,
  attemptedCards,
  onClose
}) => {
  // Use useCallback to create a stable onClose reference
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000); // 3초 후 자동으로 닫기
      
      return () => clearTimeout(timer);
    }
  }, [show, handleClose]);

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <MessageContainer
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <MessageContent>
            <Title>⚠️ Move Limit!</Title>
            <Message>
            Tried to move {attemptedCards} cards,<br />
            but can only move <MaxCards>{maxCards} cards</MaxCards> at once.
          </Message>
          <Message style={{ fontSize: '0.9em', marginTop: '10px', opacity: 0.8 }}>
            Free up some FreeCells or empty columns!
          </Message>
          </MessageContent>
        </MessageContainer>
      )}
    </AnimatePresence>
  );
};