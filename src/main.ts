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

// Initialize music

const initializeMusic = () => {
  const defaultVolume = 0.25
  const bgm1first = new Audio(require('./assets/audio/BGM1_first.wav'))
  const bgm1loop = new Audio(require('./assets/audio/BGM1_loop.wav'))
  const bgm2first = new Audio(require('./assets/audio/BGM2_first.wav'))
  const bgm2loop = new Audio(require('./assets/audio/BGM2_loop.wav'))
  const music = [bgm1first, bgm1loop, bgm2first, bgm2loop]
  music.forEach((m) => {
    m.volume = defaultVolume
  })
  bgm1first.onended = () => bgm1loop.play()
  bgm2first.onended = () => bgm2loop.play()
  bgm1loop.loop = true
  bgm2loop.loop = true

  // Set up playing after something has been pressed
  let musicPlaying = false
  const playMusic = () => bgm2first.play()
  document.addEventListener('keydown', (e) => {
    if (!musicPlaying) {
      playMusic()
      musicPlaying = true
    }
    // Toggle music
    if (e.key === 'm') {
      music.forEach((m) => (m.volume = m.volume === 0 ? defaultVolume : 0))
    }
  })
}

// Initial custom state

const state = {
  renderStage: stage,
  physicsWorld: world,
  entities: Entity.many(),
  physicsBodies: Component.many<Physics.Body>(),
  sprites: Component.many<PIXI.Container>(),
  cameras: Component.many<{ isActive: boolean; position: PIXI.Rectangle }>(),
  playerWeapon: PlayerWeapon.initialState(),
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

const windowSize = new Vector(window.innerWidth, window.innerHeight)

// TODO: take window resize into account? https://stackoverflow.com/questions/57160423/make-walls-follow-canvas-edge-matter-js

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
  initializeMusic()
  initializeTilemap(state)
  initializeCamera(state)
  initializeRendering()
  const playerId = Player.create(state)
}

Game.run(gameState, update, renderFrame, config, initialize)
