import { makeEmptyGeometry } from 'geospatialdraw/bin/geometry/utilities'
import { LINE } from 'geospatialdraw/bin/shapes/shape'

export const makeSearchGeoId = (): string => `search-geo-${Math.random()}`
export const makeDefaultSearchGeo = () =>
  makeEmptyGeometry(makeSearchGeoId(), LINE)
