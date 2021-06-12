import PIXI from 'pixi.js'
import data from '../../assets/tiles/html-game-test'
import Physics from '../physics/physics'
import { MyState } from '../../main'
import { assets } from '../../assets'

export const initializeTilemap = (state: MyState) => {
  const tileset = PIXI.BaseTexture.from(assets.tileset1)
  const mapWidth = 30
  const tilesetColumns = 26
  const index = 3
  const data = 107
  const id = state.entities.create()
  state.physicsBodies.set(id, Physics.Bodies.rectangle((index % mapWidth) * 16, Math.floor(index / mapWidth) * 16, 16, 16, {
    isStatic: true,
  }))
  const texture = new PIXI.Texture(tileset,
    new PIXI.Rectangle(((data - 1) % tilesetColumns) * 16, Math.floor((data - 1) / tilesetColumns) * 16, 16, 16)
  )
  state.sprites.set(id, PIXI.Sprite.from(texture))
}
