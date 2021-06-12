import * as PIXI from 'pixi.js'
import * as System from '../arch/system'
import { MyState } from '../main'

export const CameraSystem = System.create<MyState>((game, time) => {
  game.state.cameras.forEach((id, position) => {
    game.state.stage.scale.set(2)
    // const sprite = game.state.sprites.get(id)
    // if (sprite) {
    //   sprite.position.x = body.position.x
    //   sprite.position.y = body.position.y
    //   sprite.angle = body.angle
    // }
  })
})
