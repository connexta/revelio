import * as React from 'react'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'
import { Filter, DWITHIN, ANY_GEO, GEOMETRY } from './filter'
import { geoToWKT } from './geo-to-wkt'
import Point from './point'
import Props from './geo-editor'
import Length from './length'
import SpacedLinearContainer from '../spaced-linear-container'

export const generateFilter = (geo: geometry.GeometryJSON): Filter => ({
  type: DWITHIN,
  property: ANY_GEO,
  value: {
    type: GEOMETRY,
    value: geoToWKT(geo),
  },
  geojson: geo,
})

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
