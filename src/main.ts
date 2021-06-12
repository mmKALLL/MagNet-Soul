import * as PIXI from 'pixi.js'
import * as Game from './core/game/game'
import { Entity, Component, System } from './arch/arch'
import { Time } from './core/time/time'
import Physics from './core/physics/physics'
import { renderFrame, initializeRendering, stage } from './core/render/render'
import Vector from './core/math/vector'
import { DrawSpritesSystem } from './systems/draw-sprites-system'
import { initializeTilemap } from './core/render/tilemap-util'
import * as Player from './player/player'
import { PlayerMovementSystem } from './player/player-movement-system'

// Initialize physics engine

const engine = Physics.Engine.create()
const world = engine.world

const runner = Physics.Runner.create()
Physics.Runner.run(runner, engine)

// Initial custom state

const state = {
  renderStage: stage,
  physicsWorld: world,
  entities: Entity.many(),
  physicsBodies: Component.many<Physics.Body>(),
  sprites: Component.many<PIXI.Container>(),
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

const windowSize = new Vector(window.innerWidth, window.innerHeight)

const createTempPlatform = (game: MyState) => {
  const id = state.entities.create()

  const body = Physics.Bodies.rectangle(0, windowSize.y - 100, 1000, 50, { isStatic: true })
  state.physicsBodies.set(id, body)
  Physics.World.add(world,body)

  const graphics = new PIXI.Graphics()
  graphics.lineStyle(2, 0x000000)
  graphics.drawCircle(0, 0, 5)
  graphics.drawRect(
    0, 0,
    body.bounds.max.x - body.bounds.min.x,
    body.bounds.max.y - body.bounds.min.y
  )

  game.renderStage.addChild(graphics)
  state.sprites.set(id, graphics)
}

createTempPlatform(gameState.state)

const playerId = Player.create(state)
const initializePlayer = () => {
  const body = state.physicsBodies.get(playerId)!
  Physics.Body.setPosition(body, new Vector(100, 400))
}
initializePlayer()

// TODO: take window resize into account? https://stackoverflow.com/questions/57160423/make-walls-follow-canvas-edge-matter-js

// Game loop
const update = (game: Game.GameState<MyState>, time: Time) => {
  PlayerMovementSystem.update(game, time)
  DrawSpritesSystem.update(game, time)
}

const config: Game.GameRunConfig = {
  frameRate: 40,
}

const initialize = (config) => {
  initializeTilemap(state)
  initializeRendering()
}

Game.run(gameState, update, renderFrame, config, initialize)
