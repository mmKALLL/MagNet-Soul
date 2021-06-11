import Vector, { Vectors } from '../math/vector'
import * as Keyboard from './keyboard'
import * as Mouse from './mouse'

export type State = {
  keyboard: Keyboard.State
  mouse: Mouse.State
}

export const create = (): State => {
  return {
    keyboard: {
      keys: {},
    },
    mouse: {
      position: { x: 0, y: 0 },
      buttons: {},
    },
  }
}

export const getDirectionVector = (state: State) => {
  return [
    Keyboard.isDown(state.keyboard, 'ArrowUp') && Vectors.up(),
    Keyboard.isDown(state.keyboard, 'ArrowRight') && Vectors.right(),
    Keyboard.isDown(state.keyboard, 'ArrowDown') && Vectors.down(),
    Keyboard.isDown(state.keyboard, 'ArrowLeft') && Vectors.left(),
  ]
    .filter(Boolean)
    .reduce(
      (acc: Vector, v: Vector | boolean) => (v as Vector).add(acc),
      new Vector(0, 0)
    ) as Vector
}

export const handleInputs = (state: State) => {
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    Keyboard.updateKey(state.keyboard, event.key, true)
  })

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    Keyboard.updateKey(state.keyboard, event.key, false)
  })

  window.addEventListener('mousedown', (event: MouseEvent) => {
    Mouse.updateButton(state.mouse, event.button, true)
  })

  window.addEventListener('mouseup', (event: MouseEvent) => {
    Mouse.updateButton(state.mouse, event.button, false)
  })

  window.addEventListener('mousemove', (event: MouseEvent) => {
    Mouse.updatePosition(state.mouse, { x: event.x, y: event.y })
  })
}
