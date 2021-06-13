import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { assets } from '../assets'
import { CollisionCategories } from '../collision-categories'
import Vector from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState } from '../main'

export const ID = 'friend'

export const create = (game: MyState): Entity.ID => {
  game.entities.create(ID)
  game.entityType.set(ID, 'friend')

  const width = 14
  const height = 10

  const body = Physics.Bodies.rectangle(0, 0, width, height, {
    label: ID,
    friction: 0,
    frictionAir: 0.055,
    frictionStatic: 0.5,
    restitution: 0,
    inertia: Infinity,
    inverseInertia: 0,
    mass: 1,
    inverseMass: 1,
    chamfer: { radius: 4.5, quality: 10 },
    collisionFilter: {
      category: CollisionCategories.player,
      mask: ~CollisionCategories.player,
    },
  })
  game.physicsBodies.set(ID, body)
  Physics.World.addBody(game.physicsWorld, body)
  Physics.Body.setPosition(body, new Vector(50, 150)) // debug

  game.gravity.set(ID, true)

  const sprite = PIXI.Sprite.from(assets.character)
  sprite.pivot.set(0.5)
  sprite.anchor.set(0.5)
  sprite.width = width
  sprite.height = height
  game.sprites.set(ID, sprite)
  game.renderStage.addChild(sprite)

  game.polarity.set(ID, 'positive')

  return ID
}
