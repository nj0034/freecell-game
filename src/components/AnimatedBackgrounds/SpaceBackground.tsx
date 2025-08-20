import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-20px) translateX(10px); }
  66% { transform: translateY(10px) translateX(-5px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const shootingStar = keyframes`
  0% {
    transform: translateX(-100px) translateY(-100px) rotate(45deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(100vw + 100px)) translateY(calc(100vh + 100px)) rotate(45deg);
    opacity: 0;
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpaceContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to bottom, #000428, #004e92);
  z-index: 0;
`;

const Star = styled.div<{ size: number; left: number; top: number; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  animation: ${twinkle} ${props => 2 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  box-shadow: 0 0 ${props => props.size * 2}px white;
`;

const Planet = styled.div<{ size: number; left: number; top: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  animation: ${float} 20s ease-in-out infinite;
  box-shadow: 
    inset -${props => props.size / 4}px -${props => props.size / 4}px ${props => props.size / 2}px rgba(0, 0, 0, 0.3),
    0 0 ${props => props.size / 2}px ${props => props.color}40;
  
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.size * 1.5}px;
    height: ${props => props.size * 0.15}px;
    background: ${props => props.color}60;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateZ(-15deg);
  }
`;

const Comet = styled.div<{ delay: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, white, transparent);
  border-radius: 50%;
  animation: ${shootingStar} ${props => 8 + props.delay}s linear infinite;
  animation-delay: ${props => props.delay}s;
  
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, white, transparent);
    top: 1px;
    left: -100px;
    opacity: 0.6;
  }
`;

const Nebula = styled.div<{ left: number; top: number }>`
  position: absolute;
  width: 300px;
  height: 300px;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  background: radial-gradient(circle, 
    rgba(138, 43, 226, 0.1) 0%, 
    rgba(75, 0, 130, 0.05) 40%, 
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(40px);
  animation: ${rotate} 60s linear infinite;
`;

const SpaceStation = styled.div`
  position: absolute;
  width: 60px;
  height: 40px;
  right: 10%;
  top: 20%;
  animation: ${float} 30s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 10px;
    background: #c0c0c0;
    border-radius: 5px;
    top: 15px;
    left: 10px;
    box-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 4px;
    background: #c0c0c0;
    top: 18px;
    left: 0;
    box-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
  }
`;

export const SpaceBackground: React.FC = () => {
  // Generate random stars - useMemo to prevent regeneration
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3
  })), []);

  // Generate planets - useMemo for stable positions
  const planets = useMemo(() => [
    { id: 1, size: 80, left: 10, top: 15, color: '#ff6b6b' },
    { id: 2, size: 60, left: 70, top: 60, color: '#4ecdc4' },
    { id: 3, size: 40, left: 85, top: 25, color: '#f7b731' },
    { id: 4, size: 30, left: 45, top: 80, color: '#5f27cd' }
  ], []);

  // Generate comets - useMemo for stable delays
  const comets = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 3
  })), []);

  return (
    <SpaceContainer>
      {/* Nebulas for atmosphere */}
      <Nebula left={20} top={30} />
      <Nebula left={60} top={10} />
      <Nebula left={80} top={70} />
      
      {/* Stars */}
      {stars.map(star => (
        <Star 
          key={star.id}
          size={star.size}
          left={star.left}
          top={star.top}
          delay={star.delay}
        />
      ))}
      
      {/* Planets */}
      {planets.map(planet => (
        <Planet
          key={planet.id}
          size={planet.size}
          left={planet.left}
          top={planet.top}
          color={planet.color}
        />
      ))}
      
      {/* Shooting stars/comets */}
      {comets.map(comet => (
        <Comet key={comet.id} delay={comet.delay} />
      ))}
      
      {/* Space station */}
      <SpaceStation />
    </SpaceContainer>
  );
};