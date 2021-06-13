import {
  playSound,
  initializeScreen,
  MyState,
  config,
  advanceStage,
  stageClearCleanup,
} from '../main'
import * as System from '../arch/system'
import Physics from '../core/physics/physics'
import * as Player from '../player/player'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'
import { clamp } from '../core/math/numeric'
import { CollisionCategories } from '../collision-categories'

export const PlayerMovementSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    const body = game.state.physicsBodies.get(Player.ID)
    const keyboard = game.input.keyboard

    if (!body || stageClearCleanup) {
      return
    }

    if (Math.abs(body.velocity.y) < 0.01) {
      if (game.state.playerAnimState.current != 'idle') {
        game.state.playerAnimState.next = 'idle'
      }

      if (Math.abs(body.velocity.x) > 0.01) {
        game.state.playerAnimState.next = 'walk'
      }
    }

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
        Keyboard.isDown(keyboard, 'w') ||
        Keyboard.isDown(keyboard, 'ArrowUp')) &&
      Math.abs(body.velocity.y) < 0.05
    ) {
      const terrain = game.state.physicsWorld.bodies
        .map((body) => ({ body, category: body.collisionFilter?.category ?? 0 }))
        .filter(
          ({ category }) =>
            (category & CollisionCategories.level) !== 0 ||
            (category & CollisionCategories.enemy) !== 0
        )
        .map(({ body }) => body)
      const below = Physics.Query.point(terrain, { x: body.position.x, y: body.position.y + 11 })
      const left = Physics.Query.point(terrain, { x: body.position.x - 5, y: body.position.y + 11 })
      const right = Physics.Query.point(terrain, {
        x: body.position.x + 5,
        y: body.position.y + 11,
      })
      const collidingTerrain = below.concat(left).concat(right)
      const isGrounded = collidingTerrain.length > 0
      if (isGrounded) {
        game.state.playerAnimState.next = 'jump'
        Physics.Body.applyForce(body, body.position, Vectors.up().multiplyScalar(0.025))
        playSound('jump')
      }
    }

    // Reset player on fall
    if (body.position.y > 20 * 16 + 100) {
      game.state.health.set('player', 0)
    }
    if (body.position.x > config.maps[game.state.currentScreen].width * 16 - 48) {
      advanceStage(game.state.currentScreen)
    }
  }
)
