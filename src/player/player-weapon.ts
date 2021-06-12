import { Entity } from '../arch/arch'
import { MyState } from '../main'

export type PlayerWeapon = {
  fireRate: number
  lastTimeFired: number
}

export const initialState = (): PlayerWeapon => ({
  fireRate: 0.2,
  lastTimeFired: 0
})
