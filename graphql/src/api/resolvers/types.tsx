import { BaseContext } from '../context/types'

// Parent can be anything you pass to it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Parent = any

// TODO: Concat all of the resolver arg types to args and export that?
export type Args = any

export type Context = {
  toGraphqlName: (s: string) => string
  fromGraphqlName: (s: string) => string
} & BaseContext
