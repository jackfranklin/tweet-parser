// @flow
import { matchUserNames } from './matchers'
import type { Match } from './matchers'

type TextEntity = {|
  type: 'text',
  content: string,
|}

type LinkEntity = {|
  type: 'link',
  content: string,
  url: string,
|}

type HashEntity = {|
  type: 'hash',
  content: string,
  searchUrl: string,
|}

type UserEntity = {|
  type: 'user',
  content: string,
  userUrl: string,
|}

type Entity = TextEntity | LinkEntity | HashEntity | UserEntity

const createEntityFromMatch = (match: Match): Entity => {
  if (match.type === 'user') {
    return {
      type: 'user',
      content: match.fullMatch,
      userUrl: `https://www.twitter.com/${match.group}`,
    }
  }
  return 'foo'
}

const tweetParser = (tweet: string): Array<Entity> => {
  const userNames = matchUserNames(tweet)
  const matches = [...userNames]

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
    if (matchesByIndex.has(index)) {
      const match = matchesByIndex.get(index)
      finalEntities = [
        ...finalEntities,
        {
          content: textEntityInProgress.join(''),
          type: 'text',
        },
        createEntityFromMatch(match),
      ]

      textEntityInProgress = []
      let i = index
      for (i; i < index + match.fullMatch.length; i++) {
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
        type: 'text',
      },
    ]
  }

  return finalEntities
}

export default tweetParser
