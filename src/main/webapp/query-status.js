import React from 'react'

import CancelIcon from '@material-ui/icons/Cancel'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import Typography from '@material-ui/core/Typography'
import ErrorIcon from '@material-ui/icons/Error'
import Grid from '@material-ui/core/Grid'

const formatStatus = (status = 'Unknown', info = {}) => {
  if (status === 'source.canceled' || status === 'source.error') {
    return (
      <Typography variant="subtitle2" color="secondary">
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <ErrorIcon style={{ height: '0.8em' }} />
          </Grid>
          <Grid item>{info.message || status}</Grid>
        </Grid>
      </Typography>
    )
  }

  if (status === 'source.success') {
    const { hits, count, elapsed } = info
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

const Cancel = props => {
  const { onCancel } = props
  return (
    <div style={{ position: 'relative' }}>
      <IconButton
        key="cancel"
        title="Cancel"
        color="secondary"
        onClick={onCancel}
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
  )
}

const Run = props => {
  const { onRun } = props

  return (
    <IconButton key="run" title="Run" color="primary" onClick={onRun}>
      <PlayCircleFilledIcon />
    </IconButton>
  )
}

const SourceStatus = props => {
  const {
    type,
    info,
    source,

    onRun,
    onCancel,
  } = props

  return (
    <ListItem>
      <ListItemText primary={source} secondary={formatStatus(type, info)} />
      <ListItemSecondaryAction>
        {type === 'source.pending' ? (
          <Cancel onCancel={() => onCancel([source])} />
        ) : (
          <Run onRun={() => onRun([source])} />
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const QueryStatus = props => {
  const { sources = {} } = props

  return (
    <List>
      {Object.keys(sources).map(source => {
        const { type, info } = sources[source]
        return (
          <SourceStatus
            key={source}
            source={source}
            info={info}
            type={type}
            onRun={props.onRun}
            onCancel={props.onCancel}
          />
        )
      })}
    </List>
  )
}

export default QueryStatus
