import React, { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

const sway = keyframes`
  0% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
  100% { transform: rotate(-2deg); }
`;

const gentleSway = keyframes`
  0% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
  100% { transform: rotate(-1deg); }
`;


const leafFall = keyframes`
  0% {
    top: -20px;
    opacity: 0;
    transform: translateX(0px) rotate(0deg);
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
    transform: translateX(50px) rotate(360deg);
  }
`;

const leafDrift = keyframes`
  0%, 100% { transform: translateX(0px); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
`;

const hop = keyframes`
  0%, 100% { transform: translateY(0px) scaleX(1); }
  50% { transform: translateY(-20px) scaleX(1.1); }
`;

const scurry = keyframes`
  0% { transform: translateX(-50px); }
  100% { transform: translateX(calc(100vw + 50px)); }
`;

const flutter = keyframes`
  0% { transform: translateX(-100px) translateY(0px); }
  25% { transform: translateX(25vw) translateY(-20px); }
  50% { transform: translateX(50vw) translateY(10px); }
  75% { transform: translateX(75vw) translateY(-15px); }
  100% { transform: translateX(calc(100vw + 100px)) translateY(5px); }
`;

const shimmer = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const ForestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to bottom, 
    #87CEEB 0%,     /* Sky blue */
    #98FB98 30%,    /* Pale green */
    #228B22 60%,    /* Forest green */
    #006400 100%    /* Dark green */
  );
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, 
      transparent 0%, 
      rgba(34, 139, 34, 0.1) 50%, 
      rgba(0, 100, 0, 0.2) 100%
    );
  }
`;

const Tree = styled.div<{ left: number; height: number; delay: number; type: 'pine' | 'oak' | 'birch' }>`
  position: absolute;
  width: ${props => props.type === 'pine' ? '60px' : props.type === 'oak' ? '80px' : '40px'};
  height: ${props => props.height}px;
  left: ${props => props.left}%;
  bottom: 0;
  transform-origin: bottom center;
  ${props => css`
    animation: ${props.type === 'pine' ? sway : gentleSway} ${6 + props.delay}s ease-in-out infinite;
  `}
  animation-delay: ${props => props.delay}s;
  z-index: 1;
  
  /* Tree trunk */
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.type === 'birch' ? '12px' : '20px'};
    height: ${props => props.height * 0.6}px;
    background: ${props => 
      props.type === 'birch' 
        ? 'linear-gradient(to right, #f5f5dc 0%, #ddd 50%, #f5f5dc 100%)' 
        : 'linear-gradient(to right, #8B4513, #A0522D)'
    };
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${props => props.type === 'birch' ? '8px' : '4px'};
    ${props => props.type === 'birch' && `
      background-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.1) 3px,
        rgba(0,0,0,0.1) 4px
      );
    `}
  }
  
  /* Tree foliage */
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.type === 'pine' ? '60px' : props.type === 'oak' ? '80px' : '35px'};
    height: ${props => props.height * 0.7}px;
    background: ${props => 
      props.type === 'pine' 
        ? 'linear-gradient(to bottom, #228B22, #006400)'
        : props.type === 'oak'
        ? 'radial-gradient(ellipse, #32CD32, #228B22)'
        : 'radial-gradient(ellipse, #ADFF2F, #32CD32)'
    };
    bottom: ${props => props.height * 0.4}px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${props => 
      props.type === 'pine' 
        ? '50% 50% 0 0' 
        : '50%'
    };
    ${props => props.type === 'pine' && `
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    `}
  }
`;

const Leaf = styled.div<{ 
  emoji: string;
  left: number; 
  delay: number;
  size: number;
  speed: number;
  color: string;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left}%;
  top: -20px;
  ${props => css`
    animation: 
      ${leafFall} ${props.speed}s linear infinite,
      ${leafDrift} 3s ease-in-out infinite;
  `}
  animation-delay: ${props => props.delay}s;
  z-index: 3;
  font-size: ${props => props.size}px;
  line-height: 1;
  
  &::before {
    content: '${props => props.emoji}';
    position: absolute;
    color: ${props => props.color};
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
`;

