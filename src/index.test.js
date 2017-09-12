// @flow
import tweetParser from './index'
import type { Entity } from './types'

test('when given a tweet that is just text it returns it', () => {
  const tweet = 'Today for breakfast I am having eggs'

  const result = tweetParser(tweet)

  expect(result).toEqual([{ type: 'TEXT', content: tweet }])
})

test('it can parse out a username', () => {
  const tweet = 'Eating breakfast with @bob and @jack'

  const result = tweetParser(tweet)

  expect(result).toEqual([
    { type: 'TEXT', content: 'Eating breakfast with ' },
    {
      type: 'USER',
      content: '@bob',
      url: 'https://www.twitter.com/bob',
    },
    { type: 'TEXT', content: ' and ' },
    {
      type: 'USER',
      content: '@jack',
      url: 'https://www.twitter.com/jack',
    },
  ])
})

test('it can parse out a username and a hashtag', () => {
  const tweet = 'Eating breakfast with @bob #eggs'

  const result = tweetParser(tweet)

  expect(result).toEqual([
    { type: 'TEXT', content: 'Eating breakfast with ' },
    {
      type: 'USER',
      content: '@bob',
      url: 'https://www.twitter.com/bob',
    },
    { type: 'TEXT', content: ' ' },
    {
      type: 'HASH',
      content: '#eggs',
      url: 'https://twitter.com/search?q=%23eggs',
    },
  ])
})

test('it can parse out a hashtag and a URL', () => {
  const tweet = 'Eating breakfast #eggs http://bbc.co.uk'

  const result = tweetParser(tweet)

  expect(result).toEqual([
    { type: 'TEXT', content: 'Eating breakfast ' },
    {
      type: 'HASH',
      content: '#eggs',
      url: 'https://twitter.com/search?q=%23eggs',
    },
    {
      type: 'LINK',
      content: ' http://bbc.co.uk',
      url: 'http://bbc.co.uk',
    },
  ])
})
