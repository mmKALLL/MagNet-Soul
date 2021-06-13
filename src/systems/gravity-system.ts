import * as System from '../arch/system'
import { MyState } from '../main'
import * as Player from '../player/player'
import Physics from '../core/physics/physics'
import Vector from '../core/math/vector'
import { GameState } from '../core/game/game'
import * as PlayerBullet from '../player/player-bullet'

const gravity = new Vector(0, 0.001)

export const GravitySystem = System.create<MyState>(
  (game) => {
    // Physics.Events.on(game.state.physicsEngine, 'collisionStart', handleCollisions(game))
  },
  (game, time) => {
    game.state.gravity.forEach((id, affectedByGravity) => {
      if (affectedByGravity) {
        const body = game.state.physicsBodies.get(id)
        if (body) {
          Physics.Body.applyForce(body, body.position, gravity)
        }
      }
    })
  }
)

const handleCollisions = (game: GameState<MyState>) => {
  return (collisions: Physics.IEventCollision<Physics.Engine>) => {
    for (const pair of collisions.pairs) {
      if (game.state.entityType.get(pair.bodyA.label) == 'player-bullet') {
        handlePlayerBulletCollisions(game, pair.bodyA)
      }
      if (game.state.entityType.get(pair.bodyB.label) == 'player-bullet') {
        handlePlayerBulletCollisions(game, pair.bodyB)
      }
    }
  }
}

const handlePlayerBulletCollisions = (game: GameState<MyState>, playerBulletBody: Physics.Body) => {
  const bulletId = playerBulletBody.label
  game.state.gravity.set(bulletId, true)
}
