import * as React from 'react'
import { useState } from 'react'
import { Paper, Button, Divider, Box, TextField } from '@material-ui/core'
import FilterGroup from './filter/filter-group'
import { deserialize, serialize } from './query-advanced-serialization'
import { FilterContext } from './filter-context'
import { metacardDefinitions } from './filter/dummyDefinitions'
type QuerySettings = {
  title?: string
}

type QueryAdvancedProps = QuerySettings & {
  filterTree?: any
  limitDepth?: number
  editing?: boolean
  onSearch: (value: any) => void
}

const getFilterTree = (filterTree: any) => {
  const { filters, type } = filterTree
  return { filters, type }
}

const getSettings = (props: QueryAdvancedProps) => {
  const settings = {
    title: props.title || '',
  }
  return settings
}

const QueryAdvanced = (props: QueryAdvancedProps) => {
  const [filterTree, setFilterTree] = useState(
    deserialize(getFilterTree(props.filterTree))
  )
  const [settings, setSettings] = useState(getSettings(props))

  return (
    <Paper
      style={{
        maxWidth: 500,
        padding: 20,
      }}
    >
      <Box style={{ marginBottom: 20 }}>
        <TextField
          value={settings.title || ''}
          placeholder="Search Title"
          fullWidth
          onChange={event =>
            setSettings({ ...settings, title: event.target.value })
          }
        />
        <Divider />
      </Box>
      <FilterContext.Provider
        value={{
          includedAttributes: Array.from(metacardDefinitions.keys()),
          editing: props.editing !== false,
        }}
      >
        <FilterGroup
          {...filterTree}
          limitDepth={props.limitDepth}
          onChange={setFilterTree}
        />
      </FilterContext.Provider>
      <Button
        style={{ marginTop: 5 }}
        fullWidth
        variant="contained"
        color="primary"
        onClick={() =>
          props.onSearch({ ...settings, filterTree: serialize(filterTree) })
        }
      >
        Search
      </Button>
    </Paper>
  )
}

export default QueryAdvanced
