import * as PIXI from 'pixi.js'
import * as System from '../arch/system'
import { clamp } from '../core/math/numeric'
import { MyState, config } from '../main'

const x_base = 400
const game_height = 320

export const CameraSystem = System.create<MyState>(
  () => {},
  (game, time) => {
    game.state.cameras.forEach((id, position) => {
      const stage_width = config.maps[game.state.currentScreen].width * 16
      const zoom = window.innerHeight / game_height
      game.state.renderStage.scale.set(zoom)
      const playerX = game.state.physicsBodies.get('player')?.position.x
      if (playerX) {
        const calcX = -zoom * playerX + x_base
        game.state.renderStage.position.x = clamp(calcX, stage_width * -zoom + window.innerWidth, 0)

        // Adjust non-parallax backgrounds' x value
        game.state.backgrounds.forEach((id, obj) => {
          const { sprite, original_x, parallaxX } = obj
          if (parallaxX === -1) {
            // 135くらいが欲しいけど式が合ってないかも
            const magic_number = 145
            const maxX = stage_width - (x_base + magic_number)
            sprite.position.x = clamp(playerX - magic_number, 0, maxX)
          }
        })
      }
    })
  }
)
