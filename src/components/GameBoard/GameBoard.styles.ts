import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BoardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
`;

export const GameArea = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme.boardBackground};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 ${props => props.theme.shadowColor};
  transition: all 0.3s ease;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 20px;
  background: ${props => props.theme.boardBackground};
  border-radius: 15px;
  transition: background 0.3s ease;
  
  .free-cells, .foundations {
    display: flex;
    gap: 15px;
  }
`;

export const BottomSection = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 15px;
  padding: 20px;
  background: ${props => props.theme.boardBackground};
  border-radius: 15px;
  min-height: 500px;
  transition: background 0.3s ease;
`;

export const WinOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.overlayBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const WinMessage = styled.div`
  background: ${props => props.theme.cardBackground};
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px ${props => props.theme.shadowColor};
  
  h1 {
    font-size: 3em;
    margin-bottom: 20px;
    color: ${props => props.theme.primaryColor};
  }
  
  p {
    font-size: 1.2em;
    margin: 10px 0;
    color: ${props => props.theme.text};
  }
  
  button {
    margin-top: 30px;
    padding: 15px 40px;
    font-size: 1.2em;
    background: ${props => props.theme.buttonBackground};
    color: ${props => props.theme.buttonText};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 15px ${props => props.theme.shadowColor};
    transition: all 0.3s ease;
    
    &:hover {
      background: ${props => props.theme.buttonHoverBackground};
      box-shadow: 0 6px 20px ${props => props.theme.shadowColor};
    }
  }
`;

export const Fireworks = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  .firework {
    position: absolute;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
    border-radius: 50%;
    top: 50%;
    left: 50%;
  }
`;