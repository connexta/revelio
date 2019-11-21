import { geometry, shapes } from 'geospatialdraw'
import WKT from 'ol/format/WKT'
import Geojson from 'ol/format/geojson'

const wktFormatter = new WKT()
const geojsonFormatter = new Geojson()
const shapeDetector = new shapes.ShapeDetector()

export const geoToWKT = (geo: geometry.GeometryJSON): string =>
  wktFormatter.writeFeature(geojsonFormatter.readFeature(geo))

type WKTProps = {
  wkt: string
  id: string
  buffer: number
  bufferUnit: geometry.LengthUnit
  properties?: object
}

export const wktToGeo = ({
  wkt,
  id,
  buffer,
  bufferUnit,
  properties = {},
}: WKTProps): geometry.GeometryJSON => {
  const feature = wktFormatter.readFeature(wkt)
  return geometry.makeGeometry(
    id,
    geojsonFormatter.writeFeatureObject(feature),
    (properties as any).color || '',
    shapeDetector.shapeFromFeature(feature),
    buffer,
    bufferUnit,
    properties
  )
}
