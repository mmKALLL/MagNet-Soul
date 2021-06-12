import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { MyState } from '../main'
import Physics from '../core/physics/physics'
import { assets } from '../assets'
import Vector from '../core/math/vector'
import { CollisionCategories } from '../collision-categories'

export const bodyType = 'player-bullet'

export const create = (state: MyState, position: Vector, direction: Vector): Entity.ID => {
  const bulletId = state.entities.create()
  const radius = 4
  const velocity = 0.001

  const body = Physics.Bodies.circle(position.x, position.y, radius, {
    type: bodyType,
    label: bulletId,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0.3,
    inertia: Infinity,
    inverseInertia: 0,
    collisionFilter: {
      category: CollisionCategories.player,
      mask: ~CollisionCategories.player,
    }
  })

  state.physicsBodies.set(bulletId, body)
  Physics.World.addBody(state.physicsWorld, body)

  const graphics = new PIXI.Graphics()
  graphics.beginFill(0xFC4404)
  graphics.drawCircle(0, 0, 2)
  state.sprites.set(bulletId, graphics)
  state.renderStage.addChild(graphics)

  // TODO: use sprite?
  // const sprite = PIXI.Sprite.from(assets.ring46)
  // sprite.width = 8
  // sprite.height = 8
  // sprite.pivot.set(0.5)
  // sprite.anchor.set(0.5)
  // state.sprites.set(bulletId, sprite)
  // state.renderStage.addChild(sprite)

  Physics.Body.applyForce(body, body.position, direction.multiplyScalar(velocity))

  return bulletId
}
