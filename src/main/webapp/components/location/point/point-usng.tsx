import * as React from 'react'
import TextField from '@material-ui/core/TextField'
import Props from './props'
import useUSNGCoordinates from 'geospatialdraw/bin/coordinates/react-hooks/usng'

type ChangeEvent = React.ChangeEvent<HTMLInputElement>

const PointUSNG: React.SFC<Props> = ({ value, onChange }) => {
  const [
    coordinates,
    usng,
    setUSNG,
    isValid,
    formattedUSNG,
  ] = useUSNGCoordinates(value)
  React.useEffect(
    () => {
      if (value.lat !== coordinates.lat || value.lon !== coordinates.lon) {
        onChange(coordinates)
      }
    },
    [coordinates.lat, coordinates.lon]
  )
  return (
    <TextField
      label="USNG/MGRS"
      error={!isValid}
      helperText={isValid ? '' : 'invalid USNG value'}
      value={usng}
      onChange={(e: ChangeEvent) => {
        setUSNG(e.target.value)
      }}
      onBlur={() => setUSNG(formattedUSNG)}
      inputProps={{
        style: { textAlign: 'end' },
      }}
      style={{
        width: '12em',
      }}
    />
  )
}

export default PointUSNG
