import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTheme } from 'styled-components';
import { Card, CardStack } from '../../types/game.types';
import { DifficultyLevel } from '../../utils/difficulty';
import { useGameStore } from '../../store/gameStore';
import { isGameDeadlocked } from '../../utils/deadlockDetection';
import { DeadlockModal } from '../DeadlockModal/DeadlockModal';
import { Tableau } from '../Tableau/Tableau';
import { Foundation } from '../Foundation/Foundation';
import { FreeCell } from '../FreeCell/FreeCell';
import { GameControls } from '../GameControls/GameControls';
import { TestControls } from '../TestControls/TestControls';
import { TestToggle } from '../TestToggle/TestToggle';
import { WarningMessage } from '../WarningMessage/WarningMessage';
import { UndoMessage } from '../UndoMessage/UndoMessage';
import { KingFaceComponent } from '../KingFace/KingFace';
import { SpaceBackground } from '../AnimatedBackgrounds/SpaceBackground';
import { DeepSeaBackground } from '../AnimatedBackgrounds/DeepSeaBackground';
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
  const theme = useTheme() as any;
  const {
    gameState,
    showWinAnimation,
    safeMode,
    lastUndoTime,
    isAutoMoving,
    updateGameState,
    undo,
    canUndo,
    newGame,
    restartGame,
    toggleSafeMode,
    setShowWinAnimation
  } = useGameStore();

  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(() => {
    const saved = localStorage.getItem('solitaire-difficulty');
    return (saved as DifficultyLevel) || DifficultyLevel.MEDIUM;
  });
  const [warningMessage, setWarningMessage] = useState<{ show: boolean; maxCards: number; attemptedCards: number }>({
    show: false,
    maxCards: 0,
    attemptedCards: 0
  });
  const [showTestControls, setShowTestControls] = useState(false);
  const [undoMessage, setUndoMessage] = useState<{ show: boolean; type: 'success' | 'warning'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [gameTime, setGameTime] = useState(0);
  const [showDeadlockModal, setShowDeadlockModal] = useState(false);
  const [deadlockChecked, setDeadlockChecked] = useState(false);
  
  // Create stable close handler for warning message
  const handleWarningClose = useCallback(() => {
    setWarningMessage({ show: false, maxCards: 0, attemptedCards: 0 });
  }, []);

  // 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameState.isGameWon) {
        setGameTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameWon]);

  // 데드락 감지
  useEffect(() => {
    // 게임이 시작되지 않았거나 이미 이긴 경우 체크하지 않음
    if (gameState.moves === 0 || gameState.isGameWon) {
      setDeadlockChecked(false);
      return;
    }

    // 이미 체크했고 모달이 표시 중이면 다시 체크하지 않음
    if (deadlockChecked && showDeadlockModal) {
      return;
    }

    // 약간의 지연 후 데드락 체크 (카드 이동 애니메이션 완료 후)
    const checkTimer = setTimeout(() => {
      if (isGameDeadlocked(gameState)) {
        setShowDeadlockModal(true);
        setDeadlockChecked(true);
      } else {
        setDeadlockChecked(false);
      }
    }, 500);

    return () => clearTimeout(checkTimer);
  }, [gameState, deadlockChecked, showDeadlockModal]);


  const handleNewGame = (difficulty?: DifficultyLevel) => {
    const selectedDifficulty = difficulty || currentDifficulty;
    if (difficulty) {
      setCurrentDifficulty(difficulty);
      localStorage.setItem('solitaire-difficulty', difficulty);
    }
    newGame(selectedDifficulty);
    setGameTime(0); // 새 게임 시작 시 시간 초기화
    setShowDeadlockModal(false); // 데드락 모달 닫기
    setDeadlockChecked(false);
  };

  const handleRestartGame = () => {
    restartGame();
    setGameTime(0); // 다시 시작 시 시간 초기화
    setShowDeadlockModal(false); // 데드락 모달 닫기
    setDeadlockChecked(false);
  };

  const handleUndo = () => {
    const currentTime = Date.now();
    const timeSinceLastUndo = currentTime - lastUndoTime;
    
    // Check if trying to undo twice within 2 seconds
    if (timeSinceLastUndo < 2000 && lastUndoTime > 0) {
      setUndoMessage({
        show: true,
        type: 'warning',
        message: '⚠️ 연속 실행 취소는 신중하게 사용하세요!'
      });
      return; // Don't allow consecutive undos
    }
    
    const undoSuccess = undo();
    
    if (undoSuccess) {
      setUndoMessage({
        show: true,
        type: 'success',
        message: '↩️ 실행 취소 완료!'
      });
      setShowDeadlockModal(false); // 실행 취소 시 데드락 모달 닫기
      setDeadlockChecked(false);
    } else {
      setUndoMessage({
        show: true,
        type: 'warning',
        message: '❌ 실행 취소할 내역이 없습니다'
      });
    }
  };
  
  const handleSafeModeToggle = () => {
    toggleSafeMode();
  };

  // 실행 취소 메시지 닫기 콜백
  const handleCloseUndoMessage = useCallback(() => {
    setUndoMessage(prev => ({ ...prev, show: false }));
  }, []);

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
        ease: "backOut",
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardContainer>
        {/* Animated backgrounds */}
        {theme.useAnimatedBackground && (theme.name === 'Space' || theme.name === 'space') && <SpaceBackground />}
        {theme.useAnimatedBackground && (theme.name === 'Deep Sea' || theme.name === 'deepsea') && <DeepSeaBackground />}
        
        {showTestControls && (
          <TestControls 
            gameState={gameState}
            setGameState={updateGameState}
          />
        )}
        
        <TestToggle 
          onToggle={() => setShowTestControls(!showTestControls)}
          isVisible={showTestControls}
        />
        
        
        <motion.div
          variants={boardVariants}
          initial="initial"
          animate="animate"
        >
          <GameControls
            gameState={gameState}
            gameTime={gameTime}
            currentDifficulty={currentDifficulty}
            onNewGame={handleNewGame}
            onRestartGame={handleRestartGame}
            onUndo={handleUndo}
            canUndo={canUndo()}
            safeMode={safeMode}
            onSafeModeToggle={handleSafeModeToggle}
            isAutoMoving={isAutoMoving}
          />
          
          <GameArea>
            <LayoutGroup>
              <TopSection>
                <div className="free-cells">
                  {gameState.freeCells.map((card: Card | null, index: number) => (
                    <FreeCell
                      key={`freecell-${index}`}
                      card={card}
                      index={index}
                      gameState={gameState}
                      setGameState={updateGameState}
                    />
                  ))}
                </div>
                
                <div className="king-face-container">
                  <KingFaceComponent />
                </div>
                
                <div className="foundations">
                  {gameState.foundations.map((foundation: CardStack, index: number) => (
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
                {gameState.tableau.map((column: CardStack, index: number) => (
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
                {/* 프리미엄 카드들 - 최고 품질 애니메이션 (8개) */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`premium-${i}`}
                    className="firework premium-card"
                    style={{
                      left: `${15 + (i * 10) + Math.random() * 15}%`,
                      top: `${-15 + Math.random() * 25}%`,
                      width: `${28 + Math.random() * 12}px`,
                      height: `${36 + Math.random() * 16}px`,
                    }}
                    initial={{ 
                      scale: 0.1, 
                      opacity: 0,
                      rotateX: 0,
                      rotateY: 0 
                    }}
                    animate={{
                      scale: [0.2, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4],
                      opacity: [0, 1, 1, 0.95, 0.85, 0.6, 0],
                      rotate: [0, 60, 120, 180, 240, 300, 360 + Math.random() * 180],
                      y: [
                        -window.innerHeight * 0.15,
                        window.innerHeight * 0.1,
                        window.innerHeight * 0.35,
                        window.innerHeight * 0.6,
                        window.innerHeight * 0.8,
                        window.innerHeight * 1.05,
                        window.innerHeight * 1.3
                      ],
                      x: [
                        (10 + i * 8) + Math.random() * 10,
                        (12 + i * 8) + Math.random() * 15,
                        (15 + i * 8) + Math.random() * 20,
                        (13 + i * 8) + Math.random() * 15,
                        (10 + i * 8) + Math.random() * 10,
                        (8 + i * 8) + Math.random() * 8,
                        (6 + i * 8) + Math.random() * 6
                      ]
                    }}
                    transition={{
                      duration: 5 + Math.random() * 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 4 + Math.random() * 2,
                      ease: "easeOut",
                      times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1] // 부드러운 시간 분할
                    }}
                  />
                ))}
                
                {/* 스탠다드 카드들 - 중간 품질 (12개) */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`standard-${i}`}
                    className="firework standard-card"
                    style={{
                      left: `${10 + (i * 6.5) + Math.random() * 20}%`,
                      top: `${-10 + Math.random() * 20}%`,
                      width: `${18 + Math.random() * 8}px`,
                      height: `${24 + Math.random() * 10}px`,
                    }}
                    initial={{ 
                      scale: 0.2, 
                      opacity: 0,
                      rotate: 0
                    }}
                    animate={{
                      scale: [0.3, 1.3, 1.1, 0.9, 0.7, 0.4],
                      opacity: [0, 1, 0.9, 0.8, 0.5, 0],
                      rotate: [0, 90, 180, 270, 360, 450 + Math.random() * 90],
                      y: [
                        -window.innerHeight * 0.1,
                        window.innerHeight * 0.2,
                        window.innerHeight * 0.45,
                        window.innerHeight * 0.7,
                        window.innerHeight * 0.95,
                        window.innerHeight * 1.25
                      ],
                      x: [
                        (10 + i * 7) + Math.random() * 15,
                        (15 + i * 7) + Math.random() * 20,
                        (12 + i * 7) + Math.random() * 15,
                        (8 + i * 7) + Math.random() * 10,
                        (5 + i * 7) + Math.random() * 8,
                        (3 + i * 7) + Math.random() * 5
                      ]
                    }}
                    transition={{
                      duration: 4.5 + Math.random() * 1.5,
                      delay: Math.random() * 3 + (i * 0.2),
                      repeat: Infinity,
                      repeatDelay: 3 + Math.random() * 1.5,
                      ease: "easeOut",
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                    }}
                  />
                ))}
                
                {/* 라이트 카드들 - 간단한 애니메이션 (20개) */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`light-${i}`}
                    className="firework light-card"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 30}%`,
                      width: `${12 + Math.random() * 4}px`,
                      height: `${16 + Math.random() * 6}px`,
                    }}
                    initial={{ 
                      scale: 0.3, 
                      opacity: 0 
                    }}
                    animate={{
                      scale: [0.4, 1.1, 0.8, 0.5, 0.2],
                      opacity: [0, 0.9, 0.7, 0.4, 0],
                      rotate: [0, 120, 240, 360 + Math.random() * 180],
                      y: [
                        -window.innerHeight * 0.05,
                        window.innerHeight * 0.3,
                        window.innerHeight * 0.65,
                        window.innerHeight * 1.0,
                        window.innerHeight * 1.35
                      ],
                      x: [
                        Math.random() * 100,
                        Math.random() * 80 + 10,
                        Math.random() * 60 + 20,
                        Math.random() * 40 + 30,
                        Math.random() * 20 + 40
                      ]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 1,
                      delay: Math.random() * 5,
                      repeat: Infinity,
                      repeatDelay: 2 + Math.random() * 1,
                      ease: "easeOut",
                      times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                  />
                ))}
              </Fireworks>
              
              <WinMessage>
                <motion.div
                  className="celebration-title"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 0.1 
                  }}
                >
                  Victory!
                </motion.div>
                
                <motion.div
                  className="celebration-subtitle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                >
                  Game completed successfully
                </motion.div>
                
                <motion.div
                  className="stats-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                >
                  <div className="stat-item">
                    <div className="stat-label">Moves</div>
                    <div className="stat-value">{gameState.moves}</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-label">Time</div>
                    <div className="stat-value">
                      {Math.floor(gameTime / 60)}m {(gameTime % 60)}s
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-label">Score</div>
                    <div className="stat-value">{gameState.score}</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="action-buttons"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                >
                  <button
                    className="celebration-button"
                    onClick={() => handleNewGame()}
                  >
                    New Game
                  </button>
                  
                  <button
                    className="celebration-button"
                    onClick={() => setShowWinAnimation(false)}
                    style={{
                      background: "#64748b",
                      boxShadow: "0 4px 12px rgba(100, 116, 139, 0.3)"
                    }}
                  >
                    Continue
                  </button>
                </motion.div>
              </WinMessage>
            </WinOverlay>
          )}
        </AnimatePresence>
        
        <DeadlockModal
          isOpen={showDeadlockModal}
          canUndo={canUndo()}
          onUndo={() => {
            handleUndo();
            setShowDeadlockModal(false);
          }}
          onRestart={() => {
            handleRestartGame();
            setShowDeadlockModal(false);
          }}
        />
        
        <WarningMessage
          show={warningMessage.show}
          maxCards={warningMessage.maxCards}
          attemptedCards={warningMessage.attemptedCards}
          onClose={handleWarningClose}
        />
        
        <UndoMessage
          show={undoMessage.show}
          type={undoMessage.type}
          message={undoMessage.message}
          onClose={handleCloseUndoMessage}
        />
      </BoardContainer>
    </DndProvider>
  );
};