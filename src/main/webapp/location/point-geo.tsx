import * as React from 'react'
import Point from './point'
import Props from './geo-editor'
import { coordinates as coordinateEditor } from 'geospatialdraw'


const PointGeo: React.SFC<Props> = ({ geo, onChange, coordinateUnit }: Props) => {
  const {
    id,
    lat,
    lon,
    properties
  } = coordinateEditor.geoToPointProps(geo)
  return (
    <Point coordinateUnit={coordinateUnit} value={{ lat, lon }} onChange={({lat, lon}) => {
      onChange(coordinateEditor.pointPropsToGeo({
        id,
        lat,
        lon,
        properties,
      }))
    }}
    />
  )
}

export default PointGeo
