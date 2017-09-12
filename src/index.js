// @flow
import { matchUserNames, matchHashTags, matchUrls } from './matchers'
import type { Match } from './matchers'
import type { Entity } from './types'

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
  } else if (match.type === 'LINK') {
    return {
      type: 'LINK',
      content: match.fullMatch,
      url: match.group,
    }
  }
}

const tweetParser = (tweet: string): Array<Entity> => {
  const matches = [
    ...matchUserNames(tweet),
    ...matchHashTags(tweet),
    ...matchUrls(tweet),
  ]

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
        textEntityInProgress.length > 0
          ? {
              content: textEntityInProgress.join(''),
              type: 'TEXT',
            }
          : null,
        createEntityFromMatch(match),
      ].filter(Boolean)

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
