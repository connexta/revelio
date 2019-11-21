import * as React from 'react'
import Box from '@material-ui/core/Box'
import Props from './props'
import NumberInput from '../number'

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
  />
)
const LongitudeInput: React.SFC<NumberProps> = props => (
  <NumberInput
    maxValue={180}
    minValue={-180}
    decimalPlaces={DECIMAL_DEGREES_PRECISION}
    label="Longitude"
    {...props}
  />
)

type DivProps = {
  children: React.ReactNode
}

const Row: React.SFC<DivProps> = (props: DivProps) => (
  <Box flex="flex" flexDirection="row" padding={1} {...props} />
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
    <Row>
      <LatitudeInput value={lat} onChange={setLat} />
      <LongitudeInput value={lon} onChange={setLon} />
    </Row>
  )
}

export default PointLatLon
