import * as React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Line from './line'
import Polygon from './polygon'
import PointRadius from './point-radius'
import BBox from './bbox'
import withCoordinateUnitTabs from './with-coordinate-unit-tabs'
import Keyword from './keyword'
import { BasicEditorProps as Props } from './geo-editor'
import { geometry, shapes } from 'geospatialdraw'

type LocationType = 'line' | 'polygon' | 'pointRadius' | 'bbox' | 'keyword'
const defaultLocationType: LocationType = 'line'

type LocationTypeComponentMap = {
  [type in LocationType]: {
    label: string
    Component: React.ComponentType<Props>
    shape: shapes.Shape
  }
}

const componentMap: LocationTypeComponentMap = {
  line: {
    label: 'Line',
    Component: withCoordinateUnitTabs(Line),
    shape: shapes.LINE,
  },
  polygon: {
    label: 'Polygon',
    Component: withCoordinateUnitTabs(Polygon),
    shape: shapes.POLYGON,
  },
  pointRadius: {
    label: 'Point-Radius',
    Component: withCoordinateUnitTabs(PointRadius),
    shape: shapes.POINT_RADIUS,
  },
  bbox: {
    label: 'Bounding Box',
    Component: withCoordinateUnitTabs(BBox),
    shape: shapes.BOUNDING_BOX,
  },
  keyword: {
    label: 'Keyword',
    Component: Keyword,
    shape: shapes.POLYGON,
  },
}

const Location: React.SFC<Props> = ({ value, onChange }) => {
  const [locationType, setLocationType] = React.useState<LocationType>(
    defaultLocationType
  )
  const { Component, shape } = componentMap[locationType]
  const [editValue, setEditValue] = React.useState<geometry.GeometryJSON>(value)
  React.useEffect(
    () => {
      if (JSON.stringify(editValue) !== JSON.stringify(value)) {
        setEditValue(value)
      }
    },
    [value]
  )
  const onSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationType(e.target.value as LocationType)
    const geo = geometry.makeEmptyGeometry(editValue.properties.id, shape)
    setEditValue(geo)
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Location</InputLabel>
      <Select value={locationType} onChange={onSelection}>
        {Object.keys(componentMap).map((key: LocationType) => (
          <MenuItem key={key} value={key}>
            {componentMap[key].label}
          </MenuItem>
        ))}
      </Select>
      <Component value={editValue} onChange={onChange} />
    </FormControl>
  )
}

export default Location
