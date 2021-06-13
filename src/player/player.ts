import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { assets } from '../assets'
import { CollisionCategories } from '../collision-categories'
import Vector, { Vectors } from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState } from '../main'

export const ID = 'player'

export const create = (game: MyState): Entity.ID => {
  const playerId = game.entities.create(ID)
  game.entityType.set(ID, 'player')

  const width = 14
  const height = 20

  const body = Physics.Bodies.rectangle(0, 0, width, height, {
    label: ID,
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
      attractors: [enemyBulletRepeller(game)]
    }
  })
  game.physicsBodies.set(playerId, body)
  Physics.World.addBody(game.physicsWorld, body)
  Physics.Body.setPosition(body, new Vector(100, 150)) // debug

  game.gravity.set(playerId, true)

  const sprite = PIXI.Sprite.from(assets.character)
  sprite.pivot.set(0.5)
  sprite.anchor.set(0.5)
  sprite.width = width + 6
  sprite.height = height
  game.sprites.set(playerId, sprite)
  game.renderStage.addChild(sprite)

  game.health.set(ID, 3)

  game.polarity.set(ID, 'positive')

  game.weapon.set(ID, {
    fireRate: 0.2,
    lastTimeFired: 0
  })

  return playerId
}

const enemyBulletRepeller = (game: MyState) => {
  return (playerBody: Physics.Body, otherBody: Physics.Body) => {
    if ((Physics as any).Detector.canCollide(playerBody.collisionFilter, otherBody.collisionFilter)) {
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
              .multiplyScalar(0.02/distance)
            Physics.Body.applyForce(otherBody, otherBody.position, repelForce)
          }
      }
    }
  }
}