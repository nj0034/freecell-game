import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const swim = keyframes`
  0% { transform: translateX(-100px) translateY(0px); }
  100% { transform: translateX(calc(100vw + 100px)) translateY(-20px); }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(2deg); }
  66% { transform: translateY(10px) rotate(-2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const bubble = keyframes`
  0% {
    bottom: -50px;
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    bottom: 100vh;
    opacity: 0;
  }
`;

const bubbleWobble = keyframes`
  0%, 100% { transform: translateX(0px); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
`;

const swimFast = keyframes`
  0% { transform: translateX(-100px) translateY(0px); }
  100% { transform: translateX(calc(100vw + 100px)) translateY(10px); }
`;

const swimReverse = keyframes`
  0% { transform: translateX(0px) translateY(0px); }
  100% { transform: translateX(calc(-100vw - 150px)) translateY(-10px); }
`;

const swimReverseZigzag = keyframes`
  0% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(-25vw) translateY(20px); }
  50% { transform: translateX(-50vw) translateY(-20px); }
  75% { transform: translateX(-75vw) translateY(20px); }
  100% { transform: translateX(calc(-100vw - 150px)) translateY(0px); }
`;

const swimZigzag = keyframes`
  0% { transform: translateX(-100px) translateY(0px); }
  25% { transform: translateX(25vw) translateY(-20px); }
  50% { transform: translateX(50vw) translateY(20px); }
  75% { transform: translateX(75vw) translateY(-20px); }
  100% { transform: translateX(calc(100vw + 100px)) translateY(0px); }
`;

const sway = keyframes`
  0% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
  100% { transform: rotate(-3deg); }
`;

const DeepSeaContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to bottom, 
    #001f3f 0%, 
    #003366 20%, 
    #002244 50%, 
    #001122 100%
  );
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, 
      transparent 0%, 
      rgba(0, 100, 200, 0.1) 50%, 
      rgba(0, 50, 100, 0.2) 100%
    );
  }
`;

// Removed the CSS Fish component - now using only emoji fish

const Bubble = styled.div<{ left: number; delay: number; size: number; speed?: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left}%;
  bottom: -50px;
  background: radial-gradient(circle at 30% 30%, 
    rgba(255, 255, 255, 0.8), 
    rgba(255, 255, 255, 0.2)
  );
  border-radius: 50%;
  animation: 
    ${bubble} ${props => props.speed || (8 + Math.random() * 4)}s linear infinite,
    ${bubbleWobble} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    inset -2px -2px 4px rgba(255, 255, 255, 0.5),
    0 0 8px rgba(255, 255, 255, 0.2);
`;

const SmallFish = styled.div<{ 
  emoji: string;
  top: number; 
  speed: number;
  delay: number;
  animationType?: 'zigzag' | 'fast' | 'normal' | 'reverse' | 'reverseZigzag';
}>`
  position: absolute;
  width: 40px;
  height: 30px;
  top: ${props => props.top}%;
  left: ${props => (props.animationType === 'reverse' || props.animationType === 'reverseZigzag') ? 'auto' : '-50px'};
  right: ${props => (props.animationType === 'reverse' || props.animationType === 'reverseZigzag') ? '-100px' : 'auto'};
  animation: ${props => 
    props.animationType === 'zigzag' ? swimZigzag : 
    props.animationType === 'fast' ? swimFast : 
    props.animationType === 'reverse' ? swimReverse :
    props.animationType === 'reverseZigzag' ? swimReverseZigzag :
    swim} ${props => props.speed}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 2;
  font-size: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '${props => props.emoji}';
    position: absolute;
    transform: ${props => 
      (props.animationType === 'reverse' || props.animationType === 'reverseZigzag') 
        ? 'scaleX(1)'  /* Keep original direction for reverse swimming */
        : 'scaleX(-1)' /* Flip for forward swimming */
    };
  }
