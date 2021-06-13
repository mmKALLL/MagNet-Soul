import * as System from '../arch/system'
import { MyState } from '../main'
import { handleCollisions } from '../collision-handler'
import { destroy } from '../destroy'

export const EnemyBulletHitSytem = System.create<MyState>(
  (game) => {
    handleCollisions(
      game,
      (body) => game.state.entityType.get(body.label) == 'enemy-bullet',
      (bulletBody, otherBody) => {
        const bulletId = bulletBody.label
        const otherId = otherBody.label
        destroy(bulletId, game.state)
        const otherHealth = game.state.health.get(otherId)
        if (otherHealth) {
          game.state.health.set(otherId, otherHealth - 1)
        }
    })
  },
  (game, time) => {

  }
)
