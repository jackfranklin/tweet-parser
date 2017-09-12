// @flow
type TextEntity = {|
  type: 'TEXT',
  content: string,
|}

type LinkEntity = {|
  type: 'LINK',
  content: string,
  url: string,
|}

type HashEntity = {|
  type: 'HASH',
  content: string,
  url: string,
|}

type UserEntity = {|
  type: 'USER',
  content: string,
  url: string,
|}

export type Entity = TextEntity | LinkEntity | HashEntity | UserEntity
