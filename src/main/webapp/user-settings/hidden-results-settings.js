import { useQuery } from '@apollo/react-hooks'
import Dialog from '@material-ui/core/Dialog'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import VisibilityIcon from '@material-ui/icons/Visibility'
import gql from 'graphql-tag'
import { Map } from 'immutable'
import React from 'react'
import Inspector from '../inspector'
import { useApolloFallback } from '../react-hooks'
import ErrorMessage from '../components/network-retry/inline-retry'

const resultQuery = gql`
  query ResultQuery($ids: [ID]!) {
    metacardsById(ids: $ids) {
      results {
        metacard
        actions {
          description
          displayName
          id
          title
          url
        }
      }
    }
  }
`

const Loading = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearProgress style={{ width: '25vw', height: 10 }} />
    </div>
  )
}

const ResultInfoError = props => (
  <Dialog open>
    <ErrorMessage onRetry={props.refetch} error={props.error}>
      Error Retrieving Result
    </ErrorMessage>
  </Dialog>
)

const ResultInfoContainer = props => {
  const { loading, data, error, refetch } = useQuery(resultQuery, {
    variables: { id: props.selected },
  })

  if (error) {
    return <ResultInfoError refetch={refetch} error={error} />
  }

  return (
    <Dialog open onClose={props.onClose}>
      {loading ? (
        <Loading />
      ) : (
        <Inspector
          results={
            data.metacardsById.results.length > 0
              ? data.metacardsById.results[0]
              : null
          }
        />
      )}
    </Dialog>
  )
}

const HideAll = props => (
  <MenuItem onClick={props.onClick}>
    <VisibilityIcon />
    <div style={{ width: 20 }} />
    <ListItemText>Unhide All</ListItemText>
  </MenuItem>
)

const BlacklistItem = props => (
  <FormControl fullWidth style={{ display: 'flex' }}>
    <MenuItem>
      <ListItemText
        onClick={props.onClick}
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
      >
        {props.children}
      </ListItemText>
      <IconButton onClick={props.onDelete}>
        <VisibilityIcon />
      </IconButton>
    </MenuItem>
  </FormControl>
)

const HiddenSettings = (props = {}) => {
  const { value = Map(), onChange } = props
  const { resultBlacklist = [] } = value.toJSON()
  const [selected, setSelected] = React.useState(null)

  const ResultInfoComponent = useApolloFallback(
    ResultInfoContainer,
    ResultInfoError
  )
  return (
    <React.Fragment>
      {selected && (
        <ResultInfoComponent
          selected={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {resultBlacklist.length > 0 ? (
          <HideAll
            onClick={() => props.onChange(value.set('resultBlacklist', []))}
          />
        ) : (
          <Typography>Nothing Hidden.</Typography>
        )}
      </div>

      <List>
        {resultBlacklist.map(({ id, title }) => {
          return (
            <BlacklistItem
              key={id}
              onClick={() => setSelected(id)}
              onDelete={() => {
                onChange(
                  value.set(
                    'resultBlacklist',
                    value
                      .get('resultBlacklist')
                      .filter(result => result.id !== id)
                  )
                )
              }}
            >
              {title}
            </BlacklistItem>
          )
        })}
      </List>
    </React.Fragment>
  )
}

export default HiddenSettings
