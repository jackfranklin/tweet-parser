'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


// regexes taken and adapted from
// https://github.com/VincentLoy/tweetParser.js/blob/master/dev/tweetParser.js
var REGEX_URL = /(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,.])/g;

var REGEX_USER = /\B@([a-zA-Z0-9_]+)/g;
var REGEX_HASHTAG = /\B#([á-úÁ-Úä-üÄ-Üa-zA-Z0-9_]+)/g;

var makeMatcherFunction = function makeMatcherFunction(_ref) {
  var regex = _ref.regex,
      parseMatch = _ref.parseMatch;

  var matcherFn = function matcherFn(tweet) {
    var m = void 0;
    var matches = [];

    do {
      m = regex.exec(tweet);
      if (m) {
        matches.push(parseMatch(m));
      }
    } while (m);

    return matches;
  };

  return matcherFn;
};

var matchHashTags = exports.matchHashTags = makeMatcherFunction({
  regex: REGEX_HASHTAG,
  parseMatch: function parseMatch(m) {
    return {
      fullMatch: m[0],
      group: m[1],
      index: m.index,
      type: 'HASH'
    };
  }
});

var matchUrls = exports.matchUrls = makeMatcherFunction({
  regex: REGEX_URL,
  parseMatch: function parseMatch(m) {
    return {
      fullMatch: m[0],
      // urls always are matched with a space at the beginning
      // so we strip that out
      group: m[0].substring(1),
      index: m.index,
      type: 'LINK'
    };
  }
});

var matchUserNames = exports.matchUserNames = makeMatcherFunction({
  regex: REGEX_USER,
  parseMatch: function parseMatch(m) {
    return {
      fullMatch: m[0],
      group: m[1],
      index: m.index,
      type: 'USER'
    };
  }
});