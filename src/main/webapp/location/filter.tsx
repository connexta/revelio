import { geometry } from 'geospatialdraw'
import { geoToWKT } from './geo-to-wkt'

type FilterType = 'DWITHIN' | 'INTERSECTS'
const DWITHIN: FilterType = 'DWITHIN'
const INTERSECTS: FilterType = 'INTERSECTS'

type Property = 'anyGeo'
const ANY_GEO: Property = 'anyGeo'

type ValueType = 'GEOMETRY'
const GEOMETRY: ValueType = 'GEOMETRY'

export type Filter = {
  type: FilterType
  property: Property
  value: {
    type: ValueType
    value: string
  }
  geojson: geometry.GeometryJSON
}

export const geoToFilter = (geo: geometry.GeometryJSON): Filter => ({
  type:
    geo.properties.buffer && geo.properties.buffer.width > 0
      ? DWITHIN
      : INTERSECTS,
  property: ANY_GEO,
  value: {
    type: GEOMETRY,
    value: geoToWKT(geo),
  },
  geojson: geo,
})
