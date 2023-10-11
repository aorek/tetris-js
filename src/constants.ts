export const BOARD_HEIGHT = 30
export const BOARD_WIDTH = 14
export const BLOCK_SIZE = 20

export const CONTROLS = {
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp'
}

export const PIECE_TYPES: { [k: string]: number[][] } = {
  iBlock: [
    [1],
    [1],
    [1],
    [1]
  ],
  jBlock: [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  lBlock: [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  oBlock: [
    [1, 1],
    [1, 1]
  ],
  sBlock: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  tBlock: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  zBlock: [
    [1, 1, 0],
    [0, 1, 1]
  ]
}
