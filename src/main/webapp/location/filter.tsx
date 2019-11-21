import { geometry } from 'geospatialdraw'

export type FilterType = 'DWITHIN' | 'INTERSECTS'
export const DWITHIN: FilterType = 'DWITHIN'
export const INTERSECTS: FilterType = 'INTERSECTS'

export type Property = 'anyGeo'
export const ANY_GEO: Property = 'anyGeo'

export type ValueType = 'GEOMETRY'
export const GEOMETRY: ValueType = 'GEOMETRY'

export type Filter = {
  type: FilterType
  property: Property
  value: {
    type: ValueType
    value: string
  }
  geojson: geometry.GeometryJSON
}
