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
  position: relative;
  z-index: 1;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: ${props => props.theme.boardBackground};
  border-radius: 15px;
  transition: background 0.3s ease;
  
  .free-cells, .foundations {
    display: flex;
    gap: 15px;
  }
  
  .king-face-container {
    position: relative;
    z-index: 5;
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
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const WinMessage = styled.div`
  /* Clean Modern Container */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  text-align: center;
  
  /* Simple Shadow */
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
    
  /* Minimal Border */
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1001;
  
  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: min(85vw, 600px);
  width: 100%;
  margin: 0 auto;
  padding: clamp(32px, 5vw, 48px) clamp(40px, 6vw, 64px);
  
  .celebration-title {
    font-size: clamp(2.5em, 6vw, 3.5em);
    font-weight: 700;
    margin-bottom: 16px;
    color: #2c3e50;
    text-align: center;
    width: 100%;
    letter-spacing: -0.5px;
    white-space: nowrap;
    overflow: visible;
  }
  
  .celebration-subtitle {
    font-size: 1.4em;
    font-weight: 500;
    margin: 16px 0 32px 0;
    color: #64748b;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin: 24px 0;
    width: 100%;
  }
  
  .stat-item {
    background: rgba(248, 250, 252, 0.8);
    padding: 20px 16px;
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      background: rgba(248, 250, 252, 1);
    }
    
    .stat-label {
      font-size: 0.9em;
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 1.6em;
      font-weight: 700;
      color: #1e293b;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 16px;
    margin-top: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .celebration-button {
    padding: 16px 32px;
    font-size: 1.1em;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    background: #3b82f6;
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      background: #2563eb;
    }
    
    &:active {
      transform: translateY(0px);
    }
  }
`;

export const Fireworks = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
  
  .firework {
    position: absolute;
    width: 20px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    opacity: 1 !important;
    overflow: hidden; /* 심볼이 카드 경계를 넘지 않도록 */
    /* 기본 pseudo-elements 제거 - 각 카드 타입에서 정의 */
  }
  
  /* 프리미엄 카드 - 최고 품질 효과 */
  .premium-card {
    transform-style: preserve-3d;
    backface-visibility: visible;
    
    &::after {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 8px;
      background: linear-gradient(45deg, 
        rgba(255, 215, 0, 0.4),
        rgba(255, 105, 180, 0.3),
        rgba(0, 255, 255, 0.4),
        rgba(255, 69, 0, 0.3)
      );
      animation: premiumGlow 2s ease-in-out infinite;
      z-index: -1;
    }
  }
  
  /* 스탠다드 카드 - 중간 품질 효과 */
  .standard-card {
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 6px;
      background: linear-gradient(45deg, 
        rgba(255, 215, 0, 0.2),
        rgba(255, 105, 180, 0.15),
        rgba(0, 255, 255, 0.2)
      );
      animation: standardGlow 3s ease-in-out infinite;
      z-index: -1;
    }
  }
  
  /* 라이트 카드 - 간단한 효과만 */
  .light-card {
    /* 글로우 효과 없음 - 성능 최적화 */
  }
  
  @keyframes premiumGlow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
      filter: blur(2px);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.15);
      filter: blur(1px);
    }
  }
  
  @keyframes standardGlow {
    0%, 100% {
      opacity: 0.1;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.05);
    }
  }
  
  /* 하트 카드 (빨간색) */
  .firework:nth-child(4n+1) {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 2px solid #cc0000 !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    
    &::before {
      content: '♥' !important;
      position: absolute;
      color: #cc0000 !important;
      font-size: max(6px, min(11px, 0.55em)); /* 카드 크기에 비례하는 폰트 크기 */
      font-weight: bold;
      top: 0.05em;
      left: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    &::after {
      content: 'K' !important;
      position: absolute;
      color: #cc0000 !important;
      font-size: max(5px, min(9px, 0.45em)); /* 카드 크기에 비례하는 폰트 크기 */
      font-weight: bold;
      bottom: 0.05em;
      right: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    /* animation은 Framer Motion에서 처리 */
    
    /* 프리미엄 카드만 화려한 효과 */
    &.premium-card {
      background: radial-gradient(ellipse at center, #ffffff 60%, #ffeaea 100%) !important;
      border: 3px solid #cc0000 !important;
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.6),
        0 0 20px rgba(255, 255, 255, 1),
        0 0 30px rgba(204, 0, 0, 0.4),
        inset 0 2px 0 rgba(255, 255, 255, 1) !important;
      filter: drop-shadow(0 0 5px rgba(204, 0, 0, 0.5));
      
      &::before {
        font-size: 12px;
        text-shadow: 
          0 1px 3px rgba(0, 0, 0, 0.4),
          0 0 8px rgba(255, 255, 255, 0.8);
        animation: heartBeat 1.5s ease-in-out infinite;
      }
      
      &::after {
        font-size: 10px;
        text-shadow: 
          0 1px 3px rgba(0, 0, 0, 0.4),
          0 0 6px rgba(255, 255, 255, 0.6);
      }
    }
  }
  
  @keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  /* 다이아몬드 카드 (빨간색) */
  .firework:nth-child(4n+2) {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 2px solid #dc143c !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    
    &::before {
      content: '♦' !important;
      position: absolute;
      color: #dc143c !important;
      font-size: max(6px, min(11px, 0.55em));
      font-weight: bold;
      top: 0.05em;
      left: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    &::after {
      content: 'Q' !important;
      position: absolute;
      color: #dc143c !important;
      font-size: max(5px, min(9px, 0.45em));
      font-weight: bold;
      bottom: 0.05em;
      right: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    /* animation은 Framer Motion에서 처리 */
    
    /* 프리미엄 카드만 화려한 효과 */
    &.premium-card {
      background: radial-gradient(ellipse at center, #ffffff 50%, #fff5f5 100%) !important;
      border: 3px solid #dc143c !important;
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.6),
        0 0 25px rgba(255, 255, 255, 1),
        0 0 35px rgba(220, 20, 60, 0.5),
        inset 0 2px 0 rgba(255, 255, 255, 1) !important;
      filter: drop-shadow(0 0 8px rgba(220, 20, 60, 0.6));
      
      &::before {
        font-size: max(7px, min(12px, 0.6em));
        text-shadow: 
          0 1px 3px rgba(0, 0, 0, 0.4),
          0 0 10px rgba(255, 255, 255, 0.9);
        animation: diamondSparkle 2s ease-in-out infinite;
      }
      
      &::after {
        font-size: max(6px, min(10px, 0.5em));
        text-shadow: 
          0 1px 3px rgba(0, 0, 0, 0.4),
          0 0 6px rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  @keyframes diamondSparkle {
    0%, 100% { 
      transform: scale(1) rotate(0deg); 
      filter: brightness(1);
    }
    25% { 
      transform: scale(1.1) rotate(15deg); 
      filter: brightness(1.3);
    }
    75% { 
      transform: scale(1.1) rotate(-15deg); 
      filter: brightness(1.3);
    }
  }
  
  /* 클럽 카드 (검은색) */
  .firework:nth-child(4n+3) {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 2px solid #1a1a1a !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    
    &::before {
      content: '♣' !important;
      position: absolute;
      color: #1a1a1a !important;
      font-size: max(6px, min(11px, 0.55em));
      font-weight: bold;
      top: 0.05em;
      left: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
    }
    
    &::after {
      content: 'J' !important;
      position: absolute;
      color: #1a1a1a !important;
      font-size: max(5px, min(9px, 0.45em));
      font-weight: bold;
      bottom: 0.05em;
      right: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
    }
    
    /* animation은 Framer Motion에서 처리 */
    
    /* 프리미엄 카드만 화려한 효과 */
    &.premium-card {
      background: radial-gradient(ellipse at center, #ffffff 50%, #f8f8f8 100%) !important;
      border: 3px solid #1a1a1a !important;
      box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.7),
        0 0 20px rgba(255, 255, 255, 1),
        0 0 30px rgba(26, 26, 26, 0.6),
        inset 0 2px 0 rgba(255, 255, 255, 1) !important;
      filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.8));
      
      &::before {
        font-size: max(7px, min(12px, 0.6em));
        text-shadow: 
          0 1px 3px rgba(255, 255, 255, 0.5),
          0 0 8px rgba(255, 255, 255, 0.3);
        animation: clubPulse 1.8s ease-in-out infinite;
      }
      
      &::after {
        font-size: max(6px, min(10px, 0.5em));
        text-shadow: 
          0 1px 3px rgba(255, 255, 255, 0.4),
          0 0 6px rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  @keyframes clubPulse {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1;
    }
    50% { 
      transform: scale(1.15); 
      opacity: 0.8;
    }
  }
  
  /* 스페이드 카드 (검은색) */
  .firework:nth-child(4n+4) {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 2px solid #000000 !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
    
    &::before {
      content: '♠' !important;
      position: absolute;
      color: #000000 !important;
      font-size: max(6px, min(11px, 0.55em));
      font-weight: bold;
      top: 0.05em;
      left: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
    }
    
    &::after {
      content: 'A' !important;
      position: absolute;
      color: #000000 !important;
      font-size: max(5px, min(9px, 0.45em));
      font-weight: bold;
      bottom: 0.05em;
      right: 0.1em;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
    }
    
    /* animation은 Framer Motion에서 처리 */
    
    /* 프리미엄 카드만 화려한 효과 */
    &.premium-card {
      background: radial-gradient(ellipse at center, #ffffff 45%, #f0f0f0 100%) !important;
      border: 3px solid #000000 !important;
      box-shadow: 
        0 5px 18px rgba(0, 0, 0, 0.8),
        0 0 25px rgba(255, 255, 255, 1),
        0 0 40px rgba(0, 0, 0, 0.4),
        0 0 60px rgba(255, 215, 0, 0.3),
        inset 0 3px 0 rgba(255, 255, 255, 1) !important;
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
      
      &::before {
        font-size: max(7px, min(13px, 0.65em));
        text-shadow: 
          0 1px 4px rgba(255, 255, 255, 0.6),
          0 0 12px rgba(255, 215, 0, 0.8),
          0 0 20px rgba(255, 215, 0, 0.4);
        animation: spadeGlow 2.5s ease-in-out infinite;
      }
      
      &::after {
        font-size: max(6px, min(11px, 0.55em));
        text-shadow: 
          0 1px 3px rgba(255, 255, 255, 0.5),
          0 0 8px rgba(255, 215, 0, 0.6);
      }
    }
  }
  
  @keyframes spadeGlow {
    0%, 100% { 
      transform: scale(1); 
      filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
    }
    33% { 
      transform: scale(1.2); 
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
    }
    66% { 
      transform: scale(1.1); 
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
    }
  }
  
  
`;