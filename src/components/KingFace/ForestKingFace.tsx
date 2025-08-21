import React from 'react';
import styled, { keyframes } from 'styled-components';

const leafFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(5deg); }
`;

const shimmer = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

const gentleSway = keyframes`
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
`;

const KingContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Ranger hat with feather
const RangerHat = styled.div`
  position: relative;
  width: 50px;
  height: 45px;
  background: linear-gradient(135deg, #8B4513, #A0522D, #CD853F);
  border-radius: 45% 45% 0 0;
  border: 2px solid #654321;
  box-shadow: 
    inset 0 -3px 6px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.4);
  
  /* Hat brim */
  &::before {
    content: '';
    position: absolute;
    width: 55px;
    height: 12px;
    background: linear-gradient(135deg, #654321, #8B4513);
    border-radius: 50%;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #4a3018;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }
  
  /* Hat band */
  &::after {
    content: '';
    position: absolute;
    width: 45px;
    height: 6px;
    background: linear-gradient(to right, #2F4F2F, #228B22);
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  }
`;

// Feather on the hat
const Feather = styled.div`
  position: absolute;
  width: 25px;
  height: 3px;
  background: linear-gradient(to right, #8B4513, #DEB887);
  top: 5px;
  right: 5px;
  border-radius: 2px;
  transform: rotate(15deg);
  animation: ${gentleSway} 4s ease-in-out infinite;
  
  /* Feather barbs */
  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 15px;
    background: #228B22;
    left: -2px;
    top: -6px;
    border-radius: 50% 0 50% 0;
    opacity: 0.8;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 12px;
    background: #32CD32;
    left: 3px;
    top: -4px;
    border-radius: 50% 0 50% 0;
    opacity: 0.6;
  }
`;

const Face = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
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

// Ranger uniform/vest
const RangerVest = styled.div`
  position: absolute;
  width: 45px;
  height: 18px;
  background: linear-gradient(to bottom, #556B2F, #6B8E23);
  border-radius: 10px 10px 5px 5px;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #2F4F2F;
  z-index: 0;
  
  /* Vest buttons */
  &::before {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    background: #8B4513;
    border-radius: 50%;
    top: 3px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 
      0 6px 0 #8B4513,
      inset 0 1px 1px rgba(255, 255, 255, 0.3);
  }
  
  /* Collar */
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 8px;
    background: #8B4513;
    border-radius: 50% 50% 0 0;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #654321;
  }
`;

// Badge/patch on the vest
const RangerBadge = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  top: 5px;
  right: 8px;
  border: 1px solid #B8860B;
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.3);
  
  /* Badge symbol */
  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: #228B22;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
`;

// Backpack straps
const BackpackStrap = styled.div`
  position: absolute;
  width: 4px;
  height: 15px;
  background: linear-gradient(to bottom, #8B4513, #654321);
  bottom: 5px;
  border-radius: 2px;
  
  &:first-of-type {
    left: 8px;
    transform: rotate(-15deg);
  }
  
  &:nth-of-type(2) {
    right: 8px;
    transform: rotate(15deg);
  }
`;

// Beard with natural, woodsy look
const Beard = styled.div`
  position: absolute;
  width: 20px;
  height: 12px;
  background: linear-gradient(to bottom, #8B4513, #A0522D);
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 40% 40%;
  z-index: 1;
  
  /* Beard texture */
  &::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 8px;
    background: linear-gradient(to bottom, #A0522D, #CD853F);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0 0 30% 30%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 4px;
    background: #8B4513;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0 0 20% 20%;
  }
`;

// Small decorative leaves around the character
const DecorativeLeaf = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  width: 8px;
  height: 8px;
  top: -2px;
  ${props => props.position}: -8px;
  animation: ${leafFloat} 3s ease-in-out infinite;
  animation-delay: ${props => props.position === 'left' ? '0s' : '1.5s'};
  
  &::before {
    content: '🍃';
    position: absolute;
    font-size: 8px;
    animation: ${shimmer} 4s ease-in-out infinite;
  }
`;

// Compass hanging from belt
const Compass = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #C0C0C0, #696969);
  border-radius: 50%;
  bottom: 2px;
  left: 15px;
  border: 1px solid #2F4F2F;
  
  &::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 2px;
    background: #FF0000;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 4px;
    background: #2F4F2F;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

interface ForestKingFaceProps {
  isRed?: boolean;
}

export const ForestKingFace: React.FC<ForestKingFaceProps> = ({ isRed }) => {
  return (
    <KingContainer>
      <Face />
      <RangerHat>
        <Feather />
      </RangerHat>
      <Eyes>
        <Eye />
        <Eye />
      </Eyes>
      <Nose />
      <Mouth />
      <Beard />
      <RangerVest>
        <RangerBadge />
      </RangerVest>
      <BackpackStrap />
      <BackpackStrap />
      <Compass />
      <DecorativeLeaf position="left" />
      <DecorativeLeaf position="right" />
    </KingContainer>
  );
};