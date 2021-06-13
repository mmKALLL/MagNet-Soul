import * as PIXI from 'pixi.js'
import * as System from '../arch/system'
import { clamp } from '../core/math/numeric'
import { MyState } from '../main'

const zoom = 2.5
const x_base = 400
const stage_width = 1600

export const CameraSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    game.state.cameras.forEach((id, position) => {
      game.state.renderStage.scale.set(zoom)
      const playerX = game.state.physicsBodies.get('player')?.position.x
      if (playerX) {
        const calcX = -zoom * playerX + x_base
        game.state.renderStage.position.x =
          clamp(calcX, stage_width * -zoom + window.innerWidth, 0)
      }
    })
  }
)
