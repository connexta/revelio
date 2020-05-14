import { useQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import gql from 'graphql-tag'
import { get, getIn, Map, remove, set } from 'immutable'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useApolloFallback } from '../../react-hooks'
import FilterCard from '../containers/filter-card'
import FacetedDropdown from '../faceted-dropdown'
import { Location } from '../location'
import { makeDefaultSearchGeo } from '../query-builder/filter'
import SortOrder from '../sort-order/sort-order'
import SourcesSelect from '../sources-select'
import TimeRange, {
  createTimeRange,
  validate as validateTimeRange,
} from '../time-range/time-range'
import {
  APPLY_TO_KEY,
  fromFilterTree,
  LOCATION_KEY,
  MATCHTYPE_KEY,
  populateDefaultQuery,
  TEXT_KEY,
  TIME_RANGE_KEY,
  toFilterTree,
} from './basic-search-helper'
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
      <Button variant="outlined" onClick={handleClick}>
        Add Option
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(filterLabels).map(filter => (
          <MenuItem
            key={filter}
            value={filter}
            onClick={() => {
              addFilter(filter)
              handleClose()
            }}
          >
            {filterLabels[filter]}
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

const MatchTypes = ({
  state = [],
  setState,
  errors = {},
  basicSearchSettings = {},
}) => {
  const error = errors.matchTypesErrors || {}
  return (
    <FacetedDropdown
      label="Match Types"
      facetAttribute={basicSearchSettings.basicSearchMatchType || 'datatype'}
      error={error.matchTypes}
      multiple
      value={state}
      onChange={e => setState(e.target.value)}
      renderValue={selected => selected.join(', ')}
    />
  )
}

const BasicSources = ({ state, setState }) => {
  return <SourcesSelect value={state} onChange={setState} />
}

const BasicSortOrder = props => {
  const { state, setState } = props
  return <SortOrder value={state} onChange={setState} />
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

const isGeo = geo => geo.type && geo.type === 'feature'

const BasicLocation = ({ state, setState }) => {
  const geo = isGeo(state) ? state : makeDefaultSearchGeo()
  return <Location value={geo} onChange={setState} />
}

const filters = {
  [LOCATION_KEY]: BasicLocation,
  timeRange: BasicTimeRange,
  [MATCHTYPE_KEY]: MatchTypes,
  sortOrder: BasicSortOrder,
}

const filterLabels = {
  [LOCATION_KEY]: 'Location',
  timeRange: 'Time Range',
  [MATCHTYPE_KEY]: 'Match Types',
  sortOrder: 'Sort Order',
}

const defaultFilters = {
  timeRange: Map({
    value: createTimeRange({ type: 'BEFORE' }),
    applyTo: ['created'],
  }),
  [LOCATION_KEY]: makeDefaultSearchGeo(),
}

const getFilterMap = ({ query, basicSearchMatchType }) => {
  if (!query) {
    return Map({ text: '*' })
  }

  let filterMap = query.filterTree
    ? fromFilterTree(query.filterTree, {
        basicSearchMatchType,
      })
    : Map({ text: '*' })

  if (query.sorts) {
    const sorts = query.sorts.map(sort => {
      const splitIndex = sort.lastIndexOf(',')
      return {
        propertyName: sort.substring(0, splitIndex),
        sortOrder: sort.substring(splitIndex + 1, sort.length),
      }
    })
    filterMap = set(filterMap, 'sortOrder', sorts)
  }

  filterMap = set(filterMap, 'sources', query.sources)
  return filterMap
}

const createQuery = filterMap => {
  let sorts = get(filterMap, 'sortOrder')
  sorts = sorts
    ? sorts.map(({ propertyName, sortOrder }) => `${propertyName},${sortOrder}`)
    : null
  const sources = get(filterMap, 'sources')

  return {
    filterTree: toFilterTree(filterMap),
    sources: sources || null,
    sorts,
  }
}

export const BasicSearchQueryBuilder = props => {
  const { submitted = true, addOptionsRef } = props
  const [filterMap, setFilterMap] = useState(getFilterMap(props))

  const onChange = filterMap => {
    setFilterMap(filterMap)
    return props.onChange(createQuery(filterMap))
  }

  const errors = validate(filterMap)

  const text = filterMap.get('text')

  const addFilter = filter => {
    onChange(
      filterMap.merge({
        [filter]: defaultFilters[filter],
      })
    )
  }

  const AddOptions = () =>
    addOptionsRef ? (
      ReactDOM.createPortal(
        <AddButton addFilter={addFilter} />,
        props.addOptionsRef
      )
    ) : (
      <React.Fragment>
        <div style={{ marginLeft: '10px' }} />
        <AddButton addFilter={addFilter} />
      </React.Fragment>
    )

  return (
    <React.Fragment>
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
          handleChange={e => onChange(filterMap.set(TEXT_KEY, e.target.value))}
        />
        <AddOptions />
      </Paper>

      {remove(remove(filterMap, 'text'), 'sources')
        .map((state, filter) => {
          const Component = filters[filter]
          const label = filterLabels[filter]

          return (
            <FilterCard
              key={filter}
              label={label}
              onRemove={() => {
                onChange(remove(filterMap, filter))
              }}
            >
              <Component
                state={state}
                setState={state => {
                  onChange(filterMap.set(filter, state))
                }}
                errors={submitted ? errors : {}}
                basicSearchSettings={{
                  basicSearchMatchType: props.basicSearchMatchType,
                }}
              />
            </FilterCard>
          )
        })
        .valueSeq()}
      <FilterCard label="Sources">
        <BasicSources
          state={filterMap.get('sources')}
          setState={state => {
            onChange(filterMap.set('sources', state))
          }}
        />
      </FilterCard>

      <Divider />
    </React.Fragment>
  )
}

export const BasicSearch = props => {
  const [query, setQuery] = React.useState(props.query)

  const [submitted, setSubmitted] = React.useState(false)

  return (
    <div
      style={{
        overflow: 'auto',
        padding: 2,
        maxWidth: 600,
        maxHeight: '100%',
      }}
    >
      <BasicSearchQueryBuilder
        query={props.query}
        onChange={query => {
          setQuery(query)
        }}
        submitted={submitted}
        basicSearchMatchType={props.basicSearchMatchType}
      />

      <div
        style={{
          marginTop: 20,
        }}
      >
        <SearchButton
          fullWidth
          onSearch={() => {
            setSubmitted(true)
            const filterMap = getFilterMap({
              query,
              basicSearchMatchType: props.basicSearchMatchType,
            })
            const errors = validate(filterMap)
            if (isEmpty(errors)) {
              props.onSearch(
                query || populateDefaultQuery(toFilterTree(filterMap))
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

  if (filterMap.has(MATCHTYPE_KEY)) {
    const matchTypesErrors = validateMatchTypes(
      filterMap.getIn([MATCHTYPE_KEY])
    )
    if (!isEmpty(matchTypesErrors)) {
      errors['matchTypesErrors'] = matchTypesErrors
    }
  }
  return errors
}

const MATCHTYPE_ATTRIBUTE = gql`
  query getBasicSearchMatchType {
    systemProperties {
      basicSearchMatchType
    }
  }
`

const Container = props => {
  const { data, loading } = useQuery(MATCHTYPE_ATTRIBUTE)
  if (loading) {
    return <LinearProgress />
  }

  const matchTypeAttribute = getIn(
    data,
    ['systemProperties', 'basicSearchMatchType'],
    'datatype'
  )

  return <BasicSearch {...props} basicSearchMatchType={matchTypeAttribute} />
}

export default props => {
  const Component = useApolloFallback(Container, BasicSearch)
  return <Component {...props} />
}
