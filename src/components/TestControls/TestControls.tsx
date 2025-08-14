import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { GameState } from '../../types/game.types';
import {
  createFoundationTestState,
  createTableauTestState,
  createFreeCellTestState,
  createAlmostWonTestState,
  createComplexTestState,
  createSafeAutoMoveTestState,
  createMultiCardMoveTestState
} from '../../utils/testScenarios';

const TestPanel = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 250px;
`;

const TestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
`;

const TestTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2em;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

const TestButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  margin: 5px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ToggleButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const TestSection = styled.div`
  margin: 15px 0;
`;

const SectionTitle = styled.h4`
  margin: 10px 0 8px;
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TestInfo = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 0.85em;
  color: #666;
`;

const TestBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 600;
  margin-left: 10px;
`;

interface TestControlsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const TestControls: React.FC<TestControlsProps> = ({
  gameState,
  setGameState
}) => {
  const [showTestPanel, setShowTestPanel] = useState(false);

  const loadTestScenario = (scenarioFunc: () => GameState) => {
    const newState = scenarioFunc();
    setGameState(newState);
    console.log('🧪 Test scenario loaded:', newState);
  };

  const toggleAllCards = () => {
    setGameState(prev => ({
      ...prev,
      tableau: prev.tableau.map(column =>
        column.map(card => ({ ...card, faceUp: !card.faceUp }))
      )
    }));
  };

  const instantWin = () => {
    setGameState(prev => {
      const newState = { ...prev };
      // 모든 카드를 파운데이션으로 이동
      const allCards = [...newState.tableau.flat(), ...newState.freeCells.filter(c => c !== null)];
      
      newState.tableau = [[], [], [], [], [], [], [], []];
      newState.freeCells = [null, null, null, null];
      newState.foundations = [[], [], [], []];
      
      // 슈트별로 정렬하여 파운데이션에 배치
      const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
      suits.forEach((suit, index) => {
        const suitCards = allCards
          .filter(card => card && card.suit === suit)
          .sort((a, b) => (a?.rank || 0) - (b?.rank || 0));
        newState.foundations[index] = suitCards as any[];
      });
      
      newState.isGameWon = true;
      newState.score = 520;
      return newState;
    });
  };

  const clearBoard = () => {
    setGameState(prev => ({
      ...prev,
      tableau: [[], [], [], [], [], [], [], []],
      foundations: [[], [], [], []],
      freeCells: [null, null, null, null],
      moveHistory: [],
      selectedCards: [],
      score: 0,
      moves: 0
    }));
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 300, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      x: 300,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {!showTestPanel && (
          <ToggleButton
            onClick={() => setShowTestPanel(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🧪 테스트 모드
          </ToggleButton>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTestPanel && (
          <TestPanel
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TestHeader>
              <TestTitle>
                테스트 모드
                {gameState.testMode && <TestBadge>활성</TestBadge>}
              </TestTitle>
              <CloseButton onClick={() => setShowTestPanel(false)}>
                ✕
              </CloseButton>
            </TestHeader>

            <TestSection>
              <SectionTitle>📋 테스트 시나리오</SectionTitle>
              
              <TestButton
                onClick={() => loadTestScenario(createFoundationTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎯 파운데이션 테스트
              </TestButton>
              
              <TestButton
                onClick={() => loadTestScenario(createTableauTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔄 테이블로 이동 테스트
              </TestButton>
              
              <TestButton
                onClick={() => loadTestScenario(createFreeCellTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📦 프리셀 테스트
              </TestButton>
              
              <TestButton
                onClick={() => loadTestScenario(createAlmostWonTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🏆 거의 완성 테스트
              </TestButton>
              
              <TestButton
                onClick={() => loadTestScenario(createComplexTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🧩 복잡한 배치 테스트
              </TestButton>
              
              <TestButton
                onClick={() => loadTestScenario(createSafeAutoMoveTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎯 안전 자동이동 테스트
              </TestButton>
              
              <TestButton
                onClick={() => loadTestScenario(createMultiCardMoveTestState)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔢 다중 카드 이동 테스트
              </TestButton>
            </TestSection>

            <TestSection>
              <SectionTitle>⚡ 빠른 동작</SectionTitle>
              
              <TestButton
                onClick={toggleAllCards}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔄 모든 카드 뒤집기
              </TestButton>
              
              <TestButton
                onClick={instantWin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎉 즉시 승리
              </TestButton>
              
              <TestButton
                onClick={clearBoard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🗑️ 보드 초기화
              </TestButton>
            </TestSection>

            <TestInfo>
              💡 테스트 모드에서는 다양한 게임 상황을 빠르게 설정하고 테스트할 수 있습니다.
              <br /><br />
              콘솔에서 드래그 앤 드롭 로그를 확인하세요.
            </TestInfo>
          </TestPanel>
        )}
      </AnimatePresence>
    </>
  );
};