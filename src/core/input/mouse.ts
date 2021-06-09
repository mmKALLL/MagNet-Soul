export type State = {
  position: {
    x: number,
    y: number
  },
  buttons: Record<MouseButtonIndex, MouseButtonState>
}

export type MouseButtonIndex = number

export type MouseButtonState = {
  isDown: boolean
}

export const updatePosition = (mouse: State, position: { x: number, y: number }) => {
  mouse.position = position
}

export const updateButton = (mouse: State, index: MouseButtonIndex, isDown: boolean) => {
  let buttonState = mouse.buttons[index]
  if (!buttonState) {
    buttonState = {
      isDown
    }
  } else {
    buttonState.isDown = isDown
  }
  mouse.buttons[index] = buttonState
}
