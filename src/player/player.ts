import { assets } from '../assets'
import Physics from '../core/physics/physics'
import { MyState } from "../main"

export const create = (game: MyState) => {
  const playerId = game.entities.create()

  game.physicsBodies.set(playerId, Physics.Bodies.rectangle(0, 0, 100, 200, {
    friction: 0.1,
    frictionAir: 0.065,
    frictionStatic: 0.9,
    restitution: 0.4,
  }))

  game.sprites.set(playerId, PIXI.Sprite.from(assets.character))
}
