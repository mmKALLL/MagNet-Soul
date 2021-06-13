import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { assets } from '../assets'
import { CollisionCategories } from '../collision-categories'
import Vector from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState } from '../main'

export const create = (game: MyState, position: Vector): Entity.ID => {
  const id = game.entities.create()
  game.entityType.set(id, 'polarity-switcher')

  const width = 16
  const height = 16

  const body = Physics.Bodies.rectangle(0, 0, width, height, {
    label: id,
    mass: 1,
    inverseMass: 1,
    isSensor: true,
    collisionFilter: {
      category: CollisionCategories.item,
      mask: CollisionCategories.player
    }
  })
  game.physicsBodies.set(id, body)
  Physics.World.addBody(game.physicsWorld, body)
  Physics.Body.setPosition(body, position)

  const sprite = PIXI.Sprite.from(assets.polaritySwitcher)
  sprite.pivot.set(0.5)
  sprite.anchor.set(0.5)
  sprite.width = width
  sprite.height = height
  game.sprites.set(id, sprite)
  game.renderStage.addChild(sprite)

  return id
}
