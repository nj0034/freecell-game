import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { GameState } from '../../types/game.types';
import { initializeGame, checkWinCondition } from '../../utils/gameLogic';
import { performCascadingSafeAutoMoves } from '../../utils/safeAutoMove';
import { executeAutoMove } from '../../utils/autoMove';
import { 
  GameHistory, 
  createHistory, 
  addStateToHistory, 
  undo as performUndo,
  redo as performRedo,
  updateHistoryIndex,
  canUndo,
  canRedo,
  cloneGameState
} from '../../utils/undoRedo';
import { Tableau } from '../Tableau/Tableau';
import { Foundation } from '../Foundation/Foundation';
import { FreeCell } from '../FreeCell/FreeCell';
import { GameControls } from '../GameControls/GameControls';
// import { TestControls } from '../TestControls/TestControls';
import { WarningMessage } from '../WarningMessage/WarningMessage';
import {
  BoardContainer,
  GameArea,
  TopSection,
  BottomSection,
  WinOverlay,
  WinMessage,
  Fireworks
} from './GameBoard.styles';

export const GameBoard: React.FC = () => {
  const initialState = initializeGame();
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [gameHistory, setGameHistory] = useState<GameHistory>(createHistory(initialState));
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [warningMessage, setWarningMessage] = useState<{ show: boolean; maxCards: number; attemptedCards: number }>({
    show: false,
    maxCards: 0,
    attemptedCards: 0
  });

  useEffect(() => {
    // 타이머 설정
    const timer = setInterval(() => {
      if (!gameState.isGameWon) {
        setGameState(prev => ({
          ...prev,
          time: prev.time + 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameWon]);

  useEffect(() => {
    // 승리 조건 확인
    if (checkWinCondition(gameState.foundations)) {
      setGameState(prev => ({ ...prev, isGameWon: true }));
      setShowWinAnimation(true);
    }
  }, [gameState.foundations]);

  // 게임 상태가 변경될 때마다 히스토리에 추가
  const updateGameState = useCallback((newState: GameState | ((prev: GameState) => GameState)) => {
    setGameState(prevState => {
      const updatedState = typeof newState === 'function' ? newState(prevState) : newState;
      
      // 상태가 실제로 변경된 경우에만 히스토리에 추가
      if (JSON.stringify(prevState) !== JSON.stringify(updatedState)) {
        setGameHistory(history => addStateToHistory(history, cloneGameState(updatedState)));
      }
      
      return updatedState;
    });
  }, []);

  const handleNewGame = () => {
    const newGame = initializeGame();
    setGameState(newGame);
    setGameHistory(createHistory(newGame));
    setShowWinAnimation(false);
  };

  const handleUndo = () => {
    if (canUndo(gameHistory)) {
      const previousState = performUndo(gameHistory);
      if (previousState) {
        setGameState(cloneGameState(previousState));
        setGameHistory(history => updateHistoryIndex(history, 'undo'));
        console.log('Undo performed');
      }
    }
  };

  const handleRedo = () => {
    if (canRedo(gameHistory)) {
      const nextState = performRedo(gameHistory);
      if (nextState) {
        setGameState(cloneGameState(nextState));
        setGameHistory(history => updateHistoryIndex(history, 'redo'));
        console.log('Redo performed');
      }
    }
  };

  const handleHint = () => {
    // 힌트 표시 로직
    console.log('Show hint');
  };

  const handleAutoComplete = () => {
    updateGameState(prev => ({
      ...prev,
      isAutoCompleteActive: true
    }));
    // 자동 완성 로직 구현
  };

  const handleSafeAutoMove = () => {
    const cascadingMoves = performCascadingSafeAutoMoves(gameState);
    
    if (cascadingMoves.length > 0) {
      // 애니메이션을 위해 순차적으로 이동 수행
      cascadingMoves.forEach((move, index) => {
        setTimeout(() => {
          updateGameState(prevState => {
            const newState = executeAutoMove(
              move.card,
              move.from,
              move.to,
              prevState
            );
            
            console.log(`Auto-move: ${move.card.rank} of ${move.card.suit} to foundation`);
            return newState;
          });
        }, index * 200); // 각 이동 사이 200ms 딜레이
      });
      
      console.log(`Performing ${cascadingMoves.length} cascading auto-moves`);
    } else {
      console.log('No safe auto-moves available');
    }
  };

  const boardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const winVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardContainer>
        {/* <TestControls 
          gameState={gameState}
          setGameState={updateGameState}
        /> */}
        
        <motion.div
          variants={boardVariants}
          initial="initial"
          animate="animate"
        >
          <GameControls
            gameState={gameState}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onHint={handleHint}
            onAutoComplete={handleAutoComplete}
            onSafeAutoMove={handleSafeAutoMove}
            canUndo={canUndo(gameHistory)}
            canRedo={canRedo(gameHistory)}
          />
          
          <GameArea>
            <LayoutGroup>
              <TopSection>
                <div className="free-cells">
                  {gameState.freeCells.map((card, index) => (
                    <FreeCell
                      key={`freecell-${index}`}
                      card={card}
                      index={index}
                      gameState={gameState}
                      setGameState={updateGameState}
                    />
                  ))}
                </div>
                
                <div className="foundations">
                  {gameState.foundations.map((foundation, index) => (
                    <Foundation
                      key={`foundation-${index}`}
                      cards={foundation}
                      index={index}
                      gameState={gameState}
                      setGameState={updateGameState}
                    />
                  ))}
                </div>
              </TopSection>
              
              <BottomSection>
                {gameState.tableau.map((column, index) => (
                  <Tableau
                    key={`tableau-${index}`}
                    cards={column}
                    columnIndex={index}
                    gameState={gameState}
                    setGameState={updateGameState}
                    onWarning={(max, attempted) => {
                      setWarningMessage({
                        show: true,
                        maxCards: max,
                        attemptedCards: attempted
                      });
                    }}
                  />
                ))}
              </BottomSection>
            </LayoutGroup>
          </GameArea>
        </motion.div>
        
        <AnimatePresence>
          {showWinAnimation && (
            <WinOverlay
              variants={winVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Fireworks>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="firework"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 1.5],
                      opacity: [1, 1, 0],
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                ))}
              </Fireworks>
              
              <WinMessage>
                <h1>🎉 Congratulations! 🎉</h1>
                <p>You won in {gameState.moves} moves!</p>
                <p>Time: {Math.floor(gameState.time / 60)}:{(gameState.time % 60).toString().padStart(2, '0')}</p>
                <p>Score: {gameState.score}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewGame}
                >
                  New Game
                </motion.button>
              </WinMessage>
            </WinOverlay>
          )}
        </AnimatePresence>
        
        <WarningMessage
          show={warningMessage.show}
          maxCards={warningMessage.maxCards}
          attemptedCards={warningMessage.attemptedCards}
          onClose={() => setWarningMessage({ show: false, maxCards: 0, attemptedCards: 0 })}
        />
      </BoardContainer>
    </DndProvider>
  );
};