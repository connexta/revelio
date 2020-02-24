import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useApolloFallback } from '../../react-hooks'
import ErrorMessage from '../../error'
import { getIn } from 'immutable'

const query = gql`
  query sourcesSelect {
    user {
      preferences {
        querySettings {
          sourceIds
        }
      }
    }
    sources {
      isAvailable
      sourceId
      local
    }
  }
`

export const SourcesSelectComponent = props => {
  const { sources = [], value = [], onChange, defaultValue } = props
  useEffect(() => {
    if ((!value || value.length === 0) && defaultValue) {
      onChange(defaultValue)
    }
  }, [])
  return (
    <FormControl fullWidth>
      <InputLabel>Sources</InputLabel>
      <Select
        multiple
        value={value}
        onChange={e => onChange(e.target.value)}
        renderValue={selected => {
          return selected.join(', ')
        }}
      >
        {sources.map(source => (
          <MenuItem key={source} value={source}>
            <Checkbox checked={value.indexOf(source) > -1} />
            <ListItemText primary={source} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const SourcesSelectContainer = props => {
  const { loading, error, refetch, data } = useQuery(query)
  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieving Sources
      </ErrorMessage>
    )
  }
  if (loading) {
    return <LinearProgress />
  }

  return (
    <SourcesSelectComponent
      {...props}
      defaultValue={getIn(
        data,
        ['user', 'preferences', 'querySettings', 'sourceIds'],
        undefined
      )}
      sources={data.sources
        .filter(source => source.isAvailable)
        .map(source => source.sourceId)}
    />
  )
}

export default props => {
  const Component = useApolloFallback(
    SourcesSelectContainer,
    SourcesSelectComponent
  )

  return <Component {...props} />
}
