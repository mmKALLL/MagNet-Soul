import * as PIXI from 'pixi.js'
import * as Game from './core/game/game'
import { Entity, Component, System } from './arch/arch'
import { Time } from './core/time/time'
import Physics from './core/physics/physics'
import { renderFrame, initializeRendering } from './core/render/render'
import { getDirectionVector } from './core/input/input'
import { assets } from './assets'
import Vector, { Vectors } from './core/math/vector'

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
  drawables: Component.many<{ id: Entity.ID; sprite: PIXI.Sprite }>(),
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

// How to use components

const alice: Entity.ID = state.entities.create()
state.physicsBodies.set(
  alice,
  Physics.Bodies.rectangle(5, 300, 100, 200, {
    friction: 0.1,
    frictionAir: 0.065,
    frictionStatic: 0.9,
    restitution: 0.4,
  })
)
state.drawables.set(alice, {
  id: alice,
  sprite: PIXI.Sprite.from(assets.character),
})

const bob: Entity.ID = state.entities.create()
state.physicsBodies.set(
  bob,
  Physics.Bodies.rectangle(500, 300, 100, 200, {
    friction: 0.1,
    frictionAir: 0.01,
    restitution: 0.8,
  })
)
state.drawables.set(bob, { id: bob, sprite: PIXI.Sprite.from(assets.character) })
state.drawables.all().forEach((d) => {
  d.sprite.anchor.set(0.5)
  d.sprite.pivot.set(0.5)
})

// URDL, like CSS
const walls = [
  state.entities.create(),
  state.entities.create(),
  state.entities.create(),
  state.entities.create(),
]

const wallThickness = 20
const wallParams = [
  [window.innerWidth, wallThickness, Vectors.up()],
  [wallThickness, window.innerHeight, Vectors.right()],
  [window.innerWidth, wallThickness, Vectors.down()],
  [wallThickness, window.innerHeight, Vectors.left()],
] as const

const windowSize = new Vector(window.innerWidth, window.innerHeight)

walls.forEach((id, index) => {
  const params = wallParams[index]
  const position = windowSize.clone().multiply(params[2]).add(windowSize).multiplyScalar(0.5)
  state.physicsBodies.set(
    id,
    Physics.Bodies.rectangle(position.x, position.y, params[0], params[1], { isStatic: true })
  )
})

Physics.World.add(world, state.physicsBodies.all())
// TODO: take window resize into account? https://stackoverflow.com/questions/57160423/make-walls-follow-canvas-edge-matter-js

// How to use systems

const physicsSystem = System.create<MyState>((game, time) => {
  const aliceBody = game.state.physicsBodies.get(alice)!
  Physics.Body.applyForce(
    aliceBody,
    aliceBody.position,
    getDirectionVector(game.input).multiplyScalar(0.08)
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

const initialize = (config) => {
  initializeRendering()
}

Game.run(gameState, update, renderFrame, config, initialize)
