import * as System from '../arch/system'
import { playSound, MyState } from '../main'
import { handleCollisions } from '../collision-handler'
import { destroy } from '../destroy'
import { playHit } from '../hit-anim'

export const EnemyBulletHitSytem = System.create<MyState>(
  (game) => {
    handleCollisions(
      game,
      (body) => game.state.entityType.get(body.label) == 'enemy-bullet',
      (bulletBody, otherBody) => {
        const bulletId = bulletBody.label
        const otherId = otherBody.label
        destroy(bulletId, game.state)
        playHit(game.state.renderStage, bulletBody.position)
        const otherHealth = game.state.health.get(otherId)
        if (otherHealth) {
          game.state.health.set(otherId, otherHealth - 1)
          playSound('damage')
        }
      }
    )
  },
  (game, time) => {}
)
