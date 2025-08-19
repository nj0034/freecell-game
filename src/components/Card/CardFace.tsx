import React from 'react';
import styled from 'styled-components';
import { Card as CardType } from '../../types/game.types';
import { ThemeConfig } from '../../types/theme.types';

const CardFaceContainer = styled.div<{ isRed: boolean; theme: any }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8px;
  color: ${props => props.isRed ? props.theme.redSuitColor : props.theme.blackSuitColor};
  font-family: ${props => props.theme.cardFace?.fontFamily || 'Georgia, serif'};
  font-size: ${props => props.theme.cardFace?.fontSize || '1.4em'};
  font-weight: ${props => props.theme.cardFace?.fontWeight || 'bold'};
  text-shadow: ${props => props.theme.cardFace?.textShadow || 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.cardFace?.patternUrl || 'none'};
    opacity: ${props => props.theme.cardFace?.patternOpacity || 0};
    pointer-events: none;
  }
`;

const CardValue = styled.div`
  position: absolute;
  font-size: 0.9em;
  font-weight: bold;
  line-height: 1;
  
  &.top-left {
    top: 8px;
    left: 8px;
  }
  
  &.bottom-right {
    bottom: 8px;
    right: 8px;
    transform: rotate(180deg);
  }
`;

const CardSuit = styled.div`
  position: absolute;
  font-size: 0.6em;
  
  &.top-left {
    top: 26px;
    left: 8px;
  }
  
  &.bottom-right {
    bottom: 26px;
    right: 8px;
    transform: rotate(180deg);
  }
`;

const CenterContent = styled.div<{ isFaceCard: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isFaceCard ? '2.5em' : '2em'};
  flex: 1;
  width: 100%;
  
  ${props => props.isFaceCard && `
    &::before {
      content: '';
      position: absolute;
      width: 80%;
      height: 80%;
      border: 2px solid currentColor;
      border-radius: 8px;
      opacity: 0.2;
    }
  `}
`;

const PipLayout = styled.div<{ layout: string }>`
  position: absolute;
  width: 70%;
  height: 80%;
  display: grid;
  font-size: 1.2em;
  
  ${props => {
    switch(props.layout) {
      case '2':
        return `
          grid-template-rows: 1fr 1fr;
          align-items: start end;
          justify-items: center;
        `;
      case '3':
        return `
          grid-template-rows: 1fr 1fr 1fr;
          align-items: start center end;
          justify-items: center;
        `;
      case '4':
        return `
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        `;
      case '5':
        return `
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          & > :nth-child(5) {
            grid-column: 1 / -1;
            justify-self: center;
          }
        `;
      case '6':
        return `
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
        `;
      case '7':
        return `
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr 1fr;
          & > :nth-child(7) {
            grid-column: 1 / -1;
            justify-self: center;
          }
        `;
      case '8':
        return `
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr 1fr;
        `;
      case '9':
        return `
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
        `;
      case '10':
        return `
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr 1fr;
          & > :nth-child(5) {
            grid-column: 2;
            grid-row: 2;
          }
          & > :nth-child(10) {
            grid-column: 2;
            grid-row: 3;
          }
        `;
      default:
        return '';
    }
  }}
`;

interface CardFaceProps {
  card: CardType;
  theme?: ThemeConfig;
}

export const CardFace: React.FC<CardFaceProps> = ({ card, theme }) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  
  const getSuitSymbol = (suit: string): string => {
    if (theme?.cardFace?.suitStyle?.[suit as keyof typeof theme.cardFace.suitStyle]) {
      return theme.cardFace.suitStyle[suit as keyof typeof theme.cardFace.suitStyle];
    }
    
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };
  
  const getValueDisplay = (rank: number): string => {
    switch (rank) {
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      case 1: return 'A';
      default: return rank.toString();
    }
  };
  
  const isFaceCard = [11, 12, 13].includes(card.rank);
  const isAce = card.rank === 1;
  const suitSymbol = getSuitSymbol(card.suit);
  const valueDisplay = getValueDisplay(card.rank);
  
  const renderPips = () => {
    const numValue = card.rank;
    if (numValue < 2 || numValue > 10) return null;
    
    const pips = Array(numValue).fill(null).map((_, index) => (
      <span key={index}>{suitSymbol}</span>
    ));
    
    return (
      <PipLayout layout={numValue.toString()}>
        {pips}
      </PipLayout>
    );
  };
  
  const renderCenterContent = () => {
    if (isFaceCard) {
      const faceSymbol = card.rank === 11 ? 'J' : card.rank === 12 ? 'Q' : 'K';
      return (
        <CenterContent isFaceCard={true}>
          <span>{faceSymbol}</span>
        </CenterContent>
      );
    } else if (isAce) {
      return (
        <CenterContent isFaceCard={false}>
          <span style={{ fontSize: '2.5em' }}>{suitSymbol}</span>
        </CenterContent>
      );
    } else {
      return renderPips();
    }
  };
  
  return (
    <CardFaceContainer isRed={isRed}>
      <CardValue className="top-left">{valueDisplay}</CardValue>
      <CardSuit className="top-left">{suitSymbol}</CardSuit>
      
      {renderCenterContent()}
      
      <CardValue className="bottom-right">{valueDisplay}</CardValue>
      <CardSuit className="bottom-right">{suitSymbol}</CardSuit>
    </CardFaceContainer>
  );
};