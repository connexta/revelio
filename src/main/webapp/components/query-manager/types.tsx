import React from 'react'
import { QueryType } from '../query-builder/types'
import { EditorProps } from '../query-editor'

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type QueryCardProps = {
  QueryEditor: React.FunctionComponent<EditorProps>
  query?: QueryType
  onSearch: (query: QueryType) => void
  onChange: (query: QueryType) => void
}
export type QuerySelectorProps = QueryCardProps & {
  queries: QueryType[]
  currentQuery: string
}
export type QueryEditorPopoverProps = QueryCardProps & {
  anchorEl: HTMLDivElement
  onClose: () => void
}

export type QueryManagerProps = Overwrite<
  QuerySelectorProps,
  { onChange: (queries: QueryType[]) => void }
>

export type AddQueryProps = {
  QueryEditor: React.FunctionComponent<EditorProps>
  onSearch: (query: QueryType) => void
  hasQueries: boolean
}
