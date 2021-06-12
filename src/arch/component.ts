import * as Entity from './entity'

export type Components<T> = Record<Entity.ID, T>

export const many = <T>() => {
  const components: Components<T> = {}
  return {
    get: (id: Entity.ID): T | undefined => components[id],
    all: (): T[] => Object.values(components),
    forEach: (callback: (id: Entity.ID, component: T) => void) =>
      Object.entries(components).forEach(([id, component]) => callback(id, component)),
    set: (id: Entity.ID, component: T) => (components[id] = component),
    effect: (id: Entity.ID, runEffect: (current: T) => void) => runEffect(components[id]),
    remove: (id: Entity.ID) => delete components[id],
  }
}
