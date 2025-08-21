export enum ThemeType {
  CLASSIC = 'classic',
  NATURE = 'nature',
  SPACE = 'space',
  FANTASY = 'fantasy',
  MINIMALIST = 'minimalist',
  NEON = 'neon',
  OCEAN = 'ocean',
  VINTAGE = 'vintage',
  FOREST = 'forest'
}

export interface CardFaceStyle {
  // Card number/face styles
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textShadow?: string;
  
  // Special card face images (for J, Q, K, A)
  aceImage?: string;
  jackImage?: string;
  queenImage?: string;
  kingImage?: string;
  
  // Suit symbol customization
  suitStyle?: {
    hearts: string;
    diamonds: string;
    clubs: string;
    spades: string;
  };
  
  // Card decoration patterns
  patternUrl?: string;
  patternOpacity?: number;
}

export interface ThemeConfig {
  name: string;
  type: ThemeType;
  
  // Background
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundColor: string;
  backgroundBlur?: string;
  
  // Card appearance
  cardBackground: string;
  cardBackImage?: string;
  cardBackPattern?: string;
  cardBorder: string;
  cardShadow: string;
  cardRadius: string;
  
  // Card face customization
  cardFace: CardFaceStyle;
  
  // Colors
  redSuitColor: string;
  blackSuitColor: string;
  
  // UI Elements
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  buttonBackground: string;
  buttonText: string;
  buttonHoverBackground: string;
  shadowColor: string;
  
  // Special effects
  glowEffect?: string;
  particleEffect?: boolean;
  animationStyle?: 'smooth' | 'bouncy' | 'elegant' | 'playful';
  
  // Foundation and FreeCell styles
  foundationStyle?: {
    background: string;
    border: string;
    symbol?: string;
  };
  
  freeCellStyle?: {
    background: string;
    border: string;
  };
}

