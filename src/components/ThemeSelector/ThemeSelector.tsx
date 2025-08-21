import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeType, themes } from '../../types/theme.types';

const SelectorContainer = styled.div`
  position: relative;
  display: inline-block;
  z-index: 100;
`;

const ThemeButton = styled(motion.button)`
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

const ThemeMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: ${props => props.theme.buttonBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 8px 24px ${props => props.theme.shadowColor};
  min-width: 320px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 100;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primaryColor};
    border-radius: 4px;
    opacity: 0.5;
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const ThemeOption = styled(motion.button)<{ isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: ${props => props.isActive ? props.theme.primaryColor : 'transparent'};
  color: ${props => props.theme.buttonText};
  border: 2px solid ${props => props.isActive ? props.theme.primaryColor : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.primaryColor};
    background: ${props => props.isActive ? props.theme.primaryColor : props.theme.buttonHoverBackground};
  }
`;

const ThemePreview = styled.div<{ bgColor: string; bgImage?: string; bgGradient?: string }>`
  width: 100%;
  height: 80px;
  border-radius: 8px;
  background: ${props => props.bgGradient || props.bgColor};
  background-image: ${props => props.bgImage || 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  ${ThemeOption}:hover &::after {
    transform: translateX(100%);
  }
`;

const MiniCards = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 2px;
`;

const MiniCard = styled.div<{ bgColor: string; textColor: string; isRed: boolean }>`
  width: 16px;
  height: 22px;
  background: ${props => props.bgColor};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${props => props.textColor};
  font-weight: bold;
`;

const ThemeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

const ThemeDescription = styled.div`
  font-size: 11px;
  opacity: 0.7;
  text-align: center;
  margin-top: 4px;
`;

const ThemeIcon = styled.span`
  font-size: 20px;
`;

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleThemeSelect = (theme: ThemeType) => {
    onThemeChange(theme);
    setIsOpen(false);
  };
  
  const getThemeIcon = (theme: ThemeType): string => {
    switch(theme) {
      case ThemeType.CLASSIC: return '🎴';
      case ThemeType.NATURE: return '🌿';
      case ThemeType.SPACE: return '🚀';
      case ThemeType.FANTASY: return '✨';
      case ThemeType.MINIMALIST: return '⚪';
      case ThemeType.NEON: return '💫';
      case ThemeType.OCEAN: return '🌊';
      case ThemeType.VINTAGE: return '📜';
      case ThemeType.FOREST: return '🌲';
      default: return '🎨';
    }
  };
  
  const getThemeDescription = (theme: ThemeType): string => {
    switch(theme) {
      case ThemeType.CLASSIC: return 'Traditional green felt table';
      case ThemeType.NATURE: return 'Organic patterns and earth tones';
      case ThemeType.SPACE: return 'Cosmic adventure with neon accents';
      case ThemeType.FANTASY: return 'Magical realm with mystical symbols';
      case ThemeType.MINIMALIST: return 'Clean and modern design';
      case ThemeType.NEON: return 'Cyberpunk style with glowing effects';
      case ThemeType.OCEAN: return 'Deep sea adventure theme';
      case ThemeType.VINTAGE: return 'Classic antique card design';
      case ThemeType.FOREST: return 'Woodland adventure with nature elements';
      default: return '';
    }
  };
  
  return (
    <SelectorContainer>
      <ThemeButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ThemeIcon>{getThemeIcon(currentTheme)}</ThemeIcon>
        {themes[currentTheme].name} Theme
      </ThemeButton>
      
      <AnimatePresence>
        {isOpen && (
          <ThemeMenu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ThemeGrid>
              {Object.values(ThemeType).map((themeType) => {
                const theme = themes[themeType];
                return (
                  <ThemeOption
                    key={themeType}
                    isActive={currentTheme === themeType}
                    onClick={() => handleThemeSelect(themeType)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ThemePreview 
                      bgColor={theme.backgroundColor}
                      bgImage={theme.backgroundImage}
                      bgGradient={theme.backgroundGradient}
                    >
                      <MiniCards>
                        <MiniCard 
                          bgColor={theme.cardBackground}
                          textColor={theme.redSuitColor}
                          isRed={true}
                        >
                          ♥
                        </MiniCard>
                        <MiniCard 
                          bgColor={theme.cardBackground}
                          textColor={theme.blackSuitColor}
                          isRed={false}
                        >
                          ♠
                        </MiniCard>
                      </MiniCards>
                    </ThemePreview>
                    <ThemeName>
                      {getThemeIcon(themeType)} {theme.name}
                    </ThemeName>
                    <ThemeDescription>
                      {getThemeDescription(themeType)}
                    </ThemeDescription>
                  </ThemeOption>
                );
              })}
            </ThemeGrid>
          </ThemeMenu>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
};