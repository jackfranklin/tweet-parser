// @flow
import { matchHashTags, matchUrls, matchUserNames } from './matchers'

test('it can match a hashtag', () => {
  const input = 'foo bar #baz'
  expect(matchHashTags(input)).toEqual([
    { fullMatch: '#baz', group: 'baz', index: 8, type: 'HASH' },
  ])
})

test('it can match a username', () => {
  const input = 'foo bar @baz'
  expect(matchUserNames(input)).toEqual([
    { fullMatch: '@baz', group: 'baz', index: 8, type: 'USER' },
  ])
})

test('it can match urls', () => {
  const input = 'foo bar http://javascriptplayground.com'
  expect(matchUrls(input)).toEqual([
    {
      fullMatch: ' http://javascriptplayground.com',
      group: 'http://javascriptplayground.com',
      index: 7,
      type: 'LINK',
    },
  ])
})
