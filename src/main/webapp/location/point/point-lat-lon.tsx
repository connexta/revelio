import * as React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import Props from './props'
import NumberInput from '../number'
import SpacedLinearContainer from '../../spaced-linear-container'

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

const PointLatLon: React.SFC<Props> = ({
  value: { lat: initLat, lon: initLon },
  onChange,
}) => {
  const [lat, setLat] = React.useState(initLat)
  const [lon, setLon] = React.useState(initLon)
  React.useEffect(
    () => {
      onChange({ lat, lon })
    },
    [lat, lon]
  )
  return (
    <SpacedLinearContainer direction="row" spacing={1}>
      <LatitudeInput value={lat} onChange={setLat} />
      <LongitudeInput value={lon} onChange={setLon} />
    </SpacedLinearContainer>
  )
}

export default PointLatLon
