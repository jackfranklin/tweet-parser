// @flow
import type { Match } from './types'

// regexes taken and adapted from https://github.com/VincentLoy/tweetParser.js/blob/master/dev/tweetParser.js
const REGEX_URL = /(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,.])/g
const REGEX_USER = /\B@([a-zA-Z0-9_]+)/g
const REGEX_HASHTAG = /\B#([á-úÁ-Úä-üÄ-Üa-zA-Z0-9_]+)/g

type MakeMatcherFunctionArguments = {|
  regex: RegExp,
  parseMatch: (match: any) => Match,
|}

type MatcherFunction = (tweet: string) => Array<Match>

const makeMatcherFunction = ({
  regex,
  parseMatch,
}: MakeMatcherFunctionArguments): MatcherFunction => {
  const matcherFn = (tweet: string): Array<Match> => {
    let m
    const matches = []

    do {
      m = regex.exec(tweet)
      if (m) {
        matches.push(parseMatch(m))
      }
    } while (m)

    return matches
  }

  return matcherFn
}

export const matchHashTags = makeMatcherFunction({
  regex: REGEX_HASHTAG,
  parseMatch: m => ({
    fullMatch: m[0],
    group: m[1],
    index: m.index,
    type: 'HASH',
  }),
})

export const matchUrls = makeMatcherFunction({
  regex: REGEX_URL,
  parseMatch: m => ({
    fullMatch: m[0],
    // urls always are matched with a space at the beginning
    // so we strip that out
    group: m[0].substring(1),
    index: m.index,
    type: 'LINK',
  }),
})

export const matchUserNames = makeMatcherFunction({
  regex: REGEX_USER,
  parseMatch: m => ({
    fullMatch: m[0],
    group: m[1],
    index: m.index,
    type: 'USER',
  }),
})
