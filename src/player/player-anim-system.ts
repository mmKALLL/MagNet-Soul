import { MyState } from '../main'
import * as System from '../arch/system'
import * as Player from '../player/player'
import Physics from '../core/physics/physics'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'
import { clamp } from '../core/math/numeric'
import { assets } from '../assets'

export type AnimState = 'idle' | 'walk' | 'jump'

export type AnimStateMachine = {
  current: AnimState,
  next: AnimState
}

export const PlayerAnimSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    const animState = game.state.playerAnimState
    if (animState.next != animState.current) {
      Player.updateSprite(game.state)
      animState.current = animState.next
    }
  }
)
