import * as Game from "./core/game/game"
import { Entity, Component, System } from "./arch/arch"
import { Time } from "./core/time/time"
import { Random } from "./core/math/math"

console.log("Hello world")

// Initial custom state

const state = {
  entities: Entity.many(),
  names: Component.many<string>(),
  scores: Component.many<number>(),
}
type MyState = typeof state
const gameState = Game.create<MyState>(state)

// How to use components

const alice: Entity.ID = state.entities.create()
state.names.set(alice, "Alice")
state.scores.set(alice, 0)
console.log("Player ", alice, " has name ", state.names.get(alice))

const bob: Entity.ID = state.entities.create()
state.names.set(bob, "Bob")
state.scores.set(bob, 0)
console.log("Player ", bob, " has name ", state.names.get(bob))

// How to use systems

const ScoreSystem = System.create<MyState>((game) => {
  const aliceScore = game.state.scores.get(alice)!
  const bobScore = game.state.scores.get(bob)!
  if (aliceScore < bobScore) {
    game.state.scores.set(alice, Random.integerBetween(1, 100))
  } else {
    game.state.scores.set(bob, Random.integerBetween(1, 100))
  }

  console.log("Alice's score is", game.state.scores.get(alice))
  console.log("Bob's score is", game.state.scores.get(bob))
})

// Game loop

const update = (game: Game.GameState<MyState>, time: Time) => {
  ScoreSystem.update(game, time)
  console.log(time)
  console.log(game)
}

const render = () => {}

const config: Game.GameRunConfig = {
  frameRate: 1
}

Game.run(
  gameState,
  update,
  render,
  config
)