const Bush = styled.div<{ left: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size * 0.6}px;
  left: ${props => props.left}%;
  bottom: 0;
  background: radial-gradient(ellipse, #228B22 0%, #006400 100%);
  border-radius: 50% 50% 40% 40%;
  opacity: 0.8;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: radial-gradient(ellipse, #32CD32 0%, #228B22 100%);
    border-radius: 50%;
  }
  
  &::before {
    width: ${props => props.size * 0.7}px;
    height: ${props => props.size * 0.4}px;
    top: -${props => props.size * 0.1}px;
    left: -${props => props.size * 0.1}px;
  }
  
  &::after {
    width: ${props => props.size * 0.6}px;
    height: ${props => props.size * 0.3}px;
    top: -${props => props.size * 0.05}px;
    right: -${props => props.size * 0.1}px;
  }
`;

const Flower = styled.div<{ left: number; bottom: number; color: string; delay: number }>`
  position: absolute;
  width: 15px;
  height: 15px;
  left: ${props => props.left}%;
  bottom: ${props => props.bottom}px;
  ${css`animation: ${shimmer} 4s ease-in-out infinite;`}
  animation-delay: ${props => props.delay}s;
  
  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: ${props => props.color};
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: #FFD700;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Mushroom = styled.div<{ left: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left}%;
  bottom: 5px;
  
  /* Mushroom stem */
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.size * 0.3}px;
    height: ${props => props.size * 0.7}px;
    background: linear-gradient(to right, #F5F5DC, #E6E6FA);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
  
  /* Mushroom cap */
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.size}px;
    height: ${props => props.size * 0.5}px;
    background: radial-gradient(ellipse at 30% 30%, #FF6347, #DC143C);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    bottom: ${props => props.size * 0.4}px;
    left: 0;
    box-shadow: 
      inset -2px -2px 5px rgba(0, 0, 0, 0.2),
      0 2px 5px rgba(0, 0, 0, 0.3);
  }
