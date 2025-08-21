import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../styles/themes';
import { ScoringModal } from '../ScoringModal';

const MenuContainer = styled.div`
  position: relative;
  z-index: 9999;
`;

const MenuButton = styled(motion.button)`
  padding: 12px;
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 48px;
  height: 48px;
  box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
  }
  
  span {
    display: block;
    width: 24px;
    height: 2px;
    background: ${props => props.theme.buttonText};
    transition: all 0.3s ease;
  }
  
  &.open span:first-child {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  &.open span:nth-child(2) {
    opacity: 0;
  }
  
  &.open span:last-child {
    transform: rotate(-45deg) translate(5px, -5px);
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: ${props => props.theme.buttonBackground};
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 20px ${props => props.theme.shadowColor};
  min-width: 200px;
  z-index: 10000;
`;

const MenuItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.buttonHoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
`;

const ToggleSwitch = styled.div<{ isOn: boolean }>`
  width: 40px;
  height: 22px;
  background: ${props => props.isOn ? props.theme.primaryColor : props.theme.cardBorder};
  border-radius: 11px;
  position: relative;
  transition: background 0.3s ease;
  margin-left: auto;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isOn ? '20px' : '2px'};
    width: 18px;
    height: 18px;
    background: ${props => props.theme.buttonText};
    border-radius: 50%;
    transition: left 0.3s ease;
  }
`;

const ThemeSubmenu = styled(motion.div)`
  margin-left: 16px;
  margin-top: 8px;
  border-left: 2px solid ${props => props.theme.cardBorder};
  padding-left: 12px;
`;

const ThemeOption = styled(motion.button)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  margin: 2px 0;
  background: ${props => props.isActive ? props.theme.primaryColor : 'transparent'};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isActive ? props.theme.primaryColor : props.theme.buttonHoverBackground};
  }
`;

const ThemeIcon = styled.span`
  font-size: 16px;
  margin-right: 8px;
  width: 20px;
  text-align: center;
`;

interface HamburgerMenuProps {
  onNewGame: () => void; // Keep for backward compatibility but not used
  onHint: () => void; // Keep for backward compatibility but not used
  safeMode: boolean;
  onSafeModeToggle: () => void;
}

const getThemeIcon = (themeName: string): string => {
  switch(themeName) {
    case 'classic': return '👑';
    case 'nature': return '🌿';
    case 'space': return '🚀';
    case 'fantasy': return '✨';
    case 'minimalist': return '⚪';
    case 'neon': return '💫';
    case 'ocean': return '🌊';
    case 'vintage': return '📜';
    case 'forest': return '🌲';
    default: return '🎨';
  }
};

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onNewGame,
  onHint,
  safeMode,
  onSafeModeToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showScoringModal, setShowScoringModal] = useState(false);
  const { themeName, setTheme, availableThemes } = useTheme();


  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setShowThemes(false);
    setIsOpen(false);
  };

  return (
    <MenuContainer>
      <MenuButton
        className={isOpen ? 'open' : ''}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span />
        <span />
        <span />
      </MenuButton>

      <AnimatePresence>
        {isOpen && (
          <MenuDropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            <MenuItem
              onClick={() => {
                setShowScoringModal(true);
                setIsOpen(false);
              }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="icon">📊</span>
              Scoring Rules
            </MenuItem>
            
            <MenuItem
              onClick={onSafeModeToggle}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="icon">🎯</span>
              Safe Mode
              <ToggleSwitch isOn={safeMode} />
            </MenuItem>

            <MenuItem
              onClick={() => setShowThemes(!showThemes)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="icon">🎨</span>
              Theme
              <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
                {showThemes ? '▲' : '▼'}
              </span>
            </MenuItem>

            <AnimatePresence>
              {showThemes && (
                <ThemeSubmenu
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {availableThemes.map((theme) => (
                    <ThemeOption
                      key={theme}
                      isActive={themeName === theme}
                      onClick={() => handleThemeChange(theme)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ThemeIcon>{getThemeIcon(theme)}</ThemeIcon>
                      {themes[theme].name}
                    </ThemeOption>
                  ))}
                </ThemeSubmenu>
              )}
            </AnimatePresence>
          </MenuDropdown>
        )}
      </AnimatePresence>
      
      <ScoringModal
        isOpen={showScoringModal}
        onClose={() => setShowScoringModal(false)}
      />
    </MenuContainer>
  );
};