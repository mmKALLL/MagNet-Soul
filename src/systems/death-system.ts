import * as System from '../arch/system'
import { MyState } from '../main'
import { destroy } from '../destroy'

export const DeathSystem = System.create<MyState>(
  (game) => {},
  (game, time) => {
    game.state.health.forEach((id, health) => {
      if (health <= 0) {
        destroy(id, game.state)
      }
    })
  }
)
