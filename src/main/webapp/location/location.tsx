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
const defaultLocationType:LocationType = 'line'

type LocationTypeComponentMap = {
  [type in LocationType]: {
    label: string,
    Component: React.ComponentType<Props>
  }
}

const componentMap: LocationTypeComponentMap = {
  'line': {
    label: 'Line',
    Component: withCoordinateUnitTabs(Line)
  },
  'polygon': {
    label: 'Polygon',
    Component: withCoordinateUnitTabs(Polygon)
  },
  'pointRadius': {
    label: 'Point-Radius',
    Component: withCoordinateUnitTabs(PointRadius)
  },
  'bbox': {
    label: 'Bounding Box',
    Component: withCoordinateUnitTabs(BBox)
  },
  'keyword': {
    label: 'Keyword',
    Component: Keyword
  }
}

const Location: React.SFC<Props> = ({ value, onChange }) => {
  const [locationType, setLocationType] = React.useState<LocationType>(defaultLocationType)
  const { Component } = componentMap[locationType]
  const [editValue, setEditValue] = React.useState<geometry.GeometryJSON>(value)
  React.useEffect(() => {
    if (JSON.stringify(editValue) !== JSON.stringify(value)) {
      setEditValue(value)
    }
  }, [value])
  const updateLocationType = (update: LocationType) => {
    setLocationType(update)
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Location</InputLabel>
      <Select value={locationType} onChange={e =>
        setLocationType(e.target.value as LocationType)
      }>
        {Object.keys(componentMap).map((key: LocationType) => (
          <MenuItem key={key} value={key}>
            {componentMap[key].label}
          </MenuItem>
        ))}
      </Select>
      <Component
        value={editValue}
        onChange={onChange}
      />
    </FormControl>
  )
}
