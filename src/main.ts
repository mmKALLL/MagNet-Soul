import * as Game from './core/game/game'
import { Entity, Component, System } from './arch/arch'
import { Time } from './core/time/time'
import Physics from './core/physics/physics'
import { renderFrame } from './core/render/render'

// Initialize physics engine

const engine = Physics.Engine.create()
const world = engine.world
engine.world.gravity.x = 0
engine.world.gravity.y = 0

const runner = Physics.Runner.create()
Physics.Runner.run(runner, engine)

// Initial custom state

const state = {
  entities: Entity.many(),
  physicsBodies: Component.many<Physics.Body>(),
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

// How to use components

const engine = Physics.Engine.create()
const world = engine.world
engine.world.gravity.x = 0
engine.world.gravity.y = 0

const runner = Physics.Runner.create()
Physics.Runner.run(runner, engine)

const alice: Entity.ID = state.entities.create()
state.physicsBodies.set(alice, Physics.Bodies.rectangle(5, 300, 100, 200))

const bob: Entity.ID = state.entities.create()
state.physicsBodies.set(bob, Physics.Bodies.rectangle(500, 300, 100, 200))

Physics.World.add(world, state.physicsBodies.all())

// How to use systems

const physicsSystem = System.create<MyState>((game, time) => {
  const body = game.state.physicsBodies.get(alice)!
  Physics.Body.setVelocity(
    body,
    (time.now - time.start) % 8 < 4 ? { x: 1, y: 0.5 } : { x: -1, y: -0.5 }
  )
})

// Game loop

const update = (game: Game.GameState<MyState>, time: Time) => {
  // ScoreSystem.update(game, time)
  mouse.position = game.input.mouse.position
  physicsSystem.update(game, time)
  // console.log(time)
  // console.log(game)
}

const mouse = Physics.Mouse.create(document.body)
const mouseConstraint = Physics.MouseConstraint.create(engine, {
  mouse: mouse,
})

Physics.World.add(world, mouseConstraint)

const config: Game.GameRunConfig = {
  frameRate: 40,
}

Game.run(gameState, update, renderFrame, config)
