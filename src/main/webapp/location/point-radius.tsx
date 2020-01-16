import * as React from 'react'
import {
  geoToPointRadiusProps,
  pointRadiusPropsToGeo,
} from 'geospatialdraw/bin/coordinates/geometry/point-circle'
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
  } = geoToPointRadiusProps(value)
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <Point
        coordinateUnit={coordinateUnit}
        value={{ lat, lon }}
        onChange={({ lat, lon }) => {
          onChange(
            pointRadiusPropsToGeo({
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
            pointRadiusPropsToGeo({
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
