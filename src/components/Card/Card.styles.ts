import styled from 'styled-components';

interface CardStyleProps {
  isSelected?: boolean;
  color?: 'red' | 'black';
  size?: 'small' | 'large';
}

export const CardContainer = styled.div<CardStyleProps>`
  width: 90px;
  height: 125px;
  border-radius: 8px;
  background: ${props => props.theme.cardBackground};
  box-shadow: ${props => props.isSelected 
    ? `0 8px 20px ${props.theme.shadowColor}` 
    : `0 2px 8px ${props.theme.shadowColor}`};
  border: 2px solid ${props => props.isSelected ? props.theme.primaryColor : props.theme.cardBorder};
  position: relative;
  transition: all 0.3s ease;
  user-select: none;
  
  &:hover {
    box-shadow: 0 4px 12px ${props => props.theme.shadowColor};
  }
`;

export const CardFace = styled.div<CardStyleProps>`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  background: ${props => props.theme.cardBackground};
  
  .card-header, .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-footer {
    transform: rotate(180deg);
  }
  
  .card-center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
`;

export const CardBack = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: ${props => props.theme.primaryColor};
  display: flex;
  justify-content: center;
  align-items: center;
  
  .pattern {
    width: 80%;
    height: 90%;
    border: 2px solid ${props => props.theme.cardBorder};
    border-radius: 4px;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      ${props => props.theme.boardBackground} 10px,
      ${props => props.theme.boardBackground} 20px
    );
  }
`;

export const SuitSymbol = styled.span<CardStyleProps>`
  color: ${props => props.color === 'red' ? '#e53e3e' : '#2d3748'};
  font-size: ${props => props.size === 'large' ? '48px' : '20px'};
  font-weight: bold;
  line-height: 1;
`;

export const RankText = styled.span<CardStyleProps>`
  color: ${props => props.color === 'red' ? '#e53e3e' : '#2d3748'};
  font-size: 18px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
`;