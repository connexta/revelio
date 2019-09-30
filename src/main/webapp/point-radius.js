import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import { Map } from 'immutable'
import React from 'react'
import Units from './units'

const LatLon = props => {
  const { state, onChange } = props
  const {
    lat = '',
    lon = '',
    bufferWidth = 0,
    unit = 'meters',
  } = state.toJSON()
  return (
    <div style={{ paddingTop: 10 }}>
      <TextField
        fullWidth
        label="Lat"
        type="number"
        value={lat}
        onChange={e => {
          onChange(state.set('lat', e.target.value))
        }}
      />
      <TextField
        fullWidth
        label="Lon"
        type="number"
        value={lon}
        onChange={e => {
          onChange(state.set('lon', e.target.value))
        }}
      />
      <div style={{ display: 'flex', paddingTop: 10 }}>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <TextField
            fullWidth
            type="number"
            label="Buffer Width"
            value={bufferWidth}
            onChange={e => {
              onChange(state.set('bufferWidth', e.target.value))
            }}
          />
        </div>
        <div style={{ width: 20 }} />
        <Units
          value={unit}
          onChange={e => {
            onChange(state.set('unit', e.target.value))
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
  const { state = Map(), onChange } = props
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
      {Component ? <Component state={state} onChange={onChange} /> : null}
    </div>
  )
}

export default PointRadius
