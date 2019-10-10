// read default dates
// handle switching time ranges
// validation

import React, { useState } from 'react'

import DateFnsUtils from '@date-io/date-fns'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'

import { Map } from 'immutable'

const relativeUnits = ['minutes', 'hours', 'days', 'months', 'years']

const isValidDate = date => {
  return date !== undefined && date !== null && !isNaN(date.valueOf())
}

export const createTimeRange = timeRange => {
  const {
    type = 'BEFORE',
    value = new Date(),
    from = new Date(),
    to = new Date(),
    last = 1,
    unit = 'days',
  } = timeRange

  const cases = {
    BEFORE: {
      type,
      value,
    },
    AFTER: {
      type,
      value,
    },
    DURING: {
      type,
      from,
      to,
    },
    '=': {
      type,
      last,
      unit,
    },
  }

  return cases[type]
}

const TimeRange = props => {
  const { timeRange, errors = {} } = props
  const [state, setState] = useState(
    Map({
      [timeRange.type]: timeRange,
    })
  )

  const setTimeRange = timeRange => {
    if (typeof props.setTimeRange === 'function') {
      props.setTimeRange(timeRange)
    }

    setState(state.set(timeRange.type, timeRange))
  }

  const TimeRangeWhen = getTimeRangeWhen(timeRange.type)

  return (
    <div style={{ overflow: 'auto', flex: '1' }}>
      <div style={{ display: 'flex' }}>
        <FormControl fullWidth>
          <InputLabel>Time Range</InputLabel>
          <Select
            error={errors.type !== undefined}
            value={timeRange.type || ''}
            onChange={e => {
              const type = e.target.value
              const prev = state.get(type)
              const tr = createTimeRange({ ...prev, type })
              setTimeRange(tr)
            }}
          >
            <MenuItem value={'AFTER'}>After</MenuItem>
            <MenuItem value={'BEFORE'}>Before</MenuItem>
            <MenuItem value={'DURING'}>Between</MenuItem>
            <MenuItem value={'='}>Relative</MenuItem>
          </Select>
          <FormHelperText error={errors.type !== undefined}>
            {errors.type}
          </FormHelperText>
        </FormControl>
      </div>

      <TimeRangeWhen
        type={timeRange.type}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        errors={errors}
      />
    </div>
  )
}

const createTimeRangeComponent = label => props => {
  const { timeRange = {}, setTimeRange, errors = {} } = props

  return (
    <DatePicker
      label={label}
      value={timeRange.value}
      error={errors.value !== undefined}
      helperText={errors.value}
      onChange={date => {
        setTimeRange({
          type: timeRange.type,
          value: date,
        })
      }}
    />
  )
}

const TimeRangeAfter = createTimeRangeComponent(
  'Limit search to after this time'
)
const TimeRangeBefore = createTimeRangeComponent(
  'Limit search to before this time'
)

const TimeRangeDuring = props => {
  const { timeRange = {}, setTimeRange, errors = {} } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DatePicker
        label="From"
        error={errors.from !== undefined}
        helperText={errors.from}
        value={timeRange.from}
        onChange={date => {
          const value = `${date}/${timeRange.to}`
          setTimeRange({ ...timeRange, from: date, value })
        }}
      />
      <div style={{ width: 20 }} />
      <DatePicker
        label="To"
        error={errors.to !== undefined}
        helperText={errors.to}
        value={timeRange.to}
        onChange={date => {
          timeRange.to = date
          const value = `${timeRange.from}/${date}`
          setTimeRange({ ...timeRange, to: date, value })
        }}
      />
    </div>
  )
}

const TimeRangeRelative = props => {
  const { timeRange = {}, setTimeRange, errors = {} } = props

  return (
    <div style={{ overflow: 'auto', flex: '1', paddingTop: 10 }}>
      <div style={{ display: 'flex' }}>
        <div>
          <TextField
            label="Last"
            error={errors.last !== undefined}
            variant="outlined"
            fullWidth
            value={timeRange.last}
            onChange={e => {
              setTimeRange({
                type: timeRange.type,
                last: e.target.value,
                unit: timeRange.unit,
              })
            }}
          />
          <FormHelperText error={errors.last !== undefined}>
            {errors.last}
          </FormHelperText>
        </div>
        <div style={{ width: 20 }} />
        <FormControl fullWidth>
          <InputLabel>Unit</InputLabel>
          <Select
            value={timeRange.unit}
            error={errors.unit !== undefined}
            onChange={e => {
              setTimeRange({
                type: timeRange.type,
                last: timeRange.last,
                unit: e.target.value,
              })
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
  const { value, onChange, label, error, helperText } = props
  const [state, setState] = useState(value)

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        error={error}
        helperText={helperText}
        fullWidth
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label={label}
        value={state}
        onChange={(date, value) => {
          setState(value)
          onChange(date)
        }}
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

export const validate = (timeRange = {}) => {
  const errors = {}

  const { type, value } = timeRange

  switch (type) {
    case undefined:
      errors.type = 'Type must supplied'
      break

    case 'DURING': {
      const { to, from } = timeRange
      if (!isValidDate(to)) {
        errors.to = `'To' date must be a valid date`
      }

      if (!isValidDate(from)) {
        errors.from = `'From' date must be a valid date`
      }

      if (from && to) {
        if (from >= to) {
          errors.to = `'To' date must be after 'From' date`
          errors.from = `'From' date must be befor 'To' date`
        }
      }
      break
    }

    case '=': {
      const { last, unit } = timeRange
      if (isNaN(last) || last < 1) {
        errors.last = 'Value must be > 0'
      }

      if (!relativeUnits.includes(unit)) {
        errors.unit = 'Must include a valid unit'
      }
      break
    }

    default:
      if (!isValidDate(value)) {
        errors.value = `A valid date must be selected`
      }
  }

  return errors
}

export default TimeRange
export { TimeRangeAfter, TimeRangeBefore, TimeRangeDuring, TimeRangeRelative }
