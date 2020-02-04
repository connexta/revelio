import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'

export type QueryType = QuerySettingsType & {
  title?: string
  filterTree?: FilterGroupType
  id?: string
  metacard_modified?: string
  metacard_owner?: string
}

export type QueryFilter = {
  property: string //property name, ex: anyText
  type: string // cql operator, ex: ILIKE
  value: any
  geojson?: GeometryJSON
  distance?: number //buffer for location filter
}

export type FilterGroupType = {
  type: string
  filters: Array<FilterGroupType | QueryFilter>
}

export type AttributeDefinition = {
  id: string
  enums: string[]
  type:
    | 'STRING'
    | 'XML'
    | 'DATE'
    | 'LOCATION'
    | 'GEOMETRY'
    | 'BOOLEAN'
    | 'INTEGER'
    | 'SHORT'
    | 'LONG'
    | 'FLOAT'
    | 'DOUBLE'
}
export type QuerySettingsType = {
  sources?: string[] | null
  sorts?: string[] | null
  detail_level?: string | null //Result Form title
}
