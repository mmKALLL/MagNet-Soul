import { Entity } from "./arch/arch"
import { MyState } from "./main"
import Physics from './core/physics/physics'

export const destroy = (id: Entity.ID, game: MyState) => {
  const body = game.physicsBodies.get(id)
  body && Physics.World.remove(game.physicsWorld, body)

  const sprite = game.sprites.get(id)
  sprite && game.renderStage.removeChild(sprite)

  game.gravity.remove(id)
  game.ttl.remove(id)
}
