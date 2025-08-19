import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const MessageContainer = styled(motion.div)<{ messageType: 'success' | 'warning' }>`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => 
    props.messageType === 'success' 
      ? props.theme.primaryColor || '#4CAF50'
      : props.theme.accentColor || '#ff6b6b'
  };
  color: ${props => props.theme.buttonText};
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 5px 20px ${props => props.theme.shadowColor};
  backdrop-filter: blur(10px);
  z-index: 10000;
  max-width: 400px;
  text-align: center;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
`;

interface UndoMessageProps {
  show: boolean;
  type: 'success' | 'warning';
  message: string;
  onClose: () => void;
}

export const UndoMessage: React.FC<UndoMessageProps> = ({
  show,
  type,
  message,
  onClose
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3초 후 자동으로 닫기
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -30,
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
          messageType={type}
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {message}
        </MessageContainer>
      )}
    </AnimatePresence>
  );
};