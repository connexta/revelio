import * as React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import Props from './props'
import NumberInput from '../number'
import { SpacedLinearContainer } from '../../containers'

const DECIMAL_DEGREES_PRECISION = 6

type NumberProps = {
  value: number
  onChange: (value: number) => void
}

const LatitudeInput: React.SFC<NumberProps> = props => (
  <NumberInput
    maxValue={90}
    minValue={-90}
    decimalPlaces={DECIMAL_DEGREES_PRECISION}
    label="Latitude"
    {...props}
    InputProps={{
      endAdornment: <InputAdornment position="end">&deg;</InputAdornment>,
    }}
    inputProps={{
      style: { textAlign: 'end' },
    }}
    style={{
      width: '7em',
    }}
  />
)
const LongitudeInput: React.SFC<NumberProps> = props => (
  <NumberInput
    maxValue={180}
    minValue={-180}
    decimalPlaces={DECIMAL_DEGREES_PRECISION}
    label="Longitude"
    {...props}
    InputProps={{
      endAdornment: <InputAdornment position="end">&deg;</InputAdornment>,
    }}
    inputProps={{
      style: { textAlign: 'end' },
    }}
    style={{
      width: '7em',
    }}
  />
)

const PointLatLon: React.SFC<Props> = ({ value: { lat, lon }, onChange }) => (
  <SpacedLinearContainer direction="row" spacing={1}>
    <LatitudeInput
      value={lat}
      onChange={value => onChange({ lat: value, lon })}
    />
    <LongitudeInput
      value={lon}
      onChange={value => onChange({ lon: value, lat })}
    />
  </SpacedLinearContainer>
)

export default PointLatLon
