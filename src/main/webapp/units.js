import React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

const units = [
  'meters',
  'kilometers',
  'feet',
  'yards',
  'miles',
  'nautical miles',
]

const Units = props => {
  const { value, onChange } = props

  return (
    <FormControl>
      <InputLabel>Units</InputLabel>
      <Select
        value={value ? value : 'meters'}
        onChange={e => {
          onChange(e)
        }}
        renderValue={selected => selected}
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
}

export default Units
