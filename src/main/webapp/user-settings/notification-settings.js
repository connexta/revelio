import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import { Map } from 'immutable'
import React from 'react'
import OutlinedSelect from '../input/outlined-select'

const millisecondsInDay = 24 * 60 * 60 * 1000
const durations = [
  {
    label: '1 Day',
    value: millisecondsInDay,
  },
  {
    label: '2 Days',
    value: 2 * millisecondsInDay,
  },
  {
    label: '4 Days',
    value: 4 * millisecondsInDay,
  },
  {
    label: '1 Week',
    value: 7 * millisecondsInDay,
  },
  {
    label: '2 Weeks',
    value: 14 * millisecondsInDay,
  },
  {
    label: '1 Month',
    value: 30 * millisecondsInDay,
  },
  {
    label: '2 Months',
    value: 60 * millisecondsInDay,
  },
  {
    label: '4 Months',
    value: 120 * millisecondsInDay,
  },
  {
    label: '6 Months',
    value: 180 * millisecondsInDay,
  },
  {
    label: '1 Year',
    value: 365 * millisecondsInDay,
  },
]

const NotificationSettings = (props = {}) => {
  const { value = Map(), onChange } = props
  const { alertPersistence, alertExpiration } = value.toJSON()

  return (
    <React.Fragment>
      <FormControl fullWidth variant="outlined" margin="normal">
        <OutlinedSelect
          label="Keep notifications after logging out"
          value={alertPersistence}
          onChange={e =>
            onChange(value.set('alertPersistence', e.target.value))
          }
        >
          <MenuItem key={true} value={true}>
            Yes
          </MenuItem>
          <MenuItem key={false} value={false}>
            No
          </MenuItem>
        </OutlinedSelect>
      </FormControl>

      {alertPersistence && (
        <FormControl fullWidth variant="outlined" margin="normal">
          <OutlinedSelect
            label="Expire After"
            value={alertExpiration}
            onChange={e =>
              onChange(value.set('alertExpiration', e.target.value))
            }
          >
            {durations.map(duration => (
              <MenuItem key={duration.value} value={duration.value}>
                {duration.label}
              </MenuItem>
            ))}
          </OutlinedSelect>
        </FormControl>
      )}
    </React.Fragment>
  )
}

export default NotificationSettings
