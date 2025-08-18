import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes, Theme, defaultTheme } from '../styles/themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<string>(() => {
    const savedTheme = localStorage.getItem('solitaire-theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'classic';
  });

  const currentTheme = themes[themeName] || defaultTheme;

  useEffect(() => {
    localStorage.setItem('solitaire-theme', themeName);
  }, [themeName]);

  const setTheme = (newThemeName: string) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
    }
  };

  const availableThemes = Object.keys(themes);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme, availableThemes }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};