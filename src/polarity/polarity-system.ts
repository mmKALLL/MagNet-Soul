import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import * as System from '../arch/system'
import { handleCollisions } from '../collsition-handler'
import { GameState } from '../core/game/game'
import { destroy } from '../destroy'
import { MyState } from '../main'
import * as Player from '../player/player'

export type Polarity = 'positive' | 'negative' | 'neutral'

export const polarityColor = (polarity: Polarity): number => {
  switch (polarity) {
    case 'positive': return 0xFC4404
    case 'negative': return 0x6EBFFD
    case 'neutral': return 0x000000

  }
}

export const PolaritySystem = System.create<MyState>(
  (game) => {
    handleCollisions(
      game,
      (body) => game.state.entityType.get(body.label) == 'polarity-switcher',
      (polaritySwitcher, other) => {
        if (game.state.entityType.get(other.label) == 'player') {
          destroy(polaritySwitcher.label, game.state)
          removePolarityEffect(game, Player.ID)
          if (game.state.polarity.get(Player.ID) == 'positive') {
            game.state.polarity.set(Player.ID, 'negative')
          } else {
            game.state.polarity.set(Player.ID, 'positive')
          }
          addPolarityEffect(game, Player.ID)
        }
      }
    )
  },
  (game, time) => {
    game.state.entities.all().forEach((id => {
      const polarity = game.state.polarity.get(id)
      const sprite = game.state.sprites.get(id)
      if (polarity && sprite) {
        // Update polarity effect if there's a polarity component
        const polarityEffect = game.state.polarityEffects.get(id) ?? addPolarityEffect(game, id)
        if (polarityEffect) {
          polarityEffect.position = sprite.position
        }
      } else {
        // Remove the polarity effect if there's no component
        removePolarityEffect(game, id)
      }
    }))
  }
)

const removePolarityEffect = (game: GameState<MyState>, id: Entity.ID) => {
  const polarityEffect = game.state.polarityEffects.get(id)
  polarityEffect && game.state.renderStage.removeChild(polarityEffect)
}

const addPolarityEffect = (game: GameState<MyState>, id: Entity.ID): PIXI.Graphics | undefined => {
  const polarity = game.state.polarity.get(id)
  const sprite = game.state.sprites.get(id)
  if (polarity && polarity != 'neutral' && sprite) {
    const radius = sprite.width
    const polarityEffect = new PIXI.Graphics()
    polarityEffect.beginFill(polarityColor(polarity), 0.5)
    polarityEffect.drawCircle(0, 0, radius)
    polarityEffect.position = sprite.position
    game.state.polarityEffects.set(id, polarityEffect)
    const index = game.state.renderStage.getChildIndex(sprite) - 1
    game.state.renderStage.addChildAt(polarityEffect, index)
    return polarityEffect
  }
  return undefined
}
