import * as React from 'react'
import { useState } from 'react'
import { Paper, Button } from '@material-ui/core'
import FilterGroup from './filter/filter-group'
import { deserialize, serialize } from './query-advanced-serialization'

const getFilterTree = (props: any) => {
  const { filters, type } = props
  return { filters, type }
}

const QueryAdvanced = (props: any) => {
  const [filterTree, setFilterTree] = useState(
    deserialize(getFilterTree(props))
  )

  return (
    <Paper
      style={{
        overflow: 'auto',
        maxWidth: 500,
        maxHeight: '100%',
        padding: 20,
      }}
    >
      <FilterGroup
        {...filterTree}
        limitDepth={props.limitDepth}
        onChange={setFilterTree}
      />
      <Button
        style={{ marginTop: 5 }}
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => props.onSearch(serialize(filterTree))}
      >
        Search
      </Button>
    </Paper>
  )
}

export default QueryAdvanced
