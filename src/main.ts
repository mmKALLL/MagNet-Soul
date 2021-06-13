import * as PIXI from 'pixi.js'
import * as Game from './core/game/game'
import { Entity, Component, System } from './arch/arch'
import { Time } from './core/time/time'
import Physics from './core/physics/physics'
import { renderFrame, initializeRendering, stage, initializeCamera } from './core/render/render'
import Vector from './core/math/vector'
import { DrawSpritesSystem } from './systems/draw-sprites-system'
import { CameraSystem } from './systems/camera-system'
import * as Player from './player/player'
import { Map } from './map/map'
import { PlayerMovementSystem } from './player/player-movement-system'
import { PlayerWeaponSystem } from './player/player-weapon-system'
import { GravitySystem } from './systems/gravity-system'
import { TimeToLive, TimeToLiveSystem } from './systems/ttl-system'
import { Polarity, PolaritySystem } from './polarity/polarity-system'
import { EntityType } from './entity-types'
import { PlayerBulletHitSytem } from './player/player-bullet-hit-system'
import { Weapon } from './weapon/weapon'
import { EnemyWeaponSystem } from './enemy/enemy-weapon-sytem'
import { EnemyBulletHitSytem } from './enemy/enemy-bullet-hit-system'
import { DeathSystem } from './systems/death-system'
import { loadMap } from './map/map'
import stage1 from './assets/maps/stage1'
import stage2 from './assets/maps/stage2'
import { AnimStateMachine, PlayerAnimSystem } from './player/player-anim-system'
import { bgmAssets, sfxAssets } from './assets'
import { destroy } from './destroy'
import { PolaritySwitcherAnimSystem } from './polarity/polarity-switcher-anim-system'
import { HealthBar, HealthBarSystem } from './systems/health-bar-system'

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

const bgm1 = new Audio(bgmAssets.bgm1)
const bgm2 = new Audio(bgmAssets.bgm2)
const bgm3 = new Audio(bgmAssets.bgm3)
const music = [bgm1, bgm2, bgm3]
const defaultVolume = 0.25
const initializeMusic = () => {
  const addSmoothLoop = (audio: HTMLAudioElement, startTime?: number) => {
    audio.loop = true
    addEventListener('timeupdate', () => {
      var buffer = 0.22
      if (audio.currentTime > audio.duration - buffer) {
        audio.currentTime = startTime ?? 0
      }
    })
  }

  music.forEach((m) => {
    m.volume = defaultVolume
  })
  addSmoothLoop(bgm1, 7.5)
  addSmoothLoop(bgm2, 8.275)
  addSmoothLoop(bgm3, 0)

  // Set up playing after something has been pressed
  let musicPlaying = false
  const playMusic = () => {
    if (!musicPlaying) {
      bgm1.play()
      musicPlaying = true
    }
  }
  document.addEventListener('mouseup', (e) => playMusic())
  document.addEventListener('keydown', (e) => {
    playMusic()
    // Toggle music
    if (e.key === 'n') {
      music.forEach((m) => (m.volume = m.volume === 0 ? defaultVolume : 0))
    }
  })
}

let sounds = {}
const initializeSound = () => {
  const sfx_damage = new Audio(sfxAssets.damage)
  const sfx_item = new Audio(sfxAssets.item)
  const sfx_jump = new Audio(sfxAssets.jump)
  const sfx_kill = new Audio(sfxAssets.kill)
  const sfx_shot1 = new Audio(sfxAssets.shot1)
  const sfx_shot2 = new Audio(sfxAssets.shot2)
  const sfx_reflect = new Audio(sfxAssets.reflect)
  const sfx_stageclear = new Audio(sfxAssets.stageclear)
  const sfx_gameclear = new Audio(sfxAssets.gameclear)
  sounds = {
    damage: sfx_damage,
    item: sfx_item,
    jump: sfx_jump,
    kill: sfx_kill,
    shot1: sfx_shot1,
    shot2: sfx_shot2,
    reflect: sfx_reflect,
    stageclear: sfx_stageclear,
    gameclear: sfx_gameclear,
  }
  Object.keys(sounds).forEach((k) => {
    sounds[k].volume = defaultVolume
  })
}

