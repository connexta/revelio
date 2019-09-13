// stuff I need to do
// get the right date format
// time range validation?
// pull out time range stuff and storybook it
import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import RemoveIcon from '@material-ui/icons/Remove'

import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'

import { executeQuery } from './intrigue-api/lib/cache'

import exampleFilterTree from './filterTree.json'
import {
  toFilterTree,
  fromFilterTree,
  TIME_RANGE_KEY,
  DATATYPES_KEY,
  TEXT_KEY,
  APPLY_TO_KEY,
} from './basic-search-helper'
const { Map, List, Set, fromJS } = require('immutable')

import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'

//console.log(fromFilterTree(exampleFilterTree));
const TextSearch = ({ text, handleChange }) => {
  return (
    <TextField
      fullWidth
      label="Text"
      variant="outlined"
      value={text}
      onChange={handleChange}
    />
  )
}

const TimeRange = props => {
  const { setFilterTree } = props
  const [timeRange, setTimeRange] = React.useState(props.timeRange)

  return (
    <React.Fragment>
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

      <TimeRangeWhen
        type={timeRange.type}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        setFilterTree={setFilterTree}
      />
    </React.Fragment>
  )
}

const TimeRangeWhen = props => {
  const { type } = props
  switch (type) {
    case 'AFTER':
      return <TimeRangeAfter {...props} />
    case 'BEFORE':
      return <TimeRangeBefore {...props} />
    case 'DURING':
      return <TimeRangeDuring {...props} />
    case '=':
      return <TimeRangeRelative {...props} />
    default:
      return null
  }
}

const TimeRangeAfter = props => {
  const { setTimeRange, timeRange, setFilterTree } = props

  return (
    <React.Fragment>
      <TimeRangeApplyTo
        timeRange={timeRange}
        writeApplyTo={applyTo => {
          setTimeRange({ ...timeRange, applyTo })
          setFilterTree({ ...timeRange, applyTo })
        }}
      />
      <SingleDatePicker
        label="Limit search to after this time"
        setDate={date => {
          setTimeRange({
            type: timeRange.type,
            applyTo: timeRange.applyTo,
            value: date,
          })
          setFilterTree({
            type: timeRange.type,
            applyTo: timeRange.applyTo,
            value: date,
          })
        }}
      />
    </React.Fragment>
  )
}

const TimeRangeBefore = props => {
  const { setTimeRange, timeRange, setFilterTree } = props

  return (
    <React.Fragment>
      <TimeRangeApplyTo
        timeRange={timeRange}
        writeApplyTo={applyTo => {
          setTimeRange({ ...timeRange, applyTo })
          setFilterTree({ ...timeRange, applyTo })
        }}
      />
      <SingleDatePicker
        label="Limit search to before this time"
        setDate={date => {
          setTimeRange({
            type: timeRange.type,
            applyTo: timeRange.applyTo,
            value: date,
          })
          setFilterTree({
            type: timeRange.type,
            applyTo: timeRange.applyTo,
            value: date,
          })
        }}
      />
    </React.Fragment>
  )
}

const TimeRangeDuring = props => {
  const { setTimeRange, timeRange, setFilterTree } = props

  return (
    <React.Fragment>
      <TimeRangeApplyTo
        timeRange={timeRange}
        writeApplyTo={applyTo => {
          setTimeRange({ ...timeRange, applyTo })
          setFilterTree({ ...timeRange, applyTo })
        }}
      />
      <SingleDatePicker
        label="Limit search to after this time"
        setDate={date => {
          const tr = {
            type: timeRange.type,
            applyTo: timeRange.applyTo,
            to: timeRange.to,
            from: date,
            value: `${date}/${timeRange.to}`,
          }
          setTimeRange(tr)
          setFilterTree(tr)
        }}
      />

      <SingleDatePicker
        label="Limit search to before this time"
        setDate={date => {
          const tr = {
            type: timeRange.type,
            applyTo: timeRange.applyTo,
            from: timeRange.from,
            to: date,
            value: `${timeRange.from}/${date}`,
          }
          setTimeRange(tr)
          setFilterTree(tr)
        }}
      />
    </React.Fragment>
  )
}

const TimeRangeRelative = props => {
  const [unit, setUnit] = React.useState('days')
  const [last, setLast] = React.useState(1)
  const { setTimeRange, timeRange, setFilterTree } = props

  const uglyMap = {
    minutes: howMany => `RELATIVE(PT${howMany}M)`,
    hours: howMany => `RELATIVE(PT${howMany}H)`,
    days: howMany => `RELATIVE(P${howMany}D)`,
    months: howMany => `RELATIVE(P${howMany}M)`,
    years: howMany => `RELATIVE(P${howMany}Y)`,
  }

  return (
    <React.Fragment>
      <TimeRangeApplyTo
        timeRange={timeRange}
        writeApplyTo={applyTo => {
          setTimeRange({ ...timeRange, applyTo })
          setFilterTree({ ...timeRange, applyTo })
        }}
      />
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
            setTimeRange(tr)
            setFilterTree(tr)
          }}
        >
          <MenuItem value={`minutes`}>Minutes</MenuItem>
          <MenuItem value={`hours`}>Hours</MenuItem>
          <MenuItem value={`days`}>Days</MenuItem>
          <MenuItem value={`months`}>Months</MenuItem>
          <MenuItem value={`years`}>Years</MenuItem>
        </Select>
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
            setTimeRange(tr)
            setFilterTree(tr)
          }}
        />
      </FormControl>
    </React.Fragment>
  )
}

