import * as System from '../arch/system'
import { initializeScreen, MyState } from '../main'
import { destroy } from '../destroy'

export const DeathSystem = System.create<MyState>(
  (game) => {},
  (game, time) => {
    game.state.health.forEach((id, health) => {
      if (health <= 0) {
        if ((id = 'player')) {
          initializeScreen(game.state.currentScreen)
        }
        destroy(id, game.state)
      }
    })
  }
)
