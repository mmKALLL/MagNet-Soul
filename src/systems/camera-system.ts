import * as PIXI from 'pixi.js'
import * as System from '../arch/system'
import { MyState } from '../main'

const zoom = 2.5
const x_base = 250

export const CameraSystem = System.create<MyState>(
  () => { },
  (game, time) => {
    game.state.cameras.forEach((id, position) => {
      game.state.renderStage.scale.set(zoom)
      game.state.renderStage.position.x = -zoom * game.state.physicsBodies.get('player')!.position.x + x_base
      // const sprite = game.state.sprites.get(id)
      // if (sprite) {
      //   sprite.position.x = body.position.x
      //   sprite.position.y = body.position.y
      //   sprite.angle = body.angle
      // }
    })
  }
)
