import * as PIXI from 'pixi.js'
import { assets } from './assets'

export const playHit = (container: PIXI.Container, position: {x: number, y: number}) => {
  const anim = new PIXI.AnimatedSprite(assets.hitAnim.map(asset => PIXI.Texture.from(asset)));
  anim.position.x = position.x
  anim.position.y = position.y
  anim.animationSpeed = 0.5
  anim.loop = false
  anim.pivot.set(0.5)
  anim.anchor.set(0.5)
  anim.width = 32
  anim.height = 32
  anim.play()
  anim.onComplete = () => {
    container.removeChild(anim)
  }
  container.addChild(anim)
  return anim
}
