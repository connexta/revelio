import * as React from 'react'
import PointProps from './props'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import PointUTM from './point-utm'
import PointLatLon from './point-lat-lon'
import PointDMS from './point-dms'
import PointUSNG from './point-usng'

type Props = PointProps & {
  coordinateUnit: coordinateEditor.CoordinateUnit
}

type UnitToInputComponentMap = {
  [unit in coordinateEditor.CoordinateUnit]: React.ComponentType<PointProps>
}

const ComponentMap: UnitToInputComponentMap = {
  'UTM/UPS': PointUTM,
  'Lat/Lon (DD)': PointLatLon,
  'Lat/Lon (DMS)': PointDMS,
  'USNG/MGRS': PointUSNG,
}

const Point: React.SFC<Props> = ({ coordinateUnit, ...rest }) => {
  const Component = ComponentMap[coordinateUnit]
  return <Component {...rest} />
}

export default Point
