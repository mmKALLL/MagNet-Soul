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

const middleX = app.renderer.width / 2
const middleY = app.renderer.height / 2

const sprites = {
  character: PIXI.Sprite.from(assets.character),
}

export const initializeRendering = () => {
  setupCanvas(app.view)
}

// TODO: Can improve performance by reusing containers instead of recreating everything; this allows Pixi to optimize the rendering
export const renderFrame: GameStateRenderer<MyState> = (state, time): void => {
  app.stage.removeChildren()
  state.state.physicsBodies.all().forEach((body) => {
    // Draw position, vertices, and bounds for debug
    const graphics = new PIXI.Graphics()
    graphics.lineStyle(2, 0x000000)
    graphics.drawCircle(body.position.x, body.position.y, 5)
    graphics.drawPolygon(body.vertices.map((v) => new PIXI.Point(v.x, v.y)))
    graphics.drawRect(
      body.bounds.min.x,
      body.bounds.min.y,
      body.bounds.max.x - body.bounds.min.x,
      body.bounds.max.y - body.bounds.min.y
    )
    app.stage.addChild(graphics)
  })

  state.state.drawables.all().forEach(({ id, sprite }) => {
    const body = state.state.physicsBodies.get(id)!
    const character = new PIXI.Container()
    const baseScale = 0.3
    const animLength = 4
    character.setTransform(
      body.position.x,
      body.position.y,
      // pulse animation, no ease
      baseScale +
        0.01 * Math.min(time.now % animLength, animLength / 2) -
        0.01 * Math.max(time.now % animLength, animLength / 2),
      baseScale +
        0.01 * Math.min(time.now % animLength, animLength / 2) -
        0.01 * Math.max(time.now % animLength, animLength / 2),
      body.angle
    )
    character.addChild(sprite)
    app.stage.addChild(character)
  })
}
