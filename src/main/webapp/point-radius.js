import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import { Map, fromJS } from 'immutable'
import React from 'react'
import Units from './units'

export const validate = (location = Map()) => {
  const errors = {}
  const { lat, lon, bufferWidth } = location.toJSON()

  if (lat < -90 || lat > 90) {
    errors.lat = `Latitude must be between -90 and 90`
  }

  if (lon < -90 || lon > 90) {
    errors.lon = `Longitude must be between -90 and 90`
  }

  if (bufferWidth < 0) {
    errors.bufferWidth = `Buffer width must be greater or equal to 0`
  }
  return errors
}

const LatLon = props => {
  const { value, onChange, errors } = props
  const {
    lat = '',
    lon = '',
    bufferWidth = 0,
    unit = 'meters',
  } = value.toJSON()
  return (
    <div style={{ paddingTop: 10 }}>
      <TextField
        fullWidth
        label="Lat"
        type="number"
        error={errors.lat}
        helperText={errors.lat}
        value={lat}
        onChange={e => {
          onChange(value.set('lat', e.target.value))
        }}
      />
      <TextField
        fullWidth
        label="Lon"
        type="number"
        error={errors.lon}
        helperText={errors.lon}
        value={lon}
        onChange={e => {
          onChange(value.set('lon', e.target.value))
        }}
      />
      <div style={{ display: 'flex', paddingTop: 10 }}>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <TextField
            fullWidth
            type="number"
            label="Buffer Width"
            error={errors.bufferWidth}
            helperText={errors.bufferWidth}
            value={bufferWidth}
            onChange={e => {
              onChange(value.set('bufferWidth', e.target.value))
            }}
          />
        </div>
        <div style={{ width: 20 }} />
        <Units
          value={unit}
          onChange={e => {
            onChange(value.set('unit', e.target.value))
          }}
        />
      </div>
    </div>
  )
}

const tabMap = {
  0: LatLon,
  1: null,
  2: null,
  3: null,
}
const PointRadius = props => {
  const { value = Map(), onChange, errors } = props
  const [tab, setTab] = React.useState(0)
  const Component = tabMap[tab]
  return (
    <div style={{ paddingTop: 10 }}>
      <Tabs
        value={tab}
        onChange={(_, selectedIndex) => {
          setTab(selectedIndex)
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Lat / Lon (DD)" />
        <Tab label="Lat / Lon (DMS)" />
        <Tab label="USNG / MGRS" />
        <Tab label="UTM / UPS" />
      </Tabs>
      {Component ? (
        <Component value={value} onChange={onChange} errors={errors} />
      ) : null}
    </div>
  )
}

export default PointRadius
