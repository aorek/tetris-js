import { CONTROLS, PIECE_TYPES } from './constants'
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

  constructor (
    private readonly game: Game,
    private readonly shape: Shape,
    private readonly onSolidify: (coordenates: SolidifyCoordenates[]) => void
  ) {
    this.color = colors[Math.floor(Math.random() * colors.length)]
    // TODO: calculate random inital postion
    this.position = { x: 1, y: 1 }

    this.inizializeControls()
  }

  static randomPiece (): number[][] {
    const types = Object.keys(PIECE_TYPES)
    const randomIndex = Math.floor(Math.random() * types.length)
    const type = types[randomIndex]

    return PIECE_TYPES[type]
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

  // spawPiece (): Position {

  // }

  hasCollision (newCoordenates: { x: number, y: number }): boolean {
    const blocks = this.shape.find((row, y) => {
      return row.find((value, x) => {
        const board = this.game.getBoard()
        return value === 1 && board[y + newCoordenates.y]?.[x + newCoordenates.x] !== 0
      })
    })

    return blocks !== undefined && blocks.length > 0
  }

  moveDown (): void {
    if (!this.move(0, 1)) {
      this.onSolidify(this.retriveSetPosition())
    }
  }

  private inizializeControls (): void {
    document.addEventListener('keydown', event => {
      if (event.key === CONTROLS.down) this.moveDown()
      if (event.key === CONTROLS.left) this.moveLeft()
      if (event.key === CONTROLS.right) this.moveRight()
    })
  }

  private moveLeft (): void {
    this.move(-1)
  }

  private moveRight (): void {
    this.move(1)
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
