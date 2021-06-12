export type ID = string

export const many = () => {
  const entities: ID[] = []
  let lastID = 1000
  return {
    create: (id?: ID): ID => {
      if (id) {
        entities.push(id)
        return id
      } else {
        lastID++
        const entityID = lastID.toString()
        entities.push(entityID)
        return entityID
      }
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
