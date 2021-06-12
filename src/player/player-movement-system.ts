import { MyState } from '../main'
import * as System from '../arch/system'
import Physics from '../core/physics/physics'
import * as Player from '../player/player'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'

export const PlayerMovementSystem = System.create<MyState>((game, time) => {
  const body = game.state.physicsBodies.get(Player.ID)!
  const keyboard = game.input.keyboard

  const direction = new Vector(0, 0)
  if (Keyboard.isDown(keyboard, 'a') || Keyboard.isDown(keyboard, 'ArrowLeft')) {
    direction.add(Vectors.left())
  }

  if (Keyboard.isDown(keyboard, 'd') || Keyboard.isDown(keyboard, 'ArrowRight')) {
    direction.add(Vectors.right())
  }

  Physics.Body.applyForce(
    body,
    body.position,
    direction.multiplyScalar(0.001)
  )

    (Keyboard.isDown(keyboard, ' ') ||
      Keyboard.isDown(keyboard, 'Spacebar') ||
      Keyboard.isDown(keyboard, 'ArrowUp')) &&
  }
})