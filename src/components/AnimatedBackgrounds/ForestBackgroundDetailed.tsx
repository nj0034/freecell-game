import React, { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Subtle natural movement for trees (sway removed - not used)

const gentleSway = keyframes`
  0% { transform: rotate(-0.5deg); }
  50% { transform: rotate(0.5deg); }
  100% { transform: rotate(-0.5deg); }
`;

const leafFall = keyframes`
  0% {
    top: -20px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100vh;
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.4); }
`;

const ForestContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, 
    #87CEEB 0%, 
    #98FB98 30%, 
    #228B22 60%, 
    #006400 100%
  );
  overflow: hidden;
  z-index: 1;
`;

const ForestFloor = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(34, 139, 34, 0.3) 20%,
    rgba(34, 139, 34, 0.6) 60%,
    rgba(0, 100, 0, 0.8) 100%
  );
  z-index: 1;
`;

// Enhanced Atmospheric Effects
const LightRay = styled.div<{ 
  left: number; 
  width: number; 
  delay: number;
  intensity: 'soft' | 'medium' | 'bright';
}>`
  position: absolute;
  width: ${props => props.width}px;
  height: 100%;
  left: ${props => props.left}%;
  top: 0;
  background: ${props => {
    const opacity = props.intensity === 'bright' ? 0.15 : props.intensity === 'medium' ? 0.1 : 0.05;
    return `linear-gradient(to bottom, 
      rgba(255, 255, 200, ${opacity * 0.8}) 0%,
      rgba(255, 255, 140, ${opacity}) 30%,
      rgba(255, 255, 100, ${opacity * 0.6}) 60%,
      transparent 80%
    )`;
  }};
  transform: skewX(-2deg);
  ${css`animation: ${shimmer} 16s ease-in-out infinite;`}
  animation-delay: ${props => props.delay}s;
  z-index: 2;
  pointer-events: none;
`;

// Simple emoji tree component
const EmojiTree = styled.div<{ 
  left: number; 
  delay: number; 
  type: 'pine' | 'oak' | 'birch' | 'maple';
  depth: 'foreground' | 'midground' | 'background';
  size: number;
}>`
  position: absolute;
  left: ${props => props.left}%;
  bottom: 10px;
  font-size: ${props => {
    // Pine/Oak은 더 크게, Birch/Maple은 작게
    if (props.type === 'pine' || props.type === 'oak') {
      return props.size + 20; // 더 크게
    } else {
      return Math.max(props.size - 20, 30); // 더 작게 (최소 30px)
    }
  }}px;
  transform-origin: bottom center;
  z-index: ${props => 
    props.depth === 'foreground' ? 3 : 
    props.depth === 'midground' ? 2 : 1
  };
  opacity: ${props => 
    props.depth === 'foreground' ? 1 : 
    props.depth === 'midground' ? 0.9 : 0.7
  };
  filter: ${props => 
    props.depth === 'background' ? 'blur(1px)' : 'none'
  };
  
  ${props => css`
    animation: ${gentleSway} ${10 + props.delay * 2}s ease-in-out infinite;
  `}
  animation-delay: ${props => props.delay}s;
  
  &::before {
    content: '${props => {
      switch(props.type) {
        case 'pine': return '🌲';
        case 'oak': return '🌳';
        case 'birch': return '🌿';
        case 'maple': return '🍁';
        default: return '🌳';
      }
    }}';
    display: block;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
`;

// Enhanced Falling Leaves with more variety
const DetailedLeaf = styled.div<{ 
  emoji: string;
  left: number; 
  delay: number;
  size: number;
  speed: number;
  leafType: 'oak' | 'maple' | 'birch' | 'pine';
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left}%;
  top: -20px;
  z-index: 4;
  font-size: ${props => props.size}px;
  line-height: 1;
  
  ${props => css`
    animation: ${leafFall} ${props.speed}s linear infinite;
  `}
  animation-delay: ${props => props.delay}s;
  
  &::before {
    content: '${props => props.emoji}';
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
`;

// Enhanced Detailed Creatures with more realistic movement
const DetailedCreature = styled.div<{ 
  top: number; 
  speed: number;
  delay: number;
  creatureType: 'rabbit' | 'squirrel' | 'butterfly' | 'bird' | 'fox' | 'deer';
  animationType: 'hop' | 'scurry' | 'flutter' | 'graze';
}>`
  position: absolute;
  width: ${props => 
    props.creatureType === 'deer' ? '45px' :
    props.creatureType === 'fox' ? '35px' : '30px'
  };
  height: ${props => 
    props.creatureType === 'deer' ? '40px' :
    props.creatureType === 'fox' ? '30px' : '25px'
  };
  top: ${props => props.top}%;
  left: -50px;
  z-index: 5;
  font-size: ${props => 
    props.creatureType === 'deer' ? '35px' :
    props.creatureType === 'fox' ? '28px' : '25px'
  };
  line-height: 1;
  
  ${props => css`
    animation: scurry ${props.speed}s linear infinite;
  `}

  @keyframes scurry {
    0% { transform: translateX(0px); }
    100% { transform: translateX(calc(100vw + 100px)); }
  }
  animation-delay: ${props => props.delay}s;
  
  &::before {
    content: '${props => {
      switch(props.creatureType) {
        case 'rabbit': return '🐰';
        case 'squirrel': return '🐿️';
        case 'butterfly': return '🦋';
        case 'bird': return '🐦';
        case 'fox': return '🦊';
        case 'deer': return '🦌';
        default: return '🐿️';
      }
    }}';
    position: absolute;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  }
