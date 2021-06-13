import { MyState } from '../main'
import * as System from '../arch/system'
import Physics from '../core/physics/physics'
import * as Player from '../player/player'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'
import { clamp } from '../core/math/numeric'

export const PlayerMovementSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    const body = game.state.physicsBodies.get(Player.ID)!
    const keyboard = game.input.keyboard

    const speedMultiplier = 2.35
    let xSpeed = 0
    if (Keyboard.isDown(keyboard, 'a') || Keyboard.isDown(keyboard, 'ArrowLeft')) {
      xSpeed -= speedMultiplier
      body.facing = -1
    }

    if (Keyboard.isDown(keyboard, 'd') || Keyboard.isDown(keyboard, 'ArrowRight')) {
      xSpeed += speedMultiplier
      body.facing = 1
    }

    Physics.Body.setVelocity(body, {
      x: clamp(body.velocity.x * 0.75 + xSpeed, -speedMultiplier, speedMultiplier),
      y: body.velocity.y,
    })

    if (
      (Keyboard.isDown(keyboard, ' ') ||
        Keyboard.isDown(keyboard, 'Spacebar') ||
        Keyboard.isDown(keyboard, 'ArrowUp')) &&
      Math.abs(body.velocity.y) < 0.01
    ) {
      Physics.Body.applyForce(body, body.position, Vectors.up().multiplyScalar(0.025))
    }

    // Reset player on fall
    if (body.position.y > 20 * 16 + 100) {
      Physics.Body.setPosition(body, { x: 100, y: 150 })
    }
  }
)
