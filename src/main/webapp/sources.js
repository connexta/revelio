import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import OnlineIcon from '@material-ui/icons/CloudDoneOutlined'
import OfflineIcon from '@material-ui/icons/OfflineBoltOutlined'

const sourcesMessage = offlineCount => {
  if (offlineCount === 0) {
    return 'All sources are currently up'
  }

  if (offlineCount === 1) {
    return '1 source is currently down'
  }

  return `${offlineCount} sources are currently down`
}

export const Sources = props => {
  const { sources } = props
  const offlineCount = sources.filter(source => !source.available).length
  const getIcon = source => (source.available ? OnlineIcon : OfflineIcon)

  return (
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
                <ListItem key={source.id}>
                  <ListItemIcon>
                    <Icon key={source.available} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography>{source.id}</Typography>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </CardContent>
      </Card>
    </div>
  )
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

const sources = gql`
  query SourcesPages {
    sources {
      available
      id
    }
  }
`

export default () => {
  const pollInterval = useSourcePollInterval(60000)

  const { loading, data = {} } = useQuery(sources, {
    pollInterval,
  })

  return <Sources sources={loading ? [] : data.sources} />
}
