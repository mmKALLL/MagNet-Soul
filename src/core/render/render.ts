import * as PIXI from 'pixi.js'
import { GameStateRenderer } from '../game/game'
import { MyState } from '../../main'
import { assets } from '../../assets'

const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas'

const app = new PIXI.Application({
  backgroundColor: 0xa7f99f,
  width: 1400,
  height: 900,
  autoDensity: true,
  resizeTo: window,
})
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'

document.body.appendChild(app.view)

export const stage = app.stage

export const initializeCamera = (state: MyState) => {
  const entity = state.entities.create()
  state.cameras.set(entity, { isActive: true, position: new PIXI.Rectangle(10, 10, 420, 200) })
}

// Set up the pixel ratio. Super important for getting sharp canvas output on high-DPI displays.
const setupCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = app.renderer
  const width = canvas.width
  const height = canvas.height
  const ratio = window.devicePixelRatio
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  app.resizeTo = window
}

export const initializeRendering = () => {
  setupCanvas(app.view)
}

export const renderFrame: GameStateRenderer<MyState> = (state, time): void => {}
