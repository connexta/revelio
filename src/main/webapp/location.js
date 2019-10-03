import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Map } from 'immutable'
import React from 'react'
import Line, {
  generateFilter as generateLineFilter,
  validate as validateLine,
} from './line'
import PointRadius, {
  generateFilter as generatePointRadiusFilter,
  validate as validatePointRadius,
} from './point-radius'
import Polygon, {
  generateFilter as generatePolygonFilter,
  validate as validatePolygon,
} from './polygon'

export const locationTypes = {
  line: {
    label: 'Line',
    component: Line,
    validate: validateLine,
    generateFilter: generateLineFilter,
  },
  polygon: {
    label: 'Polygon',
    component: Polygon,
    validate: validatePolygon,
    generateFilter: generatePolygonFilter,
  },
  pointRadius: {
    label: 'Point-Radius',
    component: PointRadius,
    validate: validatePointRadius,
    generateFilter: generatePointRadiusFilter,
  },
  boundingBox: {
    label: 'Bounding Box',
    component: null,
    validate: () => ({}),
    generateFilter: () => null,
  },
  keyword: {
    label: 'Line',
    component: null,
    validate: () => ({}),
    generateFilter: () => null,
  },
}

export const validate = (location = Map()) => {
  const type = location.get('type')
  return locationTypes[type].validate(location.get('location'))
}

const Location = ({ value = Map(), onChange, errors = {} }) => {
  const [locations, setLocations] = React.useState(
    Map({ [value.get('type')]: value })
  )
  const type = value.get('type')
  const Component = locationTypes[type].component
  const onSelection = e => {
    setLocations(locations.set(type, value.get('location')))
    onChange(
      value
        .set('type', e.target.value)
        .set('location', locations.get(e.target.value))
    )
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Location</InputLabel>
      <Select value={type ? type : 'line'} onChange={onSelection}>
        {Object.keys(locationTypes).map(key => (
          <MenuItem key={key} value={key}>
            {locationTypes[key].label}
          </MenuItem>
        ))}
      </Select>
      {Component ? (
        <Component
          value={value.get('location')}
          onChange={location => onChange(value.set('location', location))}
          errors={errors}
        />
      ) : null}
    </FormControl>
  )
}

export default Location
