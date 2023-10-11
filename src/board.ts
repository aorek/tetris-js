import { Game } from './game'

export class Board {
  game: Game
  private board: number [][]
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
    this.board = Array(this.game.getHeight()).fill(Array(this.game.getWidth()).fill(0))
  }

  draw (): void {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.game.context.fillStyle = 'grey'
          this.game.context.fillRect(x, y, 1, 1)
        }
      })
    })
  }
}
