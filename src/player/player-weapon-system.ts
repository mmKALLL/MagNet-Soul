import { MyState } from '../main'
import * as System from '../arch/system'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'
import * as PlayerBullet from '../player/player-bullet'

export const PlayerWeaponSystem = System.create<MyState>((game, time) => {
  const playerWeapon = game.state.playerWeapon
  const keyboard = game.input.keyboard
  if (Keyboard.isDown(keyboard, 'z')) {
    if (time.now > playerWeapon.lastTimeFired + playerWeapon.fireRate) {
      playerWeapon.lastTimeFired = time.now
      const playerBody = game.state.physicsBodies.get('player')!
      const position = new Vector(playerBody.position.x, playerBody.position.y)
      const direction = Vectors.right()
      PlayerBullet.create(game.state, position, direction)
    }
  }
})
