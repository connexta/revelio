import TextField from '@material-ui/core/TextField'
import * as React from 'react'
import { geometry, coordinates as coordinateEditor } from 'geospatialdraw'
import Units from './units'
import Props from './geo-editor'
import { Filter, DWITHIN, INTERSECTS, ANY_GEO, GEOMETRY } from './filter'
import { geoToWKT } from './geo-to-wkt'

const parseLine = (line: [number, number][]) =>
  line.map(([lon, lat]) => `${lon} ${lat}`).join()

export const generateFilter = (geo: geometry.GeometryJSON): Filter => ({
  type: (geo.properties.buffer || 0) > 0 ? DWITHIN : INTERSECTS,
  property: ANY_GEO,
  value: {
    type: GEOMETRY,
    value: geoToWKT(geo),
  },
  geojson: geo,
})

export const Line: React.SFC<Props> = ({ geo, onChange }: Props) => {
  const {
    id,
    properties,
    coordinates,
    buffer,
    bufferUnit,
  } = coordinateEditor.geoToLineProps(geo)
  return (
    <div style={{ paddingTop: 10 }}>
      <TextField
        fullWidth
        label="Line"
        error={false}
        helperText={undefined}
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
