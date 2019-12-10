import * as React from 'react'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import Point from './point'
import Props from './geo-editor'
import Length from './length'
import SpacedLinearContainer from '../spaced-linear-container'

const PointRadius: React.SFC<Props> = ({
  value,
  onChange,
  coordinateUnit,
}: Props) => {
  const {
    id,
    lat,
    lon,
    radius,
    radiusUnit,
    properties,
  } = coordinateEditor.geoToPointRadiusProps(value)
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Point
        coordinateUnit={coordinateUnit}
        value={{ lat, lon }}
        onChange={({ lat, lon }) => {
          onChange(
            coordinateEditor.pointRadiusPropsToGeo({
              id,
              lat,
              lon,
              radius,
              radiusUnit,
              properties,
            })
          )
        }}
      />
      <Length
        label="Radius"
        value={{ length: radius, unit: radiusUnit }}
        onChange={({ length, unit }) =>
          onChange(
            coordinateEditor.pointRadiusPropsToGeo({
              id,
              lat,
              lon,
              radius: length,
              radiusUnit: unit,
              properties,
            })
          )
        }
      />
    </SpacedLinearContainer>
  )
}

export default PointRadius
