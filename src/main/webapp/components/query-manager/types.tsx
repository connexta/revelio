import React from 'react'
import { QueryType } from '../query-builder/types'
import { EditorProps } from '../query-editor'

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type QueryCardProps = {
  QueryEditor: React.FunctionComponent<EditorProps>
  query?: QueryType
  onSearch: () => void
  onChange: (query: QueryType) => void
  resultsToExport?: string[]
}
export type QuerySelectorProps = Overwrite<
  QueryCardProps,
  { onSearch: (id: string) => void }
> & {
  queries: QueryType[]
  currentQuery: string
}

export type AddQueryProps = QuerySelectorProps & {
  onCreate: (query: QueryType) => void
}

export type QueryEditorPopoverProps = QueryCardProps & {
  anchorEl: HTMLDivElement
  onClose: () => void
}

export type QueryManagerProps = Overwrite<
  QuerySelectorProps,
  { onChange: (queries: QueryType[]) => void }
> & {
  onCreate: (query: QueryType) => void
  onSave: (id: string) => void
}
