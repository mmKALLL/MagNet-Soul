import { GameState } from "../core/game/game"
import { Time } from "../core/time/time"

export type Updater<T> = (game: GameState<T>, time: Time) => void

export const create = <T>(update: Updater<T>) => {
  return {
    update
  }
}
