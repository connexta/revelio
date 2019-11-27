import * as React from 'react'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import CoordinateList from './coordinate-list'
import Props from './geo-editor'

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
