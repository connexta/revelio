import * as React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import {
  LengthUnit,
  METERS,
  KILOMETERS,
  FEET,
  YARDS,
  MILES,
  NAUTICAL_MILES,
} from 'geospatialdraw/bin/geometry/units'

type SelectEvent = React.ChangeEvent<HTMLSelectElement>

type Props = {
  value: LengthUnit
  onChange: (value: LengthUnit) => void
}

const units = [METERS, KILOMETERS, FEET, YARDS, MILES, NAUTICAL_MILES]

const Units: React.SFC<Props> = ({ value, onChange }) => (
  <FormControl>
    <InputLabel>Units</InputLabel>
    <Select
      value={value}
      onChange={(e: SelectEvent) => {
        onChange(e.target.value as LengthUnit)
      }}
      renderValue={(selected: React.ReactNode) => selected}
      style={{ minWidth: 100 }}
    >
      {units.map(unit => (
        <MenuItem key={unit} value={unit}>
          <Checkbox checked={unit === value} />
          <ListItemText primary={unit} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export default Units
