// @flow
import tweetParser from './index'

test('when given a tweet that is just text it returns it', () => {
  const tweet = 'Today for breakfast I am having eggs'

  const result = tweetParser(tweet)

  expect(result).toEqual([{ type: 'text', content: tweet }])
})

test('it can parse out a username', () => {
  const tweet = 'Eating breakfast with @bob and @jack'

  const result = tweetParser(tweet)

  expect(result).toEqual([
    { type: 'text', content: 'Eating breakfast with ' },
    {
      type: 'user',
      content: '@bob',
      userUrl: 'https://www.twitter.com/bob',
    },
    { type: 'text', content: ' and ' },
    {
      type: 'user',
      content: '@jack',
      userUrl: 'https://www.twitter.com/jack',
    },
  ])
})
