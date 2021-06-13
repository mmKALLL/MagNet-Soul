import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { playSound, MyState } from '../main'
import Physics from '../core/physics/physics'
import { assets } from '../assets'
import Vector from '../core/math/vector'
import { CollisionCategories } from '../collision-categories'
import * as Player from '../player/player'

export const create = (state: MyState, position: Vector, direction: Vector): Entity.ID => {
  const bulletId = state.entities.create()
  state.entityType.set(bulletId, 'player-bullet')

  const radius = 2
  const velocity = 0.02

  const body = Physics.Bodies.circle(position.x, position.y, radius + 2, {
    label: bulletId,
    slop: 0,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0.3,
    inertia: Infinity,
    inverseInertia: 0,
    mass: 1,
    inverseMass: 1,
    collisionFilter: {
      category: CollisionCategories.playerBullet,
      mask: CollisionCategories.enemy | CollisionCategories.level,
    }
  })

  state.physicsBodies.set(bulletId, body)
  Physics.World.addBody(state.physicsWorld, body)

  const playerPolarity = state.polarity.get(Player.ID)
  playerPolarity && state.polarity.set(bulletId, playerPolarity)

  const graphics = new PIXI.Graphics()
  graphics.beginFill(0x2c2a29)
  graphics.drawCircle(0, 0, radius)
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

  playSound('shot1', 'shot2')

  Physics.Body.applyForce(body, body.position, direction.multiplyScalar(velocity))

  return bulletId
}
