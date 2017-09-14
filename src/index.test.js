// @flow
import tweetParser from './index'

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
    { type: 'TEXT', content: ' ' },
    {
      type: 'LINK',
      content: 'http://bbc.co.uk',
      url: 'http://bbc.co.uk',
    },
  ])
})

test('it can deal with text at the end', () => {
  const tweet = 'Eating breakfast with @bob lol'

  const result = tweetParser(tweet)

  expect(result).toEqual([
    { type: 'TEXT', content: 'Eating breakfast with ' },
    {
      type: 'USER',
      content: '@bob',
      url: 'https://www.twitter.com/bob',
    },
    { type: 'TEXT', content: ' lol' },
  ])
})

test('text followed by a space then a link is correctly merged', () => {
  const tweet = 'watch this http://bbc.com'
  const result = tweetParser(tweet)
  expect(result).toEqual([
    { type: 'TEXT', content: 'watch this ' },
    { type: 'LINK', content: 'http://bbc.com', url: 'http://bbc.com' },
  ])
})

test('a real life complicated tweet', () => {
  const tweet =
    'an honest case study on @songkick by @Jack_Franklin. Watch here- http://bit.ly/2gD80W1  #reactlondon'

  const result = tweetParser(tweet)

  expect(result).toEqual([
    { type: 'TEXT', content: 'an honest case study on ' },
    {
      type: 'USER',
      content: '@songkick',
      url: 'https://www.twitter.com/songkick',
    },
    { type: 'TEXT', content: ' by ' },
    {
      type: 'USER',
      content: '@Jack_Franklin',
      url: 'https://www.twitter.com/Jack_Franklin',
    },
    { type: 'TEXT', content: '. Watch here- ' },
    {
      type: 'LINK',
      content: 'http://bit.ly/2gD80W1',
      url: 'http://bit.ly/2gD80W1',
    },
    { type: 'TEXT', content: '  ' },
    {
      type: 'HASH',
      content: '#reactlondon',
      url: 'https://twitter.com/search?q=%23reactlondon',
    },
  ])
})
