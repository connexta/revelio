import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Map } from 'immutable'
import React from 'react'
import PointRadius, { validate as validatePointRadius } from './point-radius'
import Polygon, { validate as validatePolygon } from './polygon'

const validationFunctions = Map({
  line: () => ({}),
  polygon: validatePolygon,
  pointRadius: validatePointRadius,
  boundingBox: () => ({}),
  keyWord: () => ({}),
})

export const validate = (location = Map()) => {
  const type = location.get('type')
  return validationFunctions.get(type)(location.get('location'))
}

const locationComponents = Map({
  line: null,
  polygon: Polygon,
  pointRadius: PointRadius,
  boundingBox: null,
  keyWord: null,
})

const locationTypes = Map({
  line: 'Line',
  polygon: 'Polygon',
  pointRadius: 'Point-Radius',
  boundingBox: 'Bounding Box',
  keyword: 'Keyword',
})

const Location = ({ value = Map(), onChange, errors = {} }) => {
  const [locations, setLocations] = React.useState(
    Map({ [value.get('type')]: value })
  )
  const type = value.get('type')
  const Component = locationComponents.get(type)
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
        {locationTypes
          .map((value, key) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))
          .valueSeq()}
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
