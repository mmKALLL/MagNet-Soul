import * as Time from '../time/time'
import * as Input from '../input/input'

export const run = <T>(
  state: GameState<T>,
  update: GameStateUpdater<T>,
  render: GameStateRenderer<T>,
  config: GameRunConfig,
  initialize: (config: GameRunConfig) => void
) => {
  let time = Time.getTime()

  Input.handleInputs(state.input)
  initialize(config)

  window.setInterval(() => {
    update(state, time)
    render(state, time)
    time = Time.getTime(time)
  }, 1000 / config.frameRate)
}

export type GameRunConfig = {
  frameRate: number
}

export type GameState<T> = {
  state: T
  input: Input.State
}

export const create = <T>(initial: T): GameState<T> => {
  return {
    state: initial,
    input: Input.create(),
  }
}

export type GameStateUpdater<T> = (state: GameState<T>, time: Time.Time) => void

export type GameStateRenderer<T> = (state: GameState<T>, time: Time.Time) => void
