import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'

import { executeQuery } from './intrigue-api/lib/cache'

const TextSearch = props => {
  const [filterTree, setFilterTree] = React.useState({
    type: 'ILIKE',
    property: 'anyText',
    value: '',
  })

  return (
    <React.Fragment>
      <TextField
        label="Text"
        variant="outlined"
        fullWidth
        value={filterTree.value}
        onChange={e => {
          const value = e.target.value
          setFilterTree({ ...filterTree, value })
        }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => props.onSearch(filterTree)}
      >
        Search
      </Button>
    </React.Fragment>
  )
}

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
  return (
      <Paper style={{ maxWidth: 600, margin: '20px auto' }}>
        <TextSearch
          onSearch={filterTree => {
            props.onSearch(populateDefaultQuery(filterTree))
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
