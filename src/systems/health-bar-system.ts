import * as PIXI from 'pixi.js'
import { MyState } from '../main'
import * as System from '../arch/system'

export type HealthBar = {
  container: PIXI.Container,
  steps: PIXI.Graphics[]
}

export const HealthBarSystem = System.create<MyState>(
  () => { },
  (game, time) => {
    game.state.healthBar.forEach((id, healthBar) => {
      const sprite = game.state.sprites.get(id)
      if (sprite) {
        const belowSprite = {
          x: sprite.position.x,
          y: sprite.position.y + (sprite.height / 2) + 5
        }
        healthBar.container.position.set(belowSprite.x, belowSprite.y)
      }

      const health = game.state.health.get(id)
      if (health) {
        healthBar.steps.forEach((step, i) => {
          step.visible = i < health
        })
      }
    })
  }
)

export const addHealtBar = (game: MyState, maxHealth: number): HealthBar => {
  const healthBar: HealthBar = {
    container: new PIXI.Container(),
    steps: []
  }
  const stepSize = 2.5
  const spacing = 3
  const barWidth = (stepSize + spacing) * maxHealth - spacing

  for (let i = 0; i < maxHealth; i += 1) {
    const step = new PIXI.Graphics()
    step.beginFill(0x00CF00)
    step.drawCircle(0, 0, stepSize)
    step.position.x = (i * (stepSize + spacing)) - (barWidth / 2 - (stepSize + spacing) / 2)
    healthBar.steps.push(step)
    healthBar.container.addChild(step)
  }
  game.renderStage.addChild(healthBar.container)

  return healthBar
}

export const removeHealthBar = (game: MyState, healthBar: HealthBar) => {
  game.renderStage.removeChild(healthBar.container)
}
