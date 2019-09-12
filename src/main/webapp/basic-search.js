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

import { executeQuery } from './intrigue-api/lib/cache'

import exampleFilterTree from './filterTree.json'
import { toFilterTree, fromFilterTree } from './basic-search-helper'
const { Map, List, Set } = require('immutable')
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

const TimeRange = () => <div>Time Range</div>

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
  // hello source to test error case
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
            filterTree.setIn(['datatypes', 'applyTo'], e.target.value)
          )
        }
      />
    )
  }

  const filters = {
    location: () => <Location />,
    timeRange: () => <TimeRange />,
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
            setFilterTree(filterTree.set('text', e.target.value))
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
