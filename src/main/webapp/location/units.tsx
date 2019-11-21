import * as React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { geometry } from 'geospatialdraw'

type SelectEvent = React.ChangeEvent<HTMLSelectElement>

type Props = {
  value: geometry.LengthUnit
  onChange: (value: geometry.LengthUnit) => void
}

const units = [
  geometry.METERS,
  geometry.KILOMETERS,
  geometry.FEET,
  geometry.YARDS,
  geometry.MILES,
  geometry.NAUTICAL_MILES,
]

const Units: React.SFC<Props> = ({ value, onChange }) => (
  <FormControl>
    <InputLabel>Units</InputLabel>
    <Select
      value={value}
      onChange={(e: SelectEvent) => {
        onChange(e.target.value as geometry.LengthUnit)
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
