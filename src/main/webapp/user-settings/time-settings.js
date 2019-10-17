import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { Map } from 'immutable'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import React from 'react'
import OutlinedSelect from '../input/outlined-select'

const useCurrentTime = (datetimefmt, timeZone) => {
  const [currentTime, setCurrentTime] = React.useState(
    momentTimezone.tz(moment(), timeZone).format(datetimefmt)
  )

  React.useEffect(
    () => {
      const interval = setInterval(() => {
        setCurrentTime(
          momentTimezone.tz(moment(), timeZone).format(datetimefmt)
        )
      }, 50)
      return () => clearInterval(interval)
    },
    [datetimefmt, timeZone]
  )

  return currentTime
}

const CurrentTime = props => {
  const currentTime = useCurrentTime(props.format, props.timeZone)
  return (
    <div style={{ marginTop: 10 }}>
      <Typography variant="h6">Current Time (example)</Typography>
      <Typography>{currentTime}</Typography>
    </div>
  )
}

const timeZoneMap = {
  UTC: 'Etc/UTC',
  '-12': 'Etc/GMT+12',
  '-11': 'Etc/GMT+11',
  '-10': 'Etc/GMT+10',
  '-9': 'Etc/GMT+9',
  '-8': 'Etc/GMT+8',
  '-7': 'Etc/GMT+7',
  '-6': 'Etc/GMT+6',
  '-5': 'Etc/GMT+5',
  '-4': 'Etc/GMT+4',
  '-3': 'Etc/GMT+3',
  '-2': 'Etc/GMT+2',
  '-1': 'Etc/GMT+1',
  '1': 'Etc/GMT-1',
  '2': 'Etc/GMT-2',
  '3': 'Etc/GMT-3',
  '4': 'Etc/GMT-4',
  '5': 'Etc/GMT-5',
  '6': 'Etc/GMT-6',
  '7': 'Etc/GMT-7',
  '8': 'Etc/GMT-8',
  '9': 'Etc/GMT-9',
  '10': 'Etc/GMT-10',
  '11': 'Etc/GMT-11',
  '12': 'Etc/GMT-12',
}

const getTimeZoneFor = (sign, value) => {
  if (sign === '+') return timeZoneMap[value]

  return timeZoneMap[`${sign}${value}`]
}

const generateTimeZones = (sign, rangeLimit) =>
  Array(rangeLimit)
    .fill(rangeLimit)
    .map((_, index) => ({
      label: `${sign}${index + 1}:00`,
      value: getTimeZoneFor(sign, index + 1),
    }))

const timeZones = [
  ...generateTimeZones('+', 12),
  {
    label: 'UTC, +00:00',
    value: timeZoneMap['UTC'],
  },
  ...generateTimeZones('-', 12),
]

const dateTimeFormatsMap = {
  ISO: { datetimefmt: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ', timefmt: 'HH:mm:ssZ' },
  24: { datetimefmt: 'DD MMM YYYY HH:mm:ss.SSS Z', timefmt: 'HH:mm:ss Z' },
  12: { datetimefmt: 'DD MMM YYYY h:mm:ss.SSS a Z', timefmt: 'h:mm:ss a Z' },
}

const dateTimeFormats = [
  {
    label: 'ISO 8601',
    format: dateTimeFormatsMap['ISO'],
  },
  {
    label: '24 Hour Standard',
    format: dateTimeFormatsMap['24'],
  },
  {
    label: '12 Hour Standard',
    format: dateTimeFormatsMap['12'],
  },
]

const TimeSettings = (props = {}) => {
  const { value = Map(), onChange } = props
  const {
    timeZone,
    dateTimeFormat: { datetimefmt, timefmt } = {},
  } = value.toJSON()

  const format = dateTimeFormats.findIndex(
    ({ format }) =>
      format.datetimefmt === datetimefmt && format.timefmt === timefmt
  )

  return (
    <React.Fragment>
      <FormControl fullWidth variant="outlined" margin="normal">
        <OutlinedSelect
          label="Time Zone"
          value={timeZone}
          onChange={e => onChange(value.set('timeZone', e.target.value))}
        >
          {timeZones.map(timezone => (
            <MenuItem key={timezone.value} value={timezone.value}>
              {timezone.label}
            </MenuItem>
          ))}
        </OutlinedSelect>
      </FormControl>

      <FormControl fullWidth variant="outlined" margin="normal">
        <OutlinedSelect
          label="Time Format"
          value={format}
          onChange={e =>
            onChange(
              value.set(
                'dateTimeFormat',
                dateTimeFormats[e.target.value].format
              )
            )
          }
        >
          {dateTimeFormats.map((timeFormat, index) => (
            <MenuItem key={index} value={index}>
              {timeFormat.label}
            </MenuItem>
          ))}
        </OutlinedSelect>
      </FormControl>

      <CurrentTime format={datetimefmt} timeZone={timeZone} />
    </React.Fragment>
  )
}

export default TimeSettings
