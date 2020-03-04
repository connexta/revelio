import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import OnlineIcon from '@material-ui/icons/CloudDoneOutlined'
import OfflineIcon from '@material-ui/icons/OfflineBoltOutlined'
import { SnackbarRetry } from '../network-retry'
import { useSourcePollInterval } from './poll-interval'

const sources = gql`
  query SourcesInfo {
    sources {
      isAvailable
      sourceId
      local
    }
  }
`
const sourcesMessage = offlineCount => {
  if (offlineCount === 0) {
    return 'All sources are currently up'
  }

  if (offlineCount === 1) {
    return '1 source is currently down'
  }

  return `${offlineCount} sources are currently down`
}

export const SourcesInfo = props => {
  const sources = props.sources === undefined ? [] : props.sources
    const { error } = props
  const getIcon = source => (source.isAvailable ? OnlineIcon : OfflineIcon)
  const offlineCount = sources.filter(source => !source.isAvailable).length
  if (props.loading) {
    return <LinearProgress />
  }
  const SourcesDropDown = (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1">
            {sourcesMessage(offlineCount)}
          </Typography>
          <Divider style={{ marginBottom: 15, marginTop: 10 }} />
          <List>
            {sources.map(source => {
              const Icon = getIcon(source)
              return (
                <ListItem key={source.sourceId}>
                  <ListItemIcon>
                    <Icon key={source.isAvailable} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography>{source.sourceId}</Typography>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </CardContent>
      </Card>
    </div>
  )

  if (error) {
    return (
      <div>
        <SnackbarRetry
          message={'Issue retrieving Local Sources, would you like to retry?'}
          onRetry={props.refetch}
          error={error}
        />
      </div>
    )
  }

  return <div>{SourcesDropDown}</div>
}
export default () => {
  const pollInterval = useSourcePollInterval(60000)

  const { loading, data = {} } = useQuery(sources, {
    pollInterval,
  })

  return <SourcesInfo loading={loading} sources={loading ? [] : data.sources} />
}
