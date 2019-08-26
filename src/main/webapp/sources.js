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
import React from 'react'

const sourcesMessage = offlineCount => {
  if (offlineCount === 0) {
    return 'All sources are currently up'
  }

  if (offlineCount === 1) {
    return '1 source is currently down'
  }

  return `${offlineCount} sources are currently down`
}

const Sources = props => {
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

const SourcesRoute = props => {
  const sources = [
    {
      sourceActions: [],
      available: true,
      id: 'cswFed',
      contentTypes: [],
      version: '2.0.2',
    },
    {
      sourceActions: [],
      available: false,
      id: 'ddf.distribution',
      contentTypes: [],
      version: '',
    },
  ]

  return <Sources sources={props.sources || sources} />
}

export default SourcesRoute
