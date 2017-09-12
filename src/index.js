// @flow
import { matchUserNames, matchHashTags } from './matchers'
import type { Match } from './matchers'
import type { Entity, UserEntity } from './types'

const createEntityFromMatch = (match: Match): Entity => {
  if (match.type === 'USER') {
    return {
      type: 'USER',
      content: match.fullMatch,
      url: `https://www.twitter.com/${match.group}`,
    }
  } else if (match.type === 'HASH') {
    return {
      type: 'HASH',
      content: match.fullMatch,
      url: `https://twitter.com/search?q=%23${match.group}`,
    }
  }

  return 'foo'
}

const tweetParser = (tweet: string): Array<Entity> => {
  const matches = [...matchUserNames(tweet), ...matchHashTags(tweet)]

  const matchesByIndex: Map<number, Match> = new Map()
  matches.forEach(match => {
    matchesByIndex.set(match.index, match)
  })

  let finalEntities: Array<Entity> = []

  let textEntityInProgress = []
  const indexesToSkip = []
  tweet.split('').forEach((char, index) => {
    if (indexesToSkip.indexOf(index) > -1) {
      return
    }
    const match = matchesByIndex.get(index)
    if (match !== undefined) {
      finalEntities = [
        ...finalEntities,
        {
          content: textEntityInProgress.join(''),
          type: 'TEXT',
        },
        createEntityFromMatch(match),
      ]

      textEntityInProgress = []
      let i = index
      for (i; i < index + match.fullMatch.length; i += 1) {
        indexesToSkip.push(i)
      }
    } else {
      textEntityInProgress.push(char)
    }
  })

  if (textEntityInProgress.length > 0) {
    finalEntities = [
      ...finalEntities,
      {
        content: textEntityInProgress.join(''),
        type: 'TEXT',
      },
    ]
  }

  return finalEntities
}

export default tweetParser
