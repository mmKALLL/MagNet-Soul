import { GameState } from './core/game/game'
import Physics from './core/physics/physics'
import { MyState } from './main'

export type CollisionPredicate = (body: Physics.Body) => boolean
export type CollisionCallback = (
  body: Physics.Body,
  other: Physics.Body,
  pair: Physics.IPair
) => void

export const handleCollisions = (
  game: GameState<MyState>,
  predicate: CollisionPredicate,
  callback: CollisionCallback
) => {
  Physics.Events.on(game.state.physicsEngine, 'collisionStart', (collisions) => {
    for (const pair of collisions.pairs) {
      if (predicate(pair.bodyA)) {
        callback(pair.bodyA, pair.bodyB, pair)
      } else if (predicate(pair.bodyB)) {
        callback(pair.bodyB, pair.bodyA, pair)
      }
    }
  })
}
