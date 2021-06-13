import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { assets } from '../assets'
import { CollisionCategories } from '../collision-categories'
import Vector, { Vectors } from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState, MyPoint } from '../main'

export const ID = 'player'
export const width = 14
export const height = 20

const playerSpriteFromAsset = (asset: any) => {
  const s = PIXI.Sprite.from(asset)
  s.pivot.set(0.5)
  s.anchor.set(0.5)
  s.width = width + 6
  s.height = height
  return s
}

const sprites = {
  positive: {
    idle: playerSpriteFromAsset(assets.player.positive.idle),
    jump: playerSpriteFromAsset(assets.player.positive.jump),
  },
  negative: {
    idle: playerSpriteFromAsset(assets.player.negative.idle),
    jump: playerSpriteFromAsset(assets.player.negative.jump),
  },
}

export const create = (game: MyState, startPoint: MyPoint): Entity.ID => {
  const playerId = game.entities.create(ID)
  game.entityType.set(ID, 'player')
  game.health.set(ID, 3)
  game.polarity.set(ID, 'positive')

  const body = Physics.Bodies.rectangle(startPoint.x * 16, startPoint.y * 16, width, height, {
    label: ID,
    slop: 0,
    friction: 0,
    frictionAir: 0.055,
    frictionStatic: 0.5,
    restitution: 0,
    inertia: Infinity,
    inverseInertia: 0,
    mass: 1,
    inverseMass: 1,
    chamfer: { radius: 4.5, quality: 10 },
    collisionFilter: {
      category: CollisionCategories.player,
      mask: ~CollisionCategories.player,
    },
    plugin: {
      attractors: [enemyBulletRepeller(game)],
    },
  })
  game.physicsBodies.set(playerId, body)
  Physics.World.addBody(game.physicsWorld, body)

  game.gravity.set(playerId, true)

  const container = new PIXI.Container()
  container.width = width + 6
  container.height = height
  game.sprites.set(playerId, container)
  game.renderStage.addChild(container)
  updateSprite(game)

  game.weapon.set(ID, {
    fireRate: 0.2,
    lastTimeFired: 0,
  })

  return playerId
}

const enemyBulletRepeller = (game: MyState) => {
  return (playerBody: Physics.Body, otherBody: Physics.Body) => {
    if (
      (Physics as any).Detector.canCollide(playerBody.collisionFilter, otherBody.collisionFilter)
    ) {
      if (
        game.entityType.get(otherBody.label) == 'enemy-bullet' &&
        game.polarity.get(otherBody.label) === game.polarity.get(playerBody.label)
      ) {
        const bulletBody = otherBody
        const distanceVector = Physics.Vector.sub(playerBody.position, bulletBody.position)
        const distance = Physics.Vector.magnitude(distanceVector)

        if (distance < 30) {
          const repelForce = new Vector(distanceVector.x, distanceVector.y)
            .normalize()
            .multiplyScalar(-1)
            .multiplyScalar(0.05 / distance)
          Physics.Body.applyForce(otherBody, otherBody.position, repelForce)
        }
      }
    }
  }
}

export const updateSprite = (game: MyState) => {
  const polarity = game.polarity.get(ID)
  const container = game.sprites.get(ID)

  container?.removeChildren()
  if (!container) {
    return
  }
  if (!polarity) {
    return
  }

  const anim = game.playerAnimState.next
  switch (game.playerAnimState.next) {
    case 'idle':
      container.addChild(sprites[polarity][anim])
      break
    case 'jump':
      container.addChild(sprites[polarity][anim])
      break
    case 'walk':
      break
  }
}
