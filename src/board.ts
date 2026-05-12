import { Game } from './game'

export class Board {
  game: Game
  private board: number [][]
  private clearedLines: number[] = []
  constructor (game: Game) {
    this.board = []
    this.game = game
    this.createBoard()
  }

  getBoard (): number[][] {
    return this.board
  }

  setCell (x: number, y: number, value: number): void {
    this.board[y][x] = value
  }

  createBoard (): void {
    this.board = Array.from({ length: this.game.getHeight() }, () =>
      Array(this.game.getWidth()).fill(0)
    )
  }

  findCompleteLines (): number[] {
    const completeLines: number[] = []
    this.board.forEach((row, y) => {
      if (row.every(cell => cell !== 0)) {
        completeLines.push(y)
      }
    })
    return completeLines
  }

  clearLines (lines: number[]): void {
    this.clearedLines = lines

    const nonClearedRows: number[][] = []
    for (let y = 0; y < this.game.getHeight(); y++) {
      if (!lines.includes(y)) {
        nonClearedRows.push([...this.board[y]])
      }
    }

    const numCleared = lines.length
    const emptyRow = Array(this.game.getWidth()).fill(0)

    for (let y = 0; y < numCleared; y++) {
      this.board[y] = [...emptyRow]
    }

    for (let y = 0; y < nonClearedRows.length; y++) {
      this.board[numCleared + y] = nonClearedRows[y]
    }
  }

  getClearedLines (): number[] {
    return this.clearedLines
  }

  clearClearedLines (): void {
    this.clearedLines = []
  }

  draw (): void {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          const isCleared = this.clearedLines.includes(y)
          this.game.context.fillStyle = isCleared ? '#fff' : 'grey'
          this.game.context.fillRect(x, y, 1, 1)
        }
      })
    })
  }
}