import { PIECE_TYPES } from './constants'
import { Game } from './game'

type Shape = number[][]
const colors = [
  'blue',
  'brown',
  'cyan',
  'green',
  'orange',
  'pink',
  'red',
  'yellow'
]

export interface Position { x: number, y: number }
export interface SolidifyCoordenates extends Position { value: number }

export class Piece {
  private readonly position: Position
  private readonly color: string
  private shape: Shape

  static randomPiece (): { shape: number[][], width: number } {
    const types = Object.keys(PIECE_TYPES)
    const randomIndex = Math.floor(Math.random() * types.length)
    const type = types[randomIndex]

    return { shape: PIECE_TYPES[type], width: PIECE_TYPES[type][0].length }
  }

  private static calculateInitialX (pieceWidth: number, boardWidth: number): number {
    return Math.floor((boardWidth - pieceWidth) / 2)
  }

  constructor (
    private readonly game: Game,
    shape: Shape,
    pieceWidth: number,
    private readonly onSolidify: (coordenates: SolidifyCoordenates[]) => void
  ) {
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.shape = shape
    this.position = { x: Piece.calculateInitialX(pieceWidth, game.getWidth()), y: 0 }
  }

  draw (): void {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.game.context.fillStyle = this.color
          this.game.context.fillRect(x + this.position.x, y + this.position.y, 1, 1)
        }
      })
    })
  }

  checkCollision (): boolean {
    return this.hasCollisionWithShape(this.shape, this.position)
  }

  hasCollision (newCoordenates: { x: number, y: number }): boolean {
    const blocks = this.shape.find((row, y) => {
      return row.find((value, x) => {
        const board = this.game.getBoard()
        return value === 1 && board[y + newCoordenates.y]?.[x + newCoordenates.x] !== 0
      })
    })

    return blocks !== undefined && blocks.length > 0
  }

  moveLeft (): void {
    this.move(-1)
  }

  moveRight (): void {
    this.move(1)
  }

  moveDown (): void {
    if (!this.move(0, 1)) {
      this.onSolidify(this.retriveSetPosition())
    }
  }

  rotate (): void {
    const rotated = this.shape[0].map((_, colIndex) =>
      this.shape.map(row => row[colIndex]).reverse()
    )

    if (!this.hasCollisionWithShape(rotated, this.position)) {
      this.shape = rotated
    }
  }

  private hasCollisionWithShape (shape: Shape, position: Position): boolean {
    return shape.some((row, y) =>
      row.some((value, x) => {
        if (value !== 1) return false
        const board = this.game.getBoard()
        return board[y + position.y]?.[x + position.x] !== 0
      })
    )
  }

  private move (x = 0, y = 0): boolean {
    if (!this.hasCollision({
      x: this.position.x + x,
      y: this.position.y + y
    })) {
      this.position.x += x
      this.position.y += y

      return true
    }

    return false
  }

  private retriveSetPosition (): SolidifyCoordenates[] {
    const solidifyPositions: SolidifyCoordenates[] = []
    for (let y = 0; y < this.shape.length; y++) {
      const row = this.shape[y]
      for (let x = 0; x < row.length; x++) {
        const value = row[x]

        if (value === 1) {
          solidifyPositions.push({ x: x + this.position.x, y: y + this.position.y, value })
        }
      }
    }

    return solidifyPositions
  }
}