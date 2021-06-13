export type ID = string

export const many = () => {
  const entities: { [k: string]: true | undefined } = {}
  let lastID = 1000
  return {
    create: (id?: ID): ID => {
      if (id) {
        entities[id] = true
        return id
      } else {
        lastID++
        const entityID = lastID.toString()
        entities[entityID] = true
        return entityID
      }
    },
    remove: (id: ID): void => {
      entities[id] = undefined
    },
    all: () => Object.keys(entities),
  }
}
