import { Entity } from "./arch/arch"
import { MyState } from "./main"
import Physics from './core/physics/physics'

export const destroy = (id: Entity.ID, game: MyState) => {
  const body = game.physicsBodies.get(id)
  if (body) {
    Physics.World.remove(game.physicsWorld, body)
  }
  game.physicsBodies.remove(id)

  const sprite = game.sprites.get(id)
  if (sprite) {
    game.renderStage.removeChild(sprite)
  }
  game.sprites.remove(id)

  game.gravity.remove(id)
  game.ttl.remove(id)

  game.polarity.remove(id)

  const polarityEffect = game.polarityEffects.get(id)
  polarityEffect && game.renderStage.removeChild(polarityEffect)

  game.entities.remove(id)
}
