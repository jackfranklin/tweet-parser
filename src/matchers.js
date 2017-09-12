// @flow
// regexes taken and adapted from https://github.com/VincentLoy/tweetParser.js/blob/master/dev/tweetParser.js

const REGEX_URL = /(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,.])/g
const REGEX_USER = /\B@([a-zA-Z0-9_]+)/g
const REGEX_HASHTAG = /\B#([á-úÁ-Úä-üÄ-Üa-zA-Z0-9_]+)/g

type BaseMatch = {
  fullMatch: string,
  group: string,
  index: number,
}

type HashMatch = BaseMatch & {
  type: 'HASH',
}
type LinkMatch = BaseMatch & {
  type: 'LINK',
}
type UserMatch = BaseMatch & {
  type: 'USER',
}
export type Match = HashMatch | LinkMatch | UserMatch

export const matchHashTags = (tweet: string): Array<Match> => {
  let m
  const matches = []

  do {
    m = REGEX_HASHTAG.exec(tweet)
    if (m) {
      matches.push({
        fullMatch: m[0],
        group: m[1],
        index: m.index,
        type: 'HASH',
      })
    }
  } while (m)

  return matches
}

export const matchUrls = (tweet: string): Array<Match> => {
  let m
  const matches = []

  do {
    m = REGEX_URL.exec(tweet)
    if (m) {
      matches.push({
        fullMatch: m[0],
        // urls always are matched with a space at the beginning
        // so we strip that out
        group: m[0].substring(1),
        index: m.index,
        type: 'LINK',
      })
    }
  } while (m)

  return matches
}

export const matchUserNames = (tweet: string): Array<Match> => {
  let m
  const matches = []

  do {
    m = REGEX_USER.exec(tweet)
    if (m) {
      matches.push({
        fullMatch: m[0],
        group: m[1],
        index: m.index,
        type: 'USER',
      })
    }
  } while (m)

  return matches
}
