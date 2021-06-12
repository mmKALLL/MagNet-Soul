import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { assets } from '../assets'
import { CollisionCategories } from '../collision-categories'
import Vector from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState } from '../main'

export const ID = 'player'

export const create = (game: MyState): Entity.ID => {
  const playerId = game.entities.create(ID)

  const width = 14
  const height = 20

  const body = Physics.Bodies.rectangle(0, 0, width, height, {
    friction: 0,
    frictionAir: 0.055,
    frictionStatic: 0.5,
    restitution: 0,
    inertia: Infinity,
    inverseInertia: 0,
    mass: 1,
    inverseMass: 1,
    collisionFilter: {
      category: CollisionCategories.player,
      mask: ~CollisionCategories.player
    }
  })
  game.physicsBodies.set(playerId, body)
  Physics.World.addBody(game.physicsWorld, body)
  Physics.Body.setPosition(body, new Vector(100, 150)) // debug

  const sprite = PIXI.Sprite.from(assets.character)
  sprite.pivot.set(0.5)
  sprite.anchor.set(0.5)
  sprite.width = width + 6
  sprite.height = height
  game.sprites.set(playerId, sprite)
  game.renderStage.addChild(sprite)

  return playerId
}
