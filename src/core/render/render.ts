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

const middleX = app.renderer.width / 2
const middleY = app.renderer.height / 2

const sprites = {
  character: PIXI.Sprite.from(assets.character),
}

// TODO: Can improve performance by reusing containers instead of recreating everything; this allows Pixi to optimize the rendering
export const renderFrame: GameStateRenderer<MyState> = (state): void => {
  app.stage.removeChildren()
  state.state.physicsBodies.all().forEach((body) => {
    const character = new PIXI.Container()
    character.setTransform(body.position.x, body.position.y, 0.3, 0.3)
    character.addChild(PIXI.Sprite.from(assets.character))
    app.stage.addChild(character)

    // Draw position, vertices, and bounds
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
}
