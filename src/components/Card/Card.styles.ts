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
  background: white;
  box-shadow: ${props => props.isSelected 
    ? '0 8px 20px rgba(0, 0, 0, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.15)'};
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : '#ddd'};
  position: relative;
  transition: all 0.3s ease;
  user-select: none;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  
  .pattern {
    width: 80%;
    height: 90%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
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