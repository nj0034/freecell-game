import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { motion } from 'framer-motion';

const KingContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// Default King Design (Classic Theme)
const PixelKing = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(to bottom,
    /* Crown */
    #FFD700 0%, #FFD700 20%,
    /* Face */
    #FFDBAC 20%, #FFDBAC 80%,
    /* Collar */
    #8B4513 80%, #8B4513 100%
  );
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  border: 2px solid #000000;
  border-radius: 4px;
`;

// Space King Design
const SpaceKing = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(to bottom,
    /* Space Helmet Top */
    #e0e0e0 0%, #ffffff 15%,
    /* Visor Area */
    rgba(100, 200, 255, 0.6) 15%, rgba(50, 150, 200, 0.5) 35%,
    /* Face Area (through visor) */
    rgba(253, 188, 180, 0.9) 35%, rgba(253, 188, 180, 0.9) 65%,
    /* Space Suit Collar */
    #c0c0c0 65%, #a0a0a0 100%
  );
  image-rendering: pixelated;
  border: 2px solid #666;
  border-radius: 35% 35% 10% 10%;
  box-shadow: 0 0 20px rgba(100, 200, 255, 0.3);
  
  /* Helmet reflection */
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 25px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.8),
      transparent
    );
    border-radius: 50%;
    top: 10px;
    left: 10px;
  }
  
  /* Antenna */
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 15px;
    background: linear-gradient(to top, #888, #ccc);
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

// Deep Sea King Design
const DeepSeaKing = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(to bottom,
    /* Diving Helmet Top (brass) */
    #d4af37 0%, #ffd700 10%, #b8860b 20%,
    /* Glass Visor */
    rgba(150, 200, 255, 0.4) 20%, rgba(50, 100, 150, 0.3) 40%,
    /* Face Area (through glass) */
    rgba(253, 188, 180, 0.85) 40%, rgba(253, 188, 180, 0.85) 65%,
    /* Diving Suit */
    #2c3e50 65%, #34495e 100%
  );
  image-rendering: pixelated;
  border: 3px solid #8b7500;
  border-radius: 45% 45% 15% 15%;
  box-shadow: 
    inset 0 -5px 10px rgba(0, 0, 0, 0.3),
    0 0 25px rgba(100, 150, 200, 0.2);
  
  /* Glass shine */
  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 30px;
    background: radial-gradient(ellipse at top,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
  }
`;

// Forest King Design (Ranger/Woodsman)
const ForestKing = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(to bottom,
    /* Ranger Hat */
    #8B4513 0%, #A0522D 10%, #CD853F 20%,
    /* Hat Band */
    #228B22 20%, #228B22 25%,
    /* Face Area */
    rgba(253, 188, 180, 1) 25%, rgba(253, 188, 180, 1) 65%,
    /* Ranger Vest */
    #556B2F 65%, #6B8E23 100%
  );
  image-rendering: pixelated;
  border: 2px solid #654321;
  border-radius: 40% 40% 15% 15%;
  box-shadow: 
    inset 0 -3px 6px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.4);
  
  /* Hat brim shadow */
  &::before {
    content: '';
    position: absolute;
    width: 75px;
    height: 8px;
    background: rgba(101, 67, 33, 0.6);
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
  }
  
  /* Feather */
  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 15px;
    background: linear-gradient(to top, #8B4513, #228B22);
    top: 2px;
    right: 8px;
    border-radius: 2px;
    transform: rotate(15deg);
  }
`;

// Shared Face Elements
const PixelEye = styled.div<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 30px;
  ${props => props.side === 'left' ? 'left: 20px;' : 'right: 20px;'}
  width: 8px;
  height: 8px;
  background: #000000;
  border-radius: 50%;
  image-rendering: pixelated;
  z-index: 2;
`;

const PixelPupil = styled(motion.div)`
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffffff;
  border-radius: 50%;
  image-rendering: pixelated;
  top: 2px;
  left: 2px;
`;

const Nose = styled.div`
  position: absolute;
  top: 42px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 6px;
  background: #DEB887;
  border-radius: 2px;
  image-rendering: pixelated;
  z-index: 2;
`;

const Mustache = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 6px;
  background: #8B4513;
  border-radius: 3px;
  image-rendering: pixelated;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: -4px;
    width: 8px;
    height: 2px;
    background: #8B4513;
    border-radius: 1px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    right: -4px;
    width: 8px;
    height: 2px;
    background: #8B4513;
    border-radius: 1px;
  }
