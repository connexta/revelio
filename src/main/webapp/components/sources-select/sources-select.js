import { useQuery } from '@apollo/react-hooks'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import LinearProgress from '@material-ui/core/LinearProgress'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import CloudIcon from '@material-ui/icons/Cloud'
import HomeIcon from '@material-ui/icons/Home'
import WarningIcon from '@material-ui/icons/Warning'
import gql from 'graphql-tag'
import { get, getIn } from 'immutable'
import React, { useEffect } from 'react'
import { useApolloFallback } from '../../react-hooks'
import OutlinedSelect from '../input/outlined-select'
import ErrorMessage from '../network-retry/inline-retry'

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

const sourcesSort = (source1, source2) => {
  return source1.local ? -1 : source1.id <= source2.id
}

const Source = props => {
  const { label, selected, Icon, isAvailable } = props
  return (
    <React.Fragment>
      <Checkbox checked={selected} />
      <ListItemIcon>{Icon}</ListItemIcon>

      <ListItemText
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        primary={label}
      />

      {!isAvailable && (
        <ListItemIcon>
          <WarningIcon />
        </ListItemIcon>
      )}
    </React.Fragment>
  )
}

export const SourcesSelect = props => {
  const { label = 'Sources' } = props
  useEffect(() => {
    if (!props.value && props.defaultValue) {
      props.onChange(props.defaultValue)
    }
  }, [])

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <OutlinedSelect
        multiple
        label={label}
        value={props.value || [0]}
        onChange={e => {
          props.onChange(
            e.target.value.includes(0) && props.value != null
              ? null
              : e.target.value.filter(source => source !== 0)
          )
        }}
        renderValue={selected =>
          selected.includes(0) ? `All Sources` : selected.join(', ')
        }
      >
        <MenuItem value={0}>
          <Checkbox checked={props.value == null} />
          <ListItemText primary={`All Sources`} />
        </MenuItem>
        {(props.sources || []).sort(sourcesSort).map(source => {
          const selected = Boolean(
            props.value && props.value.includes(source.sourceId)
          )
          const Icon = source.local ? <HomeIcon /> : <CloudIcon />
          return (
            <MenuItem key={source.sourceId} value={source.sourceId}>
              <Source
                selected={selected}
                Icon={Icon}
                label={source.sourceId}
                sourceId={source.sourceId}
                isAvailable={source.isAvailable}
              />
            </MenuItem>
          )
        })}
      </OutlinedSelect>
    </FormControl>
  )
}

const Container = props => {
  const { error, data, loading, refetch } = useQuery(query)
  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error Retrieving Sources
      </ErrorMessage>
    )
  }
  const userPref = getIn(
    data,
    ['user', 'preferences', 'querySettings', 'sourceIds'],
    undefined
  )
  const sources = get(data, 'sources', [])
  const defaultValue =
    userPref ||
    sources.filter(source => source.local).map(source => source.sourceId)
  return (
    <SourcesSelect {...props} sources={sources} defaultValue={defaultValue} />
  )
}

export default props => {
  const Component = useApolloFallback(Container, SourcesSelect)
  return <Component {...props} />
}
