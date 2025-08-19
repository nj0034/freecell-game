import React, { useState } from 'react';
import styled from 'styled-components';
import { GameState } from '../../types/game.types';

const TesterContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme.cardBackground};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px ${props => props.theme.shadowColor};
  z-index: 9000;
  max-width: 400px;
  max-height: 500px;
  overflow-y: auto;
`;

const TestButton = styled.button<{ success?: boolean; failed?: boolean }>`
  padding: 8px 16px;
  margin: 5px;
  background: ${props => 
    props.success ? '#4CAF50' : 
    props.failed ? '#f44336' : 
    props.theme.buttonBackground
  };
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TestSection = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 5px;
`;

const TestTitle = styled.h4`
  margin: 0 0 10px 0;
  color: ${props => props.theme.text};
`;

const StatusText = styled.p<{ success?: boolean }>`
  color: ${props => props.success ? '#4CAF50' : '#f44336'};
  font-size: 0.9em;
  margin: 5px 0;
`;

const InfoText = styled.p`
  color: ${props => props.theme.text};
  font-size: 0.85em;
  margin: 5px 0;
`;

interface UndoTesterProps {
  gameState: GameState;
  onUndo: () => void;
  canUndo: boolean;
}

export const UndoTester: React.FC<UndoTesterProps> = ({
  gameState,
  onUndo,
  canUndo
}) => {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [currentTest, setCurrentTest] = useState<string>('');
  const [moveCount, setMoveCount] = useState<number>(0);
  
  // Track move count changes
  React.useEffect(() => {
    if (gameState.moves !== moveCount) {
      setMoveCount(gameState.moves);
      console.log(`Move count changed: ${moveCount} -> ${gameState.moves}`);
    }
  }, [gameState.moves, moveCount]);
  
  const runTest = (testName: string, testFn: () => void) => {
    setCurrentTest(testName);
    const initialMoves = gameState.moves;
    console.log(`Starting test: ${testName}, Initial moves: ${initialMoves}`);
    
    // Run test action
    testFn();
    
    // Wait for state to update and test undo
    setTimeout(() => {
      const movesAfterAction = gameState.moves;
      console.log(`After action - Moves: ${movesAfterAction}, Can undo: ${canUndo}`);
      
      if (movesAfterAction > initialMoves) {
        // Action was performed, now test undo
        onUndo();
        
        setTimeout(() => {
          const movesAfterUndo = gameState.moves;
          const success = movesAfterUndo === initialMoves;
          
          console.log(`After undo - Moves: ${movesAfterUndo}, Success: ${success}`);
          setTestResults(prev => ({ ...prev, [testName]: success }));
          
          if (!success) {
            console.error(`Test failed: ${testName}`);
            console.error(`Expected moves: ${initialMoves}, Got: ${movesAfterUndo}`);
          }
        }, 500);
      } else {
        console.log(`No move was made in test: ${testName}`);
        setTestResults(prev => ({ ...prev, [testName]: false }));
      }
    }, 500);
  };
  
  const getTestInstructions = () => {
    const tests = [
      {
        name: 'Single Card to Foundation',
        instruction: 'Double-click an Ace or next card in sequence to move it to foundation',
        action: () => console.log('Manual test: Double-click a card to move to foundation')
      },
      {
        name: 'Single Card to FreeCell',
        instruction: 'Click a card to move it to an empty FreeCell',
        action: () => console.log('Manual test: Click a card to move to FreeCell')
      },
      {
        name: 'Single Card Between Tableaus',
        instruction: 'Click a card to move it to another tableau column',
        action: () => console.log('Manual test: Click a card to move between tableaus')
      },
      {
        name: 'Multi-Card Move',
        instruction: 'Click on a sequence of cards to move them together',
        action: () => console.log('Manual test: Click on multiple cards to move them')
      },
      {
        name: 'Drag and Drop',
        instruction: 'Drag a card to another location',
        action: () => console.log('Manual test: Drag and drop a card')
      },
      {
        name: 'Safe Mode Move',
        instruction: 'Click "Safe Move" button to auto-move a card',
        action: () => console.log('Manual test: Use Safe Move button')
      },
      {
        name: 'All to Home Mode',
        instruction: 'Turn off Safe Mode and click "All to Home" to move multiple cards',
        action: () => console.log('Manual test: Use All to Home button')
      },
      {
        name: 'Multiple Undos',
        instruction: 'Make 3 moves, then undo 3 times',
        action: () => console.log('Manual test: Make multiple moves and undo them all')
      }
    ];
    
    return tests;
  };
  
  return (
    <TesterContainer>
      <TestTitle>🧪 Undo Test Suite</TestTitle>
      
      <InfoText>
        Current State: Moves: {gameState.moves} | Can Undo: {canUndo ? 'Yes' : 'No'}
      </InfoText>
      
      <TestSection>
        <TestTitle>Manual Test Instructions:</TestTitle>
        {getTestInstructions().map((test, index) => (
          <div key={test.name}>
            <InfoText>
              {index + 1}. <strong>{test.name}</strong>
            </InfoText>
            <InfoText style={{ marginLeft: '20px' }}>
              → {test.instruction}
            </InfoText>
            <TestButton
              onClick={() => runTest(test.name, test.action)}
              success={testResults[test.name] === true}
              failed={testResults[test.name] === false}
            >
              Start Test
            </TestButton>
            {testResults[test.name] !== undefined && (
              <StatusText success={testResults[test.name]}>
                {testResults[test.name] ? '✅ Undo worked!' : '❌ Undo failed!'}
              </StatusText>
            )}
          </div>
        ))}
      </TestSection>
      
      <TestSection>
        <TestTitle>Test Results Summary:</TestTitle>
        {Object.entries(testResults).map(([test, result]) => (
          <StatusText key={test} success={result}>
            {test}: {result ? 'PASSED' : 'FAILED'}
          </StatusText>
        ))}
      </TestSection>
      
      <TestButton onClick={onUndo} disabled={!canUndo}>
        Manual Undo Test
      </TestButton>
      
      {currentTest && (
        <InfoText>Currently testing: {currentTest}</InfoText>
      )}
    </TesterContainer>
  );
};