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

import { executeQuery } from './intrigue-api/lib/cache'

import exampleFilterTree from './filterTree.json'
import { toFilterTree, fromFilterTree } from './basic-search-helper'

//console.log(fromFilterTree(exampleFilterTree));
const TextSearch = ({ filterTree, setFilterTree }) => {
  // const [filterTree, setFilterTree] = React.useState({
  //   type: "ILIKE",
  //   property: "anyText",
  //   value: ""
  // });

  return (
    <TextField
      label="Text"
      variant="outlined"
      fullWidth
      value={filterTree.text}
      onChange={e => {
        const value = e.target.value
        setFilterTree({ ...filterTree, text: value })
      }}
    />
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

const TimeRange = props => (
  <FormControl>
    <InputLabel htmlFor="age-simple">Age</InputLabel>
    <Select
      value={10}
      // onChange={(}
      inputProps={{
        name: 'age',
        id: 'age-simple',
      }}
    >
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </Select>
  </FormControl>
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
  console.log(exampleFilterTree)
  console.log(fromFilterTree(exampleFilterTree))
  console.log(filterTree)

  return (
    <Paper style={{ maxWidth: 600, margin: '20px auto' }}>
      <TextSearch filterTree={filterTree} setFilterTree={setFilterTree} />
      <TimeRange />
      <SearchButton
        onSearch={() => {
          props.onSearch(populateDefaultQuery(toFilterTree(filterTree)))
        }}
      />
    </Paper>
  )
}

const mapDispatchToProps = { onSearch: executeQuery }

export default connect(
  null,
  mapDispatchToProps
)(BasicSearch)