// Initial custom state

export type GameScreen = 'stage1' | 'stage2'
export type MyPoint = { x: number; y: number }

const state = {
  renderStage: stage,
  physicsEngine: engine,
  physicsWorld: world,
  playerAnimState: { current: 'idle', next: 'idle' } as AnimStateMachine,
  currentScreen: 'stage1' as GameScreen,
  entities: Entity.many(),
  entityType: Component.many<EntityType>(),
  physicsBodies: Component.many<Physics.Body & { facing?: -1 | 1 }>(),
  gravity: Component.many<boolean>(),
  sprites: Component.many<PIXI.Container>(),
  backgrounds: Component.many<{ sprite: PIXI.Container; original_x: number; parallaxX: number }>(),
  cameras: Component.many<{ isActive: boolean; position: PIXI.Rectangle }>(),
  weapon: Component.many<Weapon>(),
  ttl: Component.many<TimeToLive>(),
  polarity: Component.many<Polarity>(),
  polarityEffects: Component.many<PIXI.Graphics>(),
  health: Component.many<number>(),
  healthBar: Component.many<HealthBar>(),
}
export type MyState = typeof state
const gameState = Game.create<MyState>(state)

// TODO: take window resize into account? https://stackoverflow.com/questions/57160423/make-walls-follow-canvas-edge-matter-js
const windowSize = new Vector(window.innerWidth, window.innerHeight)

const systems = [
  GravitySystem,
  DeathSystem,
  PlayerBulletHitSytem,
  EnemyBulletHitSytem,
  PlayerMovementSystem,
  DrawSpritesSystem,
  CameraSystem,
  PlayerWeaponSystem,
  EnemyWeaponSystem,
  TimeToLiveSystem,
  PolaritySystem,
  PlayerAnimSystem,
  PolaritySwitcherAnimSystem,
  HealthBarSystem,
]

systems.forEach((system) => system.start(gameState))

// Game loop
const update = (game: Game.GameState<MyState>, time: Time) => {
  systems.forEach((system) => system.update(game, time))
}

export type Config = {
  frameRate: number
  maps: { [k: string]: Map }
}
export const config: Config = {
  frameRate: 40,
  maps: { stage1, stage2 },
}

const initializeGame = (config) => {
  initializeMusic()
  initializeSound()
  initializeRendering()
  initializeScreen('stage1')
}

export const playSound = (...name: string[]) => {
  const idx = Math.floor(Math.random() * name.length)
  const sound = sounds[name[idx]]
  if (sound) {
    sound.load()
    sound.play()
  }
}

export const initializeScreen = (screen: GameScreen) => {
  state.currentScreen = screen

  destroy('player', state)
  state.physicsBodies.forEach((id, _) => destroy(id, state))
  state.sprites.forEach((id, _) => destroy(id, state))
  state.backgrounds.forEach((id, _) => destroy(id, state))
  state.polarity.forEach((id, _) => destroy(id, state))
  state.polarityEffects.forEach((id, _) => destroy(id, state))
  state.health.forEach((id, _) => destroy(id, state))
  state.cameras.forEach((id, _) => destroy(id, state))

  // カタカタカタカタ
  state.renderStage.removeChildren()
  engine.world.bodies = []

  loadMap(state, config.maps[screen]) // TODO: Load based on screen
  initializeCamera(state)
  Player.create(state, config.maps[screen].startPoint)
}
document.addEventListener('keydown', (e) => {
  e.key === '9' && advanceStage(state.currentScreen === 'stage1' ? 'stage1' : 'stage2')
})

export let stageClearCleanup = false
export const advanceStage = (screen: GameScreen) => {
  if (!stageClearCleanup) {
    stageClearCleanup = true
    music.forEach((m) => {
      m.pause()
      m.currentTime = 0
    })
    screen === 'stage1' ? playSound('stageclear') : playSound('gameclear')
    window.setTimeout(() => {
      initializeScreen(screen === 'stage1' ? 'stage2' : 'stage1')
      screen === 'stage1' ? bgm2.play() : bgm3.play()
      stageClearCleanup = false
    }, 8000)
  }
}

Game.run(gameState, update, renderFrame, config, initializeGame)