`;

// Fireflies for magical atmosphere
const Firefly = styled.div<{ left: number; top: number; delay: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  animation: ${glow} 3s ease-in-out infinite, ${shimmer} 5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 6;
  box-shadow: 0 0 10px #FFD700;
`;

export const ForestBackgroundDetailed: React.FC = () => {
  // Generate detailed trees with different sizes for pine/oak vs birch/maple
  const detailedTrees = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const depths: ('foreground' | 'midground' | 'background')[] = ['foreground', 'midground', 'background'];
    
    // Pine/Oak 더 많이, Birch/Maple 적게
    const pineOakTrees = Array.from({ length: 12 }, (_, i) => ({
      id: `pine-oak-${i}`,
      left: seedRandom(i * 17) * 90 + 5,
      size: seedRandom(i * 23) * 150 + 50, // 50-200px (다양한 크기)
      delay: seedRandom(i * 29) * 4,
      type: i % 2 === 0 ? 'pine' as const : 'oak' as const,
      depth: depths[Math.floor(i / 4)] // 4개씩 배경/중간/전경에 배치
    }));

    const birchMapleTrees = Array.from({ length: 3 }, (_, i) => ({
      id: `birch-maple-${i}`,
      left: seedRandom((i + 10) * 17) * 90 + 5,
      size: seedRandom((i + 10) * 23) * 20 + 40, // 40-60px (작게)
      delay: seedRandom((i + 10) * 29) * 4,
      type: i % 2 === 0 ? 'birch' as const : 'maple' as const,
      depth: depths[i]
    }));

    return [...pineOakTrees, ...birchMapleTrees];
  }, []);

  // Generate enhanced falling leaves
  const detailedLeaves = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const leafTypes: ('oak' | 'maple' | 'birch' | 'pine')[] = ['oak', 'maple', 'birch', 'pine'];

    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: '🍃',
      left: seedRandom(i * 13) * 100,
      delay: seedRandom(i * 19) * 25,
      size: seedRandom(i * 31) * 8 + 12, // 12-20px
      speed: seedRandom(i * 37) * 15 + 25, // 25-40s
      leafType: leafTypes[i % leafTypes.length]
    }));
  }, []);

  // Generate enhanced creatures
  const detailedCreatures = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const creatureData = [
      { type: 'rabbit' as const, animationType: 'hop' as const },
      { type: 'squirrel' as const, animationType: 'scurry' as const },
      { type: 'butterfly' as const, animationType: 'flutter' as const },
      { type: 'deer' as const, animationType: 'graze' as const }
    ];

    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      ...creatureData[i % creatureData.length],
      top: seedRandom(i * 31) * 25 + 65, // 65-90% from top
      speed: seedRandom(i * 37) * 25 + 30, // 30-55s
      delay: seedRandom(i * 41) * 20
    }));
  }, []);

  // Generate fireflies
  const fireflies = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: seedRandom(i * 11) * 90 + 5,
      top: seedRandom(i * 17) * 40 + 30,
      delay: seedRandom(i * 23) * 6
    }));
  }, []);

  // Generate atmospheric light rays
  const lightRays = useMemo(() => [
    { id: 1, left: 15, width: 30, delay: 0, intensity: 'soft' as const },
    { id: 2, left: 45, width: 40, delay: 3, intensity: 'medium' as const },
    { id: 3, left: 75, width: 25, delay: 6, intensity: 'bright' as const },
    { id: 4, left: 85, width: 35, delay: 9, intensity: 'soft' as const }
  ], []);

  return (
    <ForestContainer>
      {/* Forest Floor */}
      <ForestFloor />
      
      {/* Atmospheric Light Rays */}
      {lightRays.map(ray => (
        <LightRay
          key={ray.id}
          left={ray.left}
          width={ray.width}
          delay={ray.delay}
          intensity={ray.intensity}
        />
      ))}

      {/* Background Trees */}
      {detailedTrees.filter(tree => tree.depth === 'background').map(tree => (
        <EmojiTree
          key={`bg-${tree.id}`}
          left={tree.left}
          size={tree.size}
          delay={tree.delay}
          type={tree.type}
          depth={tree.depth}
        />
      ))}

      {/* Midground Trees */}
      {detailedTrees.filter(tree => tree.depth === 'midground').map(tree => (
        <EmojiTree
          key={`mg-${tree.id}`}
          left={tree.left}
          size={tree.size}
          delay={tree.delay}
          type={tree.type}
          depth={tree.depth}
        />
      ))}

      {/* Foreground Trees */}
      {detailedTrees.filter(tree => tree.depth === 'foreground').map(tree => (
        <EmojiTree
          key={`fg-${tree.id}`}
          left={tree.left}
          size={tree.size}
          delay={tree.delay}
          type={tree.type}
          depth={tree.depth}
        />
      ))}

      {/* Enhanced Falling Leaves */}
      {detailedLeaves.map(leaf => (
        <DetailedLeaf
          key={leaf.id}
          emoji={leaf.emoji}
          left={leaf.left}
          delay={leaf.delay}
          size={leaf.size}
          speed={leaf.speed}
          leafType={leaf.leafType}
        />
      ))}

      {/* Detailed Forest Creatures */}
      {detailedCreatures.map(creature => (
        <DetailedCreature
          key={creature.id}
          top={creature.top}
          speed={creature.speed}
          delay={creature.delay}
          creatureType={creature.type}
          animationType={creature.animationType}
        />
      ))}

      {/* Fireflies for magical atmosphere */}
      {fireflies.map(firefly => (
        <Firefly
          key={firefly.id}
          left={firefly.left}
          top={firefly.top}
          delay={firefly.delay}
        />
      ))}
    </ForestContainer>
  );
};