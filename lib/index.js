'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _matchers = require('./matchers');

var _createEntitiesFromMatch = require('./create-entities-from-match');

var _createEntitiesFromMatch2 = _interopRequireDefault(_createEntitiesFromMatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getMatchesFromIndex = function getMatchesFromIndex(matches) {
  var matchesByIndex = new Map();
  matches.forEach(function (match) {
    matchesByIndex.set(match.index, match);
  });
  return matchesByIndex;
};

var processTweetCharacter = function processTweetCharacter(tweet, char, state) {
  var match = state.matchesByIndex.get(char);
  if (match !== undefined) {
    var newFinalEntities = [].concat(_toConsumableArray(state.finalEntities), [state.textEntityInProgress.length > 0 ? {
      content: state.textEntityInProgress.join(''),
      type: 'TEXT'
    } : null], _toConsumableArray((0, _createEntitiesFromMatch2.default)(match))).filter(Boolean);

    var nextIndexToProcess = char + match.fullMatch.length;

    var nextState = {
      matchesByIndex: state.matchesByIndex,
      finalEntities: newFinalEntities,
      textEntityInProgress: []
    };

    if (nextIndexToProcess === tweet.length) {
      return nextState;
    } else {
      return processTweetCharacter(tweet, nextIndexToProcess, nextState);
    }
  } else {
    var newTextEntityInProgress = [].concat(_toConsumableArray(state.textEntityInProgress), [tweet[char]]);
    if (tweet.length - 1 === char) {
      return {
        matchesByIndex: state.matchesByIndex,
        finalEntities: [].concat(_toConsumableArray(state.finalEntities), [{
          type: 'TEXT',
          content: newTextEntityInProgress.join('')
        }]),
        textEntityInProgress: []
      };
    } else {
      var newState = {
        finalEntities: state.finalEntities,
        matchesByIndex: state.matchesByIndex,
        textEntityInProgress: newTextEntityInProgress
      };
      return processTweetCharacter(tweet, char + 1, newState);
    }
  }
};

var tweetParser = function tweetParser(tweet) {
  var matches = [].concat(_toConsumableArray((0, _matchers.matchUserNames)(tweet)), _toConsumableArray((0, _matchers.matchHashTags)(tweet)), _toConsumableArray((0, _matchers.matchUrls)(tweet)));

  var matchesByIndex = getMatchesFromIndex(matches);

  var result = processTweetCharacter(tweet.split(''), 0, {
    matchesByIndex: matchesByIndex,
    finalEntities: [],
    textEntityInProgress: []
  });

  return result.finalEntities;
};

exports.default = tweetParser;