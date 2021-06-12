import * as System from '../arch/system'
import { MyState } from '../main'
import * as Player from '../player/player'
import Physics from '../core/physics/physics'
import Vector from '../core/math/vector'

const gravity = new Vector(0, 0.001)

export const GravitySystem = System.create<MyState>((game, time) => {
  const playerBody = game.state.physicsBodies.get(Player.ID)!
  Physics.Body.applyForce(playerBody, playerBody.position, gravity)
})

