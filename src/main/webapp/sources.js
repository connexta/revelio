import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import OnlineIcon from '@material-ui/icons/CloudDoneOutlined'
import OfflineIcon from '@material-ui/icons/OfflineBoltOutlined'
import Select from '@material-ui/core/Select'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useApolloFallback } from './react-hooks'
import ErrorMessage from './error'
import { getIn } from 'immutable'
import { Sources } from 'a-test-of-revelio/components'
const sourcesMessage = offlineCount => {
  if (offlineCount === 0) {
    return 'All sources are currently up'
  }

  if (offlineCount === 1) {
    return '1 source is currently down'
  }

  return `${offlineCount} sources are currently down`
}

export const sources = gql`
  query SourcesPages {
    sources {
      isAvailable
      sourceId
      local
    }
  }
`

const userPref = gql`
  query userPref {
    user {
      preferences {
        querySettings {
          sourceIds
        }
      }
    }
  }
`

const SourcesSelectComponent = props => {
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
  const sourcesQuery = useQuery(sources)
  const userPrefsQuery = useQuery(userPref)
  if (sourcesQuery.error) {
    return (
      <ErrorMessage onRetry={sourcesQuery.refetch} error={sourcesQuery.error}>
        Error Retrieving Sources
      </ErrorMessage>
    )
  }
  if (sourcesQuery.loading || userPrefsQuery.loading) {
    return <LinearProgress />
  }

  return (
    <SourcesSelectComponent
      {...props}
      defaultValue={getIn(
        userPrefsQuery,
        ['data', 'user', 'preferences', 'querySettings', 'sourceIds'],
        undefined
      )}
      sources={sourcesQuery.data.sources
        .filter(source => source.isAvailable)
        .map(source => source.sourceId)}
    />
  )
}

const SourcesSelect = props => {
  const Component = useApolloFallback(
    SourcesSelectContainer,
    SourcesSelectComponent
  )

  return <Component {...props} />
}

const pollInterval = gql`
  query SourcePollInterval {
    systemProperties {
      sourcePollInterval
    }
  }
`

const useSourcePollInterval = init => {
  const { data, loading, error } = useQuery(pollInterval)

  if (loading || error) {
    return init
  }

  return data.systemProperties.sourcePollInterval
}

export { SourcesSelect }

export default () => {
  const pollInterval = useSourcePollInterval(60000)

  const { loading, data = {} } = useQuery(sources, {
    pollInterval,
  })

  return <Sources sources={loading ? [] : data.sources} />
}
