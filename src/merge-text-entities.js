// @flow

import type { Entity, TextEntity } from './types'

const mergeEntities = (
  entity1: TextEntity,
  entity2: TextEntity
): TextEntity => ({
  type: 'TEXT',
  content: [entity1.content, entity2.content].join(''),
})

const checkEntity = (
  entities: Array<Entity>,
  index: number,
  finalEntities?: Array<Entity> = []
): Array<Entity> => {
  const entity = entities[index]
  if (entity === undefined) return finalEntities

  const nextEntity = entities[index + 1]
  if (nextEntity === undefined) return [...finalEntities, entity]

  if (entity.type === 'TEXT' && nextEntity.type === 'TEXT') {
    const newEntity = mergeEntities(entity, nextEntity)
    return checkEntity(entities, index + 2, [...finalEntities, newEntity])
  } else {
    return checkEntity(entities, index + 1, [...finalEntities, entity])
  }
}

const mergeTextEntities = (entities: Array<Entity>): Array<Entity> =>
  checkEntity(entities, 0)

export default mergeTextEntities
