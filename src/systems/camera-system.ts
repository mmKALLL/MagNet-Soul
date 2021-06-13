import * as PIXI from 'pixi.js'
import * as System from '../arch/system'
import { MyState } from '../main'

const zoom = 2.5
const x_base = 400

export const CameraSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    game.state.cameras.forEach((id, position) => {
      game.state.renderStage.scale.set(zoom)
      const playerX = game.state.physicsBodies.get('player')?.position.x
      if (playerX) {
        game.state.renderStage.position.x =
          -zoom * game.state.physicsBodies.get('player')!.position.x + x_base
      }
    })
  }
)
