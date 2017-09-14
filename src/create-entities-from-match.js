// @flow

import type { Match, Entity } from './types'

const createEntitiesFromMatch = (match: Match): Array<Entity> => {
  switch (match.type) {
    case 'USER': {
      return [
        {
          type: 'USER',
          content: match.fullMatch,
          url: `https://www.twitter.com/${match.group}`,
        },
      ]
    }
    case 'HASH': {
      return [
        {
          type: 'HASH',
          content: match.fullMatch,
          url: `https://twitter.com/search?q=%23${match.group}`,
        },
      ]
    }
    case 'LINK': {
      return [
        // links consume the space before the URL, so they can be matched
        // but we avoid exposing that by inserting the space as a text entity
        { type: 'TEXT', content: ' ' },
        {
          type: 'LINK',
          content: match.group,
          url: match.group,
        },
      ]
    }

    default: {
      ;(match: empty) // eslint-disable-line no-unused-expressions
      // this will never get hit as all cases are satisifed, but Flow
      // needs this match: empty part
      throw new Error(`Got an invalid match!`)
    }
  }
}

export default createEntitiesFromMatch
