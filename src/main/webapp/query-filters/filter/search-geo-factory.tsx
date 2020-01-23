import { makeEmptyGeometry } from 'geospatialdraw/bin/geometry/utilities'
import { LINE } from 'geospatialdraw/bin/shapes/shape'

const idCache: Map<string, string> = new Map()

const makeSearchGeoId = (): string => `search-geo-${Math.random()}`
export const makeSearchGeoIdForFilter = (filterValue: string): string => {
  if (!idCache.has(filterValue)) {
    idCache.set(filterValue, makeSearchGeoId())
  }
  return idCache.get(filterValue) || ''
}
export const makeDefaultSearchGeo = () =>
  makeEmptyGeometry(makeSearchGeoId(), LINE)
