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

const SpaceHelmet = styled.div`
  position: relative;
  width: 45px;
  height: 50px;
  background: linear-gradient(135deg, #e0e0e0, #ffffff, #e0e0e0);
  border-radius: 50% 50% 45% 45%;
  border: 2px solid #999;
  box-shadow: 
    inset 0 -5px 10px rgba(0, 0, 0, 0.2),
    0 2px 5px rgba(0, 0, 0, 0.3);
  
  /* Visor */
  &::before {
    content: '';
    position: absolute;
    width: 35px;
    height: 32px;
    background: linear-gradient(135deg, 
      rgba(100, 200, 255, 0.7),
      rgba(50, 100, 200, 0.5),
      rgba(100, 200, 255, 0.7)
    );
    border-radius: 45% 45% 50% 50%;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #66aaff;
    box-shadow: 
      inset 0 2px 5px rgba(255, 255, 255, 0.5),
      0 0 10px rgba(100, 200, 255, 0.5);
  }
  
  /* Reflection on visor */
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 15px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.8),
      transparent
    );
    border-radius: 50%;
    top: 8px;
    left: 8px;
  }
`;

const HelmetAntenna = styled.div`
  position: absolute;
  width: 2px;
  height: 8px;
  background: #666;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  
  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: #ff0000;
    border-radius: 50%;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    animation: blink 2s infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const Face = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background: #fdbcb4;
  border-radius: 45%;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
`;

const Eyes = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
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
  top: 26px;
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
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const SpaceSuit = styled.div`
  position: absolute;
  width: 40px;
  height: 15px;
  background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);
  border-radius: 10px 10px 5px 5px;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #999;
  
  /* Chest control panel */
  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 8px;
    background: #333;
    border-radius: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: inset 0 0 3px rgba(100, 200, 255, 0.5);
  }
  
  /* Suit details */
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: #00ff00;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 2px #00ff00; }
    50% { box-shadow: 0 0 8px #00ff00; }
  }
`;

const OxygenTube = styled.div`
  position: absolute;
  width: 3px;
  height: 8px;
  background: #666;
  bottom: 8px;
  left: 12px;
  border-radius: 2px;
  transform: rotate(-20deg);
  
  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 8px;
    background: #666;
    right: -30px;
    border-radius: 2px;
    transform: rotate(40deg);
  }
`;

interface SpaceKingFaceProps {
  isRed?: boolean;
}

export const SpaceKingFace: React.FC<SpaceKingFaceProps> = ({ isRed }) => {
  return (
    <KingContainer>
      <Face />
      <SpaceHelmet>
        <HelmetAntenna />
      </SpaceHelmet>
      <Eyes>
        <Eye />
        <Eye />
      </Eyes>
      <Nose />
      <Mouth />
      <OxygenTube />
      <SpaceSuit />
    </KingContainer>
  );
};