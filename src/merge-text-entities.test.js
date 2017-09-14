// @flow
import mergeTextEntities from './merge-text-entities'

test('two duplicated text notes get merged into one', () => {
  const input = [
    { type: 'TEXT', content: 'foo ' },
    { type: 'TEXT', content: 'bar' },
  ]

  const result = mergeTextEntities(input)
  expect(result).toEqual([{ type: 'TEXT', content: 'foo bar' }])
})

test('it ignores non text entities', () => {
  const input = [
    { type: 'LINK', content: 'foo', url: 'foo' },
    { type: 'TEXT', content: 'foo ' },
    { type: 'TEXT', content: 'bar' },
  ]

  const result = mergeTextEntities(input)
  expect(result).toEqual([
    { type: 'LINK', content: 'foo', url: 'foo' },
    { type: 'TEXT', content: 'foo bar' },
  ])
})

test('it does not merge text entities split by something', () => {
  const input = [
    { type: 'TEXT', content: 'foo ' },
    { type: 'LINK', content: 'foo', url: 'foo' },
    { type: 'TEXT', content: 'bar' },
  ]

  const result = mergeTextEntities(input)
  expect(result).toEqual(input)
})
