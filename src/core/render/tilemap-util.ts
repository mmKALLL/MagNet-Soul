import * as PIXI from 'pixi.js'
import mapData from '../../assets/tiles/html-game-test'
import Physics from '../physics/physics'
import { MyState } from '../../main'
import { assets } from '../../assets'
import { CollisionCategories } from '../../collision-categories'

export type Map = {
  mapWidth: number // in tiles
  mapHeight: number
  tileSize: PIXI.Point // in pixels
  startPosition: PIXI.Point
}

export type MapLayer = {
  name?: string
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
  const mapWidth = 100
  const tilesetColumns = 26
  const layers: MapLayer[] = [
    {
      background: true,
      animated: false,
      collisions: false,
      // parallaxX: 0.02,
      objects: mapData.layers[0].objects as any,
      texture: tileset_background,
    },
    {
      name: 'clouds',
      opacity: mapData.layers[1].opacity,
      parallaxX: mapData.layers[1].parallaxx,
      parallaxY: mapData.layers[1].parallaxy,
      background: true,
      animated: false,
      collisions: false,
      objects: mapData.layers[1].objects as any,
      texture: tileset_clouds,
    },
    { animated: false, collisions: false, data: mapData.layers[2].data, texture: tileset_base }, // background layer
    { animated: false, collisions: true, data: mapData.layers[3].data, texture: tileset_base }, // passive layer
    { animated: false, collisions: false, data: mapData.layers[4].data, texture: tileset_base }, // magnet layer
    // { animated: true, collisions: true, data: mapData.layers[4].data, texture: icons }, // active layer
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
        const background_obj = {
          sprite: sprite,
          original_x: sprite.x,
          parallaxX: layer.parallaxX ?? 0
        }
        state.backgrounds.set(id, background_obj)
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
              (index % mapWidth) * 16 + 8,
              Math.floor(index / mapWidth) * 16 + 8,
              16,
              16,
              {
                isStatic: true,
                slop: 0,
                friction: 0,
                frictionAir: 0,
                collisionFilter: {
                  category: CollisionCategories.level
                }
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
          sprite.anchor.set(0.5)
          state.renderStage.addChild(sprite)
          state.sprites.set(id, sprite)
        }
      })
    }
  })
}
