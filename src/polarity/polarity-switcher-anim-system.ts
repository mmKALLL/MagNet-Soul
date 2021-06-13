import { MyState } from '../main'
import * as System from '../arch/system'
import * as Player from '../player/player'
import Physics from '../core/physics/physics'
import * as Keyboard from '../core/input/keyboard'
import Vector, { Vectors } from '../core/math/vector'
import { clamp } from '../core/math/numeric'
import { assets } from '../assets'

export const PolaritySwitcherAnimSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    game.state.entityType.forEach((id, type) => {
      if (type == 'polarity-switcher') {
        const sprite = game.state.sprites.get(id)
        if (sprite) {
          sprite.rotation = Math.sin(time.now*5)/5
        }
      }
    })
  }
)
