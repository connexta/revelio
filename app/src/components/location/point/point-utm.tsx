import * as React from 'react'
import { SpacedLinearContainer } from '../../containers'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import Props from './props'
import {
  useUTMCoordinates,
  UTM_BOUNDS,
} from 'geospatialdraw/bin/coordinates/react-hooks/utm'
import NumberInput from '../number'

const {
  MAX_EASTING,
  MIN_EASTING,
  MAX_NORTHING,
  MIN_NORTHING,
  MAX_ZONE,
} = UTM_BOUNDS

type SelectEvent = React.ChangeEvent<HTMLSelectElement>

const PointUTM: React.SFC<Props> = ({ value, onChange }) => {
  const [coordinates, utm, setUTM, isValid] = useUTMCoordinates(value)
  const { northing, easting, zone, hemisphere } = utm
  React.useEffect(() => {
    if (value.lat !== coordinates.lat || value.lon !== coordinates.lon) {
      onChange(coordinates)
    }
  }, [coordinates.lat, coordinates.lon])
  return (
    <SpacedLinearContainer direction="column" spacing={1}>
      <NumberInput
        label="Easting"
        error={!isValid}
        helperText={isValid ? '' : 'invalid UTM value'}
        value={easting}
        maxValue={MAX_EASTING}
        minValue={MIN_EASTING}
        decimalPlaces={0}
        onChange={(value: number) => {
          setUTM({
            ...utm,
            easting: value,
          })
        }}
        style={{
          width: '7em',
        }}
      />
      <NumberInput
        label="Northing"
        error={!isValid}
        helperText={isValid ? '' : 'invalid UTM value'}
        value={northing}
        maxValue={MAX_NORTHING}
        minValue={MIN_NORTHING}
        decimalPlaces={0}
        onChange={(value: number) => {
          setUTM({
            ...utm,
            northing: value,
          })
        }}
        style={{
          width: '7em',
        }}
      />
      <FormControl>
        <InputLabel>Zone</InputLabel>
        <Select
          value={zone}
          onChange={(e: SelectEvent) => {
            setUTM({
              ...utm,
              zone: parseInt(e.target.value),
            })
          }}
          renderValue={(selected: React.ReactNode) => selected}
          style={{ minWidth: 50 }}
        >
          {Array(MAX_ZONE + 1)
            .fill(0)
            .map((_: number, zoneOption: number) => (
              <MenuItem key={zoneOption} value={zoneOption}>
                <Checkbox checked={zoneOption === zone} />
                <ListItemText primary={zoneOption} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={hemisphere}
        onChange={(_e, selection) => {
          setUTM({
            ...utm,
            hemisphere: selection,
          })
        }}
      >
        <ToggleButton title="Northern Hemisphere" value="N">
          N
        </ToggleButton>
        <ToggleButton title="Southern Hemisphere" value="S">
          S
        </ToggleButton>
      </ToggleButtonGroup>
    </SpacedLinearContainer>
  )
}

export default PointUTM
