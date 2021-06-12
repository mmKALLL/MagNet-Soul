import * as System from '../arch/system'
import { destroy } from '../destroy'
import { MyState } from '../main'

export type TimeToLive = {
  createdAt: number,
  expiresIn: number
}

export const TimeToLiveSystem = System.create<MyState>(
  () => { },
  (game, time) => {
    game.state.ttl.forEach((id, ttl) => {
      if (time.now > ttl.createdAt + ttl.expiresIn) {
        destroy(id, game.state)
      }
    })
  }
)
