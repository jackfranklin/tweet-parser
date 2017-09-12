// @flow
// regexes taken and adapted from https://github.com/VincentLoy/tweetParser.js/blob/master/dev/tweetParser.js

const REGEX_URL = /(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,\.])/g
const REGEX_USER = /\B@([a-zA-Z0-9_]+)/g
const REGEX_HASHTAG = /\B(#[á-úÁ-Úä-üÄ-Üa-zA-Z0-9_]+)/g

export type Match = {|
  fullMatch: string,
  group: string,
  index: number,
  // TODO: type this based on the constants in the index.js types
  type: string,
|}

export const matchHashTags = () => {}

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
        type: 'user',
      })
    }
  } while (m)

  return matches
}
