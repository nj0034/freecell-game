import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    background: ${(props: any) => props.theme.background};
    ${(props: any) => props.theme.backgroundImage ? `
      background-image: ${props.theme.backgroundImage};
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    ` : ''}
    ${(props: any) => props.theme.backgroundGradient && !props.theme.backgroundImage ? `
      background: ${props.theme.backgroundGradient};
    ` : ''}
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  
  button {
    font-family: inherit;
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${(props: any) => props.theme.boardBackground || 'rgba(255, 255, 255, 0.1)'};
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${(props: any) => props.theme.primaryColor || '#667eea'};
    border-radius: 10px;
    opacity: 0.8;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${(props: any) => props.theme.secondaryColor || props.theme.primaryColor || '#764ba2'};
    opacity: 1;
  }
`;