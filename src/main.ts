import * as PIXI from 'pixi.js'
import * as Game from './core/game/game'
import { Entity, Component, System } from './arch/arch'
import { Time } from './core/time/time'
import Physics from './core/physics/physics'
import { renderFrame, initializeRendering, stage, initializeCamera } from './core/render/render'
import Vector from './core/math/vector'
import { DrawSpritesSystem } from './systems/draw-sprites-system'
import { CameraSystem } from './systems/camera-system'
import { initializeTilemap } from './core/render/tilemap-util'

// Initialize graphics engine

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// Initialize physics engine

const engine = Physics.Engine.create()
const world = engine.world
engine.world.gravity.x = 0
engine.world.gravity.y = 0

const runner = Physics.Runner.create()
Physics.Runner.run(runner, engine)

// Initial custom state

const state = {
  stage: stage,
  entities: Entity.many(),
  physicsBodies: Component.many<Physics.Body>(),
  sprites: Component.many<PIXI.Container>(),
  cameras: Component.many<{ isActive: boolean; position: PIXI.Rectangle }>(),
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

const windowSize = new Vector(window.innerWidth, window.innerHeight)

const createTempPlatform = (game: MyState) => {
  const id = state.entities.create()

  const body = Physics.Bodies.rectangle(0, windowSize.y - 100, 1000, 50, { isStatic: true })
  state.physicsBodies.set(id, body)

  const graphics = new PIXI.Graphics()
  graphics.lineStyle(2, 0x000000)
  graphics.drawRect(
    body.bounds.min.x,
    body.bounds.min.y,
    body.bounds.max.x - body.bounds.min.x,
    body.bounds.max.y - body.bounds.min.y
  )

  game.stage.addChild(graphics)
  state.sprites.set(id, graphics)
}

createTempPlatform(gameState.state)

Physics.World.add(world, state.physicsBodies.all())
// TODO: take window resize into account? https://stackoverflow.com/questions/57160423/make-walls-follow-canvas-edge-matter-js

// Game loop

const update = (game: Game.GameState<MyState>, time: Time) => {
  DrawSpritesSystem.update(game, time)
  CameraSystem.update(game, time)
}

const config: Game.GameRunConfig = {
  frameRate: 40,
}

const initialize = (config) => {
  initializeTilemap(state)
  initializeCamera(state)
  initializeRendering()
}

Game.run(gameState, update, renderFrame, config, initialize)
