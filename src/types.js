// @flow

export type TextEntity = {|
  type: 'TEXT',
  content: string,
|}

export type LinkEntity = {|
  type: 'LINK',
  content: string,
  url: string,
|}

export type HashEntity = {|
  type: 'HASH',
  content: string,
  url: string,
|}

export type UserEntity = {|
  type: 'USER',
  content: string,
  url: string,
|}

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

export type Entity = TextEntity | LinkEntity | HashEntity | UserEntity
