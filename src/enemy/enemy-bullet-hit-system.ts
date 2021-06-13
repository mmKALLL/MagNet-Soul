import * as System from '../arch/system'
import { MyState } from '../main'
import { handleCollisions } from '../collsition-handler'
import { destroy } from '../destroy'

export const EnemyBulletHitSytem = System.create<MyState>(
  (game) => {
    handleCollisions(
      game,
      (body) => game.state.entityType.get(body.label) == 'enemy-bullet',
      (bulletBody, otherBody) => {
        const bulletId = bulletBody.label
        destroy(bulletId, game.state)
    })
  },
  (game, time) => {

  }
)
