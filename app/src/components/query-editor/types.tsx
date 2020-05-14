import { QueryType, AttributeDefinition } from '../query-builder/types'
export type SearchInteraction = {
  id: string
  onSelect: () => void
  interaction: React.FunctionComponent<{}>
}
export type EditorProps = {
  attributeDefinitions?: AttributeDefinition[]
  searchInteractions?: SearchInteraction[]
  query?: QueryType
  onSearch: () => void
  queryBuilder: React.FunctionComponent<{
    query?: QueryType
    onChange: (query: QueryType) => void
    addOptionsRef?: HTMLDivElement
  }>
  onChange: (query: QueryType) => void
}
