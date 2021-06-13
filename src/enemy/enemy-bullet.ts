import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { MyState } from '../main'
import Physics from '../core/physics/physics'
import Vector from '../core/math/vector'
import { CollisionCategories } from '../collision-categories'

export const create = (state: MyState, position: Vector, direction: Vector): Entity.ID => {
  const bulletId = state.entities.create()
  state.entityType.set(bulletId, 'enemy-bullet')

  const radius = 2
  const velocity = 0.008

  const body = Physics.Bodies.circle(position.x, position.y, radius, {
    label: bulletId,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0.3,
    inertia: Infinity,
    inverseInertia: 0,
    mass: 1,
    inverseMass: 1,
    collisionFilter: {
      category: CollisionCategories.enemyBullet,
      mask: CollisionCategories.player | CollisionCategories.playerBullet | CollisionCategories.level,
    }
  })

  state.physicsBodies.set(bulletId, body)
  Physics.World.addBody(state.physicsWorld, body)

  const graphics = new PIXI.Graphics()
  graphics.beginFill(0xffff33)
  graphics.drawCircle(0, 0, radius)
  state.sprites.set(bulletId, graphics)
  state.renderStage.addChild(graphics)

  Physics.Body.applyForce(body, body.position, direction.multiplyScalar(velocity))

  return bulletId
}
