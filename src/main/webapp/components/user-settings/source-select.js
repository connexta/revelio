import { useQuery } from '@apollo/react-hooks'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import CloudIcon from '@material-ui/icons/Cloud'
import HomeIcon from '@material-ui/icons/Home'
import WarningIcon from '@material-ui/icons/Warning'
import { get } from 'immutable'
import React from 'react'
import OutlinedSelect from '../input/outlined-select'
import { useApolloFallback } from '../../react-hooks'
import gql from 'graphql-tag'

const query = gql`
  query UserSettingsSources {
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
  const {
    source: { sourceId, local, isAvailable },
    selected,
  } = props
  return (
    <React.Fragment>
      <Checkbox checked={selected} />
      <ListItemIcon>{local ? <HomeIcon /> : <CloudIcon />}</ListItemIcon>

      <ListItemText
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        primary={sourceId}
      />

      {!isAvailable && (
        <ListItemIcon>
          <WarningIcon />
        </ListItemIcon>
      )}
    </React.Fragment>
  )
}

const Sources = props => {
  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <OutlinedSelect
        multiple
        label="Sources"
        value={props.value || [0]}
        onChange={e => {
          props.onChange(
            e.target.value.includes(0) && props.value !== null
              ? null
              : e.target.value.filter(source => source !== 0)
          )
        }}
        renderValue={selected =>
          selected.includes(0) ? `All Sources` : selected.join(', ')
        }
      >
        <MenuItem key={'allFields'} value={0}>
          <Checkbox checked={props.value === null} />
          <ListItemText primary={`All Sources`} />
        </MenuItem>

        {props.sources &&
          props.sources.sort(sourcesSort).map(source => {
            const selected =
              props.value !== null && props.value.includes(source.sourceId)
            return (
              <MenuItem key={source.sourceId} value={source.sourceId}>
                <Source source={source} selected={selected} />
              </MenuItem>
            )
          })}
      </OutlinedSelect>
    </FormControl>
  )
}

const Container = props => {
  const { error, data, loading } = useQuery(query)
  return loading || error ? null : (
    <Sources {...props} sources={get(data, 'sources')} />
  )
}

export default props => {
  const Component = useApolloFallback(Container, Sources)
  return <Component {...props} />
}