`;

const WoodlandCreature = styled.div<{ 
  top: number; 
  speed: number;
  delay: number;
  emoji: string;
  animationType: 'hop' | 'scurry' | 'flutter';
}>`
  position: absolute;
  width: 30px;
  height: 25px;
  top: ${props => props.top}%;
  left: ${props => props.animationType === 'scurry' ? '-50px' : '-30px'};
  ${props => {
    if (props.animationType === 'hop') {
      return css`animation: ${hop} 2s ease-in-out infinite, ${scurry} ${props.speed}s linear infinite;`;
    } else if (props.animationType === 'flutter') {
      return css`animation: ${flutter} ${props.speed}s linear infinite;`;
    } else {
      return css`animation: ${scurry} ${props.speed}s linear infinite;`;
    }
  }}
  animation-delay: ${props => props.delay}s;
  z-index: 4;
  font-size: 25px;
  line-height: 1;
  
  &::before {
    content: '${props => props.emoji}';
    position: absolute;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const Sunbeam = styled.div<{ left: number; width: number; delay: number }>`
  position: absolute;
  width: ${props => props.width}px;
  height: 100%;
  left: ${props => props.left}%;
  top: 0;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 0, 0.05) 30%,
    transparent 60%
  );
  ${css`animation: ${shimmer} 8s ease-in-out infinite;`}
  animation-delay: ${props => props.delay}s;
  transform: skewX(-10deg);
  z-index: 2;
`;

const Grass = styled.div<{ left: number; height: number; delay: number }>`
  position: absolute;
  width: 3px;
  height: ${props => props.height}px;
  left: ${props => props.left}%;
  bottom: 0;
  background: linear-gradient(to top, #228B22, #32CD32);
  border-radius: 50% 50% 0 0;
  transform-origin: bottom center;
  ${props => css`animation: ${gentleSway} ${2 + props.delay}s ease-in-out infinite;`}
  animation-delay: ${props => props.delay}s;
  opacity: 0.7;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: ${props => props.height * 0.8}px;
    background: linear-gradient(to top, #228B22, #32CD32);
    border-radius: 50% 50% 0 0;
    bottom: 0;
  }
  
  &::before {
    left: -2px;
    height: ${props => props.height * 0.7}px;
  }
  
  &::after {
    right: -2px;
    height: ${props => props.height * 0.6}px;
  }
`;

export const ForestBackground: React.FC = () => {
  // Generate trees with consistent positioning
  const trees = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const treeTypes: ('pine' | 'oak' | 'birch')[] = ['pine', 'oak', 'birch'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: seedRandom(i * 17) * 90 + 5, // 5% to 95%
      height: seedRandom(i * 23) * 100 + 120, // 120-220px
      delay: seedRandom(i * 29) * 3,
      type: treeTypes[i % treeTypes.length]
    }));
  }, []);

  // Generate falling leaves
  const leaves = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const leafEmojis = ['🍃', '🍂', '🌿'];
    const leafColors = ['#228B22', '#FF6347', '#32CD32', '#FFD700', '#FF4500'];

    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: leafEmojis[i % leafEmojis.length],
      left: seedRandom(i * 13) * 100,
      delay: seedRandom(i * 19) * 20,
      size: seedRandom(i * 31) * 10 + 15, // 15-25px
      speed: seedRandom(i * 37) * 10 + 20, // 20-30s
      color: leafColors[i % leafColors.length]
    }));
  }, []);

  // Generate bushes
  const bushes = useMemo(() => [
    { id: 1, left: 15, size: 60 },
    { id: 2, left: 35, size: 45 },
    { id: 3, left: 55, size: 70 },
    { id: 4, left: 75, size: 50 },
    { id: 5, left: 90, size: 40 }
  ], []);

  // Generate flowers
  const flowers = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const flowerColors = ['#FF69B4', '#FFD700', '#FF6347', '#DDA0DD', '#98FB98'];

    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: seedRandom(i * 11) * 95 + 2.5,
      bottom: seedRandom(i * 17) * 30 + 10,
      color: flowerColors[i % flowerColors.length],
      delay: seedRandom(i * 23) * 4
    }));
  }, []);

  // Generate mushrooms
  const mushrooms = useMemo(() => [
    { id: 1, left: 25, size: 20 },
    { id: 2, left: 60, size: 15 },
    { id: 3, left: 80, size: 18 }
  ], []);

  // Generate woodland creatures
  const creatures = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const creatureData = [
      { emoji: '🐰', animationType: 'hop' as const },
      { emoji: '🐿️', animationType: 'scurry' as const },
      { emoji: '🦋', animationType: 'flutter' as const },
      { emoji: '🐦', animationType: 'flutter' as const },
      { emoji: '🦔', animationType: 'scurry' as const }
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      ...creatureData[i],
      top: seedRandom(i * 31) * 30 + 60, // 60-90% from top
      speed: seedRandom(i * 37) * 20 + 25, // 25-45s
      delay: seedRandom(i * 41) * 15
    }));
  }, []);

  // Generate sunbeams
  const sunbeams = useMemo(() => [
    { id: 1, left: 20, width: 40, delay: 0 },
    { id: 2, left: 60, width: 30, delay: 2 },
    { id: 3, left: 85, width: 35, delay: 4 }
  ], []);

  // Generate grass
  const grassBlades = useMemo(() => {
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: seedRandom(i * 7) * 100,
      height: seedRandom(i * 11) * 15 + 10, // 10-25px
      delay: seedRandom(i * 13) * 2
    }));
  }, []);

  return (
    <ForestContainer>
      {/* Sunbeams */}
      {sunbeams.map(beam => (
        <Sunbeam
          key={beam.id}
          left={beam.left}
          width={beam.width}
          delay={beam.delay}
        />
      ))}

      {/* Trees (background layer) */}
      {trees.map(tree => (
        <Tree
          key={tree.id}
          left={tree.left}
          height={tree.height}
          delay={tree.delay}
          type={tree.type}
        />
      ))}

      {/* Bushes */}
      {bushes.map(bush => (
        <Bush
          key={bush.id}
          left={bush.left}
          size={bush.size}
        />
      ))}

      {/* Grass */}
      {grassBlades.map(grass => (
        <Grass
          key={grass.id}
          left={grass.left}
          height={grass.height}
          delay={grass.delay}
        />
      ))}

      {/* Flowers */}
      {flowers.map(flower => (
        <Flower
          key={flower.id}
          left={flower.left}
          bottom={flower.bottom}
          color={flower.color}
          delay={flower.delay}
        />
      ))}

      {/* Mushrooms */}
      {mushrooms.map(mushroom => (
        <Mushroom
          key={mushroom.id}
          left={mushroom.left}
          size={mushroom.size}
        />
      ))}

      {/* Falling leaves */}
      {leaves.map(leaf => (
        <Leaf
          key={leaf.id}
          emoji={leaf.emoji}
          left={leaf.left}
          delay={leaf.delay}
          size={leaf.size}
          speed={leaf.speed}
          color={leaf.color}
        />
      ))}

      {/* Woodland creatures */}
      {creatures.map(creature => (
        <WoodlandCreature
          key={creature.id}
          top={creature.top}
          speed={creature.speed}
          delay={creature.delay}
          emoji={creature.emoji}
          animationType={creature.animationType}
        />
      ))}
    </ForestContainer>
  );
};