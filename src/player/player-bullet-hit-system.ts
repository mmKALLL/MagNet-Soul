import * as System from '../arch/system'
import { MyState } from '../main'
import { handleCollisions } from '../collsition-handler'
import { destroy } from '../destroy'

export const PlayerBulletHitSytem = System.create<MyState>(
  (game) => {
    handleCollisions(
      game,
      (body) => game.state.entityType.get(body.label) == 'player-bullet',
      (bulletBody, otherBody) => {
        const bulletId = bulletBody.label
        const otherId = otherBody.label
        if (game.state.entityType.get(otherId) == 'enemy') {
          if (game.state.polarity.get(bulletId) != game.state.polarity.get(otherId)) {
            // TODO: Reduce enemy health?
            destroy(bulletId, game.state)
          }
        }
    })
  },
  (game, time) => {

  }
)
