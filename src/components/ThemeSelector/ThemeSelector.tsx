import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../styles/themes';

const SelectorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const ThemeButton = styled(motion.button)`
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px ${props => props.theme.shadowColor};
  transition: background 0.3s ease;

  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
  }
`;

const ThemeMenu = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 0;
  background: ${props => props.theme.buttonBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  min-width: 200px;
`;

const ThemeOption = styled(motion.button)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  margin: 4px 0;
  background: ${props => props.isActive ? props.theme.primaryColor : 'transparent'};
  color: ${props => props.isActive ? props.theme.buttonText : props.theme.buttonText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isActive ? props.theme.primaryColor : props.theme.buttonHoverBackground};
    color: ${props => props.theme.buttonText};
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.color};
  margin-right: 10px;
  border: 1px solid ${props => props.theme.cardBorder};
`;

export const ThemeSelector: React.FC = () => {
  const { themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <SelectorContainer>
      <ThemeButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎨 Theme
      </ThemeButton>

      <AnimatePresence>
        {isOpen && (
          <ThemeMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {availableThemes.map((theme) => (
              <ThemeOption
                key={theme}
                isActive={themeName === theme}
                onClick={() => handleThemeChange(theme)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ColorPreview color={themes[theme].background} />
                {themes[theme].name}
              </ThemeOption>
            ))}
          </ThemeMenu>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
};