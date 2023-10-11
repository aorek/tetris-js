import { Board } from './board'
import { BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE } from './constants'
import { Piece, SolidifyCoordenates } from './piece'

export class Game {
  context: CanvasRenderingContext2D
  piece: Piece | undefined

  private readonly canvas: HTMLCanvasElement
  private readonly board: Board

  private lastTime: number
  private dropCounter: number

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D

    this.canvas.height = BLOCK_SIZE * this.getHeight()
    this.canvas.width = BLOCK_SIZE * this.getWidth()
    this.context.scale(BLOCK_SIZE, BLOCK_SIZE)

    this.board = new Board(this)
    this.dropCounter = 0
    this.lastTime = 0

    this.piece = undefined
  }

  getHeight (): number {
    return BOARD_HEIGHT
  }

  getWidth (): number {
    return BOARD_WIDTH
  }

  getBoard (): number[][] {
    return this.board.getBoard()
  }

  gameLoop (time: number): void {
    if (this.piece === undefined) {
      this.piece = new Piece(this, Piece.randomPiece(), this.solidifyPiece.bind(this))
    }

    const deltaTime = time - this.lastTime
    this.lastTime = time
    this.dropCounter += deltaTime

    if (this.dropCounter >= 1000) {
      this.dropCounter = 0

      this.piece?.moveDown()
    }

    this.draw()
    this.board.draw()
    this.piece?.draw()

    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  draw (): void {
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  solidifyPiece (coordenates: SolidifyCoordenates[]): void {
    console.log(coordenates)
    coordenates.forEach(coordenate => this.board.setCell(coordenate.x, coordenate.y, coordenate.value))

    this.piece = undefined
  }
}
