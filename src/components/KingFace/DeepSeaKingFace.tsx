import React from 'react';
import styled from 'styled-components';

const KingContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DivingHelmet = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #d4af37, #ffd700, #b8860b);
  border-radius: 50%;
  border: 3px solid #8b7500;
  box-shadow: 
    inset 0 -5px 10px rgba(0, 0, 0, 0.3),
    0 2px 5px rgba(0, 0, 0, 0.4);
  
  /* Glass visor */
  &::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    background: radial-gradient(circle at 30% 30%, 
      rgba(150, 200, 255, 0.8),
      rgba(50, 100, 150, 0.6),
      rgba(0, 50, 100, 0.4)
    );
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #8b7500;
    box-shadow: 
      inset 0 2px 5px rgba(255, 255, 255, 0.3),
      0 0 15px rgba(100, 150, 200, 0.5);
  }
  
  /* Glass reflection */
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 14px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.7),
      transparent
    );
    border-radius: 50%;
    top: 10px;
    left: 10px;
  }
`;

const HelmetBolts = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  
  /* Top bolt */
  &::before {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background: #666;
    border-radius: 50%;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  /* Side bolts */
  &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background: #666;
    border-radius: 50%;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
    box-shadow: 
      inset 0 1px 2px rgba(0, 0, 0, 0.5),
      32px 0 0 #666;
  }
`;

const Face = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  background: #fdbcb4;
  border-radius: 45%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
`;

const Eyes = styled.div`
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 1;
`;

const Eye = styled.div`
  width: 4px;
  height: 4px;
  background: #000;
  border-radius: 50%;
`;

const Nose = styled.div`
  position: absolute;
  width: 3px;
  height: 4px;
  background: #fdbcb4;
  filter: brightness(0.9);
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Mouth = styled.div`
  position: absolute;
  width: 10px;
  height: 4px;
  border-bottom: 1.5px solid #000;
  border-radius: 0 0 50% 50%;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const DivingSuit = styled.div`
  position: absolute;
  width: 42px;
  height: 15px;
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  border-radius: 10px 10px 5px 5px;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #1a252f;
  
  /* Suit collar */
  &::before {
    content: '';
    position: absolute;
    width: 25px;
    height: 8px;
    background: #8b7500;
    border-radius: 50% 50% 0 0;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #6b5500;
  }
`;

const OxygenHose = styled.div`
  position: absolute;
  width: 4px;
  height: 10px;
  background: #444;
  bottom: 10px;
  left: 10px;
  border-radius: 2px;
  transform: rotate(-25deg);
  
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: #666;
    border-radius: 50%;
    top: -3px;
    left: -1px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 10px;
    background: #444;
    right: -32px;
    border-radius: 2px;
    transform: rotate(50deg);
  }
`;

const Bubbles = styled.div`
  position: absolute;
  top: -5px;
  right: 5px;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.3)
    );
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.5);
    animation: float 3s ease-in-out infinite;
  }
  
  &::before {
    width: 4px;
    height: 4px;
    animation-delay: 0s;
  }
  
  &::after {
    width: 3px;
    height: 3px;
    top: -6px;
    left: 3px;
    animation-delay: 1s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); opacity: 0.8; }
    50% { transform: translateY(-3px); opacity: 0.4; }
  }
`;

interface DeepSeaKingFaceProps {
  isRed?: boolean;
}

export const DeepSeaKingFace: React.FC<DeepSeaKingFaceProps> = ({ isRed }) => {
  return (
    <KingContainer>
      <Face />
      <DivingHelmet>
        <HelmetBolts />
      </DivingHelmet>
      <Eyes>
        <Eye />
        <Eye />
      </Eyes>
      <Nose />
      <Mouth />
      <OxygenHose />
      <DivingSuit />
      <Bubbles />
    </KingContainer>
  );
};