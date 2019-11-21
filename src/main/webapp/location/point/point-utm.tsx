import * as React from 'react'
import Box from '@material-ui/core/Box'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import Props from './props'
import { coordinates as coordinateEditor } from 'geospatialdraw'
import NumberInput from '../number'

const {
  MAX_EASTING,
  MIN_EASTING,
  MAX_NORTHING,
  MIN_NORTHING,
  MAX_ZONE,
} = coordinateEditor.UTM_BOUNDS

type SelectEvent = React.ChangeEvent<HTMLSelectElement>

type DivProps = {
  children: React.ReactNode
}

const Column: React.SFC<DivProps> = (props: DivProps) => (
  <Box flex="flex" flexDirection="column" padding={1} {...props} />
)

const PointUTM: React.SFC<Props> = ({ value, onChange }) => {
  const [
    coordinates,
    utm,
    setUTM,
    isValid,
  ] = coordinateEditor.useUTMCoordinates(value)
  const { northing, easting, zone, hemisphere } = utm
  React.useEffect(
    () => {
      onChange(coordinates)
    },
    [coordinates]
  )
  return (
    <Column>
      <NumberInput
        fullWidth
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
      />
      <NumberInput
        fullWidth
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
          style={{ minWidth: 100 }}
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
        onChange={(_e, selection) => {
          setUTM({
            ...utm,
            hemisphere: selection,
          })
        }}
      >
        <ToggleButton
          title="Northern Hemisphere"
          selected={hemisphere === 'N'}
          value="N"
        >
          N
        </ToggleButton>
        <ToggleButton
          title="Southern Hemisphere"
          selected={hemisphere === 'S'}
          value="S"
        >
          S
        </ToggleButton>
      </ToggleButtonGroup>
    </Column>
  )
}

export default PointUTM
