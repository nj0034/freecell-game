import React from 'react';
import { GameBoard } from './components/GameBoard/GameBoard';
import { GlobalStyles } from './styles/global.styles';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSelector } from './components/ThemeSelector/ThemeSelector';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <ThemeSelector />
      <GameBoard />
    </ThemeProvider>
  );
}

export default App;