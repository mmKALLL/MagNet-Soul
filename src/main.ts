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
import * as Friend from './friend/friend'
import { PlayerMovementSystem } from './player/player-movement-system'
import * as PlayerWeapon from './player/player-weapon'
import { PlayerWeaponSystem } from './player/player-weapon-system'
import { GravitySystem } from './systems/gravity-system'
import { TimeToLive, TimeToLiveSystem } from './systems/ttl-system'
import { Polarity, PolaritySystem } from './polarity/polarity-system'
import * as PolaritySwitcher from './polarity/polarity-switcher'
import { EntityType } from './entity-types'

// Initialize graphics engine

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// Initialize physics engine

Physics.use(require('matter-attractors'))

const engine = Physics.Engine.create()
const world = engine.world
world.gravity.x = 0
world.gravity.y = 0

const runner = Physics.Runner.create()
Physics.Runner.run(runner, engine)

// Initialize music

const initializeMusic = () => {
  const addSmoothLoop = (audio: HTMLAudioElement, startTime?: number) => {
    audio.loop = true
    audio.addEventListener('timeupdate', function () {
      var buffer = 0.2
      if (this.currentTime > this.duration - buffer) {
        this.currentTime = startTime ?? 0
        this.play()
      }
    })
  }

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
  addSmoothLoop(bgm1loop)
  addSmoothLoop(bgm2loop)

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
  physicsEngine: engine,
  physicsWorld: world,
  entities: Entity.many(),
  entityType: Component.many<EntityType>(),
  physicsBodies: Component.many<Physics.Body>(),
  gravity: Component.many<boolean>(),
  sprites: Component.many<PIXI.Container>(),
  backgrounds: Component.many<{ sprite: PIXI.Container; original_x: number; parallaxX: number }>(),
  cameras: Component.many<{ isActive: boolean; position: PIXI.Rectangle }>(),
  playerWeapon: PlayerWeapon.initialState(),
  ttl: Component.many<TimeToLive>(),
  polarity: Component.many<Polarity>(),
  polarityEffects: Component.many<PIXI.Graphics>(),
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
PolaritySystem.start(gameState)

// Game loop
const update = (game: Game.GameState<MyState>, time: Time) => {
  GravitySystem.update(game, time)
  PlayerMovementSystem.update(game, time)
  DrawSpritesSystem.update(game, time)
  CameraSystem.update(game, time)
  PlayerWeaponSystem.update(game, time)
  TimeToLiveSystem.update(game, time)
  PolaritySystem.update(game, time)
}

const config: Game.GameRunConfig = {
  frameRate: 40,
}

const initialize = (config) => {
  initializeMusic()
  initializeTilemap(state)
  initializeCamera(state)
  initializeRendering()
  Friend.create(state)
  Player.create(state)
  PolaritySwitcher.create(gameState.state, new Vector(16 * 12, 16 * 12)) // Debug
}

Game.run(gameState, update, renderFrame, config, initialize)
