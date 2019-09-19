// stuff I need to do
// get the right date format
// time range validation?
// pull out time range stuff and storybook it
import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
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
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import TimeRange from './time-range'

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
    style={props.style}
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
        applyTo={filterTree.getIn([DATATYPES_KEY, APPLY_TO_KEY])}
        handleChange={e => {
          const next = filterTree.setIn(
            [DATATYPES_KEY, APPLY_TO_KEY],
            e.target.value
          )
          setFilterTree(next)
        }}
      />
    )
  }

  console.log(filterTree.getIn([TIME_RANGE_KEY, APPLY_TO_KEY]))

  const filters = {
    location: () => <Location />,
    timeRange: () => (
      <div style={{ flex: '1', overflow: 'hidden' }}>
        <TimeRange
          fullWidth
          timeRange={filterTree.getIn([TIME_RANGE_KEY, 'value'])}
          setTimeRange={timeRange => {
            const next = filterTree.setIn([TIME_RANGE_KEY, 'value'], timeRange)
            setFilterTree(next)
          }}
        />
        <FormControl fullWidth>
          <AttributeSelector
            attributes={filterTree.getIn([TIME_RANGE_KEY, APPLY_TO_KEY])}
            setAttributes={attributes => {
              const next = filterTree.setIn(
                [TIME_RANGE_KEY, APPLY_TO_KEY],
                attributes
              )
              setFilterTree(next)
            }}
          />
        </FormControl>
      </div>
    ),
    datatypes: matchTypes,
  }
  //console.log(exampleFilterTree);
  //console.log(fromFilterTree(exampleFilterTree));
  // console.log(filterTree);
  // console.log(selectedFilters);

  const spacing = 20

  return (
    <Paper
      style={{
        maxWidth: 600,
        margin: '20px auto',
        //padding: spacing,
        //boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: spacing,
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
            setSelectedFilters(selectedFilters.add(filter))
          }}
        />
      </div>

      {selectedFilters.map(filter => {
        return (
          <div style={{ width: '100%' }}>
            <Divider style={{ marginBottom: 15, marginTop: 10 }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: spacing,
                boxSizing: 'border-box',
              }}
            >
              <div style={{ marginRight: spacing }}>
                <Fab
                  size="small"
                  color="secondary"
                  onClick={() => {
                    setFilterTree(filterTree.set(filter, Map()))
                    setSelectedFilters(selectedFilters.delete(filter))
                  }}
                >
                  <RemoveIcon />
                </Fab>
              </div>

              {filters[filter]()}
            </div>
          </div>
        )
      })}

      <SearchButton
        fullWidth
        style={{ marginTop: spacing }}
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
    <Select
      checkbox-item
      multiple
      value={applyTo}
      onChange={handleChange}
      renderValue={selected => {
        return selected.join(', ')
      }}
    >
      {datatypes.map(datatype => (
        <MenuItem value={datatype}>
          <Checkbox checked={applyTo.indexOf(datatype) > -1} />
          <ListItemText primary={datatype} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

const AttributeSelector = props => {
  const { attributes = [], setAttributes } = props

  return (
    <FormControl fullWidth>
      <InputLabel>Apply Time Range To</InputLabel>
      <Select
        multiple
        value={attributes}
        onChange={e => setAttributes(e.target.value)}
        input={<Input />}
        renderValue={selected => selected.join(', ')}
      >
        {timeAttributes.map(name => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={attributes.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

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
