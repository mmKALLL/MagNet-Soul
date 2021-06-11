import Vector from 'victor'
export default Vector

const up = () => new Vector(0, -1)
const down = () => new Vector(0, 1)
const left = () => new Vector(-1, 0)
const right = () => new Vector(1, 0)

export const Vectors = {
  up,
  down,
  left,
  right,
}
