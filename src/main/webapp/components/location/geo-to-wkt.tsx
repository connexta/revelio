import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'
import { LengthUnit } from 'geospatialdraw/bin/geometry/units'
import { geoJSONToGeometryJSON } from 'geospatialdraw/bin/geometry/utilities'
import WKT from 'ol/format/WKT'
import GeoJSON from 'ol/format/GeoJSON'

const wktFormatter = new WKT()
const geojsonFormatter = new GeoJSON()

export const geoToWKT = (geo: GeometryJSON): string =>
  wktFormatter.writeFeature(geojsonFormatter.readFeature(geo))

type WKTProps = {
  wkt: string
  id: string
  buffer: number
  bufferUnit: LengthUnit
  properties?: object
}

export const wktToGeo = ({
  wkt,
  id,
  buffer,
  bufferUnit,
  properties = {},
}: WKTProps): GeometryJSON => {
  const geo = wktFormatter.readGeometry(wkt)
  return geoJSONToGeometryJSON(id, {
    type: 'Feature',
    geometry: geojsonFormatter.writeGeometryObject(geo),
    properties: {
      ...properties,
      buffer: {
        width: buffer,
        unit: bufferUnit,
      },
    },
  })
}
