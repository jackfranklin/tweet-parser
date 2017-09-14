# tweet-parser

A JS module for parsing tweets into an array of entities.

Huge thanks go to Vincent Loy and his [TweetParser.js](https://github.com/VincentLoy/tweetParser.js) project, for which the regexes this package uses were originally taken from. Vincent's project is great but works on tweets in the DOM, and I needed something that could take the raw text.

For example, given a [tweet with this content](https://twitter.com/ReactLondon_/status/907536766558720001):

```
Migrating from Angular to React- an honest case study on @songkick by @Jack_Franklin. Watch here- http://bit.ly/2gD80W1  #reactlondon
```

We get an array of entities:

```js
[
  { type: 'TEXT', content: 'Migrating from Angular to React- an honest case study on ' },
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
]
```

## Why?

A side project I was working on had to render tweets from an API and I wanted a nice way of being able to style different parts of the tweet based on if they were a link, hashtag, user reference or just plain text.

## Installation and Usage

```
$ npm install tweet-parser

$ yarn add tweet-parser
```

```js
import tweetParser from 'tweet-parser'

const result = tweetParser('My fun tweet');

console.log(result)
// [ { type: 'TEXT', content: 'My fun tweet' } ]
```
