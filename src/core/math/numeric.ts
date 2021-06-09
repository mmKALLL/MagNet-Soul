export const isBetween = (x: number, min: number, max: number): boolean => x > min && x < max

export const clamp = (x: number, min: number, max: number): number => Math.min(max, Math.max(min, x))

export const sum = (array: number[]): number => array.reduce((a, b) => a + b, 0)

export const minIn = (array: number[]): number | undefined =>
  array.reduce((a, b) => a != undefined && b < a ? b : a, undefined as number | undefined)

export const maxIn = (array: number[]): number | undefined =>
  array.reduce((a, b) => a != undefined && b > a ? b : a, undefined as number | undefined)
