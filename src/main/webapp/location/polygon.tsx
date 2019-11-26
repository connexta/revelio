import * as React from 'react'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'
import { Filter, DWITHIN, INTERSECTS, ANY_GEO, GEOMETRY } from './filter'
import { geoToWKT } from './geo-to-wkt'
import CoordinateList from './coordinate-list'
import Props from './geo-editor'

export const generateFilter = (geo: geometry.GeometryJSON): Filter => ({
  type: (geo.properties.buffer || 0) > 0 ? DWITHIN : INTERSECTS,
  property: ANY_GEO,
  value: {
    type: GEOMETRY,
    value: geoToWKT(geo),
  },
  geojson: geo,
})

const Polygon: React.SFC<Props> = ({ value, onChange, coordinateUnit }) => {
  const {
    id,
    properties,
    coordinates,
    buffer,
    bufferUnit,
  } = coordinateEditor.geoToPolygonProps(value)
  return (
    <CoordinateList
      coordinateList={coordinates}
      coordinateUnit={coordinateUnit}
      buffer={buffer}
      bufferUnit={bufferUnit}
      onChange={(coordinateListValue, bufferValue, bufferUnitValue) =>
        onChange(
          coordinateEditor.polygonPropsToGeo({
            id,
            coordinates: coordinateListValue,
            buffer: bufferValue,
            bufferUnit: bufferUnitValue,
            properties,
          })
        )
      }
    />
  )
}

export default Polygon
