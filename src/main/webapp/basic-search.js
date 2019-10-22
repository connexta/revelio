import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import CloseIcon from '@material-ui/icons/Close'
import { red } from '@material-ui/core/colors'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import { Map } from 'immutable'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Collapse from '@material-ui/core/Collapse'
import SortOrder from './search-settings'

import {
  APPLY_TO_KEY,
  DATATYPES_KEY,
  LOCATION_KEY,
  TEXT_KEY,
  TIME_RANGE_KEY,
  toFilterTree,
  fromFilterTree,
} from './basic-search-helper'
import Location, { validate as validateLocation } from './location'
import TimeRange, {
  createTimeRange,
  validate as validateTimeRange,
} from './time-range'

const timeAttributes = [
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

const filterMap = {
  location: 'Location',
  timeRange: 'Time Range',
  datatypes: 'Match Types',
  sources: 'Sources',
  sortOrder: 'Sort Order',
}

const defaultSorts = [
  {
    attribute: 'modified',
    direction: 'descending',
  },
]

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
        Add Options
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(filterMap).map(filter => (
          <MenuItem
            key={filter}
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
    style={props.style}
    fullWidth
    variant="contained"
    color="primary"
    onClick={props.onSearch}
  >
    Search
  </Button>
)

const populateDefaultQuery = (
  filterTree,
  srcs = ['ddf.distribution'],
  sorts = defaultSorts
) => ({
  srcs,
  start: 1,
  count: 250,
  filterTree,
  sorts,
  spellcheck: false,
  phonetics: false,
})

const MatchTypes = ({ state = [], setState, errors = {} }) => {
  errors = errors.matchTypesErrors || {}
  return (
    <FormControl fullWidth>
      <InputLabel>Match Types</InputLabel>
      <Select
        error={errors.datatypes !== undefined}
        multiple
        value={state}
        onChange={e => setState(e.target.value)}
        renderValue={selected => selected.join(', ')}
      >
        {datatypes.map(datatype => (
          <MenuItem key={datatype} value={datatype}>
            <Checkbox checked={state.indexOf(datatype) > -1} />
            <ListItemText primary={datatype} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={errors.datatypes !== undefined}>
        {errors.datatypes}
      </FormHelperText>
    </FormControl>
  )
}

const MatchSources = ({ state = ['ddf.distribution'], setState }) => {
  const sources = ['ddf.distribution', 'csw', 'opensearch']

  return (
    <FormControl fullWidth>
      <InputLabel>Sources</InputLabel>
      <Select
        multiple
        value={state}
        onChange={e => setState(e.target.value)}
        renderValue={selected => {
          return selected.join(', ')
        }}
      >
        {sources.map(source => (
          <MenuItem key={source} value={source}>
            <Checkbox checked={state.indexOf(source) > -1} />
            <ListItemText primary={source} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const BasicSortOrder = props => {
  const { setState } = props

  return <SortOrder setSortOrder={setState} />
}

const BasicTimeRange = ({ state = Map(), setState, errors }) => {
  return (
    <div style={{ flex: '1', overflow: 'hidden' }}>
      <TimeRange
        errors={errors.timeRangeErrors}
        fullWidth
        timeRange={state.get('value')}
        setTimeRange={updatedTimeRange => {
          const next = state.set('value', updatedTimeRange)
          setState(next)
        }}
      />
      <FormControl fullWidth>
        <AttributeSelector
          attributes={state.get(APPLY_TO_KEY)}
          errors={errors.attributeSelectorErrors}
          setAttributes={attributes => {
            const next = state.set(APPLY_TO_KEY, attributes)
            setState(next)
          }}
        />
      </FormControl>
    </div>
  )
}

const AttributeSelector = props => {
  const { attributes = [], setAttributes, errors = {} } = props

  return (
    <FormControl fullWidth>
      <InputLabel>Apply Time Range To</InputLabel>
      <Select
        error={errors.applyTo !== undefined}
        multiple
        value={attributes}
        onChange={e => setAttributes(e.target.value)}
        input={<Input />}
        renderValue={selected => {
          return selected.join(', ')
        }}
      >
        {timeAttributes.map(name => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={attributes.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={errors.applyTo !== undefined}>
        {errors.applyTo}
      </FormHelperText>
    </FormControl>
  )
}

const BasicLocation = ({ state = Map(), setState, errors }) => {
  return (
    <Location
      value={state}
      onChange={setState}
      errors={errors.locationErrors}
    />
  )
}

const filters = {
  [LOCATION_KEY]: BasicLocation,
  timeRange: BasicTimeRange,
  datatypes: MatchTypes,
  sources: MatchSources,
  sortOrder: BasicSortOrder,
}

const filterLabels = {
  [LOCATION_KEY]: 'Location',
  timeRange: 'Time Range',
  datatypes: 'Match Types',
  sources: 'Sources',
  sortOrder: 'Sort Order',
}

const defaultFilters = {
  timeRange: Map({
    value: createTimeRange({ type: 'BEFORE' }),
    applyTo: ['created'],
  }),
  [LOCATION_KEY]: Map({
    type: 'line',
  }),
}

const getFilterTree = props => {
  if (props.query && props.query.filterTree) {
    return fromFilterTree(props.query.filterTree)
  }

  return Map({ text: '*' })
}

const FilterCard = props => {
  const [state, setState] = useState(true)
  const { children, label, onRemove } = props

  const spacing = 16
  const Arrow = state ? KeyboardArrowUpIcon : KeyboardArrowDownIcon

  return (
    <Paper style={{ width: '100%', marginTop: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography style={{ padding: 12 }} color="textSecondary">
          {label}
        </Typography>
        <div style={{ display: 'flex' }}>
          <IconButton onClick={() => setState(!state)}>
            <Arrow />
          </IconButton>
          <IconButton style={{ color: red[500] }} onClick={onRemove}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <Collapse in={state}>
        <Divider />
        <div
          style={{
            padding: spacing,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </Collapse>
    </Paper>
  )
}

export const BasicSearch = props => {
  const [filterTree, setFilterTree] = React.useState(getFilterTree(props))

  const [submitted, setSubmitted] = React.useState(false)
  const errors = validate(filterTree)

  const text = filterTree.get('text')

  return (
    <div
      style={{
        overflow: 'auto',
        padding: 2,
        maxWidth: 600,
        maxHeight: '100%',
      }}
    >
      <Paper
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        <TextSearch
          text={text}
          handleChange={e =>
            setFilterTree(filterTree.set(TEXT_KEY, e.target.value))
          }
        />
        <AddButton
          addFilter={filter => {
            setFilterTree(
              filterTree.merge({
                [filter]: defaultFilters[filter],
              })
            )
          }}
        />
      </Paper>

      {filterTree
        .remove('text')
        .map((state, filter) => {
          const Component = filters[filter]
          const label = filterLabels[filter]

          return (
            <FilterCard
              key={filter}
              label={label}
              onRemove={() => {
                setFilterTree(filterTree.remove(filter))
              }}
            >
              <Component
                state={state}
                setState={state => {
                  setFilterTree(filterTree.set(filter, state))
                }}
                errors={submitted ? errors : {}}
              />
            </FilterCard>
          )
        })
        .valueSeq()}

      <Divider />

      <div
        style={{
          marginTop: 20,
        }}
      >
        <SearchButton
          fullWidth
          onSearch={() => {
            setSubmitted(true)

            if (isEmpty(errors)) {
              props.onSearch(
                populateDefaultQuery(
                  toFilterTree(filterTree),
                  filterTree.get('sources'),
                  filterTree.get('sortOrder')
                )
              )
            }
          }}
        />
      </div>
    </div>
  )
}

const isEmpty = checkThis => {
  return Object.keys(checkThis).length === 0
}

const validateAttributeSelector = (applyTo = []) => {
  const errors = {}

  if (applyTo.length === 0) {
    errors.applyTo = 'Must choose at least one attribute'
  }

  return errors
}

const validateMatchTypes = () => {
  return {}
}

const validate = (filterMap = Map()) => {
  let errors = {}

  if (filterMap.has(LOCATION_KEY)) {
    const locationErrors = validateLocation(filterMap.getIn([LOCATION_KEY]))
    if (!isEmpty(locationErrors)) {
      errors['locationErrors'] = locationErrors
    }
  }

  if (filterMap.has(TIME_RANGE_KEY)) {
    const timeRangeErrors = validateTimeRange(
      filterMap.getIn([TIME_RANGE_KEY, 'value'])
    )

    if (!isEmpty(timeRangeErrors)) {
      errors['timeRangeErrors'] = timeRangeErrors
    }

    const attributeSelectorErrors = validateAttributeSelector(
      filterMap.getIn([TIME_RANGE_KEY, APPLY_TO_KEY])
    )
    if (!isEmpty(attributeSelectorErrors)) {
      errors['attributeSelectorErrors'] = attributeSelectorErrors
    }
  }

  if (filterMap.has(DATATYPES_KEY)) {
    const matchTypesErrors = validateMatchTypes(
      filterMap.getIn([DATATYPES_KEY])
    )
    if (!isEmpty(matchTypesErrors)) {
      errors['matchTypesErrors'] = matchTypesErrors
    }
  }
  return errors
}

export default BasicSearch
