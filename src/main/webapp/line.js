import TextField from '@material-ui/core/TextField'
import { Map } from 'immutable'
import React from 'react'
import Units from './units'
import { getDistanceInMeters } from './distance-utils'

export const validate = (location = Map()) => {
  const errors = {}
  const { coordinates = [], bufferWidth = 0 } = location.toJSON()

  if (typeof coordinates === 'string') {
    errors.coordinates = `Invalid Line`
  }

  if (bufferWidth < 0) {
    errors.bufferWidth = `Buffer width must be greater or equal to 0`
  }
  return errors
}

const parseLine = line => line.map(([lon, lat]) => `${lon} ${lat}`).join()

export const generateFilter = (location = Map()) => {
  const { coordinates, bufferWidth, unit } = location.toJSON()
  return {
    type: bufferWidth > 0 ? 'DWITHIN' : 'INTERSECTS',
    property: 'anyGeo',
    value: {
      type: 'GEOMETRY',
      value: `LINESTRING(${parseLine(coordinates)})`,
    },
    ...(bufferWidth > 0 && {
      distance: getDistanceInMeters({ distance: bufferWidth, units: unit }),
    }),
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
      properties: {
        type: 'LineString',
        buffer: {
          width: bufferWidth,
          unit,
        },
      },
    },
  }
}

const Line = props => {
  const { value = Map(), onChange, errors = {} } = props
  const { coordinates = '', bufferWidth = 0, unit = 'meters' } = value.toJSON()

  return (
    <div style={{ paddingTop: 10 }}>
      <TextField
        fullWidth
        label="Line"
        error={errors.coordinates !== undefined}
        helperText={errors.coordinates}
        value={
          typeof coordinates === 'string'
            ? coordinates
            : JSON.stringify(coordinates)
        }
        onChange={e => {
          let coordinates = e.target.value
          try {
            coordinates = JSON.parse(coordinates)
          } catch (e) {}
          onChange(value.set('coordinates', coordinates))
        }}
      />
      <div style={{ display: 'flex', paddingTop: 10 }}>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <TextField
            fullWidth
            type="number"
            label="Buffer Width"
            error={errors.bufferWidth !== undefined}
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

export default Line
