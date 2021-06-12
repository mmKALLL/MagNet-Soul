import { GameState } from "../core/game/game"
import { Time } from "../core/time/time"

export type Starter<T> = (game: GameState<T>) => void
export type Updater<T> = (game: GameState<T>, time: Time) => void

export const create = <T>(start: Starter<T>, update: Updater<T>) => {
  return {
    start,
    update
  }
}