`;

const Seaweed = styled.div<{ left: number; height: number; delay: number }>`
  position: absolute;
  width: 20px;
  height: ${props => props.height}px;
  left: ${props => props.left}%;
  bottom: 0;
  background: linear-gradient(to top, #2d5a2d, #4a7c4a);
  border-radius: 50% 50% 0 0;
  transform-origin: bottom center;
  animation: ${sway} ${props => 4 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.7;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: ${props => props.height * 0.8}px;
    background: linear-gradient(to top, #2d5a2d, #4a7c4a);
    border-radius: 50% 50% 0 0;
    bottom: 0;
  }
  
  &::before {
    left: -10px;
    height: ${props => props.height * 0.7}px;
  }
  
  &::after {
    right: -10px;
    height: ${props => props.height * 0.6}px;
  }
`;

const Jellyfish = styled.div<{ top: number; left: number }>`
  position: absolute;
  width: 60px;
  height: 80px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${float} 8s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 40px;
    background: radial-gradient(ellipse, 
      rgba(255, 182, 193, 0.6), 
      rgba(255, 105, 180, 0.3)
    );
    border-radius: 50% 50% 40% 40%;
    box-shadow: 0 0 20px rgba(255, 105, 180, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 50px;
    height: 60px;
    top: 20px;
    left: 5px;
    background: linear-gradient(to bottom, 
      rgba(255, 182, 193, 0.3), 
      transparent
    );
    clip-path: polygon(
      10% 0%, 20% 50%, 0% 100%,
      30% 50%, 50% 100%,
      70% 50%, 100% 100%,
      80% 50%, 90% 0%
    );
  }
`;

const Coral = styled.div<{ left: number; color: string }>`
  position: absolute;
  width: 80px;
  height: 60px;
  bottom: 0;
  left: ${props => props.left}%;
  background: ${props => props.color};
  clip-path: polygon(
    20% 100%, 15% 80%, 10% 60%, 5% 40%, 10% 20%, 15% 10%, 20% 5%,
    30% 10%, 35% 20%, 40% 15%, 45% 25%, 50% 20%, 55% 30%, 60% 25%,
    65% 35%, 70% 30%, 75% 40%, 80% 35%, 85% 50%, 90% 70%, 85% 100%
  );
  opacity: 0.6;
  filter: brightness(0.8);
`;

const Submarine = styled.div`
  position: absolute;
  width: 100px;
  height: 40px;
  right: 15%;
  top: 30%;
  animation: ${float} 15s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 80px;
    height: 30px;
    background: #666;
    border-radius: 40px;
    left: 10px;
    top: 5px;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 15px;
    background: #666;
    border-radius: 5px 5px 0 0;
    left: 40px;
    top: -5px;
  }
`;

export const DeepSeaBackground: React.FC = () => {
  // Generate emoji fish - useMemo with seed for consistent randomness
  const emojiFishes = useMemo(() => {
    // Use a simple seed-based random to get consistent values
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🐙', '🐠', '🐟', '🐡', '🦈', '🐠', '🐟', '🐡', '🐙', '🦑', '🦀', '🦞', '🦐', '🐚'];
    
    return Array.from({ length: 12 }, (_, i) => {
      // Mix of forward and reverse swimming fish
      const isReverse = i >= 6;  // Last 6 fish swim reverse
      const baseAnimation = i % 3 === 0 ? 'zigzag' : i % 3 === 1 ? 'fast' : 'normal';
      const animationType = isReverse 
        ? (baseAnimation === 'zigzag' ? 'reverseZigzag' : 'reverse')
        : baseAnimation;
      
      return {
        id: i,
        emoji: fishEmojis[i % fishEmojis.length],
        top: seedRandom(i * 13) * 80 + 10,
        speed: seedRandom(i * 17) * 15 + 25,  // Slower speed (25-40s)
        delay: seedRandom(i * 23) * 12,
        animationType: animationType as 'zigzag' | 'fast' | 'normal' | 'reverse' | 'reverseZigzag'
      };
    });
  }, []);

  // Generate bubbles - useMemo for stable positions
  const bubbles = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: seedRandom(i * 11) * 95 + 2.5,
      delay: seedRandom(i * 19) * 25,  // Spread out delays more
      size: seedRandom(i * 29) * 15 + 5,
      speed: seedRandom(i * 37) * 15 + 15  // Slower speed (15-30s instead of 8-18s)
    }));
  }, []);

  // Generate seaweed - useMemo for stable positions
  const seaweeds = useMemo(() => [
    { id: 1, left: 10, height: 150, delay: 0 },
    { id: 2, left: 25, height: 120, delay: 0.5 },
    { id: 3, left: 45, height: 180, delay: 1 },
    { id: 4, left: 65, height: 140, delay: 1.5 },
    { id: 5, left: 80, height: 160, delay: 2 },
    { id: 6, left: 90, height: 130, delay: 0.3 }
  ], []);

  return (
    <DeepSeaContainer>
      {/* Coral reef */}
      <Coral left={5} color="#ff6b6b" />
      <Coral left={35} color="#ee5a24" />
      <Coral left={70} color="#ffa502" />
      
      {/* Seaweed */}
      {seaweeds.map(seaweed => (
        <Seaweed
          key={seaweed.id}
          left={seaweed.left}
          height={seaweed.height}
          delay={seaweed.delay}
        />
      ))}
      
      {/* Emoji Fish Only */}
      {emojiFishes.map(fish => (
        <SmallFish
          key={`fish-${fish.id}`}
          emoji={fish.emoji}
          top={fish.top}
          speed={fish.speed}
          delay={fish.delay}
          animationType={fish.animationType}
        />
      ))}
      
      {/* Jellyfish */}
      <Jellyfish top={40} left={50} />
      
      {/* Submarine */}
      <Submarine />
      
      {/* Bubbles - More bubbles! */}
      {bubbles.map(b => (
        <Bubble
          key={b.id}
          left={b.left}
          delay={b.delay}
          size={b.size}
          speed={b.speed}
        />
      ))}
    </DeepSeaContainer>
  );
};