const TimeRangeApplyTo = props => {
  const { timeRange, writeApplyTo } = props
  const [applyTo, setApplyTo] = React.useState(props.timeRange.applyTo)
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

  const handleChange = e => {
    setApplyTo(e.target.value)
    writeApplyTo(e.target.value)
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Apply Time Range To</InputLabel>
      <Select
        multiple
        displayEmpty
        value={applyTo}
        onChange={handleChange}
        input={<Input />}
        renderValue={selected => {
          return selected.join(', ')
        }}
      >
        <MenuItem disabled value="">
          <em>Placeholder</em>
        </MenuItem>
        {timeProperties.map(name => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const SingleDatePicker = props => {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const { setDate, label } = props

  function handleDateChange(date) {
    setSelectedDate(date)
    setDate(date)
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
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

const filterMap = {
  location: 'Location',
  timeRange: 'Time Range',
  datatypes: 'Match Types',
}
const AddButton = ({ addFilter }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Button onClick={handleClick} style={{ marginLeft: '20px' }}>
        Add Filters
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(filterMap).map(filter => (
          <MenuItem
            value={filter}
            onClick={() => {
              addFilter(filter)
              handleClose()
            }}
          >
            {filterMap[filter]}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}

const SearchButton = props => (
  <Button
    fullWidth
    variant="contained"
    color="primary"
    onClick={props.onSearch}
  >
    Search
  </Button>
)

const populateDefaultQuery = filterTree => ({
  srcs: ['ddf.distribution', 'cache'],
  start: 1,
  count: 250,
  filterTree,
  sorts: [
    {
      attribute: 'modified',
      direction: 'descending',
    },
  ],
  id: '313a84858daa4ef5980d4b11a745d6d3',
  spellcheck: false,
  phonetics: false,
  batchId: '5a3f400c2e1e410e8d37494500173ca4',
})

export const BasicSearch = props => {
  const [filterTree, setFilterTree] = React.useState(
    fromFilterTree(exampleFilterTree)
  )
  //console.log(filterTree);

  const [selectedFilters, setSelectedFilters] = React.useState(
    Set(Object.keys(filterMap).filter(filter => filterTree.get(filter)))
  )
  const { datatypes, text, location, timeRange } = filterTree.toJSON()

  const matchTypes = () => {
    return (
      <MatchTypes
        applyTo={datatypes.applyTo}
        handleChange={e =>
          setFilterTree(
            filterTree.setIn([DATATYPES_KEY, APPLY_TO_KEY], e.target.value)
          )
        }
      />
    )
  }

  const filters = {
    location: () => <Location />,
    timeRange: () => (
      <TimeRange
        fullWidth
        timeRange={timeRange}
        setFilterTree={timeRange => {
          setFilterTree(filterTree.set(TIME_RANGE_KEY, fromJS(timeRange)))
        }}
      />
    ),
    datatypes: matchTypes,
  }
  //console.log(exampleFilterTree);
  //console.log(fromFilterTree(exampleFilterTree));
  // console.log(filterTree);
  // console.log(selectedFilters);

  return (
    <Paper style={{ maxWidth: 600, margin: '20px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
        <TextSearch
          text={text}
          handleChange={e =>
            setFilterTree(filterTree.set(TEXT_KEY, e.target.value))
          }
        />
        <AddButton
          addFilter={filter => {
            setSelectedFilters(selectedFilters.add(filter))
          }}
        />
      </div>

      {selectedFilters.map(filter => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', margin: '20px' }}
          >
            {filters[filter]()}
            <Button
              onClick={() => setSelectedFilters(selectedFilters.delete(filter))}
            >
              <RemoveIcon />
            </Button>
          </div>
        )
      })}

      <SearchButton
        fullWidth
        onSearch={() => {
          //console.log(filterTree);
          console.log(
            'Sending query with filterTree: ',
            toFilterTree(filterTree)
          )
          props.onSearch(populateDefaultQuery(toFilterTree(filterTree)))
        }}
      />
    </Paper>
  )
}

const datatypes = [
  'Interactive Resource',
  'Moving Image',
  'Still Image',
  'Dataset',
  'Collection',
  'Event',
  'Service',
  'Software',
  'Sound',
  'Text',
  'Image',
  'Physical Object',
]
const MatchTypes = ({ applyTo = [], handleChange }) => (
  <FormControl fullWidth>
    <InputLabel>Match Types</InputLabel>
    <Select multiple value={applyTo} onChange={handleChange}>
      {datatypes.map(datatype => (
        <MenuItem value={datatype}>{datatype}</MenuItem>
      ))}
    </Select>
  </FormControl>
)

const locationTypes = [
  'Any',
  'Line',
  'Polygon',
  'Point-Radius',
  'Bounding Box',
  'Keyword',
]
const Location = () => {
  const [type, setType] = React.useState('Any')
  return (
    <FormControl fullWidth>
      <InputLabel>Location</InputLabel>
      <Select value={type} onChange={e => setType(e.target.value)}>
        {locationTypes.map(type => (
          <MenuItem value={type}>{type}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const mapDispatchToProps = { onSearch: executeQuery }

export default connect(
  null,
  mapDispatchToProps
)(BasicSearch)
