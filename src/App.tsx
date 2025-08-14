import React from 'react';
import { GameBoard } from './components/GameBoard/GameBoard';
import { GlobalStyles } from './styles/global.styles';

function App() {
  return (
    <>
      <GlobalStyles />
      <GameBoard />
    </>
  );
}

export default App;