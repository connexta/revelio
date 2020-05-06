export type Schema = {
  toGraphqlName: (s: string) => string
  fromGraphqlName: (s: string) => string
  typeDefs: string
}
export type DDFType =
  | 'STRING'
  | 'DOUBLE'
  | 'INTEGER'
  | 'LONG'
  | 'BOOLEAN'
  | 'BINARY'
  | 'GEOMETRY'
  | 'XML'
  | 'DATE'
  | 'JSON'

export type Attribute = {
  id: string
  multivalued: boolean
  type: DDFType | 'MetacardAttributes'
}
export type Query = {
  sortPolicy?: object
  filterTree?: object
  cql?: string
  count?: number
  facets?: string[]
}

export type CatalogQuery = {
  cql: any
} & Query
