export type ID = number

export const many = () => {
  const entities: ID[] = []
  let lastID = 0
  return {
    create: (): ID => {
      lastID++
      entities.push(lastID)
      return lastID
    },
    remove: (id: ID): boolean => {
      const index = entities.indexOf(id)
      if (index >= 0) {
        entities.splice(index, 1)
        return true
      } else {
        return false
      }
    },
    all: () => entities
  }
}