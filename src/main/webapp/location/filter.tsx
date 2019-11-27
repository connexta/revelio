import { geometry } from 'geospatialdraw'
import { geoToWKT } from './geo-to-wkt'

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

export const geoToFilter = (geo:geometry.GeometryJSON): Filter => ({
  type: (geo.properties.buffer || 0) > 0 ? DWITHIN : INTERSECTS,
  property: ANY_GEO,
  value: {
    type: GEOMETRY,
    value: geoToWKT(geo),
  },
  geojson: geo,
})
