import { getTime } from "../time/time"

export type State = {
  keys: Record<Key, KeyState>
}

export type Key = string

export type KeyState = {
  isDown: boolean,
  lastPressed?: number
}

export const updateKey = (keyboard: State, key: Key, isDown: boolean) => {
  let keyState = keyboard.keys[key]
  if (!keyState) {
    keyState = {
      isDown
    }
  } else {
    keyState.isDown = isDown
    if (isDown) {
      keyState.lastPressed = getTime().now
    }
  }
  keyboard.keys[key] = keyState
}

export const isDown = (keyboard: State, key: Key): boolean => keyboard.keys[key]?.isDown || false
