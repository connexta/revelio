import TextField from '@material-ui/core/TextField'
import { Map } from 'immutable'
import React from 'react'
import Units from './units'

const Polygon = props => {
  const { state = Map(), onChange } = props
  const { coordinates = '', bufferWidth = 0, unit = 'meters' } = state.toJSON()

  return (
    <div style={{ paddingTop: 10 }}>
      <TextField
        fullWidth
        label="Polygon"
        value={
          typeof coordinates === 'string'
            ? coordinates
            : JSON.stringify(coordinates)
        }
        onChange={e => {
          let value = e.target.value
          try {
            value = JSON.parse(value)
          } catch (e) {}
          onChange(state.set('coordinates', value))
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

export default Polygon
