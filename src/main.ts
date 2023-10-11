import { Game } from './game'
import './style.css'

const canvas = document.querySelector('canvas') as HTMLCanvasElement

const game = new Game(canvas)
game.gameLoop(0)
