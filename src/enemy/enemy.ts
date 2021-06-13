import * as PIXI from 'pixi.js'
import { Entity } from '../arch/arch'
import { CollisionCategories } from '../collision-categories'
import Vector from '../core/math/vector'
import Physics from '../core/physics/physics'
import { MyState } from '../main'
import { assets } from '../assets'

export const create = (game: MyState, position: Vector): Entity.ID => {
  const id = game.entities.create()
  game.entityType.set(id, 'enemy')

  const width = 16
  const height = 16

  const body = Physics.Bodies.rectangle(0, 0, width, height, {
    label: id,
    friction: 0,
    frictionAir: 0.055,
    frictionStatic: 0.5,
    restitution: 0,
    inertia: Infinity,
    inverseInertia: 0,
    mass: 1,
    inverseMass: 1,
    isStatic: true,
    collisionFilter: {
      category: CollisionCategories.enemy,
      mask: CollisionCategories.player | CollisionCategories.playerBullet | CollisionCategories.level,
    },
    plugin: {
      attractors: [playerBulletRepeller(game)]
    }
  })

  game.physicsBodies.set(id, body)
  Physics.World.addBody(game.physicsWorld, body)
  Physics.Body.setPosition(body, position)

  const sprite = PIXI.Sprite.from(assets.turretLeft)
  sprite.width = width
  sprite.height = height
  sprite.anchor.set(0.5)
  sprite.pivot.set(0.5)
  game.sprites.set(id, sprite)
  game.renderStage.addChild(sprite)

  game.health.set(id, 1)

  game.polarity.set(id, 'neutral')

  game.weapon.set(id, {
    fireRate: 2,
    lastTimeFired: 0
  })

  return id
}

const playerBulletRepeller = (game: MyState) => {
  return (enemyBody: Physics.Body, otherBody: Physics.Body) => {
    if ((Physics as any).Detector.canCollide(enemyBody.collisionFilter, otherBody.collisionFilter)) {
      if (
        game.entityType.get(otherBody.label) == 'player-bullet' &&
        game.polarity.get(otherBody.label) === game.polarity.get(enemyBody.label)
      ) {
          const bulletBody = otherBody
          const distance = Physics.Vector.magnitude(Physics.Vector.sub(enemyBody.position, bulletBody.position))

          if (distance < 30) {
            const repelForce = new Vector(bulletBody.velocity.x, bulletBody.velocity.y)
            .multiplyScalar(-1)
            .multiplyScalar(0.1/distance)
            Physics.Body.applyForce(otherBody, otherBody.position, repelForce)
          }
      }
    }
  }
}