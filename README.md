# Tetris-js

A classic Tetris game built with TypeScript, Vite, and Bun.

## Features

- Classic Tetris gameplay with 7 standard tetromino shapes
- Piece rotation (Space bar)
- Line clearing with flash effect
- Scoring system with levels
- Progressive speed increase
- Game over detection
- Start menu with neon effect
- Pause menu

## Controls

| Key    | Action                |
| ------ | --------------------- |
| ← →    | Move piece left/right |
| ↓      | Soft drop             |
| Space  | Rotate piece          |
| Escape | Pause game            |
| Enter  | Start/Restart         |

## How to Run

Make sure you have [Bun](https://bun.sh) installed.

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

Open your browser at http://localhost:5173/

## Build for Production

```bash
bun run build
```

The built files will be in the `dist` folder.

## Scoring System

- **Lines cleared**: 100 × lines × level points
- **Level up**: Every 10 lines cleared
- **Speed**: Increases by 75ms per level (minimum 100ms drop interval)

## Project Structure

```
src/
├── main.ts      # Entry point
├── game.ts     # Game logic, loop, state management
├── board.ts    # Board representation and line clearing
├── piece.ts    # Tetromino logic (movement, rotation, collision)
├── constants.ts # Game configuration constants
└── style.css   # Styles and overlays
```