export interface CardFaceStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textShadow?: string;
  suitStyle?: {
    hearts: string;
    diamonds: string;
    clubs: string;
    spades: string;
  };
  patternUrl?: string;
  patternOpacity?: number;
}

export interface Theme {
  name: string;
  background: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  boardBackground: string;
  cardBackground: string;
  cardBackImage?: string;
  cardBackPattern?: string;
  cardBorder: string;
  cardRadius?: string;
  cardFace?: CardFaceStyle;
  redSuitColor?: string;
  blackSuitColor?: string;
  buttonBackground: string;
  buttonHoverBackground: string;
  buttonText: string;
  text: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  shadowColor: string;
  overlayBackground: string;
  glowEffect?: string;
  particleEffect?: boolean;
  animationStyle?: 'smooth' | 'bouncy' | 'elegant' | 'playful';
  foundationStyle?: {
    background: string;
    border: string;
    symbol?: string;
  };
  freeCellStyle?: {
    background: string;
    border: string;
  };
  useAnimatedBackground?: boolean;
}

export const themes: Record<string, Theme> = {
  classic: {
    name: 'Classic',
    background: '#2c5530',
    backgroundGradient: 'radial-gradient(ellipse at center, #3a6b3e 0%, #1e3f20 100%)',
    boardBackground: 'rgba(0, 0, 0, 0.1)',
    cardBackground: '#ffffff',
    cardBorder: '1px solid #333333',
    cardRadius: '8px',
    cardFace: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.4em',
      fontWeight: 'bold'
    },
    redSuitColor: '#d32f2f',
    blackSuitColor: '#1a1a1a',
    buttonBackground: 'rgba(255, 255, 255, 0.95)',
    buttonHoverBackground: '#f5f5f5',
    buttonText: '#333333',
    text: '#ffffff',
    primaryColor: '#4CAF50',
    secondaryColor: '#81C784',
    accentColor: '#FFD700',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    overlayBackground: 'rgba(0, 0, 0, 0.8)',
    animationStyle: 'smooth'
  },
  space: {
    name: 'space',
    background: '#0a0e27',
    backgroundGradient: 'radial-gradient(ellipse at top, #1a1f4e 0%, #0a0e27 50%, #040613 100%)',
    boardBackground: 'rgba(255, 255, 255, 0.05)',
    cardBackground: 'linear-gradient(135deg, #f0f0f5 0%, #e8e8f0 100%)',
    cardBackImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0icGxhbmV0Ij48c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iIzRhNWJhOSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFhMmY3YSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTFmNGUiLz48Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjMwJSIgZmlsbD0idXJsKCNwbGFuZXQpIiBvcGFjaXR5PSIwLjYiLz48ZWxsaXBzZSBjeD0iNTAlIiBjeT0iNTAlIiByeD0iNDUlIiByeT0iMTAlIiBmaWxsPSJub25lIiBzdHJva2U9IiM2YTdhZGYiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC4zIiB0cmFuc2Zvcm09InJvdGF0ZSgtMjAgNTAgNTApIi8+PC9zdmc+)',
    cardBorder: '1px solid #4a5ba9',
    cardRadius: '12px',
    cardFace: {
      fontFamily: 'Orbitron, monospace',
      fontSize: '1.3em',
      fontWeight: '700',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.5)'
    },
    redSuitColor: '#ff1744',
    blackSuitColor: '#1a237e',
    buttonBackground: 'linear-gradient(135deg, #2a2a5e 0%, #3a3a7e 100%)',
    buttonHoverBackground: 'linear-gradient(135deg, #3a3a7e 0%, #4a4a9e 100%)',
    buttonText: '#e0e0ff',
    text: '#ffffff',
    primaryColor: '#6a7adf',
    secondaryColor: '#4a5ba9',
    accentColor: '#ffd93d',
    shadowColor: 'rgba(106, 122, 223, 0.4)',
    overlayBackground: 'rgba(0, 0, 0, 0.9)',
    glowEffect: '0 0 30px rgba(106, 122, 223, 0.5)',
    particleEffect: true,
    animationStyle: 'bouncy',
    foundationStyle: {
      background: 'radial-gradient(ellipse, rgba(106, 122, 223, 0.2) 0%, transparent 70%)',
      border: '2px solid #6a7adf',
      symbol: '✦'
    },
    freeCellStyle: {
      background: 'linear-gradient(135deg, rgba(74, 91, 169, 0.2) 0%, rgba(106, 122, 223, 0.1) 100%)',
      border: '2px solid #4a5ba9'
    },
    useAnimatedBackground: true
  },
  deepsea: {
    name: 'deepsea',
    background: '#001f3f',
    backgroundGradient: 'linear-gradient(to bottom, #001f3f 0%, #003366 20%, #002244 50%, #001122 100%)',
    boardBackground: 'rgba(255, 255, 255, 0.08)',
    cardBackground: 'linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)',
    cardBackImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJmaXNoIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxlbGxpcHNlIGN4PSIzMCIgY3k9IjMwIiByeD0iMTUiIHJ5PSI4IiBmaWxsPSIjNGE5MGE0IiBvcGFjaXR5PSIwLjMiLz48cGF0aCBkPSJNNDUsIDMwIEw1MCwyNSBMNTAsMzUgWiIgZmlsbD0iIzRhOTBhNCIgb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMjIiIGN5PSIyOCIgcj0iMiIgZmlsbD0iIzY3YjdkMSIgb3BhY2l0eT0iMC40Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWE0MDVhIi8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNmaXNoKSIvPjwvc3ZnPg==)',
    cardBorder: '1px solid #4a90a4',
    cardRadius: '10px',
    cardFace: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.35em',
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.4)'
    },
    redSuitColor: '#d32f2f',
    blackSuitColor: '#004d66',
    buttonBackground: 'linear-gradient(135deg, #2c5f7c 0%, #4a90a4 100%)',
    buttonHoverBackground: 'linear-gradient(135deg, #3c6f8c 0%, #5aa0b4 100%)',
    buttonText: '#ffffff',
    text: '#ffffff',
    primaryColor: '#4a90a4',
    secondaryColor: '#2c5f7c',
    accentColor: '#66d9ef',
    shadowColor: 'rgba(74, 144, 164, 0.3)',
    overlayBackground: 'rgba(0, 31, 63, 0.95)',
    glowEffect: '0 0 25px rgba(102, 217, 239, 0.4)',
    animationStyle: 'smooth',
    foundationStyle: {
      background: 'radial-gradient(ellipse, rgba(74, 144, 164, 0.15) 0%, transparent 70%)',
      border: '2px solid #4a90a4',
      symbol: '🐚'
    },
    freeCellStyle: {
      background: 'linear-gradient(135deg, rgba(44, 95, 124, 0.15) 0%, rgba(74, 144, 164, 0.1) 100%)',
      border: '2px solid #2c5f7c'
    },
    useAnimatedBackground: true
  }
};

export const defaultTheme = themes.classic;