`;

// Theme-specific additions
const CrownSpikes = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 16px;
  background: 
    linear-gradient(45deg, transparent 30%, #FFD700 30%, #FFD700 70%, transparent 70%),
    linear-gradient(45deg, transparent 30%, #FFD700 30%, #FFD700 70%, transparent 70%);
  background-size: 12px 16px;
  background-position: 0 0, 24px 0;
  image-rendering: pixelated;
`;

const CrownGem = styled.div`
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #FF0000;
  border-radius: 50%;
  border: 1px solid #000000;
  image-rendering: pixelated;
`;

// Space theme specific elements
const SpaceAntenna = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 12px;
  background: #888;
  
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: #ff0000;
    border-radius: 50%;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    animation: blink 2s infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const OxygenTubes = styled.div`
  position: absolute;
  bottom: 15px;
  width: 100%;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 20px;
    background: #666;
    border-radius: 3px;
  }
  
  &::before {
    left: 15px;
    transform: rotate(-25deg);
  }
  
  &::after {
    right: 15px;
    transform: rotate(25deg);
  }
`;

// Deep sea theme specific elements
const DivingBolts = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: #666;
    border-radius: 50%;
    border: 1px solid #444;
  }
  
  &::before {
    top: 8px;
    left: 8px;
  }
  
  &::after {
    top: 8px;
    right: 8px;
  }
`;

// Forest theme specific elements
const RangerBadge = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
  top: 55px;
  right: 10px;
  border: 1px solid #B8860B;
  
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

const ForestLeaves = styled.div`
  position: absolute;
  top: -2px;
  left: -5px;
  
  &::before,
  &::after {
    content: '🍃';
    position: absolute;
    font-size: 8px;
    animation: gentleFloat 4s ease-in-out infinite;
  }
  
  &::before {
    animation-delay: 0s;
  }
  
  &::after {
    top: 5px;
    left: 8px;
    animation-delay: 2s;
  }
  
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-2px) rotate(5deg); }
  }
`;

const Bubbles = styled.div`
  position: absolute;
  top: -10px;
  right: -5px;
  
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
    width: 6px;
    height: 6px;
    animation-delay: 0s;
  }
  
  &::after {
    width: 4px;
    height: 4px;
    top: -8px;
    left: 5px;
    animation-delay: 1.5s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); opacity: 0.8; }
    50% { transform: translateY(-5px); opacity: 0.4; }
  }
`;

interface KingFaceProps {
  className?: string;
}

export const KingFaceComponent: React.FC<KingFaceProps> = ({ className }) => {
  const theme = useTheme() as any;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const kingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (kingRef.current) {
        const rect = kingRef.current.getBoundingClientRect();
        const kingCenterX = rect.left + rect.width / 2;
        const kingCenterY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - kingCenterX;
        const deltaY = e.clientY - kingCenterY;
        
        const maxDistance = 2;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 100, 1) * maxDistance : 0;
        const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 100, 1) * maxDistance : 0;
        
        setMousePosition({ x: normalizedX, y: normalizedY });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Choose the appropriate king design based on theme
  const KingDesign = (theme.name === 'Space' || theme.name === 'space') ? SpaceKing : 
                     (theme.name === 'Deep Sea' || theme.name === 'deepsea') ? DeepSeaKing :
                     (theme.name === 'forest') ? ForestKing :
                     PixelKing;

  return (
    <KingContainer ref={kingRef} className={className}>
      <KingDesign>
        {/* Classic theme gets crown */}
        {theme.name !== 'Space' && theme.name !== 'space' && theme.name !== 'Deep Sea' && theme.name !== 'deepsea' && theme.name !== 'forest' && (
          <>
            <CrownSpikes />
            <CrownGem />
          </>
        )}
        
        {/* Space theme specific elements */}
        {(theme.name === 'Space' || theme.name === 'space') && (
          <>
            <SpaceAntenna />
            <OxygenTubes />
          </>
        )}
        
        {/* Deep Sea theme specific elements */}
        {(theme.name === 'Deep Sea' || theme.name === 'deepsea') && (
          <>
            <DivingBolts />
            <Bubbles />
          </>
        )}
        
        {/* Forest theme specific elements */}
        {theme.name === 'forest' && (
          <>
            <RangerBadge />
            <ForestLeaves />
          </>
        )}
        
        {/* Face elements (shared across all themes) */}
        <PixelEye side="left">
          <PixelPupil
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.1
            }}
          />
        </PixelEye>
        
        <PixelEye side="right">
          <PixelPupil
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.1
            }}
          />
        </PixelEye>
        
        <Nose />
        <Mustache />
      </KingDesign>
    </KingContainer>
  );
};