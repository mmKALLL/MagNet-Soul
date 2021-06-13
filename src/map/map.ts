import * as PIXI from 'pixi.js'
import TemplateMapData from '../assets/maps/stage1'
import Physics from '../core/physics/physics'
import { MyState, MyPoint } from '../main'
import { mapAssets, enemyTiles } from '../assets'
import { CollisionCategories } from '../collision-categories'
import * as Enemy from '../enemy/enemy'
import * as PolaritySwitcher from '../polarity/polarity-switcher'
import Vector from '../core/math/vector'

export type Map = typeof TemplateMapData & { startPoint: MyPoint }
type Layer = typeof TemplateMapData.layers[0]

export const loadMap = (state: MyState, map: Map) => {
  map.layers.forEach((layer) => {
    const asset = mapAssets[`${map.name}-${layer.name}`]
    switch (layer.name) {
      case 'terrain':
        loadTerrainLayer(state, map, layer)
        break
      case 'background':
        loadBackgroundLayer(state, map, layer, PIXI.Sprite.from(asset))
        break
      case 'front-parallax':
      case 'mid-parallax':
      case 'back-parallax':
        loadParallaxLayer(state, map, layer, PIXI.BaseTexture.from(asset))
        break
      case 'enemy':
        loadEnemyLayer(state, map, layer)
        break
      case 'item':
        loadItemLayer(state, map, layer)
        break
    }
  })
}

const loadTerrainLayer = (state: MyState, map: Map, layer: Layer) => {
  // Generate physics bodies for level geometry
  if (layer.data) {
    type Geometry = { x: number; y: number; length: number }
    let areas = [] as Geometry[]
    for (let y = 0; y < map.height; y++) {
      const row = layer.data.slice(y * map.width, (y + 1) * map.width)
      const newAreas = row.reduce((acc, cur, index) => {
        if (cur > 0) {
          // extend the area if previous tile was also a block, otherwise create new one
          if (row[index - 1] > 0) {
            acc[acc.length - 1].length += 1
          } else {
            acc.push({ x: index, y, length: 1 })
          }
        }
        return acc
      }, [] as Geometry[])
      areas = areas.concat(newAreas)
    }

    // Create collisions for the level geometry:
    areas.forEach((area) => {
      const { x, y, length } = area
      const body = Physics.Bodies.rectangle((x + length / 2) * 16, y * 16 + 8, length * 16, 16, {
        label: 'terrain',
        isStatic: true,
        slop: 0,
        friction: 0,
        frictionAir: 0,
        collisionFilter: {
          category: CollisionCategories.level,
        },
      })
      Physics.World.addBody(state.physicsWorld, body)
    })
  }
}

const loadBackgroundLayer = (state: MyState, map: Map, layer: Layer, sprite: PIXI.Sprite) => {
  // Use static image for foreground as perf optimization
  const id = state.entities.create()
  state.renderStage.addChild(sprite)
  state.backgrounds.set(id, { original_x: 0, parallaxX: 0, sprite })
}

const loadParallaxLayer = (
  state: MyState,
  map: Map,
  layer: Layer,
  baseTexture: PIXI.BaseTexture
) => {
  if (layer.objects) {
    layer.objects.forEach((o) => {
      const id = state.entities.create()
      const texture = new PIXI.Texture(baseTexture)
      const sprite = PIXI.Sprite.from(texture)
      sprite.y = 0 // TODO: Esa told me to set this to zero
      sprite.x = o.x
      sprite.width = o.width
      sprite.height = o.height
      sprite.alpha = layer.opacity ?? 1
      state.renderStage.addChild(sprite)
      // state.sprites.set(id, sprite)
      const background_obj = {
        sprite: sprite,
        original_x: sprite.x,
        parallaxX: layer.parallaxx ?? 0,
      }
      state.backgrounds.set(id, background_obj)
    })
  }
}

const loadEnemyLayer = (state: MyState, map: Map, layer: Layer) => {
  if (layer.objects) {
    layer.objects.forEach((object) => {
      const type: string | undefined =
        object.type ||
        (enemyTiles.tiles[object.gid - 390]?.type ?? enemyTiles.tiles[object.gid - 805]?.type) // magic number from stage's gid table
      const prefix = 'enemy-'
      if (type.includes(prefix)) {
        const direction = type.substr(prefix.length, 1)
        const polarity = type.substr(-1)
        const enemy = Enemy.create(state, new Vector(object.x + 8, object.y - 8))
        switch (polarity) {
          case 'p':
            state.polarity.set(enemy, 'positive')
            break
          case 'n':
            state.polarity.set(enemy, 'negative')
            break
        }
      }
    })
  }
}

const loadItemLayer = (state: MyState, map: Map, layer: Layer) => {
  if (layer.objects) {
    layer.objects.forEach((object) => {
      // if (object.type.includes('switcher')) {
      // To make map design faster, assume all things in the "item" layer are switchers
      PolaritySwitcher.create(state, new Vector(object.x + 8, object.y - 8))
      // }
    })
  }
}