export const themes: Record<ThemeType, ThemeConfig> = {
  [ThemeType.CLASSIC]: {
    name: 'Classic',
    type: ThemeType.CLASSIC,
    backgroundColor: '#2c5530',
    backgroundGradient: 'radial-gradient(ellipse at center, #3a6b3e 0%, #1e3f20 100%)',
    cardBackground: '#ffffff',
    cardBorder: '1px solid #333333',
    cardShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    cardRadius: '8px',
    cardFace: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.4em',
      fontWeight: 'bold'
    },
    redSuitColor: '#d32f2f',
    blackSuitColor: '#1a1a1a',
    primaryColor: '#4CAF50',
    secondaryColor: '#81C784',
    accentColor: '#FFD700',
    buttonBackground: 'rgba(255, 255, 255, 0.95)',
    buttonText: '#333333',
    buttonHoverBackground: '#f5f5f5',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    animationStyle: 'smooth'
  },
  
  [ThemeType.NATURE]: {
    name: 'Nature',
    type: ThemeType.NATURE,
    backgroundColor: '#4a6741',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJsZWFmIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTEwMCwzMCBRNzAsNjAgNTAsOTAgVDMwLDE1MCBRNjAsMTMwIDkwLDExMCBUMTUwLDcwIFExMzAsNTAgMTAwLDMwIFoiIGZpbGw9IiM2OGE1NGEiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0xNzAsODAgUTE0MCwxMTAgMTIwLDE0MCBUMTAWLDE5MCBRMTMwLDE3MCAxNTAsMTUwIFQxOTAsMTEwIFExODAsMTAwIDE3MCw4MCBaIiBmaWxsPSIjNGE3YzM0IiBvcGFjaXR5PSIwLjE1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGE2NzQxIi8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNsZWFmKSIvPjwvc3ZnPg==)',
    backgroundGradient: 'linear-gradient(135deg, #667c3e 0%, #4a6741 50%, #3a5431 100%)',
    cardBackground: '#fdfbf7',
    cardBackImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ2aW5lIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0yMCwyIEMyMCwyIDI1LDggMjAsMTUgQzE1LDIyIDI1LDI4IDIwLDM4IiBzdHJva2U9IiM0YTdjMzQiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC40Ii8+PGNpcmNsZSBjeD0iMTgiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzY4YTU0YSIgb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iMjIiIGN5PSIzMCIgcj0iMyIgZmlsbD0iIzY4YTU0YSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmE4ZDRhIi8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN2aW5lKSIvPjwvc3ZnPg==)',
    cardBorder: '1px solid #8b7355',
    cardShadow: '0 3px 6px rgba(107, 142, 35, 0.2)',
    cardRadius: '10px',
    cardFace: {
      fontFamily: 'Optima, Candara, sans-serif',
      fontSize: '1.35em',
      fontWeight: '600',
      patternUrl: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMCw1IEwxNSw1IEwxMiwxMCBaIiBmaWxsPSIjY2RkYmIxIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=)',
      patternOpacity: 0.1
    },
    redSuitColor: '#c1392d',
    blackSuitColor: '#2d4a2b',
    primaryColor: '#6b8e23',
    secondaryColor: '#8fbc8f',
    accentColor: '#ffd700',
    buttonBackground: 'rgba(251, 248, 240, 0.95)',
    buttonText: '#3a5431',
    buttonHoverBackground: '#f4f1e8',
    shadowColor: 'rgba(74, 103, 65, 0.2)',
    animationStyle: 'smooth',
    foundationStyle: {
      background: 'rgba(107, 142, 35, 0.15)',
      border: '2px dashed #6b8e23'
    },
    freeCellStyle: {
      background: 'rgba(139, 115, 85, 0.1)',
      border: '2px solid #8b7355'
    }
  },
  
  [ThemeType.SPACE]: {
    name: 'Space',
    type: ThemeType.SPACE,
    backgroundColor: '#0a0e27',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxmaWx0ZXIgaWQ9InN0YXJzIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuMDIiIG51bU9jdGF2ZXM9IjEiIHNlZWQ9IjUiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMSIvPjwvZmlsdGVyPjxyYWRpYWxHcmFkaWVudCBpZD0ibmVidWxhIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGEyNWE5IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMWU0Nzg4IiBzdG9wLW9wYWNpdHk9IjAuMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBhMGUyNyIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzBhMGUyNyIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjbmVidWxhKSIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNzdGFycykiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==)',
    backgroundGradient: 'radial-gradient(ellipse at top, #1a1f4e 0%, #0a0e27 50%, #040613 100%)',
    cardBackground: 'linear-gradient(135deg, #1e1e3f 0%, #2a2a5e 100%)',
    cardBackImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0icGxhbmV0Ij48c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iIzRhNWJhOSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFhMmY3YSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTFmNGUiLz48Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjMwJSIgZmlsbD0idXJsKCNwbGFuZXQpIiBvcGFjaXR5PSIwLjYiLz48ZWxsaXBzZSBjeD0iNTAlIiBjeT0iNTAlIiByeD0iNDUlIiByeT0iMTAlIiBmaWxsPSJub25lIiBzdHJva2U9IiM2YTdhZGYiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC4zIiB0cmFuc2Zvcm09InJvdGF0ZSgtMjAgNTAgNTApIi8+PC9zdmc+)',
    cardBorder: '1px solid #4a5ba9',
    cardShadow: '0 4px 8px rgba(106, 122, 223, 0.3), 0 0 20px rgba(106, 122, 223, 0.1)',
    cardRadius: '12px',
    cardFace: {
      fontFamily: 'Orbitron, monospace',
      fontSize: '1.3em',
      fontWeight: '700',
      textShadow: '0 0 10px currentColor'
    },
    redSuitColor: '#ff6b9d',
    blackSuitColor: '#66d9ef',
    primaryColor: '#6a7adf',
    secondaryColor: '#4a5ba9',
    accentColor: '#ffd93d',
    buttonBackground: 'linear-gradient(135deg, #2a2a5e 0%, #3a3a7e 100%)',
    buttonText: '#e0e0ff',
    buttonHoverBackground: 'linear-gradient(135deg, #3a3a7e 0%, #4a4a9e 100%)',
    shadowColor: 'rgba(106, 122, 223, 0.4)',
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
    }
  },
  
  [ThemeType.FANTASY]: {
    name: 'Fantasy',
    type: ThemeType.FANTASY,
    backgroundColor: '#2e1a47',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJtYWdpYyIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4YTRmYTkiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjIiLz48cGF0aCBkPSJNNTAsMjAgTDU4LDQwIEw4MCw0MiBMNjUsNTUgTDcwLDc4IEw1MCw2NSBMMzAsNzggTDM1LDU1IEwyMCw0MiBMNDIsNDAgWiIgZmlsbD0iI2ZmYTVjOSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmUxYTQ3Ii8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNtYWdpYykiLz48L3N2Zz4=)',
    backgroundGradient: 'radial-gradient(ellipse at center, #4a2969 0%, #2e1a47 60%, #1a0e2e 100%)',
    cardBackground: 'linear-gradient(135deg, #f3e7f9 0%, #e8d5f2 100%)',
    cardBackPattern: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJydW5lcyIgeD0iMCIgeT0iMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSIxNSIgeT0iMjAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzhhNGZhOSIgb3BhY2l0eT0iMC4zIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7YkjwvdGV4dD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM0YTI5NjkiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3J1bmVzKSIvPjwvc3ZnPg==)',
    cardBorder: '2px solid #8a4fa9',
    cardShadow: '0 4px 12px rgba(138, 79, 169, 0.3), 0 0 20px rgba(255, 165, 201, 0.1)',
    cardRadius: '15px',
    cardFace: {
      fontFamily: 'Luminari, fantasy',
      fontSize: '1.4em',
      fontWeight: '600',
      textShadow: '0 2px 4px rgba(138, 79, 169, 0.3)',
      suitStyle: {
        hearts: '💜',
        diamonds: '⬥',
        clubs: '✤',
        spades: '✦'
      }
    },
    redSuitColor: '#d946a6',
    blackSuitColor: '#6a4c93',
    primaryColor: '#a668c3',
    secondaryColor: '#8a4fa9',
    accentColor: '#ffa5c9',
    buttonBackground: 'linear-gradient(135deg, #8a4fa9 0%, #a668c3 100%)',
    buttonText: '#ffffff',
    buttonHoverBackground: 'linear-gradient(135deg, #9a5fb9 0%, #b678d3 100%)',
    shadowColor: 'rgba(166, 104, 195, 0.3)',
    glowEffect: '0 0 25px rgba(255, 165, 201, 0.3)',
    animationStyle: 'elegant',
    foundationStyle: {
      background: 'radial-gradient(ellipse, rgba(166, 104, 195, 0.2) 0%, transparent 70%)',
      border: '2px solid #a668c3',
      symbol: '✧'
    },
    freeCellStyle: {
      background: 'linear-gradient(135deg, rgba(138, 79, 169, 0.15) 0%, rgba(166, 104, 195, 0.1) 100%)',
      border: '2px solid #8a4fa9'
    }
  },
  
  [ThemeType.MINIMALIST]: {
    name: 'Minimalist',
    type: ThemeType.MINIMALIST,
    backgroundColor: '#f5f5f5',
    backgroundGradient: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
    cardBackground: '#ffffff',
    cardBorder: '1px solid #e0e0e0',
    cardShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    cardRadius: '4px',
    cardFace: {
      fontFamily: 'Helvetica Neue, Arial, sans-serif',
      fontSize: '1.3em',
      fontWeight: '300'
    },
    redSuitColor: '#ff4444',
    blackSuitColor: '#333333',
    primaryColor: '#666666',
    secondaryColor: '#999999',
    accentColor: '#ff6b6b',
    buttonBackground: '#ffffff',
    buttonText: '#333333',
    buttonHoverBackground: '#fafafa',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    animationStyle: 'smooth',
    foundationStyle: {
      background: 'transparent',
      border: '2px solid #e0e0e0'
    },
    freeCellStyle: {
      background: 'rgba(0, 0, 0, 0.02)',
      border: '1px solid #e0e0e0'
    }
  },
  
  [ThemeType.NEON]: {
    name: 'Neon',
    type: ThemeType.NEON,
    backgroundColor: '#0a0a0a',
    backgroundGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%)',
    cardBackground: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    cardBorder: '2px solid #00ffff',
    cardShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.2)',
    cardRadius: '10px',
    cardFace: {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '1.5em',
      fontWeight: '700',
      textShadow: '0 0 15px currentColor, 0 0 30px currentColor'
    },
    redSuitColor: '#ff00ff',
    blackSuitColor: '#00ffff',
    primaryColor: '#00ffff',
    secondaryColor: '#ff00ff',
    accentColor: '#ffff00',
    buttonBackground: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    buttonText: '#00ffff',
    buttonHoverBackground: 'linear-gradient(135deg, #2a2a3e 0%, #26314e 100%)',
    shadowColor: 'rgba(0, 255, 255, 0.4)',
    glowEffect: '0 0 30px rgba(0, 255, 255, 0.7)',
    animationStyle: 'playful',
    foundationStyle: {
      background: 'rgba(0, 255, 255, 0.05)',
      border: '2px solid #00ffff',
      symbol: '◆'
    },
    freeCellStyle: {
      background: 'rgba(255, 0, 255, 0.05)',
      border: '2px solid #ff00ff'
    }
  },
  
  [ThemeType.OCEAN]: {
    name: 'Ocean',
    type: ThemeType.OCEAN,
    backgroundColor: '#0c2461',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlcyIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wLDUwIFE1MCwyMCAxMDAsNTAgVDE1MCwyMCBMMjAwLDUwIEwyMDAsMTAwIEwwLDEwMCBaIiBmaWxsPSIjMWU1Zjc0IiBvcGFjaXR5PSIwLjIiLz48cGF0aCBkPSJNMCw3MCBRNTI3MCA1MCw3MCBUMTUwLDcwIEwyMDAsNzAgTDIwMCwxMDAgTDAsMTAwIFoiIGZpbGw9IiM0YTkwYTQiIG9wYWNpdHk9IjAuMTUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYzI0NjEiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmVzKSIvPjwvc3ZnPg==)',
    backgroundGradient: 'linear-gradient(180deg, #0c2461 0%, #1e5f74 50%, #4a90a4 100%)',
    cardBackground: 'linear-gradient(135deg, #e8f5f7 0%, #d1ecf1 100%)',
    cardBackImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJidWJibGVzIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRhOTBhNCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjI1IiByPSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiM0YTkwYTQiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4yIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSI0MCIgcj0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGE5MGE0IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTVmNzQiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2J1YmJsZXMpIi8+PC9zdmc+)',
    cardBorder: '1px solid #4a90a4',
    cardShadow: '0 3px 10px rgba(74, 144, 164, 0.2)',
    cardRadius: '12px',
    cardFace: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.35em',
      fontWeight: '400'
    },
    redSuitColor: '#ff6b6b',
    blackSuitColor: '#1e5f74',
    primaryColor: '#4a90a4',
    secondaryColor: '#1e5f74',
    accentColor: '#67b7d1',
    buttonBackground: 'linear-gradient(135deg, #4a90a4 0%, #67b7d1 100%)',
    buttonText: '#ffffff',
    buttonHoverBackground: 'linear-gradient(135deg, #5aa0b4 0%, #77c7e1 100%)',
    shadowColor: 'rgba(74, 144, 164, 0.25)',
    animationStyle: 'smooth',
    foundationStyle: {
      background: 'rgba(74, 144, 164, 0.1)',
      border: '2px solid #4a90a4',
      symbol: '⚓'
    },
    freeCellStyle: {
      background: 'rgba(103, 183, 209, 0.08)',
      border: '2px solid #67b7d1'
    }
  },
  
  [ThemeType.VINTAGE]: {
    name: 'Vintage',
    type: ThemeType.VINTAGE,
    backgroundColor: '#3e2723',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ2aW50YWdlIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiM3OTU1NDgiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiM3OTU1NDgiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiM3OTU1NDgiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiM3OTU1NDgiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiM3OTU1NDgiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzNlMjcyMyIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjdmludGFnZSkiLz48L3N2Zz4=)',
    backgroundGradient: 'radial-gradient(ellipse at center, #5d4037 0%, #3e2723 100%)',
    cardBackground: '#fef5e7',
    cardBorder: '2px solid #795548',
    cardShadow: '0 2px 8px rgba(121, 85, 72, 0.3)',
    cardRadius: '6px',
    cardFace: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '1.4em',
      fontWeight: '700',
      patternUrl: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9InBhcGVyIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4wNCIgbnVtT2N0YXZlcz0iNSIgcmVzdWx0PSJub2lzZSIgc2VlZD0iMSIvPjxmZURpZmZ1c2VMaWdodGluZyBpbj0ibm9pc2UiIGxpZ2h0aW5nLWNvbG9yPSJ3aGl0ZSIgc3VyZmFjZVNjYWxlPSIxIj48ZmVEaXN0YW50TGlnaHQgYXppbXV0aD0iNDUiIGVsZXZhdGlvbj0iNjAiLz48L2ZlRGlmZnVzZUxpZ2h0aW5nPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNwYXBlcikiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==)',
      patternOpacity: 0.1
    },
    redSuitColor: '#8b0000',
    blackSuitColor: '#2c1810',
    primaryColor: '#8d6e63',
    secondaryColor: '#795548',
    accentColor: '#d7ccc8',
    buttonBackground: '#f5e6d3',
    buttonText: '#3e2723',
    buttonHoverBackground: '#efdecd',
    shadowColor: 'rgba(121, 85, 72, 0.25)',
    animationStyle: 'elegant',
    foundationStyle: {
      background: 'rgba(121, 85, 72, 0.1)',
      border: '2px solid #795548',
      symbol: '♜'
    },
    freeCellStyle: {
      background: 'rgba(141, 110, 99, 0.08)',
      border: '2px solid #8d6e63'
    }
  },
  
  [ThemeType.FOREST]: {
    name: 'Forest',
    type: ThemeType.FOREST,
    backgroundColor: '#228B22',
    backgroundGradient: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 30%, #228B22 60%, #006400 100%)',
    cardBackground: 'linear-gradient(135deg, #faf8f0 0%, #f5f2e8 100%)',
    cardBackImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJsZWF2ZXMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGVsbGlwc2UgY3g9IjIwIiBjeT0iMTUiIHJ4PSI4IiByeT0iMTIiIGZpbGw9IiMyMjhCMjIiIG9wYWNpdHk9IjAuMiIgdHJhbnNmb3JtPSJyb3RhdGUoMzAgMjAgMTUpIi8+PGVsbGlwc2UgY3g9IjEwIiBjeT0iMzAiIHJ4PSI2IiByeT0iMTAiIGZpbGw9IiMzMkNEMzIiIG9wYWNpdHk9IjAuMTUiIHRyYW5zZm9ybT0icm90YXRlKC0xNSAxMCAzMCkiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjI1IiByPSIzIiBmaWxsPSIjNjhBNTRBIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM0YTY3NDEiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2xlYXZlcykiLz48L3N2Zz4=)',
    cardBorder: '1px solid #8B7355',
    cardShadow: '0 3px 6px rgba(107, 142, 35, 0.2)',
    cardRadius: '12px',
    cardFace: {
      fontFamily: 'Optima, Candara, sans-serif',
      fontSize: '1.4em',
      fontWeight: '600',
      textShadow: '0 1px 3px rgba(139, 115, 85, 0.3)',
      patternUrl: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01LDUgTDEwLDEwIEw1LDE1IFoiIGZpbGw9IiNjZGRiYjEiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==)',
      patternOpacity: 0.1
    },
    redSuitColor: '#DC143C',
    blackSuitColor: '#2F4F2F',
    primaryColor: '#6B8E23',
    secondaryColor: '#8B7355',
    accentColor: '#FFD700',
    buttonBackground: 'linear-gradient(135deg, #8B7355 0%, #A0522D 100%)',
    buttonText: '#ffffff',
    buttonHoverBackground: 'linear-gradient(135deg, #9B8365 0%, #B0623D 100%)',
    shadowColor: 'rgba(107, 142, 35, 0.3)',
    animationStyle: 'smooth',
    foundationStyle: {
      background: 'radial-gradient(ellipse, rgba(107, 142, 35, 0.15) 0%, transparent 70%)',
      border: '2px solid #6B8E23',
      symbol: '🌲'
    },
    freeCellStyle: {
      background: 'linear-gradient(135deg, rgba(139, 115, 85, 0.15) 0%, rgba(107, 142, 35, 0.1) 100%)',
      border: '2px solid #8B7355'
    }
  }
};