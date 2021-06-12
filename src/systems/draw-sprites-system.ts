import * as System from '../arch/system'
import { MyState } from '../main'

export const DrawSpritesSystem = System.create<MyState>((game, time) => {
  game.state.physicsBodies.forEach((id, body) => {
    const sprite = game.state.sprites.get(id)
    if (sprite) {
      sprite.position.x = body.position.x
      sprite.position.y = body.position.y
      sprite.angle = body.angle
    }
  })
})

