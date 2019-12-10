import { geometry, shapes } from 'geospatialdraw'

export const makeSearchGeoId = (): string => `search-geo-${Math.random()}`
export const makeDefaultSearchGeo = () =>
  geometry.makeEmptyGeometry(makeSearchGeoId(), shapes.LINE)
