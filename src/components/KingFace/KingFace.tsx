import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
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

const PixelEye = styled.div<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 30px;
  ${props => props.side === 'left' ? 'left: 20px;' : 'right: 20px;'}
  width: 8px;
  height: 8px;
  background: #000000;
  border-radius: 50%;
  image-rendering: pixelated;
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
`;

interface KingFaceProps {
  className?: string;
}

export const KingFaceComponent: React.FC<KingFaceProps> = ({ className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const kingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (kingRef.current) {
        const rect = kingRef.current.getBoundingClientRect();
        const kingCenterX = rect.left + rect.width / 2;
        const kingCenterY = rect.top + rect.height / 2;
        
        // 마우스와 킹 얼굴 중심 사이의 벡터 계산
        const deltaX = e.clientX - kingCenterX;
        const deltaY = e.clientY - kingCenterY;
        
        // 눈동자가 움직일 수 있는 최대 거리 (눈 크기의 40%)
        const maxDistance = 2;
        
        // 거리 정규화
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 100, 1) * maxDistance : 0;
        const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 100, 1) * maxDistance : 0;
        
        setMousePosition({ x: normalizedX, y: normalizedY });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <KingContainer ref={kingRef} className={className}>
      <PixelKing>
        <CrownSpikes />
        <CrownGem />
        
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
      </PixelKing>
    </KingContainer>
  );
};