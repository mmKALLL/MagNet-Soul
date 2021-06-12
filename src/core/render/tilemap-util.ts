import * as PIXI from 'pixi.js'
import mapData from '../../assets/tiles/html-game-test'
import Physics from '../physics/physics'
import { MyState } from '../../main'
import { assets } from '../../assets'

export type Map = {
  mapWidth: number // in tiles
  mapHeight: number
  tileSize: PIXI.Point // in pixels
  startPosition: PIXI.Point
}

export type MapLayer = {
  opacity?: number
  background?: boolean // use entire image
  parallaxX?: number
  parallaxY?: number
  animated: boolean
  collisions: boolean
  data?: number[]
  objects?: { x: number; y: number; width: number; height: number }[]
  texture: PIXI.BaseTexture
}

export const initializeTilemap = (state: MyState) => {
  const tileset_base = PIXI.BaseTexture.from(assets.tileset1)
  const tileset_clouds = PIXI.BaseTexture.from(assets.tileset2)
  const tileset_background = PIXI.BaseTexture.from(assets.tileset3)
  const mapWidth = 30
  const tilesetColumns = 26
  const layers: MapLayer[] = [
    {
      background: true,
      animated: false,
      collisions: false,
      objects: mapData.layers[0].objects as any,
      texture: tileset_background,
    },
    {
      opacity: mapData.layers[1].opacity,
      parallaxX: mapData.layers[1].parallaxx,
      parallaxY: mapData.layers[1].parallaxy,
      background: true,
      animated: false,
      collisions: false,
      objects: mapData.layers[1].objects as any,
      texture: tileset_clouds,
    },
    { animated: false, collisions: false, data: mapData.layers[2].data, texture: tileset_base },
    { animated: false, collisions: true, data: mapData.layers[3].data, texture: tileset_base },
    // { animated: true, collisions: true, data: mapData.layers[4].data, asset: tileset_base },
  ]
  layers.forEach((layer) => {
    if (layer.objects) {
      layer.objects.forEach((o) => {
        const id = state.entities.create()
        const texture = new PIXI.Texture(layer.texture)
        const sprite = PIXI.Sprite.from(texture)
        sprite.y = o.y
        sprite.x = o.x
        sprite.width = o.width
        sprite.height = o.height
        sprite.alpha = layer.opacity ?? 1
        state.renderStage.addChild(sprite)
        state.sprites.set(id, sprite)
      })
    }

    const layerData = layer.data
    if (layerData) {
      layerData.forEach((data, index) => {
        // data is 1-indexed, check that it's a valid value, if so create physics and sprite
        if (data > 0) {
          const id = state.entities.create()
          if (layer.collisions) {
            const body = Physics.Bodies.rectangle(
              (index % mapWidth) * 16,
              Math.floor(index / mapWidth) * 16,
              16,
              16,
              {
                isStatic: true,
                position: { x: (index % mapWidth) * 16, y: Math.floor(index / mapWidth) * 16 },
              }
            )
            state.physicsBodies.set(id, body)
            Physics.World.addBody(state.physicsWorld, body)
          }

          const texture = new PIXI.Texture(
            layer.texture,
            new PIXI.Rectangle(
              ((data - 1) % tilesetColumns) * 16,
              Math.floor((data - 1) / tilesetColumns) * 16,
              16,
              16
            )
          )
          const sprite = PIXI.Sprite.from(texture)
          state.renderStage.addChild(sprite)
          state.sprites.set(id, sprite)
        }
      })
    }
  })
}
