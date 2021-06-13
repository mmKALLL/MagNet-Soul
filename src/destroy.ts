import { Entity } from './arch/arch'
import { MyState } from './main'
import { removePolarityEffect } from './polarity/polarity-system'
import Physics from './core/physics/physics'

export const destroy = (id: Entity.ID, state: MyState) => {
  state.health.remove(id)
  const body = state.physicsBodies.get(id)
  if (body) {
    Physics.World.remove(state.physicsWorld, body)
  }
  state.physicsBodies.remove(id)

  const sprite = state.sprites.get(id)
  if (sprite) {
    state.renderStage.removeChild(sprite)
  }
  state.sprites.remove(id)

  state.gravity.remove(id)
  state.ttl.remove(id)
  state.cameras.remove(id)
  state.polarity.remove(id)

  const polarityEffect = state.polarityEffects.get(id)

  polarityEffect && removePolarityEffect(state, id)

  state.weapon.remove(id)

  state.entityType.remove(id)
  state.entities.remove(id)
}
