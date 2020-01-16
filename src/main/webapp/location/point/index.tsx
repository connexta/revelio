import * as React from 'react'
import PointProps from './props'
import { CoordinateUnit } from 'geospatialdraw/bin/coordinates/units'
import PointUTM from './point-utm'
import PointLatLon from './point-lat-lon'
import PointDMS from './point-dms'
import PointUSNG from './point-usng'

type Props = PointProps & {
  coordinateUnit: CoordinateUnit
}

type UnitToInputComponentMap = {
  [unit in CoordinateUnit]: React.ComponentType<PointProps>
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
