import { Board } from './board'
import {
  BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE, CONTROLS,
  POINTS_PER_LINE, LINES_PER_LEVEL, INITIAL_DROP_INTERVAL,
  SPEED_DECREASE_PER_LEVEL, MIN_DROP_INTERVAL
} from './constants'
import { Piece, SolidifyCoordenates } from './piece'

export class Game {
  context: CanvasRenderingContext2D
  piece: Piece | undefined

  private readonly canvas: HTMLCanvasElement
  private readonly board: Board

  private lastTime: number
  private dropCounter: number
  private isClearing: boolean = false
  private flashCounter: number = 0
  private gameOver: boolean = false
  private isStarted: boolean = false
  private isPaused: boolean = false

  score: number = 0
  level: number = 1
  linesCleared: number = 0

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

    this.initializeControls()
    this.updateScoreDisplay()
    this.showStartMenu()
  }

  private initializeControls (): void {
    document.addEventListener('keydown', event => {
      if (!this.isStarted) {
        if (event.key === 'Enter') {
          this.hideStartMenu()
          this.isStarted = true
        }
        return
      }
      if (event.key === CONTROLS.pause && !this.gameOver) {
        this.togglePause()
        return
      }
      if (this.isPaused || this.gameOver) return
      if (this.piece === undefined || this.isClearing) return
      if (event.key === CONTROLS.down) this.piece.moveDown()
      if (event.key === CONTROLS.left) this.piece.moveLeft()
      if (event.key === CONTROLS.right) this.piece.moveRight()
      if (event.key === CONTROLS.rotate) this.piece.rotate()
    })
  }

  private togglePause (): void {
    this.isPaused = !this.isPaused
    if (this.isPaused) {
      this.showPauseMenu()
    } else {
      this.hidePauseMenu()
    }
  }

  private showStartMenu (): void {
    const overlay = document.createElement('div')
    overlay.id = 'start-menu'
    overlay.innerHTML = `
      <h1>TETRIS</h1>
      <p>Press ENTER to start</p>
      <div class="controls">
        <p>Controls</p>
        <p>Move: ← →</p>
        <p>Soft Drop: ↓</p>
        <p>Rotate: SPACE</p>
        <p>Pause: ESC</p>
      </div>
    `
    document.body.appendChild(overlay)
  }

  private hideStartMenu (): void {
    const overlay = document.getElementById('start-menu')
    if (overlay) overlay.remove()
  }

  private showPauseMenu (): void {
    const overlay = document.createElement('div')
    overlay.id = 'pause-menu'
    overlay.innerHTML = `
      <h2>PAUSED</h2>
      <button id="resume-btn">Resume</button>
      <button id="new-game-btn">New Game</button>
    `
    document.body.appendChild(overlay)
    document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause())
    document.getElementById('new-game-btn')?.addEventListener('click', () => this.restart())
  }

  private hidePauseMenu (): void {
    const overlay = document.getElementById('pause-menu')
    if (overlay) overlay.remove()
  }

  private showGameOver (): void {
    const overlay = document.createElement('div')
    overlay.id = 'game-over'
    overlay.innerHTML = `
      <h2>GAME OVER</h2>
      <p>Score: ${this.score}</p>
      <p>Press ENTER to restart</p>
    `
    document.body.appendChild(overlay)
  }

  private hideGameOver (): void {
    const overlay = document.getElementById('game-over')
    if (overlay) overlay.remove()
  }

  private restart (): void {
    this.hideStartMenu()
    this.hidePauseMenu()
    this.hideGameOver()
    this.board.createBoard()
    this.piece = undefined
    this.score = 0
    this.level = 1
    this.linesCleared = 0
    this.gameOver = false
    this.isPaused = false
    this.isClearing = false
    this.dropCounter = 0
    this.lastTime = 0
    this.updateScoreDisplay()
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

  private calculateDropInterval (): number {
    const interval = INITIAL_DROP_INTERVAL - ((this.level - 1) * SPEED_DECREASE_PER_LEVEL)
    return Math.max(interval, MIN_DROP_INTERVAL)
  }

  gameLoop (time: number): void {
    if (!this.isStarted || this.isPaused) {
      window.requestAnimationFrame(this.gameLoop.bind(this))
      return
    }

    if (this.gameOver) {
      window.requestAnimationFrame(this.gameLoop.bind(this))
      return
    }

    if (this.piece === undefined) {
      const pieceData = Piece.randomPiece()
      this.piece = new Piece(this, pieceData.shape, pieceData.width, this.solidifyPiece.bind(this))

      if (this.piece.checkCollision()) {
        this.gameOver = true
        this.piece = undefined
        this.showGameOver()
        window.requestAnimationFrame(this.gameLoop.bind(this))
        return
      }
    }

    const deltaTime = time - this.lastTime
    this.lastTime = time
    this.dropCounter += deltaTime

    if (this.isClearing) {
      this.flashCounter += deltaTime
      if (this.flashCounter >= 100) {
        this.flashCounter = 0
        this.board.clearClearedLines()
        this.isClearing = false
      }
    } else if (this.dropCounter >= this.calculateDropInterval()) {
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

  private updateScoreDisplay (): void {
    document.getElementById('score')!.textContent = this.score.toString()
    document.getElementById('level')!.textContent = this.level.toString()
    document.getElementById('lines')!.textContent = this.linesCleared.toString()
  }

  solidifyPiece (coordenates: SolidifyCoordenates[]): void {
    coordenates.forEach(coordenate => this.board.setCell(coordenate.x, coordenate.y, coordenate.value))

    this.piece = undefined

    const completeLines = this.board.findCompleteLines()
    if (completeLines.length > 0) {
      this.board.clearLines(completeLines)
      this.isClearing = true
      this.flashCounter = 0

      this.linesCleared += completeLines.length
      this.score += completeLines.length * POINTS_PER_LINE * this.level

      const newLevel = Math.floor(this.linesCleared / LINES_PER_LEVEL) + 1
      if (newLevel > this.level) {
        this.level = newLevel
      }

      this.updateScoreDisplay()
    }
  }
}