// @flow
import { matchUserNames, matchHashTags, matchUrls } from './matchers'
import type { Entity, Match } from './types'
import createEntitiesFromMatch from './create-entities-from-match'
import mergeTextEntities from './merge-text-entities'

const getMatchesFromIndex = (matches: Array<Match>): Map<number, Match> => {
  const matchesByIndex: Map<number, Match> = new Map()
  matches.forEach(match => {
    matchesByIndex.set(match.index, match)
  })
  return matchesByIndex
}

type ProcessTweetState = {|
  finalEntities: Array<Entity>,
  textEntityInProgress: Array<string>,
  matchesByIndex: Map<number, Match>,
|}

const processTweetCharacter = (
  tweet: Array<string>,
  char: number,
  state: ProcessTweetState
): ProcessTweetState => {
  const match = state.matchesByIndex.get(char)
  if (match !== undefined) {
    const newFinalEntities = [
      ...state.finalEntities,
      state.textEntityInProgress.length > 0
        ? {
            content: state.textEntityInProgress.join(''),
            type: 'TEXT',
          }
        : null,
      ...createEntitiesFromMatch(match),
    ].filter(Boolean)

    const nextIndexToProcess = char + match.fullMatch.length

    const nextState: ProcessTweetState = {
      matchesByIndex: state.matchesByIndex,
      finalEntities: newFinalEntities,
      textEntityInProgress: [],
    }

    if (nextIndexToProcess === tweet.length) {
      return nextState
    } else {
      return processTweetCharacter(tweet, nextIndexToProcess, nextState)
    }
  } else {
    const newTextEntityInProgress = [...state.textEntityInProgress, tweet[char]]
    if (tweet.length - 1 === char) {
      return {
        matchesByIndex: state.matchesByIndex,
        finalEntities: [
          ...state.finalEntities,
          {
            type: 'TEXT',
            content: newTextEntityInProgress.join(''),
          },
        ],
        textEntityInProgress: [],
      }
    } else {
      const newState = {
        finalEntities: state.finalEntities,
        matchesByIndex: state.matchesByIndex,
        textEntityInProgress: newTextEntityInProgress,
      }
      return processTweetCharacter(tweet, char + 1, newState)
    }
  }
}

const tweetParser = (tweet: string): Array<Entity> => {
  const matches = [
    ...matchUserNames(tweet),
    ...matchHashTags(tweet),
    ...matchUrls(tweet),
  ]

  const matchesByIndex = getMatchesFromIndex(matches)

  const result = processTweetCharacter(tweet.split(''), 0, {
    matchesByIndex,
    finalEntities: [],
    textEntityInProgress: [],
  })

  return mergeTextEntities(result.finalEntities)
}

export default tweetParser
