import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ToggleButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  z-index: 999;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
    box-shadow: 0 6px 16px ${props => props.theme.shadowColor};
  }
`;

interface TestToggleProps {
  onToggle: () => void;
  isVisible: boolean;
}

export const TestToggle: React.FC<TestToggleProps> = ({ onToggle, isVisible }) => {
  return (
    <ToggleButton
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isVisible ? "Hide Test Controls" : "Show Test Controls"}
    >
      {isVisible ? '🔧' : '🧪'}
    </ToggleButton>
  );
};