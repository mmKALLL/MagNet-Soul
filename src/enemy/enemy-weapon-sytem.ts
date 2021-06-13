import { MyState } from '../main'
import * as System from '../arch/system'
import Vector, { Vectors } from '../core/math/vector'
import * as Player from '../player/player'
import Physics from '../core/physics/physics'
import * as EnemyBullet from '../enemy/enemy-bullet'

export const EnemyWeaponSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    game.state.weapon.forEach((id, weapon) => {
      if (game.state.entityType.get(id) == 'enemy') {
        if (time.now > weapon.lastTimeFired + weapon.fireRate) {
          const enemyBody = game.state.physicsBodies.get(id)
          const playerBody = game.state.physicsBodies.get(Player.ID)
          if (!enemyBody || !playerBody) {
            return
          }
          const distanceToPlayer = Physics.Vector.magnitude(
            Physics.Vector.sub(playerBody.position, enemyBody.position)
          )
          if (distanceToPlayer < 13 * 16) {
            weapon.lastTimeFired = time.now
            const direction = Vectors.left()
            const position = new Vector(enemyBody.position.x, enemyBody.position.y)
            const bulletId = EnemyBullet.create(game.state, position, direction)
            const enemyPolarity = game.state.polarity.get(id)
            if (enemyPolarity) {
              game.state.polarity.set(bulletId, enemyPolarity)
            }
            game.state.ttl.set(bulletId, {
              createdAt: time.now,
              expiresIn: 2,
            })
          }
        }
      }
    })
  }
)
