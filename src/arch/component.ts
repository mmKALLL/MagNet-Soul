import * as Entity from './entity'

export type Components<T> = Record<Entity.ID, T>

export const many = <T>() => {
  const components: Components<T> = {}
  return {
    get: (id: Entity.ID): T | undefined => components[id],
    all: (): T[] => Object.values(components),
    set: (id: Entity.ID, component: T) => (components[id] = component),
    remove: (id: Entity.ID) => delete components[id],
  }
}
