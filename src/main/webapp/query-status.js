import React, { Fragment } from 'react'

import CancelIcon from '@material-ui/icons/Cancel'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import Typography from '@material-ui/core/Typography'
import ErrorIcon from '@material-ui/icons/Error'
import Grid from '@material-ui/core/Grid'

const formatStatus = (status = 'Unknown') => {
  const props = {}

  if (status === 'source.canceled' || status === 'source.error') {
    return (
      <Typography variant="subtitle2" color="secondary">
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <ErrorIcon style={{ height: '0.8em' }} />
          </Grid>
          <Grid item>{status}</Grid>
        </Grid>
      </Typography>
    )
  }

  if (status instanceof Error) {
    return (
      <Typography variant="subtitle2" color="secondary">
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <ErrorIcon style={{ height: '0.8em' }} />
          </Grid>
          <Grid item>{status.message}</Grid>
        </Grid>
      </Typography>
    )
  }

  if (status.successful) {
    const { hits, count, elapsed } = status
    return (
      <Typography variant="subtitle2" color="textSecondary">
        Available: {count}, Possible: {hits}, Time: {elapsed}
        ms
      </Typography>
    )
  }

  return (
    <Typography variant="subtitle2" color="textSecondary">
      {status}
    </Typography>
  )
}

const SourceStatus = props => {
  const {
    source,
    status,

    onRun,
    onCancel,
  } = props
  return (
    <ListItem>
      <ListItemText primary={source} secondary={formatStatus(status)} />
      <ListItemSecondaryAction>
        {status === 'source.pending' ? (
          <div style={{ position: 'relative' }}>
            <IconButton
              key="cancel"
              title="Cancel"
              color="secondary"
              onClick={() => {
                onCancel(source)
              }}
            >
              <CancelIcon />
            </IconButton>
            <div
              style={{
                zIndex: -1,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={30} />
            </div>
          </div>
        ) : (
          <IconButton
            key="run"
            title="Run"
            color="primary"
            onClick={() => {
              onRun([source])
            }}
          >
            <PlayCircleFilledIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const AllStatus = props => {
  const sources = Object.keys(props.sources).map(
    source => props.sources[source]
  )

  const pending = sources.filter(status => status === 'Pending').length
  const canceled = sources.filter(status => status === 'Canceled').length
  const completed = sources.filter(status => status.successful).length

  const status = `${pending} Pending, ${canceled} Canceled, ${completed} Completed`

  return <SourceStatus source="All Sources" status={status} />
}

const QueryStatus = props => {
  const { sources = {} } = props

  return (
    <List>
      {Object.keys(sources).map(source => {
        const status = sources[source]
        return (
          <SourceStatus
            key={source}
            source={source}
            status={status}
            onRun={props.onRun}
            onCancel={props.onCancel}
          />
        )
      })}

      {/*<Divider /><AllStatus sources={sources} />*/}
    </List>
  )
}

export default QueryStatus
