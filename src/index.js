// @flow
import { matchUserNames, matchHashTags, matchUrls } from './matchers'
import type { Match } from './matchers'
import type { Entity } from './types'

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
      // does not seem to agree :(
      throw new Error(`Got an invalid match!`)
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
        ...createEntitiesFromMatch(match),
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
