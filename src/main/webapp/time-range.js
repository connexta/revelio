// read default dates
// handle switching time ranges
// validation
import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'

const timeProperties = [
  'created',
  'datetime.end',
  'datetime.start',
  'effective',
  'expiration',
  'metacard.created',
  'metacard.modified',
  'metacard.version.versioned-on',
  'modified',
]

const uglyMap = {
  minutes: howMany => `RELATIVE(PT${howMany}M)`,
  hours: howMany => `RELATIVE(PT${howMany}H)`,
  days: howMany => `RELATIVE(P${howMany}D)`,
  months: howMany => `RELATIVE(P${howMany}M)`,
  years: howMany => `RELATIVE(P${howMany}Y)`,
}

const getDate = date => {
  const dateCheck = new Date(date)

  if (isNaN(dateCheck.valueOf())) {
    return new Date()
  }

  return dateCheck
}

const defaultRange = range => {
  if (range === undefined || range.type === undefined) {
    return {}
  }

  const { type } = range

  if (type === 'DURING') {
    const from = getDate(range.from)
    const to = getDate(range.to)
    const value = `${from} / ${to}`

    return {
      type,
      value,
      from,
      to,
    }
  }

  if (type === '=') {
    const value = uglyMap.days(1)
    return {
      type,
      value,
    }
  }

  return {
    type, // AFTER | BEFORE
    value: getDate(range.value),
  }
}

const TimeRange = props => {
  const timeRange = defaultRange(props.timeRange)
  const setTimeRange = timeRange => {
    if (typeof setTimeRange === 'function') {
      const range = defaultRange(timeRange)
      props.setTimeRange(range)
    }
  }

  const TimeRangeWhen = getTimeRangeWhen(timeRange.type)

  return (
    <div style={{ overflow: 'auto', flex: '1' }}>
      <div style={{ display: 'flex' }}>
        <FormControl fullWidth>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange.type}
            onChange={e => {
              setTimeRange({ ...timeRange, type: e.target.value })
            }}
          >
            <MenuItem value={'AFTER'}>After</MenuItem>
            <MenuItem value={'BEFORE'}>Before</MenuItem>
            <MenuItem value={'DURING'}>Between</MenuItem>
            <MenuItem value={'='}>Relative</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TimeRangeWhen
        type={timeRange.type}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </div>
  )
}

const createTimeRange = label => props => {
  const { timeRange = {}, setTimeRange } = props

  return (
    <DatePicker
      label={label}
      defaultDate={getDate(timeRange.value)}
      setDate={date => {
        setTimeRange({
          type: timeRange.type,
          value: date,
        })
      }}
    />
  )
}

const TimeRangeAfter = createTimeRange('Limit search to after this time')
const TimeRangeBefore = createTimeRange('Limit search to before this time')

const TimeRangeDuring = props => {
  const { timeRange = {}, setTimeRange } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DatePicker
        label="From"
        defaultDate={getDate(timeRange.from)}
        setDate={date => {
          const value = `${date}/${timeRange.to}`
          setTimeRange({ ...timeRange, from: date, value })
        }}
      />
      <div style={{ width: 20 }} />
      <DatePicker
        label="To"
        defaultDate={getDate(timeRange.to)}
        setDate={date => {
          timeRange.to = date
          const value = `${timeRange.from}/${date}`
          setTimeRange({ ...timeRange, to: date, value })
        }}
      />
    </div>
  )
}

const TimeRangeRelative = props => {
  const [unit, setUnit] = React.useState('days')
  const [last, setLast] = React.useState(1)
  const { timeRange = {}, setTimeRange } = props

  return (
    <div style={{ overflow: 'auto', flex: '1', paddingTop: 10 }}>
      <div style={{ display: 'flex' }}>
        <TextField
          label="Last"
          variant="outlined"
          fullWidth
          value={last}
          onChange={e => {
            setLast(e.target.value)
            const tr = {
              type: timeRange.type,
              value: uglyMap[unit](e.target.value),
            }
            setTimeRange(tr)
          }}
        />
        <div style={{ width: 20 }} />
        <FormControl fullWidth>
          <InputLabel>Unit</InputLabel>
          <Select
            value={unit}
            onChange={e => {
              setUnit(e.target.value)
              const tr = {
                type: timeRange.type,
                value: uglyMap[e.target.value](last),
              }
              setTimeRange(tr)
            }}
          >
            <MenuItem value={`minutes`}>Minutes</MenuItem>
            <MenuItem value={`hours`}>Hours</MenuItem>
            <MenuItem value={`days`}>Days</MenuItem>
            <MenuItem value={`months`}>Months</MenuItem>
            <MenuItem value={`years`}>Years</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

const DatePicker = props => {
  const { setDate, label, defaultDate } = props
  console.log('defaultDate', defaultDate)
  const [selectedDate, setSelectedDate] = React.useState(defaultDate)

  function handleDateChange(date) {
    setSelectedDate(date)
    setDate(date)
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        fullWidth
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label={label}
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  )
}

const Empty = () => null

const ranges = {
  AFTER: TimeRangeAfter,
  BEFORE: TimeRangeBefore,
  DURING: TimeRangeDuring,
  '=': TimeRangeRelative,
}

const getTimeRangeWhen = type => {
  return ranges[type] || Empty
}

export default TimeRange
export { TimeRangeAfter, TimeRangeBefore, TimeRangeDuring, TimeRangeRelative }
