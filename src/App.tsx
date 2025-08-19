import React from 'react';
import { GameBoard } from './components/GameBoard/GameBoard';
import { GlobalStyles } from './styles/global.styles';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <GameBoard />
    </ThemeProvider>
  );
}

export default App;