import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { assets } from '../assets'
import Vector from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState } from '../main'

export const ID = 'player'

export const create = (game: MyState): Entity.ID => {
  const playerId = game.entities.create(ID)

  const width = 16 * 2
  const height = 16 * 2

  const body = Physics.Bodies.rectangle(0, 0, width, height, {
    friction: 0,
    frictionAir: 0.05,
    frictionStatic: 0,
    restitution: 0.4,
    inertia: Infinity,
    inverseInertia: 0,
  })
  game.physicsBodies.set(playerId, body)
  Physics.World.addBody(game.physicsWorld, body)
  Physics.Body.setPosition(body, new Vector(100, 100)) // debug

  const sprite = PIXI.Sprite.from(assets.character)
  sprite.anchor.set(0.5, 0.5)
  sprite.width = width
  sprite.height = height
  game.sprites.set(playerId, sprite)
  game.renderStage.addChild(sprite)

  return playerId
}
