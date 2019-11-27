import * as React from 'react'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import CoordinateList from './coordinate-list'
import Props from './geo-editor'

const Line: React.SFC<Props> = ({ value, onChange, coordinateUnit }) => {
  const {
    id,
    properties,
    coordinates,
    buffer,
    bufferUnit,
  } = coordinateEditor.geoToLineProps(value)
  return (
    <CoordinateList
      coordinateList={coordinates}
      coordinateUnit={coordinateUnit}
      buffer={buffer}
      bufferUnit={bufferUnit}
      onChange={(coordinateListValue, bufferValue, bufferUnitValue) =>
        onChange(
          coordinateEditor.linePropsToGeo({
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
