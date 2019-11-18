import * as React from 'react'
import { useState } from 'react'
import {
  Paper,
  Button,
  Divider,
  Box,
  TextField,
  LinearProgress,
  Typography,
} from '@material-ui/core'
import FilterGroup from './filter/filter-group'
import { deserialize, serialize } from './query-advanced-serialization'
import { FilterContext } from './filter-context'
import useMetacardDefinitions from '../react-hooks/use-metacard-definitions'
import { sampleMetacardTypes } from './filter/dummyDefinitions'

const useApolloFallback = require('../react-hooks/use-apollo-fallback').default
type QuerySettings = {
  title?: string
}

type QueryAdvancedProps = QuerySettings & {
  filterTree?: any
  limitDepth?: number
  editing?: boolean
  onSearch: (value: any) => void
  metacardTypes?: any
}

const getSettings = (props: QueryAdvancedProps) => {
  const settings = {
    title: props.title || '',
  }
  return settings
}

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
    </Paper>
  )
}
const Error = (props: any) => {
  return (
    <Paper>
      <Typography>
        {props.message ? props.message : 'Something went wrong'}
      </Typography>
    </Paper>
  )
}

const QueryAdvanced = (props: QueryAdvancedProps) => {
  const [settings, setSettings] = useState(getSettings(props))
  const { metacardTypes = sampleMetacardTypes } = props
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
          metacardTypes,
          editing: props.editing !== false,
        }}
      >
        <FilterGroup
          {...deserialize(props.filterTree, metacardTypes)}
          limitDepth={props.limitDepth}
          onChange={(value: any) => {
            props.onSearch({
              ...settings,
              filterTree: serialize(value, metacardTypes),
            })
          }}
        />
      </FilterContext.Provider>
      <Button
        style={{ marginTop: 5 }}
        fullWidth
        variant="contained"
        color="primary"
        onClick={() =>
          props.onSearch({
            ...settings,
            filterTree: serialize(props.filterTree, metacardTypes),
          })
        }
      >
        Search
      </Button>
    </Paper>
  )
}
const Container = (props: any) => {
  const { loading, error, metacardTypes } = useMetacardDefinitions()
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error} />
  }

  return <QueryAdvanced {...props} metacardTypes={metacardTypes} />
}

export default (props: QueryAdvancedProps) => {
  const Component = useApolloFallback(Container, QueryAdvanced)
  return <Component {...props} />
}
