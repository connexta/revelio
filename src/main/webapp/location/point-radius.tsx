import * as React from 'react'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'
import { Filter, DWITHIN, ANY_GEO, GEOMETRY } from './filter'
import { geoToWKT } from './geo-to-wkt'
import Box from '@material-ui/core/Box'
import Point from './point'
import Props from './geo-editor'
import Length from './length'

type DivProps = {
  children: React.ReactNode
}

const Column: React.SFC<DivProps> = (props: DivProps) => (
  <Box flex="flex" flexDirection="column" padding={1} {...props} />
)

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
    <Column>
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
    </Column>
  )
}

export default PointRadius
