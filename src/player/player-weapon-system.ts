import { MyState } from '../main'
import * as System from '../arch/system'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'
import * as PlayerBullet from '../player/player-bullet'
import * as Player from '../player/player'

export const PlayerWeaponSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    const playerWeapon = game.state.weapon.get(Player.ID)
    const keyboard = game.input.keyboard
    if (playerWeapon && (Keyboard.isDown(keyboard, 'z') || Keyboard.isDown(keyboard, ','))) {
      if (time.now > playerWeapon.lastTimeFired + playerWeapon.fireRate) {
        playerWeapon.lastTimeFired = time.now
        const playerBody = game.state.physicsBodies.get('player')!
        const position = new Vector(playerBody.position.x, playerBody.position.y)
        const direction = Vectors.right().multiplyScalar(playerBody.facing ?? 1)
        const bulletId = PlayerBullet.create(game.state, position, direction)
        game.state.ttl.set(bulletId, {
          createdAt: time.now,
          expiresIn: 2,
        })
      }
    }
  }
)
