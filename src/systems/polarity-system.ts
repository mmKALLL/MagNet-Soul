import * as PIXI from 'pixi.js'
import * as System from '../arch/system'
import { MyState } from '../main'

export type Polarity = 'positive' | 'negative'

export const polarityColor = (polarity: Polarity): number =>
  polarity == 'positive' ? 0xFC4404 : 0x6EBFFD

export const PolaritySystem = System.create<MyState>(
  () => { },
  (game, time) => {
    game.state.entities.all().forEach((id => {
      const polarity = game.state.polarity.get(id)
      const sprite = game.state.sprites.get(id)
      if (polarity && sprite) {
        // Update polarity effect if there's a polarity component
        let polarityEffect = game.state.polarityEffects.get(id)
        if (!polarityEffect) {
          const radius = sprite.width
          polarityEffect = new PIXI.Graphics()
          polarityEffect.beginFill(polarityColor(polarity), 0.5)
          polarityEffect.drawCircle(0, 0, radius)
          game.state.polarityEffects.set(id, polarityEffect)
          const index = game.state.renderStage.getChildIndex(sprite) - 1
          game.state.renderStage.addChildAt(polarityEffect, index)
        }
        polarityEffect.position = sprite.position
      } else {
        // Remove the polarity effect if there's no component
        const polarityEffect = game.state.polarityEffects.get(id)
        polarityEffect && game.state.renderStage.removeChild(polarityEffect)
      }
    }))
  }
)
