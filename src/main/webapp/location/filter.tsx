import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'
import { geoToWKT } from './geo-to-wkt'

const METERS_KILOMETERS = 1000
const METERS_FEET = 0.3048
const METERS_YARDS = 0.9144
const METERS_MILES = 1609.344
const METERS_NAUTICAL_MILES = 1852

const getDistanceInMeters = (distance: number, units: string): number => {
  switch (units) {
    case 'kilometers':
      return distance * METERS_KILOMETERS
    case 'feet':
      return distance * METERS_FEET
    case 'yards':
      return distance * METERS_YARDS
    case 'miles':
      return distance * METERS_MILES
    case 'nautical miles':
      return distance * METERS_NAUTICAL_MILES
    case 'meters':
    default:
      return distance
  }
}

type FilterType = 'DWITHIN' | 'INTERSECTS'
const DWITHIN: FilterType = 'DWITHIN'
const INTERSECTS: FilterType = 'INTERSECTS'

type Property = 'anyGeo'
const ANY_GEO: Property = 'anyGeo'

export type Filter = {
  type: FilterType
  property: string
  value: string
  geojson: GeometryJSON
  distance?: number
}

export const geoToFilter = (
  geo: GeometryJSON,
  property: string = ANY_GEO
): Filter => ({
  type:
    geo.properties.buffer && geo.properties.buffer.width > 0
      ? DWITHIN
      : INTERSECTS,
  property,
  value: geoToWKT(geo),

  geojson: geo,
  distance:
    (geo.properties.buffer &&
      getDistanceInMeters(
        geo.properties.buffer.width,
        geo.properties.buffer.unit
      )) ||
    0,
})
