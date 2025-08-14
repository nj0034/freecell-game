# Freecell Solitaire Game

A modern, animated Freecell solitaire game built with React and TypeScript.

## Features

- 🎮 Classic Freecell gameplay
- ✨ Smooth animations with Framer Motion
- 🎯 Drag & drop support
- 🔄 Undo/Redo functionality
- 🎨 Beautiful gradients and visual effects
- 📱 Responsive design
- ⚡ Safe auto-move to foundations
- 🔢 Multi-card movement with visual feedback
- ⚠️ Warning messages for invalid moves
- 🎭 Shake animations for unmovable cards

## Tech Stack

- React 18
- TypeScript
- Framer Motion
- React DnD
- Styled Components
- pnpm

## Installation

```bash
# Clone the repository
git clone https://github.com/nj0034/solitaire.git

# Navigate to project directory
cd solitaire

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Game Rules

### Basic Rules
- The goal is to move all 52 cards to the four foundation piles
- Foundation piles are built up by suit from Ace to King
- Tableau columns are built down by alternating colors
- You can move cards between tableau columns following the alternating color rule

### Multi-Card Movement
- Maximum movable cards = (empty freecells + 1) × 2^(empty columns)
- Cards must form a valid sequence (alternating colors, descending rank)
- Visual feedback shows when moves are invalid

### Special Features
- **Safe Auto-Move**: Automatically moves cards to foundations when safe
- **Click-to-Move**: Click cards to automatically move them to valid positions
- **Double-Click**: Double-click to move cards directly to foundations
- **Visual Feedback**: Shake animations and warning messages for invalid moves

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## License

MIT
