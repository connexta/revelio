import * as React from 'react'
import {
  geoToLineProps,
  linePropsToGeo,
} from 'geospatialdraw/bin/coordinates/geometry/polygon-line'
import CoordinateList from './coordinate-list'
import Props from './geo-editor'

const Line: React.SFC<Props> = ({ value, onChange, coordinateUnit }) => {
  const { id, properties, coordinates, buffer, bufferUnit } = geoToLineProps(
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
          linePropsToGeo({
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

export default Line
