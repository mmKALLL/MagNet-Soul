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
import * as Player from './player/player'
import { PlayerMovementSystem } from './player/player-movement-system'
import * as PlayerWeapon from './player/player-weapon'
import { PlayerWeaponSystem } from './player/player-weapon-system'
import { GravitySystem } from './systems/gravity-system'

// Initialize graphics engine

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// Initialize physics engine

const engine = Physics.Engine.create()
const world = engine.world
world.gravity.x = 0
world.gravity.y = 0

const runner = Physics.Runner.create()
Physics.Runner.run(runner, engine)

// Initial custom state

const state = {
  renderStage: stage,
  physicsEngine: engine,
  physicsWorld: world,
  entities: Entity.many(),
  physicsBodies: Component.many<Physics.Body>(),
  gravity: Component.many<boolean>(),
  sprites: Component.many<PIXI.Container>(),
  cameras: Component.many<{ isActive: boolean; position: PIXI.Rectangle }>(),
  playerWeapon: PlayerWeapon.initialState()
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

const windowSize = new Vector(window.innerWidth, window.innerHeight)

// TODO: take window resize into account? https://stackoverflow.com/questions/57160423/make-walls-follow-canvas-edge-matter-js

GravitySystem.start(gameState)
PlayerMovementSystem.start(gameState)
DrawSpritesSystem.start(gameState)
CameraSystem.start(gameState)
PlayerWeaponSystem.start(gameState)

// Game loop
const update = (game: Game.GameState<MyState>, time: Time) => {
  GravitySystem.update(game, time)
  PlayerMovementSystem.update(game, time)
  DrawSpritesSystem.update(game, time)
  CameraSystem.update(game, time)
  PlayerWeaponSystem.update(game, time)
}

const config: Game.GameRunConfig = {
  frameRate: 40,
}

const initialize = (config) => {
  initializeTilemap(state)
  initializeCamera(state)
  initializeRendering()
  const playerId = Player.create(state)
}

Game.run(gameState, update, renderFrame, config, initialize)
