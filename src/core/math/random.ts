export const numberBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min

export const integerBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))

export const diceThrow = () => integerBetween(1, 6)

export const chance = (probability: number) =>
  Math.random() < probability

export const elementIn = <T>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)]
