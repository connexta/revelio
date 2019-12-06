import { geometry } from 'geospatialdraw'
import WKT from 'ol/format/WKT'
import GeoJSON from 'ol/format/GeoJSON'

const wktFormatter = new WKT()
const geojsonFormatter = new GeoJSON()

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
  const geo = wktFormatter.readGeometry(wkt)
  return geometry.geoJSONToGeometryJSON(id, {
    type: 'Feature',
    geometry: geojsonFormatter.writeGeometryObject(geo),
    properties: {
      ...properties,
      buffer,
      bufferUnit,
    },
  })
}
