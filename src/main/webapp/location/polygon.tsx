import * as React from 'react'
import {
  geoToPolygonProps,
  polygonPropsToGeo,
} from 'geospatialdraw/bin/coordinates/geometry/polygon-line'
import CoordinateList from './coordinate-list'
import Props from './geo-editor'

const Polygon: React.SFC<Props> = ({ value, onChange, coordinateUnit }) => {
  const { id, properties, coordinates, buffer, bufferUnit } = geoToPolygonProps(
    value
  )
  return (
    <CoordinateList
      coordinateList={coordinates}
      coordinateUnit={coordinateUnit}
      buffer={buffer}
      bufferUnit={bufferUnit}
      onChange={(coordinateListValue, bufferValue, bufferUnitValue) =>
        onChange(
          polygonPropsToGeo({
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
