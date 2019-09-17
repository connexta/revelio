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

const TimeRange = props => {
  const { setFilterTree } = props
  const [timeRange, setTimeRange] = React.useState(props.timeRange || {})
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
              setFilterTree({ ...timeRange, type: e.target.value })
            }}
          >
            <MenuItem value={'AFTER'}>After</MenuItem>
            <MenuItem value={'BEFORE'}>Before</MenuItem>
            <MenuItem value={'DURING'}>Between</MenuItem>
            <MenuItem value={'='}>Relative</MenuItem>
          </Select>
        </FormControl>
        <div style={{ width: 20 }} />
        <TimeRangeApplyTo
          timeRange={timeRange}
          writeApplyTo={applyTo => {
            setTimeRange({ ...timeRange, applyTo })
          }}
        />
      </div>

      <TimeRangeWhen
        type={timeRange.type}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        setFilterTree={setFilterTree}
      />
    </div>
  )
}

const TimeRangeAfter = props => {
  const { timeRange = {}, setFilterTree } = props

  return (
    <DatePicker
      label="Limit search to after this time"
      setDate={date => {
        setFilterTree({
          type: timeRange.type,
          applyTo: timeRange.applyTo,
          value: date,
        })
      }}
    />
  )
}

// TODO: fire gordo

const TimeRangeBefore = props => {
  const { timeRange = {}, setFilterTree } = props

  return (
    <DatePicker
      label="Limit search to before this time"
      setDate={date => {
        setFilterTree({
          type: timeRange.type,
          applyTo: timeRange.applyTo,
          value: date,
        })
      }}
    />
  )
}

const TimeRangeDuring = props => {
  const { timeRange = {}, setFilterTree } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DatePicker
        label="From"
        setDate={date => {
          timeRange.from = date
          timeRange.value = `${date}/${timeRange.to}`
          setFilterTree(timeRange)
        }}
      />
      <div style={{ width: 20 }} />
      <DatePicker
        label="To"
        setDate={date => {
          timeRange.to = date
          timeRange.value = `${timeRange.from}/${date}`
          setFilterTree(timeRange)
        }}
      />
    </div>
  )
}

const TimeRangeRelative = props => {
  const [unit, setUnit] = React.useState('days')
  const [last, setLast] = React.useState(1)
  const { timeRange = {}, setFilterTree } = props

  const uglyMap = {
    minutes: howMany => `RELATIVE(PT${howMany}M)`,
    hours: howMany => `RELATIVE(PT${howMany}H)`,
    days: howMany => `RELATIVE(P${howMany}D)`,
    months: howMany => `RELATIVE(P${howMany}M)`,
    years: howMany => `RELATIVE(P${howMany}Y)`,
  }

  return (
    <div style={{ overflow: 'auto', flex: '1', paddingTop: 10 }}>
      <div style={{ display: 'flex' }}>
        <FormControl fullWidth>
          <InputLabel>Unit</InputLabel>
          <Select
            value={unit}
            onChange={e => {
              setUnit(e.target.value)
              const tr = {
                type: timeRange.type,
                property: timeRange.property,
                applyTo: timeRange.applyTo,
                value: uglyMap[e.target.value](last),
              }
              setFilterTree(tr)
            }}
          >
            <MenuItem value={`minutes`}>Minutes</MenuItem>
            <MenuItem value={`hours`}>Hours</MenuItem>
            <MenuItem value={`days`}>Days</MenuItem>
            <MenuItem value={`months`}>Months</MenuItem>
            <MenuItem value={`years`}>Years</MenuItem>
          </Select>
        </FormControl>
        <div style={{ width: 20 }} />
        <TextField
          label="Unit"
          variant="outlined"
          fullWidth
          value={last}
          onChange={e => {
            setLast(e.target.value)
            const tr = {
              type: timeRange.type,
              property: timeRange.property,
              applyTo: timeRange.applyTo,
              value: uglyMap[unit](e.target.value),
            }
            setFilterTree(tr)
          }}
        />
      </div>
    </div>
  )
}

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

const TimeRangeApplyTo = props => {
  const { timeRange, writeApplyTo } = props
  const [applyTo, setApplyTo] = React.useState(props.timeRange.applyTo || [])

  const handleChange = e => {
    setApplyTo(e.target.value)
    writeApplyTo(e.target.value)
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Apply Time Range To</InputLabel>
      <Select
        multiple
        value={applyTo}
        onChange={handleChange}
        input={<Input />}
        renderValue={selected => selected.join(', ')}
      >
        {timeProperties.map(name => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={applyTo.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const DatePicker = props => {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const { setDate, label } = props

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
